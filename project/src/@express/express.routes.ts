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

import * as loader from '..'
import * as types from '../@dictionaries/types';

type AccountDatabaseRecord = { 
    id: number;
    username: string;
    hash: string;
    activated: number;
    role: number;
    created_at: string;
    updated_at: string;
}

type Certificates = { 
    key: string;
    certificate: string;
}

type UserSession = { 
    session?: string
    session_data?: Record<string, string>
    address?: string
    useragent?: string 
}

export class Routes { 
    name_space: string = `Express.Routing`;
    ansi_colors = loader.modules.utilities.ansi_colors;
    pkg = loader.packages.express;
    mgr = null;
    constructor() {
        loader.modules.utilities.log({ 
            title: `${this.ansi_colors.GREEN}${this.name_space}${this.ansi_colors.RESET}`, 
            message: `Successfully initialized`
        });
        this.initialize();
    }

    /**
     * @private
     * @production
     * @error_handling (THIS WILL CATCH AND LOG ERRORS DURING INITIALIZATION AND TERMINATE THE PROCESS)
     * @function initialize
     * @description
     *      Initializes the Express server based on configuration settings.
     *      Sets up HTTP or HTTPS server, logs server status, and loads routing modules.
     * 
     * @return {void}
     */
    private initialize(): void {
        try  {
            this.mgr = loader.cache.handlers.express = this.pkg();
            const configurations = loader.modules.utilities.cfg();
            const options = configurations?.web_hosting_settings;
            const isHttps = options?.settings?.is_https;
            const getPort = options?.settings?.port_number;
            const isLogonRequired = options?.is_login_required;
            if (!isLogonRequired) {
                loader.modules.utilities.log({
                    title: `${this.ansi_colors.RED}Security${this.ansi_colors.RESET}`,
                    message: `${this.ansi_colors.RED}${loader.strings.portal_disabled_warning}${this.ansi_colors.RESET}`,
                    settings: { file: true }
                });
            }
            switch (isHttps) { 
                case true: 
                    const certificates = this.getCertificates();
                    loader.cache.handlers.http_server = loader.packages.https.createServer(certificates, this.mgr).listen(getPort, () => {
                        loader.modules.utilities.log({ 
                            title: `${this.ansi_colors.GREEN}Express.Server${this.ansi_colors.RESET}`, 
                            message: `HTTPS Server listening on port ${this.ansi_colors.CYAN}${getPort}${this.ansi_colors.RESET}` 
                        });
                    }).on('error', (error) => {
                        loader.modules.utilities.exception(error, this.name_space + `.initialize`)
                    });
                    break;
                case false:
                    loader.cache.handlers.http_server = loader.packages.http.createServer(this.mgr).listen(getPort, () => {
                    loader.modules.utilities.log({ 
                        title: `${this.ansi_colors.GREEN}Express.Server${this.ansi_colors.RESET}`, 
                        message: `HTTP Server listening on port ${this.ansi_colors.CYAN}${getPort}${this.ansi_colors.RESET}` 
                    });
                    }).on('error', (error) => {
                        loader.modules.utilities.exception(error, this.name_space + `.initialize`)
                    });
                    break;
                default: 
                    throw new Error(`Invalid HTTPS configuration value: ${isHttps}`);
            }
            this.modules();
        } catch (error) {
            loader.modules.utilities.exception(error, this.name_space + `.initialize`)
        }
    }

