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
    Documentation: http://localhost/documentation | https://atmosx-secondary.scriptkitty.cafe/documentation

*/

import * as loader from '../../..'
import * as types from '../../../@dictionaries/types';

export class Init { 
    name_space: string = `Routes.Portal.Setup`;
    ansi_colors = loader.modules.utilities.ansi_colors;
    server = loader.cache.handlers.express;
    constructor() {
        loader.modules.utilities.log({ 
            title: `${this.ansi_colors.GREEN}${this.name_space}${this.ansi_colors.RESET}`, 
            message: `Successfully initialized`
        });
        const getMessages = loader.strings.route_messages;
        const getRoutes = loader.strings.route_locations;
        this.server.post(getRoutes.post_setup_endpoint, async (request: types.ExpressRequest, response: types.ExpressResponse) => {
            try {
                const isSetupFinished = loader.cache.external.setup == 0 ? false : true;
                const hex = loader.packages.crypto.randomBytes(32).toString('hex');
                const { address, useragent } = loader.modules.routing.getUserSession(request);
                const { auth } = await loader.modules.routing.getRequestBody(request);
                if (isSetupFinished) { 
                    loader.modules.utilities.log({
                        title: `${this.ansi_colors.YELLOW}${this.name_space}${this.ansi_colors.RESET}`,
                        message: `Attempted setup when setup is already completed from ${this.ansi_colors.CYAN}${address}${this.ansi_colors.RESET}`,
                        settings: { file: true }
                    });
                    return response.status(403).json({ message: getMessages.response_setup_already_completed });
                }
                if (parseInt(auth) !== loader.cache.internal.setup_auth_code) {
                    loader.modules.utilities.log({
                        title: `${this.ansi_colors.YELLOW}${this.name_space}${this.ansi_colors.RESET}`,
                        message: `Attempted setup with invalid auth code ${this.ansi_colors.CYAN}${auth}${this.ansi_colors.RESET} where ${this.ansi_colors.CYAN}${loader.cache.internal.setup_auth_code}${this.ansi_colors.RESET} was expected from ${this.ansi_colors.CYAN}${address}${this.ansi_colors.RESET}`,
                        settings: { file: true }
                    });
                    return response.status(401).json({ message: getMessages.response_invalid_auth_code });
                }
                return loader.modules.routing.createUserSession(response, `Setup-Admin`, -1, address, useragent, hex);
                
            } catch (error) {
                loader.modules.utilities.exception(error, `${this.name_space}/POST ${getRoutes.post_setup_endpoint}`);
                return response.status(500).json({ message: getMessages.response_generic_error });
            }
        })
    }
}

export default Init;