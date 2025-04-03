#!/bin/bash

# Source utility functions
source "$(dirname "$0")/utils.sh"

# Configuration
SITE_URL="$1"
PLUGINS="$2"
UPDATE_TYPE="$3"

# Validate inputs
if [ -z "$SITE_URL" ]; then
  log_error "Site URL is required"
  exit 1
fi

if [ -z "$UPDATE_TYPE" ]; then
  UPDATE_TYPE="all"
fi

# Function to update a single plugin
update_plugin() {
  local plugin="$1"
  log_info "Updating plugin: $plugin"
  
  # Get current version
  local current_version=$(wp plugin list --path="$SITE_URL" --format=csv --fields=name,version | grep "^$plugin," | cut -d',' -f2)
  
  # Update plugin
  wp plugin update "$plugin" --path="$SITE_URL" --skip-plugins --skip-themes
  
  # Get new version
  local new_version=$(wp plugin list --path="$SITE_URL" --format=csv --fields=name,version | grep "^$plugin," | cut -d',' -f2)
  
  if [ "$current_version" != "$new_version" ]; then
    log_success "Plugin $plugin updated from $current_version to $new_version"
    return 0
  else
    log_info "Plugin $plugin is already up to date"
    return 1
  fi
}

# Main function
main() {
  log_info "Starting plugin update process for $SITE_URL"
  
  if [ "$UPDATE_TYPE" = "all" ]; then
    # Get all installed plugins
    local plugins=$(wp plugin list --path="$SITE_URL" --format=csv --fields=name --skip-plugins --skip-themes)
    
    # Update each plugin
    for plugin in $plugins; do
      update_plugin "$plugin"
    done
  else
    # Update specified plugins
    IFS=',' read -ra PLUGIN_ARRAY <<< "$PLUGINS"
    for plugin in "${PLUGIN_ARRAY[@]}"; do
      update_plugin "$plugin"
    done
  fi
  
  log_success "Plugin update process completed"
}

# Run main function
main 