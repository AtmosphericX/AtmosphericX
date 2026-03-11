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

class Events { 
    constructor(utils = null, widgets = null) {
        this.name_space = `webmodule:events`;
        this.utils = utils;
        this.widgets = widgets;
        this.storage = this.utils.storage;
        this.isQueuing = false;
        this.eventQueue = [];
        this.utils.log(`${this.name_space} initialized.`);
    }

    /**
     * @production
     * @error_handling
     * @function hSyncEvents
     * @description
     *      Synchronizes weather events from storage to the internal queue.
     * 
     * @param {Object} settings - Configuration options for syncing events.
     * @param {boolean} settings.setWx - Whether to sync weather events.
     * @param {boolean} settings.setPulsePoint - Whether to sync PulsePoint events.
     * @param {number} settings.setMaxHistory - Retention time in minutes for events.
     * @return {Promise<Array>} - A promise that resolves to the updated queue of events.
     */
    hSyncEvents = async function(settings) { 
        try {
            return new Promise((resolve) => {
                const now = new Date().getTime();
                const events = this.storage?.events?.features ?? {};
                const manual = this.storage?.manual?.features ?? {};
                const pulsepoint = this.storage?.pulsepoint?.features ?? {}
                if (manual.length > 0 && settings?.setWx) {
                    for (let feature of manual) {
                        const getDuplicate = this.eventQueue.findIndex(e => e.hash === JSON.stringify(feature)) !== -1;
                        const getIssued = new Date(feature.properties.issued).getTime();
                        if (!getDuplicate) {
                            this.eventQueue.push({
                                type: `event`, hash: JSON.stringify(feature),
                                issued: new Date().getTime(), expires: getIssued + settings?.setMaxHistory * 60,
                                feature: feature, queued: true
                            })
                        }
                    }
                }
                if (events.length > 0 && settings?.setWx) {
                    for (let feature of events) {
                        const getDuplicate = this.eventQueue.findIndex(e => e.hash === feature.properties.hash) !== -1;
                        const getIssued = new Date(feature.properties.issued).getTime();
                        const getExpires = new Date(feature.properties.expires).getTime();
                        const getIgnored = feature.properties.ignored ?? false;
                        const inRange = (now - getIssued) < settings?.setMaxHistory * 1000 * 60;
                        if (!getDuplicate && !getIgnored) {
                            this.eventQueue.push({
                                type: `event`, hash: feature.properties.hash,
                                issued: getIssued, expires: getExpires,
                                feature: feature, queued: inRange == true ? false : true
                            })
                        }
                        
                    }
                } 
                if (pulsepoint.length > 0 && settings?.setPulsePoint) {
                    for (let feature of pulsepoint) {
                        const getDuplicate = this.eventQueue.findIndex(e => e.hash === JSON.stringify(feature)) !== -1;
                        const getIssued = new Date(feature.properties.issued).getTime();
                        const inRange = (now - getIssued) < settings?.setMaxHistory * 1000 * 60;
                        if (!getDuplicate) {
                            this.eventQueue.push({
                                type: `pulsepoint`, hash: JSON.stringify(feature),
                                issued: getIssued, expires: getIssued + 60_000_60,
                                feature: feature, queued: inRange == true ? false : true
                            })
                        }
                    }
                }
                this.eventQueue = this.eventQueue.filter(e => e.expires > now);
                resolve(this.eventQueue);
            })
        } catch (error) {
            this.utils.exception(error, `${this.name_space}:hSyncEvents`);
        }
    }

