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

import * as loader from '../..';
import * as types from '../../@dictionaries/types';

interface LogOptions {  
    title?: string; 
    message?: string; 
    settings?: { 
        console?: boolean; 
        file?: boolean;
        type?: string; 
    }; 
}

interface HTTPOptions { 
    timeout?: number | 5_000; 
    headers?: Record<string, string> | {}; 
    method?: LocalHttpMethod; 
    body?: string 
}

interface WebhookConfigurations { 
    enabled?: boolean;
    discord_webhook?: string;
    webhook_display?: string;
    content?: string;
    webhook_cooldown?: number;
}

type HttpResponse = { message: string; error: boolean; }
type LocalHttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE'

export class Utility {
    name_space: string = `Utility`;
    version_path: string = `../storage/store/version`;
    changelogs_path: string = `../storage/store/changelog`;
    logo_path: string = `../storage/store/current`;
    logo_legacy_path: string = `../storage/store/legacy`;
    logs_directory: string = `../storage/logs/`;
    hashmap_path : string = `../storage/store/hashmap.json`;
    absolute_paths: String[] = [
        `../storage/logs/`,
        `../storage/keys/`,
        `../storage/databases/`,
        `../storage/temporary/`,
        `../storage/temporary/eas/`,
        `../storage/temporary/events/`,
    ]
    config_directory: string = `../configurations`;
    ansi_colors = loader.statics.ansi_colors;
    config_hash: string = null;
    constructor() {
        this.absolute_paths.forEach(path => {
            const resolvedPath = loader.packages.path.resolve(process.cwd(), path);
            if (!loader.packages.fs.existsSync(resolvedPath)) { 
                loader.packages.fs.mkdirSync(resolvedPath, { recursive: true });
            }
        });
        this.configurations();
        this.logo()
        this.getLatestUpdate()
        this.validateConfigurations();
        loader.cache.external.version = this.version();
        loader.cache.external.changelogs = this.changelogs();
        this.log({ 
            title: `${this.ansi_colors.GREEN}${this.name_space}${this.ansi_colors.RESET}`, 
            message: `Successfully initialized`
        });
    }

    /**
     * @public
     * @production
     * @function isFancyDisplay
     * @description
     *      Checks if the fancy display interface is enabled in the configurations.
     * 
     * @return {boolean} - True if fancy display is enabled, false otherwise.
     */
    public isFancyDisplay(): boolean { 
        const configurations = this.cfg();
        return configurations?.display_settings?.fancy_interface ?? false;
    }

    /**
     * @public
     * @production
     * @function getMaxLogLines
     * @description
     *      Calculates the maximum number of log lines to retain based on terminal height.
     * 
     * @return {number} - The maximum number of log lines.
     */
    public getMaxLogLines(): number {
        const getTerminalHeight = loader.packages.process.stdout.rows ?? 24;
        return Math.max(1, (getTerminalHeight / 2) - 2);
    }

    /**
     * @public
     * @production
     * @function log 
     * @description
     *      Logs a message to the console and/or a log file with specified options.
     * 
     * @param {LogOptions} options - The logging options including title, message, and settings.
     * @return {void} 
     */
    public async log(options: LogOptions): Promise<void> {
        const { ansi_colors } = this;
        const title = options?.title ?? `${ansi_colors.RED}[${this.name_space}]${ansi_colors.RESET}`;
        const message = options?.message ?? `No Message Provided`;
        const timestamp = new Date().toLocaleString();
        const logFileName = new Date().toISOString().split('T')[0];
        const isConsole = options?.settings?.console ?? true;
        const isFile = options?.settings?.file ?? false;
        const logType = options?.settings?.type ?? `__console__`;
        if (isConsole) {
            loader.cache.internal.logs[logType].push({ title: title, message: message, timestamp: timestamp})
            if (loader.cache.internal.logs[logType].length > this.getMaxLogLines()) {
                const excessLines = loader.cache.internal.logs[logType].length - this.getMaxLogLines();
                loader.cache.internal.logs[logType].splice(0, excessLines);
            }
            loader.cache.internal.logs[logType].sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());
            if (!this.isFancyDisplay()) { console.log(`[${timestamp}]: [${title}] ${message}`); }
        }
        if (isFile) {
            const logDirectoryPath = loader.packages.path.resolve(process.cwd(), this.logs_directory);
            const logFilePath = loader.packages.path.join(logDirectoryPath, `${logFileName}.log`);
            const stripAnsi = (str: string) => str.replace(/\x1b\[[0-9;]*m/g, '');
            const logEntry = `[${timestamp}]: [${stripAnsi(title)}] ${stripAnsi(message)}\n`;
            if (this.isLimited(`log_file:${logFileName}`, 5, 15000)) return;
            if (!loader.packages.fs.existsSync(logDirectoryPath)) { 
                loader.packages.fs.mkdirSync(logDirectoryPath, { recursive: true });
            }
            loader.packages.fs.appendFileSync(logFilePath, logEntry);
        }
    }

