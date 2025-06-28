# Primary Domain Configuration

## Overview

All user-facing links (forgot-password, QR codes, email links) now use the PRIMARY_DOMAIN environment variable for consistency and branding.

## Environment Variable

Add to your `.env` file:

```bash
PRIMARY_DOMAIN=https://hk-medical.vercel.app
```

## What Uses Primary Domain

### 🔐 Authentication Links

- **Forgot Password**: Password reset emails contain links to `${PRIMARY_DOMAIN}/reset-password/${token}`
- **Email Verification**: Account verification links use `${PRIMARY_DOMAIN}/verify-email/${token}`

### 📱 QR Code Links

- **Invoice QR Codes**: Point to `${PRIMARY_DOMAIN}/invoice/${invoiceId}`
- **Letterhead QR Codes**: Point to `${PRIMARY_DOMAIN}/verify-docs?id=${letterheadId}&type=letterhead`

### 📧 Email Template Links

- **Order Tracking**: `${PRIMARY_DOMAIN}/user/orders`
- **Invoice Access**: `${PRIMARY_DOMAIN}/user/invoices`
- **Website References**: All email templates use primary domain

## Default Value

If PRIMARY_DOMAIN is not set, defaults to: `https://hk-medical.vercel.app`

## Files Updated

- `Backend/controllers/authController.js` - Password reset URLs
- `Backend/utils/emailService.js` - Email template links and password reset
- `Backend/models/Invoice.js` - QR code generation
- `Backend/models/Letterhead.js` - QR code generation
- `Backend/controllers/invoicesController.js` - QR code regeneration
- `Backend/routes/verification.js` - Email verification links

## Benefits

- ✅ Consistent branding across all user communications
- ✅ Single source of truth for primary domain
- ✅ Easy to update domain for different environments
- ✅ Professional appearance in emails and QR codes
