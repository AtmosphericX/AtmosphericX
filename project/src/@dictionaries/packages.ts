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

// AtmosphericX Submodules
import utilities from '../@submodules/@utility/utility';
import display from '../@submodules/@utility/utility.display';
import calculations from '../@submodules/@utility/utility.calculations';
import database from '../@submodules/@utility/utility.database';
import networking from '../@submodules/@utility/utility.http';
import tracking from '../@submodules/@utility/utility.tracking';
import structure from '../@submodules/@misc/misc.stucture';
import streaming from '../@submodules/@misc/misc.streaming';
import rtsocket from '../@submodules/@misc/misc.rtsocket';
import atmsxparser from '../@submodules/@internal/atmsx.parser';
import atmsxpulsepoint from '../@submodules/@internal/atmsx.pulsepoint';
import atmsxtempest from '../@submodules/@internal/atmsx.tempest';
import routing from '../@express/express.routes';
    
// AtmosphericX Custom Packages
import { Manager, TextParser } from '@atmosx/event-product-parser';
import { PulsePoint } from '@atmosx/pulse-point-wrapper';
import { PlacefileManager } from '@atmosx/placefile-parser';
import { TempestStation } from '@atmosx/tempest-station-wrapper';

// Third Party Packages
import { StreamerbotClient } from '@streamerbot/client';
import sqlite3 from 'better-sqlite3';
import express from 'express';
import rateLimit from 'express-rate-limit';
import axios from 'axios';
import c_process from "child_process"
import chokidar from "chokidar";
import argon2 from "argon2";
import * as gui from 'blessed';
import * as events from 'events';
import * as path from 'path'; 
import * as fs from 'fs';
import * as crypto from 'crypto';
import * as http from 'http';
import * as https from 'https';
import * as process from 'process';
import * as xmpp from '@xmpp/client';
import * as os from 'os';
import * as xml2js from 'xml2js';
import * as shapefile from 'shapefile';
import * as ws from 'ws';
import * as firebase_app from '@firebase/app';
import * as firebase_database from '@firebase/database';
import * as jobs from 'croner';
import * as jsonc from 'jsonc-parser';
import * as buffer from 'buffer';



export const h_packages = { 
    Manager, TextParser, PulsePoint, PlacefileManager, TempestStation,
    StreamerbotClient, sqlite3, express, rateLimit, axios,
    gui, events, path, fs, crypto, http, https, process, xmpp, os,
    xml2js, shapefile, ws, firebase_app, firebase_database, jobs,
    jsonc, buffer, chokidar, c_process, argon2
};


export const h_modules = { 
    utilities, display, rtsocket,
    atmsxparser, atmsxpulsepoint, atmsxtempest,
    calculations, database, tracking, 
    networking, structure, streaming, routing
};
