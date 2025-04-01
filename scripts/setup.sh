#!/bin/bash

# Source utilities
source "$(dirname "$0")/utils.sh"

# Function to check if a command exists
command_exists() {
    command -v "$1" >/dev/null 2>&1
}

# Function to install system dependencies
install_system_deps() {
    log_info "Installing system dependencies..."
    
    # Update package list
    sudo apt update
    
    # Install PHP and MySQL
    sudo apt install -y php8.1 php8.1-mysql mysql-server
    
    # Install Node.js
    if ! command_exists node; then
        log_info "Installing Node.js..."
        curl -fsSL https://deb.nodesource.com/setup_14.x | sudo -E bash -
        sudo apt install -y nodejs
    fi
    
    # Install Git if not present
    if ! command_exists git; then
        log_info "Installing Git..."
        sudo apt install -y git
    fi
    
    # Install WP-CLI
    if ! command_exists wp; then
        log_info "Installing WP-CLI..."
        curl -O https://raw.githubusercontent.com/wp-cli/builds/gh-pages/phar/wp-cli.phar
        chmod +x wp-cli.phar
        sudo mv wp-cli.phar /usr/local/bin/wp
    fi
    
    # Install Docker if not present
    if ! command_exists docker; then
        log_info "Installing Docker..."
        curl -fsSL https://get.docker.com -o get-docker.sh
        sudo sh get-docker.sh
        rm get-docker.sh
    fi
}

# Function to setup MySQL
setup_mysql() {
    log_info "Setting up MySQL..."
    
    # Start MySQL service
    sudo systemctl start mysql
    sudo systemctl enable mysql
    
    # Create WordPress database and user
    sudo mysql -e "CREATE DATABASE IF NOT EXISTS wordpress;"
    sudo mysql -e "CREATE USER IF NOT EXISTS 'wordpress'@'localhost' IDENTIFIED BY 'wordpress';"
    sudo mysql -e "GRANT ALL PRIVILEGES ON wordpress.* TO 'wordpress'@'localhost';"
    sudo mysql -e "FLUSH PRIVILEGES;"
}

# Function to create environment file
create_env_file() {
    log_info "Creating .env file..."
    
    cat > .env << EOL
DB_NAME=wordpress
DB_USER=wordpress
DB_PASSWORD=wordpress
DB_HOST=localhost
WP_ENV=development
WP_HOME=http://localhost:8080
WP_SITE_URL=http://localhost:8080
WP_DEBUG=true
WP_DEBUG_LOG=true
WP_DEBUG_DISPLAY=false
WP_MEMORY_LIMIT=256M
WP_MAX_MEMORY_LIMIT=512M
EOL
}

# Function to setup project
setup_project() {
    log_info "Setting up project..."
    
    # Install npm dependencies
    npm install
    
    # Make scripts executable
    chmod +x scripts/*.sh
    chmod +x tests/*.sh
    
    # Create required directories
    mkdir -p config logs backups temp
    
    # Create config file if it doesn't exist
    if [ ! -f "config/config.json" ]; then
        cp config/config.json.example config/config.json
    fi
}

# Function to setup test WordPress site
setup_test_site() {
    log_info "Setting up test WordPress site..."
    
    # Create test site directory
    mkdir -p test-site
    cd test-site
    
    # Download WordPress
    wp core download --allow-root
    
    # Create wp-config.php
    wp core config --dbname=wordpress --dbuser=wordpress --dbpass=wordpress --dbhost=localhost --allow-root
    
    # Install WordPress
    wp core install --url=http://localhost:8080 --title="Test Site" --admin_user=admin --admin_password=password --admin_email=admin@example.com --allow-root
    
    # Install test plugins and themes
    wp plugin install hello-dolly --activate --allow-root
    wp theme install twentytwenty --activate --allow-root
    
    cd ..
}

# Function to setup Docker environment
setup_docker() {
    log_info "Setting up Docker environment..."
    
    # Create docker-compose.yml if it doesn't exist
    if [ ! -f "docker-compose.yml" ]; then
        cat > docker-compose.yml << EOL
version: '3'

services:
  wordpress:
    image: wordpress:latest
    ports:
      - "8080:80"
    environment:
      WORDPRESS_DB_HOST: db
      WORDPRESS_DB_USER: wordpress
      WORDPRESS_DB_PASSWORD: wordpress
      WORDPRESS_DB_NAME: wordpress
    volumes:
      - ./test-site:/var/www/html
    depends_on:
      - db

  db:
    image: mysql:5.7
    environment:
      MYSQL_DATABASE: wordpress
      MYSQL_USER: wordpress
      MYSQL_PASSWORD: wordpress
      MYSQL_ROOT_PASSWORD: somewordpress
    volumes:
      - db_data:/var/lib/mysql

volumes:
  db_data: {}
EOL
    fi
}

# Main setup function
main() {
    log_info "Starting setup process..."
    
    # Install system dependencies
    install_system_deps
    
    # Setup MySQL
    setup_mysql
    
    # Create environment file
    create_env_file
    
    # Setup project
    setup_project
    
    # Setup Docker environment
    setup_docker
    
    # Setup test WordPress site
    setup_test_site
    
    log_info "Setup completed successfully!"
    log_info "To start testing:"
    log_info "1. Start Docker containers: docker-compose up -d"
    log_info "2. Run tests: npm run test"
    log_info "3. Access test site: http://localhost:8080"
    log_info "4. Admin credentials: admin/password"
}

# Execute main function
main 