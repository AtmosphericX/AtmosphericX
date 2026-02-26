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
    isElementThemed: get(aSearch, `isElementThemed`) ?? false,
    isTextColorThemed: get(aSearch, `isTextColorThemed`) ?? false,
    setThemeType: get(aSearch, `setThemeType`) ?? `secondary`,
    setTextColor: get(aSearch, `setTextColor`) ?? null,
    setTextSize: get(aSearch, `setTextSize`) ?? null,
    setTextFont: get(aSearch, `setTextFont`) ?? null,
    setBorderRadius: get(aSearch, `setBorderRadius`) ?? null,
    setBoxShadow: get(aSearch, `setBoxShadow`) ?? true,
    setTextShadow: get(aSearch, `setTextShadow`) ?? true,
    setAnimated: get(aSearch, `setAnimated`) ?? false,
    setBackgroundAnimated: get(aSearch, `setBackgroundAnimated`) ?? false,
    setAnimationStartDuration: get(aSearch, `setAnimationStartDuration`) ?? null,
    setAnimatedDelayEnding: get(aSearch, `setAnimatedDelayEnding`) ?? 0,
    setAnimationEndDuration: get(aSearch, `setAnimationEndDuration`) ?? null,
    setAnimationStartType: get(aSearch, `setAnimationStartType`) ?? `anim_fade_in`,
    setAnimationEndType: get(aSearch, `setAnimationEndType`) ?? `anim_fade_out`,
    setAnimationHasEnding: get(aSearch, `setAnimationHasEnding`) ?? null,
    setTextAllignment: get(aSearch, `setTextAllignment`) ?? null, 
    setElementZoomLevel: get(aSearch, `setElementZoomLevel`) ?? null,
    setTextCharacterLimit: get(aSearch, `setTextCharacterLimit`) ?? 64,
    setPlaceholderText: get(aSearch, `setPlaceholderText`) ?? null,
    setTextPrefix: get(aSearch, `setTextPrefix`) ?? null,
    setTextSuffix: get(aSearch, `setTextSuffix`) ?? null,
}

