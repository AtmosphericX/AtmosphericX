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

function get(url, param) {
    if (!url.has(param)) return null;
        const value = url.get(param);
        if (value === 'true') return true;
        if (value === 'false') return false;
        if (!isNaN(value) && value.trim() !== '') return Number(value);
        if (value.startsWith('[') && value.endsWith(']')) {
            try {
                return JSON.parse(value);
            } catch (e) {
                console.error(`Failed to parse array for parameter "${param}":`, e);
                return null;
            }
        }
    return value;
}

const aSearch = new URLSearchParams(window.location.search);
const aGlobalElementSettings = {
    setValuePath: get(aSearch, `setValuePath`) ?? null, // See documentation for available routes
    setValuePathSecondary: get(aSearch, `setValuePathSecondary`) ?? null, // See documentation for available routes
    setThemeType: get(aSearch, `setThemeType`) ?? `primary`, // Sets the theme type
    setElementThemed: get(aSearch, `setElementThemed`) ?? false, // Applies theme to the element
    setTextThemed: get(aSearch, `setTextThemed`) ?? false, // Applies theme to text color
    setElementZoomLevel: get(aSearch, `setElementZoomLevel`) ?? null, // Sets element zoom level
    setTextColor: get(aSearch, `setTextColor`) ?? null, // Sets custom text color
    setTextSize: get(aSearch, `setTextSize`) ?? null, // Sets custom text size
    setTextFont: get(aSearch, `setTextFont`) ?? null, // Sets custom text font
    setTextShadow: get(aSearch, `setTextShadow`) ?? true, // Enables/disables text shadow
    setTextPrefix: get(aSearch, `setTextPrefix`) ?? null, // Sets text prefix
    setTextSuffix: get(aSearch, `setTextSuffix`) ?? null, // Sets text suffix
    setTextCharacterLimit: get(aSearch, `setTextCharacterLimit`) ?? 50, // Sets character limit for text
    setTextAlignment: get(aSearch, `setTextAlignment`) ?? null, // Sets text alignment
    setBorderRadius: get(aSearch, `setBorderRadius`) ?? null, // Sets border radius
    setBoxShadow: get(aSearch, `setBoxShadow`) ?? true, // Enables/disables box shadow
    setAnimated: get(aSearch, `setAnimated`) ?? false, // Enables element animation
    setBackgroundAnimated: get(aSearch, `setBackgroundAnimated`) ?? false, // Enables background animation
    setAnimationStartDuration: get(aSearch, `setAnimationStartDuration`) ?? null, // Sets animation start duration
    setAnimatedDelayEnding: get(aSearch, `setAnimatedDelayEnding`) ?? 0, // Sets animation delay ending
    setAnimationEndDuration: get(aSearch, `setAnimationEndDuration`) ?? null, // Sets animation end duration
    setAnimationStartType: get(aSearch, `setAnimationStartType`) ?? `anim_fade_in`, // Sets animation start type
    setAnimationEndType: get(aSearch, `setAnimationEndType`) ?? `anim_fade_out`, // Sets animation end type
    setAnimationHasEnding: get(aSearch, `setAnimationHasEnding`) ?? null, // Specifies if animation has ending
    setTextPlaceholder: get(aSearch, `setTextPlaceholder`) ?? null, // Sets placeholder text if a value doesn't exist
}

