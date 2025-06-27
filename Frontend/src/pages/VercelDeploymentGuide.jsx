import React from "react";
import {
  Container,
  Row,
  Col,
  Card,
  Alert,
  Badge,
  Breadcrumb,
  Button,
} from "react-bootstrap";
import { Link } from "react-router-dom";
import CompactHero from "../components/common/CompactHero";

const VercelDeploymentGuide = () => {
  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    alert("Copied to clipboard!");
  };

  return (
    <div className="fade-in">
      <CompactHero
        icon="bi bi-cloud-upload-fill"
        title="Vercel Deployment Guide"
        subtitle="Complete step-by-step guide to deploy Hare Krishna Medical Store on Vercel"
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
          <Breadcrumb.Item>
            <Link to="/local-setup" className="text-decoration-none">
              Setup Guides
            </Link>
          </Breadcrumb.Item>
          <Breadcrumb.Item active>Vercel Deployment</Breadcrumb.Item>
        </Breadcrumb>

        {/* Security Alert */}
        <Alert variant="warning" className="mb-4">
          <Alert.Heading>
            <i className="bi bi-exclamation-triangle me-2"></i>
            Production Deployment Notice
          </Alert.Heading>
          <p>
            This guide covers deploying the frontend to Vercel. The backend
            requires separate deployment to platforms like Railway, Heroku, or
            DigitalOcean.
          </p>
          <hr />
          <p className="mb-0">
            <strong>Prerequisites:</strong> Ensure your backend is deployed and
            accessible via HTTPS.
          </p>
        </Alert>

        {/* Prerequisites */}
        <Card className="mb-4 border-0 shadow-sm">
          <Card.Header className="bg-primary text-white">
            <h5 className="mb-0">
              <i className="bi bi-list-check me-2"></i>
              Prerequisites
            </h5>
          </Card.Header>
          <Card.Body>
            <Row>
              <Col md={6}>
                <h6>Required Accounts & Tools</h6>
                <ul>
                  <li>
                    <strong>Vercel Account</strong> -{" "}
                    <a
                      href="https://vercel.com"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Sign up here
                    </a>
                  </li>
                  <li>
                    <strong>GitHub/GitLab Account</strong> - For code repository
                  </li>
                  <li>
                    <strong>Git</strong> - Installed locally
                  </li>
                  <li>
                    <strong>Node.js</strong> - v18.0.0 or higher
                  </li>
                </ul>
              </Col>
              <Col md={6}>
                <h6>Backend Requirements</h6>
                <ul>
                  <li>
                    <strong>Deployed Backend</strong> - On Railway, Heroku, etc.
                  </li>
                  <li>
                    <strong>MongoDB Database</strong> - MongoDB Atlas
                    recommended
                  </li>
                  <li>
                    <strong>HTTPS URLs</strong> - All API endpoints must use
                    HTTPS
                  </li>
                  <li>
                    <strong>CORS Configuration</strong> - Allow Vercel domain
                  </li>
                </ul>
              </Col>
            </Row>
          </Card.Body>
        </Card>

        {/* Step 1: Prepare Repository */}
        <Card className="mb-4 border-0 shadow-sm">
          <Card.Header className="bg-success text-white">
            <h5 className="mb-0">
              <i className="bi bi-1-circle me-2"></i>
              Step 1: Prepare Your Repository
            </h5>
          </Card.Header>
          <Card.Body>
            <h6>1.1 Push Code to GitHub</h6>
            <div className="code-block bg-dark text-light p-3 rounded mb-3">
              <pre className="mb-0">
                {`# Initialize git repository (if not already done)
git init

# Add all files
git add .

# Commit changes
git commit -m "Initial commit for Vercel deployment"

# Add remote repository
git remote add origin https://github.com/yourusername/your-repo-name.git

# Push to GitHub
git push -u origin main`}
              </pre>
              <Button
                size="sm"
                variant="outline-light"
                className="mt-2"
                onClick={() =>
                  copyToClipboard(`git init
git add .
git commit -m "Initial commit for Vercel deployment"
git remote add origin https://github.com/yourusername/your-repo-name.git
git push -u origin main`)
                }
              >
                <i className="bi bi-clipboard me-1"></i>
                Copy Commands
              </Button>
            </div>

            <h6>1.2 Project Structure Verification</h6>
            <p>Ensure your project has the following structure:</p>
            <div className="code-block bg-light p-3 rounded mb-3">
              <pre className="mb-0">
                {`project-root/
├── package.json
├── vite.config.js
├── index.html
├── src/
│   ├── main.jsx
│   ├── App.jsx
│   └── ...
├── public/
├── backend/ (separate deployment)
└── .env.example`}
              </pre>
            </div>

            <Alert variant="info">
              <strong>Important:</strong> Remove any .env files from your
              repository. Never commit sensitive data!
            </Alert>
          </Card.Body>
        </Card>

        {/* Step 2: Configure Environment Variables */}
        <Card className="mb-4 border-0 shadow-sm">
          <Card.Header className="bg-info text-white">
            <h5 className="mb-0">
              <i className="bi bi-2-circle me-2"></i>
              Step 2: Configure Environment Variables
            </h5>
          </Card.Header>
          <Card.Body>
            <h6>2.1 Create .env.example File</h6>
            <p>Create a template for environment variables:</p>
            <div className="code-block bg-dark text-light p-3 rounded mb-3">
              <pre className="mb-0">
                {`# Backend API Configuration
VITE_BACKEND_URL=https://your-backend-url.com

# Application Configuration
VITE_APP_NAME=Hare Krishna Medical Store
VITE_VERSION=1.0.0

# Environment
VITE_NODE_ENV=production

# Socket.io Configuration
VITE_SOCKET_URL=https://your-backend-url.com

# Payment Gateway (if applicable)
VITE_RAZORPAY_KEY_ID=your_razorpay_key_id
VITE_STRIPE_PUBLIC_KEY=your_stripe_public_key

# Analytics (optional)
VITE_GOOGLE_ANALYTICS_ID=your_ga_id`}
              </pre>
              <Button
                size="sm"
                variant="outline-light"
                className="mt-2"
                onClick={() =>
                  copyToClipboard(`VITE_BACKEND_URL=https://your-backend-url.com
VITE_APP_NAME=Hare Krishna Medical Store
VITE_VERSION=1.0.0
VITE_NODE_ENV=production
VITE_SOCKET_URL=https://your-backend-url.com
VITE_RAZORPAY_KEY_ID=your_razorpay_key_id
VITE_STRIPE_PUBLIC_KEY=your_stripe_public_key
VITE_GOOGLE_ANALYTICS_ID=your_ga_id`)
                }
              >
                <i className="bi bi-clipboard me-1"></i>
                Copy Environment Variables
              </Button>
            </div>

            <h6>2.2 Update Build Configuration</h6>
            <p>
              Ensure your <code>vite.config.js</code> is properly configured:
            </p>
            <div className="code-block bg-dark text-light p-3 rounded mb-3">
              <pre className="mb-0">
                {`import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    outDir: "dist",
    sourcemap: false,
    minify: "terser",
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ["react", "react-dom"],
          router: ["react-router-dom"],
          ui: ["react-bootstrap", "bootstrap"],
        },
      },
    },
  },
  server: {
    port: 5173,
    host: true,
  },
  preview: {
    port: 4173,
    host: true,
  },
});`}
              </pre>
            </div>
          </Card.Body>
        </Card>

        {/* Step 3: Deploy to Vercel */}
        <Card className="mb-4 border-0 shadow-sm">
          <Card.Header className="bg-warning text-dark">
            <h5 className="mb-0">
              <i className="bi bi-3-circle me-2"></i>
              Step 3: Deploy to Vercel
            </h5>
          </Card.Header>
          <Card.Body>
            <h6>3.1 Connect Repository to Vercel</h6>
            <ol>
              <li>
                Go to{" "}
                <a
                  href="https://vercel.com"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  vercel.com
                </a>{" "}
                and sign in
              </li>
              <li>Click "New Project"</li>
              <li>Import your GitHub repository</li>
              <li>Select your repository from the list</li>
            </ol>

            <h6 className="mt-4">3.2 Configure Build Settings</h6>
            <div className="row">
              <div className="col-md-6">
                <strong>Framework Preset:</strong> Vite
                <br />
                <strong>Root Directory:</strong> ./ (leave empty)
                <br />
                <strong>Build Command:</strong> <code>npm run build</code>
                <br />
                <strong>Output Directory:</strong> <code>dist</code>
                <br />
                <strong>Install Command:</strong> <code>npm install</code>
              </div>
              <div className="col-md-6">
                <Alert variant="info" className="small">
                  <strong>Note:</strong> Vercel usually auto-detects these
                  settings for Vite projects.
                </Alert>
              </div>
            </div>

            <h6 className="mt-4">3.3 Add Environment Variables</h6>
            <p>In the Vercel deployment dashboard:</p>
            <ol>
              <li>Go to "Environment Variables" section</li>
              <li>Add each variable from your .env.example:</li>
            </ol>

            <div className="table-responsive">
              <table className="table table-bordered">
                <thead>
                  <tr>
                    <th>Variable Name</th>
                    <th>Example Value</th>
                    <th>Description</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>
                      <code>VITE_BACKEND_URL</code>
                    </td>
                    <td>https://your-backend.railway.app</td>
                    <td>Your backend API URL</td>
                  </tr>
                  <tr>
                    <td>
                      <code>VITE_APP_NAME</code>
                    </td>
                    <td>Hare Krishna Medical Store</td>
                    <td>Application name</td>
                  </tr>
                  <tr>
                    <td>
                      <code>VITE_NODE_ENV</code>
                    </td>
                    <td>production</td>
                    <td>Environment type</td>
                  </tr>
                  <tr>
                    <td>
                      <code>VITE_SOCKET_URL</code>
                    </td>
                    <td>https://your-backend.railway.app</td>
                    <td>Socket.io server URL</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <h6 className="mt-4">3.4 Deploy</h6>
            <p>
              Click "Deploy" and wait for the build to complete. This usually
              takes 2-5 minutes.
            </p>
          </Card.Body>
        </Card>

        {/* Step 4: Configure Custom Domain */}
        <Card className="mb-4 border-0 shadow-sm">
          <Card.Header className="bg-secondary text-white">
            <h5 className="mb-0">
              <i className="bi bi-4-circle me-2"></i>
              Step 4: Configure Custom Domain (Optional)
            </h5>
          </Card.Header>
          <Card.Body>
            <h6>4.1 Add Custom Domain</h6>
            <ol>
              <li>Go to your project dashboard on Vercel</li>
              <li>Click on "Domains" tab</li>
              <li>Enter your custom domain (e.g., harekrishnamedical.com)</li>
              <li>Follow the DNS configuration instructions</li>
            </ol>

            <h6>4.2 DNS Configuration</h6>
            <p>Add these DNS records to your domain provider:</p>
            <div className="table-responsive">
              <table className="table table-bordered">
                <thead>
                  <tr>
                    <th>Type</th>
                    <th>Name</th>
                    <th>Value</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>CNAME</td>
                    <td>www</td>
                    <td>cname.vercel-dns.com</td>
                  </tr>
                  <tr>
                    <td>A</td>
                    <td>@</td>
                    <td>76.76.19.61</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <Alert variant="info">
              <strong>Note:</strong> DNS propagation can take up to 48 hours,
              but usually completes within a few hours.
            </Alert>
          </Card.Body>
        </Card>

        {/* Step 5: Backend Configuration */}
        <Card className="mb-4 border-0 shadow-sm">
          <Card.Header className="bg-danger text-white">
            <h5 className="mb-0">
              <i className="bi bi-5-circle me-2"></i>
              Step 5: Update Backend CORS Configuration
            </h5>
          </Card.Header>
          <Card.Body>
            <h6>5.1 Update Backend Environment Variables</h6>
            <p>Add your Vercel domain to your backend's allowed origins:</p>
            <div className="code-block bg-dark text-light p-3 rounded mb-3">
              <pre className="mb-0">
                {`# Backend .env file
FRONTEND_URL=https://your-app.vercel.app
CORS_ORIGINS=https://your-app.vercel.app,https://your-custom-domain.com

# If using multiple domains
CORS_ORIGINS=https://your-app.vercel.app,https://your-preview.vercel.app,https://your-custom-domain.com`}
              </pre>
            </div>

            <h6>5.2 Update CORS Configuration</h6>
            <p>In your backend Express.js configuration:</p>
            <div className="code-block bg-dark text-light p-3 rounded mb-3">
              <pre className="mb-0">
                {`const cors = require('cors');

const corsOptions = {
  origin: [
    'https://your-app.vercel.app',
    'https://your-custom-domain.com',
    // Add all your Vercel preview URLs
  ],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
};

app.use(cors(corsOptions));`}
              </pre>
            </div>
          </Card.Body>
        </Card>

        {/* Step 6: Testing & Optimization */}
        <Card className="mb-4 border-0 shadow-sm">
          <Card.Header className="bg-dark text-white">
            <h5 className="mb-0">
              <i className="bi bi-6-circle me-2"></i>
              Step 6: Testing & Optimization
            </h5>
          </Card.Header>
          <Card.Body>
            <h6>6.1 Test Your Deployment</h6>
            <ul>
              <li>Visit your Vercel URL and test all functionality</li>
              <li>Test user registration and login</li>
              <li>Test product browsing and cart functionality</li>
              <li>Test invoice generation and verification</li>
              <li>Test responsive design on mobile devices</li>
            </ul>

            <h6>6.2 Performance Optimization</h6>
            <div className="row">
              <div className="col-md-6">
                <h7>Vercel Analytics</h7>
                <ol>
                  <li>Enable Vercel Analytics in your dashboard</li>
                  <li>Monitor page load times</li>
                  <li>Track user interactions</li>
                </ol>
              </div>
              <div className="col-md-6">
                <h7>Speed Insights</h7>
                <ol>
                  <li>Enable Vercel Speed Insights</li>
                  <li>Monitor Core Web Vitals</li>
                  <li>Optimize based on recommendations</li>
                </ol>
              </div>
            </div>

            <h6>6.3 Security Headers</h6>
            <p>
              Create a <code>vercel.json</code> file in your project root:
            </p>
            <div className="code-block bg-dark text-light p-3 rounded mb-3">
              <pre className="mb-0">
                {`{
  "headers": [
    {
      "source": "/(.*)",
      "headers": [
        {
          "key": "X-Content-Type-Options",
          "value": "nosniff"
        },
        {
          "key": "X-Frame-Options",
          "value": "DENY"
        },
        {
          "key": "X-XSS-Protection",
          "value": "1; mode=block"
        },
        {
          "key": "Referrer-Policy",
          "value": "strict-origin-when-cross-origin"
        },
        {
          "key": "Content-Security-Policy",
          "value": "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; font-src 'self' data:; connect-src 'self' https:;"
        }
      ]
    }
  ],
  "rewrites": [
    {
      "source": "/(.*)",
      "destination": "/index.html"
    }
  ]
}`}
              </pre>
              <Button
                size="sm"
                variant="outline-light"
                className="mt-2"
                onClick={() =>
                  copyToClipboard(`{
  "headers": [
    {
      "source": "/(.*)",
      "headers": [
        {
          "key": "X-Content-Type-Options",
          "value": "nosniff"
        },
        {
          "key": "X-Frame-Options",
          "value": "DENY"
        },
        {
          "key": "X-XSS-Protection",
          "value": "1; mode=block"
        },
        {
          "key": "Referrer-Policy",
          "value": "strict-origin-when-cross-origin"
        }
      ]
    }
  ],
  "rewrites": [
    {
      "source": "/(.*)",
      "destination": "/index.html"
    }
  ]
}`)
                }
              >
                <i className="bi bi-clipboard me-1"></i>
                Copy vercel.json
              </Button>
            </div>
          </Card.Body>
        </Card>

        {/* Troubleshooting */}
        <Card className="mb-4 border-0 shadow-sm">
          <Card.Header className="bg-warning text-dark">
            <h5 className="mb-0">
              <i className="bi bi-exclamation-triangle me-2"></i>
              Troubleshooting Common Issues
            </h5>
          </Card.Header>
          <Card.Body>
            <h6>Build Failures</h6>
            <ul>
              <li>
                <strong>Memory Issues:</strong> Use build optimization in
                vite.config.js
              </li>
              <li>
                <strong>Package Issues:</strong> Ensure all dependencies are in
                package.json
              </li>
              <li>
                <strong>Environment Variables:</strong> Double-check all VITE_
                prefixed variables
              </li>
            </ul>

            <h6>Runtime Errors</h6>
            <ul>
              <li>
                <strong>CORS Errors:</strong> Update backend CORS configuration
              </li>
              <li>
                <strong>API Connection:</strong> Verify VITE_BACKEND_URL is
                correct and accessible
              </li>
              <li>
                <strong>404 on Refresh:</strong> Add rewrites configuration in
                vercel.json
              </li>
            </ul>

            <h6>Performance Issues</h6>
            <ul>
              <li>
                <strong>Large Bundle Size:</strong> Implement code splitting
              </li>
              <li>
                <strong>Slow Loading:</strong> Optimize images and use lazy
                loading
              </li>
              <li>
                <strong>Memory Usage:</strong> Check for memory leaks in
                useEffect hooks
              </li>
            </ul>
          </Card.Body>
        </Card>

        {/* Maintenance */}
        <Card className="mb-4 border-0 shadow-sm">
          <Card.Header className="bg-success text-white">
            <h5 className="mb-0">
              <i className="bi bi-gear me-2"></i>
              Ongoing Maintenance
            </h5>
          </Card.Header>
          <Card.Body>
            <h6>Automatic Deployments</h6>
            <p>
              Vercel automatically deploys when you push to your connected Git
              branch:
            </p>
            <ul>
              <li>
                <strong>Production:</strong> Deployments from main/master branch
              </li>
              <li>
                <strong>Preview:</strong> Deployments from feature branches
              </li>
              <li>
                <strong>Rollback:</strong> Easy rollback to previous deployments
              </li>
            </ul>

            <h6>Monitoring</h6>
            <ul>
              <li>Monitor deployment status in Vercel dashboard</li>
              <li>Set up alerts for failed deployments</li>
              <li>Use Vercel Analytics for performance insights</li>
              <li>Monitor error logs in real-time</li>
            </ul>

            <h6>Security Updates</h6>
            <ul>
              <li>Regularly update dependencies</li>
              <li>Monitor for security vulnerabilities</li>
              <li>Update environment variables as needed</li>
              <li>Review and update CSP headers</li>
            </ul>
          </Card.Body>
        </Card>

        {/* Success Message */}
        <Alert variant="success" className="text-center">
          <Alert.Heading>
            <i className="bi bi-check-circle me-2"></i>
            Deployment Complete!
          </Alert.Heading>
          <p>Your Hare Krishna Medical Store is now live on Vercel! 🎉</p>
          <hr />
          <p className="mb-0">
            Don't forget to update your backend CORS settings and test all
            functionality.
          </p>
        </Alert>

        {/* Additional Resources */}
        <Card className="border-0 shadow-sm">
          <Card.Header className="bg-info text-white">
            <h5 className="mb-0">
              <i className="bi bi-book me-2"></i>
              Additional Resources
            </h5>
          </Card.Header>
          <Card.Body>
            <Row>
              <Col md={6}>
                <h6>Documentation</h6>
                <ul>
                  <li>
                    <a
                      href="https://vercel.com/docs"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Vercel Documentation
                    </a>
                  </li>
                  <li>
                    <a
                      href="https://vitejs.dev/guide/build.html"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Vite Build Guide
                    </a>
                  </li>
                  <li>
                    <a
                      href="https://react.dev/learn"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      React Documentation
                    </a>
                  </li>
                </ul>
              </Col>
              <Col md={6}>
                <h6>Backend Deployment</h6>
                <ul>
                  <li>
                    <a
                      href="https://railway.app"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Railway (Recommended)
                    </a>
                  </li>
                  <li>
                    <a
                      href="https://heroku.com"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Heroku
                    </a>
                  </li>
                  <li>
                    <a
                      href="https://render.com"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Render
                    </a>
                  </li>
                </ul>
              </Col>
            </Row>
          </Card.Body>
        </Card>
      </Container>
    </div>
  );
};

export default VercelDeploymentGuide;
