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

import * as loader from '../../..'
import * as types from '../../../@dictionaries/types';

export class Init { 
    name_space: string = `Routes.Core.Widgets`;
    ansi_colors = loader.modules.utilities.ansi_colors;
    server = loader.cache.handlers.express;
    constructor() {
        loader.modules.utilities.log({ 
            title: `${this.ansi_colors.GREEN}${this.name_space}${this.ansi_colors.RESET}`, 
            message: `Successfully initialized`
        });
        const getRoutes = loader.strings.route_locations;
        const storage = loader.packages.path.resolve(`..`, `storage`);
        this.server.get(getRoutes.get_widgets_endpoint, async (request: types.ExpressRequest, response: types.ExpressResponse) => {
            try {
                const getEndpoint  = request.params.endpoint ?? null;
                if (!getEndpoint || !loader.packages.fs.existsSync(`${storage}${getRoutes.widgets_direct_path}${getEndpoint}.html`)) {
                    return response.sendFile(`${storage}${getRoutes.unknown_direct_path}`);
                }
                return response.sendFile(`${storage}${getRoutes.widgets_direct_path}${getEndpoint}.html`);
            } catch (error) {
                loader.modules.utilities.exception(error, `${this.name_space}/GET ${getRoutes.get_dashboard_endpoint}`);
                return response.status(500).sendFile(`${storage}${getRoutes.unknown_direct_path}`);
            }
        })
    }
}

export default Init;