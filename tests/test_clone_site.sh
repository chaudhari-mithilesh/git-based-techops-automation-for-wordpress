#!/bin/bash

# Source test utilities
source "$(dirname "$0")/test_utils.sh"

# Test name
TEST_NAME="Clone Site Test"

# Setup test environment
TEST_DIR=$(setup_test "$TEST_NAME")

# Test cases
test_clone_site() {
    local source_url="http://example.com"
    local target_dir="cloned_site"
    
    # Test cloning
    log_info "Testing site cloning..."
    bash "$(dirname "$0")/../scripts/clone-site.sh" "$source_url" "$target_dir"
    
    # Assertions
    assert_directory_exists "$target_dir" "Target directory should exist"
    assert_file_exists "$target_dir/wp-config.php" "wp-config.php should exist"
    
    # Check WordPress installation
    local wp_version=$(wp_get_version "$target_dir")
    assert_not_equal "" "$wp_version" "WordPress version should be detected"
    
    # Check database configuration
    assert_file_exists "$target_dir/.env" "Environment file should exist"
    
    # Check file permissions
    local perms=$(stat -c "%a" "$target_dir")
    assert_equal "755" "$perms" "Directory permissions should be 755"
}

# Run test
test_clone_site

# Teardown
teardown_test "$TEST_DIR" 