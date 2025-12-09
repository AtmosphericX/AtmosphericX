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
     * @param {boolean} isDashboard - Indicates if the sync is being performed for a dashboard widget.
     * @returns {Promise<Array>} A promise that resolves to the updated list of queued events.
     */
    syncEvents = async function(isDashboard = false) { 
        return new Promise((resolve) => {
            this.utils.initializeStorage(`queuedEvents`, []);
            const time = new Date().getTime();
            const events = this.storage.events;
            const manual = this.storage.manual;
            if (manual.features.length > 0) {} //TODO: Manual Event Handling (Prerequsite: Dashboard Finish)
            if (events.features.length > 0) {
                for (let feature of events.features) {
                    const isDuplicate = this.storage.queuedEvents.findIndex(e => e.hash === feature.event.hash) !== -1;
                    const isIgnored = feature.ignored;
                    const getIssuedDate = new Date(feature.event.properties.issued).getTime();
                    const getExpiresDate = new Date(feature.event.properties.expires).getTime();
                    const inTimeRange = (time - getIssuedDate) < 120_000_000; 
                    if (!isDuplicate && !isIgnored) {
                        this.storage.queuedEvents.push({
                            type: `event`,
                            hash: feature.event.hash,
                            expires: getExpiresDate,
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
        const event = this.storage.queuedEvents
            .filter(e => !e.queued)
            .sort((a, b) => {
                const aTime = Date.parse(a.feature.event.properties.issued);
                const bTime = Date.parse(b.feature.event.properties.issued);
                return aTime - bTime;
            })[0];
        if (!event) { return; }
        this.storage.isQueryRunning = true;
        event.queued = true;
        if (event.feature.beep) this.utils.play(cfg.tones.sfx_beep);
        if (!event.feature.beep) {
            this.utils.play(cfg.tones.sfx_beep);
            await this.utils.sleep(1_300);
            this.utils.play(event.feature.sfx);
            await this.utils.sleep(3_800);
            if (event.feature.metadata) {
                for (const key in event.feature.metadata) {
                    if (event.feature.metadata[key] === true) {
                        const tone = cfg.tones[`sfx_${key}`];
                        if (tone) this.utils.play(tone);
                    }
                }
            }
        }
        await this.utils.sleep(cooldown * 1_000);
        this.storage.isQueryRunning = false;
    };
}

