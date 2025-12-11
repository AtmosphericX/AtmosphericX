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

export class Structure { 
    NAME_SPACE: string = `submodule:structure`;
    constructor() {
        loader.submodules.utils.log(`${this.NAME_SPACE} initialized.`)
    }
	
	/**
	 * @function parsing
	 * @description
	 *     Routes raw input data to the appropriate parser based on the specified type.
	 * 
	 * @param {unknown} [body]
	 * @param {string} [type]
	 * @returns {Promise<any[]>}
	 */
	private async parsing(body?: unknown, type?: string): Promise<any[]> {
        switch (type) {
            case 'spotter_network_feed': return loader.submodules.parsing.getSpotterFeed(body);
            case 'storm_prediction_center_mesoscale': return loader.submodules.parsing.getSPCDiscussions(body);
            case 'spotter_reports': return loader.submodules.parsing.getSpotterReportStructure(body);
            case 'grlevelx_reports': return loader.submodules.parsing.getGibsonReportStructure(body);
            case 'tropical_storm_tracks': return loader.submodules.parsing.getTropicalStormStructure(body);
            case 'tornado': return loader.submodules.parsing.getProbabilityStructure(body, 'tornado');
            case 'severe': return loader.submodules.parsing.getProbabilityStructure(body, 'severe');
            case 'sonde_project_weather_eye': return loader.submodules.parsing.getWxEyeSondeStructure(body);
			case 'nexrad_radars': return loader.submodules.parsing.getWeatherNexradRadars(body);
            case 'wx_radio': return loader.submodules.parsing.getWxRadioStructure(body);
            default: return [];
        }
    }

	/**
	 * @function metadata
	 * @description
	 *     Retrieves the alert scheme, dictionary, and corresponding sound effect for a given event.
	 * 
	 * @param {types.EventType} event
	 * @returns {{ sfx: string; scheme: any; metadata: any }}
	 */
	private metadata(event: types.EventType) {
    	const ConfigType = loader.cache.internal.configurations as types.ConfigurationsType;
		const schemes = ConfigType.themes[event.properties.event]
			|| ConfigType.themes[event.properties.parent]
			|| ConfigType.themes['Default'];
		const dictionary = ConfigType.alert_dictionary[event.properties.event]
			|| ConfigType.alert_dictionary[event.properties.parent]
			|| ConfigType.alert_dictionary['Special Event'];
		let sfx = dictionary.sfx_cancel;
		if (event.properties.is_issued) sfx = dictionary.sfx_issued;
		else if (event.properties.is_updated) sfx = dictionary.sfx_update;
		else if (event.properties.is_cancelled) sfx = dictionary.sfx_cancel;
		return { sfx, scheme: schemes, metadata: dictionary.metadata };
	}

	/**
	 * @function register
	 * @description
	 *    Registers an event, determining its metadata, sound scheme, and whether it should be ignored or beeped.
	 * 	
	 * @param {types.EventType} event
	 * @returns {object}
	 */
	public register(event: types.EventType) {
		const ConfigType = loader.cache.internal.configurations as types.ConfigurationsType;
		const eventName = event.properties.event;
		const isPriorityEvent = ConfigType.filters.priority_events.some(e => e.toLowerCase() === eventName.toLowerCase());
		const isBeepAuthorizedOnly = ConfigType.filters.sfx_beep_only;
		const isShowingUpdatesAllowed = ConfigType.filters.show_updates;
		const eventMetadata = this.metadata(event);
		const isBeepOnly = isBeepAuthorizedOnly && !isPriorityEvent;
		const isIgnored = !isShowingUpdatesAllowed && !isPriorityEvent && !event.properties.is_issued;
		event.scene = {
			metadata: eventMetadata.metadata,
			scheme:  eventMetadata.scheme,
			sfx: isBeepOnly ? ConfigType.tones.sfx_beep : eventMetadata.sfx,
			ignored: isIgnored,
			beep: isBeepOnly,
		};
		return event;
	}

	/**
	 * @function distance
	 * @description
	 *    Calculates the distance of an event from predefined locations and determines if it's within range.
	 * 	
	 * @param {types.EventType} event
	 * @returns {object}
	 */
	public distance(event: types.EventType): types.InRange {
		const ConfigType = loader.cache.internal.configurations as types.ConfigurationsType;
		const cache = loader.cache.external.tracking.features;
		const coords = event?.geometry?.coordinates;
		let range = [];
		let inRange = ConfigType.filters.location_settings.enabled == true && cache && cache.length > 0 ? false : true;
		const polygons = Array.isArray(coords?.[0]) && typeof coords?.[0][0] === 'number' ? [coords] : coords;
		if (polygons != null) {
			for (const key in cache) {
				const name = cache[key].properties.name;
				const lat = cache[key].geometry.coordinates[1];
				const lon = cache[key].geometry.coordinates[0];
				const unit = ConfigType.filters.location_settings.unit || 'miles';
				let minDistance = Infinity;
				for (const polygon of polygons) {
					for (let i = 0; i < polygon.length; i++) {
						const point1 = polygon[i];
						const point2 = polygon[(i + 1) % polygon.length];
						if (Array.isArray(point1) && Array.isArray(point2) && point1.length === 2 && point2.length === 2) {
							const [lon1, lat1] = point1;
							const [lon2, lat2] = point2;
							const distance = loader.submodules.calculations.distanceToSegment(
								{ lat, lon },
								{ lat: lat1, lon: lon1 },
								{ lat: lat2, lon: lon2 },
								unit
							);
							if (distance < minDistance) minDistance = distance;
						}
					}
				}
				if (ConfigType.filters.location_settings.enabled) {
					if (minDistance < ConfigType.filters.location_settings.max_distance) {
						inRange = true;
					}
				}
				range.push({ [name]: { distance: minDistance, unit, lon, lat } });
			}
		}
		return { inRange, range: { ...event.properties.distance, ...Object.assign({}, ...range) } };
	}

