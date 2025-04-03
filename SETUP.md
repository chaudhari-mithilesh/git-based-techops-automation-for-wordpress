# Local Development Setup Guide

## Prerequisites

1. **System Requirements**:
   - Docker and Docker Compose
   - Node.js 18 or higher
   - Git
   - GitHub account with repository access

2. **Required Environment Variables**:
   Create a `.env` file in the root directory with:
   ```env
   GITHUB_TOKEN=your_github_personal_access_token
   DB_HOST=db
   DB_USER=wordpress
   DB_PASSWORD=wordpress_password
   DB_NAME=wordpress
   ```

## Step-by-Step Setup

1. **Clone the Repository**:
   ```bash
   git clone <your-repository-url>
   cd git-based-techops-automation-for-wordpress
   ```

2. **Set Up Environment Variables**:
   ```bash
   cp .env.example .env
   # Edit .env with your values
   ```

3. **Start Docker Services**:
   ```bash
   docker-compose up -d
   ```

4. **Install Frontend Dependencies**:
   ```bash
   cd ui
   npm install
   ```

5. **Start Frontend Development Server**:
   ```bash
   npm start
   ```

6. **Access the Applications**:
   - Frontend: http://localhost:3000
   - WordPress: http://localhost:8080
   - Backend API: http://localhost:3001

## WordPress and WooCommerce Setup

1. **Complete WordPress Installation**:
   - Visit http://localhost:8080
   - Follow the WordPress installation wizard
   - Note down your admin credentials

2. **Run WooCommerce Setup Script**:
   ```bash
   chmod +x scripts/setup-wordpress.sh
   ./scripts/setup-wordpress.sh
   ```
   This will:
   - Install and activate WooCommerce
   - Create necessary WooCommerce pages
   - Set up a test product
   - Configure permalinks

3. **Verify WooCommerce Setup**:
   - Log in to WordPress admin
   - Go to WooCommerce > Status
   - Verify all components are installed
   - Check the test product in Products

## GitHub Setup

1. **Create GitHub Personal Access Token**:
   - Go to GitHub Settings > Developer Settings > Personal Access Tokens
   - Create new token with scopes:
     - repo
     - workflow
     - admin:org

2. **Add Token to Environment**:
   - Add your token to the `.env` file:
     ```
     GITHUB_TOKEN=your_token_here
     ```

## Testing the Setup

1. **Test WordPress Connection**:
   - Log in to WordPress admin
   - Verify database connection
   - Test WooCommerce functionality

2. **Test GitHub Integration**:
   - Create a test repository
   - Try cloning a WordPress site
   - Verify backup creation

3. **Test Frontend Features**:
   - Log in to the React application
   - Test site cloning
   - Verify plugin management

## Troubleshooting

1. **Database Issues**:
   ```bash
   docker-compose exec db mysql -u wordpress -p
   ```

2. **WordPress Issues**:
   ```bash
   docker-compose logs wordpress
   ```

3. **Backend Issues**:
   ```bash
   docker-compose logs backend
   ```

## Development Workflow

1. **Making Changes**:
   - Frontend changes are hot-reloaded
   - Backend changes require container restart
   - WordPress changes persist in volumes

2. **Testing Changes**:
   - Frontend: http://localhost:3000
   - Backend: http://localhost:3001
   - WordPress: http://localhost:8080

## Stopping the Environment

```bash
docker-compose down
```

## Clean Up

To completely reset the environment:
```bash
docker-compose down -v
rm -rf node_modules
```

## Support

For issues or questions:
1. Check the logs using `docker-compose logs`
2. Review the documentation in the `docs` directory
3. Create an issue in the GitHub repository 