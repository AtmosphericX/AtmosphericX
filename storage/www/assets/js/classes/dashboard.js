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

class Dashboard { 
    constructor(utils) { 
        this.name_space = `webmodule:dashboard`;
        this.storage = utils.storage;
        this.utils = utils;
        window.history.pushState({}, null, `#home`); 
        utils.log(`${this.name_space} initialized.`);
        utils.socket([`*`]).then(() => {
            document.addEventListener('onUpdate', (event) => {this.onUpdate()});
        });
    }
    
    
    renderPage = function(page) {  // defined as "Home" or "Settings"
        const getLayout = layout[page];
        const getComponents = components;
        const getContainer = document.getElementById("container");
        if (!getLayout) {
            return this.utils.exception(`No layout was found for the page ${page}.`, "dashboard:renderPage");
        }
    }
    
    
    /**
     * @production
     * @function onUpdate
     * @description 
     *      Updates the project version text and announcement text if the server has sent an update.
     *      Feat: TBD
     * 
     * @returns {void}
     */
    onUpdate = function() {
        const getVersionText = document.getElementById(`sidebar-version`);
        const getHeaderText = document.getElementById(`message`);
        const getCurrentPage = window.location.hash;
        if (getVersionText) { getVersionText.innerText = this?.storage?.version ?? `AtmosphericX {Invalid Version}`; }
        if (getHeaderText) { if (this?.storage?.announcement) { getHeaderText.innerText = this?.storage?.announcement; } else { getHeaderText.innerText = `There are currently no announcements.`; } }
        this.renderPage(getCurrentPage);
    }
}