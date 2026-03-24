---
layout: doc
next: 
    text: 'PulsePoint Respond'
    link: /pages/sources/pulsepoint
prev:
    text: 'RadarOmega Streams'
    link: /pages/sources/streams
---

<img src="/logo.png" alt="AtmosphericX Logo" width="200" style="display: block; margin: 0 auto;" />
<small class="page-author">Written By: <b>KiyoWx</b></small><br/>
<small class="last-updated">Last Updated: <b>Mar 23rd, 2026</b></small><br><br><br>

# Tempest Weather Station
---
> Configurations: `sources.miscellaneous_settings.tempest_station`

Integration with TempestWx stations provides weather observations including temperature, humidity, wind speed, pressure, and precipitation data. When combined with location tracking, AtmosphericX can prioritize data from the nearest or primary weather station for improved accuracy in your coverage area.

## Prerequisites
- [TempextWx Station](https://shop.tempest.earth/products/tempest) (Optional)
- API Key
- Station ID
- Device ID


## Location Based Tracking
AtmosphericX can use [Tracking Nodes](/pages/sources/location-tracking-nodes) to get the nearest Tempest station to a given location. This allows for more accurate weather data when a station is available nearby. If no station is available, the system will fall back to the default data source.
