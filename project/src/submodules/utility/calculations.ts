/*
              _                             _               _     __   __
         /\  | |                           | |             (_)    \ \ / /
        /  \ | |_ _ __ ___   ___  ___ _ __ | |__   ___ _ __ _  ___ \ V / 
       / /\ \| __| '_ ` _ \ / _ \/ __| '_ \| '_ \ / _ \ '__| |/ __| > <  
      / ____ \ |_| | | | | | (_) \__ \ |_) | | | |  __/ |  | | (__ / . \ 
     /_/    \_\__|_| |_| |_|\___/|___/ .__/|_| |_|\___|_|  |_|\___/_/ \_\
                                     | |                                 
                                     |_|                                                                                                                
    
    Written by: KiyoWx (k3yomi) & StarflightWx      

*/


import * as loader from '../../bootstrap';
import * as types from '../../types';

export class Calculations { 
    NAME_SPACE: string = `submodule:calculations`;
    constructor() {
        loader.submodules.utils.log(`${this.NAME_SPACE} initialized.`)
    }

    /**
     * @function convertDegreesToCardinal
     * @description
     *     Converts a numeric heading in degrees (0–360) to its corresponding
     *     cardinal or intercardinal direction (N, NE, E, SE, S, SW, W, NW).
     *
     * @param {number} degrees
     * @returns {string}
     */
    public convertDegreesToCardinal(degrees: number): string {
        if (!Number.isFinite(degrees) || degrees < 0 || degrees > 360) return "Invalid";
        const directions = ["N","NE","E","SE","S","SW","W","NW"];
        return directions[Math.round(((degrees % 360 + 360) % 360) / 45) % 8];
    }

    /**
     * @function calculateDistance
     * @description
     *     Calculates the great-circle distance between two geographic coordinates
     *     using the Haversine formula. Supports output in miles or kilometers.
     *
     * @param {types.Coordinates} coord1
     * @param {types.Coordinates} coord2
     * @param {'miles' | 'kilometers'} [unit='miles']
     * @returns {number}
     */
    public calculateDistance(c1: types.Coordinates, c2: types.Coordinates, u: 'miles' | 'kilometers' = 'miles'): number {
        if (!c1 || !c2) return 0;
        const { lat: a, lon: b } = c1, { lat: x, lon: y } = c2;
        if (![a, b, x, y].every(Number.isFinite)) return 0;
        const r = u === 'miles' ? 3958.8 : 6371, d = Math.PI / 180;
        const dA = (x - a) * d, dB = (y - b) * d;
        const h = Math.sin(dA / 2) ** 2 + Math.cos(a * d) * Math.cos(x * d) * Math.sin(dB / 2) ** 2;
        return +(r * 2 * Math.atan2(Math.sqrt(h), Math.sqrt(1 - h))).toFixed(2);
    }

    public radarToEarthCoordinates(lon: number, lat: number, bearingDeg: number, distance: number): [number, number] {
        const br = bearingDeg * Math.PI / 180;
        const dr = distance / 6371000;
        const lat1 = lat * Math.PI / 180;
        const lon1 = lon * Math.PI / 180;
        const lat2 = Math.asin(Math.sin(lat1) * Math.cos(dr) + Math.cos(lat1) * Math.sin(dr) * Math.cos(br));
        const lon2 = lon1 + Math.atan2(Math.sin(br) * Math.sin(dr) * Math.cos(lat1), Math.cos(dr) - Math.sin(lat1) * Math.sin(lat2));
        return [lon2 * 180 / Math.PI, lat2 * 180 / Math.PI];
    }
            

    /**
     * @function timeRemaining
     * @description
     *     Returns a human-readable string representing the time remaining until
     *     the specified future date. Returns "Expired" if the date has passed or
     *     the original input if the date is invalid.
     *
     * @param {string} futureDate
     * @returns {string | Date}
     */
    public timeRemaining(future: string): string | Date {
        const t = Date.parse(future);
        if (isNaN(t)) return future;
        let s = Math.floor((t - Date.now()) / 1000);
        if (s <= 0) return "Expired";
        const d = Math.floor(s / 86400); s %= 86400;
        const h = Math.floor(s / 3600); s %= 3600;
        const m = Math.floor(s / 60); s %= 60;
        return [d && `${d}d`, h && `${h}h`, m && `${m}m`, `${s}s`].filter(Boolean).join(" ");
    }

    /**
     * @function formatDuration
     * @description
     *     Converts a duration in milliseconds to a human-readable string
     *     formatted as days, hours, minutes, and seconds.
     *
     * @param {number} uptimeMs
     * @returns {string}
     */
    public formatDuration(ms: number): string {
        if (!Number.isFinite(ms) || ms < 0) return "0s";
        let s = Math.floor(ms / 1000);
        const d = Math.floor(s / 86400); s %= 86400;
        const h = Math.floor(s / 3600); s %= 3600;
        const m = Math.floor(s / 60); s %= 60;
        return [d && `${d}d`, h && `${h}h`, m && `${m}m`, `${s}s`].filter(Boolean).join(" ");
    }
}

export default Calculations;

