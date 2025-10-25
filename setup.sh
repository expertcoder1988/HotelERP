#!/bin/bash

# Hotel Management System Setup Script
# This script sets up the complete hotel management system

echo "🏨 Hotel Management System Setup"
echo "================================="

# Check if .NET 8 is installed
echo "Checking .NET 8 installation..."
if command -v dotnet &> /dev/null; then
    DOTNET_VERSION=$(dotnet --version)
    if [[ $DOTNET_VERSION == 8.* ]]; then
        echo "✅ .NET 8 found: $DOTNET_VERSION"
    else
        echo "❌ .NET 8 not found. Please install .NET 8 SDK"
        exit 1
    fi
else
    echo "❌ .NET not found. Please install .NET 8 SDK"
    exit 1
fi

# Check if Node.js is installed
echo "Checking Node.js installation..."
if command -v node &> /dev/null; then
    NODE_VERSION=$(node --version)
    echo "✅ Node.js found: $NODE_VERSION"
else
    echo "❌ Node.js not found. Please install Node.js 18+"
    exit 1
fi

# Check if npm is installed
echo "Checking npm installation..."
if command -v npm &> /dev/null; then
    NPM_VERSION=$(npm --version)
    echo "✅ npm found: $NPM_VERSION"
else
    echo "❌ npm not found. Please install npm"
    exit 1
fi

# Restore backend dependencies
echo ""
echo "📦 Restoring backend dependencies..."
cd HotelManagement.API
dotnet restore
if [ $? -ne 0 ]; then
    echo "❌ Failed to restore backend dependencies"
    exit 1
fi
echo "✅ Backend dependencies restored"

# Build backend
echo ""
echo "🔨 Building backend..."
dotnet build
if [ $? -ne 0 ]; then
    echo "❌ Failed to build backend"
    exit 1
fi
echo "✅ Backend built successfully"

# Install frontend dependencies
echo ""
echo "📦 Installing frontend dependencies..."
cd ../hotel-frontend
npm install
if [ $? -ne 0 ]; then
    echo "❌ Failed to install frontend dependencies"
    exit 1
fi
echo "✅ Frontend dependencies installed"

# Build frontend
echo ""
echo "🔨 Building frontend..."
npm run build
if [ $? -ne 0 ]; then
    echo "❌ Failed to build frontend"
    exit 1
fi
echo "✅ Frontend built successfully"

echo ""
echo "🎉 Setup completed successfully!"
echo ""
echo "📋 Next steps:"
echo "1. Start the backend: cd HotelManagement.API && dotnet run"
echo "2. Start the frontend: cd hotel-frontend && npm start"
echo "3. Open http://localhost:3000 in your browser"
echo "4. Login with admin@hotel.com / Admin123!"

echo ""
echo "🔗 URLs:"
echo "• Frontend: http://localhost:3000"
echo "• Backend API: https://localhost:7001"
echo "• Swagger UI: https://localhost:7001/swagger"

cd ..