	/**
	 * @function create
	 * @description
	 *     Processes raw data, parses it into structured types, updates caches, logs events,
	 *     and triggers webhooks for new alerts.
	 * 
	 * @param {unknown} data
	 * @returns {Promise<void>}
	 */
	public async create(data: unknown): Promise<void> {
		const clean = loader.submodules.utils.filterWebContent(data);
		const ConfigType = loader.cache.internal.configurations as types.ConfigurationsType;
		const dataTypes = [
			{ key: 'spotter_network_feed', cache: 'spotter_network_feed' },
			{ key: 'spotter_reports', cache: 'storm_reports' },
			{ key: 'grlevelx_reports', cache: 'storm_reports' },
			{ key: 'storm_prediction_center_mesoscale', cache: 'storm_prediction_center_mesoscale' },
			{ key: 'tropical_storm_tracks', cache: 'tropical_storm_tracks' },
			{ key: 'tornado', cache: 'tornado' },
			{ key: 'severe', cache: 'severe' },
			{ key: 'sonde_project_weather_eye', cache: 'sonde_project_weather_eye' },
			{ key: 'nexrad_radars', cache: 'nexrad_radars' },
			{ key: 'wx_radio', cache: 'wx_radio' },
		];
		for (const { key, cache } of dataTypes) {
			if (clean[key]) {
				loader.cache.external[cache] = await this.parsing(clean[key], key);
			}
		}
		if (clean.events?.length) {
			for (const ev of clean.events) {
				const isAlreadyLogged = loader.cache.external.hashes.some(log => log.id === ev.hash);
				const eventDistance = this.distance(ev)
				ev.properties.distance = eventDistance.range; 
				if (!ev.scene.ignored) { ev.scene.ignored = this.distance(ev).inRange === false; }
				if (isAlreadyLogged) { continue; }
				if (ev.scene.ignored) { continue; }				
				loader.cache.external.hashes.push({ id: ev.hash, expires: ev.properties.expires });
				if (!loader.submodules.utils.isFancyDisplay()) {
					loader.submodules.utils.log(loader.submodules.alerts.returnAlertText(ev));
				} else { 
					loader.submodules.utils.log(loader.submodules.alerts.returnAlertText(ev), {}, `__events__`);
				}
				
				const webhooks = ConfigType.webhook_settings;
				const pSet = new Set((ConfigType.filters.priority_events || []).map(p => String(p).toLowerCase()));
				const title = `${ev.properties.event} (${ev.properties.action_type})`;
				const locations = ev.properties.locations;
				const body = [
					`**Locations:** ${ev.properties.locations.slice(0, 259)}`,
					`**Issued:** ${ev.properties.issued}`,
					`**Expires:** ${ev.properties.expires}`,
					`**Wind Gusts:** ${ev.properties.parameters.max_wind_gust}`,
					`**Hail Size:** ${ev.properties.parameters.max_hail_size}`,
					`**Damage Threat:** ${ev.properties.parameters.damage_threat}`,
					`**Tornado Threat:** ${ev.properties.parameters.tornado_detection}`,
					`**Flood Threat:** ${ev.properties.parameters.flood_detection}`,
					`**Tags:** ${ev.properties.tags ? ev.properties.tags.join(', ') : 'N/A'}`,
					`**Sender:** ${ev.properties.sender_name}`,
					`**Tracking ID:** ${ev.tracking}`,
					'```',
					ev.properties.description.split('\n').map(line => line.trim()).filter(line => line.length > 0).join('\n'),
					'```'
				].join('\n');
				await loader.submodules.streaming.sendChatMessage(`${title} for ${locations}`, `events`);
				await loader.submodules.networking.sendWebhook(title,body, webhooks.general_alerts);
				if (pSet.has(ev.properties.event.toLowerCase())) {
					await loader.submodules.networking.sendWebhook(title, body, webhooks.critical_alerts);
				}
			}
		}
		loader.cache.external.events.features = clean.events.filter(ev => !ev.scene.ignored) || [];
		if (loader.cache.external.rng.features.length == 0) { loader.submodules.alerts.randomize(); }
		loader.submodules.routes.onUpdateRequest();
	}
}

export default Structure;

