const mongoose = require("mongoose");
require("dotenv").config();

// Import models
const User = require("./models/User");
const Product = require("./models/Product");
const Order = require("./models/Order");

async function testAndFixAPIs() {
  console.log("🔧 Testing and fixing API issues...\n");

  try {
    // Test MongoDB connection
    console.log("1. Testing MongoDB connection...");
    const mongoURI =
      process.env.MONGODB_URI ||
      "mongodb+srv://ronaksheladiya652:Ronak95865@cluster0.loaubzp.mongodb.net/Hare_Krishna_Medical_db?retryWrites=true&w=majority&appName=Cluster0";

    await mongoose.connect(mongoURI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
    });

    console.log("✅ MongoDB connected successfully");
    console.log(`📊 Database: ${mongoose.connection.name}`);
    console.log(`🏠 Host: ${mongoose.connection.host}\n`);

    // Test User model and fix issues
    console.log("2. Testing User model...");
    const userCount = await User.countDocuments();
    console.log(`👥 Total users: ${userCount}`);

    // Create admin user if doesn't exist
    const adminUser = await User.findOne({ email: "admin@gmail.com" });
    if (!adminUser) {
      console.log("🔧 Creating admin user...");
      const newAdmin = new User({
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
      await newAdmin.save();
      console.log("✅ Admin user created");
    } else {
      console.log("✅ Admin user exists");
    }

    // Test Product model
    console.log("\n3. Testing Product model...");
    const productCount = await Product.countDocuments();
    console.log(`🛍️ Total products: ${productCount}`);

    if (productCount === 0) {
      console.log("🔧 Creating sample products...");
      const sampleProducts = [
        {
          name: "Paracetamol 500mg",
          brand: "Cipla",
          category: "Medicine",
          price: 50,
          stock: 100,
          description: "Pain relief and fever reducer",
          dosage: "500mg",
          manufacturer: "Cipla Ltd",
          features: ["Pain Relief", "Fever Reducer"],
          images: ["https://via.placeholder.com/400x400?text=Paracetamol"],
        },
        {
          name: "Vitamin D3 Tablets",
          brand: "HealthVit",
          category: "Supplements",
          price: 200,
          stock: 75,
          description: "Vitamin D3 supplement for bone health",
          dosage: "1000 IU",
          manufacturer: "HealthVit",
          features: ["Bone Health", "Immunity Booster"],
          images: ["https://via.placeholder.com/400x400?text=Vitamin+D3"],
        },
        {
          name: "Cough Syrup",
          brand: "Benadryl",
          category: "Medicine",
          price: 120,
          stock: 60,
          description: "Effective cough relief syrup",
          dosage: "5ml thrice daily",
          manufacturer: "Johnson & Johnson",
          features: ["Cough Relief", "Expectorant"],
          images: ["https://via.placeholder.com/400x400?text=Cough+Syrup"],
        },
      ];

      for (const productData of sampleProducts) {
        const product = new Product(productData);
        await product.save();
      }
      console.log("✅ Sample products created");
    } else {
      console.log("✅ Products exist");
    }

    // Test Order model
    console.log("\n4. Testing Order model...");
    const orderCount = await Order.countDocuments();
    console.log(`📦 Total orders: ${orderCount}`);

    // Test email service
    console.log("\n5. Testing Email service...");
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

    // Test JWT secret
    console.log("\n6. Testing JWT configuration...");
    const jwtSecret = process.env.JWT_SECRET;
    if (
      jwtSecret &&
      jwtSecret !== "your-super-secret-jwt-key-change-in-production-2024"
    ) {
      console.log("✅ JWT secret is properly configured");
    } else {
      console.log("⚠️ JWT secret should be changed for production");
    }

    // Check for validation middleware issues
    console.log("\n7. Testing validation middleware...");
    try {
      const validate = require("./middleware/validate");
      console.log("✅ Validation middleware loaded");
    } catch (validateError) {
      console.log("❌ Validation middleware error:", validateError.message);
    }

    // Check for auth middleware issues
    console.log("\n8. Testing auth middleware...");
    try {
      const { auth, adminAuth } = require("./middleware/auth");
      console.log("✅ Auth middleware loaded");
    } catch (authError) {
      console.log("❌ Auth middleware error:", authError.message);
    }

    console.log("\n🎉 API testing and fixes completed successfully!");
  } catch (error) {
    console.error("❌ API test failed:", error.message);
    console.error("Stack trace:", error.stack);
  } finally {
    await mongoose.disconnect();
    console.log("📡 MongoDB disconnected");
  }
}

// Run the test if this file is executed directly
if (require.main === module) {
  testAndFixAPIs();
}

module.exports = testAndFixAPIs;
