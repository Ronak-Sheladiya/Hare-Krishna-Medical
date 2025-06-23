# 🚀 Hare Krishna Medical Store - Complete Local Setup Guide

This comprehensive guide will help you set up the entire application locally with MongoDB database integration, backend API server, and frontend development environment.

## 📋 Prerequisites

Before starting, ensure you have the following installed on your system:

- **Node.js** (v18.0.0 or higher) - [Download here](https://nodejs.org/)
- **MongoDB** (v6.0 or higher) - [Download here](https://www.mongodb.com/try/download/community)
- **Git** - [Download here](https://git-scm.com/downloads)
- **Code Editor** - VS Code recommended

### Verify Installation

```bash
node --version    # Should show v18.0.0+
npm --version     # Should show 8.0.0+
mongod --version  # Should show MongoDB version
git --version     # Should show Git version
```

## 🗄️ MongoDB Database Setup

### Method 1: Local MongoDB Installation

#### Windows:

1. Download MongoDB Community Server from [official website](https://www.mongodb.com/try/download/community)
2. Run the installer and follow setup wizard
3. MongoDB will be installed to `C:\Program Files\MongoDB\Server\{version}\bin\`
4. Add MongoDB to your PATH environment variable
5. Create data directory: `mkdir C:\data\db`

#### macOS:

```bash
# Using Homebrew (recommended)
brew tap mongodb/brew
brew install mongodb-community

# Or download from official website
```

#### Ubuntu/Linux:

```bash
# Import MongoDB public GPG key
curl -fsSL https://www.mongodb.org/static/pgp/server-6.0.asc | sudo gpg -o /usr/share/keyrings/mongodb-server-6.0.gpg --dearmor

# Add MongoDB repository
echo "deb [ arch=amd64,arm64 signed-by=/usr/share/keyrings/mongodb-server-6.0.gpg ] https://repo.mongodb.org/apt/ubuntu jammy/mongodb-org/6.0 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-6.0.list

# Update package list and install
sudo apt-get update
sudo apt-get install -y mongodb-org
```

### Method 2: MongoDB Atlas (Cloud Database)

1. Go to [MongoDB Atlas](https://www.mongodb.com/atlas)
2. Create a free account and cluster
3. Configure network access (add your IP address)
4. Create database user with credentials
5. Get connection string for later use

### Starting MongoDB Service

#### Windows:

```bash
# Start MongoDB service
net start MongoDB

# Or manually start mongod
mongod --dbpath="C:\data\db"
```

#### macOS:

```bash
# Start as service
brew services start mongodb/brew/mongodb-community

# Or manually start
mongod --config /usr/local/etc/mongod.conf
```

#### Linux:

```bash
# Start and enable MongoDB service
sudo systemctl start mongod
sudo systemctl enable mongod

# Check status
sudo systemctl status mongod
```

### Verify MongoDB Connection

```bash
# Connect to MongoDB shell
mongosh

# Should connect and show MongoDB version
# Type 'exit' to close
```

## 🔧 Project Setup

### 1. Clone the Repository

```bash
git clone <your-repository-url>
cd hare-krishna-medical-store
```

### 2. Backend Setup

#### Navigate to Backend Directory

```bash
cd backend
```

#### Install Dependencies

```bash
npm install
```

#### Environment Configuration

Create `.env` file in the `backend` directory:

```env
# Server Configuration
PORT=5000
NODE_ENV=development

# MongoDB Configuration (Choose one)
# For Local MongoDB:
MONGODB_URI=mongodb://localhost:27017/hare_krishna_medical

# For MongoDB Atlas:
# MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/hare_krishna_medical?retryWrites=true&w=majority

# JWT Configuration
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production
JWT_EXPIRES_IN=7d

# Email Configuration (Optional - for email features)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password

# SMS Configuration (Optional - for SMS features)
SMS_API_KEY=your_sms_api_key
SMS_SENDER_ID=HKMED

# File Upload Configuration
UPLOAD_PATH=uploads
MAX_FILE_SIZE=5242880

# CORS Configuration
FRONTEND_URL=http://localhost:5173

# Security Configuration
BCRYPT_SALT_ROUNDS=12
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
```

#### Database Initialization

```bash
# Create database and initial data (optional)
npm run seed

# This will create:
# - Admin user (admin@harekrishna.com / admin123)
# - Sample products
# - Sample categories
# - Initial configuration
```

#### Start Backend Server

```bash
# Development mode with auto-restart
npm run dev

# Or production mode
npm start
```

The backend server will start on `http://localhost:5000`

### 3. Frontend Setup

#### Open New Terminal and Navigate to Root Directory

```bash
cd ..  # Go back to project root
```

#### Install Dependencies

```bash
npm install
```

#### Environment Configuration

Create `.env` file in the root directory:

```env
# Backend API Configuration
VITE_BACKEND_URL=http://localhost:5000

# Application Configuration
VITE_APP_NAME=Hare Krishna Medical Store
VITE_VERSION=1.0.0

# Development Configuration
VITE_DEBUG=true

# Socket.io Configuration (for real-time features)
VITE_SOCKET_URL=http://localhost:5000

# Payment Gateway Configuration (if applicable)
VITE_RAZORPAY_KEY_ID=your_razorpay_key_id
VITE_STRIPE_PUBLIC_KEY=your_stripe_public_key

# Analytics Configuration (optional)
VITE_GOOGLE_ANALYTICS_ID=your_ga_id
```

#### Start Frontend Development Server

```bash
npm run dev
```

The frontend will start on `http://localhost:5173`

## 🗃️ Database Schema & Collections

The application uses the following MongoDB collections:

### Users Collection

```javascript
{
  _id: ObjectId,
  name: String,
  email: String,
  password: String (hashed),
  role: Number, // 0 = User, 1 = Admin
  phone: String,
  address: Object,
  isActive: Boolean,
  createdAt: Date,
  updatedAt: Date
}
```

### Products Collection

```javascript
{
  _id: ObjectId,
  name: String,
  description: String,
  company: String,
  category: String,
  price: Number,
  discountPrice: Number,
  stock: Number,
  images: [String],
  isActive: Boolean,
  isFeatured: Boolean,
  createdAt: Date,
  updatedAt: Date
}
```

### Orders Collection

```javascript
{
  _id: ObjectId,
  orderId: String,
  userId: ObjectId,
  items: [Object],
  totalAmount: Number,
  status: String,
  paymentMethod: String,
  paymentStatus: String,
  shippingAddress: Object,
  trackingNumber: String,
  createdAt: Date,
  updatedAt: Date
}
```

### Invoices Collection

```javascript
{
  _id: ObjectId,
  invoiceId: String,
  orderId: ObjectId,
  userId: ObjectId,
  items: [Object],
  totalAmount: Number,
  status: String,
  createdAt: Date,
  updatedAt: Date
}
```

### Messages Collection

```javascript
{
  _id: ObjectId,
  name: String,
  email: String,
  subject: String,
  message: String,
  status: String,
  priority: String,
  reply: String,
  createdAt: Date,
  updatedAt: Date
}
```

## 🔄 Database Operations

### Connect to MongoDB Shell

```bash
mongosh hare_krishna_medical
```

### Useful MongoDB Commands

```javascript
// Show all collections
show collections

// View users
db.users.find().pretty()

// View products
db.products.find().pretty()

// View orders
db.orders.find().pretty()

// Create indexes for better performance
db.users.createIndex({ email: 1 }, { unique: true })
db.products.createIndex({ name: "text", description: "text" })
db.orders.createIndex({ userId: 1, createdAt: -1 })

// Drop a collection (be careful!)
db.collection_name.drop()

// Clear all data from a collection
db.collection_name.deleteMany({})
```

## 🚀 Starting the Complete Application

### 1. Start MongoDB

```bash
# Make sure MongoDB is running
mongod --dbpath="your/data/path"  # Windows/Linux
# or
brew services start mongodb/brew/mongodb-community  # macOS
```

### 2. Start Backend Server

```bash
cd backend
npm run dev
# Backend running on http://localhost:5000
```

### 3. Start Frontend Server

```bash
# In a new terminal, from project root
npm run dev
# Frontend running on http://localhost:5173
```

### 4. Access the Application

- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:5000
- **API Documentation**: http://localhost:5000/api/docs (if available)

## 👤 Default Login Credentials

After running the seed script, you can use these credentials:

### Admin Login

- **Email**: admin@harekrishna.com
- **Password**: admin123

### Test User Login

- **Email**: user@harekrishna.com
- **Password**: user123

## 🧪 Testing the Setup

### 1. Test Database Connection

```bash
# In backend directory
node -e "require('./config/database.js')"
```

### 2. Test API Endpoints

```bash
# Test backend is running
curl http://localhost:5000/api/health

# Test user registration
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Test User","email":"test@example.com","password":"password123"}'
```

### 3. Test Frontend-Backend Connection

1. Open http://localhost:5173
2. Go to Products page - should load products from database
3. Try user registration/login
4. Check browser dev tools for any errors

## 🛠️ Development Tools & Scripts

### Backend Scripts

```bash
npm run dev          # Start development server with nodemon
npm run start        # Start production server
npm run seed         # Populate database with sample data
npm run test         # Run tests
npm run lint         # Check code quality
```

### Frontend Scripts

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run preview      # Preview production build
npm run lint         # Check code quality
npm run typecheck    # TypeScript type checking
```

## 🔧 Troubleshooting

### Common Issues & Solutions

#### MongoDB Connection Issues

```bash
# Error: MongoNetworkError
# Solution: Check if MongoDB is running
sudo systemctl status mongod  # Linux
brew services list | grep mongo  # macOS

# Error: Authentication failed
# Solution: Check MongoDB URI and credentials in .env
```

#### Port Already in Use

```bash
# Backend port 5000 in use
lsof -ti:5000 | xargs kill -9  # Kill process on port 5000

# Frontend port 5173 in use
lsof -ti:5173 | xargs kill -9  # Kill process on port 5173
```

#### Package Installation Issues

```bash
# Clear npm cache
npm cache clean --force

# Delete node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
```

#### Environment Variables Not Loading

- Ensure `.env` files are in correct directories
- Restart servers after changing `.env` files
- Check for typos in variable names
- Ensure no spaces around `=` in `.env` files

### Development Tips

1. **Use MongoDB Compass** for visual database management
2. **Install Postman** for API testing
3. **Use Browser DevTools** for frontend debugging
4. **Check server logs** for backend issues
5. **Enable debug mode** with `VITE_DEBUG=true`

## 📚 Additional Resources

- [MongoDB Documentation](https://docs.mongodb.com/)
- [Node.js Best Practices](https://github.com/goldbergyoni/nodebestpractices)
- [React Documentation](https://react.dev/)
- [Vite Documentation](https://vitejs.dev/)
- [Express.js Documentation](https://expressjs.com/)

## 🤝 Support

If you encounter any issues:

1. Check this guide thoroughly
2. Verify all prerequisites are installed
3. Ensure environment variables are correctly set
4. Check server logs for error messages
5. Test each component separately (Database → Backend → Frontend)

For additional help, please refer to the project documentation or contact the development team.

---

**Happy Coding! 🎉**

_This guide covers a complete local setup. For production deployment, additional security and configuration steps would be required._
