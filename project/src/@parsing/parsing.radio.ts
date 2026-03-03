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

import * as types from '../@dictionaries/types';

export const parse = (body) => {
    const structure: types.GeoJSONFeatureCollection = {
        type: `FeatureCollection`,
        features: []
    };
    if (Array.isArray(body?.sources)) { 
        for (const feature of body.sources) {
            if (isNaN(feature.lon) || isNaN(feature.lat)) continue;
            structure.features.push({
                type: `Feature`,
                geometry: {
                    type: `Point`,
                    coordinates: [feature.lon, feature.lat]
                },
                properties: {
                    location: feature?.location ?? `N/A`,
                    callsign: feature?.callsign ?? `N/A`,
                    frequency: feature?.frequency ?? `N/A`,
                    stream_url: feature?.listen_url ?? null
                }
            });
        }
    }
    return structure;
};

