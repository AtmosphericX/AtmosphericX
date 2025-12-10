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

// ----------- Definitions Interfaces ----------- //
interface LocalLonLat  { lon: number; lat: number }
interface LocalGeoJSON { type: string; geometry?: { type: string; coordinates: LocalCoordinates }; properties?: Record<string, any> }   

interface LocalDefaultAttributes {
    xmlns?: string,id?: string; issue?: string;  
    ttaaii?: string; cccc?: string; awipsid?: string;  
    getAwip?: Record<string, string> 
}
interface LocalEventParameters { 
    wmo: string; source: string; max_hail_size: string,
    max_wind_gust: string; damage_threat: string; tornado_detection: string,
    flood_detection: string; discussion_tornado_intensity: string; 
    discussion_wind_intensity: string; discussion_hail_intensity: string
}
interface LocalEventProperties { 
    is_issued: boolean; is_updated: boolean; is_cancelled: boolean,
    parent?: string; event?: string; locations: string; 
    action_type: string; tags: string[],
    issued: string; expires: string; description: string,
    metadata: Record<string, unknown>;
    technical: { ugc?: string[]; pVtec?: string[]; hVtec?: string[];}
    sender_name: string; sender_icao: string; sent?: string; 
    attributes: LocalDefaultAttributes; parameters: LocalEventParameters; 
    geometry: { type?: string; coordinates?: [number, number][] } | null; 
    distance?: Record<string, { distance: number; unit: string}>; 
    geocode: { UGC: string[] }; 
}

// --- Exports --- //
export interface HTTPOptions  { timeout?: number | 5_000; headers?: Record<string, string> | {}; method?: LocalHttpMethod; body?: string }
export interface GeoJSONFeatureCollection  { type?: string; features?: LocalGeoJSON[] }
export interface CacheStructure  { name: string;  url: string;  enabled: boolean;  cache: number;  contradictions: string[]; }
export interface LatitudeAndLongitude { coords: {lat?: number; lon?: number}; coords2?: {lat?: number; lon?: number}}
export interface LogOptions { title?: string; echoFile?: boolean; rawConsole?: boolean}
export interface ExternalType { manual_alert?: any; events?: any; hashes?: any; configurations?: any; changelogs?: any; version?: HTTPType }
export interface InternalType {  }
export interface HTTPType { error?: boolean; message?: string }
export interface WebSocketClient {  client: any; unix: number; address: string; requests: Record<string, any>; hasSentInitialData: boolean; }
export interface CertificateCollection { key: Buffer;certificate: Buffer;}

export interface WebhookSettings {
    enabled?: boolean;
    discord_webhook?: string;
    webhook_display?: string;
    content?: string;
    webhook_cooldown?: number;
    events?: string[];
}

export interface RegisterType { 
    event: EventType;
    metadata: { sfx: string; scheme: Record<string, string>; metadata: Record<string, unknown>; };
    sfx: string;
    ignored: boolean;
    beep: boolean;
}

export interface EventType {
    performance: number;
    tracking: string;
    header: string;
    pvtec?: string;
    hvtec?: string;
    history: { description: string; issued: string; type: string }[];
    properties: LocalEventProperties;
    geometry: { type?: string; coordinates?: [number, number][] } | null;
}

export interface ConfigurationsType { 
    project_settings?: any; 
    display_settings?: any;
    internal_settings?: any;
    streamer_bot_settings?: any;
    websocket_settings?: any;
    webhook_settings?: any;
    sources?: any; 
    hosting?: any;
    tones?: any;
    alert_dictionary?: any;
    themes?: any;
    filters?: any;
    web_hosting_settings?: any;
}


// ----------- Generic Types ----------- //
type LocalHttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE'
type LocalCoordinates = Record<number, number> | Record<number, number>[] | Record<number, number>[][]
type LocalCoordinatesDefined = {lon: number; lat: number}
type LocalInRange = { inRange: boolean; range: Record<string, { distance: number; unit: string}> }

// --- Exports --- //
export type Coordinates  = LocalLonLat
export type CoordinatesDefined = LocalCoordinatesDefined
export type InRange = LocalInRange


// ----------- Parsing Interfaces ----------- //
interface LocalWxRadioFeature { lon: string; lat: string; location?: string; callsign?: string; frequency?: string; listen_url?: string; }
interface LocalDefaultPlacefileIcon { label: string; x: string; y: string; scale: number; type: string}
interface LocalSPCDiscussionProperties { text: string; expires_at_ms: number; number: number; issued_at_ms: number; tags: Record<string, string[]>; population: Record<string, string> }

// --- Exports --- //
export interface DefaultPlacefileParsingTypes { icon: LocalDefaultPlacefileIcon; object: { coordinates: number }; line: { text: string }; }
export interface TropicalStormTypes { name: string; forecast_discussion: string;classification: string;pressure: string;wind_speed_mph: string;last_update_at: Date; }
export interface WxRadioTypes { sources: LocalWxRadioFeature[]; }
export interface GibsonRidgeReportTypes { lat: string; lon: string; city: string; county: string; state: string; event: string; source: string; description: string; mag: string; office: string; date: string; time: string; comment: string; }
export interface SPCDiscussionTypes { coordinates: Record<number, number>; properties: LocalSPCDiscussionProperties; }
export interface ProbabilityTypes { type: string; probability: number; shear: number; description: string}