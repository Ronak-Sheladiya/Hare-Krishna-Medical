const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

// Import models to ensure they're registered
const User = require("../models/User");
const Product = require("../models/Product");
const Order = require("../models/Order");
const Invoice = require("../models/Invoice");
const Message = require("../models/Message");
const Letterhead = require("../models/Letterhead");

/**
 * Initialize database with collections, indexes, and default data
 * This runs automatically when the server starts up
 */
const initializeDatabase = async () => {
  try {
    console.log("🚀 Initializing database...");

    // Check if database is already initialized
    const existingAdmin = await User.findOne({ role: "admin" });
    if (existingAdmin) {
      console.log("✅ Database already initialized");
      return;
    }

    console.log("🔧 Setting up collections and indexes...");

    // Create indexes for better performance
    await createIndexes();

    // Create default admin user
    await createDefaultAdmin();

    // Create default letterhead
    await createDefaultLetterhead();

    // Create sample product categories
    await createSampleProducts();

    console.log("✅ Database initialization completed successfully!");
  } catch (error) {
    console.error("❌ Database initialization failed:", error);
    throw error;
  }
};

/**
 * Create database indexes for better performance
 */
const createIndexes = async () => {
  try {
    // User indexes
    await User.collection.createIndex({ email: 1 }, { unique: true });
    await User.collection.createIndex({ role: 1 });
    await User.collection.createIndex({ isActive: 1 });
    await User.collection.createIndex({ createdAt: -1 });

    // Product indexes
    await Product.collection.createIndex({ name: "text", description: "text" });
    await Product.collection.createIndex({ category: 1 });
    await Product.collection.createIndex({ subCategory: 1 });
    await Product.collection.createIndex({ price: 1 });
    await Product.collection.createIndex({ isActive: 1 });
    await Product.collection.createIndex({ stockQuantity: 1 });
    await Product.collection.createIndex({ averageRating: -1 });
    await Product.collection.createIndex({ createdAt: -1 });

    // Order indexes
    await Order.collection.createIndex({ userId: 1 });
    await Order.collection.createIndex({ status: 1 });
    await Order.collection.createIndex({ orderDate: -1 });
    await Order.collection.createIndex({ totalAmount: 1 });

    // Invoice indexes
    await Invoice.collection.createIndex({ orderId: 1 });
    await Invoice.collection.createIndex(
      { invoiceNumber: 1 },
      { unique: true },
    );
    await Invoice.collection.createIndex({ issuedAt: -1 });

    // Message indexes
    await Message.collection.createIndex({ userId: 1 });
    await Message.collection.createIndex({ isRead: 1 });
    await Message.collection.createIndex({ createdAt: -1 });

    // Letterhead indexes
    await Letterhead.collection.createIndex({ name: 1 });
    await Letterhead.collection.createIndex({ isDefault: 1 });

    console.log("📊 Database indexes created");
  } catch (error) {
    console.warn("⚠️ Some indexes may already exist:", error.message);
  }
};

/**
 * Create default admin user
 */
const createDefaultAdmin = async () => {
  try {
    const adminExists = await User.findOne({ role: "admin" });
    if (adminExists) {
      console.log("👨‍💼 Admin user already exists");
      return;
    }

    const adminUser = new User({
      fullName: process.env.ADMIN_NAME || "Admin User",
      email: process.env.ADMIN_EMAIL || "admin@harekrishnamedical.com",
      password: process.env.ADMIN_PASSWORD || "admin123",
      role: "admin",
      isVerified: true,
      isActive: true,
      address: {
        street: "123 Medical Street",
        city: "Healthcare City",
        state: "Medical State",
        zipCode: "12345",
        country: "India",
      },
      phone: "+91 9876543210",
    });

    await adminUser.save();
    console.log(`👨‍💼 Admin user created: ${adminUser.email}`);
  } catch (error) {
    console.error("❌ Failed to create admin user:", error);
  }
};

/**
 * Create default letterhead for invoices
 */
const createDefaultLetterhead = async () => {
  try {
    const letterheadExists = await Letterhead.findOne({ isDefault: true });
    if (letterheadExists) {
      console.log("📄 Default letterhead already exists");
      return;
    }

    // Get the admin user to set as createdBy
    const adminUser = await User.findOne({ role: "admin" });
    if (!adminUser) {
      console.log("⚠️ Admin user not found, skipping letterhead creation");
      return;
    }

    const defaultLetterhead = new Letterhead({
      name: "Default Letterhead",
      description: "Default company letterhead for invoices and documents",
      companyInfo: {
        name: "Hare Krishna Medical Store",
        address: {
          street: "123 Medical Street",
          city: "Healthcare City",
          state: "Gujarat",
          pincode: "123456",
          country: "India",
        },
        contact: {
          phone: "+91 9876543210",
          email: "info@harekrishnamedical.com",
          website: "https://harekrishnamedical.vercel.app",
        },
        registration: {
          gst: "24XXXXX1234X1ZX",
          licenseNumber: "MED123456",
        },
      },
      logo: {
        url: "https://cdn.builder.io/api/v1/assets/030c65a34d11492ab1cc545443b12540/hk-e0ec29?format=webp&width=800",
        width: 100,
        height: 100,
        position: "left",
      },
      isDefault: true,
      createdBy: adminUser._id,
    });

    await defaultLetterhead.save();
    console.log("📄 Default letterhead created");
  } catch (error) {
    console.error("❌ Failed to create default letterhead:", error);
  }
};

