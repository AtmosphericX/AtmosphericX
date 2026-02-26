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
    Discord: https://discord.gg/YAEjtzU3E8
    Ko-Fi: https://ko-fi.com/k3yomi
    Documentation: http://localhost/docs | https://atmosx.scriptkitty.cafe/docs

*/

import * as loader from '../..'

interface WebSocketClient {  
    client: any; 
    unix: number; 
    address: string; 
    requests: Record<string, any>; 
    hasSubscribed: boolean; 
}
export class Init { 
    name_space: string = `Websockets.Authority`;
    ansi_colors = loader.modules.utilities.ansi_colors;
    clients: WebSocketClient[] = [];
    pkg = loader.packages.ws;
    default_timeout_ms: number = 5_000;
    types = {
        onSubscription: 'subscribe',
        onFinished: 'update',
        onConnection: 'connection',
        onMessage: 'status',
    }
    constructor() {
        loader.modules.utilities.log({ 
            title: `${this.ansi_colors.GREEN}${this.name_space}${this.ansi_colors.RESET}`, 
            message: `Successfully initialized`
        });
        const getMessages = loader.strings.route_messages;
        const configurations = loader.modules.utilities.cfg();
        const options = configurations.websocket_settings
        const maxConnections = options.maximum_connections_per_ip ?? 3;
        const server = loader.cache.handlers.websocket_server = new this.pkg.WebSocketServer({
            server: loader.cache.handlers.http_server,
            path: `/stream`,
        })
        server.on(`connection`, (client: any, req: any) => {
            const address = req?.socket?.remoteAddress ?? null;
            const count = this.clients.filter(c => c.address === address).length;
            if (!address) {
                return client.close(4000, getMessages.websocket_invalid_address);
            }
            if (count >= maxConnections) {
                client.send(JSON.stringify({ type: this.types.onConnection, message: `${getMessages.websocket_connection_closed} (${maxConnections}).` }));
                return client.close(4001, getMessages.websocket_connection_closed);
            }
            this.clients.push({ client, unix: Date.now() - 1_000, address, requests: {}, hasSubscribed: false });
            client.on(`message`, (message: any) => this.onClientMessage(client, message));
            client.on(`close`, () => { this.clients = this.clients.filter(c => c.client !== client) });
        });
    }

    /**
     * @private
     * @production
     * @error_handling
     * @function onClientMessage
     * @description
     *      This function handles incoming messages from WebSocket clients.
     *      It processes the message, validates it, and responds accordingly.
     * 
     * @param {any} socket - The WebSocket client socket.
     * @param {string} message - The incoming message from the client.
     * @return {void}
     */
    private onClientMessage(socket: any, message: string): void {
        try {
            const getMessages = loader.strings.route_messages;
            const getClient = this.clients.findIndex(c => c.client === socket);
            const client = this.clients?.[getClient];
            const data = (() => { try { return JSON.parse(message); } catch { return null; } })();
            if (getClient === -1 || !client) return;
            if (client.hasSubscribed) {
                socket.send(JSON.stringify({ type: this.types.onMessage, message: getMessages.websocket_data_already_sent }));
                return socket.close(4003, getMessages.websocket_data_already_sent);
            }
            client.hasSubscribed = true;
            if (!data) { 
                socket.send(JSON.stringify({ type: this.types.onMessage, message: getMessages.websocket_invalid_request }));
                return socket.close(4002, getMessages.websocket_invalid_request);
            }
            if (!data?.type || !data?.message) {
                socket.send(JSON.stringify({ type: this.types.onMessage, message: getMessages.websocket_malformed }));
                return socket.close(4002, getMessages.websocket_malformed);
            }
            if (data?.type == this.types.onSubscription) {
                let request;
                try { request = typeof data.message === 'string' ? JSON.parse(data.message) : data.message; } catch { request = null; }
                if (!request) { 
                    socket.send(JSON.stringify({ type: this.types.onMessage, message: getMessages.websocket_malformed}));
                    return socket.close(4002, getMessages.websocket_malformed);
                }
                return this.onClientRequest(socket, client, request);
            }
        } catch (error) {
            loader.modules.utilities.exception(error, this.name_space + `.onClientMessage`);
        }
    }

    /**
     * @private
     * @production
     * @error_handling
     * @function onClientRequest
     * @description
     *     This function processes update requests from WebSocket clients.
     *     It checks the requested data types and sends the corresponding cached data back to the client.
     * 
     * @param {any} socket - The WebSocket client socket.
     * @param {WebSocketClient} client - The WebSocket client data.
     * @param {any} data - The requested data types from the client.
     * @return {void}
     */
    private onClientRequest(socket: any, client: WebSocketClient, data: any): void {
        try {
            const getMessages = loader.strings.route_messages;
            const configurations = loader.modules.utilities.cfg();
            const options = configurations.websocket_settings;
            const currentTime = Date.now();
            let isDataAwaiting = false;
            if (!Array.isArray(data)) { return; }
            if (!client.hasSubscribed) { return; }
            if (data[0] == `*`) {
                data = Object.keys(loader.cache.external);
            }
            data.forEach((request: string) => {
                if (!client.requests[request]) client.requests[request] = { unix: 0 };
                const cache = loader.cache.external[request as keyof typeof loader.cache.external] || null;
                const isPriority = options.priority_sockets.sockets.includes(request);
                const isSecondary = options.secondary_sockets.sockets.includes(request);
                const timeout = isPriority
                    ? options.priority_sockets.timeout : isSecondary
                    ? options.secondary_sockets.timeout : this.default_timeout_ms / 1_000;
                const ms = timeout * 1_000;
                if (currentTime - client.requests[request].unix < ms) {
                    return 
                }
                isDataAwaiting = true;
                client.requests[request].unix = currentTime;
                try { 
                    socket.send(JSON.stringify({ type: this.types.onSubscription, message: cache, value: request }));
                } catch (error) {
                    loader.modules.utilities.exception(error, this.name_space + `.onClientRequest`);
                }
            });
            if (!isDataAwaiting) { return; }
            socket.send(JSON.stringify({ type: this.types.onFinished, message: getMessages.websocket_update_success }));
        } catch (error) {
            loader.modules.utilities.exception(error, this.name_space + `.onClientRequest`);
        }
    }

    /**
     * @public
     * @production
     * @function sendUpdateToClients
     * @description
     *      This function iterates through all connected WebSocket clients and triggers an update for each.
     *      It calls the onClientRequest method for each client to send the latest requested data.
     * 
     * @return {void}
     */
    public sendUpdateToClients(): void {
        for (const data of this.clients) {
            this.onClientRequest(data.client, data, Object.keys(data.requests));
        }
    }
}

export default Init;