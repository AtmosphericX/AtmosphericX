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
    Documentation: http://localhost/documentation | https://atmosx-secondary.scriptkitty.cafe/documentation

*/

import * as loader from '../../..'
import * as types from '../../../@dictionaries/types';

export class Init { 
    name_space: string = `Routes.Core.Dashboard`;
    ansi_colors = loader.modules.utilities.ansi_colors;
    server = loader.cache.handlers.express;
    constructor() {
        loader.modules.utilities.log({ 
            title: `${this.ansi_colors.GREEN}${this.name_space}${this.ansi_colors.RESET}`, 
            message: `Successfully initialized`
        });
        const getRoutes = loader.strings.route_locations;
        const storage = loader.packages.path.resolve(`..`, `storage`);
        this.server.get(getRoutes.get_dashboard_endpoint, async (request: types.ExpressRequest, response: types.ExpressResponse) => {
            try {
                const tick = performance.now();
                let setPath = `${storage}${getRoutes.dashboard_direct_path}`;
                const configurations = loader.modules.utilities.cfg();
                const isSetupFinished = loader.cache.external.setup == 0 ? false : true;
                const isPortal = configurations.web_hosting_settings.is_login_required ?? false;
                const { session } = await loader.modules.routing.getUserSession(request);
                if (isPortal && !session) { 
                    setPath = `${storage}${getRoutes.portal_direct_path}`;
                }
                if (!isSetupFinished) { 
                    loader.cache.internal.setup_auth_code = Math.floor(1000 + Math.random() * 9000);
                    loader.modules.utilities.log({ 
                        title: `${this.ansi_colors.YELLOW}${this.name_space}${this.ansi_colors.RESET}`, 
                        message: `Setup authentication code generated: ${this.ansi_colors.RED}${loader.cache.internal.setup_auth_code}${this.ansi_colors.RESET}` 
                    });
                    setPath = `${storage}${getRoutes.setup_direct_path}`;
                }
                loader.modules.utilities.log({
                    title: `${this.ansi_colors.GREEN}${this.name_space}${this.ansi_colors.RESET}`,
                    message: `GET ${getRoutes.get_dashboard_endpoint} - ${(performance.now() - tick).toFixed(2)}ms`
                });
                return response.sendFile(setPath, { 
                    headers: { 
                        'Cache-Control': 'private, no-store, max-age=0, must-revalidate', 
                        'Pragma': 'no-cache', 'Expires': '0', 
                        'Surrogate-Control': 'no-store', 'Vary': 'Cookie', 
                        'Last-Modified': new Date(0).toUTCString() 
                    }, etag: false 
                });
            } catch (error) {
                loader.modules.utilities.exception(error, `${this.name_space}/GET ${getRoutes.get_dashboard_endpoint}`);
                return response.status(500).sendFile(`${storage}${getRoutes.unknown_direct_path}`);
            }
        })
    }
}

export default Init;