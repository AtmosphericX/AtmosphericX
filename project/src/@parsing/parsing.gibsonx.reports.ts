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

interface GibsonRidgeReportTypes { 
    lat?: string; 
    lon?: string; 
    city?: string; 
    county?: string; 
    state?: string; 
    event?: string; 
    source?: string; 
    description?: string; 
    mag?: string; 
    office?: string; 
    date?: string; 
    time?: string;
    comment?: string; 
}

export const parse = (body: string) => {
    const structure: types.GeoJSONFeatureCollection = {
        type: 'FeatureCollection',
        features: []
    };
    loader.packages.PlacefileManager.parseTable(body).then(parsed=> {
        parsed as GibsonRidgeReportTypes[];
        for (const feature of parsed) {
            const longitude = parseFloat(feature.lon);
            const latitude = parseFloat(feature.lat);
            if (isNaN(longitude) || isNaN(latitude)) continue;
            structure.features.push({
                type: 'Feature',
                geometry: { type: 'Point', coordinates: [longitude, latitude] },
                properties: {
                    location: `${feature.city ?? ''}, ${feature.county ?? ''}, ${feature.state ?? ''}`,
                    event: feature.event ?? null,
                    sender: feature.source ?? null,
                    description: `${feature.event ?? ''} reported at ${feature.city ?? ''}, ${feature.county ?? ''}, ${feature.state ?? ''}. ${feature.comment ?? ''}`,
                    magnitude: feature.mag ?? null,
                    office: feature.office ?? null,
                    time: `${feature.time ?? ''} ${feature.date ?? ''}`.trim() || null
                }
            });
        }   
    });
    return structure;
};
