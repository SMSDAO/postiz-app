#!/bin/bash

# AI Poster Deployment Script
# Automates the deployment process to Vercel

set -e

echo "🚀 AI Poster Deployment Script"
echo "================================"

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check if Vercel CLI is installed
if ! command -v vercel &> /dev/null; then
    echo -e "${RED}❌ Vercel CLI is not installed${NC}"
    echo "Installing Vercel CLI..."
    npm install -g vercel
fi

# Check for required environment variables
echo ""
echo "📋 Checking environment configuration..."

REQUIRED_VARS=("DATABASE_URL" "REDIS_URL" "JWT_SECRET")
MISSING_VARS=()

for var in "${REQUIRED_VARS[@]}"; do
    if [ -z "${!var}" ]; then
        MISSING_VARS+=("$var")
    fi
done

if [ ${#MISSING_VARS[@]} -ne 0 ]; then
    echo -e "${YELLOW}⚠️  Warning: The following environment variables are not set:${NC}"
    for var in "${MISSING_VARS[@]}"; do
        echo "   - $var"
    done
    echo ""
    echo "You'll need to configure these in Vercel after deployment."
fi

# Run pre-deployment checks
echo ""
echo "🔍 Running pre-deployment checks..."

# Check if package.json exists
if [ ! -f "package.json" ]; then
    echo -e "${RED}❌ package.json not found${NC}"
    exit 1
fi

echo ""
echo "Select deployment type:"
echo "1) Preview (development)"
echo "2) Production"
read -p "Enter choice [1-2]: " choice

case $choice in
    1)
        echo ""
        echo "🔄 Deploying to preview environment..."
        vercel
        ;;
    2)
        read -p "⚠️  Are you sure you want to deploy to PRODUCTION? (yes/no): " confirm
        if [ "$confirm" == "yes" ]; then
            echo ""
            echo "🚀 Deploying to production..."
            vercel --prod
        else
            echo "Deployment cancelled."
            exit 0
        fi
        ;;
    *)
        echo -e "${RED}Invalid choice${NC}"
        exit 1
        ;;
esac

echo ""
echo -e "${GREEN}✅ Deployment complete!${NC}"
