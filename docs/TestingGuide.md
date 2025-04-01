# Testing Guide

## Prerequisites

Before starting the testing process, ensure you have the following prerequisites installed:

1. Operating System:
   - Ubuntu 20.04 LTS or higher
   - At least 4GB RAM
   - At least 20GB free disk space

2. Required Software:
   - Docker and Docker Compose
   - Node.js 14.0 or higher
   - Git
   - WP-CLI

## Initial Setup

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd git-based-techops-automation-for-wordpress
   ```

2. Run the setup script:
   ```bash
   chmod +x scripts/setup.sh
   ./scripts/setup.sh
   ```

3. Start the Docker environment:
   ```bash
   docker-compose up -d
   ```

4. Verify the test site is accessible:
   - Open http://localhost:8080 in your browser
   - Log in with admin/password

## Test Environment

The test environment includes:

1. Test WordPress Site:
   - URL: http://localhost:8080
   - Admin credentials: admin/password
   - Database: wordpress/wordpress/wordpress

2. Test Plugins:
   - Hello Dolly (for testing plugin updates)

3. Test Themes:
   - Twenty Twenty (for testing theme updates)

## Running Tests

### 1. Unit Tests

Run unit tests for individual components:

```bash
npm run test:unit
```

### 2. Integration Tests

Run integration tests for the complete workflow:

```bash
npm run test:integration
```

### 3. Shell Script Tests

Run tests for shell scripts:

```bash
./tests/run_tests.sh
```

### 4. Full Test Suite

Run all tests:

```bash
npm run test
```

## Test Cases

### 1. Site Cloning Test

```bash
# Test cloning a site
./scripts/clone-site.sh http://localhost:8080 cloned-site

# Verify the cloned site
cd cloned-site
wp core version
```

### 2. Plugin Update Test

```bash
# Test updating a plugin
./scripts/update-plugins.sh http://localhost:8080 hello-dolly

# Verify the update
wp plugin list --path=cloned-site
```

### 3. Theme Update Test

```bash
# Test updating a theme
./scripts/update-themes.sh http://localhost:8080 twentytwenty

# Verify the update
wp theme list --path=cloned-site
```

## Test Data

### Sample Plugin List
```
hello-dolly
akismet
```

### Sample Theme List
```
twentytwenty
twentytwentyone
```

## Troubleshooting

### Common Issues

1. Docker Container Issues:
   ```bash
   # Check container status
   docker-compose ps
   
   # View container logs
   docker-compose logs wordpress
   ```

2. Database Connection Issues:
   ```bash
   # Check MySQL connection
   wp db check
   
   # Reset database
   wp db reset --yes
   ```

3. Permission Issues:
   ```bash
   # Fix permissions
   sudo chown -R www-data:www-data test-site
   ```

### Debug Mode

Enable debug mode by setting in wp-config.php:
```php
define('WP_DEBUG', true);
define('WP_DEBUG_LOG', true);
define('WP_DEBUG_DISPLAY', false);
```

## Test Reports

Test reports are generated in the following locations:

1. Unit Test Reports:
   - `test_results/unit/`

2. Integration Test Reports:
   - `test_results/integration/`

3. Shell Script Test Reports:
   - `test_results/shell/`

## Continuous Integration

The project includes GitHub Actions workflows for automated testing:

1. Plugin Update Workflow:
   - Triggered on schedule (weekly)
   - Can be manually triggered with specific plugins

2. Theme Update Workflow:
   - Triggered on schedule (weekly)
   - Can be manually triggered with specific themes

## Best Practices

1. Always run tests in a clean environment
2. Use the provided test data
3. Check logs for detailed information
4. Follow the test sequence: unit → integration → shell
5. Report any issues with detailed logs

## Support

For testing support:
1. Check the logs in `logs/`
2. Review the test reports
3. Contact the development team 