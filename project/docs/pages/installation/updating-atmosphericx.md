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
<small class="last-updated">Last Updated: <b>Feb 27th, 2026</b></small><br>

# Updating AtmosphericX
---
AtmosphericX can be updated easily by running the `update.sh` script found under the `build-tools` directory in the project.

::: warning Version Compatibility
The `update.sh` script is only available for v8 or higher. Updating v7 instances using this script will **not work**. Please perform a fresh installation if you are on v7.
:::

## How does it work?
The script compares your current version (stored in `/storage/store/version.bin`) with the latest commit on `beta/main`. For private development builds, you can pass a GitHub Classic Token as a parameter.

::: tip Forcing an Update
If your version matches the latest, the script will do nothing. To force an update, edit `version.bin` and set a lower version number.
:::


## Will my configurations be saved?
AtmosphericX prompts you to back up your configuration files before updating. Always accept this step to avoid losing custom settings. Some updates may replace existing configuration files with new versions. This can overwrite custom settings. AtmosphericX uses SHA-1 checksums to verify configuration integrity. A console warning simply means your configuration differs from the official release. This is normal! Backing up ensures you can restore your custom settings after the update.

::: info Backup Reminder
Always back up your configuration files before running `update.sh`. This ensures you can restore custom settings if they are overwritten during the update process.
:::