# Hotel Management System Setup Script
# This script sets up the complete hotel management system

Write-Host "🏨 Hotel Management System Setup" -ForegroundColor Cyan
Write-Host "=================================" -ForegroundColor Cyan

# Check if .NET 8 is installed
Write-Host "Checking .NET 8 installation..." -ForegroundColor Yellow
try {
    $dotnetVersion = dotnet --version
    if ($dotnetVersion -match "^8\.") {
        Write-Host "✅ .NET 8 found: $dotnetVersion" -ForegroundColor Green
    } else {
        Write-Host "❌ .NET 8 not found. Please install .NET 8 SDK" -ForegroundColor Red
        exit 1
    }
} catch {
    Write-Host "❌ .NET not found. Please install .NET 8 SDK" -ForegroundColor Red
    exit 1
}

# Check if Node.js is installed
Write-Host "Checking Node.js installation..." -ForegroundColor Yellow
try {
    $nodeVersion = node --version
    Write-Host "✅ Node.js found: $nodeVersion" -ForegroundColor Green
} catch {
    Write-Host "❌ Node.js not found. Please install Node.js 18+" -ForegroundColor Red
    exit 1
}

# Check if npm is installed
Write-Host "Checking npm installation..." -ForegroundColor Yellow
try {
    $npmVersion = npm --version
    Write-Host "✅ npm found: $npmVersion" -ForegroundColor Green
} catch {
    Write-Host "❌ npm not found. Please install npm" -ForegroundColor Red
    exit 1
}

# Restore backend dependencies
Write-Host "`n📦 Restoring backend dependencies..." -ForegroundColor Yellow
Set-Location "HotelManagement.API"
dotnet restore
if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Failed to restore backend dependencies" -ForegroundColor Red
    exit 1
}
Write-Host "✅ Backend dependencies restored" -ForegroundColor Green

# Build backend
Write-Host "`n🔨 Building backend..." -ForegroundColor Yellow
dotnet build
if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Failed to build backend" -ForegroundColor Red
    exit 1
}
Write-Host "✅ Backend built successfully" -ForegroundColor Green

# Install frontend dependencies
Write-Host "`n📦 Installing frontend dependencies..." -ForegroundColor Yellow
Set-Location "../hotel-frontend"
npm install
if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Failed to install frontend dependencies" -ForegroundColor Red
    exit 1
}
Write-Host "✅ Frontend dependencies installed" -ForegroundColor Green

# Build frontend
Write-Host "`n🔨 Building frontend..." -ForegroundColor Yellow
npm run build
if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Failed to build frontend" -ForegroundColor Red
    exit 1
}
Write-Host "✅ Frontend built successfully" -ForegroundColor Green

Write-Host "`n🎉 Setup completed successfully!" -ForegroundColor Green
Write-Host "`n📋 Next steps:" -ForegroundColor Cyan
Write-Host "1. Start the backend: cd HotelManagement.API && dotnet run" -ForegroundColor White
Write-Host "2. Start the frontend: cd hotel-frontend && npm start" -ForegroundColor White
Write-Host "3. Open http://localhost:3000 in your browser" -ForegroundColor White
Write-Host "4. Login with admin@hotel.com / Admin123!" -ForegroundColor White

Write-Host "`n🔗 URLs:" -ForegroundColor Cyan
Write-Host "• Frontend: http://localhost:3000" -ForegroundColor White
Write-Host "• Backend API: https://localhost:7001" -ForegroundColor White
Write-Host "• Swagger UI: https://localhost:7001/swagger" -ForegroundColor White

Set-Location ".."