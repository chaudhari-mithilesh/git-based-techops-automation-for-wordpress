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
    local db_host=$3
    local db_user=$4
    local db_pass=$5
    local db_name=$6
    local backup_dir=$7
    
    log "Creating backup on $host..."
    
    # Create backup directory
    ssh -o StrictHostKeyChecking=no "$user@$host" "mkdir -p $backup_dir"
    
    # Backup database
    ssh -o StrictHostKeyChecking=no "$user@$host" "mysqldump -h $db_host -u $db_user -p$db_pass $db_name > $backup_dir/db_backup.sql"
    
    # Backup files
    ssh -o StrictHostKeyChecking=no "$user@$host" "tar -czf $backup_dir/files_backup.tar.gz /var/www/html/$SITE_NAME"
    
    log "Backup completed on $host"
}

# Main cloning process
main() {
    # Create backup directories
    local live_backup_dir="/tmp/backups/live/$SITE_NAME"
    local staging_backup_dir="/tmp/backups/staging/$SITE_NAME"
    
    # Create backups
    create_backup "$LIVE_HOST" "$LIVE_USER" "$LIVE_DB_HOST" "$LIVE_DB_USER" "$LIVE_DB_PASS" "$LIVE_DB_NAME" "$live_backup_dir"
    create_backup "$STAGING_HOST" "$STAGING_USER" "$STAGING_DB_HOST" "$STAGING_DB_USER" "$STAGING_DB_PASS" "$STAGING_DB_NAME" "$staging_backup_dir"
    
    # Copy live backup to staging
    log "Copying live backup to staging..."
    scp -o StrictHostKeyChecking=no "$LIVE_USER@$LIVE_HOST:$live_backup_dir/*" "$STAGING_USER@$STAGING_HOST:$staging_backup_dir/"
    
    # Restore database on staging
    log "Restoring database on staging..."
    ssh -o StrictHostKeyChecking=no "$STAGING_USER@$STAGING_HOST" "mysql -h $STAGING_DB_HOST -u $STAGING_DB_USER -p$STAGING_DB_PASS $STAGING_DB_NAME < $staging_backup_dir/db_backup.sql"
    
    # Update URLs in database
    log "Updating URLs in database..."
    ssh -o StrictHostKeyChecking=no "$STAGING_USER@$STAGING_HOST" "mysql -h $STAGING_DB_HOST -u $STAGING_DB_USER -p$STAGING_DB_PASS $STAGING_DB_NAME -e \"UPDATE wp_options SET option_value = REPLACE(option_value, 'https://$LIVE_HOST', 'https://$STAGING_HOST') WHERE option_name = 'home' OR option_name = 'siteurl';\""
    
    # Restore files on staging
    log "Restoring files on staging..."
    ssh -o StrictHostKeyChecking=no "$STAGING_USER@$STAGING_HOST" "tar -xzf $staging_backup_dir/files_backup.tar.gz -C /var/www/html/"
    
    # Update file permissions
    log "Updating file permissions..."
    ssh -o StrictHostKeyChecking=no "$STAGING_USER@$STAGING_HOST" "chown -R www-data:www-data /var/www/html/$SITE_NAME && chmod -R 755 /var/www/html/$SITE_NAME"
    
    # Update wp-config.php
    log "Updating wp-config.php..."
    ssh -o StrictHostKeyChecking=no "$STAGING_USER@$STAGING_HOST" "sed -i 's/$LIVE_DB_HOST/$STAGING_DB_HOST/g' /var/www/html/$SITE_NAME/wp-config.php && sed -i 's/$LIVE_DB_USER/$STAGING_DB_USER/g' /var/www/html/$SITE_NAME/wp-config.php && sed -i 's/$LIVE_DB_PASS/$STAGING_DB_PASS/g' /var/www/html/$SITE_NAME/wp-config.php && sed -i 's/$LIVE_DB_NAME/$STAGING_DB_NAME/g' /var/www/html/$SITE_NAME/wp-config.php"
    
    # Cleanup
    log "Cleaning up temporary files..."
    ssh -o StrictHostKeyChecking=no "$LIVE_USER@$LIVE_HOST" "rm -rf $live_backup_dir"
    ssh -o StrictHostKeyChecking=no "$STAGING_USER@$STAGING_HOST" "rm -rf $staging_backup_dir"
    
    log "Site clone completed successfully!"
}

# Run main function
main 