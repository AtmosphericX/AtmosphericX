---
layout: doc
next: 
    text: 'Troubleshooting'
    link: /pages/installation/troubleshooting
prev:
    text: 'Home'
    link: /
---

<img  src="/logo.png" alt="AtmosphericX Logo" width="200" style="display: block; margin-left: auto; margin-right: auto;" />
<small class="page-author">Written By: KiyoWx & StarflightWx</small><br/>
<small class="last-updated">Last Updated: Jan 23rd, 2026</small>

## Introduction
Welcome and thank you for using AtmosphericX. This guide will help you walkthrough the installation process step by step, give you an overview of the system requirements, and provide [troubleshooting](./troubleshooting.md) tips that you may face during installation. 

Additionally, this guide will help you get started with the basics of AtmosphericX, including configuration, account setup, widgets, and API references. 

Please keep in mind that this project is actively maintained and updated, so be sure to check back for the latest information and updates. The primary documentation can be found [here](https://atmosx.calrp.com/docs). Additionally, each instance will have its own documentation tailored to its specific version which can be found at `/docs` on the respective instance.

::: tip Developer Notice
Please be mindful that AtmosphericX is an open source project and contributions are welcome. If you encounter any issues or have suggestions for improvements, please feel free to submit a pull request or open an issue on the [GitHub repository](https://github.com/AtmosphericX/AtmosphericX). If you have any questions regarding the project or face bugs not mentioned in the troubleshooting section, please reach out to the community on our [Discord server](https://discord.gg/YAEjtzU3E8) for assistance. Please be aware that support is limited and mostly volunteer based as the main project developers work on this in their free time.
:::

## System Requirements
Before installing AtmosphericX, ensure that your system meets the following minimum requirements: 

| Platform | Support | Supported versions | Requirements |
|---|:---:|---|---|
| Windows | ✅ | 10, 11 | VS Redistributable C++ |
| macOS | ✅ | 12+ (Monterey+) | N/A
| Debian / Ubuntu | ✅ | Debian 11+, Ubuntu 22.04+ | N/A
| Raspberry Pi| ✅ | 64-bit OS images | N/A
| Orange Pi | ❌ | N/A | N/A
| Samsung Smart Fridge | ❌ | N/A | N/A


| Type | Version | Purpose |
|----------|---------|---------|
| [Node.js](https://nodejs.org/en/download/) | `20.0.0+` | Backend / Server |
| [Python](https://www.python.org/downloads/) | `3.8+` | Required for building native modules |
| [Visual C++ Redistributable](https://learn.microsoft.com/en-us/cpp/windows/latest-supported-vc-redist?view=msvc-170) | `2015+` | Required for native modules on Windows |
| [Git](https://git-scm.com/downloads) | `Latest` | For cloning and updating the project |
| 2GB+ Free Disk Space | N/A | For project files and dependencies | 

::: danger Important Note
As of AtmosphericX `v8`, `Node.js 20+` and the codebase has been migrated from `JavaScript` to `TypeScript`. Please ensure your environment meets these requirements and that you have **fully** read this section before proceeding.

Versions prior are **DEPRECATED** and cannot be upgraded due to major architectural changes If you are upgrading from an earlier release, perform a fresh installation and migrate any data or configuration as necessary.

:::


## Installation Steps
Installing AtmosphericX is a straightforward process as long as you *CAREFULLY* follow the previously mentioned system requirements and the steps outlined below.


###
::: details [Not Recommended] Simple Windows Installation (Script)
For users who prefer a more straightforward installation process, we provide a simple installation script that automates the setup of AtmosphericX on Windows systems.

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
git clone https://github.com/AtmosphericX/AtmosphericX.git
cd AtmosphericX
cd build-tools
start /wait install.sh &
start /wait run.sh
```
:::

###
::: details [Manual] Windows (10/11) Installation Steps
1. Installing Git and Cloning Repository
> If you haven't already, download and install Git from [here](https://git-scm.com/downloads). Once installed, open **Command Prompt** or **Windows Terminal** and type the following command to clone the AtmosphericX repository. Once cloned, navigate into the project directory.
```sh
git clone https://github.com/AtmosphericX/AtmosphericX.git
```

2. Installing Dependencies
> Navigate to the `build-tools` directory and run the `install.sh` script to install all necessary dependencies. You can execute this script using **Git Bash**, **Windows Terminal**, or by double-clicking the file. This will install all of the NodeJS `npm` packages required to run AtmosphericX. If you encounter any issues, please check the [Installation Issues](#installation-issues) section below.

3. Starting AtmosphericX
> After installation, navigate back to the `build-tools` directory and run the `run.sh` script to start the project.

**TL;DR Instructions**
::: code-group
```sh [1. Cloning the repository]
git clone https://github.com/AtmosphericX/AtmosphericX.git
cd AtmosphericX
```

```sh [2. Installing dependencies]
cd build-tools
install.sh
```

```sh [3. Starting AtmosphericX]
cd build-tools
run.sh # npm run start works as well if you are in the project directory
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
git clone https://github.com/AtmosphericX/AtmosphericX.git
cd AtmosphericX
```

3. Installing NPM Dependencies
> Navigate to the `build-tools` directory and run the `install.sh` script to install all necessary dependencies.
```sh
cd build-tools
./install.sh # or bash install.sh
```

4. Starting AtmosphericX
> After installation, navigate back to the `build-tools` directory and run the `run.sh
script to start the project.
```sh
cd build-tools
./run.sh # or bash run.sh (THIS WILL REQUIRE SUDO PERMISSIONS FOR CERTAIN PORTS)
```

**TL;DR Instructions**
::: code-group
```sh [1. Installing dependencies and cloning repository]
sudo apt-get update && sudo apt-get upgrade -y
sudo apt-get install -y git curl python3 build-essential
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt-get install -y nodejs
git clone https://github.com/AtmosphericX/AtmosphericX.git
cd AtmosphericX
```

```sh [2. Installing NPM dependencies]
cd build-tools
./install.sh # or bash install.sh
```

```sh [3. Starting AtmosphericX]
cd build-tools
./run.sh # or bash run.sh (THIS WILL REQUIRE SUDO PERMISSIONS FOR CERTAIN PORTS)
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
git clone https://github.com/AtmosphericX/AtmosphericX.git
cd AtmosphericX
```

3. Installing NPM Dependencies
> Navigate to the `build-tools` directory and run the `install.sh` script to install
all necessary dependencies.
```sh
cd build-tools
./install.sh # or bash install.sh
```

4. Starting AtmosphericX
> After installation, navigate back to the `build-tools` directory and run the `run.sh
script to start the project.
```sh
cd build-tools
./run.sh # or bash run.sh (THIS WILL REQUIRE SUDO PERMISSIONS FOR CERTAIN PORTS)
```

**TL;DR Instructions**
::: code-group
```sh [1. Installing dependencies and cloning repository]
sudo pacman -Syu
sudo pacman -S git curl python nodejs npm base-devel
git clone https://github.com/AtmosphericX/AtmosphericX.git
cd AtmosphericX
```

```sh [2. Installing NPM dependencies]
cd build-tools
./install.sh # or bash install.sh
```

```sh [3. Starting AtmosphericX]
cd build-tools
./run.sh # or bash run.sh (THIS WILL REQUIRE SUDO PERMISSIONS FOR CERTAIN PORTS)
```

:::
