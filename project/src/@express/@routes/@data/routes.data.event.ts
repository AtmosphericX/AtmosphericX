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

import * as loader from '../../..'
import * as types from '../../../@dictionaries/types';

export class Init { 
    name_space: string = `Routes.Data.Events`;
    ansi_colors = loader.modules.utilities.ansi_colors;
    server = loader.cache.handlers.express;
    constructor() {
        loader.modules.utilities.log({ 
            title: `${this.ansi_colors.GREEN}${this.name_space}${this.ansi_colors.RESET}`, 
            message: `Successfully initialized`
        });
        const getMessages = loader.strings.route_messages;
        const getRoutes = loader.strings.route_locations;
        const storage = loader.packages.path.resolve(`..`, `storage`);
        this.server.get(getRoutes.get_event_action_endpoint, async (request: types.ExpressRequest, response: types.ExpressResponse) => {
            try {
                const getTracking = request.params.tracking ?? null;
                const getAction = request.params.action ?? null;
                const getEvent = loader.cache.external.events.features.find((event: types.EventType) => event.properties?.details?.tracking === getTracking);
                if (getEvent) { 
                    switch (getAction) { 
                        case 'audio': {
                            const audio = await loader.cache.handlers.parser_client.createEasAudio(getEvent.properties.description, getEvent.properties.details?.header);
                            const wavFile = loader.packages.path.basename(audio);
                            return response.json({ file: `/eas/${wavFile}` });
                        }
                        case 'polygon': {
                            const multipolygon = request.query.multipolygon === 'false' ? true : false;
                            const polygon = await loader.cache.handlers.parser_client.getEventPolygon(getEvent, multipolygon);
                            return response.json({ polygon });
                        }
                        case 'summary':
                            return response.json({ summary: getEvent });
                        default:
                            return response.status(404).sendFile(`${storage}${getRoutes.unknown_direct_path}`);
                    }
                } else { 
                    return response.status(404).json({ message: getMessages.resposne_invalid_tracking });
                }
            } catch (error) {
                loader.modules.utilities.exception(error, `${this.name_space}/GET ${getRoutes.get_event_action_endpoint}`);
                return response.status(404).sendFile(`${storage}${getRoutes.unknown_direct_path}`);
            }
        });
    }
}

export default Init;