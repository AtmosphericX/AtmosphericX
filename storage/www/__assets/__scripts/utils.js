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

class Utils { 
    constructor(streaming = false) {
        this.NAME_SPACE = `webmodule:utils`;
        this.log(`${this.NAME_SPACE} initialized.`);
        this.storage = [];
        this.streaming = streaming;
    }

    /**
     * @function log
     * @description Logs a message with a timestamp and the script name.
     * 
     * @param {string} message - The message to log.
     */
    log = function(message) { 
        console.log(`[${new Date().toISOString()}] ${message}`);
    }

    /**
     * @function setStreaming
     * @description Sets the streaming status.
     * 
     * @param {boolean} boolean - The streaming status to set.
     */
    setStreaming = function(boolean = false) {
        this.streaming = boolean;
    }

    /**
     * @function isMobileDevice
     * @description Detects if the user is on a mobile device based on screen width and initializes audio channels if true.
     */
    isMobileDevice = function() {
        if (window.innerWidth <= 1270) {
            this.storage.mobile = true;
            const forceInt = document.createElement('button');
            forceInt.classList.add('mobile-confirm');
            forceInt.innerText = 'Enable playback';
            document.body.appendChild(forceInt);
            forceInt.addEventListener('click', async () => {
                this.storage.channels = [];
                this.storage.playable = true;
                for (let i = 0; i < 6; i++) {
                    const audioChannel = new Audio();
                    audioChannel.src = `data:audio/mpeg;base64,SUQzBAAAAAAAI1RTU0UAAAAPAAADTGF2ZjU4Ljc2LjEwMAAAAAAAAAAAAAAA/+M4wAAAAAAAAAAAAEluZm8AAAAPAAAAAwAAAbAAqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqq1dXV1dXV1dXV1dXV1dXV1dXV1dXV1dXV1dXV1dXV1dXV////////////////////////////////////////////AAAAAExhdmM1OC4xMwAAAAAAAAAAAAAAACQDkAAAAAAAAAGw9wrNaQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA/+MYxAAAAANIAAAAAExBTUUzLjEwMFVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVV/+MYxDsAAANIAAAAAFVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVV/+MYxHYAAANIAAAAAFVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVV`; // silent audio
                    audioChannel.volume = 0.5;
                    try {
                        audioChannel.play();
                        this.storage.channels.push(audioChannel);
                    } catch (e) {
                        console.log('Audio play failed:', e);
                    }
                }
                this.log(`Initialized ${this.storage.channels.length} audio channels for mobile`);
                forceInt.remove();
            });
        }
    }


    /**
     * @function websocket
     * @description Establishes a WebSocket connection to the server for real-time data updates.
     * 
     * @param {Array} types - An array of event types to subscribe to.
     * @returns {Promise} A promise that resolves when the WebSocket connection is established.
     */
    websocket = async function(types = ['configurations']) {
        return new Promise((resolve) => {
            const url = `${window.location.protocol == `https:` ? `wss:` : `ws:`}//${window.location.hostname}:${window.location.port}/stream`
            this.storage.socket = new WebSocket(url);
            this.storage.socket.addEventListener('open', () => {
                this.log(`WebSocket connection established.`);
                for (let type of types) {
                    this.log(`Subscribed to event type: ${type}`);
                }
                this.storage.socket.send(JSON.stringify({ type: 'eventRequest', message: types }));
                resolve();
            })
            this.storage.socket.addEventListener('close', () => {
                this.storage.socket.close()
                this.storage.socket = null
                setTimeout(() => { this.websocket(types) }, 1000)
            });
            this.storage.socket.addEventListener('message', (event) => {
                const data = JSON.parse(event.data)
                const type = data.type || null;
                const message = data.message || null;
                const value = data.value || null;
                if (type === 'eventUpdate' && message != null) { this.storage[value] = message; }
                if (type === `eventUpdateFinished`) { 
                    setTimeout(() => { document.dispatchEvent(new Event('eventCacheUpdated')); }, 100);
                }
            })
        })
    }

