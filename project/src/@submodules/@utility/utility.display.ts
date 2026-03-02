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
    Documentation: http://localhost/docs | https://atmosx-secondary.scriptkitty.cafe/docs

*/

import * as loader from '../..';

interface ElementModifyOptions { 
    key: string; 
    content: string; 
    title?: string; 
}

type SessionType = { username: string; address: string; }
type ElementType = { [key: string]: any };

export class Display {
    name_space: string = `Utility.Display`;
    ansi_colors = loader.modules.utilities.ansi_colors;
    unsupported_terminals: string[] = ['dumb', 'cons25', 'emacs', 'cygwin', `mingw`, `xterm`];
    pkg = loader.packages.gui
    mgr = null;
    private elements: ElementType = {};
    constructor() {
        (async () => {
            loader.modules.utilities.log({ 
                title: `${this.ansi_colors.GREEN}${this.name_space}${this.ansi_colors.RESET}`, 
                message: `Successfully initialized`
            });
            if (!loader.modules.utilities.isFancyDisplay()) { return; }
            const getTerminal = loader.packages.process.env.TERM ?? loader.packages.process.env.MSYSTEM ?? null;
            if (getTerminal && this.unsupported_terminals.includes(getTerminal.toLowerCase())) {
                console.log(loader.strings.display_unsupported_terminal);
                return;
            }
            this.mgr = this.pkg.screen({
                smartCSR: true,
                title: `AtmosphericX v${loader.modules.utilities.version()}`,
            })
            this.mgr.key(['escape', 'C-c'], () => { return process.exit(0); });
            await this.intro(3_000);
            this.main();
            this.update()
            setInterval(() => { this.update() }, 5_00);
        })();
    }

    /**
     * @private
     * @production
     * @error_handling
     * @function intro
     * @description
     *     Displays the intro screen with a random tip for a specified delay.
     * 
     * @param {number} delay - The duration to display the intro screen (in milliseconds).
     * @return {Promise<void>} - A promise that resolves after the delay.
     */
    private async intro(delay?: number): Promise<void> {
        try {
            const configurations = loader.modules.utilities.cfg();
            const randomTooltip = loader.packages.crypto.randomInt(0, loader.strings.tooltips.length);
            const logoBox = this.pkg.box({
                ...configurations.display_settings.intro_screen,
                content: `${loader.modules.utilities.logo()}\n{center}\n${this.ansi_colors.GREEN}Tip: ${loader.strings.tooltips[randomTooltip]}${this.ansi_colors.RESET}{/center}`,
            })
            this.mgr.append(logoBox);
            this.mgr.render();
            await loader.modules.utilities.sleep(delay);
            logoBox.destroy();
            this.mgr.render();
            return Promise.resolve();
        } catch (error) {
            loader.modules.utilities.exception(error, this.name_space + `.intro`);
            return Promise.resolve();
        }
    }

    /**
     * @private
     * @production
     * @error_handling
     * @function main
     * @description
     *     Initializes and renders the main display elements.
     * 
     * @return {void}
     */
    private main(): void {
        try {
            const configurations = loader.modules.utilities.cfg();
            const settings = configurations.display_settings;
            this.elements = {
                logs: this.pkg.box({ ...settings.logging_window, label: ` AtmosphericX v${loader.modules.utilities.version()} ` }),
                system: this.pkg.box({ ...settings.system_info_window }),
                sessions: this.pkg.box({ ...settings.sessions_window }),
                events: this.pkg.box({ ...settings.events_window })
            }
            for (const key in this.elements) { this.mgr.append(this.elements[key]); }
            this.mgr.render();
        } catch (error) {
            loader.modules.utilities.exception(error, this.name_space + `.main`);
        }
    }

    /**
     * @private
     * @production
     * @error_handling
     * @function update
     * @description
     *    Updates the display elements with the latest information.
     * 
     * @return {void}
     */
    private update(): void {
        try {
            if (!loader.modules.utilities.isFancyDisplay()) { return; } 
            this.modify({
                key: `logs`, 
                content: loader.cache.internal.logs.__console__.map(log => {return `[${log.timestamp}] [${log.title}] ${log.message}`}).join('\n'),
                title: ` AtmosphericX v${loader.modules.utilities.version()} `
            })
            this.modify({
                key: `events`, 
                content: loader.cache.internal.logs.__events__.map(log => {return `[${log.title}] ${log.message}`}).join('\n'),
                title: ` Events | ${loader.cache.internal.source} (x${loader.cache.external.events.features.length} / x${loader.cache.external.hashes.length})`
            })
            this.modify({
                key: 'sessions',
                content: loader.cache.internal.http_sessions.map((session: SessionType) => { return `${session.username} - ${session.address}`}).join('\n') ?? `No active sessions.`,
                title: ` Active Sessions (X${loader.cache.internal.http_sessions.length}) `
            })
            this.modify({
                key: 'system',
                content: loader.strings.fancy_display_system_info
                    .replace('{UPTIME}', loader.modules.calculations.formatTime(Date.now() - loader.cache.internal.metrics.start_time))
                    .replace('{HEAP}', (process.memoryUsage().heapUsed / (1024 * 1024)).toFixed(2))
                    .replace('{MEMORY}', `${((loader.packages.os.totalmem() - loader.packages.os.freemem()) / 1024 / 1024 / 1024).toFixed(2)} / ${(loader.packages.os.totalmem() / 1024 / 1024 / 1024).toFixed(2)}`)
                    .replace('{TOTAL_PROCESSED}', `${loader.cache.internal.metrics.total_events} Processed Events`)
                    .replace('{TOTAL_REQUESTS}', `${loader.cache.internal.metrics.total_requests} HTTP Requests (Cache)`),
                title: ' System Information '
            });
        } catch (error) {
            loader.modules.utilities.exception(error, this.name_space + `.update`);
        }
    }

    /**
     * @private
     * @production
     * @error_handling
     * @function modify
     * @description
     *     Modifies a display element's content and title.
     *
     * @param {ElementModifyOptions} settings - The settings for modifying the element.
     * @return {void}
     */
    private modify(settings: ElementModifyOptions): void {
        try {
            if (this.elements?.[settings.key]) { 
                this.elements?.[settings.key].setContent(settings?.content);
                if (settings?.title) { this.elements?.[settings.key].setLabel(` ${settings?.title} `); }
                this.mgr.render();
            }
        } catch (error) {
            loader.modules.utilities.exception(error, this.name_space + `.modify`);
        }
    }
}


export default Display;