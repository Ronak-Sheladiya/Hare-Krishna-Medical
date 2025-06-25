const express = require("express");
const { auth, adminAuth } = require("../middleware/auth");
const {
  validateProduct,
  validateObjectId,
  validatePagination,
  validateSearch,
} = require("../middleware/validate");
const productsController = require("../controllers/productsController");

const router = express.Router();

// @route   GET /api/products
// @desc    Get all products with filtering, sorting, and pagination
// @access  Public
router.get(
  "/",
  validatePagination,
  validateSearch,
  productsController.getAllProducts,
);

// @route   GET /api/products/categories
// @desc    Get all product categories with counts
// @access  Public
router.get("/categories", productsController.getCategories);

// @route   GET /api/products/featured
// @desc    Get featured products
// @access  Public
router.get("/featured", productsController.getFeaturedProducts);

// @route   GET /api/products/search-suggestions
// @desc    Get search suggestions
// @access  Public
router.get("/search-suggestions", productsController.getSearchSuggestions);

// @route   GET /api/products/admin/low-stock
// @desc    Get products with low stock
// @access  Admin
router.get(
  "/admin/low-stock",
  adminAuth,
  productsController.getLowStockProducts,
);

// @route   GET /api/products/:id
// @desc    Get single product
// @access  Public
router.get("/:id", validateObjectId("id"), productsController.getProduct);

// @route   POST /api/products
// @desc    Create new product
// @access  Admin
router.post("/", adminAuth, validateProduct, productsController.createProduct);

// @route   PUT /api/products/:id
// @desc    Update product
// @access  Admin
router.put(
  "/:id",
  adminAuth,
  validateObjectId("id"),
  productsController.updateProduct,
);

// @route   PUT /api/products/:id/stock
// @desc    Update product stock
// @access  Admin
router.put(
  "/:id/stock",
  adminAuth,
  validateObjectId("id"),
  productsController.updateStock,
);

// @route   DELETE /api/products/:id
// @desc    Delete product (soft delete)
// @access  Admin
router.delete(
  "/:id",
  adminAuth,
  validateObjectId("id"),
  productsController.deleteProduct,
);

// @route   POST /api/products/upload-images
// @desc    Upload product images to database
// @access  Admin
router.post("/upload-images", adminAuth, productsController.uploadImages);

// @route   DELETE /api/products/delete-image
// @desc    Delete specific product image
// @access  Admin
router.delete("/delete-image", adminAuth, productsController.deleteImage);

module.exports = router;
