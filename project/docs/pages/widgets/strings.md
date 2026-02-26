---
layout: doc
next: 
    text: 'String Widget'
    link: /pages/widgets/strings
prev:
    text: 'Widgets Introduction'
    link: /pages/widgets/index
---


<img  src="/logo.png" alt="AtmosphericX Logo" width="200" style="display: block; margin-left: auto; margin-right: auto;" />
<small class="page-author">Written By: KiyoWx</small><br/>
<small class="last-updated">Last Updated: Jan 23rd, 2026</small>

## String Widget Configuration and Usage
The string widget is the most versatile and widely used widget in AtmosphericX. It allows you to display dynamic weather data as customizable text strings. This guide will walk you through the configuration options available for the string widget and provide examples of how to use it effectively.


## Parameters
The string widget supports a variety of parameters that allow you to customize its appearance and behavior. Here are the common parameters available for all string types:

- **element** – The DOM element hosting the widget. Default: `document.getElementById('input_text')`
- **type** – Selects the string data source to display. Default: `clock`
- **directory** – Namespace for the weather property to read. Default: `properties.event`
- **suffix** – Appends extra text to the displayed string. Default: `(empty string)`
- **prefix** – Prepends extra text to the displayed string. Default: `(empty string)`
- **character_limit** – Caps the length of the rendered string. Default: `64`
- **center** – Centers the text within the widget when `true`. Default: `false`
- **placeholder** – Fallback text shown when the source is empty. Default: `N/A`
- **is_animated** – Enables animated transitions between updates. Default: `false`
- **is_color_coded** – Applies conditional coloring to the text. Default: `false`
- **disable_dropshadow** – Disables the default drop shadow effect. Default: `false`
- **is_military_time** – Displays time in 24‑hour format when applicable. Default: `false`
- **timezone** – Custom timezone identifier for time-based strings. Default: `null`
- **events** – list of event identifiers to feed the widget. Default: `[]`
- **radius** – Controls rounding radius for string elements. Default: `100`

::: danger Important Note
Some parameters are specific to certain string types. Refer to the individual string type sections below for details on unique parameters and their usage.
:::

## Clock Widget (`type=clock`)
The clock type is one of the most commonly used string types. It allows you to display the current time or date in various formats. You can customize the format using standard date/time tokens.


**Clock Widget Examples:**
::: code-group
```sh [Date Widget]
# Displays the current date (Eg. January 23, 2026)
/widgets/strings?type=clock&directory=date
```

```sh [Time Widget]
# Displays the current time (Eg. 14:30 or 2:30 PM)
/widgets/strings?type=clock&directory=time
```

```sh [Timezone Widget]
# Displays the current timezone (Eg. America/New_York)
/widgets/strings?type=clock&directory=timezone
```
:::

**Unique Widget Parameters:**
::: code-group
```sh [Set Custom Timezone]
# This sets the timezone to New York (EST/EDT)
# Parameter: timezone=string (See: https://en.wikipedia.org/wiki/List_of_tz_database_time_zones)
/widgets/strings?type=clock&directory=time&timezone=America/New_York
```

```sh [Enable 24 Hour Time]
# This enables 24 hour time format
# Parameter: is_miliary_time=boolean
/widgets/strings?type=clock&directory=time&is_military_time=true
```
:::

## Random Event Widget (`type=random`)
The random event type allows you to display a event chosen by the server to display. This is useful for showing random weather events or alerts on your stream to display dynamic information including descriptions, locations, name, and more. 

**Random Event Widget Example:**
::: code-group
```sh [Propery Selection]
# Displays the name of a cycled random event
# properties.event can be replace with anything under the properties namespace or prior. (See /data/random) for a list of available properties.
/widgets/strings?type=random&directory=properties.event
```

```jsonc [Example Properties (/data/random)]
/* 
    This is a demo output from the /data/random endpoint.
    If you want to select a specific property, change the directory parameter accordingly.
    For example, to get the event status, use directory=properties.action_type
    Example Output: Updated
*/
{
    "type": "Feature",
    "properties": {
        "locations": "Somewhere, USA",
        "event": "Winter Storm Warning",
        "issued": "1/23/2026, 1:48:00 PM",
        "expires": "1/24/2026, 4:00:00 AM",
        "parent": "Winter Storm Warning",
        "action_type": "Updated",
        "description": "",
        "sender_name": "Lincoln, IL",
        "sender_icao": "KILX",
        "attributes": {},
        "geocode": {
            "UGC": [
                "ILZ042",
            ],
            "GENERATED": null
        }
    },
    "raw": {},
    "parameters": {
        "wmo": "WWUS43 KILX 231948",
        "source": "N/A",
        "max_hail_size": "N/A",
        "max_wind_gust": "N/A",
        "damage_threat": "N/A",
        "tornado_detection": "N/A",
        "flood_detection": "N/A",
        "discussion_tornado_intensity": "N/A",
        "discussion_wind_intensity": "N/A",
        "discussion_hail_intensity": "N/A"
    },
    "details": {
        "performance": 0.0179000000935048,
        "source": "api-parser",
        "tracking": "KILX-WS-W-0001",
        "header": "ZCZC-ATSX-WSW-000000-Issued-20260123T194900-XXXX-",
        "pvtec": "/O.CON.KILX.WS.W.0001.260124T1500Z-260126T0600Z/",
        "history": []
    },
    "tags": [
        "Difficult Travel Conditions"
    ],
    "is_updated": true,
    "is_issued": false,
    "is_cancelled": false,
    "hash": "62336feb8ff982c3efa62c19e34b4937",
    "client": {
        "metadata": {},
        "theme": {},
        "sfx": "/assets/sfx/winter_sfx/winter-storm-warning-updated.mp3",
        "ignored": false,
        "only_beep": false
    },
    "spotters": []
}
```
:::















## Watchdog Widget (`type=watchdog`)
The watchdog type allows you to display the total amount of active events that are currently registered by the server. This is useful for streamers who want to show how many warnings, watches, advisories, or specific event types are currently active. This also supports filtering by `*` wildcards or specific event types.

**Watchdog Widget Example:**
::: code-group
```sh [Total Warning Count]
/widgets/strings?type=watchdog&events=* Warning
```
```sh [Total Watch Count]
/widgets/strings?type=watchdog&events=* Watch
```
```sh [Total Advisory Count]
/widgets/strings?type=watchdog&events=* Advisory
```
```sh [Total Specific Event Count]
/widgets/strings?type=watchdog&events=Winter Storm Warning
```
```sh [Multiple Specific Event Count]
/widgets/strings?type=watchdog&events=Winter Storm Warning,Tornado Warning
```
:::