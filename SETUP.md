# 🚀 Setup Instructions

## Prerequisites

Before you begin, ensure you have the following installed:
- **Node.js** version 18.0 or higher
- **npm** (comes with Node.js) or **yarn**

### Check Your Node Version
```bash
node --version
```
Should return v18.0.0 or higher.

## Installation Steps

### Step 1: Navigate to Project Directory
```bash
cd quest-productivity-system
```

### Step 2: Install Dependencies
This will install all required packages including Next.js, React, Tailwind CSS, Framer Motion, and more.

```bash
npm install
```

**Alternative (if you prefer yarn):**
```bash
yarn install
```

This step may take 2-3 minutes depending on your internet connection.

### Step 3: Start Development Server
```bash
npm run dev
```

**Alternative (yarn):**
```bash
yarn dev
```

You should see output similar to:
```
▲ Next.js 14.2.3
- Local:        http://localhost:3000
- Network:      http://192.168.1.x:3000

✓ Ready in 2.5s
```

### Step 4: Open in Browser
Open your web browser and navigate to:
```
http://localhost:3000
```

🎉 **You're ready to start questing!**

## 🔧 Additional Commands

### Build for Production
Create an optimized production build:
```bash
npm run build
```

### Start Production Server
After building, run the production server:
```bash
npm start
```

### Run Linter
Check code quality:
```bash
npm run lint
```

## 🌐 Deploying Your Quest System

### Option 1: Vercel (Recommended - Easiest)

1. **Create a Vercel account** at [vercel.com](https://vercel.com)

2. **Install Vercel CLI** (optional):
```bash
npm install -g vercel
```

3. **Deploy from the command line**:
```bash
vercel
```

4. **Or deploy via GitHub**:
   - Push your code to GitHub
   - Go to Vercel dashboard
   - Click "New Project"
   - Import your GitHub repository
   - Click "Deploy"

Vercel automatically detects Next.js and configures everything!

### Option 2: Netlify

1. **Create a Netlify account** at [netlify.com](https://netlify.com)

2. **Deploy via GitHub**:
   - Push code to GitHub
   - Connect Netlify to GitHub
   - Select your repository
   - Build settings:
     - Build command: `npm run build`
     - Publish directory: `.next`
   - Click "Deploy"

3. **Or use Netlify CLI**:
```bash
npm install -g netlify-cli
netlify deploy --prod
```

### Option 3: Self-Hosting

1. **Build the application**:
```bash
npm run build
```

2. **Start with PM2** (recommended for production):
```bash
npm install -g pm2
pm2 start npm --name "quest-system" -- start
```

3. **Or use a systemd service** (Linux):
Create `/etc/systemd/system/quest-system.service`:
```ini
[Unit]
Description=Quest Productivity System
After=network.target

[Service]
Type=simple
User=www-data
WorkingDirectory=/path/to/quest-productivity-system
ExecStart=/usr/bin/npm start
Restart=always

[Install]
WantedBy=multi-user.target
```

Then:
```bash
sudo systemctl enable quest-system
sudo systemctl start quest-system
```

### Option 4: Docker (Advanced)

1. **Create Dockerfile**:
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["npm", "start"]
```

2. **Build and run**:
```bash
docker build -t quest-system .
docker run -p 3000:3000 quest-system
```

## 🔍 Troubleshooting Installation

### Issue: "npm: command not found"
**Solution**: Install Node.js from [nodejs.org](https://nodejs.org)

### Issue: "Module not found" errors
**Solution**: Delete node_modules and reinstall:
```bash
rm -rf node_modules
npm install
```

### Issue: Port 3000 already in use
**Solution**: Use a different port:
```bash
PORT=3001 npm run dev
```

### Issue: TypeScript errors
**Solution**: Ensure TypeScript is installed:
```bash
npm install -D typescript @types/react @types/node
```

### Issue: Tailwind styles not loading
**Solution**: 
1. Check `tailwind.config.js` exists
2. Verify `globals.css` imports Tailwind:
```css
@tailwind base;
@tailwind components;
@tailwind utilities;
```
3. Restart dev server

### Issue: Framer Motion animations not working
**Solution**: Clear Next.js cache:
```bash
rm -rf .next
npm run dev
```

## 📱 Browser Compatibility

The Quest Productivity System works best on:
- ✅ Chrome/Edge 90+
- ✅ Firefox 88+
- ✅ Safari 14+
- ✅ Opera 76+

## 🔐 Security Notes

For production deployment:
- Always use environment variables for sensitive data
- Enable HTTPS
- Keep dependencies updated: `npm update`
- Run security audit: `npm audit`

## 🔄 Updating the System

To get the latest updates:
```bash
git pull origin main
npm install
npm run build
```

## 💾 Backup Your Progress

Your progress is stored in browser LocalStorage. To back up:

1. **Open browser DevTools** (F12)
2. **Go to Application tab** → Local Storage
3. **Find key**: `quest-productivity-system`
4. **Copy the value** and save it

To restore, paste it back into LocalStorage.

## 🎯 First-Time Setup Checklist

- [ ] Node.js 18+ installed
- [ ] Project dependencies installed (`npm install`)
- [ ] Development server running (`npm run dev`)
- [ ] Browser opened to localhost:3000
- [ ] Weekly tasks selected
- [ ] First daily task assigned
- [ ] Settings customized (dark mode, sound)

## 📞 Getting Help

If you encounter issues:
1. Check this troubleshooting guide
2. Review the README.md
3. Check the browser console for errors (F12)
4. Verify all dependencies installed correctly

## 🎉 You're All Set!

Your Quest Productivity System is now ready. Start by:
1. Selecting your weekly tasks
2. Assigning tasks to today's schedule
3. Completing your first quest!

**May your productivity be legendary! ⚔️✨**
