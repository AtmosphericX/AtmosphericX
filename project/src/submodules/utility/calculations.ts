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
        const directions = [
            "N", "NNE", "NE", "ENE",
            "E", "ESE", "SE", "SSE",
            "S", "SSW", "SW", "WSW",
            "W", "WNW", "NW", "NNW"
        ];
        const idx = Math.floor(((degrees % 360 + 360) % 360) / 22.5 + 0.5) % 16;
        return directions[idx];
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

    private isPointInPolygon(point: types.Coordinates, polygon: Array<[number, number]>): boolean {
        let inside = false;
        const x = point.lon, y = point.lat;
        for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
            const xi = polygon[i][0], yi = polygon[i][1];
            const xj = polygon[j][0], yj = polygon[j][1];
            const intersect = ((yi > y) !== (yj > y)) && (x < (xj - xi) * (y - yi) / (yj - yi) + xi);
            if (intersect) inside = !inside;
        }
        return inside;
    }


    /**
     * @function distanceToSegment
     * @description
     *     Returns the shortest geodesic distance from a point to a line segment.
     *     If a polygon is supplied AND the point is inside that polygon,
     *     returns 0 immediately.
     *
     * @param {types.Coordinates} point
     * @param {types.Coordinates} segStart
     * @param {types.Coordinates} segEnd
     * @param {'miles' | 'kilometers'} [unit='miles']
     * @param {Array<[number, number]>} [polygon]
     * @returns {number}
     */
    public distanceToSegment(point: types.Coordinates, segStart: types.Coordinates, segEnd: types.Coordinates, unit: 'miles' | 'kilometers' = 'miles', polygon?: Array<[number, number]>): number {

        if (polygon && polygon.length > 2) {
            if (this.isPointInPolygon(point, polygon)) return 0;
        }

        const toRad = (d: number) => d * Math.PI / 180;

        const toXYZ = (lat: number, lon: number) => [
            Math.cos(lat) * Math.cos(lon),
            Math.cos(lat) * Math.sin(lon),
            Math.sin(lat)
        ];

        const p0 = toXYZ(toRad(point.lat), toRad(point.lon));
        const p1 = toXYZ(toRad(segStart.lat), toRad(segStart.lon));
        const p2 = toXYZ(toRad(segEnd.lat), toRad(segEnd.lon));

        const v = [p2[0] - p1[0], p2[1] - p1[1], p2[2] - p1[2]];
        const w = [p0[0] - p1[0], p0[1] - p1[1], p0[2] - p1[2]];

        const c1 = v[0]*w[0] + v[1]*w[1] + v[2]*w[2];
        const c2 = v[0]*v[0] + v[1]*v[1] + v[2]*v[2];

        let t = c2 === 0 ? 0 : c1 / c2;
        t = Math.max(0, Math.min(1, t));

        const proj = [
            p1[0] + t*v[0],
            p1[1] + t*v[1],
            p1[2] + t*v[2]
        ];

        const norm = Math.sqrt(proj[0]**2 + proj[1]**2 + proj[2]**2);
        const projLat = Math.asin(proj[2] / norm) * 180 / Math.PI;
        const projLon = Math.atan2(proj[1], proj[0]) * 180 / Math.PI;

        return this.calculateDistance(point, { lat: projLat, lon: projLon }, unit);
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
        let s = Math.floor((t - Date.now()) / 1_000);
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
        let s = Math.floor(ms / 1_000);
        const d = Math.floor(s / 86400); s %= 86400;
        const h = Math.floor(s / 3600); s %= 3600;
        const m = Math.floor(s / 60); s %= 60;
        return [d && `${d}d`, h && `${h}h`, m && `${m}m`, `${s}s`].filter(Boolean).join(" ");
    }
}

export default Calculations;

