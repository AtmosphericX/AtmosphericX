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

import * as loader from '../../..'
import * as types from '../../../@dictionaries/types';

interface RequestQuery {
    lat?: string;
    lon?: string;
    [key: string]: string | undefined;
}

interface PlacefileSettings {
    enabled: boolean;
    filters?: {
        enabled: boolean;
        filter_by_radius: number;
        filter_units: string;
    }
}

type PlacefileEntry = { 
    title?: string; 
    description?: string; 
    polygon?: Record<string, number>;
    point?: number[];
    rgb?: string 
    icon?: string
};

type PlacefileCache = { 
    placefile: string; 
    sent: number; 
};

type TrackingType = { 
    geometry: Record<string, number>; 
    properties: { 
        name: string;
        location: string;
        icao: string;
        last_updated: string;
    };
}

type PulsePointType = {
    geometry: Record<string, number>;
    properties: {
        event: string;
        address: string;
        issued: string;
        units: { id: string }[];
    };
}

type DiscussionType = { 
    geometry: Record<string, number>; 
    properties: { 
        name: string; location: string;
        issued: string; mesoscale_id: string;
        outlook: string; expires: string;
        population?: string; homes?: string;
        locations?: string; tornado_probability?: string;
        wind_probability?: string; hail_probability?: string;
        description?: string;
    }; 
}

type StreamType = {
    geometry: Record<string, number>;
    properties: {
        name: string;
        location: string;
        stream_url: string;
        model: string;
    };
}

export class Init { 
    name_space: string = `Routes.Placefiles.Authority`;
    ansi_colors = loader.modules.utilities.ansi_colors;
    server = loader.cache.handlers.express;
    settings: string = [
        `Font: 1, 11, 0, "Courier New"`,
        `IconFile: 1, 30, 30, 15, 15, "https://www.spotternetwork.org/iconsheets/Spotternet_096.png"`,
        `IconFile: 2, 21, 35, 10, 17, "https://www.spotternetwork.org/iconsheets/Arrows_096.png"`,
        `IconFile: 6, 30, 30, 15, 15, "https://www.spotternetwork.org/iconsheets/Spotternet_New_096.png"`
    ].join('\n') + '\n'
    cache: Record<string, PlacefileCache> = {};
    constructor() {
        loader.modules.utilities.log({ 
            title: `${this.ansi_colors.GREEN}${this.name_space}${this.ansi_colors.RESET}`, 
            message: `Successfully initialized`
        });
        const getRoutes = loader.strings.route_locations;
        const getMessages = loader.strings.route_messages;
        const storage = loader.packages.path.resolve(`..`, `storage`);
        this.server.get(getRoutes.get_placefile_endpoint, async (request: types.ExpressRequest, response: types.ExpressResponse) => {
            try {
                const { address } = await loader.modules.routing.getUserSession(request);
                const getType = request.params.type ?? null;
                const query = request.query ?? {};
                const configurations = loader.modules.utilities.cfg();
                const settings = configurations.placefile_settings?.[getType]
                if (!settings?.enabled || settings == undefined) {
                    return response.status(403).json({ success: false, message: getMessages.response_placefile_disabled });
                }
                const cacheKey = getType;
                const cacheEntry = this.cache[cacheKey];
                const cacheDuration = (configurations?.placefile_settings?.cache_duration ?? 60) * 1000;
                const placefileMethods: Record<string, (query: RequestQuery, settings: PlacefileSettings) => Promise<string>> = {
                    events: this.generateEventsPlacefile.bind(this),
                    tracking: this.getTrackingPlacefile.bind(this),
                    discussions: this.getDiscussionsPlacefile.bind(this),
                    streams: this.getStreamPlacefiles.bind(this),
                    pulsepoint: this.getPulsePointPlacefiles.bind(this),

                };
                if (placefileMethods[getType]) {
                    if (cacheEntry && (Date.now() - cacheEntry.sent < cacheDuration)) {
                        return response.status(200).type('text/plain').send(cacheEntry.placefile);
                    }
                    const placefile = await placefileMethods[getType](query, settings);
                    this.cache[cacheKey] = { placefile, sent: Date.now() };
                    loader.modules.utilities.log({ 
                        title: `${this.ansi_colors.GREEN}${this.name_space}${this.ansi_colors.RESET}`, 
                        message: `Generated new placefile for type: ${this.ansi_colors.CYAN}${getType}${this.ansi_colors.RESET} for ${address}`,
                    });
                    return response.status(200).type('text/plain').send(placefile);
                }
                
            } catch (error) {
                loader.modules.utilities.exception(error, `${this.name_space}/GET ${getRoutes.get_dashboard_endpoint}`);
                return response.status(500).sendFile(`${storage}${getRoutes.unknown_direct_path}`);
            }
        })
    }

