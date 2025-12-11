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
    NAME_SPACE: string = `submodule:@routes:signup`;
    SESSION_ACCOUNT_EXISTS_MESSAGE: string = `Account with this username already exists.`
    SESSION_INVALID_USERNAME_MESSAGE: string  = `Invalid username. Usernames must be 3-20 characters long and can only contain letters, numbers, underscores, hyphens, and periods.`
    SESSION_SUCCESS_MESSAGE: string  = `Account created successfully. Please contact the host administrator to activate your account.`
    ALLOWED_CHARS: RegExp = /^[a-zA-Z0-9_\-\.]{3,20}$/;
    constructor() {
        loader.submodules.utils.log(`${this.NAME_SPACE} initialized.`)
        loader.cache.handlers.express.post(`/api/signup`, async (request: Record<string, any>, response: Record<string, any>) => {
            try { 
                const body = JSON.parse(await new Promise((resolve, reject) => { let data = ``; request.on(`data`, chunk => data += chunk); request.on(`end`, () => resolve(data)); request.on(`error`, error => reject(error)); }));
                const username = body.username ?? null;
                const password = body.password ? loader.packages.crypto.createHash(`sha256`).update(body.password).digest(`base64`) : null;
                if (!username || !password) {
                    return response.status(400).json({ message: this.SESSION_INVALID_USERNAME_MESSAGE });
                }
                const account = loader.submodules.database.query(`SELECT * FROM accounts WHERE username = ? LIMIT 1`, [username]);
                if (account.length != 0) {
                    return response.status(409).json({ message: this.SESSION_ACCOUNT_EXISTS_MESSAGE });
                }
                if (!this.ALLOWED_CHARS.test(username)) {
                    return response.status(400).json({ message: this.SESSION_INVALID_USERNAME_MESSAGE });
                }
                loader.submodules.database.query(`INSERT INTO accounts (username, hash, activated) VALUES (?, ?, ?)`, [username, password, 0]);
                loader.submodules.utils.log(`${this.NAME_SPACE} - New account created for username: ${username} @ ${request.headers['cf-connecting-ip'] ?? request.connection.remoteAddress}`);
                return response.status(201).json({ message: this.SESSION_SUCCESS_MESSAGE });
            } catch (error) {
                loader.submodules.utils.log(`${this.NAME_SPACE} ERROR: ${error.message}`);
                return response.status(500).json({ message: `Internal server error.` });
            }
        });
    } 
}

export default Init;

