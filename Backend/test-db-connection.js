const mongoose = require("mongoose");
require("dotenv").config();

async function testDatabaseConnection() {
  try {
    console.log("🔄 Testing database connection...");
    console.log("MongoDB URI:", process.env.MONGODB_URI);

    const conn = await mongoose.connect(
      process.env.MONGODB_URI ||
        "mongodb://localhost:27017/Hare_Krishna_Medical_db",
      {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      },
    );

    console.log("✅ MongoDB Connected:", conn.connection.host);
    console.log("📊 Database Name:", conn.connection.name);
    console.log("📡 Connection State:", conn.connection.readyState);

    // Test basic operations
    const collections = await mongoose.connection.db
      .listCollections()
      .toArray();
    console.log(
      "📁 Available Collections:",
      collections.map((c) => c.name),
    );

    await mongoose.connection.close();
    console.log("✅ Test completed successfully");
    process.exit(0);
  } catch (error) {
    console.error("❌ Database connection failed:", error.message);
    console.error("Error details:", error);
    process.exit(1);
  }
}

testDatabaseConnection();
