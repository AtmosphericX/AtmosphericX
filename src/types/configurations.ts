/*
              _                             _               _     __   __
         /\  | |                           | |             (_)    \ \ / /
        /  \ | |_ _ __ ___   ___  ___ _ __ | |__   ___ _ __ _  ___ \ V / 
       / /\ \| __| '_ ` _ \ / _ \/ __| '_ \| '_ \ / _ \ '__| |/ __| > <  
      / ____ \ |_| | | | | | (_) \__ \ |_) | | | |  __/ |  | | (__ / . \ 
     /_/    \_\__|_| |_| |_|\___/|___/ .__/|_| |_|\___|_|  |_|\___/_/ \_\
                                     | |                            
                                     |_|                                                                                                                

    Created with ♥ by the AtmosphericX Team (KiyoWx, StarflightWx, & CJ Ziegler)
    Discord: https://atmosphericx-discord.scriptkitty.cafe
    Ko-Fi: https://ko-fi.com/k3yomi
    Documentation: https://atmosphericx.scriptkitty.cafe/documentation
    
*/

export interface TypeConfigurations { 
    Hosting: {
        $Hash: string
        DocumentationMode: boolean
        AuthenticationSettings: {
            LogonRequired: boolean
            GuestAccessAllowed: boolean
            PreventDuplicateSessions: boolean
            MaxLogonAttempts: number
            MaxLockoutDuration: number
        }
        Entitlements: {
            HTTPS: boolean
            Port: number
            CacheControl: boolean
            RatelimitControl: boolean
            RatelimitWindow: number
            MaxRequestsPerWindow: number
            MaxWebsocketConnections: number
            Certificates: {
                PrivateKey: string
                Certificate: string
            }
        }
    }
    EventProductParser: {
        $Hash: string
        Timezone: string
        Database: string
        DebugDisableAllEvents: boolean
        EnableWireService: boolean
        EnableDeveloperMode: boolean
        WeatherWireService: {
            CredentialSettings: {
                Username: string
                Password: string
                Nickname: string
            }
            ReconnectionSettings: {
                Enabled: boolean
                ReconnectionInterval: number
            }
            CacheSettings: {
                Enabled: boolean
                MaxDatabaseHistory: number
                MaxRetentionHistory: number
            }
        }
        NationalWeatherService: {
            FetchInterval: number
        }
    }
    StreamberBot: {
        $Hash: string
        Enabled: boolean
        HostAddress: string
        HostPort: number
        Authentication: {
            Username: string
            Password: string
        }
    }
    NTFYServer: {
        $Hash: string
        Enabled: boolean
        Server: string
        MediaStorage: {
            Audio: string
            Text: string
            JSON: string
            Image: string
        }
        Credentials: {
            Username: string
            Password: string
        }
    }
    InternalComponents: {
        $Hash: string
        HTTPSettings: {
            UpdateURL: string
            MaxTimeout: number
        }
        DicordRichPressence: {
            Enabled: boolean
            ApplicationID: number
        }
        CronScheduler: {
            Cache: string
            AlternateCache: string
            VersionCheck: string
        }
    }
    EventProcessing: {
        $Hash: string
        DisableGeometryParsing: boolean
        ShapefileCoordinates: boolean
        CensusPopulationData: boolean
        BroadcastifyAttachments: boolean
        BroadcastifyTags: string[]
    }
    EventTasks: {
        $Hash: string
        ActionSettings: {
            Events: string[]
            Webhook: {
                Enabled: boolean
                Destination: string
                Ratelimit: number
                Title: string
                Message: string
            }
            NotificationServer: {
                Enabled: boolean
                Topic: string
                Priority: string | number
            }
            Uploads?: {
                TEXT: boolean
                AUDIO: boolean
                JSON: boolean
                IMAGE: boolean
            }
        }[]
        Archiving: {
            TTL: number
            ImageDirectory: string
            JSONDirectory: string
            TextDirectory: string
            AudioDirectory: string
            GraphicLogo: string
            AudioToneout: string
        }
    }
    EventFiltering: {
        $Hash: string
        IgnoreTestProducts: boolean
        NodeLocationFiltering: boolean
        NodeMaxDistance: number
        ListeningEvents: string[]
        ListeningICAO: string[]
        ListeningUGC: string[],
        ListeningStates: string[]
        IgnoredEvents: string[]
        IgnoredICAO: string[]
    }
    EventDictionary: {
        $Hash: string
        Toneouts: {[key: string]: string}
        Themes: { 
            Event: string, 
            RGB: string 
        }[]
        Dictionary: {
            [key: string]: {
                Issuance: string
                Update: string
                Cancellation: string
                Toneouts: {[key: string]: boolean}
            }
        }[]
    }
    LocalStormReports: {
        $Hash: string
        FetchInterval: number
        SpotterNetwork: boolean
        SPCReports: boolean
        ReportBuddy: boolean
    }
    Discussions: {
        FetchInterval: number
        MesoscaleDiscussions: boolean
        TropicalStormDiscussions: boolean
    }
    ProbSevereCIMSS: {
        $Hash: string
        Enabled: boolean
        FetchInterval: number
        Thresholds: {
            ShearProfile: number
            MinimumSevereProbability: number
            MinimumTornadoProbability: number
            MinimumHailProbability: number
            MinimumWindProbability: number
            MinimumMidupperCape: number
            MinimumLowlevelCape: number
        }
    }
    TempestWeatherStation: {
        $Hash: string
        Enabled: boolean
        Key: string
        Stations: {
            Alias: string
            ID: number
            Device: number
        }[]
    }
    LiveCameraFeeds: {
        Enabled: boolean
        FetchInterval: number
    }
    Nodes: {
        $Hash: string
        NodeTTL: number
        NodePolygonTTL: number
        Sources: {
            SpotterNetworkNodes: {
                Alias: string
                Search: string
            }[]
            RealtimeIRLNodes: {
                Alias: string
                Key: string
            }[]
            ManualNodes: {
                Alias: string
                Latitude: number
                Longitude: number
            }[]
        }
    }
}