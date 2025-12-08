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
    NAME_SPACE: string = `submodule:tempest`;
    PACKAGE: typeof loader.packages.TempestStation
    DEF_KEY: string = `6bff2f89-84ab-463c-886e-fc0f443da4cf`;
    DATA: any = {forecast: null, observation: null, rapidWind: null, lightning: null};
    MANAGER: any;
    constructor() {
        this.PACKAGE = loader.packages.TempestStation;
        loader.submodules.utils.log(`${this.NAME_SPACE} initialized.`)
        const config = loader.cache.internal.configurations as types.ConfigurationsType;
        const tempest = config.sources?.miscellaneous_settings?.tempest_station;
        if (!tempest?.enabled) { return; }
        this.MANAGER = new this.PACKAGE({
            api: this.DEF_KEY, deviceId: tempest.device,
            stationId: tempest.station, journal: false,
        });
        this.MANAGER.on(`onObservation`, async (data) => { 
            this.DATA.observation = data;
            const forecast = this.DATA?.forecast?.features?.[0];
            const rapid = this.DATA?.rapidWind?.features?.[0];
            loader.cache.external.mesonet = loader.submodules.parsing.getWeatherStationStructure({
                longitude: forecast?.geometry?.coordinates?.[1] ?? null,
                latitude: forecast?.geometry?.coordinates?.[0] ?? null,
                temperature: forecast?.properties?.temperature ?? null,
                dewpoints: forecast?.properties?.dew_point ?? null,
                humidity: forecast?.properties?.humidity ?? null,
                wind_speed: rapid?.properties?.speed ?? null,
                wind_direction: rapid?.properties?.direction ?? null,
                conditions: forecast?.properties?.conditions ?? null,
                location: forecast?.properties?.station_name ?? null,
            });
            await loader.submodules.streaming.sendChatMessage(`Current Conditions: ${forecast?.properties?.conditions ?? 'N/A'}, Temp: ${forecast?.properties?.temperature ?? 'N/A'}°F, Dew Point: ${forecast?.properties?.dew_point ?? 'N/A'}°F, Humidity: ${forecast?.properties?.humidity ?? 'N/A'}%, Wind: ${rapid?.properties?.speed ?? 'N/A'} mph`, `mesonet`);
        });
        this.MANAGER.on(`onForecast`, (data) => { this.DATA.forecast = data; });
        this.MANAGER.on(`onRapidWind`, (data) => { this.DATA.rapidWind = data; });
        this.MANAGER.on(`onLightning`, (data) => { this.DATA.lightning = data; });
        this.MANAGER.on(`log`, (message: string) => { 
            loader.submodules.utils.log(message, { title: `\x1b[33m[ATMOSX-TEMPEST]\x1b[0m` }); 
        });
        loader.cache.handlers.tempestStation = this.MANAGER;
    }
}

export default Alerts;

