# Changelogs

## Apr 12th, 2026 - 8.0.0.3

**Features**
- widget(strings): Added `getCIMSS` string widget type to get values from the CIMSS data. This allows users to get highest value from the CIMSS ProbSevere data within a specified radius of a tracking node. The widget can be customized with the `setParameter` parameter to specify which CIMSS parameter to obtain (e.g. tornado, hail, wind, etc.) and the `setRadius` parameter to specify the radius for searching nearby cells.
- frontend(subscriptions.js): Added `CIMSS` subscription topic for real-time updates related to CIMSS data.
- vscode(settings): Force TS version to the node_modules version instead of using default VSCode version.

**Updating**
- frontend(utils.js): Fix and replace `&gt` for animation rendering. 
- widgets(global): Remove `:root` from all widgets as it wasn't needed.
- widgets(global): Added `subscriptions.js` static script to easily get subscription value types.
- widgets(watchdog): Instead of specifying a list for `setWatchdogList` do comma seperated.
- pages(global): Update metadata and formatting for PWA and settings.
- tracking(data): Seperate county, state, and address (road) in the location tracking field.

**Refactoring**
- widgets(global): Redo all widget code (html only).
- placefiles(tracking): Refactor TrackingType properties to replace location with county and state in description formatting

**Fixes**
- configuration(sources): Fix trailing commas (Optional config update)

------------------------------------------------------------------------------------------------------------------------


## Apr 4th, 2026 - 8.0.0.2

**Updating**
- widgets-strings: getNearbyEvents now uses the `getEventPriority` utility function to determine event priority by index (order) in the theme configuration array. This allows for more flexible and dynamic event prioritization based on the configuration rather than relying on hardcoded logic.
- widgets-strings: getNearbyEvents now has "Entered" if within the event polygon instead of showing 0.0 distance.
- middleware: Add `/docs` to routing list

**Documentation**
- index: Replace `kiyowx` with `atmosx_wx`


------------------------------------------------------------------------------------------------------------------------

## Mar 28, 2026 - 8.0.0.1 (release)

** ALPHA RELEASED **

**Updating**
- express-rate-limit: Update to `8.2.2` due to security vulnerabilities in previous versions
- axios: Update to `1.13.5` due to security vulnerabilities in previous versions
- configurations: Hash update
- configurations: Change `beta` -> `main` branch for stable release
- Set packages.json for `atmosx` packages to be first published under the `@atmosx` org for better organization and future scalability.

**Fixes**
- cards: Fix card sorting by issued data (Latest first)

**Documentation**
- README: Updated README with new features and information about the project
- README: Switch Nodei badges and docs sidebar entries to new scoped/wrapper
- CONTRIBUTING: Updated contributing guide with new information about the project and how to contribute
- CODE_OF_CONDUCT: Updated code of conduct with new information about the project and how to contribute
- SECURITY: Updated security policy with new information about the project and how to report security vulnerabilities
- HOME: Set npm link to @atmosx org.

------------------------------------------------------------------------------------------------------------------------

## Mar 27, 2026 - 8.0.0.035 (beta-testing)

**Features**
- node-tracking Ability to disable/enable mesonet information gathering from node-tracking
- cimss: Added threshold settings for CIMSS data
- widgets-global: setTextTimeRelative to use a more human readable format for times (e.g. "5 minutes ago" instead of "2026-01-01 12:00:00")
- getTimeRelative: Added `getTimeRelative` function to calculate relative time differences in a human-readable format for both backend and frontend use

**Updating**
- node-tracking: `pin_by_name` is no longer case sensitive
- node-tracking: Lon/Lat checks are now implemented to prevent tracking spam for stationary nodes
- atmosx-nwws-parser: Parser now fully works in UTC rather than local time
- atmsx.tempest: Removed "OBS" text from the reporting line.
- misc.streaming: Hardcoded the streamer.bot to use `youtube`
- changelogs: Changelogs are now located in `CHANGELOGS.md` for better visibility and accessibility rather than being burried in the storage store.

**Documentation**
- generic: Improved documentation
- css: arranged and colored documentation elements

**Refactoring**
node-tracking: refactored node tracking for better maintainability by adding a string reference `tracking_node_message` 
parsing-utils: Refactored all parsing file names to be more consistent and easier to understand
structure.parse: Refactored `structure.parse` to be more maintainable and easier to understand with a defined `cache_keys` list
generic: Improved type safety in the backend and type issues.

**Bug Fixes**
fix: Mobile device detection using useragent strings instead of device window size for better accuracy

