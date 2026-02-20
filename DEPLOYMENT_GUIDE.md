# Vercel Deployment Guide

## Option 1: Deploy via Vercel CLI (Recommended)

### Step 1: Install Vercel CLI

```bash
npm i -g vercel
```

### Step 2: Login to Vercel

```bash
vercel login
```

Follow the prompts to authenticate.

### Step 3: Deploy

```bash
cd c:/Users/fujel/Documents/portfolio
vercel
```

The CLI will guide you through:

- Project name
- Directory confirmation
- Build settings (auto-detected)

### Step 4: Production Deploy

```bash
vercel --prod
```

## Option 2: Deploy via Git (Automatic)

### Step 1: Create GitHub Repository

1. Go to https://github.com/new
2. Name your repository (e.g., "my-3d-portfolio")
3. Make it public or private
4. Do NOT initialize with README (we have one)

### Step 2: Push Your Code

```bash
cd c:/Users/fujel/Documents/portfolio

# Initialize git (if not already done)
git init

# Add all files
git add .

# Commit
git commit -m "Initial commit - 3D Portfolio"

# Add remote (replace with your repo URL)
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git

# Push
git push -u origin main
```

### Step 3: Connect to Vercel

1. Go to https://vercel.com/new
2. Import your GitHub repository
3. Vercel will auto-detect Vite + React settings
4. Click "Deploy"

### Step 4: Configure Build Settings

In Vercel dashboard:

- **Framework Preset**: Vite
- **Build Command**: `npm run build`
- **Output Directory**: `dist`
- **Install Command**: `npm install`

## Option 3: Drag & Drop (Quickest)

1. Run build locally:

```bash
cd c:/Users/fujel/Documents/portfolio
npm run build
```

2. Go to https://vercel.com/new

3. Drag and drop your `dist/` folder

4. Vercel will deploy instantly!

## 🔧 Post-Deployment Configuration

### Custom Domain

1. In Vercel dashboard, go to your project
2. Click "Settings" → "Domains"
3. Add your custom domain
4. Follow DNS configuration instructions

### Environment Variables (for EmailJS)

1. Go to Project Settings → Environment Variables
2. Add:
   - `VITE_EMAILJS_PUBLIC_KEY`
   - `VITE_EMAILJS_SERVICE_ID`
   - `VITE_EMAILJS_TEMPLATE_ID`
3. Redeploy

### Analytics

1. Install Vercel Analytics:

```bash
npm install @vercel/analytics
```

2. Add to `src/App.tsx`:

```typescript
import { Analytics } from '@vercel/analytics/react'

// In your component:
<Analytics />
```

## 🚀 Automatic Deployments

With Git integration:

- Push to `main` branch → Auto-deploy to Production
- Push to other branches → Preview deployments
- Pull requests → Preview deployments with unique URLs

## 📊 Monitoring

### Vercel Dashboard

- View deployment logs
- Check performance metrics
- Monitor bandwidth usage
- Set up alerts

### Custom Scripts

Add to `package.json`:

```json
{
  "scripts": {
    "deploy": "vercel --prod",
    "deploy:preview": "vercel"
  }
}
```

## 🔒 Security Best Practices

✅ Environment variables are encrypted
✅ Automatic HTTPS
✅ DDoS protection included
✅ Edge network for fast global loading

## 💰 Pricing

**Free Tier Includes:**

- Unlimited static sites
- 100GB bandwidth/month
- 6,000 build minutes/month
- SSL certificates
- Global CDN
- Custom domains

Perfect for portfolios!

## 🆘 Troubleshooting

**Build fails?**

- Check `vercel.json` is correct
- Verify `dist` folder is created
- Check build logs in Vercel dashboard

**Assets not loading?**

- Ensure base path is correct in `vite.config.ts`
- Check all imports use relative paths

**404 errors?**

- `vercel.json` routes configuration handles SPA routing
- Verify file is present in `dist` folder

## 🎉 Success!

Your portfolio will be live at:

- `https://your-project.vercel.app` (default)
- `https://yourdomain.com` (custom domain)

**Share your portfolio link everywhere! 🚀**
