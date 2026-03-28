---
layout: doc
next: 
    text: 'Troubleshooting'
    link: /pages/installation/troubleshooting
prev:
    text: 'Post Installation'
    link: /pages/installation/post-installation
---

<img src="/logo.png" alt="AtmosphericX Logo" width="200" style="display: block; margin: 0 auto;" />
<small class="page-author">Written By: <b>KiyoWx</b></small><br/>
<small class="last-updated">Last Updated: <b>Mar 9th, 2026</b></small><br><br><br>

# Updating AtmosphericX
---
AtmosphericX can be updated easily by running the `update.sh` script located in the `build-tools` directory of the project.

::: warning Version Compatibility
The `update.sh` script is only available for v8 or higher. Updating v7 instances using this script will **not work**. Please perform a fresh installation if you are on v7.
:::

## How does it work?
The script compares your currently installed version (stored in `/storage/store/version`) with the latest version available on the `main` branch. For private development builds, you can optionally pass a GitHub Classic Token as a parameter to allow authenticated requests to the repository.

::: tip Forcing an Update
If your version matches the latest, the script will do nothing. To force an update, edit `version` and set a lower version number.
:::


## Will my configurations be saved?
AtmosphericX prompts you to back up your configuration files before updating. Always accept this step to avoid losing custom settings. Some updates may replace existing configuration files with newer versions, which can overwrite custom settings. AtmosphericX uses SHA-1 checksums to verify configuration file integrity. If a warning appears in the console, it simply means your configuration differs from the official release version.

::: info Backup Reminder
Always back up your configuration files before running `update.sh`. This ensures you can restore custom settings if they are overwritten during the update process.
:::

## Running the Update Script

From the project root directory:

```sh
cd build-tools
./update.sh
```