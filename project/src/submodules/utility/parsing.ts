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

export class Parsing { 
    NAME_SPACE: string = `submodule:parsing`;
    constructor() {
        loader.submodules.utils.log(`${this.NAME_SPACE} initialized.`)
    }

    /**
     * @function getGibsonReportStructure
     * @description
     *     Parses a Gibson Ridge Placefile body and converts it into a GeoJSON FeatureCollection.
     * 
     * @param {string} body
     * @returns {Promise<types.GeoJSONFeatureCollection>}
     */
    public async getGibsonReportStructure(body: string): Promise<types.GeoJSONFeatureCollection> {
        const structure: types.GeoJSONFeatureCollection = { type: 'FeatureCollection', features: [] };
        const parsed = await loader.packages.PlacefileManager.parseTable(body) as types.GibsonRidgeReportTypes[];
        for (const feature of parsed) {
            const lon = parseFloat(feature.lon);
            const lat = parseFloat(feature.lat);
            if (isNaN(lon) || isNaN(lat)) continue;
            structure.features.push({
                type: 'Feature',
                geometry: { type: 'Point', coordinates: [lon, lat] },
                properties: {
                    location: `${feature.city ?? 'N/A'}, ${feature.county ?? 'N/A'}, ${feature.state ?? 'N/A'}`,
                    event: feature.event ?? 'N/A',
                    sender: feature.source ?? 'N/A',
                    description: `${feature.event ?? 'Event'} reported at ${feature.city ?? 'Unknown'}, ${feature.county ?? 'Unknown'}, ${feature.state ?? 'Unknown'}. ${feature.comment ?? 'No additional details.'}`,
                    magnitude: feature.mag ?? 0,
                    office: feature.office ?? 'N/A',
                    date: feature.date ?? 'N/A',
                    time: feature.time ?? 'N/A'
                }
            });
        }
        return structure;
    }

    /**
     * @function getSpotterReportStructure
     * @description
     *     Parses a Spotter Network Placefile body and converts it into a GeoJSON FeatureCollection.
     * 
     * @param {string} body
     * @returns {Promise<types.GeoJSONFeatureCollection>}
     */
    public async getSpotterReportStructure(body: string): Promise<types.GeoJSONFeatureCollection> {
        const structure: types.GeoJSONFeatureCollection = { type: 'FeatureCollection', features: [] };
        const parsed = await loader.packages.PlacefileManager.parsePlacefile(body) as types.DefaultPlacefileParsingTypes[];
        for (const feature of parsed) {
            const lon = parseFloat(feature.icon.x);
            const lat = parseFloat(feature.icon.y);
            if (isNaN(lon) || isNaN(lat)) continue;
            const lines = feature.icon.label.split('\n').map(l => l.trim());
            structure.features.push({
                type: 'Feature',
                geometry: { type: 'Point', coordinates: [lon, lat] },
                properties: {
                    event: lines[1] ?? 'N/A',
                    reporter: lines[0]?.replace('Reported By:', '').trim() ?? 'N/A',
                    size: lines[2]?.replace('Size:', '').trim() ?? 'N/A',
                    notes: lines[3]?.replace('Notes:', '').trim() ?? 'N/A',
                    sender: "Spotter Network",
                    description: feature.icon.label.replace(/\n/g, '<br>').trim() ?? 'N/A'
                }
            });
        }
        return structure;
    }
    
    /**
     * @function getSPCDiscussions
     * @description
     *     Parses SPC GeoJSON discussion data and converts it into a GeoJSON FeatureCollection.
     *     Filters out expired discussions and extracts relevant probabilities and metadata.
     * 
     * @param {string} body
     * @returns {Promise<types.GeoJSONFeatureCollection>}
     */
    public async getSPCDiscussions(body: string): Promise<types.GeoJSONFeatureCollection> {
        const structure: types.GeoJSONFeatureCollection = { type: 'FeatureCollection', features: [] };
        const parsed = await loader.packages.PlacefileManager.parseGeoJSON(body) as types.SPCDiscussionTypes[];
        for (const feature of parsed) {
            if (!feature.properties || !feature.coordinates) continue;
            if (feature.properties.expires_at_ms < Date.now()) continue;
            const torProb = loader.packages.TextParser.textProductToString(feature.properties.text, 'MOST PROBABLE PEAK TORNADO INTENSITY...', []);
            const winProb = loader.packages.TextParser.textProductToString(feature.properties.text, 'MOST PROBABLE PEAK WIND GUST...', []);
            const hagProb = loader.packages.TextParser.textProductToString(feature.properties.text, 'MOST PROBABLE PEAK HAIL SIZE...', []);
            structure.features.push({
                type: 'Feature',
                geometry: { type: 'Polygon', coordinates: feature.coordinates },
                properties: {
                    mesoscale_id: feature.properties.number ?? 'N/A',
                    expires: feature.properties.expires_at_ms ? new Date(feature.properties.expires_at_ms).toLocaleString() : 'N/A',
                    issued: feature.properties.issued_at_ms ? new Date(feature.properties.issued_at_ms).toLocaleString() : 'N/A',
                    description: loader.packages.TextParser.textProductToDescription(feature.properties.text)?.replace(/\n/g, '<br>') ?? 'N/A',
                    locations: feature.properties.tags?.AREAS_AFFECTED?.join(', ') ?? 'N/A',
                    outlook: feature.properties.tags?.CONCERNING?.join(', ') ?? 'N/A',
                    population: feature.properties.population?.people?.toLocaleString() ?? '0',
                    homes: feature.properties.population?.homes?.toLocaleString() ?? '0',
                    parameters: {
                        tornado_probability: torProb,
                        wind_probability: winProb,
                        hail_probability: hagProb,
                    },
                }
            });
        }
        return structure;
    }

