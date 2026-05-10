#!/bin/bash

set -e

PROJECT_DIR="$(cd "$(dirname "$0")/../../project" && pwd)"
cd "$PROJECT_DIR"

echo "Cleaning previous install..."
rm -rf node_modules package-lock.json
echo "Installing dependencies..."
npm install --no-save
echo "AtmosphericX dependencies installed successfully."
echo "You can now run start.sh under build-tools."