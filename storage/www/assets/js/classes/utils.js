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
    Discord: https://atmosphericx-discord.scriptktity.cafe
    Ko-Fi: https://ko-fi.com/k3yomi
    Documentation: http://localhost/documentation | https://atmosphericx.scriptkitty.cafe/documentation

*/

class Utils { 
    constructor() { 
        this.name_space = `webmodule:utils`;
        this.storage = [];
        this.isMobile = false;
        this.isAudioPlayable = false;
        this.audioChannels = [];
        this.audioQueue = [];
        this.log(`${this.name_space} initialized.`);
    }

    /**
     * @production
     * @function notify
     * @description 
     *       Displays a notification message to the user.
     * 
     * @param {string} type - The type of notification ('success', 'error', 'info').
     * @param {string} message - The message to display in the notification.
     * @return {void}
     */
    log = function(message) { 
        console.log(`[${new Date().toISOString()}] ${message}`);
    }

    /**
     * @production
     * @error_handling
     * @function exception
     * @description 
     *       Reports an unexpected error with context.
     * 
     * @param {Error|string} error - The error object or message to exception.
     * @param {string} parent - The context or parent function where the error occurred.
     * @return {void}
     */
    exception = function(error, parent) { 
        const msg = error instanceof Error ? error.message : JSON.stringify(error);
        this.log(`${parent} - An unexpected error occurred: ${msg}`);
        this.notify({ 
            type: 'error', 
            message: msg, 
            duration: 5000 
        });
    } 

    /**
     * @production
     * @error_handling
     * @function socket
     * @description 
     *       Establishes a socket connection to the server for real-time updates.
     * 
     * @param {Array} types - An array of event types to subscribe to.
     * @return {Promise} A promise that resolves when the socket connection is established.
     */
    socket = async function(types = ['configurations']) {
        return new Promise((resolve) => {
            try {
                const url = `${window.location.protocol == `https:` ? `wss:` : `ws:`}//${window.location.hostname}:${window.location.port}/stream`
                this.storage.socket = new WebSocket(url);
                this.storage.socket.addEventListener('open', () => {
                    this.log(`socket connection established.`);
                    for (let type of types) {
                        this.log(`Subscribed to event type: ${type}`);
                    }
                    this.storage.socket.send(JSON.stringify({ type: 'subscribe', message: types }));
                    resolve();
                })
                this.storage.socket.addEventListener('close', () => {
                    this.storage.socket.close()
                    this.storage.socket = null
                    setTimeout(() => { this.socket(types) }, 1000)
                });
                this.storage.socket.addEventListener('message', (event) => {
                    const data = JSON.parse(event.data)
                    const type = data.type || null;
                    const message = data.message || null;
                    const value = data.value || null;
                    if (type == `subscribe` && message != null) { 
                        this.storage[value] = message; 
                    }
                    if (type == `update`) { 
                        setTimeout(() => { document.dispatchEvent(new Event('onUpdate')); }, 100);
                    }
                })
            } catch (error) {
                this.exception(error, `${this.name_space}:socket`);
            }
        })
    }

