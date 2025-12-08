/*
              _                             _               _     __   __
         /\  | |                           | |             (_)    \ \ / /
        /  \ | |_ _ __ ___   ___  ___ _ __ | |__   ___ _ __ _  ___ \ V / 
       / /\ \| __| '_ ` _ \ / _ \/ __| '_ \| '_ \ / _ \ '__| |/ __| > <  
      / ____ \ |_| | | | | | (_) \__ \ |_) | | | |  __/ |  | | (__ / . \ 
     /_/    \_\__|_| |_| |_|\___/|___/ .__/|_| |_|\___|_|  |_|\___/_/ \_\
                                     | |                                 
                                     |_|                                                                                                                
    
    Written by: KiyoWx (k3yomi) & StarflightWx      

*/


import * as loader from '../../bootstrap';
import * as types from '../../types';

export class Alerts { 
    NAME_SPACE: string = `submodule:networking`;
    constructor() {
        loader.submodules.utils.log(`${this.NAME_SPACE} initialized.`)
        this.getUpdates();
    }
    
    /**
     * @function buildSourceStructure
     * @description
     *     Converts a raw sources object into a typed array of CacheStructure objects.
     * 
     * @param {any} sources
     * @returns {types.CacheStructure[]}
     */
    private buildSourceStructure(sources: any): types.CacheStructure[] {
        const structure: types.CacheStructure[] = [];
        for (const source in sources) {
            for (const [key, value] of Object.entries(sources[source])) {
                const source = value as Record<string, any>;
                structure.push({
                    name: key,
                    url: source.endpoint,
                    enabled: source.enabled,
                    cache: source.cache_time,
                    contradictions: source.contradictions ?? [],
                });
            }
        }
        return structure;
    }

    /**
     * @function resolveContradictions
     * @description
     *     Processes a CacheStructure array and disables sources based on contradictions.
     * 
     * @param {types.CacheStructure[]} structure
     * @returns {void}
     */
    private resolveContradictions(structure: types.CacheStructure[]): void {
        for (const source of structure.filter(s => s.enabled)) {
            for (const contradiction of source.contradictions) {
                const index = structure.findIndex(s => s.name === contradiction);
                if (index !== -1 && structure[index].enabled) {
                    loader.submodules.utils.log(`Evoking contradiction: ${source.name} disables ${structure[index].name}`, { echoFile: true });
                    structure[index].enabled = false;
                }
            }
        }
    }

    /**
     * @function getDataFromSource
     * @description
     *     Fetches data from a given URL and returns an object indicating success or error.
     * 
     * @param {string} url
     * @returns {Promise<{ error: boolean; message: any }>}
     */
    private async getDataFromSource(url: string): Promise<{ error: boolean; message: any }> {
        try {
            const response = await this.httpRequest(url);
            if (response?.error) {
                return { error: true, message: `Error fetching data from ${url}`, };
            }
            return { error: false, message: response?.message ?? response, };
        } catch (error) {
            return { error: true, message: `Exception fetching data from ${url}: ${(error as Error).message ?? error}`, };
        }
    }

    /**
     * @function httpRequest
     * @description
     *     Performs an HTTP GET request to the specified URL with optional custom options.
     * 
     * @param {string} url
     * @param {types.HTTPOptions} [options]
     * @returns {Promise<any>}
     */
    public httpRequest(url: string, options?: types.HTTPOptions): Promise<any> {
        return new Promise(async (resolve) => {
            try { 
                const config = loader.cache.internal.configurations as types.ConfigurationsType;
                const isOptionsProvided = options !== undefined;
                if (!isOptionsProvided) {
                    options = {
                        timeout: config.internal_settings.request_timeout * 1_000,
                        headers: {
                            "User-Agent": `AtmosphericX/${loader.submodules.utils.version()}`,
                            "Accept": "application/geo+json, text/plain, */*; q=0.",
                            "Accept-Language": "en-US,en;q=0.9",
                            "Accept-Encoding": "gzip, deflate, br",
                        },
                        method: 'GET',
                        body: null,
                    }
                }
                const response = await loader.packages.axios.get(url, {
                    headers: options.headers,
                    maxRedirects: 0,
                    timeout: options.timeout,
                    httpsAgent: new loader.packages.https.Agent({ rejectUnauthorized: false }),
                    validateStatus: (status: number) => status == 200 || status == 500,
                });
                const { data: responseMessage } = response;
                return resolve({message: responseMessage, error: false});
            } catch (error) {
                return resolve({message: error, error: true});
            }
        });
    }

