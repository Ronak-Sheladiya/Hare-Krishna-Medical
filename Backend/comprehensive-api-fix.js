const express = require("express");
const axios = require("axios");
const mongoose = require("mongoose");
require("dotenv").config();

// Import models
const User = require("./models/User");
const Product = require("./models/Product");
const Order = require("./models/Order");

// Colors for console output
const colors = {
  reset: "\x1b[0m",
  red: "\x1b[31m",
  green: "\x1b[32m",
  yellow: "\x1b[33m",
  blue: "\x1b[34m",
  magenta: "\x1b[35m",
  cyan: "\x1b[36m",
};

function log(message, color = "reset") {
  console.log(colors[color] + message + colors.reset);
}

class APITester {
  constructor() {
    this.testResults = {
      passed: 0,
      failed: 0,
      errors: [],
      fixes: [],
    };
    this.authToken = "";
    this.baseURL = "http://localhost:5000/api";
  }

  // Database setup and fixes
  async setupDatabase() {
    try {
      log("\n🔌 Connecting to MongoDB...", "cyan");

      const mongoURI =
        process.env.MONGODB_URI ||
        "mongodb+srv://ronaksheladiya652:Ronak95865@cluster0.loaubzp.mongodb.net/Hare_Krishna_Medical_db?retryWrites=true&w=majority&appName=Cluster0";

      await mongoose.connect(mongoURI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        serverSelectionTimeoutMS: 5000,
      });

      log("✅ MongoDB connected successfully", "green");
      return true;
    } catch (error) {
      log(`❌ MongoDB connection failed: ${error.message}`, "red");
      return false;
    }
  }

  // Fix User model issues
  async fixUserIssues() {
    try {
      log("\n🔧 Fixing User model issues...", "yellow");

      // Create admin user if doesn't exist
      const adminExists = await User.findOne({ email: "admin@gmail.com" });
      if (!adminExists) {
        const adminUser = new User({
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
        log("✅ Admin user created", "green");
        this.testResults.fixes.push("Created admin user");
      } else {
        log("✅ Admin user exists", "green");
      }

      // Fix address format for existing users
      const usersWithStringAddress = await User.find({
        address: { $type: "string" },
      });

      for (let user of usersWithStringAddress) {
        user.address = {
          street: user.address,
          city: "",
          state: "",
          pincode: "",
        };
        await user.save();
      }

      if (usersWithStringAddress.length > 0) {
        log(
          `✅ Fixed address format for ${usersWithStringAddress.length} users`,
          "green",
        );
        this.testResults.fixes.push(
          `Fixed address format for ${usersWithStringAddress.length} users`,
        );
      }
    } catch (error) {
      log(`❌ User fixes failed: ${error.message}`, "red");
      this.testResults.errors.push(`User fixes: ${error.message}`);
    }
  }

  // Fix Product model issues
  async fixProductIssues() {
    try {
      log("\n🔧 Fixing Product model issues...", "yellow");

      const productCount = await Product.countDocuments();
      log(`📦 Found ${productCount} products`, "blue");

      if (productCount === 0) {
        log("Creating sample products...", "yellow");
        const sampleProducts = [
          {
            name: "Paracetamol 500mg",
            description: "Effective pain relief and fever reducer",
            shortDescription: "Pain relief and fever reducer",
            company: "Cipla",
            price: 50,
            originalPrice: 60,
            stock: 100,
            category: "Medicine",
            weight: "500mg",
            productBenefits:
              "Fast-acting pain relief, reduces fever effectively",
            usageInstructions: "Take 1-2 tablets every 4-6 hours as needed",
            images: ["https://via.placeholder.com/300x300?text=Paracetamol"],
            isActive: true,
          },
          {
            name: "Vitamin D3 Tablets",
            description: "Essential vitamin D3 supplement for bone health",
            shortDescription: "Vitamin D3 supplement for bone health",
            company: "Sun Pharma",
            price: 200,
            originalPrice: 250,
            stock: 75,
            category: "Supplements",
            weight: "60000 IU",
            productBenefits: "Supports bone health, boosts immunity",
            usageInstructions: "Take 1 tablet daily with water after meals",
            images: ["https://via.placeholder.com/300x300?text=Vitamin+D3"],
            isActive: true,
          },
          {
            name: "Digital Thermometer",
            description: "Accurate digital thermometer for fever monitoring",
            shortDescription: "Digital thermometer for fever monitoring",
            company: "Omron",
            price: 350,
            originalPrice: 400,
            stock: 50,
            category: "Medical Devices",
            weight: "50g",
            productBenefits: "Accurate temperature reading, easy to use",
            usageInstructions: "Place under tongue and wait for beep",
            images: ["https://via.placeholder.com/300x300?text=Thermometer"],
            isActive: true,
          },
        ];

        for (const productData of sampleProducts) {
          const product = new Product(productData);
          await product.save();
        }

        log(`✅ Created ${sampleProducts.length} sample products`, "green");
        this.testResults.fixes.push(
          `Created ${sampleProducts.length} sample products`,
        );
      }
    } catch (error) {
      log(`❌ Product fixes failed: ${error.message}`, "red");
      this.testResults.errors.push(`Product fixes: ${error.message}`);
    }
  }

  // Test API endpoint
  async testEndpoint(
    method,
    endpoint,
    data = null,
    requiresAuth = false,
    description = "",
  ) {
    try {
      const headers = { "Content-Type": "application/json" };

      if (requiresAuth && this.authToken) {
        headers["Authorization"] = `Bearer ${this.authToken}`;
      }

      const config = {
        method,
        url: `${this.baseURL}${endpoint}`,
        headers,
        timeout: 10000,
      };

      if (
        data &&
        (method === "POST" || method === "PUT" || method === "PATCH")
      ) {
        config.data = data;
      }

      log(`\n🧪 Testing: ${method} ${endpoint}`, "cyan");
      if (description) log(`📝 ${description}`, "blue");

      const response = await axios(config);

      log(`✅ Success: ${response.status} - ${response.statusText}`, "green");
      this.testResults.passed++;

      return response.data;
    } catch (error) {
      const statusCode = error.response?.status || "TIMEOUT";
      const errorMessage = error.response?.data?.message || error.message;

      log(`❌ Failed: ${statusCode} - ${errorMessage}`, "red");
      this.testResults.failed++;
      this.testResults.errors.push({
        endpoint,
        method,
        error: errorMessage,
        statusCode,
      });

      return null;
    }
  }

  // Run authentication tests
  async testAuthentication() {
    log("\n🔐 AUTHENTICATION TESTS", "magenta");

    // Test health check first
    await this.testEndpoint(
      "GET",
      "/health",
      null,
      false,
      "Server health check",
    );

    // Test admin login
    const loginData = await this.testEndpoint(
      "POST",
      "/auth/login",
      {
        email: "admin@gmail.com",
        password: "Ronak@95865",
      },
      false,
      "Admin login",
    );

    if (loginData && loginData.token) {
      this.authToken = loginData.token;
      log(`🔑 Auth token acquired`, "green");
    }

    // Test user registration
    await this.testEndpoint(
      "POST",
      "/auth/register",
      {
        fullName: "Test User",
        email: `test${Date.now()}@example.com`,
        mobile: `987654${Math.floor(1000 + Math.random() * 9000)}`,
        password: "password123",
        address: "Test Address, Test City",
      },
      false,
      "User registration",
    );

    // Test profile access
    await this.testEndpoint(
      "GET",
      "/auth/profile",
      null,
      true,
      "Get user profile",
    );
  }

  // Run product tests
  async testProducts() {
    log("\n🛍️ PRODUCT TESTS", "magenta");

    await this.testEndpoint(
      "GET",
      "/products",
      null,
      false,
      "Get all products",
    );
    await this.testEndpoint(
      "GET",
      "/products/categories",
      null,
      false,
      "Get product categories",
    );
    await this.testEndpoint(
      "GET",
      "/products/featured",
      null,
      false,
      "Get featured products",
    );

    // Test product creation
    const productData = await this.testEndpoint(
      "POST",
      "/products",
      {
        name: "Test Medicine",
        description: "This is a test medicine for API testing purposes",
        shortDescription: "Test medicine for API testing",
        company: "Test Company",
        price: 100,
        originalPrice: 120,
        stock: 50,
        category: "Medicine",
        weight: "100mg",
        productBenefits: "Test benefits",
        usageInstructions: "Test usage instructions",
        images: ["https://via.placeholder.com/300x300?text=Test+Medicine"],
        isActive: true,
      },
      true,
      "Create new product",
    );

    if (productData && productData.data && productData.data._id) {
      const productId = productData.data._id;

      // Test get specific product
      await this.testEndpoint(
        "GET",
        `/products/${productId}`,
        null,
        false,
        "Get specific product",
      );

      // Test update product
      await this.testEndpoint(
        "PUT",
        `/products/${productId}`,
        {
          name: "Updated Test Medicine",
          price: 110,
        },
        true,
        "Update product",
      );

      // Test delete product
      await this.testEndpoint(
        "DELETE",
        `/products/${productId}`,
        null,
        true,
        "Delete test product",
      );
    }
  }

  // Run order tests
  async testOrders() {
    log("\n📦 ORDER TESTS", "magenta");

    await this.testEndpoint("GET", "/orders", null, true, "Get all orders");

    // Get a product first for order testing
    const products = await this.testEndpoint(
      "GET",
      "/products?limit=1",
      null,
      false,
      "Get product for order",
    );

    if (products && products.data && products.data.length > 0) {
      const product = products.data[0];

      const orderData = await this.testEndpoint(
        "POST",
        "/orders",
        {
          items: [
            {
              product: product._id,
              quantity: 2,
              price: product.price,
            },
          ],
          shippingAddress: {
            fullName: "Test Customer",
            mobile: "9876543210",
            email: "customer@test.com",
            address: "Test Address",
            city: "Test City",
            state: "Test State",
            pincode: "123456",
          },
          paymentMethod: "COD",
          totalAmount: product.price * 2,
        },
        true,
        "Create new order",
      );

      if (orderData && orderData.data && orderData.data._id) {
        const orderId = orderData.data._id;

        await this.testEndpoint(
          "GET",
          `/orders/${orderId}`,
          null,
          true,
          "Get specific order",
        );
        await this.testEndpoint(
          "PATCH",
          `/orders/${orderId}/status`,
          {
            status: "processing",
          },
          true,
          "Update order status",
        );
      }
    }
  }

  // Run all tests
  async runAllTests() {
    log("🚀 Starting Comprehensive API Testing and Fixing...", "magenta");
    log("=".repeat(60), "magenta");

    const dbConnected = await this.setupDatabase();

    if (dbConnected) {
      await this.fixUserIssues();
      await this.fixProductIssues();
    }

    // Start server testing
    await this.testAuthentication();
    await this.testProducts();
    await this.testOrders();

    // Analytics and other endpoints
    log("\n📊 ANALYTICS TESTS", "magenta");
    await this.testEndpoint(
      "GET",
      "/analytics/dashboard",
      null,
      true,
      "Get dashboard analytics",
    );

    log("\n💬 MESSAGE TESTS", "magenta");
    await this.testEndpoint(
      "POST",
      "/messages",
      {
        name: "Test User",
        email: "test@example.com",
        subject: "Test Message",
        message: "This is a test message",
      },
      false,
      "Send contact message",
    );

    log("\n🌱 DEV TOOLS TESTS", "magenta");
    await this.testEndpoint("GET", "/dev/status", null, true, "Get dev status");
    await this.testEndpoint(
      "POST",
      "/dev/seed-products",
      null,
      true,
      "Seed products",
    );

    // Print results
    this.printResults();
  }

  printResults() {
    log("\n" + "=".repeat(60), "magenta");
    log("📊 TEST RESULTS SUMMARY", "magenta");
    log("=".repeat(60), "magenta");

    log(`✅ Passed: ${this.testResults.passed}`, "green");
    log(`❌ Failed: ${this.testResults.failed}`, "red");
    log(`🔧 Fixes Applied: ${this.testResults.fixes.length}`, "yellow");

    const successRate = (
      (this.testResults.passed /
        (this.testResults.passed + this.testResults.failed)) *
      100
    ).toFixed(2);
    log(
      `📈 Success Rate: ${successRate}%`,
      successRate > 80 ? "green" : "yellow",
    );

    if (this.testResults.fixes.length > 0) {
      log("\n🔧 FIXES APPLIED:", "yellow");
      this.testResults.fixes.forEach((fix) => {
        log(`   ✓ ${fix}`, "green");
      });
    }

    if (this.testResults.errors.length > 0) {
      log("\n❌ FAILED TESTS:", "red");
      this.testResults.errors.forEach((error) => {
        if (typeof error === "object") {
          log(
            `   ${error.method} ${error.endpoint} - ${error.statusCode}: ${error.error}`,
            "red",
          );
        } else {
          log(`   ${error}`, "red");
        }
      });
    }

    log("\n🎉 API testing and fixing completed!", "magenta");
  }
}

// Run tests if called directly
if (require.main === module) {
  const tester = new APITester();
  tester
    .runAllTests()
    .then(() => {
      console.log("Exiting...");
      process.exit(0);
    })
    .catch((error) => {
      console.error("Test suite failed:", error);
      process.exit(1);
    });
}

module.exports = APITester;
