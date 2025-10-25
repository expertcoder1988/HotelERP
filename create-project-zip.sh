#!/bin/bash

# Hotel Management System - Create Project ZIP
# This script creates a complete ZIP file of your project

echo "📦 Creating Hotel Management System ZIP file..."
echo "=============================================="

# Create ZIP file excluding unnecessary files
zip -r HotelManagementSystem.zip . \
    -x "*.git*" \
    -x "node_modules/*" \
    -x "bin/*" \
    -x "obj/*" \
    -x "*.log" \
    -x "logs/*" \
    -x "*.tmp" \
    -x "*.temp" \
    -x ".vs/*" \
    -x "*.user" \
    -x "*.suo" \
    -x "*.cache" \
    -x "*.dll" \
    -x "*.exe" \
    -x "*.pdb" \
    -x "build/*" \
    -x "dist/*" \
    -x ".env.local" \
    -x ".env.development.local" \
    -x ".env.test.local" \
    -x ".env.production.local" \
    -x "coverage/*" \
    -x ".nyc_output" \
    -x ".npm" \
    -x ".node_repl_history" \
    -x "*.tgz" \
    -x ".yarn-integrity" \
    -x ".cache" \
    -x ".parcel-cache" \
    -x ".next" \
    -x ".nuxt" \
    -x ".vuepress/dist" \
    -x ".serverless" \
    -x ".fusebox" \
    -x ".dynamodb" \
    -x ".tern-port" \
    -x ".vscode" \
    -x ".idea" \
    -x "*.swp" \
    -x "*.swo" \
    -x "*~" \
    -x ".DS_Store" \
    -x ".DS_Store?" \
    -x "._*" \
    -x ".Spotlight-V100" \
    -x ".Trashes" \
    -x "ehthumbs.db" \
    -x "Thumbs.db"

if [ $? -eq 0 ]; then
    echo "✅ ZIP file created successfully: HotelManagementSystem.zip"
    echo ""
    echo "📋 ZIP file contains:"
    echo "- Complete .NET Core 8 Web API backend"
    echo "- React 18 frontend with TypeScript"
    echo "- SQL Server database schema"
    echo "- JWT authentication system"
    echo "- Material-UI components"
    echo "- Complete documentation"
    echo "- Setup scripts for easy installation"
    echo ""
    echo "🚀 Ready for GitHub upload or sharing!"
    echo ""
    echo "📁 File size:"
    ls -lh HotelManagementSystem.zip
else
    echo "❌ Failed to create ZIP file"
    exit 1
fi