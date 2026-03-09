---
layout: doc
next: 
    text: 'Stream Widget'
    link: /pages/widgets/stream
prev:
    text: 'Palette Widget'
    link: /pages/widgets/palette
---

<img src="/logo.png" alt="AtmosphericX Logo" width="200" style="display: block; margin: 0 auto;" />
<small class="page-author">Written By: <b>KiyoWx</b></small><br/>
<small class="last-updated">Last Updated: <b>Mar 8th, 2026</b></small><br><br><br>


# Polywarn Widget
---
`PolyWarn` is one of **AtmosphericX's** most powerful features. It automatically generates alerts whenever a **tracked node** enters an **event polygon**.

This allows storm chasers and streamers to quickly see and display when they move into official weather products such as:

- **Warnings**
- **Watches**
- **Advisories**
- **Statements**
- Other polygon based alerts

PolyWarn is particularly useful for live broadcasts, as it can notify both the chaser and their viewers the moment they enter a significant weather alert area.

See more on [Tracking](/configurations/sources#tracking) with **Spotter Network** and **RealtimeIRL**.

::: info Parameter Rules

- `?` is used when starting a query string in a URL.
- `&` is used to append additional parameters to an existing query string.
- `true` or `false` should be supplied depending on whether the parameter expects a boolean value.

Always follow the expected type and position of the parameter when constructing the widget settings.

Example URL: `/widgets/example?setWidgetParameter1=value1&setWidgetParameter2=value2`
:::


## Global Parameters
Below are default values that you can use with `/widgets/polywarn`. Visit [Global Parameters](./index#global-parameters) to see a full list of all the global parameters. However `setElementThemed` is forced to `false`.

### setAnimationStartDuration
- Default: (`float`): `3`
- Example: `/widgets/polywarn?setAnimationStartDuration=1.0`

### setAnimationEndDuration
- Default: (`float`): `3`
- Example: `/widgets/polywarn?setAnimationEndDuration=0.5`

### setAnimationHasEnding
- Default: (`boolean`): `true`
- Example: `/widgets/polywarn?setAnimationHasEnding=true`

### setAnimatedDelayEnding
- Default: (`number`): `5`
- Example: `/widgets/polywarn?setAnimatedDelayEnding=10`

### setTextCharacterLimit
- Default: (`number`): `125`
- Example: `/widgets/polywarn?setTextCharacterLimit=100`

### setValuePath
- Default: (`string/path/null`): `%properties.event%`
- Example: `/widgets/polywarn?setValuePath=%properties.event%`


### setValuePathSecondary
- Default: (`string/path/null`): `Issued at %properties.issued%`
- Example: `/widgets/polywarn?setValuePathSecondary=Issued at %properties.issued%`



## Local Parameters
Below are default / optional parameters you can use with the `polywarn` widget. Please be sure to follow the default value type convention.


### setElement
- Description: The `element` to select for handling the widget. This is forced upon the widget and **can't** be changed.
- Default (`DOM`): `widget-container-isolated`
- Example: `N/A`

### setElementTitle
- Description: The `element` to select for hnadling the title. This is forced upon the widget and **can't** be changed.
- Default (`DOM`): `widget-child-1`
- Example: `N/A`

### setElementSubtitle
- Description: The `element` to select for hnadling the subtitle. This is forced upon the widget and **can't** be changed.
- Default (`DOM`): `widget-child-2`
- Example: `N/A`

### setSfx
- Description: The sound that is played during the event.
- Default (`string/path/null`): `/sfx/dash_sfx/boom3.mp3`
- Example: `/widgets/polywarn?setSfx=/sfx/dash_sfx/boom2.mp3`

### setAwaitPeriod
- Description: How long after the last polywarn event playback you should wait in seconds for the next one to play.
- Default (`number`): `20`
- Example: `/widgets/polywarn?setAwaitPeriod=15`

### setSearch
- Description: What tracker node you want to use. (See: [location tracking](/configurations/sources.html#location-tracking))
- Default (`string/null`): `null`
- Example: `/widgets/polywarn?setSearch=First Last Name`


## Examples