    /**
     * @production
     * @error_handling
     * @function notify
     * @description
     *      Displays a notification message to the user. 
     * 
     * @param {Object} options - The notification options.
     * @param {string} options.message - The message to display in the notification.
     * @param {string} options.type - The type of notification ('success', 'error', 'info').
     * @param {number} options.duration - Duration in milliseconds for which the notification is displayed.
     * @return {void}
     */
    notify = function(options = {message: `Notification`, type: `info`, duration: 5000}) {
        try {
            if (!options || !options.message) return;
            if (!options.type) options.type = `info`;
            if (!options.duration) options.duration = 5000;
            this.log(`[${options.type.toUpperCase()}] ${options.message}`);
            const container = document.getElementsByClassName('notifications')[0];
            if (!container) return;
            this.sound(`/sfx/dash_sfx/notify.mp3`, 0.1)
            if (container.children.length >= 2) {
                const firstNotify = container.children[0];
                firstNotify.classList.add('fade-out');
                setTimeout(() => { firstNotify.remove(); }, 500);
            }
            const notify = document.createElement('div');
            notify.classList.add('notification', options.type);
            notify.innerText = options.message;
            const setNotifyBar = document.createElement('div');
                setNotifyBar.classList.add('notification-bar');
            const progress = document.createElement('div');
                progress.classList.add('notification-progress', options.type);
                progress.style.width = '100%';
                progress.style.transition = `width ${options.duration}ms linear`;
            container.appendChild(notify);
            notify.appendChild(setNotifyBar);
            setNotifyBar.appendChild(progress);
            progress.offsetWidth;
            requestAnimationFrame(() => { progress.style.width = '0%';});
            setTimeout(() => {
                notify.classList.add('fade-out');
                setTimeout(() => { notify.remove(); }, 500);
            }, options.duration);
        } catch (error) {
            this.exception(error, `${this.name_space}:notify`);
        }
    }

    /**
     * @production
     * @error_handling
     * @function getTimeMetadata
     * @description
     *      Retrieves time-related metadata such as current time, date, timezone, and countdowns.
     *
     * @param {Object} options - Configuration options for retrieving time metadata.
     * @param {Object} options.return - Specifies which metadata to return (time, date, timezone, countdown).
     * @param {string|null} options.timezone - The timezone to use for formatting (default is system timezone).
     * @param {boolean} options.military - Whether to use 24-hour format for time.
     * @param {Object|null} options.countdown - Configuration for countdown metadata.
     * @param {number|null} options.setUnix - A specific Unix timestamp to use instead of the current time.
     * @param {string} options.locale - Locale string for formatting (default is 'en-US').
     * @return {Object|string} An object containing the requested metadata or a single string if only one type is requested.
     */
    getTimeMetadata = function(options = {}) {
        try {
            const defaultReturn = { time: true, timezone: false, date: false, countdown: false };
            const { 
                return: returnOptions = defaultReturn, timezone = null, military = false, countdown: countdownOptions = null, setUnix = null, locale = 'en-US'
            } = options;
            const defaultTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
            const resolvedTimezone = timezone ?? defaultTimezone;
            const unixTimestamp = setUnix ?? Math.floor(Date.now() / 1000);
            const now = new Date(unixTimestamp * 1000);
            const dispatch = (eventName, detail = {}) => document.dispatchEvent(new CustomEvent(eventName, { detail }));
            let timeString = '';
            let dateString = '';
            if (returnOptions.time) {
                timeString = now.toLocaleTimeString(locale, {
                    timeZone: resolvedTimezone,
                    hour12: !military,
                    hour: '2-digit',
                    minute: '2-digit',
                    second: '2-digit'
                });
                dispatch('timeMetadataUpdate', { time: timeString });
            }
            if (returnOptions.date) {
                dateString = now.toLocaleDateString(locale, {
                    timeZone: resolvedTimezone,
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                });
                dispatch('dateMetadataUpdate', { date: dateString });
            }
            if (returnOptions.timezone) {
                dispatch('timezoneMetadataUpdate', { timezone: resolvedTimezone });
            }
            let countdownPayload = null;
            if (returnOptions.countdown && countdownOptions) {
                const targetUnix = countdownOptions.targetUnix ?? countdownOptions.target ?? null;
                if (typeof targetUnix === 'number') {
                    const targetMs = targetUnix > 1e12 ? targetUnix : targetUnix * 1000;
                    const delta = Math.max(0, targetMs - now.getTime());
                    const remaining = {
                        totalMs: delta,
                        days: Math.floor(delta / 86400000),
                        hours: Math.floor(delta / 3600000) % 24,
                        minutes: Math.floor(delta / 60000) % 60,
                        seconds: Math.floor(delta / 1000) % 60
                    };
                    countdownPayload = {
                        target: new Date(targetMs).toISOString(),
                        remaining
                    };
                    dispatch('countdownMetadataUpdate', { countdown: countdownPayload });
                }
            }
            const response = {};
            if (returnOptions.time) response.time = timeString;
            if (returnOptions.date) response.date = dateString;
            if (returnOptions.timezone) response.timezone = resolvedTimezone;
            if (returnOptions.countdown && countdownPayload) response.countdown = countdownPayload;
            if (Object.keys(response).length === 1) return Object.values(response)[0];
            return response;
        } catch (error) {
            this.exception(error, `${this.name_space}:getTimeMetadata`);
        }
    }

