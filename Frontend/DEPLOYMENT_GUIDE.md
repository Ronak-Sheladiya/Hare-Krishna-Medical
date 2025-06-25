# 🏥 Hare Krishna Medical Store - Complete Deployment Guide

This guide provides step-by-step instructions for deploying the Hare Krishna Medical Store application with frontend and backend properly connected.

## 📋 Prerequisites

- Node.js 16+ installed
- Git installed
- GitHub account
- Vercel account (for frontend)
- Render account (for backend)
- MongoDB Atlas account
- Gmail account (for email services)

## 🏗️ Project Structure

```
hare-krishna-medical/
├── frontend/                    # React frontend files
├── Hare-Krishna-Medical-Backend/ # Express backend files
├── src/                         # Main React source code
├── public/                      # Static assets
├── .env                         # Frontend environment variables
└── deploy-check.js             # Deployment verification script
```

## 🔧 Configuration Setup

### 1. Frontend Environment Variables

Create/update `.env` file in the root directory:

```env
# ===== BACKEND API CONFIGURATION =====
VITE_BACKEND_URL=https://hare-krishna-medical-backend.onrender.com

# ===== APPLICATION CONFIGURATION =====
VITE_APP_NAME=Hare Krishna Medical Store
VITE_VERSION=1.0.0

# ===== DEVELOPMENT CONFIGURATION =====
VITE_DEBUG=true
VITE_NODE_ENV=development

# ===== SECURITY CONFIGURATION =====
VITE_SESSION_TIMEOUT=3600000
VITE_MAX_FILE_SIZE=5242880
```

### 2. Backend Environment Variables

Create/update `Hare-Krishna-Medical-Backend/.env`:

```env
PORT=5000
NODE_ENV=production

# ===== DATABASE CONFIGURATION =====
MONGODB_URI=mongodb+srv://ronaksheladiya652:Ronak95865@cluster0.nlceoex.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0

# ===== SECURITY CONFIGURATION =====
JWT_SECRET=3f84b209e3024c9b9cbd2d3f1f2c7259a5b2ad2f0dfbd29e9c4ea394cb285d43b9f5292abf15dcba15e2e86a36b6e99a93962d30b9a7c8e6e73e9179d55c5820
JWT_EXPIRES_IN=7d
BCRYPT_SALT_ROUNDS=12

# ===== CORS CONFIGURATION =====
FRONTEND_URL=https://harekrishnamedical.vercel.app

# ===== EMAIL CONFIGURATION =====
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=sheladiyaronak8@gmail.com
EMAIL_PASS=vsnwhqgdmkzczyfa

# ===== SMS CONFIGURATION (TWILIO) =====
TWILIO_ACCOUNT_SID=
TWILIO_AUTH_TOKEN=
TWILIO_PHONE_NUMBER=

# ===== PAYMENT GATEWAY =====
RAZORPAY_KEY_ID=
RAZORPAY_KEY_SECRET=

# ===== RATE LIMITING =====
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
```

## 🚀 Deployment Steps

### Step 1: Backend Deployment (Render)

1. **Push to GitHub**

   ```bash
   git add .
   git commit -m "Backend deployment ready"
   git push origin main
   ```

