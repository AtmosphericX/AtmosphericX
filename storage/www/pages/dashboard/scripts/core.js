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

class Core { 
    constructor() {
        this.name_space = `dashboard.core`
        this.latestHash = null;
        this.insideHashes = [];
        utils.log(`${this.name_space} initialized.`);
        utils.socket([`*`]).then( () => {
            utils.getMobileDevice().then(async () => {
                await import(`/dashboard/scripts/nav.js`).then(m => m.init?.());
                await import(`/dashboard/scripts/prompts.js`).then(m => m.init?.());
                this.eventListener();
            });
        });
    }

    eventListener() { 
        document.addEventListener('onUpdate', (event) => {
            const getSfx = window.localStorage.getItem("dashboard.events.sfx") === "true";
            const getNotifications = window.localStorage.getItem("dashboard.events.notifications") === "true";
            const getPrompted = window.localStorage.getItem("dashboard.cached") === "true"
            
            if (getNotifications && getPrompted) {
                const getFeatures = [
                    ...Object.values(utils?.storage?.events?.features || {}),
                    ...Object.values(utils?.storage?.manual?.features || {}),
                ].sort((b, a) => new Date(a?.properties?.issued) - new Date(b?.properties?.issued));

                const getLatestEvent = getFeatures?.[0] ?? null
                const getLatestEventHash = getLatestEvent?.properties?.hash ?? JSON.stringify(getLatestEvent)

                if ((this.latestHash != getLatestEventHash && getLatestEvent != null)) {
                    this.latestHash = getLatestEventHash;

                    const gTRI = utils.getTimeRelative(new Date(getLatestEvent?.properties?.issued))
                    const gTRE = utils.getTimeRelative(new Date(getLatestEvent?.properties?.expires))
                    const historyEntries = Array.isArray(getLatestEvent?.properties?.details?.history) ? [...getLatestEvent.properties.details.history].sort((left, right) => new Date(right?.time) - new Date(left?.time)) : [];
                    const historyMessages = historyEntries.length ? historyEntries.map((entry) => {
                        const entryTime = entry?.time ? new Date(entry.time).toLocaleString() : `--`;
                        const entryAction = entry?.action ?? `Update`;
                        return {
                            title: `${entryAction} @ ${entryTime}`,
                            message: entry?.description ?? `--`,
                        };
                    }) : [{ title: "Description", message: getLatestEvent?.properties?.description ?? `--` }];
                    const metadata = [
                        `Issued: ${new Date(getLatestEvent?.properties?.issued).toLocaleString() ?? `--`} (${gTRI ?? `--`})`,
                        `Expires: ${new Date(getLatestEvent?.properties?.expires).toLocaleString() ?? `--`} (${gTRE ?? `--`})`,
                        `Hail: ${getLatestEvent?.properties?.parameters?.max_hail_size ?? `--`}`,
                        `Wind: ${getLatestEvent?.properties?.parameters?.max_wind_gust ?? `--`}`,
                        `Tornado: ${getLatestEvent?.properties?.parameters?.tornado_detection ?? `--`}`,
                        `Damage: ${getLatestEvent?.properties?.parameters?.damage_threat ?? `--`}`,
                        `Flood: ${getLatestEvent?.properties?.parameters?.flood_detection ?? `--`}`,
                        `Locations: ${getLatestEvent?.properties?.locations ?? `--`}`,
                        `Distance: ${getLatestEvent?.properties?.distance ?? `--`} ${getLatestEvent?.properties?.distance_unit ?? ``}`.trim(),
                    ];

                    handler.eventQueue?.push({
                        type: 'event',
                        hash: getLatestEventHash,
                        issued: new Date(getLatestEvent?.properties?.issued),
                        expires: new Date(getLatestEvent?.properties?.expires),
                        feature: getLatestEvent,
                        queued: false
                    });
                    utils.sound(`/sfx/eas_sfx/uniden-eas.mp3`);
                    handler.hSyncQueue({setPlayback: getSfx})
                    PromptsRenderer.CreatePrompt({
                        title: `${getLatestEvent?.properties?.event} - ${getLatestEvent?.properties?.action_type}`,
                        buttons: [
                             { 
                                text: "Play Event (TTS)",
                                className: "bg-info",
                                onClick: () => {
                                    utils.stopsounds();
                                    utils.tts(`Information regarding ${getLatestEvent?.properties?.event ?? `--`}: ${getLatestEvent?.properties?.description ?? `--`}`);
                                    PromptsRenderer.ClosePrompts();
                                }
                            },
                            { 
                                text: "Copy Description",
                                className: "bg-info", 
                                onClick: () => {
                                    try {
                                        navigator.clipboard.writeText(getLatestEvent?.properties?.description ?? `--`);
                                        utils.notify({
                                            type: 'success',
                                            title: `Clipboard`,
                                            message: `Latest description copied to clipboard.`,
                                            duration: 5000
                                        });
                                    } catch (error) {
                                        utils.notify({
                                            type: 'error',
                                            title: `Clipboard`,
                                            message: `Failed to copy description to clipboard.`,
                                            duration: 5000
                                        });
                                    }
                                }
                            }
                        ],
                        message: [
                            { message: metadata.join("\n"), title: "Information" },
                            ...historyMessages,
                        ]
                    })
                    utils.notify({
                        type: 'error',
                        title: `${getLatestEvent?.properties?.event} - ${getLatestEvent?.properties?.action_type}`,
                        message: metadata.join('\\n'),
                        duration: 30000
                    });
                }
            }
        })
    }
}

new Core();