# Hare Krishna Medical - Backend API

A comprehensive Node.js backend API for the Hare Krishna Medical e-commerce platform with real-time features, payment integration, and administrative capabilities.

## 🚀 Features

- **User Authentication & Authorization** - JWT-based auth with role management
- **Product Management** - CRUD operations with inventory tracking
- **Order Processing** - Complete order lifecycle management
- **Invoice Generation** - Automated invoicing with QR code verification
- **Real-time Updates** - Socket.io integration for live dashboard updates
- **Payment Integration** - Razorpay payment gateway support
- **Email & SMS Notifications** - Automated communication system
- **File Upload** - Cloudinary integration for image management
- **Analytics & Reporting** - Comprehensive business intelligence
- **Admin Dashboard** - Real-time statistics and management tools

## 🛠️ Technology Stack

- **Runtime**: Node.js 16+
- **Framework**: Express.js
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT (JSON Web Tokens)
- **Real-time**: Socket.io
- **File Storage**: Cloudinary
- **Email**: Nodemailer
- **SMS**: Twilio
- **Payments**: Razorpay
- **Security**: Helmet, CORS, Rate Limiting
- **Validation**: Express Validator

## 📋 Prerequisites

- Node.js 16.0.0 or higher
- MongoDB 4.4 or higher
- npm or yarn package manager

## ⚙️ Installation

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd hare-krishna-medical-backend
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Environment Configuration**

   ```bash
   cp .env.example .env
   ```

   Configure the following environment variables:

   ```env
   NODE_ENV=development
   PORT=5000
   MONGODB_URI=mongodb://localhost:27017/hare-krishna-medical
   JWT_SECRET=your-super-secret-jwt-key-here
   FRONTEND_URL=http://localhost:3000

   # Cloudinary Configuration
   CLOUDINARY_CLOUD_NAME=your_cloud_name
   CLOUDINARY_API_KEY=your_api_key
   CLOUDINARY_API_SECRET=your_api_secret

   # Razorpay Configuration
   RAZORPAY_KEY_ID=your_razorpay_key_id
   RAZORPAY_KEY_SECRET=your_razorpay_key_secret

   # Email Configuration
   EMAIL_HOST=smtp.gmail.com
   EMAIL_PORT=587
   EMAIL_USER=your_email@gmail.com
   EMAIL_PASS=your_app_password

   # Twilio Configuration
   TWILIO_ACCOUNT_SID=your_twilio_account_sid
   TWILIO_AUTH_TOKEN=your_twilio_auth_token
   TWILIO_PHONE_NUMBER=your_twilio_phone_number
   ```

4. **Database Setup**

   ```bash
   # Start MongoDB service
   mongod

   # Seed the database with sample data
   npm run seed
   ```

5. **Start the server**

   ```bash
   # Development mode
   npm run dev

   # Production mode
   npm start
   ```

## 📁 Project Structure

```
backend/
├── config/
│   └── database.js          # Database configuration
├── middleware/
│   ├── auth.js              # Authentication middleware
│   └── validate.js          # Input validation middleware
├── models/
│   ├── User.js              # User schema
│   ├── Product.js           # Product schema
│   ├── Order.js             # Order schema
│   ├── Invoice.js           # Invoice schema
│   └── Verification.js      # Email/mobile verification schema
├── routes/
│   ├── auth.js              # Authentication routes
│   ├── users.js             # User management routes
│   ├── products.js          # Product CRUD routes
│   ├── orders.js            # Order processing routes
│   ├── invoices.js          # Invoice management routes
│   ├── verification.js      # Email/mobile verification routes
│   ├── analytics.js         # Analytics & reporting routes
│   ├── messages.js          # Contact & messaging routes
│   └── upload.js            # File upload routes
├── utils/
│   ├── emailService.js      # Email notification service
│   └── smsService.js        # SMS notification service
├── scripts/
│   └── seed.js              # Database seeding script
├── server.js                # Main application entry point
├── package.json
└── .env.example
```

