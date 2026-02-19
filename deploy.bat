@echo off
chcp 65001 >nul
cls

echo 🚀 Starting Vercel Deployment Process...
echo.

REM Check if we're in the right directory
if not exist "package.json" (
    echo ❌ Error: package.json not found. Please run this script from your project root.
    exit /b 1
)

REM Check if Vercel CLI is installed
vercel --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ⚠️  Vercel CLI not found. Installing...
    npm install -g vercel
)

REM Step 1: Build the project
echo 📦 Step 1: Building project...
call npm run build

if %errorlevel% neq 0 (
    echo ❌ Build failed. Please fix errors and try again.
    exit /b 1
)

echo ✅ Build successful!
echo.

REM Step 2: Deploy
echo 🚀 Step 2: Deploying to Vercel...
echo Choose deployment type:
echo 1) Preview Deployment (for testing)
echo 2) Production Deployment
echo.

set /p choice="Enter choice (1 or 2): "

if "%choice%"=="1" (
    echo Deploying to preview...
    call vercel
) else if "%choice%"=="2" (
    echo Deploying to production...
    call vercel --prod
) else (
    echo ❌ Invalid choice. Exiting.
    exit /b 1
)

if %errorlevel% equ 0 (
    echo.
    echo 🎉 Deployment successful!
    echo Your portfolio is now live!
) else (
    echo.
    echo ❌ Deployment failed. Check errors above.
    exit /b 1
)

pause
