// ✅ Updated seed.js to only initialize collections without inserting data

const mongoose = require("mongoose");
require("dotenv").config();

const User = require("../models/User");
const Product = require("../models/Product");
const Order = require("../models/Order");
const Invoice = require("../models/Invoice");
const Message = require("../models/Message");
const Letterhead = require("../models/Letterhead");
const Verification = require("../models/Verification");

// MongoDB connection
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

// Create all collections without data
const initializeCollections = async () => {
  try {
    console.log("🌱 Creating empty collections...");

    // Force-create collections by inserting + removing dummy doc
    const dummy = { _init: true };

    const models = [
      User,
      Product,
      Order,
      Invoice,
      Message,
      Letterhead,
      Verification,
    ];

    for (const Model of models) {
      const doc = await Model.create(dummy);
      await Model.deleteOne({ _id: doc._id });
      console.log(`✅ ${Model.modelName} collection initialized`);
    }

    console.log("✅ All collections created without inserting seed data");

    if (require.main === module) process.exit(0);
  } catch (error) {
    console.error("❌ Failed to initialize collections:", error);
    if (require.main === module) process.exit(1);
    throw error;
  }
};

// Run if called directly
if (require.main === module) {
  connectDB().then(() => initializeCollections());
}

// Export in case used elsewhere
module.exports = { initializeCollections };
