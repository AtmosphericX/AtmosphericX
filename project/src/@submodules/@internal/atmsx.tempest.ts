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

import * as loader from '../..';
import { getConfigurations } from '../../@dictionaries/@configurations/atmsx-tempest';
import { parse } from '../../@parsing/parsing.weather-station';

export class ATMSXTempest {
    name_space: string = `Internal.Atmsx.Tempest`;
    ansi_colors = loader.modules.utilities.ansi_colors;
    pkg = loader.packages.TempestStation;
    mgr = null;
    DATA: Record<string, any> = {
        forecast: null,
        observation: null,
        rapid_wind: null,
        lightning: null
    }
    constructor() {
        loader.modules.utilities.log({ 
            title: `${this.ansi_colors.GREEN}${this.name_space}${this.ansi_colors.RESET}`, 
            message: `Successfully initialized`
        });
        this.listener();
    }

    /**
     * @private
     * @production
     * @error_handling
     * @function listener
     * @description 
     *      This function is responsible for setting up event listeners for the Tempest Station.
     *      It sets up listeners for various events such as `onObservation`, `onForecast`, `onRapidWind`, `onLightning`, and `log`.
     *      It also initializes the `DATA` object to store the data received from the Tempest Station.
     * 
     * @returns {void}
     */
    private async listener(): Promise<void> {
        try {
            const settings = getConfigurations()
            if (settings == null) { return; }
            this.mgr = loader.cache.handlers.tempest_client = new this.pkg(settings)
            this.mgr.on(`onObservation`, async (event) => {
                this.DATA.observation = event;
                const forecast = this.DATA?.forecast?.features?.[0];
                const rapid = this.DATA?.rapid_wind?.features?.[0];
                loader.cache.external.mesonet.features = parse({
                    longitude: forecast?.geometry?.coordinates?.[1] ?? null,
                    latitude: forecast?.geometry?.coordinates?.[0] ?? null,
                    temperature: forecast?.properties?.temperature ?? null,
                    dewpoint: forecast?.properties?.dew_point ?? null,
                    humidity: forecast?.properties?.humidity ?? null,
                    wind_speed: rapid?.properties?.speed ?? null,
                    wind_direction: rapid?.properties?.direction ?? null,
                    conditions: forecast?.properties?.conditions ?? null,
                    location: forecast?.properties?.station_name ?? null,
                });
                const string = loader.strings.streamer_bot_mesonet_update
                    .replace(`{CONDITIONS}`, forecast?.properties?.conditions ?? '--')
                    .replace(`{TEMPERATURE}`, forecast?.properties?.temperature ?? '--')
                    .replace(`{DEW_POINT}`, forecast?.properties?.dew_point ?? '--')
                    .replace(`{HUMIDITY}`, forecast?.properties?.humidity ?? '--')
                    .replace(`{WIND}`, rapid?.properties?.speed ?? '--');
                loader.modules.utilities.log({ 
                    title: `${this.ansi_colors.YELLOW}Tempest${this.ansi_colors.RESET}`,
                    message: `[${this.ansi_colors.MAGENTA}OBS${this.ansi_colors.RESET}] ${string}`
                });
                await loader.modules.streaming.chatStreamerBot(string, `onMesonet`);
                loader.modules.websockets.sendUpdateToClients();
            });
            this.mgr.on(`onForecast`, (event) => {
                this.DATA.forecast = event;
            });
            this.mgr.on(`onRapidWind`, (event) => {
                this.DATA.rapid_wind = event;
            });
            this.mgr.on(`onLightning`, (event) => {
                this.DATA.lightning = event;
            });
            this.mgr.on(`log`, (event) => {
                loader.modules.utilities.log({ 
                    title: `${this.ansi_colors.YELLOW}Tempest${this.ansi_colors.RESET}`, 
                    message: event
                });
            });
        } catch (error) {
            loader.modules.utilities.exception(error, this.name_space + `.listener`);
        }
    }
}


export default ATMSXTempest;