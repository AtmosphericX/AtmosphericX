---
layout: doc
next: 
    text: 'NOAA Weather Radio (NWR)'
    link: /pages/sources/nwr
prev:
    text: 'CIMSS Probability'
    link: /pages/sources/cimss
---

<img src="/logo.png" alt="AtmosphericX Logo" width="200" style="display: block; margin: 0 auto;" />
<small class="page-author">Written By: <b>KiyoWx</b></small><br/>
<small class="last-updated">Last Updated: <b>Mar 23rd, 2026</b></small><br><br><br>

# Nexrad Locations
---
> Configurations: `sources.miscellaneous_settings.nexrad_radars`

This data provides a **GeoJSON representation** of Nexrad radar station locations, including each station's **longitude and latitude** coordinates as well as its unique **ID**. The data can be used for mapping, storm tracking, and integration with other geospatial weather products.

## Data Structure
Data can be requested at `/data/radars` and is returned in the following GeoJSON:
```geojson
{
    "type": "Feature",
    "geometry": {
        "type": "Point",
        "coordinates": [ -97.278333, 35.333611 ]
    },
    "properties": {
        "id": "KTLX"
    }
}
```
