---
layout: doc
next: 
    text: 'Sonde Rise26'
    link: /pages/sources/sonde
prev:
    text: 'Local Storm Reports'
    link: /pages/sources/local-storm-reports
---

<img src="/logo.png" alt="AtmosphericX Logo" width="200" style="display: block; margin: 0 auto;" />
<small class="page-author">Written By: <b>KiyoWx</b></small><br/>
<small class="last-updated">Last Updated: <b>Mar 23rd, 2026</b></small><br><br><br>

# Discussions (Mesoscale / Tropical)
---
> Configurations: `sources.dicussion_settings`

Sourced from `weatherwise.app`, these discussions cover topics such as mesoscale and tropical storms. Currently, there are no configurable settings or alerting capabilities for these discussions. In future updates, we plan to enable integration with the `alerts` widget so that relevant discussions can trigger notifications.


## Mesoscale Discussions
By default, AtmosphericX will fetch all active mesoscale discussions every `2 minutes` from the `WeatherWise` API. This also supports fallback subdomains including `data`, `data1`, and `data2` to ensure reliability in fetching the latest discussions. If you wish to modify the refresh interval, you can adjust the `cache_time` for mesoscale discussions in
`dicussion_settings.mesoscale_discussions.cache_time`.

Data can be requested at `/data/discussions` and is returned in the following GeoJSON format:
```geojson
{
    "type": "FeatureCollection",
    "geometry": {
        "type": "Polygon",
        "coordinates": [ ... ]
    },
    "properties": {
        "mesoscale_id": "1234",
        "expires": "2026-03-23T14:00:00Z",
        "issued": "2026-03-23T12:00:00Z",
        "description": "...",
        "locations": "...",
        "outlook": "...",
        "population": 500000,
        "homes": 200000,
        "parameters": {
            tornado_probability: 10,
            wind_probability: 20,
            hail_probability: 15,
        }
    }   
}
```

## Tropical Discussions
Tropical discussions are also sourced from `WeatherWise` and are refreshed every `20 minutes` by default. Similar to mesoscale discussions, you can modify the refresh interval for tropical discussions in `dicussion_settings.tropical_storms.cache_time` if you want to receive updates more or less frequently.

Data can be requested at `/data/tropical_storms` and is returned in the following GeoJSON format:
```geojson
{
    "type": "Feature",
    "properties": {
        "name": "Tropical Storm Name Here"
        "discussion": "...",
        classification: "Tropical Storm",
        "pressure": 1000,
        "max_sustained_winds": 50,
        "last_updated": "2026-03-23T12:00:00Z"
    }
} 