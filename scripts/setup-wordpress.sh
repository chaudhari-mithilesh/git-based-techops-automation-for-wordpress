#!/bin/bash

# Wait for WordPress to be ready
echo "Waiting for WordPress to be ready..."
sleep 10

# Install and activate WooCommerce
docker-compose exec wordpress wp plugin install woocommerce --activate

# Install and activate required plugins
docker-compose exec wordpress wp plugin install \
    wordpress-importer \
    advanced-custom-fields \
    --activate

# Create WooCommerce pages
docker-compose exec wordpress wp post create \
    --post_type=page \
    --post_title='Shop' \
    --post_status=publish

docker-compose exec wordpress wp post create \
    --post_type=page \
    --post_title='Cart' \
    --post_status=publish

docker-compose exec wordpress wp post create \
    --post_type=page \
    --post_title='Checkout' \
    --post_status=publish

docker-compose exec wordpress wp post create \
    --post_type=page \
    --post_title='My Account' \
    --post_status=publish

# Set up WooCommerce
docker-compose exec wordpress wp option update woocommerce_shop_page_id 2
docker-compose exec wordpress wp option update woocommerce_cart_page_id 3
docker-compose exec wordpress wp option update woocommerce_checkout_page_id 4
docker-compose exec wordpress wp option update woocommerce_myaccount_page_id 5

# Create a test product
docker-compose exec wordpress wp post create \
    --post_type=product \
    --post_title='Test Product' \
    --post_status=publish \
    --post_content='This is a test product.'

# Set up permalinks
docker-compose exec wordpress wp rewrite structure '/%postname%/' --hard

echo "WordPress and WooCommerce setup completed!" 