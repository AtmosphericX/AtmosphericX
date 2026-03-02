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

import * as loader from '../..';


export class Database {
    name_space: string = `Utility.Database`;
    ansi_colors = loader.modules.utilities.ansi_colors;
    DB: typeof loader.packages.sqlite3.Database;
    constructor() {
        loader.modules.utilities.log({ 
            title: `${this.ansi_colors.GREEN}${this.name_space}${this.ansi_colors.RESET}`, 
            message: `Successfully initialized`
        });
        if (!loader.packages.fs.existsSync(loader.packages.path.resolve(`..`, `storage/databases`))) {
            loader.packages.fs.mkdirSync(loader.packages.path.resolve(`..`, `storage/databases`));
            loader.modules.utilities.log({ 
                title: `${this.ansi_colors.YELLOW}${this.name_space}${this.ansi_colors.RESET}`, 
                message: `Created missing database storage directory.`
            });
        }
        const databasePath = loader.packages.path.resolve(`..`, `storage/databases`, `accounts.db`);
        if (loader.packages.fs.existsSync(databasePath)) {
            this.DB = new loader.packages.sqlite3(databasePath);
            loader.modules.utilities.log({ 
                title: `${this.ansi_colors.GREEN}${this.name_space}${this.ansi_colors.RESET}`, 
                message: `Connected to accounts database successfully.`
            });
            loader.cache.external.setup = this.DB.prepare(`SELECT COUNT(*) as count FROM accounts WHERE role = 1`).get().count as number > 0 ? 1 : 0;
        } else {
            this.DB = new loader.packages.sqlite3(databasePath);
            try { 
                this.DB.prepare(`
                    CREATE TABLE IF NOT EXISTS accounts (
                        id INTEGER PRIMARY KEY AUTOINCREMENT,
                        username TEXT NOT NULL UNIQUE,
                        hash TEXT NOT NULL,
                        activated INTEGER NOT NULL DEFAULT 0,
                        role INTEGER NOT NULL DEFAULT 0,
                        created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
                        updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
                    )
                `).run();
                loader.modules.utilities.log({ 
                    title: `${this.ansi_colors.GREEN}${this.name_space}${this.ansi_colors.RESET}`, 
                    message: `Created accounts database and table successfully.`
                });
                loader.cache.external.setup = this.DB.prepare(`SELECT COUNT(*) as count FROM accounts WHERE role = 1`).get().count as number > 0 ? 1 : 0;
            } catch (error) {
                loader.modules.utilities.exception(error, this.name_space + `.constructor`);
            }
        }
    }  

    /**
     * @production
     * @error_handling
     * @function query
     * @description
     *      This function executes a SQL query on the database. It supports both SELECT and non-SELECT queries.
     * 
     * @param {string} sql - The SQL query to be executed.
     * @param {string[]} params - An array of parameters to be used in the SQL query.
     * @returns {string[]} - The result of the query execution.
     */
    public query(sql: string, params: string[] = []): string[] {
        try {
            params = Array.isArray(params) ? params : [];
            let stmt = this.DB.prepare(sql);
            return /^\s*select/i.test(sql) ? stmt.all(...params) : stmt.run(...params);
        } catch (error) {
            loader.modules.utilities.exception(error, this.name_space + `.query`);
            return [];
        }
    }
}


export default Database;