    /**
     * @production
     * @error_handling
     * @function hSyncQueue
     * @description
     *      Processes the internal queue of weather events and handles their display and sound effects.
     * 
     * @param {Object} settings - Configuration options for processing the queue.
     * @param {number} settings.setPauseTime - hold interval in seconds for displaying events.
     * @param {string} settings.setSfx - Sound effect to play when an event is processed.
     * @param {number} settings.setSfxVolume - Volume level for the sound effect.
     * @return {Promise<void>} - A promise that resolves when the queue processing is complete.
     */
    hSyncQueue = async function(settings) {
        try {
            if (this.isQueuing) return;
            const configurations = this.storage?.configurations ?? {};
            const next = this.eventQueue.filter(e => !e.queued).sort((a, b) => {
                const aTime = Date.parse(a.issued);
                const bTime = Date.parse(b.issued);
                return aTime - bTime;
            })[0];
            if (!next) return;
            const event = next.feature;
            const getTheme = this.utils.getEventColor(event?.properties?.event);
            const getMetadata = this.utils.getEventMetadata(event);
            this.isQueuing = true; next.queued = true;
            switch (next.type) { 
                case `event`: {
                    if (settings.setStreaming) {
                        this.aWeatherCard(event, getTheme, settings);
                    }
                    this.utils.sleep(settings?.setPauseTime * 1000).then(() => {
                        this.isQueuing = false;
                    });
                    break;
                }
                case `pulsepoint`: {
                    if (settings.setStreaming) {
                        this.aPulsePointCard(event, getTheme, settings);
                    }
                    this.utils.sleep(settings?.setPauseTime * 1000).then(() => {
                        this.isQueuing = false;
                    });
                }
            }
            if (!settings.setPlayback) { return }
            this.utils.sound(settings?.setSfx != null ? settings?.setSfx : configurations.tones.sfx_beep, settings?.setSfxVolume);
            if (!event?.properties?.beep_only) {
                await this.utils.sleep(1_300);
                if ((configurations.tones.sfx_beep != getMetadata.sfx) && !getMetadata.sfx_tts) { 
                    this.utils.sound(getMetadata.sfx); 
                }
                if (getMetadata.sfx_tts) {
                    const getOutput = this.utils.getTextFromDirectory(
                        event,
                        getMetadata.sfx_tts_format ?? `Unknown`
                    );
                    const status = next.type === 'pulsepoint' 
                        ? (event.properties.is_updated ? "updated" : "dispatched")
                        : (event.properties.is_updated ? "updated" : event.properties.is_issued ? "issued" : "cancelled");
                    this.utils.tts(getOutput
                        .replace(`{STATUS}`, status)
                    )
                }
                await this.utils.sleep(3_800);
                if (getMetadata.metadata) { 
                    for (const key in getMetadata.metadata) {
                        if (getMetadata.metadata?.[key] === true) {
                            const tone = configurations?.tones?.[`sfx_${key}`];
                            if (tone) this.utils.sound(tone);
                        }
                    }
                }
            }
        } catch (error) {
            this.utils.exception(error, `${this.name_space}:hSyncQueue`);
        }
    }

    /**
     * @production
     * @error_handling
     * @function aWeatherCard
     * @description
     *      Creates and displays a weather event card using the provided event data and theme.
     * 
     * @param {Object} event - The weather event data.
     * @param {string} theme - The theme to apply to the weather card.
     * @param {Object} settings - Additional options for the weather card.
     * @param {number} settings.setPauseTime - Duration to display the card.
     * @param {HTMLElement} settings.setElement - Parent element to attach the card to.
     * @return {Object} - The created weather card widget.
     */
    aWeatherCard = function(event, theme, settings) { 
        try {
            return this.aCreateCard({
                title: this.utils.getTextFromDirectory(event, settings.global.setValuePath),
                fields: [
                    [
                        { title: "Locations", value: `${event?.properties?.locations?.substring(0, 70) ?? `--`} (x${event?.properties?.geocode?.UGC?.length ?? 0})`, align: "left" },
                        { title: "Issued", value: event?.properties?.issued?.substring(0, 25) ?? `--`, align: "right" },
                    ],
                    [
                        { title: "Est. Hail", value: event?.properties?.parameters?.max_hail_size ?? `--`, align: "left" },
                        { title: "Est. Wind Gusts", value: event?.properties?.parameters?.max_wind_gust ?? `--`, align: "center" },
                        { title: "Expires", value: event?.properties?.expires ?? `--`, align: "right" },
                    ],
                    [
                        { title: "Tornado Threat", value: event?.properties?.parameters?.tornado_detection ?? `--`, align: "left" },
                        { title: "Damage Threat", value: event?.properties?.parameters?.damage_threat ?? `--`, align: "center" },
                        { title: "Flood Threat", value: event?.properties?.parameters?.flood_detection ?? `--`, align: "right" },
                    ],
                    [
                        { title: "Office", value: `${event?.properties?.sender_icao ?? `--`}${event?.properties?.sender_icao ? ` (${event?.properties?.sender_name ?? `--`})` : ''}`, align: "left" },
                        { title: "Tags", value: (event?.properties?.tags?.length ?? 0) > 0 ? event?.properties?.tags?.join(", ")?.substring(0, 40) : `--`, align: "right" },
                    ]
                ],
                duration: settings.setPauseTime,
                theme: theme,
                parent: settings.setElement,
                options: settings
            })
        } catch (error) {
            this.utils.exception(error, `${this.name_space}:play`);
        }
    }

