#!/bin/bash

# Sachabroker - GitHub Pages Deployment Script

echo "🚀 Deploying Sachabroker to GitHub Pages..."

# Check if git is installed
if ! command -v git &> /dev/null
then
    echo "❌ Git is not installed. Please install Git first:"
    echo "   Visit: https://git-scm.com/downloads"
    exit 1
fi

# Check if we're in the right directory
if [ ! -f "index.html" ]; then
    echo "❌ index.html not found. Please run this script from the project directory."
    exit 1
fi

# Get GitHub username
read -p "Enter your GitHub username: " github_username
read -p "Enter your repository name (e.g., sachabroker): " repo_name

# Initialize git if not already initialized
if [ ! -d ".git" ]; then
    echo "📦 Initializing Git repository..."
    git init
    git add .
    git commit -m "Initial commit - Sachabroker"
else
    echo "📦 Git repository already initialized"
    git add .
    git commit -m "Update - $(date '+%Y-%m-%d %H:%M:%S')"
fi

# Add remote origin
echo "🔗 Adding remote origin..."
git remote remove origin 2>/dev/null
git remote add origin "https://github.com/$github_username/$repo_name.git"

# Push to GitHub
echo "📤 Pushing to GitHub..."
git branch -M main
git push -u origin main

echo ""
echo "✅ Deployment complete!"
echo ""
echo "📝 Next steps:"
echo "1. Go to: https://github.com/$github_username/$repo_name/settings/pages"
echo "2. Under 'Source', select 'main' branch"
echo "3. Click 'Save'"
echo "4. Your site will be live at: https://$github_username.github.io/$repo_name/"
echo ""
echo "⏱️  It may take 2-3 minutes for your site to go live."
