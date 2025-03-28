# WordPress Site Automation - API Documentation

## Table of Contents
1. [Overview](#overview)
2. [GitHub Actions API](#github-actions-api)
3. [Shell Script API](#shell-script-api)
4. [Testing API](#testing-api)
5. [Configuration API](#configuration-api)

## Overview

This document describes the APIs and interfaces available in the WordPress Site Automation tool.

## GitHub Actions API

### Workflow Inputs

#### Clone Site Workflow
```yaml
inputs:
  site_name:
    description: 'Name of the site to clone'
    required: true
    type: string
  environment:
    description: 'Target environment (staging/production)'
    required: true
    type: choice
    options:
      - staging
      - production
```

#### Plugin Update Workflow
```yaml
inputs:
  site_name:
    description: 'Name of the site to update'
    required: true
    type: string
  environment:
    description: 'Target environment (staging/production)'
    required: true
    type: choice
    options:
      - staging
      - production
  update_type:
    description: 'Type of update'
    required: true
    type: choice
    options:
      - all
      - selected
  plugin_list:
    description: 'Comma-separated list of plugins to update (if selected)'
    required: false
    type: string
```

#### Theme Update Workflow
```yaml
inputs:
  site_name:
    description: 'Name of the site to update'
    required: true
    type: string
  environment:
    description: 'Target environment (staging/production)'
    required: true
    type: choice
    options:
      - staging
      - production
  update_type:
    description: 'Type of update'
    required: true
    type: choice
    options:
      - all
      - selected
  theme_list:
    description: 'Comma-separated list of themes to update (if selected)'
    required: false
    type: string
```

### Environment Variables

```yaml
env:
  LIVE_HOST: ${{ secrets.LIVE_HOST }}
  LIVE_USER: ${{ secrets.LIVE_USER }}
  LIVE_PASSWORD: ${{ secrets.LIVE_PASSWORD }}
  LIVE_DB_HOST: ${{ secrets.LIVE_DB_HOST }}
  LIVE_DB_USER: ${{ secrets.LIVE_DB_USER }}
  LIVE_DB_PASS: ${{ secrets.LIVE_DB_PASS }}
  LIVE_DB_NAME: ${{ secrets.LIVE_DB_NAME }}
  STAGING_HOST: ${{ secrets.STAGING_HOST }}
  STAGING_USER: ${{ secrets.STAGING_USER }}
  STAGING_PASSWORD: ${{ secrets.STAGING_PASSWORD }}
  STAGING_DB_HOST: ${{ secrets.STAGING_DB_HOST }}
  STAGING_DB_USER: ${{ secrets.STAGING_DB_USER }}
  STAGING_DB_PASS: ${{ secrets.STAGING_DB_PASS }}
  STAGING_DB_NAME: ${{ secrets.STAGING_DB_NAME }}
  SSH_PRIVATE_KEY: ${{ secrets.SSH_PRIVATE_KEY }}
```

## Shell Script API

### Functions

#### create_backup
```bash
create_backup host user site_path backup_dir
```

Creates a backup of the specified directory.

**Parameters:**
- `host`: Server hostname
- `user`: SSH username
- `site_path`: Path to WordPress installation
- `backup_dir`: Backup directory path

**Returns:**
- 0: Success
- 1: Failure

#### log
```bash
log message
```

Logs a message with timestamp.

**Parameters:**
- `message`: Message to log

#### error
```bash
error message
```

Logs an error message and exits.

**Parameters:**
- `message`: Error message

#### update_plugins
```bash
update_plugins site_path update_type plugin_list
```

Updates WordPress plugins.

**Parameters:**
- `site_path`: Path to WordPress installation
- `update_type`: "all" or "selected"
- `plugin_list`: Comma-separated list of plugins (if selected)

**Returns:**
- 0: Success
- 1: Failure

#### update_themes
```bash
update_themes site_path update_type theme_list
```

Updates WordPress themes.

**Parameters:**
- `site_path`: Path to WordPress installation
- `update_type`: "all" or "selected"
- `theme_list`: Comma-separated list of themes (if selected)

**Returns:**
- 0: Success
- 1: Failure

## Testing API

### BackstopJS Configuration

```json
{
  "id": "wordpress-clone-test",
  "viewports": [
    {
      "label": "desktop",
      "width": 1920,
      "height": 1080
    }
  ],
  "scenarios": [
    {
      "label": "Homepage",
      "url": "https://${STAGING_HOST}/${SITE_NAME}",
      "selectors": ["viewport"]
    }
  ]
}
```

### Test Scenarios

#### Homepage Test
```json
{
  "label": "Homepage",
  "url": "https://${STAGING_HOST}/${SITE_NAME}",
  "selectors": ["viewport"],
  "delay": 5000,
  "hideSelectors": [
    ".wp-admin-bar",
    "#wp-admin-bar-root-default",
    ".wp-admin-bar-top"
  ]
}
```

#### Admin Login Test
```json
{
  "label": "Admin Login",
  "url": "https://${STAGING_HOST}/${SITE_NAME}/wp-admin",
  "selectors": ["#login"],
  "delay": 3000
}
```

#### Plugin Update Test
```json
{
  "label": "Plugin Page",
  "url": "https://${STAGING_HOST}/${SITE_NAME}/wp-admin/plugins.php",
  "selectors": ["#wpbody-content"],
  "delay": 3000
}
```

#### Theme Update Test
```json
{
  "label": "Theme Page",
  "url": "https://${STAGING_HOST}/${SITE_NAME}/wp-admin/themes.php",
  "selectors": ["#wpbody-content"],
  "delay": 3000
}
```

## Configuration API

### Site Configuration

```json
{
  "site_name": {
    "live": {
      "path": "/var/www/html/site_name",
      "url": "https://site_name.com"
    },
    "staging": {
      "path": "/var/www/html/site_name",
      "url": "https://staging.site_name.com"
    }
  }
}
```

### Environment Variables

```bash
# Live Site
LIVE_HOST=your-live-server.com
LIVE_USER=your-live-username
LIVE_PASSWORD=your-live-password
LIVE_DB_HOST=your-live-db-host
LIVE_DB_USER=your-live-db-user
LIVE_DB_PASS=your-live-db-password
LIVE_DB_NAME=your-live-db-name

# Staging Site
STAGING_HOST=your-staging-server.com
STAGING_USER=your-staging-username
STAGING_PASSWORD=your-staging-password
STAGING_DB_HOST=your-staging-db-host
STAGING_DB_USER=your-staging-db-user
STAGING_DB_PASS=your-staging-db-password
STAGING_DB_NAME=your-staging-db-name
```

## Error Handling

### Shell Script Errors

```bash
# Error codes
1: General error
2: SSH connection failed
3: Database operation failed
4: File operation failed
5: Backup failed
6: Restore failed
7: Permission error
8: Configuration error
9: Plugin update failed
10: Theme update failed
```

### GitHub Actions Errors

```yaml
# Error handling in workflow
- name: Handle Errors
  if: failure()
  run: |
    echo "Workflow failed: ${{ job.status }}"
    exit 1
```

## Security

### SSH Authentication

```bash
# SSH key setup
mkdir -p ~/.ssh
echo "$SSH_PRIVATE_KEY" > ~/.ssh/id_rsa
chmod 600 ~/.ssh/id_rsa
```

### Database Security

```bash
# Database connection
mysql -h $DB_HOST -u $DB_USER -p$DB_PASS $DB_NAME
```

## Performance

### Backup Optimization

```bash
# Compress backup
tar -czf backup.tar.gz files/
```

### Database Optimization

```sql
# Optimize database
OPTIMIZE TABLE wp_posts, wp_options;
```

## Monitoring

### Logging

```bash
# Log format
[YYYY-MM-DD HH:MM:SS] Message
```

### Status Reporting

```yaml
# Status check
- name: Check Status
  run: |
    echo "Status: ${{ job.status }}"
    echo "Duration: ${{ steps.duration.outputs.duration }}"
``` 