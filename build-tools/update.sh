#!/bin/bash

configurations_directory="../configurations"
current_version=$(cat ../storage/store/version.bin)
repository="AtmosphericX/AtmosphericX"
git_hub_token="$1"

version_lt() {
    [[ "$(printf '%s\n' "$1" "$2" | sort -V | head -n1)" != "$2" ]]
}

get_repository_is_updated() {
    local version="$1"
    local remote_version="$2"
    local clean_version="${version%% *}"
    local clean_remote_version="${remote_version%% *}"
    if version_lt "$clean_version" "$clean_remote_version"; then
        echo "Update available: $clean_version -> $clean_remote_version"
        return 1
    else
        echo "Already up to date: $clean_version"
        return 0
    fi
}


get_repository_information() {
    local token="$git_hub_token"
    local api_base="https://api.github.com/repos/$repository/contents"
    local path_version="storage/store/version.bin"
    local path_changelog="storage/store/changelog.bin"

    if [[ -n "$token" ]]; then
        remote_version=$(curl -fsSL \
            -H "Authorization: token $token" \
            -H "Accept: application/vnd.github.v3.raw" \
            "$api_base/$path_version?ref=beta") \
            || { echo "Failed to fetch remote version" >&2; return 1; }

        remote_changelogs_url=$(curl -fsSL \
            -H "Authorization: token $token" \
            -H "Accept: application/vnd.github.v3.raw" \
            "$api_base/$path_changelog?ref=beta") \
            || { echo "Failed to fetch remote changelog" >&2; return 1; }
    else
        echo "GITHUB_TOKEN not set. Attempting unauthenticated fetch..." >&2

        remote_version=$(curl -fsSL \
            "https://raw.githubusercontent.com/$repository/beta/$path_version") \
            || { echo "Failed to fetch remote version" >&2; return 1; }

        remote_changelogs_url=$(curl -fsSL \
            "https://raw.githubusercontent.com/$repository/beta/$path_changelog") \
            || { echo "Failed to fetch remote changelog" >&2; return 1; }
    fi

    echo -e "current_version\t$current_version"
    echo -e "remote_version\t$remote_version"
    echo -e "============ changelogs ============\n$remote_changelogs_url\n\n\n"
    get_repository_is_updated "$current_version" "$remote_version"
    if [[ $? -eq 1 ]]; then
        get_user_backup_options
        get_user_update_confirmation
    fi
    read -r -p "Press Enter to continue..."
}

get_user_backup_options() {
    printf "Would you like to backup your configurations? This is recommended before updating.\n(Y/n) "
    printf "Please remember that if this update uses a different configuration or has made changes to existing configurations, you may need to manually adjust your backed up configurations to ensure compatibility.\n"
    read -r backup_configurations_boolean

    if [[ "$backup_configurations_boolean" =~ ^[Yy]?$ ]]; then
        if ! compgen -G "$configurations_directory/*" > /dev/null; then
            echo "No configurations found to back up."
            return 0
        fi
        timestamp=$(date +"%Y%m%d_%H%M%S")
        safe_version=$(echo "$current_version" | tr ' ' '_')
        backup_dir="../backups/backup_${timestamp}_${safe_version}"
        mkdir -p "$backup_dir"
        cp -a "$configurations_directory/." "$backup_dir/"
        if [[ $? -eq 0 ]]; then
            echo "Configurations backed up to folder: $backup_dir"
        else
            echo "Backup failed." >&2
            return 1
        fi
    else
        echo "Skipping configuration backup."
    fi
}


get_user_update_confirmation() {
    printf "Do you want to proceed with the update? (y/N) "
    read -r update_confirmation
    if [[ "$update_confirmation" =~ ^[Yy]$ ]]; then
        echo "Proceeding with update..."
        (
            project_root="$(cd "$(dirname "$0")/.." && pwd)"
            if [[ -d "$project_root/.git" ]]; then
                echo "Updating repository in $project_root..."
                pushd "$project_root" >/dev/null || exit 1
                orig_url=$(git remote get-url origin 2>/dev/null || true)
                if [[ -n "$git_hub_token" ]]; then
                    auth_url="https://$git_hub_token@github.com/$repository.git"
                    git remote set-url origin "$auth_url"
                fi
                if git fetch origin beta --depth=1 && git reset --hard origin/beta; then
                    echo "Repository updated to $(git rev-parse --short HEAD)"
                else
                    echo "Git update failed." >&2
                    [[ -n "$orig_url" && -n "$git_hub_token" ]] && git remote set-url origin "$orig_url"
                    popd >/dev/null || true
                    exit 1
                fi
                [[ -n "$orig_url" && -n "$git_hub_token" ]] && git remote set-url origin "$orig_url"
                popd >/dev/null || true
            else
                tmpdir=$(mktemp -d)
                echo "No git repo found. Cloning repository to temporary directory..."
                if [[ -n "$git_hub_token" ]]; then
                    clone_url="https://$git_hub_token@github.com/$repository.git"
                else
                    clone_url="https://github.com/$repository.git"
                fi
                if git clone --depth=1 "$clone_url" "$tmpdir"; then
                    echo "Replacing current files with the cloned copy..."
                    if command -v rsync >/dev/null 2>&1; then
                        rsync -a --delete --exclude='.git' "$tmpdir/" "$project_root/"
                    else
                        cp -a "$tmpdir/." "$project_root/" || { rm -rf "$tmpdir"; echo "Copy failed." >&2; exit 1; }
                    fi
                    rm -rf "$tmpdir"
                    echo "Files updated from clone."
                else
                    rm -rf "$tmpdir"
                    echo "Clone failed." >&2
                    exit 1
                fi
            fi
            [[ -n "$remote_changelogs_url" ]] && printf "\nChangelog:\n%s\n\n" "$remote_changelogs_url"
            install_dependencies
            echo "Update finished successfully."
        )
    else
        exit 0
    fi
}

install_dependencies() {
    echo Installing project NPM dependencies...
    cd ../project
    rm -rf node_modules package-lock.json
    npm install . --no-save
    echo "AtmosphericX dependencies installed successfully. You can now run the project using 'run.sh' under build-tools."
}


get_repository_information
