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
    constructor() {
        this.NAME_SPACE = `webmodule:utils`;
        this.log(`${this.NAME_SPACE} initialized.`);
        this.storage = [];
    }

    /**
     * @function log
     * @description Logs a message with a timestamp and the script name.
     * 
     * @param {string} message - The message to log.
     */
    log = function(message) { 
        console.log(`[${new Date().toISOString()}] [${this.NAME_SPACE}] ${message}`);
    }

    /**
     * @function websocket
     * @description Establishes a WebSocket connection to the server for real-time data updates.
     * 
     * @param {Array} types - An array of event types to subscribe to.
     * @returns {Promise} A promise that resolves when the WebSocket connection is established.
     */
    websocket = async function(types = ['configurations']) {
        return new Promise(() => {
            const url = `${window.location.protocol == `https:` ? `wss:` : `ws:`}//${window.location.hostname}:${window.location.port}/stream`
            this.storage.socket = new WebSocket(url);
            this.storage.socket.addEventListener('open', () => {
                this.log(`WebSocket connection established.`);
                this.storage.socket.send(JSON.stringify({ type: 'eventRequest', message: types }));
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
}

