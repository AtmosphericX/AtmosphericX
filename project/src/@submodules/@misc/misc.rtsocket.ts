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

import * as loader from '../..';

export class RtIrlSocket {
    name_space: string = `Misc.RtIrlSocket`;
    ansi_colors = loader.modules.utilities.ansi_colors;
    last_rt_update: number = 0;
    pkg = loader.packages.firebase_app;
    pkg2 = loader.packages.firebase_database;
    mgr = null;
    constructor() {
        loader.modules.utilities.log({ 
            title: `${this.ansi_colors.GREEN}${this.name_space}${this.ansi_colors.RESET}`, 
            message: `Successfully initialized`
        });
        const configurations = loader.modules.utilities.cfg();
        const settings = configurations?.sources?.location_settings?.realtime_irl;
        if (settings?.enabled) { 
            this.mgr = loader.cache.handlers.rt_socket = new this.pkg.initializeApp({
                databaseURL: `https://rtirl-a1d7f-default-rtdb.firebaseio.com`,
                projectId: `rtirl-a1d7f`,
                appId: `1:684852107701:web:d77a8ed0ee5095279a61fc`,
                measurementId: `G-TR97D81LT3`,
            }, `rtirl-api`);
            this.listener();
        }
    }

    /**
     * @public
     * @function listener
     * @production
     * @error_handling
     * @description
     *      This function is responsible for listening to the realtime IRL Firebase Realtime Database.
     *      It sets up a listener on the specified pull key to monitor for location updates.
     * 
     * @returns {void}
     */
    public async listener(): Promise<void> { 
        try {
            const configurations = loader.modules.utilities.cfg();
            const settings = configurations?.sources?.location_settings?.realtime_irl;
            const db = this.pkg2.getDatabase(this.mgr);
            const ref = this.pkg2.child(
                this.pkg2.ref(db, `pullables`),
                settings.pull_key
            );
            const listen = (snapshot) => {
                const snap = snapshot.val();
                if (snap == null) return;
                if (snap.updatedAt !== this.last_rt_update) {
                    this.last_rt_update = snap.updatedAt;
                    const coords = { 
                        latitude: snap.location.latitude, 
                        longitude: snap.location.longitude
                    };
                    loader.modules.tracking.setCurrentCoordinates(settings.display_name, coords, `RTIRL`);
                }
            };
            this.pkg2.onValue(ref, listen);
        } catch (error) {
            loader.modules.utilities.exception(error, this.name_space + `.listener`);
        }
    }  
}


export default RtIrlSocket;