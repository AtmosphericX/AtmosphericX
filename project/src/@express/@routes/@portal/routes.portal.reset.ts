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
    Documentation: http://localhost/docs | https://atmosx.scriptkitty.cafe/docs

*/

import * as loader from '../../..'
import * as types from '../../../@dictionaries/types';

export class Init { 
    name_space: string = `Routes.Portal.Reset`;
    ansi_colors = loader.modules.utilities.ansi_colors;
    server = loader.cache.handlers.express;
    constructor() {
        loader.modules.utilities.log({ 
            title: `${this.ansi_colors.GREEN}${this.name_space}${this.ansi_colors.RESET}`, 
            message: `Successfully initialized`
        });
        const getMessages = loader.strings.route_messages;
        const getRoutes = loader.strings.route_locations;
        this.server.post(getRoutes.post_reset_endpoint, async (request: types.ExpressRequest, response: types.ExpressResponse) => {
            try {
                const { address } = loader.modules.routing.getUserSession(request);
                const { username, password, confirmed } = await loader.modules.routing.getRequestBody(request);
                const isProtected = loader.modules.routing.isAccountProtectionActivated(username);
                const isValidRequest = await loader.modules.routing.isAccountRequestValid(username, password);
                if (isProtected || isValidRequest != true) {
                    const getReason = isProtected ? getMessages.response_account_protection : isValidRequest;
                    const getStatus = isProtected ? 429 : 400;
                    loader.modules.utilities.log({
                        title: `${this.ansi_colors.YELLOW}${this.name_space}${this.ansi_colors.RESET}`,
                        message: `Blocked login attempt for ${this.ansi_colors.CYAN}${username}${this.ansi_colors.RESET} from ${this.ansi_colors.CYAN}${address}${this.ansi_colors.RESET}`,
                        settings: { file: true }
                    });
                    return response.status(getStatus).json({ message: getReason });
                }
                const getAccount = await loader.modules.routing.getAccountByUsername(username);
                if (!getAccount) { 
                    loader.modules.utilities.log({
                        title: `${this.ansi_colors.YELLOW}${this.name_space}${this.ansi_colors.RESET}`,
                        message: `Account reset attempt for non-existent account ${this.ansi_colors.CYAN}${username}${this.ansi_colors.RESET} from ${this.ansi_colors.CYAN}${address}${this.ansi_colors.RESET}`,
                        settings: { file: true }
                    });
                    return response.status(401).json({ message: getMessages.response_incorrect_credentials }); 
                }
                if (!await loader.packages.argon2.verify(getAccount.hash, password)) { 
                    loader.modules.utilities.log({
                        title: `${this.ansi_colors.YELLOW}${this.name_space}${this.ansi_colors.RESET}`,
                        message: `Incorrect credentials reset attempt for ${this.ansi_colors.CYAN}${username}${this.ansi_colors.RESET} from ${this.ansi_colors.CYAN}${address}${this.ansi_colors.RESET}`,
                        settings: { file: true }
                    });
                    return response.status(401).json({ message: getMessages.response_incorrect_credentials }); 
                }
                loader.modules.utilities.log({
                    title: `${this.ansi_colors.GREEN}${this.name_space}${this.ansi_colors.RESET}`,
                    message: `User ${this.ansi_colors.CYAN}${username}${this.ansi_colors.RESET} reset password successfully from ${this.ansi_colors.CYAN}${address}${this.ansi_colors.RESET}`,
                    settings: { file: true }
                });
                loader.modules.database.query(`UPDATE accounts SET hash = ? WHERE username = ?`, [
                    await loader.packages.argon2.hash(confirmed, {
                        type: loader.packages.argon2.argon2id, memoryCost: 2 ** 16,
                        timeCost: 3, parallelism: 1
                    }),
                    username
                ]);
                return response.status(200).json({ message: getMessages.response_successful_reset });
            } catch (error) {
                loader.modules.utilities.exception(error, `${this.name_space}/POST ${getRoutes.post_reset_endpoint}`);
                return response.status(500).json({ message: getMessages.response_generic_error });
            }
        })
    }
}

export default Init;