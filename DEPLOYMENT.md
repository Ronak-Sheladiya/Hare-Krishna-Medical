# Hare Krishna Medical Store - Deployment Guide

## 🚀 Quick Deployment to Vercel

### Prerequisites
- GitHub account
- Vercel account
- MongoDB Atlas database
- Email service (Gmail/SMTP)
- Cloudinary account (for image uploads)
- Razorpay account (for payments)

### 1. Repository Setup
```bash
git add .
git commit -m "Production ready deployment"
git push origin main
```

### 2. Vercel Deployment

#### Option A: Monorepo Deployment (Recommended)
1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Click "New Project"
3. Import your GitHub repository
4. Vercel will automatically detect the configuration from `vercel.json`

#### Option B: Separate Deployments
Deploy Frontend and Backend separately:

**Frontend:**
1. Create new Vercel project
2. Set root directory to `Frontend`
3. Build command: `npm run build`
4. Output directory: `dist`

**Backend:**
1. Create new Vercel project  
2. Set root directory to `Backend`
3. Build command: `npm install`
4. Output directory: `.` (root)

### 3. Environment Variables

#### Backend Environment Variables
Set these in Vercel Dashboard → Project → Settings → Environment Variables:

```env
# Database
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/database

# Authentication
JWT_SECRET=your-super-secret-jwt-key-here

# Email Service
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password

# File Upload (Cloudinary)
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret

# Payment Gateway (Razorpay)
RAZORPAY_KEY_ID=your-razorpay-key-id
RAZORPAY_KEY_SECRET=your-razorpay-secret

# Production Settings
NODE_ENV=production
FRONTEND_URL=https://harekrishnamedical.vercel.app
```

#### Frontend Environment Variables
These are already set in `.env.production`:

```env
VITE_BACKEND_URL=https://hare-krishna-medical-backend.vercel.app
VITE_APP_NAME=Hare Krishna Medical Store
VITE_NODE_ENV=production
```

### 4. Domain Configuration

#### Custom Domains (Optional)
1. Go to Vercel Dashboard → Project → Settings → Domains
2. Add your custom domain
3. Update DNS records as instructed
4. Update CORS settings in backend if needed

### 5. Deployment Verification

#### Check Deployment Status
```bash
node deploy.js
```

#### Test Endpoints
- Frontend: `https://your-frontend-url.vercel.app`
- Backend Health: `https://your-backend-url.vercel.app/api/health`
- API Test: `https://your-backend-url.vercel.app/api/test`

### 6. Post-Deployment Setup

#### Database Seeding
The application will automatically seed the database on first run if it's empty.

#### Admin Account
Default admin credentials (change immediately):
- Email: `admin@harekrishnamedical.com`
- Password: `Admin@123`

#### Email Testing
Test email service:
```
GET https://your-backend-url.vercel.app/api/test-email/connection
```

### 7. Monitoring & Maintenance

#### Vercel Analytics
- Enable Analytics in Vercel Dashboard
- Monitor performance and usage

#### Error Monitoring
- Check Vercel Function logs
- Monitor database connections
- Set up alerts for critical errors

#### Regular Updates
- Keep dependencies updated
- Monitor security vulnerabilities
- Backup database regularly

### 8. Troubleshooting

#### Common Issues

**Build Failures:**
- Check Node.js version compatibility
- Verify all dependencies are installed
- Check for TypeScript errors

**API Connection Issues:**
- Verify CORS settings
- Check environment variables
- Test API endpoints directly

**Database Connection:**
- Verify MongoDB URI
- Check IP whitelist in MongoDB Atlas
- Test connection from Vercel functions

**Email Service:**
- Verify SMTP credentials
- Check Gmail app passwords
- Test email connection endpoint

#### Debug Commands
```bash
# Check deployment files
node deploy.js

# Test local build
cd Frontend && npm run build
cd Backend && npm start

# Verify environment variables
echo $MONGODB_URI
```

### 9. Security Checklist

- [ ] Change default admin password
- [ ] Set strong JWT secret
- [ ] Enable MongoDB IP whitelist
- [ ] Use app passwords for Gmail
- [ ] Set up HTTPS redirects
- [ ] Configure security headers
- [ ] Enable rate limiting
- [ ] Set up CORS properly

### 10. Performance Optimization

- [ ] Enable Vercel Edge Functions
- [ ] Configure CDN for static assets
- [ ] Optimize images and assets
- [ ] Enable compression
- [ ] Set up caching headers
- [ ] Monitor Core Web Vitals

## 🎉 Deployment Complete!

Your Hare Krishna Medical Store is now live and ready to serve customers!

### Support
For deployment issues, check:
1. Vercel documentation
2. MongoDB Atlas documentation  
3. Project GitHub issues
4. Vercel community forums

---
**Made with ❤️ for Hare Krishna Medical Store**