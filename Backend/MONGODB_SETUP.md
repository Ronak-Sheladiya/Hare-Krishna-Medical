# MongoDB Setup Guide

## Current Issue

The application is not connecting to MongoDB because MongoDB is not running locally. This is why CRUD operations are not working.

## Current Error

```
❌ MongoDB connection failed: connect ECONNREFUSED 127.0.0.1:27017
```

## Solution Options

### Option 1: Install MongoDB Locally (Recommended for Development)

#### For Ubuntu/Debian:

```bash
# Import MongoDB public GPG key
wget -qO - https://www.mongodb.org/static/pgp/server-6.0.asc | sudo apt-key add -

# Create MongoDB list file
echo "deb [ arch=amd64,arm64 ] https://repo.mongodb.org/apt/ubuntu focal/mongodb-org/6.0 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-6.0.list

# Update package list
sudo apt-get update

# Install MongoDB
sudo apt-get install -y mongodb-org

# Start MongoDB service
sudo systemctl start mongod
sudo systemctl enable mongod

# Check status
sudo systemctl status mongod
```

#### For macOS:

```bash
# Install using Homebrew
brew install mongodb-community@6.0

# Start MongoDB
brew services start mongodb-community@6.0
```

#### For Windows:

1. Download MongoDB Community Server from https://www.mongodb.com/try/download/community
2. Install using the installer
3. Start MongoDB service from Services or run `mongod` command

### Option 2: Use MongoDB Atlas (Cloud Database)

1. Go to https://www.mongodb.com/atlas
2. Create a free account
3. Create a new cluster (free tier)
4. Create a database user
5. Whitelist your IP address (0.0.0.0/0 for development)
6. Get the connection string
7. Update the .env file with the Atlas connection string

Example Atlas connection string:

```
MONGODB_URI=mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/Hare_Krishna_Medical_db?retryWrites=true&w=majority
```

## Quick Test

After setting up MongoDB, test the connection:

```bash
cd Backend
npm run seed
```

This will populate the database with initial data including:

- Admin user (admin@harekrishnamedical.com / admin123)
- Sample products
- Test data
