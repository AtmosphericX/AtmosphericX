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
        welcome: document.getElementById(`welcome-title`),
        warnings: document.getElementById(`total-warnings`),
        watches: document.getElementById(`total-watches`),
        statements: document.getElementById(`total-statements`),
        advisories: document.getElementById(`total-advisories`),
        priorityEvent: document.getElementById(`highest-priority-event`),
        location: document.getElementById(`current-location`),
        node: document.getElementById(`current-tracking-node`),
        conditions: document.getElementById(`current-conditions`),
        windSpeed: document.getElementById(`current-wind-speed`),
        temperature: document.getElementById(`current-temperature`),
        dewpoint: document.getElementById(`current-dew-point`),
        humidity: document.getElementById(`current-humidity`)
    }
}

export function cb() {
    const storage = utils?.storage;
    const priority = utils.getEventColor(null, true);
    const elements = cd()
    elements.warnings.innerText = storage?.events?.features?.filter((f) => f?.properties?.event?.includes("Warning"))?.length ?? `0`;
    elements.watches.innerText = storage?.events?.features?.filter((f) => f?.properties?.event?.includes("Watch"))?.length ?? `0`;
    elements.statements.innerText = storage?.events?.features?.filter((f) => f?.properties?.event?.includes("Statement"))?.length ?? `0`;
    elements.advisories.innerText = storage?.events?.features?.filter((f) => f?.properties?.event?.includes("Advisory"))?.length ?? `0`;
    elements.priorityEvent.innerText = priority.event; elements.priorityEvent.style.color = priority.primary;
    elements.location.innerText = `${storage?.tracking?.features?.[0]?.properties?.county ?? `---`}, ${storage?.tracking?.features?.[0]?.properties?.state ?? `---`}`;
    elements.node.innerText = `Node: ${storage?.tracking?.features?.[0]?.properties?.name ?? `---`}`;
    elements.conditions.innerText = storage?.mesonet?.features?.[0]?.properties?.conditions ?? `---`;
    elements.windSpeed.innerText = `${storage?.mesonet?.features?.[0]?.properties?.wind_speed ?? `---`} (${storage?.mesonet?.features?.[0]?.properties?.wind_direction ?? `---`})`;
    elements.temperature.innerText = storage?.mesonet?.features?.[0]?.properties?.temperature ?? `---`;
    elements.dewpoint.innerText = storage?.mesonet?.features?.[0]?.properties?.dewpoint ?? `---`;
    elements.humidity.innerText = storage?.mesonet?.features?.[0]?.properties?.humidity ?? `---`;
}

export function init() {
    const storage = utils?.storage;
    const getUsername = window.localStorage.getItem("dashboard.username");
    const sessionPrompt = window.localStorage.getItem("dashboard.cached");
    const elements = cd()
    elements.welcome.innerText = `Welcome to AtmosphericX, ${getUsername ?? `Guest`}!`;
    if (!sessionPrompt) {
        PromptsRenderer.CreatePrompt({
            title: `AtmosphericX Dashboard Notice`,
            message: `The dashboard is currently under development. Not all features may be available at this time.`,
            onSubmit: () => {
                window.localStorage.setItem("dashboard.events.sfx", true)
                window.localStorage.setItem("dashboard.events.notifications", true)
                PromptsRenderer.CreatePrompt({
                    title: `Welcome to AtmosphericX v${storage?.version}`,
                    message: `Hello ${getUsername}, thank you for using AtmosphericX! Your feedback and ideas help make this project better with every update. If you’d like to support our work, donations are greatly appreciated and go directly toward streaming, hardware, and software costs that power our storm chasing and future high-quality live streams. If you are not able to donate, feel free to provide feedback and share the project with others!`,        
                    submitText: "Continue",
                    checkboxes: [
                        { label: "Toggle Event Alerts", checked: true, onChange: (v) => {window.localStorage.setItem("dashboard.events.sfx", v)} },
                        { label: "Toggle Event Notifications", checked: true, onChange: (v) => {window.localStorage.setItem("dashboard.events.notifications", v)} }
                    ],
                    buttons: [
                        { text: "Documentation", className: "bg-info", onClick: () => {window.open("/documentation", "_blank");}},
                        { text: "Discord", className: "bg-info", onClick: () => {window.open("https://atmosphericx-discord.scriptkitty.cafe", "_blank");}},
                        { text: "Donate", className: "bg-info", onClick: () => {window.open("https://ko-fi.com/k3yomi", "_blank");}},
                    ],
                    onSubmit: () => {
                        window.localStorage.setItem("dashboard.cached", true);
                    }
                });
            }
        })
    }
    document.addEventListener('onUpdate', (event) => { cb(); });
    cb();
}