    /**
     * @function getUpdates
     * @description
     *     Checks the online repository for the latest version and changelogs.
     *     Updates cache and logs messages if a newer version is discovered.
     * 
     * @returns {Promise<{error: boolean, message: string}>}
     */
    public getUpdates(): Promise<{error: boolean, message: string}> {
        return new Promise(async (resolve) => {
            const onlineVersion = await this.httpRequest(`https://raw.githubusercontent.com/k3yomi/AtmosphericX/main/version`, undefined)
            const onlineChangelogs = await this.httpRequest(`https://raw.githubusercontent.com/k3yomi/AtmosphericX/main/changelogs-history.json`, undefined)
            const offlineVersion = loader.submodules.utils.version();
            if (onlineVersion.error == true || onlineChangelogs.error == true) { loader.submodules.utils.log(loader.strings.updated_required_failed, {echoFile: true}); return resolve({error: true, message: `Failed to check for updates.`}); }
            const onlineVersionParsed = onlineVersion.message.replace(/\n/g, ``);
            const onlineChangelogsParsed = onlineChangelogs.message[onlineVersion] 
                ? onlineChangelogs.message[onlineVersionParsed].changelogs.join(`\n\t`) : `No changelogs available.`;
            loader.cache.external.version = offlineVersion;
            loader.cache.external.changelogs = onlineChangelogsParsed;
            const isNewerVersionDiscovered = (a: string, b: string) => {
                const [ma, mi, pa] = a.split(".").map(Number);
                const [mb, mi2, pb] = b.split(".").map(Number);
                return ma > mb || (ma === mb && mi > mi2) || (ma === mb && mi === mi2 && pa > pb);
            }
            if (isNewerVersionDiscovered(onlineVersionParsed, offlineVersion)) {
                loader.submodules.utils.log(loader.strings.updated_requied.replace(`{ONLINE_PARSED}`, onlineVersionParsed).replace(`{OFFLINE_VERSION}`, offlineVersion).replace(`{ONLINE_CHANGELOGS}`, onlineChangelogsParsed), {echoFile: true});
            }
            return {error: false, message: `Update check completed.`};
        });
    }

    /**
     * @function sendWebhook
     * @description
     *     Sends a Discord webhook message with a title and body, respecting cooldowns
     *     and truncating messages that are too long.
     * 
     * @param {string} title
     * @param {string} body
     * @param {types.WebhookSettings} settings
     * @returns {Promise<void>}
     */
    public async sendWebhook(title: string, body: string, settings: types.WebhookSettings): Promise<void> {
        if (!settings.enabled) { return }
        const time = Date.now();
        loader.cache.internal.limiters = loader.cache.internal.limiters.filter(ts => ts.timestamp > time - settings.webhook_cooldown * 1_000);
        if (loader.cache.internal.limiters.filter(ts => ts.type == title).length >= 3) {
            return;
        }
        if (body.length > 1900) {
            body = body.substring(0, 1900) + "\n\n[Message truncated due to length]";
            if (body.split("```").length % 2 == 0) { body += "```"; }
        }
        const embed = { title, description: body, color: 16711680, timestamp: new Date().toISOString(), footer: { text: title } };
        try { 
            await loader.packages.axios.post(settings.discord_webhook || ``, {
                username: settings.webhook_display || `AtmosphericX Alerts`,
                content: settings.content || ``,
                embeds: [embed],
            });
            loader.cache.internal.limiters.push({ type: title, timestamp: time });
            return
        } catch (error) {}
    }

    /**
     * @function updateCache
     * @description
     *     Updates internal and external cache, fetching data from sources, resolving contradictions,
     *     and optionally updating alerts. Logs fetch results and updates the structured cache.
     * 
     * @param {boolean} [isAlertUpdate]
     * @returns {Promise<void>}
     */
    public async updateCache(isAlertUpdate?: boolean): Promise<void> {
        loader.submodules.utils.configurations();
        const ConfigType = loader.cache.internal.configurations as types.ConfigurationsType;
        const ExternalType = loader.cache.external as types.ExternalType;
        ExternalType.hashes = ExternalType.hashes.filter(e => e !== undefined && new Date(e.expires).getTime() > new Date().getTime())
        ExternalType.events = { features: ExternalType.events?.features
            .filter(f => f !== undefined && new Date(f.event.properties.expires).getTime() > new Date().getTime())
            .filter(f => {
                if (ConfigType.filters.all_events) return true;
                return ConfigType.filters.listening_events.includes(f.event.properties.event);
            })
        };
        loader.submodules.alerts.instance(true);
        await loader.submodules.utils.sleep(200);
        let data = {}
        let stringText = ``
        const setTime = Date.now();
        const { atmosx_parser_settings, ...sources } = ConfigType.sources;
        if (!isAlertUpdate) { 
            const structure = this.buildSourceStructure(sources);
            this.resolveContradictions(structure);
            const activeSources = structure.filter(s => s.enabled && s.url != null);
            await Promise.all(activeSources.map(async source => {
                const lastFetched = loader.cache.internal.http_timers[source.name] ?? 0;
                if (setTime - lastFetched <= source.cache * 1_000) return;
                loader.cache.internal.http_timers[source.name] = setTime;
                for (let attempt = 0; attempt < 3; attempt++) {
                    const response = await this.getDataFromSource(source.url);
                    if (!response.error) {
                        data[source.name] = response.message;
                        stringText += `(OK) ${source.name.toUpperCase()}, `
                        break;
                    } else { 
                        loader.submodules.utils.log(`Error fetching data from ${source.name.toUpperCase()} (${attempt + 1}/3)`, { echoFile: true });
                        if (attempt === 2) {
                            data[source.name] = undefined;
                            stringText += `(ERR) ${source.name.toUpperCase()}, `
                        }
                    }
                }})
            )
        }
        if (isAlertUpdate) {
            if (!atmosx_parser_settings.noaa_weather_wire_service) {
                const lastFetched = loader.cache.internal.http_timers[`NWS`] ?? 0;
                if (setTime - lastFetched <= atmosx_parser_settings.national_weather_service_settings.interval * 1_000) return;
                loader.cache.internal.http_timers[`NWS`] = setTime;
                stringText += `(OK) NWS, `
            }   
        }
        data["events"] = loader.cache.external.events.features;
        if (stringText.length > 0) {
            loader.submodules.utils.log(`Cache Updated: - Taken: ${Date.now() - setTime}ms - ${stringText.slice(0, -2)}`)
        }
        loader.submodules.structure.create(data);
    }
}

export default Alerts;

