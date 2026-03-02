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
    Discord: https://atmosphericx-discord.scriptktity.cafe
    Ko-Fi: https://ko-fi.com/k3yomi
    Documentation: http://localhost/documentation | https://atmosphericx.scriptkitty.cafe/documentation

*/

import * as loader from '../..';
import { getConfigurations } from '../../@dictionaries/@configurations/streamer-bot';

export class Streaming {
    name_space: string = `Misc.Streaming`;
    ansi_colors = loader.modules.utilities.ansi_colors;
    pkg = loader.packages.StreamerbotClient;
    mgr = null;
    is_bot_account: boolean = false;
    max_threshold: number = 1;
    max_threshold_time: number = 5_000;
    events: string[] = [];
    service: typeof loader.cache.handlers.bot_client.service | null = null;
    constructor() {
        loader.modules.utilities.log({ 
            title: `${this.ansi_colors.GREEN}${this.name_space}${this.ansi_colors.RESET}`, 
            message: `Successfully initialized`
        });
        this.listener();
    }

    /**
     * @public
     * @function chatStreamerBot
     * @production
     * @error_handling
     * @description
     *      This function is responsible for sending a chat message to Streamer.bot for a specific event.
     *      It checks if the service and event are valid, and ensures that the event is not being sent too frequently.
     * 
     * @param {string} message - The chat message to be sent.
     * @param {string} event - The event type for which the message is being sent.
     * @return {Promise<void>} - A promise that resolves when the message has been sent.
     */
    public async chatStreamerBot(message: string, event: string): Promise<void> { 
        try {
            if (!this.service || !this.events[event]) { return; }
            if (!loader.modules.utilities.isLimited(event, this.max_threshold, this.max_threshold_time)) {
                loader.modules.utilities.log({ 
                    title: `${this.ansi_colors.YELLOW}Streamer.bot${this.ansi_colors.RESET}`, 
                    message: `Sending chat message to Streamer.bot: ${this.ansi_colors.CYAN}${message}${this.ansi_colors.RESET}`
                });
                await loader.cache.handlers.bot_client.sendMessage(this.service, message.substring(0, 200), {bot: this.is_bot_account} );
            }
        } catch (error) {
            loader.modules.utilities.exception(error, this.name_space + `.chatStreamerBot`);
        }
    }

    /**
     * @private
     * @function listener
     * @production
     * @error_handling
     * @description
     *      This function is responsible for listening to the Streamer.bot API and initializing the client.
     *      It sets up the connection and retrieves the broadcaster information.
     *
     * @return {Promise<void>} - A promise that resolves when the listener has been set up.
     */
    private async listener(): Promise<void> {
        try {
            const settings = getConfigurations()
            if (settings == null) { return; }
            loader.cache.handlers.bot_client = await new this.pkg({...settings,
                onConnect: async () => {
                    const broadcaster = await loader.cache.handlers.bot_client.getBroadcaster();
                    this.service = broadcaster?.connected[0] ?? null;
                    this.is_bot_account = settings.is_bot;
                    this.events = settings.events;
                    if (this.service) { 
                        this.chatStreamerBot(loader.strings.streamer_bot_connection_success, `onWelcomeEvent`);
                        loader.modules.utilities.log({ 
                            title: `${this.ansi_colors.YELLOW}Streamer.bot${this.ansi_colors.RESET}`, 
                            message: `Connected to ${broadcaster?.connected[0]} as ${this.is_bot_account ? `Bot Account` : `Standard Account`}.`
                        });
                    }
                }
            });
        } catch (error) {
            loader.modules.utilities.exception(error, this.name_space + `.listener`);
        }
    }
}


export default Streaming;