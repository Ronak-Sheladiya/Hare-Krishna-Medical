#!/usr/bin/env node

const axios = require("axios");

const API_BASE = "http://localhost:5000/api";

async function testCRUD() {
  console.log("🧪 Testing CRUD Operations...\n");

  try {
    // Test 1: GET /api/health
    console.log("1️⃣ Testing Health Check...");
    const healthResponse = await axios.get(`${API_BASE}/health`);
    console.log(
      "✅ Health:",
      healthResponse.data.status,
      "| Database:",
      healthResponse.data.database,
    );

    // Test 2: GET /api/products (Read)
    console.log("\n2️⃣ Testing Products READ...");
    const productsResponse = await axios.get(`${API_BASE}/products?limit=2`);
    console.log(
      "✅ Products fetched:",
      productsResponse.data.data.length,
      "products",
    );
    console.log("   First product:", productsResponse.data.data[0]?.name);
    console.log("   Offline mode:", productsResponse.data.offline || false);

    // Test 3: GET /api/products/:id (Read Single)
    if (productsResponse.data.data.length > 0) {
      console.log("\n3️⃣ Testing Single Product READ...");
      const productId = productsResponse.data.data[0]._id;
      const singleProductResponse = await axios.get(
        `${API_BASE}/products/${productId}`,
      );
      console.log(
        "✅ Single product fetched:",
        singleProductResponse.data.data?.name,
      );
    }

    // Test 4: GET /api/products/categories (Read Categories)
    console.log("\n4️⃣ Testing Categories READ...");
    const categoriesResponse = await axios.get(
      `${API_BASE}/products/categories`,
    );
    console.log(
      "✅ Categories fetched:",
      categoriesResponse.data.data?.length,
      "categories",
    );

    // Test 5: GET /api/products/featured (Read Featured)
    console.log("\n5️⃣ Testing Featured Products READ...");
    const featuredResponse = await axios.get(`${API_BASE}/products/featured`);
    console.log(
      "✅ Featured products fetched:",
      featuredResponse.data.data?.length,
      "products",
    );

    console.log(
      "\n🎉 All READ operations working! CRUD Read functionality is operational.",
    );

    if (healthResponse.data.database === "disconnected") {
      console.log(
        "\n⚠️  Database is disconnected - using offline sample data.",
      );
      console.log(
        "   For full CRUD testing (Create, Update, Delete), please set up MongoDB.",
      );
      console.log("   See Backend/MONGODB_SETUP.md for instructions.");
    } else {
      console.log(
        "\n✅ Database connected - full CRUD operations should work!",
      );
    }
  } catch (error) {
    console.error("❌ CRUD Test Failed:", error.message);
    if (error.response) {
      console.error("   Status:", error.response.status);
      console.error("   Data:", error.response.data);
    }
  }
}

testCRUD();
