/*
              _                             _               _     __   __
         /\  | |                           | |             (_)    \ \ / /
        /  \ | |_ _ __ ___   ___  ___ _ __ | |__   ___ _ __ _  ___ \ V / 
       / /\ \| __| '_ ` _ \ / _ \/ __| '_ \| '_ \ / _ \ '__| |/ __| > <  
      / ____ \ |_| | | | | | (_) \__ \ |_) | | | |  __/ |  | | (__ / . \ 
     /_/    \_\__|_| |_| |_|\___/|___/ .__/|_| |_|\___|_|  |_|\___/_/ \_\
                                     | |                                 
                                     |_|                                                                                                                
    
    Written by: KiyoWx (k3yomi) & StarflightWx      

*/

class Handler { 
    constructor(utils = null) {
        this.NAME_SPACE = `webmodule:handler`;
        this.utils = utils;
        this.storage = this.utils.storage;
        this.utils.log(`${this.NAME_SPACE} initialized.`);
    }

    /**
     * @function syncEvents
     * @description Synchronizes weather events by checking for new events, filtering duplicates, and queuing them for processing.
     * 
     * @param {object} options - Options for syncing events.
     * @param {number} options.history - The time range (in milliseconds) to consider for event history.
     * @param {boolean} options.includeEmergencies - Whether to include emergency events in the synchronization.
     * @returns {Promise<Array>} A promise that resolves to the updated list of queued events.
     */
    syncEvents = async function(options={history: 120_000, includeEmergencies: false, wxEvents: true}) { 
        return new Promise((resolve) => {
            this.utils.initializeStorage(`queuedEvents`, []);
            const time = new Date().getTime();
            const events = this.storage.events;
            const manual = this.storage.manual;
            const emergencies = this.storage.emergencies;
            if (manual.features.length > 0 && options.wxEvents) {
                for (let feature of manual.features) {
                    const isDuplicate = this.storage.queuedEvents.findIndex(e => e.hash === JSON.stringify(feature.event)) !== -1;
                    const getIssuedDate = new Date(feature.event.properties.issued).getTime();
                    if (!isDuplicate && !feature.ignored) {
                        this.storage.queuedEvents.push({
                            type: `event`,
                            hash: JSON.stringify(feature.event),
                            issued: new Date().getTime(),
                            expires: getIssuedDate + 60_000_60,
                            feature: feature,
                            queued: true
                        })
                    }
                }
            }
            if (events.features.length > 0 && options.wxEvents) {
                for (let feature of events.features) {
                    const isDuplicate = this.storage.queuedEvents.findIndex(e => e.hash === feature.event.hash) !== -1;
                    const isIgnored = feature.ignored;
                    const getIssuedDate = new Date(feature.event.properties.issued).getTime();
                    const getExpiresDate = new Date(feature.event.properties.expires).getTime();
                    const inTimeRange = (time - getIssuedDate) < options.history;
                    if (!isDuplicate && !isIgnored) {
                        this.storage.queuedEvents.push({
                            type: `event`,
                            hash: feature.event.hash,
                            issued: getIssuedDate,
                            expires: getExpiresDate,
                            feature: feature,
                            queued: inTimeRange == true ? false : true
                        })
                    }
                }
            }
             if (emergencies.features.length > 0 && options.includeEmergencies) {
                for (let feature of emergencies.features) {
                    const isDuplicate = this.storage.queuedEvents.findIndex(e => e.hash === JSON.stringify(feature.properties)) !== -1;
                    const getIssuedDate = new Date(feature.properties.received).getTime();
                    const inTimeRange = (time - getIssuedDate) < options.history;
                    if (!isDuplicate) {
                        this.storage.queuedEvents.push({
                            type: `emergency`,
                            hash: JSON.stringify(feature.event),
                            issued: getIssuedDate,
                            expires: getIssuedDate + 60_000_60,
                            feature: feature,
                            queued: inTimeRange == true ? false : true
                        })
                    }
                }
            }
            this.storage.queuedEvents = this.storage.queuedEvents.filter(e => e.expires > time);
            resolve(this.storage.queuedEvents);
        });
    }

