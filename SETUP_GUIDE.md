# Hare Krishna Medical Store - Complete Setup Guide

This guide will help you set up and run the Hare Krishna Medical Store website on your local system.

## 📋 Prerequisites

Before you begin, ensure you have the following installed on your system:

- **Node.js** (version 16.0.0 or higher)
- **npm** or **yarn** package manager
- **MongoDB** (for the database)
- **Git** (for version control)

### Download Links:

- [Node.js](https://nodejs.org/) - Download the LTS version
- [MongoDB Community Server](https://www.mongodb.com/try/download/community)
- [Git](https://git-scm.com/downloads)

## 🚀 Quick Start

### 1. Clone the Repository

```bash
git clone <your-repository-url>
cd hare-krishna-medical-store
```

### 2. Environment Setup

#### Frontend Environment

Create a `.env` file in the root directory:

```env
VITE_BACKEND_URL=http://localhost:5000
VITE_APP_NAME=Hare Krishna Medical Store
VITE_VERSION=1.0.0
```

#### Backend Environment

Create a `.env` file in the `backend` directory:

```env
# Database
MONGODB_URI=mongodb://localhost:27017/hare-krishna-medical

# Server
PORT=5000
NODE_ENV=development
FRONTEND_URL=http://localhost:3000

# JWT
JWT_SECRET=your-super-secret-jwt-key-here
JWT_EXPIRE=30d

# Email Configuration (Optional - for email features)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password

# SMS Configuration (Optional - for SMS features)
TWILIO_ACCOUNT_SID=your-twilio-sid
TWILIO_AUTH_TOKEN=your-twilio-token
TWILIO_PHONE_NUMBER=your-twilio-phone

# Payment Gateway (Optional - for online payments)
RAZORPAY_KEY_ID=your-razorpay-key
RAZORPAY_KEY_SECRET=your-razorpay-secret

# File Upload (Optional - for cloud storage)
CLOUDINARY_CLOUD_NAME=your-cloudinary-name
CLOUDINARY_API_KEY=your-cloudinary-key
CLOUDINARY_API_SECRET=your-cloudinary-secret
```

### 3. Install Dependencies

#### Install Frontend Dependencies

```bash
npm install
```

#### Install Backend Dependencies

```bash
cd backend
npm install
cd ..
```

### 4. Database Setup

#### Start MongoDB

- **Windows**: MongoDB should start automatically after installation
- **macOS**: `brew services start mongodb/brew/mongodb-community`
- **Linux**: `sudo systemctl start mongod`

#### Initialize Database (Optional)

Run the seed script to populate initial data:

```bash
cd backend
npm run seed
```

### 5. Start the Application

#### Method 1: Start Both Frontend and Backend Separately

**Terminal 1 - Backend:**

```bash
cd backend
npm run dev
```

**Terminal 2 - Frontend:**

```bash
npm run dev
```

#### Method 2: Use Development Script (if available)

```bash
npm run dev:full
```

### 6. Access the Application

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:5000
- **API Documentation**: http://localhost:5000/api-docs (if available)

## 🔧 Configuration Options

### Database Configuration

If you want to use a different database:

1. **Local MongoDB with custom port:**

   ```env
   MONGODB_URI=mongodb://localhost:27018/hare-krishna-medical
   ```

2. **MongoDB Atlas (Cloud):**
   ```env
   MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/hare-krishna-medical
   ```

### Port Configuration

To run on different ports:

**Frontend (Vite):**

```bash
npm run dev -- --port 3001
```

**Backend:**
Change `PORT=5000` to `PORT=5001` in `backend/.env`

### API Base URL

If you change the backend port, update the frontend `.env`:

```env
REACT_APP_BACKEND_URL=http://localhost:5001
```

## 📂 Project Structure

```
hare-krishna-medical-store/
├── src/                          # Frontend source code
│   ├── components/               # Reusable React components
│   ├── pages/                    # Page components
│   ├── store/                    # Redux store and slices
│   ├── utils/                    # Utility functions
│   └── App.jsx                   # Main App component
├── backend/                      # Backend source code
│   ├── models/                   # MongoDB models
│   ├── routes/                   # API routes
│   ├── middleware/               # Custom middleware
│   ├── utils/                    # Backend utilities
│   └── server.js                 # Main server file
├── public/                       # Static assets
├── package.json                  # Frontend dependencies
└── README.md                     # Project documentation
```

## 🎯 Features Overview

### User Features

- **Product Browsing**: Browse medical products with search and filters
- **Shopping Cart**: Add products to cart and manage quantities
- **User Registration/Login**: Account management
- **Order Tracking**: Track order status and history
- **Invoice Management**: View and download invoices
- **QR Code Verification**: Scan QR codes to verify invoice authenticity

### Admin Features

- **Dashboard**: Overview of orders, products, and users
- **Product Management**: Add, edit, delete products
- **Order Management**: Process and track orders
- **User Management**: Manage customer accounts
- **Invoice Generation**: Create and manage invoices
- **Payment Methods**: Configure available payment options
- **Analytics**: View sales and user analytics

## 🛠️ Development Commands

### Frontend Commands

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Run tests
npm test

# Format code
npm run format.fix
```

### Backend Commands

```bash
cd backend

# Start development server
npm run dev

# Start production server
npm start

# Run tests
npm test

# Seed database
npm run seed
```

## 🐛 Troubleshooting

### Common Issues

#### 1. "Module not found" errors

```bash
# Delete node_modules and reinstall
rm -rf node_modules
npm install

# For backend
cd backend
rm -rf node_modules
npm install
```

#### 2. Database connection failed

- Ensure MongoDB is running
- Check the connection string in `.env`
- Verify database permissions

#### 3. Port already in use

```bash
# Kill process using port 3000
npx kill-port 3000

# Kill process using port 5000
npx kill-port 5000
```

#### 4. CORS issues

- Ensure `FRONTEND_URL` in backend `.env` matches your frontend URL
- Check CORS configuration in `backend/server.js`

#### 5. API calls failing

- Verify `REACT_APP_BACKEND_URL` in frontend `.env`
- Ensure backend server is running
- Check browser network tab for error details

### Package Issues

#### Sonner package error

```bash
# If you see sonner version error
npm install sonner@latest
```

#### Zod duplicate dependency

```bash
# Remove duplicate zod entries in package.json
# Keep only one version
```

## 🔒 Security Setup

### For Production Deployment

1. **Environment Variables**: Never commit `.env` files to version control
2. **JWT Secret**: Use a strong, unique JWT secret
3. **Database**: Use a secure database connection with authentication
4. **HTTPS**: Always use HTTPS in production
5. **Rate Limiting**: Configure appropriate rate limits
6. **Input Validation**: Ensure all inputs are validated

### Development Security

```bash
# Generate a secure JWT secret
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

## 📱 Mobile Development

The application is responsive and works on mobile devices. For mobile app development:

1. **React Native**: Convert to React Native app
2. **PWA**: Add service worker for Progressive Web App features
3. **Capacitor**: Use Ionic Capacitor for hybrid app development

## 🚀 Deployment

### Frontend Deployment (Netlify/Vercel)

```bash
# Build the project
npm run build

# Deploy the dist/ folder
```

### Backend Deployment (Heroku/Railway/DigitalOcean)

```bash
# Set environment variables on your hosting platform
# Deploy the backend/ folder
```

### Database Deployment

- Use MongoDB Atlas for cloud database
- Or deploy MongoDB on your server

## 📞 Support

If you encounter any issues:

1. Check this guide first
2. Look at error messages in browser console
3. Check server logs for backend issues
4. Ensure all dependencies are installed correctly
5. Verify environment variables are set properly

### Useful Commands for Debugging

```bash
# Check Node.js version
node --version

# Check npm version
npm --version

# Check MongoDB status (Linux/macOS)
brew services list | grep mongodb

# View running processes
ps aux | grep node

# Check port usage
lsof -i :3000
lsof -i :5000
```

## 🎉 Success!

If everything is set up correctly, you should see:

1. **Frontend**: React application at http://localhost:3000
2. **Backend**: Express server at http://localhost:5000
3. **Database**: MongoDB connected and running
4. **Features**: All application features working properly

Congratulations! Your Hare Krishna Medical Store is now running locally. You can now:

- Browse products
- Create user accounts
- Place orders
- Manage inventory (as admin)
- Generate and verify invoices
- And much more!

## 📚 Additional Resources

- [React Documentation](https://reactjs.org/docs)
- [Node.js Documentation](https://nodejs.org/docs)
- [MongoDB Documentation](https://docs.mongodb.com/)
- [Express.js Documentation](https://expressjs.com/)
- [Bootstrap Documentation](https://getbootstrap.com/docs)

---

**Happy Coding! 🚀**

For any questions or issues, please refer to the troubleshooting section or check the project documentation.
