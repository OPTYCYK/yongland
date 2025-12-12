# YONGLAND Deployment Guide

## ✅ Pre-Deployment Checklist

Your game is **complete and ready to deploy**. Validation performed:

- ✅ Build compiles successfully
- ✅ Game loads in browser
- ✅ Menu screen displays correctly
- ✅ Gameplay functions properly
- ✅ All 5 mini frauds visible
- ✅ Stadium theme with banners present
- ✅ 5 lives system active
- ✅ No console errors

---

## 🚀 Deployment Options

### Option 1: GitHub Pages (Recommended - Free & Easy)

**Step 1:** Install gh-pages package
```bash
npm install --save-dev gh-pages
```

**Step 2:** Add to `package.json`:
```json
{
  "homepage": "https://OPTYCYK.github.io/yongland",
  "scripts": {
    "predeploy": "npm run build",
    "deploy": "gh-pages -d dist"
  }
}
```

**Step 3:** Deploy
```bash
npm run deploy
```

**Step 4:** Enable GitHub Pages
1. Go to your repository on GitHub
2. Click **Settings** → **Pages**
3. Under "Source", select **gh-pages** branch
4. Click **Save**
5. Your game will be live at: `https://OPTYCYK.github.io/yongland`

---

### Option 2: Netlify (Free & Fast)

**Method A: Drag & Drop (Easiest)**

1. Build your game:
   ```bash
   npm run build
   ```

2. Go to [netlify.com](https://netlify.com)
3. Sign up/login (free account)
4. Drag the `dist/` folder to Netlify's deploy zone
5. Done! Get instant URL like `your-game.netlify.app`

**Method B: Netlify CLI**

```bash
# Install Netlify CLI
npm install -g netlify-cli

# Build
npm run build

# Deploy
netlify deploy --prod --dir=dist
```

**Custom Domain (Optional):**
- In Netlify dashboard → Domain settings → Add custom domain

---

### Option 3: Vercel (Free & Fast)

**Step 1:** Install Vercel CLI
```bash
npm install -g vercel
```

**Step 2:** Deploy
```bash
vercel
```

Follow the prompts:
- Link to existing project or create new
- Vercel will auto-detect settings
- Get instant URL like `yongland.vercel.app`

**Production Deploy:**
```bash
vercel --prod
```

---

### Option 4: Direct Hosting (Any Static Host)

Your game is a static site. Just upload the `dist/` folder to any of these:

- **Firebase Hosting**: `firebase deploy`
- **AWS S3 + CloudFront**: Upload to S3 bucket
- **DigitalOcean App Platform**: Connect GitHub repo
- **Cloudflare Pages**: Connect GitHub repo
- **Surge.sh**: `surge dist/`

**Build Command:** `npm run build`  
**Publish Directory:** `dist`

---

## 📋 Quick Reference

### Local Development
```bash
npm install          # Install dependencies
npm start           # Dev server at localhost:8080
npm run build       # Production build
```

### File Structure
```
dist/               ← Deploy this folder
├── index.html      ← Entry point
├── main.*.js       ← Game code
├── phaser.*.js     ← Phaser engine
└── runtime.*.js    ← Webpack runtime
```

---

## 🔧 Troubleshooting

**Build fails?**
```bash
rm -rf node_modules package-lock.json
npm install
npm run build
```

**Game doesn't load?**
- Check browser console for errors
- Ensure all files in `dist/` are uploaded
- Verify `index.html` is set as default page

**404 errors?**
- For GitHub Pages: Enable Pages in repo settings
- For custom hosting: Set `index.html` as index page

---

## 🎮 Post-Deployment

After deployment, test:
1. ✅ Menu loads
2. ✅ Controls work (Arrow/WASD + Space)
3. ✅ Can defeat mini frauds
4. ✅ Giant fraud appears
5. ✅ Victory screen shows

---

## 📱 Mobile Compatibility

Game is responsive and works on:
- Desktop browsers (Chrome, Firefox, Safari, Edge)
- Mobile browsers (iOS Safari, Chrome Android)
- Tablets

The game auto-scales to fit any screen size.

---

## 🔗 Share Your Game

Once deployed, share:
- **Direct Link**: `https://your-domain.com`
- **Embed**: Add `<iframe src="https://your-domain.com"></iframe>`
- **Social**: Perfect for Twitter, Discord, Reddit

---

**Ready to deploy?** Choose any option above and your game will be live in minutes!

**Manchester is Blue!! 💙**
