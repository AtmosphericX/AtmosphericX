---
layout: doc
next: 
    text: 'Alert Widget'
    link: /pages/widgets/alerts
prev:
    text: 'Placefile Configurations'
    link: /pages/placefiles/index
---

<img src="/logo.png" alt="AtmosphericX Logo" width="200" style="display: block; margin: 0 auto;" />
<small class="page-author">Written By: <b>KiyoWx</b></small><br/>
<small class="last-updated">Last Updated: <b>Mar 9th, 2026</b></small><br><br><br>


# Widget Introduction
---
AtmosphericX offers a variety of widgets that can be used to spice up your stream, display, or application with weather data, streams, events, and overlays. Widgets are modular components that can be easily added, removed, and customized to fit your specific needs. This guide provides an overview of the available widgets, their functionalities, and instructions on how to configure and use them effectively.

::: warning Progressive Web Applications
By default, each widget has [Progressive Web Apps](https://en.wikipedia.org/wiki/Progressive_web_app) capabilities. This allows widgets to be installed and run as standalone applications on supported platforms.
:::

## How do widgets work?
Widgets are made using bare bone `HTML`, `CSS`, and `JavaScript`. Each widget is a self contained component that can be embedded in any web application or streaming software that supports browser sources. Customization is entirely up to the client and not handled by the server meaning there are endless possibilities for customization and modification.

## What type of customization is available?
Each widget has a set of `Local` and `Global` parameters that can be modified directly within the `URL` of the widget. These parameters allow for fine tuning of appearance, behavior, and data display settings without requiring changes to the widget's source code. These parameters can be defined with a `?` (At the end of the URL) followed by a list of parameters in the format `key=value`.

### Widget parameter example
`/widgets/example?setExample=true&setExample2=false`

## Global vs Local Parameters
The difference between global and local parameters is that global parameters can be applied to everything and are located within `assets/js/static/parameters.js` while local parameters are specific to each widget and are defined within the widget's own script.

## Global Parameters
> This table is auto populated from `/assets/js/static/parameters.js`. Values may change with updates.

<script setup lang="ts">
    import { ref, onMounted } from 'vue'
    const rows = ref<{ property: string; defaultValue: string }[]>([])
    onMounted(async () => {
        const getResponse = await fetch('/assets/js/static/parameters.js')
        const getText = await getResponse.text()
        const getMatches = getText.match(/const\s+aGlobalElementSettings\s*=\s*{([\s\S]*?)}/)
        const getObject = getMatches[1]
        rows.value = getObject.split('\n').map(line => line.trim()).filter(line => line && line.includes(':')).map(line => {
            const [getProperty, getLine] = line.split(':')
            const getValue = getLine.split('//')[0].split('??')[1]?.trim().replace(/['"`,]/g, '') ?? ''
            const getDefault = (getValue == `null` ) ? '--' : getValue
            const getDescription = line.split('//')[1]?.trim() ?? ''
            return { getProperty, getDefault, getDescription }
        }).sort((a, b) => {
            if (a.getDefault === '--') return 1
            if (b.getDefault === '--') return -1
            return 0
        })
    })
</script>

<table class="table table-striped table-hover">
  <thead>
    <tr>
        <th>Parameter</th><th>Default</th><th>Description</th> 
    </tr>
  </thead>
  <tbody>
    <tr v-for="row in rows" :key="row.getProperty">
      <td>{{ row.getProperty }}</td>
      <td>{{ row.getDefault }}</td>
      <td>{{ row.getDescription }}</td>
    </tr>
  </tbody>
</table>

## Understanding setValuePath
`setValuePath` is a global parameter that extracts values from nested JSON structures like GeoJSON. For example, to get `wind_speed` from properties, use:

```
?setValuePath=properties.wind_speed
```

**Multiple values:** Use `%` delimiters to combine multiple fields:
```
?setValuePath=This value is %properties.wind_speed% MPH and is moving %properties.wind_direction%
```

**Fallback values:** Use `??` to provide alternatives:
```
?setValuePath=%properties.location% ?? %properties.conditions%
```

**GeoJSON example**

```jsonc
{
  "type": "FeatureCollection",
  "features": [
    {
      "type": "Feature",
      "geometry": {
        "type": "Point",
        "coordinates": [-75.4968033, 44.6912994]
      },
      "properties": {
        "temperature": 29,
        "dewpoint": 18,
        "humidity": 69,
        "wind_speed": 4, // We want this value...
        "wind_direction": "SSW",
        "conditions": "broken clouds",
        "location": "Saint Lawrence County, New York"
      }
    }
  ]
}
```

This can be slightly made better by appending a prefix or suffix to the returned value by using `setTextPrefix=Wind Speed:`, `setTextSuffix=MPH` and `setAnimated=true`. If you want to see more parameters, please see [Global Parameters](#global-parameters).


## Available Animations
By default, AtmosphericX includes several animations that can be used throughout the widget and dashboard frontend. Below is a list of available animations that can be used:

- anim_grid_drift
- anim_fade_out 
- anim_fade_in
- pulse
- anim_shrink
- anim_slide_in
- anim_grid

You can use the `setAnimationStartType` or `setAnimationEndType` to define these animations as long as `setAnimated` is `true`


## Importing Themes (OBS / Streamlabs)
AtmosphericX v8 includes a **prebuilt theme** in the `/themes` directory. To import it into OBS Studio:

1. Open OBS Studio
2. Navigate to **Scene Collection** > **Import**
3. Select the `.json` file from `/themes`
4. Click **Import**

For **community-created themes**, visit the community Discord or other public repositories.

::: tip
Save your current scene collection before importing to avoid losing custom settings.
:::

## Importing Widgets (OBS / Streamlabs)
To import widgets, add a `Browser Source` in your current `scene` and point it to the widget's URL. This allows you to customize your stream's appearance and functionality with realtime data integration.

### Widget didn't load at all?
Ensure your URL points to a valid AtmosphericX widget to getting a 404. Each critical update of AtmosphericX will have updated documentation for that specific version. Please ensure no changes have been made to the said widget.

### Something is wrong with the sizing?
If you're experiencing sizing issues with widgets in your streaming software, ensure that the native width and height is `1920x1080` for each widget. If that fails, gradually increase the width of the widget to give it a bigger space to work with.

### Getting mobile device detected button?
AtmosphericX will automatically detect window size (If width is below `1270`) and determine if you are on a mobile device and apply a silent radio channel to avoid audio context suspension. However, if you are facing this with a widget in OBS. Please make sure to increase the `height` and `width` of the source to prevent this.

## OBS Studio Plugins
Plugins make widget handling within OBS Studio easier and actually decrease resource consumption considerably. Below are a list of widgets recommended for installation before fully creating your theme.

- **Source Code Plugin** (Recommended)
> The [Source Clone](https://obsproject.com/forum/resources/source-clone.1632/) plugin allows you to clone sources to allow different filters than the original.
By default, this will be used in majority of themes to decrease memory consumption while maintaining full widget functionality.
- **Composite Blur Plugin** (Enhancement)
> The [Composite Blur](https://obsproject.com/forum/resources/composite-blur.1780/) Plugin is a comprehensive blur plugin that provides blur algorithms and types for all levels of quality and computational need.


::: tip Backup Your Widget Settings
Before changing parameters or URLs, save a copy of your widget settings. This helps restore previous layouts if something breaks.
:::