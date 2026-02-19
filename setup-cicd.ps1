# =============================================================================
# CI/CD Setup Script - Creates GitHub Actions workflow, commits & pushes code
# Run with: powershell.exe -ExecutionPolicy Bypass -File setup-cicd.ps1
# =============================================================================

$ErrorActionPreference = "Stop"

function Write-Step($msg) { Write-Host "`n$msg" -ForegroundColor Cyan }
function Write-OK($msg)   { Write-Host "  ✅ $msg" -ForegroundColor Green }
function Write-Warn($msg) { Write-Host "  ⚠️  $msg" -ForegroundColor Yellow }
function Write-Fail($msg) { Write-Host "  ❌ $msg" -ForegroundColor Red }

# ─── Step 1: Verify we're in the project root ──────────────────────────────
Write-Step "Step 1: Verifying project directory..."
if (-not (Test-Path "package.json")) {
    Write-Fail "package.json not found. Run this script from the portfolio root directory."
    exit 1
}
Write-OK "Project root confirmed."

# ─── Step 2: Create .github/workflows directory ────────────────────────────
Write-Step "Step 2: Creating .github/workflows directory..."
New-Item -ItemType Directory -Force -Path ".github\workflows" | Out-Null
Write-OK ".github/workflows directory ready."

# ─── Step 3: Write GitHub Actions CI/CD workflow ───────────────────────────
Write-Step "Step 3: Writing GitHub Actions workflow..."

$workflow = @'
name: CI/CD Pipeline

on:
  push:
    branches: [main, master]
  pull_request:
    branches: [main, master]

env:
  NODE_VERSION: '20'

jobs:
  # ── Build & Lint ────────────────────────────────────────────────────────────
  build:
    name: Build & Lint
    runs-on: ubuntu-latest
    steps:
      - name: Checkout code
        uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: ${{ env.NODE_VERSION }}
          cache: 'npm'

      - name: Install dependencies
        run: npm ci

      - name: Run linter
        run: npm run lint

      - name: Build project
        run: npm run build

      - name: Upload build artifact
        uses: actions/upload-artifact@v4
        with:
          name: dist
          path: dist/
          retention-days: 1

  # ── Deploy to Production (push to main/master) ──────────────────────────────
  deploy-production:
    name: Deploy to Vercel (Production)
    runs-on: ubuntu-latest
    needs: build
    if: github.ref == 'refs/heads/main' || github.ref == 'refs/heads/master'
    environment:
      name: production
      url: ${{ steps.deploy.outputs.url }}
    steps:
      - name: Checkout code
        uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: ${{ env.NODE_VERSION }}
          cache: 'npm'

      - name: Install dependencies
        run: npm ci

      - name: Install Vercel CLI
        run: npm install --global vercel@latest

      - name: Pull Vercel environment info
        run: vercel pull --yes --environment=production --token=${{ secrets.VERCEL_TOKEN }}

      - name: Build via Vercel
        run: vercel build --prod --token=${{ secrets.VERCEL_TOKEN }}

      - name: Deploy to Production
        id: deploy
        run: |
          url=$(vercel deploy --prebuilt --prod --token=${{ secrets.VERCEL_TOKEN }})
          echo "url=$url" >> $GITHUB_OUTPUT
          echo "Deployed to: $url"

  # ── Preview Deploy (pull requests) ──────────────────────────────────────────
  deploy-preview:
    name: Deploy Preview (PR)
    runs-on: ubuntu-latest
    needs: build
    if: github.event_name == 'pull_request'
    steps:
      - name: Checkout code
        uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: ${{ env.NODE_VERSION }}
          cache: 'npm'

      - name: Install dependencies
        run: npm ci

      - name: Install Vercel CLI
        run: npm install --global vercel@latest

      - name: Pull Vercel environment info
        run: vercel pull --yes --environment=preview --token=${{ secrets.VERCEL_TOKEN }}

      - name: Build via Vercel
        run: vercel build --token=${{ secrets.VERCEL_TOKEN }}

      - name: Deploy Preview
        id: preview
        run: |
          url=$(vercel deploy --prebuilt --token=${{ secrets.VERCEL_TOKEN }})
          echo "url=$url" >> $GITHUB_OUTPUT

      - name: Comment PR with preview URL
        uses: actions/github-script@v7
        with:
          script: |
            github.rest.issues.createComment({
              issue_number: context.issue.number,
              owner: context.repo.owner,
              repo: context.repo.repo,
              body: `🚀 **Preview Deployment Ready!**\n\n🔗 **URL:** ${{ steps.preview.outputs.url }}\n\n*Commit: \`${{ github.sha }}\`*`
            })
'@

$workflow | Set-Content -Path ".github\workflows\deploy.yml" -Encoding UTF8
Write-OK "GitHub Actions workflow written to .github/workflows/deploy.yml"

# ─── Step 4: Git — stage all changes ───────────────────────────────────────
Write-Step "Step 4: Staging all changes with git..."
git add .
Write-OK "All changes staged."

# ─── Step 5: Git commit ─────────────────────────────────────────────────────
Write-Step "Step 5: Committing..."
$status = git status --porcelain
if ($status) {
    git commit -m "feat: single-section navigation + GitHub Actions CI/CD pipeline

- Show one section at a time (Home/About/Projects/Skills/Blog/Contact)
- Navigation links switch active section with active highlight
- Swipe/gesture navigation support
- 3D background and navbar always visible
- Added .github/workflows/deploy.yml for CI/CD (Vercel)"
    Write-OK "Committed."
} else {
    Write-Warn "Nothing to commit — working tree clean."
}

# ─── Step 6: Git push ───────────────────────────────────────────────────────
Write-Step "Step 6: Pushing to GitHub..."
$branch = git rev-parse --abbrev-ref HEAD
Write-Host "  Branch: $branch" -ForegroundColor White
git push origin $branch
Write-OK "Code pushed to https://github.com/Fujel-Patel/-Portfolio"

# ─── Step 7: Instructions for Vercel secrets ───────────────────────────────
Write-Host ""
Write-Host "============================================================" -ForegroundColor Magenta
Write-Host " NEXT STEP — Add Vercel secrets to GitHub" -ForegroundColor Magenta
Write-Host "============================================================" -ForegroundColor Magenta
Write-Host ""
Write-Host " Go to: https://github.com/Fujel-Patel/-Portfolio/settings/secrets/actions" -ForegroundColor White
Write-Host ""
Write-Host " Add these 3 secrets:" -ForegroundColor Yellow
Write-Host "   VERCEL_TOKEN      — From https://vercel.com/account/tokens" -ForegroundColor White
Write-Host "   VERCEL_ORG_ID     — Run: vercel projects ls  (team ID)" -ForegroundColor White
Write-Host "   VERCEL_PROJECT_ID — Run: cat .vercel/project.json" -ForegroundColor White
Write-Host ""
Write-Host " After adding secrets, every push to main will auto-deploy!" -ForegroundColor Green
Write-Host "============================================================" -ForegroundColor Magenta
Write-Host ""
