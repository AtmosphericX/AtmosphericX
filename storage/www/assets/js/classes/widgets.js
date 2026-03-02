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
    Documentation: http://localhost/docs | https://atmosx-secondary.scriptkitty.cafe/docs

*/

class Widgets { 
    constructor(utils = null) {
        this.name_space = `webmodule:widgets`;
        this.utils = utils;
        this.storage = this.utils.storage;
        this.utils.log(`${this.name_space} initialized.`);
    }

    /**
     * @production
     * @error_handling
     * @function applyElementSettings
     * @description
     *      Applies element-specific settings to an HTML element.
     * 
     * @param {HTMLElement} element - The HTML element to apply the settings to.
     * @param {Object} settings - The settings object to apply.
     * @return {void}
     */
    applyElementSettings = function(element, settings) { 
        if (!element) { return }
        if (settings?.global.setBorderRadius) { element.style.borderRadius = `${settings.global.setBorderRadius}px` }
        if (settings?.global.setElementZoomLevel) { element.style.zoom = settings.global.setElementZoomLevel }
        if (settings?.global.setBoxShadow === false) { element.style.boxShadow = 'none' }
        if (settings?.global.setTextShadow === false) { element.style.textShadow = 'none' }
        if (settings?.global.setTextAllignment) { element.style.textAlign = settings.global.setTextAllignment }
        if (settings?.global.setTextColor) { element.style.color = settings.global.setTextColor }
        if (settings?.global.setTextSize) { element.style.fontSize = `${settings.global.setTextSize}px` }
        if (settings?.global.setTextFont) { element.style.fontFamily = settings.global.setTextFont }
        if (settings?.global.setBackgroundAnimated) { element.style.transition = 'background-color 1.5s ease'; }
    }

    /**
     * @production
     * @error_handling
     * @function applyGlobalSettings
     * @description 
     *       Applies global settings to an HTML element.
     * 
     * @param {HTMLElement} element - The HTML element to apply the settings to.
     * @param {Object} settings - The global settings object.
     * @return {void}
     */
    applyGlobalSettings = function(element, settings) { 
        try {
            const getThemeContainer = document.getElementById('widget-container');
            this.applyElementSettings(element, settings)
            if (settings?.global.setElementThemed) {
                this.applyGlobalTheme(getThemeContainer, settings)
                this.applyElementSettings(getThemeContainer, settings)
            }
        } catch (error) {
            this.utils.exception(error, `${this.name_space}:applyGlobalSettings`);
        }
    }

    /**
     * @production
     * @error_handling
     * @function applyGlobalTheme
     * @description
     *      Applies a theme to an element. (Based on active events)
     * 
     * @param {HTMLElement} element - The HTML element to apply the theme to.
     * @return {void}
     */
    applyGlobalTheme = function(element, settings) { 
        try {
            if (!element) { return }
            const getCurrentTheme = this.utils.getEventColor(null, true);
            element.style.backgroundColor = getCurrentTheme[settings?.global.setThemeType] ?? getCurrentTheme?.primary;
        } catch (error) { 
            this.utils.exception(error, `${this.name_space}:applyGlobalTheme`);
        }
    }
}