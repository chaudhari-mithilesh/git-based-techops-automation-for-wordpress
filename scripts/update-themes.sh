#!/bin/bash

# Source utility functions
source "$(dirname "$0")/utils.sh"

# Configuration
SITE_URL="$1"
THEMES="$2"
UPDATE_TYPE="$3"

# Validate inputs
if [ -z "$SITE_URL" ]; then
  log_error "Site URL is required"
  exit 1
fi

if [ -z "$UPDATE_TYPE" ]; then
  UPDATE_TYPE="all"
fi

# Function to update a single theme
update_theme() {
  local theme="$1"
  log_info "Updating theme: $theme"
  
  # Get current version
  local current_version=$(wp theme list --path="$SITE_URL" --format=csv --fields=name,version | grep "^$theme," | cut -d',' -f2)
  
  # Update theme
  wp theme update "$theme" --path="$SITE_URL" --skip-plugins --skip-themes
  
  # Get new version
  local new_version=$(wp theme list --path="$SITE_URL" --format=csv --fields=name,version | grep "^$theme," | cut -d',' -f2)
  
  if [ "$current_version" != "$new_version" ]; then
    log_success "Theme $theme updated from $current_version to $new_version"
    return 0
  else
    log_info "Theme $theme is already up to date"
    return 1
  fi
}

# Main function
main() {
  log_info "Starting theme update process for $SITE_URL"
  
  if [ "$UPDATE_TYPE" = "all" ]; then
    # Get all installed themes
    local themes=$(wp theme list --path="$SITE_URL" --format=csv --fields=name --skip-plugins --skip-themes)
    
    # Update each theme
    for theme in $themes; do
      update_theme "$theme"
    done
  else
    # Update specified themes
    IFS=',' read -ra THEME_ARRAY <<< "$THEMES"
    for theme in "${THEME_ARRAY[@]}"; do
      update_theme "$theme"
    done
  fi
  
  log_success "Theme update process completed"
}

# Run main function
main 