## 🔐 Authentication

The API uses JWT (JSON Web Tokens) for authentication. Include the token in the Authorization header:

```bash
Authorization: Bearer <your-jwt-token>
```

### User Roles

- **0**: Regular User
- **1**: Admin User

## 📡 API Endpoints

### Authentication

- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/profile` - Get user profile
- `PUT /api/auth/update-profile` - Update user profile
- `POST /api/auth/change-password` - Change password
- `POST /api/auth/forgot-password` - Request password reset
- `POST /api/auth/reset-password/:token` - Reset password

### Products

- `GET /api/products` - Get all products (with filters)
- `GET /api/products/:id` - Get single product
- `POST /api/products` - Create product (Admin)
- `PUT /api/products/:id` - Update product (Admin)
- `DELETE /api/products/:id` - Delete product (Admin)
- `GET /api/products/categories` - Get product categories
- `GET /api/products/featured` - Get featured products

### Orders

- `POST /api/orders` - Create new order
- `GET /api/orders` - Get user orders
- `GET /api/orders/:id` - Get single order
- `PUT /api/orders/:id/status` - Update order status (Admin)
- `POST /api/orders/:id/cancel` - Cancel order
- `GET /api/orders/admin/all` - Get all orders (Admin)

### Invoices

- `GET /api/invoices` - Get user invoices
- `GET /api/invoices/:id` - Get single invoice
- `GET /api/invoices/verify/:invoiceId` - Verify invoice (Public)
- `PUT /api/invoices/:id/payment-status` - Update payment status (Admin)
- `GET /api/invoices/admin/all` - Get all invoices (Admin)

### Users

- `GET /api/users/dashboard` - Get user dashboard data
- `GET /api/users/admin/all` - Get all users (Admin)
- `PUT /api/users/admin/:id/status` - Update user status (Admin)
- `PUT /api/users/admin/:id/role` - Update user role (Admin)

### Verification

- `POST /api/verification/send-email-verification` - Send email verification link
- `GET /api/verification/verify-email/:token` - Verify email with token (Public)
- `POST /api/verification/send-mobile-otp` - Send mobile OTP
- `POST /api/verification/verify-mobile-otp` - Verify mobile OTP
- `GET /api/verification/status` - Get verification status
- `POST /api/verification/resend-email` - Resend email verification

### Analytics

- `GET /api/analytics/dashboard` - Get dashboard statistics (Admin)
- `GET /api/analytics/revenue` - Get revenue analytics (Admin)
- `GET /api/analytics/orders` - Get order analytics (Admin)
- `GET /api/analytics/products` - Get product analytics (Admin)
- `GET /api/analytics/customers` - Get customer analytics (Admin)

### Messages

- `POST /api/messages/contact` - Submit contact form
- `GET /api/messages/admin/all` - Get all messages (Admin)
- `PUT /api/messages/admin/:id/status` - Update message status (Admin)
- `POST /api/messages/admin/:id/respond` - Respond to message (Admin)

### File Upload

- `POST /api/upload/product-image` - Upload single product image (Admin)
- `POST /api/upload/product-images` - Upload multiple product images (Admin)
- `POST /api/upload/user-avatar` - Upload user avatar
- `DELETE /api/upload/delete-image` - Delete image (Admin)

## 🔄 Real-time Features

The API supports real-time updates using Socket.io:

### Admin Room Events

- `new-user-registered` - New user registration
- `new-order` - New order placed
- `order-status-updated` - Order status changes
- `payment-status-updated` - Payment status changes
- `product-created` - New product added
- `stock-updated` - Product stock changes
- `new-message` - New contact message

### User Room Events

- `order-created` - Order confirmation
- `order-status-changed` - Order status updates
- `payment-status-changed` - Payment status updates

## 💾 Database Models

### User Model

- Authentication and profile management
- Role-based access control
- Address and preference storage

### Product Model

- Complete product information
- Inventory management
- Category and brand organization
- Image and specification storage

### Order Model

- Complete order lifecycle
- Item details and pricing
- Shipping and payment information
- Status tracking and history

### Invoice Model

- Automated invoice generation
- QR code integration
- Payment status tracking
- PDF generation support

### Verification Model

- Email and mobile verification workflow
- OTP generation and validation
- Verification status tracking
- Security measures and rate limiting

## 🔗 QR Code Enhancements

### Direct Invoice Verification

QR codes on invoices now contain direct links to invoice verification pages:

- **QR Content**: Direct URL to `/invoice-verify/:invoiceId`
- **Public Access**: No authentication required for invoice verification
- **Mobile Friendly**: Optimized for mobile scanning and viewing
- **Secure**: Invoice verification through backend validation

### Implementation

```javascript
// QR code contains direct verification URL
const verificationUrl = `${FRONTEND_URL}/invoice-verify/${invoiceId}`;

