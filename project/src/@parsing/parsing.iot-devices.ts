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

type IoTDeviceFeature = {
    last_location_lon: string;
    last_location_lat: string;
    name: string;
    last_location_text: string;
    stream: {
        name: string;
        url: string;
        viewers: number;
    } | null;
    icon_url: string;
    model: string;
    primary_location_source: string;
}

export const parse = (body: Record<string, string>) => {
    const structure: types.GeoJSONFeatureCollection = { type: 'FeatureCollection', features: [] };
    for (const feature of (body.devices as unknown) as IoTDeviceFeature[]) {
        const longitude = feature.last_location_lon
        const latitude = feature.last_location_lat
        if (feature.stream == null) continue;
        structure.features.push({
            type: `Feature`,
            geometry: {
                type: `Point`,
                coordinates: [parseFloat(longitude), parseFloat(latitude)]
            },
            properties: {
                name: feature.name ?? null,
                location: feature.last_location_text ?? null,
                stream_name: feature.stream?.name ?? null,
                stream_url: feature.stream?.url ?? null,
                stream_viewiers: feature.stream?.viewers ?? null,
                icon_url: feature.icon_url ?? null,
                model: feature.model ?? null,
                source: feature.primary_location_source ?? null
            }
        });
    }
    return structure;
};

