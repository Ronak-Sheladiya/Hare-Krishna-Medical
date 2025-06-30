const mongoose = require("mongoose");
require("dotenv").config();

const Product = require("./models/Product");
const User = require("./models/User");
const Order = require("./models/Order");

async function testDatabase() {
  try {
    // Connect to MongoDB
    await mongoose.connect(
      process.env.MONGODB_URI ||
        "mongodb+srv://ronaksheladiya652:Ronak95865@cluster0.loaubzp.mongodb.net/Hare_Krishna_Medical_db?retryWrites=true&w=majority&appName=Cluster0",
    );
    console.log("✅ Connected to MongoDB");

    // Test basic operations
    console.log("\n📊 Testing Database Operations...");

    // Count existing documents
    const productCount = await Product.countDocuments();
    const userCount = await User.countDocuments();
    const orderCount = await Order.countDocuments();

    console.log("📈 Current document counts:");
    console.log(`  Products: ${productCount}`);
    console.log(`  Users: ${userCount}`);
    console.log(`  Orders: ${orderCount}`);

    // Test product creation
    console.log("\n🧪 Testing Product Creation...");
    const testProduct = new Product({
      name: "Test Medicine",
      company: "Test Company",
      price: 100,
      stock: 50,
      category: "Pain Relief",
      description: "Test product for database verification",
    });

    const savedProduct = await testProduct.save();
    console.log("✅ Product created successfully:", savedProduct.name);

    // Test product retrieval
    console.log("\n🔍 Testing Product Retrieval...");
    const retrievedProduct = await Product.findById(savedProduct._id);
    console.log("✅ Product retrieved successfully:", retrievedProduct.name);

    // Clean up test product
    await Product.findByIdAndDelete(savedProduct._id);
    console.log("🧹 Test product cleaned up");

    // Test order creation (guest order)
    console.log("\n📦 Testing Order Creation...");
    const testOrder = new Order({
      user: null, // Guest order
      guestUserInfo: {
        email: "test@example.com",
        fullName: "Test User",
        mobile: "1234567890",
      },
      items: [
        {
          product: null,
          productName: "Test Product",
          quantity: 1,
          price: 100,
          totalPrice: 100,
        },
      ],
      shippingAddress: {
        fullName: "Test User",
        mobile: "1234567890",
        street: "123 Test St",
        city: "Test City",
        state: "Test State",
        pincode: "123456",
      },
      billingAddress: {
        fullName: "Test User",
        mobile: "1234567890",
        street: "123 Test St",
        city: "Test City",
        state: "Test State",
        pincode: "123456",
      },
      subtotal: 100,
      shippingCharges: 0,
      tax: 0,
      totalAmount: 100,
      paymentMethod: "cod",
    });

    const savedOrder = await testOrder.save();
    console.log("✅ Order created successfully:", savedOrder.orderId);

    // Clean up test order
    await Order.findByIdAndDelete(savedOrder._id);
    console.log("🧹 Test order cleaned up");

    console.log("\n🎉 All database operations working correctly!");
  } catch (error) {
    console.error("❌ Database test failed:", error.message);
    console.error("Full error:", error);
  } finally {
    await mongoose.connection.close();
    console.log("👋 Database connection closed");
  }
}

testDatabase();
