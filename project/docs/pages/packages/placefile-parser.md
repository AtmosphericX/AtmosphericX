---
layout: doc
---

<img src="/logo.png" alt="AtmosphericX Logo" width="200" style="display: block; margin: 0 auto;" />
<small class="page-author">Written By: <b>KiyoWx</b></small><br/>
<small class="last-updated">Last Updated: <b>Mar 28th, 2026</b></small><br><br><br>

# Placefile Parser
> Formally atmosx-placefile-parser
---
A Placefile is a structured text file used to provide geospatial data for mapping applications, often for weather alerts, storm reports, or points of interest. A Placefile contains instructions for displaying locations on a map, including coordinates, labels, colors, icons, and refresh intervals.

## Installation (NPM)
```bash
npm install @atmosx/placefile-parser
```

## Example Usage
```javascript
const { PlacefileManager } = require('@atmosx/placefile-parser'); // CJS
import { PlacefileManager } from '@atmosx/placefile-parser'; // ESM


const sample = fs.readFileSync("test", "utf-8"); // For testing...

// Parsing a basic placefile
PlacefileManager.parsePlacefile(sample).then((objects) => {
    console.log("Parsed Objects:", objects);
})

// Parsing a table
PlacefileManager.parseTable(sample).then((table) => {
    console.log("Parsed Table:", table);
})


// Parsing GeoJSON
PlacefileManager.parseGeoJSON(sample).then((geojson) => {
    console.log("Parsed GeoJSON:", geojson);
})

// Creating a placefile 
PlacefileManager.createPlacefile({
    refresh: 60,
    threshold: 50,
    title: "Sample Placefile",
    settings: "ShowLabels, ShowIcons",
    type: "Point",
    objects: [
        {
            coordinates: [34.0522, -118.2437],
            label: "Los Angeles",
            color: "255 0 0",
        },
        {
            coordinates: [40.7128, -74.0060],
            label: "New York",
            color: "0 0 255",
        }
    ]
}).then((placefile) => {
    console.log("Generated Placefile:\n", placefile);
});
```

## References
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