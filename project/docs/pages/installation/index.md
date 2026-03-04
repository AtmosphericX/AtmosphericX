---
layout: doc
next: 
    text: 'Installation'
    link: /pages/installation/installation
prev:
    text: 'Home'
    link: /
---

<img src="/logo.png" alt="AtmosphericX Logo" width="200" style="display: block; margin: 0 auto;" />
<small class="page-author">Written By: <b>KiyoWx</b> & <b>StarflightWx</b></small><br/>
<small class="last-updated">Last Updated: <b>Feb 27th, 2026</b></small><br>
<small class="version-made">Version: <b>8.0.0.028 (beta-pre-dashboard-testing)</b></small><br><br><br>

# AtmosphericX Introduction
---

AtmosphericX is a modern, modular, and powerful weather dashboard and widget project designed to be self hosted for live streaming, storm spotting, storm chasing, meteorologists, first responders, or curious individuals who are concerned about weather conditions and safety.

## Supported Features
- [NOAA Weather Wire Service Open-Interface](https://www.weather.gov/nwws/) (Parser)
- [National Weather Service API](https://www.weather.gov/documentation/services-web-api) (Parser)
    - Supports all VTEC, HVTEC, UGC, Offshore, and Plain Text Events
- [SpotterNetwork](https://www.spotternetwork.org/) or [RealtimeIRL](https://rtirl.com/) GPS Tracking
- [PulsePoint (Respond)](https://web.pulsepoint.org) Event Manager
- Local Storm Reports (SpotterNetwork or [GibsonRidge](https://grlevelx.com/))
- Mesoscale Discussions ([WeatherWise](https://weatherwise.app))
- Tropical Discussions / Events ([WeatherWise](https://weatherwise.app))
- ProbSevere Version 3 ([CIMSS](https://cimss.ssec.wisc.edu/))
- ProbTornado Version 3 ([CIMSS](https://cimss.ssec.wisc.edu/))
- ProjectWxEye Sonde (Credits: [Vince Waelti](https://www.youtube.com/channel/UCqSk-ojoH2rgAuYadPLJgJA))
- Nexrad Locations
- NOAA Weather Radio (Built-in) ([WeatherUSA](https://api.weatherusa.net))
- Power Outage Statistics (US and US-Territories) ([SDSWeather](https://www.sdsweather.com/))
- Radar Omega Streams (*Not for Broadcast*) ([SDSWeather](https://www.sdsweather.com/))
- Tempest Station Integration ([WeatherFlow-Tempest, Inc.](https://tempest.earth/tempest-home-weather-system/))
- Built-in Placefiles for GibsonRidge Software, [SupercellWx](https://supercellwx.net/), and more!
- Event Customization (Sounds, Themes, Filtering)
- Event Mock EAS Audios
- ~~Dashboard~~ (`SOON`)
- Cache Control and HTTP(S) Security
- Account Protection (argon2, sessions, and lockout)
- RESTful API Ratelimiting
- Cron Scheduling
- Discord Webhook Configurations
- Websocket Configurations and Priority
- Streamer.bot Support
- [WeatherWise](https://weatherwise.app) Localized dBZ intensity
- PolyWarn Tracking and Event Manager
- Fully modular and limitless widget framework

## Documentation Vocab
Throughout the documentation, you may see words that are commonly used. So we've decided to give you a vocab on what they mean for the less technical individuals: 
- Instance: This refers to your self hosted version of AtmosphericX.
- Tunnel: The Cloudflare tunnel name.
- Port: The network protocol AtmosphericX chooses to run on for web access.


## Disclaimer
> AtmosphericX is an independent, open source project and is **not** affiliated with, endorsed by, or sponsored by any government agency, meteorological organization, emergency management service, or official weather provider. This project may reference, parse, or process publicly available weather data, including but **not** limited to services operated by the National Weather Service (NWS) and the National Oceanic and Atmospheric Administration (NOAA). All trademarks, service marks, and data rights remain the property of their respective owners. AtmosphericX is provided "as is", without warranty of any kind, express or implied, including but **not** limited to:
> - Accuracy or completeness of parsed weather data
> - Fitness for a particular purpose
> - Availability or reliability of upstream data sources
> - Protection against service interruptions or data delays
>
> AtmosphericX should **not** be relied upon for life safety decisions, emergency response coordination, aviation, marine navigation, or other critical applications. Always consult official sources for authoritative weather information. By using this software, you acknowledge and agree that the maintainers and contributors are **not** liable for any damages, losses, or consequences resulting from its use.