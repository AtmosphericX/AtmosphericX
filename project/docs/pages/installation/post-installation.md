---
layout: doc
next: 
    text: 'Updating AtmosphericX'
    link: /pages/installation/updating-atmosphericx
prev:
    text: 'Installation Guide'
    link: /pages/installation/installation
---

<img src="/logo.png" alt="AtmosphericX Logo" width="200" style="display: block; margin: 0 auto;" />
<small class="page-author">Written By: <b>KiyoWx</b> & <b>StarflightWx</b></small><br/>
<small class="last-updated">Last Updated: <b>Mar 9th, 2026</b></small><br><br><br>

# Post Installation
---
Congratulations on installing AtmosphericX! This guide walks you through the essential post-installation steps to get your instance running smoothly, including dashboard access, administrator setup, and optional CDN exposure using a Cloudflare Tunnel **if you have a domain configured**.

::: warning
Please make sure your server is running with `start.sh` (if you have already built the project) before continuing
:::

## Web Interface & Dashboard
AtmosphericX provides a web-based dashboard for easy management. To access the web interface and dashboard, open your preferred web browser and navigate to [`http://localhost`](http://localhost) (default port is 80). If you are running AtmosphericX on a different computer or port, make sure to adjust the URL accordingly.

::: info
Default URL: http://localhost:80

During your first launch, you may be prompted to complete an initial setup wizard. Follow the on-screen instructions to configure basic settings such as admin account creation.
:::

::: warning Dashboard Status
The dashboard in this version is not yet fully completed. Some features may be unavailable.
:::

## Authentication & Setup Wizard

During the initial setup, you will be prompted to create an **administrator account** with full access to AtmosphericX. When the prompt appears, enter the randomly generated **authentication key** provided by the setup page.

The key is automatically generated each time the setup page is opened, remains valid only for the current setup session, and appears **once** in the server console. Be sure to copy the key before closing or refreshing the page. This step helps ensure that only someone with access to the server console can complete the initial administrator setup.

Once authenticated, you can proceed to create your admin account by entering a username and password. Be sure to choose a **strong password** to enhance the security of your instance.

A full video walkthrough of the authentication setup process is provided below for your convenience.

### Username Guidelines
Your username can contain **letters, numbers, underscores (`_`), hyphens (`-`), periods (`.`), or exclamation marks (`!`)**, and must be **3–20 characters long**.

### Password Guidelines
Passwords may include **letters, numbers, and common special characters**, and must be **4–50 characters long**.

### TL;DR
1. Open the web interface.
2. Copy the **4-digit authentication key** from the server console.
3. Paste the key into the setup page.
4. Create an admin account with a username and a **strong password**.

::: details Video Walkthrough

<video controls>
    <source src="/assets/images/documentation/auth_setup_doc.mp4"/>
</video>
<small>Video: Setup Wizard Guide</small>

:::


## Cloudflare Tunnel Walkthrough
Cloudflare provides a free service that allows you to expose your AtmosphericX instance to the internet without requiring a public IP address or port forwarding. This is especially useful for users who are behind NAT or have dynamic IP addresses. To get started, you'll need a Cloudflare account. If you don't have one, visit [cloudflare.com](https://www.cloudflare.com) and sign up for a free account.

### Step 1: Install Cloudflare Tunnel
Download and install `cloudflared` for your operating system:
- **Windows**: Download the installer from [Cloudflare's downloads page](https://developers.cloudflare.com/cloudflare-one/connections/connect-apps/install-and-setup/tunnel-guide/local/)
- **Linux/Mac**: Use your package manager or download directly from the official repository

### Step 2: Authenticate with Cloudflare
Open your terminal and run:
###
::: code-group
```sh [1. CF Tunnel Login]
cloudflared tunnel login
```
```sh [2. Create a Tunnel]
cloudflared tunnel create <TUNNEL_NAME>
```
```yaml [3. Create / Edit config.yml]
# Create or edit `~/.cloudflared/config.yml` with the following configuration:
tunnel: <TUNNEL_NAME>
credentials-file: /path/to/credentials.json
ingress:
  - hostname: <DOMAIN_NAME_HERE>
    service: http://<INSTANCE_IP_ADDRESS>:<PORT_NUMBER>
  - service: http_status:404
```
```sh [4. Routing Traffic]
cloudflared tunnel route dns <TUNNEL_NAME> {YOUR_DOMAIN_HERE}.{COM/NET/ORG}
```
```sh [5. Starting Tunnel]
cloudflared tunnel run <TUNNEL_NAME>
```

::: info
Please ensure that your instance IP address is reachable from your machine. For local testing, use `127.0.0.1`.
:::

Now you should be able to access your AtmosphericX instance by going directly to the tunnel you created. By default, Cloudflare will not cache any AtmosphericX content. If you wish for interface instructions, please refer to [Cloudflare's documentation](https://one.dash.cloudflare.com/) for more information.

::: tip
Cloudflare Tunnels eliminate the need for router port forwarding and help protect your origin server by routing traffic through Cloudflare’s edge network.
:::