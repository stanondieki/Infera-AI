#!/bin/bash

# Quick Production Setup Script for Infera AI

echo "🚀 Setting up Infera AI for production deployment..."

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check if required tools are installed
print_status "Checking prerequisites..."

if ! command -v node &> /dev/null; then
    print_error "Node.js is not installed. Please install Node.js 18 or later."
    exit 1
fi

if ! command -v npm &> /dev/null; then
    print_error "npm is not installed. Please install npm."
    exit 1
fi

print_success "Node.js and npm are installed"

# Build backend
print_status "Building backend..."
cd backend
npm install
npm run build

if [ $? -eq 0 ]; then
    print_success "Backend built successfully"
else
    print_error "Backend build failed"
    exit 1
fi

# Build frontend  
print_status "Building frontend..."
cd ../frontend
npm install
NEXT_PUBLIC_API_URL=https://infera-ai-backend.azurewebsites.net/api npm run build

if [ $? -eq 0 ]; then
    print_success "Frontend built successfully"
else
    print_error "Frontend build failed"
    exit 1
fi

cd ..

print_success "🎉 All builds completed successfully!"
print_status "📋 Next steps:"
echo "1. Set up MongoDB Atlas database"
echo "2. Configure Azure App Service"
echo "3. Set GitHub secrets for deployment"
echo "4. Push to main branch to trigger deployment"
echo ""
print_status "📖 See PRODUCTION-CHECKLIST.md for detailed instructions"