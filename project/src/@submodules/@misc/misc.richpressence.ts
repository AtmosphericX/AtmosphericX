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
import { Client } from 'discord-rpc';

export class Richpresence {
    name_space: string = `Misc.Richpresence`;
    ansi_colors = loader.modules.utilities.ansi_colors;
    client?: Client;
    reconnectTimer?: NodeJS.Timeout;
    activityTimer?: NodeJS.Timeout;
    start: number = Date.now();
    constructor() {
        loader.modules.utilities.log({ 
            title: `${this.ansi_colors.GREEN}${this.name_space}${this.ansi_colors.RESET}`, 
            message: `Successfully initialized`
        });
        void this.listener();
    }

    /**
     * @public
     * @function listener
     * @production
     * @error_handling
     * @description
     *      This function is responsible for managing Discord's rich presence feature within AtmosphericX.
     *      Handles connection lifecycle, activity updates, and automatic reconnection on failure.
     *
     * @returns {Promise<void>}
     */
    public async listener(): Promise<void> {
        const configurations = loader.modules.utilities.cfg();
        const settings = configurations?.internal_settings?.discord_rich_presence;

        if (!settings?.enabled) {
            this.teardownClient();
            return;
        }
        const application = settings.application?.trim();
        if (!application) {
            loader.modules.utilities.log({
                title: `${this.ansi_colors.RED}${this.name_space}${this.ansi_colors.RESET}`,
                message: `Discord rich presence is enabled, but no application ID is configured.`
            });
            return;
        }
        this.teardownClient();
        const client = new Client({ transport: 'ipc' });
        this.client = client;
        client.once('ready', () => this.onClientReady(client));
        client.once('disconnected', () => {
            this.scheduleReconnect(`Discord closed the RPC connection. Reconnecting to rich presence.`)
        });
        client.once('error', () => this.scheduleReconnect(`Discord RPC error. Reconnecting to rich presence.`));
        try {
            await client.login({ clientId: application });
        } catch {
            this.teardownClient()
        }
    }  

    /**
     * @private
     * @function teardownClient
     * @description
     *      Safely terminates the Discord RPC client connection.
     *      Clears all timers and event listeners.
     *      Gracefully handles errors if Discord is not running.
     * 
     * @param {Client} [client]
     * @returns {void}
     */
    private teardownClient(client?: Client): void {
        if (this.activityTimer) {
            clearInterval(this.activityTimer);
            this.activityTimer = undefined;
        }

        const activeClient = client ?? this.client;
        if (!activeClient) {
            return;
        }

        if (this.client === activeClient) {
            this.client = undefined;
        }

        activeClient.removeAllListeners();
    }

    /**
     * @private
     * @function onClientReady
     * @description
     *      Handles the ready event from Discord RPC client.
     *      Sets up activity updates and configures periodic refresh.
     * 
     * @param {Client} client
     * @returns {void}
     */
    private onClientReady(client: Client): void {
        if (this.client !== client) {
            return;
        }

        if (this.reconnectTimer) {
            clearTimeout(this.reconnectTimer);
            this.reconnectTimer = undefined;
        }

        loader.modules.utilities.log({
            title: `${this.ansi_colors.GREEN}${this.name_space}${this.ansi_colors.RESET}`,
            message: `Successfully connected to application (${client.user?.username ?? `Discord`})`
        });

        this.updateActivityNow(client);
        this.activityTimer = setInterval(() => this.updateActivityNow(client), 5000);
    }

    /**
     * @private
     * @function updateActivityNow
     * @description
     *      Updates the Discord rich presence activity immediately.
     * 
     * @param {Client} client
     * @param {boolean} includeTimestamp - Include timestamp only on first update to prevent Discord resetting the timer
     * @returns {void}
     */
    private updateActivityNow(client: Client): void {
        if (this.client !== client) {
            return;
        }

        void client.setActivity(this.buildActivity()).catch(() => {
            this.scheduleReconnect(`Discord rich presence disconnected while updating activity.`);
        });
    }

    /**
     * @private
     * @function scheduleReconnect
     * @description
     *      Schedules a reconnection attempt with backoff.
     *      Prevents multiple simultaneous reconnection attempts.
     * 
     * @param {string} message
     * @returns {void}
     */
    private scheduleReconnect(message: string): void {
        this.teardownClient();

        loader.modules.utilities.log({
            title: `${this.ansi_colors.RED}${this.name_space}${this.ansi_colors.RESET}`,
            message
        });

        if (this.reconnectTimer) {
            return;
        }

        this.reconnectTimer = setTimeout(() => {
            this.reconnectTimer = undefined;
            void this.listener();
        }, 15000);
    }

    /**
     * @private
     * @function buildActivity
     * @description
     *      Constructs the Discord activity object for rich presence display.
     *      Randomly selects and displays 2-4 feature types on each update for dynamic presence.
     *      Only includes timestamp on initial update to prevent Discord from resetting elapsed time.
     * 
     * @param {boolean} includeTimestamp - Whether to include the start timestamp
     * @returns {Object}    
     */
    private buildActivity() {
        const activity: any = {
            details: `AtmosphericX (v${loader.modules.utilities.version()})`,
            buttons: [
                {
                    label: `Install AtmosphericX (v${loader.modules.utilities.version()})`,
                    url: `https://github.com/AtmosphericX/AtmosphericX`
                },
                {
                    label: `View Documentation`,
                    url: `https://atmosphericx.scriptkitty.cafe`
                }
            ]
        };
        activity.timestamps = {
            start: Math.floor(this.start / 1000)
        };
        return activity;
    }
}

export default Richpresence;