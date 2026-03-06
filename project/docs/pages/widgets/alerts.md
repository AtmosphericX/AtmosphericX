---
layout: doc
next: 
    text: 'Palette Widget'
    link: /pages/widgets/palette
prev:
    text: 'Widget Introduction'
    link: /pages/widgets/index
---

<img src="/logo.png" alt="AtmosphericX Logo" width="200" style="display: block; margin: 0 auto;" />
<small class="page-author">Written By: <b>KiyoWx</b></small><br/>
<small class="last-updated">Last Updated: <b>Mar 4th, 2026</b></small><br><br><br>


# Alert Widget
---

The `alert` widget centralizes the management of weather and miscellaneous events. It provides customizable sound effects, flexible theming options, and optional Text-to-Speech integration with full support for the [`setRoute`](./index#understanding-setroute) functionality. The `alert` widget is located under `/widgets/alerts` and can be accessed directly via the URL.

::: warning TextToSpeech (OBS)
Text to speech currently does not work when you enable `Control audio via OBS`. This is a bug within OBS.
:::

::: info Parameter Rules

- `?` is used when starting a query string in a URL.
- `&` is used to append additional parameters to an existing query string.
- `true` or `false` should be supplied depending on whether the parameter expects a boolean value.

Always follow the expected type and position of the parameter when constructing the widget settings.

Example URL: `/widgets/example?setWidgetParameter1=value1&setWidgetParameter2=value2`
:::


## Global Parameters
Below are default values that you can use with `/widgets/alerts`. Visit [Global Parameters](./index#global-parameters) to see a full list of all the global parameters.

### setAnimationStartDuration
- Default: (`float`): `1.0`
- Example: `/widgets/alerts?setAnimationStartDuration=1.0`

### setAnimationEndDuration
- Default: (`float`): `0.5`
- Example: `/widgets/alerts?setAnimationEndDuration=0.5`

### setRoute
- Description: The header text displayed at the very top of the card.
- Default: (`string`): `%properties.event% (%properties.agency ?? properties.action_type%)`
- Example: `/widgets/alerts?setRoute=%properties.event% (%properties.agency ?? properties.action_type%)`

## Local Parameters
Below are default / optional parameters you can use with the `alert` widget. Please be sure to follow the default value type convention.

### setElement
- Description: The `element` to select for handling the widget. This is forced upon the widget and **can't** be changed.
- Default (`DOM`): `widget-container`
- Example: `N/A`

### setWx
- Description: Whether to display `weather related` events through event queue.
- Default (`boolean`): `true`
- Example: `/widgets/alerts?setWx=(true/false)`

### setPulsePoint
- Description: Whether to display `PulsePoint Respond` emergency events in the queue
- Default (`boolean`): `false`
- Example: `/widgets/alerts?setPulsePoint=(true/false)`

::: details PulsePoint Availability
This setting requires an `API key` to use, so setting this to `true` wont autoamtically give you `911` CAD events.
You can enable this feature in the [Sources.jsonc](../configurations/sources) with the path `sources.miscellaneous_settings.pulse_point`.
:::

### setPauseTime
- Description: The time in `seconds` to display an event for. It's **RECOMMENDED** to set this value between `8-15` seconds.
- Default: (`int`): `8`
- Example: `/widgets/alerts?setPauseTime=8`

### setMaxHistory
- Description: The maximum number of `minutes` to look back for events and add to the queue.
- Default: (`int`): `5`
- Example: `/widgets/alerts?setMaxHistory=5`

### setStreaming
- Description: `Enable/Disable` the interface for the card system. This is particularly useful having only `sfx` if set to `false`.
- Default (`boolean`): `true`
- Example: `/widgets/alerts?setStreaming=(true/false)`

### setPlayback
- Description: `Enable/Disable` the playback functionality for the widget. Essentially making it muted if set to `false`.
- Default (`boolean`): `true`
- Example: `/widgets/alerts?setPlayback=(true/false)`

### setSfx
- Description: An optional way to override the default `beep` sfx sound effect with a predefined one. This is useful if you want to have a different sfx sound for a specific scene while having the backend still manage the default one.
- Default: (`string/path/null`): `null`
- Example: `/widgets/alerts?setSfx=/sfx/eas_sfx/siren-eas.mp3`

::: details Available Sfx / Custom Sfx
Sound effects and other related files can be found under `/www/assets/sfx` in the `storage` directory.
:::

### setSfxVolume
- Description: The volume level for the sound effect, expressed as a decimal between 0.0 (muted) and 1.0 (full volume).
- Default: (`float`): `1.0`
- Example: `/widgets/alerts?setSfxVolume=0.5`

::: details Volume Settings
Please make sure that your volume level is between `0.0-1.0` as going any lower or higher will cause an `error` to occur.
:::


## Examples
::: details Example 1
- Prompt: Make an `alert` widget holds the event for `15` seconds, has a max event history of `25` minutes and sets the route header message to something like **Severe Thunderstorm Warning (Grand Junction, CO)** yet if not available default to the action type (`Updated/Issued/Upgraded`)
```
/widgets/alerts?setPauseTime=15&setMaxHistory=25&setRoute=%properties.event% (%properties.sender_name ?? properties.action_type%)
```
:::

::: details Example 2
- Prompt: Make an `alert` widget that has `no box shadow`, sets a `custom sfx to a siren` instead of the default beep, and has a `longer animation start duration of 3 seconds`
```
/widgets/alerts?setAnimationStartDuration=3.0&setSfx=/sfx/eas_sfx/siren-eas.mp3&setBoxShadow=false
```
:::

::: details Example 3
- Prompt: Make an `alert` widget that sets the `text allignment of the header to the center`, doesn't contain `event status`, and changes the `border radius to 1px`
```
/widgets/alerts?setTextAlignment=center&setRoute=%properties.event%&setBorderRadius=1
```
:::

::: details Example 4
- Prompt: Make an `alert` widget that is `muted`.
```
/widgets/alerts?setPlayback=false
```
:::