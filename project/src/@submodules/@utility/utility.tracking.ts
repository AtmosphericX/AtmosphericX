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
import { parse } from '../../@parsing/parsing.weather-station';
import * as types from '../../@dictionaries/types';

type Site = { 
    geometry?: { coordinates?: number[] };
    properties?: { id?: string } 
}

type LocationFilter = { 
    properties?: { 
        last_updated?: string; 
        name?: string; 
        icao?: string; 
        location?: string 
    }; 
    geometry?: { coordinates?: number[] } 
};

export class Tracking {
    name_space: string = `Utility.Tracking`;
    ansi_colors = loader.modules.utilities.ansi_colors;
    max_threshold_time: number = 10_000;
    max_threshold: number = 1;
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
     * @function setCurrentCoordinates
     * @description
     *    Sets the current coordinates for a given name in the tracking cache.
     *    If the name does not exist, it creates a new entry. If it exists, it updates the coordinates and ICAO.
     * 
     * @param {string} name - The name associated with the coordinates.
     * @param {Coordinates} coordinates - The coordinates to set (latitude and longitude).
     * @param {string} source - The source of the coordinates.
     */
    public setCurrentCoordinates(name: string, coordinates: types.LatitudeLongitude, source: 'SpotterNetwork' | `RTIRL`): void {
        try {
            const cfg = loader.modules.utilities.cfg();
            const features = loader.cache.external.tracking.features;
            if (!Array.isArray(features)) return;
            const now = Date.now();
            const expiryMs = cfg.sources.location_settings.expiry_time * 1000;
            const icao = this.getNearestICAO(coordinates);
            const existing = features.find((loc: LocationFilter) => loc?.properties?.name === name);
            if (!existing) {
                features.push({
                    type: "Feature",
                    geometry: {
                        type: "Point",
                        coordinates: [coordinates.longitude, coordinates.latitude]
                    },
                    properties: {
                        name,
                        source,
                        location: null,
                        icao,
                        last_updated: new Date()
                    }
                });
            } else {
                existing.geometry.coordinates = [coordinates.longitude, coordinates.latitude];
                existing.properties.icao = icao;
                existing.properties.last_updated = new Date();
            }
            loader.cache.external.tracking.features = features.filter((loc: LocationFilter) => {
                const updated = new Date(loc?.properties?.last_updated).getTime();
                return now - updated < expiryMs;
            });
            loader.modules.utilities.log({
                title: `${this.ansi_colors.GREEN}${this.name_space}${this.ansi_colors.RESET}`,
                message: `Updated coordinates for ${this.ansi_colors.CYAN}${name}${this.ansi_colors.RESET} @ [${this.ansi_colors.YELLOW}${coordinates.longitude}, ${coordinates.latitude}${this.ansi_colors.RESET}] via ${source}`
            });
            this.getTrackingInformation();
        } catch (error) {
            loader.modules.utilities.exception(error, this.name_space + `.setCurrentCoordinates`);
        }
    }

    /**
     * @public
     * @production
     * @error_handling
     * @function getNearestICAO
     * @description
     *    Finds the nearest ICAO code from the radar cache based on given coordinates.
     * @param {Coordinates} coordinates - The coordinates to find the nearest ICAO for.
     * @returns {string | null} - The nearest ICAO code or null if none found.
     */
    public getNearestICAO(coordinates: types.LatitudeLongitude): string | null {
        try {
            const sites = loader.cache.external.radars;
            const features = sites?.features;
            if (!Array.isArray(features) || features.length === 0) return null;
            const distances = features.map((site: Site) => {
                const [lon, lat] = site.geometry?.coordinates ?? [];
                const icao = site.properties?.id ?? null;
                if (!Number.isFinite(lon) || !Number.isFinite(lat) || !icao) return null;
                const miles = loader.modules.calculations.distanceBetweenPoints(
                    { lat: coordinates.latitude, lon: coordinates.longitude },
                    { lat, lon },
                    "miles"
                );
                return Number.isFinite(miles) ? { icao, distance: miles } : null;
            }).filter(Boolean) as { icao: string; distance: number }[];
            if (distances.length === 0) return null;
            distances.sort((a, b) => a.distance - b.distance);
            return distances[0].icao;
        } catch (error) {
            loader.modules.utilities.exception(error, this.name_space + `.getNearestICAO`);
            return null;
        }
    }

    /**
     * @public
     * @production
     * @error_handling
     * @function getTrackingInformation
     * @description
     *    Fetches and updates tracking information for the primary tracked location.
     *    It retrieves location and weather data based on the coordinates and updates the tracking cache.
     * 
     * @returns {Promise<void>} - A promise that resolves when the tracking information has been updated.
     */
    public async getTrackingInformation(): Promise<void> {
        try {
            const cfg = loader.modules.utilities.cfg();
            if (loader.modules.utilities.isLimited("gps.tracking.limit", this.max_threshold, this.max_threshold_time)) {
                return;
            }
            const features = loader.cache.external.tracking.features;
            if (!features) return;
            const target = Array.isArray(features)
                ? features[0] : features[Object.keys(features)[0]];
            if (!target) return;
            const [lon, lat] = target.geometry?.coordinates ?? [];
            if (typeof lon !== "number" || typeof lat !== "number") return;
            const locationUrl = loader.endpoints.map_api
                .replace("${X}", lat)
                .replace("${Y}", lon);
            const weatherUrl = loader.endpoints.mesonet_api
                .replace("${X}", lat)
                .replace("${Y}", lon);
            const locationData = await loader.modules.utilities.httpRequest(locationUrl);
            const address = locationData?.message?.address ?? {};
            const county = address.county ?? "";
            const state = address.state ?? "";
            target.properties.location = `${county}, ${state}`.trim().replace(/^,|,$/g, "");
            target.properties.icao = this.getNearestICAO({ latitude: lat, longitude: lon });
            if (!cfg.sources.miscellaneous_settings.tempest_station.enabled) {
                const weatherData = await loader.modules.utilities.httpRequest(weatherUrl);
                const main = weatherData?.message?.main;
                const wind = weatherData?.message?.wind;
                const wx = weatherData?.message?.weather?.[0];
                loader.cache.external.mesonet.features = parse({
                    longitude: lon,
                    latitude: lat,
                    temperature: typeof main?.temp === "number"
                        ? Math.round(((main.temp - 273.15) * 9/5 + 32)) : null,
                    dewpoint: typeof main?.humidity === "number" && typeof main?.temp === "number"
                        ? Math.round(((main.temp - ((100 - main.humidity) / 5)) - 273.15) * 9/5 + 32) : null,
                    humidity: typeof main?.humidity === "number" ? Math.round(main.humidity) : null,
                    wind_speed: typeof wind?.speed === "number" ? Math.round(wind.speed) : null,
                    wind_direction: typeof wind?.deg === "number"
                        ? loader.modules.calculations.cardinalDirection(wind.deg) : null,
                    conditions: wx?.description ?? null,
                    location: `${county}, ${state}`,
                });
            } else if (cfg.sources.miscellaneous_settings.tempest_station.location_based) {
                const station = await loader.cache.handlers.tempest_client.getClosestStation({ lat, lon });
                if (station) {
                    loader.cache.handlers.tempest_client.setSettings({
                        stationId: station.id,
                        deviceId: station.properties.devices?.[0] ?? null
                    });
                }
            }
        } catch (error) {
            loader.modules.utilities.exception(error, this.name_space + `.getTrackingInformation`);
        }
    }
}


export default Tracking;