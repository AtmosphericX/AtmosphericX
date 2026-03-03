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
    name_space: string = `Routes.Portal.Signup`;
    ansi_colors = loader.modules.utilities.ansi_colors;
    server = loader.cache.handlers.express;
    constructor() {
        loader.modules.utilities.log({ 
            title: `${this.ansi_colors.GREEN}${this.name_space}${this.ansi_colors.RESET}`, 
            message: `Successfully initialized`
        });
        const getMessages = loader.strings.route_messages;
        const getRoutes = loader.strings.route_locations;
        this.server.post(getRoutes.post_signup_endpoint, async (request: types.ExpressRequest, response: types.ExpressResponse) => {
            try {
                const isSetupFinished = loader.cache.external.setup == 0 ? false : true;
                const isAdminRoute = request.params.admin == "admin" ? true : false;
                const { session, session_data, address } = loader.modules.routing.getUserSession(request);
                const { username, password } = await loader.modules.routing.getRequestBody(request);
                const isValidRequest = await loader.modules.routing.isAccountRequestValid(username, password);
                if (isValidRequest != true) {
                    loader.modules.utilities.log({
                        title: `${this.ansi_colors.YELLOW}${this.name_space}${this.ansi_colors.RESET}`,
                        message: `Blocked login attempt for ${this.ansi_colors.CYAN}${username}${this.ansi_colors.RESET} from ${this.ansi_colors.CYAN}${address}${this.ansi_colors.RESET}`,
                        settings: { file: true }
                    });
                    return response.status(400).json({ message: isValidRequest });
                }
                if (isAdminRoute) {
                    if (!isSetupFinished) {
                        if (session == null || session_data?.role != -1) {
                            loader.modules.utilities.log({
                                title: `${this.ansi_colors.YELLOW}${this.name_space}${this.ansi_colors.RESET}`,
                                message: `Attempted admin account creation without proper authorization from ${this.ansi_colors.CYAN}${address}${this.ansi_colors.RESET}`,
                                settings: { file: true }
                            });
                            return response.status(403).json({ message: getMessages.response_admin_creation_unauthorized });
                        }
                    } else {
                        loader.modules.utilities.log({
                            title: `${this.ansi_colors.YELLOW}${this.name_space}${this.ansi_colors.RESET}`,
                            message: `Attempted setup when it's already completed from ${this.ansi_colors.CYAN}${address}${this.ansi_colors.RESET}`,
                            settings: { file: true }
                        });
                        return response.status(403).json({ message: getMessages.response_setup_already_completed });
                    }
                }
                const getAccount = await loader.modules.routing.getAccountByUsername(username);
                if (getAccount != null) { 
                    return response.status(409).json({ message: getMessages.response_account_exists }); 
                }
                const hash = await loader.packages.argon2.hash(password, {
                    type: loader.packages.argon2.argon2id, memoryCost: 2 ** 16,
                    timeCost: 3, parallelism: 1
                });
                loader.modules.database.query(`INSERT INTO accounts (username, hash, activated, role) VALUES (?, ?, ?, ?)`, [
                    username, hash,
                    isAdminRoute ? 1 : 0,
                    isAdminRoute ? 1 : 0
                ]); 
                if (isAdminRoute) {
                    loader.cache.external.setup = 1;
                    loader.modules.utilities.log({
                        title: `${this.ansi_colors.GREEN}${this.name_space}${this.ansi_colors.RESET}`,
                        message: `${this.ansi_colors.CYAN}${username}${this.ansi_colors.RESET} created admin account from ${this.ansi_colors.CYAN}${address}${this.ansi_colors.RESET}`,
                        settings: { file: true }
                    });    
                    return loader.modules.routing.invalidateUserSession(response, session, getMessages.response_admin_account_created);
                }
                loader.modules.utilities.log({
                    title: `${this.ansi_colors.GREEN}${this.name_space}${this.ansi_colors.RESET}`,
                    message: `User ${this.ansi_colors.CYAN}${username}${this.ansi_colors.RESET} signed up successfully from ${this.ansi_colors.CYAN}${address}${this.ansi_colors.RESET}`,
                    settings: { file: true }
                });    
                return response.status(201).json({ message: getMessages.response_successful_signup });
            } catch (error) {
                loader.modules.utilities.exception(error, `${this.name_space}/POST ${getRoutes.post_signup_endpoint}`);
                return response.status(500).json({ message: getMessages.response_generic_error });
            }
        })
    }
}

export default Init;