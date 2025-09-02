# 🚀 Supabase Setup Guide

## Overview
This guide will help you set up Supabase as the database for Hare Krishna Medical Store with real-time capabilities.

## ✅ Prerequisites
- Supabase account
- Project ID: `dvryosjtfrscdbrzssdz`
- Database URL: `https://dvryosjtfrscdbrzssdz.supabase.co`

## 🔧 Database Setup

### 1. Run SQL Setup Script
1. Go to your Supabase Dashboard
2. Navigate to SQL Editor
3. Copy and paste the contents of `supabase-setup.sql`
4. Click "Run" to execute the script

This will create:
- All required tables (users, products, orders, invoices, messages, letterheads, verifications)
- Indexes for performance
- Row Level Security policies
- Real-time subscriptions
- Sample admin user and products

### 2. Verify Tables Created
Check that these tables exist in your database:
- ✅ users
- ✅ products  
- ✅ orders
- ✅ invoices
- ✅ messages
- ✅ letterheads
- ✅ verifications

### 3. Enable Real-time
Real-time is automatically enabled for all tables in the setup script.

## 🔑 Authentication Setup

### Default Admin Account
- **Email**: `admin@harekrishnamedical.com`
- **Password**: `Admin@123`
- **Role**: Admin (1)

**⚠️ Important**: Change this password immediately after first login!

## 🌐 Frontend Integration

### Environment Variables
The following environment variables are configured:

**Development** (`.env.development`):
```env
VITE_SUPABASE_URL=https://dvryosjtfrscdbrzssdz.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
VITE_REALTIME_ENABLED=true
```

**Production** (`.env.production`):
```env
VITE_SUPABASE_URL=https://dvryosjtfrscdbrzssdz.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
VITE_REALTIME_ENABLED=true
```

### Real-time Features
All pages now have real-time data updates:

1. **Admin Dashboard**: Live stats, orders, and product updates
2. **Product Management**: Real-time stock updates
3. **Order Management**: Live order status changes
4. **User Management**: Real-time user registrations
5. **Invoice System**: Live invoice generation and verification

## 🔄 Real-time Implementation

### Using the Real-time Hook
```javascript
import { useSupabaseRealtime } from '../hooks/useSupabaseRealtime';

const { data: products, loading, error } = useSupabaseRealtime('products', []);
```

### Using the Service
```javascript
import supabaseService from '../services/supabaseService';

// Get all products
const products = await supabaseService.getProducts();

// Create new product
const newProduct = await supabaseService.create('products', productData);

// Update product
const updated = await supabaseService.update('products', id, updateData);
```

## 🔒 Security Features

### Row Level Security (RLS)
- Users can only access their own data
- Admins have full access to all data
- Public access for invoice/letterhead verification
- Secure API endpoints with proper authentication

### Policies Implemented
- **Users**: Can view own profile, admins view all
- **Products**: Public read, admin write
- **Orders**: Users see own orders, admins see all
- **Invoices**: Public read for verification, admin write
- **Messages**: Admin access only
- **Letterheads**: Public read for verification, admin write

## 📊 Data Structure

### Key Tables Schema

**Users Table**:
- id (UUID, Primary Key)
- full_name, email, mobile
- password_hash, role (0=user, 1=admin)
- email_verified, is_active
- created_at, updated_at

**Products Table**:
- id (UUID, Primary Key)
- name, description, price
- stock, low_stock_threshold
- category, image_url
- is_active, created_at, updated_at

**Orders Table**:
- id (UUID, Primary Key)
- order_number (Unique)
- user_id (Foreign Key)
- customer details, items (JSONB)
- pricing, status, payment info
- created_at, updated_at

## 🚀 Deployment

### Vercel Environment Variables
Set these in your Vercel dashboard:

```env
VITE_SUPABASE_URL=https://dvryosjtfrscdbrzssdz.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here
VITE_REALTIME_ENABLED=true
```

### Backend Configuration
The backend is configured to use Supabase instead of MongoDB:
- Connection established in `config/supabase.js`
- Controllers updated to use Supabase client
- Real-time subscriptions enabled

## 🧪 Testing Real-time Features

### Test Real-time Updates
1. Open Admin Dashboard in one browser tab
2. Open Products page in another tab
3. Add/edit a product in one tab
4. Watch the dashboard update automatically in the other tab

### Test Data Flow
1. **User Registration**: Creates user → Updates dashboard stats
2. **Product Updates**: Stock changes → Updates low stock alerts
3. **Order Creation**: New order → Updates recent orders list
4. **Invoice Generation**: New invoice → Updates revenue stats

## 🔧 Troubleshooting

### Common Issues

**Connection Failed**:
- Check Supabase project status
- Verify API keys are correct
- Check network connectivity

**Real-time Not Working**:
- Ensure tables are added to realtime publication
- Check browser console for WebSocket errors
- Verify RLS policies allow access

**Authentication Issues**:
- Check JWT secret configuration
- Verify user roles and permissions
- Test with default admin account

### Debug Commands
```javascript
// Test Supabase connection
import { supabase } from './config/supabase';
const { data, error } = await supabase.from('users').select('count');

// Test real-time subscription
const subscription = supabase
  .channel('test')
  .on('postgres_changes', { event: '*', schema: 'public', table: 'products' }, 
    payload => console.log('Change received!', payload))
  .subscribe();
```

## 📈 Performance Optimization

### Indexes Created
- Email index on users table
- Category index on products table
- User ID index on orders table
- Status indexes for filtering

### Query Optimization
- Use select() to limit returned fields
- Implement pagination for large datasets
- Use proper filtering and sorting

## 🎉 Success!

Your Hare Krishna Medical Store now has:
- ✅ Real-time database with Supabase
- ✅ Live data updates across all pages
- ✅ Secure authentication and authorization
- ✅ Scalable PostgreSQL database
- ✅ Built-in real-time subscriptions
- ✅ Row-level security
- ✅ Production-ready deployment

The application will now show live data updates without page refreshes, providing a modern, responsive user experience!

---
**Database**: Supabase PostgreSQL  
**Real-time**: WebSocket subscriptions  
**Security**: Row Level Security + JWT  
**Performance**: Indexed queries + optimized subscriptions