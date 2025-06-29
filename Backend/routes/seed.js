const express = require("express");
const { seedProducts } = require("../scripts/seed-products");
const Product = require("../models/Product");

const router = express.Router();

// @route   GET /api/seed/quick
// @desc    Quick seed with minimal products for production
// @access  Public
router.get("/quick", async (req, res) => {
  try {
    console.log("🌱 Quick seeding products...");

    // Create minimal products without complex validation
    const quickProducts = [
      {
        name: "Paracetamol 500mg",
        shortDescription: "Pain relief tablets",
        description:
          "Effective pain reliever and fever reducer for adults and children.",
        price: 25,
        stock: 150,
        category: "Tablet",
        company: "Cipla",
        images: ["https://via.placeholder.com/200x200?text=Paracetamol"],
        isActive: true,
      },
      {
        name: "Vitamin D3",
        shortDescription: "Vitamin D3 supplement",
        description: "Essential vitamin D3 for bone health and immunity.",
        price: 180,
        stock: 100,
        category: "Tablet",
        company: "Sun Pharma",
        images: ["https://via.placeholder.com/200x200?text=Vitamin+D3"],
        isActive: true,
      },
      {
        name: "Cough Syrup",
        shortDescription: "Natural cough relief",
        description: "Herbal cough syrup for effective cough relief.",
        price: 85,
        stock: 200,
        category: "Syrup",
        company: "Himalaya",
        images: ["https://via.placeholder.com/200x200?text=Cough+Syrup"],
        isActive: true,
      },
    ];

    // Clear existing and insert new
    await Product.deleteMany({});
    const products = await Product.insertMany(quickProducts);

    res.json({
      success: true,
      message: `Quick seeded ${products.length} products`,
      data: products,
    });
  } catch (error) {
    console.error("Quick seed error:", error);
    res.status(500).json({
      success: false,
      message: "Quick seed failed",
      error: error.message,
    });
  }
});

// @route   POST /api/seed/products
// @desc    Seed database with sample products
// @access  Public (for development only)
router.post("/products", async (req, res) => {
  try {
    console.log("🌱 Starting product seeding via API...");

    const products = await seedProducts();

    res.status(201).json({
      success: true,
      message: `Successfully seeded ${products.length} products`,
      data: {
        totalProducts: products.length,
        featuredProducts: products.filter((p) => p.featured).length,
        products: products.map((p) => ({
          id: p._id,
          name: p.name,
          price: p.price,
          category: p.category,
          featured: p.featured,
        })),
      },
    });
  } catch (error) {
    console.error("❌ Seeding failed:", error);
    res.status(500).json({
      success: false,
      message: "Failed to seed products",
      error: error.message,
    });
  }
});

// @route   GET /api/seed/status
// @desc    Check database seeding status
// @access  Public
router.get("/status", async (req, res) => {
  try {
    const productCount = await Product.countDocuments();
    const featuredCount = await Product.countDocuments({ featured: true });

    res.json({
      success: true,
      data: {
        totalProducts: productCount,
        featuredProducts: featuredCount,
        needsSeeding: productCount === 0,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to check status",
      error: error.message,
    });
  }
});

// @route   DELETE /api/seed/products
// @desc    Clear all products from database
// @access  Public (for development only)
router.delete("/products", async (req, res) => {
  try {
    const result = await Product.deleteMany({});

    res.json({
      success: true,
      message: `Deleted ${result.deletedCount} products`,
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
