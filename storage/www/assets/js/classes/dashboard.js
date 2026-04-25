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

class Dashboard { 
    constructor(utils) { 
        this.name_space = `webmodule:dashboard`;
        this.storage = utils.storage;
        this.utils = utils;
        this.page = null;
        this.sidebarStateKey = `dashboard.sidebar.open`;
        utils.log(`${this.name_space} initialized.`);
        utils.socket([`*`]).then(() => {
            document.addEventListener('onUpdate', (event) => {this.onUpdate()});
        });
        this.initSidebarControls();
        this.initSidebarNav();
    }

    /**
     * @production
     * @function initSidebarNav
     * @description 
     *      Initializes the sidebar navigation and their event listeners.
     * 
     * @returns {void}
     */
    initSidebarNav = function() {
        const dropdowns = document.querySelectorAll(`.nav-dropdown`);
        if (!dropdowns.length) { return; }
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

    /**
     * @production
     * @function initSidebarControls
     * @description 
     *      Initializes the sidebar controls and their event listeners.
     * 
     * @returns {void}
     */
    initSidebarControls = function() {
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
            window.localStorage.setItem(this.sidebarStateKey, open ? `open` : `closed`);
        };
        const persisted = window.localStorage.getItem(this.sidebarStateKey);
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
            window.addEventListener(`resize`, () => {
                const stored = window.localStorage.getItem(this.sidebarStateKey);
                const open = stored ? stored === `open` : !isMobile();
                setState(open);
            });
            window.__dashboardSidebarResizeBound = true;
        }
    }
    
    /**
     * @production
     * @function renderPage
     * @description 
     *      Renders the specified page in the main content area.
     * 
     * @param {string} page - The page to render.
     * @returns {Promise} - A promise that resolves when the page is rendered.
     */
    renderPage = async function() {
        await utils.sleep(100);
        const getCurrentPage = window.location.hash.replace(/^#/, '');
        const targetPage = getCurrentPage ? getCurrentPage : `home`;
        const container = document.getElementById("container");
        if (this.page == targetPage) { 
            return; 
        }
        await fetch(`/dashboard/content/${targetPage}.html`).then(async (response) => {
            const content = await response.text();
            const status = response.status;
            if (status != 200) {
                this.page = `home`;
                window.location.hash = `#home`;
                this.renderPage(`home`);
                return this.utils.exception(`The ${targetPage} page could not be loaded defaulting to home.`);
            }
            container.innerHTML = content;
            await import(`/dashboard/hooks/${targetPage}.js`).then(m => m.init?.());
            this.page = targetPage;
        })
    }
        
    /**
     * @production
     * @function onUpdate
     * @description 
     *      Updates the project version text and announcement text if the server has sent an update.
     *      Feat: TBD
     * 
     * @returns {void}
     */
    onUpdate = function() {
        const getVersionText = document.getElementById(`sidebar-version`);
        const getHeaderText = document.getElementById(`message`);
        if (getVersionText) { getVersionText.innerText = `AtmosphericX v${this?.storage?.version ?? `Invalid Version`}`; }
        if (getHeaderText) { if (this?.storage?.announcement) { getHeaderText.innerText = this?.storage?.announcement; } else { getHeaderText.innerText = `There are currently no announcements.`; } }
        this.renderPage();
    }

    /**
     * @production
     * @function createPrompt
     * @description 
     *      Creates a prompt dialog with the specified metadata.
     * 
     * @param {Object} metadata - The metadata for the prompt dialog.
     * @returns {Promise} - A promise that resolves when the prompt is closed
     */
    createPrompt = async function (metadata = {}) {
        let resolvePromise;
        const { title = "Prompt", message = "", placeholder = null, value = "", submitText = "Ok",
                onSubmit = null, onClose = null, buttons = [], toggle = null, checkboxes = [] } = metadata;
        document.querySelector(".prompt-backdrop")?.remove();
        const el = (tag, className) => {
            const n = document.createElement(tag);
            if (className) n.className = className;
            return n;
        };
        const backdrop = el("div", "prompt-backdrop");
        const windowEl = el("div", "prompt-window");
        const header = el("div", "prompt-header");
        const titleEl = el("div", "prompt-title");
        const closeBtn = document.createElement("button");
        const body = el("div", "prompt-body");
        const inputWrap = el("div", "prompt-input");
        const contentWrap = el("div", "prompt-content");
        const checkboxWrap = el("div", "prompt-checkboxes");
        const toggleWrap = el("div", "prompt-toggle");
        const actionsWrap = el("div", "prompt-actions");
        const checkboxState = [];
        const input = placeholder !== null ? document.createElement("input") : null;
        const close = (result) => { backdrop.remove(); onClose?.(result); resolvePromise?.(result); };
        const getResult = () => ({ value: input ? input.value : null, checkboxes: checkboxState });
        const submit = () => { const result = getResult(); onSubmit?.(result); close(result); };
            titleEl.textContent = title;
            closeBtn.textContent = "✕";
            closeBtn.type = "button";
            closeBtn.className = "prompt-close";
            header.appendChild(titleEl);
            header.appendChild(closeBtn);
            body.textContent = message;
            contentWrap.appendChild(body);
        if (checkboxes.length) {
            checkboxes.forEach((item, i) => {
                const label = document.createElement("label");
                const cb = document.createElement("input");
                const text = document.createElement("span");
                    label.className = "prompt-checkbox";
                    cb.type = "checkbox";
                    cb.checked = !!item.checked;
                    checkboxState[i] = cb.checked;
                    text.textContent = item.label;
                    label.appendChild(cb);
                    label.appendChild(text);
                    checkboxWrap.appendChild(label);
                    cb.addEventListener("change", () => {
                        checkboxState[i] = cb.checked;
                        item.onChange?.(cb.checked, { index: i, checkboxes: checkboxState });
                    });
            });
            contentWrap.appendChild(checkboxWrap);
        }
        if (toggle?.text && toggle?.content) {
            const link = document.createElement("div");
            const content = document.createElement("div");
                link.className = "prompt-toggle-link";
                link.textContent = toggle.text;
                link.style.cursor = "pointer";
                content.className = "prompt-toggle-content";
                content.style.display = "none";
                toggleWrap.appendChild(link);
                toggleWrap.appendChild(content);
                contentWrap.appendChild(toggleWrap);
            if (toggle.content instanceof HTMLElement) { content.appendChild(toggle.content); }
            link.addEventListener("click", () => { content.style.display = content.style.display === "none" ? "block" : "none"; });
        }
        if (input) {
            input.type = "text";
            input.value = value;
            if (placeholder) input.placeholder = placeholder;
            input.addEventListener("keydown", (e) => {
                if (e.key === "Enter") submit();
                if (e.key === "Escape") close(null);
            });
            inputWrap.appendChild(input);
            contentWrap.appendChild(inputWrap);
        }
        const defaultBtn = document.createElement("button");
            defaultBtn.type = "button";
            defaultBtn.className = "prompt-btn prompt-btn-primary";
            defaultBtn.textContent = submitText;
        defaultBtn.addEventListener("click", submit);
        actionsWrap.appendChild(defaultBtn);
        buttons.forEach(btn => {
            const el = document.createElement("button");
                el.type = "button";
                el.textContent = btn.text;
                el.className = ["prompt-btn", btn.className].filter(Boolean).join(" ");
                el.addEventListener("click", () => {
                    const result = getResult();
                    btn.onClick?.(result);
                });
            actionsWrap.appendChild(el);
        });
        windowEl.appendChild(header);
        windowEl.appendChild(contentWrap);
        windowEl.appendChild(actionsWrap);
        backdrop.appendChild(windowEl);
        document.body.appendChild(backdrop);
        closeBtn.addEventListener("click", () => close(null));
        backdrop.addEventListener("click", (e) => {
            if (e.target === backdrop) close(null);
        });
        if (input) setTimeout(() => input.focus(), 0);
        return new Promise((resolve) => {
            resolvePromise = resolve;
        });
    };
}