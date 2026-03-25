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


export const parse = async (body: string) => {
    const structure: types.GeoJSONFeatureCollection = {
        type: 'FeatureCollection',
        features: []
    };
    const parsed = await loader.packages.PlacefileManager.parsePlacefile(body) as types.DefaultPlacefileParsingTypes[];
    const configurations = loader.modules.utilities.cfg();
    const settings = configurations?.sources?.miscellaneous_settings?.cimss_psv3;
    for (const feature of parsed) {
        if (!feature.line || !feature.line.text) continue;
        const tornadoMatch = feature.line.text.match(/ProbTor: (\d+)/);
        const tornado = tornadoMatch ? parseInt(tornadoMatch[1]) : 0;
        const severeMatch = feature.line.text.match(/ProbSevere: (\d+)/);
        const severe = severeMatch ? parseInt(severeMatch[1]) : 0;
        const hailMatch = feature.line.text.match(/ProbHail: (\d+)/);
        const hail = hailMatch ? parseInt(hailMatch[1]) : 0;
        const windMatch = feature.line.text.match(/ProbWind: (\d+)/);
        const wind = windMatch ? parseInt(windMatch[1]) : 0;
        const shearMatch = feature.line.text.match(/Max LLAzShear: ([\d.]+)/);
        const shear = shearMatch ? parseFloat(shearMatch[1]) : 0;
        const MLCapeMatch = feature.line.text.match(/MLCAPE: ([\d.]+)/);
        const MLCapeValue = MLCapeMatch ? parseFloat(MLCapeMatch[1]) : 0;
        const MUCapeMatch = feature.line.text.match(/MUCAPE: ([\d.]+)/);
        const MUCapeValue = MUCapeMatch ? parseFloat(MUCapeMatch[1]) : 0;
        const objIDMatch = feature.line.text.match(/Object ID: (\d+)/);
        const ObjID = objIDMatch ? parseInt(objIDMatch[1]) : 0;
        if (
            tornado > settings?.thresholds?.tornado ||
            hail > settings?.thresholds?.hail || 
            wind > settings?.thresholds?.wind ||
            severe > settings?.thresholds?.severe ||
            shear > settings?.thresholds?.shear || 
            MLCapeValue > settings?.thresholds?.mucape ||
            MUCapeValue > settings?.thresholds?.mlcape
        )
        {
            structure.features.push({
                type: 'Feature',
                geometry: { 
                    type: 'Polygon',
                    coordinates: [feature.coordinates as unknown as [number, number]]
                },
                properties: {
                    id: ObjID,
                    tornado,
                    severe,
                    wind,
                    hail,
                    shear,
                    MLCape: MLCapeValue,
                    MUCape: MUCapeValue,
                    description: feature.line.text.replace(/\\n/g, '<br>') ?? null
                }
            });
        }
    }
    return structure;
};
