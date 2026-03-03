#!/bin/bash

configurations_directory="../configurations"
current_version=$(cat ../storage/store/version.bin)
repository="AtmosphericX/AtmosphericX"
branch="beta"
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
    fi
    return 1
}

get_is_config_hash_change() {
    local project_root="$(cd "$(dirname "$0")/.." && pwd)"
    local local_file="$project_root/storage/store/confighash.bin"
    local remote_url="https://raw.githubusercontent.com/$repository/$branch/storage/store/confighash.bin"

    if [[ ! -f "$local_file" ]]; then
        echo "Local file missing"
        return 0
    fi

    local local_content remote_content
    local_content=$(tr -d '\r\n' < "$local_file")
    remote_content=$(curl -fsSL "$remote_url" 2>/dev/null | tr -d '\r\n')

    if [[ "$local_content" == "$remote_content" ]]; then
        return 1
    else
        return 0
    fi
}

get_user_backup_options() {
    printf "We've detected a new configuration file from a new version\n"
    printf "Would you like to backup your configurations? (Y/n) "
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
        cp -a "$configurations_directory/." "$backup_dir/" || return 1
        echo "Configurations backed up to folder: $backup_dir"
    else
        echo "Skipping configuration backup."
    fi
}

install_dependencies() {
    cd ../project
    rm -rf node_modules package-lock.json
    npm install . --no-save
    echo "AtmosphericX dependencies installed successfully."
}

get_user_update_confirmation() {
    get_is_config_hash_change
    preserve_configurations=$?

    printf "Do you want to proceed with the update? (y/N) "
    read -r update_confirmation
    [[ ! "$update_confirmation" =~ ^[Yy]$ ]] && exit 0

    (
        project_root="$(cd "$(dirname "$0")/.." && pwd)"

        if [[ -d "$project_root/.git" ]]; then
            pushd "$project_root" >/dev/null || exit 1

            if git ls-files --error-unmatch configurations >/dev/null 2>&1; then
                git rm -r --cached configurations >/dev/null 2>&1 || true
                grep -qxF "configurations/" .gitignore 2>/dev/null || echo "configurations/" >> .gitignore
                git add .gitignore >/dev/null 2>&1 || true
                git commit -m "Stop tracking configurations directory" >/dev/null 2>&1 || true
            fi

            orig_url=$(git remote get-url origin 2>/dev/null || true)
            [[ -n "$git_hub_token" ]] && git remote set-url origin "https://$git_hub_token@github.com/$repository.git"
            git fetch origin "$branch" --depth=1 || exit 1

            if [[ "$preserve_configurations" -eq 1 ]]; then
                git checkout origin/$branch -- . ':!configurations'
            else
                git reset --hard origin/$branch || exit 1
            fi

            [[ -n "$orig_url" && -n "$git_hub_token" ]] && git remote set-url origin "$orig_url"
            popd >/dev/null || true
        else
            tmpdir=$(mktemp -d)

            if [[ -n "$git_hub_token" ]]; then
                clone_url="https://$git_hub_token@github.com/$repository.git"
            else
                clone_url="https://github.com/$repository.git"
            fi

            git clone --depth=1 "$clone_url" "$tmpdir" || { rm -rf "$tmpdir"; exit 1; }

            if command -v rsync >/dev/null 2>&1; then
                if [[ "$preserve_configurations" -eq 1 ]]; then
                    rsync -a --delete --exclude='.git' --exclude='configurations' "$tmpdir/" "$project_root/"
                else
                    rsync -a --delete --exclude='.git' "$tmpdir/" "$project_root/"
                fi
            else
                cd "$tmpdir" || { rm -rf "$tmpdir"; exit 1; }
                if [[ "$preserve_configurations" -eq 1 ]]; then
                    find . -mindepth 1 -maxdepth 1 ! -name 'configurations' -exec cp -a "{}" "$project_root/" \; || { rm -rf "$tmpdir"; exit 1; }
                else
                    cp -a ./* "$project_root/" || { rm -rf "$tmpdir"; exit 1; }
                fi
            fi

            rm -rf "$tmpdir"
        fi

        [[ -n "$remote_changelogs_url" ]] && printf "\nChangelog:\n%s\n\n" "$remote_changelogs_url"

        echo "Do you want to fetch the latest dependencies? [Y/n]"
        read -r depend_confirm
        if [[ "$depend_confirm" =~ ^[Yy]$ ]]; then
            install_dependencies
        fi

        cd ../project
        npm run docs:build
        npm run build
    )
}

get_repository_information() {
    local api_base="https://api.github.com/repos/$repository/contents"
    local path_version="storage/store/version.bin"
    local path_changelog="storage/store/changelog.bin"

    if [[ -n "$git_hub_token" ]]; then
        remote_version=$(curl -fsSL -H "Authorization: token $git_hub_token" -H "Accept: application/vnd.github.v3.raw" "$api_base/$path_version?ref=$branch") || return 1
        remote_changelogs_url=$(curl -fsSL -H "Authorization: token $git_hub_token" -H "Accept: application/vnd.github.v3.raw" "$api_base/$path_changelog?ref=$branch") || return 1
    else
        remote_version=$(curl -fsSL "https://raw.githubusercontent.com/$repository/$branch/$path_version") || return 1
        remote_changelogs_url=$(curl -fsSL "https://raw.githubusercontent.com/$repository/$branch/$path_changelog") || return 1
    fi

    echo -e "current_version\t$current_version"
    echo -e "remote_version\t$remote_version"
    echo -e "============ changelogs ============\n$remote_changelogs_url\n"

    get_repository_is_updated "$current_version" "$remote_version"
    get_is_config_hash_change
    is_config_hash_change=$?
    if [[ "$is_config_hash_change" -eq 0 ]]; then
        get_user_backup_options
    fi
    get_user_update_confirmation
    read -r -p "Press Enter to continue..."
}

get_repository_information