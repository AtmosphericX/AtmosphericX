---
layout: doc
prev:
    text: 'Introduction'
    link: /pages/installation/index
next: 
    text: 'Post Installation'
    link: /pages/installation/post-installation
---

<img src="/logo.png" alt="AtmosphericX Logo" width="200" style="display: block; margin: 0 auto;" />
<small class="page-author">Written By: <b>KiyoWx</b> & <b>StarflightWx</b></small><br/>
<small class="last-updated">Last Updated: <b>Feb 27th, 2026</b></small><br><br><br>

# Installation Guide
---
This guide provides step-by-step instructions for installing AtmosphericX, including system requirements, OS specific steps, and troubleshooting tips. For additional support, join our [Discord Community](https://atmosphericx-discord.scriptktity.cafe) for volunteer support.

::: info Documentation Notice
Please keep in mind that this project is **actively** being maintained and updated, so be sure to check for information and updates. The primary documentation page can be found [here](https://atmosphericx.scriptkitty.cafe/documentation). Each instance will have it's own documentation as well which can be found at `/documentation` on the respective instance. 

Please also be mindful that all help is community based since this is an open source project. You are welcome to ask questions if you encounter them but please keep in mind that most issues will be in the [troubleshooting](./troubleshooting) guide. If it's not listed there for your installation process. Please submit an issue on our [GitHub repository](https://github.com/AtmosphericX/AtmosphericX).
If you have questions for the developers, please feel free to reach out to the public [Discord server](https://atmosphericx-discord.scriptktity.cafe).
Please be aware that support is **limited** and mostly **volunteer** based as the main project developers work on this in their free time.
:::

## System Requirements & Specifications
AtmosphericX requires a modern web browser and a mostly stable internet connection. Additionally, system and application requirements will be need to be met for a smooth and stable installation process.

| Type | Version | Purpose |
|------|------|------|
| [Node.js](https://nodejs.org/en/download/) | `Node 20.14.0+` | Primary Language & Backend |
| [Python](https://www.python.org/downloads/) | `Python 3.8+` | Required for building native modules |
| [Visual C++ Redistributable](https://learn.microsoft.com/en-us/cpp/windows/latest-supported-vc-redist?view=msvc-170) | `2015+` | Required for native modules on Windows |
| [Git](https://git-scm.com/downloads) | `Latest` | For cloning and updating the project |
| [Windows](https://www.microsoft.com/en-us/windows) | `Win10+` | OS Supported
| [Linux](https://www.linux.org/) | `Arch`, `Debian`, `Ubuntu` | OS Supported |
| [MacOS](https://www.apple.com/macos/) | `12+ (Monterey+)` | OS Supported |
| 2GB+ Free Disk Space |  | For project files and dependencies | 

::: danger Please be aware

As of AtmosphericX v8, `Node.js 20+` is required and we've also migrated from `JavaScript` to `TypeScript`. So please be ensure your environments meets these requirement. Versions prior are **DEPRECATED** and can't be upgraded due to major architectural changes. If you are upgrading from an earlier release, perform a fresh installation and migrate any data or configuration as necessary.
:::

::: danger RaspberryPi + OrangePi Support
The Raspberry Pi is supported but please make sure to have the Model 4 version as AtmosphericX needs at least 2GB of memory to run this project smoothly. The OrangePi is **NOT** supported so please don't ask about this. We will try to get a workaround in the future.
:::

`Starflight: Redo this section - We moved building and running in the same script`

## Installation Process
Installing AtmosphericX is a straightforward process as long as you **CAREFULLY** read and follow the introductions and meet the mentioned [system specifications](#system-requirements-specifications). Down below are installation steps for each OS including a limited easy install script for users that are not familiar with these applications.

###
::: details [Easy Installation] Simple Windows Installation Script
```sh
# This script is designed for Windows 10 and later. If you wish to install manually, please refer to the manual installation steps below.
curl -L -o Git-2.50.0.2-64-bit.exe https://github.com/git-for-windows/git/releases/download/v2.50.0.windows.2/Git-2.50.0.2-64-bit.exe
curl -L -o node-v22.17.0-x64.msi https://nodejs.org/dist/v22.17.0/node-v22.17.0-x64.msi
start /wait Git-2.50.0.2-64-bit.exe
start /wait node-v22.17.0-x64.msi

set "PATH=%ProgramFiles%\Git\cmd;%PATH%"
set "PATH=%ProgramFiles%\nodejs;%PATH%"
npm --version

del Git-2.50.0.2-64-bit.exe & 
del node-v22.17.0-x64.msi

git --version
git clone -b beta https://github.com/AtmosphericX/AtmosphericX.git
cd AtmosphericX
cd build-tools
start /wait install.sh &
start /wait start.sh
```
:::


###
::: details [Manual] Windows (10/11) Installation Steps
1. Installing Git and Cloning Repository
> If you haven't already, download and install Git from [here](https://git-scm.com/downloads). Once installed, open **Command Prompt** or **Windows Terminal** and type the following command to clone the AtmosphericX repository. Once cloned, navigate into the project directory.
```sh
git clone -b beta https://github.com/AtmosphericX/AtmosphericX.git
```

2. Installing Dependencies
> Navigate to the `build-tools` directory and run the `install.sh` script to install all necessary dependencies. You can execute this script using **Git Bash**, **Windows Terminal**, or by double-clicking the file. This will install all of the NodeJS `npm` packages required to run AtmosphericX. If you encounter any issues, please check the [troubleshooting](./troubleshooting) section below.

3. Building AtmosphericX
> After installation, navigate back to the `build-tools` directory and run the `start.sh` script to build the project.

**TL;DR Instructions**
::: code-group
```sh [1. Cloning the repository]
git clone -b beta https://github.com/AtmosphericX/AtmosphericX.git
cd AtmosphericX
```

```sh [2. Installing dependencies]
cd build-tools
install.sh
```

```sh [3. Building AtmosphericX]
cd build-tools
start.sh # Build the project and then run after building.
```
:::

###
::: details [Manual] Linux (Debian) Installation Steps
1. Installing Git and Cloning Repository
> Open your terminal and ensure your system is up to date. Install essential packages including Git, Curl, Python3, Node.js, NPM, and build tools. Then clone the AtmosphericX repository. 
```sh
# Updating system and installing dependencies
sudo apt-get update && sudo apt-get upgrade -y
sudo apt-get install -y git curl python3 build-essential
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt-get install -y nodejs
```

2. Cloning the Repository
> Once the dependencies are installed, clone the AtmosphericX repository and navigate into the project directory.
```sh
git clone -b beta https://github.com/AtmosphericX/AtmosphericX.git
cd AtmosphericX
```

3. Installing NPM Dependencies
> Navigate to the `build-tools` directory and run the `install.sh` script to install all necessary dependencies.
```sh
cd build-tools
./install.sh # or bash install.sh
```

4. Building AtmosphericX
> After installation, navigate back to the `build-tools` directory and run the `start.sh` script to build the project.
```sh
cd build-tools
./start.sh # Build the project and then run after building.
```

**TL;DR Instructions**
::: code-group
```sh [1. Installing dependencies and cloning repository]
sudo apt-get update && sudo apt-get upgrade -y
sudo apt-get install -y git curl python3 build-essential
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt-get install -y nodejs
git clone -b beta https://github.com/AtmosphericX/AtmosphericX.git
cd AtmosphericX
```

```sh [2. Installing NPM dependencies]
cd build-tools
./install.sh # or bash install.sh
```

```sh [3. Building AtmosphericX]
cd build-tools
./start.sh # Build the project and then run after building.
```
:::

###
::: details [Manual] Linux (Arch) Installation Steps
1. Installing Git and Cloning Repository
> Open your terminal and ensure your system is up to date. Install essential packages including Git, Curl, Python3, Node.js, NPM, and build tools. Then clone the AtmosphericX repository. 
```sh
# Updating system and installing dependencies
sudo pacman -Syu
sudo pacman -S git curl python nodejs npm base-devel
```

2. Cloning the Repository
> Once the dependencies are installed, clone the AtmosphericX repository and navigate into the project directory. 
```sh
git clone -b beta https://github.com/AtmosphericX/AtmosphericX.git
cd AtmosphericX
```

3. Installing NPM Dependencies
> Navigate to the `build-tools` directory and run the `install.sh` script to install
all necessary dependencies.
```sh
cd build-tools
./install.sh # or bash install.sh
```

4. Building AtmosphericX
> After installation, navigate back to the `build-tools` directory and run the `start.sh` script to build the project.
```sh
cd build-tools
./start.sh # Build the project and then run after building.
```

**TL;DR Instructions**
::: code-group
```sh [1. Installing dependencies and cloning repository]
sudo pacman -Syu
sudo pacman -S git curl python nodejs npm base-devel
git clone -b beta https://github.com/AtmosphericX/AtmosphericX.git
cd AtmosphericX
```

```sh [2. Installing NPM dependencies]
cd build-tools
./install.sh # or bash install.sh
```

```sh [3. Building AtmosphericX]
cd build-tools
./start.sh # Build the project and then run after building.
```

:::


## Post Installation
Congratulations, you have most likely successfully completed the installation process of AtmosphericX. If you are still facing issues, please refer to [the troubleshooting guide](./troubleshooting). You may continue to the next section for [post installation](./post-installation)