const fs = require("fs");
const path = require("path");

const updateBackendDocs = () => {
  const readmePath = path.join(__dirname, "../README.md");

  // Read current README
  let readme = fs.readFileSync(readmePath, "utf8");

  // Add verification section to API endpoints
  const verificationEndpoints = `
### Verification

- \`POST /api/verification/send-email-verification\` - Send email verification link
- \`GET /api/verification/verify-email/:token\` - Verify email with token (Public)
- \`POST /api/verification/send-mobile-otp\` - Send mobile OTP
- \`POST /api/verification/verify-mobile-otp\` - Verify mobile OTP
- \`GET /api/verification/status\` - Get verification status
- \`POST /api/verification/resend-email\` - Resend email verification

`;

  // Insert after Users section
  readme = readme.replace(
    /### Users\n([\s\S]*?)\n\n###/,
    `### Users\n$1\n${verificationEndpoints}\n###`,
  );

  // Add verification model to database models section
  const verificationModel = `
### Verification Model

- Email and mobile verification workflow
- OTP generation and validation
- Verification status tracking
- Security measures and rate limiting

`;

  readme = readme.replace(
    /### Invoice Model\n([\s\S]*?)\n\n## 🧪/,
    `### Invoice Model\n$1\n${verificationModel}\n## 🧪`,
  );

  // Add QR Code enhancement section
  const qrCodeSection = `
## 🔗 QR Code Enhancements

### Direct Invoice Verification

QR codes on invoices now contain direct links to invoice verification pages:

- **QR Content**: Direct URL to \`/invoice-verify/:invoiceId\`
- **Public Access**: No authentication required for invoice verification
- **Mobile Friendly**: Optimized for mobile scanning and viewing
- **Secure**: Invoice verification through backend validation

### Implementation

\`\`\`javascript
// QR code contains direct verification URL
const verificationUrl = \`\${FRONTEND_URL}/invoice-verify/\${invoiceId}\`;

// Generate QR code with direct URL
const qrCode = await QRCode.toDataURL(verificationUrl, {
  width: 180,
  margin: 2,
  errorCorrectionLevel: "M"
});
\`\`\`

`;

  // Add before deployment section
  readme = readme.replace(
    /## 🚀 Deployment/,
    `${qrCodeSection}\n## 🚀 Deployment`,
  );

  // Add real-time features section
  const realTimeSection = `
## ⚡ Real-time Features

### Frontend Integration

The frontend includes Socket.io client integration for real-time updates:

\`\`\`javascript
import socketClient from './utils/socketClient';

// Connect when user authenticates
socketClient.connect(token, userRole);

// Listen for real-time events
socketClient.on('new-order', (data) => {
  // Handle new order notification
});
\`\`\`

### Admin Real-time Events

- \`new-user-registered\` - New user registration notifications
- \`new-order\` - Instant order notifications with sound alerts
- \`payment-status-updated\` - Real-time payment status changes
- \`stock-updated\` - Low stock alerts and inventory updates
- \`new-message\` - Contact form message notifications

### User Real-time Events

- \`order-created\` - Order confirmation notifications
- \`order-status-changed\` - Delivery status updates
- \`payment-status-changed\` - Payment confirmation updates

### Notification System

- Browser push notifications for critical updates
- Sound alerts for admin notifications
- Visual indicators in dashboard for new events
- Auto-refresh dashboard data without page reload

`;

  // Add before QR Code section
  readme = readme.replace(
    /## 🔗 QR Code Enhancements/,
    `${realTimeSection}\n## 🔗 QR Code Enhancements`,
  );

  // Write updated README
  fs.writeFileSync(readmePath, readme);

  console.log("✅ Backend documentation updated successfully!");
  console.log("\n📋 Updates made:");
  console.log("   - Added verification API endpoints");
  console.log("   - Added verification model documentation");
  console.log("   - Added QR code enhancement details");
  console.log("   - Added real-time features documentation");
  console.log("   - Added frontend integration examples");
};

// Run the update
updateBackendDocs();
