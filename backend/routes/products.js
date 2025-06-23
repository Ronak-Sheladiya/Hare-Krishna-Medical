const express = require("express");
const Product = require("../models/Product");
const { auth, adminAuth } = require("../middleware/auth");
const {
  validateProduct,
  validateObjectId,
  validatePagination,
  validateSearch,
} = require("../middleware/validate");

const router = express.Router();

// @route   GET /api/products
// @desc    Get all products with filtering, sorting, and pagination
// @access  Public
router.get("/", validatePagination, validateSearch, async (req, res) => {
  try {
    const {
      page = 1,
      limit = 12,
      category,
      brand,
      minPrice,
      maxPrice,
      sort = "createdAt",
      order = "desc",
      q,
      featured,
    } = req.query;

    // Build filter object
    const filter = { isActive: true };

    if (category) filter.category = category;
    if (brand) filter.brand = new RegExp(brand, "i");
    if (featured !== undefined) filter.isFeatured = featured === "true";

    // Price range filter
    if (minPrice || maxPrice) {
      filter.price = {};
      if (minPrice) filter.price.$gte = parseFloat(minPrice);
      if (maxPrice) filter.price.$lte = parseFloat(maxPrice);
    }

    // Text search
    if (q) {
      filter.$text = { $search: q };
    }

    // Sort options
    const sortOrder = order === "desc" ? -1 : 1;
    const sortOptions = {};
    sortOptions[sort] = sortOrder;

    // Calculate pagination
    const skip = (parseInt(page) - 1) * parseInt(limit);

    // Execute query
    const [products, totalProducts] = await Promise.all([
      Product.find(filter)
        .sort(sortOptions)
        .skip(skip)
        .limit(parseInt(limit))
        .populate("createdBy", "fullName"),
      Product.countDocuments(filter),
    ]);

    // Calculate pagination info
    const totalPages = Math.ceil(totalProducts / limit);
    const hasNextPage = page < totalPages;
    const hasPrevPage = page > 1;

    res.json({
      success: true,
      data: products,
      pagination: {
        currentPage: parseInt(page),
        totalPages,
        totalProducts,
        hasNextPage,
        hasPrevPage,
        limit: parseInt(limit),
      },
    });
  } catch (error) {
    console.error("Get products error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch products",
      error: error.message,
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
          avgPrice: { $avg: "$price" },
          minPrice: { $min: "$price" },
          maxPrice: { $max: "$price" },
        },
      },
      { $sort: { count: -1 } },
    ]);

    res.json({
      success: true,
      data: categories,
    });
  } catch (error) {
    console.error("Get categories error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch categories",
      error: error.message,
    });
  }
});

// @route   GET /api/products/featured
// @desc    Get featured products
// @access  Public
router.get("/featured", async (req, res) => {
  try {
    const featuredProducts = await Product.find({
      isActive: true,
      isFeatured: true,
    })
      .sort({ sales: -1 })
      .limit(8);

    res.json({
      success: true,
      data: featuredProducts,
    });
  } catch (error) {
    console.error("Get featured products error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch featured products",
      error: error.message,
    });
  }
});

// @route   GET /api/products/search-suggestions
// @desc    Get search suggestions
// @access  Public
router.get("/search-suggestions", async (req, res) => {
  try {
    const { q } = req.query;

    if (!q || q.length < 2) {
      return res.json({
        success: true,
        data: [],
      });
    }

    const suggestions = await Product.find({
      isActive: true,
      $or: [
        { name: new RegExp(q, "i") },
        { brand: new RegExp(q, "i") },
        { tags: new RegExp(q, "i") },
      ],
    })
      .select("name brand category")
      .limit(10);

    res.json({
      success: true,
      data: suggestions,
    });
  } catch (error) {
    console.error("Search suggestions error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch search suggestions",
      error: error.message,
    });
  }
});

// @route   GET /api/products/:id
// @desc    Get single product
// @access  Public
router.get("/:id", validateObjectId("id"), async (req, res) => {
  try {
    const product = await Product.findById(req.params.id).populate(
      "createdBy",
      "fullName",
    );

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    // Increment views
    await product.incrementViews();

    // Get related products
    const relatedProducts = await Product.find({
      category: product.category,
      _id: { $ne: product._id },
      isActive: true,
    })
      .limit(4)
      .select("name price mrp images rating");

    res.json({
      success: true,
      data: {
        product,
        relatedProducts,
      },
    });
  } catch (error) {
    console.error("Get product error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch product",
      error: error.message,
    });
  }
});

// @route   POST /api/products
// @desc    Create new product
// @access  Admin
router.post("/", adminAuth, validateProduct, async (req, res) => {
  try {
    const productData = {
      ...req.body,
      createdBy: req.user.id,
    };

    const product = new Product(productData);
    await product.save();

    // Emit real-time update
    const io = req.app.get("io");
    io.to("admin-room").emit("product-created", {
      product: {
        id: product._id,
        name: product.name,
        category: product.category,
        price: product.price,
        stock: product.stock,
        createdAt: product.createdAt,
      },
    });

    res.status(201).json({
      success: true,
      message: "Product created successfully",
      data: product,
    });
  } catch (error) {
    console.error("Create product error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to create product",
      error: error.message,
    });
  }
});

