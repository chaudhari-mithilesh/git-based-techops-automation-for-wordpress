#!/bin/bash

# Source the main utils file
source "$(dirname "$0")/../scripts/utils.sh"

# Test setup
setup_test() {
    local test_name=$1
    log_info "Starting test: $test_name"
    
    # Create test directory
    local test_dir="test_$(date +%Y%m%d_%H%M%S)"
    ensure_directory "$test_dir"
    cd "$test_dir"
    
    # Initialize test environment
    init_test_env
    
    # Return test directory path
    echo "$test_dir"
}

# Test teardown
teardown_test() {
    local test_dir=$1
    log_info "Cleaning up test directory: $test_dir"
    
    # Return to original directory
    cd - > /dev/null
    
    # Remove test directory
    rm -rf "$test_dir"
}

# Initialize test environment
init_test_env() {
    # Create test WordPress installation
    wp core download --allow-root
    
    # Create test database
    create_test_db
    
    # Configure WordPress
    wp core config --dbname=test_db --dbuser=root --dbpass= --allow-root
    
    # Install WordPress
    wp core install --url=http://localhost:8080 --title="Test Site" --admin_user=admin --admin_password=password --admin_email=admin@example.com --allow-root
}

# Create test database
create_test_db() {
    mysql -u root -e "CREATE DATABASE IF NOT EXISTS test_db;"
}

# Test assertion functions
assert_equal() {
    local expected=$1
    local actual=$2
    local message=$3
    
    if [ "$expected" = "$actual" ]; then
        log_info "✓ $message"
        return 0
    else
        log_error "✗ $message (Expected: $expected, Actual: $actual)"
        return 1
    fi
}

assert_not_equal() {
    local expected=$1
    local actual=$2
    local message=$3
    
    if [ "$expected" != "$actual" ]; then
        log_info "✓ $message"
        return 0
    else
        log_error "✗ $message (Expected: not $expected, Actual: $actual)"
        return 1
    fi
}

assert_file_exists() {
    local file=$1
    local message=$2
    
    if [ -f "$file" ]; then
        log_info "✓ $message"
        return 0
    else
        log_error "✗ $message (File not found: $file)"
        return 1
    fi
}

assert_directory_exists() {
    local dir=$1
    local message=$2
    
    if [ -d "$dir" ]; then
        log_info "✓ $message"
        return 0
    else
        log_error "✗ $message (Directory not found: $dir)"
        return 1
    fi
}

# Run test suite
run_test_suite() {
    local test_dir=$1
    local test_files=("$test_dir"/test_*.sh)
    
    local total_tests=0
    local passed_tests=0
    local failed_tests=0
    
    for test_file in "${test_files[@]}"; do
        if [ -f "$test_file" ]; then
            ((total_tests++))
            if bash "$test_file"; then
                ((passed_tests++))
            else
                ((failed_tests++))
            fi
        fi
    done
    
    log_info "Test Summary:"
    log_info "Total Tests: $total_tests"
    log_info "Passed: $passed_tests"
    log_info "Failed: $failed_tests"
    
    return $failed_tests
} 