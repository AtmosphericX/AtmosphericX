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

*/

import * as types from '../@dictionaries/types';
import * as loader from '../';

type SpotterNetworkFeature = {
    lat: string;
    lon: string;
    callsign: string;
    dir: string;
    elev: string;
    email: string;
    first: string;
    freq: string;
    ham: string;
    last: string;
    note: string;
    phone: string;
    twitter: string;
    unix: number;
    web: string;
}

export const parse = (body: Record<string, string>) => {
    const structure: types.GeoJSONFeatureCollection = { type: 'FeatureCollection', features: [] };
    const configurations = loader.modules.utilities.cfg();
    const settings = configurations?.sources?.location_settings.spotter_network
    const currentTime = new Date().getTime();
    let tracked: Array<{ name: string } & types.LatitudeLongitude> = [];
    for (const feature of (body.positions as unknown ) as SpotterNetworkFeature[]) {
        const longitude = feature.lon
        const latitude = feature.lat
        const isActiveSpotter = feature.unix >= (currentTime / 1000 - 300) && settings.pins.active;
        const isIdleSpotter = (feature.unix < (currentTime / 1000 - 300) && feature.unix >= (currentTime / 1000 - 3600)) && settings.pins.idle; 
        const isNameTracked = settings.pin_by_name.findIndex(name => (feature.first + ` ` + feature.last).includes(name));
        if (!isActiveSpotter && !isIdleSpotter && (!settings.pins.offline || feature.unix < (currentTime / 1000 - 3600))) continue;
        if (isNameTracked !== -1 && !tracked.find(t => t.name === settings.pin_by_name[isNameTracked])) {
            tracked.push({
                name: settings.pin_by_name[isNameTracked],
                longitude: parseFloat(longitude),
                latitude: parseFloat(latitude)
            });
        }
        structure.features.push({
            type: `Feature`,
            geometry: {
                type: `Point`,
                coordinates: [parseFloat(longitude), parseFloat(latitude)]
            },
            properties: {
                callsign: feature.callsign ?? `N/A`,
                direction: loader.modules.calculations.cardinalDirection(parseInt(feature.dir)) ?? `N/A`,
                eleveation: feature.elev ?? `N/A`,
                email: feature.email ?? `N/A`,
                name: (feature.first + ` ` + feature.last),
                frequency: feature.freq ?? `N/A`,
                ham: feature.ham ?? `N/A`,
                note: feature.note ?? `N/A`,
                phone: feature.phone ?? `N/A`,
                twitter: feature.twitter ?? `N/A`,
                web: feature.web ?? `N/A`,
                reported_at: new Date(feature.unix * 1000).toISOString() ?? `N/A`,
                status: isActiveSpotter ? 'active' : 'idle',
            }
        });
    }
    tracked.sort((a, b) => { return settings.pin_by_name.indexOf(a.name) - settings.pin_by_name.indexOf(b.name); });
    for (const spotter of tracked) {
        loader.modules.tracking.setCurrentCoordinates(spotter.name, { latitude: spotter.latitude, longitude: spotter.longitude });
    }
    return structure;
};

