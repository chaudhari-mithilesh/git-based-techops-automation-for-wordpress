# WordPress Site Automation - User Guide

## Table of Contents
1. [Introduction](#introduction)
2. [Getting Started](#getting-started)
3. [Prerequisites](#prerequisites)
4. [Configuration](#configuration)
5. [Usage](#usage)
6. [Troubleshooting](#troubleshooting)

## Introduction

This guide explains how to use the WordPress Site Automation tool to clone WordPress sites from live to staging environments and perform visual regression testing.

## Getting Started

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/your-org/wordpress-automation.git
   cd wordpress-automation
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

### Required Access

Before using the tool, ensure you have:
- SSH access to both live and staging servers
- Database access credentials
- GitHub repository access with Actions enabled

## Prerequisites

### Server Requirements
- Node.js 16 or higher
- MySQL client
- SSH access
- Sufficient disk space for backups

### GitHub Requirements
- Repository with GitHub Actions enabled
- Appropriate permissions to run workflows
- Access to repository secrets

## Configuration

### GitHub Secrets Setup

1. Navigate to your repository settings
2. Go to Secrets and Variables > Actions
3. Add the following secrets:
   ```
   LIVE_HOST=your-live-server.com
   LIVE_USER=your-live-username
   LIVE_PASSWORD=your-live-password
   LIVE_DB_HOST=your-live-db-host
   LIVE_DB_USER=your-live-db-user
   LIVE_DB_PASS=your-live-db-password
   LIVE_DB_NAME=your-live-db-name
   STAGING_HOST=your-staging-server.com
   STAGING_USER=your-staging-username
   STAGING_PASSWORD=your-staging-password
   STAGING_DB_HOST=your-staging-db-host
   STAGING_DB_USER=your-staging-db-user
   STAGING_DB_PASS=your-staging-db-password
   STAGING_DB_NAME=your-staging-db-name
   SSH_PRIVATE_KEY=your-ssh-private-key
   ```

### Site Configuration

1. Create a new site configuration in `config/sites.json`:
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

## Usage

### Running the Clone Workflow

1. Navigate to the Actions tab in your GitHub repository
2. Select "Clone WordPress Site" workflow
3. Click "Run workflow"
4. Enter the following information:
   - Site Name: The name of the site to clone
   - Environment: Choose between staging or production
5. Click "Run workflow"

### Monitoring the Process

1. Watch the workflow progress in the Actions tab
2. Check the logs for any errors or warnings
3. Review the visual regression test results
4. Check the created pull request for changes

### Verifying the Clone

After the workflow completes:
1. Visit the staging site URL
2. Verify all content is present
3. Check that all functionality works
4. Review the visual regression test report

## Troubleshooting

### Common Issues

1. **SSH Connection Failed**
   - Verify SSH credentials in GitHub Secrets
   - Check server firewall settings
   - Ensure SSH key is properly added to servers

2. **Database Connection Error**
   - Verify database credentials
   - Check database host accessibility
   - Ensure proper database permissions

3. **Visual Regression Test Failures**
   - Check for dynamic content
   - Verify staging site is accessible
   - Review test configuration

### Getting Help

If you encounter issues:
1. Check the workflow logs
2. Review the troubleshooting guide
3. Contact the development team
4. Create an issue in the repository

## Best Practices

1. **Backup Management**
   - Regular backups before cloning
   - Verify backup integrity
   - Clean up old backups

2. **Security**
   - Rotate credentials regularly
   - Use strong passwords
   - Limit access to necessary personnel

3. **Testing**
   - Run visual regression tests regularly
   - Update test scenarios as needed
   - Document test results

## Support

For additional support:
- Email: support@example.com
- Documentation: https://docs.example.com
- Issue Tracker: https://github.com/your-org/wordpress-automation/issues 