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
    NAME_SPACE: string = `submodule:@routes:core`;
    PORTAL_DIRECT: string = `/www/__pages/__portal/index.html`
    DASHBOARD_DIRECT: string = `/www/__pages/__dashboard/index.html`
    WIDGETS_DIRECT: string = `/www/__pages/__widgets/`
    UNKNOWN_DIRECTORY: string = `/www/__pages/__404/index.html`
    constructor() {
        loader.submodules.utils.log(`${this.NAME_SPACE} initialized.`)
        const parentDirectory = loader.packages.path.resolve(`..`, `storage`);
        loader.cache.handlers.express.get(`/`, (request: Record<string, any>, response: Record<string, any>) => { 
            try {
                const ConfigType = loader.cache.internal.configurations as types.ConfigurationsType;
                const isPortal = ConfigType.web_hosting_settings.is_login_required;
                const isLogon = loader.cache.internal.accounts.find(a => a.session == request.headers.cookie?.split(`=`)[1]);
                if (isPortal && !isLogon) { return response.sendFile(`${parentDirectory}${this.PORTAL_DIRECT}`); } 
                return response.sendFile(`${parentDirectory}${this.DASHBOARD_DIRECT}`);
            } catch (error) {
                loader.submodules.utils.log(`${this.NAME_SPACE} ERROR: ${error.message}`);
                return response.status(500).json({ message: `Internal server error.` });
            }
        })
        loader.cache.handlers.express.get(`/widgets/:endpoint?`, (request: Record<string, any>, response: Record<string, any>) => { 
            try {
                if (!request.params.endpoint) { 
                    return response.sendFile(`${parentDirectory}${this.UNKNOWN_DIRECTORY}`);
                }
                if (!loader.packages.fs.existsSync(`${parentDirectory}${this.WIDGETS_DIRECT}${request.params.endpoint}.html`)) { 
                    return response.sendFile(`${parentDirectory}${this.UNKNOWN_DIRECTORY}`);
                }
                return response.sendFile(`${parentDirectory}${this.WIDGETS_DIRECT}${request.params.endpoint}.html`);
            } catch (error) {
                loader.submodules.utils.log(`${this.NAME_SPACE} ERROR: ${error.message}`);
                return response.status(500).json({ message: `Internal server error.` });
            }
        })
    }
}

export default Init;