    /**
     * @private
     * @production
     * @error_handling
     * @function modules
     * @description
     *      Loads routing modules for the Express server.
     *      This function is intended to be expanded with additional routing modules as needed.
     * 
     * @return {void}
     */
    private async modules(): Promise<void> {
        const configurations = loader.modules.utilities.cfg();
        const options = configurations?.web_hosting_settings;
        if (!options?.documentation_mode) {
            loader.modules.http_get_cache = new (await import('./@routes/@data/routes.data.cache')).Init();
            loader.modules.http_get_query = new (await import('./@routes/@data/routes.data.query')).Init();
            loader.modules.http_get_events = new (await import('./@routes/@data/routes.data.event')).Init();
            loader.modules.http_post_create = new (await import('./@routes/@data/routes.data.create')).Init();
            loader.modules.http_post_login = new (await import('./@routes/@portal/routes.portal.login')).Init();
            loader.modules.http_post_logout = new (await import('./@routes/@portal/routes.portal.logout')).Init();
            loader.modules.http_post_signup = new (await import('./@routes/@portal/routes.portal.signup')).Init();
            loader.modules.http_post_reset = new (await import('./@routes/@portal/routes.portal.reset')).Init();
            loader.modules.http_post_setup = new (await import('./@routes/@portal/routes.portal.setup')).Init();
            loader.modules.placefiles = new (await import('./@routes/@placefiles/routes.placefiles.authority')).Init();
            loader.modules.http_widgets = new (await import('./@routes/@core/routes.core.widgets')).Init();
        }
        loader.modules.http_core = new (await import('./@routes/@core/routes.core.dashboard')).Init();
        loader.modules.websockets = new (await import('./@websockets/websockets.authority')).Init();
        loader.modules.middleware = new (await import('./@middleware/middleware.authority')).Init();
        return;
    }

    /**
     * @private
     * @production
     * @error_handling (THIS WILL TERMINATE THE PROCESS IF CERTIFICATES CANNOT BE LOADED)
     * @function getCertificates
     * @description
     *      Loads SSL/TLS certificates from the file system based on configuration settings.
     *      If the certificate files are not found or an error occurs during loading,
     *      logs an error message and terminates the process.
     * 
     * @return {Object} An object containing the loaded 'key' and 'certificate' strings.
     */
    private getCertificates(): Certificates {
        try { 
            const configurations = loader.modules.utilities.cfg();
            const options = configurations?.web_hosting_settings;
            const getKey = options?.settings?.certification_paths.private_key_path;
            const getCert = options?.settings?.certification_paths.certificate_path;
            if (!loader.packages.fs.existsSync(getKey) || !loader.packages.fs.existsSync(getCert)) {
                throw new Error(`SSL/TLS certificate files not found at specified paths.`);
            }
            return {
                key: loader.packages.fs.readFileSync(getKey, 'utf8'),
                certificate: loader.packages.fs.readFileSync(getCert, 'utf8')
            }
        } catch (error) {
            loader.modules.utilities.exception(error, this.name_space + `.getCertificates`)
            process.exit(1);
        }
    }

    /**
     * @public
     * @production
     * @error_handling
     * @function invalidateUserSession
     * @description
     *      Invalidates a user session by removing it from the internal session cache
     *      and clearing the session cookie from the response. Returns a JSON response
     *      indicating the result of the operation.
     * 
     * @param {Object} response - The Express response object to send the result.
     * @param {string} session - The session identifier to invalidate.
     * @param {string} [kickMessage] - Optional custom message to include in the response.
     * @return {Object} A JSON response indicating success or failure of the session invalidation.
     */
    public invalidateUserSession(response: types.ExpressRequest, session: string, kickMessage?: string): Record<string, string | number> {
        const getMessages = loader?.strings?.route_messages;
        try { 
            loader.cache.internal.http_sessions = loader.cache.internal.http_sessions
                .filter(sessionItem => sessionItem.session !== session);
            response.clearCookie(`session`);
            loader.modules.utilities.log({
                title: `${this.ansi_colors.GREEN}${this.name_space}${this.ansi_colors.RESET}`,
                message: `Session ${this.ansi_colors.CYAN}${session}${this.ansi_colors.RESET} invalidated successfully.`,
                settings: { file: true }
            });
            return response.status(200).json({
                message: kickMessage ?? getMessages?.session_logout_message,
                status: 200
            })
        } catch (error) {
            loader.modules.utilities.exception(error, this.name_space + `.invalidateUserSession`)
            return response.status(500).json({
                message: getMessages?.response_generic_error,
                status: 500
            });
        }
    }

