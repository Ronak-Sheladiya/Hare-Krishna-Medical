const Product = require("../models/Product");
const QRCode = require("qrcode");

// Fallback sample data for development when database is disconnected
const sampleProducts = [
  {
    _id: "64c8b2e1f123456789abcdef",
    name: "Paracetamol 500mg",
    company: "Cipla",
    price: 25.5,
    originalPrice: 30.0,
    stock: 150,
    category: "Pain Relief",
    description:
      "Effective pain relief and fever reducer suitable for adults and children over 12 years.",
    benefits:
      "• Fast-acting pain relief\n• Reduces fever effectively\n• Safe for regular use\n• Gentle on stomach",
    usage:
      "Take 1-2 tablets every 4-6 hours as needed. Do not exceed 8 tablets in 24 hours.",
    weight: "500mg",
    images: [
      "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZGRkZGRkIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtc2l6ZT0iMTgiIGZpbGw9IiM5OTk5OTkiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGR5PSIuM2VtIj5QYXJhY2V0YW1vbDwvdGV4dD48L3N2Zz4=",
    ],
    isActive: true,
    isFeatured: true,
    rating: { average: 4.5, count: 125 },
    sales: 250,
    views: 1200,
    createdAt: new Date("2024-01-15"),
    updatedAt: new Date("2024-06-20"),
    lastStockUpdate: new Date("2024-06-20"),
  },
  {
    _id: "64c8b2e1f123456789abcde0",
    name: "Vitamin D3 Tablets",
    company: "Sun Pharma",
    price: 180.0,
    originalPrice: 200.0,
    stock: 85,
    category: "Vitamins",
    description:
      "Essential vitamin D3 supplement for bone health and immunity support.",
    benefits:
      "• Supports bone and teeth health\n• Boosts immune system\n• Helps calcium absorption\n• Prevents vitamin D deficiency",
    usage: "Take 1 tablet daily with water, preferably after meals.",
    weight: "60000 IU",
    images: [
      "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZmZlNTAwIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtc2l6ZT0iMTgiIGZpbGw9IiM2NjY2NjYiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGR5PSIuM2VtIj5WaXRhbWluIEQzPC90ZXh0Pjwvc3ZnPg==",
    ],
    isActive: true,
    isFeatured: true,
    rating: { average: 4.7, count: 89 },
    sales: 190,
    views: 800,
    createdAt: new Date("2024-02-10"),
    updatedAt: new Date("2024-06-18"),
    lastStockUpdate: new Date("2024-06-18"),
  },
  {
    _id: "64c8b2e1f123456789abcde1",
    name: "Cough Syrup 100ml",
    company: "Dabur",
    price: 95.0,
    originalPrice: 110.0,
    stock: 65,
    category: "Cough & Cold",
    description: "Natural ayurvedic cough syrup for dry and wet cough relief.",
    benefits:
      "• Relieves dry and wet cough\n• Natural ayurvedic formula\n• Soothes throat irritation\n• Safe for all ages",
    usage:
      "Adults: 2 teaspoons 3 times daily. Children: 1 teaspoon 3 times daily.",
    weight: "100ml",
    images: [
      "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZTc0YzNjIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtc2l6ZT0iMTgiIGZpbGw9IndoaXRlIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBkeT0iLjNlbSI+Q291Z2ggU3lydXA8L3RleHQ+PC9zdmc+",
    ],
    isActive: true,
    isFeatured: false,
    rating: { average: 4.2, count: 156 },
    sales: 320,
    views: 950,
    createdAt: new Date("2024-01-25"),
    updatedAt: new Date("2024-06-15"),
    lastStockUpdate: new Date("2024-06-15"),
  },
  {
    _id: "64c8b2e1f123456789abcde2",
    name: "First Aid Kit",
    company: "Johnson & Johnson",
    price: 450.0,
    originalPrice: 500.0,
    stock: 25,
    category: "First Aid",
    description:
      "Complete first aid kit for home and travel use with essential medical supplies.",
    benefits:
      "• Complete medical emergency kit\n• Travel-friendly compact size\n• Quality medical supplies\n• Essential for every home",
    usage: "Keep in easily accessible location. Check expiry dates regularly.",
    weight: "500g",
    images: [
      "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZGMzNTQ1Ii8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtc2l6ZT0iMTgiIGZpbGw9IndoaXRlIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBkeT0iLjNlbSI+Rmlyc3QgQWlkPC90ZXh0Pjwvc3ZnPg==",
    ],
    isActive: true,
    isFeatured: true,
    rating: { average: 4.6, count: 78 },
    sales: 120,
    views: 600,
    createdAt: new Date("2024-03-05"),
    updatedAt: new Date("2024-06-22"),
    lastStockUpdate: new Date("2024-06-22"),
  },
  {
    _id: "64c8b2e1f123456789abcde3",
    name: "Digital Thermometer",
    company: "Omron",
    price: 280.0,
    originalPrice: 320.0,
    stock: 45,
    category: "Medical Devices",
    description:
      "Accurate digital thermometer with fast reading and fever alarm.",
    benefits:
      "• Fast 60-second reading\n• High accuracy ±0.1°C\n• Fever alarm function\n• Memory for last reading",
    usage: "Place under tongue, armpit, or rectally. Wait for beep signal.",
    weight: "15g",
    images: [
      "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjMDA3YmZmIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtc2l6ZT0iMTgiIGZpbGw9IndoaXRlIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBkeT0iLjNlbSI+VGhlcm1vbWV0ZXI8L3RleHQ+PC9zdmc+",
    ],
    isActive: true,
    isFeatured: false,
    rating: { average: 4.8, count: 92 },
    sales: 85,
    views: 720,
    createdAt: new Date("2024-02-20"),
    updatedAt: new Date("2024-06-10"),
    lastStockUpdate: new Date("2024-06-10"),
  },
  {
    _id: "64c8b2e1f123456789abcde4",
    name: "Multivitamin Capsules",
    company: "Himalaya",
    price: 350.0,
    originalPrice: 380.0,
    stock: 120,
    category: "Supplements",
    description:
      "Complete multivitamin and mineral supplement for daily health support.",
    benefits:
      "• Complete nutrition support\n• Boosts energy levels\n• Supports immune system\n• Natural herbal formula",
    usage: "Take 1 capsule daily with water after breakfast.",
    weight: "30 capsules",
    images: [
      "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjMjhhNzQ1Ii8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtc2l6ZT0iMTgiIGZpbGw9IndoaXRlIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBkeT0iLjNlbSI+TXVsdGl2aXRhbWluPC90ZXh0Pjwvc3ZnPg==",
    ],
    isActive: true,
    isFeatured: true,
    rating: { average: 4.4, count: 167 },
    sales: 280,
    views: 1100,
    createdAt: new Date("2024-01-30"),
    updatedAt: new Date("2024-06-25"),
    lastStockUpdate: new Date("2024-06-25"),
  },
];

