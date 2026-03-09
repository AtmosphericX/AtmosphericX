---
layout: doc
next: 
    text: 'Core.jsonc'
    link: /pages/configurations/core
prev:
    text: 'Troubleshooting'
    link: /pages/installation/troubleshooting
---

<img src="/logo.png" alt="AtmosphericX Logo" width="200" style="display: block; margin: 0 auto;" />
<small class="page-author">Written By: <b>KiyoWx</b> & <b>StarflightWx</b></small><br/>
<small class="last-updated">Last Updated: <b>Mar 9th, 2026</b></small><br><br><br>

# Configurations Introduction
---
AtmosphericX configuration ranges from simple tweaks to advanced customizations. Core settings are stored in `.jsonc` files located in the configurations directory, making it easy to edit your instance safely.

## What is JSONC?
JSONC (JSON with Comments) is a variant of standard JSON that supports JavaScript style comments (`//` or `/* */`). It is ideal for configuration files because it allows you to document your settings without affecting functionality. **Comments are ignored by the parser**, so they won’t break the configuration.

### Example Syntax
```jsonc
{
  // This is a comment explaining the setting
  "name": "example"
}
```

## Why AtmosphericX Uses JSONC
Using JSONC allows you to include comments directly in configuration files.  
This helps you understand each setting before making changes, without needing separate documentation. It also makes collaboration easier, as notes and explanations can live alongside the settings.


::: tip Backup Reminder
Always back up your configuration files before making changes. This ensures you can restore your settings if something breaks.
:::

::: danger Mismatch Hashes
AtmosphericX uses **SHA-1 checksums** to verify that your configuration files match their expected version.  

- Console warnings indicate a mismatch between your local config and the current release.  
- This is **normal** and simply validates your files.  
- Always ensure your configuration files are up to date with the latest AtmosphericX version to avoid unexpected behavior.
:::