// Generate QR code with direct URL
const qrCode = await QRCode.toDataURL(verificationUrl, {
  width: 180,
  margin: 2,
  errorCorrectionLevel: "M",
});
```

## ⚡ Real-time Features

### Frontend Integration

The frontend includes Socket.io client integration for real-time updates:

```javascript
import socketClient from "./utils/socketClient";

// Connect when user authenticates
socketClient.connect(token, userRole);

// Listen for real-time events
socketClient.on("new-order", (data) => {
  // Handle new order notification
});
```

### Admin Real-time Events

- `new-user-registered` - New user registration notifications
- `new-order` - Instant order notifications with sound alerts
- `payment-status-updated` - Real-time payment status changes
- `stock-updated` - Low stock alerts and inventory updates
- `new-message` - Contact form message notifications

### User Real-time Events

- `order-created` - Order confirmation notifications
- `order-status-changed` - Delivery status updates
- `payment-status-changed` - Payment confirmation updates

### Notification System

- Browser push notifications for critical updates
- Sound alerts for admin notifications
- Visual indicators in dashboard for new events
- Auto-refresh dashboard data without page reload

## 🧪 Testing

```bash
# Run tests
npm test

# Run tests with coverage
npm run test:coverage
```

## 🚀 Deployment

### Environment Variables for Production

```env
NODE_ENV=production
PORT=5000
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/hare-krishna-medical
JWT_SECRET=your-super-secure-production-jwt-secret
FRONTEND_URL=https://your-frontend-domain.com
```

### Heroku Deployment

1. **Create Heroku app**

   ```bash
   heroku create hare-krishna-medical-api
   ```

2. **Set environment variables**

   ```bash
   heroku config:set NODE_ENV=production
   heroku config:set MONGODB_URI=your_mongodb_atlas_url
   heroku config:set JWT_SECRET=your_jwt_secret
   # ... set all other environment variables
   ```

3. **Deploy**
   ```bash
   git push heroku main
   ```

### Docker Deployment

```dockerfile
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci --only=production

COPY . .

EXPOSE 5000

USER node

CMD ["npm", "start"]
```

## 📊 Monitoring & Logging

- Health check endpoint: `GET /api/health`
- Error logging with timestamps
- Request/response logging in development
- Performance monitoring recommendations

## 🔒 Security Features

- **Helmet.js** - Security headers
- **CORS** - Cross-origin resource sharing
- **Rate Limiting** - Request throttling
- **Input Validation** - Express Validator
- **JWT Authentication** - Secure token-based auth
- **Password Hashing** - bcryptjs with salt
- **Environment Variables** - Sensitive data protection

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 📞 Support

For support and queries:

- **Email**: harekrishnamedical@gmail.com
- **Phone**: +91 76989 13354
- **Address**: 3 Sahyog Complex, Man Sarovar circle, Amroli, 394107, Gujarat

---

**Hare Krishna Medical** - Your Trusted Health Partner 🏥