    /**
     * @public
     * @production
     * @function getError
     * @description
     *      Catches and logs unexpected errors with a specified parent context.
     * 
     * @param {unknown} error - The error object to be logged.
     * @param {string} parent - The context or parent function where the error occurred.
     * @return {void}
     */
    public exception(error: unknown, parent: string): void { 
        const msg = error instanceof Error ? error.message : JSON.stringify(error);
        this.log({
            title: `${this.ansi_colors.RED}${parent}${this.ansi_colors.RESET}`,
            message: `An unexpected error occurred: ${msg}`,
            settings: { file: true }
        });
    }

    public async validateConfigurations(): Promise<void> {
        const configurations = this.cfg() ?? {};
        const getHashMap = loader.packages.fs.existsSync(this.hashmap_path) 
            ? JSON.parse(loader.packages.fs.readFileSync(this.hashmap_path, 'utf-8')) as Record<string, string>
            : {};
        const getObKeys = Object.keys(configurations).filter((key: string) => key.endsWith(`:hash`));
        const getHashKeysValues = getObKeys.map((key: string) => {
            const configName = key.replace(`:hash`, ``);
            const expectedHash = configurations[key];
            return { configName, expectedHash };
        });
        while (getHashKeysValues.length != Object.keys(getHashMap).length) {
            this.log({
                title: `${this.ansi_colors.RED}Critical Configuration Error${this.ansi_colors.RESET}`,
                message: loader.strings.configuration_validation_incomplete,
            });
            await this.sleep(100)
        }
        for (const { configName, expectedHash } of getHashKeysValues) {
            const actualHash = getHashMap[configName] ?? null;
            if (actualHash !== expectedHash || actualHash === null) {
                this.log({
                    title: `${this.ansi_colors.RED}Critical Configuration Setup${this.ansi_colors.RESET}`,
                    message: loader.strings.configuration_validation_failed.replace(`{FILE}`, `${configName}.jsonc`),
                    settings: { file: true }
                });
            }
        }
    }

    /**
     * @public
     * @production
     * @error_handling
     * @function configurations
     * @description
     *     Loads and caches configuration files from the configurations directory.
     * 
     * @return {void}
     */
    public configurations(): void {
        try {
            const configurations = loader.packages.fs.existsSync(this.config_directory)
                ? loader.packages.fs.readdirSync(this.config_directory).reduce((acc: Record<string, string>, file: string) => {
                const filePath = `${this.config_directory}/${file}`;
                if (loader.packages.fs.statSync(filePath).isFile()) {
                    try {
                        const fileContent = loader.packages.jsonc.parse(loader.packages.fs.readFileSync(filePath, 'utf-8'));
                        acc = {...acc, ...fileContent};
                    } catch (e) { 
                        this.log({ title: this.name_space, message: `Error parsing configuration file ${file}: ${e.message}`});
                    }
                } 
                return acc;
            }, {} as Record<string, unknown>)  : {};
            loader.cache.internal.configurations = configurations;
            loader.cache.external.configurations = {
                guests_allowed: configurations?.web_hosting_settings?.is_guest_access_allowed ?? false,
                events: configurations?.filters?.listening_events ?? [],
                tones: configurations?.tones ?? [],
                dictionary: configurations?.dictionary ?? {},
                themes: configurations?.themes ?? {},
                slideshow: configurations?.slideshow ?? [],
                dbz_settings: configurations?.dbz_intensity ?? {},
                color_intensity: configurations?.color_intensity ?? {},
                services: configurations?.services ?? {},
                forecasting: configurations?.forecasting ?? {}
            }
            const hash = loader.packages.crypto.createHash('md5').update(JSON.stringify(configurations)).digest('hex');
            if (this.config_hash && this.config_hash !== hash) {
                this.log({ title: `${this.ansi_colors.RED}Config${this.ansi_colors.RESET}`, message: loader.strings.configuration_changed, settings: { file: true } });
            }
            this.config_hash = hash;
        } catch (error) {
            this.exception(error, this.name_space + `.configurations`);
        }
    }