2. **Deploy on Render**

   - Go to [Render Dashboard](https://dashboard.render.com)
   - Click "New" → "Web Service"
   - Connect your GitHub repository
   - Configure:
     - **Name**: `hare-krishna-medical-backend`
     - **Branch**: `main`
     - **Root Directory**: `Hare-Krishna-Medical-Backend`
     - **Build Command**: `npm install`
     - **Start Command**: `npm start`

3. **Set Environment Variables in Render**
   - In your service dashboard, go to "Environment"
   - Add all variables from your `.env` file
   - **Important**: Set `FRONTEND_URL` to your Vercel domain

### Step 2: Frontend Deployment (Vercel)

1. **Update Frontend Config**

   - Make sure `VITE_BACKEND_URL` points to your Render backend URL

2. **Deploy on Vercel**

   - Go to [Vercel Dashboard](https://vercel.com/dashboard)
   - Click "New Project"
   - Import your GitHub repository
   - Configure:
     - **Framework Preset**: Vite
     - **Root Directory**: `.` (leave empty or use root)
     - **Build Command**: `npm run build`
     - **Output Directory**: `dist`

3. **Set Environment Variables in Vercel**
   - In project settings, go to "Environment Variables"
   - Add all variables from your frontend `.env` file

## 🔍 Pre-Deployment Verification

Run the deployment check script:

```bash
node deploy-check.js
```

This will verify:

- ✅ All required files exist
- ✅ Package.json files are valid
- ✅ Environment variables are configured
- ✅ Controllers and routes are in place
- ✅ Utilities are available

## 🧪 Post-Deployment Testing

### 1. Backend Health Check

```bash
curl https://hare-krishna-medical-backend.onrender.com/api/health
```

### 2. Frontend Connectivity

- Visit your Vercel URL
- Check browser console for any API connection errors

### 3. Core Functionality Tests

**User Registration & OTP:**

1. Register a new user
2. Check email for OTP
3. Verify OTP functionality
4. Confirm user login

**Product Management:**

1. Admin login
2. Add/edit products
3. Upload product images
4. Test product search

**Order Processing:**

1. Place test order
2. Verify email notifications
3. Test order status updates
4. Check invoice generation

**Real-time Features:**

1. Test admin notifications
2. Verify live order updates
3. Check message system

## 🔧 Common Issues & Solutions

### Issue: CORS Errors

**Solution**: Ensure `FRONTEND_URL` in backend matches your Vercel domain exactly

### Issue: Email OTP Not Working

**Solutions**:

1. Verify Gmail app password is correct
2. Check email service configuration
3. Ensure EMAIL_PASS is the app password, not regular password

### Issue: Database Connection Fails

**Solutions**:

1. Verify MongoDB URI is correct
2. Check MongoDB Atlas IP whitelist (add 0.0.0.0/0 for all IPs)
3. Ensure database user has proper permissions

### Issue: Environment Variables Not Loading

**Solutions**:

1. Restart your deployment services
2. Verify variable names are exact matches
3. Check for typos in variable values

## 📧 Email Configuration Setup

### Gmail App Password Setup:

1. Enable 2-factor authentication on Gmail
2. Go to Google Account Settings → Security
3. Click "App passwords"
4. Generate new app password for "Mail"
5. Use this password in `EMAIL_PASS` environment variable

## 🔐 Security Checklist

- ✅ JWT_SECRET is strong and unique
- ✅ Database credentials are secure
- ✅ Email credentials use app password
- ✅ CORS is properly configured
- ✅ Rate limiting is enabled
- ✅ Input validation is in place

## 📱 Mobile & SMS Setup (Optional)

For SMS functionality using Twilio:

1. Create Twilio account
2. Get Account SID, Auth Token, and Phone Number
3. Add to environment variables
4. Test SMS notifications

## 🔄 Continuous Deployment

### Automatic Deployments:

- Vercel: Automatically deploys on push to main branch
- Render: Automatically deploys on push to main branch

### Manual Deployments:

- Vercel: Use `vercel --prod` command
- Render: Use dashboard "Manual Deploy" button

## 📊 Monitoring & Logs

### Backend Logs (Render):

- Go to Render dashboard → Your service → Logs
- Monitor for errors, API calls, and performance

### Frontend Logs (Vercel):

- Go to Vercel dashboard → Your project → Functions tab
- Check for build errors and runtime issues

## 🆘 Troubleshooting

### Debug Mode:

Set `VITE_DEBUG=true` and `NODE_ENV=development` for detailed logging

### API Testing:

Use tools like Postman or curl to test backend endpoints directly

### Database Inspection:

Use MongoDB Compass to inspect database records and connections

## 📞 Support

If you encounter issues:

1. Check deployment logs first
2. Verify environment variables
3. Test API endpoints individually
4. Check network connectivity between frontend and backend

---

## 🎉 Success Indicators

Your deployment is successful when:

- ✅ Frontend loads without console errors
- ✅ User registration with OTP works
- ✅ Admin can manage products
- ✅ Orders can be placed and processed
- ✅ Email notifications are sent
- ✅ Real-time features work
- ✅ All pages load correctly

**Frontend URL**: https://harekrishnamedical.vercel.app
**Backend URL**: https://hare-krishna-medical-backend.onrender.com

---

_This deployment guide ensures your Hare Krishna Medical Store is production-ready with all features working correctly._
