#!/bin/bash

# Hare Krishna Medical Store - Quick Setup Script
# This script automates the initial setup process

echo "🕉️  Hare Krishna Medical Store - Quick Setup"
echo "============================================"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo -e "${RED}❌ Node.js is not installed. Please install Node.js v18+ first.${NC}"
    exit 1
fi

# Check Node.js version
NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 18 ]; then
    echo -e "${RED}❌ Node.js version 18 or higher is required. Current version: $(node -v)${NC}"
    exit 1
fi

echo -e "${GREEN}✅ Node.js $(node -v) detected${NC}"

# Check if MongoDB is accessible
if command -v mongosh &> /dev/null; then
    echo -e "${GREEN}✅ MongoDB shell detected${NC}"
elif command -v mongo &> /dev/null; then
    echo -e "${GREEN}✅ MongoDB shell detected${NC}"
else
    echo -e "${YELLOW}⚠️  MongoDB shell not detected. You may need to install MongoDB or use MongoDB Atlas.${NC}"
fi

echo ""
echo "📦 Installing dependencies..."

# Install frontend dependencies
echo -e "${BLUE}Installing frontend dependencies...${NC}"
npm install
if [ $? -ne 0 ]; then
    echo -e "${RED}❌ Frontend dependency installation failed${NC}"
    exit 1
fi

# Install backend dependencies
echo -e "${BLUE}Installing backend dependencies...${NC}"
cd backend
npm install
if [ $? -ne 0 ]; then
    echo -e "${RED}❌ Backend dependency installation failed${NC}"
    exit 1
fi

# Install security dependencies
echo -e "${BLUE}Installing security dependencies...${NC}"
npm install express-mongo-sanitize@2.2.0
cd ..

echo ""
echo "🔒 Setting up environment configuration..."

# Create backend .env if it doesn't exist
if [ ! -f "backend/.env" ]; then
    echo -e "${BLUE}Creating backend .env file...${NC}"
    
    # Generate secure JWT secret
    JWT_SECRET=$(node -e "console.log(require('crypto').randomBytes(64).toString('hex'))")
    
    cat > backend/.env << EOF
# ===== AUTO-GENERATED SECURE CONFIGURATION =====
# Generated on: $(date)
# WARNING: Keep these values secret and secure!

# ===== SERVER CONFIGURATION =====
PORT=5000
NODE_ENV=development

# ===== DATABASE CONFIGURATION =====
MONGODB_URI=mongodb://localhost:27017/hare_krishna_medical

# ===== SECURITY CONFIGURATION =====
JWT_SECRET=${JWT_SECRET}
JWT_EXPIRES_IN=7d
BCRYPT_SALT_ROUNDS=12

# ===== CORS CONFIGURATION =====
FRONTEND_URL=http://localhost:5173

# ===== RATE LIMITING =====
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100

# ===== EMAIL CONFIGURATION (Configure these for full functionality) =====
# EMAIL_HOST=smtp.gmail.com
# EMAIL_PORT=587
# EMAIL_USER=your-email@gmail.com
# EMAIL_PASS=your-app-specific-password

# ===== CLOUDINARY CONFIGURATION (Configure for image uploads) =====
# CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
# CLOUDINARY_API_KEY=your_cloudinary_api_key
# CLOUDINARY_API_SECRET=your_cloudinary_api_secret
EOF
    
    echo -e "${GREEN}✅ Backend .env file created with secure JWT secret${NC}"
else
    echo -e "${YELLOW}⚠️  Backend .env file already exists, skipping...${NC}"
fi

# Create frontend .env if it doesn't exist
if [ ! -f ".env" ]; then
    echo -e "${BLUE}Creating frontend .env file...${NC}"
    
    cat > .env << EOF
# ===== BACKEND API CONFIGURATION =====
VITE_BACKEND_URL=http://localhost:5000

# ===== APPLICATION CONFIGURATION =====
VITE_APP_NAME=Hare Krishna Medical Store
VITE_VERSION=1.0.0

# ===== DEVELOPMENT CONFIGURATION =====
VITE_DEBUG=true
VITE_NODE_ENV=development

# ===== REAL-TIME FEATURES =====
VITE_SOCKET_URL=http://localhost:5000

# ===== SECURITY CONFIGURATION =====
VITE_SESSION_TIMEOUT=3600000
VITE_MAX_FILE_SIZE=5242880
EOF
    
    echo -e "${GREEN}✅ Frontend .env file created${NC}"
else
    echo -e "${YELLOW}⚠️  Frontend .env file already exists, skipping...${NC}"
fi

echo ""
echo "🗄️  Database setup..."

# Check if MongoDB is running and seed database
if command -v mongosh &> /dev/null || command -v mongo &> /dev/null; then
    echo -e "${BLUE}Seeding database with sample data...${NC}"
    cd backend
    npm run seed
    if [ $? -eq 0 ]; then
        echo -e "${GREEN}✅ Database seeded successfully${NC}"
    else
        echo -e "${YELLOW}⚠️  Database seeding failed. You may need to start MongoDB first.${NC}"
    fi
    cd ..
else
    echo -e "${YELLOW}⚠️  Skipping database seeding - MongoDB not detected${NC}"
fi

echo ""
echo -e "${GREEN}🎉 Setup completed successfully!${NC}"
echo ""
echo "🚀 To start the application:"
echo ""
echo -e "${BLUE}Terminal 1 (Backend):${NC}"
echo "  cd backend"
echo "  npm run dev"
echo ""
echo -e "${BLUE}Terminal 2 (Frontend):${NC}"
echo "  npm run dev"
echo ""
echo "📱 Access URLs:"
echo "  Frontend: http://localhost:5173"
echo "  Backend:  http://localhost:5000"
echo ""
echo "🔐 Default Login Credentials:"
echo "  Admin: admin@harekrishnamedical.com / admin123"
echo "  User:  john@example.com / user123"
echo ""
echo -e "${YELLOW}⚠️  Important Security Notes:${NC}"
echo "1. Change default passwords after first login"
echo "2. Configure email settings in backend/.env for full functionality"
echo "3. Set up Cloudinary for image uploads"
echo "4. Never commit .env files to version control"
echo "5. Use strong passwords and JWT secrets in production"
echo ""
echo -e "${BLUE}📚 For detailed setup instructions, visit: /localsetup-guide${NC}"
echo ""
echo "Happy coding! 🕉️"
