#!/bin/bash

# Debug environment variables
echo "=== Environment Variables Debug ==="
echo "API_BASE_URL: '$API_BASE_URL'"
echo "APP_NAME: '$APP_NAME'"
echo "NODE_ENV: '$NODE_ENV'"
echo "======================================"

# Create config.js with proper escaping
CONFIG_CONTENT="window.ENV = {
  API_BASE_URL: '${API_BASE_URL}',
  APP_NAME: '${APP_NAME}',
  APP_VERSION: '1.0.0',
  NODE_ENV: '${NODE_ENV:-production}'
};"

echo "Generated config content:"
echo "$CONFIG_CONTENT"
echo "======================================"

# Write to config.js
echo "$CONFIG_CONTENT" > /usr/share/nginx/html/config.js

# Verify the file was created
echo "Config.js file contents:"
cat /usr/share/nginx/html/config.js
echo "======================================"

# List files to ensure it exists
ls -la /usr/share/nginx/html/config.js

# Start nginx
exec nginx -g 'daemon off;'