---
layout: doc
next: 
    text: 'Strings Widget'
    link: /pages/widgets/strings
prev:
    text: 'Polywarn Widget'
    link: /pages/widgets/polywarn
---

<img src="/logo.png" alt="AtmosphericX Logo" width="200" style="display: block; margin: 0 auto;" />
<small class="page-author">Written By: <b>KiyoWx</b></small><br/>
<small class="last-updated">Last Updated: <b>Mar 9th, 2026</b></small><br><br><br>


# Stream Widget
---
The `streams` widget gathers `IoT` feeds from [SDS Weather](https://www.sdsweather.com/) and other available sources to provide feeds throughout the US and its territories.

::: danger Rebroadcasting Policy
Under applicable copyright law, **explicit permission is required** before rebroadcasting any feeds originating from `sdsweather.com`.

You must obtain authorization from **either**:
- The owner/operator of `sdsweather.com`, **or**
- The **original owner of the feed** being distributed.

Unauthorized rebroadcasting, redistribution, or public display of these feeds may violate copyright law and the rights of the feed owner. Additionally, there will be an applied watermark at the bottom of each feed. See: [Disclaimer](/pages/installation/#disclaimer)
:::


::: info Parameter Rules

- `?` is used when starting a query string in a URL.
- `&` is used to append additional parameters to an existing query string.
- `true` or `false` should be supplied depending on whether the parameter expects a boolean value.
- All parameters are case sensitive meaning `setsearch != setSearch`

Always follow the expected type and position of the parameter when constructing the widget settings.

Example URL: `/widgets/example?setWidgetParameter1=value1&setWidgetParameter2=value2`
:::


## Global Parameters
Below are default values that you can use with `/widgets/streams`. Visit [Global Parameters](./index#global-parameters) to see a full list of all the global parameters. Global theme (`setElementThemed`) will only be applicable to the title of the feed and it completely optional.

### setTextPlaceholder
- Default (`string`): `No streams available`
- Example: `/widgets/streams?setTextPlaceholder=No active feeds`

### setValuePath
- Default (`string/path/null`): `%properties.name% (%properties.location ?? properties.source%)`
- Example: `/widgets/streams?setValuePath=properties.name`

::: tip setValuePath Tips
Please see [Understanding setValuePath](/pages/widgets/#understanding-setvaluepath) to understand how this works. You can also use the `/data` endpoint which is listed under the `RESTful API` guide on what type of values you can get.
:::


## Local Parameters
Below are default / optional parameters you can use with the `streams` widget. Please be sure to follow the default value type convention.

### setRefreshTime
- Description: How often the feed updates when not static.
- Default (`int`): `15`
- Example: `/widgets/streams?setRefreshTime=10`

### setTextComponents
- Description: Whether to show the title and other details about the feed.
- Default (`boolean`): `true`
- Example: `/widgets/streams?setTextComponents=true/false`

### setStreamSource
- Description: The source of the stream to display.
- Default (`string`): `*`
- Example: `/widgets/streams?setStreamSource=USER/DEVICE/*`

### setStreamBufferDelay
- Description: How many completed downloads to buffer before starting playback.
- Default (`int`): `2`
- Example: `/widgets/streams?setStreamBufferDelay=2`

### setStreamMuted
- Description: Enable/Disable audio playback from the feed
- Default (`boolean`): `true`
- Example: `/widgets/streams?setStreamMuted=true/false`

### setSearch
- Description: What tracker node you want to use. (See: [Location Tracking](/configurations/sources.html#location-tracking))
- Default (`string/null`): `null`
- Example: `/widgets/streams?setSearch=First Last Name`

### setLatitude / setLongitude
- Description: Filter feeds by `lon` and `lat` coordinates
- Default (`float/null`): `null`
- Example: `/widgets/streams?setLatitude=40.7128&setLongitude=-74.0060`

### setRadius
- Description: Filter feeds by a circular area defined by a center point and radius given by `setLatitude` and `setLongitude`.
- Default (`float/null`): `null`
- Example: `/widgets/streams?setLatitude=40.7128&setLongitude=-74.0060&setRadius=10`

## Examples
::: details Example 1
Create a feed that specifically looks for all `USER (Storm Chasing) feeds` and `disable feed data`.
```
/widgets/streams?setStreamSource=USER&setTextComponents=false
```
:::

::: details Example 2
Find a feed `by name` and only display that.
```
/widgets/streams?setSearch=Feed Name
```
:::

::: details Example 3
`Mute` a stream and have a `buffer delay of 4` to have minimal buffering issues.
```
/widgets/streams?setStreamMuted=true&setStreamBufferDelay=4
```
:::

::: details Example 4
Find a `camera located at 40.7128, -74.0060` with a radius of `25 miles` and display it with a `custom prefix of 🔴` to indicate it's a live feed.
```
/widgets/streams?setLatitude=40.7128&setLongitude=-74.0060&setRadius=25&setTextPrefix=🔴
```
:::