    /**
     * @function notify
     * @description Displays a notification message on the screen.
     * 
     * @param {string} type - The type of notification (e.g., 'success', 'error', 'info').
     * @param {string} message - The notification message to display.
     * @param {number} duration - The duration in milliseconds for which the notification should be displayed.
     */
    notify = function(type, message, duration = 5000) {
        const container = document.getElementById('notification-container');
        if (!container) { return 'Notification container not found.'; }
        const notify = document.createElement('div');
            notify.classList.add('notification', type);
            notify.innerText = message;
        const notifyBar = document.createElement('div');
            notifyBar.classList.add('notification-bar');
        const progress = document.createElement('div');
            progress.classList.add('notification-progress', type);
            progress.style.transition = `width ${duration}ms linear`;
            notifyBar.appendChild(progress);
            notify.appendChild(notifyBar);
            container.appendChild(notify);
        requestAnimationFrame(() => { progress.style.width = '0%' });
        setTimeout(() => {
            notify.classList.add('fade-out');
            setTimeout(() => { if (notify.parentNode === container) container.removeChild(notify); }, 500);
        }, duration);
    }

    /**
     * @function makeRequest
     * @description Makes an HTTP request to the specified URL with given options.
     * 
     * @param {string} url - The URL to which the request is made.
     * @param {object} options - The options for the fetch request (method, headers, body, etc.).
     * @returns {Promise<Response|null>} A promise that resolves to the response object or null if an error occurs.
     */
    makeRequest = async function(url, options = {}) {
        try { 
            const dOptions = { method: 'GET', ...options };
            const response = await fetch(url, dOptions);
            return response;
        } catch (error) { 
            return null;
        }
    }

    /**
     * @function earth2Coordinates
     * @description Calculates new geographic coordinates based on an initial point, distance, and bearing.
     * 
     * @param {number} longitude - The starting longitude in degrees.
     * @param {number} latitude - The starting latitude in degrees.
     * @param {number} distMeters - The distance to move from the starting point in meters.
     * @param {number} bearingDegrees - The bearing (direction) in degrees from the starting point.
     * @returns {Array<number>} An array containing the new longitude and latitude in degrees.
     */
    earth2Coordinates = function(longitude, latitude, distMeters, bearingDegrees) {
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
    }

    /**
     * @function calculateDistance
     * @description Calculates the distance in miles between two geographic coordinates using the Haversine formula.
     * 
     * 
     * @param {Array<number>} coodinatesA - An array containing the longitude and latitude of the first point in degrees.
     * @param {Array<number>} coordinatesB - An array containing the longitude and latitude of the second point in degrees.
     * @returns {number} The distance between the two points in miles.
     */
    calculateDistance = function(coordinatesA, coordinatesB) {
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
    }

    /**
     * @function getCurrentTime
     * @description Retrieves the current time formatted as a string, with options for timezone and 24-hour format.
     * 
     * @param {string|null} selectedTimezone - The timezone identifier (e.g., 'America/New_York'). If null, uses local timezone.
     * @param {boolean} militaryTime - If true, returns time in 24-hour format; otherwise, in 12-hour format.
     * @returns {string} The formatted current time string.
     */
    getCurrentTime = function(selectedTimezone = null, militaryTime = false) {
        const options = { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: !militaryTime };
        if (selectedTimezone) { options.timeZone = selectedTimezone; }
        let formatted = new Intl.DateTimeFormat('en-US', options).format(new Date());
        if (militaryTime) {
            formatted = formatted.replace(/\s?(AM|PM)$/i, '');
        }
        return formatted;
    }

