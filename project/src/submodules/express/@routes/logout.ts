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
    NAME_SPACE: string = `submodule:@routes:logout`;
    SESSION_INVALID_MESSAGE: string = `Session invalidated`
    SESSION_LOGOUT_SUCCESS_MESSAGE: string = `Logout successful.`
    SESSION_LOGOUT_NO_ACTIVE_MESSAGE: string = `No active session found.`
    constructor() {
        loader.submodules.utils.log(`${this.NAME_SPACE} initialized.`)
        loader.cache.handlers.express.post(`/api/logout`, (request: Record<string, any>, response: Record<string, any>) => {
            try {
                const session = loader.cache.internal.accounts.find(a => a.session == request.headers.cookie?.split(`=`)[1]);
                if (!session) { 
                    return response.status(401).json({ message: this.SESSION_LOGOUT_NO_ACTIVE_MESSAGE});
                }
                loader.submodules.utils.log(`${this.NAME_SPACE} - Successful logout for username: ${session.username} @ ${request.headers['cf-connecting-ip'] || request.connection.remoteAddress}`);
                return this.invalidateSession(response, session);
            } catch (error) {
                loader.submodules.utils.log(`${this.NAME_SPACE} ERROR: ${error.message}`);
                return response.status(500).json({ message: `Internal server error.` });
            }
        });
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

