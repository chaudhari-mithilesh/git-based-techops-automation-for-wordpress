# WordPress Site Automation - Testing Guide

## Table of Contents
1. [Prerequisites](#prerequisites)
2. [Installation Guide](#installation-guide)
3. [Test Environment Setup](#test-environment-setup)
4. [Test Cases](#test-cases)
5. [Visual Regression Testing](#visual-regression-testing)
6. [Performance Testing](#performance-testing)
7. [Security Testing](#security-testing)

## Prerequisites

### System Requirements
- Operating System: Ubuntu 20.04 LTS or higher
- CPU: 2 cores minimum
- RAM: 4GB minimum
- Storage: 20GB free space
- Network: Stable internet connection

### Software Requirements
1. **Node.js Environment**
   - Node.js v16.x or higher
   - npm v8.x or higher
   - nvm (Node Version Manager) recommended

2. **Database**
   - MySQL 5.7 or higher
   - MariaDB 10.3 or higher
   - Database user with full privileges

3. **WordPress Environment**
   - WordPress CLI installed globally
   - PHP 7.4 or higher
   - Required PHP extensions:
     - mysqli
     - curl
     - zip
     - gd
     - xml
     - mbstring

4. **Testing Tools**
   - BackstopJS v6.x
   - Puppeteer v19.x
   - Chrome/Chromium browser
   - Git

### Access Requirements
1. **Server Access**
   - SSH access to staging server
   - SSH access to live server
   - Sudo privileges on both servers

2. **Database Access**
   - Read access to live database
   - Write access to staging database
   - Database backup permissions

3. **GitHub Access**
   - Repository access
   - Actions permissions
   - Secrets management access

## Installation Guide

### 1. Node.js Setup
```bash
# Install nvm
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash

# Reload shell configuration
source ~/.bashrc

# Install Node.js
nvm install 16
nvm use 16

# Verify installation
node --version
npm --version
```

### 2. WordPress CLI Setup
```bash
# Download WordPress CLI
curl -O https://raw.githubusercontent.com/wp-cli/builds/gh-pages/phar/wp-cli.phar

# Make it executable
chmod +x wp-cli.phar

# Move to system path
sudo mv wp-cli.phar /usr/local/bin/wp

# Verify installation
wp --info
```

### 3. Project Setup
```bash
# Clone repository
git clone https://github.com/your-org/wordpress-automation.git
cd wordpress-automation

# Install dependencies
npm install

# Install global dependencies
npm install -g backstopjs
npm install -g @wordpress/env

# Set up environment variables
cp .env.example .env
# Edit .env with your configuration
```

### 4. Database Setup
```bash
# Create test database
mysql -u root -p
CREATE DATABASE wp_test;
CREATE USER 'wp_test_user'@'localhost' IDENTIFIED BY 'your_password';
GRANT ALL PRIVILEGES ON wp_test.* TO 'wp_test_user'@'localhost';
FLUSH PRIVILEGES;
```

## Test Environment Setup

### 1. Local WordPress Environment
```bash
# Start WordPress environment
wp-env start

# Create test database
wp-env run cli wp db create

# Install WordPress
wp-env run cli wp core install --url=http://localhost:8888 --title="Test Site" --admin_user=admin --admin_password=password --admin_email=admin@example.com
```

### 2. Test Data Setup
```bash
# Import test content
wp-env run cli wp import wp-content/plugins/wordpress-importer/sample/sample_products.xml --authors=create

# Create test users
wp-env run cli wp user create testuser testuser@example.com --role=editor
wp-env run cli wp user create testadmin testadmin@example.com --role=administrator
```

### 3. Test Plugins and Themes
```bash
# Install test plugins
wp-env run cli wp plugin install woocommerce --activate
wp-env run cli wp plugin install wordpress-seo --activate

# Install test themes
wp-env run cli wp theme install twentytwentythree --activate
```

## Test Cases

### 1. Site Cloning Tests

#### Database Migration Test
```bash
# Test database backup
wp db export backup.sql

# Test database restore
wp db import backup.sql

# Test URL replacement
wp search-replace 'https://live-site.com' 'https://staging-site.com' --all-tables
```

#### File Migration Test
```bash
# Test file backup
tar -czf wp-content-backup.tar.gz wp-content/

# Test file restore
tar -xzf wp-content-backup.tar.gz

# Test permissions
chmod -R 755 wp-content/
chown -R www-data:www-data wp-content/
```

### 2. Plugin Update Tests

#### Single Plugin Update Test
```bash
# Test plugin backup
wp plugin backup woocommerce

# Test plugin update
wp plugin update woocommerce

# Test plugin activation
wp plugin activate woocommerce
```

#### Multiple Plugin Update Test
```bash
# Test multiple plugin updates
wp plugin update --all

# Test plugin compatibility
wp plugin list --format=csv
```

### 3. Theme Update Tests

#### Single Theme Update Test
```bash
# Test theme backup
wp theme backup twentytwentythree

# Test theme update
wp theme update twentytwentythree

# Test theme activation
wp theme activate twentytwentythree
```

#### Multiple Theme Update Test
```bash
# Test multiple theme updates
wp theme update --all

# Test theme compatibility
wp theme list --format=csv
```

## Visual Regression Testing

### 1. Test Scenarios

#### Homepage Tests
```json
{
  "label": "Homepage Desktop",
  "url": "https://staging-site.com",
  "selectors": ["viewport"],
  "delay": 5000,
  "hideSelectors": [
    ".wp-admin-bar",
    "#wp-admin-bar-root-default",
    ".wp-admin-bar-top"
  ]
}
```

#### Plugin Page Tests
```json
{
  "label": "Plugin Page",
  "url": "https://staging-site.com/wp-admin/plugins.php",
  "selectors": ["#wpbody-content"],
  "delay": 3000,
  "hideSelectors": [
    ".wp-admin-bar",
    ".notice",
    ".update-nag"
  ]
}
```

#### Theme Page Tests
```json
{
  "label": "Theme Page",
  "url": "https://staging-site.com/wp-admin/themes.php",
  "selectors": ["#wpbody-content"],
  "delay": 3000,
  "hideSelectors": [
    ".wp-admin-bar",
    ".notice",
    ".update-nag"
  ]
}
```

### 2. Responsive Testing
```json
{
  "viewports": [
    {
      "label": "desktop",
      "width": 1920,
      "height": 1080
    },
    {
      "label": "tablet",
      "width": 768,
      "height": 1024
    },
    {
      "label": "mobile",
      "width": 375,
      "height": 667
    }
  ]
}
```

## Performance Testing

### 1. Database Performance
```bash
# Test database optimization
wp db optimize

# Test database repair
wp db repair

# Test database size
wp db size
```

### 2. File System Performance
```bash
# Test file permissions
find wp-content -type f -exec chmod 644 {} \;
find wp-content -type d -exec chmod 755 {} \;

# Test file ownership
chown -R www-data:www-data wp-content/
```

### 3. Load Testing
```bash
# Test site response time
curl -w "\n%{time_total}s\n" -o /dev/null -s https://staging-site.com

# Test database response time
wp db query "SELECT BENCHMARK(1000000,1+1);"
```

## Security Testing

### 1. File Permissions
```bash
# Test file permissions
find wp-content -type f -not -perm 644 -ls
find wp-content -type d -not -perm 755 -ls

# Test sensitive files
find wp-content -type f -name "*.sql" -ls
find wp-content -type f -name "*.log" -ls
```

### 2. Database Security
```bash
# Test database user permissions
wp db check

# Test database encryption
wp db encrypt

# Test sensitive data
wp db search "password" --all-tables
```

### 3. WordPress Security
```bash
# Test core integrity
wp core verify-checksums

# Test plugin integrity
wp plugin verify-checksums --all

# Test theme integrity
wp theme verify-checksums --all
```

## Test Reporting

### 1. Visual Test Reports
```bash
# Generate visual test report
backstop test

# Open test report
backstop openReport
```

### 2. Performance Reports
```bash
# Generate performance report
wp site health check

# Export performance data
wp site health export
```

### 3. Security Reports
```bash
# Generate security report
wp security check

# Export security data
wp security export
```

## Troubleshooting

### Common Issues

1. **Visual Test Failures**
   - Check for dynamic content
   - Verify selectors
   - Check for timing issues
   - Review browser console

2. **Performance Issues**
   - Check database optimization
   - Verify file permissions
   - Monitor server resources
   - Review error logs

3. **Security Issues**
   - Check file permissions
   - Verify database access
   - Review user roles
   - Check error logs

### Getting Help

1. Check the logs:
   ```bash
   tail -f wp-content/debug.log
   ```

2. Review test reports:
   ```bash
   backstop openReport
   ```

3. Check system status:
   ```bash
   wp site health check
   ``` 