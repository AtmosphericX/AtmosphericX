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

class Widgets { 
    constructor(utils = null, options={}) {
        this.NAME_SPACE = `webmodule:widgets`;
        this.utils = utils;
        this.storage = this.utils.storage;
        this.utils.log(`${this.NAME_SPACE} initialized.`);
        this.options = options;
        this.previous = null;
        this.__loop = null;
    }

    /**
     * @function stringHandler
     * @description Handles dynamic string updates for widgets based on the specified mode and type. (Specially made for strings)
     * 
     * @param {string} mode - The mode of string handling (e.g., "rng", "clock", "generic").
     * @param {string} type - The specific type of string to handle within the mode.
     */
    stringHandler = function (mode, type = null) {
        const { utils, options } = this;
        const storage = utils.storage;
        const assign = (v) => this.previous = this.stringAssignment(v, options.element, this.previous, options.length, options.animations);
        const meso = (k) => storage?.mesonet?.features?.find(f => f.properties)?.properties?.[k] ?? null;
        if (mode === "rng") {
            const rng = storage?.rng?.features?.[0];
            const out = rng?.properties?.[type] ?? options.placeholder ?? "No Event Data";
            return (this.previous = this.stringAssignment(out));
        }
        if (mode === "clock") {
            if (!["time", "date"].includes(type)) return;
            const getValue = () => type === "time" ? utils.getCurrentTime(options.timezone, options.military) : utils.getCurrentDate(options.timezone);
            if (this.__loop) { return }
            this.__loop = setInterval(() => { this.previous = this.stringAssignment(getValue()); }, 100);
            return;
        }
        if (mode === "generic") {
            const handlers = {
                watchdog: () => {
                    let count = 0;
                    const want = options.events.map(e => e.trim().toLowerCase());
                    const feats = storage?.events?.features ?? [];
                    const exact = want.filter(e => !e.startsWith("*"));
                    const wildcard = want.filter(e => e.startsWith("*")).map(e => e.slice(1));
                    for (const f of feats) {
                        const name = f.properties.event.toLowerCase();
                        if (exact.includes(name)) { count++; } else {
                            for (const wc of wildcard) {
                                if (wc && name.includes(wc)) { count++; break; }
                            }
                        }
                    }
                    let cleanEvents = options.events.map(e => e.replace(/\*/g, ''));
                    cleanEvents = cleanEvents.map(ev => {
                        const lower = ev.trim().toLowerCase();
                        if (lower === "advisory") return "Advisories";
                        if (lower === "watch") return "Watches";
                        if (lower === "warning") return "Warnings";
                        return ev;
                    });
                    assign(`${cleanEvents.join(", ")}: ${count} Active`);
                },
                nearby_spotters: () => {
                    const locs = storage?.tracking?.features[0]
                    if (!locs) return;
                    const spots = storage?.spotter_network_feed?.features ?? [];
                    const near = spots.filter(s => {
                        const [lon, lat] = s.geometry.coordinates;
                        return utils.calculateDistance({ lat, lon }, { lat: locs.geometry.coordinates[1], lon: locs.geometry.coordinates[0] }) <= options.radius;
                    });
                    storage.total_chasers = near.length;
                    assign(`${near.length} Chasers Nearby`);
                },
                nearby_polygons: () => {
                    let name = null, min = Infinity;
                    for (const f of storage?.events?.features ?? []) {
                        for (const d of Object.values(f?.properties?.distance ?? {})) {
                            if (d?.distance < min) {
                                min = d.distance;
                                name = f.properties.event;
                            }
                        }
                    }
                    assign( name ? `${name} (${min.toFixed(1)} mi)` : options.placeholder);
                },
                intensity: () => {
                    const locs = storage?.tracking.features[0]
                    if (!locs) return;
                    if (!locs?.properties?.icao) return assign(options.placeholder);
                    const chart = storage?.configurations?.dbz_intensity ?? {};
                    wise.fetchLatest(locs?.properties?.icao, "REF0").then(async scan => {
                        if (!scan) return;
                        const levels = await wise.getWiseLevels(scan);
                        const nearest = levels.reduce((a, b) => utils.calculateDistance(locs.geometry.coordinates[1], locs.geometry.coordinates[0], b.lat, b.lon) < utils.calculateDistance(locs.geometry.coordinates[1], locs.geometry.coordinates[0], a.lat, a.lon) ? b : a);
                        const sorted = Object.keys(chart).map(Number).sort((a, b) => a - b);
                        let key = Math.max(sorted[0], Math.floor(nearest.dbz / 5) * 5);
                        if (!chart[key]) key = sorted.filter(k => k <= key).pop();
                        assign(`${chart[key]} (${nearest.dbz.toFixed(1)}dBZ)`);
                    });
                },
                text: () => assign(options.text ?? options.placeholder),
                temperature: () => assign(meso("temperature") != null ? `${meso("temperature")}°F` : options.placeholder),
                humidity: () => assign(meso("humidity") != null ? `${meso("humidity")}%` : options.placeholder),
                wind: () => { assign(meso("wind_speed") != null ? `${meso("wind_speed")} mph (${meso("wind_direction")})` : options.placeholder); },
                dewpoint: () => assign(meso("dewpoint") != null ? `${meso("dewpoint")}°F` : options.placeholder),
                conditions: () => assign(meso("conditions") ?? options.placeholder),
                tracking: () => assign(meso("location") ?? options.placeholder),
            };
            return handlers[type]?.();
        }
    };

