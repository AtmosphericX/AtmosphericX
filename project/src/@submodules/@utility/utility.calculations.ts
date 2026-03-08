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

import * as loader from '../..';
import * as types from '../../@dictionaries/types';

export class Calculations {
    name_space: string = `Utility.Calculations`;
    ansi_colors = loader.modules.utilities.ansi_colors;
    constructor() {
        loader.modules.utilities.log({ 
            title: `${this.ansi_colors.GREEN}${this.name_space}${this.ansi_colors.RESET}`, 
            message: `Successfully initialized`
        });
    }

    /**
     * @public
     * @production
     * @error_handling
     * @function pointInRing
     * @description
     *      Determines if a point is inside a given polygon ring using the ray-casting algorithm.
     * 
     * @param {XYCoordinate} point - The point to check.
     * @param {number[][]} ring - The polygon ring represented as an array of [longitude, latitude] pairs.
     * @return {boolean} - True if the point is inside the ring, false otherwise.
     */
    public pointInRing(point: types.LonLat, ring: number[][]): boolean {
        try {
            let inside = false;
            for (let i = 0, j = ring.length - 1; i < ring.length; j = i++) {
                const xi = ring[i][0], yi = ring[i][1];
                const xj = ring[j][0], yj = ring[j][1];
                const intersect =
                    ((yi > point.lat) !== (yj > point.lat)) &&
                    (point.lon < (xj - xi) * (point.lat - yi) / (yj - yi) + xi);
                if (intersect) inside = !inside;
            }
            return inside;
        } catch (err) {
            loader.modules.utilities.exception(err, this.name_space + `.pointInRing`);
            return false;
        }
    }

    /**
     * @public
     * @production
     * @error_handling
     * @function getPolygonClosestPoint
     * @description
     *      Finds the closest point on the edge of a polygon (or multipolygon) to a given point.
     *      Accepts GeoJSON-style coordinates (Polygon or MultiPolygon).
     *      This will also determine if the point is inside the polygon.
     * 
     * @param {GeoJSONCoordinates} polygon - The polygon coordinates in GeoJSON format.
     * @param {XYCoordinate} point - The point to check against.
     * @return {{inside: boolean, point: XYCoordinate, distance: number} | null} - The closest point info or null if invalid.
     */
    public getPolygonClosestPoint(polygon: types.GeoJSONPolygonLike,point: types.LonLat): { inside: boolean; point: types.LonLat | null; unit: string; distance: number | null } | null {
        try {
            const unit = loader.modules.utilities.cfg().filters.location_settings.unit ?? "miles";
            if (!polygon || !Array.isArray(polygon.coordinates) || !polygon.coordinates.length) {
                return { inside: false, point: null, unit, distance: null };
            }
            let coords: any[] = [];
            if (Array.isArray(polygon.coordinates[0]) &&Array.isArray(polygon.coordinates[0][0]) &&Array.isArray(polygon.coordinates[0][0][0])) {
                coords = polygon.coordinates;
            } else if ( Array.isArray(polygon.coordinates[0]) && Array.isArray(polygon.coordinates[0][0]) ) {
                coords = [polygon.coordinates];
            } else {
                return { inside: false, point: null, unit, distance: null };
            }
            let minDistance = Infinity;
            let closestPoint: types.LonLat | null = null;
            let inside = false;
            for (const poly of coords) {
                const outer = poly[0];
                const holes = poly.slice(1);
                if (this.pointInRing(point, outer)) {
                    let inHole = false;
                    for (const hole of holes) {
                        if (this.pointInRing(point, hole)) {
                            inHole = true;
                            break;
                        }
                    }
                    if (!inHole) {
                        return { inside: true, point, unit, distance: 0 };
                    }
                }
                for (const ring of poly) {
                    for (let i = 0; i < ring.length - 1; i++) {
                        const start = { lon: ring[i][0], lat: ring[i][1] };
                        const end = { lon: ring[i + 1][0], lat: ring[i + 1][1] };
                        const A = point.lon - start.lon;
                        const B = point.lat - start.lat;
                        const C = end.lon - start.lon;
                        const D = end.lat - start.lat;
                        const lenSq = C * C + D * D;
                        const t = lenSq === 0 ? 0 : Math.max(0, Math.min(1, (A * C + B * D) / lenSq));
                        const candidate = {
                            lon: start.lon + t * C,
                            lat: start.lat + t * D,
                        };
                        const dist = this.distanceBetweenPoints(point, candidate, unit);
                        if (dist !== null && dist < minDistance) {
                            minDistance = dist;
                            closestPoint = candidate;
                        }
                    }
                }
            }
            if (!isFinite(minDistance) || closestPoint == null) {
                return { inside: false, point: null, unit, distance: null };
            }
            return { inside, point: closestPoint, unit, distance: minDistance };
        } catch (err) {
            loader.modules.utilities.exception(err, this.name_space + `.getPolygonClosestPoint`);
            return null;
        }
    }

