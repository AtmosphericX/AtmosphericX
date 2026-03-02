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
    Discord: https://atmosphericx-discord.scriptktity.cafe
    Ko-Fi: https://ko-fi.com/k3yomi
    Documentation: http://localhost/documentation | https://atmosphericx.scriptkitty.cafe/documentation

*/

function get(url, param) {
    if (url.has(param)) {
        const value = url.get(param);
        const isBoolean = value === 'true' || value === 'false';
        const isNumber = !isNaN(value);
        const isArray = value.startsWith('[') && value.endsWith(']');
        if (isBoolean) { return value === 'true'; }
        if (isNumber) { return Number(value); }
        if (isArray) { 
            try {
                return JSON.parse(value);
            } catch (e) {
                console.error(`Failed to parse array for parameter "${param}":`, e);
                return null;
            }
        }
        return value;
    }
    return null;
}

const aSearch = new URLSearchParams(window.location.search);
const aGlobalElementSettings = {
    setElementThemed: get(aSearch, `setElementThemed`) ?? false, // Applies theme to the element
    setTextColorThemed: get(aSearch, `setTextColorThemed`) ?? false, // Applies theme to text color
    setThemeType: get(aSearch, `setThemeType`) ?? `secondary`, // Sets the theme type
    setTextColor: get(aSearch, `setTextColor`) ?? null, // Sets custom text color
    setTextSize: get(aSearch, `setTextSize`) ?? null, // Sets custom text size
    setTextFont: get(aSearch, `setTextFont`) ?? null, // Sets custom text font
    setBorderRadius: get(aSearch, `setBorderRadius`) ?? null, // Sets border radius
    setBoxShadow: get(aSearch, `setBoxShadow`) ?? true, // Enables/disables box shadow
    setTextShadow: get(aSearch, `setTextShadow`) ?? true, // Enables/disables text shadow
    setAnimated: get(aSearch, `setAnimated`) ?? false, // Enables element animation
    setBackgroundAnimated: get(aSearch, `setBackgroundAnimated`) ?? false, // Enables background animation
    setAnimationStartDuration: get(aSearch, `setAnimationStartDuration`) ?? null, // Sets animation start duration
    setAnimatedDelayEnding: get(aSearch, `setAnimatedDelayEnding`) ?? 0, // Sets animation delay ending
    setAnimationEndDuration: get(aSearch, `setAnimationEndDuration`) ?? null, // Sets animation end duration
    setAnimationStartType: get(aSearch, `setAnimationStartType`) ?? `anim_fade_in`, // Sets animation start type
    setAnimationEndType: get(aSearch, `setAnimationEndType`) ?? `anim_fade_out`, // Sets animation end type
    setAnimationHasEnding: get(aSearch, `setAnimationHasEnding`) ?? null, // Specifies if animation has ending
    setTextAllignment: get(aSearch, `setTextAllignment`) ?? null, // Sets text alignment
    setElementZoomLevel: get(aSearch, `setElementZoomLevel`) ?? null, // Sets element zoom level
    setTextCharacterLimit: get(aSearch, `setTextCharacterLimit`) ?? 64, // Sets character limit for text
    setPlaceholderText: get(aSearch, `setPlaceholderText`) ?? null, // Sets placeholder text if a value doesn't exist
    setTextPrefix: get(aSearch, `setTextPrefix`) ?? null, // Sets text prefix
    setTextSuffix: get(aSearch, `setTextSuffix`) ?? null, // Sets text suffix
}

