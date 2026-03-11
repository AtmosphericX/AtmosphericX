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

type OutageTypes = { 
    summary: {
        priority: string;
        tracked_customers: number;
        outaged_customers: number;
    },
    data: {
        fips: string; 
        state: string; 
        tracked: number; 
        outaged: number 
    }[]
}

type OutageFeature = {
    US_State_FIPS: string;
    StateName: string;
    CustomersTracked: number;
    CustomersOut: number;
}

export const parse = (body: Record<string, string>) => {
    const structure: OutageTypes['data'] = [];
    let totalTracked = 0;
    let totalOut = 0;
    let stateWithMostOutages = '';
    let maxOutages = 0;
    for (const feature of (body.states as unknown) as OutageFeature[]) {
        structure.push({
            fips: feature.US_State_FIPS ?? null,
            state: feature.StateName ?? null,
            tracked: feature.CustomersTracked ?? null,
            outaged: feature.CustomersOut ?? null,
        });
        totalTracked += feature.CustomersTracked;
        totalOut += feature.CustomersOut;
        if (feature.CustomersOut > maxOutages) {
            maxOutages = feature.CustomersOut;
            stateWithMostOutages = feature.StateName;
        }
    }
    const summary = {
        total_customers: totalTracked ?? null,
        total_outages: totalOut ?? null,
        priority: stateWithMostOutages ?? null,
    };
    return { summary, data: structure };
};