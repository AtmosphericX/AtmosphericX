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

export class Display {
    NAME_SPACE: string = `submodule:display`;
    MANAGER: any;
    PACKAGE: typeof loader.packages.gui;
    private elements: any = {};
    constructor() {
        (async () => {
            loader.submodules.utils.log(`${this.NAME_SPACE} initialized.`);
            const term = loader.packages.process.env.TERM || '';
            const isGitBash = loader.packages.process.env.MSYSTEM && loader.packages.process.env.MSYSTEM.startsWith('MINGW');
            const unsupportedTerms = ['dumb', 'cons25', 'emacs', 'cygwin'];
            if (isGitBash || unsupportedTerms.includes(term)) {
                console.log(`Fancy display is not supported in your terminal environment.\nRevert to legacy display mode within configurations.`);
                return;
            }
            if (!loader.submodules.utils.isFancyDisplay()) { return; }
            this.PACKAGE = loader.packages.gui;
            this.MANAGER = this.PACKAGE.screen({ 
                smartCSR: true,
                title: `AtmosphericX v${loader.submodules.utils.version()}`,
            });
            this.MANAGER.key(['escape', 'C-c'], (ch, key) => { return process.exit(0); });
            await this.intro(1_000);
            this.create();
            this.update();
            setInterval(() => { this.update(); }, 1_000);
        })();
    }
    
    /**
     * @function intro
     * @description
     *     Displays an introductory screen with logo and console logs
     *     for a specified duration before transitioning to the main display.
     *
     * @param {number} delay
     * @returns {Promise<void>}
     */
    private intro(delay: number): Promise<void> {
        const ConfigType = loader.cache.internal.configurations as types.ConfigurationsType;
        return new Promise(async (resolve) => {
            const tempLogo = this.PACKAGE.box({
                ...ConfigType.display_settings.intro_screen,
                content: loader.submodules.utils.logo(),
            })
            const tempConsole = this.PACKAGE.box({
                ...ConfigType.display_settings.intro_console,
                label: ` Preparing AtmosphericX v${loader.submodules.utils.version()} `,
                content: loader.cache.internal.logs.__console__.map(log => {return `${log.title} [${log.timestamp}] ${log.message}`}).join('\n'),
            })
            
            this.MANAGER.append(tempLogo);
            this.MANAGER.append(tempConsole);
            this.MANAGER.render();
            await loader.submodules.utils.sleep(delay);
            tempLogo.destroy();
            tempConsole.destroy();
            resolve();
        });
    }
    
    /**
     * @function create
     * @description
     *     Creates and appends the main display elements (logs, system info, and events)
     *     to the Blessed screen manager.
     *
     * @returns {void}
     */
    private create(): void {
        const ConfigType = loader.cache.internal.configurations as types.ConfigurationsType;
        const dS = ConfigType.display_settings;
        this.elements = {
            logs: this.PACKAGE.box({ ...dS.logging_window, label: ` AtmosphericX v${loader.submodules.utils.version()} ` }),
            system: this.PACKAGE.box({ ...dS.system_info_window }),
            sessions: this.PACKAGE.box({ ...dS.sessions_window }),
            events: this.PACKAGE.box({ ...dS.events_window })
        };
        for (const key in this.elements) {
            this.MANAGER.append(this.elements[key]);
        }
        this.MANAGER.render();
    }

    /**
     * @function update
     * @description
     *     Updates the main display elements on the Blessed screen, including events,
     *     system information, and console logs. Handles both legacy and fancy interface feeds.
     *
     * @returns {void}
     */
    private update(): void {
        if (!loader.submodules.utils.isFancyDisplay()) { return; }
        const ConfigType = loader.cache.internal.configurations as types.ConfigurationsType;
        this.modifyElement(`events`, 
            !ConfigType.display_settings.fancy_interface_feed ? 
                loader.cache.internal.logs.__events__.map(log => {return `[${log.timestamp}] ${log.message}`}).join('\n') : 
                loader.submodules.alerts.returnAlertText({}, true),
            ` Active Events (X${loader.cache.external.events.features.length}) - ${loader.cache.internal.getSource} `
        )        
        this.elements.system.setContent(loader.strings.system_info
            .replace(`{UPTIME}`, loader.submodules.calculations.formatDuration(Date.now() - loader.cache.internal.metrics.start_uptime))
            .replace(`{MEMORY}`, ((loader.packages.os.totalmem() - loader.packages.os.freemem()) / (1024 * 1024)).toFixed(2))
            .replace(`{HEAP}`, (process.memoryUsage().heapUsed / (1024 * 1024)).toFixed(2))
            .replace(`{EVENTS_PROCESSED}`, loader.cache.internal.metrics.events_processed.toString())
        , ` System Info `);
        this.modifyElement(`logs`, 
            loader.cache.internal.logs.__console__.map(log => {return `${log.title} [${log.timestamp}] ${log.message}`}).join('\n'),
            ` AtmosphericX v${loader.submodules.utils.version()} `
        )
        this.modifyElement(`sessions`, 
            loader.cache.internal.accounts.map(session => {return `${session.username} - ${session.address}`}).join('\n') || `No active sessions.`,
            ` Active Sessions (X${loader.cache.internal.accounts.length}) `
        )
        this.MANAGER.render();
    }

    /**
     * @function modifyElement
     * @description
     *     Updates the content and optionally the label of a specific display element.
     *     Scrolls the element to the bottom and re-renders the screen.
     *
     * @param {string} key
     * @param {string} content
     * @param {string} [title]
     * @returns {void}
     */
    private modifyElement(key: string, content: string, title?: string): void {
        if (this.elements[key]) {
            this.elements[key].setContent(content);
            if (title) this.elements[key].setLabel(` ${title} `);
            this.elements[key].setScrollPerc(100);
            this.MANAGER.render();
        }
    }
}
export default Display;
