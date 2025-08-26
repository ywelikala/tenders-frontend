#!/bin/bash
set -e

echo "🔧 Environment Variables Debug:"
echo "   Raw API_BASE_URL: '$API_BASE_URL'"
echo "   Raw APP_NAME: '$APP_NAME'"
echo "   Raw APP_VERSION: '$APP_VERSION'"
echo "   Raw NODE_ENV: '$NODE_ENV'"

# Default environment variables
API_BASE_URL=${API_BASE_URL:-"https://api.lankatender.com/api"}
APP_NAME=${APP_NAME:-"Lanka Tender"}
APP_VERSION=${APP_VERSION:-"1.0.0"}
NODE_ENV=${NODE_ENV:-"production"}

echo "🚀 Starting Lanka Tender frontend with configuration:"
echo "   API_BASE_URL: $API_BASE_URL"
echo "   APP_NAME: $APP_NAME"
echo "   APP_VERSION: $APP_VERSION"
echo "   NODE_ENV: $NODE_ENV"

# Create environment configuration file
cat > /usr/share/nginx/html/config.js << EOF
window.ENV = {
  API_BASE_URL: '$API_BASE_URL',
  APP_NAME: '$APP_NAME',
  APP_VERSION: '$APP_VERSION',
  NODE_ENV: '$NODE_ENV'
};
EOF

echo "✅ Environment configuration created at /usr/share/nginx/html/config.js"
echo "📄 Config file contents:"
cat /usr/share/nginx/html/config.js
echo ""
echo "📁 Config file verification:"
ls -la /usr/share/nginx/html/config.js

# Execute the CMD
exec "$@"