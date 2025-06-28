const express = require("express");
const Product = require("../models/Product");

const router = express.Router();

// Sample products data
const sampleProducts = [
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
    image:
      "https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=500&h=300&fit=crop",
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
    image:
      "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=500&h=300&fit=crop",
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
    image:
      "https://images.unsplash.com/photo-1587854692152-cbe660dbde88?w=500&h=300&fit=crop",
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
    image:
      "https://images.unsplash.com/photo-1550572017-7bb9bbeb7bcc?w=500&h=300&fit=crop",
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
    image:
      "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=500&h=300&fit=crop",
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
    image:
      "https://images.unsplash.com/photo-1559757175-0eb30cd8c063?w=500&h=300&fit=crop",
  },
];

// @route   POST /api/dev/seed-products
// @desc    Seed database with sample products (Development only)
// @access  Public (Development only)
router.post("/seed-products", async (req, res) => {
  try {
    console.log("🌱 Starting product seeding...");

    // Check current product count
    const existingCount = await Product.countDocuments();
    console.log(`📊 Current products in database: ${existingCount}`);

    // Insert sample products
    const insertedProducts = await Product.insertMany(sampleProducts);

    console.log(`✅ Successfully seeded ${insertedProducts.length} products`);

    res.status(201).json({
      success: true,
      message: `Successfully seeded ${insertedProducts.length} products`,
      data: {
        totalProducts: insertedProducts.length,
        featuredProducts: insertedProducts.filter((p) => p.featured).length,
        existingProducts: existingCount,
        newProducts: insertedProducts.length,
        products: insertedProducts.map((p) => ({
          id: p._id,
          name: p.name,
          price: p.price,
          category: p.category,
          featured: p.featured,
        })),
      },
    });
  } catch (error) {
    console.error("❌ Product seeding failed:", error);

    // Handle duplicate key errors gracefully
    if (error.code === 11000) {
      res.status(400).json({
        success: false,
        message: "Some products already exist in the database",
        error: "Duplicate products detected",
      });
    } else {
      res.status(500).json({
        success: false,
        message: "Failed to seed products",
        error: error.message,
      });
    }
  }
});

// @route   GET /api/dev/status
// @desc    Get database status for development
// @access  Public
router.get("/status", async (req, res) => {
  try {
    const productCount = await Product.countDocuments();
    const featuredCount = await Product.countDocuments({ featured: true });

    res.json({
      success: true,
      data: {
        database: "connected",
        totalProducts: productCount,
        featuredProducts: featuredCount,
        needsSeeding: productCount === 0,
        sampleProductsAvailable: sampleProducts.length,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to check database status",
      error: error.message,
    });
  }
});

// @route   DELETE /api/dev/clear-products
// @desc    Clear all products (Development only)
// @access  Public (Development only)
router.delete("/clear-products", async (req, res) => {
  try {
    const result = await Product.deleteMany({});

    console.log(`🧹 Cleared ${result.deletedCount} products from database`);

    res.json({
      success: true,
      message: `Successfully deleted ${result.deletedCount} products`,
      data: {
        deletedCount: result.deletedCount,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to clear products",
      error: error.message,
    });
  }
});

module.exports = router;
