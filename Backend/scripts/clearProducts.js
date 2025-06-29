const mongoose = require("mongoose");
require("dotenv").config();
const Product = require("../models/Product");

async function clearProducts() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("✅ Connected to MongoDB");

    const result = await Product.deleteMany({});
    console.log(`✅ Cleared ${result.deletedCount} products`);

    await mongoose.connection.close();
    console.log("✅ Connection closed");
    process.exit(0);
  } catch (error) {
    console.error("❌ Error:", error);
    process.exit(1);
  }
}

clearProducts();
