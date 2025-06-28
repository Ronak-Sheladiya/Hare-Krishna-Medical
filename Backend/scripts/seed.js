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