    /**
     * @function getSpotterFeed
     * @description
     *     Parses a Spotter Network Placefile feed, filters pins based on configuration,
     *     updates current locations, calculates distances, and converts to a GeoJSON FeatureCollection.
     * 
     * @param {string} body
     * @returns {Promise<types.GeoJSONFeatureCollection>}
     */
    public async getSpotterFeed(body: string): Promise<types.GeoJSONFeatureCollection> {
        const ConfigType = loader.cache.internal.configurations as types.ConfigurationsType;
        const feedConfig = ConfigType.sources?.location_settings?.spotter_network_feed;
        const structure: types.GeoJSONFeatureCollection = { type: 'FeatureCollection', features: [] };
        const parsed = await loader.packages.PlacefileManager.parsePlacefile(body) as types.DefaultPlacefileParsingTypes[];
        const locations = Object.keys(loader.cache.external.locations);
        for (const feature of parsed) {
            const lon = parseFloat(feature.object.coordinates[1]);
            const lat = parseFloat(feature.object.coordinates[0]);
            if (isNaN(lon) || isNaN(lat)) continue;
            const isActive = (feature.icon.scale === 6 && feature.icon.type === '2') && feedConfig.pins.active;
            const isStreaming = (feature.icon.scale === 1 && feature.icon.type === '19') && feedConfig.pins.streaming;
            const isIdle = (feature.icon.scale === 6 && feature.icon.type === '6') && feedConfig.pins.idle;
            if (!isActive && !isStreaming && (!isIdle || !feedConfig.pins.offline)) continue;
            if (feedConfig.pin_by_name.length > 0) {
                const idx = feedConfig.pin_by_name.findIndex(name => feature.icon.label.includes(name));
                if (idx !== -1) {
                    const name = feedConfig.pin_by_name[idx];
                    loader.submodules.gps.setCurrentCoordinates(name, { lat, lon }, `spotter_network`);
                }
            }
            let distance = 0;
            if (locations.length > 0) {
                const index = locations[0] as string;
                distance = loader.submodules.calculations.calculateDistance(
                    { lat, lon },
                    { lat: loader.cache.external.locations[index].lat, lon: loader.cache.external.locations[index].lon }
                );
            }
            structure.features.push({
                type: 'Feature',
                geometry: { type: 'Point', coordinates: [lon, lat] },
                properties: {
                    description: feature.icon.label?.replace(/\n/g, '<br>') ?? 'N/A',
                    distance,
                    status: isActive ? 'Active' : isStreaming ? 'Streaming' : isIdle ? 'Idle' : 'Unknown',
                }
            });
        }
        return structure;
    }

    /**
     * @function getProbabilityStructure
     * @description
     *     Parses a Placefile feed for probability data (tornado or severe) and returns
     *     entries that exceed the configured threshold.
     * 
     * @param {string} body
     * @param {'tornado' | 'severe'} type
     * @returns {Promise<types.ProbabilityTypes[]>}
     */
    public async getProbabilityStructure(body: string, type: 'tornado' | 'severe'): Promise<types.ProbabilityTypes[]> {
        const structure: types.ProbabilityTypes[] = [];
        const ConfigType = loader.cache.internal.configurations as types.ConfigurationsType;
        const threshold = ConfigType.sources.probability_settings[type]?.percentage_threshold ?? 50;
        const typeRegexp = type === 'tornado' ? /ProbTor: (\d+)%\// : /PSv3: (\d+)%\//;
        const parsed = await loader.packages.PlacefileManager.parsePlacefile(body) as types.DefaultPlacefileParsingTypes[];
        for (const feature of parsed) {
            if (!feature.line?.text) continue;
            const probMatch = feature.line.text.match(typeRegexp);
            const probability = probMatch ? parseInt(probMatch[1]) : 0;
            const shearMatch = feature.line.text.match(/Max LLAzShear: ([\d.]+)/);
            const shear = shearMatch ? parseFloat(shearMatch[1]) : 0;
            if (probability >= threshold) {
                structure.push({
                    type,
                    probability,
                    shear,
                    description: feature.line.text.replace(/\n/g, '<br>') ?? 'N/A'
                });
            }
        }
        return structure;
    }
  
