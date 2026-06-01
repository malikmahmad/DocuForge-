#!/usr/bin/env bash
# Railway Quick Setup Script
# This script sets the required environment variables on Railway

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}=== Railway Environment Setup ===${NC}"
echo ""
echo "This script helps you configure DocuForge on Railway."
echo ""
echo -e "${RED}MANUAL STEPS REQUIRED:${NC}"
echo ""
echo "1. Go to: https://railway.com/project/610ec982-e4e9-4dff-a643-b884ba3a6a14"
echo "2. Click on 'DocuForge' service"
echo "3. Click on 'Variables' tab"
echo "4. Look for 'GEMINI_API_KEY' variable"
echo "5. Click the menu (⋮) next to it and select 'Edit'"
echo "6. Enter the API key (ask the developer for the key)"
echo "7. Click 'Save'"
echo "8. Go to 'Deployments' tab"
echo "9. Click 'Redeploy' on the latest deployment"
echo ""
echo -e "${GREEN}Expected Variables:${NC}"
echo "  • GEMINI_API_KEY: <provided separately>"
echo "  • NODE_ENV: production"
echo "  • PORT: 3000"
echo ""
echo -e "${BLUE}After deployment:${NC}"
echo "  • Visit: https://docuforge-production-4290.up.railway.app/"
echo "  • Fill in project details"
echo "  • Click 'Generate Documentation'"
echo ""
