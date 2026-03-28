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
    Discord: https://atmosphericx-discord.scriptkitty.cafe
    Ko-Fi: https://ko-fi.com/k3yomi
    Documentation: http://localhost/documentation | https://atmosphericx.scriptkitty.cafe/documentation

*/

import * as types from '../../@dictionaries/types';
import * as loader from '../..';


import * as sn_s_parser from '../../@parsing/parsing.sn.spotters';
import * as sn_r_parser from '../../@parsing/parsing.sn.reports';
import * as gibx_r_parser from '../../@parsing/parsing.gibsonx.reports';
import * as sds_o_parser from '../../@parsing/parsing.sds.outages';
import * as sds_s_parser from '../../@parsing/parsing.sds.streams';
import * as meso_d_parser from '../../@parsing/parsing.events.mesoscale';
import * as trop_d_parser from '../../@parsing/parsing.events.tropical_storms';
import * as sonde_parser from '../../@parsing/parsing.data.sonde-rise26';
import * as nwr_parser from '../../@parsing/parsing.data.weather_radio';
import * as cimss_parser from '../../@parsing/parsing.data.cimss';
import * as wsr_parser from '../../@parsing/parsing.data.icao_locations';


const cache_keys = [
    { key: 'spotter_network', cache: 'spotters', parser: sn_s_parser },
    { key: 'spotter_reports', cache: 'reports', parser: sn_r_parser },
    { key: 'grlevelx_reports', cache: 'reports', parser: gibx_r_parser },
    { key: 'sds_outages', cache: 'outages', parser: sds_o_parser },
    { key: 'sds_streams', cache: 'streams', parser: sds_s_parser },
    { key: 'mesoscale_discussions', cache: 'discussions', parser: meso_d_parser },
    { key: 'tropical_storms', cache: 'tropical_storms', parser: trop_d_parser },
    { key: 'cimss_psv3', cache: 'cimss', parser: cimss_parser },
    { key: 'sonde_rise26', cache: 'sonde', parser: sonde_parser },
    { key: 'icao_locations', cache: 'icao_locations', parser: wsr_parser },
    { key: 'weather_radio', cache: 'weather_radio', parser: nwr_parser },
];

export class Structure {
    name_space: string = `Misc.Structure`;
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
     * @function parse
     * @description
     *     Parses various data types into structured formats.
     *
     * @param {unknown} body - The raw data to be parsed.
     * @param {string} type - The type of data to be parsed.
     * @return {Promise<unknown>} - The parsed data.
     */
     private async parse(body?: unknown, type?: string): Promise<unknown> {
         try {
             const redirect = cache_keys.find(d => d.key === type);
             if (!redirect) return [];
             if (!redirect.parser?.parse) { return []; }
             return await redirect.parser.parse(body as any);
         } catch (error) {
             loader.modules.utilities.exception(error, this.name_space + `.parse`);
             return [];
         }
     }
 
    /**
     * @public
     * @production
     * @error_handling
     * @function register
     * @description
     *     This function is responsible for registering an event with client-specific properties.
     *     It determines the appropriate metadata, theme, and sound effects based on configurations and event attributes.
     * 
     * @param {types.EventType} event - The event to be registered.
     * @return {types.EventType} - The registered event with client properties.
     */
    public register(event: types.EventType): types.EventType {
        try {
            const configurations = loader.modules.utilities.cfg();
            const name = event?.properties?.event;
            const isPriority = configurations?.filters?.priority_events.some(e => e.toLowerCase() === name.toLowerCase());
            const isBeepAuthorizedOnly = configurations?.filters?.sfx_beep_only;
            const isShowingUpdatesAllowed = configurations?.filters?.show_updates;
            const isBeepOnly = isBeepAuthorizedOnly && !isPriority;
            const isIgnored = !isShowingUpdatesAllowed && !isPriority && !event?.properties?.is_issued;
            const theme = configurations?.themes?.[event?.properties?.event]
                ?? configurations?.themes?.[event?.properties?.parent]
                ?? configurations?.themes?.[`Default`];
            event.properties.imported = { 
                ignored: isIgnored,
                beep_only: isBeepOnly,
                theme: theme
            }
            return event;
        } catch (error) {
            loader.modules.utilities.exception(error, this.name_space + `.register`);
            return event;
        }
    }

    /**
     * @public
     * @production
     * @error_handling
     * @function structure
     * @description
     *      This function is responsible for structuring incoming data into the appropriate cache formats.
     *      It parses various data types and updates the cache accordingly.
     * 
     * @param {unknown} data - The incoming data to be structured.
     * @return {Promise<void>} - A promise that resolves when the structuring is complete.
     */
    public async structure(data: unknown): Promise<void> {
        try {
            const clean = loader.modules.utilities.sanatizeWeb(data);
            if (typeof clean !== "object" || clean === null) return; 
            for (const { key, cache } of cache_keys) {
                const value = (clean as string)[key];
                if (value !== undefined) { loader.cache.external[cache] = await this.parse(value, key); }
            }
            if (loader.modules.atmsxparser.mgr == null) {
                loader.modules.atmsxparser.listener();
                await loader.modules.utilities.sleep(500);
            }
            const randomEvent = loader.cache.external.random_event;
            const randomPulsePoint = loader.cache.external.random_pulsepoint;
            if (!randomEvent?.features || randomEvent.features.length === 0) {
                loader.modules.atmsxparser.initRandomService();
            }
            if (randomPulsePoint?.features == null || randomPulsePoint.features.length === 0) {
                loader.modules.atmsxpulsepoint.initRandomService();
            }
            loader.modules.atmsxparser.listener(true);
            loader.modules.websockets.sendUpdateToClients();
        } catch (error) {
            loader.modules.utilities.exception(error, this.name_space + `.structure`);
        }
    }
}


export default Structure;