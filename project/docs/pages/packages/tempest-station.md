---
layout: doc
---

<img src="/logo.png" alt="AtmosphericX Logo" width="200" style="display: block; margin: 0 auto;" />
<small class="page-author">Written By: <b>KiyoWx</b></small><br/>
<small class="last-updated">Last Updated: <b>Mar 28th, 2026</b></small><br><br><br>

# Tempest Station Wrapper
> Formally atmosx-tempest-station
---
This repository provides a robust solution for interacting with the Tempest Weather Station. It enables seamless data retrieval using the device ID, including identifying the nearest station ID. With this project, you can access a wide range of weather related data such as temperature, humidity, pressure, wind gusts, and more.

## Installation (NPM)
```bash
npm install @atmosx/tempest-station-wrapper
```

## Example Usage
```js
const { TempestStation } = require(`@atmosx/tempest-station-wrapper`); // CJS
import { TempestStation } from `@atmosx/tempest-station-wrapper`; // ESM

const tempest = new TempestStation({
    api: "api_key_here",
    deviceId: 0,
    stationId: 0,
    journal: true,
})
```


## Events and Listeners

### Event `onForecast`
Emitted when forecast data is received. The event provides an object containing weather forecast features.
```js
tempest.on(`onForecast`, (data) => {
    console.log(data);
});
```

### Event `onObservation`
Emitted when observation data is received. The event provides an object containing current weather observation features.
```js
tempest.on(`onObservation`, (data) => {
    console.log(data);
});
```

### Event `onRapidWind`
Emitted when rapid wind data is received. The event provides an object containing rapid wind features.
```js
tempest.on(`onRapidWind`, (data) => {
    console.log(data);
});
```

### Event `onLightning`
Emitted when lightning event data is received. The event provides an object containing lightning features.
```js
tempest.on(`onLightning`, (data) => {
    console.log(data);
});
```


## Callbacks and Functions

### Function `getForecast()`
Fetches the weather forecast data from the Tempest Weather Station API.
```js
const forecastData = await tempest.getForecast();
console.log(forecastData);
```

### Function `getClosestStation({ latitude, longitude })`
Fetches the closest Tempest Weather Station based on provided latitude and longitude.
```js
const closestStation = await tempest.getClosestStation({ latitude: 37.7749, longitude: -122.4194 });
console.log(closestStation);
```

### Function `setSettings({})`
Updates the TempestStation instance settings with new API key, device ID, and station ID.
```js
tempest.setSettings({ api: "new_api_key", deviceId: 12345, stationId: 67890 });
```

### Function `stop()`
Stops the WebSocket connection to the Tempest Weather Station API.
```js
tempest.stop();
```


## References
[Tempest Weather Station](https://shop.tempest.earth/products/tempest) |
[Documentation](https://atmosphericx.scriptkitty.cafe/documentation) |
[Discord Server](https://atmosphericx-discord.scriptkitty.cafe) |
[Project Board](https://github.com/users/AtmosphericX/projects/2) |\
[Code of Conduct](/CODE_OF_CONDUCT.md) |
[Contributing](/CONTRIBUTING.md) |
[License](/LICENSE) | 
[Security](/SECURITY.md) | 
[Changelogs](/CHANGELOGS.md) |

## Acknowledgements
- [k3yomi](https://github.com/k3yomi)
    - Lead developer @ AtmosphericX and maintainer of this module.
- [StarflightWx](https://x.com/starflightVR)
    - For testing and providing feedback (Co-Developer and Spotter @ AtmosphericX)