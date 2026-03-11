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
        try {
            if (!element) return;
            const set = settings?.global;
            if (set) {
                if (set.setBorderRadius != null) element.style.borderRadius = `${set.setBorderRadius}px`;
                if (set.setElementZoomLevel != null) element.style.zoom = set.setElementZoomLevel;
                if (set.setBoxShadow === false) element.style.boxShadow = 'none';
                if (set.setTextShadow === false) element.style.textShadow = 'none';
                if (set.setTextAlignment) element.style.textAlign = set.setTextAlignment;
                if (set.setTextColor) element.style.color = set.setTextColor;
                if (set.setTextSize != null) element.style.fontSize = `${set.setTextSize}px`;
                if (set.setTextFont) element.style.fontFamily = set.setTextFont;
                if (set.setBackgroundAnimated) {
                    element.style.transition = `background-color ${set.setAnimationStartDuration ?? 1.5}s ease`;
                }
            }
        } catch (error) {
            this.utils.exception(error, `${this.name_space}:applyElementSettings`);  
        }
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
            const themeContainer = document.getElementById('widget-container');
            this.applyElementSettings(element, settings);
            if (settings?.global?.setElementThemed && themeContainer) {
                themeContainer.style.display = 'flex';
                this.applyGlobalTheme(themeContainer, settings);
                this.applyElementSettings(themeContainer, settings);
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
            if (!element) return;
            const theme = this.utils.getEventColor(null, true);
            const type = settings?.global?.setThemeType;
            element.style.backgroundColor = theme?.[type] ?? theme?.primary;
        } catch (error) {
            this.utils.exception(error, `${this.name_space}:applyGlobalTheme`);
        }
    }
}