    /**
     * @production
     * @error_handling
     * @function httpRequest
     * @description 
     *      Makes an HTTP request to the specified URL with given options.
     * 
     * @param {string} url - The URL to which the request is made.
     * @param {object} options - The options for the fetch request (method, headers, body, etc.).
     * @returns {Promise<Response|null>} A promise that resolves to the response object or null if an error occurs.
     */
    httpRequest = async function(url, options = {}) {
        try { 
            const dOptions = { method: 'GET', ...options };
            const response = await fetch(url, dOptions);
            return response;
        } catch (error) { 
            this.exception(error, `${this.name_space}:httpRequest`);
            return null;
        }
    }

    /**
     * @production
     * @error_handling
     * @function getDistance
     * @description 
     *      Calculates the distance in miles between two geographic coordinates using the Haversine formula.
     * 
     * 
     * @param {Array<number>} coordinatesA - An array containing the longitude and latitude of the first point in degrees.
     * @param {Array<number>} coordinatesB - An array containing the longitude and latitude of the second point in degrees.
     * @returns {number} The distance between the two points in miles.
     */
    getDistance = function(coordinatesA, coordinatesB) {
        try {
            const toRadians = deg => deg * (Math.PI / 180);
            const earthRadiusMeters = 6371000;
            const startLatRad = toRadians(coordinatesA.lat);
            const endLatRad = toRadians(coordinatesB.lat);
            const deltaLatRad = toRadians(coordinatesB.lat - coordinatesA.lat);
            const deltaLonRad = toRadians(coordinatesB.lon - coordinatesA.lon);
            const a =
                Math.sin(deltaLatRad / 2) * Math.sin(deltaLatRad / 2) +
                Math.cos(startLatRad) * Math.cos(endLatRad) *
                Math.sin(deltaLonRad / 2) * Math.sin(deltaLonRad / 2);
            const angularDistance = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
            const distanceMeters = earthRadiusMeters * angularDistance;
            const distanceMiles = distanceMeters / 1609.344;
            return distanceMiles;
        } catch (error) {
            this.exception(error, `${this.name_space}:getDistance`);
            return -1;
        }
    }

    /**
     * @production
     * @errror_handling
     * @function getEarthCoordinates
     * @description 
     *      Calculates new geographic coordinates based on an initial point, distance, and bearing.
     * 
     * @param {number} longitude - The starting longitude in degrees.
     * @param {number} latitude - The starting latitude in degrees.
     * @param {number} distMeters - The distance to move from the starting point in meters.
     * @param {number} bearingDegrees - The bearing (direction) in degrees from the starting point.
     * @returns {Array<number>} An array containing the new longitude and latitude in degrees.
     */
    getEarthCoordinates = function(longitude, latitude, distMeters, bearingDegrees) {
        try {
            const earthRadiusMeters = 6371000;
            const toRadians = deg => deg * (Math.PI / 180);
            const toDegrees = rad => rad * (180 / Math.PI);
            const angularDistance = distMeters / earthRadiusMeters;
            const bearingRad = toRadians(bearingDegrees);
            const lat1Rad = toRadians(latitude);
            const lon1Rad = toRadians(longitude);
            const lat2Rad = Math.asin(
                Math.sin(lat1Rad) * Math.cos(angularDistance) +
                Math.cos(lat1Rad) * Math.sin(angularDistance) * Math.cos(bearingRad)
            );
            const lon2Rad = lon1Rad + Math.atan2(
                Math.sin(bearingRad) * Math.sin(angularDistance) * Math.cos(lat1Rad),
                Math.cos(angularDistance) - Math.sin(lat1Rad) * Math.sin(lat2Rad)
            );
            const lat2 = toDegrees(lat2Rad);
            const lon2 = ((toDegrees(lon2Rad) + 540) % 360) - 180;
            return [lon2, lat2];
        } catch (error) {
            this.exception(error, `${this.name_space}:getEarthCoordinates`);
            return [longitude, latitude];
        }
    }

