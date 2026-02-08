# 🚀 Deployment Guide

## Quick Deploy Options

### 🏆 Best for Beginners: Vercel (1-Click Deploy)

Vercel is made by the creators of Next.js and offers the easiest deployment:

#### Method 1: GitHub Integration (Recommended)
1. Push your code to GitHub
2. Go to [vercel.com](https://vercel.com)
3. Sign in with GitHub
4. Click "New Project"
5. Import your repository
6. Click "Deploy" (no configuration needed!)

✅ **Benefits**: Automatic HTTPS, CDN, preview deployments, zero config

#### Method 2: CLI Deploy
```bash
# Install Vercel CLI
npm install -g vercel

# Navigate to project
cd quest-productivity-system

# Deploy
vercel

# Follow the prompts
```

Your site will be live at: `https://your-project.vercel.app`

---

### 🎯 Alternative: Netlify

#### GitHub Deploy
1. Push to GitHub
2. Go to [netlify.com](https://netlify.com)
3. "New site from Git"
4. Connect to GitHub
5. Build settings:
   - **Build command**: `npm run build`
   - **Publish directory**: `.next`
6. Deploy

#### CLI Deploy
```bash
npm install -g netlify-cli
cd quest-productivity-system
netlify deploy --prod
```

---

### 🔧 Self-Hosting Options

#### Option 1: VPS with PM2 (DigitalOcean, Linode, AWS EC2)

**1. Prepare your server:**
```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install Node.js 18+
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt install -y nodejs

# Install PM2
sudo npm install -g pm2
```

**2. Deploy your app:**
```bash
# Clone/upload your project
git clone your-repo-url
cd quest-productivity-system

# Install dependencies
npm install

# Build
npm run build

# Start with PM2
pm2 start npm --name "quest-system" -- start

# Save PM2 config
pm2 save
pm2 startup
```

**3. Set up Nginx reverse proxy:**
```nginx
# /etc/nginx/sites-available/quest-system
server {
    listen 80;
    server_name yourdomain.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

```bash
# Enable site
sudo ln -s /etc/nginx/sites-available/quest-system /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx

# Get SSL certificate
sudo apt install certbot python3-certbot-nginx
sudo certbot --nginx -d yourdomain.com
```

#### Option 2: Docker

**1. Create Dockerfile:**
```dockerfile
FROM node:18-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

FROM node:18-alpine AS runner
WORKDIR /app
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/node_modules ./node_modules
EXPOSE 3000
CMD ["npm", "start"]
```

**2. Build and run:**
```bash
# Build image
docker build -t quest-system .

# Run container
docker run -d -p 3000:3000 --name quest-system quest-system

# Or with docker-compose:
```

**docker-compose.yml:**
```yaml
version: '3.8'
services:
  quest-system:
    build: .
    ports:
      - "3000:3000"
    restart: unless-stopped
```

```bash
docker-compose up -d
```

---

## 🌐 Domain Setup

### Point Domain to Your App

#### For Vercel/Netlify:
1. Go to your project settings
2. Add custom domain
3. Update your DNS:
   - **Type**: CNAME
   - **Name**: @ or www
   - **Value**: your-project.vercel.app

#### For Self-Hosted:
Update DNS A record:
- **Type**: A
- **Name**: @
- **Value**: Your server IP

---

## 🔒 Environment & Security

### Production Checklist

- [ ] Enable HTTPS (automatic on Vercel/Netlify)
- [ ] Set secure headers
- [ ] Enable CORS if needed
- [ ] Keep dependencies updated
- [ ] Set up monitoring
- [ ] Configure error tracking

### Security Headers (Nginx)
```nginx
add_header X-Frame-Options "SAMEORIGIN" always;
add_header X-Content-Type-Options "nosniff" always;
add_header X-XSS-Protection "1; mode=block" always;
add_header Referrer-Policy "no-referrer-when-downgrade" always;
```

---

## 📊 Performance Optimization

### Build Optimization
```bash
# Analyze bundle size
npm run build
```

### Image Optimization
- Use WebP format
- Compress images
- Use Next.js Image component

### Caching Strategy
Next.js automatically handles caching. For CDN:
- Static assets: 1 year
- API routes: 0 (no cache)
- Pages: ISR or SSR

---

## 🔄 CI/CD Pipeline

### GitHub Actions (`.github/workflows/deploy.yml`)
```yaml
name: Deploy

on:
  push:
    branches: [ main ]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      - run: npm install
      - run: npm run build
      - run: npm run test # if you have tests
      # Deploy steps here
```

---

## 📱 Progressive Web App (PWA)

Want to make it installable? Add PWA support:

**1. Install next-pwa:**
```bash
npm install next-pwa
```

**2. Update next.config.js:**
```javascript
const withPWA = require('next-pwa')({
  dest: 'public',
  disable: process.env.NODE_ENV === 'development',
});

module.exports = withPWA({
  reactStrictMode: true,
});
```

**3. Create manifest.json in public/:**
```json
{
  "name": "Quest Productivity System",
  "short_name": "Quest System",
  "description": "Gamified productivity tracker",
  "start_url": "/",
  "display": "standalone",
  "background_color": "#fff8f0",
  "theme_color": "#e03eeb",
  "icons": [
    {
      "src": "/icon-192.png",
      "sizes": "192x192",
      "type": "image/png"
    },
    {
      "src": "/icon-512.png",
      "sizes": "512x512",
      "type": "image/png"
    }
  ]
}
```

---

## 🔍 Monitoring & Analytics

### Add Analytics (Optional)

#### Google Analytics
```typescript
// app/layout.tsx
import Script from 'next/script';

export default function RootLayout({ children }) {
  return (
    <html>
      <head>
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=GA_MEASUREMENT_ID"
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'GA_MEASUREMENT_ID');
          `}
        </Script>
      </head>
      <body>{children}</body>
    </html>
  );
}
```

#### Vercel Analytics
```bash
npm install @vercel/analytics
```

```typescript
// app/layout.tsx
import { Analytics } from '@vercel/analytics/react';

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        {children}
        <Analytics />
      </body>
    </html>
  );
}
```

---

## 💾 Backup Strategy

Since data is stored in LocalStorage:

### User Data Export Feature
Add to SettingsPanel.tsx:
```typescript
const exportData = () => {
  const data = localStorage.getItem('quest-productivity-system');
  const blob = new Blob([data], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `quest-backup-${new Date().toISOString()}.json`;
  a.click();
};
```

---

## 🧪 Testing Before Deploy

```bash
# Build locally
npm run build

# Test production build
npm start

# Visit http://localhost:3000
# Test all features:
# - Task completion
# - XP earning
# - Dark mode toggle
# - Reward purchasing
# - Settings changes
```

---

## 🚨 Troubleshooting Deployment

### Build Fails
```bash
# Clear cache
rm -rf .next node_modules
npm install
npm run build
```

### Port Issues
```bash
# Use different port
PORT=3001 npm start
```

### Memory Issues
```bash
# Increase Node.js memory
NODE_OPTIONS="--max-old-space-size=4096" npm run build
```

### CORS Issues
Add to `next.config.js`:
```javascript
async headers() {
  return [
    {
      source: '/api/:path*',
      headers: [
        { key: 'Access-Control-Allow-Origin', value: '*' },
      ],
    },
  ];
}
```

---

## 📈 Scaling Considerations

### Current Architecture
- ✅ Static site (no database needed)
- ✅ LocalStorage (client-side only)
- ✅ No backend required
- ✅ Can handle unlimited users

### If You Need Multi-Device Sync:
1. Add Firebase/Supabase
2. Implement user authentication
3. Store data in cloud database
4. Sync between devices

---

## 🎯 Production URLs

After deployment, your app will be available at:

- **Vercel**: `https://quest-system.vercel.app`
- **Netlify**: `https://quest-system.netlify.app`
- **Custom Domain**: `https://yourdomain.com`

---

## 📝 Post-Deployment Checklist

- [ ] Site is accessible
- [ ] HTTPS working
- [ ] All features functional
- [ ] Dark mode working
- [ ] Mobile responsive
- [ ] Performance is good (Lighthouse >90)
- [ ] No console errors
- [ ] Analytics set up (optional)
- [ ] Domain configured (if using custom domain)
- [ ] Monitoring in place

---

## 🎉 You're Live!

Congratulations! Your Quest Productivity System is now live and helping adventurers around the world level up their productivity!

**Remember to:**
- Monitor for issues
- Keep dependencies updated
- Backup regularly
- Listen to user feedback

**Happy deploying! ⚔️✨**

---

## 📞 Need Help?

- **Vercel Docs**: https://vercel.com/docs
- **Netlify Docs**: https://docs.netlify.com
- **Next.js Docs**: https://nextjs.org/docs
- **GitHub Issues**: Create issues for bugs

---

**Version 1.0.0** | Last updated: February 2026
