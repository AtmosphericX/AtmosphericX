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

const NAV_DIR = [
    {text: "Home", type: "link", href: "#home"},
    {text: "Monitoring", type: "dropdown", dropdowns: [
        {role: 0, text: "Active Events", type: "link", href: "#events"},
        {role: 0, text: "Local Storm Reports", type: "link", href: "#lsr"},
        {role: 0, text: "Discussions", type: "link", href: "#discussions"},
        {role: 0, text: "CIMSS ProbSevere", type: "link", href: "#cimss"},
        {role: 0, text: "Spotter Network", type: "link", href: "#spotters"},
        {role: 0, text: "Streams (Live)", type: "link", href: "#streams"},
        {role: 0, text: "NOAA Weather Radios (Live)", type: "link", href: "#streams"}
    ]},
    {text: "Forecasting", type: "dropdown", dropdowns: [
        {role: 0, text: "External Forecasting Tools", type: "link", href: "#forecasting-tools"},
        {role: 0, text: "SPC Outlooks", type: "link", href: "#spc-outlooks"}
    ]},
    {text: "Settings", type: "dropdown", dropdowns: [
        {role: 1, text: "Event Controller", type: "link", href: "#widget-control"},
        {role: 1, text: "System Metrics", type: "link", href: "#system-metrics"},
        {role: 1, text: "Account Manager", type: "link", href: "#account-manager"},
        {role: 0, text: "Toggle Sfx (Events)", type: "link", href: "#", onclick: 'toggleSfx'},
        {role: 0, text: "Toggle Notifications (Events)", type: "link", href: "#", onclick: 'toggleNotifications'},
        {role: 0, text: "Logout", type: "link", href: "#", onclick: 'logout'}
    ]},
    {text: "Resources", type: "dropdown", dropdowns: [
        {role: 0, text: "Documentation", type: "link", href: "/docs"},
        {role: 0, text: "Github", type: "link", href: "https://github.com/AtmosphericX"},
        {role: 0, text: "Donate", type: "link", href: "https://ko-fi.com/k3yomi"}
    ]},
]


class Bindings { 
    toggleNotifications() { 
        const getVal = window.localStorage.getItem("dashboard.events.notifications") === "true";
        utils.notify({
            type: getVal ? "error" : "success",
            title: `Notifications ${getVal ? "Disabled" : "Enabled"}`,
            duration: 30000
        });
        window.localStorage.setItem("dashboard.events.notifications", getVal ? "false" : "true"); 
    }
    toggleSfx() { 
        const getVal = window.localStorage.getItem("dashboard.events.sfx") === "true";
        utils.notify({
            type: getVal ? "error" : "success",
            title: `SFX ${getVal ? "Disabled" : "Enabled"}`,
            duration: 30000
        });
        window.localStorage.setItem("dashboard.events.sfx", getVal ? "false" : "true"); 
    }
    logout() {
        fetch('/api/portal/logout', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' }
        })
        window.location.reload();
    }
}

class Render { 
    constructor() {
        this.name_space = `dashboard.nav`
        this.page = null
        this.NavRender() 
        this.NavDropdownController();
        this.NavSidebarController();
        this.RenderPage();
        utils.log(`${this.name_space} initialized.`);
    }