    /**
     * @public
     * @production
     * @error_handling
     * @function createUserSession
     * @description
     *     Creates a new user session by setting a session cookie in the response
     *     and adding the session details to the internal session cache. Logs the successful login event.
     * 
     * @param {Object} response - The Express response object to set the cookie.
     * @param {string} username - The username associated with the session.
     * @param {number} role - The role of the user.
     * @param {string} address - The IP address of the user.
     * @param {string} useragent - The user agent string of the user's browser.
     * @param {string} session - The session identifier to create.
     * @return {Object} A JSON response indicating successful session creation.
     */
    public createUserSession(response: types.ExpressResponse, username: string, role: number, address: string, useragent: string, session: string): string {
        const getMessages = loader.strings.route_messages;
        try {
            const configurations = loader.modules.utilities.cfg();
            const options = configurations?.web_hosting_settings;
            const getSession = loader.cache.internal.http_sessions.find(a => a.username == username) ?? null;
            if (getSession) {
                if ((options?.settings?.account_protection?.duplicate_session_prevention) && (getSession?.address != address || getSession?.useragent != useragent)) {
                    loader.modules.utilities.log({
                        title: `${this.ansi_colors.YELLOW}${this.name_space}${this.ansi_colors.RESET}`,
                        message: `Duplicate session login attempt for ${this.ansi_colors.CYAN}${username}${this.ansi_colors.RESET} from ${this.ansi_colors.CYAN}${address}${this.ansi_colors.RESET}`,
                        settings: { file: true }
                    });
                    return response.status(409).json({ message: getMessages.response_account_duplicate });
                }
            }
            response.cookie(`session`, session, {
                httpOnly: true, secure: options?.settings?.is_https,
                sameSite: 'lax', maxAge: 7 * 24 * 60 * 60 * 1_000,
            })
            loader.cache.internal.http_sessions.push({
                session: session, username: username,
                role: role, created_at: Date.now(),
                address: address, useragent: useragent
            });
            loader.modules.utilities.log({
                title: `${this.ansi_colors.GREEN}${this.name_space}${this.ansi_colors.RESET}`,
                message: `User ${this.ansi_colors.CYAN}${username}${this.ansi_colors.RESET} logged in successfully from ${this.ansi_colors.CYAN}${address}${this.ansi_colors.RESET}`,
                settings: { file: true }
            });
            if (loader.cache.internal.login_attempts[username]) {
                delete loader.cache.internal.login_attempts[username];
            }
            return response.status(200).json({ message: getMessages.response_login_success });
        } catch (error) {
            loader.modules.utilities.exception(error, this.name_space + `.createUserSession`)
            return response.status(500).json({ message: getMessages.response_generic_error });
        }
    }

    /**
     * @public
     * @production
     * @function getUserSession
     * @description
     *     Retrieves the user session identifier from the request headers.
     * 
     * @param {Object} request - The Express request object containing headers.
     * @return {string | null} The session identifier if found, otherwise null.
     */
    public getUserSession(request: types.ExpressRequest): UserSession {
        const sessionCookie = request.headers.cookie?.split(';').find((a: string) => a.trim().startsWith('session='))?.split('=')[1];
        const sessionData = loader.cache.internal.http_sessions.find(a => a.session == sessionCookie);
        return {
            session: sessionData?.session ?? null,
            session_data: sessionData ?? null,
            address: request.headers['cf-connecting-ip'] ?? request.connection.remoteAddress ?? `Unknown`,
            useragent: request.headers['user-agent'] ?? 'Unknown'
        }
    }

