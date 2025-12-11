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
        if (!loader.cache.external.tracking.features[name]) {
            loader.cache.external.tracking.features.push({
                type: 'Feature',
                geometry: { type: 'Point', coordinates: [coords.lon, coords.lat] },
                properties: { icao: null, name: name },
            });
        } else { 
            loader.cache.external.tracking.features[name].geometry.coordinates = [coords.lon, coords.lat];
        }
        loader.submodules.utils.log(`Updated current coordinates for ${name} [LON: ${coords.lon}, LAT: ${coords.lat}]`);
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
        const primaryTarget = Object.keys(loader.cache.external.tracking.features)[0];
        const targetCoords = loader.cache.external.tracking.features[primaryTarget]
        if (primaryTarget) {
            loader.cache.internal.limiters.push({ type: `gps.tracking.limit`, timestamp: time });
            targetCoords.properties.icao = this.getNearestICAO(targetCoords.geometry.coordinates[1], targetCoords.geometry.coordinates[0]);
            if (!ConfigType.sources.miscellaneous_settings.tempest_station.enabled) {
                const getLocationNames = loader.apis.open_street_map.replace("${X}", targetCoords.geometry.coordinates[1]).replace("${Y}", targetCoords.geometry.coordinates[0])
                const getWeatherConditions = loader.apis.temperature_coordinates.replace("${X}", targetCoords.geometry.coordinates[1]).replace("${Y}", targetCoords.geometry.coordinates[0])
                const getLocationData = await loader.submodules.networking.httpRequest(getLocationNames)
                const getWeatherData = await loader.submodules.networking.httpRequest(getWeatherConditions)
                loader.cache.external.mesonet.features = loader.submodules.parsing.getWeatherStationStructure({
                    longitude: targetCoords.geometry.coordinates[0],
                    latitude: targetCoords.geometry.coordinates[1],
                    temperature: getWeatherData.message.main ? Math.round(((getWeatherData.message.main.temp - 273.15) * 9/5 + 32)) : null,
                    dewpoint: getWeatherData.message.main ? Math.round(((getWeatherData.message.main.temp - ((100 - getWeatherData.message.main.humidity) / 5)) - 273.15) * 9/5 + 32) : null,
                    humidity: getWeatherData.message.main ? Math.round(getWeatherData.message.main.humidity) : null,
                    wind_speed: getWeatherData.message.wind ? Math.round(getWeatherData.message.wind.speed) : null,
                    wind_direction: getWeatherData.message.wind ? loader.submodules.calculations.convertDegreesToCardinal(getWeatherData.message.wind.deg) : null,
                    conditions: getWeatherData.message.weather ? getWeatherData.message.weather[0].description : null,
                    location: `${getLocationData.message.address.county}, ${getLocationData.message.address.state}`,
                })
            } else { 
                if (ConfigType.sources.miscellaneous_settings.tempest_station.location_based) {
                    loader.cache.handlers.tempestStation.getClosestStation({lat: targetCoords.geometry.coordinates[1], lon: targetCoords.geometry.coordinates[0]}).then((station) => {
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
                loader.cache.external.tracking.features[cfg.pull_key] = coords;
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

