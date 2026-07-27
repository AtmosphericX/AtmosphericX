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
	const reports = storage.reports?.features;
    const priority = utils.getEventColor(null, true);
    const elements = cd()

	elements.grid.innerHTML = '';

	for (const report of reports) {
		const properties = report.properties;
		CardsRenderer.CreateCard({
			parent: elements.grid,
			title: report?.properties?.event ?? `Unknown Event`,
			data: [
				{ key: "Reporter", value: report.properties.reporter },
				{ key: "Sender", value: report.properties.sender },
				{ key: "Time", value: new Date(report.properties.time).toLocaleString() }
			],
			onClick: () => {
                PromptsRenderer.CreatePrompt({
                    title: report?.properties?.event ?? `Unknown Report`,
					message: `${report?.properties?.notes?.replace(/<br\s*\/?>/gi, '\n') ?? `Unknown Report`}`,
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
