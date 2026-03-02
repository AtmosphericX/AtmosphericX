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
    Documentation: http://localhost/documentation | https://atmosx-secondary.scriptkitty.cafe/documentation

*/

class Dashboard { 
    constructor(utils) { 
        this.name_space = `webmodule:dashboard`;
        this.storage = utils.storage;
        utils.log(`${this.name_space} initialized.`);
    }

    getGoogleMapDirections = function (coordinates = {latitude: 0, longitude: 0}) {
        return `https://www.google.com/maps/dir/?api=1&origin=current+location&destination=${coordinates.latitude},${coordinates.longitude}`;
    };

}