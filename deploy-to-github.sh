#!/bin/bash

# Hotel Management System - GitHub Deployment Script
# This script helps you deploy your project to GitHub

echo "🚀 Hotel Management System - GitHub Deployment"
echo "=============================================="

# Check if Git is installed
if ! command -v git &> /dev/null; then
    echo "❌ Git is not installed. Please install Git first."
    echo "Download from: https://git-scm.com/"
    exit 1
fi

echo "✅ Git is installed"

# Check if GitHub CLI is installed
if command -v gh &> /dev/null; then
    echo "✅ GitHub CLI is installed"
    USE_GH_CLI=true
else
    echo "⚠️  GitHub CLI not found. You'll need to create the repository manually."
    USE_GH_CLI=false
fi

# Get repository name
read -p "Enter your GitHub username: " GITHUB_USERNAME
read -p "Enter repository name (default: hotel-management-system): " REPO_NAME
REPO_NAME=${REPO_NAME:-hotel-management-system}

echo ""
echo "📋 Repository Details:"
echo "Username: $GITHUB_USERNAME"
echo "Repository: $REPO_NAME"
echo "Full URL: https://github.com/$GITHUB_USERNAME/$REPO_NAME"
echo ""

# Confirm details
read -p "Are these details correct? (y/n): " CONFIRM
if [[ $CONFIRM != "y" && $CONFIRM != "Y" ]]; then
    echo "❌ Deployment cancelled"
    exit 1
fi

# Initialize Git repository
echo ""
echo "🔧 Initializing Git repository..."
git init

# Add all files
echo "📁 Adding files to Git..."
git add .

# Create initial commit
echo "💾 Creating initial commit..."
git commit -m "Initial commit: Complete Hotel Management System

- React frontend with Material-UI and TypeScript
- .NET Core 8 Web API backend with Entity Framework
- SQL Server database with comprehensive schema
- JWT authentication and role-based authorization
- Complete CRUD operations for all entities
- Interactive dashboard with real-time analytics
- Responsive design for all screen sizes
- Professional UI/UX with modern components
- Comprehensive documentation and setup guides
- Ready-to-deploy production system"

# Set main branch
git branch -M main

# Create GitHub repository
if [ "$USE_GH_CLI" = true ]; then
    echo ""
    echo "🌐 Creating GitHub repository..."
    gh repo create $REPO_NAME --public --description "Complete Hotel Management System with React Frontend, .NET Core API, and SQL Server Database" --source=. --remote=origin --push
else
    echo ""
    echo "🌐 Please create the repository manually on GitHub:"
    echo "1. Go to https://github.com/new"
    echo "2. Repository name: $REPO_NAME"
    echo "3. Description: Complete Hotel Management System with React Frontend, .NET Core API, and SQL Server Database"
    echo "4. Make it public"
    echo "5. Don't initialize with README (we already have one)"
    echo "6. Click 'Create repository'"
    echo ""
    read -p "Press Enter when you've created the repository..."
    
    # Add remote origin
    echo "🔗 Adding remote origin..."
    git remote add origin https://github.com/$GITHUB_USERNAME/$REPO_NAME.git
    
    # Push to GitHub
    echo "📤 Pushing to GitHub..."
    git push -u origin main
fi

echo ""
echo "🎉 Deployment completed successfully!"
echo ""
echo "📋 Next steps:"
echo "1. Visit your repository: https://github.com/$GITHUB_USERNAME/$REPO_NAME"
echo "2. Add repository topics: hotel-management, react, dotnet-core, sql-server"
echo "3. Create a release with version v1.0.0"
echo "4. Add badges to your README.md"
echo "5. Share your repository with potential employers"
echo ""
echo "🔗 Repository URL: https://github.com/$GITHUB_USERNAME/$REPO_NAME"
echo ""
echo "📚 Documentation:"
echo "- README.md: Complete setup and usage guide"
echo "- PROJECT_STRUCTURE.md: Architecture overview"
echo "- GITHUB_DEPLOYMENT.md: GitHub deployment guide"
echo ""
echo "✨ Your hotel management system is now live on GitHub!"