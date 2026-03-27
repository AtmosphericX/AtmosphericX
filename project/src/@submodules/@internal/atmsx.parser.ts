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
import { getConfigurations } from '../../@dictionaries/@configurations/atmsx-parser';

interface onMessage { 
    awipsType: { type: string };
    message: string;
}

interface setHashesEntry {
    tracking: string;
    hashes: string[];
    expires: string;
}

type polygonMetadata = {
    setSpotters: any[],
    getCenter: {lon: number, lat: number},
    isWithinProximity: boolean
};


export class ATMSXParser {
    name_space: string = `Internal.Atmsx.Parser`;
    ansi_colors = loader.modules.utilities.ansi_colors;
    pkg = loader.packages.AlertManager;
    mgr = null;
    cache_events: types.EventType[] = [];
    event_queue: types.EventType[] = [];
    cache_processing: boolean = false;
    emitter_processing: boolean = false;
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
     * @function initRandomService
     * @description
     *    Initializes the random event service by selecting the next event
     *    from the cached external events and updating the random event cache.
     * 
     * @return {types.EventType | null} - The selected random event or null if none available.
     */
    public initRandomService(): types.EventType | null {
        try {
            const exEvents = loader.cache.external.events;
            const features = Array.isArray(exEvents?.features) 
                ? exEvents.features.filter((x): x is types.EventType => x != null && typeof x === "object" && Object.keys(x).length > 0) : [];
            if (features.length === 0) {
                loader.cache.external.random_event = {
                    type: "FeatureCollection",
                    features: [],
                    index: 0
                };
                return null;
            }
            const prevIndex = loader.cache.external.random_event?.index ?? -1;
            const nextIndex = (prevIndex + 1) % features.length;
            const event = features[nextIndex];
            loader.cache.external.random_event = {
                type: "FeatureCollection",
                features: [event],
                index: nextIndex
            };
            return event;
        } catch (error) {
            loader.modules.utilities.exception(error, this.name_space + `.initRandomService`);
            return null;
        }
    }

    /**
     * @public
     * @production
     * @error_handling
     * @function initQueueService
     * @description
     *   Initializes the event queue service by sorting incoming events by their issued timestamp
     *   and processing them in a separate thread to avoid blocking the main execution flow.
     *   
     * @param {types.EventType[]} events - The array of events to be queued and processed.
     * @return {Promise<void>} - A promise that resolves when the queue service is initialized.
     */
    private async initQueueService(events: types.EventType[]): Promise<void> {
        const sortByTimestamp = [...events].sort((a, b) => {
            const aIssued = new Date(a?.properties?.issued).getTime();
            const bIssued = new Date(b?.properties?.issued).getTime();
            if (isNaN(aIssued) && isNaN(bIssued)) return 0;
            if (isNaN(aIssued)) return 1;
            if (isNaN(bIssued)) return -1;
            return aIssued - bIssued;
        })
        this.event_queue.push(...sortByTimestamp);
        if (!this.cache_processing) {
            setImmediate(() => this.initThreadService().catch(error => {
                loader.modules.utilities.exception(error, this.name_space + `.initQueueService`);
            }));
        }
    }

    /**
     * @private
     * @production
     * @error_handling
     * @function initThreadService
     * @description
     *   Processes events from the event queue in chunks to avoid blocking the main thread.
     *   Each chunk is processed concurrently, and after all events are processed,
     *   it triggers the spotter updating process.
     * 
     * @return {Promise<void>} - A promise that resolves when all events have been processed.
     */
    private async initThreadService(): Promise<void> {
        try {
            const configurations = loader.modules.utilities.cfg();
            const size = 1;
            this.cache_processing = true;
            while (this.event_queue.length) {
                const chunk = this.event_queue.splice(0, size);
                await Promise.all(
                    chunk.map(event => this.initEventProcessing(event, configurations))
                );
                await new Promise(r => setImmediate(r));
            }
            this.cache_processing = false;
            await this.initSpotterUpdating(configurations);
            await loader.modules.networking.fetchCacheData(true)
        } catch (error) {
            loader.modules.utilities.exception(error, this.name_space + `.initThreadService`);
        }
    }

