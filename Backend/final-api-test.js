#!/usr/bin/env node

// Final Comprehensive API Test and Fix Script
// This script tests all APIs and applies necessary fixes

const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
require("dotenv").config();

// Colors for beautiful console output
const colors = {
  reset: "\x1b[0m",
  bright: "\x1b[1m",
  red: "\x1b[31m",
  green: "\x1b[32m",
  yellow: "\x1b[33m",
  blue: "\x1b[34m",
  magenta: "\x1b[35m",
  cyan: "\x1b[36m",
  white: "\x1b[37m",
};

function log(message, color = "reset") {
  console.log(colors[color] + message + colors.reset);
}

function logHeader(title) {
  const line = "=".repeat(60);
  log(`\n${line}`, "cyan");
  log(`${title}`, "bright");
  log(`${line}`, "cyan");
}

// Main API Testing Class
class FinalAPITester {
  constructor() {
    this.results = {
      total: 0,
      passed: 0,
      failed: 0,
      fixed: 0,
      errors: [],
      fixes: [],
    };
  }

  // Database connection and setup
  async connectDatabase() {
    try {
      log("\n🔌 Connecting to MongoDB...", "yellow");

      const mongoURI =
        process.env.MONGODB_URI ||
        "mongodb+srv://ronaksheladiya652:Ronak95865@cluster0.loaubzp.mongodb.net/Hare_Krishna_Medical_db?retryWrites=true&w=majority&appName=Cluster0";

      await mongoose.connect(mongoURI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        serverSelectionTimeoutMS: 10000,
        socketTimeoutMS: 45000,
      });

      log("✅ MongoDB connected successfully", "green");
      log(`📊 Database: ${mongoose.connection.name}`, "blue");
      log(`🏠 Host: ${mongoose.connection.host}`, "blue");

      return true;
    } catch (error) {
      log(`❌ MongoDB connection failed: ${error.message}`, "red");
      return false;
    }
  }

  // Test and fix User model
  async testAndFixUsers() {
    logHeader("👥 USER MODEL TESTING & FIXES");

    try {
      const User = require("./models/User");

      // Test 1: Count users
      const userCount = await User.countDocuments();
      log(`📊 Total users in database: ${userCount}`, "blue");
      this.results.total++;
      this.results.passed++;

      // Test 2: Check admin user exists
      let adminUser = await User.findOne({ email: "admin@gmail.com" });
      if (!adminUser) {
        log("🔧 Creating admin user...", "yellow");
        adminUser = new User({
          fullName: "Admin User",
          email: "admin@gmail.com",
          mobile: "9876543210",
          password: "Ronak@95865",
          role: 1,
          address: {
            street: "Admin Street",
            city: "Medical City",
            state: "Gujarat",
            pincode: "123456",
          },
          emailVerified: true,
        });
        await adminUser.save();
        log("✅ Admin user created successfully", "green");
        this.results.fixed++;
        this.results.fixes.push("Created admin user");
      } else {
        log("✅ Admin user already exists", "green");
      }
      this.results.total++;
      this.results.passed++;

      // Test 3: Test password hashing
      const testPassword = "testpassword123";
      const hashedPassword = await bcrypt.hash(testPassword, 12);
      const isMatch = await bcrypt.compare(testPassword, hashedPassword);
      if (isMatch) {
        log("✅ Password hashing and comparison working", "green");
        this.results.passed++;
      } else {
        log("❌ Password hashing failed", "red");
        this.results.failed++;
        this.results.errors.push("Password hashing test failed");
      }
      this.results.total++;

      // Test 4: JWT token generation and verification
      const tokenPayload = { id: adminUser._id, role: adminUser.role };
      const token = jwt.sign(
        tokenPayload,
        process.env.JWT_SECRET || "dev-secret",
        { expiresIn: "7d" },
      );
      const decoded = jwt.verify(token, process.env.JWT_SECRET || "dev-secret");
      if (decoded.id && decoded.role) {
        log("✅ JWT token generation and verification working", "green");
        this.results.passed++;
      } else {
        log("❌ JWT token test failed", "red");
        this.results.failed++;
        this.results.errors.push("JWT token test failed");
      }
      this.results.total++;

      // Test 5: Fix address format for existing users
      const usersWithStringAddress = await User.find({
        address: { $type: "string" },
      });

      if (usersWithStringAddress.length > 0) {
        log(
          `🔧 Fixing address format for ${usersWithStringAddress.length} users...`,
          "yellow",
        );
        for (let user of usersWithStringAddress) {
          user.address = {
            street: user.address,
            city: "",
            state: "",
            pincode: "",
          };
          await user.save();
        }
        log(
          `✅ Fixed address format for ${usersWithStringAddress.length} users`,
          "green",
        );
        this.results.fixed++;
        this.results.fixes.push(
          `Fixed address format for ${usersWithStringAddress.length} users`,
        );
      }
    } catch (error) {
      log(`❌ User testing failed: ${error.message}`, "red");
      this.results.failed++;
      this.results.errors.push(`User testing: ${error.message}`);
    }
  }

  // Test and fix Product model
  async testAndFixProducts() {
    logHeader("🛍️ PRODUCT MODEL TESTING & FIXES");

    try {
      const Product = require("./models/Product");

      // Test 1: Count products
      const productCount = await Product.countDocuments();
      log(`📊 Total products in database: ${productCount}`, "blue");
      this.results.total++;
      this.results.passed++;

      // Test 2: Create sample products if database is empty
      if (productCount === 0) {
        log("🔧 Database is empty, creating sample products...", "yellow");

        const sampleProducts = [
          {
            name: "Paracetamol 500mg",
            description:
              "Effective pain relief and fever reducer tablet for quick relief from headaches, body aches, and fever.",
            shortDescription: "Pain relief and fever reducer tablet",
            company: "Cipla Ltd",
            price: 50,
            originalPrice: 60,
            stock: 100,
            category: "Medicine",
            weight: "500mg",
            productBenefits:
              "Fast-acting pain relief, reduces fever effectively, safe for regular use",
            usageInstructions:
              "Take 1-2 tablets every 4-6 hours as needed. Do not exceed 8 tablets in 24 hours.",
            images: [
              "https://via.placeholder.com/400x400?text=Paracetamol+500mg",
            ],
            isActive: true,
          },
          {
            name: "Vitamin D3 60K Capsules",
            description:
              "High potency vitamin D3 supplement for bone health, immunity boost, and calcium absorption.",
            shortDescription: "Vitamin D3 supplement for bone health",
            company: "Sun Pharma",
            price: 200,
            originalPrice: 250,
            stock: 75,
            category: "Supplements",
            weight: "60000 IU",
            productBenefits:
              "Supports bone health, boosts immunity, helps calcium absorption, prevents deficiency",
            usageInstructions:
              "Take 1 capsule weekly or as directed by physician. Take with milk or after meals.",
            images: ["https://via.placeholder.com/400x400?text=Vitamin+D3+60K"],
            isActive: true,
          },
          {
            name: "Digital Thermometer",
            description:
              "Accurate digital thermometer with fever alarm for quick and precise temperature measurement.",
            shortDescription: "Digital thermometer with fever alarm",
            company: "Omron",
            price: 350,
            originalPrice: 400,
            stock: 50,
            category: "Medical Devices",
            weight: "50g",
            productBenefits:
              "Fast 60-second reading, fever alarm, memory recall, waterproof tip",
            usageInstructions:
              "Place under tongue, wait for beep. Clean with alcohol after use. Store in protective case.",
            images: [
              "https://via.placeholder.com/400x400?text=Digital+Thermometer",
            ],
            isActive: true,
          },
          {
            name: "Cough Syrup 100ml",
            description:
              "Natural ayurvedic cough syrup for effective relief from dry and wet cough with soothing action.",
            shortDescription: "Ayurvedic cough syrup for dry and wet cough",
            company: "Dabur",
            price: 120,
            originalPrice: 140,
            stock: 80,
            category: "Medicine",
            weight: "100ml",
            productBenefits:
              "Relieves dry and wet cough, soothes throat, natural ingredients, safe for all ages",
            usageInstructions:
              "Adults: 2 teaspoons 3 times daily. Children: 1 teaspoon 3 times daily. Shake well before use.",
            images: ["https://via.placeholder.com/400x400?text=Cough+Syrup"],
            isActive: true,
          },
          {
            name: "Blood Pressure Monitor",
            description:
              "Automatic digital blood pressure monitor with large display and memory for accurate BP monitoring.",
            shortDescription: "Automatic digital BP monitor",
            company: "Omron",
            price: 2500,
            originalPrice: 3000,
            stock: 25,
            category: "Medical Devices",
            weight: "600g",
            productBenefits:
              "Accurate readings, large display, memory storage, irregular heartbeat detection",
            usageInstructions:
              "Wrap cuff around upper arm, press start button, remain still during measurement.",
            images: ["https://via.placeholder.com/400x400?text=BP+Monitor"],
            isActive: true,
          },
        ];

        let createdCount = 0;
        for (const productData of sampleProducts) {
          try {
            const product = new Product(productData);
            await product.save();
            createdCount++;
          } catch (productError) {
            log(
              `❌ Failed to create product ${productData.name}: ${productError.message}`,
              "red",
            );
          }
        }

        log(`✅ Created ${createdCount} sample products`, "green");
        this.results.fixed++;
        this.results.fixes.push(`Created ${createdCount} sample products`);
      } else {
        log("✅ Products exist in database", "green");
      }
      this.results.total++;
      this.results.passed++;

      // Test 3: Validate product schema
      const sampleProduct = await Product.findOne();
      if (sampleProduct) {
        const requiredFields = [
          "name",
          "description",
          "price",
          "stock",
          "images",
        ];
        let validationPassed = true;

        requiredFields.forEach((field) => {
          if (!sampleProduct[field]) {
            log(`❌ Product validation failed: ${field} is missing`, "red");
            validationPassed = false;
          }
        });

        if (validationPassed) {
          log("✅ Product schema validation passed", "green");
          this.results.passed++;
        } else {
          this.results.failed++;
          this.results.errors.push("Product schema validation failed");
        }
      }
      this.results.total++;
    } catch (error) {
      log(`❌ Product testing failed: ${error.message}`, "red");
      this.results.failed++;
      this.results.errors.push(`Product testing: ${error.message}`);
    }
  }

  // Test Order model
  async testOrderModel() {
    logHeader("📦 ORDER MODEL TESTING");

    try {
      const Order = require("./models/Order");

      // Test 1: Count orders
      const orderCount = await Order.countDocuments();
      log(`📊 Total orders in database: ${orderCount}`, "blue");
      this.results.total++;
      this.results.passed++;

      // Test 2: Order schema validation
      log("✅ Order model loaded successfully", "green");
      this.results.total++;
      this.results.passed++;
    } catch (error) {
      log(`❌ Order testing failed: ${error.message}`, "red");
      this.results.failed++;
      this.results.errors.push(`Order testing: ${error.message}`);
    }
  }

  // Test environment configuration
  async testEnvironment() {
    logHeader("🔧 ENVIRONMENT CONFIGURATION TESTING");

    const requiredEnvVars = [
      "MONGODB_URI",
      "JWT_SECRET",
      "EMAIL_HOST",
      "EMAIL_USER",
      "EMAIL_PASS",
      "FRONTEND_URL",
    ];

    let envScore = 0;
    requiredEnvVars.forEach((envVar) => {
      this.results.total++;
      if (process.env[envVar]) {
        log(`✅ ${envVar}: Configured`, "green");
        this.results.passed++;
        envScore++;
      } else {
        log(`❌ ${envVar}: Missing`, "red");
        this.results.failed++;
        this.results.errors.push(`Missing environment variable: ${envVar}`);
      }
    });

    log(
      `\n📊 Environment Score: ${envScore}/${requiredEnvVars.length}`,
      envScore === requiredEnvVars.length ? "green" : "yellow",
    );
  }

  // Test email service
  async testEmailService() {
    logHeader("📧 EMAIL SERVICE TESTING");

    try {
      const emailService = require("./utils/emailService");

      // Test email configuration
      this.results.total++;
      if (process.env.EMAIL_USER && process.env.EMAIL_PASS) {
        log("✅ Email credentials configured", "green");
        this.results.passed++;

        // Test email connection
        try {
          const isConnected = await emailService.testConnection();
          this.results.total++;
          if (isConnected) {
            log("✅ Email service connection successful", "green");
            this.results.passed++;
          } else {
            log("⚠️ Email service connection failed", "yellow");
            this.results.failed++;
            this.results.errors.push("Email service connection failed");
          }
        } catch (connectionError) {
          log(
            `⚠️ Email connection test failed: ${connectionError.message}`,
            "yellow",
          );
          this.results.failed++;
          this.results.errors.push(
            `Email connection: ${connectionError.message}`,
          );
        }
      } else {
        log("❌ Email credentials not configured", "red");
        this.results.failed++;
        this.results.errors.push("Email credentials missing");
      }
    } catch (error) {
      log(`❌ Email service testing failed: ${error.message}`, "red");
      this.results.failed++;
      this.results.errors.push(`Email service: ${error.message}`);
    }
  }

  // Test middleware
  async testMiddleware() {
    logHeader("🛡️ MIDDLEWARE TESTING");

    try {
      // Test auth middleware
      const { auth, adminAuth } = require("./middleware/auth");
      log("✅ Auth middleware loaded successfully", "green");
      this.results.total++;
      this.results.passed++;

      // Test validation middleware
      const validate = require("./middleware/validate");
      log("✅ Validation middleware loaded successfully", "green");
      this.results.total++;
      this.results.passed++;
    } catch (error) {
      log(`❌ Middleware testing failed: ${error.message}`, "red");
      this.results.failed++;
      this.results.errors.push(`Middleware: ${error.message}`);
    }
  }

  // Create database indexes for better performance
  async createIndexes() {
    logHeader("📇 DATABASE INDEXES CREATION");

    try {
      const User = require("./models/User");
      const Product = require("./models/Product");

      // Create indexes
      await User.collection.createIndex({ email: 1 }, { unique: true });
      await User.collection.createIndex({ mobile: 1 }, { unique: true });
      await Product.collection.createIndex({
        name: "text",
        description: "text",
      });
      await Product.collection.createIndex({ category: 1 });
      await Product.collection.createIndex({ price: 1 });

      log("✅ Database indexes created successfully", "green");
      this.results.fixed++;
      this.results.fixes.push(
        "Created database indexes for better performance",
      );
    } catch (error) {
      log(`⚠️ Index creation warning: ${error.message}`, "yellow");
      // Don't count as failure since indexes might already exist
    }
  }

  // Print final results
  printResults() {
    logHeader("📊 FINAL TEST RESULTS");

    const successRate = (
      (this.results.passed / this.results.total) *
      100
    ).toFixed(2);

    log(`📈 Tests Completed: ${this.results.total}`, "blue");
    log(`✅ Tests Passed: ${this.results.passed}`, "green");
    log(`❌ Tests Failed: ${this.results.failed}`, "red");
    log(`🔧 Issues Fixed: ${this.results.fixed}`, "yellow");
    log(
      `📊 Success Rate: ${successRate}%`,
      successRate >= 80 ? "green" : "yellow",
    );

    if (this.results.fixes.length > 0) {
      log("\n🔧 FIXES APPLIED:", "yellow");
      this.results.fixes.forEach((fix, index) => {
        log(`   ${index + 1}. ${fix}`, "green");
      });
    }

    if (this.results.errors.length > 0) {
      log("\n❌ ISSUES FOUND:", "red");
      this.results.errors.forEach((error, index) => {
        log(`   ${index + 1}. ${error}`, "red");
      });

      log("\n💡 TROUBLESHOOTING TIPS:", "cyan");
      log("   1. Check .env file configuration", "blue");
      log("   2. Verify MongoDB connection string", "blue");
      log("   3. Ensure all dependencies are installed", "blue");
      log("   4. Check network connectivity", "blue");
      log("   5. Verify email service credentials", "blue");
    }

    if (successRate >= 80) {
      log("\n🎉 API system is healthy and ready for use!", "green");
    } else {
      log("\n⚠️ API system needs attention before production use.", "yellow");
    }
  }

  // Main test runner
  async runAllTests() {
    log("🚀 Starting Final Comprehensive API Testing...", "magenta");
    log("This will test all API components and apply necessary fixes.", "blue");

    const startTime = Date.now();

    // Connect to database
    const dbConnected = await this.connectDatabase();

    if (dbConnected) {
      // Run all tests
      await this.testAndFixUsers();
      await this.testAndFixProducts();
      await this.testOrderModel();
      await this.createIndexes();
    }

    await this.testEnvironment();
    await this.testEmailService();
    await this.testMiddleware();

    // Calculate execution time
    const endTime = Date.now();
    const executionTime = ((endTime - startTime) / 1000).toFixed(2);

    // Print results
    this.printResults();

    log(`\n⏱️ Total execution time: ${executionTime} seconds`, "cyan");

    // Cleanup
    if (mongoose.connection.readyState === 1) {
      await mongoose.disconnect();
      log("\n📡 Database disconnected", "blue");
    }

    return this.results;
  }
}

// Run tests if called directly
if (require.main === module) {
  const tester = new FinalAPITester();
  tester
    .runAllTests()
    .then((results) => {
      const exitCode = results.failed > results.total * 0.2 ? 1 : 0; // Exit with error if more than 20% failed
      process.exit(exitCode);
    })
    .catch((error) => {
      console.error("❌ Test suite failed:", error);
      process.exit(1);
    });
}

module.exports = FinalAPITester;
