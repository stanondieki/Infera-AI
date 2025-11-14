#!/bin/bash

# Azure Deployment Script for Infera AI Backend

echo "🚀 Starting Azure deployment for Infera AI Backend..."

# Install dependencies
echo "📦 Installing dependencies..."
npm install

# Build the project
echo "🔨 Building TypeScript project..."
npm run build

# Check if build was successful
if [ $? -eq 0 ]; then
    echo "✅ Build completed successfully!"
    echo "📁 Compiled files are in the 'dist' directory"
    echo "🌐 Application will start with: npm start"
else
    echo "❌ Build failed!"
    exit 1
fi

echo "🎉 Deployment preparation complete!"