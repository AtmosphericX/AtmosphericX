#!/bin/bash

cd ../project
echo "Removing node_modules and package-lock.json to ensure a clean installation..."
rm -rf node_modules package-lock.json
npm install . --no-save
echo "AtmosphericX dependencies installed successfully. You can now run the project using 'start.sh' under build-tools."
read -p "Press [Enter] key to exit..."