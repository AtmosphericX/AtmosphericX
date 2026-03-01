---
layout: doc
next: 
    text: 'Configuration Introduction'
    link: /pages/configurations/index
prev:
    text: 'Updating AtmosphericX'
    link: /pages/installation/updating-atmosphericx
---

<img src="/logo.png" alt="AtmosphericX Logo" width="200" style="display: block; margin: 0 auto;" />
<small class="page-author">Written By: <b>KiyoWx</b></small><br/>
<small class="last-updated">Last Updated: <b>Feb 27th, 2026</b></small><br>

# Installation Troubleshooting Guide
If you followed the Installation Guide but encounter issues, this troubleshooting section addresses the most common problems. For problems not listed here, join our [Discord server](https://discord.gg/YAEjtzU3E8) and provide detailed information. Support is community based and mostly volunteer.

::: tip Before you troubleshoot
Confirm that you completed every step in the [Installation Guide](./installation). This list mainly addresses Windows issues; macOS and Linux users may not encounter all problems.
:::


## Common Issues and Solutions
::: danger VS not looking for VS2017 ([Issue #61](https://github.com/AtmosphericX/AtmosphericX/issues/61))
The installer cannot find Visual C++ Redistributable for Visual Studio 2017 or later.

**Solution:**
1. Download the latest Redistributable: <https://learn.microsoft.com/en-us/cpp/windows/latest-supported-vc-redist?view=msvc-170>  
2. Install the correct version for your system (x64 / x86).  
3. Re-run the installation.

> Tip: If `better-sqlite3` fails, see [its troubleshooting guide](https://github.com/WiseLibs/better-sqlite3/blob/master/docs/troubleshooting.md).
:::


::: danger Python not found during installation
During the installation, the process fails because it cannot find Python 3.8 or newer.
Please ensure Python is installed and added to your system PATH.
1. Install **Python 3.8 or newer** from:  
   <https://www.python.org/downloads/>
2. During installation, ensure **“Add Python to PATH”** is checked.  
3. Open a new terminal and verify Python is available:
   ```bash
   py --version
   # or...
   python3 --version
   ```
4. Re-run the AtmosphericX installation.
:::

::: danger 3. Port 80 already in use
When starting AtmosphericX, it fails to bind to port 80 because another application is already using it or insufficient permissions.
1. Identify the application using port 80:
::: code-group
```sh [Windows]
netstat -aon | findstr :80
```
```sh [Linux/macOS]
sudo lsof -i :80
```
```sh [Linux Elevated Start]
cd build-tools
sudo bash run.sh
```
2. Stop the conflicting application or change its port.  
:::


::: danger 4. Instant Closure on Start
AtmosphericX starts but immediately exits without errors. 
Run AtmosphericX from a terminal to instead of double-clicking the script. This way, you can see any error messages.

```sh
cd project
npm run start
```
2. Check the terminal output for errors and address them accordingly.
3. If the issue persists, consider reaching out on our [Discord server](https://discord.gg/YAEjtzU3E8) for further assistance. Please make sure to include any error logs or messages you encounter.
:::


## Quick fix (TLDR)

| Issue | Quick Fix |
|-------|-----------|
| VS Redistributable | Install latest VS2017+ Redistributable |
| Python missing | Install Python 3.8+, add to PATH |
| Port 80 in use | Stop conflicting app or change port |
| Instant closure | Run from terminal, check errors |
