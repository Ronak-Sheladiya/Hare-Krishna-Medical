# 🔧 Vercel Environment Variables Setup

## Required Environment Variables

Set these in your Vercel Dashboard → Project → Settings → Environment Variables:

### Supabase Configuration
```
SUPABASE_URL=https://dvryosjtfrscdbrzssdz.supabase.co
SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImR2cnlvc2p0ZnJzY2Ricnpzc2R6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTY4MTI4ODYsImV4cCI6MjA3MjM4ODg4Nn0.k0d3-hg_3zOyYbBncK9oXjk5cJdmZaUEXonCBWhpOd4
SUPABASE_SERVICE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImR2cnlvc2p0ZnJzY2Ricnpzc2R6Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1NjgxMjg4NiwiZXhwIjoyMDcyMzg4ODg2fQ.bswBMI3qgPYRB2RSn_p1X_S7dzVAPKD4XPHG1yJ9CLg
```

### Authentication
```
JWT_SECRET=your-super-secret-jwt-key-change-in-production
```

### Email Service (Gmail)
```
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password
```

### File Upload (Cloudinary)
```
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret
```

### Payment Gateway (Razorpay)
```
RAZORPAY_KEY_ID=your-razorpay-key-id
RAZORPAY_KEY_SECRET=your-razorpay-secret
```

### Production Settings
```
NODE_ENV=production
PORT=5001
```

## Frontend Environment Variables (Auto-configured)
```
VITE_BACKEND_URL=/api
VITE_SUPABASE_URL=https://dvryosjtfrscdbrzssdz.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImR2cnlvc2p0ZnJzY2Ricnpzc2R6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTY4MTI4ODYsImV4cCI6MjA3MjM4ODg4Nn0.k0d3-hg_3zOyYbBncK9oXjk5cJdmZaUEXonCBWhpOd4
```

## 🚀 Deployment Steps
1. Set all environment variables in Vercel Dashboard
2. Connect GitHub repository to Vercel
3. Deploy automatically detects monorepo structure
4. Both frontend and backend deploy together