    /**
     * @production
     * @error_handling
     * @function getSilentChannel
     * @description
     *      Generates silent noise to keep iOS audio suspension from happening.
     * 
     * @return {void}
     */
    getSilentChannel = async function() {
        try {
            function generateSilentWav(seconds = 1, sampleRate = 44100) {
                const numSamples = seconds * sampleRate;
                const buffer = new ArrayBuffer(44 + numSamples * 2);
                const view = new DataView(buffer);
                function writeString(offset, str) {
                    for (let i = 0; i < str.length; i++) view.setUint8(offset + i, str.charCodeAt(i));
                }
                writeString(0, "RIFF");
                view.setUint32(4, 36 + numSamples * 2, true);
                writeString(8, "WAVE");
                writeString(12, "fmt ");
                view.setUint32(16, 16, true);
                view.setUint16(20, 1, true);
                view.setUint16(22, 1, true);
                view.setUint32(24, sampleRate, true);
                view.setUint32(28, sampleRate * 2, true); 
                view.setUint16(32, 2, true);
                view.setUint16(34, 16, true);
                writeString(36, "data");
                view.setUint32(40, numSamples * 2, true);
                for (let i = 0; i < numSamples; i++) {
                    view.setInt16(44 + i * 2, 0, true);
                }
                return buffer;
            }
            const wavBuffer = generateSilentWav(1);
            const binary = String.fromCharCode(...new Uint8Array(wavBuffer));
            const base64 = btoa(binary);
            const audio = new Audio(`data:audio/wav;base64,${base64}`);
            audio.loop = true;
            audio.volume = 1;
            await audio.play();
        } catch (error) { 
            this.exception(error, `${this.name_space}:getSilentChannel`);
        }
    }

    /**
     * @production
     * @error_handling
     * @function isMobileDevice
     * @description 
     *      Detects if the user is on a mobile device based on screen width and initializes audio channels if true.
     * 
     * @return {void}
     */
    isMobileDevice = function() {
        try {
            if (window.innerWidth <= 1270) {
                this.notify({ 
                    type: 'info', 
                    message: 'Mobile device detected. Please enable audio playback. If this prompt appeared in OBS, please increase the browser size.', 
                    duration: 10000 
                });
                this.isMobile = true;
                const forceInt = document.createElement('button');
                const data = `data:audio/mpeg;base64,SUQzBAAAAAAAI1RTU0UAAAAPAAADTGF2ZjU4Ljc2LjEwMAAAAAAAAAAAAAAA/+M4wAAAAAAAAAAAAEluZm8AAAAPAAAAAwAAAbAAqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqq1dXV1dXV1dXV1dXV1dXV1dXV1dXV1dXV1dXV1dXV1dXV////////////////////////////////////////////AAAAAExhdmM1OC4xMwAAAAAAAAAAAAAAACQDkAAAAAAAAAGw9wrNaQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA/+MYxAAAAANIAAAAAExBTUUzLjEwMFVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVV/+MYxDsAAANIAAAAAFVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVV/+MYxHYAAANIAAAAAFVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVV`;
                forceInt.classList.add('mobile-confirm');
                forceInt.innerText = 'Enable playback';
                document.body.appendChild(forceInt);
                forceInt.addEventListener('click', async () => {
                    this.audioChannels = [];
                    this.isAudioPlayable = true;
                    for (let i = 0; i < 6; i++) {
                        const audioChannel = new Audio();
                        audioChannel.src = data;
                        audioChannel.volume = 0.5;
                        audioChannel.play();
                        this.audioChannels.push(audioChannel);
                    }
                    this.getSilentChannel();
                    this.log(`Initialized ${this.audioChannels.length} audio channels for mobile`);
                    this.tts('', 0.8);
                    forceInt.remove();
                });
            }
        } catch (error) {
            this.exception(error, `${this.name_space}:isMobileDevice`);
        }
    }
  
