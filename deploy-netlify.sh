#!/bin/bash

# HonestBroker - Netlify CLI Deployment Script

echo "🚀 Deploying HonestBroker to Netlify..."

# Check if netlify CLI is installed
if ! command -v netlify &> /dev/null
then
    echo "📦 Installing Netlify CLI..."
    npm install -g netlify-cli
fi

# Check if we're in the right directory
if [ ! -f "index.html" ]; then
    echo "❌ index.html not found. Please run this script from the project directory."
    exit 1
fi

# Login to Netlify
echo "🔐 Logging in to Netlify..."
netlify login

# Deploy
echo "📤 Deploying to Netlify..."
netlify deploy --prod --dir=.

echo ""
echo "✅ Deployment complete!"
echo ""
echo "Your site is now live! Check the URL above."
echo ""
echo "💡 Tip: You can customize your site URL in Netlify's dashboard"
echo "   Visit: https://app.netlify.com/"
