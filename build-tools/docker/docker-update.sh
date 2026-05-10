#!/bin/bash
set -e

configurations_directory="../../../configurations"
repository="AtmosphericX/AtmosphericX"
branch="main"
git_hub_token="$1"

project_root="$(cd "$(dirname "$0")/../../../" && pwd)"

echo "=== AtmosphericX AUTO UPDATE MODE ==="

if compgen -G "$configurations_directory/*" > /dev/null 2>&1; then
    timestamp=$(date +"%Y%m%d_%H%M%S")
    backup_dir="$project_root/backups/auto_backup_$timestamp"
    mkdir -p "$backup_dir"

    cp -a "$configurations_directory/." "$backup_dir/" || true
    echo "Configs backed up -> $backup_dir"
else
    echo "No configs to backup"
fi

echo "Updating repository..."

tmpdir=$(mktemp -d)

if [[ -n "$git_hub_token" ]]; then
    clone_url="https://$git_hub_token@github.com/$repository.git"
else
    clone_url="https://github.com/$repository.git"
fi

git clone --depth=1 "$clone_url" "$tmpdir"

rsync -a --delete \
    --exclude='.git' \
    --exclude='configurations' \
    "$tmpdir/" "$project_root/"

rm -rf "$tmpdir"

echo "Repository updated"

cd "$project_root/project"

echo "Installing dependencies..."
rm -rf node_modules package-lock.json
npm install --no-save


echo "Building project..."
npm run docs:build || true
npm run build || true

echo "=== UPDATE COMPLETE ==="