    /**
     * @production
     * @function sleep
     * @description 
     *      Pauses execution for a specified duration.
     * 
     * @param {number} milliseconds - The duration to sleep in milliseconds.
     * @return {Promise} A promise that resolves after the specified duration.
     */
    sleep = async function(milliseconds) {
        return new Promise(resolve => setTimeout(resolve, milliseconds));
    }

    /**
     * @production
     * @error_handling
     * @function getIntColor
     * @description
     *      Retrieves a color based on intensity value from the configuration scheme.
     * 
     * @param {number} int - The intensity value to get the color for.
     * @return {string} The corresponding color in hex format.
     */
    getIntColor = function(int = 0) {
        try {
            const scheme = this.storage?.configurations?.color_intensity
            const levels = Object.keys(scheme).map(Number).sort((a, b) => a - b);
            let key = levels[0];
            for (const level of levels) { if (int >= level) { key = level; } else { break; } }
            return scheme[key] ?? `#ffffff`;
        } catch (error) {
            this.exception(error, `${this.name_space}:getIntColor`);
            return `#ffffff`;
        }
    }

    /**
     * @production
     * @error_handling
     * @function getEventColor
     * @description
     *      Retrieves a color based on event type from the configuration scheme.
     * 
     * @param {string} eventType - The event type to get the color for.
     * @return {string} The corresponding color in hex format.
     */
    getEventColor = function(eventType = `Tornado Warning`, getCurrentTheme = false) {
        try {
            const scheme = this.storage?.configurations?.themes
            if (getCurrentTheme) { 
                const events = this.storage?.events?.features ?? []
                const pulsepoint = this.storage.pulsepoint?.features ?? []
                const themes = Object.keys(scheme).filter(name =>
                    events.some(feature => feature?.properties?.event && feature.properties.event.trim().toLowerCase() === name.trim().toLowerCase()) ||
                    pulsepoint.some(feature => feature?.properties?.event && feature.properties.event.trim().toLowerCase() === name.trim().toLowerCase())
                );
                const matched = themes.map(name => ({name, ...scheme[name]}));
                if (matched.length) {
                    const selected = matched?.[0] ?? {};
                    const primary = selected?.primary ?? `#ffffff`;
                    const secondary = selected?.secondary ?? `#000000`;
                    return { primary, secondary, default: false };
                } else { 
                    const selected = scheme["Default"] ?? {};
                    const primary = selected?.primary ?? `#ffffff`;
                    const secondary = selected?.secondary ?? `#000000`;
                    return { primary, secondary, default: true };
                }
            }
            return {
                primary: scheme[eventType]?.primary ?? `#ffffff`,
                secondary: scheme[eventType]?.secondary ?? `#000000`,
                default: !scheme[eventType] ? true : false
            }
        } catch (error) {
            this.exception(error, `${this.name_space}:getEventColor`);
            return { primary: `#ffffff`, secondary: `#000000`, default: true };
        }
    }