    /**
     * @private
     * @production
     * @function getTrackingPlacefile
     * @description
     *      Generates a placefile for tracking data based on query parameters and settings.
     *  
     * @param {RequestQuery} query - The query parameters from the request.
     * @param {PlacefileSettings} settings - The placefile settings from the configuration.
     * @return {void}
     */
    private async getTrackingPlacefile(query: RequestQuery, settings: PlacefileSettings): Promise<string> {
        const qLatitude = Number(query.lat ?? 0);
        const qLongitude = Number(query.lon ?? 0);
        const getTrackers = loader.cache.external.tracking.features.map((tracker: TrackingType) => {
            const index = loader.cache.external.tracking.features.findIndex((t: TrackingType) => t.properties.name === tracker.properties.name);
            const cLongitude = Number(tracker.geometry.coordinates[0]);
            const cLatitude = Number(tracker.geometry.coordinates[1]);
            const mesonet = loader.cache.external.mesonet.features?.[0] ?? null;
            if (settings?.filters?.enabled) {
                const distance = loader.modules.calculations.distanceBetweenPoints(
                    { lon: qLongitude, lat: qLatitude }, { lon: cLongitude, lat: cLatitude },
                    settings?.filters?.filter_units ?? `miles`
                )
                if (distance > (settings?.filters?.filter_by_radius ?? 0)) { return null; }
            }
            let description = [
                `Name: ${tracker.properties.name ?? `Unknown`}`,
                `Location: ${tracker.properties.location ?? `Unknown Location`}`,
                `ICAO: ${tracker.properties.icao ?? `N/A`}`,
                `Updated: ${new Date(tracker.properties.last_updated ?? '').toLocaleString() ?? `N/A`}`,
            ]
            if (index === 0) {
                description.push(`Temperature: ${mesonet ? mesonet.properties.temperature + ` °F` : `N/A`}`);
                description.push(`Dew Point: ${mesonet ? mesonet.properties.dewpoint + ` °F` : `N/A`}`);
                description.push(`Wind Speed: ${mesonet ? mesonet.properties.wind_speed + ` mph` : `N/A`}`);
                description.push(`Wind Direction: ${mesonet ? mesonet.properties.wind_direction : `N/A`}`);
                description.push(`Humidity: ${mesonet ? mesonet.properties.humidity + ` %` : `N/A`}`);
                description.push(`Conditions: ${mesonet ? mesonet.properties.conditions : `N/A`}`);
            }
            description.push(`Source: AtmosphericX (RTIRL + Spotter Network)`);
            return { 
                title: tracker.properties.name ?? 'Unknown', 
                description: description.join('\\n').replace(/;/g, ' -').replace(/,/g, ''),
                point: [cLongitude, cLatitude], 
                rgb: '255,0,0,255', 
                icon: '0,0,000,1,19'
            }
        });
        const results = (await Promise.all(getTrackers)).filter(Boolean) as Exclude<PlacefileEntry, null>[];
        const placefile = await loader.packages.PlacefileManager.createPlacefile({
            refresh: 1, threshold: 99999, title: `AtmosphericX - Trackers`, settings: this.settings,
            type: `point`, data: results
        });
        return placefile;
    }

    /**
     * @private
     * @production
     * @function getStreamPlacefiles
     *     Generates a placefile for streams based on query parameters and settings.
     *    
     * @param {RequestQuery} query - The query parameters from the request.
     * @param {PlacefileSettings} settings - The placefile settings from the configuration.
     * @return {void}
     */
    private async getStreamPlacefiles(query: RequestQuery, settings: PlacefileSettings): Promise<string> {
        const qLatitude = Number(query.lat ?? 0);
        const qLongitude = Number(query.lon ?? 0);
        const getTrackers = loader.cache.external.streams.features.map((stream: StreamType) => {
            const cLongitude = Number(stream.geometry.coordinates[0]);
            const cLatitude = Number(stream.geometry.coordinates[1]);
            if (settings?.filters?.enabled) {
                const distance = loader.modules.calculations.distanceBetweenPoints(
                    { lon: qLongitude, lat: qLatitude }, { lon: cLongitude, lat: cLatitude },
                    settings?.filters?.filter_units ?? `miles`
                )
                if (distance > (settings?.filters?.filter_by_radius ?? 0)) { return null; }
            }
            let description = [
                `Name: ${stream.properties.name ?? `Unknown`}`,
                `Location: ${stream.properties.location ?? `Unknown Location`}`,
                `Stream: ${stream.properties.stream_url ?? `N/A`}`,
                `Model: ${stream.properties.model ?? `N/A`}`,
                `Source: AtmosphericX (Radar Omega)`,
            ]
            return { 
                description: description.join('\\n').replace(/;/g, ' -').replace(/,/g, ''),
                point: [cLongitude, cLatitude], 
                rgb: '255,0,0,255', 
                icon: '0,0,000,1,20'
            }
        });
        const results = (await Promise.all(getTrackers)).filter(Boolean) as Exclude<PlacefileEntry, null>[];
        const placefile = await loader.packages.PlacefileManager.createPlacefile({
            refresh: 1, threshold: 99999, title: `AtmosphericX - Streams`, settings: this.settings,
            type: `point`, data: results
        });
        return placefile;
    }

