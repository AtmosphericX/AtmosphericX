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

export class Database { 
    NAME_SPACE: string = `submodule:database`;
    DATABASE: any;
    constructor() {
        loader.submodules.utils.log(`${this.NAME_SPACE} initialized.`)
        if (!loader.packages.fs.existsSync(loader.packages.path.resolve(`..`, `storage/databases`))) {
            loader.submodules.utils.log(`Creating databases directory...`);
            loader.packages.fs.mkdirSync(loader.packages.path.resolve(`..`, `storage/databases`), { recursive: true });
        }
        const dbPath = loader.packages.path.resolve(`..`, `storage/databases`, `accounts.db`);
        if (loader.packages.fs.existsSync(dbPath)) { 
            this.DATABASE = new loader.packages.sqlite3(dbPath);
            loader.submodules.utils.log(`Account Database Loaded @ ${dbPath}`);
        } else { 
            this.create(); 
        }
    }

    private create() {
        const dbPath = loader.packages.path.resolve(`..`, `storage/databases`, `accounts.db`);
        this.DATABASE = new loader.packages.sqlite3(dbPath);
        try { 
            this.DATABASE.prepare(`CREATE TABLE IF NOT EXISTS accounts (id INTEGER PRIMARY KEY AUTOINCREMENT, username TEXT NOT NULL, hash TEXT NOT NULL, activated INTEGER NOT NULL DEFAULT 0, role INTEGER NOT NULL DEFAULT 0, created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP, updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP)`).run();
            let rootExists = this.DATABASE.prepare(`SELECT 1 FROM accounts WHERE username = ?`).get('root');
            if (!rootExists) {
                this.DATABASE.prepare(`INSERT INTO accounts (username, hash, role, activated) VALUES (?, ?, ?, ?)`).run('root', 'hzf+LiRTX1pP+v335+TaeLSAWu136Ltqs26gebv7jBw=', 1, 1);
                loader.submodules.utils.log(`Root account created with default credentials. (Username: root | Password: root)`);
            }
            loader.submodules.utils.log(`Account Database Created @ ${dbPath}`);
        } catch (error) {
            loader.submodules.utils.log(`Error creating account database: ${error}`);
        }
    }

    public query(sql: string, params: any[] = []): any {
        try {
            params = Array.isArray(params) ? params : [];
            let stmt = this.DATABASE.prepare(sql);
            return /^\s*select/i.test(sql) ? stmt.all(...params) : stmt.run(...params);
        } catch (err) {
            loader.submodules.utils.log(`Database query error: ${err}`);
            return [];
        }
    }
}

export default Database;

