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

export class Streaming { 
    NAME_SPACE: string = `submodule:streaming`;
    SERVICE: any = null;
    IS_BOT_ACCOUNT: boolean = false;
    MAX_THRESHOLD: number = 1;
    MAX_THRESHOLD_TIME: number = 5_000;
    EVENTS: string[] = [];
    constructor() {
        (async() => {
            loader.submodules.utils.log(`${this.NAME_SPACE} initialized.`)
            const config = loader.cache.internal.configurations as types.ConfigurationsType;
            if (!config.streamer_bot_settings?.enabled) { return } 
            loader.cache.handlers.streamingBotClient = await new loader.packages.StreamerbotClient({
                onConnect: async() => {
                    const broadcaster = await loader.cache.handlers.streamingBotClient.getBroadcaster();
                    this.SERVICE = broadcaster?.connected[0]
                    this.IS_BOT_ACCOUNT = config.streamer_bot_settings?.use_bot_account ?? false;
                    this.EVENTS = config.streamer_bot_settings?.events ?? [];
                    if (this.SERVICE) {
                        await this.sendChatMessage(`AtmosphericX has connected to Streamer Bot successfully!`, `welcome`);
                        loader.submodules.utils.log(`${this.NAME_SPACE} connected to Streamer Bot @ ${config.streamer_bot_settings?.address}:${config.streamer_bot_settings?.port}`);
                    }
                },
                address: config.streamer_bot_settings?.address,
                port: config.streamer_bot_settings?.port,
                password: config.streamer_bot_settings?.password,
            } as unknown) // Hackfix: @streamerbot/client types are not working as expected :(
        })();
    }

    /**
     * @function sendChatMessage
     * @description
     *    Sends a chat message via Streamer Bot if the service is connected and the event type is enabled.
     * 
     * @param {string} [message='']
     * @param {string} [type='events']
     * @returns {Promise<void>}
     */
    public async sendChatMessage(message: string = '', type='events'): Promise<void> {
        if (this.SERVICE && this.EVENTS[type] == true) {
            const time = Date.now();
            loader.cache.internal.limiters = loader.cache.internal.limiters.filter(ts => ts.timestamp > time - this.MAX_THRESHOLD_TIME);
            if (loader.cache.internal.limiters.filter(ts => ts.type == `streaming.chat.limit`).length >= this.MAX_THRESHOLD) {
                return;
            }
            loader.cache.internal.limiters.push({ type: `streaming.chat.limit`, timestamp: time });
            loader.submodules.utils.log(`Sending message to Streamer Bot: ${message.substring(0, 200)}`);
            await loader.cache.handlers.streamingBotClient.sendMessage(this.SERVICE, message.substring(0, 200), {bot: this.IS_BOT_ACCOUNT} );
        }
    }
}

export default Streaming;

