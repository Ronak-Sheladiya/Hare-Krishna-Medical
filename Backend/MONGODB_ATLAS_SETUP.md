# MongoDB Atlas Connection Setup

## Current Issue

Your MongoDB Atlas cluster is not allowing connections due to IP whitelist restrictions.

**Error:** `Could not connect to any servers in your MongoDB Atlas cluster. One common reason is that you're trying to access the database from an IP that isn't whitelisted.`

## ✅ Quick Fix - Whitelist IP Address

### Method 1: Allow All IPs (Development Only)

1. Go to [MongoDB Atlas Dashboard](https://cloud.mongodb.com/)
2. Navigate to your cluster (Cluster0)
3. Click **"Network Access"** in the left sidebar
4. Click **"Add IP Address"**
5. Click **"Allow Access from Anywhere"** (adds 0.0.0.0/0)
6. Click **"Confirm"**
7. Wait 2-3 minutes for changes to propagate

### Method 2: Whitelist Specific IP

1. Go to [MongoDB Atlas Dashboard](https://cloud.mongodb.com/)
2. Navigate to **Network Access**
3. Click **"Add IP Address"**
4. Choose **"Add Current IP Address"**
5. Click **"Confirm"**

## 🔧 Alternative: Test with Sample Database

If you want to test with a temporary database, you can use MongoDB Atlas free shared cluster:

1. Create a new database user:
   - Go to **Database Access**
   - Click **"Add New Database User"**
   - Username: `testuser`
   - Password: `testpass123`
   - Database User Privileges: **"Read and write to any database"**

2. Update your connection string:

```
MONGODB_URI=mongodb+srv://testuser:testpass123@cluster0.idf2afh.mongodb.net/HareKrishnaMedical?retryWrites=true&w=majority&appName=Cluster0
```

## 🧪 Testing Database Connection

After fixing the IP whitelist, restart the server and check:

```bash
# Check health endpoint
curl http://localhost:5000/api/health

# Should show: "database": "connected"
```

## 📊 Seeding the Database

Once connected, populate the database with initial data:

```bash
cd Backend
npm run seed
```

This will create:

- Admin user (admin@harekrishnamedical.com / admin123)
- Sample products
- Test data for development

## 🚀 Verifying Full CRUD

After database connection is established:

1. **Products will load from database** (not sample data)
2. **Admin can add/edit/delete products**
3. **User registration/login will work**
4. **Orders and invoices will be stored**
5. **Real-time updates via Socket.io**

## 📝 Connection String Format

Your current connection string:

```
mongodb+srv://ronaksheladiya652:ronak65295865@cluster0.idf2afh.mongodb.net/Hare_Krishna_Medical_db?retryWrites=true&w=majority&appName=Cluster0&ssl=true&authSource=admin
```

Make sure to:

- ✅ Database name is correct
- ✅ Username/password are correct
- ✅ IP is whitelisted
- ✅ SSL is enabled

## 🔒 Security Notes

- **Never commit credentials to GitHub**
- **Use environment variables for production**
- **Restrict IP whitelist in production**
- **Use strong passwords for database users**
