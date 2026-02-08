# 🔥 Firebase Setup Guide - Google Authentication & Cloud Database

This guide will help you set up Firebase for Google login and cloud data sync across all devices!

## 📋 What You'll Get

- ✅ **Google Sign-In**: Users log in with their Google account
- ✅ **Cloud Database**: All progress saved to Firestore
- ✅ **Cross-Device Sync**: Access from phone, tablet, laptop - all synced!
- ✅ **100% FREE**: Firebase free tier is more than enough

---

## 🚀 Step-by-Step Setup

### Step 1: Create Firebase Project (5 minutes)

1. **Go to Firebase Console**
   - Visit: https://console.firebase.google.com/
   - Click "Add project" or "Create a project"

2. **Name Your Project**
   - Enter name: `quest-productivity-system` (or any name you like)
   - Click "Continue"

3. **Google Analytics** (Optional)
   - You can disable this for now
   - Click "Create project"
   - Wait for it to finish (30 seconds)
   - Click "Continue"

---

### Step 2: Register Your Web App (2 minutes)

1. **Click the Web Icon** `</>`
   - On the project overview page
   - You'll see: iOS, Android, Web, Unity icons
   - Click the **Web** icon `</>`

2. **Register App**
   - App nickname: `Quest System Web`
   - ✅ Check "Also set up Firebase Hosting" (optional)
   - Click "Register app"

3. **Copy Your Config**
   - You'll see something like this:
   ```javascript
   const firebaseConfig = {
     apiKey: "AIzaSyXXXXXXXXXXXXXXXXXXXXXXXXXXXX",
     authDomain: "your-project.firebaseapp.com",
     projectId: "your-project-id",
     storageBucket: "your-project.appspot.com",
     messagingSenderId: "123456789012",
     appId: "1:123456789012:web:abcdef123456"
   };
   ```
   - **SAVE THIS!** You'll need it in Step 5

---

### Step 3: Enable Google Authentication (2 minutes)

1. **Go to Authentication**
   - In left sidebar, click "Build" → "Authentication"
   - Click "Get started"

2. **Enable Google Sign-In**
   - Click "Sign-in method" tab
   - Find "Google" in the providers list
   - Click on "Google"
   - Toggle **Enable**
   - Project support email: Select your email
   - Click "Save"

✅ **Done!** Google login is now enabled!

---

### Step 4: Set Up Firestore Database (2 minutes)

1. **Go to Firestore**
   - In left sidebar, click "Build" → "Firestore Database"
   - Click "Create database"

