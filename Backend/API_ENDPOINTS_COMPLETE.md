# 🚀 Complete API Endpoints Documentation

## 📊 **Server Status**

- **Health Check**: `GET /api/health` ✅ **WORKING**
- **Server**: http://localhost:5000 (Development)
- **Database**: MongoDB Atlas - Connected ✅
- **Environment**: Development

---

## 🔐 **Authentication APIs** (`/api/auth`)

| Method | Endpoint                 | Access  | Description         | Status |
| ------ | ------------------------ | ------- | ------------------- | ------ |
| `POST` | `/register`              | Public  | Register new user   | ✅     |
| `POST` | `/login`                 | Public  | User login          | ✅     |
| `GET`  | `/profile`               | Private | Get user profile    | ✅     |
| `PUT`  | `/update-profile`        | Private | Update user profile | ✅     |
| `POST` | `/change-password`       | Private | Change password     | ✅     |
| `POST` | `/forgot-password`       | Public  | Send reset email    | ✅     |
| `POST` | `/reset-password/:token` | Public  | Reset password      | ✅     |
| `POST` | `/verify-otp`            | Public  | Verify email OTP    | ✅     |
| `POST` | `/resend-otp`            | Public  | Resend OTP          | ✅     |
| `POST` | `/logout`                | Private | Logout user         | ✅     |

### 📝 **Sample Requests:**

#### Register User

```bash
POST /api/auth/register
{
  "fullName": "John Doe",
  "email": "john@example.com",
  "mobile": "9876543210",
  "password": "SecurePass123!",
  "address": {
    "street": "123 Main St",
    "city": "Mumbai",
    "state": "Maharashtra",
    "pincode": "400001"
  }
}
```

#### Login User

```bash
POST /api/auth/login
{
  "email": "john@example.com",
  "password": "SecurePass123!"
}
```

---

## 👥 **User Management APIs** (`/api/users`)

| Method   | Endpoint                        | Access  | Description             | Status |
| -------- | ------------------------------- | ------- | ----------------------- | ------ |
| `GET`    | `/dashboard`                    | Private | User dashboard data     | ✅     |
| `GET`    | `/dashboard-stats`              | Private | User dashboard stats    | ✅     |
| `GET`    | `/profile`                      | Private | Get profile with orders | ✅     |
| `PUT`    | `/profile`                      | Private | Update profile          | ✅     |
| `GET`    | `/admin/all`                    | Admin   | Get all users           | ✅     |
| `GET`    | `/admin/stats`                  | Admin   | User statistics         | ✅     |
| `PUT`    | `/admin/:id/status`             | Admin   | Update user status      | ✅     |
| `PUT`    | `/admin/:id/role`               | Admin   | Update user role        | ✅     |
| `DELETE` | `/admin/:id`                    | Admin   | Delete user             | ✅     |
| `POST`   | `/upload-profile-image`         | Private | Upload avatar           | ✅     |
| `DELETE` | `/delete-profile-image/:userId` | Private | Delete avatar           | ✅     |

---

## 🛍️ **Product Management APIs** (`/api/products`)

| Method   | Endpoint              | Access | Description           | Status |
| -------- | --------------------- | ------ | --------------------- | ------ |
| `GET`    | `/`                   | Public | Get all products      | ✅     |
| `GET`    | `/categories`         | Public | Get categories        | ✅     |
| `GET`    | `/featured`           | Public | Get featured products | ✅     |
| `GET`    | `/search-suggestions` | Public | Search suggestions    | ✅     |
| `GET`    | `/admin/low-stock`    | Admin  | Low stock products    | ✅     |
| `GET`    | `/:id`                | Public | Get single product    | ✅     |
| `POST`   | `/`                   | Admin  | Create product        | ✅     |
| `PUT`    | `/:id`                | Admin  | Update product        | ✅     |
| `PUT`    | `/:id/stock`          | Admin  | Update stock          | ✅     |
| `DELETE` | `/:id`                | Admin  | Delete product        | ✅     |
| `POST`   | `/upload-images`      | Admin  | Upload images         | ✅     |
| `DELETE` | `/delete-image`       | Admin  | Delete image          | ✅     |

### 📝 **Sample Requests:**

#### Get Products with Filters

```bash
GET /api/products?page=1&limit=12&category=medicine&search=paracetamol&sort=price&order=asc
```

#### Create Product

```bash
POST /api/products
{
  "name": "Paracetamol 500mg",
  "description": "Pain relief medication",
  "price": 25.50,
  "category": "medicine",
  "brand": "Generic",
  "stock": 100,
  "images": ["image_id_1", "image_id_2"],
  "featured": false
}
```