    /**
     * @public
     * @production
     * @error_handling
     * @function isAccountRequestValid
     * @description
     *      Validates the username and password against predefined character sets and length requirements.
     *      Returns true if both username and password are valid, otherwise returns an error message.
     * 
     * @param {string} username - The username to validate.
     * @param {string} password - The password to validate.
     * @return {boolean | string} True if valid, otherwise an error message string.
     */
    public isAccountRequestValid(username: string, password: string): boolean | string { 
        try {
            const getMessages = loader.strings.route_messages;
            const getUsernameRegex = loader.strings.username_chars;
            const getPasswordRegex = loader.strings.password_chars;
            if (!getUsernameRegex.test(username) || !getPasswordRegex.test(password)) {
                return getMessages.response_invalid_string;
            }
            return true;
        } catch (error) {
            loader.modules.utilities.exception(error, this.name_space + `.isAccountRequestValid`)
            return false;
        }
    }

    /**
     * @public
     * @production
     * @error_handling
     * @function getAccountByUsername
     * @description
     *      Retrieves an account record from the database by username.
     *      Returns the account record if found, otherwise returns null.
     * 
     * @param {string} username - The username of the account to retrieve.
     * @return {Promise<AccountDatabaseRecord | null>} The account record or null if not found.
     */
    public async getAccountByUsername(username: string): Promise<AccountDatabaseRecord | null> {
        try { 
            const query = `SELECT * FROM accounts WHERE username = ? LIMIT 1`;
            const result = await loader.modules.database.query(query, [username]);
            return result?.[0] ?? null;
        } catch (error) {
            loader.modules.utilities.exception(error, this.name_space + `.getAccountByUsername`)
            return null;
        }
    }

    /**
     * @public
     * @production
     * @error_handling
     * @function isAccountProtectionActivated
     * @description
     *     Checks if account protection is activated for a given username based on login attempts.
     *     Returns true if the account is currently locked, otherwise false.
     * 
     * @param {string} username - The username to check for account protection.
     * @return {boolean} True if account protection is activated, otherwise false.
     */
    public isAccountProtectionActivated(username: string): boolean { 
        try {
            const configurations = loader.modules.utilities.cfg();
            const protectionSettings = configurations.web_hosting_settings?.settings?.account_protection;
            const maxAttempts = protectionSettings?.max_login_attempts;
            const lockoutDuration = protectionSettings?.lockout_duration_minutes;
            const currentTime = Date.now();
            const getAttempts = loader.cache.internal.login_attempts[username] ?? { count: 0, lastAttempt: 0, lockedUntil: 0 };
            if (getAttempts.lockedUntil > currentTime) {
                return true;
            }
            if (getAttempts.count >= maxAttempts) {
                getAttempts.lockedUntil = currentTime + (lockoutDuration * 60_000);
                getAttempts.count = 0;
                loader.cache.internal.login_attempts[username] = getAttempts;
                return true;
            }
            getAttempts.count += 1;
            getAttempts.lastAttempt = currentTime;
            loader.cache.internal.login_attempts[username] = getAttempts;
            return false;
        } catch (error) {
            loader.modules.utilities.exception(error, this.name_space + `.isAccountProtectionActivated`)
            return false;
        }
    }

    /**
     * @public
     * @production
     * @error_handling
     * @function getRequestBody
     * @description
     *    Retrieves and parses the JSON body from an Express request.
     *  
     * @param {Object} request - The Express request object.
     * @return {Promise<Object>} A promise that resolves to the parsed request body.
     */
    public async getRequestBody(request: types.ExpressRequest): Promise<Record<string, string>> {
        if (parseInt(request.headers['content-length'] || '0') > 5_000) {
            throw new Error('Request body too large');
        }
        return JSON.parse(await new Promise((resolve, reject) => { 
            let data = ``; 
            request.on(`data`, chunk => data += chunk); 
            request.on(`end`, () => resolve(data)); 
            request.on(`error`, error => reject(error)); 
        }));
    }
}

export default Routes;