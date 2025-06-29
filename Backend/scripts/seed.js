const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
require("dotenv").config();

// Import models
const User = require("../models/User");
const Product = require("../models/Product");
const Letterhead = require("../models/Letterhead");

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
    console.log("✅ MongoDB connected for seeding");
  } catch (error) {
    console.error("❌ MongoDB connection error:", error.message);
    process.exit(1);
  }
};

// Seed data
const seedData = async () => {
  try {
    console.log("🌱 Starting data seeding...");

    // Clear existing data
    await User.deleteMany({});
    await Product.deleteMany({});
    await Letterhead.deleteMany({});

    console.log("🗑️ Cleared existing data");

    // Create admin user
    const adminUser = new User({
      fullName: "Admin User",
      email: "admin@harekrishnamedical.com",
      password: "admin123",
      role: "admin",
      isVerified: true,
      isActive: true,
    });
    await adminUser.save();
    console.log("👨‍💼 Admin user created");

    // Create test users
    const testUsers = [
      {
        fullName: "John Doe",
        email: "john@example.com",
        password: "password123",
        mobile: "9876543210",
        isVerified: true,
      },
      {
        fullName: "Jane Smith",
        email: "jane@example.com",
        password: "password123",
        mobile: "9876543211",
        isVerified: true,
      },
    ];

    const createdUsers = await User.insertMany(testUsers);
    console.log(`👥 ${createdUsers.length} test users created`);

    // Create sample products
    const products = [
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
        name: "First Aid Kit",
        company: "Johnson & Johnson",
        price: 450,
        originalPrice: 500,
        stock: 30,
        category: "First Aid",
        weight: "1 kit",
        shortDescription: "Complete first aid kit for home",
        description:
          "Comprehensive first aid kit with essential medical supplies.",
        benefits: "Emergency preparedness, Complete medical supplies",
        usage: "Use as needed for minor injuries",
        composition: "Bandages, antiseptic, cotton, scissors, thermometer",
        batchNo: "AID001",
        mfgDate: new Date("2024-01-01"),
        expDate: new Date("2027-01-01"),
        isFeatured: true,
        createdBy: adminUser._id,
      },
      {
        name: "Omega 3 Fish Oil",
        company: "Nature Made",
        price: 899,
        originalPrice: 999,
        stock: 40,
        category: "Supplements",
        weight: "60 capsules",
        shortDescription: "Premium Omega 3 supplement",
        description: "High-quality fish oil with EPA and DHA.",
        benefits: "Supports heart health, Brain function, Joint health",
        usage: "Take 1 capsule daily with meals",
        composition: "Fish Oil 1000mg (EPA 300mg, DHA 200mg)",
        batchNo: "OME001",
        mfgDate: new Date("2024-02-15"),
        expDate: new Date("2026-02-15"),
        createdBy: adminUser._id,
      },
    ];

    // Create products one by one to trigger slug generation middleware
    const createdProducts = [];
    for (const productData of products) {
      const product = new Product(productData);
      await product.save();
      createdProducts.push(product);
    }
    console.log(`🛍️ ${createdProducts.length} products created`);

    // Create default letterhead
    const defaultLetterhead = new Letterhead({
      name: "Default Letterhead",
      description: "Default company letterhead",
      companyInfo: {
        name: "Hare Krishna Medical Store",
        address: {
          street: "123 Medical Street",
          city: "Mumbai",
          state: "Maharashtra",
          pincode: "400001",
          country: "India",
        },
        contact: {
          phone: "+91-22-12345678",
          mobile: "+91-9876543210",
          email: "info@harekrishnamedical.com",
          website: "www.harekrishnamedical.com",
        },
        registration: {
          gst: "27ABCDE1234F1Z5",
          pan: "ABCDE1234F",
          registrationNumber: "REG123456",
          licenseNumber: "LIC789012",
        },
      },
      isDefault: true,
      isActive: true,
      createdBy: adminUser._id,
    });

    await defaultLetterhead.save();
    console.log("📄 Default letterhead created");

    console.log("✅ Data seeding completed successfully!");

    console.log("\n📋 Seeded Data Summary:");
    console.log(
      `👨‍💼 Admin User: admin@harekrishnamedical.com (password: admin123)`,
    );
    console.log(`👥 Test Users: ${createdUsers.length} users`);
    console.log(`🛍️ Products: ${createdProducts.length} products`);
    console.log(`📄 Letterheads: 1 default letterhead`);
  } catch (error) {
    console.error("❌ Seeding error:", error);
  }
};

// Run seeding
const runSeeding = async () => {
  await connectDB();
  await seedData();

  // Close connection
  await mongoose.connection.close();
  console.log("🔒 Database connection closed");
  process.exit(0);
};

// Execute if run directly
if (require.main === module) {
  runSeeding();
}

module.exports = { seedData, connectDB };
