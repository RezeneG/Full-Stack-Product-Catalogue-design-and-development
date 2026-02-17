#!/bin/bash

# 🚀 Product Catalogue - One-Click CodeSandbox Deploy

echo "╔══════════════════════════════════════════════════════════╗"
echo "║     🚀 Deploying Product Catalogue to CodeSandbox       ║"
echo "╚══════════════════════════════════════════════════════════╝"
echo ""

# Check if CodeSandbox CLI is installed
if ! command -v codesandbox &> /dev/null; then
    echo "📦 Installing CodeSandbox CLI..."
    npm install -g codesandbox
fi

echo "🌐 Deploying to CodeSandbox..."
echo ""
echo "⏳ This will open your browser automatically..."
echo ""

# Deploy to CodeSandbox
codesandbox .

echo ""
echo "✅ Deployment initiated!"
echo "📋 If browser doesn't open automatically, visit: https://codesandbox.io/dashboard"
echo ""
echo "🎯 Your project is now being uploaded to CodeSandbox!"
