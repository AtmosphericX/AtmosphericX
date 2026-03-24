---
layout: doc
next: 
    text: 'Power Outages'
    link: /pages/sources/outages
prev:
    text: 'Nexrad Locations'
    link: /pages/sources/nexrad
---

<img src="/logo.png" alt="AtmosphericX Logo" width="200" style="display: block; margin: 0 auto;" />
<small class="page-author">Written By: <b>KiyoWx</b></small><br/>
<small class="last-updated">Last Updated: <b>Mar 23rd, 2026</b></small><br><br><br>

# NOAA Weather Radio (WeatherUSA)
---
> Configurations: `sources.miscellaneous_settings.wx_radio`

Provided by [weatherusa.net](https://weatherusa.net/radio), WxRadio allows access to community based streams of `NOAA Weather Radio` feeds across the United States. This enables near realtime listening to official weather alerts, forecasts, and emergency broadcasts from local NOAA stations.

## Data Structure
Data can be requested at `/data/radio` and is returned in the following GeoJSON:
```geojson
{
    "type": "Feature",
    "geometry": {
        "type": "Point",
        "coordinates": [ ... ]
    },
    "properties": {
        "location": "...",
        "callsign": "...",
        "frequency": "...",
        "stream_url": "..."
    }
},

```
