# Render Deployment Fix Guide

## 🚨 Current Issues

1. `/api/auth/register` showing "not found"
2. "Token not valid" errors
3. Admin message routes showing "routes not found"

## 🔧 Required Environment Variables on Render

Add these in your Render service environment variables:

```bash
# Database
MONGODB_URI=mongodb+srv://ronaksheladiya652:Ronak95865@cluster0.loaubzp.mongodb.net/Hare_Krishna_Medical_db?retryWrites=true&w=majority&appName=Cluster0

# JWT Security (IMPORTANT - Generate a strong secret)
JWT_SECRET=hkms-production-jwt-secret-key-32-chars-min-2024

# Email Configuration
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=sheladiyaronak8@gmail.com
EMAIL_PASS=your-gmail-app-password-here

# Frontend URLs
PRIMARY_DOMAIN=https://hk-medical.vercel.app
FRONTEND_URL=https://hk-medical.vercel.app,https://hkmedical.vercel.app,https://harekrishnamedical.vercel.app

# Production Settings
NODE_ENV=production
PORT=5000
```

## 🚀 Render Service Configuration

### Build Settings

- **Build Command**: `npm install`
- **Start Command**: `npm start`
- **Environment**: `Node`
- **Node Version**: `18` or higher

### Health Check

- **Health Check Path**: `/api/health`
- **Health Check Grace Period**: 300 seconds

### Auto-Deploy

- **Branch**: `main` (or your production branch)
- **Auto-Deploy**: `Yes`

## 🔍 Route Debugging

### Test Routes After Deployment

1. Health check: `https://your-render-app.onrender.com/api/health`
2. Auth routes: `https://your-render-app.onrender.com/api/auth/register`
3. Message routes: `https://your-render-app.onrender.com/api/messages`

### Debug Routes (Development Only)

Visit: `https://your-render-app.onrender.com/api/debug/routes`

## 🛠️ Common Fixes

### 1. JWT Token Issues

**Problem**: "Token not valid" errors
**Solution**:

- Ensure `JWT_SECRET` is set and at least 32 characters
- Don't use the default `dev-secret-key` in production
- Regenerate tokens by logging in again

### 2. Route Not Found Issues

**Problem**: API routes return 404
**Solutions**:

- Check case sensitivity in route file names
- Verify all route files are included in deployment
- Check the enhanced 404 handler for available routes

### 3. CORS Issues

**Problem**: Frontend can't connect to backend
**Solution**:

- Add all frontend domains to `FRONTEND_URL`
- Include both www and non-www versions
- Separate multiple URLs with commas

### 4. Database Connection

**Problem**: Database connection failures
**Solutions**:

- Verify MongoDB Atlas connection string
- Ensure IP whitelist includes `0.0.0.0/0` for Render
- Check database user permissions

## 📋 Deployment Checklist

### Before Deployment

- [ ] All environment variables configured
- [ ] JWT_SECRET is strong and unique
- [ ] MongoDB Atlas IP whitelist updated
- [ ] Email credentials are valid
- [ ] Frontend URLs are correct

### After Deployment

- [ ] Health check returns success
- [ ] Auth routes work (`/api/auth/register`, `/api/auth/login`)
- [ ] Message routes work (`/api/messages`)
- [ ] JWT tokens validate correctly
- [ ] Email sending works
- [ ] Database operations work

## 🐛 Troubleshooting Commands

### Check Render Logs

```bash
# View recent logs
render logs --tail 100

# Monitor live logs
render logs --follow
```

### Test API Endpoints

```bash
# Test registration
curl -X POST https://your-app.onrender.com/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"fullName":"Test User","email":"test@example.com","mobile":"9876543210","password":"TestPass123!"}'

# Test health
curl https://your-app.onrender.com/api/health
```

## 🔐 Security Notes

1. **Never commit secrets** to the repository
2. **Use strong JWT secrets** (32+ characters)
3. **Enable HTTPS only** in production
4. **Rotate secrets** regularly
5. **Monitor access logs** for suspicious activity

## 📞 Support

If issues persist after following this guide:

1. Check Render service logs for specific errors
2. Test individual API endpoints using curl/Postman
3. Verify all environment variables are set correctly
4. Ensure database connectivity from Render
