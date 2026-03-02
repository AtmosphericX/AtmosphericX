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
    Discord: https://discord.gg/YAEjtzU3E8
    Ko-Fi: https://ko-fi.com/k3yomi
    Documentation: http://localhost/docs | https://atmosx-secondary.scriptkitty.cafe/docs

*/


import * as loader from '../..';

export const getConfigurations = () => {
    const configurations = loader.modules.utilities.cfg();
    const settings = configurations.sources.atmosx_parser_settings;
    const reconnectSettings = settings?.weather_wire_settings?.client_reconnections;
    const credentialSettings = settings?.weather_wire_settings?.client_credentials;
    const cacheSettings = settings?.weather_wire_settings?.client_cache
    const preferenceSettings = settings?.weather_wire_settings?.alert_preferences;
    const nationalWeatherServiceSettings = settings?.national_weather_service_settings;
    const globalSettings = settings?.global_settings;
    const filteringSettings = configurations?.filters;
    const easSettings = filteringSettings?.eas_settings;
    const displayName = credentialSettings?.nickname.replace(/%AtmosphericX%/g, ``).trim();
    return { 
        database: settings?.database,
        is_wire: settings?.noaa_weather_wire_service,
        journal: settings?.journal,
        noaa_weather_wire_service_settings: {
            reconnection_settings: {
                enabled: reconnectSettings?.attempt_reconnections,
                interval: reconnectSettings?.reconnection_attempt_interval,
            },
            credentials: {
                username: credentialSettings?.username,
                password: credentialSettings?.password,
                nickname: `AtmosphericX (${displayName}) v${loader.modules.utilities.version()}`,
            },
            cache: {
                enabled: cacheSettings?.read_cache,
                max_file_size: cacheSettings?.max_size_mb,
                max_db_history: cacheSettings?.max_db_history,
                use_db_for_cache: cacheSettings?.use_db_cache,
                max_db_cache_size: cacheSettings?.max_db_cache_size,
                directory: cacheSettings?.directory,
            },
            preferences: {
                cap_only: preferenceSettings?.cap_only,
            }
        },
        national_weather_service_settings: {
            interval: nationalWeatherServiceSettings?.interval,
            endpoint: nationalWeatherServiceSettings?.endpoint,
        },
        global_settings: {
            shapefile_coordinates: globalSettings?.implement_db_ugc,
            shapefile_skip: globalSettings?.ugc_db_skip,
            parent_events_only: globalSettings?.parent_events,
            better_event_parsing: globalSettings?.better_parsing,
            ignore_geometry_parsing: globalSettings?.ignore_geometry_parsing,
            filtering: {
                ignore_test_products: filteringSettings?.ignore_tests,
                events: filteringSettings?.all_events ? [] : filteringSettings?.listening_events,
                ignored_events: filteringSettings?.ignored_events,
                filtered_icao: filteringSettings?.listening_icao,
                ignored_icao: filteringSettings?.ignored_icao,
                ugc_filter: filteringSettings?.listening_ugcs,
                state_filter: filteringSettings?.listening_states,
                check_expired: false,
            },
            eas_settings: {
                festival_tts_voice: easSettings?.festival_voice,
                directory: easSettings?.eas_directory,
                intro_wav: easSettings?.eas_intro,
            }
        }
    };
}