    /**
     * @private
     * @production
     * @function generateEventsPlacefile
     * @description
     *      Generates a placefile for events based on query parameters and settings.
     *
     * @param {RequestQuery} query - The query parameters from the request.
     * @param {PlacefileSettings} settings - The placefile settings from the configuration.
     * @return {void}
     */
    private async generateEventsPlacefile(query: RequestQuery, settings: PlacefileSettings): Promise<string> {
        const qLatitude = Number(query.lat ?? 0);
        const qLongitude = Number(query.lon ?? 0);
        const configurations = loader.modules.utilities.cfg();
        const isParsingUgc = configurations.sources.atmosx_parser_settings.global_settings.ignore_geometry_parsing;
        const getEvents = loader.cache.external.events.features.map(async (event: types.EventType) => {
            if (event.properties.center == undefined) { return null; }
            const cLongitude = Number(event.properties.center.lon);
            const cLatitude = Number(event.properties.center.lat);
            if (settings?.filters?.enabled) {
                const distance = loader.modules.calculations.distanceBetweenPoints(
                    { lon: qLongitude, lat: qLatitude }, { lon: cLongitude, lat: cLatitude },
                    settings?.filters?.filter_units ?? `miles`
                )
                if (distance > (settings?.filters?.filter_by_radius ?? 0)) { return null; }
            }
            const description = [
                `Event: ${event.properties.event ?? 'Unknown Event'} (${event.properties.action_type ?? 'N/A'})`,
                `Locations: ${event.properties.locations ?? 'Unknown Locations'}`,
                `Issued: ${new Date(event.properties.issued ?? '').toLocaleString() ?? 'N/A'}`,
                `Expires: ${new Date(event.properties.expires ?? '').toLocaleString() ?? 'N/A'}`,
                `Tags: ${event.properties.tags.join(' - ') ?? 'N/A'}`,
                `Tracking: ${event.properties.details.tracking ?? 'N/A'}`,
                `Source: AtmosphericX (${loader.cache.internal.source})`
            ].join('\\n').replace(/;/g, ' -').replace(/,/g, '');
            let getPolygon = event.geometry ?? null;
            if (!getPolygon && isParsingUgc == true) {
                getPolygon = await loader.cache.handlers.parser_client.getEventPolygon(event)
            }
            if (!getPolygon) return null;
            return {
                title: `${event.properties.event ?? 'Unknown Event'} (${event.properties.action_type ?? 'N/A'})`,
                description,
                polygon: getPolygon,
                rgb: (event?.properties?.client?.theme?.primary).replace(/^rgb\(|\)$/g, '') + ',255',
            }
        });
        const results = (await Promise.all(getEvents)).filter(Boolean) as Exclude<PlacefileEntry, null>[];
        const placefile = await loader.packages.PlacefileManager.createPlacefile({
            refresh: 1, threshold: 99999, title: `AtmosphericX - Events`, settings: this.settings,
            type: `polygon`, data: results
        });
        return placefile;
    }

