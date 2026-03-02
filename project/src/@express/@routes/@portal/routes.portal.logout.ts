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

import * as loader from '../../..'
import * as types from '../../../@dictionaries/types';

export class Init { 
    name_space: string = `Routes.Portal.Logout`;
    ansi_colors = loader.modules.utilities.ansi_colors;
    server = loader.cache.handlers.express;
    constructor() {
        loader.modules.utilities.log({ 
            title: `${this.ansi_colors.GREEN}${this.name_space}${this.ansi_colors.RESET}`, 
            message: `Successfully initialized`
        });
        const getMessages = loader.strings.route_messages;
        const getRoutes = loader.strings.route_locations;
        this.server.post(getRoutes.post_logout_endpoint, async (request: types.ExpressRequest, response: types.ExpressResponse) => {
            try {
                const { session } = loader.modules.routing.getUserSession(request);
                if (!session) { 
                    return response.status(401).json({ message: getMessages.response_no_active_session});
                }
                return loader.modules.routing.invalidateUserSession(response, session, `User initiated logout`);
            } catch (error) {
                loader.modules.utilities.exception(error, `${this.name_space}/POST ${getRoutes.post_logout_endpoint}`);
                return response.status(500).json({ message: getMessages.response_generic_error });
            }
        })
    }
}

export default Init;