    /**
     * @public
     * @production
     * @error_handling
     * @function logo
     * @description
     *      Displays the appropriate logo based on the fancy display setting.
     * 
     * @return {string | null} - The logo content if fancy display is enabled, otherwise null.
     */
    public logo(): string | null {
        try {
            const isFancyDisplay = this.isFancyDisplay();
            const getType = isFancyDisplay 
                ? this.logo_path : this.logo_legacy_path;
            const getFileContent = loader.packages.fs.existsSync(getType) 
                ? loader.packages.fs.readFileSync(getType, 'utf-8').replace(/\{VERSION\}/g, this.version()) : null;
            if (isFancyDisplay) { return getFileContent;  }
            console.clear();
            console.log(getFileContent);
            return null;
        } catch (error) {
            this.exception(error, this.name_space + `.logo`);
            return null;
        }
    }

    /**
     * @public
     * @production
     * @error_handling
     * @function version
     * @description
     *      Retrieves the current version of the application from the version file.
     * 
     * @return {string} - The current version string.
     */
    public version(): string { 
        try { 
            const getVersion = loader.packages.fs.existsSync(this.version_path) ? loader.packages.fs.readFileSync(this.version_path, 'utf-8')
                : `vUnknown`;
            return getVersion;
        } catch (error) {
            this.exception(error, this.name_space + `.version`);
            return `vUnknown`;
        }
    }

    /**
     * @public
     * @production
     * @error_handling
     * @function changelogs
     * @description
     *     Retrieves the changelogs of the application from the changelog file.
     * 
     * @return {string} - The changelogs content.
     */
    public changelogs(): string {
        try { 
            const getChangelogs = loader.packages.fs.existsSync(this.changelogs_path) ? loader.packages.fs.readFileSync(this.changelogs_path, 'utf-8')
                : `No changelogs available.`;
            return getChangelogs;
        } catch (error) {
            this.exception(error, this.name_space + `.changelogs`);
            return `No changelogs available.`;
        }
    }

    public async getLatestUpdate(): Promise<void> {
        const configurations = this.cfg();
        const tVersion = this.version();
        const documentation = configurations.web_hosting_settings?.documentation_mode ?? false;
        const oFeed = await this.httpRequest(configurations?.internal_settings?.feed_url);
        const oVersion = await this.httpRequest(`https://raw.githubusercontent.com/${configurations?.internal_settings?.version_url}`);
        const latestVersion = oVersion.message.trim().replace(/\n/g, '');
        const normalizeVersion = (version: string): string => {
            return version.split(' ')[0].split('.').map(num => num.padStart(3, '0')).join('.');
        }   
        if (normalizeVersion(tVersion) < normalizeVersion(latestVersion)) {
            loader.modules.utilities.log({
                title: `${this.ansi_colors.YELLOW}Update Available${this.ansi_colors.RESET}`,
                message: loader.strings.update_available
                    .replace(`{CURRENT}`, tVersion)
                    .replace(`{LATEST}`, latestVersion),
                settings: { file: true }
            });
        }
        if (oFeed && oFeed.message) {
            loader.cache.external.announcement = oFeed.message.length > 0 ? oFeed.message : null;
            if (oFeed.message.length > 0) {
                loader.modules.utilities.log({
                    title: `${this.ansi_colors.RED}Announcement${this.ansi_colors.RESET}`,
                    message: oFeed.message,
                    settings: { file: true }
                });
            }
        }
        if (documentation) { 
            loader.modules.utilities.log({
                title: `${this.ansi_colors.BLUE}Documentation Mode${this.ansi_colors.RESET}`,
                message: `Documentation mode is enabled. All core features are disabled.`,
                settings: { file: true }
            });
        }
    }

    /**
     * @public
     * @production
     * @function cfg
     * @description
     *      Retrieves the current cached configurations.
     * 
     * @return {types.Configurations} - The current configurations.
     */
    public cfg(): types.Configurations {
        return loader.cache.internal.configurations as types.Configurations;
    }