**Testing / Future**
- atmosx-tempest-station: Refactor and redo codebase for maintainability
- atmosx-placefile-parser: Refactor and redo codebase for maintainability


------------------------------------------------------------------------------------------------------------------------


## Mar 13, 2026 - 8.0.0.034 (dashboard-creation-build)

**Features**
- nwws-parser: Tornadic Special Marine Warning
- configurations: Added SPC / Discussions configurable options.
- dashboard: Landing page state handling
- dashboard: Browser history push support for dashboard navigation
- dashboard: Socket onUpdate handler for real-time updates
- dashboard: Helper methods for Dashboard state management
- dev: Include dashboard.js on development page

**Updating**
- nwws-parser: Updated NWWS Parser to `v1.0.3178@beta` (PLEASE DELETE YOUR SHAPEFILES DB TO USE NEW DATABASE STRUCTURE)
- dashboard: Improve dashboard behavior and responsiveness
- css: Improve scrolling behavior and mobile responsiveness
- css: Mobile grid adjustments (single-column spans for widgets)
- css: Header sizing improvements on smaller displays
- scripts: Defer script loading across multiple pages for improved performance

**Removing / Deprecated**
- nwws-parser: Disk cache for NWWS Parsing
- widgets: Unused Wise instantiation from widget examples


------------------------------------------------------------------------------------------------------------------------

## Mar 11, 2026 - 8.0.0.033 (beta-pre-dashboard-testing)

**Features**
- frontend: implement `getEventMetadata` function to centralize event metadata retrieval

**Fixes**
- calculations: distance is now `float(2)`
- configurations: tornado watch (`events.jsonc`) entry
- backend: update property access to use optional chaining for better safety across various modules
- frontend: update filtering logic to handle undefined properties gracefully
- frontend: improve event handling in PulsePoint updates to prevent errors
- parameters: simplify get function logic for parameter retrieval
- middleware: refactor configuration access for web hosting settings

**Refactoring**
- structure: remove client data as that can be grabbed directly from the config endpoint
- utils: rename `isMobileDevice` to `getMobileDevice` for clarity and consistency
- widgets: enhance `applyElementSettings` and `applyGlobalSettings` with error handling
- events: improve null checks and use optional chaining for safer property access

------------------------------------------------------------------------------------------------------------------------

## Mar 9, 2026 - 8.0.0.031/8.0.0.032 (beta-pre-dashboard-testing)

**Features**
- themes: `themes` folder for public themes
- parser: implement `getPolygonMetadata` method to retrieve polygon metadata and enhance event processing
- parser/locations: implement location-based filtering
- parser/expires: implement expiration logic for parsed events
- dashboard: add development route and new dashboard styles

**Updating**
- widget-fetch: replace `widgetFetch.js` filename to `parameters.js`
- parameters: `setValuePath` replaces `setRoute` for clarity
- parsing/probability: update parsing logic to GeoJSON
- atmosx-nwws-parser: v1.0.3176 - set `null` instead of `N/A`  

**Fixes**
- utils: update content handling to use `innerHTML` for dynamic updates
- parsing: update properties to use `null` instead of `'N/A'` for better data consistency
- tracking: add `source` parameter to `setCurrentCoordinates` for better context in logs
- manifest: remove `start_url` from manifest for improved PWA compliance
- widgets: add `cards-test.html` for widget display and functionality
- parsing: update parse function signatures to use `Record` types for better type safety

**Removing / Deprecated**
- global.css: display flex for widget-container
- notifications.css: remove display remaining bar

**Refactoring**
- index: remove promise from `index.ts` as it was not needed
- parameters: refactor code structure for improved readability and maintainability
- general: remove `handlers.js` and integrate event handling into `events.js`

------------------------------------------------------------------------------------------------------------------------

## Mar 6, 2026 - 8.0.0.030 (beta-pre-dashboard-testing)

**Features**
- parser: implement `getPolygonMetadata` method to retrieve polygon metadata and enhance event processing
- parser/locations: implement location-based filtering
- parser/expires: implement expiration logic for parsed events

**Updating**
- widget-fetch: replace `widgetFetch.js` filename to `parameters.js`

**Removing / Deprecated**
- global.css: display flex for widget-container

**Refactoring**
- index: remove promise from `index.ts` as it was not needed

## Past Updates
Past updates can be found in the `/storage/store/changelog` file, which is updated with every repository update. You can see these updates by going to the "Code" tab, then navigating to `storage/store/changelog`. This file is updated with every repository update and contains a detailed changelog of all past updates.