    RenderPage() {
        return new Promise(async () => {
            await utils.sleep(100);
            const getHash = window.location.hash.replace(/^#/, '');
            const getTarget = getHash ? getHash : `home`;
            const getContainer = document.getElementById("container");
            if (this.page == getTarget) { 
                return; 
            }
            this.page = getTarget;
            await fetch(`/dashboard/wrappers/${getTarget}.html`).then(async (response) => {
                const getContent = await response.text();
                const getStatus = response.status;
                if (getStatus != 200) {
                    this.page = `home`; 
                    window.location.hash = `#home`;
                    this.RenderPage();
                    return utils.exception(`The ${getTarget} page could not be loaded defaulting to home.`);
                }
                getContainer.innerHTML = getContent;
                await import(`/dashboard/scripts/wrappers/${getTarget}.js`).then(m => m.init?.());
                this.page = getTarget;
            })
        })
    }

    NavRender() {
        const getClass = document.getElementById(`nav-render`);
        if (!getClass) return;
        const bind = new Bindings();
        NAV_DIR.forEach(item => {
            if (item.type === 'link') {
                const a = document.createElement('a');
                a.className = 'nav-link text-neutral hover-light';
                a.textContent = item.text;
                if (item.href) a.href = item.href;
                if (item.onclick) {
                    if (typeof item.onclick === 'function') a.addEventListener('click', (e) => { e.preventDefault(); item.onclick.bind(bind)(e); });
                    else if (typeof item.onclick === 'string' && typeof bind[item.onclick] === 'function') a.addEventListener('click', (e) => { e.preventDefault(); bind[item.onclick].bind(bind)(e); });
                    else a.addEventListener('click', this.RenderPage.bind(this));
                } else a.addEventListener('click', this.RenderPage.bind(this));
                getClass.appendChild(a);
                return;
            }
            if (item.type === 'dropdown') {
                const wrapper = document.createElement('div');
                wrapper.className = 'nav-dropdown';
                const btn = document.createElement('button');
                btn.type = 'button';
                btn.className = 'nav-dropdown-header text-neutral hover-light';
                btn.setAttribute('aria-expanded', 'true');
                btn.setAttribute('aria-controls', 'nav-dropdown');
                btn.innerHTML = `<span>${item.text}</span><i class="fas fa-chevron-down" aria-hidden="true"></i>`;
                wrapper.appendChild(btn);
                const content = document.createElement('div');
                content.className = 'nav-dropdown-content';
                content.id = 'nav-dropdown';
                (item.dropdowns||[]).forEach(dd => {
                    const a = document.createElement('a');
                    a.className = 'nav-link text-neutral hover-light';
                    a.textContent = dd.text;
                    if (dd.href) a.href = dd.href;
                    if (dd.onclick) {
                        if (typeof dd.onclick === 'function') a.addEventListener('click', (e) => { e.preventDefault(); dd.onclick.bind(bind)(e); });
                        else if (typeof dd.onclick === 'string' && typeof bind[dd.onclick] === 'function') a.addEventListener('click', (e) => { e.preventDefault(); bind[dd.onclick].bind(bind)(e); });
                        else a.addEventListener('click', this.RenderPage.bind(this));
                    } else a.addEventListener('click', this.RenderPage.bind(this));
                    content.appendChild(a);
                });
                wrapper.appendChild(content);
                getClass.appendChild(wrapper);
            }
        });
    }

    NavDropdownController() { 
        const getVersionText = document.getElementById(`sidebar-version`);
        const getHeaderText = document.getElementById(`message`);
        const dropdowns = document.querySelectorAll(`.nav-dropdown`);
        if (getVersionText) { 
            getVersionText.innerText = `AtmosphericX v${utils?.storage?.version ?? `Invalid Version`}`; 
        }
        if (getHeaderText){ 
            getHeaderText.innerText = utils?.storage?.announcement ?? `There are currently no announcements.`
        }
        if (!dropdowns.length) { 
            return; 
        }
        dropdowns.forEach((dropdown) => {
            const header = dropdown.querySelector(`.nav-dropdown-header`);
            const content = dropdown.querySelector(`.nav-dropdown-content`);
            if (!header || !content || header.dataset.boundDropdown === `true`) { return; }
            const setExpanded = (expanded) => {
                dropdown.classList.toggle(`active`, expanded);
                header.setAttribute(`aria-expanded`, expanded ? `true` : `false`);
                content.style.maxHeight = expanded ? `${content.scrollHeight}px` : `0px`;
            };
            const startsExpanded = dropdown.classList.contains(`active`);
            setExpanded(startsExpanded);
            header.addEventListener(`click`, () => {
                setExpanded(!dropdown.classList.contains(`active`));
            });
            header.dataset.boundDropdown = `true`;
        });
        if (!window.__dashboardNavResizeBound) {
            window.addEventListener(`resize`, () => {
                document.querySelectorAll(`.nav-dropdown.active .nav-dropdown-content`).forEach((content) => {
                    content.style.maxHeight = `${content.scrollHeight}px`;
                });
            });
            window.__dashboardNavResizeBound = true;
        } 
    }

    NavSidebarController() {
        const body = document.body;
        const sidebar = document.querySelector(`.sidebar`);
        const openBtn = document.getElementById(`sidebar-open-btn`);
        if (!body || !sidebar || !openBtn) { return; }
        const isMobile = () => window.matchMedia(`(max-width: 1200px)`).matches;
        const setState = (open) => {
            if (isMobile()) {
                body.classList.toggle(`sidebar-open`, open);
                body.classList.remove(`sidebar-collapsed`);
            } else {
                body.classList.toggle(`sidebar-collapsed`, !open);
                body.classList.remove(`sidebar-open`);
            }
            openBtn.setAttribute(`aria-expanded`, open ? `true` : `false`);
        };
        const persisted = window.localStorage.getItem(`dashboard.sidebar.open`);
        const defaultOpen = persisted ? persisted === `open` : !isMobile();
        setState(defaultOpen);
        if (!openBtn.dataset.boundSidebar) {
            openBtn.addEventListener(`click`, () => {
                const open = isMobile() ? body.classList.contains(`sidebar-open`) : !body.classList.contains(`sidebar-collapsed`);
                setState(!open);
            });
            openBtn.dataset.boundSidebar = `true`;
        }
        if (!sidebar.dataset.boundSidebarLinks) {
            sidebar.querySelectorAll(`.nav-link`).forEach((el) => {
                el.addEventListener(`click`, () => {
                    if (isMobile()) { setState(false); }
                });
            });
            sidebar.dataset.boundSidebarLinks = `true`;
        }
        if (!body.dataset.boundSidebarEsc) {
            document.addEventListener(`keydown`, (e) => {
                if (e.key === `Escape` && isMobile()) { setState(false); }
            });
            body.dataset.boundSidebarEsc = `true`;
        }
        if (!window.__dashboardSidebarResizeBound) {
            window.__dashboardSidebarResizeBound = true;
        }
    }
}

new Render();