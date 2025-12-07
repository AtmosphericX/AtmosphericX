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

import * as loader from '../../bootstrap';
import * as types from '../../types';



export class Routes {
    NAME_SPACE: string = `submodule:routing`;
    PACKAGE: typeof loader.packages.express;
    CLIENTS: types.WebSocketClient[] = [];
    constructor() {
        this.initialize();
    }

    private async initialize(): Promise<void> {
        loader.submodules.utils.log(`${this.NAME_SPACE} initialized.`);
        const ConfigType = loader.cache.internal.configurations as types.ConfigurationsType;
        const isHttps = ConfigType.web_hosting_settings.settings.is_https;
        const isPortal = ConfigType.web_hosting_settings.is_login_required;
        const getPort = ConfigType.web_hosting_settings.settings.port_number;
        const getCertificates = isHttps ? this.getCertificates() : null;
        this.PACKAGE = loader.cache.handlers.express = loader.packages.express();
        if (isHttps) {
            loader.cache.handlers.websocket = loader.packages.https.createServer(getCertificates, this.PACKAGE).listen(getPort, () => {}).on('error', (error) => {
                loader.submodules.utils.log(`${this.NAME_SPACE} ERROR: Failed to start HTTPS server on port ${getPort}: ${error.message}`);
            });
        } else {
            loader.cache.handlers.websocket = loader.packages.http.createServer(this.PACKAGE).listen(getPort, () => {}).on('error', (error) => {
                loader.submodules.utils.log(`${this.NAME_SPACE} ERROR: Failed to start HTTP server on port ${getPort}: ${error.message}`);
            });
        }
        if (!isPortal) {
            loader.submodules.utils.log(`${loader.strings.portal_disabled_warning}`, { echoFile: true });
        }
        loader.submodules.middleware = new (await import('./@middleware/authority')).Init();
        loader.submodules.websockets = new (await import('./@websockets/general')).Init();
        new (await import('./@routes/login')).Init();
        new (await import('./@routes/logout')).Init();
        new (await import('./@routes/signup')).Init();
        new (await import('./@routes/core')).Init();
        new (await import('./@routes/data')).Init();
    }

    /**
     * @function getCertificates
     * @description
     *      Retrieves SSL certificates for HTTPS configuration.
     *  
     *  @returns {void}
     */
    private getCertificates(): types.CertificateCollection {
        const ConfigType = loader.cache.internal.configurations as types.ConfigurationsType;
        if (!ConfigType.web_hosting_settings.settings.is_https) {
            loader.submodules.utils.log(`${this.NAME_SPACE} ERROR: Tried to get SSL certificates while HTTPS is disabled in the configuration file.`);
        }
        const keyPath = ConfigType.web_hosting_settings.settings.certification_paths.private_key_path;
        const certPath = ConfigType.web_hosting_settings.settings.certification_paths.certificate_path;
        if (!loader.packages.fs.existsSync(keyPath)) { loader.submodules.utils.log(`${this.NAME_SPACE} ERROR: SSL key file not found at: ${keyPath}`); }
        if (!loader.packages.fs.existsSync(certPath)) { loader.submodules.utils.log(`${this.NAME_SPACE} ERROR: SSL certificate file not found at: ${certPath}`); }
        return { 
            key: loader.packages.fs.readFileSync(keyPath),
            certificate: loader.packages.fs.readFileSync(certPath)
        }
    }

    /**
     * @function onUpdateRequest
     * @description
     *      Handles periodic update requests for all connected WebSocket clients.
     *      Sends updated data based on each client's registered requests.
     * 
     *  @returns {void}
     */
    public onUpdateRequest(): void {
        loader.submodules.websockets.updateClients();
    }
}
export default Routes;
