const mongoose = require("mongoose");
require("dotenv").config();

const Product = require("../models/Product");

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("✅ Connected to MongoDB for seeding products");
  } catch (err) {
    console.error("❌ MongoDB connection failed:", err.message);
    process.exit(1);
  }
};

const medicineProducts = [
  {
    name: "Paracetamol 500mg",
    shortDescription: "Pain relief and fever reducer tablets",
    description:
      "Effective pain reliever and fever reducer. Safe for adults and children over 12 years. Provides quick relief from headaches, muscle aches, and minor pain.",
    price: 25,
    stock: 150,
    category: "Tablet",
    company: "Cipla Ltd",
    composition: "Paracetamol 500mg",
    manufacturingDate: new Date("2024-01-15"),
    expiryDate: new Date("2026-01-15"),
    batchNumber: "PC500-2024-001",
    featured: true,
    images: [
      "https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=500&h=300&fit=crop",
    ],
  },
  {
    name: "Amoxicillin 250mg",
    shortDescription: "Antibiotic capsules for bacterial infections",
    description:
      "Broad-spectrum antibiotic for treating various bacterial infections including respiratory tract infections, ear infections, and skin infections.",
    price: 120,
    stock: 80,
    category: "Capsule",
    company: "Sun Pharma",
    composition: "Amoxicillin 250mg",
    manufacturingDate: new Date("2024-02-10"),
    expiryDate: new Date("2026-02-10"),
    batchNumber: "AMX250-2024-002",
    featured: true,
    images: [
      "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=500&h=300&fit=crop",
    ],
  },
  {
    name: "Cough Syrup 100ml",
    shortDescription: "Herbal cough relief syrup",
    description:
      "Natural herbal cough syrup providing effective relief from dry and wet cough. Safe for all ages with honey and tulsi extracts.",
    price: 85,
    stock: 200,
    category: "Syrup",
    company: "Himalaya Drug Company",
    composition: "Honey, Tulsi Extract, Mulethi",
    manufacturingDate: new Date("2024-03-05"),
    expiryDate: new Date("2026-03-05"),
    batchNumber: "CS100-2024-003",
    featured: true,
    images: [
      "https://images.unsplash.com/photo-1587854692152-cbe660dbde88?w=500&h=300&fit=crop",
    ],
  },
  {
    name: "Vitamin D3 Tablets",
    shortDescription: "Essential vitamin D3 supplements",
    description:
      "High-quality Vitamin D3 supplements for bone health and immunity. Essential for calcium absorption and overall health maintenance.",
    price: 180,
    stock: 120,
    category: "Tablet",
    company: "Carbamide Forte",
    composition: "Cholecalciferol (Vitamin D3) 60000 IU",
    manufacturingDate: new Date("2024-01-20"),
    expiryDate: new Date("2026-01-20"),
    batchNumber: "VD3-2024-004",
    featured: true,
    images: [
      "https://images.unsplash.com/photo-1550572017-7bb9bbeb7bcc?w=500&h=300&fit=crop",
    ],
  },
  {
    name: "Antiseptic Cream 30g",
    shortDescription: "Antimicrobial skin protection cream",
    description:
      "Effective antiseptic cream for cuts, wounds, and skin infections. Provides antimicrobial protection and promotes healing.",
    price: 65,
    stock: 90,
    category: "Cream",
    company: "Johnson & Johnson",
    composition: "Povidone Iodine 5% w/w",
    manufacturingDate: new Date("2024-02-15"),
    expiryDate: new Date("2026-02-15"),
    batchNumber: "AC30-2024-005",
    featured: false,
    images: [
      "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=500&h=300&fit=crop",
    ],
  },
  {
    name: "Multivitamin Capsules",
    shortDescription: "Complete multivitamin and mineral supplement",
    description:
      "Comprehensive multivitamin formula with essential vitamins and minerals for daily nutritional support and overall wellness.",
    price: 450,
    stock: 75,
    category: "Capsule",
    company: "HealthKart",
    composition: "Vitamin A, C, D, E, B-Complex, Iron, Calcium, Zinc",
    manufacturingDate: new Date("2024-01-10"),
    expiryDate: new Date("2026-01-10"),
    batchNumber: "MV-2024-006",
    featured: false,
    images: [
      "https://images.unsplash.com/photo-1559757175-0eb30cd8c063?w=500&h=300&fit=crop",
    ],
  },
  {
    name: "Blood Pressure Monitor",
    shortDescription: "Digital automatic blood pressure monitor",
    description:
      "Accurate digital blood pressure monitor with large display. Easy-to-use automatic inflation and memory storage for tracking.",
    price: 2500,
    stock: 25,
    category: "Equipment",
    company: "Omron Healthcare",
    composition: "Digital BP Monitor with Cuff",
    manufacturingDate: new Date("2024-01-01"),
    expiryDate: new Date("2029-01-01"),
    batchNumber: "BPM-2024-007",
    featured: false,
    images: [
      "https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=500&h=300&fit=crop",
    ],
  },
  {
    name: "Thermometer Digital",
    shortDescription: "Fast and accurate digital thermometer",
    description:
      "Quick-read digital thermometer with fever alarm. Accurate temperature measurement in just 10 seconds with automatic shut-off.",
    price: 150,
    stock: 60,
    category: "Equipment",
    company: "Dr. Morepen",
    composition: "Digital Thermometer",
    manufacturingDate: new Date("2024-02-01"),
    expiryDate: new Date("2029-02-01"),
    batchNumber: "DT-2024-008",
    featured: false,
    image:
      "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=500&h=300&fit=crop",
  },
];

const seedProducts = async () => {
  try {
    console.log("🌱 Starting product seeding...");

    // Check if products already exist
    const existingProducts = await Product.countDocuments();
    console.log(`📊 Current products in database: ${existingProducts}`);

    if (existingProducts > 0) {
      console.log("⚠️ Products already exist. Clearing existing products...");
      await Product.deleteMany({});
      console.log("✅ Existing products cleared");
    }

    // Insert new products
    console.log("📦 Inserting new products...");
    const insertedProducts = await Product.insertMany(medicineProducts);

    console.log(`✅ Successfully seeded ${insertedProducts.length} products:`);
    insertedProducts.forEach((product, index) => {
      console.log(
        `   ${index + 1}. ${product.name} - ₹${product.price} (Stock: ${product.stock})`,
      );
    });

    // Show featured products
    const featuredCount = insertedProducts.filter((p) => p.featured).length;
    console.log(`🌟 Featured products: ${featuredCount}`);

    console.log("🎉 Product seeding completed successfully!");

    if (require.main === module) {
      process.exit(0);
    }

    return insertedProducts;
  } catch (error) {
    console.error("❌ Product seeding failed:", error);
    if (require.main === module) {
      process.exit(1);
    }
    throw error;
  }
};

if (require.main === module) {
  connectDB().then(() => seedProducts());
}

module.exports = { seedProducts };
