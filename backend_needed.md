# Backend Requirements Documentation

## Hare Krishna Medical Store - Complete Backend Functionality

### Table of Contents

1. [System Overview](#system-overview)
2. [Authentication & Authorization](#authentication--authorization)
3. [Database Models & Schema](#database-models--schema)
4. [API Endpoints](#api-endpoints)
5. [Real-Time Features](#real-time-features)
6. [Data Integrity & Validation](#data-integrity--validation)
7. [File Management](#file-management)
8. [Email Services](#email-services)
9. [Security Features](#security-features)
10. [Analytics & Reporting](#analytics--reporting)
11. [Deployment Requirements](#deployment-requirements)

---

## System Overview

### Technology Stack Required

- **Runtime**: Node.js (v16.0.0+)
- **Framework**: Express.js
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT (JSON Web Tokens) + bcryptjs
- **Real-Time**: Socket.IO
- **File Storage**: Cloudinary (image/document storage)
- **Email**: Nodemailer with Gmail SMTP
- **Security**: Helmet, CORS, express-rate-limit
- **Validation**: express-validator
- **Additional**: QR Code generation, PDF generation (PDFKit)

---

## Authentication & Authorization

### User Management System

- **Registration**: Email verification required
- **Login**: JWT token-based with refresh tokens
- **Password Reset**: Email-based reset with secure tokens
- **Role-Based Access**: Admin, User roles
- **Session Management**: Cross-device logout capability
- **Security**: Password hashing with bcrypt, rate limiting

### Required Auth Endpoints

```
POST /api/auth/register
POST /api/auth/login
POST /api/auth/logout
POST /api/auth/verify-email
POST /api/auth/forgot-password
POST /api/auth/reset-password
GET  /api/auth/me
PUT  /api/auth/update-profile
```

---

## Database Models & Schema

### 1. User Model

```javascript
{
  _id: ObjectId,
  name: String (required),
  email: String (unique, required),
  password: String (hashed),
  role: String (enum: ['user', 'admin']),
  isVerified: Boolean,
  verificationToken: String,
  resetPasswordToken: String,
  resetPasswordExpire: Date,
  createdAt: Date,
  updatedAt: Date,
  lastLogin: Date,
  profile: {
    phone: String,
    address: Object,
    dateOfBirth: Date
  }
}
```

### 2. Product Model

```javascript
{
  _id: ObjectId,
  name: String (required),
  slug: String (unique),
  description: String,
  price: Number (required),
  stock: Number (required),
  category: String,
  brand: String,
  images: [String], // Cloudinary URLs
  specifications: Object,
  isActive: Boolean,
  isFeatured: Boolean,
  createdAt: Date,
  updatedAt: Date,
  tags: [String],
  seo: {
    metaTitle: String,
    metaDescription: String
  }
}
```

### 3. Order Model

```javascript
{
  _id: ObjectId,
  userId: ObjectId (ref: 'User'),
  orderNumber: String (unique),
  items: [{
    productId: ObjectId (ref: 'Product'),
    name: String,
    price: Number,
    quantity: Number,
    total: Number
  }],
  totalAmount: Number,
  status: String (enum: ['pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled']),
  paymentStatus: String (enum: ['pending', 'paid', 'failed', 'refunded']),
  paymentMethod: String,
  shippingAddress: Object,
  billingAddress: Object,
  trackingNumber: String,
  notes: String,
  createdAt: Date,
  updatedAt: Date
}
```

### 4. Invoice Model

```javascript
{
  _id: ObjectId,
  invoiceId: String (unique),
  orderId: ObjectId (ref: 'Order'),
  userId: ObjectId (ref: 'User'),
  customerDetails: Object,
  items: [Object],
  subtotal: Number,
  tax: Number,
  total: Number,
  status: String (enum: ['draft', 'sent', 'paid', 'overdue']),
  dueDate: Date,
  paidDate: Date,
  qrCode: String, // Base64 QR code
  verificationUrl: String,
  letterheadId: ObjectId (ref: 'Letterhead'),
  createdAt: Date,
  updatedAt: Date
}
```

### 5. Letterhead Model

```javascript
{
  _id: ObjectId,
  name: String (required),
  logo: String, // Cloudinary URL
  companyDetails: {
    name: String,
    address: String,
    phone: String,
    email: String,
    website: String,
    gst: String
  },
  design: {
    headerColor: String,
    fontFamily: String,
    fontSize: Number
  },
  isDefault: Boolean,
  isActive: Boolean,
  createdAt: Date,
  updatedAt: Date
}
```

### 6. Message Model

```javascript
{
  _id: ObjectId,
  senderId: ObjectId (ref: 'User'),
  receiverId: ObjectId (ref: 'User'),
  subject: String,
  content: String,
  type: String (enum: ['inquiry', 'support', 'notification']),
  status: String (enum: ['unread', 'read', 'archived']),
  attachments: [String],
  createdAt: Date,
  updatedAt: Date
}
```

---

## API Endpoints

### Authentication Routes (/api/auth)

- User registration, login, logout
- Email verification
- Password reset functionality
- Profile management

### Product Routes (/api/products)

- CRUD operations for products
- Product search and filtering
- Category management
- Featured products
- Stock management

### Order Routes (/api/orders)

- Order creation and management
- Order status updates
- Order history
- Order tracking

### Cart Routes (/api/cart)

- Add/remove items
- Update quantities
- Cart synchronization
- Cart persistence

### Invoice Routes (/api/invoices)

- Generate invoices from orders
- Invoice PDF generation
- QR code generation for verification
- Invoice status management

### User Routes (/api/users)

- User profile management
- Admin user management
- User analytics

### Message Routes (/api/messages)

- Send/receive messages
- Message status updates
- Bulk operations

### Analytics Routes (/api/analytics)

- Sales analytics
- User behavior analytics
- Product performance
- Revenue reports

### Upload Routes (/api/upload)

- Image upload to Cloudinary
- File validation
- Multiple file support

---

## Real-Time Features

### Socket.IO Implementation Required

#### Real-Time Events

1. **Order Updates**
   - Order status changes
   - New order notifications for admin
   - Order confirmation for users

2. **Stock Updates**
   - Real-time stock level changes
   - Low stock alerts
   - Product availability updates

3. **User Activity**
   - User login/logout status
   - Active users count
   - Admin notifications

4. **Messages**
   - Real-time messaging system
   - Message delivery confirmations
   - Typing indicators

5. **Analytics**
   - Live sales data
   - Real-time visitor count
   - Dashboard updates

#### Socket Events Structure

```javascript
// Client to Server
socket.emit("join-room", { userId, role });
socket.emit("order-update", { orderId, status });
socket.emit("message-send", { receiverId, content });

// Server to Client
socket.emit("order-status-changed", { orderId, status });
socket.emit("stock-updated", { productId, newStock });
socket.emit("new-message", { messageData });
socket.emit("admin-notification", { type, data });
```

---

## Data Integrity & Validation

### Input Validation Requirements

1. **Email Validation**: RFC compliant email format
2. **Password Strength**: Minimum 8 characters, mixed case, numbers
3. **Phone Number**: Country-specific format validation
4. **Price Validation**: Positive numbers only, currency format
5. **Stock Validation**: Non-negative integers
6. **File Upload**: Size limits, type restrictions
7. **SQL Injection Prevention**: Parameterized queries
8. **XSS Prevention**: Input sanitization

### Database Constraints

1. **Unique Constraints**: Email, product slug, order numbers
2. **Foreign Key Integrity**: User-Order relationships
3. **Cascade Operations**: User deletion affects orders
4. **Index Optimization**: Email, product name, order date
5. **Transaction Support**: Order creation with inventory updates

### Error Handling

```javascript
// Standardized error response format
{
  success: false,
  error: {
    code: 'VALIDATION_ERROR',
    message: 'User-friendly error message',
    details: ['Specific field errors'],
    timestamp: '2024-01-01T00:00:00Z'
  }
}
```

---

## File Management

### Cloudinary Integration

1. **Image Upload**: Product images, user avatars, letterhead logos
2. **Image Optimization**: Auto-resizing, format conversion
3. **CDN Delivery**: Global content delivery
4. **Security**: Signed uploads, access control
5. **Backup**: Automatic backups and versioning

### PDF Generation

1. **Invoice PDFs**: Professional invoice generation
2. **QR Code Integration**: Embedded verification QR codes
3. **Letterhead Support**: Custom company letterheads
4. **Print Optimization**: A4 format, proper margins

---

## Email Services

### Nodemailer Configuration

1. **SMTP Setup**: Gmail SMTP with app passwords
2. **Email Templates**: HTML templates for different purposes
3. **Bulk Email**: Newsletter and notification support
4. **Email Verification**: Secure token-based verification
5. **Password Reset**: Time-limited reset links

### Email Types Required

- Welcome emails
- Email verification
- Order confirmations
- Invoice delivery
- Password reset
- Admin notifications

---

## Security Features

### Implementation Requirements

1. **HTTPS Enforcement**: SSL/TLS certificates
2. **Rate Limiting**: API endpoint protection
3. **CORS Configuration**: Controlled cross-origin access
4. **Helmet Integration**: Security headers
5. **JWT Security**: Secure token handling
6. **Environment Variables**: Sensitive data protection
7. **Input Sanitization**: XSS and injection prevention
8. **File Upload Security**: Type and size validation

### Security Middleware Stack

```javascript
// Required security middleware
app.use(helmet());
app.use(cors(corsOptions));
app.use(rateLimit(rateLimitConfig));
app.use(express.json({ limit: "10mb" }));
app.use(mongoSanitize());
app.use(xss());
```

---

## Analytics & Reporting

### Analytics Features Required

1. **Sales Analytics**
   - Daily/weekly/monthly revenue
   - Product performance metrics
   - Order volume trends
   - Payment method analytics

2. **User Analytics**
   - User registration trends
   - User activity patterns
   - Cart abandonment rates
   - Customer lifetime value

3. **Inventory Analytics**
   - Stock level monitoring
   - Reorder point alerts
   - Product popularity metrics
   - Category performance

4. **Business Intelligence**
   - Revenue forecasting
   - Seasonal trend analysis
   - Customer segmentation
   - Performance dashboards

---

## Deployment Requirements

### Environment Configuration

```bash
# Required Environment Variables
NODE_ENV=production
PORT=5001
MONGODB_URI=mongodb+srv://...
JWT_SECRET=secure_random_string
JWT_EXPIRE=7d
CLOUDINARY_CLOUD_NAME=...
CLOUDINARY_API_KEY=...
CLOUDINARY_API_SECRET=...
EMAIL_USER=...
EMAIL_PASS=...
FRONTEND_URL=https://yourdomain.com
```

### Infrastructure Requirements

1. **Database**: MongoDB Atlas or self-hosted MongoDB
2. **File Storage**: Cloudinary account
3. **Email Service**: Gmail SMTP or dedicated email service
4. **SSL Certificate**: HTTPS enforcement
5. **CDN**: Content delivery network for static assets
6. **Monitoring**: Error tracking and performance monitoring
7. **Backup**: Automated database backups
8. **Scaling**: Load balancer for high availability

### Performance Optimizations

1. **Database Indexing**: Optimized queries
2. **Caching**: Redis for session and data caching
3. **Compression**: gzip compression middleware
4. **Static Assets**: CDN delivery
5. **Connection Pooling**: Database connection optimization
6. **Memory Management**: Proper memory usage patterns

---

## Migration & Data Seeding

### Database Initialization

1. **Schema Creation**: Automated model setup
2. **Index Creation**: Performance optimization
3. **Default Data**: Admin user, sample products
4. **Seed Scripts**: Development data population
5. **Migration Scripts**: Schema version management

### Sample Data Requirements

- Admin user with default credentials
- Product categories and sample products
- Default letterhead template
- System configuration settings
- Sample orders for testing

---

## Monitoring & Logging

### Logging Requirements

1. **Request Logging**: Morgan middleware for HTTP requests
2. **Error Logging**: Comprehensive error tracking
3. **Performance Logging**: Response time monitoring
4. **Security Logging**: Failed login attempts, suspicious activity
5. **Business Logic Logging**: Order processing, payment events

### Health Checks

```javascript
// Health check endpoints
GET /api/health - Basic health status
GET /api/health/db - Database connectivity
GET /api/health/external - External service status
```

---

## Testing Requirements

### Test Coverage Needed

1. **Unit Tests**: Individual function testing
2. **Integration Tests**: API endpoint testing
3. **Authentication Tests**: Security verification
4. **Database Tests**: CRUD operations
5. **File Upload Tests**: Cloudinary integration
6. **Email Tests**: Nodemailer functionality
7. **Socket Tests**: Real-time feature testing

### Testing Tools

- Jest for unit testing
- Supertest for API testing
- MongoDB Memory Server for test database
- Socket.IO client for real-time testing

---

This documentation provides a comprehensive overview of all backend functionality required to support the Hare Krishna Medical Store frontend application. Each section includes detailed technical specifications, data models, and implementation requirements for a production-ready backend system.