/**
 * Create sample products for demonstration
 */
const createSampleProducts = async () => {
  try {
    const productExists = await Product.findOne();
    if (productExists) {
      console.log("🏥 Sample products already exist");
      return;
    }

    // Get the admin user to set as createdBy
    const adminUser = await User.findOne({ role: "admin" });
    if (!adminUser) {
      console.log("⚠️ Admin user not found, skipping product creation");
      return;
    }

    const sampleProducts = [
      {
        name: "Paracetamol 500mg",
        company: "PharmaCorp",
        description: "Pain reliever and fever reducer tablets",
        category: "Pain Relief",
        price: 25.0,
        originalPrice: 30.0,
        stock: 100,
        batchNo: "PCM001",
        expDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000), // 1 year from now
        isActive: true,
        isFeatured: true,
        tags: ["paracetamol", "fever", "pain", "headache"],
        images: [
          {
            url: "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=300&h=300&fit=crop",
            alt: "Paracetamol tablets",
            isPrimary: true,
          },
        ],
        createdBy: adminUser._id,
      },
      {
        name: "Amoxicillin 250mg",
        company: "MediCare",
        description: "Antibiotic capsules for bacterial infections",
        category: "Antibiotics",
        price: 85.0,
        originalPrice: 95.0,
        stock: 50,
        batchNo: "AMX001",
        expDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000),
        isActive: true,
        tags: ["antibiotic", "infection", "bacterial"],
        images: [
          {
            url: "https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=300&h=300&fit=crop",
            alt: "Amoxicillin capsules",
            isPrimary: true,
          },
        ],
        createdBy: adminUser._id,
      },
      {
        name: "Vitamin D3 Tablets",
        company: "HealthPlus",
        description: "Vitamin D3 supplement for bone health",
        category: "Supplements",
        price: 120.0,
        stock: 75,
        batchNo: "VD3001",
        expDate: new Date(Date.now() + 2 * 365 * 24 * 60 * 60 * 1000), // 2 years
        isActive: true,
        isFeatured: true,
        tags: ["vitamin", "bone health", "supplement", "d3"],
        images: [
          {
            url: "https://images.unsplash.com/photo-1550572017-4414ea87ac19?w=300&h=300&fit=crop",
            alt: "Vitamin D3 tablets",
            isPrimary: true,
          },
        ],
        createdBy: adminUser._id,
      },
      {
        name: "Cough Syrup",
        company: "CoughCare",
        description: "Effective cough relief syrup for dry and wet cough",
        category: "Cough & Cold",
        price: 65.0,
        stock: 30,
        batchNo: "CS001",
        expDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000),
        isActive: true,
        tags: ["cough", "syrup", "cold", "throat"],
        images: [
          {
            url: "https://images.unsplash.com/photo-1576602976047-174e57a47881?w=300&h=300&fit=crop",
            alt: "Cough syrup bottle",
            isPrimary: true,
          },
        ],
        createdBy: adminUser._id,
      },
      {
        name: "Antiseptic Cream",
        company: "WoundHeal",
        description: "Topical antiseptic cream for wound care",
        category: "First Aid",
        price: 45.0,
        stock: 40,
        batchNo: "AC001",
        expDate: new Date(Date.now() + 18 * 30 * 24 * 60 * 60 * 1000), // 18 months
        isActive: true,
        tags: ["antiseptic", "wound", "cream", "topical"],
        images: [
          {
            url: "https://images.unsplash.com/photo-1585435557343-3b092031d8ab?w=300&h=300&fit=crop",
            alt: "Antiseptic cream tube",
            isPrimary: true,
          },
        ],
        createdBy: adminUser._id,
      },
    ];

    await Product.insertMany(sampleProducts);
    console.log(`🏥 Created ${sampleProducts.length} sample products`);
  } catch (error) {
    console.error("❌ Failed to create sample products:", error);
  }
};

/**
 * Check database health and connection
 */
const checkDatabaseHealth = async () => {
  try {
    // Check connection
    const isConnected = mongoose.connection.readyState === 1;
    if (!isConnected) {
      throw new Error("Database not connected");
    }

    // Check collections exist
    const collections = await mongoose.connection.db
      .listCollections()
      .toArray();
    const collectionNames = collections.map((col) => col.name);

    console.log("📊 Database Status:");
    console.log(
      `  Connection: ${isConnected ? "✅ Connected" : "❌ Disconnected"}`,
    );
    console.log(`  Collections: ${collectionNames.length} found`);
    console.log(`  Collections: ${collectionNames.join(", ")}`);

    // Check record counts
    const userCount = await User.countDocuments();
    const productCount = await Product.countDocuments();
    const orderCount = await Order.countDocuments();

    console.log("📈 Record Counts:");
    console.log(`  Users: ${userCount}`);
    console.log(`  Products: ${productCount}`);
    console.log(`  Orders: ${orderCount}`);

    return true;
  } catch (error) {
    console.error("❌ Database health check failed:", error);
    return false;
  }
};

module.exports = {
  initializeDatabase,
  createIndexes,
  createDefaultAdmin,
  createDefaultLetterhead,
  createSampleProducts,
  checkDatabaseHealth,
};