    /**
     * @function getCurrentDate
     * @description Retrieves the current date formatted as a string, with an option for timezone.
     * 
     * @param {string|null} selectedTimezone - The timezone identifier (e.g., 'America/New_York'). If null, uses local timezone.
     * @returns {string} The formatted current date string.
     */
    getCurrentDate = function(selectedTimezone = null) {
        const date = new Date();
        const formatDate = (dateObj) => {
            return dateObj.toLocaleString('en-US', { month: 'short', day: 'numeric' })
                .replace(/^([A-Za-z]+)/, (m) => m.toUpperCase())
                .replace(/(\d+)$/, (d) => {
                    const n = parseInt(d, 10);
                    const s = ["th", "st", "nd", "rd"], v = n % 100;
                    return n + (s[(v - 20) % 10] || s[v] || s[0]);
                });
        };
        if (selectedTimezone) {
            const localeDate = new Date(date.toLocaleString('en-US', { timeZone: selectedTimezone }));
            return formatDate(localeDate);
        } else {
            return formatDate(date);
        }
    }

    /**
     * @function getCountdown
     * @description Calculates the countdown time from the current time to a target time.
     * 
     * @param {number} targetTime - The target time in milliseconds since the epoch.
     * @returns {string} A string representing the countdown in hours, minutes, and seconds.
     */
    getCountdown = function(targetTime) {
        const now = new Date().getTime();
        const distance = targetTime - now;
        if (isNaN(distance)) { return "No Date Found"}
        const hours = Math.floor(distance / (1000 * 60 * 60));
        const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((distance % (1000 * 60)) / 1000);
        if (hours === 0 && minutes === 0 && seconds === 0) { return "Now..." }
        if (hours > 9999) { return "Until Further Notice" }
        return `${hours} hours ${minutes} minutes ${seconds.toString().padStart(2, '0')} seconds`;
    }

    /**
     * @function initializeStorage
     * @description Initializes a storage key with a default value if it does not already exist.
     * 
     * @param {string|null} key - The storage key to initialize.
     * @param {any} defaultValue - The default value to assign if the key does not exist.
     */
    initializeStorage = function(key = null, defaultValue = null) {
        if (key == null) { return; }
        if (this.storage[key] == null) { 
            this.storage[key] = defaultValue; 
            this.log(`Initialized storage key: ${key}`);
        }
    }

    /**
     * @function sleep
     * @description Pauses execution for a specified duration.
     * 
     * @param {number} milliseconds - The duration to sleep in milliseconds.
     * @returns {Promise} A promise that resolves after the specified duration.
     */
    sleep = async function(milliseconds) {
        return new Promise(resolve => setTimeout(resolve, milliseconds));
    }

    /**
     * @function play
     * @description Plays an audio file from the specified URL.
     * 
     * @param {string} url - The URL of the audio file to play.
     * @param {boolean} useChannels - If true, uses audio channels to manage playback.
     */
    play = function(url, useChannels = false) {
        if (this.storage.mobile && !this.storage.channels?.length) return;
        const audioUrl = `../src${url}`;
        const registerAudio = (audioInstance) => {
            this.storage.currentPlaying ||= [];
            this.storage.currentPlaying.push(audioInstance);
            audioInstance.onended = () => {
                const index = this.storage.currentPlaying.indexOf(audioInstance);
                if (index > -1) this.storage.currentPlaying.splice(index, 1);
                if (useChannels) this.storage.playable = true;
            };
        };
        const playAudio = (audioInstance) => {
            audioInstance.src = audioUrl;
            audioInstance.volume = 1.0;
            audioInstance.autoplay = true;
            audioInstance.play();
            registerAudio(audioInstance);
        };
        if (!this.storage.mobile) {
            if (useChannels && !this.storage.playable) return;
            if (useChannels) this.storage.playable = false;
            const audio = new Audio();
            playAudio(audio);
            return;
        }
        if (useChannels && !this.storage.playable) return;
        const channelsToUse = useChannels ? [this.storage.channels[0]]
            : this.storage.channels;
        if (useChannels) this.storage.playable = false;
        for (const channel of channelsToUse) {
            if (!channel.paused && !channel.ended) continue;
            playAudio(channel);
            break;
        }
    }
}

