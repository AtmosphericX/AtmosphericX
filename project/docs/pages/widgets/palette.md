---
layout: doc
next: 
    text: 'Polywarn Widget'
    link: /pages/widgets/polywarn
prev:
    text: 'Alert Widget'
    link: /pages/widgets/alerts
---

<img src="/logo.png" alt="AtmosphericX Logo" width="200" style="display: block; margin: 0 auto;" />
<small class="page-author">Written By: <b>KiyoWx</b></small><br/>
<small class="last-updated">Last Updated: <b>Mar 5th, 2026</b></small><br><br><br>


# Palette Widget
---
The `palette` widget dynamically adjusts a block's color theme based on event priority. It reacts to weather (Wx) events, PulsePoint events, and custom triggers defined in the `themes` section of your `events.jsonc` configuration. Each theme specifies a `primary (RGB)` and `secondary (RGB)` color scheme, allowing you to create clear visual distinctions between event levels. You can access the widget at `/widgets/palette`, or further customize its behavior using URL parameters as demonstrated below. 

Please keep in mind that the `palette` widget should be **rarely** used as the `strings` widget can cover most if not all of the theme backgrounds with the `setElementThemed` parameter.

::: tip Theme Priority
Theme priority works by having the top most event (`top most`) take precedence over subsequent events.
:::

::: info Parameter Rules

- `?` is used when starting a query string in a URL.
- `&` is used to append additional parameters to an existing query string.
- `true` or `false` should be supplied depending on whether the parameter expects a boolean value.

Always follow the expected type and position of the parameter when constructing the widget settings.

Example URL: `/widgets/example?setWidgetParameter1=value1&setWidgetParameter2=value2`
:::


## Global Parameters
All `global` parameters are supported. Visit [Global Parameters](./index#global-parameters) to see a full list of all the global parameters. However `setElementThemed` is forced to `true`.

## Local Parameters
There are currently **NO** local parameters for this widget.


## Examples

::: details Example 1
- Prompt: Make a `rounded box with about 125px of roundness` that has a `smooth color changing animation` and `animates for 3.5 seonds`.
```
/widgets/palette?setBorderRadius=125&setBackgroundAnimated=true&setAnimationStartDuration=3.5
```
:::

::: details Example 2
- Prompt: Make a `palette` widget that uses the `secondary` color in the theme.
```
/widgets/palette?setThemeType=secondary
```