    /**
     * @function getWxRadioStructure
     * @description
     *     Converts WX Radio source data into a GeoJSON FeatureCollection.
     * 
     * @param {types.WxRadioTypes} body
     * @returns {types.GeoJSONFeatureCollection}
     */
    public getWxRadioStructure(body: types.WxRadioTypes): types.GeoJSONFeatureCollection {
        let structure = { type: 'FeatureCollection', features: [] }
        for (const feature of body.sources) {
            const lon = parseFloat(feature.lon as string);
            const lat = parseFloat(feature.lat as string);
            if (isNaN(lon) || isNaN(lat)) continue;
            structure.features.push({
                type: 'Feature',
                geometry: {type: 'Point', coordinates: [lon, lat]},
                properties: {
                    location: feature?.location ?? 'N/A', callsign: feature?.callsign ?? 'N/A',
                    frequency: feature?.frequency ?? 'N/A', stream: feature?.listen_url ?? 'N/A',
                }
            })
        }
        return structure;
    }

    /**
     * @function getTropicalStormStructure
     * @description
     *     Converts tropical storm data into a GeoJSON FeatureCollection.
     * 
     * @param {types.TropicalStormTypes[]} body
     * @returns {types.GeoJSONFeatureCollection}
     */
    public getTropicalStormStructure(body: types.TropicalStormTypes[]): types.GeoJSONFeatureCollection {
        const structure: types.GeoJSONFeatureCollection = { type: 'FeatureCollection', features: [] };
        for (const feature of body) {
            structure.features.push({
                type: 'Feature',
                properties: {
                    name: feature.name ?? 'N/A',
                    discussion: feature.forecast_discussion ?? 'N/A',
                    classification: feature.classification ?? 'N/A',
                    pressure: feature.pressure ?? 0,
                    wind_speed: feature.wind_speed_mph ?? 0,
                    last_updated: feature.last_update_at ? new Date(feature.last_update_at).toLocaleString() : 'N/A'
                }
            });
        }
        return structure;
    }

    /**
     * @function getWxEyeSondeStructure
     * @description
     *     Converts raw WxEyeSonde data into an array of string-based records.
     * 
     * @param {unknown[]} body
     * @returns {Record<string, string>[]}
     */
    public getWxEyeSondeStructure(body: unknown[]): Record<string, string>[] {
        return body.map(feature => feature as Record<string, string>);
    }

    /**
     * @function getWeatherNexradRadars
     * @description
     *    Converts data from NWS API into a GeoJSON FeatureCollection for WSR-88D radar locations.
     * 
     * @param {any} body
     * @returns {Record<string, any>}
     */
    public getWeatherNexradRadars(body): Record<string, any> {
        const structure: Record<string, any> = { features: [] };
        if (!body || !Array.isArray(body.features)) return structure;
        for (const f of body.features) {
            const coords = f?.geometry?.coordinates;
            if (!Array.isArray(coords) || coords.length < 2) continue;
            const id = f?.properties?.id ?? f?.id ?? f?.properties?.['@id'];
            if (!id) continue;
            const lon = parseFloat(String(coords[0]));
            const lat = parseFloat(String(coords[1]));
            if (isNaN(lon) || isNaN(lat)) continue;
            if (!id.startsWith('K') && !id.startsWith('P') && !id.startsWith('C')) continue;
            structure.features.push({ id, lon, lat });
        }
        return structure;
    }

    /**
     * @function getWeatherStationStructure
     * @description
     *     Converts raw weather station data into a GeoJSON FeatureCollection.
     * 
     * @param {any} body
     * @returns {unknown}
     */
    public getWeatherStationStructure(body): unknown {
        return {
            features: [{
                geometry: { type: "Point", coordinates: [body.latitude, body.longitude] },
                type: "Feature",
                properties: {
                    temperature: body.temperature,
                    dewpoints: body.dewpoints,
                    humidity: body.humidity,
                    wind_speed: body.wind_speed,
                    wind_direction: body.wind_direction,  
                    conditions: body.conditions,
                    location: body.location  
                }
            }]
        }
    }
}

export default Parsing;

