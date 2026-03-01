#!/bin/bash

echo "1. Run Project"
echo "2. Build Project"

read -p "Choose an option: " choice

if [ "$choice" = "1" ]; then
    cd ../project
    npm run start
elif [ "$choice" = "2" ]; then
    cd ../project
    npm run docs:build
    npm run build
else
    cd ../project
    npm run start
fi
