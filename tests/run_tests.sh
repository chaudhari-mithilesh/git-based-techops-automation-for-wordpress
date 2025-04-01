#!/bin/bash

# Source test utilities
source "$(dirname "$0")/test_utils.sh"

# Function to run unit tests
run_unit_tests() {
    log_info "Running unit tests..."
    npm run test:unit
}

# Function to run integration tests
run_integration_tests() {
    log_info "Running integration tests..."
    npm run test:integration
}

# Function to run shell script tests
run_shell_tests() {
    log_info "Running shell script tests..."
    local test_files=("$PWD"/test_*.sh)
    
    for test_file in "${test_files[@]}"; do
        if [ -f "$test_file" ]; then
            log_info "Running test: $(basename "$test_file")"
            bash "$test_file"
        fi
    done
}

# Main test execution
main() {
    log_info "Starting test suite..."
    
    # Create test environment
    ensure_directory "test_results"
    
    # Run all test types
    run_unit_tests
    run_integration_tests
    run_shell_tests
    
    log_info "Test suite completed."
}

# Execute main function
main 