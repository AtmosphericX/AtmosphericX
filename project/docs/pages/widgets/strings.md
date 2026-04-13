---
layout: doc
next: 
    text: 'RESTful API Introduction'
    link: /pages/restful-api/index
prev:
    text: 'Stream Widget'
    link: /pages/widgets/stream
---

<img src="/logo.png" alt="AtmosphericX Logo" width="200" style="display: block; margin: 0 auto;" />
<small class="page-author">Written By: <b>KiyoWx</b></small><br/>
<small class="last-updated">Last Updated: <b>Mar 9th, 2026</b></small><br><br><br>


# Strings Widget
---
The `strings` widget is the most versatile widget for displaying text based information in a dynamic and customizable manner. This includes anything from `event`, `mesonet data`, `clock and time information`, `PulsePoint`, `tracking nodes`, `dBZ intensity`, `nearby spotters`, `nearby events`, `outages`, and **way more**.


::: info Parameter Rules

- `?` is used when starting a query string in a URL.
- `&` is used to append additional parameters to an existing query string.
- `true` or `false` should be supplied depending on whether the parameter expects a boolean value.
- All parameters are case sensitive meaning `setsearch != setSearch`

Always follow the expected type and position of the parameter when constructing the widget settings.

Example URL: `/widgets/example?setWidgetParameter1=value1&setWidgetParameter2=value2`
:::


## Global Parameters
Below are default values that you can use with `/widgets/strings`. Visit [Global Parameters](./index#global-parameters) to see a full list of all the global parameters.

### setAnimationStartDuration
- Default (`float`): `2.0`
- Example: `/widgets/strings?setAnimationStartDuration=1.0`

### setAnimationEndDuration
- Default (`float`): `2.0`
- Example: `/widgets/strings?setAnimationEndDuration=0.5`

### setTextPlaceholder
- Default (`string`): **Widget carries multiple default values due to multiple widget types using this.**
- Example: `/widgets/strings?setTextPlaceholder=Custom Placeholder`

### setValuePath
- Default (`string`): **Widget carries multiple default values due to multiple widget types using this.**
- Example: `/widgets/strings?setValuePath=properties.key_value_here`

::: tip setValuePath Tips
Please see [Understanding setValuePath](/pages/widgets/#understanding-setvaluepath) to understand how this works. You can also use the `/data` endpoint which is listed under the `RESTful API` guide on what type of values you can get.
:::


## Local Parameters
Below are default / optional parameters you can use with the `strings` widget. Please be sure to follow the default value type convention.


### setType
- Description: The type of data to display (**Case Sensitive**).
- Default (`null`): `null`
- Available Types:
    - text
    - getRandomEvent
    - getRandomPulsePoint
    - getTracking
    - getNearbySpotters
    - getDbzIntensity
    - getClock
    - getWatchdog
    - getOutages
    - getNearbyEvents
    - getMesonet
- Example: `/widgets/strings?setType=getMesonet`

### setTextWrapping
- Description: Handles the getClock type and what to display.
- Default (`boolean`): `false`
- Example: `/widgets/strings?setTextWrapping=true`

### setFormat
- Description: Handles the `getClock` type and what to display
- Widget Types: `getClock`
- Default (`string`): `time`
- Example: `/widgets/strings?setType=getClock&setFormat=date`

### setTimezone
- Description: Sets the timezone for the `getClock` type
- Widget Types: `getClock`
- Default (`string`): `America/New_York`
- Example: `/widgets/strings?setType=getClock&setTimezone=America/New_York`

### setMilitaryTime
- Description: Controls whether to display time in military format
- Widget Types: `getClock`
- Default (`boolean`): `false`
- Example: `/widgets/strings?setType=getClock&setMilitaryTime=true`

### setRefreshTime
- Description: How often `getClock` should update
- Widget Types: `getClock`
- Default (`int`): `1`
- Example: `/widgets/strings?setType=getClock&setRefreshTime=5`

### setWatchdogList
- Description: What events we would like to count for in `getWatchdog`. This supports wildcard statements such as `* Watch` or multiple event types.
- Widget Types: `getWatchdog`
- Default (`string`): `tornado warning,severe thunderstorm warning`
- Example: `/widgets/strings?setType=getWatchdog&setWatchdogList=* Warning

### setSearch
- Description: Searches for a specific `tracking node` (See: [Location Tracking Nodes](/pages/sources/location-tracking-nodes)). If not set, it will default to `priority`.
- Widget Types: `getTracking`, `getNearbyEvents`, `getDbzIntensity`
- Default (`string`): `null`
- Example: `/widgets/strings?setType=getNearbyEvents&setSearch=John Doe`

### setRadius
- Description: Sets the radius for searching nearby events or spotters using the `priority` or `setSearch` parameter.
- Widget Types: `getNearbySpotters`, `getNearbyEvents`
- Default (`int`): `50`
- Example: `/widgets/strings?setType=getNearbySpotters&setRadius=5`


## Examples
::: details Example 1
Create a widget that `shows the time` in `Eastern Standard Time` and updates every `5 seconds`.
```
/widgets/strings?setType=getClock&setTimezone=America/New_York&setRefreshTime=5
``` 
:::

::: details Example 2
Create a widget that `counts all warnings` in the `watchdog` and `displays the count` and has a text prefix of "Active Warnings".
```
/widgets/strings?setType=getWatchdog&setWatchdogList=* Warning&setTextPrefix=Active Warnings
```
:::

::: details Example 3
Create a widget that `searches for nearby spotters` within a `10 mi/km radius` from the node `John Doe`.
```
/widgets/strings?setType=getNearbySpotters&setRadius=10&setSearch=John Doe
```
:::

::: details Example 4
Create a widget that `searches for nearby events` within a `20 mi/km radius` from the node `John Doe`.
```
/widgets/strings?setType=getNearbyEvents&setRadius=20&setSearch=John Doe
```
:::

::: details Example 5
Create a widget that `fetches the intensity` at the location of the node `John Doe`.
```
/widgets/strings?setType=getDbzIntensity&setSearch=John Doe
```
:::

::: details Example 6
Create a widget that `searches for a tracking node` named `John Doe` and `displays all the information` about that node relating to his `current location`.
```
/widgets/strings?setType=getTracking&setSearch=John Doe&setValuePath=properties.location
```
:::

::: details Example 7
Create a widget that gets a `random event` from the server and `displays the title` of that event.
```
/widgets/strings?setType=getRandomEvent&setValuePath=properties.event
```