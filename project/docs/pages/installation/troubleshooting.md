---
layout: doc
next: 
    text: 'Post-Installation'
    link: /pages/installation/post-installation
prev:
    text: 'Installation Guide'
    link: /pages/installation/index
---

<img  src="/logo.png" alt="AtmosphericX Logo" width="200" style="display: block; margin-left: auto; margin-right: auto;" />
<small class="page-author">Written By: KiyoWx & StarflightWx</small><br/>
<small class="last-updated">Last Updated: Jan 23rd, 2026</small>


## Troubleshooting Installation Issues
If you have successfully followed the installation steps but are encountering issues, this section provides solutions to common problems that may arise during the installation process. Please be sure to read through each potential issue and its corresponding solution.
If your specific issue is not listed here, consider reaching out to the community on our [Discord server](https://discord.gg/YAEjtzU3E8) for further assistance. Please provide as much detail as possible about the problem you are facing and be aware that support is limited and mostly volunteer based. 

If you are not encountering any issues, you may proceed to the [post-installation setup](./accounts) guide to continue setting up AtmosphericX.

::: tip Please read before troubleshooting
Before you start troubleshooting, confirm you've completed every step in the [Installation Guide](./index). This list is not exhaustive and some fixes may not apply to every environment. Many items address Windows specific problems, so macOS and Linux users may not encounter them.
:::

## Common Issues and Solutions

::: danger 1. VS not looking for VS2017 ([Issue #61](https://github.com/AtmosphericX/AtmosphericX/issues/61))
During installation, the process fails because it cannot find the Visual C++ Redistributable for Visual Studio 2017 or later.
1. Download the latest supported Visual C++ Redistributable from Microsoft:  
   <https://learn.microsoft.com/en-us/cpp/windows/latest-supported-vc-redist?view=msvc-170>  
2. Install the appropriate package(s) for your system (x64 / x86).  
3. Re-run the AtmosphericX installation.

If you still face issues, specifically with `better-sqlite3` during installation. Consider looking at [this guide](https://github.com/WiseLibs/better-sqlite3/blob/master/docs/troubleshooting.md) for additional help.
:::


::: danger 2. Python not found during installation
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
. Run AtmosphericX from a terminal to instead of double-clicking the script. This way, you can see any error messages.

```sh
cd build-tools
bash run.sh
```
2. Check the terminal output for errors and address them accordingly.
3. If the issue persists, consider reaching out on our [Discord server](https://discord.gg/YAEjtzU3E8) for further assistance. Please make sure to include any error logs or messages you encounter.
:::