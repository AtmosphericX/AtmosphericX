#!/bin/bash

set -e
cd ../../project
echo "Cleaning previous install..."
rm -rf node_modules package-lock.json
echo "Installing dependencies..."
npm install --no-save
echo "AtmosphericX dependencies installed successfully."
echo "You can now run start.sh under build-tools."