    /**
     * @production
     * @error_handling
     * @function sound
     * @description
     *      Plays an audio file, managing multiple channels for mobile devices if necessary.
     * 
     * @param {string} url - The URL of the audio file to play.
     * @param {boolean} useChannels - Whether to use audio channels for mobile devices.
     * @return {void}
     */
    sound = function(url, volume = 1.0) {
        try {
            const audioUrl = `../assets${url}`;
            if (!this.isMobile) { 
                let audio = new Audio()
                    audio.src = audioUrl
                    audio.volume = isNaN(volume) ? 1.0 : volume;
                    audio.autoplay = true
                    audio.play()
                    audio.onended = () => {
                        audio.remove()
                        let index = this.audioQueue.indexOf(audio);
                        if (index > -1) {  this.audioQueue.splice(index, 1); }
                    }  
                this.audioQueue.push(audio)
            } else { 
                for (let channel of this.audioChannels) {
                    if (channel.ended || channel.paused) {
                        channel.src = audioUrl;
                        channel.autoplay = true;
                        channel.volume = isNaN(volume) ? 1.0 : volume;
                        channel.play();
                        if (!this.audioQueue) { this.audioQueue = [] }
                        this.audioQueue.push(channel);
                        channel.onended = () => {
                            let index = this.audioQueue.indexOf(channel);
                            if (index > -1) { this.audioQueue.splice(index, 1); }
                        };
                        break;
                    }
                }    
            }
        } catch (error) {
            this.exception(error, `${this.name_space}:play`);
        }
    }

    /**
     * @production
     * @error_handling
     * @function tts
     * @description
     *      Uses the Web Speech API to convert text to speech, with error handling for unsupported browsers.
     * 
     * @param {string} message - The text message to be spoken.
     * @param {number} volume - The volume level for the speech (0.0 to 1.0).
     * @return {void}
     */
    tts = function(message, volume = 1.0) {
        try { 
            if (!("speechSynthesis" in window)) return this.exception("Web Speech API is not supported in this browser.", `${this.name_space}:tts`);
            const speak = () => {
                const utterance = new SpeechSynthesisUtterance(message);
                utterance.rate = 1;
                utterance.pitch = 1;
                utterance.volume = volume;
                utterance.lang = 'en-US';
                window.speechSynthesis.speak(utterance)
            };
            speak();
        } catch (error) {
            this.exception(error, `${this.name_space}:tts`);
        }
    }

    /**
     * @production
     * @error_handling
     * @function getTextFromDirectory
     * @description
     *     Processes a directory string with placeholders and returns the formatted output.
     *     Placeholders are in the format %property.path% and will be replaced with corresponding values from the data object.
     *     If no placeholders are found, it attempts to directly access the property path from the data object.
     *     
     * 
     * @param {Object} data - The data object containing properties to replace in the directory string.
     * @param {string} directory - The directory string with placeholders in the format %property.path%.
     * @return {string} The formatted directory string with placeholders replaced by actual values.
     */
    getTextFromDirectory = function(data = {}, directory) {
        try {
            if (directory == null || directory === "") return null;
            if (!directory.includes('%')) {
                const pathSegments = directory.split('.').filter(Boolean);
                let value = data;
                for (const seg of pathSegments) {
                    value = value?.[seg];
                }
                return value != null ? value : null;
            }
            return directory.replace(/%([^%]+)%/g, (match, propPath) => {
                const alternatives = propPath.split('??').map(p => p.trim());
                for (const alt of alternatives) {
                    const pathSegments = alt.split('.').filter(Boolean);
                    let value = data;
                    for (const seg of pathSegments) {
                        value = value?.[seg];
                    }
                    if (value != null) return value;
                }
                return null
            });
        } catch (error) {
            this.exception(error, `${this.name_space}:aOutputDirectory`);
            return null
        }
    }

