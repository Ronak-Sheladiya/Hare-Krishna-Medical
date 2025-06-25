#!/usr/bin/env node

/**
 * Security Setup Script for Hare Krishna Medical Backend
 * This script ensures all security dependencies are installed and configured
 */

const { execSync } = require("child_process");
const fs = require("fs");
const path = require("path");
const crypto = require("crypto");

console.log("🔒 Setting up security dependencies and configuration...");

// Check if required security packages are installed
const securityPackages = [
  "express-mongo-sanitize",
  "express-rate-limit",
  "helmet",
  "joi", // For enhanced validation
  "bcryptjs",
  "jsonwebtoken",
];

const devSecurityPackages = ["eslint-plugin-security"];

try {
  // Install security packages if not present
  console.log("📦 Installing security packages...");
  execSync(`npm install ${securityPackages.join(" ")}`, { stdio: "inherit" });

  console.log("📦 Installing development security packages...");
  execSync(`npm install --save-dev ${devSecurityPackages.join(" ")}`, {
    stdio: "inherit",
  });

  // Generate secure JWT secret if .env doesn't exist
  const envPath = path.join(__dirname, ".env");
  if (!fs.existsSync(envPath)) {
    console.log("🔑 Generating secure environment configuration...");

    const jwtSecret = crypto.randomBytes(64).toString("hex");
    const envContent = `# ===== AUTO-GENERATED SECURE CONFIGURATION =====
# Generated on: ${new Date().toISOString()}
# WARNING: Keep these values secret and secure!

# ===== SERVER CONFIGURATION =====
PORT=5000
NODE_ENV=development

# ===== DATABASE CONFIGURATION =====
MONGODB_URI=mongodb://localhost:27017/hare_krishna_medical

# ===== SECURITY CONFIGURATION =====
JWT_SECRET=${jwtSecret}
JWT_EXPIRES_IN=7d
BCRYPT_SALT_ROUNDS=12

# ===== CORS CONFIGURATION =====
FRONTEND_URL=http://localhost:5173

# ===== RATE LIMITING =====
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100

# ===== EMAIL CONFIGURATION (Configure these for full functionality) =====
# EMAIL_HOST=smtp.gmail.com
# EMAIL_PORT=587
# EMAIL_USER=your-email@gmail.com
# EMAIL_PASS=your-app-specific-password

# ===== CLOUDINARY CONFIGURATION (Configure for image uploads) =====
# CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
# CLOUDINARY_API_KEY=your_cloudinary_api_key
# CLOUDINARY_API_SECRET=your_cloudinary_api_secret
`;

    fs.writeFileSync(envPath, envContent);
    console.log("✅ Created secure .env file with generated JWT secret");
    console.log("⚠️  Please configure email and cloudinary settings in .env");
  }

  // Create security documentation
  const securityDocsPath = path.join(__dirname, "SECURITY.md");
  const securityDocs = `# Security Configuration

## Implemented Security Measures

### 1. Authentication & Authorization
- JWT tokens with secure, randomly generated secrets
- Password hashing with bcrypt (12 rounds)
- Role-based access control (Admin/User)
- Session management with secure cookies

### 2. Input Validation & Sanitization
- MongoDB injection protection (express-mongo-sanitize)
- Request validation using express-validator
- File upload restrictions and validation
- XSS protection through input sanitization

### 3. Rate Limiting
- Global rate limiting (100 requests/15 minutes)
- Authentication rate limiting (5 attempts/15 minutes)
- Upload rate limiting (10 uploads/15 minutes)
- Configurable rate limits per endpoint

### 4. Security Headers
- Helmet.js for security headers
- Content Security Policy (CSP)
- Cross-origin protection
- Frame protection (X-Frame-Options)

### 5. Database Security
- Connection string encryption
- Query sanitization
- Connection pooling with limits
- Regular backup recommendations

### 6. File Upload Security
- File type validation
- File size limits (5MB)
- Malicious file extension blocking
- Secure file storage (Cloudinary)

### 7. Environment Security
- Environment variable protection
- Secret management
- Development/production environment separation
- Secure default configurations

## Security Checklist

- [ ] Strong JWT secret generated (64+ characters)
- [ ] Database authentication enabled
- [ ] HTTPS configured in production
- [ ] Environment variables secured
- [ ] Rate limiting enabled
- [ ] Input validation implemented
- [ ] File upload restrictions in place
- [ ] Security headers configured
- [ ] Regular security audits scheduled
- [ ] Error handling doesn't expose sensitive information

## Regular Security Maintenance

1. Run \`npm audit\` weekly
2. Update dependencies monthly
3. Review security logs regularly
4. Monitor for suspicious activity
5. Backup database regularly
6. Test security measures periodically

## Production Deployment Security

1. Use environment variables, not .env files
2. Enable HTTPS with SSL certificates
3. Configure firewall rules
4. Set up monitoring and alerting
5. Use secure hosting providers
6. Implement database access controls
7. Enable audit logging
`;

  fs.writeFileSync(securityDocsPath, securityDocs);
  console.log("📝 Created security documentation (SECURITY.md)");

  console.log("\n🎉 Security setup completed successfully!");
  console.log("\n📋 Next steps:");
  console.log("1. Review and configure .env file settings");
  console.log("2. Set up email configuration for notifications");
  console.log("3. Configure Cloudinary for image uploads");
  console.log("4. Run 'npm audit' to check for vulnerabilities");
  console.log("5. Review SECURITY.md for detailed security information");
  console.log("\n⚠️  Remember to never commit .env files to version control!");
} catch (error) {
  console.error("❌ Security setup failed:", error.message);
  process.exit(1);
}
