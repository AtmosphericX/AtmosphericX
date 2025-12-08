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

export class GlobalPositioningSystem { 
    NAME_SPACE: string = `submodule:locationtracking`;
    LAST_RT_UPDATE: number = 0;
    MAX_THRESHOLD_TIME: number = 30_000;
    constructor() {
        loader.submodules.utils.log(`${this.NAME_SPACE} initialized.`)
        this.rtSocket()
    }

    /**
     * @function setCurrentCoordinates
     * @description 
     *   Updates the current coordinates for a given location name and triggers any associated events.
     * 
     * @param {string} name - The name of the location to update.
     * @param {types.CoordinatesDefined} coords - The new coordinates to set.
     * @returns {void}
     */
    public setCurrentCoordinates(name: string, coords: types.CoordinatesDefined): void {
        if (loader.cache.handlers.eventManager == null) return;
        loader.cache.external.locations[name] = {
            lat: coords.lat,
            lon: coords.lon,
            icao: null
        }
        loader.cache.handlers.eventManager.setCurrentLocation(name, coords);
        loader.submodules.utils.log(`Updated current coordinates for ${name} [LAT: ${coords.lat}, LON: ${coords.lon}]`);
    }

    /**
     * @function getNearestICAO
     * @description
     *    Finds the nearest NEXRAD radar ICAO code based on provided latitude and longitude.
     * 
     * @param {number} lat - The latitude of the location.
     * @param {number} lon - The longitude of the location.
     * @returns {Promise<string | null>} - The ICAO code of the nearest radar or null if none found.
     */
    public getNearestICAO(lat: number, lon: number): Promise<string | null> {
        const radars = loader.cache.external.nexrad_radars as types.GeoJSONFeatureCollection;
        const distances = radars.features.map((radar: any) => {
            const miles = loader.submodules.calculations.calculateDistance(
                {lat, lon},
                {lat: radar.geometry.coordinates[1], lon: radar.geometry.coordinates[0]},
                'miles'
            );
            return { icao: radar.properties.id, distance: miles };
        });
        distances.sort((a, b) => a.distance - b.distance);
        return distances.length > 0 ? distances[0].icao : null;
    }   

