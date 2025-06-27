# Deployment Configuration Guide

This guide explains how to properly configure your Hare Krishna Medical Store application for different environments.

## 🌐 Production URLs

### Backend (Render)

```
https://hare-krishna-medical.onrender.com
```

### Frontend (Vercel)

- Primary: `https://hk-medical.vercel.app`
- Alternatives:
  - `https://hkmedical.vercel.app`
  - `https://harekrishnamedical.vercel.app`
  - `https://hare-krishna-medical.vercel.app`

### Database (MongoDB Atlas)

```
mongodb+srv://ronaksheladiya652:Ronak95865@cluster0.idf2afh.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0
```

## 📁 Environment Files Setup

### Frontend Configuration

#### For Vercel Deployment:

Set these environment variables in your Vercel project settings:

```bash
VITE_BACKEND_URL=https://hare-krishna-medical.onrender.com
VITE_SOCKET_URL=https://hare-krishna-medical.onrender.com
VITE_APP_NAME=Hare Krishna Medical Store
VITE_VERSION=1.0.0
VITE_DEBUG=false
VITE_NODE_ENV=production
VITE_SESSION_TIMEOUT=3600000
VITE_MAX_FILE_SIZE=5242880
VITE_FRONTEND_URLS=https://hk-medical.vercel.app,https://hkmedical.vercel.app,https://harekrishnamedical.vercel.app,https://hare-krishna-medical.vercel.app
VITE_PRIMARY_DOMAIN=https://hk-medical.vercel.app
```

#### For Local Development:

Copy `.env.example` to `.env` in the Frontend directory:

```bash
cd Frontend
cp .env.example .env
```

Then edit `.env` with your local settings.

### Backend Configuration

#### For Render Deployment:

Set these environment variables in your Render service settings:

```bash
MONGODB_URI=mongodb+srv://ronaksheladiya652:Ronak95865@cluster0.idf2afh.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0
PORT=5000
NODE_ENV=production
FRONTEND_URL=https://hk-medical.vercel.app,https://hkmedical.vercel.app,https://harekrishnamedical.vercel.app,https://hare-krishna-medical.vercel.app
JWT_SECRET=your-super-secret-jwt-key-change-in-production-2024
JWT_EXPIRES_IN=7d
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=sheladiyaronak8@gmail.com
EMAIL_PASS=vsnwhqgdmkzczyfa
CLOUDINARY_CLOUD_NAME=dhrr2pk3z
CLOUDINARY_API_KEY=793151465941582
CLOUDINARY_API_SECRET=Nrvxd62NH1KKL4F1gi7DflzT8eE
CLOUDINARY_URL=cloudinary://793151465941582:Nrvxd62NH1KKL4F1gi7DflzT8eE@dhrr2pk3z
BACKEND_URL=https://hare-krishna-medical.onrender.com
```

#### For Local Development:

Copy `.env.example` to `.env` in the Backend directory:

```bash
cd Backend
cp .env.example .env
```

Then edit `.env` with your local settings.

## 🔧 Configuration Utility

The application uses a centralized configuration utility (`Frontend/src/utils/config.js`) that:

- Automatically detects the environment (development/production)
- Uses appropriate URLs based on the environment
- Provides fallback options for development
- Centralizes all configuration logic

### Key Features:

1. **Environment Detection**: Automatically detects if running in production based on hostname
2. **Smart URL Resolution**: Uses production URLs in production, local URLs in development
3. **Fallback Support**: Falls back to production backend if local backend is unavailable
4. **Configuration Logging**: Logs configuration in development for debugging

## 🚀 Deployment Steps

### 1. Frontend (Vercel)

1. Connect your GitHub repository to Vercel
2. Set the environment variables listed above
3. Deploy automatically on push to main branch

### 2. Backend (Render)

1. Connect your GitHub repository to Render
2. Set the environment variables listed above
3. Deploy automatically on push to main branch

### 3. Database (MongoDB Atlas)

Your database is already configured and running. No additional setup needed.

## 🔍 Verification

After deployment, verify:

1. ✅ Frontend loads at your Vercel URLs
2. ✅ Backend API responds at `/api/health`
3. ✅ Socket.IO connections work
4. ✅ Database operations function properly
5. ✅ CORS is properly configured for all frontend domains

## 🛠️ Local Development

For local development:

1. Install dependencies:

   ```bash
   npm run install:all
   ```

2. Start the development servers:

   ```bash
   # Start backend
   npm run start:backend

   # Start frontend (in another terminal)
   npm run dev
   ```

3. Access the application:
   - Frontend: http://localhost:5173
   - Backend: http://localhost:5000

## 📝 Notes

- All hardcoded URLs have been replaced with environment variables
- The configuration automatically adapts to different environments
- CORS is configured to allow all your frontend domains
- Socket.IO connections are properly configured for real-time features
- MongoDB Atlas is used for both development and production (shared database)

## 🔒 Security

- Keep your JWT secret secure and use a strong value in production
- Regularly rotate your database password
- Use environment variables for all sensitive configuration
- Enable proper CORS settings for your domains only
