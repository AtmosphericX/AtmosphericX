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

export class Alerts { 
    NAME_SPACE: string = `submodule:events`;
    PACKAGE: typeof loader.packages.AlertManager
    MANAGER: any;
    constructor() {
        this.PACKAGE = loader.packages.AlertManager;
        loader.submodules.utils.log(`${this.NAME_SPACE} initialized.`)
        this.instance();
    }


    /**
     * @function returnAlertText
     * @description
     *     Generates a formatted alert display string for either legacy or live-feed
     *     rendering modes. When fancy display is enabled and live feed data is present,
     *     alerts are sorted by issue time and formatted using the "fancy" template.
     *     Otherwise, a simplified "legacy" template is used. This implementation is
     *     defensive: it validates shapes, safely calls possible functions, and never
     *     throws on malformed input.
     *
     * @param {types.RegisterType} [registry]
     * @param {boolean} [isLiveFeed=false]
     * @returns {string}
     */
    public returnAlertText(reg?: types.RegisterType, isLive?: boolean): string {
        const { utils, calculations } = loader.submodules, { strings, cache } = loader;
        if (!utils.isFancyDisplay() || !isLive) {
            const e = reg?.event
            return strings.new_event_legacy
                .replace('{EVENT}', e.properties.event ?? 'Unknown')
                .replace('{STATUS}', e.properties.action_type ?? 'Unknown')
                .replace('{TRACKING}', e.tracking.substring(0, 18))
                .replace('{SOURCE}', cache.internal.getSource);
        }
        return cache.external.events.features
            .sort((a, b) => new Date(a.event.properties.issued).getTime() - new Date(b.event.properties.issued).getTime())
            .map(r => {
                const p = r.event.properties, d = p.distance;
                const dist = d && Object.keys(d).length > 0 ?
                    Object.entries(d as Record<string, { distance?: number | string; unit?: string }>).map(([name, val]) => {
                        const distance = val?.distance ?? 'N/A';
                        const unit = val?.unit ?? '';
                        return `${name}: ${distance}${unit ? ` ${unit}` : ''}`;
                    }).join(', ')
                    : 'Not Available';
                return strings.new_event_fancy
                    .replace('{EVENT}', p.event)
                    .replace('{ACTION_TYPE}', p.action_type)
                    .replace('{TRACKING}', r.event.tracking.substring(0, 18))
                    .replace('{SENDER}', p.sender_name)
                    .replace('{ISSUED}', p.issued)
                    .replace('{EXPIRES}', calculations.timeRemaining(p.expires))
                    .replace('{TAGS}', p.tags?.join(', ') ?? 'N/A')
                    .replace('{LOCATIONS}', p.locations?.substring(0, 100) ?? 'N/A')
                    .replace('{DISTANCE}', dist);
            })
            .join('\n');
    }


    /**
     * @function randomize
     * @description
     *     Selects the next available alert from the combined list of manual and
     *     active event sources. The method cycles sequentially through alerts and
     *     wraps back to the beginning once all have been iterated. Invalid or empty
     *     alert entries are ignored, and the RNG state is automatically reset if
     *     corrupted or out of bounds.
     *
     * @public
     * @returns {types.EventType | null}
     */
    public randomize(): types.EventType | null {
        const ext = loader.cache.external;
        const m = Array.isArray(ext.manual?.features) ? ext.manual.features.filter(Boolean) : [];
        const a = Array.isArray(ext.events?.features) ? ext.events.features.filter(Boolean) : [];
        const alerts = [...m, ...a].filter((x): x is types.EventType => x && typeof x === 'object' && Object.keys(x).length > 0);
        if (!alerts.length) return (ext.rng = { alert: null, index: null }), null;
        const i = (ext.rng?.index ?? -1) + 1 >= alerts.length ? 0 : (ext.rng?.index ?? -1) + 1;
        const alert = alerts[i];
        ext.rng = { alert, index: i };
        return alert;
    }

    /**
     * @function handle
     * @description
     *     Processes an incoming batch of event objects and updates the external
     *     event cache accordingly. Each event is registered, validated, and merged
     *     into the loader's existing structure. Handles issued, updated, and
     *     cancelled alerts with full state synchronization between internal and
     *     external caches.
     *
     *     - **Issued events** are appended when not already tracked.
     *     - **Updated events** merge histories, locations, and property fields.
     *     - **Cancelled events** remove matching entries from the cache.
     *
     *     This function also updates internal processing metrics and triggers a
     *     network cache refresh to ensure consistent downstream state.
     *
     * @private
     * @param {types.EventType[]} events
     * @returns {void}
     */
    private handle(events: types.EventType[]): void {
        const features = loader.cache.external.events.features;
        for (const event of events) {
            const registeredEvent = loader.submodules.structure.register(event);
            const { tracking, properties, history = [] } = registeredEvent.event;
            const index = features.findIndex(feature => feature && feature.event.tracking === tracking);
            if (properties.is_cancelled && index !== -1) {
                features[index] = undefined;
                continue;
            }
            if (properties.is_issued && index === -1) {
                features.push(registeredEvent)
                continue;
            }
            if (properties.is_updated) {
                if (index !== -1 && features[index]) {
                    const existing = features[index];
                    const existingLocations = existing.event.properties.locations ?? "";
                    const mergedHistory = [ 
                        ...(existing.event.history ?? []), 
                        ...history 
                    ].sort((a, b) => new Date(b.issued).getTime() - new Date(a.issued).getTime());
                    const uniqueHistory = mergedHistory.filter((item, pos, arr) => 
                        arr.findIndex(i => i.issued === item.issued && i.description === item.description) === pos
                    );
                    existing.event.properties.event = properties.event;
                    existing.event.history = uniqueHistory;
                    existing.event.properties = registeredEvent.event.properties;
                    const combinedLocations = [
                        ...new Set((existingLocations + "; " + registeredEvent.event.properties.locations)
                        .split(";").map(loc => loc.trim()).filter(Boolean))
                    ].join("; ");
                    existing.event.properties.locations = combinedLocations;
                } else {
                    features.push(registeredEvent);
                }
            }
        }
        loader.cache.internal.metrics.events_processed += events.length;
        loader.submodules.networking.updateCache(true);
    }

