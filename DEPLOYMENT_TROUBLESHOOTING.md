# Deployment Troubleshooting Guide

## Common Issues After Deployment

### 1. 📧 Email Not Sending

**Symptoms:** Registration emails, password reset emails, and order confirmations not being sent

**Causes & Solutions:**

1. **Missing Environment Variables:**

   ```bash
   # Required for email functionality
   EMAIL_USER=your-gmail@gmail.com
   EMAIL_PASS=your-app-password  # NOT your regular Gmail password
   ```

2. **Gmail App Password Setup:**
   - Enable 2-factor authentication on your Gmail account
   - Go to Google Account Settings > Security > 2-Step Verification > App Passwords
   - Generate an app password for "Mail"
   - Use this app password in `EMAIL_PASS`

3. **Check Email Service Logs:**
   - Look for "Email service configured and verified successfully" in backend logs
   - If you see "Email credentials not configured", set the environment variables

### 2. 🔄 Data Not Displaying

**Symptoms:** Frontend shows loading states but no data appears

**Causes & Solutions:**

1. **CORS Issues:**

   ```bash
   # Set your frontend URL in backend environment
   FRONTEND_URL=https://your-frontend-domain.vercel.app
   ```

2. **Backend URL Configuration:**

   ```bash
   # Frontend environment variable (optional but recommended)
   VITE_BACKEND_URL=https://your-backend-domain.onrender.com
   ```

3. **Database Connection:**
   - Verify `MONGODB_URI` is correctly set
   - Check backend logs for "MongoDB connected successfully"
   - Ensure database has proper data

### 3. 📤 Data Not Being Sent

**Symptoms:** Forms submit but data doesn't save, API calls fail

**Causes & Solutions:**

1. **API Endpoint Issues:**
   - Check browser network tab for failed requests
   - Look for 404, 500, or CORS errors
   - Verify backend is running and accessible

2. **Authentication Problems:**

   ```bash
   # Ensure JWT secret is set
   JWT_SECRET=your-very-long-random-secret-key
   ```

3. **Request Timeout:**
   - Check if backend is responding within timeout limits
   - Look for slow database queries

## Environment Variables Checklist

### Backend (Required)

```bash
# Essential
MONGODB_URI=mongodb+srv://...
JWT_SECRET=your-secret-key
NODE_ENV=production

# For emails (highly recommended)
EMAIL_USER=your-gmail@gmail.com
EMAIL_PASS=your-app-password
EMAIL_FROM=noreply@yourdomain.com

# For CORS (required for frontend communication)
FRONTEND_URL=https://your-frontend-domain.com

# Optional but recommended
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret
```

### Frontend (Optional)

```bash
# Only if you need to override backend URL detection
VITE_BACKEND_URL=https://your-backend-domain.com
```

## Testing Deployment

### 1. Backend Health Check

Visit: `https://your-backend-domain.com/api/health`

Should return:

```json
{
  "status": "OK",
  "database": {
    "status": "connected"
  },
  "server": "running"
}
```

### 2. Frontend-Backend Connection

1. Open browser developer tools
2. Go to Network tab
3. Try registering a new user
4. Check if API calls are successful (status 200/201)

### 3. Email Functionality

1. Register a new user
2. Check backend logs for email-related messages
3. Check spam folder for emails

## Common Error Messages

### "Not allowed by CORS"

- Set `FRONTEND_URL` in backend environment variables
- Ensure frontend URL is exactly correct (no trailing slash)

### "Email credentials not configured"

- Set `EMAIL_USER` and `EMAIL_PASS` environment variables
- Use Gmail app password, not regular password

### "JWT secret not provided"

- Set `JWT_SECRET` environment variable
- Use a long, random string (at least 32 characters)

### "Network error - backend API not available"

- Backend is not running or not accessible
- Check backend URL configuration
- Verify backend deployment status

## Deployment Platform Specific Notes

### Vercel (Frontend)

- Environment variables are set in project settings
- Automatic deployments from Git
- Check deployment logs for build errors

### Render (Backend)

- Environment variables in dashboard
- Check service logs for runtime errors
- Ensure PORT is not overridden (Render sets it automatically)

### Railway/Fly.io (Backend)

- Set environment variables in platform dashboard
- Check for memory/CPU limits
- Verify database connectivity

## Quick Fixes

1. **Restart Services:**
   - Redeploy backend service
   - Clear browser cache
   - Check for cached old frontend

2. **Check Logs:**
   - Backend service logs
   - Browser console logs
   - Network tab in developer tools

3. **Verify URLs:**
   - Ensure no typos in environment variables
   - Check for http vs https mismatches
   - Verify all URLs are reachable

## Getting Help

When reporting issues, please include:

1. Error messages from browser console
2. Backend service logs
3. Environment variables (without sensitive values)
4. Steps to reproduce the issue
5. Expected vs actual behavior
