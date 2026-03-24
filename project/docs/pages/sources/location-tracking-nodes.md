---
layout: doc
next: 
    text: 'Local Storm Reports'
    link: /pages/sources/local-storm-reports
prev:
    text: 'Ingestion Sources'
    link: /pages/sources/ingestion
---

<img src="/logo.png" alt="AtmosphericX Logo" width="200" style="display: block; margin: 0 auto;" />
<small class="page-author">Written By: <b>KiyoWx</b></small><br/>
<small class="last-updated">Last Updated: <b>Mar 23rd, 2026</b></small><br><br><br>

# Location Tracking Nodes
---
AtmosphericX supports integrations with services such as `SpotterNetwork` and `RealTimeIRL`, enabling live location updates from certain platforms. These integrations allow users to display and track positions in realtime, This also gives you the ability to use features like [Polywarn](../widgets/polywarn) and use [TempestWx Stations](#tempestwx-stations) with `located based` tracking.

## RealtimeIRL Settings
A `pull_key` is required to use RealTimeIRL. You can obtain one by creating an account at [realtimeirl.com](https://realtimeirl.com/). After signing up, download the RealTimeIRL mobile app and configure it with your `push_key` to begin sending your longitude and latitude coordinates.

Once your device is actively transmitting location data through the app, AtmosphericX can retrieve those coordinates using your `pull_key`, enabling realtime GPS tracking.

::: tip RealtimeIRL Nickname
When using RealTimeIRL, you can set a `nickname` in the configuration. This nickname will be displayed in the UI instead of your actual name, allowing for a more personalized and user friendly experience while maintaining privacy if you are streaming or sharing your location data.
:::

## Spotter Network Settings
All spotters listed in `pin_by_name` are **case sensitive**. Be sure to use the exact casing when entering SpotterNetwork first and last names to `track`, otherwise the project may not recognize the spotter.

You can also configure which spotter statuses should be included. For example, you may choose to filter spotters based on whether they are `active`, `idle`, or `offline`, allowing you to display only the statuses that are relevant to your use case.


## Node Priority
When multiple location tracking nodes are configured, AtmosphericX will prioritize them in the following order:
- 1. `RealTimeIRL` (if configured and active)
- 2. `SpotterNetwork` (if configured and active)

This is done to prioritize fetching mesonet and or tempest station data from the most important node, which is typically RealTimeIRL. If neither node is active, the system will not display any location data. 


## Mesonet Data
When using location tracking nodes, AtmosphericX will allow you to fetch mesonet data for the nearest station to the tracked location. This allows you to have more accurate and localized weather information based on your current position, enhancing the overall user experience and providing more relevant weather updates. This can be enabled or disabled in `location_settings.fetch_mesonet_data`.
Data can be requested at `/data/mesonet` and is returned in the following GeoJSON format:
```geojson
{
    "type": "Feature",
    "geometry": {
        "type": "Point",
        "coordinates": [ ... ]
    },
    "properties": {
        "temperature": 43,
        "dewpoint": 22,
        "humidity": 44,
        "wind_speed": 0,
        "wind_direction": null,
        "conditions": "...",
        "location": "..."
    }
},
```

## Node Inactivity
By default, if a node has not received location updates for `500 seconds`, it will be considered inactive and will not be used for tracking until it receives new data. This helps ensure that only current and relevant location information is displayed. This can be modified in `location_settings.expiry_time`.

## Polygon Updating and Construction
When using tracking nodes, AtmosphericX will automatically get polygon data for events and track how close you are from the closest point of the polygon. This allows you to have a more accurate representation of your proximity to the event, which can be used for features like `Polywarn` and other location-based alerts. The system will continuously update the polygon data every `60 seconds` unless modified in `location_settings.polygon_update_time`.

## TempestWx Stations
When using location tracking nodes, AtmosphericX can prioritize data from the nearest or primary Tempest weather station for improved accuracy in your coverage area. This allows you to receive more relevant and localized weather information based on your current location, enhancing the overall user experience and providing more accurate weather updates.

## Data Structure
Data can be requested at `/data/tracking` and is returned in the following GeoJSON format:
```geojson
{
    "type": "Feature",
    "geometry": {
        "type": "Point",
        "coordinates": [ ... ]
    },
    "properties": {
        "name": "John Smith",
        "source": "RealTimeIRL",
        "location": "Some County, Some State",
        "icao": "KXYZ",
        "last_updated": "2026-03-23T18:45:00Z
    }
}
```