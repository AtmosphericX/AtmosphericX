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
    NAME_SPACE: string = `submodule:@middleware:authority`;
    SESSION_INVALID_MESSAGE: string = `Session invalidated`
    RATELIMIT_INVALID_MESSAGE: string =  `Too many requests - please try again later.`
    RESPONSE_HEADERS: Record<string, string> = {
        'Access-Control-Allow-Origin': '*', 'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
        'Access-Control-Allow-Credentials': 'true', 'Strict-Transport-Security': 'max-age=31536000; includeSubDomains; preload',
        'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
        'Pragma': 'no-cache', 'Expires': '0', 'Surrogate-Control': 'no-store',
    }
    constructor() {
        loader.submodules.utils.log(`${this.NAME_SPACE} initialized.`)
        const parentDirectory = loader.packages.path.resolve(`..`, `storage`);
        const ConfigType = loader.cache.internal.configurations as types.ConfigurationsType;
        const limiter = loader.packages.rateLimit({
            windowMs: ConfigType.web_hosting_settings.settings.ratelimiting?.window_ms || 30_000,
            max: ConfigType.web_hosting_settings.settings.ratelimiting?.max_requests || 125,
            handler: (__, response) => {
                return response.status(429).json({ message: this.RATELIMIT_INVALID_MESSAGE});
            }
        })  
        if (ConfigType.web_hosting_settings.settings.ratelimiting?.enabled) { loader.cache.handlers.express.use(limiter); }
        loader.cache.handlers.express.use((request, response, next) => {
            const session = loader.cache.internal.accounts.find(a => a.session == request.headers.cookie?.split(`=`)[1]);
            const address = request.headers['cf-connecting-ip'] || request.connection.remoteAddress;
            const useragent = request.headers['user-agent'] || 'Unknown';
            for (const key in this.RESPONSE_HEADERS) { response.setHeader(key, this.RESPONSE_HEADERS[key]); }
            if (session && session.address !== address || session && session.agent !== useragent) {
                this.invalidateSession(response, session);
            }
            next();
        })
        loader.cache.handlers.express.use(loader.packages.cookieParser());
        loader.cache.handlers.express.use(`/src`, loader.packages.express.static(`${parentDirectory}/www`));
        loader.cache.handlers.express.set(`trust proxy`, 1); 
    }

    /**
     * @function invalidateSession
     * @description
     *      Invalidates the user session and clears the session cookie.
     *      Logs the logout event with the username and IP address.
     *      
     * @param response - The Express response object to send the logout confirmation.
     * @param session - The user session object containing username and session details.
     * @returns A JSON response confirming successful logout.
     */
    private invalidateSession(response, session) {
        loader.cache.internal.accounts = loader.cache.internal.accounts.filter(a => a.session != session.session);
        response.clearCookie(`session`);
        return response.status(401).json({ message: this.SESSION_INVALID_MESSAGE});
    }
}

export default Init;

