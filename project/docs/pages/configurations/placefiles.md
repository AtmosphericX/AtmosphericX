---
layout: doc
next: 
    text: 'Widgets Introduction'
    link: /pages/widgets/index
prev:
    text: 'Display.jsonc'
    link: /pages/configurations/display
---

<img src="/logo.png" alt="AtmosphericX Logo" width="200" style="display: block; margin: 0 auto;" />
<small class="page-author">Written By: <b>KiyoWx</b> & <b>StarflightWx</b></small><br/>
<small class="last-updated">Last Updated: <b>Mar 9th, 2026</b></small><br><br><br>

# Placefile Configurations
---
The `placefiles.jsonc` configuration file defines how AtmosphericX generates, caches, and distributes dynamic **GRLevelX compatible placefile layers** for radar and mapping software. This includes:

- The `placefile_settings` section controls a **global cache duration**, which determines how long placefiles are stored before being regenerated, balancing **performance** with **near real-time accuracy**.  
- Each data layer including **events, tracking, discussions, live streams, and PulsePoint**. This can be individually enabled or disabled, allowing you to control which endpoints are publicly exposed.  
- Every layer also includes optional **geographic filtering settings**, which can restrict output by radius using configurable units (miles or kilometers), ensuring that only data within a defined distance is included in the generated placefile.


## Configuration Map
```
placefiles.jsonc
├── placefiles:hash
└── placefile_settings
    ├── cache_duration
    ├── events
    │   ├── enabled
    │   └── filters
    │       ├── enabled
    │       ├── filter_units
    │       └── filter_by_radius
    │
    ├── tracking
    │   ├── enabled
    │   └── filters
    │       ├── enabled
    │       ├── filter_units
    │       └── filter_by_radius
    │
    ├── discussions
    │   ├── enabled
    │   └── filters
    │       ├── enabled
    │       ├── filter_units
    │       └── filter_by_radius
    │
    ├── streams
    │   ├── enabled
    │   └── filters
    │       ├── enabled
    │       ├── filter_units
    │       └── filter_by_radius
    │
    └── pulsepoint
        ├── enabled
        └── filters
            ├── enabled
            ├── filter_units
            └── filter_by_radius
```
