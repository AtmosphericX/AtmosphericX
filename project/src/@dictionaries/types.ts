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

*/



export type LatitudeLongitude = { 
    latitude: number; 
    longitude: number 
};

export interface DefaultPlacefileParsingTypes { 
    icon: LocalDefaultPlacefileIcon; 
    object: { coordinates: number }; 
    line: { text: string }; 
}

export interface EventType { 
    properties: LocalEventProperties; 
    geometry: LocalGeometry | null; 
}

export interface LocalGeoJSON<TProperties = Record<string, any>, TCoordinates extends LocalCoordinates = LocalCoordinates> { 
    type: string; 
    geometry?: { 
        type: string; 
        coordinates: TCoordinates 
    }; 
    properties?: TProperties 
}   

export interface LocalDefaultPlacefileIcon { 
    label: string; 
    x: string; 
    y: string; 
    scale: number; 
    type: string
}

export type LatLon = { 
    lat: number; 
    lon: number 
};

export type LonLat = { 
    lon: number; 
    lat: number 
};

export type GeoJSONFeatureCollection<TFeature extends LocalGeoJSON = LocalGeoJSON> = {
    type?: string; 
    features?: TFeature[] 
}

export type CacheStructure = { 
    name: string;  
    url: string;  
    enabled: boolean;  
    cache: number;  
    contradictions: string[]; 
    options?: Record<string, any>; 
}

export type GeoJSONPolygonLike = { 
    type?: string; 
    coordinates?: GeoJSONPolygonCoordinates
};

export type LocalEventParameters = {
    wmo: string; source: string; max_hail_size: string,
    max_wind_gust: string; damage_threat: string; tornado_detection: string,
    flood_detection: string; discussion_tornado_intensity: string; 
    discussion_wind_intensity: string; discussion_hail_intensity: string
}

export type LocalDefaultAttributes = {
    xmlns?: string,id?: string; issue?: string;  
    ttaaii?: string; cccc?: string; awipsid?: string;  
    getAwip?: Record<string, string> 
}

export type LocalEventProperties = {
    is_issued: boolean; is_updated: boolean; is_cancelled: boolean,
    is_expired: boolean;
    parent?: string; event?: string; locations: string; 
    action_type: string; tags: string[],
    issued: string; expires: string; description: string,
    metadata: Record<string, unknown>;
    technical: { ugc?: string[]; pVtec?: string[]; hVtec?: string[];}
    sender_name: string; sender_icao: string; sent?: string; 
    attributes: LocalDefaultAttributes; parameters: LocalEventParameters; 
    geometry: { type?: string; coordinates?: [number, number][] } | null; 
    spotters?: Record<string, { distance: number; unit: string}>; 
    geocode: { UGC: string[] };
    client: Record<string, any>;
    hash: string;
    center?: LatLon;
    details: {
        performance: number;
        tracking: string;
        header: string;
        pvtec?: string;
        hvtec?: string;
        history: { description: string; issued: string; type: string }[];
    }
}

export type PulsePointFeatures = {
    type: string;
    properties: {
        ID: string;
        event: string;
        address: string;
        [key: string]: string | number | null;
    };
    geometry: { type: string; coordinates: number[]; };
    [key: string]: string | number | object | null;
}

export type Configurations = Record<string, any>;
export type LocalCoordinates = number[] | number[][] | number[][][] | number[][][][] ;
export type LocalGeometry = { type: string; coordinates: LocalCoordinates };
export type GeoJSONPolygonCoordinates = number[][] | number[][][] | number[][][][];
export type ExpressRequest = Record<string, any>;
export type ExpressResponse = Record<string, any>;
export type ExpressNext = () => void; 