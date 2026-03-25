---
layout: doc
next: 
    text: 'ICAO Locations'
    link: /pages/sources/icao
prev:
    text: 'Sonde Rise26'
    link: /pages/sources/sonde
---

<img src="/logo.png" alt="AtmosphericX Logo" width="200" style="display: block; margin: 0 auto;" />
<small class="page-author">Written By: <b>KiyoWx</b></small><br/>
<small class="last-updated">Last Updated: <b>Mar 23rd, 2026</b></small><br><br><br>

# CIMSS Probability (PSv3)
---
> Configurations: `sources.miscellaneous_settings.cimss_psv3`

AtmosphericX incorporates data from the `CIMSS (Cooperative Institute for Mesoscale Meteorological Studies)` for `PSv3`. These probabilistic severe weather products are developed collaboratively by researchers at the NOAA National Severe Storms Laboratory and CIMSS. Designed as experimental forecasting tools, PSv3 help meteorologists estimate the likelihood that a storm will produce severe weather, hail, wind, or tornadoes, providing early guidance for situational awareness and decision making during active weather events.

> Journal: https://journals.ametsoc.org/view/journals/wefo/39/12/WAF-D-24-0076.1.xml


## Probabilistic Severe Thresholds
The PSv3 products include probabilistic thresholds for severe weather, hail, wind, and tornadoes. These thresholds are typically expressed as percentages, indicating the likelihood that a given storm will produce the specified type of severe weather. For example:
- Severe Weather Probability: 30% (indicating a 30% chance of severe weather occurring)
- Hail Probability: 20% (indicating a 20% chance of hail occurring)
- Wind Probability: 15% (indicating a 15% chance of damaging winds occurring)
- Tornado Probability: 10% (indicating a 10% chance of tornadoes occurring)
- Shear: 40% (indicating a 40% of significant wind shear occurring)
- MLCAPE: 1500 J/kg (indicating a MLCAPE value of 1500 J/kg)
- MUCAPE: 1200 J/kg (indicating a MUCAPE value of 1200 J/kg)

These probability thresholds are customizable in the `cimss_psv3.thresholds` configuration section, allowing users to adjust the thresholds based on their specific needs and preferences. The thresholds can be set for each type of severe weather, as well as for shear and CAPE values.

### Current Thresholds (Subject to Change)
- Tornado: >25%
- Hail: >50%
- Wind: >50%
- Severe: >30%
- Shear: >40%
- MLCAPE: >3000 J/kg
- MUCAPE: >3000 J/kg


## Data Structure
Data can be requested at `/data/cimss` and is returned in the following GeoJSON format:
```geojson
{
    "type": "Feature",
    "geometry": {
        "type": "Polygon",
        "coordinates": [ ... ]
    },
    "properties": {
        "tornado": 10,
        "severe": 30,
        "wind": 15,
        "hail": 20,
        "shear": 40,
        "MLCape": 1500,
        "MUCape": 1200,
        "description": "..."
    }
}