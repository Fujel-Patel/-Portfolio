#!/bin/bash

# Vercel Auto-Deployment Script
# This script automates the deployment process to Vercel

echo "🚀 Starting Vercel Deployment Process..."
echo ""

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    echo "${RED}❌ Error: package.json not found. Please run this script from your project root.${NC}"
    exit 1
fi

# Check if Vercel CLI is installed
if ! command -v vercel &> /dev/null; then
    echo "${YELLOW}⚠️  Vercel CLI not found. Installing...${NC}"
    npm install -g vercel
fi

# Step 1: Build the project
echo "${YELLOW}📦 Step 1: Building project...${NC}"
npm run build

if [ $? -ne 0 ]; then
    echo "${RED}❌ Build failed. Please fix errors and try again.${NC}"
    exit 1
fi

echo "${GREEN}✅ Build successful!${NC}"
echo ""

# Step 2: Check if already logged in
echo "${YELLOW}🔐 Step 2: Checking Vercel authentication...${NC}"
vercel whoami &> /dev/null

if [ $? -ne 0 ]; then
    echo "${YELLOW}Please login to Vercel:${NC}"
    vercel login
else
    echo "${GREEN}✅ Already authenticated with Vercel${NC}"
fi
echo ""

# Step 3: Deploy
echo "${YELLOW}🚀 Step 3: Deploying to Vercel...${NC}"
echo "${YELLOW}Choose deployment type:${NC}"
echo "1) Preview Deployment (for testing)"
echo "2) Production Deployment"
echo ""
read -p "Enter choice (1 or 2): " choice

if [ "$choice" = "1" ]; then
    echo "${YELLOW}Deploying to preview...${NC}"
    vercel
elif [ "$choice" = "2" ]; then
    echo "${YELLOW}Deploying to production...${NC}"
    vercel --prod
else
    echo "${RED}❌ Invalid choice. Exiting.${NC}"
    exit 1
fi

if [ $? -eq 0 ]; then
    echo ""
    echo "${GREEN}🎉 Deployment successful!${NC}"
    echo "${GREEN}Your portfolio is now live!${NC}"
else
    echo ""
    echo "${RED}❌ Deployment failed. Check errors above.${NC}"
    exit 1
fi
