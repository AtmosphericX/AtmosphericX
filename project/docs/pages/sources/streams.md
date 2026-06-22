---
layout: doc
next: 
    text: 'Tempest Weather Station'
    link: /pages/sources/tempest
prev:
    text: 'Power Outages'
    link: /pages/sources/outages
---

<img src="/logo.png" alt="AtmosphericX Logo" width="200" style="display: block; margin: 0 auto;" />
<small class="page-author">Written By: <b>KiyoWx</b></small><br/>

# Camera Streams (IoT)
---
> Configurations: `sources.miscellaneous_settings.camera_streams`

Provided by `RadarOmega`, `WeatherWise` and `other sources`. This feature offers access to various Internet of Things (IoT) video data streams.

::: danger Rebroadcasting Policy
Under applicable copyright law, **explicit permission is required** before rebroadcasting any feeds originating from the streams endpoint.

You must obtain authorization from **either**:
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
        "stream_name": "Stream Name (....)",
        "stream_url": "....",
        "stream_viewers": 0,
        "icon_url": "....",
        "model": "DEVICE",
        "source": "RADAR_OMEGA"
    }
},
```
