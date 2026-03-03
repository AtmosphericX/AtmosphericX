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
    name_space: string = `Routes.Data.Cache`;
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
        this.server.get(getRoutes.get_data_endpoint, async (request: types.ExpressRequest, response: types.ExpressResponse) => {
            try {
                const getEndpoint = request.params.endpoint ?? null;
                if (!loader.cache.external[getEndpoint]) { return response.status(404).json({ message: getMessages.response_unknown_endpoint }); }
                return response.json(loader.cache.external[getEndpoint]);
            } catch (error) {
                loader.modules.utilities.exception(error, `${this.name_space}/GET ${getRoutes.get_data_endpoint}`);
                return response.status(500).sendFile(`${storage}${getRoutes.unknown_direct_path}`);
            }
        })
    }
}

export default Init;