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
        subtitle="Complete guide to set up the Hare Krishna Medical Store locally"
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

        {/* Quick Start Alert */}
        <Alert variant="info" className="mb-4">
          <Alert.Heading>
            <i className="bi bi-info-circle me-2"></i>
            Quick Start
          </Alert.Heading>
          <p>
            This guide will help you set up the complete Hare Krishna Medical
            Store application on your local machine with MongoDB database
            integration.
          </p>
          <hr />
          <p className="mb-0">
            <strong>Prerequisites:</strong> Node.js (v18+), MongoDB, Git
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
              Step 1: Prerequisites
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
                  <li>Add MongoDB to your PATH environment variable</li>
                  <li>
                    Create data directory: <code>mkdir C:\data\db</code>
                  </li>
                </ol>

                <h6 className="text-success">macOS:</h6>
                <pre>
                  <code>{`# Using Homebrew (recommended)
brew tap mongodb/brew
brew install mongodb-community`}</code>
                </pre>

                <h6 className="text-warning">Ubuntu/Linux:</h6>
                <pre>
                  <code>{`# Import MongoDB public GPG key
curl -fsSL https://www.mongodb.org/static/pgp/server-6.0.asc | \\
sudo gpg -o /usr/share/keyrings/mongodb-server-6.0.gpg --dearmor

# Add MongoDB repository
echo "deb [ arch=amd64,arm64 signed-by=/usr/share/keyrings/mongodb-server-6.0.gpg ] \\
https://repo.mongodb.org/apt/ubuntu jammy/mongodb-org/6.0 multiverse" | \\
sudo tee /etc/apt/sources.list.d/mongodb-org-6.0.list

# Update and install
sudo apt-get update
sudo apt-get install -y mongodb-org`}</code>
                </pre>
              </Col>
              <Col md={6}>
                <h5>
                  <i className="bi bi-cloud me-2"></i>
                  MongoDB Atlas (Cloud)
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
                  <li>Create a free account and cluster</li>
                  <li>Configure network access (add your IP address)</li>
                  <li>Create database user with credentials</li>
                  <li>Get connection string for later use</li>
                </ol>

                <Alert variant="info">
                  <h6>
                    <i className="bi bi-play-circle me-2"></i>
                    Starting MongoDB Service
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
              Step 3: Project Setup
            </h4>
          </Card.Header>
          <Card.Body>
            <h5>1. Clone the Repository</h5>
            <pre>
              <code>{`git clone <your-repository-url>
cd hare-krishna-medical-store`}</code>
            </pre>

            <h5 className="mt-4">2. Backend Setup</h5>
            <pre>
              <code>{`cd backend
npm install`}</code>
            </pre>

            <h6>Create Backend .env File</h6>
            <Alert variant="secondary">
              <p>
                Create <code>backend/.env</code> file with:
              </p>
              <pre>
                <code>{`# Server Configuration
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

# Email Configuration (Optional)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password

# CORS Configuration
FRONTEND_URL=http://localhost:5173

# Security Configuration
BCRYPT_SALT_ROUNDS=12
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100`}</code>
              </pre>
            </Alert>

            <h5 className="mt-4">3. Frontend Setup</h5>
            <pre>
              <code>{`cd ..  # Go back to project root
npm install`}</code>
            </pre>

            <h6>Create Frontend .env File</h6>
            <Alert variant="secondary">
              <p>
                Create <code>.env</code> file in root directory with:
              </p>
              <pre>
                <code>{`# Backend API Configuration
VITE_BACKEND_URL=http://localhost:5000

# Application Configuration
VITE_APP_NAME=Hare Krishna Medical Store
VITE_VERSION=1.0.0

# Development Configuration
VITE_DEBUG=true

# Socket.io Configuration (for real-time features)
VITE_SOCKET_URL=http://localhost:5000`}</code>
              </pre>
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
              Step 4: Database Initialization
            </h4>
          </Card.Header>
          <Card.Body>
            <h5>Initialize Database with Sample Data</h5>
            <pre>
              <code>{`cd backend
npm run seed`}</code>
            </pre>

            <Alert variant="success">
              <h6>
                <i className="bi bi-check-circle me-2"></i>
                This will create:
              </h6>
              <ul className="mb-0">
                <li>Admin user (admin@harekrishna.com / admin123)</li>
                <li>Test user (user@harekrishna.com / user123)</li>
                <li>Sample products and categories</li>
                <li>Initial configuration</li>
              </ul>
            </Alert>

            <h5 className="mt-3">Verify Database Connection</h5>
            <pre>
              <code>{`mongosh hare_krishna_medical
# Should connect and show MongoDB shell
# Type 'exit' to close`}</code>
            </pre>
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
              Step 5: Running the Application
            </h4>
          </Card.Header>
          <Card.Body>
            <Row>
              <Col md={6}>
                <h5>
                  <i className="bi bi-server me-2"></i>
                  Start Backend Server
                </h5>
                <pre>
                  <code>{`cd backend
npm run dev`}</code>
                </pre>
                <Badge bg="success">
                  Backend running on http://localhost:5000
                </Badge>
              </Col>
              <Col md={6}>
                <h5>
                  <i className="bi bi-laptop me-2"></i>
                  Start Frontend Server
                </h5>
                <pre>
                  <code>{`# In a new terminal, from project root
npm run dev`}</code>
                </pre>
                <Badge bg="info">
                  Frontend running on http://localhost:5173
                </Badge>
              </Col>
            </Row>

            <Alert variant="success" className="mt-4">
              <h5>
                <i className="bi bi-check-circle me-2"></i>
                Access Your Application
              </h5>
              <ul className="mb-0">
                <li>
                  <strong>Frontend:</strong>{" "}
                  <a
                    href="http://localhost:5173"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    http://localhost:5173
                  </a>
                </li>
                <li>
                  <strong>Backend API:</strong>{" "}
                  <a
                    href="http://localhost:5000"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    http://localhost:5000
                  </a>
                </li>
              </ul>
            </Alert>
          </Card.Body>
        </Card>

        {/* Default Login Credentials */}
        <Card className="mb-4" style={{ border: "2px solid #f8f9fa" }}>
          <Card.Header
            style={{
              background: "linear-gradient(135deg, #6f42c1 0%, #5a32a3 100%)",
              color: "white",
            }}
          >
            <h4 className="mb-0">
              <i className="bi bi-person-check me-2"></i>
              Step 6: Default Login Credentials
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
                      <strong>Email:</strong> admin@harekrishna.com
                    </p>
                    <p>
                      <strong>Password:</strong> admin123
                    </p>
                    <p className="text-muted small mb-0">
                      Access admin dashboard, manage products, orders, users
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
                      <strong>Email:</strong> user@harekrishna.com
                    </p>
                    <p>
                      <strong>Password:</strong> user123
                    </p>
                    <p className="text-muted small mb-0">
                      Access user dashboard, place orders, view invoices
                    </p>
                  </Card.Body>
                </Card>
              </Col>
            </Row>
          </Card.Body>
        </Card>

        {/* Testing & Troubleshooting */}
        <Card className="mb-4" style={{ border: "2px solid #f8f9fa" }}>
          <Card.Header
            style={{
              background: "linear-gradient(135deg, #fd7e14 0%, #e65100 100%)",
              color: "white",
            }}
          >
            <h4 className="mb-0">
              <i className="bi bi-bug me-2"></i>
              Step 7: Testing & Troubleshooting
            </h4>
          </Card.Header>
          <Card.Body>
            <h5>Test the Setup</h5>
            <ol>
              <li>Open http://localhost:5173</li>
              <li>Go to Products page - should load products from database</li>
              <li>Try user registration/login</li>
              <li>Check browser dev tools for any errors</li>
            </ol>

            <h5 className="mt-4">Common Issues & Solutions</h5>
            <Alert variant="warning">
              <h6>
                <i className="bi bi-exclamation-triangle me-2"></i>
                MongoDB Connection Issues
              </h6>
              <pre>
                <code>{`# Check if MongoDB is running
sudo systemctl status mongod  # Linux
brew services list | grep mongo  # macOS

# Check connection string in .env file`}</code>
              </pre>
            </Alert>

            <Alert variant="info">
              <h6>
                <i className="bi bi-info-circle me-2"></i>
                Port Already in Use
              </h6>
              <pre>
                <code>{`# Kill process on port 5000
lsof -ti:5000 | xargs kill -9

# Kill process on port 5173
lsof -ti:5173 | xargs kill -9`}</code>
              </pre>
            </Alert>

            <Alert variant="secondary">
              <h6>
                <i className="bi bi-arrow-clockwise me-2"></i>
                Clear npm cache
              </h6>
              <pre>
                <code>{`npm cache clean --force
rm -rf node_modules package-lock.json
npm install`}</code>
              </pre>
            </Alert>
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
              Development Tools & Scripts
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
npm run lint         # Check code quality`}</code>
                </pre>
              </Col>
              <Col md={6}>
                <h5>Frontend Scripts</h5>
                <pre>
                  <code>{`npm run dev          # Development server
npm run build        # Build for production
npm run preview      # Preview production build
npm run lint         # Check code quality`}</code>
                </pre>
              </Col>
            </Row>

            <h5 className="mt-4">Recommended Development Tools</h5>
            <Row>
              <Col md={4}>
                <ul>
                  <li>
                    <strong>MongoDB Compass</strong> - Visual database
                    management
                  </li>
                  <li>
                    <strong>Postman</strong> - API testing
                  </li>
                </ul>
              </Col>
              <Col md={4}>
                <ul>
                  <li>
                    <strong>VS Code</strong> - Code editor with extensions
                  </li>
                  <li>
                    <strong>Browser DevTools</strong> - Frontend debugging
                  </li>
                </ul>
              </Col>
              <Col md={4}>
                <ul>
                  <li>
                    <strong>Git</strong> - Version control
                  </li>
                  <li>
                    <strong>Terminal</strong> - Command line interface
                  </li>
                </ul>
              </Col>
            </Row>
          </Card.Body>
        </Card>

        {/* Success Message */}
        <Alert variant="success" className="text-center">
          <h4>
            <i className="bi bi-check-circle me-2"></i>
            Setup Complete!
          </h4>
          <p className="mb-0">
            You now have a fully functional Hare Krishna Medical Store running
            locally. Happy coding! 🎉
          </p>
        </Alert>

        {/* Support */}
        <Card style={{ border: "2px solid #e9ecef" }}>
          <Card.Body className="text-center">
            <h5>
              <i className="bi bi-question-circle me-2"></i>
              Need Help?
            </h5>
            <p className="text-muted">
              If you encounter any issues during setup, please check the
              troubleshooting section above or refer to the project
              documentation.
            </p>
            <Row className="justify-content-center">
              <Col md={8}>
                <Row>
                  <Col md={4}>
                    <div className="text-center">
                      <i
                        className="bi bi-book"
                        style={{ fontSize: "2rem", color: "#e63946" }}
                      ></i>
                      <p className="small mt-2">Documentation</p>
                    </div>
                  </Col>
                  <Col md={4}>
                    <div className="text-center">
                      <i
                        className="bi bi-github"
                        style={{ fontSize: "2rem", color: "#e63946" }}
                      ></i>
                      <p className="small mt-2">Source Code</p>
                    </div>
                  </Col>
                  <Col md={4}>
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