    /**
     * @private
     * @production
     * @function getDiscussionsPlacefile
     * @description
     *      Generates a placefile for mesoscale discussions based on query parameters and settings.
     * 
     * @param {RequestQuery} query - The query parameters from the request.
     * @param {PlacefileSettings} settings - The placefile settings from the configuration.
     * @return {void}
     */
    private async getDiscussionsPlacefile(query: RequestQuery, settings: PlacefileSettings): Promise<string> {
        const qLatitude = Number(query.lat ?? 0);
        const qLongitude = Number(query.lon ?? 0);
        const getDiscussions = loader.cache.external.discussions.features.map((discussion: DiscussionType) => {
            const cLongitude = Number(discussion.geometry.coordinates[0]);
            const cLatitude = Number(discussion.geometry.coordinates[1]);
            if (settings?.filters?.enabled) {
                const distance = loader.modules.calculations.distanceBetweenPoints(
                    { lon: qLongitude, lat: qLatitude }, { lon: cLongitude, lat: cLatitude },
                    settings?.filters?.filter_units ?? `miles`
                )
                if (distance > (settings?.filters?.filter_by_radius ?? 0)) { return null; }
            }
            const description = [
                `ID: ${discussion.properties.mesoscale_id ?? `N/A`}`,
                `Outlook: ${discussion.properties.outlook ?? `N/A`}`,
                `Issued: ${new Date(discussion.properties.issued ?? '').toLocaleString() ?? `N/A`}`,
                `Expires: ${new Date(discussion.properties.expires ?? '').toLocaleString() ?? `N/A`}`,
                `Population: ${discussion.properties.population ?? `N/A`}`,
                `Homes Affected: ${discussion.properties.homes ?? `N/A`}`,
                `Locations: ${discussion.properties.locations ?? `N/A`}`,
                `Tornado Probability: ${discussion.properties.tornado_probability ?? `N/A`}`,
                `Wind Probability: ${discussion.properties.wind_probability ?? `N/A`}`,
                `Hail Probability: ${discussion.properties.hail_probability ?? `N/A`}`,
                `Description: ${discussion.properties.description.replace(/<br\s*\/?>/gi, ' ') ?? `N/A`}`,
                `Source: AtmosphericX (WeatherWise)`
            ].join('\\n').replace(/;/g, ' -').replace(/,/g, '');
            return { 
                title: `Mesoscale Discussion ${discussion.properties.mesoscale_id ?? 'N/A'}`, 
                description, 
                polygon: discussion.geometry,
                rgb: '0,0,255,255', 
                icon: '2,0,000,2,17'
            }
        });
        const results = (await Promise.all(getDiscussions)).filter(Boolean) as Exclude<PlacefileEntry, null>[];
        const placefile = await loader.packages.PlacefileManager.createPlacefile({
            refresh: 1, threshold: 99999, title: `AtmosphericX - Discussions`, settings: this.settings,
            type: `polygon`, data: results
        });
        return placefile;
    }

    /**
     * @private
     * @production
     * @function getPulsePointPlacefiles
     * @description
     *     Generates a placefile for PulsePoint events based on query parameters and settings.
     * 
     * @param {RequestQuery} query - The query parameters from the request.
     * @param {PlacefileSettings} settings - The placefile settings from the configuration.
     * @return {void}
     */
    private async getPulsePointPlacefiles(query: RequestQuery, settings: PlacefileSettings): Promise<string> {
        const qLatitude = Number(query.lat ?? 0);
        const qLongitude = Number(query.lon ?? 0);
        const getTrackers = loader.cache.external.pulsepoint.features.map((pulsepoint: PulsePointType) => {
            const cLongitude = Number(pulsepoint.geometry.coordinates[0]);
            const cLatitude = Number(pulsepoint.geometry.coordinates[1]);
            if (settings?.filters?.enabled) {
                const distance = loader.modules.calculations.distanceBetweenPoints(
                    { lon: qLongitude, lat: qLatitude }, { lon: cLongitude, lat: cLatitude },
                    settings?.filters?.filter_units ?? `miles`
                )
                if (distance > (settings?.filters?.filter_by_radius ?? 0)) { return null; }
            }
            let description = [
                `Type: ${pulsepoint.properties.event ?? `Unknown Event`}`,
                `Address: ${pulsepoint.properties.address ?? `Unknown Address`}`,
                `Last Updated: ${pulsepoint.properties.issued ?? `N/A`}`,
                `Responding Units: ${pulsepoint.properties.units.map(u => u.id).join(", ") ?? `N/A`}`,
            ]
            description.push(`Source: PulsePoint (AtmosphericX)`);
            return { 
                title: pulsepoint.properties.event ?? 'Unknown', 
                description: description.join('\\n').replace(/;/g, ' -').replace(/,/g, ''),
                point: [cLongitude, cLatitude], 
                rgb: '255,0,0,255', 
                icon: '0,0,000,1,11'
            }
        });
        const results = (await Promise.all(getTrackers)).filter(Boolean) as Exclude<PlacefileEntry, null>[];
        const placefile = await loader.packages.PlacefileManager.createPlacefile({
            refresh: 1, threshold: 99999, title: `AtmosphericX - PulsePoint`, settings: this.settings,
            type: `point`, data: results
        });
        return placefile;
    }


}

export default Init;