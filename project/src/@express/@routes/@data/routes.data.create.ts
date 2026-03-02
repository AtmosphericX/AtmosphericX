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
    Documentation: http://localhost/documentation | https://atmosphericx.scriptkitty.cafe/documentation

*/

import * as loader from '../../..'
import * as types from '../../../@dictionaries/types';

export class Init { 
    name_space: string = `Routes.Data.Create`;
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
        this.server.post(getRoutes.post_create_endpoint, async (request: types.ExpressRequest, response: types.ExpressResponse) => {
            try {
                const getType = request.params.type ?? null;
                switch (getType) { 
                    case `manual_event`:
                        const { event } = await loader.modules.routing.getRequestBody(request);
                        if (!event) return response.status(400).json({ message: getMessages.response_generic_error});
                        loader.cache.external.manual = {type: "FeatureCollection", features: [event]};
                        return response.json(event);
                    default:
                        return response.status(400).json({ message: getMessages.response_unknown_endpoint});
                }
            } catch (error) {
                loader.modules.utilities.exception(error, `${this.name_space}/POST ${getRoutes.post_create_endpoint}`);
                return response.status(500).sendFile(`${storage}${getRoutes.unknown_direct_path}`);
            }
        })
    }
}

export default Init;