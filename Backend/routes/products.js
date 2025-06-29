const express = require("express");
const Product = require("../models/Product");
const {
  authenticateToken,
  requireAdmin,
  optionalAuth,
} = require("../middleware/auth");
const {
  validationRules,
  handleValidationErrors,
} = require("../middleware/validation");

const router = express.Router();

// @route   GET /api/products
// @desc    Get all products with filtering and pagination
// @access  Public
router.get(
  "/",
  validationRules.productSearch,
  validationRules.pagination,
  handleValidationErrors,
  async (req, res) => {
    try {
      const {
        q = "",
        category = "",
        minPrice,
        maxPrice,
        sortBy = "createdAt",
        sortOrder = "desc",
        page = 1,
        limit = 20,
        featured = false,
      } = req.query;

      // Build search criteria
      const searchCriteria = {
        isActive: true,
      };

      // Text search
      if (q) {
        searchCriteria.$text = { $search: q };
      }

      // Category filter
      if (category) {
        searchCriteria.category = category;
      }

      // Price range filter
      if (minPrice !== undefined || maxPrice !== undefined) {
        searchCriteria.price = {};
        if (minPrice !== undefined)
          searchCriteria.price.$gte = parseFloat(minPrice);
        if (maxPrice !== undefined)
          searchCriteria.price.$lte = parseFloat(maxPrice);
      }

      // Featured filter
      if (featured === "true") {
        searchCriteria.isFeatured = true;
      }

      // Only show in-stock items by default
      if (!req.query.includeOutOfStock) {
        searchCriteria.stock = { $gt: 0 };
      }

      // Sort configuration
      let sortConfig = {};
      const order = sortOrder === "asc" || sortOrder === "1" ? 1 : -1;

      switch (sortBy) {
        case "price":
          sortConfig.price = order;
          break;
        case "name":
          sortConfig.name = order;
          break;
        case "rating":
          sortConfig["ratings.average"] = order;
          break;
        case "popularity":
          sortConfig.salesCount = order;
          break;
        default:
          sortConfig.createdAt = order;
      }

      // Add text score for text search
      if (q) {
        sortConfig.score = { $meta: "textScore" };
      }

      // Pagination
      const pageNum = parseInt(page);
      const limitNum = parseInt(limit);
      const skip = (pageNum - 1) * limitNum;

      // Execute query
      const [products, totalProducts] = await Promise.all([
        Product.find(searchCriteria)
          .sort(sortConfig)
          .skip(skip)
          .limit(limitNum)
          .populate("createdBy", "fullName")
          .lean(),
        Product.countDocuments(searchCriteria),
      ]);

      // Calculate pagination info
      const totalPages = Math.ceil(totalProducts / limitNum);
      const hasNextPage = pageNum < totalPages;
      const hasPrevPage = pageNum > 1;

      res.json({
        success: true,
        data: {
          products,
          pagination: {
            currentPage: pageNum,
            totalPages,
            totalProducts,
            hasNextPage,
            hasPrevPage,
            limit: limitNum,
          },
          filters: {
            query: q,
            category,
            minPrice,
            maxPrice,
            sortBy,
            sortOrder,
          },
        },
      });
    } catch (error) {
      console.error("Get products error:", error);
      res.status(500).json({
        success: false,
        message: "Failed to fetch products",
      });
    }
  },
);

// @route   GET /api/products/featured
// @desc    Get featured products
// @access  Public
router.get("/featured", async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 8;

    const products = await Product.getFeatured(limit);

    res.json({
      success: true,
      data: {
        products,
        count: products.length,
      },
    });
  } catch (error) {
    console.error("Get featured products error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch featured products",
    });
  }
});

// @route   GET /api/products/categories
// @desc    Get all product categories with counts
// @access  Public
router.get("/categories", async (req, res) => {
  try {
    const categories = await Product.aggregate([
      { $match: { isActive: true } },
      {
        $group: {
          _id: "$category",
          count: { $sum: 1 },
          averagePrice: { $avg: "$price" },
          minPrice: { $min: "$price" },
          maxPrice: { $max: "$price" },
        },
      },
      { $sort: { count: -1 } },
    ]);

    res.json({
      success: true,
      data: {
        categories,
        totalCategories: categories.length,
      },
    });
  } catch (error) {
    console.error("Get categories error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch categories",
    });
  }
});

// @route   GET /api/products/:id
// @desc    Get single product by ID
// @access  Public
router.get(
  "/:id",
  validationRules.mongoId,
  handleValidationErrors,
  optionalAuth,
  async (req, res) => {
    try {
      const product = await Product.findById(req.params.id)
        .populate("createdBy", "fullName")
        .populate("reviews.user", "fullName");

      if (!product) {
        return res.status(404).json({
          success: false,
          message: "Product not found",
        });
      }

      if (!product.isActive && (!req.user || req.user.role !== "admin")) {
        return res.status(404).json({
          success: false,
          message: "Product not found",
        });
      }

      // Increment view count (don't wait for it)
      product
        .incrementViews()
        .catch((err) => console.error("Failed to increment view count:", err));

      res.json({
        success: true,
        data: {
          product,
        },
      });
    } catch (error) {
      console.error("Get product error:", error);
      res.status(500).json({
        success: false,
        message: "Failed to fetch product",
      });
    }
  },
);