// @route   PUT /api/products/:id
// @desc    Update product
// @access  Admin
router.put("/:id", adminAuth, validateObjectId("id"), async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    // Update product
    Object.assign(product, req.body);
    await product.save();

    // Emit real-time update
    const io = req.app.get("io");
    io.to("admin-room").emit("product-updated", {
      product: {
        id: product._id,
        name: product.name,
        category: product.category,
        price: product.price,
        stock: product.stock,
        updatedAt: product.updatedAt,
      },
    });

    res.json({
      success: true,
      message: "Product updated successfully",
      data: product,
    });
  } catch (error) {
    console.error("Update product error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to update product",
      error: error.message,
    });
  }
});

// @route   PUT /api/products/:id/stock
// @desc    Update product stock
// @access  Admin
router.put(
  "/:id/stock",
  adminAuth,
  validateObjectId("id"),
  async (req, res) => {
    try {
      const { quantity, operation = "set" } = req.body;

      if (typeof quantity !== "number") {
        return res.status(400).json({
          success: false,
          message: "Quantity must be a number",
        });
      }

      const product = await Product.findById(req.params.id);

      if (!product) {
        return res.status(404).json({
          success: false,
          message: "Product not found",
        });
      }

      // Update stock based on operation
      if (operation === "set") {
        product.stock = quantity;
      } else if (operation === "increase") {
        product.stock += quantity;
      } else if (operation === "decrease") {
        product.stock = Math.max(0, product.stock - quantity);
      }

      product.lastStockUpdate = new Date();
      await product.save();

      // Emit real-time update
      const io = req.app.get("io");
      io.to("admin-room").emit("stock-updated", {
        product: {
          id: product._id,
          name: product.name,
          stock: product.stock,
          stockStatus: product.stockStatus,
          lastStockUpdate: product.lastStockUpdate,
        },
      });

      res.json({
        success: true,
        message: "Stock updated successfully",
        data: {
          stock: product.stock,
          stockStatus: product.stockStatus,
        },
      });
    } catch (error) {
      console.error("Update stock error:", error);
      res.status(500).json({
        success: false,
        message: "Failed to update stock",
        error: error.message,
      });
    }
  },
);

// @route   DELETE /api/products/:id
// @desc    Delete product (soft delete)
// @access  Admin
router.delete("/:id", adminAuth, validateObjectId("id"), async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    // Soft delete
    product.isActive = false;
    await product.save();

    // Emit real-time update
    const io = req.app.get("io");
    io.to("admin-room").emit("product-deleted", {
      productId: product._id,
      productName: product.name,
    });

    res.json({
      success: true,
      message: "Product deleted successfully",
    });
  } catch (error) {
    console.error("Delete product error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to delete product",
      error: error.message,
    });
  }
});

// @route   GET /api/products/admin/low-stock
// @desc    Get products with low stock
// @access  Admin
router.get("/admin/low-stock", adminAuth, async (req, res) => {
  try {
    const lowStockProducts = await Product.find({
      isActive: true,
      $expr: { $lte: ["$stock", "$minStock"] },
    }).sort({ stock: 1 });

    res.json({
      success: true,
      data: lowStockProducts,
    });
  } catch (error) {
    console.error("Get low stock products error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch low stock products",
      error: error.message,
    });
  }
});

// @route   POST /api/products/upload-images
// @desc    Upload product images to database
// @access  Admin
router.post("/upload-images", adminAuth, async (req, res) => {
  try {
    const { productId, images } = req.body;

    // Validate input
    if (!productId || !images || !Array.isArray(images)) {
      return res.status(400).json({
        success: false,
        message: "Product ID and images array are required",
      });
    }

    // Validate each image
    for (const imageData of images) {
      if (!imageData || !imageData.startsWith("data:image/")) {
        return res.status(400).json({
          success: false,
          message: "Invalid image data provided",
        });
      }

      // Check image size
      const imageSizeBytes = (imageData.length * 3) / 4;
      const maxSizeBytes = 5 * 1024 * 1024; // 5MB

      if (imageSizeBytes > maxSizeBytes) {
        return res.status(400).json({
          success: false,
          message: "One or more images exceed 5MB size limit",
        });
      }
    }

    // Update product images
    const product = await Product.findByIdAndUpdate(
      productId,
      { images: images },
      { new: true, runValidators: true },
    );

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    res.json({
      success: true,
      message: "Product images uploaded successfully",
      data: {
        imageUrls: images,
        product,
      },
    });
  } catch (error) {
    console.error("Product image upload error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to upload product images",
      error: error.message,
    });
  }
});

// @route   DELETE /api/products/delete-image
// @desc    Delete specific product image
// @access  Admin
router.delete("/delete-image", adminAuth, async (req, res) => {
  try {
    const { productId, imageUrl } = req.body;

    if (!productId || !imageUrl) {
      return res.status(400).json({
        success: false,
        message: "Product ID and image URL are required",
      });
    }

    // Find product and remove the specific image
    const product = await Product.findById(productId);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    // Remove the image from the array
    const updatedImages = product.images.filter((img) => img !== imageUrl);

    // Ensure at least one image remains
    if (updatedImages.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Product must have at least one image",
      });
    }

    // Update product
    const updatedProduct = await Product.findByIdAndUpdate(
      productId,
      { images: updatedImages },
      { new: true, runValidators: true },
    );

    res.json({
      success: true,
      message: "Product image deleted successfully",
      data: { product: updatedProduct },
    });
  } catch (error) {
    console.error("Product image delete error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to delete product image",
      error: error.message,
    });
  }
});

module.exports = router;
