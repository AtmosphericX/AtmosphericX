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

window.addEventListener('DOMContentLoaded', () => {
    const utils = new Utils();
    utils.socket(["version", "announcement", "configurations"]);
    const forms = [`login`, `signup`, `reset`];
    const getHour = () => new Date().getHours();
    if (getHour() >= 21 || getHour() <= 6) {
        document.getElementsByClassName('background')[0].style.backgroundImage = "url('https://weather.cod.edu/data/satellite/background/background.11.jpg')";
    }
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
                            title: "Authentication Error",
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
                        title: "Authentication Error",
                        message: result.message || 'An error occurred. Please try again.'
                    });
                }
                utils.notify({
                    type: 'success',
                    title: "Authentication Success",
                    message: result.message || 'Operation successful! Redirecting...'
                });
                setTimeout(() => { window.location.reload(); }, 100);
            } catch (error) {
                utils.notify({
                    type: 'error',
                    title: "Authentication Error",
                    message: 'Network error. Please try again later. Server connection failed or you are getting ratelimited.'
                });
            }
        })
    })
    document.addEventListener("onUpdate", async () => {
        const spanVersions = document.querySelectorAll("#version-value");
        const version = utils?.storage?.version ?? ``;
        const announcement = utils?.storage?.announcement ?? null;
        const guests = utils?.storage?.configurations?.guests_allowed ?? false;
        spanVersions.forEach(span => {
            span.textContent = `v${version}` ?? ``;
        });
        if (announcement) {
            document.getElementById("header-announcement").style.display = "block";
            document.querySelector(".header-message").textContent = `${announcement}`;
        }
        if (guests) { 
            const guestButtons = document.getElementById("btn-guest");
            guestButtons.hidden = false;
            guestButtons.setAttribute("aria-hidden", "false");
        }
    });
})