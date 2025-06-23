# 🕉️ Hare Krishna Medical Store

<div align="center">

![Hare Krishna Medical](https://cdn.builder.io/api/v1/assets/ec4b3f82f1ac4275b8bfc1756fcac420/medical_logo-e586be?format=webp&width=200)

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

---

## ✨ **Features**

### 👥 **User Management**

- **Customer Registration & Authentication**

  - Secure JWT-based authentication
  - Email verification system
  - Password reset functionality
  - Profile management with avatar upload
  - Order history and tracking

- **Admin Dashboard**
  - User management and analytics
  - Role-based access control
  - Real-time user activity monitoring
  - Advanced reporting features

### 🛒 **E-Commerce Features**

- **Product Catalog**

  - Advanced product search and filtering
  - Category-based organization
  - Product image galleries with zoom
  - Stock level indicators
  - Price comparison and discounts

- **Shopping Cart & Checkout**
  - Persistent cart across sessions
  - Multiple payment options (COD, Online)
  - Real-time shipping calculation
  - Order confirmation and tracking

### 📦 **Inventory Management**

- **Product Management**

  - CRUD operations for products
  - Bulk import/export functionality
  - Category and brand management
  - Stock alerts and notifications
  - Expiry date tracking

- **Order Processing**
  - Order status tracking
  - Automated notifications
  - Invoice generation with QR codes
  - Return and refund management

### 📊 **Analytics & Reporting**

- **Business Intelligence**

  - Sales analytics and trends
  - Inventory reports
  - Customer behavior analysis
  - Revenue tracking and forecasting

- **Real-Time Dashboard**
  - Live order notifications
  - Stock level monitoring
  - Performance metrics
  - Quick action buttons

### 🔔 **Communication System**

- **Customer Support**
  - Contact form integration
  - Email notifications
  - SMS alerts (Twilio integration)
  - Real-time messaging system

### 🏥 **Medical-Specific Features**

- **Prescription Management**

  - Upload and verify prescriptions
  - Medicine interaction warnings
  - Dosage recommendations
  - Consultation reminders

- **Compliance & Safety**
  - Drug information database
  - Expiry date management
  - Regulatory compliance tools
  - Safety alerts and warnings

---

## 🛠️ **Tech Stack**

### **Frontend**

- **React 18.3.1** - Modern UI library
- **React Router 7** - Client-side routing
- **Redux Toolkit** - State management
- **React Bootstrap** - UI components
- **Vite** - Build tool and dev server
- **TypeScript Support** - Type safety

### **Backend**

- **Node.js 18+** - Runtime environment
- **Express.js 4.18.2** - Web framework
- **MongoDB 6.0+** - Database
- **Mongoose** - ODM for MongoDB
- **Socket.io** - Real-time communication

### **Security & Authentication**

- **JWT** - Secure authentication
- **bcryptjs** - Password hashing
- **Helmet** - Security headers
- **express-rate-limit** - API rate limiting
- **express-mongo-sanitize** - NoSQL injection protection

### **External Services**

- **Cloudinary** - Image storage and optimization
- **Twilio** - SMS notifications
- **Nodemailer** - Email services
- **Razorpay** - Payment processing

### **Development & Testing**

- **Vitest** - Testing framework
- **ESLint** - Code linting
- **Prettier** - Code formatting
- **Nodemon** - Development server

---

## 🔧 **Prerequisites**

Before setting up the project, ensure you have the following installed:

### **Required Software**

```bash
Node.js (v18.0.0 or higher)
npm (v8.0.0 or higher)
MongoDB (v6.0 or higher) OR MongoDB Atlas account
Git (latest version)
```

### **System Requirements**

- **Memory**: 4GB RAM (8GB recommended)
- **Storage**: 2GB available space (5GB recommended)
- **OS**: Windows 10+, macOS 10.15+, or Linux Ubuntu 18.04+

### **Optional Tools**

- **MongoDB Compass** - Visual database management
- **Postman** - API testing
- **VS Code** - Recommended code editor

---

## ⚡ **Quick Start**

Get up and running in minutes with our automated setup:

### **1. Clone the Repository**

```bash
git clone https://github.com/your-username/hare-krishna-medical-store.git
cd hare-krishna-medical-store
```

### **2. Run Automated Setup**

```bash
# Run the quick setup script
./quick-setup.sh

# Or manually:
npm install
cd backend && npm install && cd ..
```

### **3. Configure Environment**

```bash
# Backend configuration
cp backend/.env.example backend/.env
# Edit backend/.env with your settings

# Frontend configuration
cp .env.example .env
# Edit .env with your settings
```

### **4. Start Development Servers**

```bash
# Terminal 1: Backend
cd backend && npm run dev

# Terminal 2: Frontend
npm run dev
```

### **5. Access Application**

- **Frontend**: http://localhost:5173
- **Backend**: http://localhost:5000
- **Setup Guide**: http://localhost:5173/localsetup-guide

---

## 📖 **Detailed Setup**

For comprehensive setup instructions with troubleshooting, visit the **[Local Setup Guide](http://localhost:5173/localsetup-guide)** in the application or follow these detailed steps:

### **Environment Configuration**

#### **Backend Environment (`backend/.env`)**

```env
# Server Configuration
PORT=5000
NODE_ENV=development

# Database (Choose one)
MONGODB_URI=mongodb://localhost:27017/hare_krishna_medical
# MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/hare_krishna_medical

# Security (Generate with: node -e "console.log(require('crypto').randomBytes(64).toString('hex'))")
JWT_SECRET=your_64_character_secret_here
JWT_EXPIRES_IN=7d
BCRYPT_SALT_ROUNDS=12

# CORS
FRONTEND_URL=http://localhost:5173

# Email (Gmail)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password

# File Storage
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# SMS
TWILIO_ACCOUNT_SID=your_twilio_sid
TWILIO_AUTH_TOKEN=your_twilio_token
TWILIO_PHONE_NUMBER=your_twilio_number

# Payment
RAZORPAY_KEY_ID=your_razorpay_key
RAZORPAY_KEY_SECRET=your_razorpay_secret
```

#### **Frontend Environment (`.env`)**

```env
# API Configuration
VITE_BACKEND_URL=http://localhost:5000
VITE_SOCKET_URL=http://localhost:5000

# App Configuration
VITE_APP_NAME=Hare Krishna Medical Store
VITE_VERSION=1.0.0
VITE_DEBUG=true

# Security
VITE_SESSION_TIMEOUT=3600000
VITE_MAX_FILE_SIZE=5242880
```

### **Database Setup**

#### **Using Local MongoDB**

```bash
# Start MongoDB service
sudo systemctl start mongod  # Linux
brew services start mongodb/brew/mongodb-community  # macOS
net start MongoDB  # Windows

# Seed database
cd backend && npm run seed
```

#### **Using MongoDB Atlas**

1. Create account at [MongoDB Atlas](https://www.mongodb.com/atlas)
2. Create cluster and database user
3. Get connection string
4. Update `MONGODB_URI` in `backend/.env`

---

## 🔐 **Security Features**

Our application implements enterprise-level security measures:

### **Authentication & Authorization**

- ✅ **JWT-based authentication** with secure, randomly generated secrets
- ✅ **Password hashing** using bcrypt with 12 salt rounds
- ✅ **Role-based access control** (Admin/User roles)
- ✅ **Session management** with configurable timeouts
- ✅ **Password reset** functionality with email verification

### **Data Protection**

- ✅ **Input validation** using express-validator
- ✅ **MongoDB injection protection** with express-mongo-sanitize
- ✅ **XSS protection** through input sanitization
- ✅ **CORS configuration** with environment-based origins
- ✅ **Rate limiting** with tiered protection:
  - Authentication: 5 requests/15 minutes
  - File uploads: 10 requests/15 minutes
  - General API: 100 requests/15 minutes

### **Infrastructure Security**

- ✅ **Security headers** with Helmet.js and CSP
- ✅ **File upload validation** with type and size restrictions
- ✅ **Environment variable protection** (no .env in version control)
- ✅ **Error handling** that doesn't expose sensitive information
- ✅ **Dependency scanning** with automated vulnerability checks

### **Monitoring & Logging**

- ✅ **Suspicious activity detection** and logging
- ✅ **Failed authentication tracking**
- ✅ **Security event monitoring**
- ✅ **Production-safe logging** (no sensitive data in logs)

---

## 📱 **Usage Guide**

### **For Customers**

#### **Getting Started**

1. **Registration**: Create account with email verification
2. **Browse Products**: Search and filter medical products
3. **Shopping Cart**: Add items and manage quantities
4. **Checkout**: Complete orders with multiple payment options
5. **Track Orders**: Monitor order status and delivery

#### **Account Features**

- **Profile Management**: Update personal information and preferences
- **Order History**: View past purchases and reorder
- **Invoice Access**: Download and verify invoices with QR codes
- **Notifications**: Receive order updates via email/SMS

### **For Administrators**

#### **Dashboard Overview**

- **Analytics**: Sales trends, inventory levels, customer metrics
- **Quick Actions**: Process orders, update stock, respond to messages
- **Real-time Monitoring**: Live order notifications and alerts

#### **Management Features**

- **Product Management**: Add, edit, and organize inventory
- **Order Processing**: Update status, generate invoices, handle returns
- **User Management**: View customer data, manage accounts
- **Content Management**: Update website content and settings

---

## 🔗 **API Documentation**

### **Authentication Endpoints**

#### **POST** `/api/auth/register`

Register a new user account.

```json
{
  "fullName": "John Doe",
  "email": "john@example.com",
  "mobile": "9876543210",
  "password": "securePassword123",
  "address": {
    "street": "123 Main St",
    "city": "Mumbai",
    "state": "Maharashtra",
    "pincode": "400001"
  }
}
```

#### **POST** `/api/auth/login`

Authenticate user and receive JWT token.

```json
{
  "email": "john@example.com",
  "password": "securePassword123"
}
```

### **Product Endpoints**

#### **GET** `/api/products`

Retrieve products with pagination and filtering.

**Query Parameters:**

- `page` - Page number (default: 1)
- `limit` - Items per page (default: 10)
- `search` - Search term
- `category` - Filter by category
- `brand` - Filter by brand
- `minPrice` - Minimum price filter
- `maxPrice` - Maximum price filter

#### **POST** `/api/products` (Admin Only)

Create a new product.

```json
{
  "name": "Paracetamol 500mg",
  "description": "Pain relief medication",
  "price": 25.5,
  "mrp": 30.0,
  "category": "Medicine",
  "brand": "HealthCare Ltd",
  "stock": 100,
  "images": ["image1.jpg", "image2.jpg"],
  "specifications": {
    "dosage": "500mg",
    "form": "Tablet",
    "pack_size": "10 tablets"
  }
}
```

### **Order Endpoints**

#### **POST** `/api/orders`

Create a new order.

```json
{
  "items": [
    {
      "product": "product_id",
      "quantity": 2,
      "price": 25.5
    }
  ],
  "shippingAddress": {
    "fullName": "John Doe",
    "mobile": "9876543210",
    "email": "john@example.com",
    "address": "123 Main St",
    "city": "Mumbai",
    "state": "Maharashtra",
    "pincode": "400001"
  },
  "paymentMethod": "COD"
}
```

#### **GET** `/api/orders/user/:userId`

Get orders for a specific user.

#### **PUT** `/api/orders/:orderId/status` (Admin Only)

Update order status.

```json
{
  "status": "shipped",
  "trackingNumber": "TRK123456789"
}
```

### **Error Responses**

All API endpoints return consistent error responses:

```json
{
  "success": false,
  "message": "Error description",
  "error": "Detailed error information (development only)"
}
```

### **Authentication**

Include JWT token in request headers:

```
Authorization: Bearer your_jwt_token_here
```

---

## 📁 **Project Structure**

```
hare-krishna-medical-store/
├── 📁 backend/                     # Backend API server
│   ├── 📁 config/                  # Database configuration
│   ├── 📁 middleware/              # Custom middleware
│   │   ├── auth.js                 # Authentication middleware
│   │   ├── security.js             # Security middleware
│   │   └── validate.js             # Input validation
│   ├── 📁 models/                  # MongoDB schemas
│   │   ├── User.js                 # User model
│   │   ├── Product.js              # Product model
│   │   ├── Order.js                # Order model
│   │   └── Invoice.js              # Invoice model
│   ├── 📁 routes/                  # API routes
│   │   ├── auth.js                 # Authentication routes
│   │   ├── products.js             # Product management
│   │   ├── orders.js               # Order processing
│   │   ├── users.js                # User management
│   │   ├── analytics.js            # Analytics endpoints
│   │   └── upload.js               # File upload handling
│   ├── 📁 scripts/                 # Utility scripts
│   │   └── seed.js                 # Database seeding
│   ├── 📁 utils/                   # Utility functions
│   │   ├── emailService.js         # Email notifications
│   │   └── smsService.js           # SMS notifications
│   ├── .env.example                # Environment template
│   ├── package.json                # Backend dependencies
│   └── server.js                   # Main server file
├── 📁 src/                         # Frontend application
│   ├── 📁 components/              # React components
│   │   ├── 📁 common/              # Shared components
│   │   │   ├── LoadingSpinner.jsx  # Loading indicator
│   │   │   ├── ErrorBoundary.jsx   # Error handling
│   │   │   └── NotificationSystem.jsx # Real-time notifications
│   │   ├── 📁 layout/              # Layout components
│   │   │   ├── Header.jsx          # Navigation header
│   │   │   └── Footer.jsx          # Site footer
│   │   └── 📁 products/            # Product components
│   │       ├── ProductCard.jsx     # Product display
│   │       └── ProductFilters.jsx  # Search filters
│   ├── 📁 pages/                   # Page components
│   │   ├── 📁 admin/               # Admin pages
│   │   ├── 📁 user/                # User pages
│   │   ├── Home.jsx                # Landing page
│   │   ├── Products.jsx            # Product catalog
│   │   ├── Cart.jsx                # Shopping cart
│   │   ├── Login.jsx               # User authentication
│   │   └── LocalSetupGuide.jsx     # Setup documentation
│   ├── 📁 store/                   # Redux store
│   │   ├── 📁 slices/              # Redux slices
│   │   └── store.js                # Store configuration
│   ├── 📁 utils/                   # Frontend utilities
│   │   ├── apiClient.js            # API communication
│   │   ├── sessionManager.js       # Session handling
│   │   └── socketClient.js         # Real-time communication
│   ├── App.jsx                     # Main application
│   ├── App.css                     # Global styles
│   └── main.jsx                    # Application entry
├── 📁 public/                      # Static assets
├── .env.example                    # Frontend environment template
├── .gitignore                      # Git ignore rules
├── package.json                    # Frontend dependencies
├── vite.config.js                  # Vite configuration
├── quick-setup.sh                  # Automated setup script
├── SECURITY_AUDIT_REPORT.md        # Security documentation
└── README.md                       # This file
```

---

## 🎨 **UI/UX Features**

### **Design System**

- **Medical Theme**: Professional color scheme with medical industry standards
- **Responsive Design**: Mobile-first approach with Bootstrap components
- **Accessibility**: ARIA labels, keyboard navigation, screen reader support
- **Modern Aesthetics**: Clean, intuitive interface with subtle animations

### **Color Palette**

- **Primary Red**: `#E63946` - Medical emergency, important actions
- **Medical Blue**: `#2B4C7E` - Trust, professionalism, secondary actions
- **Success Green**: `#28A745` - Positive actions, success states
- **Warning Orange**: `#FFC107` - Caution, pending states
- **Neutral Gray**: `#6C757D` - Text, borders, subtle elements

### **Typography**

- **Primary Font**: Poppins - Modern, professional headings
- **Secondary Font**: Inter - Clean, readable body text
- **Medical Icons**: Bootstrap Icons - Consistent iconography

### **Interactive Elements**

- **Hover Effects**: Smooth transitions and micro-interactions
- **Loading States**: Professional spinners and skeleton screens
- **Form Validation**: Real-time feedback with clear error messages
- **Notifications**: Toast messages and real-time alerts

---

## ⚙️ **Configuration**

### **Environment Variables**

#### **Backend Configuration**

| Variable         | Description           | Required | Default               |
| ---------------- | --------------------- | -------- | --------------------- |
| `PORT`           | Server port           | No       | 5000                  |
| `NODE_ENV`       | Environment mode      | No       | development           |
| `MONGODB_URI`    | Database connection   | Yes      | -                     |
| `JWT_SECRET`     | JWT signing secret    | Yes      | -                     |
| `JWT_EXPIRES_IN` | Token expiry time     | No       | 7d                    |
| `FRONTEND_URL`   | Frontend URL for CORS | No       | http://localhost:5173 |
| `EMAIL_HOST`     | SMTP server           | No       | -                     |
| `EMAIL_USER`     | Email username        | No       | -                     |
| `EMAIL_PASS`     | Email password        | No       | -                     |

#### **Frontend Configuration**

| Variable               | Description          | Required | Default                    |
| ---------------------- | -------------------- | -------- | -------------------------- |
| `VITE_BACKEND_URL`     | Backend API URL      | Yes      | http://localhost:5000      |
| `VITE_APP_NAME`        | Application name     | No       | Hare Krishna Medical Store |
| `VITE_DEBUG`           | Debug mode           | No       | false                      |
| `VITE_SESSION_TIMEOUT` | Session timeout (ms) | No       | 3600000                    |

### **Development Scripts**

#### **Frontend Scripts**

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run preview      # Preview production build
npm run test         # Run tests
npm run lint         # Lint code
```

#### **Backend Scripts**

```bash
npm run dev          # Start with nodemon
npm run start        # Start production server
npm run seed         # Seed database
npm run test         # Run tests
```

---

## 🧪 **Testing**

### **Test Structure**

```
tests/
├── 📁 unit/                        # Unit tests
├── 📁 integration/                 # Integration tests
├── 📁 api/                         # API endpoint tests
└── 📁 e2e/                         # End-to-end tests
```

### **Running Tests**

#### **Frontend Tests**

```bash
# Run all tests
npm test

# Run with coverage
npm run test:coverage

# Run specific test file
npm test LoginForm.test.jsx

# Run tests in watch mode
npm run test:watch
```

#### **Backend Tests**

```bash
# Run all tests
cd backend && npm test

# Run with coverage
npm run test:coverage

# Run specific test suite
npm test auth.test.js

# Run integration tests
npm run test:integration
```

### **Test Categories**

#### **Unit Tests**

- Component rendering and props
- Utility function behavior
- Redux actions and reducers
- Individual API endpoints

#### **Integration Tests**

- User authentication flow
- Order processing workflow
- Payment integration
- Email/SMS notifications

#### **End-to-End Tests**

- Complete user journeys
- Admin dashboard workflows
- Cross-browser compatibility
- Mobile responsiveness

---

## 🚀 **Deployment**

### **Production Checklist**

#### **Security**

- [ ] Environment variables configured (no .env files)
- [ ] Strong JWT secret (64+ characters)
- [ ] Database authentication enabled
- [ ] HTTPS/SSL certificates configured
- [ ] CORS origins restricted to production domains
- [ ] Rate limiting enabled
- [ ] Input validation active
- [ ] Error handling doesn't expose sensitive info

#### **Performance**

- [ ] Database indexes optimized
- [ ] Image optimization enabled
- [ ] Caching strategies implemented
- [ ] CDN configured for static assets
- [ ] Bundle size optimized
- [ ] Lazy loading implemented

#### **Monitoring**

- [ ] Error tracking setup (Sentry, etc.)
- [ ] Performance monitoring
- [ ] Uptime monitoring
- [ ] Database backup scheduled
- [ ] Log aggregation configured

### **Deployment Options**

#### **Frontend Deployment**

- **Vercel** (Recommended)
- **Netlify**
- **AWS S3 + CloudFront**
- **DigitalOcean App Platform**

#### **Backend Deployment**

- **Railway** (Recommended)
- **Heroku**
- **DigitalOcean Droplets**
- **AWS EC2**
- **Google Cloud Platform**

#### **Database Hosting**

- **MongoDB Atlas** (Recommended)
- **DigitalOcean Managed MongoDB**
- **AWS DocumentDB**

### **Environment Setup**

#### **Production Environment Variables**

```bash
# Server
NODE_ENV=production
PORT=5000

# Database
MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/hare_krishna_medical

# Security
JWT_SECRET=your_production_jwt_secret_64_chars_minimum
BCRYPT_SALT_ROUNDS=12

# CORS
FRONTEND_URL=https://your-domain.com

# Email
EMAIL_HOST=smtp.gmail.com
EMAIL_USER=noreply@your-domain.com
EMAIL_PASS=your_production_email_password
```

### **Deployment Commands**

#### **Build Production**

```bash
# Frontend
npm run build

# Backend
npm run build  # If applicable
```

#### **Start Production**

```bash
# Frontend (served via CDN)
# Backend
npm start
```

---

## 🤝 **Contributing**

We welcome contributions to make Hare Krishna Medical Store even better!

### **Getting Started**

1. **Fork the repository**
2. **Create a feature branch**
   ```bash
   git checkout -b feature/amazing-feature
   ```
3. **Make your changes**
4. **Run tests**
   ```bash
   npm test
   cd backend && npm test
   ```
5. **Commit your changes**
   ```bash
   git commit -m 'Add amazing feature'
   ```
6. **Push to the branch**
   ```bash
   git push origin feature/amazing-feature
   ```
7. **Open a Pull Request**

### **Development Guidelines**

#### **Code Style**

- Use ESLint and Prettier configurations
- Follow React best practices
- Write meaningful commit messages
- Add comments for complex logic

#### **Testing**

- Write tests for new features
- Maintain test coverage above 80%
- Test both happy path and edge cases
- Include integration tests for new endpoints

#### **Documentation**

- Update README for new features
- Document API changes
- Include code comments
- Update setup instructions if needed

### **Contribution Types**

- 🐛 **Bug Fixes**: Fix existing issues
- ✨ **New Features**: Add functionality
- 📝 **Documentation**: Improve docs
- 🎨 **UI/UX**: Design improvements
- ⚡ **Performance**: Optimization
- 🔒 **Security**: Security enhancements
- 🧪 **Testing**: Test improvements

---

## 📄 **License**

This project is licensed under the **MIT License** - see the [LICENSE](LICENSE) file for details.

```
MIT License

Copyright (c) 2024 Hare Krishna Medical Store

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
```

---

## 📞 **Support**

### **Documentation**

- 📚 **Setup Guide**: Visit `/localsetup-guide` in the application
- 🔒 **Security Report**: See `SECURITY_AUDIT_REPORT.md`
- 🛠️ **API Docs**: Available in the application at `/backend-docs`

### **Community Support**

- 💬 **GitHub Issues**: Report bugs and request features
- 📧 **Email**: technical-support@harekrishnamedical.com
- 📱 **Support Hours**: Monday-Friday, 9 AM - 6 PM IST

### **Getting Help**

#### **Common Issues**

1. **Installation Problems**: Check prerequisites and setup guide
2. **Database Connection**: Verify MongoDB service and connection string
3. **Environment Configuration**: Ensure all required variables are set
4. **Port Conflicts**: Use different ports or kill existing processes

#### **Troubleshooting Steps**

1. Check the **[Local Setup Guide](http://localhost:5173/localsetup-guide)**
2. Review error logs in browser console and terminal
3. Verify environment variables are correctly set
4. Ensure all dependencies are installed
5. Check MongoDB connection and authentication

#### **Performance Issues**

- Monitor database query performance
- Check for memory leaks in browser dev tools
- Optimize image sizes and formats
- Review network requests in dev tools

---

<div align="center">

**Built with ❤️ for the Healthcare Community**

Made by [Your Team] | © 2024 Hare Krishna Medical Store

[![GitHub stars](https://img.shields.io/github/stars/your-username/hare-krishna-medical-store?style=social)](https://github.com/your-username/hare-krishna-medical-store)
[![GitHub forks](https://img.shields.io/github/forks/your-username/hare-krishna-medical-store?style=social)](https://github.com/your-username/hare-krishna-medical-store)

</div>
