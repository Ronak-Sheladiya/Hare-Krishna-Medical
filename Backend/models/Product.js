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
    await mongoose.connect(
      process.env.MONGODB_URI ||
        "mongodb+srv://ronaksheladiya652:Ronak95865@cluster0.loaubzp.mongodb.net/Hare_Krishna_Medical_db?retryWrites=true&w=majority&appName=Cluster0",
      {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      }
    );
    console.log("✅ Connected to MongoDB");
  } catch (error) {
    console.error("❌ MongoDB connection failed:", error.message);
    process.exit(1);
  }
};

const createEmptyCollections = async () => {
  const models = [
    User,
    Product,
    Order,
    Invoice,
    Message,
    Letterhead,
    Verification,
  ];

  for (const model of models) {
    const collectionName = model.collection.collectionName;
    try {
      const exists = await mongoose.connection.db
        .listCollections({ name: collectionName })
        .hasNext();
      if (!exists) {
        await mongoose.connection.createCollection(collectionName);
        console.log(`✅ Created empty collection: ${collectionName}`);
      } else {
        console.log(`ℹ️ Collection already exists: ${collectionName}`);
      }
    } catch (error) {
      console.error(`❌ Failed to create collection ${collectionName}:`, error.message);
    }
  }
};

const initializeCollections = async () => {
  try {
    await connectDB();
    await createEmptyCollections();
    console.log("✅ All collections initialized successfully!");
    if (require.main === module) process.exit(0);
  } catch (error) {
    console.error("❌ Initialization error:", error);
    if (require.main === module) process.exit(1);
  }
};

if (require.main === module) initializeCollections();

module.exports = { initializeCollections };