2. **Choose Mode**
   - Select **"Start in test mode"** (for now, we'll secure it later)
   - Click "Next"

3. **Choose Location**
   - Pick closest location to you (e.g., `us-central`, `europe-west`, etc.)
   - Click "Enable"
   - Wait 30 seconds...

✅ **Done!** Database is ready!

---

### Step 5: Configure Your App (3 minutes)

1. **Create `.env.local` file**
   - In your project root (next to `package.json`)
   - Create a file named `.env.local`

2. **Add Your Firebase Config**
   - Copy your config from Step 2
   - Format it like this:

```env
NEXT_PUBLIC_FIREBASE_API_KEY=AIzaSyXXXXXXXXXXXXXXXXXXXXXXXXXXXX
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=123456789012
NEXT_PUBLIC_FIREBASE_APP_ID=1:123456789012:web:abcdef123456
```

   - Replace the values with YOUR actual Firebase config values

3. **Add to `.gitignore`** (already done!)
   - The `.env.local` file is already in `.gitignore`
   - This keeps your keys secret

---

### Step 6: Install & Run (2 minutes)

```bash
# Install new dependencies (includes Firebase)
npm install

# Run your app
npm run dev
```

Open http://localhost:3000

🎉 **You should see the login page with "Continue with Google"!**

---

## 🔐 Secure Your Database (IMPORTANT!)

Once everything works, secure your Firestore:

1. **Go to Firestore Database**
2. **Click "Rules" tab**
3. **Replace the rules with:**

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Users can only read/write their own data
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
  }
}
```

4. **Click "Publish"**

✅ **Now each user can only access their own data!**

---

## 🧪 Test It Out!

1. **Click "Continue with Google"**
2. **Select your Google account**
3. **You should see your Quest System dashboard!**
4. **Complete a task**
5. **Open the app on another device (or browser)**
6. **Log in with the same Google account**
7. **Your progress should be there!** ✨

---

## 📱 Deploy with Firebase Config

### For Vercel:

1. **Go to your Vercel project settings**
2. **Environment Variables section**
3. **Add all 6 Firebase variables:**
   - `NEXT_PUBLIC_FIREBASE_API_KEY`
   - `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN`
   - `NEXT_PUBLIC_FIREBASE_PROJECT_ID`
   - `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET`
   - `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID`
   - `NEXT_PUBLIC_FIREBASE_APP_ID`
4. **Redeploy your app**

### For Netlify:

Same process in Site Settings → Environment Variables

---

## 🎯 What Changed in Your App?

### New Files Created:
1. `src/lib/firebase.ts` - Firebase configuration
2. `src/lib/AuthContext.tsx` - Authentication state management
3. `src/lib/firestoreStorage.ts` - Cloud database functions
4. `src/components/LoginPage.tsx` - Beautiful login screen

### Modified Files:
1. `src/app/layout.tsx` - Added AuthProvider
2. `src/app/page.tsx` - Added login check and user menu
3. `src/lib/GameContext.tsx` - Now saves to Firebase when logged in
4. `package.json` - Added Firebase dependency

---

## 💡 How It Works

### Before Login:
- Data saves to browser LocalStorage (local only)
- Works offline
- Not synced across devices

### After Login:
- Data saves to Firebase Firestore (cloud)
- Syncs across ALL devices
- Always up to date
- Backed up automatically

### The Best Part:
- If you're not logged in, app still works locally!
- When you log in, local data can be merged with cloud data
- Logout doesn't delete your local progress

---

## 🐛 Troubleshooting

### "Firebase config not found"
- Make sure `.env.local` exists in project root
- Check that all variables start with `NEXT_PUBLIC_`
- Restart dev server: `npm run dev`

### "Permission denied" when saving
- Check Firestore Rules (Step: Secure Your Database)
- Make sure you're logged in
- Check browser console for errors

### Can't see login button
- Clear browser cache
- Check that Firebase is imported correctly
- Look for errors in browser console (F12)

### Google login popup blocked
- Allow popups for localhost:3000
- Try different browser
- Check Firebase auth settings

### Data not syncing
- Check internet connection
- Open browser console (F12) for errors
- Verify Firestore rules allow your user
- Try logging out and back in

---

## 📊 Firebase Free Tier Limits

You get **FREE**:
- ✅ 50,000 reads/day
- ✅ 20,000 writes/day  
- ✅ 20,000 deletes/day
- ✅ 1 GB storage
- ✅ 10 GB/month bandwidth

**This is PLENTY for personal use!** Even with 100 active users, you won't hit limits.

---

## 🎉 You're All Set!

Your Quest Productivity System now has:
- ✅ Google Authentication
- ✅ Cloud Database
- ✅ Cross-Device Sync
- ✅ Automatic Backups
- ✅ Secure User Data

**Start questing across all your devices!** ⚔️☁️✨

---

## 🔄 Backup Your Firestore Data (Optional)

Want to download a backup?

1. Go to Firestore Database
2. Select your data
3. Export to Cloud Storage (Firebase provides this feature)

Or use Firebase CLI for automated backups.

---

## 📞 Need Help?

- **Firebase Docs**: https://firebase.google.com/docs
- **Firestore Guide**: https://firebase.google.com/docs/firestore
- **Auth Guide**: https://firebase.google.com/docs/auth

---

**Happy cloud questing!** 🚀☁️