    /**
     * @function syncQueue
     * @description Processes the queued events one at a time, playing associated sound effects and handling metadata.
     * 
     * @param {number} cooldown - The cooldown period in seconds between processing events.
     */
    syncQueue = async function (cooldown = 8) {
        this.utils.initializeStorage("isQueryRunning", false);
        if (this.storage.isQueryRunning) return;
        const cfg = this.storage.configurations
        const next = this.storage.queuedEvents.filter(e => !e.queued).sort((a, b) => {
            const aTime = Date.parse(a.issued);
            const bTime = Date.parse(b.issued);
            return aTime - bTime;
        })[0];
        if (!next) { return; }
        this.storage.isQueryRunning = true;
        next.queued = true;
        switch (next.type) { 
            case `event`: {
                const event = next.feature.event;
                const getTheme = widgets.getCurrentTheme(event.properties.event);
                if (this.utils.streaming) {  this.returnEventCard(event, getTheme, cooldown); }
                if (!this.utils.streaming) { await this.utils.sleep(cooldown * 1_000); this.storage.isQueryRunning = false; }
                break;
            }
            case `emergency`: {
                const event = next.feature.properties;
                const getTheme = widgets.getCurrentTheme(event.type);
                if (this.utils.streaming) { this.returnEmergencyCard(event, getTheme, cooldown); }
                if (!this.utils.streaming) { await this.utils.sleep(cooldown * 1_000); this.storage.isQueryRunning = false; }
                break;
            }
        }
        if (next.type === `emergency`) { return this.utils.play(cfg.tones.sfx_beep); }
        if (next.feature.beep) this.utils.play(cfg.tones.sfx_beep);
        if (!next.feature.beep) {
            this.utils.play(cfg.tones.sfx_beep);
            await this.utils.sleep(1_300);
            this.utils.play(next.feature.sfx);
            await this.utils.sleep(3_800);
            if (next.feature.metadata) {
                for (const key in next.feature.metadata) {
                    if (next.feature.metadata[key] === true) {
                        const tone = cfg.tones[`sfx_${key}`];
                        if (tone) this.utils.play(tone);
                    }
                }
            }
        }
    };

    /**
     * @function eventCreator
     * @description Creates and displays an event card with specified options, including animations and themes.
     * 
     * @param {object} options - The options for creating the event card.
     * @param {string} options.eventName - The name of the event to display on the card.
     * @param {Array} options.fields - An array of field objects to display in the card body.
     * @param {string} options.start_anim - The animation to use when the card appears.
     * @param {string} options.end_anim - The animation to use when the card disappears.
     * @param {number} options.timer - The duration (in milliseconds) to display the card before it disappears.
     * @param {object} options.theme - The theme colors for the card.
     * @param {HTMLElement} options.target - The target HTML element where the card will be appended.
     * @returns {Promise} A promise that resolves when the event card has been displayed and removed.
     */
    eventCreator = async function(options) {
        return new Promise((resolve) => {
            const { eventName, fields = [], start_anim = "anim_slide_up_fade_in", end_anim = "anim_slide_down_fade_out", timer = 10000, theme = {}, target } = options;
            if (!target) return resolve();
            target.innerHTML = "";
            const card = document.createElement("div");
            card.className = "alert-box";
            const header = document.createElement("div");
            header.className = "alert-header";
            header.textContent = eventName;
            if (theme.secondary) header.style.background = theme.secondary;
            const body = document.createElement("div");
            body.className = "alert-body";
            if (theme.primary) body.style.background = theme.primary;
            fields.forEach((rowFields, i) => {
                if (!Array.isArray(rowFields)) rowFields = [rowFields];
                const row = document.createElement("div");
                row.className = i % 2 === 0 ? "alert-row-dark" : "alert-row-light";
                if (theme.primary && theme.secondary)
                    row.style.background = i % 2 === 0 ? theme.primary : theme.secondary;
                rowFields.forEach(f => {
                    const fieldDiv = document.createElement("div");
                    fieldDiv.className = "alert-left";
                    fieldDiv.style.flex = "1";
                    fieldDiv.style.display = "flex";
                    fieldDiv.style.justifyContent = f.align === "center" ? "center" : f.align === "right" ? "flex-end" : "flex-start";
                    fieldDiv.style.whiteSpace = "nowrap";
                    fieldDiv.style.textShadow = "0 0 7px rgba(0, 0, 0, 1)";
                    fieldDiv.innerHTML =`${f.title}: ${f.value}`;
                    row.appendChild(fieldDiv);
                });
                body.appendChild(row);
            });
            card.appendChild(header);
            card.appendChild(body);
            target.appendChild(card);
            card.style.animation = `${start_anim} 0.8s ease forwards`;
            setTimeout(() => {
                card.style.animation = `${end_anim} 0.8s ease forwards`;
                card.addEventListener("animationend", () => card.remove() , { once: true });
                resolve();
            }, timer);
        });
    };
    
