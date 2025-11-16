# Deploying to Vercel

This app is ready to deploy to Vercel. Follow these steps:

## Quick Deploy

1. **Push your code to GitHub**
   ```bash
   git add .
   git commit -m "Ready for Vercel deployment"
   git push origin main
   ```

2. **Import to Vercel**
   - Go to [vercel.com](https://vercel.com)
   - Click "Add New Project"
   - Import your GitHub repository
   - Vercel will automatically detect the configuration from `vercel.json`

3. **Deploy**
   - Click "Deploy"
   - Vercel will build and deploy your app automatically

## Configuration

The app is configured via `vercel.json`:
- **Build Command:** `vite build`
- **Output Directory:** `dist/public`
- **Framework:** Static Site (Vite + React)

## What Gets Deployed

This is a **100% client-side application**. All color harmony calculations happen in the browser using chroma.js:
- ✅ No backend server needed
- ✅ No database required
- ✅ No API calls
- ✅ No environment variables needed
- ✅ Pure static site - fast and free

## Build Locally (Optional)

To test the build locally before deploying:

```bash
npm run build
```

This creates optimized production files in `dist/public/`.

## Features

- Interactive color wheel with real-time palette generation
- 6 color harmony formulas (monochromatic, analogous, complementary, triadic, tetradic, rainbow)
- Adjustable lightness levels
- Copy colors in HEX, RGB, or HSL formats
- EyeDropper API support (Chrome/Edge)
- Fully responsive design
- Dark mode support

## Performance

The app is optimized for production:
- Code splitting and tree-shaking via Vite
- Optimized asset loading
- All color calculations run client-side (no server latency)
- Lightweight bundle size

## Domain Setup (Optional)

After deployment, you can add a custom domain in your Vercel project settings.
