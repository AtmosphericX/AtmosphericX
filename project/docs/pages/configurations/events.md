---
layout: doc
next: 
    text: 'Display.jsonc'
    link: /pages/configurations/display
prev:
    text: 'Sources.jsonc'
    link: /pages/configurations/sources
---

<img src="/logo.png" alt="AtmosphericX Logo" width="200" style="display: block; margin: 0 auto;" />
<small class="page-author">Written By: <b>KiyoWx</b> & <b>StarflightWx</b></small><br/>
<small class="last-updated">Last Updated: <b>Feb 27th, 2026</b></small><br>
<small class="version-made">Version: <b>8.0.0.02 (beta-pre-dashboard-testing)</b></small><br><br>

# Events Configurations
---
The `events.jsonc` file defines how AtmosphericX handles **weather and emergency alerts**.  

Key functions include:

- **Filtering Alerts:** Determine which alerts are monitored, prioritized, ignored, or restricted by ICAO code, UGC, state, or distance based geolocation.  
- **Event Sounds & TTS:** Assign sound effects (issued, update, cancellation) and optional TTS formatting for dynamic audio notifications.  
- **Metadata Flags:** Control event behavior dynamically, such as sirens, wails, urgent tones, and device-specific alerts.  
- **Themes:** Define primary and secondary RGB colors for each event category to maintain a consistent visual style in the interface.

## Configuration Map
```
events.jsonc
├── events:hash
├── filters
│   ├── listening_events
│   ├── priority_events
│   ├── all_events
│   ├── show_cancels
│   ├── sfx_beep_only
│   ├── show_updates
│   ├── ignore_tests
│   ├── ignored_events
│   ├── listening_icao
│   ├── ignored_icao
│   ├── listening_ugcs
│   ├── listening_states
│   ├── eas_settings
│   │   ├── eas_directory
│   │   ├── eas_intro
│   │   └── festival_voice
│   └── location_settings
│       ├── enabled
│       ├── unit
│       └── max_distance
│
├── tones
│   ├── sfx_beep
│   ├── sfx_siren
│   ├── sfx_iphone
│   ├── sfx_wail
│   ├── sfx_urgent
│   └── sfx_uniden
│
├── dictionary
│   ├── Event Name
│       ├── sfx_issued
│       ├── sfx_update
│       ├── sfx_cancel
│       ├── sfx_tts
│       ├── sfx_tts_format
│       └── metadata
│           ├── siren
│           ├── wail
│           ├── urgent
│           ├── iphone
│           └── uniden
│
└── themes
    └── Event Name
        ├── primary (RGB)
        └── secondary (RGB)
```
