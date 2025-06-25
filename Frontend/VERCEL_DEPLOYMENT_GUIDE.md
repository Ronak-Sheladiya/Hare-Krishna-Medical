# 🚀 Vercel Deployment Guide - Hare Krishna Medical Store

Complete step-by-step guide to deploy the Hare Krishna Medical Store frontend on Vercel with production-ready configuration.

## 📋 Prerequisites

Before starting deployment, ensure you have:

### Required Accounts & Tools

- **Vercel Account** - [Sign up here](https://vercel.com)
- **GitHub/GitLab Account** - For code repository
- **Git** - Installed locally
- **Node.js** - v18.0.0 or higher

### Backend Requirements

- **Deployed Backend** - On Railway, Heroku, Render, or similar
- **MongoDB Database** - MongoDB Atlas recommended
- **HTTPS URLs** - All API endpoints must use HTTPS
- **CORS Configuration** - Allow Vercel domain

## 🗂️ Step 1: Prepare Your Repository

### 1.1 Push Code to GitHub

```bash
# Initialize git repository (if not already done)
git init

# Add all files
git add .

# Commit changes
git commit -m "Initial commit for Vercel deployment"

# Add remote repository
git remote add origin https://github.com/yourusername/your-repo-name.git

# Push to GitHub
git push -u origin main
```

### 1.2 Project Structure Verification

Ensure your project has the following structure:

```
project-root/
├── package.json
├── vite.config.js
├── index.html
├── src/
│   ├── main.jsx
│   ├── App.jsx
│   └── ...
├── public/
├── backend/ (separate deployment)
└── .env.example
```

⚠️ **Important:** Remove any .env files from your repository. Never commit sensitive data!

## 🔧 Step 2: Configure Environment Variables

### 2.1 Create .env.example File

Create a template for environment variables:

```env
# Backend API Configuration
VITE_BACKEND_URL=https://your-backend-url.com

# Application Configuration
VITE_APP_NAME=Hare Krishna Medical Store
VITE_VERSION=1.0.0

# Environment
VITE_NODE_ENV=production

# Socket.io Configuration
VITE_SOCKET_URL=https://your-backend-url.com

# Payment Gateway (if applicable)
VITE_RAZORPAY_KEY_ID=your_razorpay_key_id
VITE_STRIPE_PUBLIC_KEY=your_stripe_public_key

# Analytics (optional)
VITE_GOOGLE_ANALYTICS_ID=your_ga_id
```

### 2.2 Update Build Configuration

Ensure your `vite.config.js` is properly configured:

```javascript
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    outDir: "dist",
    sourcemap: false,
    minify: "terser",
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ["react", "react-dom"],
          router: ["react-router-dom"],
          ui: ["react-bootstrap", "bootstrap"],
        },
      },
    },
  },
  server: {
    port: 5173,
    host: true,
  },
  preview: {
    port: 4173,
    host: true,
  },
});
```

## 🌐 Step 3: Deploy to Vercel

### 3.1 Connect Repository to Vercel

1. Go to [vercel.com](https://vercel.com) and sign in
2. Click "New Project"
3. Import your GitHub repository
4. Select your repository from the list

### 3.2 Configure Build Settings

| Setting              | Value            |
| -------------------- | ---------------- |
| **Framework Preset** | Vite             |
| **Root Directory**   | ./ (leave empty) |
| **Build Command**    | `npm run build`  |
| **Output Directory** | `dist`           |
| **Install Command**  | `npm install`    |

> **Note:** Vercel usually auto-detects these settings for Vite projects.

### 3.3 Add Environment Variables

In the Vercel deployment dashboard:

1. Go to "Environment Variables" section
2. Add each variable from your .env.example:

| Variable Name      | Example Value                    | Description          |
| ------------------ | -------------------------------- | -------------------- |
| `VITE_BACKEND_URL` | https://your-backend.railway.app | Your backend API URL |
| `VITE_APP_NAME`    | Hare Krishna Medical Store       | Application name     |
| `VITE_NODE_ENV`    | production                       | Environment type     |
| `VITE_SOCKET_URL`  | https://your-backend.railway.app | Socket.io server URL |

### 3.4 Deploy

Click "Deploy" and wait for the build to complete. This usually takes 2-5 minutes.

## 🌍 Step 4: Configure Custom Domain (Optional)

### 4.1 Add Custom Domain

1. Go to your project dashboard on Vercel
2. Click on "Domains" tab
3. Enter your custom domain (e.g., harekrishnamedical.com)
4. Follow the DNS configuration instructions

### 4.2 DNS Configuration

Add these DNS records to your domain provider:

| Type  | Name | Value                |
| ----- | ---- | -------------------- |
| CNAME | www  | cname.vercel-dns.com |
| A     | @    | 76.76.19.61          |

> **Note:** DNS propagation can take up to 48 hours, but usually completes within a few hours.

## 🔧 Step 5: Update Backend CORS Configuration

### 5.1 Update Backend Environment Variables

Add your Vercel domain to your backend's allowed origins:

```env
# Backend .env file
FRONTEND_URL=https://your-app.vercel.app
CORS_ORIGINS=https://your-app.vercel.app,https://your-custom-domain.com

# If using multiple domains
CORS_ORIGINS=https://your-app.vercel.app,https://your-preview.vercel.app,https://your-custom-domain.com
```

### 5.2 Update CORS Configuration

In your backend Express.js configuration:

```javascript
const cors = require("cors");

const corsOptions = {
  origin: [
    "https://your-app.vercel.app",
    "https://your-custom-domain.com",
    // Add all your Vercel preview URLs
  ],
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
};

app.use(cors(corsOptions));
```

## 🧪 Step 6: Testing & Optimization

### 6.1 Test Your Deployment

- Visit your Vercel URL and test all functionality
- Test user registration and login
- Test product browsing and cart functionality
- Test invoice generation and verification
- Test responsive design on mobile devices

### 6.2 Performance Optimization

#### Vercel Analytics

1. Enable Vercel Analytics in your dashboard
2. Monitor page load times
3. Track user interactions

#### Speed Insights

1. Enable Vercel Speed Insights
2. Monitor Core Web Vitals
3. Optimize based on recommendations

### 6.3 Security Headers

Create a `vercel.json` file in your project root:

```json
{
  "headers": [
    {
      "source": "/(.*)",
      "headers": [
        {
          "key": "X-Content-Type-Options",
          "value": "nosniff"
        },
        {
          "key": "X-Frame-Options",
          "value": "DENY"
        },
        {
          "key": "X-XSS-Protection",
          "value": "1; mode=block"
        },
        {
          "key": "Referrer-Policy",
          "value": "strict-origin-when-cross-origin"
        },
        {
          "key": "Content-Security-Policy",
          "value": "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; font-src 'self' data:; connect-src 'self' https:;"
        }
      ]
    }
  ],
  "rewrites": [
    {
      "source": "/(.*)",
      "destination": "/index.html"
    }
  ]
}
```

## 🛠️ Troubleshooting Common Issues

### Build Failures

- **Memory Issues:** Use build optimization in vite.config.js
- **Package Issues:** Ensure all dependencies are in package.json
- **Environment Variables:** Double-check all VITE\_ prefixed variables

### Runtime Errors

- **CORS Errors:** Update backend CORS configuration
- **API Connection:** Verify VITE_BACKEND_URL is correct and accessible
- **404 on Refresh:** Add rewrites configuration in vercel.json

### Performance Issues

- **Large Bundle Size:** Implement code splitting
- **Slow Loading:** Optimize images and use lazy loading
- **Memory Usage:** Check for memory leaks in useEffect hooks

## 🔄 Ongoing Maintenance

### Automatic Deployments

Vercel automatically deploys when you push to your connected Git branch:

- **Production:** Deployments from main/master branch
- **Preview:** Deployments from feature branches
- **Rollback:** Easy rollback to previous deployments

### Monitoring

- Monitor deployment status in Vercel dashboard
- Set up alerts for failed deployments
- Use Vercel Analytics for performance insights
- Monitor error logs in real-time

### Security Updates

- Regularly update dependencies
- Monitor for security vulnerabilities
- Update environment variables as needed
- Review and update CSP headers

## ✅ Deployment Complete!

Your Hare Krishna Medical Store is now live on Vercel! 🎉

Don't forget to:

- Update your backend CORS settings
- Test all functionality
- Monitor performance metrics
- Set up proper analytics

## 📚 Additional Resources

### Documentation

- [Vercel Documentation](https://vercel.com/docs)
- [Vite Build Guide](https://vitejs.dev/guide/build.html)
- [React Documentation](https://react.dev/learn)

### Backend Deployment Options

- [Railway](https://railway.app) (Recommended)
- [Heroku](https://heroku.com)
- [Render](https://render.com)
- [DigitalOcean App Platform](https://www.digitalocean.com/products/app-platform)

## 🆘 Support

If you encounter any issues during deployment:

1. Check Vercel build logs for specific error messages
2. Verify all environment variables are correctly set
3. Ensure backend is deployed and accessible
4. Test locally before deploying
5. Check Vercel documentation for specific error codes

---

**Happy Deploying! 🚀**

_This guide ensures a production-ready deployment with security best practices and performance optimizations._
