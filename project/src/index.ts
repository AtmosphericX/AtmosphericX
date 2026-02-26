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
    Documentation: http://localhost/docs | https://atmosx.scriptkitty.cafe/docs

*/

import * as dictEndpoints from './@dictionaries/endpoints';
import * as dictCache from './@dictionaries/records';
import * as dictStrings from './@dictionaries/strings';
import * as dictPackages from './@dictionaries/packages';

export const endpoints = dictEndpoints.h_endpoints;
export const strings = dictStrings.h_strings;
export const cache = dictCache.h_cache;
export const statics = dictCache.h_static;
export const packages: any = dictPackages.h_packages
export const modules : any = {};

Object.entries(dictPackages.h_modules).forEach(([key, Class]) => {modules[key] = new Class()});


new Promise<void>(async () => {
    const configurations = modules.utilities.cfg();
    new packages.jobs.Cron(configurations?.internal_settings?.global_update, () => { modules.networking.fetchCacheData(); });
    new packages.jobs.Cron(configurations?.internal_settings?.random_update, () => { modules.atmsxparser.initRandomService(); modules.atmsxpulsepoint.initRandomService();  });
    new packages.jobs.Cron(configurations?.internal_settings?.update_check,  () => { modules.utilities.getLatestUpdate(); });
    modules.utilities.log({
        title: `${modules.utilities.ansi_colors.GREEN}Bootstrap${modules.utilities.ansi_colors.RESET}`,
        message: `${Object.keys(modules).length} modules activated, ${Object.keys(packages).length} packages loaded, ${Object.keys(endpoints).length} endpoints registered, ${Object.keys(strings).length} strings loaded, and ${Object.keys(cache.internal.configurations).length} configurations cached.`
    });
})

process.on('unhandledRejection', (error: Error) => {
    modules.utilities.log({ 
        title: `${modules.utilities.ansi_colors.RED}Error${modules.utilities.ansi_colors.RESET}`, 
        message: `Unhandled Rejection at: - ${error.message}\n${error.stack}`,
        settings: {file: true}
    });
});