#!/bin/bash

# Exit on error
set -e

# Log function
log() {
    echo "[$(date +'%Y-%m-%d %H:%M:%S')] $1"
}

# Error function
error() {
    echo "[ERROR] $(date +'%Y-%m-%d %H:%M:%S')] $1" >&2
    exit 1
}

# Create backup function
create_backup() {
    local host=$1
    local user=$2
    local site_path=$3
    local backup_dir=$4
    
    log "Creating backup on $host..."
    
    # Create backup directory
    ssh -o StrictHostKeyChecking=no "$user@$host" "mkdir -p $backup_dir"
    
    # Backup themes directory
    ssh -o StrictHostKeyChecking=no "$user@$host" "tar -czf $backup_dir/themes_backup.tar.gz $site_path/wp-content/themes"
    
    log "Backup completed on $host"
}

# Main update process
main() {
    # Set site path
    local site_path="/var/www/html/$SITE_NAME"
    local backup_dir="/tmp/backups/themes/$SITE_NAME"
    
    # Create backup
    create_backup "$STAGING_HOST" "$STAGING_USER" "$site_path" "$backup_dir"
    
    # Update themes based on type
    if [ "$UPDATE_TYPE" = "all" ]; then
        log "Updating all themes..."
        ssh -o StrictHostKeyChecking=no "$STAGING_USER@$STAGING_HOST" "cd $site_path && wp theme update --all --allow-root"
    else
        log "Updating selected themes: $THEME_LIST"
        IFS=',' read -ra THEMES <<< "$THEME_LIST"
        for theme in "${THEMES[@]}"; do
            log "Updating theme: $theme"
            ssh -o StrictHostKeyChecking=no "$STAGING_USER@$STAGING_HOST" "cd $site_path && wp theme update $theme --allow-root"
        done
    fi
    
    # Update file permissions
    log "Updating file permissions..."
    ssh -o StrictHostKeyChecking=no "$STAGING_USER@$STAGING_HOST" "chown -R www-data:www-data $site_path/wp-content/themes && chmod -R 755 $site_path/wp-content/themes"
    
    # Cleanup
    log "Cleaning up temporary files..."
    ssh -o StrictHostKeyChecking=no "$STAGING_USER@$STAGING_HOST" "rm -rf $backup_dir"
    
    log "Theme updates completed successfully!"
}

# Run main function
main 