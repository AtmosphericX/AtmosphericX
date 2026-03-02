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

import * as loader from '../..'
import * as types from '../../@dictionaries/types';


export class Init { 
    name_space: string = `Middleware.Authority`;
    ansi_colors = loader.modules.utilities.ansi_colors;
    pkg = loader.packages.express;
    server = loader.cache.handlers.express;
    ratelimit = loader.packages.rateLimit;
    constructor() {
        loader.modules.utilities.log({ 
            title: `${this.ansi_colors.GREEN}${this.name_space}${this.ansi_colors.RESET}`, 
            message: `Successfully initialized`
        });
        const getMessages = loader.strings.route_messages;
        const getRoutes = loader.strings.route_locations;
        const storage = loader.packages.path.resolve(`..`, `storage`);
        const configurations = loader.modules.utilities.cfg();
        const options = configurations?.web_hosting_settings?.settings?.ratelimiting; 
        if (options?.enabled) { 
            const settings = this.ratelimit({
                windowMs: options?.window_ms ?? 30_000,
                max: options?.max_requests ?? 125,
                handler: (__, response) => {
                    return response.status(429).json({ message: getMessages.response_ratelimited });
                }
            });
            this.server.use(settings); 
        }
        this.server.set(`trust proxy`, 1);
        this.server.use((request: types.ExpressRequest, response: types.ExpressResponse, next: types.ExpressNext) => {
            for (const key in getMessages.headers) { 
                response.setHeader(key, getMessages.headers[key]); 
            }
            next();
        })
        this.server.use(`/documentation`, this.pkg.static(`${storage}/../storage/www/documentation/`));
        this.server.use(`/assets`, this.pkg.static(`${storage}/www/assets`));
        this.server.use(`/eas`, this.pkg.static(`${storage}/temporary/eas/output`));
        this.server.all(/.*/, (___, response) => {
            return response.sendFile(`${storage}${getRoutes.unknown_direct_path}`);
        })
    }

    
}

export default Init;