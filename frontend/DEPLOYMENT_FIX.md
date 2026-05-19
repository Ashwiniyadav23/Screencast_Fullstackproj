# Frontend Deployment Fix Guide

## 🚨 Current Issue: "Failed to fetch" error

**Problem**: Your frontend is deployed but trying to connect to `localhost:5000` which doesn't exist in the deployed environment.

## ✅ Solution Steps:

### 1. **Get Your Backend URL**
First, you need to find your deployed backend URL:

1. Go to your [Vercel Dashboard](https://vercel.com/dashboard)  
2. Find your ScreenCast backend project
3. Copy the deployment URL (should be something like: `https://screen-cast-backend-xyz.vercel.app`)

### 2. **Update Environment Variables**

**Option A: Update .env file (Quick Fix)**
```bash
# In your .env file, replace the URL:
VITE_API_URL=https://your-actual-backend-url.vercel.app/api
```

**Option B: Use Vercel Environment Variables (Recommended)**
1. Go to your Vercel frontend project → Settings → Environment Variables
2. Add: `VITE_API_URL` = `https://your-backend-url.vercel.app/api`
3. Redeploy your frontend

### 3. **Create Production Environment File**
```bash
# Create .env.production with your backend URL
cp .env.production.example .env.production
# Edit .env.production and add your real backend URL
```

### 4. **Test Backend First**
Before fixing frontend, make sure your backend is working:
```bash
# Test these URLs in your browser:
https://your-backend-url.vercel.app/api/health
https://your-backend-url.vercel.app/api/auth/register (should return method not allowed, not 500)
```

### 5. **Update CORS on Backend**
Your backend needs to allow requests from your frontend domain:

In your backend `.env` (Vercel environment variables):
```
FRONTEND_URL=https://your-frontend-url.vercel.app
```

### 6. **Redeploy Frontend**
After updating environment variables:
1. Commit changes to git
2. Push to GitHub  
3. Vercel will automatically redeploy

## 🔧 **Quick Commands**

```bash
# Update .env with your backend URL
echo "VITE_API_URL=https://your-backend-url.vercel.app/api" > .env

# Commit and push
git add .env
git commit -m "Update API URL for production deployment"  
git push origin main
```

## 🚀 **Example URLs**

If your backend is: `https://screencast-backend-123.vercel.app`
Then set: `VITE_API_URL=https://screencast-backend-123.vercel.app/api`

If your frontend is: `https://screencast-frontend-456.vercel.app`  
Then backend needs: `FRONTEND_URL=https://screencast-frontend-456.vercel.app`

## ✅ **Verification**

After fixing:
1. Open browser developer tools
2. Go to Network tab  
3. Try to register/login
4. Should see API calls to your Vercel backend URL (not localhost)

## 🆘 **Still Not Working?**

1. **Check Vercel function logs** for your backend
2. **Verify environment variables** are set in both frontend and backend Vercel projects
3. **Test backend health endpoint** directly in browser
4. **Clear browser cache** and try again

The error will be fixed once your frontend connects to the correct backend URL! 🎯