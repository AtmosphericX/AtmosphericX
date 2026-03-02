/*
              _                             _               _     __   __
         /\  | |                           | |             (_)    \ \ / /
        /  \ | |_ _ __ ___   ___  ___ _ __ | |__   ___ _ __ _  ___ \ V / 
       / /\ \| __| '_ ` _ \ / _ \/ __| '_ \| '_ \ / _ \ '__| |/ __| > <  
      / ____ \ |_| | | | | | (_) \__ \ |_) | | | |  __/ |  | | (__ / . \ 
     /_/    \_\__|_| |_| |_|\___/|___/ .__/|_| |_|\___|_|  |_|\___/_/ \_\
                                     | |                            
                                     |_|                                                                                                                

    Created with ♥ by the AtmosphericX Team (KiyoWx, StarflightWx, Everwatch1, & CJ Ziegler)
    Discord: https://atmosphericx-discord.scriptktity.cafe
    Ko-Fi: https://ko-fi.com/k3yomi
    Documentation: http://localhost/documentation | https://atmosphericx.scriptkitty.cafe/documentation

*/

import * as types from '../../@dictionaries/types';
import * as loader from '../..';

export class Calling {
    name_space: string = `Utility.Http`;
    ansi_colors = loader.modules.utilities.ansi_colors;
    constructor() {
        loader.modules.utilities.log({ 
            title: `${this.ansi_colors.GREEN}${this.name_space}${this.ansi_colors.RESET}`, 
            message: `Successfully initialized`
        });
    }

    /**
     * @private
     * @production
     * @error_handling
     * @function buildStructure
     * @description
     *    Builds a cache structure from the provided sources.
     * 
     * @param {Record<string, Record<string, any>>} sources - The sources to build the structure from.
     * @returns {types.CacheStructure[]} - The constructed cache structure.
     */
    private buildStructure(sources: Record<string, Record<string, any>>): types.CacheStructure[] {
        try {
            const structure: types.CacheStructure[] = [];
            for (const sourceKey in sources) {
                const endpoints = sources[sourceKey];
                for (const [name, config] of Object.entries(endpoints)) {
                    structure.push({
                        name,
                        url: config.endpoint,
                        enabled: Boolean(config.enabled),
                        cache: config.cache_time,
                        contradictions: Array.isArray(config.contradictions) ? config.contradictions : [],
                        options: config.options || {},
                    });
                }
            }
            return structure;
        } catch (error) {
            loader.modules.utilities.exception(error, this.name_space + `.buildStructure`);
            return [];
        }
    }

    /**
     * @private
     * @production
     * @error_handling
     * @function getContradictions
     * @description
     *    Identifies and handles contradictory sources in the cache structure.
     * 
     * @param {types.CacheStructure[]} structure - The cache structure to analyze.
     * @returns {void}
     */
    private getContradictions(structure: types.CacheStructure[]): types.CacheStructure[] {
        try {
            for (const source of structure) {
                if (!source.enabled) continue;
                for (const contradiction of source.contradictions) {
                    const target = structure.find(s => s.name === contradiction && s.enabled);
                    if (target) {
                        loader.modules.utilities.log({
                            title: `${this.ansi_colors.YELLOW}[CONFIG]${this.ansi_colors.RESET}`,
                            message: `Disabling contradictory source '${target.name}' as '${source.name}' is enabled.`
                        });
                        target.enabled = false;
                        structure.splice(structure.indexOf(target), 1);
                        continue;
                    }
                }
            }
            return structure;
        } catch (error) {
            loader.modules.utilities.exception(error, this.name_space + `.getContradictions`);
            return structure;
        }
    }

    /**
     * @private
     * @production
     * @error_handling
     * @function getDataFromSource
     * @description
     *    Fetches data from a specified URL and handles errors.
     *
     * @param {string} url - The URL to fetch data from.
     * @param {{ headers?: Record<string, string> | string }} [settings] - Optional headers object or header string.
     * @returns {Promise<{ error: boolean; message: string }>} - The result of the fetch operation.
     */
    private async getDataFromSource(url: string, settings?: any): Promise<{ error: boolean; message: string }> {
        try {
            let options = {
                headers: { 'User-Agent': `AtmosphericX-Agent/${loader.cache.external.version}` }
            }
            if (settings?.headers) { options.headers = { ...options.headers, ...settings.headers }; }
            if (settings?.method) { options['method'] = settings.method; }
            if (settings?.body) { options['body'] = settings.body; }
            const response = await loader.modules.utilities.httpRequest(url, options);
            if (response?.error) {
                return { error: true, message: `Error fetching data from ${url} with message: ${response.message}`,  };
            }
            return { error: false, message: response?.message ?? response, };
        } catch (error) {
            loader.modules.utilities.exception(error, this.name_space + `.getDataFromSource`);
            return { error: true, message: `Exception fetching data from ${url}`,  };
        }
    }

