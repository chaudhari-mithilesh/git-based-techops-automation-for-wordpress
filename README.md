# WordPress Site Automation

This repository contains automation scripts for WordPress site management, including site cloning and visual regression testing.

## Features

- Automated WordPress site cloning from live to staging
- Visual regression testing using BackstopJS
- GitHub Actions integration
- Automated backup and restore
- Database migration with URL updates
- File permission management

## Prerequisites

- Node.js 16 or higher
- MySQL client
- SSH access to both live and staging servers
- GitHub Actions enabled repository

## Setup

1. Clone this repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Configure GitHub Secrets:
   - `LIVE_HOST`
   - `LIVE_USER`
   - `LIVE_PASSWORD`
   - `LIVE_DB_HOST`
   - `LIVE_DB_USER`
   - `LIVE_DB_PASS`
   - `LIVE_DB_NAME`
   - `STAGING_HOST`
   - `STAGING_USER`
   - `STAGING_PASSWORD`
   - `STAGING_DB_HOST`
   - `STAGING_DB_USER`
   - `STAGING_DB_PASS`
   - `STAGING_DB_NAME`
   - `SSH_PRIVATE_KEY`

## Usage

1. Navigate to the Actions tab in your GitHub repository
2. Select "Clone WordPress Site" workflow
3. Click "Run workflow"
4. Enter the site name and target environment
5. Click "Run workflow"

## Documentation

For detailed documentation, please refer to the `docs` directory:
- [User Guide](docs/UserGuide.md)
- [Developer Guide](docs/DeveloperGuide.md)
- [API Documentation](docs/API.md)

## Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a new Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details. 