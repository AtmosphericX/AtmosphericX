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
    const discussions = storage.discussions?.features;
    const priority = utils.getEventColor(null, true);
    const elements = cd()

    elements.grid.innerHTML = '';

    for (const discussion of discussions) {
        const properties = discussion.properties;
        CardsRenderer.CreateCard({
            parent: elements.grid,
            title: `${discussion?.properties?.outlook ?? `Unknown Discussion`} (#${discussion?.properties?.mesoscale_id ?? '0'})`,
            data: [
                { key: "Issued", value: new Date(discussion.properties.issued).toLocaleString() },
                { key: "Expires", value: new Date(discussion.properties.expires).toLocaleString() },
                { key: "Locations", value: discussion.properties.locations },
                { key: "Population", value: discussion.properties.population },
                { key: "Homes", value: discussion.properties.homes },
                { key: "Tornado Probability", value: discussion.properties.parameters?.tornado_probability ?? `No Tornado Probability` },
                { key: "Wind Probability", value: discussion.properties.parameters?.wind_probability ?? `No Wind Probability` },
                { key: "Hail Probability", value: discussion.properties.parameters?.hail_probability ?? `No Hail Probability` },
            ],
            onClick: () => {
                PromptsRenderer.CreatePrompt({
                    title: `${discussion?.properties?.outlook ?? `Unknown Discussion`} (#${discussion?.properties?.mesoscale_id ?? '0'})`,
                    message: `${discussion?.properties?.description?.replace(/<br\s*\/?>/gi, '\n') ?? `Unknown Discussion`}`,
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
