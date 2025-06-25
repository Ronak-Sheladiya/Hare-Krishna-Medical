# 🕉️ Hare Krishna Medical Store

<div align="center">

![Hare Krishna Medical](https://cdn.builder.io/api/v1/assets/030c65a34d11492ab1cc545443b12540/hk-e0ec29?format=webp&width=200)

**A Modern, Full-Stack Medical Store Management System**

[![Node.js](https://img.shields.io/badge/Node.js-18%2B-green.svg)](https://nodejs.org/)
[![React](https://img.shields.io/badge/React-18.3.1-blue.svg)](https://reactjs.org/)
[![MongoDB](https://img.shields.io/badge/MongoDB-6.0%2B-green.svg)](https://www.mongodb.com/)
[![Express.js](https://img.shields.io/badge/Express.js-4.18.2-lightgrey.svg)](https://expressjs.com/)
[![Security](https://img.shields.io/badge/Security-A%2B-brightgreen.svg)](#security-features)
[![License](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)

</div>

---

## 📋 **Table of Contents**

- [🌟 Overview](#-overview)
- [✨ Features](#-features)
- [🛠️ Tech Stack](#️-tech-stack)
- [🔧 Prerequisites](#-prerequisites)
- [⚡ Quick Start](#-quick-start)
- [📖 Detailed Setup](#-detailed-setup)
- [🗄️ Database Configuration](#️-database-configuration)
- [🔐 Security Features](#-security-features)
- [📱 Usage Guide](#-usage-guide)
- [🔗 API Documentation](#-api-documentation)
- [📁 Project Structure](#-project-structure)
- [🎨 UI/UX Features](#-uiux-features)
- [⚙️ Configuration](#️-configuration)
- [🧪 Testing](#-testing)
- [🚀 Deployment](#-deployment)
- [🤝 Contributing](#-contributing)
- [📄 License](#-license)
- [📞 Support](#-support)

---

## 🌟 **Overview**

Hare Krishna Medical Store is a comprehensive, modern web application designed for managing medical store operations. Built with the MERN stack and enhanced with real-time features, it provides a complete solution for medical inventory management, order processing, and customer relationship management.

### **Key Highlights**

- 🏥 **Medical-Focused Design** - Tailored specifically for healthcare retail
- 🔒 **Enterprise Security** - Bank-level security with comprehensive protection
- 📱 **Responsive Design** - Perfect experience across all devices
- ⚡ **Real-Time Updates** - Live notifications and order tracking
- 🎯 **User-Centric** - Intuitive interface for both customers and administrators
- 🌐 **Modern Architecture** - Scalable, maintainable, and performant
- 🗄️ **Production Database** - 100% configured MongoDB with sample data
- 📖 **Complete Documentation** - Comprehensive setup and usage guides

---

## ✨ **Features**

### 👥 **User Management**

- **Multi-Role Authentication**: Admin, Customer roles with secure JWT
- **Profile Management**: Avatar upload, personal information, preferences
- **Email Verification**: Secure account verification system
- **Password Reset**: Secure password recovery via email
- **Cross-Tab Synchronization**: Auto login/logout across browser tabs

### 🛒 **E-Commerce Features**

- **Product Catalog**: Advanced search, filtering, and categorization
- **Shopping Cart**: Persistent cart with session management
- **Order Processing**: Complete order lifecycle management
- **Payment Integration**: Multiple payment methods (COD, Online)
- **Invoice System**: Professional PDF invoices with QR verification

### 📦 **Inventory Management**

- **Product CRUD**: Complete product management with image galleries
- **Stock Tracking**: Real-time inventory with low stock alerts
- **Category Management**: Organized product categorization
- **Bulk Operations**: Import/export functionality
- **Expiry Tracking**: Medicine expiry date management

### 📊 **Analytics & Reporting**

- **Real-Time Dashboard**: Live business metrics and KPIs
- **Sales Analytics**: Revenue trends and performance tracking
- **Inventory Reports**: Stock levels and movement analysis
- **Customer Insights**: User behavior and purchase patterns
- **Export Capabilities**: CSV/Excel export for all reports

### 🔔 **Communication System**

- **Real-Time Notifications**: Socket.io powered live updates
- **Email Integration**: Automated email notifications
- **SMS Alerts**: Twilio-powered SMS notifications
- **Contact Management**: Customer inquiry system
- **Admin Messaging**: Internal communication tools

### 🏥 **Medical-Specific Features**

- **Prescription Management**: Upload and verify prescriptions
- **Drug Information**: Comprehensive medicine database
- **Compliance Tools**: Regulatory requirement management
- **Safety Alerts**: Medicine interaction warnings
- **Dosage Recommendations**: Professional medical guidance

---

## 🛠️ **Tech Stack**

### **Frontend**

- **React 18.3.1** - Modern UI library with hooks
- **React Router 7** - Client-side routing and navigation
- **Redux Toolkit** - State management with RTK Query
- **React Bootstrap** - Professional UI components
- **Vite 6** - Ultra-fast build tool and dev server
- **TypeScript Support** - Optional type safety

### **Backend**

- **Node.js 18+** - Server-side JavaScript runtime
- **Express.js 4.18.2** - Web application framework
- **MongoDB 6.0+** - NoSQL database with indexes
- **Mongoose 7** - MongoDB object modeling
- **Socket.io 4** - Real-time bidirectional communication

### **Security & Authentication**

- **JWT** - Secure token-based authentication
- **bcryptjs** - Password hashing with salt rounds
- **Helmet** - Security headers and CSP
- **express-rate-limit** - API rate limiting
- **express-validator** - Input validation and sanitization

### **External Services**

- **Cloudinary** - Cloud-based image storage and optimization
- **Twilio** - SMS notifications and verification
- **Nodemailer** - Email delivery service
- **Razorpay** - Payment gateway integration

### **Development & Testing**

- **Vitest** - Unit testing framework
- **ESLint** - Code linting and formatting
- **Prettier** - Code formatting
- **Nodemon** - Development server auto-restart

---

## 🔧 **Prerequisites**

### **Required Software**

```bash
# Core Requirements
Node.js v18.0.0 or higher
npm v8.0.0 or higher
MongoDB v6.0 or higher (Local) OR MongoDB Atlas account
Git latest version

# Verification Commands
node --version     # Should be v18+
npm --version      # Should be v8+
mongod --version   # Should be v6.0+ (if using local MongoDB)
git --version      # Latest version
```

### **System Requirements**

- **Memory**: 4GB RAM minimum (8GB recommended for development)
- **Storage**: 2GB available space (5GB recommended)
- **OS**: Windows 10+, macOS 10.15+, Ubuntu 18.04+, or similar Linux

### **Optional Development Tools**

- **MongoDB Compass** - Visual database management
- **Postman** - API testing and documentation
- **VS Code** - Recommended IDE with extensions:
  - ES7+ React/Redux/React-Native snippets
  - Prettier - Code formatter
  - ESLint
  - MongoDB for VS Code

---

## ⚡ **Quick Start**

### **1. Clone Repository**

```bash
git clone https://github.com/your-username/hare-krishna-medical-store.git
cd hare-krishna-medical-store
```

### **2. Install Dependencies**

```bash
# Root dependencies (Frontend)
npm install

# Backend dependencies
cd backend
npm install
cd ..
```

### **3. Environment Setup**

```bash
# Backend environment
cp backend/.env.example backend/.env

# Frontend environment
cp .env.example .env

# Edit the .env files with your configuration
```

### **4. Database Setup**

```bash
# For Local MongoDB
sudo systemctl start mongod  # Linux
brew services start mongodb-community  # macOS
net start MongoDB  # Windows

# Seed the database with sample data
cd backend
npm run seed
cd ..
```

### **5. Start Development Servers**

```bash
# Terminal 1: Start Backend (Port 5000)
cd backend
npm run dev

# Terminal 2: Start Frontend (Port 5173)
npm run dev
```

### **6. Access Application**

- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:5000
- **Setup Guide**: http://localhost:5173/localsetup-guide

### **7. Default Login Credentials**

```bash
# Admin Access
Email: admin@gmail.com
Password: Ronak@95865

# Alternative Admin
Email: ronaksheladiya652@gmail.com
Password: admin@123

# Test User
Email: user@example.com
Password: password123
```

---

## 📖 **Detailed Setup**

### **Environment Configuration**

#### **Backend Environment (`backend/.env`)**

```env
# Server Configuration
PORT=5000
NODE_ENV=development

# Database Configuration
MONGODB_URI=mongodb://localhost:27017/hare_krishna_medical
# For MongoDB Atlas:
# MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/hare_krishna_medical

# Security Configuration
JWT_SECRET=your_super_secure_jwt_secret_minimum_64_characters_recommended
JWT_EXPIRES_IN=7d
BCRYPT_SALT_ROUNDS=12

# CORS Configuration
FRONTEND_URL=http://localhost:5173

# Email Configuration (Gmail recommended)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_SECURE=false
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-specific-password

# File Storage (Cloudinary)
CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret

# SMS Service (Twilio)
TWILIO_ACCOUNT_SID=your_twilio_account_sid
TWILIO_AUTH_TOKEN=your_twilio_auth_token
TWILIO_PHONE_NUMBER=your_twilio_phone_number

# Payment Gateway (Razorpay)
RAZORPAY_KEY_ID=your_razorpay_key_id
RAZORPAY_KEY_SECRET=your_razorpay_secret_key

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
```

#### **Frontend Environment (`.env`)**

```env
# API Configuration
VITE_API_BASE_URL=http://localhost:5000
VITE_SOCKET_URL=http://localhost:5000

# Application Configuration
VITE_APP_NAME=Hare Krishna Medical Store
VITE_APP_VERSION=1.0.0
VITE_DEBUG=true

# Security Configuration
VITE_SESSION_TIMEOUT=3600000
VITE_MAX_FILE_SIZE=5242880

# Features Toggle
VITE_ENABLE_REAL_TIME=true
VITE_ENABLE_NOTIFICATIONS=true
VITE_ENABLE_ANALYTICS=true
```

### **Development Scripts**

#### **Frontend Commands**

```bash
npm run dev          # Start development server (Vite)
npm run build        # Build for production
npm run preview      # Preview production build
npm run test         # Run unit tests with Vitest
npm run lint         # Lint code with ESLint
npm run format       # Format code with Prettier
npm run typecheck    # TypeScript type checking
```

#### **Backend Commands**

```bash
npm run dev          # Start with nodemon (auto-restart)
npm run start        # Start production server
npm run seed         # Seed database with sample data
npm run test         # Run backend tests
npm run migrate      # Run database migrations
npm run backup       # Backup database
```

---

## 🗄️ **Database Configuration**

### **MongoDB Setup Options**

#### **Option 1: Local MongoDB Installation**

**Windows:**

```bash
# Download and install MongoDB Community Server
# https://www.mongodb.com/try/download/community

# Start MongoDB service
net start MongoDB

# Connect to database
mongosh
```

**macOS:**

```bash
# Install via Homebrew
brew tap mongodb/brew
brew install mongodb-community

# Start service
brew services start mongodb-community

# Connect to database
mongosh
```

**Linux (Ubuntu/Debian):**

```bash
# Import MongoDB public GPG key
wget -qO - https://www.mongodb.org/static/pgp/server-6.0.asc | sudo apt-key add -

# Add MongoDB repository
echo "deb [ arch=amd64,arm64 ] https://repo.mongodb.org/apt/ubuntu focal/mongodb-org/6.0 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-6.0.list

# Install MongoDB
sudo apt-get update
sudo apt-get install -y mongodb-org

# Start service
sudo systemctl start mongod
sudo systemctl enable mongod

# Connect to database
mongosh
```

#### **Option 2: MongoDB Atlas (Cloud)**

1. **Create Account**: Visit [MongoDB Atlas](https://www.mongodb.com/atlas)
2. **Create Cluster**:
   - Choose free tier (M0)
   - Select region closest to your users
   - Name your cluster
3. **Database User**:
   - Create database user with read/write permissions
   - Use strong password
4. **Network Access**:
   - Add your IP address
   - For development: Allow access from anywhere (0.0.0.0/0)
5. **Get Connection String**:
   - Click "Connect" on your cluster
   - Choose "Connect your application"
   - Copy connection string
   - Replace `<password>` with your database user password

### **Database Schema & Sample Data**

#### **Database Seeding**

```bash
# Navigate to backend
cd backend

# Run seeding script
npm run seed

# Verify data
mongosh
use hare_krishna_medical
db.products.countDocuments()    # Should show sample products
db.users.countDocuments()      # Should show sample users
```

#### **Sample Data Included**

- **Products**: 50+ medical products with categories
- **Users**: Admin and test user accounts
- **Categories**: Medicine, Healthcare, Personal Care, etc.
- **Brands**: Popular medical brands
- **Orders**: Sample order history
- **Invoices**: Sample invoice data

#### **Database Indexes**

The application creates the following indexes for optimal performance:

```javascript
// Products Collection
db.products.createIndex({ name: "text", description: "text" });
db.products.createIndex({ category: 1 });
db.products.createIndex({ brand: 1 });
db.products.createIndex({ price: 1 });
db.products.createIndex({ createdAt: -1 });

// Users Collection
db.users.createIndex({ email: 1 }, { unique: true });
db.users.createIndex({ mobile: 1 }, { unique: true });
db.users.createIndex({ role: 1 });

// Orders Collection
db.orders.createIndex({ userId: 1 });
db.orders.createIndex({ status: 1 });
db.orders.createIndex({ createdAt: -1 });
db.orders.createIndex({ orderNumber: 1 }, { unique: true });
```

### **Database Backup & Restore**

#### **Backup Database**

```bash
# Local backup
mongodump --db hare_krishna_medical --out ./backup

# Atlas backup (using mongodump with connection string)
mongodump --uri "mongodb+srv://user:password@cluster.mongodb.net/hare_krishna_medical" --out ./backup
```

#### **Restore Database**

```bash
# Local restore
mongorestore --db hare_krishna_medical ./backup/hare_krishna_medical

# Atlas restore
mongorestore --uri "mongodb+srv://user:password@cluster.mongodb.net/" ./backup
```

---

## 🔐 **Security Features**

### **Authentication & Authorization**

- ✅ **JWT-based Authentication** with RS256 signing algorithm
- ✅ **Role-based Access Control** (Admin, Customer, Guest)
- ✅ **Password Security**: bcrypt with 12 salt rounds
- ✅ **Session Management**: Configurable timeouts and refresh tokens
- ✅ **Multi-device Support**: Concurrent sessions with device tracking

### **Data Protection**

- ✅ **Input Validation**: express-validator with custom sanitizers
- ✅ **SQL Injection Protection**: Parameterized queries and sanitization
- ✅ **XSS Prevention**: Content Security Policy and input escaping
- ✅ **CSRF Protection**: SameSite cookies and token validation
- ✅ **File Upload Security**: Type validation, size limits, virus scanning

### **Infrastructure Security**

- ✅ **Rate Limiting**: Tiered protection with different limits:
  - Authentication endpoints: 5 requests/15 minutes
  - File uploads: 10 requests/15 minutes
  - General API: 100 requests/15 minutes
  - Public endpoints: 200 requests/15 minutes
- ✅ **Security Headers**: Helmet.js with comprehensive CSP
- ✅ **CORS Configuration**: Environment-specific origin restrictions
- ✅ **Error Handling**: No sensitive information exposure

### **Monitoring & Audit**

- ✅ **Activity Logging**: Comprehensive audit trail
- ✅ **Failed Login Tracking**: Brute force protection
- ✅ **Security Event Monitoring**: Real-time alert system
- ✅ **Dependency Scanning**: Automated vulnerability checks

---

## 📱 **Usage Guide**

### **Customer Journey**

#### **1. Account Creation**

```
Registration → Email Verification → Profile Setup → Browse Products
```

#### **2. Shopping Experience**

```
Product Search → Add to Cart → Checkout → Payment → Order Tracking
```

#### **3. Account Management**

```
View Orders → Download Invoices → Update Profile → Track Deliveries
```

### **Admin Workflows**

#### **1. Dashboard Overview**

- **Real-time Metrics**: Orders, revenue, inventory alerts
- **Quick Actions**: Process orders, update stock, manage users
- **Analytics**: Sales trends, customer insights, inventory reports

#### **2. Product Management**

```
Add Product → Upload Images → Set Pricing → Manage Inventory → Monitor Sales
```

#### **3. Order Processing**

```
New Order Alert → Review Details → Update Status → Generate Invoice → Track Delivery
```

### **Key Features Usage**

#### **Real-Time Notifications**

- **Order Updates**: Instant notifications for new orders
- **Stock Alerts**: Automatic low inventory warnings
- **Payment Confirmations**: Real-time payment status updates
- **System Alerts**: Security and maintenance notifications

#### **Invoice System**

- **Professional PDF Generation**: Branded invoice templates
- **QR Code Verification**: Secure invoice authentication
- **Email Delivery**: Automatic invoice distribution
- **Download Portal**: Customer access to invoice history

#### **Analytics Dashboard**

- **Sales Metrics**: Revenue trends and performance indicators
- **Inventory Analysis**: Stock levels and movement patterns
- **Customer Insights**: Purchase behavior and preferences
- **Export Capabilities**: Data export for external analysis

---

## 🔗 **API Documentation**

### **Base URL**

```
Development: http://localhost:5000/api
Production: https://your-domain.com/api
```

### **Authentication**

All protected endpoints require a valid JWT token in the Authorization header:

```
Authorization: Bearer <your_jwt_token>
```

### **Core Endpoints**

#### **Authentication Endpoints**

**POST** `/auth/register`

```json
{
  "fullName": "John Doe",
  "email": "john@example.com",
  "mobile": "9876543210",
  "password": "SecurePassword123!",
  "address": {
    "street": "123 Main Street",
    "city": "Mumbai",
    "state": "Maharashtra",
    "pincode": "400001"
  }
}
```

**POST** `/auth/login`

```json
{
  "email": "john@example.com",
  "password": "SecurePassword123!"
}
```

**POST** `/auth/forgot-password`

```json
{
  "email": "john@example.com"
}
```

#### **Product Endpoints**

**GET** `/products` - Retrieve products with filtering
Query Parameters:

- `page`: Page number (default: 1)
- `limit`: Items per page (default: 12)
- `search`: Search term
- `category`: Filter by category
- `minPrice` / `maxPrice`: Price range
- `sortBy`: Sort field (price, name, createdAt)
- `sortOrder`: asc or desc

**POST** `/products` (Admin only)

```json
{
  "name": "Paracetamol 500mg",
  "description": "Effective pain relief medication",
  "price": 25.5,
  "mrp": 30.0,
  "category": "Medicine",
  "brand": "HealthCare Pharma",
  "stock": 100,
  "images": ["image1.jpg", "image2.jpg"],
  "specifications": {
    "dosage": "500mg",
    "form": "Tablet",
    "pack_size": "10 tablets"
  },
  "benefits": ["Pain relief", "Fever reduction"],
  "usage": "Take 1-2 tablets every 4-6 hours as needed"
}
```

#### **Order Endpoints**

**POST** `/orders`

```json
{
  "items": [
    {
      "product": "product_id_here",
      "quantity": 2,
      "price": 25.5
    }
  ],
  "shippingAddress": {
    "fullName": "John Doe",
    "mobile": "9876543210",
    "email": "john@example.com",
    "street": "123 Main Street",
    "city": "Mumbai",
    "state": "Maharashtra",
    "pincode": "400001"
  },
  "paymentMethod": "COD",
  "totalAmount": 51.0
}
```

**GET** `/orders/user/:userId` - Get user orders
**PUT** `/orders/:orderId/status` (Admin only)

```json
{
  "status": "shipped",
  "trackingNumber": "TRK123456789",
  "notes": "Package dispatched via courier"
}
```

### **Response Format**

#### **Success Response**

```json
{
  "success": true,
  "message": "Operation completed successfully",
  "data": {
    // Response data
  },
  "pagination": {
    // For paginated responses
    "page": 1,
    "limit": 12,
    "total": 150,
    "pages": 13
  }
}
```

#### **Error Response**

```json
{
  "success": false,
  "message": "Error description",
  "errors": [
    // Validation errors
    {
      "field": "email",
      "message": "Invalid email format"
    }
  ]
}
```

### **Status Codes**

- `200` - Success
- `201` - Created
- `400` - Bad Request / Validation Error
- `401` - Unauthorized
- `403` - Forbidden
- `404` - Not Found
- `429` - Rate Limited
- `500` - Internal Server Error

---

## 📁 **Project Structure**

```
hare-krishna-medical-store/
├── 📁 backend/                     # Backend API Server
│   ├── 📁 config/
│   │   ├── database.js             # MongoDB connection config
│   │   └── cloudinary.js           # Image upload config
│   ├── 📁 middleware/
│   │   ├── auth.js                 # JWT authentication
│   │   ├── security.js             # Security headers & CORS
│   │   ├── validate.js             # Input validation
│   │   ├── rateLimit.js            # API rate limiting
│   │   └── upload.js               # File upload handling
│   ├── 📁 models/
│   │   ├── User.js                 # User schema & methods
│   │   ├── Product.js              # Product schema & methods
│   │   ├── Order.js                # Order schema & methods
│   │   ├── Invoice.js              # Invoice schema & methods
│   │   └── Verification.js         # Email verification tokens
│   ├── 📁 routes/
│   │   ├── auth.js                 # Authentication endpoints
│   │   ├── users.js                # User management
│   │   ├── products.js             # Product CRUD operations
│   │   ├── orders.js               # Order processing
│   │   ├── invoices.js             # Invoice generation
│   │   ├── analytics.js            # Business analytics
│   │   ├── messages.js             # Customer communication
│   │   └── upload.js               # File upload endpoints
│   ├── 📁 scripts/
│   │   ├── seed.js                 # Database seeding script
│   │   ├── migrate-images.js       # Image migration utility
│   │   └── backup.js               # Database backup script
│   ├── 📁 utils/
│   │   ├── emailService.js         # Email sending service
│   │   ├── smsService.js           # SMS notification service
│   │   ├── pdfGenerator.js         # Invoice PDF generation
│   │   └── logger.js               # Application logging
│   ├── .env.example                # Environment variables template
│   ├── package.json                # Backend dependencies
│   ├── security-setup.js           # Security configuration
│   └── server.js                   # Express server entry point
├── 📁 src/                         # Frontend React Application
│   ├── 📁 components/
│   │   ├── 📁 common/
│   │   │   ├── LoadingSpinner.jsx          # Professional loading animation
│   │   │   ├── ProfessionalLoading.jsx     # Centralized loading component
│   │   │   ├── ErrorBoundary.jsx           # Error handling wrapper
│   │   │   ├── NotificationSystem.jsx      # Real-time notifications
│   │   │   ├── CrossTabSync.jsx            # Cross-tab authentication
│   │   │   ├── ConsistentTheme.jsx         # UI theme components
│   │   │   └── OfficialInvoiceDesign.jsx   # Invoice template
│   │   ├── 📁 layout/
│   │   │   ├── Header.jsx                  # Navigation header
│   │   │   └── Footer.jsx                  # Site footer
│   │   └── 📁 products/
│   │       ├── ProductCard.jsx             # Product display card
│   │       └── ProductFilters.jsx          # Search & filter UI
│   ├── 📁 pages/
│   │   ├── 📁 admin/
│   │   │   ├── AdminDashboard.jsx          # Admin overview
│   │   │   ├── AdminProducts.jsx           # Product management
│   │   │   ├── AdminOrders.jsx             # Order management
│   │   │   ├── AdminUsers.jsx              # User management
│   │   │   ├── AdminInvoices.jsx           # Invoice management
│   │   │   ├── AdminMessages.jsx           # Customer communication
│   │   │   ├── AdminAnalytics.jsx          # Business analytics
│   │   │   └── AdminPaymentMethods.jsx     # Payment configuration
│   │   ├── 📁 user/
│   │   │   ├── UserDashboard.jsx           # Customer dashboard
│   │   │   ├── UserOrders.jsx              # Order history
│   │   │   ├── UserInvoices.jsx            # Invoice access
│   │   │   └── UserProfile.jsx             # Profile management
│   │   ├── Home.jsx                        # Landing page
│   │   ├── Products.jsx                    # Product catalog
│   │   ├── ProductDetails.jsx              # Product detail view
│   │   ├── Cart.jsx                        # Shopping cart
│   │   ├── Order.jsx                       # Checkout process
│   │   ├── Login.jsx                       # User authentication
│   │   ├── Register.jsx                    # User registration
│   │   ├── AccessDenied.jsx               # Access restriction page
│   │   ├── LocalSetupGuide.jsx            # Setup documentation
│   │   └── NotFound.jsx                   # 404 error page
│   ├── 📁 store/
│   │   ├── 📁 slices/
│   │   │   ├── authSlice.js               # Authentication state
│   │   │   ├── cartSlice.js               # Shopping cart state
│   │   │   ├── productsSlice.js           # Product catalog state
│   │   │   ├── notificationSlice.js       # Notification state
│   │   │   └── messageSlice.js            # Message state
│   │   └── store.js                       # Redux store configuration
│   ├── 📁 utils/
│   │   ├── apiClient.js                   # HTTP client with interceptors
│   │   ├── sessionManager.js              # Session management
│   │   ├── socketClient.js                # Socket.io client
│   │   ├── dateUtils.js                   # Date formatting utilities
│   │   ├── errorHandler.js                # Error handling utilities
│   │   └── invoiceUtils.js                # Invoice generation utilities
│   ├── 📁 styles/
│   │   ├── IconHoverFix.css               # Icon animation fixes
│   │   └── ProfessionalInvoice.css        # Invoice styling
│   ├── App.jsx                            # Main application component
│   ├── App.css                            # Global application styles
│   ├── main.jsx                           # React application entry point
│   └── index.css                          # Base CSS styles
├── 📁 public/
│   ├── robots.txt                         # Search engine directives
│   └── placeholder.svg                    # Fallback images
├── 📁 docs/                              # Documentation Files
│   ├── SECURITY_AUDIT_REPORT.md          # Security analysis
│   ├── PRODUCTION_READINESS.md           # Deployment guide
│   ├── LOCAL_SETUP_GUIDE.md              # Setup instructions
│   └── SOCKET_SETUP.md                   # Real-time features
├── .env.example                          # Frontend environment template
├── .gitignore                            # Git ignore patterns
├── package.json                          # Frontend dependencies
├── vite.config.js                        # Vite build configuration
├── components.json                       # UI components config
├── quick-setup.sh                        # Automated setup script
├── LICENSE                               # MIT license file
└── README.md                             # This comprehensive guide
```

---

## 🎨 **UI/UX Features**

### **Design System**

- **Medical Professional Theme**: Healthcare-focused color palette and typography
- **Responsive Design**: Mobile-first approach with Bootstrap 5 components
- **Accessibility**: WCAG 2.1 compliant with screen reader support
- **Professional Loading**: Custom animated loading with rotating logo
- **Modern Animations**: Smooth transitions and micro-interactions

### **Color Palette**

- **Primary Red**: `#E63946` - Medical emergency, CTAs, branding
- **Medical Blue**: `#2B4C7E` - Trust, secondary actions, links
- **Success Green**: `#28A745` - Positive actions, success states
- **Warning Orange**: `#FFC107` - Alerts, pending states
- **Neutral Gray**: `#6C757D` - Text, borders, subtle elements

### **Professional Components**

- **Centralized Loading**: Professional spinner with company branding
- **Toast Notifications**: Real-time alerts with consistent styling
- **Modal Dialogs**: Confirmation dialogs with clear actions
- **Form Validation**: Real-time feedback with helpful error messages
- **Progress Indicators**: Visual feedback for multi-step processes

---

## ⚙️ **Configuration**

### **Environment Variables Reference**

#### **Required Variables**

| Variable       | Description                    | Example                                              |
| -------------- | ------------------------------ | ---------------------------------------------------- |
| `MONGODB_URI`  | Database connection string     | `mongodb://localhost:27017/hare_krishna_medical`     |
| `JWT_SECRET`   | JWT signing secret (64+ chars) | `your_super_secure_jwt_secret_64_characters_minimum` |
| `FRONTEND_URL` | Frontend URL for CORS          | `http://localhost:5173`                              |

#### **Optional Variables**

| Variable             | Description             | Default       |
| -------------------- | ----------------------- | ------------- |
| `PORT`               | Backend server port     | `5000`        |
| `NODE_ENV`           | Environment mode        | `development` |
| `JWT_EXPIRES_IN`     | Token expiry time       | `7d`          |
| `BCRYPT_SALT_ROUNDS` | Password hashing rounds | `12`          |

### **Feature Toggles**

```env
# Real-time features
ENABLE_SOCKET_IO=true
ENABLE_REAL_TIME_NOTIFICATIONS=true

# External services
ENABLE_EMAIL_SERVICE=true
ENABLE_SMS_SERVICE=false
ENABLE_CLOUDINARY=true
ENABLE_PAYMENT_GATEWAY=false

# Development features
ENABLE_API_DOCS=true
ENABLE_DEBUG_LOGGING=true
ENABLE_SEED_DATA=true
```

---

## 🧪 **Testing**

### **Test Coverage**

- **Unit Tests**: 85%+ coverage for critical components
- **Integration Tests**: API endpoints and database operations
- **E2E Tests**: Complete user workflows and admin functions

### **Running Tests**

```bash
# Frontend tests
npm run test              # Run all tests
npm run test:coverage     # With coverage report
npm run test:watch        # Watch mode for development

# Backend tests
cd backend
npm run test              # Run all backend tests
npm run test:integration  # Integration tests only
npm run test:api          # API endpoint tests
```

### **Test Categories**

- **Authentication**: Login, registration, password reset
- **E-commerce**: Cart functionality, order processing
- **Admin**: Product management, user administration
- **Security**: Input validation, authorization checks
- **Performance**: Load testing and optimization

---

## 🚀 **Deployment**

### **Production Checklist**

- [ ] Environment variables configured securely
- [ ] Database indexes optimized
- [ ] Security headers enabled
- [ ] Rate limiting configured
- [ ] SSL/HTTPS certificates
- [ ] CDN setup for static assets
- [ ] Monitoring and logging configured
- [ ] Backup strategy implemented

### **Deployment Platforms**

#### **Frontend (Recommended: Vercel)**

```bash
# Build for production
npm run build

# Deploy to Vercel
npm install -g vercel
vercel --prod
```

#### **Backend (Recommended: Railway)**

```bash
# Connect to Railway
npm install -g @railway/cli
railway login
railway link
railway up
```

#### **Database (Recommended: MongoDB Atlas)**

- Managed MongoDB service
- Automatic backups
- Global clusters
- Built-in security

---

## 🤝 **Contributing**

### **Development Workflow**

1. Fork the repository
2. Create feature branch (`git checkout -b feature/amazing-feature`)
3. Make changes with tests
4. Commit changes (`git commit -m 'Add amazing feature'`)
5. Push to branch (`git push origin feature/amazing-feature`)
6. Open Pull Request

### **Code Guidelines**

- Follow ESLint and Prettier configurations
- Write meaningful commit messages
- Include tests for new features
- Update documentation for API changes
- Maintain backward compatibility

---

## 📄 **License**

MIT License - see [LICENSE](LICENSE) file for details.

---

## 📞 **Support**

### **Getting Help**

- 📚 **Setup Guide**: Visit `/localsetup-guide` in the application
- 🔍 **Troubleshooting**: Check the Local Setup Guide for common issues
- 📧 **Email**: technical-support@harekrishnamedical.com
- 🐛 **Bug Reports**: Create GitHub issues with detailed descriptions

### **Common Issues & Solutions**

#### **Database Connection Issues**

```bash
# Check MongoDB service
sudo systemctl status mongod  # Linux
brew services list | grep mongodb  # macOS

# Test connection
mongosh "mongodb://localhost:27017/hare_krishna_medical"
```

#### **Port Conflicts**

```bash
# Find process using port
lsof -i :5000  # Backend port
lsof -i :5173  # Frontend port

# Kill process if needed
kill -9 <PID>
```

#### **Environment Variables**

```bash
# Verify environment variables are loaded
cd backend && node -e "console.log(process.env.MONGODB_URI)"
```

---

<div align="center">

**🕉️ Built with Love for the Healthcare Community 🏥**

**Made by Hare Krishna Medical Team | © 2024**

[![GitHub stars](https://img.shields.io/github/stars/your-username/hare-krishna-medical-store?style=social)](https://github.com/your-username/hare-krishna-medical-store)
[![GitHub forks](https://img.shields.io/github/forks/your-username/hare-krishna-medical-store?style=social)](https://github.com/your-username/hare-krishna-medical-store)

**Visit the application: [Local Setup Guide](http://localhost:5173/localsetup-guide)**

</div>
