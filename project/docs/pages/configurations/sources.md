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
<small class="last-updated">Last Updated: <b>Mar 9th, 2026</b></small><br><br><br>

# Source Configurations
---
The `sources.jsonc` file defines how AtmosphericX **collects, caches, and processes live weather and emergency data**. This includes settings for data retrieval, update frequencies, and source specific parameters. See [sources](/pages/sources/ingestion) for detailed information on each data source.

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
    └── miscellaneous_settings
        ├── sonde_project_weather_eye
        ├── probability
        ├── nexrad_radars
        ├── wx_radio
        ├── power_outages
        ├── iot_streams
        ├── tempest_station
        └── pulse_point
```
