---
layout: doc
next: 
    text: 'Events.jsonc'
    link: /pages/configurations/events
prev:
    text: 'Core.jsonc'
    link: /pages/configurations/core
---

<img src="/logo.png" alt="AtmosphericX Logo" width="200" style="display: block; margin: 0 auto;" />
<small class="page-author">Written By: <b>KiyoWx</b> & <b>StarflightWx</b></small><br/>
<small class="last-updated">Last Updated: <b>Feb 27th, 2026</b></small><br>

# Sources Configurations
---
The `sources.jsonc` file defines how AtmosphericX **collects, caches, and processes live weather and emergency data**.  

Key functions include:

- **Data Sources:** Integrations with NOAA Weather Wire, National Weather Service, local storm reports, mesoscale discussions, tropical storm tracks, and probability products like tornado and severe weather outlooks.  
- **Location Tracking:** Real-time tracking via Spotter Network and RealtimeIRL, with configurable expiry and polygon update times.  
- **Event Parsing & Reports:** Manage parsing of alerts, mesoscale discussions, tropical tracks, and spotter/GRLevelX storm reports.  
- **Miscellaneous Services:** Radar stations, weather radio, power outage feeds, IoT streams, Tempest weather stations, and PulsePoint emergency feeds.  
- **Performance Controls:** Each source includes enable/disable toggles, polling intervals, caching settings, and performance options.



## Configuration Map
```
sources.jsonc
├── sources:hash
└── sources
    ├── atmosx_parser_settings
    │   ├── noaa_weather_wire_service
    │   ├── journal
    │   ├── database
    │   ├── national_weather_service_settings
    │   ├── weather_wire_settings
    │   └── global_settings
    │
    ├── location_settings
    │   ├── expiry_time
    │   ├── polygon_update_time
    │   ├── realtime_irl
    │   └── spotter_network
    │
    ├── local_storm_report_settings
    │   ├── spotter_reports
    │   └── grlevelx_reports
    │
    ├── dicussion_settings
    │   ├── mesoscale_discussions
    │   └── tropical_storm_tracks
    │
    ├── probability_settings
    │   ├── tornado
    │   └── severe
    │
    └── miscellaneous_settings
        ├── sonde_project_weather_eye
        ├── nexrad_radars
        ├── wx_radio
        ├── power_outages
        ├── iot_streams
        ├── tempest_station
        └── pulse_point
```
