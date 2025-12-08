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
    NAME_SPACE: string = `submodule:@routes:login`;
    SESSION_ACCOUNT_INACTIVE_MESSAGE: string = `Account is not activated. Please contact the host administrator. If this is your instance, you must activate your account via the root account.`
    SESSION_ACCOUNT_DUPLICATE_MESSAGE: string = `An active session already exists for this account. Please logout from other sessions before logging in again.`
    SESSION_INVALID_MESSAGE: string = `Invalid username or password.`
    SESSION_SUCCESS_MESSAGE: string = `Login successful.`
    constructor() {
        loader.submodules.utils.log(`${this.NAME_SPACE} initialized.`)
        loader.cache.handlers.express.post(`/api/login`, async (request: Record<string, any>, response: Record<string, any>) => { 
            try {
                const ConfigType = loader.cache.internal.configurations as types.ConfigurationsType;
                const body = JSON.parse(await new Promise((resolve, reject) => { let data = ``; request.on(`data`, chunk => data += chunk); request.on(`end`, () => resolve(data)); request.on(`error`, error => reject(error)); }));
                const username = body.username ?? null;
                const password = body.password ? loader.packages.crypto.createHash(`sha256`).update(body.password).digest(`base64`) : null;
                if (!username || !password) {
                    return response.status(400).json({ message: this.SESSION_INVALID_MESSAGE });
                }
                const account = loader.submodules.database.query(`SELECT * FROM accounts WHERE username = ? AND hash = ? LIMIT 1`, [username, password]);
                if (account.length == 0) { 
                    loader.submodules.utils.log(`${this.NAME_SPACE} - Failed login attempt for username: ${username} @ ${request.headers['cf-connecting-ip'] || request.connection.remoteAddress}`);
                    return response.status(401).json({ message: this.SESSION_INVALID_MESSAGE });
                }
                if (account[0].activated == 0) {
                    loader.submodules.utils.log(`${this.NAME_SPACE} - Inactive account login attempt for username: ${username} @ ${request.headers['cf-connecting-ip'] || request.connection.remoteAddress}`);
                    return response.status(403).json({ message: this.SESSION_ACCOUNT_INACTIVE_MESSAGE });
                }
                if (loader.cache.internal.accounts.find(a => a.username == username)) {
                    loader.submodules.utils.log(`${this.NAME_SPACE} - Duplicate login attempt for username: ${username} @ ${request.headers['cf-connecting-ip'] || request.connection.remoteAddress}`);
                    return response.status(409).json({ message: this.SESSION_ACCOUNT_DUPLICATE_MESSAGE });
                }
                const session = loader.packages.crypto.randomBytes(32).toString('hex');
                response.cookie(`session`, session, {
                    httpOnly: true,
                    secure: ConfigType.web_hosting_settings.settings.is_https,
                    sameSite: 'lax',
                    maxAge: 7 * 24 * 60 * 60 * 1_000
                })
                loader.cache.internal.accounts.push({
                    username, 
                    session, 
                    address: request.headers['cf-connecting-ip'] || request.connection.remoteAddress,
                    agent: request.headers['user-agent'] || 'unknown',
                })
                loader.submodules.utils.log(`${this.NAME_SPACE} - Successful login for username: ${username} @ ${request.headers['cf-connecting-ip'] || request.connection.remoteAddress}`);
                return response.status(200).json({ message: this.SESSION_SUCCESS_MESSAGE });
            } catch (error) {
                loader.submodules.utils.log(`${this.NAME_SPACE} ERROR: ${error.message}`);
                return response.status(500).json({ message: `Internal server error.` });
            }
        });
    }



}

export default Init;

