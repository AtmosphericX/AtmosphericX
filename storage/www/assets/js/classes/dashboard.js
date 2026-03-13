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
        this.landing_page = `#home`;
        this.static_pages = ['#ho2me']
        window.history.pushState({}, null, this.landing_page); 
        utils.log(`${this.name_space} initialized.`);
        utils.socket([`*`]).then(() => {
            document.addEventListener('onUpdate', (event) => {this.onUpdate()});
        });
    }
    
    /**
     * @production
     * @function getLandingPage
     * @description 
     *      Gets the landing page of the dashboard. This is used to see what part of the dashboard the user is currently on.
     *      This is used to determine what content to show the user and to update the URL accordingly. 
     *      The landing page is set to `#home` by default, but can be changed by the user. 
     *      The landing page is also used to determine what content to show the user when they first load the dashboard.
     * 
     * @returns {string} The landing page of the dashboard.
     */
    getLandingPage() { return this.landing_page; }
    
    
    setLoadPage(page) { 
        // wipe all contents from this page
        const getPage = document.getElementById(page.replace(`#`, ``));
        if (getPage) { getPage.innerHTML = ``; }
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
        const getHeaderText = document.getElementById(`header-message`);
        const getCurrentPage = this.getLandingPage();
        if (getVersionText) { getVersionText.innerText = this?.storage?.version ?? `AtmosphericX {Invalid Version}`; }
        if (getHeaderText) { if (this?.storage?.announcement) { getHeaderText.innerText = this?.storage?.announcement; } else { getHeaderText.innerText = `There are currently no announcements.`; } }
        if (!this.static_pages.includes(getCurrentPage)) { this.loadPage(getCurrentPage); }
    }
}