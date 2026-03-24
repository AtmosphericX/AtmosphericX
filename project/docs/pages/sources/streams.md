---
layout: doc
next: 
    text: 'Tempest Weather Station'
    link: /pages/sources/tempest
prev:
    text: 'Outages (SDSWeather)'
    link: /pages/sources/outages
---

<img src="/logo.png" alt="AtmosphericX Logo" width="200" style="display: block; margin: 0 auto;" />
<small class="page-author">Written By: <b>KiyoWx</b></small><br/>
<small class="last-updated">Last Updated: <b>Mar 23rd, 2026</b></small><br><br><br>

# IoT Streams (RadarOmega/SDSWeather)
---
Provided by `sdsweather` and `RadarOmega`, this feature offers access to various Internet of Things (IoT) data streams.

::: danger Rebroadcasting Policy
Under applicable copyright law, **explicit permission is required** before rebroadcasting any feeds originating from `sdsweather.com`.

You must obtain authorization from **either**:
- The owner/operator of `sdsweather.com`, **or**
- The **original owner of the feed** being distributed.

Unauthorized rebroadcasting, redistribution, or public display of these feeds may violate copyright law and the rights of the feed owner. Additionally, there will be an applied watermark at the bottom of each feed. See: [Disclaimer](/pages/installation/#disclaimer)
:::


## Data Structure
Data can be requested at `/data/streams` and is returned in the following GeoJSON format:
```geojson
{
    "type": "Feature",
    "geometry": {
        "type": "Point",
        "coordinates": [ ... ]
    },
    "properties": {
        "name": "...",
        "location": "...",
        "stream_name": "RadarOmega Stream (....)",
        "stream_url": "....",
        "stream_viewers": 0,
        "icon_url": "....",
        "model": "CYCLONEPORT_V1",
        "source": "DEVICE"
    }
},
```