    /**
     * @public
     * @production
     * @function sleep
     * @description
     *     Pauses execution for a specified duration.
     * 
     * @param {number} ms - The duration to sleep in milliseconds.
     * @return {Promise<void>} - A promise that resolves after the specified duration.
     */
    public sleep(ms: number): Promise<void> {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    /**
     * @public
     * @production
     * @error_handling
     * @function sanatizeWeb
     * @description
     *    Sanitizes input content by removing HTML tags.
     * 
     * @param {string} content - The content to be sanitized.
     * @return {string | unknown} - The sanitized content.
     */
    public sanatizeWeb(content: unknown): unknown {
        try {
            const strip = (str: string) => str.replace(/<[^>]*>/g, "");
            if (typeof content === "string") {
                try { return this.sanatizeWeb(JSON.parse(content)); } catch { return strip(content); }
            }
            if (Array.isArray(content)) return content.map(item => this.sanatizeWeb(item));
            if (content && typeof content === "object") {
                const obj = content as Record<string, unknown>;
                const result: Record<string, unknown> = {};
                for (const key in obj) {
                    const value = obj[key];
                    result[key] = typeof value === "string" ? strip(value) : this.sanatizeWeb(value);
                }
                return result;
            }
            return content;
        } catch (error) {
            this.exception(error, this.name_space + `.sanatizeWeb`);
            return content;
        }
    }


    /**
     * @public
     * @production
     * @error_handling
     * @function isLimited
     * @description
     *    Checks if a certain action type has exceeded the defined rate limit.
     *
     * @param {string} type - The type of action to check.
     * @param {number} maxThreshold - The maximum number of allowed actions within the time frame.
     * @param {number} maxThresholdTime - The time frame in milliseconds.
     * @returns {boolean} - True if the action is limited, false otherwise.
     */
    public isLimited(type: string, maxThreshold: number, maxThresholdTime: number): boolean {
        try {
            const now = Date.now();
            const windowStart = now - maxThresholdTime;
            const limiters = loader.cache.internal.limiters.filter(l => l.timestamp > windowStart);
            const count = limiters.reduce((acc, l) => acc + (l.type === type ? 1 : 0), 0);
            loader.cache.internal.limiters = limiters;
            if (count >= maxThreshold) {
                return true;
            }
            loader.cache.internal.limiters.push({ type, timestamp: now });
            return false;
        } catch (error) {
            this.exception(error, this.name_space + `.isLimited`);
            return false;
        }
    }


    /**
     * @public
     * @production
     * @error_handling
     * @function httpRequest
     * @description
     *    Makes an HTTP GET request to the specified URL with optional settings.
     *
     * @param {string} url - The URL to send the request to.
     * @param {HTTPOptions} [options] - Optional HTTP request settings.
     * @returns {Promise<HttpResponse>} - A promise that resolves with the response data.
     */
    public async httpRequest(url: string, options?: HTTPOptions): Promise<HttpResponse> {
        try {
            const cfg = this.cfg();
            const timeout = cfg?.internal_settings?.request_timeout * 1000;
            const finalOptions: HTTPOptions = {
                timeout: options?.timeout ?? timeout,
                headers: {
                    ...loader.statics.default_http_headers,
                    ...(options?.headers ?? {}),
                    "User-Agent": `AtmosphericX/${this.version()}`
                },
                method: options?.method ?? "GET",
                body: options?.body ?? null
            };
            const response = await loader.packages.axios({
                url,
                method: finalOptions.method,
                data: finalOptions.body,
                headers: finalOptions.headers,
                timeout: finalOptions.timeout,
                maxRedirects: 0,
                httpsAgent: new loader.packages.https.Agent({ rejectUnauthorized: false }),
                validateStatus: (status: number) => status === 200
            });
            return { message: response.data, error: false };
        } catch (error) {
            const message = error instanceof Error ? error.message : JSON.stringify(error);
            return { message, error: true };
        }
    }

    
    /**
     * @public
     * @production
     * @error_handling
     * @function sendWebhook
     * @description
     *    Sends a message to a Discord webhook with specified settings.
     *
     * @param {WebhookConfigurations} settings - The webhook configuration settings.
     * @param {string} title - The title of the webhook message.
     * @param {string} message - The content of the webhook message.
     * @returns {Promise<void>} - A promise that resolves when the message has been sent.
     */
    public async sendWebhook(settings: WebhookConfigurations, title: string, message: string): Promise<void> {
        try {
            if (!settings?.enabled || !settings?.discord_webhook) return;
            if (!settings?.discord_webhook.startsWith("https://")) return;
            const cooldown = (settings?.webhook_cooldown ?? 5) * 1000;
            if (this.isLimited(`webhook.${settings?.discord_webhook}`, 3, cooldown)) return;
            if (message.length > 1900) {
                message = message.substring(0, 1900) + "\n\n[Message truncated due to length]";
                const blockCount = (message.match(/```/g) || []).length;
                if (blockCount % 2 !== 0) message += "```";
            }
            const embed = {
                title,
                description: message,
                color: 16711680,
                timestamp: new Date().toISOString(),
                footer: { text: title }
            };
            await loader.packages.axios.post(settings?.discord_webhook, {
                username: settings?.webhook_display ?? "AtmosphericX Alerts",
                content: settings?.content ?? "",
                embeds: [embed],
            });
            loader.cache.internal.limiters.push({
                type: `webhook:${settings?.discord_webhook}`,
                timestamp: Date.now()
            });
        } catch (error) {
            this.exception(error, this.name_space + `.sendWebhook`);
        }
    }
}

export default Utility