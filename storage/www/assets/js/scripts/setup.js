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
    Discord: https://atmosphericx-discord.scriptktity.cafe
    Ko-Fi: https://ko-fi.com/k3yomi
    Documentation: http://localhost/documentation | https://atmosphericx.scriptkitty.cafe/documentation

*/

window.addEventListener('DOMContentLoaded', () => {
    const utils = new Utils();
    utils.socket(["version", "announcement"]);
    const forms = [`setup`, `creation`];
    forms.forEach(id => {
        const container = document.getElementById(id);
        const form = container.querySelector('form');
        form.addEventListener('submit', async (e) => {
            e.preventDefault();
            const inputs = form.querySelectorAll('input');
            const endpoint = id === 'setup' ? '/api/portal/verify' : id === 'creation' ? '/api/portal/signup/admin' : '/';
            let data = {};
            switch (id) {
                case 'setup': 
                    data.auth = inputs[0].value;
                    break;
                case 'creation': 
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
                if (id === 'setup') {
                    container.style.display = 'none';
                    document.getElementById('creation').style.display = 'block';
                } else { 
                    setTimeout(() => { window.location.reload(); }, 1500);
                }
            } catch (error) {
                utils.notify({
                    type: 'error',
                    message: 'Network error. Please try again later.'
                });
            }
        })
    });

    document.addEventListener("onUpdate", async () => {
        const spanVersions = document.querySelectorAll("#version-value");
        const version = utils?.storage?.version ?? ``;
        const announcement = utils?.storage?.announcement ?? null;
        spanVersions.forEach(span => {
            span.textContent = `v${version}` ?? ``;
        });
        if (announcement) {
            document.getElementById("header-announcement").style.display = "block";
            document.querySelector(".header-message").textContent = `${announcement}`;
        }
    });
    utils.notify({
        type: 'info',
        message: `Please complete the initial setup to continue. The authentication code can be found in your console`
    });
})