class ProductsController {
  // Get all products with filtering, sorting, and pagination
  async getAllProducts(req, res) {
    try {
      // Check if database is connected
      if (!global.DB_CONNECTED) {
        return this.handleOfflineProducts(req, res);
      }

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
      // Fallback to offline mode if database fails
      return this.handleOfflineProducts(req, res);
    }
  }

  // Handle products when database is offline
  handleOfflineProducts(req, res) {
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

      let filteredProducts = [...sampleProducts];

      // Apply filters
      if (category) {
        filteredProducts = filteredProducts.filter(
          (p) => p.category === category,
        );
      }
      if (brand) {
        filteredProducts = filteredProducts.filter((p) =>
          p.company.toLowerCase().includes(brand.toLowerCase()),
        );
      }
      if (featured !== undefined) {
        filteredProducts = filteredProducts.filter(
          (p) => p.isFeatured === (featured === "true"),
        );
      }
      if (minPrice || maxPrice) {
        filteredProducts = filteredProducts.filter((p) => {
          const price = p.price;
          return (
            (!minPrice || price >= parseFloat(minPrice)) &&
            (!maxPrice || price <= parseFloat(maxPrice))
          );
        });
      }
      if (q) {
        const query = q.toLowerCase();
        filteredProducts = filteredProducts.filter(
          (p) =>
            p.name.toLowerCase().includes(query) ||
            p.company.toLowerCase().includes(query) ||
            p.description.toLowerCase().includes(query),
        );
      }

      // Apply sorting
      filteredProducts.sort((a, b) => {
        const aVal =
          sort === "price" ? a.price : new Date(a[sort] || a.createdAt);
        const bVal =
          sort === "price" ? b.price : new Date(b[sort] || b.createdAt);
        return order === "desc" ? (bVal > aVal ? 1 : -1) : aVal > bVal ? 1 : -1;
      });

      // Apply pagination
      const totalProducts = filteredProducts.length;
      const skip = (parseInt(page) - 1) * parseInt(limit);
      const paginatedProducts = filteredProducts.slice(
        skip,
        skip + parseInt(limit),
      );

      const totalPages = Math.ceil(totalProducts / limit);
      const hasNextPage = page < totalPages;
      const hasPrevPage = page > 1;

      res.json({
        success: true,
        data: paginatedProducts,
        pagination: {
          currentPage: parseInt(page),
          totalPages,
          totalProducts,
          hasNextPage,
          hasPrevPage,
          limit: parseInt(limit),
        },
        offline: true,
      });
    } catch (error) {
      console.error("Offline products error:", error);
      res.status(500).json({
        success: false,
        message: "Failed to fetch products (offline mode)",
        error: error.message,
      });
    }
  }

  // Get all product categories with counts
  async getCategories(req, res) {
    try {
      if (!global.DB_CONNECTED) {
        // Offline category data
        const categories = {};
        sampleProducts.forEach((product) => {
          if (!categories[product.category]) {
            categories[product.category] = { count: 0, prices: [] };
          }
          categories[product.category].count++;
          categories[product.category].prices.push(product.price);
        });

        const categoryData = Object.entries(categories)
          .map(([category, data]) => ({
            _id: category,
            count: data.count,
            avgPrice:
              data.prices.reduce((a, b) => a + b, 0) / data.prices.length,
            minPrice: Math.min(...data.prices),
            maxPrice: Math.max(...data.prices),
          }))
          .sort((a, b) => b.count - a.count);

        return res.json({
          success: true,
          data: categoryData,
          offline: true,
        });
      }

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
      // Fallback to offline mode
      const categories = {};
      sampleProducts.forEach((product) => {
        if (!categories[product.category]) {
          categories[product.category] = { count: 0, prices: [] };
        }
        categories[product.category].count++;
        categories[product.category].prices.push(product.price);
      });

      const categoryData = Object.entries(categories)
        .map(([category, data]) => ({
          _id: category,
          count: data.count,
          avgPrice: data.prices.reduce((a, b) => a + b, 0) / data.prices.length,
          minPrice: Math.min(...data.prices),
          maxPrice: Math.max(...data.prices),
        }))
        .sort((a, b) => b.count - a.count);

      res.json({
        success: true,
        data: categoryData,
        offline: true,
      });
    }
  }

  // Get featured products
  async getFeaturedProducts(req, res) {
    try {
      if (!global.DB_CONNECTED) {
        const featuredProducts = sampleProducts
          .filter((p) => p.isActive && p.isFeatured)
          .sort((a, b) => b.sales - a.sales)
          .slice(0, 8);

        return res.json({
          success: true,
          data: featuredProducts,
          offline: true,
        });
      }

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
      // Fallback to offline mode
      const featuredProducts = sampleProducts
        .filter((p) => p.isActive && p.isFeatured)
        .sort((a, b) => b.sales - a.sales)
        .slice(0, 8);

      res.json({
        success: true,
        data: featuredProducts,
        offline: true,
      });
    }
  }

  // Get search suggestions
  async getSearchSuggestions(req, res) {
    try {
      const { q } = req.query;

      if (!q || q.length < 2) {
        return res.json({
          success: true,
          data: [],
        });
      }

      if (!global.DB_CONNECTED) {
        const query = q.toLowerCase();
        const suggestions = sampleProducts
          .filter(
            (product) =>
              product.isActive &&
              (product.name.toLowerCase().includes(query) ||
                product.company.toLowerCase().includes(query) ||
                product.category.toLowerCase().includes(query)),
          )
          .slice(0, 10)
          .map((product) => ({
            _id: product._id,
            name: product.name,
            brand: product.company,
            category: product.category,
          }));

        return res.json({
          success: true,
          data: suggestions,
          offline: true,
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
      // Fallback to offline mode
      const query = req.query.q?.toLowerCase() || "";
      const suggestions = sampleProducts
        .filter(
          (product) =>
            product.isActive &&
            (product.name.toLowerCase().includes(query) ||
              product.company.toLowerCase().includes(query) ||
              product.category.toLowerCase().includes(query)),
        )
        .slice(0, 10)
        .map((product) => ({
          _id: product._id,
          name: product.name,
          brand: product.company,
          category: product.category,
        }));

      res.json({
        success: true,
        data: suggestions,
        offline: true,
      });
    }
  }

  // Get single product
  async getProduct(req, res) {
    try {
      if (!global.DB_CONNECTED) {
        const product = sampleProducts.find((p) => p._id === req.params.id);

        if (!product) {
          return res.status(404).json({
            success: false,
            message: "Product not found",
          });
        }

        // Get related products
        const relatedProducts = sampleProducts
          .filter(
            (p) =>
              p.category === product.category &&
              p._id !== product._id &&
              p.isActive,
          )
          .slice(0, 4)
          .map((p) => ({
            _id: p._id,
            name: p.name,
            price: p.price,
            originalPrice: p.originalPrice,
            images: p.images,
            rating: p.rating,
          }));

        return res.json({
          success: true,
          data: {
            product,
            relatedProducts,
          },
          offline: true,
        });
      }

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
      // Fallback to offline mode
      const product = sampleProducts.find((p) => p._id === req.params.id);

      if (!product) {
        return res.status(404).json({
          success: false,
          message: "Product not found",
        });
      }

      const relatedProducts = sampleProducts
        .filter(
          (p) =>
            p.category === product.category &&
            p._id !== product._id &&
            p.isActive,
        )
        .slice(0, 4)
        .map((p) => ({
          _id: p._id,
          name: p.name,
          price: p.price,
          originalPrice: p.originalPrice,
          images: p.images,
          rating: p.rating,
        }));

      res.json({
        success: true,
        data: {
          product,
          relatedProducts,
        },
        offline: true,
      });
    }
  }

  // Create new product
  async createProduct(req, res) {
    try {
      if (!global.DB_CONNECTED) {
        // In offline mode, simulate product creation
        const newProduct = {
          _id: `offline_${Date.now()}`,
          ...req.body,
          createdBy: req.user?.id || "offline_user",
          createdAt: new Date(),
          updatedAt: new Date(),
          isActive: true,
          rating: { average: 0, count: 0 },
          sales: 0,
          views: 0,
        };

        // Add to sample products (in-memory)
        sampleProducts.push(newProduct);

        // Emit real-time update
        const io = req.app.get("io");
        if (io) {
          io.to("admin-room").emit("product-created", {
            product: {
              id: newProduct._id,
              name: newProduct.name,
              category: newProduct.category,
              price: newProduct.price,
              stock: newProduct.stock,
              createdAt: newProduct.createdAt,
            },
          });
        }

        return res.status(201).json({
          success: true,
          message: "Product created successfully (offline mode)",
          data: newProduct,
          offline: true,
        });
      }

      const productData = {
        ...req.body,
        createdBy: req.user.id,
      };

      const product = new Product(productData);
      await product.save();

      // Emit real-time update
      const io = req.app.get("io");
      if (io) {
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
      }

      res.status(201).json({
        success: true,
        message: "Product created successfully",
        data: product,
      });
    } catch (error) {
      console.error("Create product error:", error);
      // Fallback to offline mode
      const newProduct = {
        _id: `offline_${Date.now()}`,
        ...req.body,
        createdBy: req.user?.id || "offline_user",
        createdAt: new Date(),
        updatedAt: new Date(),
        isActive: true,
        rating: { average: 0, count: 0 },
        sales: 0,
        views: 0,
      };

      sampleProducts.push(newProduct);

      res.status(201).json({
        success: true,
        message: "Product created successfully (offline mode)",
        data: newProduct,
        offline: true,
      });
    }
  }

  // Update product
  async updateProduct(req, res) {
    try {
      if (!global.DB_CONNECTED) {
        const productIndex = sampleProducts.findIndex(
          (p) => p._id === req.params.id,
        );

        if (productIndex === -1) {
          return res.status(404).json({
            success: false,
            message: "Product not found",
          });
        }

        // Update product in memory
        sampleProducts[productIndex] = {
          ...sampleProducts[productIndex],
          ...req.body,
          updatedAt: new Date(),
        };

        const updatedProduct = sampleProducts[productIndex];

        // Emit real-time update
        const io = req.app.get("io");
        if (io) {
          io.to("admin-room").emit("product-updated", {
            product: {
              id: updatedProduct._id,
              name: updatedProduct.name,
              category: updatedProduct.category,
              price: updatedProduct.price,
              stock: updatedProduct.stock,
              updatedAt: updatedProduct.updatedAt,
            },
          });
        }

        return res.json({
          success: true,
          message: "Product updated successfully (offline mode)",
          data: updatedProduct,
          offline: true,
        });
      }

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
      if (io) {
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
      }

      res.json({
        success: true,
        message: "Product updated successfully",
        data: product,
      });
    } catch (error) {
      console.error("Update product error:", error);
      // Fallback to offline mode
      const productIndex = sampleProducts.findIndex(
        (p) => p._id === req.params.id,
      );

      if (productIndex === -1) {
        return res.status(404).json({
          success: false,
          message: "Product not found",
        });
      }

      sampleProducts[productIndex] = {
        ...sampleProducts[productIndex],
        ...req.body,
        updatedAt: new Date(),
      };

      res.json({
        success: true,
        message: "Product updated successfully (offline mode)",
        data: sampleProducts[productIndex],
        offline: true,
      });
    }
  }

  // Update product stock
  async updateStock(req, res) {
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
  }

  // Delete product (soft delete)
  async deleteProduct(req, res) {
    try {
      if (!global.DB_CONNECTED) {
        const productIndex = sampleProducts.findIndex(
          (p) => p._id === req.params.id,
        );

        if (productIndex === -1) {
          return res.status(404).json({
            success: false,
            message: "Product not found",
          });
        }

        const productName = sampleProducts[productIndex].name;

        // Soft delete (set isActive to false)
        sampleProducts[productIndex].isActive = false;

        // Emit real-time update
        const io = req.app.get("io");
        if (io) {
          io.to("admin-room").emit("product-deleted", {
            productId: req.params.id,
            productName: productName,
          });
        }

        return res.json({
          success: true,
          message: "Product deleted successfully (offline mode)",
          offline: true,
        });
      }

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
      if (io) {
        io.to("admin-room").emit("product-deleted", {
          productId: product._id,
          productName: product.name,
        });
      }

      res.json({
        success: true,
        message: "Product deleted successfully",
      });
    } catch (error) {
      console.error("Delete product error:", error);
      // Fallback to offline mode
      const productIndex = sampleProducts.findIndex(
        (p) => p._id === req.params.id,
      );

      if (productIndex === -1) {
        return res.status(404).json({
          success: false,
          message: "Product not found",
        });
      }

      const productName = sampleProducts[productIndex].name;
      sampleProducts[productIndex].isActive = false;

      res.json({
        success: true,
        message: "Product deleted successfully (offline mode)",
        offline: true,
      });
    }
  }

  // Get products with low stock
  async getLowStockProducts(req, res) {
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
  }

  // Upload product images to database
  async uploadImages(req, res) {
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
  }

  // Delete specific product image
  async deleteImage(req, res) {
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
  }
}

const productsController = new ProductsController();

// Bind methods to maintain context
module.exports = {
  getAllProducts: productsController.getAllProducts.bind(productsController),
  getCategories: productsController.getCategories.bind(productsController),
  getFeaturedProducts:
    productsController.getFeaturedProducts.bind(productsController),
  getSearchSuggestions:
    productsController.getSearchSuggestions.bind(productsController),
  getLowStockProducts:
    productsController.getLowStockProducts.bind(productsController),
  getProduct: productsController.getProduct.bind(productsController),
  createProduct: productsController.createProduct.bind(productsController),
  updateProduct: productsController.updateProduct.bind(productsController),
  deleteProduct: productsController.deleteProduct.bind(productsController),
  updateStock: productsController.updateStock.bind(productsController),
  uploadImages: productsController.uploadImages.bind(productsController),
  deleteImage: productsController.deleteImage.bind(productsController),
};