    /**
     * @function returnEmergencyCard
     * @description Creates and displays an emergency event card with specified theme and cooldown.
     * 
     * @param {object} emergency - The emergency event data.
     * @param {object} getTheme - The theme colors for the card.
     * @param {number} cooldown - The duration (in seconds) to display the card before it disappears.
     */
    returnEmergencyCard = function(emergency, getTheme, cooldown = 8) {
        handler.eventCreator({
            eventName: `${emergency.type} (${emergency.agency})`,
            fields: [
                [
                    { title: "ADDRESS", value: `${emergency.address.substring(0, 70)}`, align: "left" },
                    { title: "RECIEVED", value: emergency.received, align: "right" },
                ],
                [
                    { title: "UNITS RESPONDING", value: emergency.units && emergency.units.length > 0  ? emergency.units.map(u => u.id).join(", ")  : "No Responding Units",  align: "left" },
                ],
            ],
            start_anim: "anim_slide_up_fade_in",
            end_anim: "anim_slide_down_fade_out",
            timer: cooldown * 1_000,
            theme: { primary: getTheme.primary, secondary: getTheme.secondary },
            target: document.querySelector('.target')
        }).then(async () => {
            await this.utils.sleep(3 * 1_000);
            this.storage.isQueryRunning = false;
        })
    }

    /**
     * @function returnEventCard
     * @description Creates and displays a weather event card with specified theme and cooldown.
     * @param {object} event - The weather event data.
     * @param {object} getTheme - The theme colors for the card.
     * @param {number} cooldown - The duration (in seconds) to display the card before it disappears.
     */
    returnEventCard = function(event, getTheme, cooldown = 8) {
        handler.eventCreator({
            eventName: `${event.properties.event} (${event.properties.action_type})`,
            fields: [
                [
                    { title: "LOCATIONS", value: `${event.properties.locations.substring(0, 70)} (x${event.properties.geocode.UGC.length})`, align: "left" },
                    { title: "ISSUED", value: event.properties.issued.substring(0, 25), align: "right" },
                ],
                [
                    { title: "HAIL", value: event.properties.parameters.max_hail_size, align: "left" },
                    { title: "GUSTS", value: event.properties.parameters.max_wind_gust, align: "center" },
                    { title: "EXPIRES", value: event.properties.expires, align: "right" },
                ],
                [
                    { title: "THREAT (TOR)", value: event.properties.parameters.tornado_detection[0], align: "left" },
                    { title: "THREAT (DMG)", value: event.properties.parameters.damage_threat[0], align: "center" },
                    { title: "THREAT (FLD)", value: event.properties.parameters.flood_detection[0], align: "right" },
                ],
                [
                    { title: "OFFICE", value: `${event.properties.sender_name} (${event.properties.sender_icao})`, align: "left" },
                    { title: "TAGS", value: event.properties.tags[0], align: "right" },
                ],
            ],
            start_anim: "anim_slide_up_fade_in",
            end_anim: "anim_slide_down_fade_out",
            timer: cooldown * 1_000,
            theme: { primary: getTheme.primary, secondary: getTheme.secondary },
            target: document.querySelector('.target')
        }).then(async () => {
            await this.utils.sleep(3 * 1_000);
            this.storage.isQueryRunning = false;
        })
    }
}

