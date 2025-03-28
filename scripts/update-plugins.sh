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
    
    # Backup plugins directory
    ssh -o StrictHostKeyChecking=no "$user@$host" "tar -czf $backup_dir/plugins_backup.tar.gz $site_path/wp-content/plugins"
    
    log "Backup completed on $host"
}

# Main update process
main() {
    # Set site path
    local site_path="/var/www/html/$SITE_NAME"
    local backup_dir="/tmp/backups/plugins/$SITE_NAME"
    
    # Create backup
    create_backup "$STAGING_HOST" "$STAGING_USER" "$site_path" "$backup_dir"
    
    # Update plugins based on type
    if [ "$UPDATE_TYPE" = "all" ]; then
        log "Updating all plugins..."
        ssh -o StrictHostKeyChecking=no "$STAGING_USER@$STAGING_HOST" "cd $site_path && wp plugin update --all --allow-root"
    else
        log "Updating selected plugins: $PLUGIN_LIST"
        IFS=',' read -ra PLUGINS <<< "$PLUGIN_LIST"
        for plugin in "${PLUGINS[@]}"; do
            log "Updating plugin: $plugin"
            ssh -o StrictHostKeyChecking=no "$STAGING_USER@$STAGING_HOST" "cd $site_path && wp plugin update $plugin --allow-root"
        done
    fi
    
    # Update file permissions
    log "Updating file permissions..."
    ssh -o StrictHostKeyChecking=no "$STAGING_USER@$STAGING_HOST" "chown -R www-data:www-data $site_path/wp-content/plugins && chmod -R 755 $site_path/wp-content/plugins"
    
    # Cleanup
    log "Cleaning up temporary files..."
    ssh -o StrictHostKeyChecking=no "$STAGING_USER@$STAGING_HOST" "rm -rf $backup_dir"
    
    log "Plugin updates completed successfully!"
}

# Run main function
main 