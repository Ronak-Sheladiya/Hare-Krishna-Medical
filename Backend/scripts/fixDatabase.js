const mongoose = require("mongoose");
require("dotenv").config();

async function fixDatabase() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("✅ Connected to MongoDB");

    // Drop the problematic index
    try {
      await mongoose.connection.db.collection("products").dropIndex("slug_1");
      console.log("🗑️ Dropped slug index");
    } catch (e) {
      console.log("ℹ️ Index might not exist:", e.message);
    }

    // Clear products collection
    await mongoose.connection.db.collection("products").deleteMany({});
    console.log("🧹 Cleared products collection");

    await mongoose.connection.close();
    console.log("✅ Database fixed");
  } catch (error) {
    console.error("❌ Error:", error.message);
  }
}

fixDatabase();
