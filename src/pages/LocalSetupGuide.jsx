import React from "react";
import {
  Container,
  Row,
  Col,
  Card,
  Alert,
  Badge,
  Breadcrumb,
} from "react-bootstrap";
import { Link } from "react-router-dom";
import CompactHero from "../components/common/CompactHero";

const LocalSetupGuide = () => {
  return (
    <div className="fade-in">
      <CompactHero
        icon="bi bi-gear-fill"
        title="Local Setup Guide"
        subtitle="Complete guide to set up the Hare Krishna Medical Store locally with security best practices"
      />

      <Container className="py-5">
        {/* Breadcrumb */}
        <Breadcrumb className="mb-4">
          <Breadcrumb.Item>
            <Link to="/" className="text-decoration-none">
              <i className="bi bi-house me-1"></i>
              Home
            </Link>
          </Breadcrumb.Item>
          <Breadcrumb.Item active>Local Setup Guide</Breadcrumb.Item>
        </Breadcrumb>

        {/* Security Alert */}
        <Alert variant="danger" className="mb-4">
          <Alert.Heading>
            <i className="bi bi-shield-exclamation me-2"></i>
            Security Important
          </Alert.Heading>
          <p>
            This guide includes security best practices and configurations.
            Always use strong passwords and secure environment variables in
            production.
          </p>
          <hr />
          <p className="mb-0">
            <strong>
              Never commit .env files or expose sensitive credentials!
            </strong>
          </p>
        </Alert>

        {/* Quick Start Alert */}
        <Alert variant="info" className="mb-4">
          <Alert.Heading>
            <i className="bi bi-info-circle me-2"></i>
            Production-Ready Setup Guide
          </Alert.Heading>
          <p>
            This guide will help you set up the complete Hare Krishna Medical
            Store application on your local machine. The project includes a 100%
            configured database with sample data, production-ready security
            features, and comprehensive documentation for smooth deployment.
          </p>
          <hr />
          <p className="mb-0">
            <strong>What's Included:</strong> Full MERN stack, MongoDB with
            sample data, JWT authentication, real-time features, professional
            UI, and complete API documentation.
          </p>
        </Alert>

        {/* Prerequisites */}
        <Card className="mb-4" style={{ border: "2px solid #f8f9fa" }}>
          <Card.Header
            style={{
              background: "linear-gradient(135deg, #e63946 0%, #dc3545 100%)",
              color: "white",
            }}
          >
            <h4 className="mb-0">
              <i className="bi bi-list-check me-2"></i>
              Step 1: Prerequisites & System Requirements
            </h4>
          </Card.Header>
          <Card.Body>
            <h5>Required Software</h5>
            <Row>
              <Col md={4} className="mb-3">
                <Card className="h-100 border-primary">
                  <Card.Body className="text-center">
                    <i
                      className="bi bi-nodejs"
                      style={{ fontSize: "2rem", color: "#28a745" }}
                    ></i>
                    <h6 className="mt-2">Node.js</h6>
                    <p className="small text-muted">Version 18.0.0 or higher</p>
                    <Badge bg="success">Required</Badge>
                  </Card.Body>
                </Card>
              </Col>
              <Col md={4} className="mb-3">
                <Card className="h-100 border-info">
                  <Card.Body className="text-center">
                    <i
                      className="bi bi-database"
                      style={{ fontSize: "2rem", color: "#17a2b8" }}
                    ></i>
                    <h6 className="mt-2">MongoDB</h6>
                    <p className="small text-muted">Version 6.0 or higher</p>
                    <Badge bg="info">Required</Badge>
                  </Card.Body>
                </Card>
              </Col>
              <Col md={4} className="mb-3">
                <Card className="h-100 border-warning">
                  <Card.Body className="text-center">
                    <i
                      className="bi bi-git"
                      style={{ fontSize: "2rem", color: "#ffc107" }}
                    ></i>
                    <h6 className="mt-2">Git</h6>
                    <p className="small text-muted">Latest version</p>
                    <Badge bg="warning">Required</Badge>
                  </Card.Body>
                </Card>
              </Col>
            </Row>

            <h5 className="mt-4">System Requirements</h5>
            <Row>
              <Col md={6}>
                <h6>Minimum Requirements:</h6>
                <ul>
                  <li>4GB RAM</li>
                  <li>2GB available disk space</li>
                  <li>Internet connection for dependencies</li>
                  <li>Modern web browser (Chrome, Firefox, Safari, Edge)</li>
                </ul>
              </Col>
              <Col md={6}>
                <h6>Recommended:</h6>
                <ul>
                  <li>8GB+ RAM</li>
                  <li>5GB+ available disk space</li>
                  <li>SSD storage for better performance</li>
                  <li>Code editor (VS Code recommended)</li>
                </ul>
              </Col>
            </Row>

            <Alert variant="secondary" className="mt-3">
              <h6>
                <i className="bi bi-terminal me-2"></i>
                Verify Installation
              </h6>
              <pre className="mb-0">
                <code>{`node --version    # Should show v18.0.0+
npm --version     # Should show 8.0.0+
mongod --version  # Should show MongoDB version
git --version     # Should show Git version`}</code>
              </pre>
            </Alert>
          </Card.Body>
        </Card>

        {/* MongoDB Setup */}
        <Card className="mb-4" style={{ border: "2px solid #f8f9fa" }}>
          <Card.Header
            style={{
              background: "linear-gradient(135deg, #17a2b8 0%, #138496 100%)",
              color: "white",
            }}
          >
            <h4 className="mb-0">
              <i className="bi bi-database me-2"></i>
              Step 2: MongoDB Database Setup
            </h4>
          </Card.Header>
          <Card.Body>
            <Row>
              <Col md={6}>
                <h5>
                  <i className="bi bi-laptop me-2"></i>
                  Local MongoDB Installation
                </h5>
                <h6 className="text-primary">Windows:</h6>
                <ol>
                  <li>
                    Download MongoDB Community Server from{" "}
                    <a
                      href="https://www.mongodb.com/try/download/community"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      official website
                    </a>
                  </li>
                  <li>Run the installer and follow setup wizard</li>
                  <li>Install as Windows Service (recommended)</li>
                  <li>Add MongoDB to your PATH environment variable</li>
                  <li>
                    Create data directory: <code>mkdir C:\data\db</code>
                  </li>
                </ol>

                <h6 className="text-success">macOS:</h6>
                <pre>
                  <code>{`# Using Homebrew (recommended)
brew tap mongodb/brew
brew install mongodb-community@7.0

# Start MongoDB
brew services start mongodb/brew/mongodb-community`}</code>
                </pre>

                <h6 className="text-warning">Ubuntu/Linux:</h6>
                <pre>
                  <code>{`# Import MongoDB public GPG key
curl -fsSL https://www.mongodb.org/static/pgp/server-7.0.asc | \\
sudo gpg -o /usr/share/keyrings/mongodb-server-7.0.gpg --dearmor

# Add MongoDB repository
echo "deb [ arch=amd64,arm64 signed-by=/usr/share/keyrings/mongodb-server-7.0.gpg ] \\
https://repo.mongodb.org/apt/ubuntu jammy/mongodb-org/7.0 multiverse" | \\
sudo tee /etc/apt/sources.list.d/mongodb-org-7.0.list

# Update and install
sudo apt-get update
sudo apt-get install -y mongodb-org

# Start and enable MongoDB
sudo systemctl start mongod
sudo systemctl enable mongod`}</code>
                </pre>
              </Col>
              <Col md={6}>
                <h5>
                  <i className="bi bi-cloud me-2"></i>
                  MongoDB Atlas (Cloud) - Recommended
                </h5>
                <ol>
                  <li>
                    Go to{" "}
                    <a
                      href="https://www.mongodb.com/atlas"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      MongoDB Atlas
                    </a>
                  </li>
                  <li>Create a free account and cluster (M0 tier is free)</li>
                  <li>Configure network access (add your IP address)</li>
                  <li>Create database user with strong password</li>
                  <li>Get connection string for later use</li>
                </ol>

                <Alert variant="success">
                  <h6>
                    <i className="bi bi-check-circle me-2"></i>
                    Why Atlas?
                  </h6>
                  <ul className="mb-0">
                    <li>Automatic backups</li>
                    <li>Built-in security features</li>
                    <li>Easy scaling</li>
                    <li>Free tier available</li>
                    <li>No local setup required</li>
                  </ul>
                </Alert>

                <Alert variant="info">
                  <h6>
                    <i className="bi bi-play-circle me-2"></i>
                    Starting MongoDB Service (Local)
                  </h6>
                  <strong>Windows:</strong>
                  <pre>
                    <code>{`net start MongoDB
# Or manually: mongod --dbpath="C:\\data\\db"`}</code>
                  </pre>
                  <strong>macOS:</strong>
                  <pre>
                    <code>{`brew services start mongodb/brew/mongodb-community`}</code>
                  </pre>
                  <strong>Linux:</strong>
                  <pre>
                    <code>{`sudo systemctl start mongod
sudo systemctl enable mongod`}</code>
                  </pre>
                </Alert>
              </Col>
            </Row>
          </Card.Body>
        </Card>

        {/* Project Setup */}
        <Card className="mb-4" style={{ border: "2px solid #f8f9fa" }}>
          <Card.Header
            style={{
              background: "linear-gradient(135deg, #28a745 0%, #1e7e34 100%)",
              color: "white",
            }}
          >
            <h4 className="mb-0">
              <i className="bi bi-folder me-2"></i>
              Step 3: Project Setup & Dependencies
            </h4>
          </Card.Header>
          <Card.Body>
            <h5>1. Clone the Repository</h5>
            <pre>
              <code>{`git clone <your-repository-url>
cd hare-krishna-medical-store

# Verify project structure
ls -la  # Should show package.json, src/, backend/ directories`}</code>
            </pre>

            <h5 className="mt-4">2. Backend Setup</h5>
            <pre>
              <code>{`cd backend
npm install

# Check for vulnerabilities
npm audit
npm audit fix  # Fix any issues`}</code>
            </pre>

            <h5 className="mt-4">3. Frontend Setup</h5>
            <pre>
              <code>{`cd ..  # Go back to project root
npm install

# Check for vulnerabilities
npm audit
npm audit fix  # Fix any issues`}</code>
            </pre>

            <Alert variant="warning">
              <h6>
                <i className="bi bi-exclamation-triangle me-2"></i>
                Missing Dependencies Fix
              </h6>
              <p>If you encounter missing dependencies, install them:</p>
              <pre>
                <code>{`# Backend additional dependencies (if needed)
cd backend
npm install socket.io@^4.7.2 express-mongo-sanitize@^2.2.0 express-rate-limit@^7.1.5

# Frontend additional dependencies (if needed)
cd ..
npm install socket.io-client@^4.7.2`}</code>
              </pre>
            </Alert>
          </Card.Body>
        </Card>

        {/* Environment Configuration */}
        <Card className="mb-4" style={{ border: "2px solid #f8f9fa" }}>
          <Card.Header
            style={{
              background: "linear-gradient(135deg, #6f42c1 0%, #5a32a3 100%)",
              color: "white",
            }}
          >
            <h4 className="mb-0">
              <i className="bi bi-shield-lock me-2"></i>
              Step 4: Environment Configuration (Critical Security Step)
            </h4>
          </Card.Header>
          <Card.Body>
            <Alert variant="danger">
              <h6>
                <i className="bi bi-exclamation-triangle me-2"></i>
                Security Critical
              </h6>
              <p className="mb-0">
                Always use strong, unique values for JWT_SECRET and database
                passwords. Never use the example values in production!
              </p>
            </Alert>

            <h5>Backend Environment Configuration</h5>
            <h6>
              Create <code>backend/.env</code> file:
            </h6>
            <Alert variant="secondary">
              <pre>
                <code>{`# ===== SERVER CONFIGURATION =====
PORT=5000
NODE_ENV=development

# ===== DATABASE CONFIGURATION =====
# Choose ONE of the following:

# Option 1: Local MongoDB
MONGODB_URI=mongodb://localhost:27017/hare_krishna_medical

# Option 2: MongoDB Atlas (Recommended)
# MONGODB_URI=mongodb+srv://username:STRONG_PASSWORD@cluster.mongodb.net/hare_krishna_medical?retryWrites=true&w=majority

# ===== SECURITY CONFIGURATION =====
# CRITICAL: Generate a strong JWT secret (use: node -e "console.log(require('crypto').randomBytes(64).toString('hex'))")
JWT_SECRET=your_super_secret_jwt_key_CHANGE_THIS_IN_PRODUCTION_64_chars_minimum
JWT_EXPIRES_IN=7d

# Password hashing rounds (higher = more secure but slower)
BCRYPT_SALT_ROUNDS=12

# ===== CORS CONFIGURATION =====
FRONTEND_URL=http://localhost:5173

# ===== EMAIL CONFIGURATION (Optional but recommended) =====
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-specific-password  # Use App Password for Gmail

# ===== SMS CONFIGURATION (Optional) =====
TWILIO_ACCOUNT_SID=your_twilio_account_sid
TWILIO_AUTH_TOKEN=your_twilio_auth_token
TWILIO_PHONE_NUMBER=your_twilio_phone_number

# ===== CLOUDINARY CONFIGURATION (For image uploads) =====
CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret

# ===== PAYMENT GATEWAY (Optional) =====
RAZORPAY_KEY_ID=your_razorpay_key_id
RAZORPAY_KEY_SECRET=your_razorpay_key_secret

# ===== RATE LIMITING =====
RATE_LIMIT_WINDOW_MS=900000  # 15 minutes
RATE_LIMIT_MAX_REQUESTS=100  # requests per window`}</code>
              </pre>
            </Alert>

            <h5 className="mt-4">Frontend Environment Configuration</h5>
            <h6>
              Create <code>.env</code> file in root directory:
            </h6>
            <Alert variant="secondary">
              <pre>
                <code>{`# ===== BACKEND API CONFIGURATION =====
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
# Session timeout (milliseconds)
VITE_SESSION_TIMEOUT=3600000  # 1 hour

# Maximum file upload size (bytes)
VITE_MAX_FILE_SIZE=5242880  # 5MB`}</code>
              </pre>
            </Alert>

            <h5 className="mt-4">Generate Secure JWT Secret</h5>
            <Alert variant="info">
              <h6>
                <i className="bi bi-terminal me-2"></i>
                Generate Strong JWT Secret
              </h6>
              <pre>
                <code>{`# Run this command to generate a secure JWT secret:
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"

# Copy the output and use it as your JWT_SECRET`}</code>
              </pre>
            </Alert>

            <Alert variant="warning">
              <h6>
                <i className="bi bi-eye-slash me-2"></i>
                Email Setup for Gmail
              </h6>
              <ol className="mb-0">
                <li>Enable 2-factor authentication on your Gmail account</li>
                <li>Generate an App Password (not your regular password)</li>
                <li>Use the App Password in EMAIL_PASS</li>
                <li>Never use your regular Gmail password</li>
              </ol>
            </Alert>
          </Card.Body>
        </Card>

        {/* Database Initialization */}
        <Card className="mb-4" style={{ border: "2px solid #f8f9fa" }}>
          <Card.Header
            style={{
              background: "linear-gradient(135deg, #ffc107 0%, #e09000 100%)",
              color: "white",
            }}
          >
            <h4 className="mb-0">
              <i className="bi bi-database-add me-2"></i>
              Step 5: Database Initialization & Security Setup
            </h4>
          </Card.Header>
          <Card.Body>
            <h5>1. Test Database Connection</h5>
            <pre>
              <code>{`cd backend
# Test if your .env file is correctly configured
node -e "require('dotenv').config(); console.log('MongoDB URI:', process.env.MONGODB_URI ? 'Configured' : 'Missing')"`}</code>
            </pre>

            <h5 className="mt-3">2. Initialize Database with Sample Data</h5>
            <pre>
              <code>{`# Run the seed script to populate database
npm run seed`}</code>
            </pre>

            <Alert variant="success">
              <h6>
                <i className="bi bi-check-circle me-2"></i>
                This will create:
              </h6>
              <ul className="mb-0">
                <li>Admin user (admin@harekrishnamedical.com / admin123)</li>
                <li>Test user (john@example.com / user123)</li>
                <li>Sample products and categories</li>
                <li>Initial configuration and security settings</li>
                <li>Sample orders and invoices for testing</li>
              </ul>
            </Alert>

            <h5 className="mt-3">3. Verify Database Setup</h5>
            <Row>
              <Col md={6}>
                <h6>Local MongoDB:</h6>
                <pre>
                  <code>{`mongosh hare_krishna_medical
# Should connect and show MongoDB shell
db.users.countDocuments()  # Should show user count
exit`}</code>
                </pre>
              </Col>
              <Col md={6}>
                <h6>MongoDB Atlas:</h6>
                <pre>
                  <code>{`# Use MongoDB Compass or Atlas web interface
# Or test connection with:
mongosh "your_connection_string"`}</code>
                </pre>
              </Col>
            </Row>

            <Alert variant="warning">
              <h6>
                <i className="bi bi-shield-check me-2"></i>
                Security Verification
              </h6>
              <ul className="mb-0">
                <li>Verify strong passwords are being hashed in database</li>
                <li>Check that JWT tokens are properly signed</li>
                <li>Ensure admin roles are correctly assigned</li>
                <li>Test rate limiting is working</li>
              </ul>
            </Alert>
          </Card.Body>
        </Card>

        {/* Running the Application */}
        <Card className="mb-4" style={{ border: "2px solid #f8f9fa" }}>
          <Card.Header
            style={{
              background: "linear-gradient(135deg, #e63946 0%, #dc3545 100%)",
              color: "white",
            }}
          >
            <h4 className="mb-0">
              <i className="bi bi-play-circle me-2"></i>
              Step 6: Running the Application
            </h4>
          </Card.Header>
          <Card.Body>
            <h5>Start Development Servers</h5>
            <Row>
              <Col md={6}>
                <h6>
                  <i className="bi bi-server me-2"></i>
                  Backend Server (Terminal 1)
                </h6>
                <pre>
                  <code>{`cd backend
npm run dev

# You should see:
# ✅ Connected to MongoDB
# 🚀 Server running on port 5000
# 🌐 Environment: development`}</code>
                </pre>
                <Badge bg="success">Backend: http://localhost:5000</Badge>
              </Col>
              <Col md={6}>
                <h6>
                  <i className="bi bi-laptop me-2"></i>
                  Frontend Server (Terminal 2)
                </h6>
                <pre>
                  <code>{`# In a new terminal, from project root
npm run dev

# You should see:
# VITE ready in X ms
# Local: http://localhost:5173/`}</code>
                </pre>
                <Badge bg="info">Frontend: http://localhost:5173</Badge>
              </Col>
            </Row>

            <Alert variant="success" className="mt-4">
              <h5>
                <i className="bi bi-check-circle me-2"></i>
                Access Your Application
              </h5>
              <Row>
                <Col md={6}>
                  <h6>Frontend URLs:</h6>
                  <ul>
                    <li>
                      <strong>Main App:</strong>{" "}
                      <a
                        href="http://localhost:5173"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        http://localhost:5173
                      </a>
                    </li>
                    <li>
                      <strong>Admin Dashboard:</strong> /admin/dashboard
                    </li>
                    <li>
                      <strong>User Dashboard:</strong> /user/dashboard
                    </li>
                  </ul>
                </Col>
                <Col md={6}>
                  <h6>Backend URLs:</h6>
                  <ul>
                    <li>
                      <strong>API Base:</strong>{" "}
                      <a
                        href="http://localhost:5000"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        http://localhost:5000
                      </a>
                    </li>
                    <li>
                      <strong>Health Check:</strong> /api/health
                    </li>
                    <li>
                      <strong>API Docs:</strong> Available in app
                    </li>
                  </ul>
                </Col>
              </Row>
            </Alert>

            <Alert variant="warning">
              <h6>
                <i className="bi bi-clock me-2"></i>
                First Startup
              </h6>
              <p className="mb-0">
                The first startup may take longer as dependencies are cached and
                database connections are established.
              </p>
            </Alert>
          </Card.Body>
        </Card>

        {/* Login Credentials */}
        <Card className="mb-4" style={{ border: "2px solid #f8f9fa" }}>
          <Card.Header
            style={{
              background: "linear-gradient(135deg, #6f42c1 0%, #5a32a3 100%)",
              color: "white",
            }}
          >
            <h4 className="mb-0">
              <i className="bi bi-person-check me-2"></i>
              Step 7: Default Login Credentials & Testing
            </h4>
          </Card.Header>
          <Card.Body>
            <Row>
              <Col md={6}>
                <Card className="border-danger">
                  <Card.Header className="bg-danger text-white">
                    <h6 className="mb-0">
                      <i className="bi bi-shield-lock me-2"></i>
                      Admin Login
                    </h6>
                  </Card.Header>
                  <Card.Body>
                    <p>
                      <strong>Email:</strong> admin@harekrishnamedical.com
                    </p>
                    <p>
                      <strong>Password:</strong> admin123
                    </p>
                    <p className="text-muted small mb-0">
                      Full access: manage products, orders, users, analytics
                    </p>
                  </Card.Body>
                </Card>
              </Col>
              <Col md={6}>
                <Card className="border-primary">
                  <Card.Header className="bg-primary text-white">
                    <h6 className="mb-0">
                      <i className="bi bi-person me-2"></i>
                      User Login
                    </h6>
                  </Card.Header>
                  <Card.Body>
                    <p>
                      <strong>Email:</strong> john@example.com
                    </p>
                    <p>
                      <strong>Password:</strong> user123
                    </p>
                    <p className="text-muted small mb-0">
                      Customer access: place orders, view invoices, profile
                    </p>
                  </Card.Body>
                </Card>
              </Col>
            </Row>

            <Alert variant="danger" className="mt-3">
              <h6>
                <i className="bi bi-exclamation-triangle me-2"></i>
                Change Default Passwords
              </h6>
              <p className="mb-0">
                <strong>IMPORTANT:</strong> Change these default passwords
                immediately after first login, especially for production use!
              </p>
            </Alert>

            <h5 className="mt-4">Test Application Features</h5>
            <Row>
              <Col md={6}>
                <h6>User Features to Test:</h6>
                <ul>
                  <li>Registration and email verification</li>
                  <li>Login and password reset</li>
                  <li>Browse products and categories</li>
                  <li>Add items to cart and checkout</li>
                  <li>View order history and invoices</li>
                  <li>Real-time order updates</li>
                </ul>
              </Col>
              <Col md={6}>
                <h6>Admin Features to Test:</h6>
                <ul>
                  <li>Dashboard analytics</li>
                  <li>Product management (CRUD)</li>
                  <li>Order management and status updates</li>
                  <li>User management</li>
                  <li>Invoice generation and QR codes</li>
                  <li>Real-time notifications</li>
                </ul>
              </Col>
            </Row>
          </Card.Body>
        </Card>

        {/* Troubleshooting */}
        <Card className="mb-4" style={{ border: "2px solid #f8f9fa" }}>
          <Card.Header
            style={{
              background: "linear-gradient(135deg, #fd7e14 0%, #e65100 100%)",
              color: "white",
            }}
          >
            <h4 className="mb-0">
              <i className="bi bi-bug me-2"></i>
              Step 8: Troubleshooting & Common Issues
            </h4>
          </Card.Header>
          <Card.Body>
            <h5>Common Issues & Solutions</h5>

            <Alert variant="danger">
              <h6>
                <i className="bi bi-x-circle me-2"></i>
                MongoDB Connection Failed
              </h6>
              <p>
                <strong>Symptoms:</strong> "MongoDB connection error" or
                "ECONNREFUSED"
              </p>
              <p>
                <strong>Solutions:</strong>
              </p>
              <pre>
                <code>{`# Check if MongoDB is running
sudo systemctl status mongod  # Linux
brew services list | grep mongo  # macOS
net start MongoDB  # Windows

# Check connection string in backend/.env
# For Atlas: Verify IP whitelist and credentials
# For local: Ensure MongoDB service is started`}</code>
              </pre>
            </Alert>

            <Alert variant="warning">
              <h6>
                <i className="bi bi-exclamation-triangle me-2"></i>
                Port Already in Use
              </h6>
              <p>
                <strong>Symptoms:</strong> "EADDRINUSE" or "Port already in use"
              </p>
              <pre>
                <code>{`# Kill process on backend port (5000)
lsof -ti:5000 | xargs kill -9  # macOS/Linux
netstat -ano | findstr :5000   # Windows

# Kill process on frontend port (5173)
lsof -ti:5173 | xargs kill -9  # macOS/Linux
netstat -ano | findstr :5173   # Windows`}</code>
              </pre>
            </Alert>

            <Alert variant="info">
              <h6>
                <i className="bi bi-shield-exclamation me-2"></i>
                JWT or Authentication Issues
              </h6>
              <p>
                <strong>Symptoms:</strong> "Invalid token" or login failures
              </p>
              <pre>
                <code>{`# Check JWT_SECRET in backend/.env
# Ensure it's at least 32 characters long
# Clear browser localStorage and try again
localStorage.clear()  # In browser console`}</code>
              </pre>
            </Alert>

            <Alert variant="secondary">
              <h6>
                <i className="bi bi-arrow-clockwise me-2"></i>
                Dependencies or Build Issues
              </h6>
              <pre>
                <code>{`# Clear all caches and reinstall
npm cache clean --force
rm -rf node_modules package-lock.json
npm install

# For backend
cd backend
rm -rf node_modules package-lock.json
npm install

# Check for outdated packages
npm outdated
npm update`}</code>
              </pre>
            </Alert>

            <Alert variant="success">
              <h6>
                <i className="bi bi-check-circle me-2"></i>
                CORS Issues
              </h6>
              <p>If frontend can't connect to backend:</p>
              <ol className="mb-0">
                <li>
                  Verify FRONTEND_URL in backend/.env is http://localhost:5173
                </li>
                <li>
                  Verify VITE_BACKEND_URL in .env is http://localhost:5000
                </li>
                <li>Restart both servers after changing .env files</li>
                <li>Check browser console for CORS errors</li>
              </ol>
            </Alert>

            <h5 className="mt-4">Performance Optimization</h5>
            <Row>
              <Col md={6}>
                <h6>Backend Optimization:</h6>
                <ul>
                  <li>Increase MongoDB connection pool size</li>
                  <li>Enable MongoDB compression</li>
                  <li>Use Redis for session storage (optional)</li>
                  <li>Enable gzip compression</li>
                </ul>
              </Col>
              <Col md={6}>
                <h6>Frontend Optimization:</h6>
                <ul>
                  <li>Enable service workers for caching</li>
                  <li>Optimize images (use WebP format)</li>
                  <li>Implement lazy loading</li>
                  <li>Use production build for testing</li>
                </ul>
              </Col>
            </Row>
          </Card.Body>
        </Card>

        {/* Development Tools */}
        <Card className="mb-4" style={{ border: "2px solid #f8f9fa" }}>
          <Card.Header
            style={{
              background: "linear-gradient(135deg, #20c997 0%, #17a2b8 100%)",
              color: "white",
            }}
          >
            <h4 className="mb-0">
              <i className="bi bi-tools me-2"></i>
              Step 9: Development Tools & Scripts
            </h4>
          </Card.Header>
          <Card.Body>
            <Row>
              <Col md={6}>
                <h5>Backend Scripts</h5>
                <pre>
                  <code>{`npm run dev          # Development server with nodemon
npm run start        # Production server
npm run seed         # Populate database with sample data
npm run test         # Run tests
npm audit            # Check for vulnerabilities
npm audit fix        # Fix vulnerabilities`}</code>
                </pre>
              </Col>
              <Col md={6}>
                <h5>Frontend Scripts</h5>
                <pre>
                  <code>{`npm run dev          # Development server
npm run build        # Build for production
npm run preview      # Preview production build
npm run test         # Run tests
npm audit            # Check for vulnerabilities`}</code>
                </pre>
              </Col>
            </Row>

            <h5 className="mt-4">Essential Development Tools</h5>
            <Row>
              <Col md={4}>
                <h6>Database Tools:</h6>
                <ul>
                  <li>
                    <strong>MongoDB Compass</strong> - Visual database
                    management
                  </li>
                  <li>
                    <strong>MongoDB Shell</strong> - Command-line interface
                  </li>
                  <li>
                    <strong>Studio 3T</strong> - Advanced MongoDB IDE
                  </li>
                </ul>
              </Col>
              <Col md={4}>
                <h6>API Testing:</h6>
                <ul>
                  <li>
                    <strong>Postman</strong> - API testing and documentation
                  </li>
                  <li>
                    <strong>Insomnia</strong> - REST API client
                  </li>
                  <li>
                    <strong>Thunder Client</strong> - VS Code extension
                  </li>
                </ul>
              </Col>
              <Col md={4}>
                <h6>Code Editors:</h6>
                <ul>
                  <li>
                    <strong>VS Code</strong> - With React, Node.js extensions
                  </li>
                  <li>
                    <strong>WebStorm</strong> - Full-featured IDE
                  </li>
                  <li>
                    <strong>Vim/Neovim</strong> - For terminal lovers
                  </li>
                </ul>
              </Col>
            </Row>

            <h5 className="mt-4">Useful VS Code Extensions</h5>
            <Alert variant="info">
              <pre>
                <code>{`# Essential extensions for this project:
- ES7+ React/Redux/React-Native snippets
- Node.js Extension Pack
- MongoDB for VS Code
- REST Client
- GitLens
- Prettier - Code formatter
- ESLint
- Auto Rename Tag
- Bracket Pair Colorizer`}</code>
              </pre>
            </Alert>
          </Card.Body>
        </Card>

        {/* Security Best Practices */}
        <Card className="mb-4" style={{ border: "2px solid #f8f9fa" }}>
          <Card.Header
            style={{
              background: "linear-gradient(135deg, #dc3545 0%, #c82333 100%)",
              color: "white",
            }}
          >
            <h4 className="mb-0">
              <i className="bi bi-shield-check me-2"></i>
              Step 10: Security Best Practices & Production Readiness
            </h4>
          </Card.Header>
          <Card.Body>
            <Alert variant="danger">
              <h6>
                <i className="bi bi-exclamation-triangle me-2"></i>
                Critical Security Checklist
              </h6>
              <ul className="mb-0">
                <li>✅ Strong, unique JWT_SECRET (64+ characters)</li>
                <li>✅ Database passwords are not default/weak</li>
                <li>✅ Environment files are in .gitignore</li>
                <li>✅ HTTPS enabled in production</li>
                <li>✅ CORS properly configured</li>
                <li>✅ Rate limiting enabled</li>
                <li>✅ Input validation on all endpoints</li>
                <li>✅ File upload restrictions in place</li>
              </ul>
            </Alert>

            <h5>Environment Security</h5>
            <Row>
              <Col md={6}>
                <h6>Development Environment:</h6>
                <ul>
                  <li>Use different databases for dev/prod</li>
                  <li>Never commit .env files</li>
                  <li>Use strong local passwords</li>
                  <li>Enable MongoDB authentication</li>
                  <li>Regularly update dependencies</li>
                </ul>
              </Col>
              <Col md={6}>
                <h6>Production Environment:</h6>
                <ul>
                  <li>Use environment variables, not .env files</li>
                  <li>Enable HTTPS/SSL certificates</li>
                  <li>Use MongoDB Atlas with IP whitelisting</li>
                  <li>Enable security headers (helmet.js)</li>
                  <li>Monitor for security vulnerabilities</li>
                </ul>
              </Col>
            </Row>

            <h5 className="mt-4">Data Protection</h5>
            <Alert variant="warning">
              <h6>
                <i className="bi bi-database-lock me-2"></i>
                Database Security
              </h6>
              <ul className="mb-0">
                <li>Regular backups (Atlas handles this automatically)</li>
                <li>Encrypt sensitive data at rest</li>
                <li>Use connection string with authentication</li>
                <li>Limit database user permissions</li>
                <li>Monitor suspicious database activity</li>
              </ul>
            </Alert>

            <h5 className="mt-3">Regular Maintenance</h5>
            <pre>
              <code>{`# Check for security vulnerabilities
npm audit
npm audit fix

# Update dependencies
npm update
npm outdated

# Backend security audit
cd backend
npm audit
npm update`}</code>
            </pre>
          </Card.Body>
        </Card>

        {/* Success Message */}
        <Alert variant="success" className="text-center">
          <h4>
            <i className="bi bi-check-circle me-2"></i>
            Setup Complete! 🎉
          </h4>
          <p>
            You now have a fully functional Hare Krishna Medical Store running
            locally with all security features enabled.
          </p>
          <p className="mb-0">
            <strong>Next Steps:</strong> Customize the application, add your
            products, and deploy to production when ready!
          </p>
        </Alert>

        {/* Support Section */}
        <Card style={{ border: "2px solid #e9ecef" }}>
          <Card.Body className="text-center">
            <h5>
              <i className="bi bi-question-circle me-2"></i>
              Need Help or Found Issues?
            </h5>
            <p className="text-muted">
              If you encounter any issues during setup or discover security
              vulnerabilities, please refer to the troubleshooting section above
              or check the project documentation.
            </p>
            <Row className="justify-content-center">
              <Col md={10}>
                <Row>
                  <Col md={3}>
                    <div className="text-center">
                      <i
                        className="bi bi-book"
                        style={{ fontSize: "2rem", color: "#e63946" }}
                      ></i>
                      <p className="small mt-2">Documentation</p>
                    </div>
                  </Col>
                  <Col md={3}>
                    <div className="text-center">
                      <i
                        className="bi bi-github"
                        style={{ fontSize: "2rem", color: "#e63946" }}
                      ></i>
                      <p className="small mt-2">Source Code</p>
                    </div>
                  </Col>
                  <Col md={3}>
                    <div className="text-center">
                      <i
                        className="bi bi-shield-check"
                        style={{ fontSize: "2rem", color: "#e63946" }}
                      ></i>
                      <p className="small mt-2">Security Reports</p>
                    </div>
                  </Col>
                  <Col md={3}>
                    <div className="text-center">
                      <i
                        className="bi bi-chat-dots"
                        style={{ fontSize: "2rem", color: "#e63946" }}
                      ></i>
                      <p className="small mt-2">Community</p>
                    </div>
                  </Col>
                </Row>
              </Col>
            </Row>
          </Card.Body>
        </Card>
      </Container>
    </div>
  );
};

export default LocalSetupGuide;
