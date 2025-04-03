#!/bin/bash

# Exit on error
set -e

# Configuration file path
CONFIG_FILE="config/config.json"

# Log levels
LOG_LEVEL_DEBUG=0
LOG_LEVEL_INFO=1
LOG_LEVEL_WARN=2
LOG_LEVEL_ERROR=3

# Default log level
LOG_LEVEL=$LOG_LEVEL_INFO

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Logging functions
log_debug() {
    if [ $LOG_LEVEL -le $LOG_LEVEL_DEBUG ]; then
        echo -e "${BLUE}[DEBUG]${NC} $(date '+%Y-%m-%d %H:%M:%S') - $1"
    fi
}

log_info() {
    if [ $LOG_LEVEL -le $LOG_LEVEL_INFO ]; then
        echo -e "${GREEN}[INFO]${NC} $(date '+%Y-%m-%d %H:%M:%S') - $1"
    fi
}

log_warn() {
    if [ $LOG_LEVEL -le $LOG_LEVEL_WARN ]; then
        echo -e "${YELLOW}[WARN]${NC} $(date '+%Y-%m-%d %H:%M:%S') - $1"
    fi
}

log_error() {
    if [ $LOG_LEVEL -le $LOG_LEVEL_ERROR ]; then
        echo -e "${RED}[ERROR]${NC} $(date '+%Y-%m-%d %H:%M:%S') - $1" >&2
    fi
}

# Error handling
handle_error() {
    local exit_code=$?
    local line_number=$1
    local script_name=$2
    log_error "Error occurred in $script_name at line $line_number (exit code: $exit_code)"
    exit $exit_code
}

# Trap errors
trap 'handle_error ${LINENO} ${BASH_SOURCE[0]}' ERR

# Configuration functions
load_config() {
    if [ -f "$CONFIG_FILE" ]; then
        log_debug "Loading configuration from $CONFIG_FILE"
        # Use jq to parse JSON if available
        if command -v jq &> /dev/null; then
            export CONFIG=$(cat "$CONFIG_FILE")
        else
            log_warn "jq not found. Using basic config parsing."
            export CONFIG=$(cat "$CONFIG_FILE")
        fi
    else
        log_warn "Configuration file not found at $CONFIG_FILE"
    fi
}

get_config_value() {
    local key=$1
    local default=$2
    
    if [ -n "$CONFIG" ]; then
        if command -v jq &> /dev/null; then
            local value=$(echo "$CONFIG" | jq -r ".$key")
            echo "${value:-$default}"
        else
            # Basic grep-based parsing
            local value=$(echo "$CONFIG" | grep -o "\"$key\":\"[^\"]*\"" | cut -d'"' -f4)
            echo "${value:-$default}"
        fi
    else
        echo "$default"
    fi
}

# Input validation
validate_input() {
    local value=$1
    local name=$2
    local required=$3
    
    if [ "$required" = "true" ] && [ -z "$value" ]; then
        log_error "$name is required"
        return 1
    fi
    
    return 0
}

# File operations
check_file_exists() {
    local file=$1
    local required=$2
    
    if [ ! -f "$file" ]; then
        if [ "$required" = "true" ]; then
            log_error "Required file not found: $file"
            return 1
        else
            log_warn "File not found: $file"
            return 0
        fi
    fi
    
    return 0
}

# Directory operations
ensure_directory() {
    local dir=$1
    
    if [ ! -d "$dir" ]; then
        log_info "Creating directory: $dir"
        mkdir -p "$dir"
    fi
}

# Git operations
git_checkout_branch() {
    local branch=$1
    local repo=$2
    
    log_info "Checking out branch: $branch"
    git checkout "$branch" || {
        log_error "Failed to checkout branch: $branch"
        return 1
    }
}

git_pull_latest() {
    log_info "Pulling latest changes"
    git pull || {
        log_error "Failed to pull latest changes"
        return 1
    }
}

# WordPress specific functions
wp_cli_check() {
    if ! command -v wp &> /dev/null; then
        log_error "WP-CLI is not installed"
        return 1
    fi
    return 0
}

wp_get_version() {
    local path=$1
    wp core version --path="$path" 2>/dev/null || {
        log_error "Failed to get WordPress version from: $path"
        return 1
    }
}

# Cleanup function
cleanup() {
    local exit_code=$?
    log_info "Cleaning up..."
    # Add cleanup operations here
    exit $exit_code
}

# Register cleanup function
trap cleanup EXIT

# Backup function
create_backup() {
    local source="$1"
    local backup_dir="$2"
    local timestamp=$(date +%Y%m%d_%H%M%S)
    
    log_info "Creating backup of $source"
    
    # Create backup directory if it doesn't exist
    mkdir -p "$backup_dir"
    
    # Create backup
    tar -czf "$backup_dir/backup_$timestamp.tar.gz" "$source"
    
    if [ $? -eq 0 ]; then
        log_info "Backup created successfully at $backup_dir/backup_$timestamp.tar.gz"
    else
        log_error "Failed to create backup"
        exit 1
    fi
}

# Restore function
restore_backup() {
    local backup_file="$1"
    local target="$2"
    
    log_info "Restoring backup from $backup_file to $target"
    
    # Extract backup
    tar -xzf "$backup_file" -C "$target"
    
    if [ $? -eq 0 ]; then
        log_info "Backup restored successfully"
    else
        log_error "Failed to restore backup"
        exit 1
    fi
}

# Check command exists
check_command() {
    local cmd="$1"
    
    if ! command -v "$cmd" &> /dev/null; then
        log_error "Required command '$cmd' is not installed"
        exit 1
    fi
}

# Validate WordPress installation
validate_wordpress() {
    local path="$1"
    
    log_info "Validating WordPress installation at $path"
    
    if [ ! -f "$path/wp-config.php" ]; then
        log_error "WordPress installation not found at $path"
        exit 1
    fi
    
    if [ ! -d "$path/wp-content" ]; then
        log_error "WordPress content directory not found at $path/wp-content"
        exit 1
    fi
    
    log_info "WordPress installation validated successfully"
}

# Update file permissions
update_permissions() {
    local path="$1"
    local user="$2"
    local group="$3"
    local perms="$4"
    
    log_info "Updating permissions for $path"
    
    chown -R "$user:$group" "$path"
    chmod -R "$perms" "$path"
    
    log_info "Permissions updated successfully"
} 