    /**
     * @private
     * @production
     * @error_handling
     * @function getPolygonMetadata
     * @description
     *   Retrieves metadata for a polygon based on its geometry and associated spotter locations.
     * 
     * @param {types.EventType} event - The event for which to retrieve polygon metadata.
     * @param {types.Configurations} configurations - The current configurations for the parser.
     * @param {any[]} spotters - The array of spotter locations.
     * @return {Promise<polygonMetadata | null>} - A promise that resolves to the polygon metadata or null if not available.
     */
    private async getPolygonMetadata(event: types.EventType, configurations: types.Configurations, spotters: any): Promise<polygonMetadata | null> {
        try {
            let setSpotters = [];
            let isWithinProximity = false;
            const getGeometryIgnoring = configurations?.sources?.atmosx_parser_settings?.global_settings?.ignore_geometry_parsing;
            const getLocationSettings = configurations?.filters?.location_settings
            const getPolygon = (!event.geometry && getGeometryIgnoring) ? await this.mgr.getEventPolygon(event, false) : event.geometry ?? null;
            if (!getPolygon?.coordinates) { return null}
            const getCenter = loader.modules.calculations.getPolygonCenter(getPolygon);
            for (const spotter of spotters) {
                const [lon, lat] = spotter?.geometry?.coordinates;
                const getPoint = loader.modules.calculations.getPolygonClosestPoint(getPolygon, {lon, lat});
                setSpotters.push({
                    name: spotter?.properties?.name ?? `Unknown Spotter`,
                    metadata: getPoint,
                })
                if (getLocationSettings?.enabled && getLocationSettings?.max_distance > getPoint?.distance) { 
                    isWithinProximity = true;
                }
            }
            return {setSpotters, getCenter, isWithinProximity}
        } catch (error) {
            loader.modules.utilities.exception(error, this.name_space + `.getPolygonMetadata`);
            return null;
        }
    }

    /**
     * @private
     * @production
     * @error_handling
     * @function initSpotterUpdating
     * @description
     *   Updates spotter information for events based on their polygons and proximity to spotter locations.
     *   It checks if the spotter data needs to be updated based on the last updated timestamp
     *   and the configured update window. If an event's spotter data is outdated,
     *   it recalculates the center and associated spotters.
     * 
     * @param {types.Configurations} configurations - The current configurations for the parser.
     * @return {Promise<void>} - A promise that resolves when the spotter updating process is complete.
     */
    private async initSpotterUpdating(configurations: types.Configurations): Promise<void> {
        let processed: number = 0;
        const tick = performance.now();
        const time = Date.now();
        const events = [... loader.cache.external.events.features];
        const spotters = [...loader.cache.external.tracking.features];
        const getUpdateWindow = configurations?.sources?.location_settings?.polygon_update_time * 1000;
        await Promise.all(events.map(async (event) => {
            const updated = event?.properties?.imported?.spotters_last_updated ?? null;
            if ((updated != null) && getUpdateWindow > 0 && updated > 0 && (time - updated) < getUpdateWindow) {
                return;
            }
            const getDetails = await this.getPolygonMetadata(event, configurations, spotters);
            if (!getDetails) { return }
            event.properties.imported.polygon_center = getDetails.getCenter
            event.properties.imported.spotters = getDetails.setSpotters;
            event.properties.imported.spotters_last_updated = time;
            processed += 1;
        }));
        if (processed > 0) {
            const tock = performance.now();
            loader.modules.utilities.log({ 
                title: `${this.ansi_colors.MAGENTA}${(tock - tick).toFixed(2)}ms${this.ansi_colors.RESET}`,
                message: `Updated spotter data for ${this.ansi_colors.CYAN}${processed}${this.ansi_colors.RESET} events.`,
            });
        }
    }

