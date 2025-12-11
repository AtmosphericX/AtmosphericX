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
    NAME_SPACE: string = `submodule:@routes:tracking`;
    ERR_NO_TRACKING: string = `No tracking ID provided.`;
    ERR_NO_EVENT: string = `No event found for the provided tracking ID.`;
    SUCCESS_DIRECTORY: string = `/eas/`;
    constructor() {
        loader.submodules.utils.log(`${this.NAME_SPACE} initialized.`)
        loader.cache.handlers.express.get(`/api/getpoly/:tracking?`, async (request: Record<string, any>, response: Record<string, any>) => {
            try { 
                const tracking = request.params.tracking ?? null;
                if (!tracking) { return response.status(400).json({ message: this.ERR_NO_TRACKING }); }
                const event = loader.cache.external.events.features.find((ev: types.EventType) => ev.properties.details.tracking === tracking);
                if (!event) { return response.status(404).json({ message: this.ERR_NO_EVENT }); }
                return response.json(await loader.cache.handlers.eventManager.getEventPolygon(event))
            } catch (error) {
                loader.submodules.utils.log(`${this.NAME_SPACE} ERROR: ${error.message}`);
                return response.status(500).json({ message: `Internal server error.` });
            }
        });
        loader.cache.handlers.express.get(`/api/geteas/:tracking?`, async (request: Record<string, any>, response: Record<string, any>) => {
            try { 
                const tracking = request.params.tracking ?? null;
                if (!tracking) { return response.status(400).json({ message: this.ERR_NO_TRACKING }); }
                const event = loader.cache.external.events.features.find((ev: types.EventType) => ev.properties.details.tracking === tracking);
                if (!event) { return response.status(404).json({ message: this.ERR_NO_EVENT }); }
                const output = await loader.cache.handlers.eventManager.createEasAudio(event.properties.description, event.properties.details.header);
                return response.json({ file: `${this.SUCCESS_DIRECTORY}${output.split(`\\`).pop()}` });
            } catch (error) {
                loader.submodules.utils.log(`${this.NAME_SPACE} ERROR: ${error.message}`);
                return response.status(500).json({ message: `Internal server error.` });
            }
        });
    } 
}

export default Init;

