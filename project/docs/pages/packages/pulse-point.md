---
layout: doc
---

<img src="/logo.png" alt="AtmosphericX Logo" width="200" style="display: block; margin: 0 auto;" />
<small class="page-author">Written By: <b>KiyoWx</b></small><br/>
<small class="last-updated">Last Updated: <b>Mar 28th, 2026</b></small><br><br><br>

# PulsePoint Wrapper
> Formally atmosx-pulse-point
---
PulsePoint is a public emergency response system used by fire departments, EMS agencies, and dispatch centers to share live incident information with the public. This module provides a way to poll and decrypt the data provided by PulsePoint. Please keep in mind that this module is unofficial and not endorsed by PulsePoint or its parent organization.


## Installation (NPM)
```bash
npm install @atmosx/pulse-point-wrapper
```

## Example Usage
```js
const { PulsePoint } = require(`@atmosx/pulse-point-wrapper`); // CJS
import { PulsePoint } from `@atmosx/pulse-point-wrapper`; // ESM

const pulse = new PulsePoint({
    key: `YOUR_PASSWORD_KEY_FOR_DECRYPTION`, // Not provided by PulsePoint, you must obtain this key yourself.
    interval: 30, // Polling interval in seconds (default: 60)
    jorunal: true, // Enable journaling for debug messages (default: true)
    filtering: {
        events: ["Mutual Aid", "Structure Fire"], // Leave empty to allow all event types
        agencies: ["FIRE5678", "EMS1234"], // This must be populated, leaving empty will NOT return any data.
    }
})
```

## Decryption Key
By default, PulsePoint encrypts its data using client-side encryption. To decrypt the data, you need to provide a decryption key when initializing the module. This key is not provided by PulsePoint, and you must obtain it yourself. This module is really only to be used by those who already have access to the decryption key so they can integrate PulsePoint data into their own applications.
Please ensure you comply with all relevant laws and regulations regarding the use of this data as I do not take any responsibility for how you use this module or the data it retrieves.


## Events and Listeners

### Event `onIncidentUpdate`
This event listener is triggered whenever there is an update or new event in the incident data. The callback function receives an array of the incident objects and can be used to process or display the data as needed.

```js
pulse.on(`onIncidentUpdate`, (incident) => {
    console.log(incident);
});
```

### Event `onIncidentClosed`
This event listener is triggered when an incident is closed. When received, you should dispose of the incident data to maintain an accurate live view of active events.

```js
pulse.on(`onIncidentClosed`, (incidentID) => {
    console.log(incidentID);
});
```

### Event `Log`
The log listener captures log messages generated during the module's operation. This can be useful for debugging or monitoring the module's activity. This is mostly used when journaling is disabled. Otherwise, log messages will be displayed in the console directly.

```js 
pulse.on(`log`, (message) => {
    console.log(`[Log]: ${message}`);
});
```

## Callbacks and Functions

### Function `getAvailableAgencies()`
This asynchronous function retrieves a list of available agencies from the PulsePoint data source. It returns an array of agency identifiers that can be used for filtering or other purposes.

```js
pulse.getAvailableAgencies().then((agencies) => {
    console.log(agencies);
});
```

### Function `getAvailableEvents()`
This function retrieves a list of available event types from the PulsePoint data source. It returns
an array of event type strings that can be used for filtering or other purposes.

```js
pulse.getAvailableEvents()
```

### Function `setSettings({})`
This function allows you to update the module's settings dynamically. You can change parameters such as the polling interval, journaling preference, and filtering options.

```js
pulse.setSettings({
    interval: 45, // Update polling interval to 45 seconds
    journaling: false, // Disable journaling
    filtering: {
        events: ["Medical Emergency"], // Update event filtering
        agencies: ["FIRE1234"], // Update agency filtering
    }
});
```

### Function `stop()`
This function stops the polling process. It can be used when you want to temporarily halt data retrieval without destroying the module instance.

```js
pulse.stop();
```

## References
[PulsePoint](https://www.pulsepoint.org/) |
[Documentation](https://atmosphericx.scriptkitty.cafe/documentation) |
[Discord Server](https://atmosphericx-discord.scriptkitty.cafe) |
[Project Board](https://github.com/users/AtmosphericX/projects/2) |\
[Code of Conduct](/CODE_OF_CONDUCT.md) |
[Contributing](/CONTRIBUTING.md) |
[License](/LICENSE) | 
[Security](/SECURITY.md) | 
[Changelogs](/CHANGELOGS.md) |

## Acknowledgements
- [CJ Ziegler](https://www.youtube.com/channel/UCx_mcHxMvZ8PBmVTtg6Ddtw)
    - For inspiring me to create this module for storm spotting and night crawling streams.
    - Storm Spotter @ AtmosphericX
- [k3yomi](https://github.com/k3yomi)
    - Lead developer @ AtmosphericX and maintainer of this module.
- [StarflightWx](https://x.com/starflightVR)
    - For testing and providing feedback (Co-Developer and Spotter @ AtmosphericX)