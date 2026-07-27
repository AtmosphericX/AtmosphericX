/*
              _                             _               _     __   __
         /\  | |                           | |             (_)    \ \ / /
        /  \ | |_ _ __ ___   ___  ___ _ __ | |__   ___ _ __ _  ___ \ V / 
       / /\ \| __| '_ ` _ \ / _ \/ __| '_ \| '_ \ / _ \ '__| |/ __| > <  
      / ____ \ |_| | | | | | (_) \__ \ |_) | | | |  __/ |  | | (__ / . \ 
     /_/    \_\__|_| |_| |_|\___/|___/ .__/|_| |_|\___|_|  |_|\___/_/ \_\
                                     | |                            
                                     |_|                                                                                                                

    Created with ♥ by the AtmosphericX Team (KiyoWx, StarflightWx, Everwatch1, & CJ Ziegler)
    Discord: https://atmosphericx-discord.scriptkitty.cafe
    Ko-Fi: https://ko-fi.com/k3yomi
    Documentation: http://localhost/documentation | https://atmosphericx.scriptkitty.cafe/documentation

*/


export function cd() {
    return {
        grid: document.getElementById(`dashboard-grid`),
    }
}

export function cb() {
    const storage = utils?.storage;
	const spotters = storage.spotters?.features;
    const priority = utils.getEventColor(null, true);
    const elements = cd()

	elements.grid.innerHTML = '';

	for (const spotter of spotters) {
		const properties = spotter.properties;
        /*

        "properties": {
            "callsign": null,
            "direction": "N",
            "eleveation": "0",
            "email": "logan.ross2028@gmail.com",
            "name": "Logan  Ross ",
            "frequency": "",
            "ham": "",
            "note": "",
            "phone": "5172829383",
            "twitter": "LoganRoss1077",
            "web": "",
            "reported_at": "2026-07-27T18:58:21.000Z",
            "status": "active"
          }
            */
		CardsRenderer.CreateCard({
			parent: elements.grid,
			title:`${spotter.properties?.name ?? `No name provided`} (${spotter.properties?.status ?? `---`})`,
			data: [
                { key: "Email", value: spotter.properties?.email ?? `No email provided` },
                { key: "Phone", value: spotter.properties?.phone ?? `No phone provided` },
                { key: "Twitter", value: spotter.properties?.twitter ?? `No twitter provided` },
                { key: "Web", value: spotter.properties?.web ?? `No website provided` },
                { key: "Callsign", value: spotter.properties?.callsign ?? `No callsign provided` },
                { key: "Direction", value: spotter.properties?.direction ?? `No direction provided` },
                { key: "Elevation", value: spotter.properties?.elevation ?? `No elevation provided` },
                { key: "Reported At", value: spotter.properties?.reported_at ?? `No report date provided` },
                { key: "Frequency", value: spotter.properties?.frequency ?? `No frequency provided` },
                { key: "HAM", value: spotter.properties?.ham ?? `No HAM provided` },
                { key: "Note", value: spotter.properties?.note ?? `No note provided` },
			],
			onClick: () => {}
		})
	}
}

export function init() {
    const storage = utils?.storage;
    const getUsername = window.localStorage.getItem("dashboard.username");
    const sessionPrompt = window.localStorage.getItem("dashboard.cached");
    const elements = cd()
	
    document.addEventListener('onUpdate', (event) => { cb(); });
    cb();
}
