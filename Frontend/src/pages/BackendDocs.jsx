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
    street: String,
    city: String,
    state: String,
    pincode: String
  },
  isActive: {
    type: Boolean,
    default: true
  },
  lastLogin: Date,
  avatar: String
}, {
  timestamps: true
});

// Hash password before saving
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

// Compare password method
userSchema.methods.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
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
  description: {
    type: String,
    required: [true, 'Product description is required'],
    maxlength: [2000, 'Description cannot exceed 2000 characters']
  },
  price: {
    type: Number,
    required: [true, 'Product price is required'],
    min: [0, 'Price cannot be negative']
  },
  mrp: {
    type: Number,
    required: [true, 'MRP is required'],
    min: [0, 'MRP cannot be negative']
  },
  discount: {
    type: Number,
    default: 0,
    min: [0, 'Discount cannot be negative'],
    max: [100, 'Discount cannot exceed 100%']
  },
  category: {
    type: String,
    required: [true, 'Product category is required'],
    enum: ['Medicine', 'Healthcare', 'Personal Care', 'Supplements', 'Baby Care', 'Ayurvedic']
  },
  subCategory: String,
  brand: {
    type: String,
    required: [true, 'Brand is required']
  },
  stock: {
    type: Number,
    required: [true, 'Stock quantity is required'],
    min: [0, 'Stock cannot be negative'],
    default: 0
  },
  minStock: {
    type: Number,
    default: 5
  },
  images: [{
    url: String,
    public_id: String
  }],
  specifications: {
    composition: String,
    dosage: String,
    sideEffects: String,
    precautions: String,
    manufacturer: String,
    expiryMonths: Number
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
  rating: {
    average: { type: Number, default: 0 },
    count: { type: Number, default: 0 }
  },
  sales: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});

// Index for search optimization
productSchema.index({ name: 'text', description: 'text', tags: 'text' });
productSchema.index({ category: 1, subCategory: 1 });
productSchema.index({ price: 1 });
productSchema.index({ rating: -1 });

module.exports = mongoose.model('Product', productSchema);`,

    orderModel: `const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  orderId: {
    type: String,
    required: true,
    unique: true
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  items: [{
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product',
      required: true
    },
    name: String,
    price: Number,
    quantity: {
      type: Number,
      required: true,
      min: 1
    },
    total: Number
  }],
  shippingAddress: {
    fullName: String,
    mobile: String,
    email: String,
    address: String,
    city: String,
    state: String,
    pincode: String
  },
  orderStatus: {
    type: String,
    enum: ['Pending', 'Confirmed', 'Processing', 'Shipped', 'Delivered', 'Cancelled'],
    default: 'Pending'
  },
  paymentMethod: {
    type: String,
    enum: ['COD', 'Online', 'Card'],
    required: true
  },
  paymentStatus: {
    type: String,
    enum: ['Pending', 'Completed', 'Failed', 'Refunded'],
    default: 'Pending'
  },
  paymentId: String,
  razorpayOrderId: String,
  subtotal: {
    type: Number,
    required: true
  },
  shippingCharges: {
    type: Number,
    default: 0
  },
  tax: {
    type: Number,
    default: 0
  },
  total: {
    type: Number,
    required: true
  },
  deliveryDate: Date,
  trackingNumber: String,
  notes: String,
  invoice: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Invoice'
  }
}, {
  timestamps: true
});

// Generate order ID
orderSchema.pre('save', function(next) {
  if (!this.orderId) {
    this.orderId = 'HKM' + Date.now();
  }
  next();
});

module.exports = mongoose.model('Order', orderSchema);`,

    invoiceModel: `const mongoose = require('mongoose');

const invoiceSchema = new mongoose.Schema({
  invoiceId: {
    type: String,
    required: true,
    unique: true
  },
  order: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Order',
    required: true
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  invoiceDate: {
    type: Date,
    default: Date.now
  },
  dueDate: {
    type: Date,
    default: function() {
      return new Date(Date.now() + 30 * 24 * 60 * 60 * 1000); // 30 days from now
    }
  },
  items: [{
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product'
    },
    name: String,
    price: Number,
    quantity: Number,
    total: Number
  }],
  subtotal: Number,
  tax: Number,
  shipping: Number,
  total: Number,
  status: {
    type: String,
    enum: ['Draft', 'Sent', 'Paid', 'Overdue', 'Cancelled'],
    default: 'Draft'
  },
  paymentMethod: String,
  paymentDate: Date,
  qrCode: String,
  notes: String
}, {
  timestamps: true
});

