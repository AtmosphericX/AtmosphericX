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

*/

export const h_static: Record<string, any> = {
    default_http_headers: {
        "Accept": "application/geo+json, text/plain, */*; q=0.",
        "Accept-Language": "en-US,en;q=0.9",
        "Accept-Encoding": "gzip, deflate, br",
    },
    ansi_colors: {
        RED: `\x1b[31m`, GREEN: `\x1b[32m`, YELLOW: `\x1b[33m`,
        BLUE: `\x1b[34m`, MAGENTA: `\x1b[35m`, CYAN: `\x1b[36m`,
        WHITE: `\x1b[37m`, RESET: `\x1b[0m`
    }
};

export const h_cache: Record<string, any> = {
    external: {
        configurations: null,
        announcement: null,
        version: null,
        hashes: [],
        sonde: [],
        outages: [],
        cimss: {type: "FeatureCollection", features: []},
        streams: {type: "FeatureCollection", features: []},
        events: {type: "FeatureCollection", features: []},
        manual: {type: "FeatureCollection", features: []},
        spotters: {type: "FeatureCollection", features: []},
        icao_locations: {type: "FeatureCollection", features: []},
        reports: {type: "FeatureCollection", features: []},
        discussions: {type: "FeatureCollection", features: []},
        weather_radio: {type: "FeatureCollection", features: []},
        tropical_storms: {type: "FeatureCollection", features: []},
        pulsepoint: {type: "FeatureCollection", features: []},
        mesonet: {type: "FeatureCollection", features: []},
        random_event: {type: "FeatureCollection", features: []},
        random_pulsepoint: {type: "FeatureCollection", features: []},
        tracking: {type: "FeatureCollection", features: []},
    },
    internal: {
        configurations: null,
        source: `NWS`,
        setup_auth_code: null,
        logs: {__console__: [], __events__: []},
        http_sessions: [],
        login_attempts: {},
        websocket_sessions: {},
        cache_timers: {},
        limiters: [],
        metrics: {
            start_time: Date.now(),
            total_requests: 0,
            total_events: 0
        }
    },
    handlers: {
        database_client: null,
        express: null,
        parser_client: null,
        bot_client: null,
        tempest_client: null,
        rt_socket: null,
        websocket_server: null,
        http_server: null,
    }
};