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
import * as loader from '../';


export const parse = async (body: string) => {
    const structure: types.GeoJSONFeatureCollection = {
        type: `FeatureCollection`,
        features: []
    };
    const parsed = await loader.packages.PlacefileManager.parsePlacefile(body) as types.DefaultPlacefileParsingTypes[];
    for (const feature of parsed) {
        if (!feature.line?.text) continue;
        const tornado = feature.line.text.match(/ProbTor: (\d+)/) ? parseInt(feature.line.text.match(/ProbTor: (\d+)/)[1]) : 0;
        const severe = feature.line.text.match(/ProbSevere: (\d+)/) ? parseInt(feature.line.text.match(/ProbSevere: (\d+)/)[1]) : 0;
        const hail = feature.line.text.match(/ProbHail: (\d+)/) ? parseInt(feature.line.text.match(/ProbHail: (\d+)/)[1]) : 0;
        const wind = feature.line.text.match(/ProbWind: (\d+)/) ? parseInt(feature.line.text.match(/ProbWind: (\d+)/)[1]) : 0;
        const shearMatch = feature.line.text.match(/Max LLAzShear: ([\d.]+)/);
        const MLCape = feature.line.text.match(/MLCAPE: ([\d.]+)/);
        const MUCape = feature.line.text.match(/MUCAPE: ([\d.]+)/);
        const ObjID = feature.line.text.match(/Object ID: (\d+)/) ? parseInt(feature.line.text.match(/Object ID: (\d+)/)[1]) : 0;
        const shear = shearMatch ? parseFloat(shearMatch[1]) : 0;
        const MLCapeValue = MLCape ? parseFloat(MLCape[1]) : 0;
        const MUCapeValue = MUCape ? parseFloat(MUCape[1]) : 0;
        if (tornado > 2 || severe > 15 || hail > 10 || wind > 10) {
            structure.features.push({
                type: 'Feature',
                geometry: { 
                    type: 'Polygon',
                    coordinates: [feature.coordinates as unknown as [number, number]]
                },
                properties: {
                    id: ObjID,
                    tornado, severe, wind, hail, shear,
                    MLCape: MLCapeValue,
                    MUCape: MUCapeValue,
                    description: feature.line.text.replace(/\\n/g, '<br>') ?? null
                }
            });
        }
    }
    return structure;
};

