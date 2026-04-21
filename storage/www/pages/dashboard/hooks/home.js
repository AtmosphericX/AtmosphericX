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

const elements = { 
    welcome: document.getElementById(`welcome-title`),
    warnings: document.getElementById(`total-warnings`),
    watches: document.getElementById(`total-watches`),
    statements: document.getElementById(`total-statements`),
    advisories: document.getElementById(`total-advisories`)
}

export function cb() {
    const storage = utils?.storage;
    elements.warnings.innerText = storage?.events?.features?.filter((f) => f?.properties?.event?.includes("Warning"))?.length ?? `0`;
    elements.watches.innerText = storage?.events?.features?.filter((f) => f?.properties?.event?.includes("Watch"))?.length ?? `0`;
    elements.statements.innerText = storage?.events?.features?.filter((f) => f?.properties?.event?.includes("Statement"))?.length ?? `0`;
    elements.advisories.innerText = storage?.events?.features?.filter((f) => f?.properties?.event?.includes("Advisory"))?.length ?? `0`;
}

export function init() {
    const storage = utils?.storage;
    const getUsername = window.localStorage.getItem("session_username");
    const sessionPrompt = window.localStorage.getItem("was_prompted");
    elements.welcome.innerText = `Welcome to AtmosphericX, ${getUsername}!`;
    if (!sessionPrompt) {
        window.localStorage.setItem("event_alerts", true)
        window.localStorage.setItem("event_notifications", true)
        window.localStorage.setItem("was_prompted", "true");
        dashboard.createPrompt({
            title: `Welcome to AtmosphericX v${storage?.version}`,
            message: `Hello ${getUsername}, thank you for using AtmosphericX! Your feedback and ideas help make this project better with every update. If you’d like to support our work, donations are greatly appreciated and go directly toward streaming, hardware, and software costs that power our storm chasing and future high-quality live streams. If you are not able to donate, feel free to provide feedback and share the project with others!`,        
            submitText: "Continue",
            checkboxes: [
                { label: "Toggle Event Alerts", checked: true, onChange: (v) => {window.localStorage.setItem("event_alerts", v)} },
                { label: "Toggle Event Notifications", checked: true, onChange: (v) => {window.localStorage.setItem("event_notifications", v)} }
            ],
            buttons: [
                { text: "Documentation", className: "bg-info", onClick: () => {window.open("/documentation", "_blank");}},
                { text: "Discord", className: "bg-info", onClick: () => {window.open("https://atmosphericx-discord.scriptkitty.cafe", "_blank");}},
                { text: "Donate", className: "bg-info", onClick: () => {window.open("https://ko-fi.com/k3yomi", "_blank");}},
            ],
        });
    }
    document.addEventListener('onUpdate', (event) => { cb(); });
    cb();
}
