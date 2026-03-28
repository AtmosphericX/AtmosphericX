# Changelogs

This file will be updated every repository update along with `/storage/store/changelog`.

## Mar 27, 2026 - 8.0.0.035 (beta-testing)
### Hash: Blue-Dog-Jane-Cat

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