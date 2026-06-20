#!/bin/bash

CHOICE=$1
PROJECT_DIR="$(cd "$(dirname "$0")/../project" && pwd)"
cd "$PROJECT_DIR"
if [ ! -d "$PROJECT_DIR/dist" ]; then
    echo "Automatically building project..."
    npm run build
fi

if [ -z "$CHOICE" ]; then
    echo "1. Run Project"
    echo "2. Build Project"
    read -p "Choose an option: " CHOICE
fi

case "$CHOICE" in
    1|run)
        npm run start
        ;;
    2|build)
        npm run docs:build
        npm run build
        ;;
    *)
        npm run start
        ;;
esac