// @route   GET /api/products/slug/:slug
// @desc    Get single product by slug
// @access  Public
router.get("/slug/:slug", optionalAuth, async (req, res) => {
  try {
    const product = await Product.findOne({ slug: req.params.slug })
      .populate("createdBy", "fullName")
      .populate("reviews.user", "fullName");

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    if (!product.isActive && (!req.user || req.user.role !== "admin")) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    // Increment view count
    product
      .incrementViews()
      .catch((err) => console.error("Failed to increment view count:", err));

    res.json({
      success: true,
      data: {
        product,
      },
    });
  } catch (error) {
    console.error("Get product by slug error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch product",
    });
  }
});

// @route   POST /api/products
// @desc    Create new product
// @access  Private (Admin only)
router.post(
  "/",
  authenticateToken,
  requireAdmin,
  validationRules.productCreate,
  handleValidationErrors,
  async (req, res) => {
    try {
      const productData = {
        ...req.body,
        createdBy: req.user._id,
      };

      const product = new Product(productData);
      await product.save();

      await product.populate("createdBy", "fullName");

      res.status(201).json({
        success: true,
        message: "Product created successfully",
        data: {
          product,
        },
      });
    } catch (error) {
      console.error("Create product error:", error);
      res.status(500).json({
        success: false,
        message: "Failed to create product",
      });
    }
  },
);

// @route   PUT /api/products/:id
// @desc    Update product
// @access  Private (Admin only)
router.put(
  "/:id",
  authenticateToken,
  requireAdmin,
  validationRules.mongoId,
  validationRules.productUpdate,
  handleValidationErrors,
  async (req, res) => {
    try {
      const updateData = {
        ...req.body,
        updatedBy: req.user._id,
      };

      const product = await Product.findByIdAndUpdate(
        req.params.id,
        updateData,
        { new: true, runValidators: true },
      ).populate("createdBy updatedBy", "fullName");

      if (!product) {
        return res.status(404).json({
          success: false,
          message: "Product not found",
        });
      }

      res.json({
        success: true,
        message: "Product updated successfully",
        data: {
          product,
        },
      });
    } catch (error) {
      console.error("Update product error:", error);
      res.status(500).json({
        success: false,
        message: "Failed to update product",
      });
    }
  },
);

// @route   DELETE /api/products/:id
// @desc    Delete product (soft delete)
// @access  Private (Admin only)
router.delete(
  "/:id",
  authenticateToken,
  requireAdmin,
  validationRules.mongoId,
  handleValidationErrors,
  async (req, res) => {
    try {
      const product = await Product.findByIdAndUpdate(
        req.params.id,
        { isActive: false, updatedBy: req.user._id },
        { new: true },
      );

      if (!product) {
        return res.status(404).json({
          success: false,
          message: "Product not found",
        });
      }

      res.json({
        success: true,
        message: "Product deleted successfully",
      });
    } catch (error) {
      console.error("Delete product error:", error);
      res.status(500).json({
        success: false,
        message: "Failed to delete product",
      });
    }
  },
);

// @route   POST /api/products/:id/reviews
// @desc    Add product review
// @access  Private
router.post(
  "/:id/reviews",
  authenticateToken,
  validationRules.mongoId,
  handleValidationErrors,
  async (req, res) => {
    try {
      const { rating, comment } = req.body;

      if (!rating || rating < 1 || rating > 5) {
        return res.status(400).json({
          success: false,
          message: "Rating must be between 1 and 5",
        });
      }

      const product = await Product.findById(req.params.id);
      if (!product) {
        return res.status(404).json({
          success: false,
          message: "Product not found",
        });
      }

      if (!product.isActive) {
        return res.status(400).json({
          success: false,
          message: "Cannot review inactive product",
        });
      }

      await product.addReview(req.user._id, req.user.fullName, rating, comment);

      await product.populate("reviews.user", "fullName");

      res.status(201).json({
        success: true,
        message: "Review added successfully",
        data: {
          product: {
            _id: product._id,
            ratings: product.ratings,
            reviews: product.reviews,
          },
        },
      });
    } catch (error) {
      console.error("Add review error:", error);
      res.status(500).json({
        success: false,
        message: "Failed to add review",
      });
    }
  },
);

// @route   PUT /api/products/:id/stock
// @desc    Update product stock
// @access  Private (Admin only)
router.put(
  "/:id/stock",
  authenticateToken,
  requireAdmin,
  validationRules.mongoId,
  handleValidationErrors,
  async (req, res) => {
    try {
      const { quantity, operation = "set" } = req.body;

      if (typeof quantity !== "number" || quantity < 0) {
        return res.status(400).json({
          success: false,
          message: "Quantity must be a non-negative number",
        });
      }

      const product = await Product.findById(req.params.id);
      if (!product) {
        return res.status(404).json({
          success: false,
          message: "Product not found",
        });
      }

      if (operation === "set") {
        product.stock = quantity;
      } else if (operation === "add") {
        product.stock += quantity;
      } else if (operation === "subtract") {
        product.stock = Math.max(0, product.stock - quantity);
      } else {
        return res.status(400).json({
          success: false,
          message: "Invalid operation. Use set, add, or subtract",
        });
      }

      product.updatedBy = req.user._id;
      await product.save();

      res.json({
        success: true,
        message: "Stock updated successfully",
        data: {
          product: {
            _id: product._id,
            name: product.name,
            stock: product.stock,
          },
        },
      });
    } catch (error) {
      console.error("Update stock error:", error);
      res.status(500).json({
        success: false,
        message: "Failed to update stock",
      });
    }
  },
);

module.exports = router;
