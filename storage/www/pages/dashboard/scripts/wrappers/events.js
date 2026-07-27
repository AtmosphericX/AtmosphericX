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
    const events = storage.events?.features.sort((a, b) => new Date(b.properties.issued) - new Date(a.properties.issued));
    const priority = utils.getEventColor(null, true);
    const elements = cd()

    elements.grid.innerHTML = '';

    for (const event of events) {
        const properties = event.properties;


        CardsRenderer.CreateCard({
            span: 4,
            parent: elements.grid,
            title: `${event?.properties?.event ?? `Unknown Event`} (${event?.properties?.action_type ?? '---'})`,
            data: [
                { key: "Event", value: event.properties.event },
                { key: "Locations", value: event.properties.locations },
                { key: "Issued", value: new Date(event.properties.issued).toLocaleString() },
                { key: "Expires", value: new Date(event.properties.expires).toLocaleString() },
                { key: "Sender Name", value: event.properties.sender_name },
                { key: "Sender ICAO", value: event.properties.sender_icao },
                { key: "WMO", value: event.properties.parameters?.wmo },
                { key: "Source", value: event.properties.parameters?.source },
                { key: "Max Hail Size", value: event.properties.parameters?.max_hail_size },
                { key: "Max Wind Gust", value: event.properties.parameters?.max_wind_gust },
                { key: "Damage Threat", value: event.properties.parameters?.damage_threat },
                { key: "Tornado Detection", value: event.properties.parameters?.tornado_detection },
                { key: "Flood Detection", value: event.properties.parameters?.flood_detection },
                { key: "Tornado Intensity", value: event.properties.parameters?.discussion_tornado_intensity },
                { key: "Wind Intensity", value: event.properties.parameters?.discussion_wind_intensity },
                { key: "Hail Intensity", value: event.properties.parameters?.discussion_hail_intensity },
                { key: "Tracking ID", value: event.properties.details?.tracking },
            ],
            onClick: () => {
                PromptsRenderer.CreatePrompt({
                    title:  `${event?.properties?.event ?? `Unknown Event`} (${event?.properties?.action_type ?? '---'})`,
                    message: `${event?.properties?.description?.replace(/<br\s*\/?>/gi, '\n') ?? `Unknown Discussion`}`,
                    submitText: "Continue",
                    onSubmit: () => {}
                })
            }
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
