const mongoose = require("mongoose");
require("dotenv").config();

const User = require("../models/User");
const Product = require("../models/Product");
const Order = require("../models/Order");
const Invoice = require("../models/Invoice");
const Message = require("../models/Message");
const Letterhead = require("../models/Letterhead");
const Verification = require("../models/Verification");

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("✅ Connected to MongoDB for seeding");
  } catch (err) {
    console.error("❌ MongoDB connection failed:", err.message);
    process.exit(1);
  }
};

const seedDatabase = async () => {
  try {
    console.log("🌱 Starting database seeding...");

    // Step 1: Create a valid dummy user
    const dummyUser = await User.create({
      fullName: "Test User",
      email: "test@example.com",
      password: "test1234",
      mobile: "9876543210",
    });

    // Step 2: Create a valid dummy product
    const dummyProduct = await Product.create({
      name: "Test Product",
      shortDescription: "Short desc",
      description: "Full test product description.",
      company: "Test Pharma",
      price: 50,
      category: "Pain Relief",
      stock: 10,
      images: ["https://via.placeholder.com/150"],
    });

    // Step 3: Create an order with the dummy user/product
    const dummyOrder = await Order.create({
      user: dummyUser._id,
      items: [{
        product: dummyProduct._id,
        name: dummyProduct.name,
        price: dummyProduct.price,
        mrp: dummyProduct.price,
        quantity: 1,
        total: dummyProduct.price,
        image: dummyProduct.images[0],
      }],
      paymentMethod: "COD",
      subtotal: dummyProduct.price,
      total: dummyProduct.price,
    });

    // Step 4: Create invoice
    const dummyInvoice = await Invoice.create({
      user: dummyUser._id,
      order: dummyOrder._id,
      items: [{
        product: dummyProduct._id,
        name: dummyProduct.name,
        price: dummyProduct.price,
        mrp: dummyProduct.price,
        quantity: 1,
        total: dummyProduct.price,
        image: dummyProduct.images[0],
      }],
      subtotal: dummyProduct.price,
      total: dummyProduct.price,
    });

    // Step 5: Create message
    const dummyMessage = await Message.create({
      name: "Test Sender",
      email: "sender@example.com",
      subject: "Test Subject",
      message: "This is a test message.",
    });

    // Step 6: Create letterhead
    const dummyLetterhead = await Letterhead.create({
      title: "Test Letterhead",
      content: "Test content for letterhead",
      createdBy: dummyUser._id,
    });

    // Step 7: Create verification
    const dummyVerification = await Verification.create({
      user: dummyUser._id,
      email: dummyUser.email,
      mobile: dummyUser.mobile,
      emailVerificationToken: "randomtoken123456",
    });

    // Clean up dummy data
    await Promise.all([
      User.deleteOne({ _id: dummyUser._id }),
      Product.deleteOne({ _id: dummyProduct._id }),
      Order.deleteOne({ _id: dummyOrder._id }),
      Invoice.deleteOne({ _id: dummyInvoice._id }),
      Message.deleteOne({ _id: dummyMessage._id }),
      Letterhead.deleteOne({ _id: dummyLetterhead._id }),
      Verification.deleteOne({ _id: dummyVerification._id }),
    ]);

    console.log("✅ All collections created and cleaned up successfully");

    if (require.main === module) process.exit(0);
  } catch (error) {
    console.error("❌ Database seeding failed:", error);
    if (require.main === module) process.exit(1);
    throw error;
  }
};

if (require.main === module) {
  connectDB().then(() => seedDatabase());
}

module.exports = { seedDatabase };
