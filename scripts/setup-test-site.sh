#!/bin/bash

# Source utilities
source "$(dirname "$0")/utils.sh"

# Function to create test site
create_test_site() {
    local site_dir=$1
    local db_name=$2
    local db_user=$3
    local db_pass=$4
    
    log_info "Creating test site in $site_dir..."
    
    # Create directory
    mkdir -p "$site_dir"
    cd "$site_dir"
    
    # Download WordPress
    wp core download --allow-root
    
    # Create wp-config.php
    wp core config \
        --dbname="$db_name" \
        --dbuser="$db_user" \
        --dbpass="$db_pass" \
        --dbhost="localhost" \
        --allow-root
    
    # Install WordPress
    wp core install \
        --url="http://localhost:8080" \
        --title="Test Site" \
        --admin_user="admin" \
        --admin_password="password" \
        --admin_email="admin@example.com" \
        --allow-root
    
    # Install test plugins
    wp plugin install hello-dolly --activate --allow-root
    wp plugin install akismet --activate --allow-root
    
    # Install test themes
    wp theme install twentytwenty --activate --allow-root
    wp theme install twentytwentyone --allow-root
    
    # Create test content
    wp post create \
        --post_title="Test Post" \
        --post_content="This is a test post." \
        --post_status="publish" \
        --post_type="post" \
        --allow-root
    
    wp post create \
        --post_title="Test Page" \
        --post_content="This is a test page." \
        --post_status="publish" \
        --post_type="page" \
        --allow-root
    
    # Create test users
    wp user create \
        editor editor@example.com \
        --role=editor \
        --user_pass=password \
        --allow-root
    
    wp user create \
        author author@example.com \
        --role=author \
        --user_pass=password \
        --allow-root
    
    # Set up test options
    wp option update blogname "Test Site" --allow-root
    wp option update blogdescription "A test site for WordPress automation" --allow-root
    wp option update timezone_string "UTC" --allow-root
    
    # Create test categories
    wp term create category "Test Category" --allow-root
    
    # Create test tags
    wp term create post_tag "test" --allow-root
    wp term create post_tag "automation" --allow-root
    
    # Set up test widgets
    wp widget add text sidebar-1 "Test Widget" --text="This is a test widget." --allow-root
    
    # Set up test menus
    wp menu create "Test Menu" --allow-root
    wp menu item add-post test-menu 1 --title="Home" --allow-root
    wp menu item add-post test-menu 2 --title="About" --allow-root
    
    # Set up test customizer options
    wp option update theme_mods-twentytwenty --format=json '{"custom_css_post_id":-1,"nav_menu_locations":{"primary":0,"footer":0,"social":0},"custom_logo":0,"site_icon":0,"background_color":"ffffff","page_background_color":"ffffff","content_background_color":"ffffff","link_color":"000000","button_background_color":"000000","button_text_color":"ffffff","header_background_color":"ffffff","header_text_color":"000000","footer_background_color":"ffffff","footer_text_color":"000000"}' --allow-root
    
    log_info "Test site created successfully!"
}

# Main function
main() {
    # Get configuration
    local db_name=$(get_config_value "wordpress.db_name" "wordpress")
    local db_user=$(get_config_value "wordpress.db_user" "wordpress")
    local db_pass=$(get_config_value "wordpress.db_password" "wordpress")
    local site_dir=$(get_config_value "wordpress.site_dir" "test-site")
    
    # Create test site
    create_test_site "$site_dir" "$db_name" "$db_user" "$db_pass"
    
    log_info "Test site setup completed!"
    log_info "Site URL: http://localhost:8080"
    log_info "Admin credentials: admin/password"
}

# Execute main function
main 