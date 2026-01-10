# 🚀 CallFlow Deployment Guide

This guide will help you deploy your CallFlow application to the internet for FREE!

## 📋 What You'll Deploy

- **Frontend** (Web Dashboard) → Vercel (Free)
- **Backend** (API Server) → Render.com (Free)
- **Database** (PostgreSQL) → Neon.tech (Free)

## ⏱️ Total Time: 15-20 minutes

---

## Step 1: Set Up Free PostgreSQL Database on Neon

### 1.1 Create Neon Account
1. Go to [https://neon.tech](https://neon.tech)
2. Click "Sign Up" and create a free account (use GitHub/Google for quick signup)
3. Verify your email if required

### 1.2 Create Database
1. After login, click "Create Project" or "New Project"
2. Enter project details:
   - **Project Name**: `callflow-db`
   - **Region**: Choose closest to you (e.g., US East, Europe, Asia)
   - **PostgreSQL Version**: 15 or latest
3. Click "Create Project"

### 1.3 Get Connection Details
After creation, you'll see connection details. **SAVE THESE**:
```
Host: xxxxx.neon.tech
Database: neondb
User: xxxxx
Password: xxxxx
Port: 5432
```

Or copy the full connection string that looks like:
```
postgresql://username:password@host.neon.tech/neondb?sslmode=require
```

---

## Step 2: Deploy Backend to Render.com

### 2.1 Create Render Account
1. Go to [https://render.com](https://render.com)
2. Click "Get Started" and sign up (use GitHub for easier deployment)
3. Verify your email

### 2.2 Connect Your GitHub Repository

**IMPORTANT: First push your code to GitHub**

1. Open Command Prompt or Terminal in your project folder
2. Run these commands:
```bash
cd c:\Users\pc\Downloads\Pabbly-Callflow-master\Pabbly-Callflow-master

# Initialize git if not already done
git init

# Add all files
git add .

# Commit
git commit -m "Initial commit - Ready for deployment"

# Create new repository on GitHub (go to github.com and click "New Repository")
# Name it: callflow-app
# DON'T initialize with README

# Link to GitHub (replace YOUR_USERNAME with your GitHub username)
git remote add origin https://github.com/YOUR_USERNAME/callflow-app.git
git branch -M main
git push -u origin main
```

### 2.3 Deploy Backend on Render

1. In Render dashboard, click "New +" → "Web Service"
2. Click "Connect Repository" and select your `callflow-app` repository
3. Configure the service:
   - **Name**: `callflow-backend`
   - **Region**: Same as your database (or closest to you)
   - **Root Directory**: `backend`
   - **Environment**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Plan**: `Free`

4. Click "Advanced" and add Environment Variables:

| Key | Value |
|-----|-------|
| `NODE_ENV` | `production` |
| `PORT` | `10000` |
| `DB_HOST` | Your Neon host (e.g., xxxxx.neon.tech) |
| `DB_PORT` | `5432` |
| `DB_NAME` | `neondb` |
| `DB_USER` | Your Neon username |
| `DB_PASSWORD` | Your Neon password |
| `JWT_SECRET` | `callflow_prod_secret_2024_CHANGE_THIS_TO_RANDOM_STRING` |
| `JWT_EXPIRES_IN` | `7d` |
| `CORS_ORIGIN` | `*` (we'll update this later) |
| `MAX_FILE_SIZE` | `50000000` |
| `UPLOAD_PATH` | `./uploads` |

5. Click "Create Web Service"

6. Wait 3-5 minutes for deployment. You'll get a URL like:
   ```
   https://callflow-backend.onrender.com
   ```

### 2.4 Test Backend
1. Open: `https://your-backend-url.onrender.com`
2. You should see: `{"success":true,"message":"CallFlow API Server","version":"1.0.0"}`
3. **SAVE THIS URL** - you'll need it for frontend!

---

## Step 3: Deploy Frontend to Vercel

### 3.1 Create Vercel Account
1. Go to [https://vercel.com](https://vercel.com)
2. Click "Sign Up" and use your GitHub account
3. Authorize Vercel to access your GitHub

### 3.2 Deploy Frontend

1. In Vercel dashboard, click "Add New..." → "Project"
2. Import your `callflow-app` repository
3. Configure project:
   - **Framework Preset**: Vite
   - **Root Directory**: `frontend`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`

4. Add Environment Variable:
   - Click "Environment Variables"
   - Add variable:
     - **Name**: `VITE_API_URL`
     - **Value**: `https://your-backend-url.onrender.com/api`
       (Replace with your actual Render backend URL from Step 2.4)

5. Click "Deploy"

6. Wait 2-3 minutes. You'll get a URL like:
   ```
   https://callflow-app.vercel.app
   ```

---

## Step 4: Update CORS Settings

### 4.1 Update Backend CORS
1. Go back to Render.com dashboard
2. Open your `callflow-backend` service
3. Go to "Environment" tab
4. Find `CORS_ORIGIN` variable
5. Update value to your Vercel URL: `https://callflow-app.vercel.app`
6. Click "Save Changes"
7. Service will automatically redeploy (wait 2-3 minutes)

---

## Step 5: Test Your Live Website!

### 5.1 Open Your Website
1. Go to your Vercel URL: `https://callflow-app.vercel.app`
2. You should see the login page

### 5.2 Default Login Credentials
- **Email**: `admin@callflow.com`
- **Password**: `admin123`

**⚠️ IMPORTANT**: Change this password immediately after first login!

---

## 🎉 Success! Your Website is LIVE!

Your CallFlow application is now accessible from anywhere in the world!

### Your Live URLs:
- **Frontend (Web Dashboard)**: `https://callflow-app.vercel.app`
- **Backend API**: `https://callflow-backend.onrender.com`
- **Database**: Hosted on Neon.tech

---

## 📱 Configure Mobile App

To connect your mobile app to the live backend:

1. Open: `mobile/src/config/api.js` or similar config file
2. Update API URL to: `https://callflow-backend.onrender.com/api`
3. Rebuild the mobile app
4. Install on phones

---

## ⚠️ Important Notes

### Free Tier Limitations:
1. **Render.com (Free)**:
   - Backend goes to sleep after 15 minutes of inactivity
   - First request after sleep takes 30-60 seconds to wake up
   - 750 hours/month free (enough for 24/7 for one app)

2. **Vercel (Free)**:
   - 100GB bandwidth/month
   - Unlimited deployments
   - Fast and reliable

3. **Neon.tech (Free)**:
   - 10GB storage
   - 3 projects
   - Unlimited queries

### To Keep Backend Always Active:
Use a free uptime monitoring service like:
- [UptimeRobot.com](https://uptimerobot.com) - Free
- [Cron-job.org](https://cron-job.org) - Free

Set them to ping your backend URL every 10 minutes:
```
https://callflow-backend.onrender.com
```

---

## 🔧 Troubleshooting

### Frontend shows "Network Error" or "Cannot connect to server"
- Check if backend is awake (visit backend URL directly)
- Verify `VITE_API_URL` in Vercel environment variables
- Check CORS settings in Render

### Backend shows "Database connection failed"
- Verify all database credentials in Render environment variables
- Make sure Neon database is active
- Check if you copied the credentials correctly

### "Build failed" on Vercel
- Check build logs for errors
- Make sure `frontend/package.json` exists
- Verify all dependencies are listed in package.json

### "Build failed" on Render
- Check build logs
- Ensure `backend/package.json` has all dependencies
- Verify Node.js version compatibility

---

## 🚀 Optional: Custom Domain

### For Frontend (Vercel):
1. Buy a domain (Namecheap, GoDaddy, Google Domains)
2. In Vercel project settings → Domains
3. Add your domain (e.g., `mycallflow.com`)
4. Update DNS settings as instructed
5. Wait for SSL certificate (automatic, 5-10 minutes)

### For Backend (Render):
- Custom domains available on paid plans only
- Free tier uses: `your-app.onrender.com`

---

## 📞 Support

If you encounter issues:
1. Check the troubleshooting section above
2. Review build/deployment logs in Vercel/Render
3. Verify all environment variables are set correctly
4. Make sure database is accessible

---

## 🎯 Next Steps

1. ✅ Change default admin password
2. ✅ Add your team members
3. ✅ Configure mobile app with live backend URL
4. ✅ Set up uptime monitoring
5. ✅ Test all features thoroughly
6. ✅ Share the link with your team!

---

**Made with ❤️ for CallFlow users**

Your sales call tracking system is now live and ready to use!
