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
<small class="last-updated">Last Updated: <b>Feb 27th, 2026</b></small><br><br><br>

# Source Configurations
---
The `sources.jsonc` file defines how AtmosphericX **collects, caches, and processes live weather and emergency data**.  


## Data Sources
The **Data Sources** feature integrates with multiple meteorological systems and APIs to provide comprehensive data. These integrations include the National Weather Service (NWS) API and the NOAA Weather Wire Service, which deliver official forecasts, warnings, and operational weather information in near real time. Additional data feeds include Local Storm Reports (LSRs), storm track data, probability products, and official forecast outlooks.

### National Weather Service API
> TODO: Write Documentation

### NOAA Weather Wire Service
> TODO: Write Documentation

### Event Caching (NOAA Weather Wire Service)
> TODO: Write Documentation

### Global Settings
> TODO: Write Documentation

## Location Tracking
AtmosphericX supports integrations with services such as `SpotterNetwork` and `RealTimeIRL`, enabling live location updates from certain platforms. These integrations allow users to display and track positions in real time, improving situational awareness and coordination during severe weather coverage. This also gives you the ability to toggle features like [Polywarn](../widgets/polywarn) and use [TempestWx Stations](#tempestwx-stations) with `located based` tracking. By default, the first user in the tracking will always take `priority` for weather sensor data. If you are using `RealtimeIRL`, this will always remain a priority tracker.

### RealtimeIRL Settings
A `pull_key` is required to use RealTimeIRL. You can obtain one by creating an account at [realtimeirl.com](https://realtimeirl.com/). After signing up, download the RealTimeIRL mobile app and configure it with your `push_key` to begin sending your longitude and latitude coordinates.

Once your device is actively transmitting location data through the app, AtmosphericX can retrieve those coordinates using your `pull_key`, enabling real-time GPS tracking.


### Spotter Network Settings
All spotters listed in `pin_by_name` are **case sensitive**. Be sure to use the exact casing when entering SpotterNetwork first and last names to `track`, otherwise the system may not recognize the spotter.

You can also configure which spotter statuses should be included. For example, you may choose to filter spotters based on whether they are `active`, `idle`, or `offline`, allowing you to display only the statuses that are relevant to your use case.


## Local Storm Reports (LSRs)
There are two types of sources when it comes to LSRs, one of them being `SpotterNetwork` which is by far the most reliable in terms of others. While it may have some trolls from time to time, it's the best way to get reports from chasers, spotters, and or emergency services. Alternatively, you can use `GibsonRidge` LSRs which usually more generic like `non-tstm wind gst`, `flood`, `snow`, `rain`, and `fog` reports. Whatever works for you, feel free to pick one. 

::: danger Contradictions
You can only choose one LSR at a time for your data source. Please choose the one you're more likely to use in your instance.
:::

## Discussion Settings
Sourced from `weatherwise.app`, these discussions cover topics such as mesoscale and tropical storms. Currently, there are no configurable settings or alerting capabilities for these discussions. In future updates, we plan to enable integration with the `alerts` widget so that relevant discussions can trigger notifications.

## Sonde Project WxEye / Rise-26
Special thanks to [Vince Waelti](https://www.youtube.com/channel/UCqSk-ojoH2rgAuYadPLJgJA) for providing radiosonde data through his RISE-26 project. His contributions help enhance AtmosphericX's weather tracking and analysis capabilities. Learn more about the project [here](https://www.wxeye.org/rise26).

:::info Affiliation
We are not affiliated with Vince Waelti or his projects. AtmosphericX simply utilizes the publicly available data he provides.
:::

## Probability Settings
AtmosphericX incorporates data from the `CIMSS (Cooperative Institute for Mesoscale Meteorological Studies)` for `PSv3`. These probabilistic severe weather products are developed collaboratively by researchers at the NOAA National Severe Storms Laboratory and CIMSS. Designed as experimental forecasting tools, PSv3 help meteorologists estimate the likelihood that a storm will produce severe weather, hail, wind, or tornadoes, providing early guidance for situational awareness and decision making during active weather events. If you wish to see the research see: 

- https://journals.ametsoc.org/view/journals/wefo/39/12/WAF-D-24-0076.1.xml

## Nexrad Stations
This feature provides a **GeoJSON representation** of Nexrad radar station locations, including each station's **longitude and latitude** coordinates as well as its unique **ID**. The data can be used for mapping, storm tracking, and integration with other geospatial weather products.

## WxRadio (WeatherUSA)
Provided by [weatherusa.net](https://weatherusa.net/radio), WxRadio allows access to community based streams of `NOAA Weather Radio` feeds across the United States. This enables near real time listening to official weather alerts, forecasts, and emergency broadcasts from local NOAA stations.


## Power Outages
Powered by `sdsweather`, this feature retrieves power outage information across the United States and US Territories.


## IoT Streams
Provided by `sdsweather` and `RadarOmega`, this feature offers access to various Internet of Things (IoT) data streams.

## TempestWx Stations
Integration with Tempest weather stations provides weather observations including temperature, humidity, wind speed, pressure, and precipitation data. When combined with location tracking, AtmosphericX can prioritize data from the nearest or primary weather station for improved accuracy in your coverage area.

## PulsePoint
Sourced from `pulsepoint.org`, this feed provides real time emergency incident data including `Fire` and `EMS` responses across participating jurisdictions in the United States. This requires a private decryption key to use.


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
