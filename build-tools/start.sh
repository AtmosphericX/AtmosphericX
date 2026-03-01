#!/bin/bash

choice=$1

if [ -z "$choice" ]; then
    echo "1. Run Project"
    echo "2. Build Project"
    read -p "Choose an option: " choice
fi

cd ../project

case "$choice" in
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
