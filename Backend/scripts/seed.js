const mongoose = require("mongoose");
require("dotenv").config();

const User = require("../models/User");
const Product = require("../models/Product");
const Order = require("../models/Order");
const Invoice = require("../models/Invoice");
const Message = require("../models/Message");
const Letterhead = require("../models/Letterhead");
const Verification = require("../models/Verification");

// Connect to MongoDB
const connectDB = async () => {
  try {
    await mongoose.connect(
      process.env.MONGODB_URI ||
        "mongodb+srv://ronaksheladiya652:Ronak95865@cluster0.loaubzp.mongodb.net/Hare_Krishna_Medical_db?retryWrites=true&w=majority&appName=Cluster0",
      {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      }
    );
    console.log("✅ Connected to MongoDB for initializing collections");
  } catch (error) {
    console.error("❌ MongoDB connection failed:", error.message);
    process.exit(1);
  }
};

// Create and delete dummy data to trigger collection creation
const seedDatabase = async () => {
  try {
    console.log("🌱 Creating empty collections...");

    // Step 1: Create dummy user and product
    const dummyUser = await User.create({
      fullName: "Init User",
      email: "init@example.com",
      password: "dummyPass123",
      mobile: "9586599031",
    });

    const dummyProduct = await Product.create({
      name: "Init Product",
      description: "Dummy description",
      shortDescription: "Short",
      category: "Syrup", // must be a valid enum
      company: "Init Co",
      price: 0,
      stock: 0,
      images: ["https://via.placeholder.com/150"],
      expiryDate: new Date(),
    });

    // Step 2: Use real _ids to create other documents
    const dummyOrder = await Order.create({
      user: dummyUser._id,
      products: [{ product: dummyProduct._id, quantity: 1 }],
      totalAmount: 0,
    });

    const dummyInvoice = await Invoice.create({
      user: dummyUser._id,
      order: dummyOrder._id,
      amount: 0,
      issuedDate: new Date(),
    });

    const dummyMessage = await Message.create({
      user: dummyUser._id,
      content: "Welcome",
    });

    const dummyLetterhead = await Letterhead.create({
      user: dummyUser._id,
      content: "Init Letterhead",
    });

    const dummyVerification = await Verification.create({
      user: dummyUser._id,
      otp: 123456,
      createdAt: new Date(),
    });

    // Step 3: Delete all dummy docs
    await Promise.all([
      User.deleteOne({ _id: dummyUser._id }),
      Product.deleteOne({ _id: dummyProduct._id }),
      Order.deleteOne({ _id: dummyOrder._id }),
      Invoice.deleteOne({ _id: dummyInvoice._id }),
      Message.deleteOne({ _id: dummyMessage._id }),
      Letterhead.deleteOne({ _id: dummyLetterhead._id }),
      Verification.deleteOne({ _id: dummyVerification._id }),
    ]);

    console.log("✅ All collections initialized without keeping data");

    if (require.main === module) process.exit(0);
  } catch (error) {
    console.error("❌ Failed to initialize collections:", error);
    if (require.main === module) process.exit(1);
    throw error;
  }
};

// If run directly (not imported)
if (require.main === module) {
  connectDB().then(() => seedDatabase());
}

module.exports = { seedDatabase };
