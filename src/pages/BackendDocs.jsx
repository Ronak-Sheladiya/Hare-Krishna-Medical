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
  Accordion,
  Alert,
} from "react-bootstrap";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

const BackendDocs = () => {
  const [activeTab, setActiveTab] = useState("overview");
  const [showCopyAlert, setShowCopyAlert] = useState(false);
  const [copiedFile, setCopiedFile] = useState("");

  // Copy to clipboard function
  const copyToClipboard = (text, fileName) => {
    navigator.clipboard.writeText(text).then(() => {
      setCopiedFile(fileName);
      setShowCopyAlert(true);
      setTimeout(() => setShowCopyAlert(false), 2000);
    });
  };

  // Code component with copy button
  const CodeBlock = ({ title, code, language = "javascript", fileName }) => (
    <Card className="mb-4" style={{ borderRadius: "12px" }}>
      <Card.Header
        style={{
          background: "linear-gradient(135deg, #343a40, #495057)",
          color: "white",
          borderRadius: "12px 12px 0 0",
        }}
      >
        <div className="d-flex justify-content-between align-items-center">
          <h6 className="mb-0">
            <i className="bi bi-file-earmark-code me-2"></i>
            {title}
          </h6>
          <Button
            variant="outline-light"
            size="sm"
            onClick={() => copyToClipboard(code, fileName)}
            style={{ borderRadius: "6px" }}
          >
            <i className="bi bi-clipboard me-2"></i>
            Copy Code
          </Button>
        </div>
      </Card.Header>
      <Card.Body style={{ padding: "0" }}>
        <pre
          style={{
            background: "#f8f9fa",
            margin: "0",
            padding: "20px",
            borderRadius: "0 0 12px 12px",
            overflow: "auto",
            fontSize: "14px",
            lineHeight: "1.5",
            color: "#333",
          }}
        >
          <code>{code}</code>
        </pre>
      </Card.Body>
    </Card>
  );

  // Terminal command component
  const TerminalCommand = ({ command, output, description }) => (
    <Card className="mb-3" style={{ borderRadius: "8px" }}>
      <Card.Body style={{ padding: "15px" }}>
        <div className="mb-2">
          <strong>{description}</strong>
        </div>
        <div
          style={{
            background: "#1e1e1e",
            color: "#00ff00",
            padding: "10px",
            borderRadius: "6px",
            fontFamily: "monospace",
            fontSize: "14px",
          }}
        >
          <div style={{ color: "#ffff00" }}>$ {command}</div>
          {output && (
            <div style={{ color: "#ffffff", marginTop: "5px" }}>{output}</div>
          )}
        </div>
        <Button
          variant="outline-primary"
          size="sm"
          onClick={() => copyToClipboard(command, "command")}
          className="mt-2"
          style={{ borderRadius: "6px" }}
        >
          <i className="bi bi-clipboard me-1"></i>
          Copy Command
        </Button>
      </Card.Body>
    </Card>
  );

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
    }
  };

  // Backend code examples
  const backendCodes = {
    packageJson: `{
  "name": "hare-krishna-medical-backend",
  "version": "1.0.0",
  "description": "Backend API for Hare Krishna Medical Store",
  "main": "server.js",
  "scripts": {
    "start": "node server.js",
    "dev": "nodemon server.js",
    "test": "jest",
    "seed": "node scripts/seed.js"
  },
  "dependencies": {
    "express": "^4.18.2",
    "mongoose": "^7.5.0",
    "bcryptjs": "^2.4.3",
    "jsonwebtoken": "^9.0.2",
    "cors": "^2.8.5",
    "helmet": "^7.0.0",
    "express-rate-limit": "^6.10.0",
    "express-validator": "^7.0.1",
    "nodemailer": "^6.9.4",
    "multer": "^1.4.5",
    "cloudinary": "^1.40.0",
    "razorpay": "^2.9.2",
    "qrcode": "^1.5.3",
    "xlsx": "^0.18.5",
    "pdfkit": "^0.13.0",
    "twilio": "^4.15.0",
    "dotenv": "^16.3.1"
  },
  "devDependencies": {
    "nodemon": "^3.0.1",
    "jest": "^29.6.2",
    "supertest": "^6.3.3"
  },
  "engines": {
    "node": ">=16.0.0"
  }
}`,

    serverJs: `const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
require('dotenv').config();

const app = express();

// Security Middleware
app.use(helmet());
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true
}));

// Rate Limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again later.'
});
app.use('/api/', limiter);

// Body Parser Middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Database Connection
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('✅ Connected to MongoDB'))
.catch(err => console.error('❌ MongoDB connection error:', err));

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/users', require('./routes/users'));
app.use('/api/products', require('./routes/products'));
app.use('/api/orders', require('./routes/orders'));
app.use('/api/invoices', require('./routes/invoices'));
app.use('/api/messages', require('./routes/messages'));
app.use('/api/analytics', require('./routes/analytics'));
app.use('/api/upload', require('./routes/upload'));

// Health Check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: process.env.NODE_ENV
  });
});

// Error Handling Middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    message: 'Something went wrong!',
    error: process.env.NODE_ENV === 'development' ? err.message : 'Internal Server Error'
  });
});

// 404 Handler
app.use('*', (req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(\`🚀 Server running on port \${PORT}\`);
});

module.exports = app;`,

    userModel: `const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  fullName: {
    type: String,
    required: [true, 'Full name is required'],
    trim: true,
    maxlength: [100, 'Name cannot be more than 100 characters']
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,
    match: [/^\\w+([\\.-]?\\w+)*@\\w+([\\.-]?\\w+)*(\\.\\w{2,3})+$/, 'Please enter a valid email']
  },
  mobile: {
    type: String,
    required: [true, 'Mobile number is required'],
    match: [/^[6-9]\\d{9}$/, 'Please enter a valid mobile number']
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: [6, 'Password must be at least 6 characters']
  },
  role: {
    type: Number,
    default: 0, // 0: User, 1: Admin
    enum: [0, 1]
  },
  address: {
    street: { type: String, required: true },
    city: { type: String, required: true },
    state: { type: String, required: true },
    pincode: {
      type: String,
      required: true,
      match: [/^\\d{6}$/, 'Please enter a valid pincode']
    }
  },
  isActive: {
    type: Boolean,
    default: true
  },
  emailVerified: {
    type: Boolean,
    default: false
  },
  mobileVerified: {
    type: Boolean,
    default: false
  },
  lastLogin: {
    type: Date,
    default: Date.now
  },
  loginAttempts: {
    type: Number,
    default: 0
  },
  lockUntil: Date,
  resetPasswordToken: String,
  resetPasswordExpires: Date,
  emailVerificationToken: String,
  emailVerificationExpires: Date
}, {
  timestamps: true
});

// Indexes
userSchema.index({ email: 1 });
userSchema.index({ mobile: 1 });
userSchema.index({ role: 1 });

// Virtual for account lock
userSchema.virtual('isLocked').get(function() {
  return !!(this.lockUntil && this.lockUntil > Date.now());
});

// Pre-save middleware to hash password
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();

  try {
    const salt = await bcrypt.genSalt(12);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Method to compare password
userSchema.methods.comparePassword = async function(candidatePassword) {
  try {
    return await bcrypt.compare(candidatePassword, this.password);
  } catch (error) {
    throw new Error('Password comparison failed');
  }
};

// Method to increment login attempts
userSchema.methods.incLoginAttempts = function() {
  // If we have a previous lock that has expired, restart at 1
  if (this.lockUntil && this.lockUntil < Date.now()) {
    return this.updateOne({
      $unset: { lockUntil: 1 },
      $set: { loginAttempts: 1 }
    });
  }

  const updates = { $inc: { loginAttempts: 1 } };

  // Lock account after 5 attempts for 2 hours
  if (this.loginAttempts + 1 >= 5 && !this.isLocked) {
    updates.$set = { lockUntil: Date.now() + 2 * 60 * 60 * 1000 };
  }

  return this.updateOne(updates);
};

// Method to reset login attempts
userSchema.methods.resetLoginAttempts = function() {
  return this.updateOne({
    $unset: { loginAttempts: 1, lockUntil: 1 }
  });
};

// Transform output
userSchema.methods.toJSON = function() {
  const user = this.toObject();
  delete user.password;
  delete user.resetPasswordToken;
  delete user.resetPasswordExpires;
  delete user.emailVerificationToken;
  delete user.emailVerificationExpires;
  delete user.loginAttempts;
  delete user.lockUntil;
  return user;
};

module.exports = mongoose.model('User', userSchema);`,

    productModel: `const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Product name is required'],
    trim: true,
    maxlength: [200, 'Product name cannot exceed 200 characters']
  },
  company: {
    type: String,
    required: [true, 'Company name is required'],
    trim: true
  },
  description: {
    type: String,
    required: [true, 'Product description is required'],
    maxlength: [2000, 'Description cannot exceed 2000 characters']
  },
  price: {
    type: Number,
    required: [true, 'Price is required'],
    min: [0, 'Price cannot be negative']
  },
  originalPrice: {
    type: Number,
    default: function() { return this.price; }
  },
  category: {
    type: String,
    required: [true, 'Category is required'],
    enum: [
      'Pain Relief',
      'Vitamins',
      'Cough & Cold',
      'First Aid',
      'Equipment',
      'Ayurvedic',
      'Baby Care',
      'Personal Care',
      'Other'
    ]
  },
  stock: {
    type: Number,
    required: [true, 'Stock quantity is required'],
    min: [0, 'Stock cannot be negative'],
    default: 0
  },
  lowStockThreshold: {
    type: Number,
    default: 10
  },
  sku: {
    type: String,
    unique: true,
    sparse: true
  },
  images: [{
    url: { type: String, required: true },
    altText: String,
    isPrimary: { type: Boolean, default: false }
  }],
  specifications: {
    weight: String,
    dimensions: String,
    ingredients: String,
    dosage: String,
    sideEffects: String,
    contraindications: String,
    manufacturer: String,
    mfgDate: Date,
    expiryDate: Date,
    batchNumber: String
  },
  tags: [String],
  isActive: {
    type: Boolean,
    default: true
  },
  isFeatured: {
    type: Boolean,
    default: false
  },
  requiresPrescription: {
    type: Boolean,
    default: false
  },
  ratings: {
    average: { type: Number, default: 0, min: 0, max: 5 },
    count: { type: Number, default: 0 }
  },
  sales: {
    totalSold: { type: Number, default: 0 },
    revenue: { type: Number, default: 0 }
  },
  seo: {
    metaTitle: String,
    metaDescription: String,
    keywords: [String]
  }
}, {
  timestamps: true
});

// Indexes
productSchema.index({ name: 'text', description: 'text', company: 'text' });
productSchema.index({ category: 1 });
productSchema.index({ price: 1 });
productSchema.index({ stock: 1 });
productSchema.index({ isActive: 1 });
productSchema.index({ isFeatured: 1 });
productSchema.index({ 'ratings.average': -1 });
productSchema.index({ 'sales.totalSold': -1 });
productSchema.index({ createdAt: -1 });

// Virtual for discount percentage
productSchema.virtual('discountPercentage').get(function() {
  if (this.originalPrice && this.originalPrice > this.price) {
    return Math.round(((this.originalPrice - this.price) / this.originalPrice) * 100);
  }
  return 0;
});

// Virtual for stock status
productSchema.virtual('stockStatus').get(function() {
  if (this.stock === 0) return 'out_of_stock';
  if (this.stock <= this.lowStockThreshold) return 'low_stock';
  return 'in_stock';
});

// Virtual for primary image
productSchema.virtual('primaryImage').get(function() {
  if (this.images && this.images.length > 0) {
    const primary = this.images.find(img => img.isPrimary);
    return primary || this.images[0];
  }
  return null;
});

// Pre-save middleware to generate SKU
productSchema.pre('save', function(next) {
  if (!this.sku) {
    const prefix = this.category.substring(0, 3).toUpperCase();
    const timestamp = Date.now().toString().substring(8);
    this.sku = \`HKM-\${prefix}-\${timestamp}\`;
  }
  next();
});

// Method to update stock
productSchema.methods.updateStock = function(quantity, operation = 'subtract') {
  if (operation === 'subtract') {
    this.stock = Math.max(0, this.stock - quantity);
  } else if (operation === 'add') {
    this.stock += quantity;
  }
  return this.save();
};

// Method to update sales
productSchema.methods.updateSales = function(quantity, amount) {
  this.sales.totalSold += quantity;
  this.sales.revenue += amount;
  return this.save();
};

// Static method to find low stock products
productSchema.statics.findLowStock = function() {
  return this.find({
    $expr: { $lte: ['$stock', '$lowStockThreshold'] },
    isActive: true
  });
};

// Static method to search products
productSchema.statics.searchProducts = function(query, options = {}) {
  const {
    category,
    minPrice,
    maxPrice,
    inStock = true,
    sort = 'createdAt',
    page = 1,
    limit = 20
  } = options;

  const filter = { isActive: true };

  if (query) {
    filter.$text = { $search: query };
  }

  if (category) {
    filter.category = category;
  }

  if (minPrice || maxPrice) {
    filter.price = {};
    if (minPrice) filter.price.$gte = minPrice;
    if (maxPrice) filter.price.$lte = maxPrice;
  }

  if (inStock) {
    filter.stock = { $gt: 0 };
  }

  const skip = (page - 1) * limit;

  return this.find(filter)
    .sort(sort)
    .skip(skip)
    .limit(limit);
};

module.exports = mongoose.model('Product', productSchema);`,

    orderModel: `const mongoose = require('mongoose');

const orderItemSchema = new mongoose.Schema({
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: true
  },
  name: { type: String, required: true },
  company: { type: String, required: true },
  price: { type: Number, required: true },
  quantity: {
    type: Number,
    required: true,
    min: [1, 'Quantity must be at least 1']
  },
  total: { type: Number, required: true }
});

const orderSchema = new mongoose.Schema({
  orderId: {
    type: String,
    unique: true,
    required: true
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  customerDetails: {
    fullName: { type: String, required: true },
    email: { type: String, required: true },
    mobile: { type: String, required: true },
    address: { type: String, required: true },
    city: { type: String, required: true },
    state: { type: String, required: true },
    pincode: { type: String, required: true }
  },
  items: [orderItemSchema],
  pricing: {
    subtotal: { type: Number, required: true },
    shipping: { type: Number, default: 0 },
    tax: { type: Number, default: 0 },
    discount: { type: Number, default: 0 },
    total: { type: Number, required: true }
  },
  payment: {
    method: {
      type: String,
      required: true,
      enum: ['COD', 'Online', 'Card', 'UPI', 'NetBanking', 'Wallet']
    },
    status: {
      type: String,
      default: 'Pending',
      enum: ['Pending', 'Completed', 'Failed', 'Refunded', 'Cancelled']
    },
    transactionId: String,
    paidAt: Date,
    refundId: String,
    refundedAt: Date
  },
  status: {
    type: String,
    default: 'Pending',
    enum: ['Pending', 'Confirmed', 'Processing', 'Shipped', 'Delivered', 'Cancelled', 'Returned']
  },
  statusHistory: [{
    status: String,
    timestamp: { type: Date, default: Date.now },
    note: String,
    updatedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    }
  }],
  shipping: {
    address: {
      street: String,
      city: String,
      state: String,
      pincode: String
    },
    method: { type: String, default: 'Standard' },
    trackingNumber: String,
    estimatedDelivery: Date,
    actualDelivery: Date,
    carrier: String
  },
  notes: {
    customer: String,
    admin: String,
    delivery: String
  },
  invoice: {
    invoiceId: String,
    generatedAt: Date,
    qrCode: String
  },
  cancellation: {
    reason: String,
    cancelledBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    cancelledAt: Date,
    refundStatus: {
      type: String,
      enum: ['Pending', 'Processed', 'Completed']
    }
  }
}, {
  timestamps: true
});

// Indexes
orderSchema.index({ orderId: 1 });
orderSchema.index({ user: 1 });
orderSchema.index({ status: 1 });
orderSchema.index({ 'payment.status': 1 });
orderSchema.index({ createdAt: -1 });
orderSchema.index({ 'customerDetails.email': 1 });
orderSchema.index({ 'customerDetails.mobile': 1 });

// Pre-save middleware to generate orderId
orderSchema.pre('save', function(next) {
  if (!this.orderId) {
    const timestamp = Date.now().toString();
    const random = Math.random().toString(36).substring(2, 8).toUpperCase();
    this.orderId = \`HKM\${timestamp.substring(8)}\${random}\`;
  }
  next();
});

// Method to add status update
orderSchema.methods.updateStatus = function(newStatus, note = '', updatedBy = null) {
  this.status = newStatus;
  this.statusHistory.push({
    status: newStatus,
    note,
    updatedBy,
    timestamp: new Date()
  });

  // Auto-update payment status for certain order statuses
  if (newStatus === 'Delivered' && this.payment.method === 'COD') {
    this.payment.status = 'Completed';
    this.payment.paidAt = new Date();
  }

  return this.save();
};

// Method to cancel order
orderSchema.methods.cancelOrder = function(reason, cancelledBy) {
  this.status = 'Cancelled';
  this.cancellation = {
    reason,
    cancelledBy,
    cancelledAt: new Date(),
    refundStatus: this.payment.status === 'Completed' ? 'Pending' : null
  };

  this.statusHistory.push({
    status: 'Cancelled',
    note: \`Order cancelled: \${reason}\`,
    updatedBy: cancelledBy,
    timestamp: new Date()
  });

  return this.save();
};

// Method to calculate totals
orderSchema.methods.calculateTotals = function() {
  this.pricing.subtotal = this.items.reduce((sum, item) => sum + item.total, 0);
  this.pricing.total = this.pricing.subtotal + this.pricing.shipping + this.pricing.tax - this.pricing.discount;
  return this;
};

// Static method to get orders by status
orderSchema.statics.getOrdersByStatus = function(status) {
  return this.find({ status }).populate('user', 'fullName email mobile');
};

// Static method to get daily sales
orderSchema.statics.getDailySales = function(date = new Date()) {
  const startOfDay = new Date(date);
  startOfDay.setHours(0, 0, 0, 0);

  const endOfDay = new Date(date);
  endOfDay.setHours(23, 59, 59, 999);

  return this.aggregate([
    {
      $match: {
        createdAt: { $gte: startOfDay, $lte: endOfDay },
        status: { $nin: ['Cancelled', 'Returned'] }
      }
    },
    {
      $group: {
        _id: null,
        totalOrders: { $sum: 1 },
        totalRevenue: { $sum: '$pricing.total' },
        averageOrderValue: { $avg: '$pricing.total' }
      }
    }
  ]);
};

module.exports = mongoose.model('Order', orderSchema);`,

    authRoutes: `const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { body, validationResult } = require('express-validator');
const rateLimit = require('express-rate-limit');
const User = require('../models/User');
const auth = require('../middleware/auth');
const sendEmail = require('../utils/sendEmail');

// Rate limiting for auth routes
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // limit each IP to 5 requests per windowMs
  message: 'Too many authentication attempts, please try again later.'
});

// @route   POST /api/auth/register
// @desc    Register a new user
// @access  Public
router.post('/register', [
  authLimiter,
  body('fullName').trim().isLength({ min: 2, max: 100 }).withMessage('Name must be between 2-100 characters'),
  body('email').isEmail().normalizeEmail().withMessage('Please enter a valid email'),
  body('mobile').matches(/^[6-9]\\d{9}$/).withMessage('Please enter a valid mobile number'),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
  body('address.street').notEmpty().withMessage('Street address is required'),
  body('address.city').notEmpty().withMessage('City is required'),
  body('address.state').notEmpty().withMessage('State is required'),
  body('address.pincode').matches(/^\\d{6}$/).withMessage('Please enter a valid pincode')
], async (req, res) => {
  try {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation errors',
        errors: errors.array()
      });
    }

    const { fullName, email, mobile, password, address } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({
      $or: [{ email }, { mobile }]
    });

    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'User already exists with this email or mobile number'
      });
    }

    // Create new user
    const user = new User({
      fullName,
      email,
      mobile,
      password,
      address
    });

    await user.save();

    // Generate JWT token
    const payload = {
      user: {
        id: user._id,
        role: user.role
      }
    };

    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '7d' });

    // Send welcome email
    try {
      await sendEmail({
        to: user.email,
        subject: 'Welcome to Hare Krishna Medical',
        template: 'welcome',
        data: { fullName: user.fullName }
      });
    } catch (emailError) {
      console.error('Email sending failed:', emailError);
    }

    res.status(201).json({
      success: true,
      message: 'User registered successfully',
      token,
      user: user.toJSON()
    });

  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error during registration'
    });
  }
});

// @route   POST /api/auth/login
// @desc    Login user
// @access  Public
router.post('/login', [
  authLimiter,
  body('email').isEmail().normalizeEmail().withMessage('Please enter a valid email'),
  body('password').notEmpty().withMessage('Password is required')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation errors',
        errors: errors.array()
      });
    }

    const { email, password } = req.body;

    // Find user by email
    const user = await User.findOne({ email, isActive: true });
    if (!user) {
      return res.status(400).json({
        success: false,
        message: 'Invalid credentials'
      });
    }

    // Check if account is locked
    if (user.isLocked) {
      return res.status(423).json({
        success: false,
        message: 'Account temporarily locked due to too many failed login attempts'
      });
    }

    // Compare password
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      await user.incLoginAttempts();
      return res.status(400).json({
        success: false,
        message: 'Invalid credentials'
      });
    }

    // Reset login attempts on successful login
    if (user.loginAttempts > 0) {
      await user.resetLoginAttempts();
    }

    // Update last login
    user.lastLogin = new Date();
    await user.save();

    // Generate JWT token
    const payload = {
      user: {
        id: user._id,
        role: user.role
      }
    };

    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '7d' });

    res.json({
      success: true,
      message: 'Login successful',
      token,
      user: user.toJSON()
    });

  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error during login'
    });
  }
});

// @route   GET /api/auth/me
// @desc    Get current user
// @access  Private
router.get('/me', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    res.json({
      success: true,
      user
    });
  } catch (error) {
    console.error('Get user error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @route   POST /api/auth/forgot-password
// @desc    Send password reset email
// @access  Public
router.post('/forgot-password', [
  authLimiter,
  body('email').isEmail().normalizeEmail().withMessage('Please enter a valid email')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation errors',
        errors: errors.array()
      });
    }

    const { email } = req.body;
    const user = await User.findOne({ email, isActive: true });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found with this email'
      });
    }

    // Generate reset token
    const resetToken = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    user.resetPasswordToken = resetToken;
    user.resetPasswordExpires = Date.now() + 3600000; // 1 hour
    await user.save();

    // Send reset email
    const resetUrl = \`\${process.env.FRONTEND_URL}/reset-password?token=\${resetToken}\`;

    try {
      await sendEmail({
        to: user.email,
        subject: 'Password Reset Request - Hare Krishna Medical',
        template: 'passwordReset',
        data: {
          fullName: user.fullName,
          resetUrl,
          expiresIn: '1 hour'
        }
      });

      res.json({
        success: true,
        message: 'Password reset email sent successfully'
      });
    } catch (emailError) {
      user.resetPasswordToken = undefined;
      user.resetPasswordExpires = undefined;
      await user.save();

      throw emailError;
    }

  } catch (error) {
    console.error('Forgot password error:', error);
    res.status(500).json({
      success: false,
      message: 'Error sending password reset email'
    });
  }
});

// @route   POST /api/auth/reset-password
// @desc    Reset password with token
// @access  Public
router.post('/reset-password', [
  body('token').notEmpty().withMessage('Reset token is required'),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation errors',
        errors: errors.array()
      });
    }

    const { token, password } = req.body;

    // Verify token
    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch (error) {
      return res.status(400).json({
        success: false,
        message: 'Invalid or expired reset token'
      });
    }

    // Find user with valid reset token
    const user = await User.findOne({
      _id: decoded.userId,
      resetPasswordToken: token,
      resetPasswordExpires: { $gt: Date.now() },
      isActive: true
    });

    if (!user) {
      return res.status(400).json({
        success: false,
        message: 'Invalid or expired reset token'
      });
    }

    // Update password
    user.password = password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    user.loginAttempts = 0;
    user.lockUntil = undefined;

    await user.save();

    res.json({
      success: true,
      message: 'Password reset successfully'
    });

  } catch (error) {
    console.error('Reset password error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error during password reset'
    });
  }
});

// @route   POST /api/auth/change-password
// @desc    Change password for authenticated user
// @access  Private
router.post('/change-password', [
  auth,
  body('currentPassword').notEmpty().withMessage('Current password is required'),
  body('newPassword').isLength({ min: 6 }).withMessage('New password must be at least 6 characters')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation errors',
        errors: errors.array()
      });
    }

    const { currentPassword, newPassword } = req.body;
    const user = await User.findById(req.user.id);

    // Verify current password
    const isMatch = await user.comparePassword(currentPassword);
    if (!isMatch) {
      return res.status(400).json({
        success: false,
        message: 'Current password is incorrect'
      });
    }

    // Update password
    user.password = newPassword;
    await user.save();

    res.json({
      success: true,
      message: 'Password changed successfully'
    });

  } catch (error) {
    console.error('Change password error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error during password change'
    });
  }
});

module.exports = router;`,

    envExample: `# Server Configuration
NODE_ENV=development
PORT=5000

# Database
MONGODB_URI=mongodb://localhost:27017/hare-krishna-medical

# JWT
JWT_SECRET=your-super-secret-jwt-key-here

# Frontend URL
FRONTEND_URL=http://localhost:3000

# Email Configuration (Gmail)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password

# Cloudinary (Image Upload)
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret

# Razorpay (Payment Gateway)
RAZORPAY_KEY_ID=your-razorpay-key-id
RAZORPAY_KEY_SECRET=your-razorpay-key-secret

# Twilio (SMS)
TWILIO_ACCOUNT_SID=your-twilio-account-sid
TWILIO_AUTH_TOKEN=your-twilio-auth-token
TWILIO_PHONE_NUMBER=your-twilio-phone-number

# Security
BCRYPT_ROUNDS=12
SESSION_SECRET=your-session-secret

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100

# File Upload
MAX_FILE_SIZE=10485760
ALLOWED_FILE_TYPES=image/jpeg,image/png,image/gif,image/webp`,
  };

  return (
    <div className="fade-in">
      {/* Copy Alert */}
      {showCopyAlert && (
        <div
          style={{
            position: "fixed",
            top: "20px",
            right: "20px",
            zIndex: 9999,
          }}
        >
          <Alert
            variant="success"
            style={{
              borderRadius: "12px",
              boxShadow: "0 8px 32px rgba(0,0,0,0.1)",
            }}
          >
            <i className="bi bi-check-circle me-2"></i>
            {copiedFile} copied to clipboard!
          </Alert>
        </div>
      )}

      <section
        style={{
          paddingTop: "2rem",
          paddingBottom: "2rem",
          minHeight: "100vh",
          background: "linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%)",
        }}
      >
        <Container>
          {/* Enhanced Header */}
          <Row className="mb-4">
            <Col lg={12}>
              <Card
                style={{
                  border: "none",
                  borderRadius: "20px",
                  background: "linear-gradient(135deg, #343a40, #495057)",
                  color: "white",
                  boxShadow: "0 15px 50px rgba(52, 58, 64, 0.3)",
                }}
              >
                <Card.Body style={{ padding: "30px" }}>
                  <Row className="align-items-center">
                    <Col lg={8}>
                      <div className="d-flex align-items-center">
                        <div
                          style={{
                            width: "60px",
                            height: "60px",
                            background: "rgba(255, 255, 255, 0.2)",
                            borderRadius: "50%",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            marginRight: "20px",
                          }}
                        >
                          <i
                            className="bi bi-code-slash"
                            style={{ fontSize: "28px" }}
                          ></i>
                        </div>
                        <div>
                          <h1
                            style={{
                              fontWeight: "800",
                              marginBottom: "5px",
                              fontSize: "2.2rem",
                            }}
                          >
                            Backend Documentation
                          </h1>
                          <p
                            style={{
                              opacity: "0.9",
                              marginBottom: "0",
                              fontSize: "1.1rem",
                            }}
                          >
                            Complete implementation guide with code examples
                          </p>
                        </div>
                      </div>
                    </Col>
                    <Col lg={4} className="text-end">
                      <Button
                        variant="light"
                        onClick={downloadDocumentation}
                        style={{
                          borderRadius: "8px",
                          fontWeight: "600",
                          padding: "12px 24px",
                        }}
                      >
                        <i className="bi bi-download me-2"></i>
                        Download PDF
                      </Button>
                    </Col>
                  </Row>
                </Card.Body>
              </Card>
            </Col>
          </Row>

          <div id="documentation-content">
            <Tab.Container activeKey={activeTab} onSelect={setActiveTab}>
              <Row>
                <Col lg={3}>
                  <Card
                    style={{
                      border: "none",
                      borderRadius: "16px",
                      boxShadow: "0 8px 32px rgba(0,0,0,0.08)",
                      position: "sticky",
                      top: "20px",
                    }}
                  >
                    <Card.Header
                      style={{
                        background: "linear-gradient(135deg, #e63946, #dc3545)",
                        color: "white",
                        borderRadius: "16px 16px 0 0",
                        padding: "20px",
                      }}
                    >
                      <h6 className="mb-0" style={{ fontWeight: "700" }}>
                        <i className="bi bi-list-ul me-2"></i>
                        Navigation
                      </h6>
                    </Card.Header>
                    <Card.Body style={{ padding: "20px" }}>
                      <Nav variant="pills" className="flex-column">
                        <Nav.Item className="mb-2">
                          <Nav.Link
                            eventKey="overview"
                            style={{
                              borderRadius: "8px",
                              fontWeight: "600",
                              color:
                                activeTab === "overview" ? "white" : "#333",
                              background:
                                activeTab === "overview"
                                  ? "linear-gradient(135deg, #e63946, #dc3545)"
                                  : "transparent",
                            }}
                          >
                            <i className="bi bi-info-circle me-2"></i>
                            Overview
                          </Nav.Link>
                        </Nav.Item>
                        <Nav.Item className="mb-2">
                          <Nav.Link
                            eventKey="setup"
                            style={{
                              borderRadius: "8px",
                              fontWeight: "600",
                              color: activeTab === "setup" ? "white" : "#333",
                              background:
                                activeTab === "setup"
                                  ? "linear-gradient(135deg, #e63946, #dc3545)"
                                  : "transparent",
                            }}
                          >
                            <i className="bi bi-gear me-2"></i>
                            Project Setup
                          </Nav.Link>
                        </Nav.Item>
                        <Nav.Item className="mb-2">
                          <Nav.Link
                            eventKey="models"
                            style={{
                              borderRadius: "8px",
                              fontWeight: "600",
                              color: activeTab === "models" ? "white" : "#333",
                              background:
                                activeTab === "models"
                                  ? "linear-gradient(135deg, #e63946, #dc3545)"
                                  : "transparent",
                            }}
                          >
                            <i className="bi bi-database me-2"></i>
                            Database Models
                          </Nav.Link>
                        </Nav.Item>
                        <Nav.Item className="mb-2">
                          <Nav.Link
                            eventKey="routes"
                            style={{
                              borderRadius: "8px",
                              fontWeight: "600",
                              color: activeTab === "routes" ? "white" : "#333",
                              background:
                                activeTab === "routes"
                                  ? "linear-gradient(135deg, #e63946, #dc3545)"
                                  : "transparent",
                            }}
                          >
                            <i className="bi bi-arrow-left-right me-2"></i>
                            API Routes
                          </Nav.Link>
                        </Nav.Item>
                        <Nav.Item className="mb-2">
                          <Nav.Link
                            eventKey="deployment"
                            style={{
                              borderRadius: "8px",
                              fontWeight: "600",
                              color:
                                activeTab === "deployment" ? "white" : "#333",
                              background:
                                activeTab === "deployment"
                                  ? "linear-gradient(135deg, #e63946, #dc3545)"
                                  : "transparent",
                            }}
                          >
                            <i className="bi bi-cloud-upload me-2"></i>
                            Deployment
                          </Nav.Link>
                        </Nav.Item>
                      </Nav>
                    </Card.Body>
                  </Card>
                </Col>

                <Col lg={9}>
                  <Tab.Content>
                    {/* Overview Tab */}
                    <Tab.Pane eventKey="overview">
                      <Card
                        style={{
                          border: "none",
                          borderRadius: "16px",
                          boxShadow: "0 8px 32px rgba(0,0,0,0.08)",
                        }}
                      >
                        <Card.Header
                          style={{
                            background:
                              "linear-gradient(135deg, #17a2b8, #20c997)",
                            color: "white",
                            borderRadius: "16px 16px 0 0",
                            padding: "20px",
                          }}
                        >
                          <h5 className="mb-0" style={{ fontWeight: "700" }}>
                            <i className="bi bi-info-circle me-2"></i>
                            Project Overview
                          </h5>
                        </Card.Header>
                        <Card.Body style={{ padding: "30px" }}>
                          <div className="mb-4">
                            <h6>🎯 Project Features</h6>
                            <Row>
                              <Col md={6}>
                                <ul style={{ paddingLeft: "20px" }}>
                                  <li>User Authentication & Authorization</li>
                                  <li>Product Management System</li>
                                  <li>Order Processing & Tracking</li>
                                  <li>Invoice Generation with QR Codes</li>
                                  <li>Payment Gateway Integration</li>
                                  <li>Real-time Analytics Dashboard</li>
                                </ul>
                              </Col>
                              <Col md={6}>
                                <ul style={{ paddingLeft: "20px" }}>
                                  <li>Admin Panel with Role Management</li>
                                  <li>Email & SMS Notifications</li>
                                  <li>File Upload & Cloud Storage</li>
                                  <li>RESTful API with Validation</li>
                                  <li>Security & Rate Limiting</li>
                                  <li>Comprehensive Error Handling</li>
                                </ul>
                              </Col>
                            </Row>
                          </div>

                          <div className="mb-4">
                            <h6>🛠️ Technology Stack</h6>
                            <Row>
                              <Col md={4}>
                                <Card
                                  style={{
                                    border: "1px solid #e9ecef",
                                    borderRadius: "8px",
                                    marginBottom: "15px",
                                  }}
                                >
                                  <Card.Body style={{ padding: "15px" }}>
                                    <h6 style={{ color: "#e63946" }}>
                                      Backend
                                    </h6>
                                    <ul style={{ fontSize: "14px", margin: 0 }}>
                                      <li>Node.js + Express.js</li>
                                      <li>MongoDB + Mongoose</li>
                                      <li>JWT Authentication</li>
                                    </ul>
                                  </Card.Body>
                                </Card>
                              </Col>
                              <Col md={4}>
                                <Card
                                  style={{
                                    border: "1px solid #e9ecef",
                                    borderRadius: "8px",
                                    marginBottom: "15px",
                                  }}
                                >
                                  <Card.Body style={{ padding: "15px" }}>
                                    <h6 style={{ color: "#28a745" }}>
                                      Security
                                    </h6>
                                    <ul style={{ fontSize: "14px", margin: 0 }}>
                                      <li>Helmet.js</li>
                                      <li>Rate Limiting</li>
                                      <li>Input Validation</li>
                                    </ul>
                                  </Card.Body>
                                </Card>
                              </Col>
                              <Col md={4}>
                                <Card
                                  style={{
                                    border: "1px solid #e9ecef",
                                    borderRadius: "8px",
                                    marginBottom: "15px",
                                  }}
                                >
                                  <Card.Body style={{ padding: "15px" }}>
                                    <h6 style={{ color: "#17a2b8" }}>
                                      Integrations
                                    </h6>
                                    <ul style={{ fontSize: "14px", margin: 0 }}>
                                      <li>Razorpay Payments</li>
                                      <li>Cloudinary Storage</li>
                                      <li>Nodemailer + Twilio</li>
                                    </ul>
                                  </Card.Body>
                                </Card>
                              </Col>
                            </Row>
                          </div>

                          <Alert variant="info" style={{ borderRadius: "8px" }}>
                            <Alert.Heading style={{ fontSize: "16px" }}>
                              💡 Getting Started
                            </Alert.Heading>
                            <p style={{ marginBottom: 0 }}>
                              This documentation provides complete code examples
                              for implementing the Hare Krishna Medical backend.
                              Each section includes working code with copy
                              buttons for easy implementation. Start with the
                              Project Setup tab to begin implementation.
                            </p>
                          </Alert>
                        </Card.Body>
                      </Card>
                    </Tab.Pane>

                    {/* Project Setup Tab */}
                    <Tab.Pane eventKey="setup">
                      <Card
                        style={{
                          border: "none",
                          borderRadius: "16px",
                          boxShadow: "0 8px 32px rgba(0,0,0,0.08)",
                        }}
                      >
                        <Card.Header
                          style={{
                            background:
                              "linear-gradient(135deg, #28a745, #20c997)",
                            color: "white",
                            borderRadius: "16px 16px 0 0",
                            padding: "20px",
                          }}
                        >
                          <h5 className="mb-0" style={{ fontWeight: "700" }}>
                            <i className="bi bi-gear me-2"></i>
                            Project Setup & Installation
                          </h5>
                        </Card.Header>
                        <Card.Body style={{ padding: "30px" }}>
                          <h6>📦 Step 1: Initialize Project</h6>
                          <TerminalCommand
                            command="mkdir hare-krishna-medical-backend && cd hare-krishna-medical-backend"
                            output="Directory created successfully"
                            description="Create project directory"
                          />

                          <TerminalCommand
                            command="npm init -y"
                            output="Wrote to package.json"
                            description="Initialize Node.js project"
                          />

                          <h6>📋 Step 2: Package.json Configuration</h6>
                          <CodeBlock
                            title="package.json"
                            fileName="package.json"
                            code={backendCodes.packageJson}
                          />

                          <h6>⚙️ Step 3: Install Dependencies</h6>
                          <TerminalCommand
                            command="npm install express mongoose bcryptjs jsonwebtoken cors helmet express-rate-limit express-validator nodemailer multer cloudinary razorpay qrcode xlsx pdfkit twilio dotenv"
                            output="added 157 packages, and audited 158 packages in 45s"
                            description="Install production dependencies"
                          />

                          <TerminalCommand
                            command="npm install --save-dev nodemon jest supertest"
                            output="added 23 packages, and audited 181 packages in 12s"
                            description="Install development dependencies"
                          />

                          <h6>🔧 Step 4: Environment Configuration</h6>
                          <CodeBlock
                            title=".env (Environment Variables)"
                            fileName=".env"
                            code={backendCodes.envExample}
                          />

                          <h6>🗂️ Step 5: Project Structure</h6>
                          <TerminalCommand
                            command="mkdir models routes middleware utils config"
                            output="Directories created"
                            description="Create folder structure"
                          />

                          <Alert
                            variant="warning"
                            style={{ borderRadius: "8px" }}
                          >
                            <Alert.Heading style={{ fontSize: "16px" }}>
                              🔒 Security Note
                            </Alert.Heading>
                            <p style={{ marginBottom: 0 }}>
                              Never commit your .env file to version control.
                              Add it to .gitignore and use environment-specific
                              configurations for different deployment
                              environments.
                            </p>
                          </Alert>
                        </Card.Body>
                      </Card>
                    </Tab.Pane>

                    {/* Database Models Tab */}
                    <Tab.Pane eventKey="models">
                      <Card
                        style={{
                          border: "none",
                          borderRadius: "16px",
                          boxShadow: "0 8px 32px rgba(0,0,0,0.08)",
                        }}
                      >
                        <Nav.Item>
                          <Nav.Link
                            eventKey="structure"
                            onClick={() => setActiveTab("structure")}
                            style={{
                              borderRadius: "8px",
                              marginBottom: "8px",
                              fontWeight: "600",
                              color:
                                activeTab === "structure" ? "white" : "#333",
                              background:
                                activeTab === "structure"
                                  ? "linear-gradient(135deg, #6f42c1, #6610f2)"
                                  : "transparent",
                            }}
                          >
                            <i className="bi bi-folder-tree me-2"></i>
                            File Structure
                          </Nav.Link>
                        </Nav.Item>
                        <Nav.Item>
                          <Nav.Link
                            eventKey="deployment"
                            onClick={() => setActiveTab("deployment")}
                            style={{
                              borderRadius: "8px",
                              marginBottom: "8px",
                              fontWeight: "600",
                              color:
                                activeTab === "deployment" ? "white" : "#333",
                              background:
                                activeTab === "deployment"
                                  ? "linear-gradient(135deg, #e63946, #dc3545)"
                                  : "transparent",
                            }}
                          >
                            <i className="bi bi-cloud-upload me-2"></i>
                            Deployment
                          </Nav.Link>
                        </Nav.Item>

                          <Alert
                            variant="info"
                            style={{ borderRadius: "8px", marginTop: "20px" }}
                          >
                            <Alert.Heading style={{ fontSize: "16px" }}>
                              📊 Database Indexes
                            </Alert.Heading>
                            <p style={{ marginBottom: 0 }}>
                              All models include optimized database indexes for
                              better query performance. The User model includes
                              security features like account locking and
                              password reset functionality.
                            </p>
                          </Alert>
                        </Card.Body>
                      </Card>
                    </Tab.Pane>

                    {/* API Routes Tab */}
                    <Tab.Pane eventKey="routes">
                      <Card
                        style={{
                          border: "none",
                          borderRadius: "16px",
                          boxShadow: "0 8px 32px rgba(0,0,0,0.08)",
                        }}
                      >
                        <Card.Header
                          style={{
                            background:
                              "linear-gradient(135deg, #fd7e14, #ffc107)",
                            color: "white",
                            borderRadius: "16px 16px 0 0",
                            padding: "20px",
                          }}
                        >
                          <h5 className="mb-0" style={{ fontWeight: "700" }}>
                            <i className="bi bi-arrow-left-right me-2"></i>
                            API Routes & Server Setup
                          </h5>
                        </Card.Header>
                        <Card.Body style={{ padding: "30px" }}>
                          <h6>🚀 Main Server File</h6>
                          <CodeBlock
                            title="Server Configuration (server.js)"
                            fileName="server.js"
                            code={backendCodes.serverJs}
                          />

                          <h6>🔐 Authentication Routes</h6>
                          <CodeBlock
                            title="Authentication Routes (routes/auth.js)"
                            fileName="routes/auth.js"
                            code={backendCodes.authRoutes}
                          />

                          <h6>📋 API Endpoints Overview</h6>
                          <Row>
                            <Col md={6}>
                              <Card
                                style={{
                                  border: "1px solid #e9ecef",
                                  borderRadius: "8px",
                                  marginBottom: "15px",
                                }}
                              >
                                <Card.Body style={{ padding: "15px" }}>
                                  <h6 style={{ color: "#e63946" }}>
                                    🔐 Auth Routes
                                  </h6>
                                  <ul style={{ fontSize: "14px", margin: 0 }}>
                                    <li>POST /api/auth/register</li>
                                    <li>POST /api/auth/login</li>
                                    <li>GET /api/auth/me</li>
                                    <li>POST /api/auth/forgot-password</li>
                                    <li>POST /api/auth/reset-password</li>
                                  </ul>
                                </Card.Body>
                              </Card>
                            </Col>
                            <Col md={6}>
                              <Card
                                style={{
                                  border: "1px solid #e9ecef",
                                  borderRadius: "8px",
                                  marginBottom: "15px",
                                }}
                              >
                                <Card.Body style={{ padding: "15px" }}>
                                  <h6 style={{ color: "#28a745" }}>
                                    🛍️ Product Routes
                                  </h6>
                                  <ul style={{ fontSize: "14px", margin: 0 }}>
                                    <li>GET /api/products</li>
                                    <li>GET /api/products/:id</li>
                                    <li>POST /api/products (Admin)</li>
                                    <li>PUT /api/products/:id (Admin)</li>
                                    <li>DELETE /api/products/:id (Admin)</li>
                                  </ul>
                                </Card.Body>
                              </Card>
                            </Col>
                          </Row>

                          <h6>🔧 Starting the Server</h6>
                          <TerminalCommand
                            command="npm run dev"
                            output="🚀 Server running on port 5000"
                            description="Start development server with nodemon"
                          />

                          <TerminalCommand
                            command="npm start"
                            output="🚀 Server running on port 5000"
                            description="Start production server"
                          />
                        </Card.Body>
                      </Card>
                    </Tab.Pane>

                    {/* Deployment Tab */}
                    <Tab.Pane eventKey="deployment">
                      <Card
                        style={{
                          border: "none",
                          borderRadius: "16px",
                          boxShadow: "0 8px 32px rgba(0,0,0,0.08)",
                        }}
                      >
                        <Card.Header
                          style={{
                            background:
                              "linear-gradient(135deg, #dc3545, #e63946)",
                            color: "white",
                            borderRadius: "16px 16px 0 0",
                            padding: "20px",
                          }}
                        >
                          <h5 className="mb-0" style={{ fontWeight: "700" }}>
                            <i className="bi bi-cloud-upload me-2"></i>
                            Deployment Guide
                          </h5>
                        </Card.Header>
                        <Card.Body style={{ padding: "30px" }}>
                          <h6>🌐 Heroku Deployment</h6>
                          <TerminalCommand
                            command="heroku create hare-krishna-medical-api"
                            output="Creating app... done, ⬢ hare-krishna-medical-api"
                            description="Create Heroku app"
                          />

                          <TerminalCommand
                            command="heroku config:set NODE_ENV=production"
                            output="Setting NODE_ENV and restarting ⬢ hare-krishna-medical-api... done"
                            description="Set environment variables"
                          />

                          <h6>🐳 Docker Deployment</h6>
                          <CodeBlock
                            title="Dockerfile"
                            fileName="Dockerfile"
                            code={`FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci --only=production

COPY . .

EXPOSE 5000

USER node

CMD ["npm", "start"]`}
                          />

                          <TerminalCommand
                            command="docker build -t hare-krishna-medical-api ."
                            output="Successfully built abc123def456"
                            description="Build Docker image"
                          />

                          <TerminalCommand
                            command="docker run -p 5000:5000 --env-file .env hare-krishna-medical-api"
                            output="🚀 Server running on port 5000"
                            description="Run Docker container"
                          />

                          <h6>☁️ MongoDB Atlas Setup</h6>
                          <TerminalCommand
                            command="mongo 'mongodb+srv://cluster0.abc123.mongodb.net/hare-krishna-medical' --username your-username"
                            output="MongoDB shell version v5.0.0"
                            description="Connect to MongoDB Atlas"
                          />

                          <Alert
                            variant="success"
                            style={{ borderRadius: "8px" }}
                          >
                            <Alert.Heading style={{ fontSize: "16px" }}>
                              ✅ Production Checklist
                            </Alert.Heading>
                            <ul style={{ marginBottom: 0 }}>
                              <li>Environment variables configured</li>
                              <li>Database connection secured</li>
                              <li>SSL certificates installed</li>
                              <li>Rate limiting enabled</li>
                              <li>Monitoring and logging setup</li>
                              <li>Backup strategy implemented</li>
                            </ul>
                          </Alert>
                        </Card.Body>
                      </Card>
                    </Tab.Pane>
                  </Tab.Content>
                </Col>
              </Row>
            </Tab.Container>
          </div>
        </Container>
      </section>
    </div>
  );
};

export default BackendDocs;