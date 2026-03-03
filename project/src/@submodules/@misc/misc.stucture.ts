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

import * as mesoscaleDiscussions from '../../@parsing/parsing.discussions';
import * as tropicalStorms from '../../@parsing/parsing.tropical-storms';
import * as spotterNetwork from '../../@parsing/parsing.spotters';
import * as spotterReports from '../../@parsing/parsing.spotters-reports';
import * as wxEye from '../../@parsing/parsing.sonde-wxeye';
import * as wxRadio from '../../@parsing/parsing.radio';
import * as svrProbabilties from '../../@parsing/parsing.probabilities';
import * as nexradRadars from '../../@parsing/parsing.nexrad-radars';
import * as gibsonReports from '../../@parsing/parsing.gibson-reports';
import * as powerOutages from '../../@parsing/parsing.outages';
import * as iotStreams from '../../@parsing/parsing.iot-devices';

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
            switch (type) {
                case 'spotter_network': { return await spotterNetwork.parse(body as Record<string, string>); }
                case 'spotter_reports': { return await spotterReports.parse(body as Record<string, string>); }
                case 'iot_streams': { return await iotStreams.parse(body as Record<string, string>); }
                case 'power_outages': { return await powerOutages.parse(body as Record<string, string>); }
                case 'grlevelx_reports': { return await gibsonReports.parse(body as string); }
                case 'mesoscale_discussions': { return await mesoscaleDiscussions.parse(body as string); }
                case 'tropical_storm_tracks': { return await tropicalStorms.parse(body as string); }
                case 'tornado': { return await svrProbabilties.parse(body as string, 'tornado'); }
                case 'severe': { return await svrProbabilties.parse(body as string, 'severe'); }
                case 'sonde_project_weather_eye': { return await wxEye.parse(body as string); }
                case 'nexrad_radars': { return await nexradRadars.parse(body as string); }
                case 'wx_radio': { return await wxRadio.parse(body as string); }
                default: return [];
            }
        } catch (error) {
            loader.modules.utilities.exception(error, this.name_space + `.parse`);
        }
    }

    /**
     * @private
     * @production
     * @error_handling
     * @function metadata
     * @description
     *     This function is responsible for retrieving metadata for events based on configurations.
     *     It determines the appropriate theme and sound effects for the event.
     * 
     * @param {types.EventType} event - The event to retrieve metadata for.
     * @return {{sfx: string, theme: types.ThemeType, metadata: types.EventMetadataType}} - The event metadata.
     */
    private metadata(event: types.EventType | types.PulsePointFeatures) {
        try {
            const configurations = loader.modules.utilities.cfg();
            const theme = configurations.themes[event?.properties?.event]
                ?? configurations.themes[event?.properties?.parent]
                ?? configurations.themes[`Default`];
            const dictionary = configurations.dictionary[event?.properties?.event]
                ?? configurations.dictionary[event?.properties?.parent]
                ?? (event.properties?.hash == null ? configurations.dictionary[`Pulse Point`] :
                configurations.dictionary[`Special Event`]);
            let sfx = dictionary.sfx_cancel;
            if (event.properties.is_issued) sfx = dictionary.sfx_issued;
            else if (event.properties.is_updated) sfx = dictionary.sfx_update;
            else if (event.properties.is_cancelled) sfx = dictionary.sfx_cancel;
            return { 
                sfx,
                theme,
                metadata: dictionary.metadata,
                tts: dictionary.sfx_tts,
                tts_format: dictionary.sfx_tts_format
            }
        } catch (error) {
            loader.modules.utilities.exception(error, this.name_space + `.metadata`);
            return {
                sfx: ``,
                theme: { background: `#000000`, border: `#FFFFFF`, text: `#FFFFFF` },
                metadata: { priority: 0, description: `No description available.` }
            };
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
    public register(event: types.EventType) {
        try {
            const configurations = loader.modules.utilities.cfg();
            const name = event.properties.event;
            const __metadata = this.metadata(event);
            const isPriority = configurations.filters.priority_events.some(e => e.toLowerCase() === name.toLowerCase());
            const isBeepAuthorizedOnly = configurations.filters.sfx_beep_only;
            const isShowingUpdatesAllowed = configurations.filters.show_updates;
            const isBeepOnly = isBeepAuthorizedOnly && !isPriority;
            const isIgnored = !isShowingUpdatesAllowed && !isPriority && !event.properties.is_issued;
            event.properties.client = {
                metadata: __metadata.metadata,
                theme: __metadata.theme,
                sfx: isBeepOnly ? configurations.tones.sfx_beep : __metadata.sfx,
                sfx_tts: __metadata.tts,
                sfx_tts_format: __metadata.tts_format,
                ignored: isIgnored,
                only_beep: isBeepOnly
            };
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
            for (const { key, cache } of loader.statics.default_redirects) {
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