---
layout: doc
next: 
    text: 'IoT Streams (RadarOmega/SDSWeather)'
    link: /pages/sources/streams
prev:
    text: 'WxRadio (WeatherUSA)'
    link: /pages/sources/nwr
---

<img src="/logo.png" alt="AtmosphericX Logo" width="200" style="display: block; margin: 0 auto;" />
<small class="page-author">Written By: <b>KiyoWx</b></small><br/>
<small class="last-updated">Last Updated: <b>Mar 23rd, 2026</b></small><br><br><br>

# Power Outages (SDSWeather)
---
Powered by `sdsweather`, this feature retrieves power outage information across the United States and US Territories.

## Data Structure
Data can be requested at `/data/outages` and is returned in the following JSON format:
```json
{
    "summary": {
        "total_customers": 111111111111111,
        "total_outages": 111111111111111,
        "priority": "STATE"
    },
    "data": [
        {
            "fips": 00,
            "state": "STATE",
            "tracked": 11111,
            "outaged": 11111
        },
    ]
},

```
