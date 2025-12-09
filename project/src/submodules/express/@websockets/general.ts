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


import * as loader from '../../../bootstrap';
import * as types from '../../../types';

export class Init { 
    NAME_SPACE: string = `submodule:@websockets:general`;
    CLIENTS: types.WebSocketClient[] = [];
    SESSION_CONNECTION_ESTABLISHED_MESSAGE: string = `WebSocket connection established.`
    SESSION_CONNECTION_CLOSED_MESSAGE: string = `Connection limited reached - Closing connection.`
    SESSION_INITIAL_DATA_SENT_MESSAGE: string = `Initial data already sent - Closing connection.`
    SESSION_INVALID_IP_MESSAGE: string = `Invalid IP address - Closing connection.`
    SESSION_INVALID_REQUEST_MESSAGE: string = `Invalid request payload - Closing connection.`
    SESSION_MALFORMED_MESSAGE: string = `Malformed data - Closing connection.`
    SESSION_UNKNOWN_TYPE_MESSAGE: string = `Unknown data type - Closing connection.`
    SESSION_UPDATE_SUCCESS_MESSAGE: string = `Requested data update successful.`
    DEFAULT_TIMEOUT_MS: number = 5_000;
    constructor() {
        loader.submodules.utils.log(`${this.NAME_SPACE} initialized.`)
        const cfg = loader.cache.internal.configurations as types.ConfigurationsType;
        const max = cfg.websocket_settings.maximum_connections_per_ip ?? 3;
        const wss = loader.cache.handlers.socket = new loader.packages.ws.WebSocketServer({
            server: loader.cache.handlers.websocket,
            path: '/stream'
        });
        wss.on('connection', (client: any, req: any) => {
            const ip = req?.socket?.remoteAddress ?? 'unknown';
            if (ip === 'unknown') return client.close(4000, this.SESSION_INVALID_IP_MESSAGE);
            const count = this.CLIENTS.filter(c => c.address === ip).length;
            if (count >= max) {
                try { if (client.readyState === loader.packages.ws.OPEN) client.send(JSON.stringify({ type: 'eventConnection', message: `${this.SESSION_CONNECTION_CLOSED_MESSAGE} (${max}).` })); } catch {}
                return client.close(4001, this.SESSION_CONNECTION_CLOSED_MESSAGE);
            }
            this.CLIENTS.push({ client, unix: Date.now() - 1_000, address: ip, requests: {}, hasSentInitialData: false });
            try { if (client.readyState === loader.packages.ws.OPEN) client.send(JSON.stringify({ type: 'eventConnection', message: this.SESSION_CONNECTION_ESTABLISHED_MESSAGE })); } catch {}
            client.on('message', (msg: any) => this.onWebsocketClientMessage(client, msg));
            client.on('close', () => { this.CLIENTS = this.CLIENTS.filter(c => c.client !== client); });
        });
        loader.submodules.utils.log(`WebSocket server listening on /stream`);
    }

    /**
     * @function onWebsocketClientMessage
     * @description
     *      Handles incoming messages from WebSocket clients.
     *      Processes requests for data updates and manages client state.
     *      
     * @param {any} socket - The WebSocket client socket.
     * @param {string} message - The incoming message from the client.
     * @returns {void}
     */
    private onWebsocketClientMessage(socket: any, message: string): void {
        const index = this.CLIENTS.findIndex(c => c.client === socket);
        if (index === -1) return;
        const clientData = this.CLIENTS[index];
        if (!clientData) return;
        if (clientData.hasSentInitialData) { 
            socket.send(JSON.stringify({ type: 'eventMessage', message: this.SESSION_INITIAL_DATA_SENT_MESSAGE }));
            return socket.close(4002, 'Initial data already sent');
        }
        clientData.hasSentInitialData = true;
        const data = (() => { try { return JSON.parse(message); } catch { return null; } })();
        if (!data) { socket.send(JSON.stringify({ type: 'eventMessage', message: this.SESSION_INVALID_REQUEST_MESSAGE })); return socket.close(4002, this.SESSION_INVALID_REQUEST_MESSAGE); }
        if (!data?.type || !data?.message) { socket.send(JSON.stringify({ type: 'eventMessage', message: this.SESSION_MALFORMED_MESSAGE })); return socket.close(4002, this.SESSION_MALFORMED_MESSAGE); }
        if (data.type === 'eventRequest') {
            let requestData;
            try { requestData = typeof data.message === 'string' ? JSON.parse(data.message) : data.message; } catch { requestData = null; }
            if (!requestData) { socket.send(JSON.stringify({ type: 'eventMessage', message: this.SESSION_MALFORMED_MESSAGE })); return socket.close(4002, this.SESSION_MALFORMED_MESSAGE); }
            return this.onWebsocketClientUpdate(socket, clientData, requestData);
        }
        socket.send(JSON.stringify({ type: 'eventMessage', message: this.SESSION_UNKNOWN_TYPE_MESSAGE }));
        socket.close(4002, this.SESSION_UNKNOWN_TYPE_MESSAGE);
    }

    /**
     * @function onWebsocketClientUpdate
     * @description
     *      Handles update requests from WebSocket clients.
     *      Sends updated data based on the client's registered requests.
     * 
     * @param {any} socket - The WebSocket client socket.
     * @param {types.WebSocketClient} clientData - The client's data object.
     * @param {string[]} data - The list of requested data types.
     * @returns {void}
     */
    private onWebsocketClientUpdate(socket: any, clientData: types.WebSocketClient, data: string[]): void {
        const InternalConfig = loader.cache.internal.configurations as types.ConfigurationsType;
        if (!Array.isArray(data)) return;
        const now = Date.now();
        let isQueued = false;
        if (data[0] === '*') {
            data = Object.keys(loader.cache.external);
        }
        data.forEach((request: string) => {
            if (!clientData.requests[request]) clientData.requests[request] = { unix: 0 };
            const isPriority = InternalConfig.websocket_settings.priority_sockets.sockets.includes(request);
            const isSecondary = InternalConfig.websocket_settings.secondary_sockets.sockets.includes(request);
            const timeout = isPriority
                ? InternalConfig.websocket_settings.priority_sockets.timeout
                : isSecondary
                ? InternalConfig.websocket_settings.secondary_sockets.timeout
                : this.DEFAULT_TIMEOUT_MS / 1_000;
            const timeoutMs = timeout * 1_000;
            if (now - clientData.requests[request].unix < timeoutMs) { return; }
            clientData.requests[request].unix = now;
            const cache = loader.cache.external[request as keyof typeof loader.cache.external] || null;
            try { socket.send(JSON.stringify({ type: 'eventUpdate', message: cache, value: request })); } catch {}
            isQueued = true;
        });
        if (isQueued) { socket.send(JSON.stringify({ type: 'eventUpdateFinished', message: this.SESSION_UPDATE_SUCCESS_MESSAGE })); }
    }

    /**
     * @function updateClients
     * @description
     *     Sends periodic update requests for all connected WebSocket clients.  
     * 
     * @returns {void}
     */
    public updateClients(): void {
        for (const clientData of this.CLIENTS) {
            loader.submodules.websockets.onWebsocketClientUpdate(clientData.client, clientData, Object.keys(clientData.requests));
        }
    }

}

export default Init;