    /**
     * @production
     * @error_handling
     * @function aPulsePointCard
     * @description
     *      Creates and displays a PulsePoint event card using the provided event data and theme.
     * 
     * @param {Object} event - The PulsePoint event data.
     * @param {string} theme - The theme to apply to the PulsePoint card.
     * @param {Object} settings - Additional settings for the PulsePoint card.
     * @param {number} settings.setPauseTime - Duration to display the card.
     * @param {HTMLElement} settings.setElement - Parent element to attach the card to.
     * @return {Object} - The created PulsePoint card widget.
     */
    aPulsePointCard = function(event, theme, settings) { 
        try {
            return this.aCreateCard({
                title: this.utils.getTextFromDirectory(event, settings.global.setValuePath),
                fields: [
                    [
                        { title: "Address", value: `${event?.properties?.address?.substring(0, 70) ?? `--`}`, align: "left" },
                        { title: "Received", value: event?.properties?.issued ?? `--`, align: "right" },
                    ],
                    [
                        { title: "Units Responding", value: event?.properties?.units && event?.properties?.units.length > 0  ? event?.properties?.units.map(u => u.id).join(", ").substring(0, 40) : "No Responding Units", align: "left" },
                    ],
                    [
                        { title: "", value: "",  align: "left" },
                    ],
                    [
                        { title: "", value: "",  align: "left" },
                    ]
                ],
                duration: settings.setPauseTime,
                theme: theme,
                parent: settings.setElement,
                options: settings
            })
        } catch (error) {
            this.utils.exception(error, `${this.name_space}:play`);
        }
    }

    /**
     * @production
     * @error_handling
     * @function aCreateCard
     * @description
     *      Creates and displays a widget card using the provided settings.
     *      (I dont like this, it's soooo bad but it works and I will eventually make it better)
     * 
     * @param {Object} settings - The settings for creating the widget card.
     * @param {string} settings.title - The title of the widget card.
     * @param {Array<Array>} settings.fields - The fields to display in the widget card.
     * @param {number} settings.duration - The duration to display the widget card.
     * @param {Object} settings.theme - The theme to apply to the widget card.
     * @param {HTMLElement} settings.parent - The parent element to attach the widget card to.
     * @param {Object} settings.options - Additional options for the widget card.
     */
    aCreateCard = async function(settings) {
        try {
            return new Promise(resolve => {
                const getParent = settings?.parent;
                const getCard = getParent.querySelector('.widget-container') ?? document.createElement('div');
                const getHeader = getParent.querySelector('.widget-child-header') ?? document.createElement('div');
                const getBody = getParent.querySelector('.widget-child-body') ?? document.createElement('div');
                    if (!getParent.querySelector('.widget-container')) {
                        getParent.appendChild(getCard);
                        getCard.appendChild(getHeader);
                        getCard.appendChild(getBody);
                    }
                    getParent.style.display = `block`
                    getHeader.setAttribute("class", "widget-child-header");
                    getHeader.style.background = settings?.theme?.secondary ?? 'inherit';
                    getHeader.style.textAlign = settings?.options?.global?.setTextAlignment ?? 'left';
                    getHeader.textContent = settings?.title;
                    getBody.setAttribute("class", "widget-child-body");
                    getBody.style.background = settings?.theme?.primary ?? 'inherit';
                    getBody.innerHTML = '';
                settings?.fields.forEach((rowFields, i) => {
                    if (!Array.isArray(rowFields)) rowFields = [rowFields];
                    const row = document.createElement("div");
                        row.setAttribute("class", i % 2 === 0 ? "widget-row-2" : "widget-row-1");
                        row.style.background = `${i % 2 === 0 ? settings?.theme?.primary : settings?.theme?.secondary ?? 'inherit'}`;
                    rowFields.forEach(field => {
                        const fieldDiv = document.createElement("div");
                            fieldDiv.setAttribute("class", "alert-field");
                            fieldDiv.style.flex = `1`;
                            fieldDiv.style.display = `flex`;
                            fieldDiv.style.justifyContent = field.align === "center" ? "center" : field.align === "right" ? "flex-end" : "flex-start";
                            fieldDiv.style.whiteSpace = `nowrap`;
                            fieldDiv.style.textShadow = "0 0 7px rgba(0, 0, 0, 1)";
                            if (field.title == "") {
                                fieldDiv.style.height = "1em";
                            } else {
                                fieldDiv.textContent =`${field.title}: ${field.value}`;
                            }
                        row.appendChild(fieldDiv);
                    });
                    getBody.appendChild(row);
                });
                getParent.style.animation = `${settings?.options?.global?.setAnimationStartType} ${settings?.options?.global?.setAnimationStartDuration}s ease forwards`;
                setTimeout(() => {
                    getParent.style.animation = `${settings?.options?.global?.setAnimationEndType} ${settings?.options?.global?.setAnimationEndDuration}s ease forwards`;
                    getParent.addEventListener("animationend", () => getCard.remove(), { once: true });
                    resolve();
                }, settings?.options?.setPauseTime * 1000);
            });
        } catch (error) {
            this.utils.exception(error, `${this.name_space}:hCreateCard`);
        }
    }
}