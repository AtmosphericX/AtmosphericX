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

class Cards { 
    constructor() {
        this.name_space = `dashboard.cards`
        utils.log(`${this.name_space} initialized.`);
    }

    CreateCard(metadata = {}) {
        let resolvePromise;
        const { parent = null, title = "Card Title", data = [], onClick = null, span="4" } = metadata;
        const card = document.createElement('div');
            card.className = `stat-card span-${span}`;
        const cTitle = document.createElement('div');
            cTitle.className = 'dashboard-data-value';
            cTitle.textContent = metadata.title;
        card.appendChild(cTitle);
        for (const { key, value } of data) {
            const text = document.createElement('div');
                text.className = 'dashboard-data-label';
                text.textContent = `${key}: ${value}`;
            card.appendChild(text);
        }
        if (parent) {
            parent.appendChild(card);
        }
        if (onClick) {
            card.addEventListener('click', onClick);
        }
    }
}

export const CardsRenderer = new Cards();

export function init() {
    try { window.CardsRenderer = CardsRenderer; } catch (e) { }
    return CardsRenderer;
}