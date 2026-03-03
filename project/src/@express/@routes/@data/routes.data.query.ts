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
    Discord: https://atmosphericx-discord.scriptkitty.cafe
    Ko-Fi: https://ko-fi.com/k3yomi
    Documentation: http://localhost/documentation | https://atmosphericx.scriptkitty.cafe/documentation

*/

import * as loader from '../../..'
import * as types from '../../../@dictionaries/types';

type StanzaType = { 
    id: string; 
    stanza: string;
};

export class Init { 
    name_space: string = `Routes.Data.Query`;
    ansi_colors = loader.modules.utilities.ansi_colors;
    server = loader.cache.handlers.express;
    constructor() {
        loader.modules.utilities.log({ 
            title: `${this.ansi_colors.GREEN}${this.name_space}${this.ansi_colors.RESET}`, 
            message: `Successfully initialized`
        });
        const getMessages = loader.strings.route_messages;
        const getRoutes = loader.strings.route_locations;
        const storage = loader.packages.path.resolve(`..`, `storage`);
        this.server.get(getRoutes.get_query_endpoint, async (request: types.ExpressRequest, response: types.ExpressResponse) => {
            try {
                const getType = request.params.type ?? null;
                const getQuery = request.query.q ?? null;
                const getLimit = request.query.limit ? parseInt(request.query.limit as string) : 10;
                switch (getType) {
                    case `stanza`:
                        if (loader.cache.handlers.parser_client === null) { 
                            return response.status(500).json({ message: getMessages.response_generic_error });
                        }
                        if (!getQuery) return response.json({ error: getMessages.response_generic_error });
                        const query = await loader.cache.handlers.parser_client.searchStanzaDatabase(getQuery, getLimit);
                        return response.json({ total_results: query.length, results: query.map((result: StanzaType) => ({
                            id: result.id,
                            message: JSON.parse(result.stanza).message,
                            attributes: JSON.parse(result.stanza).attributes
                        })) });
                    default:
                        return response.status(400).json({ message: getMessages.response_unknown_endpoint });
                }
            } catch (error) {
                loader.modules.utilities.exception(error, `${this.name_space}/GET ${getRoutes.get_query_endpoint}`);
                return response.status(500).sendFile(`${storage}${getRoutes.unknown_direct_path}`);
            }
        })
    }
}

export default Init;