// Generate invoice ID
invoiceSchema.pre('save', function(next) {
  if (!this.invoiceId) {
    const year = new Date().getFullYear();
    const month = String(new Date().getMonth() + 1).padStart(2, '0');
    const day = String(new Date().getDate()).padStart(2, '0');
    const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
    this.invoiceId = \`HKM-INV-\${year}-\${month}\${day}-\${random}\`;
  }
  next();
});

module.exports = mongoose.model('Invoice', invoiceSchema);`,
  };

  return (
    <div className="fade-in">
      {/* Alert for copy success */}
      {showCopyAlert && (
        <div
          style={{
            position: "fixed",
            top: "20px",
            right: "20px",
            zIndex: "9999",
            background: "linear-gradient(135deg, #28a745, #20c997)",
            color: "white",
            padding: "12px 20px",
            borderRadius: "8px",
            boxShadow: "0 4px 15px rgba(40, 167, 69, 0.3)",
          }}
        >
          <i className="bi bi-check-circle me-2"></i>
          {copiedFile} copied to clipboard!
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
                  background: "linear-gradient(135deg, #e63946, #dc3545)",
                  color: "white",
                  boxShadow: "0 15px 50px rgba(230, 57, 70, 0.3)",
                }}
              >
                <Card.Body style={{ padding: "30px" }}>
                  <Row className="align-items-center">
                    <Col lg={8}>
                      <div className="d-flex align-items-center">
                        <div
                          style={{
                            width: "70px",
                            height: "70px",
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
                            style={{ fontSize: "32px" }}
                          ></i>
                        </div>
                        <div>
                          <h1
                            style={{
                              fontWeight: "800",
                              marginBottom: "8px",
                              fontSize: "2.5rem",
                            }}
                          >
                            Backend Documentation
                          </h1>
                          <p
                            style={{
                              opacity: "0.9",
                              marginBottom: "0",
                              fontSize: "1.2rem",
                            }}
                          >
                            Complete implementation guide with real-time backend
                            integration
                          </p>
                        </div>
                      </div>
                    </Col>
                    <Col lg={4} className="text-end">
                      <Button
                        variant="light"
                        onClick={downloadDocumentation}
                        style={{
                          borderRadius: "12px",
                          fontWeight: "700",
                          padding: "12px 24px",
                          fontSize: "16px",
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
            <Tab.Container
              id="backend-docs-tabs"
              activeKey={activeTab}
              onSelect={(k) => setActiveTab(k)}
            >
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
                            eventKey="structure"
                            style={{
                              borderRadius: "8px",
                              fontWeight: "600",
                              color:
                                activeTab === "structure" ? "white" : "#333",
                              background:
                                activeTab === "structure"
                                  ? "linear-gradient(135deg, #e63946, #dc3545)"
                                  : "transparent",
                            }}
                          >
                            <i className="bi bi-folder-tree me-2"></i>
                            File Structure
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
                            <i className="bi bi-signpost me-2"></i>
                            API Routes
                          </Nav.Link>
                        </Nav.Item>
                        <Nav.Item className="mb-2">
                          <Nav.Link
                            eventKey="realtime"
                            style={{
                              borderRadius: "8px",
                              fontWeight: "600",
                              color:
                                activeTab === "realtime" ? "white" : "#333",
                              background:
                                activeTab === "realtime"
                                  ? "linear-gradient(135deg, #e63946, #dc3545)"
                                  : "transparent",
                            }}
                          >
                            <i className="bi bi-arrow-repeat me-2"></i>
                            Real-time Integration
                          </Nav.Link>
                        </Nav.Item>
                        <Nav.Item>
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
                            command="npm install -D nodemon jest supertest"
                            output="added 3 packages, and audited 160 packages in 12s"
                            description="Install development dependencies"
                          />

                          <h6>🔧 Step 4: Main Server File</h6>
                          <CodeBlock
                            title="server.js - Main Application Entry Point"
                            fileName="server.js"
                            code={backendCodes.serverJs}
                          />

                          <Alert
                            variant="success"
                            style={{ borderRadius: "8px" }}
                          >
                            <Alert.Heading style={{ fontSize: "16px" }}>
                              ✅ Next Steps
                            </Alert.Heading>
                            <p style={{ marginBottom: 0 }}>
                              After setting up the basic server, proceed to the{" "}
                              <strong>File Structure</strong> tab to understand
                              the project organization, then move to{" "}
                              <strong>Database Models</strong> to implement data
                              schemas.
                            </p>
                          </Alert>
                        </Card.Body>
                      </Card>
                    </Tab.Pane>

                    {/* File Structure Tab */}
                    <Tab.Pane eventKey="structure">
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
                              "linear-gradient(135deg, #6f42c1, #6610f2)",
                            color: "white",
                            borderRadius: "16px 16px 0 0",
                            padding: "20px",
                          }}
                        >
                          <h5 className="mb-0" style={{ fontWeight: "700" }}>
                            <i className="bi bi-folder-tree me-2"></i>
                            Complete Project File Structure
                          </h5>
                        </Card.Header>
                        <Card.Body style={{ padding: "30px" }}>
                          <Row>
                            <Col lg={6}>
                              <h6
                                style={{
                                  color: "#6f42c1",
                                  marginBottom: "15px",
                                }}
                              >
                                <i className="bi bi-server me-2"></i>
                                Backend Structure
                              </h6>
                              <Card
                                style={{
                                  background: "#f8f9fa",
                                  border: "none",
                                  borderRadius: "8px",
                                }}
                              >
                                <Card.Body style={{ padding: "20px" }}>
                                  <pre
                                    style={{
                                      background: "transparent",
                                      border: "none",
                                      fontSize: "12px",
                                      lineHeight: "1.4",
                                      margin: 0,
                                      color: "#333",
                                    }}
                                  >
                                    {`hare-krishna-medical-backend/
├── package.json
├── server.js
├── .env
├── .gitignore
├── README.md
├── config/
│   ├── database.js
│   ├── cloudinary.js
│   └── razorpay.js
├── controllers/
│   ├── authController.js
│   ├── userController.js
│   ├── productController.js
│   ├── orderController.js
│   ├── invoiceController.js
│   ├── messageController.js
│   ├── analyticsController.js
│   └── uploadController.js
├── middleware/
│   ├── auth.js
│   ├── validate.js
│   ├── errorHandler.js
│   └── upload.js
├── models/
│   ├── User.js
│   ├── Product.js
│   ├── Order.js
│   ├── Invoice.js
│   ├── Message.js
│   └── Analytics.js
├── routes/
│   ├── auth.js
│   ├── users.js
│   ├── products.js
│   ├── orders.js
│   ├── invoices.js
│   ├── messages.js
│   ├── analytics.js
│   └── upload.js
├── utils/
│   ├── emailService.js
│   ├── smsService.js
│   ├── qrGenerator.js
│   ├── pdfGenerator.js
│   ├── excelGenerator.js
│   └── validators.js
├── scripts/
│   ├── seed.js
│   └── backup.js
└── tests/
    ├── auth.test.js
    ├── products.test.js
    └── orders.test.js`}
                                  </pre>
                                  <Button
                                    variant="outline-primary"
                                    size="sm"
                                    onClick={() =>
                                      copyToClipboard(
                                        `hare-krishna-medical-backend/
├── package.json
├── server.js
├── .env
├── .gitignore
├── README.md
├── config/
│   ├── database.js
│   ├── cloudinary.js
│   └── razorpay.js
├── controllers/
│   ├── authController.js
│   ├── userController.js
│   ├── productController.js
│   ├── orderController.js
│   ├── invoiceController.js
│   ├── messageController.js
│   ├── analyticsController.js
│   └── uploadController.js
├── middleware/
│   ├── auth.js
│   ├── validate.js
│   ├── errorHandler.js
│   └── upload.js
├── models/
│   ├── User.js
│   ├── Product.js
│   ├── Order.js
│   ├── Invoice.js
│   ├── Message.js
│   └── Analytics.js
├── routes/
│   ├── auth.js
│   ├── users.js
│   ├── products.js
│   ├── orders.js
│   ├── invoices.js
│   ├── messages.js
│   ├── analytics.js
│   └── upload.js
├── utils/
│   ├── emailService.js
│   ├── smsService.js
│   ├── qrGenerator.js
│   ├── pdfGenerator.js
│   ├── excelGenerator.js
│   └── validators.js
├── scripts/
│   ├── seed.js
│   └── backup.js
└── tests/
    ├── auth.test.js
    ├── products.test.js
    └── orders.test.js`,
                                        "backend-structure",
                                      )
                                    }
                                    className="mt-3"
                                    style={{ borderRadius: "6px" }}
                                  >
                                    <i className="bi bi-clipboard me-1"></i>
                                    Copy Backend Structure
                                  </Button>
                                </Card.Body>
                              </Card>
                            </Col>

                            <Col lg={6}>
                              <h6
                                style={{
                                  color: "#e63946",
                                  marginBottom: "15px",
                                }}
                              >
                                <i className="bi bi-display me-2"></i>
                                Frontend Structure
                              </h6>
                              <Card
                                style={{
                                  background: "#f8f9fa",
                                  border: "none",
                                  borderRadius: "8px",
                                }}
                              >
                                <Card.Body style={{ padding: "20px" }}>
                                  <pre
                                    style={{
                                      background: "transparent",
                                      border: "none",
                                      fontSize: "12px",
                                      lineHeight: "1.4",
                                      margin: 0,
                                      color: "#333",
                                    }}
                                  >
                                    {`hare-krishna-medical-frontend/
├── package.json
├── index.html
├── vite.config.js
├── components.json
├── public/
│   ├── placeholder.svg
│   └── robots.txt
├── src/
│   ├── main.jsx
│   ├── App.jsx
│   ├── App.css
│   ├── index.css
│   ├── components/
│   │   ├── common/
│   │   │   ├── GlobalSecurity.jsx
│   │   │   ├── LoadingSpinner.jsx
│   │   │   ├── NotificationSystem.jsx
│   │   │   ├── OfficialInvoiceDesign.jsx
│   │   │   ├── ProfessionalInvoice.jsx
│   │   │   └── PaymentOptions.jsx
│   │   ├── layout/
│   │   │   ├── Header.jsx
│   │   │   └── Footer.jsx
│   │   └── products/
│   │       ├── ProductCard.jsx
│   │       └── ProductFilters.jsx
│   ├── pages/
│   │   ├── About.jsx
│   │   ├── AdminDashboard.jsx
│   │   ├── BackendDocs.jsx
│   │   ├── Cart.jsx
│   │   ├── Contact.jsx
│   │   ├── ForgotPassword.jsx
│   │   ├── Home.jsx
│   │   ├── InvoiceView.jsx
│   │   ├── Login.jsx
│   │   ├── Order.jsx
│   │   ├── OrderDetails.jsx
│   │   ├── OrderTracking.jsx
│   │   ├── ProductDetails.jsx
│   │   ├── Products.jsx
│   │   ├── Register.jsx
│   │   ├── UserDashboard.jsx
│   │   ├── UserGuide.jsx
│   │   ├── admin/
│   │   │   ├── AddProduct.jsx
│   │   │   ├── AdminAnalytics.jsx
│   │   │   ├── AdminInvoices.jsx
│   │   │   ├── AdminMessages.jsx
│   │   │   ├── AdminOrders.jsx
│   │   │   ├── AdminProducts.jsx
│   │   │   └── AdminUsers.jsx
│   │   └── user/
│   │       ├── UserInvoices.jsx
│   │       ├── UserOrders.jsx
│   │       └── UserProfile.jsx
│   ├── store/
│   │   ├── store.js
│   │   └── slices/
│   │       ├── authSlice.js
│   │       ├── cartSlice.js
│   │       ├── messageSlice.js
│   │       ├── notificationSlice.js
│   │       └── productsSlice.js
│   ├── styles/
│   │   └── ProfessionalInvoice.css
│   └── utils/
│       ├── dateUtils.js
│       ├── invoiceUtils.js
│       └── sessionManager.js
└── README.md`}
                                  </pre>
                                  <Button
                                    variant="outline-danger"
                                    size="sm"
                                    onClick={() =>
                                      copyToClipboard(
                                        `hare-krishna-medical-frontend/
├── package.json
├── index.html
├── vite.config.js
├── components.json
├── public/
│   ├── placeholder.svg
│   └── robots.txt
├── src/
│   ├── main.jsx
│   ├── App.jsx
│   ├── App.css
│   ├── index.css
│   ├── components/
│   │   ├── common/
│   │   │   ├── GlobalSecurity.jsx
│   │   │   ├── LoadingSpinner.jsx
│   │   │   ├── NotificationSystem.jsx
│   │   │   ├── OfficialInvoiceDesign.jsx
│   │   │   ├── ProfessionalInvoice.jsx
│   │   │   └── PaymentOptions.jsx
│   │   ├── layout/
│   │   │   ├── Header.jsx
│   │   │   └── Footer.jsx
│   │   └── products/
│   │       ├── ProductCard.jsx
│   │       └── ProductFilters.jsx
│   ├── pages/
│   │   ├── About.jsx
│   │   ├── AdminDashboard.jsx
│   │   ├── BackendDocs.jsx
│   │   ├── Cart.jsx
│   │   ├── Contact.jsx
│   │   ├── ForgotPassword.jsx
│   │   ├── Home.jsx
│   │   ├── InvoiceView.jsx
│   │   ├── Login.jsx
│   │   ├── Order.jsx
│   │   ├── OrderDetails.jsx
│   │   ├── OrderTracking.jsx
│   │   ├── ProductDetails.jsx
│   │   ├── Products.jsx
│   │   ├── Register.jsx
│   │   ├── UserDashboard.jsx
│   │   ├── UserGuide.jsx
│   │   ├── admin/
│   │   │   ├── AddProduct.jsx
│   │   │   ├── AdminAnalytics.jsx
│   │   │   ├── AdminInvoices.jsx
│   │   │   ├── AdminMessages.jsx
│   │   │   ├── AdminOrders.jsx
│   │   │   ├── AdminProducts.jsx
│   │   │   └── AdminUsers.jsx
│   │   └── user/
│   │       ├── UserInvoices.jsx
│   │       ├── UserOrders.jsx
│   │       └── UserProfile.jsx
│   ├── store/
│   │   ├── store.js
│   │   └── slices/
│   │       ├── authSlice.js
│   │       ├── cartSlice.js
│   │       ├── messageSlice.js
│   │       ├── notificationSlice.js
│   │       └── productsSlice.js
│   ├── styles/
│   │   └── ProfessionalInvoice.css
│   └── utils/
│       ├── dateUtils.js
│       ├── invoiceUtils.js
│       └── sessionManager.js
└── README.md`,
                                        "frontend-structure",
                                      )
                                    }
                                    className="mt-3"
                                    style={{ borderRadius: "6px" }}
                                  >
                                    <i className="bi bi-clipboard me-1"></i>
                                    Copy Frontend Structure
                                  </Button>
                                </Card.Body>
                              </Card>
                            </Col>
                          </Row>

                          <Row className="mt-4">
                            <Col lg={12}>
                              <h6
                                style={{
                                  color: "#17a2b8",
                                  marginBottom: "15px",
                                }}
                              >
                                <i className="bi bi-gear me-2"></i>
                                Key File Descriptions
                              </h6>
                              <Accordion defaultActiveKey="0">
                                <Accordion.Item eventKey="0">
                                  <Accordion.Header>
                                    <i className="bi bi-server me-2"></i>
                                    Backend Key Files
                                  </Accordion.Header>
                                  <Accordion.Body>
                                    <Row>
                                      <Col md={6}>
                                        <ul
                                          style={{
                                            fontSize: "14px",
                                            lineHeight: "1.6",
                                          }}
                                        >
                                          <li>
                                            <strong>server.js</strong> - Main
                                            application entry point
                                          </li>
                                          <li>
                                            <strong>models/User.js</strong> -
                                            User schema with authentication
                                          </li>
                                          <li>
                                            <strong>models/Product.js</strong> -
                                            Product catalog management
                                          </li>
                                          <li>
                                            <strong>models/Order.js</strong> -
                                            Order processing schema
                                          </li>
                                          <li>
                                            <strong>models/Invoice.js</strong> -
                                            Invoice generation model
                                          </li>
                                          <li>
                                            <strong>routes/auth.js</strong> -
                                            Authentication endpoints
                                          </li>
                                          <li>
                                            <strong>routes/products.js</strong>{" "}
                                            - Product CRUD operations
                                          </li>
                                        </ul>
                                      </Col>
                                      <Col md={6}>
                                        <ul
                                          style={{
                                            fontSize: "14px",
                                            lineHeight: "1.6",
                                          }}
                                        >
                                          <li>
                                            <strong>
                                              controllers/authController.js
                                            </strong>{" "}
                                            - User registration/login logic
                                          </li>
                                          <li>
                                            <strong>middleware/auth.js</strong>{" "}
                                            - JWT token verification
                                          </li>
                                          <li>
                                            <strong>
                                              utils/emailService.js
                                            </strong>{" "}
                                            - Nodemailer configuration
                                          </li>
                                          <li>
                                            <strong>
                                              utils/qrGenerator.js
                                            </strong>{" "}
                                            - QR code generation utility
                                          </li>
                                          <li>
                                            <strong>config/database.js</strong>{" "}
                                            - MongoDB connection setup
                                          </li>
                                          <li>
                                            <strong>
                                              config/cloudinary.js
                                            </strong>{" "}
                                            - Image upload configuration
                                          </li>
                                          <li>
                                            <strong>config/razorpay.js</strong>{" "}
                                            - Payment gateway setup
                                          </li>
                                        </ul>
                                      </Col>
                                    </Row>
                                  </Accordion.Body>
                                </Accordion.Item>

                                <Accordion.Item eventKey="1">
                                  <Accordion.Header>
                                    <i className="bi bi-display me-2"></i>
                                    Frontend Key Files
                                  </Accordion.Header>
                                  <Accordion.Body>
                                    <Row>
                                      <Col md={6}>
                                        <ul
                                          style={{
                                            fontSize: "14px",
                                            lineHeight: "1.6",
                                          }}
                                        >
                                          <li>
                                            <strong>main.jsx</strong> - React
                                            application entry point
                                          </li>
                                          <li>
                                            <strong>App.jsx</strong> - Main app
                                            component with routing
                                          </li>
                                          <li>
                                            <strong>
                                              pages/AdminDashboard.jsx
                                            </strong>{" "}
                                            - Admin analytics dashboard
                                          </li>
                                          <li>
                                            <strong>
                                              pages/UserDashboard.jsx
                                            </strong>{" "}
                                            - User order management
                                          </li>
                                          <li>
                                            <strong>
                                              pages/admin/AdminInvoices.jsx
                                            </strong>{" "}
                                            - Invoice management
                                          </li>
                                          <li>
                                            <strong>
                                              components/common/OfficialInvoiceDesign.jsx
                                            </strong>{" "}
                                            - Invoice template
                                          </li>
                                        </ul>
                                      </Col>
                                      <Col md={6}>
                                        <ul
                                          style={{
                                            fontSize: "14px",
                                            lineHeight: "1.6",
                                          }}
                                        >
                                          <li>
                                            <strong>store/store.js</strong> -
                                            Redux store configuration
                                          </li>
                                          <li>
                                            <strong>
                                              store/slices/authSlice.js
                                            </strong>{" "}
                                            - Authentication state
                                          </li>
                                          <li>
                                            <strong>
                                              store/slices/cartSlice.js
                                            </strong>{" "}
                                            - Shopping cart management
                                          </li>
                                          <li>
                                            <strong>utils/dateUtils.js</strong>{" "}
                                            - Date formatting utilities
                                          </li>
                                          <li>
                                            <strong>
                                              utils/invoiceUtils.js
                                            </strong>{" "}
                                            - Invoice processing helpers
                                          </li>
                                          <li>
                                            <strong>
                                              components/layout/Header.jsx
                                            </strong>{" "}
                                            - Navigation component
                                          </li>
                                        </ul>
                                      </Col>
                                    </Row>
                                  </Accordion.Body>
                                </Accordion.Item>
                              </Accordion>
                            </Col>
                          </Row>

                          <Alert
                            variant="info"
                            style={{ borderRadius: "8px", marginTop: "20px" }}
                          >
                            <Alert.Heading style={{ fontSize: "16px" }}>
                              <i className="bi bi-lightbulb me-2"></i>
                              Implementation Order
                            </Alert.Heading>
                            <p style={{ marginBottom: 0, fontSize: "14px" }}>
                              <strong>Backend:</strong> Start with server.js →
                              models → routes → controllers → middleware → utils
                              <br />
                              <strong>Frontend:</strong> Start with main.jsx →
                              App.jsx → store setup → pages → components → utils
                              <br />
                              <strong>Integration:</strong> Test endpoints →
                              implement authentication → add features
                              progressively
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
                        <Card.Header
                          style={{
                            background:
                              "linear-gradient(135deg, #ffc107, #fd7e14)",
                            color: "white",
                            borderRadius: "16px 16px 0 0",
                            padding: "20px",
                          }}
                        >
                          <h5 className="mb-0" style={{ fontWeight: "700" }}>
                            <i className="bi bi-database me-2"></i>
                            Database Models & Schemas
                          </h5>
                        </Card.Header>
                        <Card.Body style={{ padding: "30px" }}>
                          <h6>👤 User Model</h6>
                          <CodeBlock
                            title="models/User.js - User Authentication & Profile"
                            fileName="User.js"
                            code={backendCodes.userModel}
                          />

                          <h6>📦 Product Model</h6>
                          <CodeBlock
                            title="models/Product.js - Product Catalog Management"
                            fileName="Product.js"
                            code={backendCodes.productModel}
                          />

                          <h6>🛒 Order Model</h6>
                          <CodeBlock
                            title="models/Order.js - Order Processing System"
                            fileName="Order.js"
                            code={backendCodes.orderModel}
                          />

                          <h6>🧾 Invoice Model</h6>
                          <CodeBlock
                            title="models/Invoice.js - Invoice Generation & Management"
                            fileName="Invoice.js"
                            code={backendCodes.invoiceModel}
                          />

                          <Alert
                            variant="warning"
                            style={{ borderRadius: "8px" }}
                          >
                            <Alert.Heading style={{ fontSize: "16px" }}>
                              📊 Real-time Database Integration
                            </Alert.Heading>
                            <p style={{ marginBottom: 0, fontSize: "14px" }}>
                              All models include automatic timestamps,
                              validation, and indexing for optimal performance.
                              The schemas support real-time updates for
                              dashboard calculations and live data
                              synchronization.
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
                              "linear-gradient(135deg, #dc3545, #e63946)",
                            color: "white",
                            borderRadius: "16px 16px 0 0",
                            padding: "20px",
                          }}
                        >
                          <h5 className="mb-0" style={{ fontWeight: "700" }}>
                            <i className="bi bi-signpost me-2"></i>
                            API Routes & Endpoints
                          </h5>
                        </Card.Header>
                        <Card.Body style={{ padding: "30px" }}>
                          <Row>
                            <Col lg={12}>
                              <h6>🔐 Authentication Routes</h6>
                              <Card
                                style={{
                                  background: "#f8f9fa",
                                  border: "none",
                                  marginBottom: "20px",
                                }}
                              >
                                <Card.Body>
                                  <div style={{ fontSize: "14px" }}>
                                    <div className="mb-2">
                                      <Badge bg="success">POST</Badge>{" "}
                                      <code>/api/auth/register</code> - User
                                      registration
                                    </div>
                                    <div className="mb-2">
                                      <Badge bg="primary">POST</Badge>{" "}
                                      <code>/api/auth/login</code> - User login
                                    </div>
                                    <div className="mb-2">
                                      <Badge bg="warning">POST</Badge>{" "}
                                      <code>/api/auth/logout</code> - User
                                      logout
                                    </div>
                                    <div className="mb-2">
                                      <Badge bg="info">GET</Badge>{" "}
                                      <code>/api/auth/profile</code> - Get user
                                      profile
                                    </div>
                                    <div>
                                      <Badge bg="danger">PUT</Badge>{" "}
                                      <code>/api/auth/update-profile</code> -
                                      Update profile
                                    </div>
                                  </div>
                                </Card.Body>
                              </Card>

                              <h6>🛍️ Product Routes</h6>
                              <Card
                                style={{
                                  background: "#f8f9fa",
                                  border: "none",
                                  marginBottom: "20px",
                                }}
                              >
                                <Card.Body>
                                  <div style={{ fontSize: "14px" }}>
                                    <div className="mb-2">
                                      <Badge bg="info">GET</Badge>{" "}
                                      <code>/api/products</code> - Get all
                                      products
                                    </div>
                                    <div className="mb-2">
                                      <Badge bg="info">GET</Badge>{" "}
                                      <code>/api/products/:id</code> - Get
                                      single product
                                    </div>
                                    <div className="mb-2">
                                      <Badge bg="success">POST</Badge>{" "}
                                      <code>/api/products</code> - Create
                                      product (Admin)
                                    </div>
                                    <div className="mb-2">
                                      <Badge bg="warning">PUT</Badge>{" "}
                                      <code>/api/products/:id</code> - Update
                                      product (Admin)
                                    </div>
                                    <div>
                                      <Badge bg="danger">DELETE</Badge>{" "}
                                      <code>/api/products/:id</code> - Delete
                                      product (Admin)
                                    </div>
                                  </div>
                                </Card.Body>
                              </Card>

                              <h6>📋 Order Routes</h6>
                              <Card
                                style={{
                                  background: "#f8f9fa",
                                  border: "none",
                                  marginBottom: "20px",
                                }}
                              >
                                <Card.Body>
                                  <div style={{ fontSize: "14px" }}>
                                    <div className="mb-2">
                                      <Badge bg="success">POST</Badge>{" "}
                                      <code>/api/orders</code> - Create new
                                      order
                                    </div>
                                    <div className="mb-2">
                                      <Badge bg="info">GET</Badge>{" "}
                                      <code>/api/orders</code> - Get user orders
                                    </div>
                                    <div className="mb-2">
                                      <Badge bg="info">GET</Badge>{" "}
                                      <code>/api/orders/:id</code> - Get order
                                      details
                                    </div>
                                    <div className="mb-2">
                                      <Badge bg="warning">PUT</Badge>{" "}
                                      <code>/api/orders/:id/status</code> -
                                      Update order status
                                    </div>
                                    <div>
                                      <Badge bg="primary">GET</Badge>{" "}
                                      <code>/api/orders/admin/all</code> - Get
                                      all orders (Admin)
                                    </div>
                                  </div>
                                </Card.Body>
                              </Card>

                              <h6>🧾 Invoice Routes</h6>
                              <Card
                                style={{
                                  background: "#f8f9fa",
                                  border: "none",
                                  marginBottom: "20px",
                                }}
                              >
                                <Card.Body>
                                  <div style={{ fontSize: "14px" }}>
                                    <div className="mb-2">
                                      <Badge bg="success">POST</Badge>{" "}
                                      <code>/api/invoices</code> - Generate
                                      invoice
                                    </div>
                                    <div className="mb-2">
                                      <Badge bg="info">GET</Badge>{" "}
                                      <code>/api/invoices</code> - Get user
                                      invoices
                                    </div>
                                    <div className="mb-2">
                                      <Badge bg="info">GET</Badge>{" "}
                                      <code>/api/invoices/:id</code> - Get
                                      invoice details
                                    </div>
                                    <div className="mb-2">
                                      <Badge bg="warning">PUT</Badge>{" "}
                                      <code>
                                        /api/invoices/:id/payment-status
                                      </code>{" "}
                                      - Update payment status
                                    </div>
                                    <div>
                                      <Badge bg="primary">GET</Badge>{" "}
                                      <code>/api/invoices/admin/all</code> - Get
                                      all invoices (Admin)
                                    </div>
                                  </div>
                                </Card.Body>
                              </Card>

                              <h6>📊 Analytics Routes</h6>
                              <Card
                                style={{
                                  background: "#f8f9fa",
                                  border: "none",
                                  marginBottom: "20px",
                                }}
                              >
                                <Card.Body>
                                  <div style={{ fontSize: "14px" }}>
                                    <div className="mb-2">
                                      <Badge bg="info">GET</Badge>{" "}
                                      <code>/api/analytics/dashboard</code> -
                                      Dashboard statistics
                                    </div>
                                    <div className="mb-2">
                                      <Badge bg="info">GET</Badge>{" "}
                                      <code>/api/analytics/revenue</code> -
                                      Revenue analytics
                                    </div>
                                    <div className="mb-2">
                                      <Badge bg="info">GET</Badge>{" "}
                                      <code>/api/analytics/orders</code> - Order
                                      analytics
                                    </div>
                                    <div>
                                      <Badge bg="info">GET</Badge>{" "}
                                      <code>/api/analytics/products</code> -
                                      Product analytics
                                    </div>
                                  </div>
                                </Card.Body>
                              </Card>
                            </Col>
                          </Row>

                          <Alert variant="info" style={{ borderRadius: "8px" }}>
                            <Alert.Heading style={{ fontSize: "16px" }}>
                              🔗 Real-time Integration
                            </Alert.Heading>
                            <p style={{ marginBottom: 0, fontSize: "14px" }}>
                              All payment status updates and order changes
                              automatically trigger real-time dashboard updates.
                              Invoice generation includes QR code creation and
                              PDF generation capabilities.
                            </p>
                          </Alert>
                        </Card.Body>
                      </Card>
                    </Tab.Pane>

                    {/* Real-time Integration Tab */}
                    <Tab.Pane eventKey="realtime">
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
                              "linear-gradient(135deg, #20c997, #17a2b8)",
                            color: "white",
                            borderRadius: "16px 16px 0 0",
                            padding: "20px",
                          }}
                        >
                          <h5 className="mb-0" style={{ fontWeight: "700" }}>
                            <i className="bi bi-arrow-repeat me-2"></i>
                            Real-time Dashboard Integration
                          </h5>
                        </Card.Header>
                        <Card.Body style={{ padding: "30px" }}>
                          <h6>🔄 Auto-updating Dashboard Features</h6>
                          <ul style={{ fontSize: "14px", lineHeight: "1.8" }}>
                            <li>
                              <strong>Real-time Statistics:</strong> Order
                              counts, revenue, and customer metrics update
                              automatically
                            </li>
                            <li>
                              <strong>Live Payment Updates:</strong> Payment
                              status changes reflect immediately across all
                              dashboards
                            </li>
                            <li>
                              <strong>Dynamic Chart Data:</strong> Analytics
                              charts refresh with new data without page reload
                            </li>
                            <li>
                              <strong>Inventory Tracking:</strong> Stock levels
                              update in real-time as orders are placed
                            </li>
                            <li>
                              <strong>Order Status Sync:</strong> Status changes
                              propagate instantly to user and admin dashboards
                            </li>
                          </ul>

                          <h6>📊 Backend-Processed Calculations</h6>
                          <Row>
                            <Col md={6}>
                              <Card
                                style={{
                                  border: "1px solid #e9ecef",
                                  borderRadius: "8px",
                                  marginBottom: "15px",
                                }}
                              >
                                <Card.Body>
                                  <h6 style={{ color: "#e63946" }}>
                                    Revenue Analytics
                                  </h6>
                                  <ul style={{ fontSize: "13px", margin: 0 }}>
                                    <li>Daily/Monthly revenue calculations</li>
                                    <li>Category-wise sales breakdown</li>
                                    <li>Profit margin analysis</li>
                                    <li>Growth rate computations</li>
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
                                <Card.Body>
                                  <h6 style={{ color: "#28a745" }}>
                                    Order Processing
                                  </h6>
                                  <ul style={{ fontSize: "13px", margin: 0 }}>
                                    <li>Order status aggregations</li>
                                    <li>Delivery performance metrics</li>
                                    <li>Customer order history</li>
                                    <li>Inventory impact calculations</li>
                                  </ul>
                                </Card.Body>
                              </Card>
                            </Col>
                          </Row>

                          <h6>🔧 Implementation Details</h6>
                          <CodeBlock
                            title="Real-time Dashboard Update Function"
                            fileName="dashboard-realtime.js"
                            code={`// Frontend: Real-time dashboard data fetching
const useRealtimeDashboard = () => {
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const response = await fetch('/api/analytics/dashboard', {
          headers: {
            'Authorization': \`Bearer \${localStorage.getItem('token')}\`
          }
        });
        const data = await response.json();
        setDashboardData(data);
        setLoading(false);
      } catch (error) {
        console.error('Dashboard fetch error:', error);
        setLoading(false);
      }
    };

    // Initial fetch
    fetchDashboardData();

    // Set up polling for real-time updates
    const interval = setInterval(fetchDashboardData, 30000); // Update every 30 seconds

    return () => clearInterval(interval);
  }, []);

  return { dashboardData, loading };
};

// Backend: Dashboard analytics endpoint
app.get('/api/analytics/dashboard', async (req, res) => {
  try {
    const [
      totalOrders,
      totalRevenue,
      totalCustomers,
      pendingOrders,
      recentOrders,
      topProducts
    ] = await Promise.all([
      Order.countDocuments(),
      Order.aggregate([
        { $match: { paymentStatus: 'Completed' } },
        { $group: { _id: null, total: { $sum: '$total' } } }
      ]),
      User.countDocuments({ role: 0 }),
      Order.countDocuments({ orderStatus: 'Pending' }),
      Order.find().sort({ createdAt: -1 }).limit(5).populate('user items.product'),
      Product.find().sort({ sales: -1 }).limit(5)
    ]);

    res.json({
      statistics: {
        totalOrders,
        totalRevenue: totalRevenue[0]?.total || 0,
        totalCustomers,
        pendingOrders
      },
      recentOrders,
      topProducts,
      lastUpdated: new Date().toISOString()
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});`}
                          />

                          <Alert
                            variant="success"
                            style={{ borderRadius: "8px" }}
                          >
                            <Alert.Heading style={{ fontSize: "16px" }}>
                              ⚡ Performance Optimization
                            </Alert.Heading>
                            <p style={{ marginBottom: 0, fontSize: "14px" }}>
                              All dashboard calculations are performed on the
                              backend using MongoDB aggregation pipelines for
                              optimal performance. Frontend polling ensures
                              real-time updates without overwhelming the server.
                            </p>
                          </Alert>
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
                              "linear-gradient(135deg, #e63946, #dc3545)",
                            color: "white",
                            borderRadius: "16px 16px 0 0",
                            padding: "20px",
                          }}
                        >
                          <h5 className="mb-0" style={{ fontWeight: "700" }}>
                            <i className="bi bi-cloud-upload me-2"></i>
                            Production Deployment Guide
                          </h5>
                        </Card.Header>
                        <Card.Body style={{ padding: "30px" }}>
                          <h6>🚀 Heroku Deployment</h6>
                          <TerminalCommand
                            command="heroku create hare-krishna-medical-api"
                            output="Creating ⬢ hare-krishna-medical-api... done"
                            description="Create Heroku application"
                          />

                          <TerminalCommand
                            command="heroku config:set NODE_ENV=production MONGODB_URI=your_mongodb_atlas_url JWT_SECRET=your_jwt_secret"
                            output="Setting config vars and restarting ⬢ hare-krishna-medical-api... done"
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

                          <h6>☁️ Environment Variables</h6>
                          <CodeBlock
                            title="Production .env Configuration"
                            fileName=".env.production"
                            code={`NODE_ENV=production
PORT=5000
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/hare-krishna-medical
JWT_SECRET=your-super-secret-jwt-key-here
FRONTEND_URL=https://your-frontend-domain.com

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
TWILIO_PHONE_NUMBER=your_twilio_phone_number`}
                          />

                          <Alert
                            variant="warning"
                            style={{ borderRadius: "8px" }}
                          >
                            <Alert.Heading style={{ fontSize: "16px" }}>
                              🔒 Security Checklist
                            </Alert.Heading>
                            <ul style={{ marginBottom: 0, fontSize: "14px" }}>
                              <li>✅ Use strong JWT secrets in production</li>
                              <li>✅ Enable MongoDB Atlas IP whitelist</li>
                              <li>
                                ✅ Configure CORS for your frontend domain only
                              </li>
                              <li>✅ Set up proper SSL certificates</li>
                              <li>✅ Enable API rate limiting</li>
                              <li>
                                ✅ Configure proper logging and monitoring
                              </li>
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