    /**
     * @function getCurrentTheme
     * @description Retrieves the current theme based on active events and configurations.
     * 
     * @returns {object} An object containing the primary and secondary colors of the current theme.
     */
    getCurrentTheme = function(eventName = null) {
        const themes = utils.storage?.configurations?.themes;
        const events = utils.storage.events.features ?? [];
        const events2 = utils.storage.emergencies?.features ?? [];
        const matchedThemes = Object.keys(themes).filter(themeName =>
            events.some(feature => feature?.properties?.event && feature.properties.event.trim().toLowerCase() === themeName.trim().toLowerCase()) || 
            events2.some(feature => feature?.properties?.type && feature.properties.type.trim().toLowerCase() === themeName.trim().toLowerCase())
        );
        const result = matchedThemes.map(name => ({name, ...themes[name]}));
        if (eventName !== null) {
            const specificTheme = themes[eventName];
            if (specificTheme) {
                const primary = specificTheme?.primary;
                const secondary = specificTheme?.secondary;
                return { primary, secondary };
            }
        }
        if (result.length == 0) { 
            const getDefault = themes['Default']
            const primary = getDefault?.primary
            const secondary = getDefault?.secondary
            return { primary, secondary };
        } else {
            const selectedTheme = result[0];
            const primary = selectedTheme?.primary
            const secondary = selectedTheme?.secondary
            return { primary, secondary };
        }
    }

    /**
     * @function stringAssignment
     * @description Assigns a string to the widget's element with optional animation and character limit.
     * 
     * @param {string} text - The text to be assigned to the widget.
     * @returns {string} The original text before any modifications.
     */
    stringAssignment = function(text) {
        const original = text
        const { maxcharacters, animated, element } = this.options;
        if (text.length > maxcharacters) { text = text.substring(0, maxcharacters) + '...'; }
        if (!animated) { element.textContent = (text); return original; }
        if (animated && this.previous !== original) {
            element.style.animation = "none";
            void element.offsetWidth;
            element.style.animation = "anim_slide_down_fade_out 0.3s linear forwards";
            setTimeout(() => {
                element.style.animation = "anim_slide_up_fade_in 0.3s linear forwards";
                element.textContent = (text);
            }, 500);
        }
        return original;
    }

    
}

