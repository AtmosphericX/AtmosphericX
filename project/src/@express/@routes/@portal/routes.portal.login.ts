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
    name_space: string = `Routes.Portal.Login`;
    ansi_colors = loader.modules.utilities.ansi_colors;
    server = loader.cache.handlers.express;
    constructor() {
        loader.modules.utilities.log({ 
            title: `${this.ansi_colors.GREEN}${this.name_space}${this.ansi_colors.RESET}`, 
            message: `Successfully initialized`
        });
        const getMessages = loader.strings.route_messages;
        const getRoutes = loader.strings.route_locations;
        this.server.post(getRoutes.post_login_endpoint, async (request: types.ExpressRequest, response: types.ExpressResponse) => {
            try {
                const configurations = loader.modules.utilities.cfg();
                const options = configurations.web_hosting_settings;
                const hex = loader.packages.crypto.randomBytes(32).toString('hex');
                const { address, useragent } = loader.modules.routing.getUserSession(request);
                const { username, password } = await loader.modules.routing.getRequestBody(request);
                const isProtected = loader.modules.routing.isAccountProtectionActivated(username);
                const isValidRequest = await loader.modules.routing.isAccountRequestValid(username, password);
                if (username && password == `guest`) { 
                    const alias = `Guest-${hex.substring(0, 8)}`;
                    if (!options.is_guest_access_allowed) {
                        return response.status(403).json({ message: getMessages.response_guest_access_disabled });
                    }
                    return loader.modules.routing.createUserSession(response, alias, 0, address, useragent, hex);
                }
                if (isProtected || isValidRequest != true) { 
                    const getReason = isProtected ? getMessages.response_account_protection : isValidRequest;
                    const getStatus = isProtected ? 429 : 400;
                    loader.modules.utilities.log({
                        title: `${this.ansi_colors.RED}${this.name_space}${this.ansi_colors.RESET}`,
                        message: `Blocked login attempt for ${this.ansi_colors.CYAN}${username}${this.ansi_colors.RESET} from ${this.ansi_colors.CYAN}${address}${this.ansi_colors.RESET}`,
                        settings: { file: true }
                    });
                    return response.status(getStatus).json({ message: getReason });
                }
                const getAccount = await loader.modules.routing.getAccountByUsername(username);
                if (!getAccount) { 
                    loader.modules.utilities.log({
                        title: `${this.ansi_colors.YELLOW}${this.name_space}${this.ansi_colors.RESET}`,
                        message: `Failed login attempt for ${this.ansi_colors.CYAN}${username}${this.ansi_colors.RESET} from ${this.ansi_colors.CYAN}${address}${this.ansi_colors.RESET}`,
                        settings: { file: true }
                    });
                    return response.status(400).json({ message: getMessages.response_incorrect_credentials });
                }
                if (!await loader.packages.argon2.verify(getAccount.hash, password)) { 
                    loader.modules.utilities.log({
                        title: `${this.ansi_colors.YELLOW}${this.name_space}${this.ansi_colors.RESET}`,
                        message: `Failed login attempt for ${this.ansi_colors.CYAN}${username}${this.ansi_colors.RESET} from ${this.ansi_colors.CYAN}${address}${this.ansi_colors.RESET}`,
                        settings: { file: true }
                    });
                    return response.status(401).json({ message: getMessages.response_incorrect_credentials }); 
                }
                if (getAccount.activated == 0) { 
                    loader.modules.utilities.log({
                        title: `${this.ansi_colors.YELLOW}${this.name_space}${this.ansi_colors.RESET}`,
                        message: `Inactive account login attempt for ${this.ansi_colors.CYAN}${username}${this.ansi_colors.RESET} from ${this.ansi_colors.CYAN}${address}${this.ansi_colors.RESET}`,
                        settings: { file: true }
                    });
                    return response.status(403).json({ message: getMessages.response_account_deactivated }); 
                }
                return loader.modules.routing.createUserSession(response, username, getAccount.role, address, useragent, hex);
            } catch (error) {
                loader.modules.utilities.exception(error, `${this.name_space}/POST ${getRoutes.post_login_endpoint}`)
                return response.status(500).json({ message: getMessages.response_generic_error });
            }
        })
    }
}

export default Init;