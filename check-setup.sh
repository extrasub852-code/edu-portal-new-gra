#!/bin/bash
# Quick setup verification script

echo "🔍 Checking Node.js setup..."
echo ""

# Check Node.js
if command -v node &> /dev/null; then
    echo "✅ Node.js is installed: $(node --version)"
else
    echo "❌ Node.js is NOT installed"
    echo "   Please install from: https://nodejs.org/"
    exit 1
fi

# Check npm
if command -v npm &> /dev/null; then
    echo "✅ npm is installed: $(npm --version)"
else
    echo "❌ npm is NOT installed"
    exit 1
fi

echo ""
echo "📦 Checking project dependencies..."

if [ -d "node_modules" ]; then
    echo "✅ node_modules directory exists"
else
    echo "⚠️  node_modules not found. Run: npm install"
fi

echo ""
echo "🚀 Ready to start the server!"
echo "   Run: npm run dev"
echo "   Then visit: http://localhost:8080/use-case-finder"
echo ""

