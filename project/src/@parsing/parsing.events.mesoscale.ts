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
import * as loader from '..';


type LocalSPCDiscussionProperties = { 
    text: string; 
    expires_at_ms: number; 
    number: number; 
    issued_at_ms: number; 
    tags: Record<string, string[]>; 
    population: Record<string, string> 
}

type SPCDiscussionTypes = { 
    coordinates: Record<number, number>; 
    properties: LocalSPCDiscussionProperties; 
}

export const parse = (body: Record<string, string>[]) => {
    const structure: types.GeoJSONFeatureCollection = {
        type: 'FeatureCollection',
        features: []
    };
    loader.packages.PlacefileManager.parseGeoJSON(body).then(parsed => {
        parsed as SPCDiscussionTypes[];
        for (const feature of parsed) {
            if (!feature.properties || !feature.coordinates) continue;
            if (feature.properties.expires_at_ms < Date.now()) continue;
            const torIntensity = loader.packages.TextParser.textProductToString(feature.properties.text, 'MOST PROBABLE PEAK TORNADO INTENSITY...', []);
            const windIntensity = loader.packages.TextParser.textProductToString(feature.properties.text, 'MOST PROBABLE PEAK WIND GUST...', []);
            const hailIntensity = loader.packages.TextParser.textProductToString(feature.properties.text, 'MOST PROBABLE PEAK HAIL SIZE...', []);
            structure.features.push({
                type: 'Feature',
                geometry: { type: 'Polygon', coordinates: feature.coordinates },
                properties: {
                    mesoscale_id: feature.properties.number ?? null,
                    expires: feature.properties.expires_at_ms ? new Date(feature.properties.expires_at_ms).toISOString() : null,
                    issued: feature.properties.issued_at_ms ? new Date(feature.properties.issued_at_ms).toISOString() : null,
                    description: loader.packages.TextParser.textProductToDescription(feature.properties.text).replace(/\n/g, '<br>') ?? null,
                    locations: feature.properties.tags?.AREAS_AFFECTED?.join(', ') ?? null,
                    outlook: feature.properties.tags?.CONCERNING?.join(', ') ?? null,
                    population: feature.properties.population?.people?.toLocaleString() ?? null,
                    homes: feature.properties.population?.homes?.toLocaleString() ?? null,
                    parameters: {
                        tornado_probability: torIntensity ?? null,
                        wind_probability: windIntensity ?? null,
                        hail_probability: hailIntensity ?? null,
                    },
                }
            });
        }  
    })
    return structure;
};