    /**
     * @function getTrackingInformation
     * @description
     *    Fetches tracking information based on the primary target's coordinates and updates the external cache.
     * 
     * @returns {Promise<void>}
     */
    public async getTrackingInformation(): Promise<void> {
        const ConfigType = loader.cache.internal.configurations as types.ConfigurationsType;
        const time = Date.now();
        loader.cache.internal.limiters = loader.cache.internal.limiters.filter(ts => ts.timestamp > time - this.MAX_THRESHOLD_TIME);
        if (loader.cache.internal.limiters.filter(ts => ts.type == `gps.tracking.limit`).length >= 1) {
            return;
        }
        const primaryTarget = Object.keys(loader.cache.external.locations)[0]
        const targetCoords = loader.cache.external.locations[primaryTarget];
        if (primaryTarget) {
            loader.cache.internal.limiters.push({ type: `gps.tracking.limit`, timestamp: time });
            const getLocationNames = loader.apis.open_street_map.replace("${X}", targetCoords.lat).replace("${Y}", targetCoords.lon);
            const getWeatherConditions = loader.apis.temperature_coordinates.replace("${X}", targetCoords.lat).replace("${Y}", targetCoords.lon)
            const getLocationData = await loader.submodules.networking.httpRequest(getLocationNames)
            const getWeatherData = await loader.submodules.networking.httpRequest(getWeatherConditions)
            targetCoords.icao = this.getNearestICAO(targetCoords.lat, targetCoords.lon);
            if (!ConfigType.sources.miscellaneous_settings.tempest_station.enabled) {
                loader.cache.external.mesonet = loader.submodules.parsing.getWeatherStationStructure({
                    longitude: targetCoords.lon,
                    latitude: targetCoords.lat,
                    dbz: targetCoords.dbz,
                    icao: targetCoords.icao,
                    temperature: getWeatherData.message.main ? Math.round(((getWeatherData.message.main.temp - 273.15) * 9/5 + 32)) : null,
                    dewpoints: getWeatherData.message.main ? Math.round(((getWeatherData.message.main.temp - ((100 - getWeatherData.message.main.humidity) / 5)) - 273.15) * 9/5 + 32) : null,
                    humidity: getWeatherData.message.main ? Math.round(getWeatherData.message.main.humidity) : null,
                    wind_speed: getWeatherData.message.wind ? Math.round(getWeatherData.message.wind.speed) : null,
                    wind_direction: getWeatherData.message.wind ? loader.submodules.calculations.convertDegreesToCardinal(getWeatherData.message.wind.deg) : null,
                    conditions: getWeatherData.message.weather ? getWeatherData.message.weather[0].description : null,
                    location: `${getLocationData.message.address.county}, ${getLocationData.message.address.state} (${getLocationData.message.address.city ? getLocationData.message.address.city : `${getLocationData.message.address.house_number} ${getLocationData.message.address.road}`})`,
                })
            } else { 
                if (ConfigType.sources.miscellaneous_settings.tempest_station.location_based) {
                    loader.cache.handlers.tempestStation.getClosestStation({lat: targetCoords.lat, lon: targetCoords.lon}).then((station) => {
                        loader.submodules.utils.log(`Closest Tempest Station to [LAT: ${targetCoords.lat}, LON: ${targetCoords.lon}] is ${station.properties.name}`);
                        loader.cache.handlers.tempestStation.setSettings({stationId: station.id, deviceId: station.properties.devices[0]})
                    })
                }
            }
        }    
    }

    /**
     * @function rtListener
     * @description
     *    Sets up a listener for real-time location updates from Firebase Realtime Database.
     * 
     * @returns {void}
     */
    private rtListener(): void {
        const ConfigType = loader.cache.internal.configurations as types.ConfigurationsType;
        const cfg = ConfigType.sources.location_settings.realtime_irl;
        const db = loader.packages.firebaseDatabase.getDatabase(loader.cache.handlers.rtSocket);
        const ref = loader.packages.firebaseDatabase.child(
            loader.packages.firebaseDatabase.ref(db, `pullables`),
            cfg.pull_key
        );
        const listener = (snapshot) => {
            const snap = snapshot.val();
            if (snap == null) return;
            if (snap.updatedAt !== this.LAST_RT_UPDATE) {
                this.LAST_RT_UPDATE = snap.updatedAt;
                const coords = { 
                    lat: snap.location.latitude, 
                    lon: snap.location.longitude
                };
                loader.cache.external.locations[cfg.pull_key] = coords;
                this.setCurrentCoordinates(cfg.pull_key, coords);
            }
        };
        loader.packages.firebaseDatabase.onValue(ref, listener);
    }

    /**
     * @function rtSocket
     * @description
     *    Initializes the Firebase Realtime Database connection for real-time location tracking.
     *
     * @returns {string}
     */
    private rtSocket(): void {
        const ConfigType = loader.cache.internal.configurations as types.ConfigurationsType;
        const cfg = ConfigType.sources.location_settings.realtime_irl;
        if (!cfg.enabled) return;
        loader.cache.handlers.rtSocket = loader.packages.firebaseApp.initializeApp({
            apiKey: `AIzaSyC4L8ICZbJDufxe8bimRdB5cAulPCaYVQQ`,
            databaseURL: `https://rtirl-a1d7f-default-rtdb.firebaseio.com`,
            projectId: `rtirl-a1d7f`,
            appId: `1:684852107701:web:d77a8ed0ee5095279a61fc`,
            measurementId: `G-TR97D81LT3`,
        }, `rtlirl-api`);
        this.rtListener();
    }
}

export default GlobalPositioningSystem;

