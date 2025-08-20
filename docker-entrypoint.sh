#!/bin/bash
set -e

# Default environment variables
API_BASE_URL=${API_BASE_URL:-"https://api.yourdomain.com"}
APP_NAME=${APP_NAME:-"Tenders Portal"}
APP_VERSION=${APP_VERSION:-"1.0.0"}

echo "🚀 Starting tenders-frontend with configuration:"
echo "   API_BASE_URL: $API_BASE_URL"
echo "   APP_NAME: $APP_NAME"
echo "   APP_VERSION: $APP_VERSION"

# Create environment configuration file
cat > /usr/share/nginx/html/config.js << EOF
window.ENV = {
  API_BASE_URL: '$API_BASE_URL',
  APP_NAME: '$APP_NAME',
  APP_VERSION: '$APP_VERSION',
  NODE_ENV: 'production'
};
EOF

echo "✅ Environment configuration created at /usr/share/nginx/html/config.js"

# Execute the CMD
exec "$@"