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
import * as loader from '../';

type ProbabilityTypes = { 
    type?: string; 
    probability?: number; 
    shear?: number; 
    description?: string 
}

export const parse = async (body: string, type: 'tornado' | 'severe') => {
    const structure: ProbabilityTypes[] = [];
    const configurations = loader.modules.utilities.cfg();
    const threshold = configurations?.sources?.probability_settings[type]?.percentage_threshold ?? 50;
    const typeRegexp = type === 'tornado' ? /ProbTor: (\d+)%/ : /ProbSevere: (\d+)%/;
    const parsed = await loader.packages.PlacefileManager.parsePlacefile(body) as types.DefaultPlacefileParsingTypes[];
    for (const feature of parsed) {
        if (!feature.line?.text) continue;
        const probMatch = feature.line.text.match(typeRegexp);
        const probability = probMatch ? parseInt(probMatch[1]) : 0;
        const shearMatch = feature.line.text.match(/Max LLAzShear: ([\d.]+)/);
        const shear = shearMatch ? parseFloat(shearMatch[1]) : 0;
        if (probability >= threshold) {
            structure.push({
                type,
                probability,
                shear,
                description: feature.line.text.replace(/\\n/g, '<br>') ?? 'N/A'
            });
        }
    }
    return structure;
};

