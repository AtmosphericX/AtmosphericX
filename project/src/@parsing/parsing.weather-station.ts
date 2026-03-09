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

*/

export const parse = (body: Record<string, string>) => {
    return [
        {
            type: `Feature`,
            geometry: {
                type: `Point`,
                coordinates: [body.longitude, body.latitude]
            },
            properties: {
                temperature: body.temperature ?? null,
                dewpoint: body.dewpoint ?? null,
                humidity: body.humidity ?? null,
                wind_speed: body.wind_speed ?? null,
                wind_direction: body.wind_direction ?? null,
                conditions: body.conditions
                    ?.split(' ')
                    ?.map(word => word.charAt(0)
                                    ?.toUpperCase() + word.slice(1))
                                    ?.join(' ') ?? null,
                location: body.location ?? null,
            }
        }
    ]
};

