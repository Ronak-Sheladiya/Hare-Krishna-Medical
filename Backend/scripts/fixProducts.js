const mongoose = require("mongoose");
require("dotenv").config();

// Import models
const User = require("../models/User");
const Product = require("../models/Product");

// Connect to MongoDB
const connectDB = async () => {
  try {
    const mongoURI =
      process.env.MONGODB_URI ||
      "mongodb://localhost:27017/hare-krishna-medical";
    await mongoose.connect(mongoURI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("✅ MongoDB connected for fixing products");
  } catch (error) {
    console.error("❌ MongoDB connection error:", error.message);
    process.exit(1);
  }
};

const fixProducts = async () => {
  try {
    console.log("🔧 Starting product fix...");

    // Clear existing products
    await Product.deleteMany({});
    console.log("🗑️ All products cleared");

    // Find admin user
    const adminUser = await User.findOne({ role: "admin" });
    if (!adminUser) {
      console.error("❌ Admin user not found");
      process.exit(1);
    }

    // Create sample products one by one to ensure slugs are generated
    const productsData = [
      {
        name: "Paracetamol 500mg",
        company: "Cipla",
        price: 25,
        originalPrice: 30,
        stock: 100,
        category: "Pain Relief",
        weight: "10 tablets",
        shortDescription: "Effective pain relief and fever reducer",
        description:
          "Paracetamol is a common painkiller used to treat aches and pain. It can also be used to reduce a high temperature.",
        benefits: "Reduces pain and fever, Safe for most people",
        usage: "Take 1-2 tablets every 4-6 hours as needed",
        composition: "Paracetamol 500mg",
        batchNo: "PAR001",
        mfgDate: new Date("2024-01-01"),
        expDate: new Date("2026-01-01"),
        isFeatured: true,
        createdBy: adminUser._id,
      },
      {
        name: "Vitamin D3 60000 IU",
        company: "Sun Pharma",
        price: 120,
        originalPrice: 150,
        stock: 50,
        category: "Vitamins",
        weight: "4 capsules",
        shortDescription: "High strength Vitamin D3 supplement",
        description:
          "Vitamin D3 helps your body absorb calcium and phosphorus.",
        benefits: "Supports bone health, Boosts immunity",
        usage: "Take 1 capsule weekly",
        composition: "Cholecalciferol (Vitamin D3) 60000 IU",
        batchNo: "VIT001",
        mfgDate: new Date("2024-02-01"),
        expDate: new Date("2026-02-01"),
        isFeatured: true,
        createdBy: adminUser._id,
      },
      {
        name: "Crocin Cold & Flu",
        company: "GSK",
        price: 45,
        originalPrice: 50,
        stock: 75,
        category: "Cough & Cold",
        weight: "15 tablets",
        shortDescription: "Complete cold and flu relief",
        description: "Multi-symptom relief for cold and flu symptoms.",
        benefits: "Relieves headache, body ache, fever, and nasal congestion",
        usage: "Take 1 tablet every 6 hours",
        composition:
          "Paracetamol 500mg, Phenylephrine HCl 5mg, Chlorpheniramine Maleate 2mg",
        batchNo: "CRO001",
        mfgDate: new Date("2024-03-01"),
        expDate: new Date("2025-03-01"),
        createdBy: adminUser._id,
      },
      {
        name: "Digital Thermometer",
        company: "Omron",
        price: 299,
        originalPrice: 399,
        stock: 25,
        category: "Medical Devices",
        weight: "1 piece",
        shortDescription: "Accurate digital thermometer",
        description: "Fast and accurate temperature measurement.",
        benefits: "Quick reading, Easy to use, Accurate results",
        usage: "Place under tongue for 1 minute",
        composition: "Digital thermometer with LCD display",
        batchNo: "THERM001",
        mfgDate: new Date("2024-01-15"),
        expDate: new Date("2029-01-15"),
        createdBy: adminUser._id,
      },
      {
        name: "Multivitamin Tablets",
        company: "Himalaya",
        price: 180,
        originalPrice: 200,
        stock: 60,
        category: "Vitamins",
        weight: "30 tablets",
        shortDescription: "Complete multivitamin supplement",
        description: "Daily multivitamin for overall health and wellness.",
        benefits: "Supports immunity, energy, and overall health",
        usage: "Take 1 tablet daily after meals",
        composition: "Vitamin A, B, C, D, E and essential minerals",
        batchNo: "MULTI001",
        mfgDate: new Date("2024-04-01"),
        expDate: new Date("2026-04-01"),
        createdBy: adminUser._id,
      },
      {
        name: "Hand Sanitizer 500ml",
        company: "Dettol",
        price: 85,
        originalPrice: 100,
        stock: 40,
        category: "First Aid",
        weight: "500ml",
        shortDescription: "Alcohol-based hand sanitizer",
        description: "Kills 99.9% of germs without soap and water.",
        benefits: "Instant germ protection, moisturizing formula",
        usage: "Apply on hands and rub thoroughly",
        composition: "70% Alcohol, Moisturizers, Fragrance",
        batchNo: "DETT001",
        mfgDate: new Date("2024-05-01"),
        expDate: new Date("2026-05-01"),
        createdBy: adminUser._id,
      },
      {
        name: "Blood Pressure Monitor",
        company: "Omron",
        price: 1299,
        originalPrice: 1499,
        stock: 15,
        category: "Medical Devices",
        weight: "1 piece",
        shortDescription: "Digital blood pressure monitor",
        description: "Accurate blood pressure measurement at home.",
        benefits: "Easy to use, memory function, large display",
        usage: "Wrap cuff around arm and press start",
        composition: "Digital BP monitor with large cuff",
        batchNo: "BP001",
        mfgDate: new Date("2024-02-15"),
        expDate: new Date("2029-02-15"),
        isFeatured: true,
        createdBy: adminUser._id,
      },
      {
        name: "Calcium + Vitamin D Tablets",
        company: "Abbott",
        price: 220,
        originalPrice: 250,
        stock: 80,
        category: "Supplements",
        weight: "30 tablets",
        shortDescription: "Calcium with Vitamin D3 supplement",
        description: "Essential for strong bones and teeth.",
        benefits: "Strengthens bones, prevents osteoporosis",
        usage: "Take 1 tablet twice daily",
        composition: "Calcium Carbonate 500mg, Vitamin D3 250 IU",
        batchNo: "CAL001",
        mfgDate: new Date("2024-03-15"),
        expDate: new Date("2026-03-15"),
        createdBy: adminUser._id,
      },
    ];

    // Create products one by one
    for (const productData of productsData) {
      const product = new Product(productData);
      await product.save();
      console.log(
        `✅ Product created: ${product.name} (slug: ${product.slug})`,
      );
    }

    console.log(`🎉 Successfully created ${productsData.length} products`);
  } catch (error) {
    console.error("❌ Product fix error:", error);
  } finally {
    mongoose.connection.close();
    console.log("🔒 Database connection closed");
  }
};

// Run the fix
connectDB().then(fixProducts);