    /**
     * @private
     * @production
     * @error_handling
     * @function initEventProcessing
     * @description
     *    Processes a single event by checking its status, updating the features cache,
     *    managing hashes, and sending webhook notifications if necessary.
     * 
     * @param {types.EventType} event - The event to be processed.
     * @param {types.Configurations} configurations - The current configurations for the parser.
     * @return {Promise<void>} - A promise that resolves when the event processing is complete.
     */
    private async initEventProcessing(event: types.EventType, configurations: types.Configurations): Promise<void> {
        const features = loader.cache.external.events.features;
        const getLocationSettings = configurations?.filters?.location_settings
        const featureMap: Map<string, typeof features[0]> = new Map();
        const spotters = [...loader.cache.external.tracking.features];
        features.forEach(f => f?.properties?.details?.tracking && featureMap.set(f?.properties?.details?.tracking, f));

        const register = loader.modules.structure.register(event);
        const { properties } = register;
        const { tracking, history } = properties?.details;
        const isEntry = loader?.cache?.external?.hashes?.find(log => log?.tracking === tracking);
        const isHashed = isEntry?.hashes?.includes(properties?.hash) ?? false;
        const isIgnored = register?.properties?.imported?.ignored;

        if (isHashed || isIgnored || properties?.is_cancelled) return;

        this.setHashes(properties, isEntry);
        const getDetails = await this.getPolygonMetadata(event, configurations, spotters);
        if (getLocationSettings?.enabled && !getDetails?.isWithinProximity || !getDetails) {
            return;
        }

        const getFeature = featureMap.get(tracking);
        const type = getFeature ? `Updated` : `Created`
        if (!properties?.is_cancelled) {
            loader.modules.utilities.log({ 
                title: `${this.ansi_colors.MAGENTA}${type}${this.ansi_colors.RESET}`,
                message: this.getEventText(register),
                settings: { type: '__events__' }
            });
        }
      
        if (properties?.is_updated || properties?.is_issued) {
            if (getFeature) {
                const getIndex = features.indexOf(getFeature);

                const cHistory = getFeature?.properties?.details?.history ?? [];
                const cLocations = getFeature?.properties?.locations?.split(";").map((l: string) => l.trim()) ?? [];
                const cUgc = getFeature?.properties?.geocode?.UGC ?? [];

                const iHistory = properties?.details?.history ?? [];
                const iLocations = properties?.locations?.split(";").map((l: string) => l.trim()) ?? [];
                const iUgc = properties?.geocode?.UGC ?? [];
        

                const mHistory = [...cHistory, ...iHistory]
                    .filter((v, i, a) => a.indexOf(v) === i);
                    
                const mLocations = [...cLocations, ...iLocations]
                    .filter((v, i, a) => a.indexOf(v) === i)
                    .join('; ');

                const mUgc = [...cUgc, ...iUgc]
                    .filter((v, i, a) => a.indexOf(v) === i);

                loader.cache.external.events.features[getIndex] = {
                    ...event,
                    properties: {
                        ...event.properties,
                        details: {
                            ...event?.properties?.details,
                            history: mHistory
                        },
                        locations: mLocations,
                        geocode: {
                            ...event?.properties?.geocode,
                            UGC: mUgc
                        },
                    }
                };
            } else {
                features.push(register);
                featureMap.set(tracking, register);
            }
        }
        loader.cache.internal.metrics.total_events += 1;
        this.setWebhookInstance(register, configurations);
    }