---

## 📦 **Order Management APIs** (`/api/orders`)

| Method | Endpoint       | Access  | Description         | Status |
| ------ | -------------- | ------- | ------------------- | ------ |
| `POST` | `/`            | Private | Create new order    | ✅     |
| `GET`  | `/`            | Private | Get user orders     | ✅     |
| `GET`  | `/user/recent` | Private | Recent user orders  | ✅     |
| `GET`  | `/admin/all`   | Admin   | Get all orders      | ✅     |
| `GET`  | `/:id`         | Private | Get single order    | ✅     |
| `PUT`  | `/:id/status`  | Admin   | Update order status | ✅     |
| `POST` | `/:id/cancel`  | Private | Cancel order        | ✅     |

### 📝 **Sample Requests:**

#### Create Order

```bash
POST /api/orders
{
  "items": [
    {
      "product": "product_id_1",
      "quantity": 2,
      "price": 25.50
    }
  ],
  "shippingAddress": {
    "street": "123 Main St",
    "city": "Mumbai",
    "state": "Maharashtra",
    "pincode": "400001"
  },
  "paymentMethod": "cod"
}
```

---

## 🧾 **Invoice Management APIs** (`/api/invoices`)

| Method | Endpoint              | Access  | Description           | Status |
| ------ | --------------------- | ------- | --------------------- | ------ |
| `GET`  | `/`                   | Private | Get user invoices     | ✅     |
| `GET`  | `/verify/:invoiceId`  | Public  | Verify invoice (QR)   | ✅     |
| `GET`  | `/admin/all`          | Admin   | Get all invoices      | ✅     |
| `GET`  | `/admin/stats`        | Admin   | Invoice statistics    | ✅     |
| `GET`  | `/:id`                | Private | Get single invoice    | ✅     |
| `PUT`  | `/:id/payment-status` | Admin   | Update payment status | ✅     |
| `POST` | `/:id/regenerate-qr`  | Admin   | Regenerate QR code    | ✅     |
| `GET`  | `/:id/qr`             | Private | Get QR code           | ✅     |
| `POST` | `/:id/send-email`     | Admin   | Send invoice email    | ✅     |

---

## 💬 **Message/Contact APIs** (`/api/messages`)

| Method | Endpoint             | Access | Description           | Status |
| ------ | -------------------- | ------ | --------------------- | ------ |
| `POST` | `/contact`           | Public | Submit contact form   | ✅     |
| `GET`  | `/admin/all`         | Admin  | Get all messages      | ✅     |
| `GET`  | `/admin/stats`       | Admin  | Message statistics    | ✅     |
| `GET`  | `/admin/:id`         | Admin  | Get single message    | ✅     |
| `PUT`  | `/admin/:id/status`  | Admin  | Update message status | ✅     |
| `POST` | `/admin/:id/respond` | Admin  | Respond to message    | ✅     |

### 📝 **Sample Requests:**

#### Submit Contact Form

```bash
POST /api/messages/contact
{
  "name": "John Doe",
  "email": "john@example.com",
  "mobile": "9876543210",
  "subject": "Product Inquiry",
  "message": "I need information about your diabetes medications."
}
```

---

## 📊 **Analytics APIs** (`/api/analytics`) - Admin Only

| Method | Endpoint           | Access | Description             | Status |
| ------ | ------------------ | ------ | ----------------------- | ------ |
| `GET`  | `/dashboard`       | Admin  | Dashboard statistics    | ✅     |
| `GET`  | `/dashboard-stats` | Admin  | Dashboard stats (alias) | ✅     |
| `GET`  | `/revenue`         | Admin  | Revenue analytics       | ✅     |
| `GET`  | `/orders`          | Admin  | Order analytics         | ✅     |
| `GET`  | `/products`        | Admin  | Product analytics       | ✅     |
| `GET`  | `/customers`       | Admin  | Customer analytics      | ✅     |

---

## 📄 **Letterhead/Document APIs** (`/api/letterheads`)

| Method   | Endpoint                | Access | Description            | Status |
| -------- | ----------------------- | ------ | ---------------------- | ------ |
| `GET`    | `/health`               | Public | Health check           | ✅     |
| `GET`    | `/`                     | Admin  | Get all letterheads    | ✅     |
| `GET`    | `/stats`                | Admin  | Letterhead statistics  | ✅     |
| `GET`    | `/:id`                  | Admin  | Get single letterhead  | ✅     |
| `POST`   | `/`                     | Admin  | Create letterhead      | ✅     |
| `PUT`    | `/:id`                  | Admin  | Update letterhead      | ✅     |
| `DELETE` | `/:id`                  | Admin  | Delete letterhead      | ✅     |
| `PUT`    | `/:id/mark-issued`      | Admin  | Mark as issued         | ✅     |
| `PUT`    | `/:id/mark-sent`        | Admin  | Mark as sent           | ✅     |
| `GET`    | `/verify/:letterheadId` | Public | Verify letterhead (QR) | ✅     |

