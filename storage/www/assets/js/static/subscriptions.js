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

const SUB = {
    GLOBAL: `*`,
    TRACKING: 'tracking',
    RNG_EVENT: `random_event`,
    RNG_PULSE: `random_pulsepoint`,
    CONFIGURATIONS: `configurations`,
    OUTAGES: `outages`,
    MESONET: `mesonet`,
    STREAMS: `streams`,
    EVENTS: `events`,
    MANUAL: `manual`,
    PULSEPOINT: `pulsepoint`,
    SPOTTERS: `spotters`,
    CIMSS: `cimss`,
}

function iEventSubscriptions() {
    return [SUB.EVENTS, SUB.MANUAL, SUB.PULSEPOINT]
}

