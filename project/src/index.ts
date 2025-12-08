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


import * as loader from './bootstrap';
import * as types from './types';

new Promise(() => {
    const ConfigType = loader.cache.internal.configurations as types.ConfigurationsType;
    new loader.packages.jobs.Cron(ConfigType.internal_settings.global_update, () => { loader.submodules.networking.updateCache(); loader.submodules.gps.getTrackingInformation(); });
    new loader.packages.jobs.Cron(ConfigType.internal_settings.update_check, () => { loader.submodules.networking.getUpdates(); });
    new loader.packages.jobs.Cron(ConfigType.internal_settings.random_update, () => { loader.submodules.alerts.randomize(); });
})

process.on('uncaughtException', (error: Error) => { // Hackfix: Some external modules may cause uncaught exceptions
    loader.submodules.utils.log(`Exception Caught: ${error.message}\n${error.stack}`,  { title: `\x1b[31m[ATMOSX-ERR]\x1b[0m` });
});

 
