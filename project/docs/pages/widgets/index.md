---
layout: doc
next: 
    text: 'String Widget'
    link: /pages/widgets/strings
prev:
    text: 'Configure Display'
    link: /pages/configurations/display
---

<img  src="/logo.png" alt="AtmosphericX Logo" width="200" style="display: block; margin-left: auto; margin-right: auto;" />
<small class="page-author">Written By: KiyoWx</small><br/>
<small class="last-updated">Last Updated: Jan 23rd, 2026</small>

## Introduction
AtmosphericX offers a variety of widgets that can be used to spice up your stream, display, or application with weather data. Widgets are modular components that can be easily added, removed, and customized to fit your specific needs. This guide provides an overview of the available widgets, their functionalities, and instructions on how to configure and use them effectively.


## Available Widgets
| Widget Name | Description |
| --- | --- |
| String Widget | Displays dynamic weather data as customizable text strings. This is the most versatile widget and can be used to show current conditions, forecasts, alerts, and more. |
| Event Widget | Event notification system that displays weather alerts, warnings, and significant weather events in a visually appealing format. |
| Slideshow Widget | A rotating display of images. This is by default used to loop through SPC (Storm Prediction Center) outlooks but can be customized to show any images you like. |
| Color Palette Widget | A visual representation of active alerts by color coding. This widget provides a quick overview of the current alert status in a simple and intuitive format. |

## Configuring Widget Options
Each widget comes with its own set of configuration options that allow you to tailor its appearance and behavior to your preferences. Configurations are done through the URL as query parameters. Below are the common configuration options available for most widgets:

```sh
/widgets/strings?type=mesonet&directory=properties.humidity&suffix=F&disable_dropshadow=false
```
<small>Example URL for String Widget with configuration parameters. This will display humidity from mesonet data with an "F" suffix and dropshadow enabled and directed to the properties.humidity field.</small>

