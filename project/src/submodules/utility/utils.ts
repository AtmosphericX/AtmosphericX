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

import * as loader from '../../bootstrap';
import * as types from '../../types';

export class Utils { 
    NAME_SPACE: string = `submodule:utils`;
    VERSION_PATH: string = `../version`
    LOGO_PATH: string = `../storage/logo.txt`
    LOGO_LEGACY_PATH: string = `../storage/logo-legacy.txt`
    LOGS_PATH: string = `../storage/logs.txt`
    CONFIGURATIONS_PATH: string = `../configurations`
    CONFIG_HASH: string = null;
    constructor() {
        this.configurations();
        this.logo();
        this.log(`${this.NAME_SPACE} initialized.`)
    }
    
    /**
     * @function sleep
     * @description
     *     Pauses execution for the given number of milliseconds.
     * 
     * @param {number} ms
     * @returns {Promise<void>}
     */
    public sleep(ms: number): Promise<void> {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    /**
     * @function version
     * @description
     *     Reads and returns the current application version from VERSION_PATH, 
     *     or defaults to "v0.0.0" if the file does not exist.
     * 
     * @returns {string}
     */
    public version(): string {
        const version = loader.packages.fs.existsSync(this.VERSION_PATH) 
            ? loader.packages.fs.readFileSync(this.VERSION_PATH, `utf-8`).replace(/\n/g, ``) 
            : `v0.0.0`;
        return version
    }

    /**
     * @function isFancyDisplay
     * @description
     *     Checks if the fancy interface display setting is enabled in the configuration.
     * 
     * @returns {boolean}
     */
    public isFancyDisplay(): boolean {
        return (loader.cache.internal.configurations as types.ConfigurationsType).display_settings.fancy_interface || false;
    }

    /**
     * @function logo
     * @description
     *     Returns the application logo as a string. If fancy interface is disabled,
     *     also prints the logo to the console.
     * 
     * @returns {string | void}
     */
    public logo(): string | void{
        const path = this.isFancyDisplay() ? this.LOGO_PATH : this.LOGO_LEGACY_PATH;
        const ConfigType = loader.cache.internal.configurations as types.ConfigurationsType;
        const logo = loader.packages.fs.existsSync(path) 
            ? loader.packages.fs.readFileSync(path, `utf-8`).replace(`{VERSION}`, this.version()) 
            : `AtmosphericX {VERSION}`;
        if (ConfigType.display_settings.fancy_interface) { return logo } 
        console.clear();
        console.log(logo);
    }

    /**
     * @function log
     * @description
     *     logs a message in the console and internal cache with options for formatting.
     * 
     * @param {string} [message]
     * @param {types.LogOptions} [options]
     * @param {string} [logType]
     * @returns {void}
     */
    public log(message?: string, options?: types.LogOptions, logType: string = `__console__`): void {
        const title = options?.title || `\x1b[32m[ATMOSX-UTILS]\x1b[0m`;
        const msg = message || `No message provided.`;
        const rawConsole = options?.rawConsole || false;
        const echoFile = options?.echoFile || false;
        if (!rawConsole) {
            loader.cache.internal.logs[logType].push({title: title, message: msg, timestamp: new Date().toLocaleString()}); 
            if (loader.cache.internal.logs[logType].length > 25) { loader.cache.internal.logs[logType].shift(); }
        }
        if (rawConsole || !this.isFancyDisplay()) { console.log(`${title}\x1b[0m [${new Date().toLocaleString()}] ${msg}`); }
        if (echoFile) { 
            loader.packages.fs.appendFileSync(this.LOGS_PATH, `[${title.replace(/\x1b\[[0-9;]*m/g, '')}] [${new Date().toLocaleString()}] ${msg}\n`);
        }
    }

    /**
     * @function log
     * @description
     *     Logs a message to the internal cache, console, and optionally to a log file.
     *     This will also check a hash to see if the configurations have changed and notify.
     * 
     * @param {string} [message]
     * @param {types.LogOptions} [options]
     * @param {string} [logType]
     * @returns {void}
     */
    public configurations(): void {
        let configurations = loader.packages.fs.existsSync(this.CONFIGURATIONS_PATH)
            ? loader.packages.fs.readdirSync(this.CONFIGURATIONS_PATH).reduce((acc: Record<string, any>, file: string) => {
            const filePath = `${this.CONFIGURATIONS_PATH}/${file}`;
            if (loader.packages.fs.statSync(filePath).isFile()) {
                try {
                    const fileContent = loader.packages.jsonc.parse(loader.packages.fs.readFileSync(filePath, 'utf-8'));
                    acc = {...acc, ...fileContent};
                } catch (e) { 
                    this.log(`Failed to parse ${file}, malfored JSONC configuration`); process.exit(1); 
                }
            } 
            return acc;
            }, {} as Record<string, unknown>)  : {};
        loader.cache.internal.configurations = configurations
        loader.cache.external.configurations = {
            alerts: configurations.filters?.listening_events,
            tones: configurations.tones,
            dictionary: configurations.alert_dictionary,
            themes: configurations.themes,
            slideshow: configurations.slideshow, 
            dbz_intensity: configurations.dbz_intensity,
            third_party_services: configurations.third_party_services,
            forecasting_services: configurations.forecasting_services,
        };
        const configString = JSON.stringify(configurations);
        const configHash = loader.packages.crypto.createHash('md5').update(configString).digest('hex');
        if (this.CONFIG_HASH && this.CONFIG_HASH !== configHash) {
            this.log(`Configuration change detected. Please restart AtmosphericX to apply changes as some configurations will not change during runtime.`, { title: `\x1b[31m[ATMOSX-UTILS]\x1b[0m`, echoFile: true });
        }
        this.CONFIG_HASH = configHash;
    }
    
    /**
     * @function filterWebContent
     * @description
     *     Recursively removes HTML tags from strings within a given input.
     *     If the input is a JSON string, it attempts to parse it first.
     *     Supports nested objects and arrays, sanitizing all string values.
     *
     * @param {string | unknown} content
     * @returns {unknown}
     */
    public filterWebContent(content: string): string | unknown {
        if (typeof content == 'string') try { content = JSON.parse(content); } catch (e) { return content.replace(/<[^>]*>/g, ''); }
        if (Array.isArray(content)) return content.map(item => this.filterWebContent(item));
        if (typeof content == 'object' && content !== null) {
            const obj = content as Record<string, any>;
            for (let key in obj) {
                let value = obj[key];
                obj[key] = typeof value == 'string' ? value.replace(/<[^>]*>/g, '') : this.filterWebContent(value);
            }
        }
        return content;
    }
}

export default Utils;