---

## 📁 **File Upload APIs** (`/api/upload`)

| Method   | Endpoint          | Access  | Description             | Status |
| -------- | ----------------- | ------- | ----------------------- | ------ |
| `GET`    | `/image/:id`      | Public  | Get image from database | ✅     |
| `POST`   | `/image`          | Admin   | Upload single image     | ✅     |
| `POST`   | `/product-images` | Admin   | Upload multiple images  | ✅     |
| `DELETE` | `/delete-image`   | Admin   | Delete image            | ✅     |
| `POST`   | `/user-avatar`    | Private | Upload user avatar      | ✅     |

---

## ✅ **Verification APIs** (`/api/verification`)

| Method | Endpoint                     | Access  | Description             | Status |
| ------ | ---------------------------- | ------- | ----------------------- | ------ |
| `POST` | `/send-email-verification`   | Private | Send email verification | ✅     |
| `POST` | `/verify-email/:token`       | Public  | Verify email with token | ✅     |
| `POST` | `/resend-email-verification` | Private | Resend verification     | ✅     |
| `GET`  | `/verify-docs`               | Public  | Verify documents        | ✅     |

---

## 🔔 **Notification APIs** (`/api/admin/notifications`)

| Method | Endpoint    | Access | Description         | Status |
| ------ | ----------- | ------ | ------------------- | ------ |
| `GET`  | `/`         | Admin  | Get notifications   | ✅     |
| `POST` | `/`         | Admin  | Create notification | ✅     |
| `PUT`  | `/:id/read` | Admin  | Mark as read        | ✅     |

---

## 🧪 **Development/Testing APIs**

| Method | Endpoint            | Access   | Description           | Status |
| ------ | ------------------- | -------- | --------------------- | ------ |
| `GET`  | `/api/health`       | Public   | Server health check   | ✅     |
| `GET`  | `/api/debug/routes` | Dev Only | List all routes       | ✅     |
| `POST` | `/api/seed/*`       | Dev Only | Database seeding      | ✅     |
| `GET`  | `/api/dev/*`        | Dev Only | Development utilities | ✅     |

---

## 🔧 **API Testing Guide**

### Using cURL:

```bash
# Health Check
curl -X GET http://localhost:5000/api/health

# Register User
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"fullName":"Test User","email":"test@example.com","mobile":"9876543210","password":"TestPass123!"}'

# Login User
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"TestPass123!"}'

# Get Products
curl -X GET "http://localhost:5000/api/products?page=1&limit=10"

# Contact Form
curl -X POST http://localhost:5000/api/messages/contact \
  -H "Content-Type: application/json" \
  -d '{"name":"Test User","email":"test@example.com","subject":"Test Subject","message":"Test message content"}'
```

### Authentication Headers:

```bash
# For protected routes, include JWT token:
curl -X GET http://localhost:5000/api/users/dashboard \
  -H "Authorization: Bearer YOUR_JWT_TOKEN_HERE"
```

---

## 📋 **API Status Summary**

### ✅ **Working APIs (All Tested)**

- **Authentication**: 10/10 endpoints
- **Users**: 11/11 endpoints
- **Products**: 12/12 endpoints
- **Orders**: 7/7 endpoints
- **Invoices**: 9/9 endpoints
- **Messages**: 6/6 endpoints
- **Analytics**: 6/6 endpoints
- **Letterheads**: 10/10 endpoints
- **Upload**: 5/5 endpoints
- **Verification**: 4/4 endpoints
- **Notifications**: 3/3 endpoints

### 🌐 **Total Endpoints**: 83 APIs ✅

### 🔐 **Security Features**:

- JWT Authentication ✅
- Role-based Access Control ✅
- Input Validation ✅
- Rate Limiting ✅
- CORS Protection ✅
- Password Hashing ✅

### 📧 **Email Integration**:

- OTP Verification ✅
- Password Reset ✅
- Order Confirmations ✅
- Invoice Delivery ✅

### 🔗 **QR Code Features**:

- Invoice Verification ✅
- Document Verification ✅
- Public Access URLs ✅

---

## 🚀 **Deployment Ready**

All APIs are production-ready with:

- Comprehensive error handling
- Input validation
- Authentication & authorization
- Database connectivity
- Email service integration
- File upload capabilities
- Real-time features (Socket.io)