    /**
     * @private
     * @production
     * @error_handling
     * @function setWebhookInstance
     * @description
     *   Sends a webhook notification for a given event based on its priority and the configured webhook settings.
     *   It constructs the webhook message body with relevant event details and sends it to the appropriate webhook URL.
     *   
     * @param {types.EventType} register - The event to send the webhook for.
     * @param {types.Configurations} configurations - The current configurations for the parser.
     * @return {Promise<void>} - A promise that resolves when the webhook has been sent.
     */
    private async setWebhookInstance(register: types.EventType, configurations: types.Configurations): Promise<void> {
        try { 
            await new Promise<void>(resolve => setImmediate(async () => {
                const priority = new Set((configurations?.filters?.priority_events ?? []).map(p => String(p).toLowerCase()));
                const crticial = configurations?.webhook_settings?.critical_events;
                const general = configurations?.webhook_settings?.general_events;
                const title = `${register?.properties?.event} (${register?.properties?.action_type})`;
                const locations = register?.properties?.locations;
                const setBody = [
                    `**Locations:** ${register?.properties?.locations.slice(0, 259)}`,
                    `**Issued:** ${register?.properties?.issued ?? `--`}`,
                    `**Expires:** ${register?.properties?.expires ?? `--`}`,
                    `**Wind Gusts:** ${register?.properties?.parameters?.max_wind_gust ?? `--`}`,
                    `**Hail Size:** ${register?.properties?.parameters?.max_hail_size ?? `--`}`,
                    `**Damage Threat:** ${register?.properties?.parameters?.damage_threat ?? `--`}`,
                    `**Tornado Threat:** ${register?.properties?.parameters?.tornado_detection ?? `--`}`,
                    `**Flood Threat:** ${register?.properties?.parameters?.flood_detection ?? `--`}`,
                    `**Tags:** ${register?.properties?.tags ? register?.properties?.tags.join(', ') : 'N/A'}`,
                    `**Sender:** ${register?.properties?.sender_name ?? `--`}`,
                    `**Tracking ID:** ${register?.properties?.details?.tracking ?? `--`}`,
                    '```',
                    register?.properties?.description?.split('\n')?.map(line => line.trim())?.filter(line => line.length > 0)?.join('\n') ?? '',
                    '```'
                ].join('\n');
                await loader.modules.streaming.chatStreamerBot(`${title} for ${locations}`, `onEvent`);
                if (priority.has(register?.properties?.event?.toLowerCase())) { 
                    loader.modules.utilities.sendWebhook(crticial, title, setBody);
                } else { 
                    loader.modules.utilities.sendWebhook(general, title, setBody);
                }
            }));
        } catch (error) {
            loader.modules.utilities.exception(error, this.name_space + `.setWebhookInstance`);
        }
    }

    /**
     * @private
     * @production
     * @error_handling
     * @function setHashes
     * @description
     *   Updates the internal hashes cache with the hash of the processed event.
     *   If an entry for the event's tracking ID already exists, it appends the new hash
     *   to the existing list; otherwise, it creates a new entry.
     * 
     * @param {setHashesEntry | null} isEntry - The existing entry for the event's tracking ID, if any.
     * @param {types.LocalEventProperties} properties - The properties of the event being processed.
     * @return {Promise<void>} - A promise that resolves when the hashes have been updated.
     */
    private async setHashes(properties?: types.LocalEventProperties, isEntry?: setHashesEntry | null): Promise<void> {
        try {
            if (isEntry) {
                isEntry.hashes.push(properties?.hash);
                isEntry.expires = properties?.expires;
            } else {
                loader.cache.external.hashes.push({
                    tracking: properties?.details?.tracking,
                    hashes: [properties?.hash],
                    expires: properties?.expires
                });
            }
        } catch (error) {
            loader.modules.utilities.exception(error, this.name_space + `.setHashes`);
        }
    }

    /**
     * @private
     * @production
     * @error_handling
     * @function getEventText
     * @description
     *   Generates a formatted text representation of an event, including its name, 
     *   status, tracking ID, and issued time.
     * 
     * @param {types.EventType} event - The event to generate text for.
     * @return {string} - The formatted event text.
     */
    private getEventText(event: types.EventType): string {
        try {
            const props = event.properties;
            const statusColor = props.is_expired || props.is_cancelled
                ? this.ansi_colors.RED : this.ansi_colors.CYAN;
            const tracking = props.details?.tracking 
                ? props.details.tracking.substring(0, 18) : "N/A";
            const eventName = props.event ?? "Unknown";
            const action = props.action_type ?? "Unknown";
            const issued = new Date(props.issued).toLocaleString()?.toString() ?? "N/A";
            return loader.strings.event_output
                .replace("{EVENT}", `${this.ansi_colors.GREEN}${eventName}${this.ansi_colors.RESET}`)
                .replace("{STATUS}", `${statusColor}${action}${this.ansi_colors.RESET}`)
                .replace("{TRACKING}", tracking)
                .replace("{ISSUED}", issued);
        } catch (error) {
            loader.modules.utilities.exception(error, this.name_space + `.handleEventText`);
            return "Error generating event text.";
        }
    }

