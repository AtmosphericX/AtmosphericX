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
<small class="page-author">Written By: <b>KiyoWx</b></small><br/>
<small class="last-updated">Last Updated: <b>Mar 9th, 2026</b></small><br>
<small class="version-made">Version: <b>8.0.0.032 (beta-pre-dashboard-testing)</b></small><br><br><br>

# AtmosphericX Introduction
---

AtmosphericX is a modern, modular, and powerful weather dashboard and widget project designed to be self hosted for live streaming, storm spotting, storm chasing, meteorologists, first responders, and weather enthusiasts who want better visibility into current conditions and severe weather events.

## Supported Features
- [NOAA Weather Wire Service Open-Interface](https://www.weather.gov/nwws/) (Parser)
- [National Weather Service API](https://www.weather.gov/documentation/services-web-api) (Parser)
    - Supports all VTEC, HVTEC, UGC, offshore, and plain text products
- [SpotterNetwork](https://www.spotternetwork.org/) or [RealtimeIRL](https://rtirl.com/) GPS Tracking
- [PulsePoint (Respond)](https://web.pulsepoint.org) Wrapper
- Local Storm Reports (SpotterNetwork or [GibsonRidge](https://grlevelx.com/))
- Mesoscale Discussions ([WeatherWise](https://weatherwise.app)) *(Fallbacks Supported)*
- Tropical Discussions / Events ([WeatherWise](https://weatherwise.app)) *(Fallbacks Supported)*
- ProbSevere Version 3 ([CIMSS](https://cimss.ssec.wisc.edu/))
- Rise-26 Sonde (Credits: [Vince Waelti](https://www.youtube.com/channel/UCqSk-ojoH2rgAuYadPLJgJA))
- Nexrad Locations
- NOAA Weather Radio (Community Feeds) ([WeatherUSA](https://api.weatherusa.net))
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
- [WeatherWise](https://weatherwise.app) Localized dBZ intensity *(Fallbacks Supported)*
- Fully modular and limitless widget framework

## Documentation Vocab
Throughout the documentation, you may see words that are commonly used. So we've included a quick vocabulary section to help less technical users understand these terms:
- Instance: This refers to your self hosted version of AtmosphericX.
- Tunnel: The Cloudflare tunnel name.
- Port: The network protocol AtmosphericX chooses to run on for web access.
- Tracking Node: The priority or searched tracker for the `location services` configuration.


## Honorable Mentions
Special thanks to [CJ Ziegler](https://www.youtube.com/@CJZiegler), [James Pettus](https://x.com/PettusWX), [TylerWxCorner](https://x.com/TylersWXcorner), [CarsonGrayWX](https://x.com/CarsonGrayWX), [MesoHunter](https://www.youtube.com/channel/UCCbcwQgGkci3CRffdrCKFbg), [Connor's Climate Corner](https://www.youtube.com/channel/UCLxyjHhUz9MpfntbRMvNpbw), [Chief Meteorologist (WYFF 4) Chris Justus](https://x.com/ChrisWYFF4), and [StarflightWx](https://x.com/starflightVR) for inspiring me to continue this project.  

A special note to **StarflightWx**, your encouragement since **AtmosphericX v4** has given me hope and motivation to keep improving this project, and I couldn’t be happier with the progress since then. See you on the road and on to the next storm. <3


## Disclaimer
> AtmosphericX is an independent, open source project and is **not** affiliated with, endorsed by, or sponsored by any government agency, meteorological organization, emergency management service, or official weather provider. This project may reference, parse, or process publicly available weather data, including but **not** limited to services operated by the National Weather Service (NWS) and the National Oceanic and Atmospheric Administration (NOAA). All trademarks, service marks, and data rights remain the property of their respective owners. AtmosphericX is provided "as is", without warranty of any kind, express or implied, including but **not** limited to:
> - Accuracy or completeness of parsed weather data
> - Fitness for a particular purpose
> - Protection against sources and data retrieval
> - Availability or reliability of upstream data sources
> - Protection against service interruptions or data delays
>
> AtmosphericX should **not** be relied upon for life safety decisions, emergency response coordination, aviation, marine navigation, or other critical applications. Always consult official sources for authoritative weather information. By using this software, you acknowledge and agree that the maintainers and contributors are **not** liable for any damages, losses, or consequences resulting from its use.