    /**
     * @function instance
     * @description
     *     Initializes or refreshes the parser manager instance with current
     *     configurations and settings. Sets up event handlers for alert reception,
     *     messages, connection, reconnection, and logging. Supports refreshing
     *     an existing manager instance without recreating it.
     *
     * @public
     * @param {boolean} [isRefreshing=false]
     * @returns {void}
     */
    private instance(isRefreshing: boolean = false): void {
        if (isRefreshing && !this.MANAGER) return;
        const configurations = loader.cache.internal.configurations as types.ConfigurationsType;
        const alerts = configurations.sources.atmosx_parser_settings;
        const nwws = alerts.weather_wire_settings;
        const nws = alerts.national_weather_service_settings;
        const filter = configurations.filters;
        const now = new Date();
        const displayName = nwws.client_credentials.nickname.replace(`AtmosphericX`, ``).trim();
        const displayTimestamp = `${String(now.getUTCMonth() + 1).padStart(2, '0')}/${String(now.getUTCDate()).padStart(2, '0')} ${String(now.getUTCHours()).padStart(2, '0')}:${String(now.getUTCMinutes()).padStart(2, '0')}`;
        if (alerts.noaa_weather_wire_service) loader.cache.internal.getSource = `NWWS`;
        const settings = {
            database: nwws.database,
            is_wire: alerts.noaa_weather_wire_service,
            journal: alerts.journal,
            noaa_weather_wire_service_settings: {
                reconnection_settings: { enabled: nwws.client_reconnections.attempt_reconnections, interval: nwws.client_reconnections.reconnection_attempt_interval },
                credentials: { username: nwws.client_credentials.username, password: nwws.client_credentials.password, nickname: `AtmosphericX v${loader.submodules.utils.version()} -> ${displayName} (${displayTimestamp})` },
                cache: { enabled: nwws.client_cache.read_cache, max_file_size: nwws.client_cache.max_size_mb, max_db_history: nwws.client_cache.max_db_history, directory: nwws.client_cache.directory },
                preferences: { cap_only: nwws.alert_preferences.cap_only, shapefile_coordinates: nwws.alert_preferences.implement_db_ugc }
            },
            national_weather_service_settings: { interval: nws.interval, endpoint: nws.endpoint },
            global_settings: {
                parent_events_only: alerts.global_settings.parent_events,
                better_event_parsing: alerts.global_settings.better_parsing,
                filtering: {
                    location: { unit: filter.location_settings.unit },
                    ignore_text_products: filter.ignore_tests,
                    events: filter.all_events ? [] : filter.listening_events,
                    ignored_events: filter.ignored_events,
                    filtered_icao: filter.listening_icao,
                    ignored_icao: filter.ignored_icao,
                    ugc_filter: filter.listening_ugcs,
                    state_filter: filter.listening_states,
                    check_expired: false
                },
                eas_settings: { festival_tts_voice: filter.festival_voice, directory: filter.eas_settings.eas_directory, intro_wav: filter.eas_settings.eas_intro }
            }
        };
        if (isRefreshing) { this.MANAGER.setSettings(settings); return; }
        this.MANAGER = new this.PACKAGE(settings);
        this.MANAGER.on(`onAlerts`, (alerts: types.EventType[]) => { this.handle(alerts); });
        this.MANAGER.on(`onMessage`, async (message: { awipsType: { type: string }; message: string }) => {
            const webhooks = configurations.webhook_settings;
            await loader.submodules.networking.sendWebhook(`New Stanza - ${message.awipsType.type}`, `\`\`\`${message.message}\`\`\``, webhooks.misc_alerts);
        });
        this.MANAGER.on(`onConnection`, async (displayName: string) => { loader.submodules.utils.log(`Connected to NOAA Weather Wire Service as ${displayName}.`); });
        this.MANAGER.on(`onReconnection`, (service: { reconnects: number }) => {
            const now = new Date();
            const displayTimestamp = `${String(now.getUTCMonth() + 1).padStart(2, '0')}/${String(now.getUTCDate()).padStart(2, '0')} ${String(now.getUTCHours()).padStart(2, '0')}:${String(now.getUTCMinutes()).padStart(2, '0')}`;
            this.MANAGER.setDisplayName(`AtmosphericX v${loader.submodules.utils.version()} -> ${displayName} (${displayTimestamp}) (x${service.reconnects})`);
        });
        this.MANAGER.on(`log`, (message: string) => { loader.submodules.utils.log(message, { title: `\x1b[33m[ATMOSX-PARSER]\x1b[0m` }); });
        loader.cache.handlers.eventManager = this.MANAGER;
    }
}

export default Alerts;

