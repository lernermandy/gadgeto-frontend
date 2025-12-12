# 🚀 Frontend Deployment Guide

Your frontend API configuration has been updated to use the deployed backend!

## ✅ What Was Changed

**File:** `frontend/assets/js/api.js`
- **Old URL:** `http://127.0.0.1:8001`
- **New URL:** `https://gadgeto-backend.onrender.com`

---

## 📋 How to Deploy Updated Frontend

Since your frontend is already live on Vercel, you need to redeploy it with the updated API URL.

### **Option 1: Redeploy via Vercel Dashboard (Easiest)**

1. Go to [vercel.com](https://vercel.com) and sign in
2. Find your project: **gadgeto-6gsg8tmia-mandar-jadhavs-projects**
3. Click on the project
4. Go to **"Deployments"** tab
5. Click the **three dots (...)** on the latest deployment
6. Click **"Redeploy"**
7. Confirm the redeployment

**Note:** This will redeploy the current code. You need to upload the updated `api.js` file first.

---

### **Option 2: Upload Updated File via Vercel CLI**

If you have Vercel CLI installed:

```bash
cd "D:\e commerce\frontend"
vercel --prod
```

---

### **Option 3: Set Up Git and Auto-Deploy (Recommended)**

This is the best long-term solution:

#### **Step 1: Initialize Git**

```bash
cd "D:\e commerce\frontend"
git init
git add .
git commit -m "Initial commit: Frontend with updated backend URL"
```

#### **Step 2: Create GitHub Repository**

1. Go to: https://github.com/new
2. Repository name: `gadgeto-frontend`
3. Don't initialize with README, .gitignore, or license
4. Click **"Create repository"**

#### **Step 3: Push to GitHub**

```bash
git remote add origin https://github.com/lernermandy/gadgeto-frontend.git
git branch -M main
git push -u origin main
```

#### **Step 4: Connect to Vercel**

1. Go to [vercel.com/dashboard](https://vercel.com/dashboard)
2. Click **"Add New..."** → **"Project"**
3. Import your GitHub repository: `lernermandy/gadgeto-frontend`
4. Click **"Deploy"**

Now every time you push to GitHub, Vercel will automatically redeploy!

---

### **Option 4: Manual File Upload (Quick Fix)**

If you just want to update the one file quickly:

1. Go to your Vercel project dashboard
2. Click **"Settings"**
3. Look for deployment settings
4. You may need to use Vercel CLI or Git for updates

**Note:** Vercel doesn't have a direct file upload feature. You'll need to use Git or CLI.

---

## 🎯 Recommended Approach

**For now (Quick):**
1. Install Vercel CLI: `npm install -g vercel`
2. Run: `cd "D:\e commerce\frontend"`
3. Run: `vercel --prod`
4. Follow the prompts

**For future (Best):**
1. Set up Git repository (Option 3)
2. Connect to Vercel
3. Enable auto-deploy on push

---

## 📦 Install Vercel CLI

If you don't have Vercel CLI:

```bash
npm install -g vercel
```

Then login:

```bash
vercel login
```

Then deploy:

```bash
cd "D:\e commerce\frontend"
vercel --prod
```

---

## ✅ After Deployment

Once your frontend is redeployed:

1. **Test the website:** Visit your Vercel URL
2. **Check browser console:** Look for any errors
3. **Test API calls:** Try login, signup, browsing products
4. **Verify backend connection:** Check if data loads correctly

---

## 🔍 Verify It's Working

Open browser console (F12) and check:

```javascript
// Should show: https://gadgeto-backend.onrender.com
console.log(API_BASE);
```

When you make API calls, they should go to:
```
https://gadgeto-backend.onrender.com/api/...
```

---

## 🆘 Troubleshooting

### **Can't access Vercel project**
- Make sure you're logged into the same account that deployed it
- Check your Vercel dashboard for the project

### **Don't have Vercel CLI**
- Install Node.js first: https://nodejs.org
- Then install Vercel CLI: `npm install -g vercel`

### **Deployment fails**
- Check Vercel logs for errors
- Ensure all files are present
- Verify no syntax errors in JavaScript files

---

## 📞 Need Help?

If you're stuck, let me know:
- Do you have access to the Vercel account?
- Do you have Node.js/npm installed?
- Would you prefer to set up Git first?

---

*Choose the option that works best for you and let me know if you need help!*
