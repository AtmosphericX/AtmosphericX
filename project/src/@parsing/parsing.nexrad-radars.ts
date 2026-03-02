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
    Discord: https://discord.gg/YAEjtzU3E8
    Ko-Fi: https://ko-fi.com/k3yomi
    Documentation: http://localhost/docs | https://atmosx-secondary.scriptkitty.cafe/docs

*/

import * as types from '../@dictionaries/types';

export const parse = (body) => {
    const structure: types.GeoJSONFeatureCollection = {
        type: `FeatureCollection`,
        features: []
    };
    if (Array.isArray(body?.features)) { 
        for (const feature of body.features) {
            const coordinates = feature?.geometry?.coordinates;
            const icao = feature?.properties?.id ?? feature?.id ?? feature?.properties?.['@id'];
            const lon = coordinates?.[0] ?? null;
            const lat = coordinates?.[1] ?? null;
            if (isNaN(lon) || isNaN(lat)) continue;
            if (!icao.startsWith('K') && !icao.startsWith('P') && !icao.startsWith('C')) continue;
            structure.features.push({
                type: `Feature`,
                geometry: {
                    type: `Point`,
                    coordinates: [lon, lat]
                },
                properties: {
                    id: icao,
                }
            });
        }
    }
    return structure;
};

