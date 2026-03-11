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
import { getConfigurations } from '../../@dictionaries/@configurations/atmsx-pulsepoint';


export class ATMSXPulsePoint {
    name_space: string = `Internal.Atmsx.PulsePoint`;
    ansi_colors = loader.modules.utilities.ansi_colors;
    pkg = loader.packages.PulsePoint;
    mgr = null;
    constructor() {
        loader.modules.utilities.log({ 
            title: `${this.ansi_colors.GREEN}${this.name_space}${this.ansi_colors.RESET}`, 
            message: `Successfully initialized`
        });
        this.listener();
    }

    /**
    * @public
    * @production
    * @error_handling
    * @function initRandomService
    * @description
    *    Initializes the random event service by selecting the next pulsepoint event
    *    from the cached external events and updating the random pulsepoint cache.
    * 
    * @return {types.EventType | null} - The selected random event or null if none available.
    */
    public initRandomService(): types.EventType | null {
        try {
            const exEvents = loader.cache.external.pulsepoint;
            const features = Array.isArray(exEvents?.features) 
                ? exEvents.features.filter((x): x is types.EventType => x != null && typeof x === "object" && Object.keys(x).length > 0) : [];
            if (features.length === 0) {
                loader.cache.external.random_pulsepoint = {
                    type: "FeatureCollection",
                    features: [],
                    index: 0
                };
                return null;
            }
            const prevIndex = loader.cache.external.random_pulsepoint?.index ?? -1;
            const nextIndex = (prevIndex + 1) % features.length;
            const event = features[nextIndex];
            loader.cache.external.random_pulsepoint = {
                type: "FeatureCollection",
                features: [event],
                index: nextIndex
            };
            return event;
        } catch (error) {
            loader.modules.utilities.exception(error, this.name_space + `.initRandomService`);
            return null;
        }
    }

    /**
    * @private
    * @production
    * @error_handling
    * @function listener
    * @description
    *      This function is responsible for listening to the PulsePoint API and updating the cache with new incidents.
    *      It will also log the new or updated incidents to the console and stream them to the chat.
    */
    private async listener(): Promise<void> {
        try {
            const settings = getConfigurations()
            if (settings == null) { return; }
            this.mgr = new this.pkg(settings)
            this.mgr.on(`onIncidentUpdate`, async (event) => {
                const ev = JSON.parse(JSON.stringify(event))
                const pulse = loader.cache.external.pulsepoint;
                const index = pulse ? pulse.features.findIndex((feature: types.PulsePointFeatures) => feature?.properties?.ID === ev.properties?.ID) : -1;
                const expired = ev.properties?.expires != null;
                if (index === -1) { ev.properties.is_issued = true; }
                if (index !== -1) { 
                    ev.properties.issued = new Date().toLocaleString();
                    ev.properties.is_updated = true; 
                }
                const register = loader.modules.structure.register(ev);
                if (index === -1) { 
                    pulse.features.push(register); 
                    loader.modules.utilities.log({ 
                        title: `${this.ansi_colors.YELLOW}PulsePoint${this.ansi_colors.RESET}`, 
                        message: `[${this.ansi_colors.MAGENTA}New${this.ansi_colors.RESET}] ${this.ansi_colors.GREEN}${ev?.properties?.event}${this.ansi_colors.RESET} @ ${this.ansi_colors.CYAN}${ev?.properties?.address}${this.ansi_colors.RESET} (${ev?.properties?.issued ?? 'N/A'})${this.ansi_colors.RESET}`
                    });
                    await loader.modules.streaming.chatStreamerBot(`${loader.strings.streamber_bot_pulsepoint
                        .replace(`{ACTION}`, `Incoming`)
                        .replace(`{EVENT}`, ev?.properties?.event)
                        .replace(`{LOCATION}`, ev?.properties?.address)}`
                    , `onPulsePointEvent`);
                } else { 
                    pulse.features[index] = register;
                    loader.modules.utilities.log({ 
                        title: `${this.ansi_colors.YELLOW}PulsePoint${this.ansi_colors.RESET}`, 
                        message: `[${this.ansi_colors.MAGENTA}${expired ? `Expired` : `Updated`}${this.ansi_colors.RESET}] ${this.ansi_colors.GREEN}${ev?.properties?.event}${this.ansi_colors.RESET} @ ${this.ansi_colors.CYAN}${ev?.properties?.address}${this.ansi_colors.RESET} (${ev?.properties?.issued ?? 'N/A'})${this.ansi_colors.RESET}`
                    });
                    await loader.modules.streaming.chatStreamerBot(`${loader.strings.streamber_bot_pulsepoint
                        .replace(`{ACTION}`, expired ? `Expired` : `Updated`)
                        .replace(`{EVENT}`, ev?.properties?.event ?? 'N/A')
                        .replace(`{LOCATION}`, ev?.properties?.address ?? 'N/A')}`
                    , `onPulsePointEvent`);
                    loader.modules.websockets.sendUpdateToClients();
                }
                pulse.features.sort((a: types.PulsePointFeatures, b: types.PulsePointFeatures) => {
                    const dateA = new Date(a?.properties?.issued ?? 0).getTime();
                    const dateB = new Date(b?.properties?.issued ?? 0).getTime();
                    return dateA - dateB;
                });
                pulse.features = pulse.features.filter((f: types.PulsePointFeatures) => {
                    if (!f?.properties?.expires) { return true; }
                    const expires = new Date(f?.properties?.expires).getTime();
                    const now = Date.now();
                    return expires > now;
                });
            });
            this.mgr.on(`log`, (message: string) => {
                loader.modules.utilities.log({ 
                    title: `${this.ansi_colors.YELLOW}PulsePoint${this.ansi_colors.RESET}`, 
                    message: message
                });
            })
        } catch (error) {
            loader.modules.utilities.exception(error, this.name_space + `.listener`);
        }
    }
}


export default ATMSXPulsePoint;