    /**
     * @public
     * @production
     * @error_handling
     * @function listener
     * @description
     *    Initializes the parser listener to handle incoming events and messages.
     *    Sets up event handlers for various parser events, including event emissions,
     *    messages, logs, and connection status updates.
     * 
     * @param {boolean} isRefreshingSettings - Indicates whether to refresh settings.
     * @return {Promise<void>} - A promise that resolves when the listener is initialized.
     */
    public async listener(isRefreshingSettings: boolean = false): Promise<void> {
        try {
            const settings = getConfigurations()
            const scanning = {
                "onMesoscaleDiscussion": "Mesoscale Discussion",
                "onDay1": "SPC Day 1 Update",
                "onDay2": "SPC Day 2 Update",
                "onDay3": "SPC Day 3 Update"
            }
            
            if (isRefreshingSettings && this.mgr) {
                this.mgr.setSettings(settings);
                return;
            }
            loader.cache.internal.source = (settings.is_wire ? `NWWS` : `NWS`);
            this.mgr = loader.cache.handlers.parser_client = new this.pkg(settings)
            
            for (const [event, name] of Object.entries(scanning)) {
                this.mgr.on(event, async (data: any) => {
                    loader.modules.utilities.log({ 
                        title: `${this.ansi_colors.YELLOW}${name} Event${this.ansi_colors.RESET}`, 
                        message: `Recieved`,
                    });
                });
            }
            
            this.mgr.on(`onExpired`, async (event: types.EventType) => {
                const getEvent = loader.cache.external.events.features.find(f => f?.properties?.tracking === event?.properties?.details?.tracking);
                if (getEvent) {
                    event.properties.action_type = `Expired`
                    loader.modules.utilities.log({ 
                        title: `${this.ansi_colors.MAGENTA}Cancelled${this.ansi_colors.RESET}`,
                        message: this.getEventText(event),
                        settings: { type: '__events__' }
                    });
                    const index = loader.cache.external.events.features.indexOf(getEvent);
                    if (index !== -1) loader.cache.external.events.features.splice(index, 1);
                    loader.cache.external.hashes = loader.cache.external.hashes.filter(log => log.tracking !== event?.properties?.details?.tracking);
                }
                return
            });
            
            this.mgr.on(`onEvents`, async (events: types.EventType[]) => {
                this.cache_events.push(...events);
                if (!this.emitter_processing) {
                    this.emitter_processing = true;
                    setTimeout(async () => {
                        const batch = [...this.cache_events];
                        this.cache_events = [];
                        this.emitter_processing = false;
                        await this.initQueueService(batch);
                    }, 1);
                }
            });
            
            this.mgr.on(`onMessage`, (message: onMessage) => {
                const configurations = loader.modules.utilities.cfg();
                const misc = configurations.webhook_settings.misc_events;
                loader.modules.utilities.sendWebhook(misc, `${message?.awipsType?.type}`, `\`\`\`${message?.message.split('\n').map(line => line.trim()).filter(line => line.length > 0).join('\n')}\`\`\``);
            });
            
            this.mgr.on(`log`, (message: string) => {
                loader.modules.utilities.log({ 
                    title: `${this.ansi_colors.YELLOW}Parser${this.ansi_colors.RESET}`, 
                    message: message
                });
            });
            
            this.mgr.on(`onReconnection`, (data: {lastName: string}) => {
                loader.modules.utilities.log({ 
                    title: `${this.ansi_colors.YELLOW}Parser${this.ansi_colors.RESET}`, 
                    message: `Reconnected to NOAA Weather Wire Service as ${this.ansi_colors.CYAN}${data.lastName}${this.ansi_colors.RESET}`
                });
            });
            
            this.mgr.on(`onConnection`, (nickname: string) => {
                loader.modules.utilities.log({ 
                    title: `${this.ansi_colors.YELLOW}Parser${this.ansi_colors.RESET}`, 
                    message: `Connected to NOAA Weather Wire Service as ${this.ansi_colors.CYAN}${nickname}${this.ansi_colors.RESET}`
                });
            });
        } catch (error) {
            loader.modules.utilities.exception(error, this.name_space + `.listener`);
        }
    }
}


export default ATMSXParser;