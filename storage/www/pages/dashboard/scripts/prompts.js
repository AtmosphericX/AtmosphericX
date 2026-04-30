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

class Prompts { 
    constructor() {
        this.name_space = `dashboard.prompts`
        utils.log(`${this.name_space} initialized.`);
    }

    ClosePrompts() {
        document.querySelectorAll(".prompt-backdrop").forEach((el) => el.remove());
    }

    CreatePrompt(metadata = {}) {
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
            const messagesArray = Array.isArray(message) ? message : [message];
            messagesArray.forEach((msg) => {
                const messageData = typeof msg === "object" && msg !== null ? msg : { message: msg };
                const msgItem = el("div", "prompt-message-item");
                const msgBox = el("div", "prompt-message-box");
                if (messageData.title) {
                    const msgTitle = el("div", "prompt-message-title");
                    msgTitle.textContent = messageData.title;
                    msgItem.appendChild(msgTitle);
                }
                const msgBody = el("div", "prompt-body");
                msgBody.textContent = messageData.message ?? messageData.text ?? messageData.body ?? messageData.description ?? "";
                msgBox.appendChild(msgBody);
                msgItem.appendChild(msgBox);
                contentWrap.appendChild(msgItem);
            });
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
    }
}

export const PromptsRenderer = new Prompts();

export function init() {
    try { window.PromptsRenderer = PromptsRenderer; } catch (e) { }
    return PromptsRenderer;
}