    /**
     * @public
     * @production
     * @error_handling
     * @function fetchCacheData
     * @description
     *    Fetches and updates cache data from configured sources.
     *
     * @param {boolean} [isEventUpdate=false] - Indicates if the fetch is for event updates only.
     * @returns {Promise<void>} - A promise that resolves when the data fetching is complete.
     */
    public async fetchCacheData(isEventUpdate?: boolean): Promise<void> {
        try {
            loader.modules.utilities.configurations();
            const cfg = loader.modules.utilities.cfg();
            const clock = Date.now();
            const tick = performance.now();
            loader.cache.external.hashes = loader.cache.external.hashes.filter(h => {
                if (!h) return false;
                const exp = new Date(h.expires).getTime();
                return Number.isFinite(exp) && exp > clock;
            });
            loader.cache.external.events.features = loader.cache.external.events.features
                .filter(f => f && !f.properties.client.ignored)
                .filter(f => {
                    const exp = new Date(f.properties.expires).getTime();
                    return Number.isFinite(exp) && exp > clock;
                })
                .filter(f => {
                    if (cfg.filters.all_events) return true;
                    return cfg.filters.listening_events.includes(f.properties.event);
                });
            const { atmosx_parser_settings, ...sources } = cfg.sources;
            await loader.modules.utilities.sleep(200);
            const data: Record<string, string> = {};
            const status: string[] = [];
            if (!isEventUpdate) {
                const structure = this.buildStructure(sources);
                const contradictions = this.getContradictions(structure);
                const enabled = contradictions.filter(s => s.enabled && s.url);
                for (const source of enabled) {
                    const lastFetched = loader.cache.internal.cache_timers[source.name] ?? 0;
                    if (clock - lastFetched <= source.cache * 1000) continue;
                    loader.cache.internal.cache_timers[source.name] = clock;
                    let success = false;
                    for (let attempt = 1; attempt <= 3; attempt++) {
                        const response = await this.getDataFromSource(source.url, source?.options);
                        if (!response.error) {
                            data[source.name] = response.message;
                            status.push(`(${this.ansi_colors.GREEN}OK${this.ansi_colors.RESET}) ${source.name.toUpperCase()}`);
                            success = true;
                            loader.cache.internal.metrics.total_requests++;
                            break;
                        }
                        loader.modules.utilities.log({
                            title: `${this.ansi_colors.RED}Utility.Http${this.ansi_colors.RESET}`,
                            message: `Attempt ${attempt} failed for ${source.name}: ${response.message}`,
                        });
                    }
                    if (!success) {
                        data[source.name] = undefined;
                        status.push(`(${this.ansi_colors.RED}ERR${this.ansi_colors.RESET}) ${source.name.toUpperCase()}`);
                    }
                }
            } else {
                if (cfg.sources.atmosx_parser_settings.noaa_weather_wire_service) return;
                const lastFetched = loader.cache.internal.cache_timers["NWS"] ?? 0;
                if (clock - lastFetched <= atmosx_parser_settings.national_weather_service_settings.interval * 1000) return;
                loader.cache.internal.cache_timers["NWS"] = clock;
                loader.cache.internal.metrics.total_requests++;
                status.push(`(${this.ansi_colors.GREEN}OK${this.ansi_colors.RESET}) NWS`);
            }
            data["events"] = loader.cache.external.events.features;
            if (status.length > 0) {
                loader.modules.utilities.log({
                    title: `${this.ansi_colors.GREEN}${Math.round(performance.now() - tick)}ms${this.ansi_colors.RESET}`,
                    message: status.join(", "),
                });
            }
            loader.modules.structure.structure(data);
        } catch (error) {
            loader.modules.utilities.exception(error, this.name_space + `.fetchCacheData`);
        }
    }
}


export default Calling;