    /** 
     * @public
     * @production
     * @error_handling
     * @function getPolygonCenter
     * @description
     *     Calculates the geographical center (centroid) of a polygon.
     *     Accepts GeoJSON-style coordinates (Polygon).
     * 
     * @param {GeoJSONCoordinates} polygon - The polygon coordinates in GeoJSON format.
     * @return {XYCoordinate | null} - The center point of the polygon or null if invalid.
     */
    public getPolygonCenter(polygon: types.GeoJSONPolygonLike): types.LonLat | null {
        try {
            const coordinates = polygon.coordinates;
            let totalLon = 0;
            let totalLat = 0;
            let totalPoints = 0;
            const isMultiPolygon = Array.isArray(coordinates[0]) && Array.isArray(coordinates[0][0]) && Array.isArray(coordinates[0][0][0]);
            const polygons = isMultiPolygon ? coordinates : [coordinates];
            for (const poly of polygons) {
                const outerRing = poly[0];
                for (const coord of outerRing as number[]) {
                    totalLon += coord[0];
                    totalLat += coord[1];
                    totalPoints += 1;
                }
            }
            if (totalPoints === 0) return null;
            return { lon: totalLon / totalPoints, lat: totalLat / totalPoints };
        } catch (error) {
            loader.modules.utilities.exception(error, this.name_space + `.getPolygonCenter`);
            return null;
        }
    }

    /** 
     * @public
     * @production
     * @error_handling
     * @function distanceBetweenPoints
     * @description
     *      Calculates the distance between two geographical points using the Haversine formula.
     *      Primarily used for calculating distances based on longitude and latitude coordinates.
     *      This will go based off of GeoJSON standard of { lon, lat } instead of { lat, lon }.
     * 
     * @param {XYCoordinate} point1 - The first geographical point with 'lon' and 'lat' properties.
     * @param {XYCoordinate} point2 - The second geographical point with 'lon' and 'lat' properties.
     * @param {'miles' | 'kilometers'} [unit='miles'] - The unit of measurement for the distance.
     * @return {number} - The distance between the two points in the specified unit.
     */
    public distanceBetweenPoints(point1: types.LonLat, point2: types.LonLat, unit: 'miles' | 'kilometers' = 'miles'): number {
        try {
            if (!point1 || !point2) { return null; }
            const { lat: lat1, lon: lon1 } = point1;
            const { lat: lat2, lon: lon2 } = point2;
            if (![lat1, lon1, lat2, lon2].every(Number.isFinite)) return null;
            const earthRadius = (unit === 'miles') ? 3958.8 : 6371.0;
            const toRadians = Math.PI / 180;
            const deltaLat = (lat2 - lat1) * toRadians;
            const deltaLon = (lon2 - lon1) * toRadians;
            const a =
                Math.sin(deltaLat / 2) * Math.sin(deltaLat / 2) +
                Math.cos(lat1 * toRadians) * Math.cos(lat2 * toRadians) *
                Math.sin(deltaLon / 2) * Math.sin(deltaLon / 2);
            const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
            const distance = earthRadius * c;
            return distance;
        } catch (error) {
            loader.modules.utilities.exception(error, this.name_space + `.distanceBetweenPoints`);
            return null;
        }
    }

    /** 
     * @public
     * @production
     * @error_handling
     * @function formatTime
     * @description
     *      Converts a given number of milliseconds into a formatted time string.
     *      Useful for displaying time durations in a more readable format.
     * 
     * @param {number} ms - The time in milliseconds to be formatted.
     * @return {string} - The formatted time string.
     */
    public formatTime(ms: number): string {
        try {
            const s = Math.floor(ms / 1000);
            const m = Math.floor(s / 60) % 60;
            const h = Math.floor(s / 3600) % 24;
            const d = Math.floor(s / 86400) % 30;
            const mo = Math.floor(s / 2592000);
            return [ mo ? `${mo}m` : '', d ? `${d}d` : '', h ? `${h}h` : '', m ? `${m}m` : '', `${s % 60}s`].filter(Boolean).join(' ');
        } catch (error) {
            loader.modules.utilities.exception(error, this.name_space + `.formatTime`);
            return '';
        }
    }

    /** 
     * @public
     * @production
     * @error_handling
     * @function cardinalDirection
     * @description
     *      Converts a degree value into its corresponding cardinal direction.
     *      Useful for interpreting wind directions or other directional data.
     * 
     * @param {number} degrees - The degree value to be converted (0-360).
     * @return {string} - The corresponding cardinal direction (e.g., N, NE, E, etc.).
     */
    public cardinalDirection(degrees: number): string {
        try {
            if (!Number.isFinite(degrees) || degrees < 0 || degrees > 360) return "Invalid";
            const directions = [
                "N", "NNE", "NE", "ENE",
                "E", "ESE", "SE", "SSE",
                "S", "SSW", "SW", "WSW",
                "W", "WNW", "NW", "NNW"
            ];
            const idx = Math.floor(((degrees % 360 + 360) % 360) / 22.5 + 0.5) % 16;
            return directions[idx];
        } catch (error) {
            loader.modules.utilities.exception(error, this.name_space + `.cardinalDirection`);
            return "Invalid";
        }
    }
}


export default Calculations;