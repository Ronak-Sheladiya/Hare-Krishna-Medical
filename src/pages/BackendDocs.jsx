import React, { useState } from "react";
import {
  Container,
  Row,
  Col,
  Card,
  Nav,
  Tab,
  Badge,
  Button,
} from "react-bootstrap";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

const BackendDocs = () => {
  const [activeTab, setActiveTab] = useState("overview");

  const downloadDocumentation = async () => {
    try {
      const element = document.getElementById("documentation-content");
      const canvas = await html2canvas(element, {
        scale: 1.5,
        logging: false,
        useCORS: true,
        height: element.scrollHeight,
        width: element.scrollWidth,
      });

      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF("p", "mm", "a4");
      const imgWidth = 210;
      const pageHeight = 295;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      let heightLeft = imgHeight;

      let position = 0;

      pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;

      while (heightLeft >= 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
      }

      pdf.save("hare-krishna-medical-backend-docs.pdf");
    } catch (error) {
      console.error("Error generating PDF:", error);
      // Fallback to text download
      const element = document.createElement("a");
      const file = new Blob([documentationText], { type: "text/plain" });
      element.href = URL.createObjectURL(file);
      element.download = "hare-krishna-medical-backend-docs.txt";
      document.body.appendChild(element);
      element.click();
      document.body.removeChild(element);
    }
  };

  const documentationText = `
HARE KRISHNA MEDICAL - BACKEND IMPLEMENTATION GUIDE
==================================================

This document provides comprehensive backend implementation requirements for the Hare Krishna Medical website.

1. TECHNOLOGY STACK
==================
Backend Framework: Node.js with Express.js
Database: MongoDB with Mongoose ODM
Authentication: JWT (JSON Web Tokens)
File Storage: AWS S3 or Cloudinary for images
Payment Gateway: Razorpay or Stripe
Email Service: Nodemailer with Gmail/SendGrid
SMS Service: Twilio or Fast2SMS
PDF Generation: jsPDF (client-side) or PDFKit (server-side)

2. DATABASE SCHEMA
=================

Users Collection:
{
  _id: ObjectId,
  fullName: String (required),
  email: String (required, unique),
  mobile: String (required),
  password: String (hashed),
  role: Number (0: User, 1: Admin),
  address: {
    street: String,
    city: String,
    state: String,
    pincode: String
  },
  profileImage: String (URL),
  isActive: Boolean (default: true),
  emailVerified: Boolean (default: false),
  mobileVerified: Boolean (default: false),
  createdAt: Date,
  updatedAt: Date
}

Products Collection:
{
  _id: ObjectId,
  name: String (required),
  description: String,
  company: String,
  category: String,
  price: Number (required),
  discountPrice: Number,
  stock: Number (required),
  images: [String] (URLs),
  prescription: Boolean (default: false),
  tags: [String],
  isActive: Boolean (default: true),
  createdAt: Date,
  updatedAt: Date
}

Orders Collection:
{
  _id: ObjectId,
  orderId: String (unique),
  userId: ObjectId (ref: Users),
  items: [{
    productId: ObjectId (ref: Products),
    name: String,
    price: Number,
    quantity: Number,
    total: Number
  }],
  subtotal: Number,
  tax: Number,
  shipping: Number,
  total: Number,
  paymentMethod: String (COD, Online),
  paymentStatus: String (Paid, Unpaid, Partial),
  amountPaid: Number (default: 0),
  amountDue: Number,
  shippingAddress: {
    fullName: String,
    mobile: String,
    address: String,
    city: String,
    state: String,
    pincode: String
  },
  orderStatus: String (Pending, Confirmed, Shipped, Delivered, Cancelled),
  trackingId: String,
  notes: String,
  createdAt: Date,
  updatedAt: Date
}

Messages Collection:
{
  _id: ObjectId,
  name: String (required),
  email: String (required),
  mobile: String,
  subject: String,
  message: String (required),
  isRead: Boolean (default: false),
  reply: String,
  repliedBy: ObjectId (ref: Users),
  repliedAt: Date,
  priority: String (Low, Medium, High),
  status: String (Open, In Progress, Resolved),
  createdAt: Date,
  updatedAt: Date
}

Categories Collection:
{
  _id: ObjectId,
  name: String (required, unique),
  description: String,
  image: String (URL),
  isActive: Boolean (default: true),
  createdAt: Date,
  updatedAt: Date
}

3. API ENDPOINTS
===============

Authentication APIs:
POST /api/auth/register
POST /api/auth/login
POST /api/auth/verify-email
POST /api/auth/verify-mobile
POST /api/auth/forgot-password
POST /api/auth/reset-password
POST /api/auth/logout
GET /api/auth/profile
PUT /api/auth/profile

Product APIs:
GET /api/products (with pagination, filtering, search)
GET /api/products/:id
POST /api/products (Admin only)
PUT /api/products/:id (Admin only)
DELETE /api/products/:id (Admin only)
GET /api/categories
POST /api/categories (Admin only)

Order APIs:
GET /api/orders (Admin: all, User: own orders)
GET /api/orders/:id
POST /api/orders
PUT /api/orders/:id/status (Admin only)
PUT /api/orders/:id/payment (Admin only)
GET /api/orders/:id/invoice

Message APIs:
GET /api/messages (Admin only)
GET /api/messages/:id (Admin only)
POST /api/messages (Contact form)
PUT /api/messages/:id/read (Admin only)
PUT /api/messages/:id/reply (Admin only)
DELETE /api/messages/:id (Admin only)

Analytics APIs:
GET /api/analytics/dashboard (Admin only)
GET /api/analytics/sales (Admin only)
GET /api/analytics/products (Admin only)
GET /api/analytics/customers (Admin only)

4. MIDDLEWARE REQUIREMENTS
=========================

Authentication Middleware:
- Verify JWT tokens
- Extract user information
- Handle token expiration

Authorization Middleware:
- Role-based access control
- Admin-only route protection
- User-specific data access

Validation Middleware:
- Request body validation
- File upload validation
- Sanitize input data

Rate Limiting:
- API rate limiting
- Login attempt limiting
- Prevent brute force attacks

5. PAYMENT INTEGRATION
=====================

Razorpay Integration:
1. Create order on backend
2. Generate payment link
3. Handle payment webhook
4. Update order status
5. Send confirmation email

COD Implementation:
1. Mark payment as "Unpaid"
2. Calculate amount due
3. Allow partial payments
4. Update payment status

6. EMAIL NOTIFICATIONS
=====================

Registration Welcome Email
Order Confirmation Email
Payment Confirmation Email
Shipping Notification Email
Delivery Confirmation Email
Password Reset Email
Admin Alert Emails

7. SMS NOTIFICATIONS
===================

OTP for mobile verification
Order status updates
Delivery notifications
Payment reminders

8. FILE UPLOAD HANDLING
======================

Product Images:
- Multiple image upload
- Image resizing/optimization
- Cloud storage integration
- URL generation

Profile Images:
- Single image upload
- Avatar resizing
- Default image handling

9. SECURITY MEASURES
===================

Password Hashing: bcryptjs
Input Validation: Joi or express-validator
SQL Injection Prevention: Mongoose ODM
XSS Protection: helmet.js
CORS Configuration: cors middleware
Environment Variables: dotenv
API Security: Rate limiting, request validation

10. ERROR HANDLING
=================

Global Error Handler:
- Catch all unhandled errors
- Log errors appropriately
- Return consistent error responses
- Handle async errors

Custom Error Classes:
- ValidationError
- AuthenticationError
- AuthorizationError
- NotFoundError

11. LOGGING AND MONITORING
=========================

Application Logs:
- Request/Response logging
- Error logging
- User activity logs
- Performance metrics

Database Monitoring:
- Query performance
- Connection pooling
- Index optimization

12. DEPLOYMENT CONSIDERATIONS
============================

Environment Setup:
- Production environment variables
- Database connection strings
- Third-party API keys
- SSL certificate configuration

Performance Optimization:
- Database indexing
- Caching strategies
- CDN integration
- Image optimization

Backup Strategy:
- Regular database backups
- File storage backups
- Recovery procedures

13. TESTING REQUIREMENTS
========================

Unit Testing:
- Controller functions
- Model validations
- Utility functions

Integration Testing:
- API endpoint testing
- Database operations
- Third-party integrations

14. ADMIN FEATURES IMPLEMENTATION
================================

Dashboard Analytics:
- Real-time statistics
- Revenue tracking
- Order analytics
- Customer insights

Product Management:
- CRUD operations
- Bulk uploads
- Inventory tracking
- Category management

Order Management:
- Order processing
- Status updates
- Payment tracking
- Invoice generation

User Management:
- User accounts
- Role management
- Activity monitoring

Message Management:
- Contact form messages
- Response handling
- Priority system
- Status tracking

15. USER FEATURES IMPLEMENTATION
===============================

Profile Management:
- Personal information
- Address management
- Password changes
- Order history

Shopping Features:
- Product browsing
- Cart management
- Checkout process
- Payment processing

Order Tracking:
- Order status
- Tracking information
- Invoice access
- Reorder functionality

16. ADDITIONAL FEATURES
======================

Search Functionality:
- Product search
- Category filtering
- Price range filtering
- Sorting options

Notification System:
- Real-time notifications
- Email subscriptions
- SMS preferences
- Push notifications

Invoice Generation:
- PDF invoice creation
- QR code integration
- Email delivery
- Download functionality

This documentation provides a comprehensive guide for implementing the backend system for Hare Krishna Medical website. Each section should be implemented following best practices and industry standards.
  `;

  return (
    <div className="section-padding">
      <Container>
        <Row>
          <Col lg={12}>
            <div className="text-center mb-5">
              <h1 className="section-title">Backend Implementation Guide</h1>
              <p className="section-subtitle">
                Comprehensive documentation for developers implementing the Hare
                Krishna Medical backend system
              </p>
              <Button
                onClick={downloadDocumentation}
                className="btn-medical-primary"
              >
                <i className="bi bi-download me-2"></i>
                Download Complete Documentation
              </Button>
            </div>
          </Col>
        </Row>

        <Row>
          <Col lg={12}>
            <Card className="medical-card">
              <Card.Body className="p-0">
                <Tab.Container activeKey={activeTab} onSelect={setActiveTab}>
                  <Nav variant="tabs" className="border-bottom">
                    <Nav.Item>
                      <Nav.Link eventKey="overview">Overview</Nav.Link>
                    </Nav.Item>
                    <Nav.Item>
                      <Nav.Link eventKey="structure">File Structure</Nav.Link>
                    </Nav.Item>
                    <Nav.Item>
                      <Nav.Link eventKey="database">Database Schema</Nav.Link>
                    </Nav.Item>
                    <Nav.Item>
                      <Nav.Link eventKey="apis">API Endpoints</Nav.Link>
                    </Nav.Item>
                    <Nav.Item>
                      <Nav.Link eventKey="security">Security</Nav.Link>
                    </Nav.Item>
                    <Nav.Item>
                      <Nav.Link eventKey="deployment">Deployment</Nav.Link>
                    </Nav.Item>
                  </Nav>

                  <Tab.Content className="p-4">
                    <Tab.Pane eventKey="overview">
                      <h3 className="text-medical-red mb-4">
                        Technology Stack & Architecture
                      </h3>

                      <div className="tech-stack mb-4">
                        <h5>Recommended Technology Stack</h5>
                        <Row>
                          <Col md={6}>
                            <div className="tech-item">
                              <Badge bg="primary" className="me-2">
                                Backend
                              </Badge>
                              <span>Node.js with Express.js</span>
                            </div>
                            <div className="tech-item">
                              <Badge bg="success" className="me-2">
                                Database
                              </Badge>
                              <span>MongoDB with Mongoose ODM</span>
                            </div>
                            <div className="tech-item">
                              <Badge bg="warning" className="me-2">
                                Authentication
                              </Badge>
                              <span>JWT (JSON Web Tokens)</span>
                            </div>
                            <div className="tech-item">
                              <Badge bg="info" className="me-2">
                                Storage
                              </Badge>
                              <span>AWS S3 or Cloudinary</span>
                            </div>
                          </Col>
                          <Col md={6}>
                            <div className="tech-item">
                              <Badge bg="danger" className="me-2">
                                Payment
                              </Badge>
                              <span>Razorpay or Stripe</span>
                            </div>
                            <div className="tech-item">
                              <Badge bg="secondary" className="me-2">
                                Email
                              </Badge>
                              <span>Nodemailer with Gmail/SendGrid</span>
                            </div>
                            <div className="tech-item">
                              <Badge bg="dark" className="me-2">
                                SMS
                              </Badge>
                              <span>Twilio or Fast2SMS</span>
                            </div>
                            <div className="tech-item">
                              <Badge bg="light" className="me-2 text-dark">
                                PDF
                              </Badge>
                              <span>PDFKit or jsPDF</span>
                            </div>
                          </Col>
                        </Row>
                      </div>

                      <div className="features-overview">
                        <h5>Core Features to Implement</h5>
                        <Row>
                          <Col md={4}>
                            <h6 className="text-medical-blue">
                              User Management
                            </h6>
                            <ul className="feature-list">
                              <li>User registration & login</li>
                              <li>Email & mobile verification</li>
                              <li>Profile management</li>
                              <li>Password reset</li>
                              <li>Role-based access</li>
                            </ul>
                          </Col>
                          <Col md={4}>
                            <h6 className="text-medical-blue">
                              Product Management
                            </h6>
                            <ul className="feature-list">
                              <li>Product CRUD operations</li>
                              <li>Category management</li>
                              <li>Inventory tracking</li>
                              <li>Image upload & storage</li>
                              <li>Search & filtering</li>
                            </ul>
                          </Col>
                          <Col md={4}>
                            <h6 className="text-medical-blue">
                              Order Processing
                            </h6>
                            <ul className="feature-list">
                              <li>Shopping cart</li>
                              <li>Checkout process</li>
                              <li>Payment processing</li>
                              <li>Order tracking</li>
                              <li>Invoice generation</li>
                            </ul>
                          </Col>
                        </Row>
                      </div>
                    </Tab.Pane>

                    <Tab.Pane eventKey="structure">
                      <h3 className="text-medical-red mb-4">
                        Project File Structure
                      </h3>

                      <div className="structure-section">
                        <h5>Frontend (React.js) Structure</h5>
                        <div className="code-block">
                          <pre>{`src/
├── components/
│   ├── common/
│   │   ├── LoadingSpinner.jsx          # Loading animations
│   │   └── PaymentOptions.jsx          # Payment method selection
│   ├── layout/
│   │   ├── Footer.jsx                  # Site footer
│   │   └── Header.jsx                  # Navigation header
│   ├── products/
│   │   ├── ProductCard.jsx             # Product display cards
│   │   └── ProductFilters.jsx          # Product filtering
│   └── ui/                             # Shadcn UI components
├── hooks/
│   ├── use-mobile.tsx                  # Mobile detection hook
│   └── use-toast.ts                    # Toast notifications
├── lib/
│   └── utils.ts                        # Utility functions
├── pages/
│   ├── admin/
│   │   ├── AddProduct.jsx              # Product creation form
│   │   ├── AdminAnalytics.jsx          # Charts & analytics
│   │   ├── AdminInvoices.jsx           # Invoice management
│   │   ├── AdminMessages.jsx           # Customer messages
│   │   ├── AdminOrders.jsx             # Order management
│   │   ├── AdminProducts.jsx           # Product management
│   │   └── AdminUsers.jsx              # User management
│   ├── user/
│   │   ├── UserInvoices.jsx            # User invoice history
│   │   ├── UserOrders.jsx              # User order history
│   │   └── UserProfile.jsx             # Profile editing
│   ├── About.jsx                       # About page
│   ├── AdminDashboard.jsx              # Admin dashboard
│   ├── BackendDocs.jsx                 # This documentation
│   ├── Cart.jsx                        # Shopping cart
│   ├── Contact.jsx                     # Contact form
│   ├── ForgotPassword.jsx              # Password reset
│   ├── Home.jsx                        # Homepage
│   ├── InvoiceView.jsx                 # Invoice display
│   ├── Login.jsx                       # User login
│   ├── NotFound.jsx                    # 404 page
│   ├── Order.jsx                       # Order placement
│   ├── PrivacyPolicy.jsx               # Privacy policy
│   ├── ProductDetails.jsx              # Product details
│   ├── Products.jsx                    # Product catalog
│   ├── Register.jsx                    # User registration
│   ├── TermsConditions.jsx             # Terms & conditions
│   └── UserDashboard.jsx               # User dashboard
├── store/
│   ├── slices/
│   │   ├── authSlice.js                # Authentication state
│   │   ├── cartSlice.js                # Shopping cart state
│   │   ├── messageSlice.js             # Messages state
│   │   └── productsSlice.js            # Products state
│   └── store.js                        # Redux store config
├── App.css                             # Global styles
├── App.jsx                             # Main app component
├── index.css                           # Base styles
└── main.jsx                            # React entry point`}</pre>
                        </div>
                      </div>

                      <div className="structure-section">
                        <h5>Backend (Node.js) Structure</h5>
                        <div className="code-block">
                          <pre>{`backend/
├── controllers/
│   ├── authController.js               # Authentication logic
│   ├── orderController.js              # Order management
│   ├── productController.js            # Product operations
│   ├── messageController.js            # Contact messages
│   └── userController.js               # User management
├── middleware/
│   ├── auth.js                         # JWT authentication
│   ├── validation.js                   # Input validation
│   ├── upload.js                       # File upload handling
│   └── rateLimiter.js                  # Rate limiting
├── models/
│   ├── User.js                         # User schema
│   ├── Product.js                      # Product schema
│   ├── Order.js                        # Order schema
│   ├── Message.js                      # Message schema
│   └── Category.js                     # Category schema
├── routes/
│   ├── auth.js                         # Authentication routes
│   ├── products.js                     # Product routes
│   ├── orders.js                       # Order routes
│   ├── messages.js                     # Message routes
│   └── users.js                        # User routes
├── utils/
│   ├── email.js                        # Email sending
│   ├── sms.js                          # SMS sending
│   ├── payment.js                      # Payment processing
│   └── pdf.js                          # PDF generation
├── config/
│   ├── database.js                     # MongoDB connection
│   ├── cloudinary.js                   # Image storage
│   └── payment.js                      # Payment gateway
├── uploads/                            # Temporary file storage
├── .env                               # Environment variables
├── app.js                             # Express app setup
└── server.js                         # Server entry point`}</pre>
                        </div>
                      </div>

                      <div className="structure-section">
                        <h5>Key File Descriptions</h5>
                        <div className="file-descriptions">
                          <h6 className="text-medical-blue mb-3">
                            Frontend Files:
                          </h6>
                          <ul className="file-list">
                            <li>
                              <strong>App.jsx:</strong> Main application
                              component with routing
                            </li>
                            <li>
                              <strong>store/store.js:</strong> Redux store
                              configuration
                            </li>
                            <li>
                              <strong>pages/Home.jsx:</strong> Homepage with
                              featured products
                            </li>
                            <li>
                              <strong>pages/ProductDetails.jsx:</strong> Product
                              detail view with cart
                            </li>
                            <li>
                              <strong>pages/Cart.jsx:</strong> Shopping cart
                              management
                            </li>
                            <li>
                              <strong>pages/Order.jsx:</strong> Order placement
                              with payment
                            </li>
                            <li>
                              <strong>pages/InvoiceView.jsx:</strong> Invoice
                              display and download
                            </li>
                            <li>
                              <strong>
                                components/common/PaymentOptions.jsx:
                              </strong>{" "}
                              Payment method selection
                            </li>
                            <li>
                              <strong>pages/admin/*:</strong> Admin panel pages
                            </li>
                            <li>
                              <strong>pages/user/*:</strong> User dashboard
                              pages
                            </li>
                          </ul>

                          <h6 className="text-medical-blue mb-3 mt-4">
                            Backend Files:
                          </h6>
                          <ul className="file-list">
                            <li>
                              <strong>server.js:</strong> Express server
                              initialization
                            </li>
                            <li>
                              <strong>models/User.js:</strong> User data schema
                              and methods
                            </li>
                            <li>
                              <strong>models/Product.js:</strong> Product data
                              schema
                            </li>
                            <li>
                              <strong>models/Order.js:</strong> Order data
                              schema with payment info
                            </li>
                            <li>
                              <strong>controllers/authController.js:</strong>{" "}
                              Login, register, JWT handling
                            </li>
                            <li>
                              <strong>controllers/orderController.js:</strong>{" "}
                              Order CRUD operations
                            </li>
                            <li>
                              <strong>controllers/productController.js:</strong>{" "}
                              Product management
                            </li>
                            <li>
                              <strong>middleware/auth.js:</strong> JWT
                              verification middleware
                            </li>
                            <li>
                              <strong>routes/*:</strong> API endpoint
                              definitions
                            </li>
                            <li>
                              <strong>utils/email.js:</strong> Email
                              notification system
                            </li>
                          </ul>
                        </div>
                      </div>

                      <div className="structure-section">
                        <h5>Environment Configuration</h5>
                        <div className="code-block">
                          <pre>{`.env file contents:
# Database
MONGODB_URI=mongodb://localhost:27017/hare-krishna-medical
DB_NAME=hare_krishna_medical

# JWT
JWT_SECRET=your_jwt_secret_key
JWT_REFRESH_SECRET=your_refresh_secret
JWT_EXPIRE=15m
JWT_REFRESH_EXPIRE=7d

# Email
EMAIL_SERVICE=gmail
EMAIL_USER=harekrishnamedical@gmail.com
EMAIL_PASS=your_app_password

# SMS
SMS_API_KEY=your_sms_api_key
SMS_SENDER_ID=HKMED

# Payment
RAZORPAY_KEY_ID=your_razorpay_key_id
RAZORPAY_KEY_SECRET=your_razorpay_secret

# File Storage
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# Server
PORT=5000
NODE_ENV=production`}</pre>
                        </div>
                      </div>
                    </Tab.Pane>

                    <Tab.Pane eventKey="database">
                      <h3 className="text-medical-red mb-4">
                        Database Schema Design
                      </h3>

                      <div className="schema-section">
                        <h5>Users Collection</h5>
                        <div className="code-block">
                          <pre>{`{
  _id: ObjectId,
  fullName: String (required),
  email: String (required, unique),
  mobile: String (required),
  password: String (hashed),
  role: Number (0: User, 1: Admin),
  address: {
    street: String,
    city: String,
    state: String,
    pincode: String
  },
  profileImage: String (URL),
  isActive: Boolean (default: true),
  emailVerified: Boolean (default: false),
  mobileVerified: Boolean (default: false),
  createdAt: Date,
  updatedAt: Date
}`}</pre>
                        </div>
                      </div>

                      <div className="schema-section">
                        <h5>Products Collection</h5>
                        <div className="code-block">
                          <pre>{`{
  _id: ObjectId,
  name: String (required),
  description: String,
  company: String,
  category: String,
  price: Number (required),
  discountPrice: Number,
  stock: Number (required),
  images: [String] (URLs),
  prescription: Boolean (default: false),
  tags: [String],
  isActive: Boolean (default: true),
  createdAt: Date,
  updatedAt: Date
}`}</pre>
                        </div>
                      </div>

                      <div className="schema-section">
                        <h5>Orders Collection</h5>
                        <div className="code-block">
                          <pre>{`{
  _id: ObjectId,
  orderId: String (unique),
  userId: ObjectId (ref: Users),
  items: [{
    productId: ObjectId (ref: Products),
    name: String,
    price: Number,
    quantity: Number,
    total: Number
  }],
  paymentMethod: String (COD, Online),
  paymentStatus: String (Paid, Unpaid, Partial),
  amountPaid: Number (default: 0),
  amountDue: Number,
  orderStatus: String,
  createdAt: Date
}`}</pre>
                        </div>
                      </div>

                      <div className="schema-section">
                        <h5>Messages Collection</h5>
                        <div className="code-block">
                          <pre>{`{
  _id: ObjectId,
  name: String (required),
  email: String (required),
  mobile: String,
  subject: String,
  message: String (required),
  isRead: Boolean (default: false),
  reply: String,
  repliedBy: ObjectId (ref: Users),
  priority: String (Low, Medium, High),
  status: String (Open, In Progress, Resolved),
  createdAt: Date
}`}</pre>
                        </div>
                      </div>
                    </Tab.Pane>

                    <Tab.Pane eventKey="apis">
                      <h3 className="text-medical-red mb-4">API Endpoints</h3>

                      <div className="api-section">
                        <h5>Authentication APIs</h5>
                        <div className="api-list">
                          <div className="api-item">
                            <Badge bg="success">POST</Badge>
                            <span>/api/auth/register</span>
                            <small>User registration</small>
                          </div>
                          <div className="api-item">
                            <Badge bg="success">POST</Badge>
                            <span>/api/auth/login</span>
                            <small>User login</small>
                          </div>
                          <div className="api-item">
                            <Badge bg="success">POST</Badge>
                            <span>/api/auth/forgot-password</span>
                            <small>Password reset request</small>
                          </div>
                          <div className="api-item">
                            <Badge bg="primary">GET</Badge>
                            <span>/api/auth/profile</span>
                            <small>Get user profile</small>
                          </div>
                          <div className="api-item">
                            <Badge bg="warning">PUT</Badge>
                            <span>/api/auth/profile</span>
                            <small>Update user profile</small>
                          </div>
                        </div>
                      </div>

                      <div className="api-section">
                        <h5>Product APIs</h5>
                        <div className="api-list">
                          <div className="api-item">
                            <Badge bg="primary">GET</Badge>
                            <span>/api/products</span>
                            <small>
                              Get products with pagination & filters
                            </small>
                          </div>
                          <div className="api-item">
                            <Badge bg="primary">GET</Badge>
                            <span>/api/products/:id</span>
                            <small>Get single product</small>
                          </div>
                          <div className="api-item">
                            <Badge bg="success">POST</Badge>
                            <span>/api/products</span>
                            <small>Create product (Admin only)</small>
                          </div>
                          <div className="api-item">
                            <Badge bg="warning">PUT</Badge>
                            <span>/api/products/:id</span>
                            <small>Update product (Admin only)</small>
                          </div>
                          <div className="api-item">
                            <Badge bg="danger">DELETE</Badge>
                            <span>/api/products/:id</span>
                            <small>Delete product (Admin only)</small>
                          </div>
                        </div>
                      </div>

                      <div className="api-section">
                        <h5>Order APIs</h5>
                        <div className="api-list">
                          <div className="api-item">
                            <Badge bg="primary">GET</Badge>
                            <span>/api/orders</span>
                            <small>Get orders (Admin: all, User: own)</small>
                          </div>
                          <div className="api-item">
                            <Badge bg="success">POST</Badge>
                            <span>/api/orders</span>
                            <small>Create new order</small>
                          </div>
                          <div className="api-item">
                            <Badge bg="warning">PUT</Badge>
                            <span>/api/orders/:id/payment</span>
                            <small>Update payment status (Admin)</small>
                          </div>
                          <div className="api-item">
                            <Badge bg="primary">GET</Badge>
                            <span>/api/orders/:id/invoice</span>
                            <small>Generate invoice PDF</small>
                          </div>
                        </div>
                      </div>

                      <div className="api-section">
                        <h5>Message APIs</h5>
                        <div className="api-list">
                          <div className="api-item">
                            <Badge bg="primary">GET</Badge>
                            <span>/api/messages</span>
                            <small>Get all messages (Admin only)</small>
                          </div>
                          <div className="api-item">
                            <Badge bg="success">POST</Badge>
                            <span>/api/messages</span>
                            <small>Send contact message</small>
                          </div>
                          <div className="api-item">
                            <Badge bg="warning">PUT</Badge>
                            <span>/api/messages/:id/read</span>
                            <small>Mark message as read (Admin)</small>
                          </div>
                          <div className="api-item">
                            <Badge bg="warning">PUT</Badge>
                            <span>/api/messages/:id/reply</span>
                            <small>Reply to message (Admin)</small>
                          </div>
                        </div>
                      </div>
                    </Tab.Pane>

                    <Tab.Pane eventKey="security">
                      <h3 className="text-medical-red mb-4">
                        Security Implementation
                      </h3>

                      <div className="security-section">
                        <h5>Authentication & Authorization</h5>
                        <ul className="security-list">
                          <li>
                            <strong>JWT Tokens:</strong> Use secure, signed JSON
                            Web Tokens for authentication
                          </li>
                          <li>
                            <strong>Password Hashing:</strong> Use bcryptjs with
                            salt rounds {">"}= 12
                          </li>
                          <li>
                            <strong>Role-based Access:</strong> Implement
                            middleware for admin/user role checking
                          </li>
                          <li>
                            <strong>Token Expiration:</strong> Set appropriate
                            token expiry times (15min access, 7d refresh)
                          </li>
                        </ul>
                      </div>

                      <div className="security-section">
                        <h5>Input Validation & Sanitization</h5>
                        <ul className="security-list">
                          <li>
                            <strong>Request Validation:</strong> Use Joi or
                            express-validator for all endpoints
                          </li>
                          <li>
                            <strong>SQL Injection:</strong> Mongoose ODM
                            provides protection, use parameterized queries
                          </li>
                          <li>
                            <strong>XSS Protection:</strong> Implement helmet.js
                            and sanitize HTML input
                          </li>
                          <li>
                            <strong>File Upload Security:</strong> Validate file
                            types, sizes, and scan for malware
                          </li>
                        </ul>
                      </div>

                      <div className="security-section">
                        <h5>API Security</h5>
                        <ul className="security-list">
                          <li>
                            <strong>Rate Limiting:</strong> Implement
                            express-rate-limit for API endpoints
                          </li>
                          <li>
                            <strong>CORS Configuration:</strong> Configure
                            proper CORS policies
                          </li>
                          <li>
                            <strong>Environment Variables:</strong> Store
                            sensitive data in .env files
                          </li>
                          <li>
                            <strong>Error Handling:</strong> Don't expose
                            sensitive information in error messages
                          </li>
                        </ul>
                      </div>

                      <div className="security-section">
                        <h5>Data Protection</h5>
                        <ul className="security-list">
                          <li>
                            <strong>HTTPS:</strong> Force HTTPS in production
                            environment
                          </li>
                          <li>
                            <strong>Database Security:</strong> Use MongoDB
                            Atlas or secure self-hosted instances
                          </li>
                          <li>
                            <strong>Backup Encryption:</strong> Encrypt database
                            backups
                          </li>
                          <li>
                            <strong>Access Logs:</strong> Log all access
                            attempts and suspicious activities
                          </li>
                        </ul>
                      </div>
                    </Tab.Pane>

                    <Tab.Pane eventKey="deployment">
                      <h3 className="text-medical-red mb-4">
                        Deployment Guide
                      </h3>

                      <div className="deployment-section">
                        <h5>Environment Setup</h5>
                        <div className="code-block">
                          <pre>{`# Required Environment Variables
NODE_ENV=production
PORT=5000
MONGODB_URI=mongodb://localhost:27017/harekrish-medical
JWT_SECRET=your-secret-key
JWT_REFRESH_SECRET=your-refresh-secret

# Email Configuration
EMAIL_SERVICE=gmail
EMAIL_USER=harekrishnamedical@gmail.com
EMAIL_PASS=your-app-password

# SMS Configuration
SMS_API_KEY=your-sms-api-key
SMS_SENDER_ID=HKMED

# Payment Gateway
RAZORPAY_KEY_ID=your-key-id
RAZORPAY_KEY_SECRET=your-key-secret

# File Storage
AWS_ACCESS_KEY_ID=your-access-key
AWS_SECRET_ACCESS_KEY=your-secret-key
S3_BUCKET_NAME=hkmed-assets`}</pre>
                        </div>
                      </div>

                      <div className="deployment-section">
                        <h5>Server Configuration</h5>
                        <ul className="deployment-list">
                          <li>
                            <strong>Node.js Version:</strong> Use LTS version
                            (18.x or 20.x)
                          </li>
                          <li>
                            <strong>Process Management:</strong> Use PM2 for
                            production process management
                          </li>
                          <li>
                            <strong>Reverse Proxy:</strong> Configure Nginx for
                            load balancing and SSL
                          </li>
                          <li>
                            <strong>SSL Certificate:</strong> Use Let's Encrypt
                            for free SSL certificates
                          </li>
                          <li>
                            <strong>Database:</strong> MongoDB Atlas for managed
                            database or secure self-hosted
                          </li>
                        </ul>
                      </div>

                      <div className="deployment-section">
                        <h5>Performance Optimization</h5>
                        <ul className="deployment-list">
                          <li>
                            <strong>Database Indexing:</strong> Create indexes
                            for frequently queried fields
                          </li>
                          <li>
                            <strong>Caching:</strong> Implement Redis for
                            session and data caching
                          </li>
                          <li>
                            <strong>CDN:</strong> Use CloudFlare or AWS
                            CloudFront for static assets
                          </li>
                          <li>
                            <strong>Image Optimization:</strong> Compress and
                            resize images automatically
                          </li>
                          <li>
                            <strong>API Pagination:</strong> Implement proper
                            pagination for large datasets
                          </li>
                        </ul>
                      </div>

                      <div className="deployment-section">
                        <h5>Monitoring & Backup</h5>
                        <ul className="deployment-list">
                          <li>
                            <strong>Application Monitoring:</strong> Use tools
                            like New Relic or DataDog
                          </li>
                          <li>
                            <strong>Error Tracking:</strong> Implement Sentry
                            for error monitoring
                          </li>
                          <li>
                            <strong>Log Management:</strong> Use ELK stack or
                            similar for log analysis
                          </li>
                          <li>
                            <strong>Database Backup:</strong> Automated daily
                            backups with retention policy
                          </li>
                          <li>
                            <strong>Health Checks:</strong> Implement health
                            check endpoints for monitoring
                          </li>
                        </ul>
                      </div>
                    </Tab.Pane>
                  </Tab.Content>
                </Tab.Container>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>

      <style>{`
        .tech-item {
          margin-bottom: 10px;
          display: flex;
          align-items: center;
        }

        .feature-list {
          list-style: none;
          padding-left: 0;
        }

        .feature-list li {
          padding: 5px 0;
          position: relative;
          padding-left: 20px;
        }

        .feature-list li:before {
          content: "✓";
          position: absolute;
          left: 0;
          color: var(--medical-red);
          font-weight: bold;
        }

        .code-block {
          background: #f8f9fa;
          border: 1px solid #e9ecef;
          border-radius: 5px;
          padding: 15px;
          margin: 15px 0;
        }

        .code-block pre {
          margin: 0;
          font-size: 14px;
          color: #495057;
        }

        .schema-section, .api-section, .security-section, .deployment-section {
          margin-bottom: 30px;
        }

        .api-item {
          display: flex;
          align-items: center;
          padding: 10px 0;
          border-bottom: 1px solid #f8f9fa;
        }

        .api-item .badge {
          margin-right: 15px;
          min-width: 60px;
        }

        .api-item span {
          font-family: monospace;
          margin-right: 15px;
          font-weight: bold;
        }

        .api-item small {
          color: #6c757d;
        }

        .security-list, .deployment-list {
          list-style: none;
          padding-left: 0;
        }

        .security-list li, .deployment-list li {
          padding: 8px 0;
          border-bottom: 1px solid #f8f9fa;
          position: relative;
          padding-left: 25px;
        }

        .security-list li:before, .deployment-list li:before {
          content: "•";
          position: absolute;
          left: 0;
          color: var(--medical-red);
          font-weight: bold;
          font-size: 1.2rem;
        }
      `}</style>
    </div>
  );
};

export default BackendDocs;
