# Email Service Setup for Hare Krishna Medical Store

## Overview

The application uses Gmail SMTP to send emails for:

- OTP verification during registration
- Welcome emails after verification
- Password reset emails
- Admin notifications

## Environment Variables Required

### Production (Render.com)

Make sure these environment variables are set in your Render.com dashboard:

```bash
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your-gmail-address@gmail.com
EMAIL_PASS=your-app-password
EMAIL_FROM_NAME=Hare Krishna Medical Store
```

### Development (.env file)

```bash
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your-gmail-address@gmail.com
EMAIL_PASS=your-app-password
EMAIL_FROM_NAME=Hare Krishna Medical Store
```

## Gmail Setup Instructions

### 1. Enable 2-Factor Authentication

1. Go to your Google Account settings
2. Navigate to Security
3. Enable 2-Step Verification

### 2. Generate App Password

1. In Google Account settings → Security
2. Click on "App passwords"
3. Select "Mail" and "Other (Custom name)"
4. Enter "Hare Krishna Medical Store"
5. Copy the generated 16-character password
6. Use this password as `EMAIL_PASS` (not your regular Gmail password)

### 3. Verify Configuration

You can test the email configuration using:

```bash
cd Backend
node test-otp-email.js
```

## API Endpoints

### Email Status Check (Admin Only)

```http
GET /api/mail/status
Authorization: Bearer <admin-token>
```

### Send Test Email (Admin Only)

```http
POST /api/mail/send-test
Authorization: Bearer <admin-token>
Content-Type: application/json

{
  "email": "test@example.com",
  "type": "verification" // or "welcome" or "test"
}
```

### Get Email History (Admin Only)

```http
GET /api/mail/sent
Authorization: Bearer <admin-token>
```

## Troubleshooting

### OTP Not Sending During Registration

1. Check if all environment variables are set
2. Verify Gmail app password is correct
3. Check server logs for email errors
4. Test email service using `/api/mail/status` endpoint

### Common Error Messages

#### "Authentication failed"

- Wrong EMAIL_USER or EMAIL_PASS
- Need to use App Password instead of regular password

#### "Connection timeout"

- Check EMAIL_HOST and EMAIL_PORT
- Verify firewall/network connectivity

#### "Less secure app access"

- Enable 2FA and use App Password
- Don't use "Less secure app access" (deprecated)

## Testing Email Functionality

### 1. Local Testing

```bash
cd Backend
node test-otp-email.js
```

### 2. API Testing

Use the mail endpoints to test email functionality:

- Status check: `GET /api/mail/status`
- Send test: `POST /api/mail/send-test`

### 3. Registration Flow Testing

1. Register a new user
2. Check server logs for email sending status
3. Verify OTP email is received
4. Complete verification process

## Security Notes

- Never commit EMAIL_PASS to version control
- Use environment variables for all email credentials
- Regularly rotate app passwords
- Monitor email usage for unusual activity

## Email Templates

The application includes professional email templates for:

- **Verification emails**: OTP codes with security information
- **Welcome emails**: Post-verification welcome message
- **Password reset**: Secure reset links with expiration
- **Admin notifications**: System alerts and user activities

All emails follow a consistent brand design with proper security warnings and contact information.
