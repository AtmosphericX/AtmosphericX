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
<small class="last-updated">Last Updated: <b>Mar 9th, 2026</b></small><br><br><br>

# Installation Troubleshooting Guide
If you followed the Installation Guide but encounter issues, this troubleshooting section addresses the most common problems. For problems not listed here, join our [Discord server](https://atmosphericx-discord.scriptkitty.cafe) and provide detailed information. Support is community based and mostly volunteer.

::: tip Before you troubleshoot
Confirm that you completed every step in the [Installation Guide](./installation). This troubleshooting guide primarily addresses Windows issues. macOS and Linux users may encounter fewer of these problems.
:::


## Common Issues and Solutions
::: danger VS not looking for VS2017 ([Issue #61](https://github.com/AtmosphericX/AtmosphericX/issues/61))
The installer cannot find Visual C++ Redistributable for Visual Studio 2017 or later.

**Solution:**
1. Download the latest Redistributable: <https://learn.microsoft.com/en-us/cpp/windows/latest-supported-vc-redist?view=msvc-170>  
2. Install the correct version for your system (x64 / x86).  
3. Install Desktop Development with C++
4. Re-run the installation.

> Tip: If `better-sqlite3` fails, see [its troubleshooting guide](https://github.com/WiseLibs/better-sqlite3/blob/master/documentation/troubleshooting.md).
:::


::: danger Python not found during installation
During the installation, the process fails because it cannot find Python 3.8 or newer.
Make sure Python is installed and added to your system PATH.
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
> Tip: On Windows, running the script as Administrator may be required to bind to port 80.
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
sudo bash start.sh
```
2. Stop the conflicting application or change its port.  
:::



::: danger 4. Instant Closure on Start
AtmosphericX starts but immediately exits without errors. 
Run AtmosphericX from a terminal rather than double-clicking the script. This allows you to see any error messages.

```sh
cd project
npm run start
```
2. Check the terminal output for errors and address them accordingly.
:::


::: tip Need more help?
If your problem isn’t listed here, join our [Discord server](https://atmosphericx-discord.scriptkitty.cafe) and provide detailed information, including:
- Your operating system
- Steps you took during installation
- Any error logs or messages

Community support is volunteer-based, so please be patient.
:::