---
layout: doc
next: 
    text: 'Discussions'
    link: /pages/sources/discussions
prev:
    text: 'Location Tracking Nodes'
    link: /pages/sources/location-tracking-nodes
---

<img src="/logo.png" alt="AtmosphericX Logo" width="200" style="display: block; margin: 0 auto;" />
<small class="page-author">Written By: <b>KiyoWx</b></small><br/>
<small class="last-updated">Last Updated: <b>Mar 23rd, 2026</b></small><br><br><br>

# Local Storm Reports (LSRs)
---
Local Storm Reports (LSRs) are a critical component of AtmosphericX's data ecosystem, providing near realtime information on severe weather events as they occur. LSRs are sourced from two primary providers: `SpotterNetwork` and `GibsonRidge`. Each source offers unique insights and data points, allowing users to choose the one that best fits their needs. In the future, there are plans to add `NWS` and `IEM` LSRs as additional sources, further expanding the range of local storm data.

::: danger Source Contradictions
You can only choose one LSR at a time for your data source. Please choose the one you're more likely to use in your instance.
:::


## Configurations
Each source has a set of configurations that are realitvely similar including the ability to enable or disable the source and set the refresh `cache_time` for how often the data gets fetched.

## SpotterNetwork (Recommended)
`SpotterNetwork` reports are sourced directly from the `/reports` endpoint of the SpotterNetwork API every `2 minutes` (Configurable). These reports are usually submitted by trained storm spotters or emergency management personnel who are on the ground during severe weather events. Types of reports can include:
- Hail
- Tornado sightings (Funnel, Wall Cloud, etc.)
- Wind damage
- Flooding

Data can be requested at `/data/reports` and is returned in the following GeoJSON format:
```geojson
{
    "type": "Feature",
    "geometry": {
        "type": "Point",
        "coordinates": [ ... ]
    },
    "properties": {
        "event": "Funnel",
        "email": "...",
        "reporter": "John Smith",
        "time": "2026-03-23T18:45:00Z",
        "notes": "...",
        "sender": "SpotterNetwork",
    }
}
```

## GibsonRidge (Alternative)
`GibsonRidge` LSRs are sourced directly from `/lsr/lsr_latest.txt`, which provides a text table of the latest local storm reports every `2 minutes` (Configurable). These reports are more generic in nature and contains information such as:

- Non-thunderstorm wind gusts
- Flooding / Floods
- Snow accumulation
- Rainfall amounts
- Fog conditions

Data can be requested at `/data/reports` and is returned in the following GeoJSON format:
```geojson
{
    "type": "Feature",
    "geometry": {
        "type": "Point",
        "coordinates": [ ... ]
    },
    "properties": {
        "location": "...",
        "event": "Non-Thunderstorm Wind Gust",
        "sender": "...",
        "description": "...",
        "magnitude": 2,
        "office": "Chicago NWS",
        "time": "18:45 2026-03-23"
    }
}
```


## IEM (SOON)
> This has yet to be added as a source, but we plan to add it in the future.

## NWS (SOON)
> This has yet to be added as a source, but we plan to add it in the future.