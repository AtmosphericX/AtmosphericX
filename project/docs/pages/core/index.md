---
layout: doc
next: 
    text: 'Source Configurations'
    link: /pages/sources/index
prev:
    text: 'Configurations Introduction'
    link: /pages/installation/configurations
---

<img src="/logo.png" alt="AtmosphericX Logo" width="200" style="display: block; margin: 0 auto;" />
<small class="page-author">Written By: <b>KiyoWx</b></small><br/>
<small class="last-updated">Last Updated: <b>Mar 23rd, 2026</b></small><br><br><br>

# Core Configurations
---
The `core.jsonc` file is the **central configuration file** for AtmosphericX. It controls the behavior of your entire instance. This includes:

- **Web Hosting:** login requirements, HTTPS, ports, cache control, rate limiting, and account protection.  
- **WebSocket Management:** connection limits, priority handling, and secondary sockets.  
- **Automation & Scheduling:** version checks, request timeouts, and scheduled updates.  
- **Integrations:** Discord webhooks and StreamerBot connectivity.  
- **Dashboard Experience:** forecasting sources, third party services, slideshow graphics, radar intensity labels, and color scales.

Editing this file allows you to customize the functionality and appearance of your AtmosphericX instance to suit your needs.


## Configuration Map
```
core.jsonc
├── core:hash
├── web_hosting_settings
│   ├── documentation_mode
│   ├── is_login_required
│   ├── is_guest_access_allowed
│   └── settings
│       ├── is_https
│       ├── port_number
│       ├── account_protection
│       ├── ratelimiting
│       └── certification_paths
├── internal_settings
├── websocket_settings
│   ├── maximum_connections_per_ip
│   ├── priority_sockets
│   └── secondary_sockets
├── webhook_settings
│   ├── general_events
│   ├── critical_events
│   └── misc_events
├── streamer_bot_settings
├── forecasting
├── services
├── slideshow
├── dbz_intensity
└── color_intensity
└── dynamic_widgetss
```
