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
    NAME_SPACE: string = `submodule:pulsepoint`;
    PACKAGE: typeof loader.packages.PulsePoint
    MANAGER: any;
    constructor() {
        this.PACKAGE = loader.packages.PulsePoint;
        loader.submodules.utils.log(`${this.NAME_SPACE} initialized.`)
        const ConfigType = loader.cache.internal.configurations as types.ConfigurationsType;
        if (!ConfigType.sources.miscellaneous_settings.pulse_point.enabled) { return }
        const pulse = new this.PACKAGE({
            key: ConfigType.sources.miscellaneous_settings.pulse_point.key,
            interval: ConfigType.sources.miscellaneous_settings.pulse_point.interval,
            journal: false,
            filtering: {
                events: ConfigType.sources.miscellaneous_settings.pulse_point.events,
                agencies: ConfigType.sources.miscellaneous_settings.pulse_point.agencies,
            }
        });
        pulse.on(`onIncidentUpdate`, (event) => {
            const emergencies = loader.cache.external.emergencies
            const index = emergencies ? emergencies.features.findIndex((f: any) => f.properties.ID === event.properties.ID) : -1;
            if (index === -1) { emergencies.features.push(event); } else { emergencies[index] = event; }
            loader.submodules.utils.log(
                `PulsePoint Incident Update: ${(event.properties.type) ?? 'Unknown Type'}`,
                { title: `\x1b[33m[ATMOSX-PULSEPOINT]\x1b[0m` }
            );
            loader.submodules.streaming.sendChatMessage(`${event.properties.agency} - ${event.properties.type} reported at ${event.properties.address || 'Unknown Location'} (x${event.properties.units.length})`, `pulse_point`);
        });
        pulse.on(`log`, (message: string) => { loader.submodules.utils.log(message, { title: `\x1b[33m[ATMOSX-PULSEPOINT]\x1b[0m` }); });
    }

}

export default Alerts;

