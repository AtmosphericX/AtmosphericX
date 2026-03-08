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

*/

import * as types from '../@dictionaries/types';

export const parse = (body) => {
    const structure: types.GeoJSONFeatureCollection = {
        type: `FeatureCollection`,
        features: []
    };
    for (const feature of body) {
        structure.features.push({
            type: `Feature`,
            properties: {
                name: feature.name ?? null,
                discussion: feature.forecast_discussion ?? null,
                classification: feature.classification ?? null,
                pressure: feature.pressure ?? null,
                wind_speed: feature.wind_speed_mph ?? null,
                last_updated: feature.last_update_at ? new Date(feature.last_update_at).toLocaleString() : null
            }
        });
    }
    return structure;
};

