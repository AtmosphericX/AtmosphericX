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

*/

// AtmosphericX Submodules
import utilities from '../@submodules/@utility/utility';
import display from '../@submodules/@utility/utility.display';
import calculations from '../@submodules/@utility/utility.calculations';
import database from '../@submodules/@utility/utility.database';
import networking from '../@submodules/@utility/utility.http';
import tracking from '../@submodules/@utility/utility.tracking';
import structure from '../@submodules/@misc/misc.stucture';
import streaming from '../@submodules/@misc/misc.streaming';
import rtsocket from '../@submodules/@misc/misc.rtsocket';
import atmsxparser from '../@submodules/@internal/atmsx.parser';
import atmsxpulsepoint from '../@submodules/@internal/atmsx.pulsepoint';
import atmsxtempest from '../@submodules/@internal/atmsx.tempest';
import routing from '../@express/express.routes';
    
export const h_modules = { 
    utilities, display, rtsocket,
    atmsxparser, atmsxpulsepoint, atmsxtempest,
    calculations, database, tracking, 
    networking, structure, streaming, routing
};
