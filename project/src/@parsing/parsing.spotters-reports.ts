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

type SpotterReports = {
    lat: string;
    lon: string;
    tornado: string;
    funnelcloud: string;
    wallcloud: string;
    hail: string;
    hailsize: string;
    flashflood: string;
    flood: string;
    trees: string;
    power: string;
    injury: string;
    email: string;
    first: string;
    last: string;
    unix: string;
    narrative: string;
}

export const parse = (body: Record<string, string>) => {
    const structure: types.GeoJSONFeatureCollection = { type: 'FeatureCollection', features: [] };
    for (const feature of (body.reports as unknown) as SpotterReports[]) {
        const longitude = feature.lon
        const latitude = feature.lat
        structure.features.push({
            type: `Feature`,
            geometry: {
                type: `Point`,
                coordinates: [parseFloat(longitude), parseFloat(latitude)]
            },
            properties: {
                event: (() => {
                    const is = (v: string) => Number(v) === 1;
                    const events: string[] = [];
                    if (is(feature.tornado)) events.push('Tornado');
                    if (is(feature.funnelcloud)) events.push('Funnel Cloud');
                    if (is(feature.wallcloud)) events.push('Wall Cloud');
                    if (is(feature.hail)) events.push(Number(feature.hailsize) > 0 ? `Hail (${feature.hailsize} in)` : 'Hail');
                    if (is(feature.flashflood)) events.push('Flash Flood');
                    if (is(feature.flood)) events.push('Flood');
                    if (is(feature.trees)) events.push('Tree Damage');
                    if (is(feature.power)) events.push('Power Outage');
                    if (is(feature.injury)) events.push('Injury');
                    return events.join(', ') || 'Other';
                })(),
                email: feature.email ?? `N/A`,
                reporter: (feature.first + ` ` + feature.last),
                time: new Date(parseInt(feature.unix) * 1000).toISOString() ?? `N/A`,
                notes: feature.narrative ?? `N/A`,
                sender: "Spotter Network",
            }
        });
    }
    return structure;
};

