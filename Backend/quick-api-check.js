// Quick API Health Check and Basic Fixes
const mongoose = require("mongoose");
require("dotenv").config();

// Import models
const User = require("./models/User");
const Product = require("./models/Product");

async function quickAPICheck() {
  console.log("🔍 Quick API Health Check Starting...\n");

  try {
    // 1. Database Connection Test
    console.log("1. Testing Database Connection...");
    const mongoURI =
      process.env.MONGODB_URI ||
      "mongodb+srv://ronaksheladiya652:Ronak95865@cluster0.loaubzp.mongodb.net/Hare_Krishna_Medical_db?retryWrites=true&w=majority&appName=Cluster0";

    await mongoose.connect(mongoURI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 5000,
    });

    console.log("✅ Database connected successfully");
    console.log(`📊 Database: ${mongoose.connection.name}`);

    // 2. Check Models
    console.log("\n2. Testing Models...");

    // Test User model
    const userCount = await User.countDocuments();
    console.log(`👥 Users in database: ${userCount}`);

    // Create admin if doesn't exist
    const adminExists = await User.findOne({ email: "admin@gmail.com" });
    if (!adminExists) {
      console.log("🔧 Creating admin user...");
      const adminUser = new User({
        fullName: "Admin User",
        email: "admin@gmail.com",
        mobile: "9876543210",
        password: "Ronak@95865",
        role: 1,
        address: "Admin Address",
        emailVerified: true,
      });
      await adminUser.save();
      console.log("✅ Admin user created");
    } else {
      console.log("✅ Admin user exists");
    }

    // Test Product model
    const productCount = await Product.countDocuments();
    console.log(`🛍️ Products in database: ${productCount}`);

    if (productCount === 0) {
      console.log("🔧 Creating sample products...");
      const sampleProducts = [
        {
          name: "Paracetamol 500mg",
          description: "Effective pain relief and fever reducer tablet",
          shortDescription: "Pain relief tablet",
          company: "Cipla",
          price: 50,
          stock: 100,
          category: "Medicine",
          images: ["https://via.placeholder.com/300x300?text=Paracetamol"],
        },
        {
          name: "Vitamin D3 Supplement",
          description: "Essential vitamin D3 supplement for bone health",
          shortDescription: "Vitamin D3 supplement",
          company: "Sun Pharma",
          price: 200,
          stock: 75,
          category: "Supplements",
          images: ["https://via.placeholder.com/300x300?text=Vitamin+D3"],
        },
        {
          name: "Digital Thermometer",
          description:
            "Accurate digital thermometer for temperature monitoring",
          shortDescription: "Digital thermometer",
          company: "Omron",
          price: 350,
          stock: 50,
          category: "Medical Devices",
          images: ["https://via.placeholder.com/300x300?text=Thermometer"],
        },
      ];

      for (const productData of sampleProducts) {
        const product = new Product(productData);
        await product.save();
      }
      console.log(`✅ Created ${sampleProducts.length} sample products`);
    } else {
      console.log("✅ Products exist in database");
    }

    // 3. Test Environment Variables
    console.log("\n3. Checking Environment Configuration...");
    const requiredEnvVars = [
      "MONGODB_URI",
      "JWT_SECRET",
      "EMAIL_HOST",
      "EMAIL_USER",
      "EMAIL_PASS",
    ];

    let envIssues = 0;
    requiredEnvVars.forEach((envVar) => {
      if (process.env[envVar]) {
        console.log(`✅ ${envVar} is configured`);
      } else {
        console.log(`❌ ${envVar} is missing`);
        envIssues++;
      }
    });

    if (envIssues === 0) {
      console.log("✅ All environment variables configured");
    } else {
      console.log(`⚠️ ${envIssues} environment variables need attention`);
    }

    // 4. Test Email Service
    console.log("\n4. Testing Email Service...");
    try {
      const emailService = require("./utils/emailService");
      const emailConnected = await emailService.testConnection();
      if (emailConnected) {
        console.log("✅ Email service connected");
      } else {
        console.log("⚠️ Email service connection failed");
      }
    } catch (emailError) {
      console.log("❌ Email service error:", emailError.message);
    }

    // 5. Test JWT Configuration
    console.log("\n5. Testing JWT Configuration...");
    const jwt = require("jsonwebtoken");
    try {
      const testPayload = { test: true };
      const token = jwt.sign(
        testPayload,
        process.env.JWT_SECRET || "test-secret",
      );
      const decoded = jwt.verify(
        token,
        process.env.JWT_SECRET || "test-secret",
      );
      console.log("✅ JWT configuration working");
    } catch (jwtError) {
      console.log("❌ JWT configuration error:", jwtError.message);
    }

    console.log("\n🎉 Quick API Health Check Completed!");
    console.log("\n📋 Summary:");
    console.log(
      `   Database: Connected (${userCount} users, ${productCount} products)`,
    );
    console.log(
      `   Environment: ${envIssues === 0 ? "Configured" : "Needs attention"}`,
    );
    console.log("   Models: Working");
    console.log("   Ready for API testing!");
  } catch (error) {
    console.error("❌ Health check failed:", error.message);
    console.error("\n🔧 Troubleshooting:");
    console.error("   1. Check MongoDB connection string");
    console.error("   2. Verify environment variables in .env file");
    console.error("   3. Ensure all dependencies are installed");
    console.error("   4. Check network connectivity");
  } finally {
    if (mongoose.connection.readyState === 1) {
      await mongoose.disconnect();
      console.log("\n📡 Database disconnected");
    }
  }
}

// Common API Issues and Fixes
const commonFixes = {
  // Fix CORS issues
  corsIssues: `
// Add to server.js after app creation:
app.use(cors({
  origin: ['http://localhost:3000', 'http://localhost:5173', 'https://yourdomain.com'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
`,

  // Fix validation errors
  validationFixes: `
// Common validation fixes:
1. Ensure all required fields are provided
2. Check data types match schema requirements
3. Verify ObjectId format for MongoDB references
4. Validate email format and phone numbers
5. Check password requirements (min 6 characters)
`,

  // Fix authentication issues
  authFixes: `
// Authentication troubleshooting:
1. Check JWT secret is properly set
2. Verify token format: "Bearer <token>"
3. Ensure user exists and is active
4. Check token expiration
5. Verify password hashing/comparison
`,

  // Database connection fixes
  dbFixes: `
// Database connection fixes:
1. Check MongoDB URI format and credentials
2. Verify network connectivity
3. Check MongoDB Atlas IP whitelist
4. Ensure database exists
5. Verify connection string parameters
`,
};

console.log("\n📚 Common API Fixes Available:");
Object.keys(commonFixes).forEach((fix) => {
  console.log(`   - ${fix}`);
});

// Run the check
if (require.main === module) {
  quickAPICheck();
}

module.exports = { quickAPICheck, commonFixes };
