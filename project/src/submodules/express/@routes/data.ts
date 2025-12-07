/*
              _                             _               _     __   __
         /\  | |                           | |             (_)    \ \ / /
        /  \ | |_ _ __ ___   ___  ___ _ __ | |__   ___ _ __ _  ___ \ V / 
       / /\ \| __| '_ ` _ \ / _ \/ __| '_ \| '_ \ / _ \ '__| |/ __| > <  
      / ____ \ |_| | | | | | (_) \__ \ |_) | | | |  __/ |  | | (__ / . \ 
     /_/    \_\__|_| |_| |_|\___/|___/ .__/|_| |_|\___|_|  |_|\___/_/ \_\
                                     | |                                 
                                     |_|                                                                                                                
    
    Written by: KiyoWx (k3yomi) & StarflightWx      

*/


import * as loader from '../../../bootstrap';
import * as types from '../../../types';

export class Init { 
    NAME_SPACE: string = `submodule:@routes:data`;
    UNKNOWN_DIRECTORY: string = `/www/__pages/__404/index.html`
    constructor() {
        loader.submodules.utils.log(`${this.NAME_SPACE} initialized.`)
        const parentDirectory = loader.packages.path.resolve(`..`, `storage`);
        loader.cache.handlers.express.get(`/data/:endpoint/:source?`, (request: Record<string, any>, response: Record<string, any>) => { 
            try {
                const endpoint = request.params.endpoint;
                const source = request.params.source || null;
                const isValid = Object.keys(loader.cache.external).includes(endpoint);
                if (!isValid) { return response.sendFile(`${parentDirectory}${this.UNKNOWN_DIRECTORY}`); }
                return response.json(loader.cache.external[endpoint][source] || loader.cache.external[endpoint]);
            } catch (error) {
                loader.submodules.utils.log(`${this.NAME_SPACE} ERROR: ${error.message}`);
                return response.status(500).json({ message: `Internal server error.` });
            }
        })
    }
}

export default Init;

