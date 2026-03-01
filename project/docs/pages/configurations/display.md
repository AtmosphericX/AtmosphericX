---
layout: doc
next: 
    text: 'Placefiles.jsonc'
    link: /pages/configurations/placefiles
prev:
    text: 'Events.jsonc'
    link: /pages/configurations/events
---

<img src="/logo.png" alt="AtmosphericX Logo" width="200" style="display: block; margin: 0 auto;" />
<small class="page-author">Written By: <b>KiyoWx</b> & <b>StarflightWx</b></small><br/>
<small class="last-updated">Last Updated: <b>Feb 27th, 2026</b></small><br>
<small class="version-made">Version: <b>8.0.0.02 (beta-pre-dashboard-testing)</b></small><br><br>

# Display Configurations
---
The `display.jsonc` file controls the **layout, positioning, and behavior** of the AtmosphericX terminal interface.  

Key functions include:

- **Fancy Interface Mode:** Toggle the optional enhanced UI experience.  
- **UI Components:** Configure individual windows such as the intro screen, logging window, system info panel, active sessions panel, and events window.  
- **Layout Properties:** Each window supports settings for width, height, top/left positioning, and shrink-to-fit behavior.  
- **Styling:** Customize text labels, borders, scroll behavior, wrapping, tags, and colors.  

Editing this file allows you to fully personalize the terminal interface.


::: danger Fancy Interface Mode
Please keep in mind that only a limited amount of terminals support this feature. If you face this issue, please set the fancy interface mode to `false`.
:::


## Configuration Map
```
display.jsonc
├── display:hash
└── display_settings
    ├── fancy_interface
    ├── intro_screen
    │   ├── width
    │   ├── height
    │   ├── top
    │   ├── left
    │   ├── tags
    │   ├── style
    │   │   ├── align
    │   │   └── fg
    │   ├── valign
    │   └── align
    │
    ├── logging_window
    │   ├── top
    │   ├── left
    │   ├── width
    │   ├── height
    │   ├── tags
    │   ├── wrap
    │   ├── border
    │   │   └── type
    │   ├── style
    │   │   └── border
    │   │       └── fg
    │   ├── scrollable
    │   └── alwaysScroll
    │
    ├── system_info_window
    │   ├── top
    │   ├── left
    │   ├── width
    │   ├── height
    │   ├── label
    │   ├── tags
    │   ├── wrap
    │   ├── border
    │   │   └── type
    │   ├── scrollable
    │   ├── alwaysScroll
    │   └── style
    │       └── border
    │           └── fg
    │
    ├── sessions_window
    │   ├── top
    │   ├── left
    │   ├── width
    │   ├── height
    │   ├── label
    │   ├── tags
    │   ├── wrap
    │   ├── border
    │   │   └── type
    │   ├── scrollable
    │   ├── alwaysScroll
    │   └── style
    │       └── border
    │           └── fg
    │
    └── events_window
        ├── top
        ├── left
        ├── width
        ├── height
        ├── label
        ├── tags
        ├── wrap
        ├── border
        │   └── type
        ├── scrollable
        ├── alwaysScroll
        └── style
            └── border
                └── fg
```
