# Hotel Management System - GitHub Deployment Script
# This script helps you deploy your project to GitHub

Write-Host "🚀 Hotel Management System - GitHub Deployment" -ForegroundColor Cyan
Write-Host "==============================================" -ForegroundColor Cyan

# Check if Git is installed
try {
    $gitVersion = git --version
    Write-Host "✅ Git is installed: $gitVersion" -ForegroundColor Green
} catch {
    Write-Host "❌ Git is not installed. Please install Git first." -ForegroundColor Red
    Write-Host "Download from: https://git-scm.com/" -ForegroundColor Yellow
    exit 1
}

# Check if GitHub CLI is installed
try {
    $ghVersion = gh --version
    Write-Host "✅ GitHub CLI is installed" -ForegroundColor Green
    $UseGhCli = $true
} catch {
    Write-Host "⚠️  GitHub CLI not found. You'll need to create the repository manually." -ForegroundColor Yellow
    $UseGhCli = $false
}

# Get repository details
$GitHubUsername = Read-Host "Enter your GitHub username"
$RepoName = Read-Host "Enter repository name (default: hotel-management-system)"
if ([string]::IsNullOrEmpty($RepoName)) {
    $RepoName = "hotel-management-system"
}

Write-Host ""
Write-Host "📋 Repository Details:" -ForegroundColor Cyan
Write-Host "Username: $GitHubUsername" -ForegroundColor White
Write-Host "Repository: $RepoName" -ForegroundColor White
Write-Host "Full URL: https://github.com/$GitHubUsername/$RepoName" -ForegroundColor White
Write-Host ""

# Confirm details
$Confirm = Read-Host "Are these details correct? (y/n)"
if ($Confirm -ne "y" -and $Confirm -ne "Y") {
    Write-Host "❌ Deployment cancelled" -ForegroundColor Red
    exit 1
}

# Initialize Git repository
Write-Host ""
Write-Host "🔧 Initializing Git repository..." -ForegroundColor Yellow
git init

# Add all files
Write-Host "📁 Adding files to Git..." -ForegroundColor Yellow
git add .

# Create initial commit
Write-Host "💾 Creating initial commit..." -ForegroundColor Yellow
$commitMessage = @"
Initial commit: Complete Hotel Management System

- React frontend with Material-UI and TypeScript
- .NET Core 8 Web API backend with Entity Framework
- SQL Server database with comprehensive schema
- JWT authentication and role-based authorization
- Complete CRUD operations for all entities
- Interactive dashboard with real-time analytics
- Responsive design for all screen sizes
- Professional UI/UX with modern components
- Comprehensive documentation and setup guides
- Ready-to-deploy production system
"@

git commit -m $commitMessage

# Set main branch
git branch -M main

# Create GitHub repository
if ($UseGhCli) {
    Write-Host ""
    Write-Host "🌐 Creating GitHub repository..." -ForegroundColor Yellow
    gh repo create $RepoName --public --description "Complete Hotel Management System with React Frontend, .NET Core API, and SQL Server Database" --source=. --remote=origin --push
} else {
    Write-Host ""
    Write-Host "🌐 Please create the repository manually on GitHub:" -ForegroundColor Yellow
    Write-Host "1. Go to https://github.com/new" -ForegroundColor White
    Write-Host "2. Repository name: $RepoName" -ForegroundColor White
    Write-Host "3. Description: Complete Hotel Management System with React Frontend, .NET Core API, and SQL Server Database" -ForegroundColor White
    Write-Host "4. Make it public" -ForegroundColor White
    Write-Host "5. Don't initialize with README (we already have one)" -ForegroundColor White
    Write-Host "6. Click 'Create repository'" -ForegroundColor White
    Write-Host ""
    Read-Host "Press Enter when you've created the repository"
    
    # Add remote origin
    Write-Host "🔗 Adding remote origin..." -ForegroundColor Yellow
    git remote add origin "https://github.com/$GitHubUsername/$RepoName.git"
    
    # Push to GitHub
    Write-Host "📤 Pushing to GitHub..." -ForegroundColor Yellow
    git push -u origin main
}

Write-Host ""
Write-Host "🎉 Deployment completed successfully!" -ForegroundColor Green
Write-Host ""
Write-Host "📋 Next steps:" -ForegroundColor Cyan
Write-Host "1. Visit your repository: https://github.com/$GitHubUsername/$RepoName" -ForegroundColor White
Write-Host "2. Add repository topics: hotel-management, react, dotnet-core, sql-server" -ForegroundColor White
Write-Host "3. Create a release with version v1.0.0" -ForegroundColor White
Write-Host "4. Add badges to your README.md" -ForegroundColor White
Write-Host "5. Share your repository with potential employers" -ForegroundColor White
Write-Host ""
Write-Host "🔗 Repository URL: https://github.com/$GitHubUsername/$RepoName" -ForegroundColor Green
Write-Host ""
Write-Host "📚 Documentation:" -ForegroundColor Cyan
Write-Host "- README.md: Complete setup and usage guide" -ForegroundColor White
Write-Host "- PROJECT_STRUCTURE.md: Architecture overview" -ForegroundColor White
Write-Host "- GITHUB_DEPLOYMENT.md: GitHub deployment guide" -ForegroundColor White
Write-Host ""
Write-Host "✨ Your hotel management system is now live on GitHub!" -ForegroundColor Green