    /**
     * @production
     * @error_handling
     * @function setElementAnimation
     * @description
     *     Sets the animation for a DOM element based on provided settings and stage.
     * 
     * @param {HTMLElement} element - The DOM element to animate.
     * @param {Object} settings - The settings object containing animation properties.
     * @param {number} stage - The stage of the animation (0: end, 1: start, 2: ending).
     * @return {Promise<void>} A promise that resolves when the animation ends.
     */
    setElementAnimation = async function(element, settings, stage=0) { 
        if (!settings?.global?.setAnimated) return;
        element.style.animation = 'none';
        element.getBoundingClientRect();
        switch (stage) {
            case 0: element.style.animation = `${settings?.global?.setAnimationEndType ?? 'anim_fade_out'} 0.5s ease forwards`; break;
            case 1: element.style.animation = `${settings?.global?.setAnimationStartType ?? 'anim_fade_in'} ${settings?.global?.setAnimationStartDuration ?? 0.5}s ease forwards`; break;
            case 2: { 
                if (settings?.global?.setAnimationHasEnding) { 
                    if (settings?.global?.setAnimatedDelayEnding > 0) {
                        await this.sleep(settings?.global?.setAnimatedDelayEnding * 1000)
                    }
                    element.style.animation = `${settings?.global?.setAnimationEndType ?? 'anim_fade_out'} ${settings?.global?.setAnimationEndDuration ?? 0.5}s ease forwards`; break;
                }
            }
            default: break;
        }
        return new Promise(resolve => {
            const handleAnimationEnd = () => {
                element.removeEventListener('animationend', handleAnimationEnd);
                console.log('Animation ended for element:', element);
                resolve();
            };
            element.addEventListener('animationend', handleAnimationEnd);
        });
    }

    /**
     * @production
     * @error_handling
     * @function setString
     * @description
     *     Sets the text content of a DOM element with optional formatting based on settings.
     *     The function can apply prefixes, suffixes, character limits, and color theming based on the provided settings.
     * 
     * @param {HTMLElement} element - The DOM element whose text content is to be set.
     * @param {string} string - The string to set as the text content of the element.
     * @param {Object} settings - An object containing formatting options for the string.
     * @return {void}
     */
    setString = async function(element, string, settings, ignorePrefixSuffix=false) {
        // add a variable to the elemtn so we dont accidentally cal lthis twice

        function normalize(str) {
            return str.replace(/\u00A0/g, ' ').trim();
        }
        if (string == 'null' || string == null) {
            string = settings?.global?.setTextPlaceholder ?? 'N/A'
        }
        if (string.length > settings?.global?.setTextCharacterLimit) {
            string = string.substring(0, settings.global.setTextCharacterLimit) + '...';
        }
        let startingString = String(string);
        let generatedString = ``;
        const isNumber = String(string).match(/-?\d+(\.\d+)?/);
        const getNumber = isNumber ? Number(isNumber[0]) : NaN;
        const getNumberTheme = this.getIntColor(getNumber);
        const getEventTheme = this.getEventColor(String(string));
        const getCurrentContent = normalize(element.textContent);
        const getFutureContent = normalize(`${settings?.global?.setTextPrefix ?? ''}${settings?.global?.setTextPrefix ? ' ' : ''}${startingString}${settings?.global?.setTextSuffix ? ' ' : ''}${settings?.global?.setTextSuffix ?? ''}`.trim());
        const isTextTheSameAsBefore = getCurrentContent === getFutureContent;
        if (isTextTheSameAsBefore) { return }
        await this.setElementAnimation(element, settings, 0);
        if (settings?.global?.setTextPrefix && !ignorePrefixSuffix) { 
            generatedString += settings?.global?.setTextPrefix + '&nbsp;';
        }
        if (settings?.global?.setTextColorThemed) { 
            generatedString += `<p style="color: ${getEventTheme?.default == false ? getEventTheme.primary : getNumberTheme}">${string}</p>`;
        } else { 
            generatedString += string;
        }
        if (settings?.global?.setTextSuffix && !ignorePrefixSuffix) { 
            generatedString += '&nbsp;' + settings?.global?.setTextSuffix;
        }
        element.textContent = '';
        element.insertAdjacentHTML('beforeend', generatedString);
        await this.setElementAnimation(element, settings, 1);
        await this.setElementAnimation(element, settings, 2);

    }
}