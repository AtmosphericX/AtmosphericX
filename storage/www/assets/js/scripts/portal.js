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
    Documentation: http://localhost/docs | https://atmosx-secondary.scriptkitty.cafe/docs

*/

window.addEventListener('DOMContentLoaded', () => {
    const utils = new Utils();
    utils.socket(["version", "configurations"]);
    const forms = [`login`, `signup`, `reset`];
    forms.forEach(id => {
        const container = document.getElementById(id);
        const links = container.querySelectorAll('.extra a');
        const form = container.querySelector('form');
        links.forEach(link => {
            link.addEventListener('click', (e) => {
                const targetId = link.getAttribute('href').substring(1);
                if (!forms.includes(targetId)) return;
                container.style.display = 'none';
                document.getElementById(targetId).style.display = 'block';
            });
        })
        form.addEventListener('submit', async (e) => {
            e.preventDefault();
            const inputs = form.querySelectorAll('input');
            const endpoint = id === 'login' ? '/api/portal/login' : id === 'signup' ? '/api/portal/signup' : '/api/portal/reset';
            let data = {};
            switch (id) { 
                case 'login': 
                    data.username = inputs[0].value != "" ? inputs[0].value : "guest";
                    data.password = inputs[1].value != "" ? inputs[1].value : "guest";
                    break;
                case 'signup':
                    data.username = inputs[0].value;
                    data.password = inputs[1].value;
                    data.confirmed = inputs[2].value;
                    if (data.password !== data.confirmed) {
                        return utils.notify({
                            type: 'error',
                            message: 'Passwords do not match. Please try again.'
                        });
                    }
                    break;
                case 'reset':
                    data.username = inputs[0].value;
                    data.password = inputs[1].value;
                    data.confirmed = inputs[2].value;
                    break;
                default:
                    break;
            }
            try {
                const response = await fetch(endpoint, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(data)
                });
                const result = await response.json();
                if (!response.ok) {
                    return utils.notify({
                        type: 'error',
                        message: result.message || 'An error occurred. Please try again.'
                    });
                }
                utils.notify({
                    type: 'success',
                    message: result.message || 'Operation successful! Redirecting...'
                });
                setTimeout(() => { window.location.reload(); }, 100);
            } catch (error) {
                utils.notify({
                    type: 'error',
                    message: 'Network error. Please try again later.'
                });
            }
        })
    })
    document.addEventListener("onUpdate", async () => {
        const spanVersions = document.querySelectorAll("#version-value");
        const version = utils?.storage?.version ?? ``;
        const guests = utils?.storage?.configurations?.guests_allowed ?? false;
        spanVersions.forEach(span => {
            span.textContent = `v${version}` ?? ``;
        });
        if (guests) { 
            const guestButtons = document.querySelectorAll(".passive");
            guestButtons.forEach(button => {
                button.hidden = false;
                button.setAttribute("aria-hidden", "false");
            });
        }
    });
    utils.notify({
        type: 'info',
        message: `Welcome to the AtmosphericX Portal! Please log in or sign up to continue.`
    });
})