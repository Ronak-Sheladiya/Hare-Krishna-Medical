const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
require("dotenv").config();

const User = require("../models/User");
const Product = require("../models/Product");
const Order = require("../models/Order");
const Invoice = require("../models/Invoice");

const connectDB = async () => {
  try {
    await mongoose.connect(
      process.env.MONGODB_URI ||
        "mongodb://localhost:27017/hare-krishna-medical",
      {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      },
    );
    console.log("�� Connected to MongoDB for seeding");
  } catch (error) {
    console.error("❌ MongoDB connection failed:", error.message);
    process.exit(1);
  }
};

const seedUsers = async () => {
  try {
    await User.deleteMany({});

    const users = [
      {
        fullName: "Admin User",
        email: "admin@harekrishnamedical.com",
        mobile: "7698913354",
        password: "admin123",
        role: 1,
        isActive: true,
        emailVerified: true,
        address: {
          street: "3 Sahyog Complex",
          city: "Surat",
          state: "Gujarat",
          pincode: "394107",
        },
      },
      {
        fullName: "Ronak Sheladiya",
        email: "ronaksheladiya62@gmail.com",
        mobile: "9876543211",
        password: "admin@123",
        role: 1,
        isActive: true,
        emailVerified: true,
        address: {
          street: "Admin Complex",
          city: "Surat",
          state: "Gujarat",
          pincode: "394107",
        },
      },
      {
        fullName: "Mayur Gajera",
        email: "mayurgajera098@gmail.com",
        mobile: "9876543212",
        password: "admin@123",
        role: 1,
        isActive: true,
        emailVerified: true,
        address: {
          street: "Admin Complex",
          city: "Surat",
          state: "Gujarat",
          pincode: "394107",
        },
      },
      {
        fullName: "John Smith",
        email: "john@example.com",
        mobile: "9876543210",
        password: "user123",
        role: 0,
        isActive: true,
        emailVerified: true,
        address: {
          street: "123 Main Street",
          city: "Surat",
          state: "Gujarat",
          pincode: "395007",
        },
      },
      {
        fullName: "Jane Doe",
        email: "jane@example.com",
        mobile: "9123456789",
        password: "user123",
        role: 0,
        isActive: true,
        emailVerified: true,
        address: {
          street: "456 Oak Avenue",
          city: "Ahmedabad",
          state: "Gujarat",
          pincode: "380001",
        },
      },
    ];

    const createdUsers = await User.insertMany(users);
    console.log(`✅ ${createdUsers.length} users created`);
    return createdUsers;
  } catch (error) {
    console.error("❌ Error seeding users:", error);
  }
};

const seedProducts = async () => {
  try {
    await Product.deleteMany({});

    const products = [
      {
        name: "Paracetamol Tablets 500mg",
        shortDescription:
          "Fast-acting pain relief and fever reducer for adults and children over 12 years.",
        description:
          "Effective pain relief and fever reducer suitable for adults and children over 12 years. Gentle on stomach with proven efficacy for headaches, muscle aches, and fever.",
        company: "Cipla",
        price: 25.5,
        originalPrice: 30.0,
        category: "Pain Relief",
        weight: "500mg",
        stock: 150,
        minStock: 20,
        images: [
          "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZGRkZGRkIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtc2l6ZT0iMTgiIGZpbGw9IiM5OTk5OTkiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGR5PSIuM2VtIj5QYXJhY2V0YW1vbDwvdGV4dD48L3N2Zz4=",
        ],
        benefits:
          "• Fast-acting pain relief\n• Reduces fever effectively\n• Safe for regular use\n• Gentle on stomach",
        composition: "Paracetamol 500mg",
        usage:
          "Take 1-2 tablets every 4-6 hours as needed. Do not exceed 8 tablets in 24 hours.",
        sideEffects: "Rare: Nausea, skin rash. Stop use if symptoms occur.",
        contraindications:
          "Avoid if allergic to paracetamol. Consult doctor if pregnant or breastfeeding.",
        batchNo: "PCT2024001",
        mfgDate: new Date("2024-01-01"),
        expDate: new Date("2027-01-01"),
        tags: ["pain relief", "fever", "headache", "tablets"],
        isActive: true,
        isFeatured: true,
        rating: { average: 4.5, count: 125 },
        sales: 250,
        views: 1200,
      },
      {
        name: "Vitamin D3 Capsules",
        shortDescription:
          "Essential vitamin D3 supplement for bone health and immunity support.",
        description:
          "High potency vitamin D3 supplement that supports bone and teeth health, boosts immune system, and helps calcium absorption.",
        company: "Sun Pharma",
        price: 180.0,
        originalPrice: 200.0,
        category: "Vitamins",
        weight: "60000 IU",
        stock: 85,
        minStock: 15,
        images: [
          "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZmZlNTAwIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtc2l6ZT0iMTgiIGZpbGw9IiM2NjY2NjYiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGR5PSIuM2VtIj5WaXRhbWluIEQzPC90ZXh0Pjwvc3ZnPg==",
        ],
        benefits:
          "• Supports bone and teeth health\n• Boosts immune system\n• Helps calcium absorption\n• Prevents vitamin D deficiency",
        composition: "Cholecalciferol 60,000 IU",
        usage: "Take 1 tablet daily with water, preferably after meals.",
        sideEffects: "Rare: Nausea, headache if overdosed.",
        contraindications:
          "Do not exceed recommended dose. Consult doctor if taking other medications.",
        batchNo: "VD32024002",
        mfgDate: new Date("2024-02-01"),
        expDate: new Date("2026-02-01"),
        tags: ["vitamin", "immunity", "bone health", "supplements"],
        isActive: true,
        isFeatured: true,
        rating: { average: 4.7, count: 89 },
        sales: 190,
        views: 800,
      },
      {
        name: "Cough Syrup with Honey",
        description:
          "Natural cough syrup with honey for dry and wet cough relief.",
        price: 35.75,
        mrp: 42.0,
        discount: 15,
        category: "Medicine",
        subCategory: "Cough & Cold",
        brand: "Wellness Care",
        stock: 76,
        minStock: 10,
        images: [
          {
            url: "https://via.placeholder.com/400x400?text=Cough+Syrup",
            alt: "Cough Syrup",
          },
        ],
        specifications: {
          composition: "Honey, Tulsi extract, Ginger",
          dosage: "2 teaspoons twice daily",
          manufacturer: "Wellness Care Ltd",
          expiryMonths: 18,
        },
        tags: ["cough", "honey", "natural", "syrup"],
        sales: 98,
      },
      {
        name: "Hand Sanitizer 500ml",
        description:
          "70% alcohol-based hand sanitizer for effective germ protection.",
        price: 89.0,
        mrp: 99.0,
        discount: 10,
        category: "Personal Care",
        subCategory: "Hygiene",
        brand: "SafeGuard",
        stock: 234,
        minStock: 50,
        images: [
          {
            url: "https://via.placeholder.com/400x400?text=Hand+Sanitizer",
            alt: "Hand Sanitizer",
          },
        ],
        specifications: {
          composition: "70% Isopropyl Alcohol",
          manufacturer: "SafeGuard Personal Care",
          expiryMonths: 36,
        },
        tags: ["sanitizer", "hygiene", "protection", "alcohol"],
        isFeatured: true,
        sales: 312,
      },
      {
        name: "Baby Diaper Size M (Pack of 40)",
        description:
          "Soft and comfortable baby diapers with 12-hour protection.",
        price: 299.0,
        mrp: 349.0,
        discount: 14,
        category: "Baby Care",
        subCategory: "Diapers",
        brand: "Little Angels",
        stock: 145,
        minStock: 25,
        images: [
          {
            url: "https://via.placeholder.com/400x400?text=Baby+Diaper",
            alt: "Baby Diapers",
          },
        ],
        specifications: {
          weight: "6-11 kg",
          count: "40 pieces",
          manufacturer: "Little Angels Baby Care",
        },
        tags: ["baby", "diaper", "comfort", "protection"],
        sales: 87,
      },
      {
        name: "Ayurvedic Chyawanprash",
        description:
          "Traditional Ayurvedic immunity booster with herbs and spices.",
        price: 185.0,
        mrp: 220.0,
        discount: 16,
        category: "Ayurvedic",
        subCategory: "Immunity",
        brand: "Herbal Wellness",
        stock: 67,
        minStock: 12,
        images: [
          {
            url: "https://via.placeholder.com/400x400?text=Chyawanprash",
            alt: "Chyawanprash",
          },
        ],
        specifications: {
          composition: "Amla, Ashwagandha, Giloy, Honey",
          dosage: "1 teaspoon twice daily",
          manufacturer: "Herbal Wellness Pvt Ltd",
          expiryMonths: 24,
        },
        tags: ["ayurvedic", "immunity", "herbal", "chyawanprash"],
        isFeatured: true,
        sales: 203,
      },
    ];

    const createdProducts = await Product.insertMany(products);
    console.log(`✅ ${createdProducts.length} products created`);
    return createdProducts;
  } catch (error) {
    console.error("❌ Error seeding products:", error);
  }
};

const seedOrders = async (users, products) => {
  try {
    await Order.deleteMany({});
    await Invoice.deleteMany({});

    const orders = [
      {
        user: users[1]._id, // John Smith
        items: [
          {
            product: products[0]._id,
            name: products[0].name,
            price: products[0].price,
            mrp: products[0].mrp,
            quantity: 2,
            total: products[0].price * 2,
            image: products[0].images[0]?.url,
          },
          {
            product: products[1]._id,
            name: products[1].name,
            price: products[1].price,
            mrp: products[1].mrp,
            quantity: 1,
            total: products[1].price * 1,
            image: products[1].images[0]?.url,
          },
        ],
        shippingAddress: {
          fullName: "John Smith",
          mobile: "9876543210",
          email: "john@example.com",
          address: "123 Main Street",
          city: "Surat",
          state: "Gujarat",
          pincode: "395007",
        },
        orderStatus: "Delivered",
        paymentMethod: "Online",
        paymentStatus: "Completed",
        createdAt: new Date("2024-01-15"),
        actualDeliveryDate: new Date("2024-01-17"),
      },
      {
        user: users[2]._id, // Jane Doe
        items: [
          {
            product: products[2]._id,
            name: products[2].name,
            price: products[2].price,
            mrp: products[2].mrp,
            quantity: 1,
            total: products[2].price * 1,
            image: products[2].images[0]?.url,
          },
        ],
        shippingAddress: {
          fullName: "Jane Doe",
          mobile: "9123456789",
          email: "jane@example.com",
          address: "456 Oak Avenue",
          city: "Ahmedabad",
          state: "Gujarat",
          pincode: "380001",
        },
        orderStatus: "Pending",
        paymentMethod: "COD",
        paymentStatus: "Pending",
        createdAt: new Date("2024-01-14"),
      },
    ];

    const createdOrders = await Order.insertMany(orders);
    console.log(`✅ ${createdOrders.length} orders created`);

    // Create invoices for orders
    const invoices = createdOrders.map((order) => ({
      order: order._id,
      user: order.user,
      items: order.items,
      customerDetails: order.shippingAddress,
      subtotal: order.subtotal,
      tax: order.tax,
      shipping: order.shippingCharges,
      total: order.total,
      paymentMethod: order.paymentMethod,
      paymentStatus: order.paymentStatus,
      status: order.orderStatus === "Delivered" ? "Paid" : "Sent",
    }));

    const createdInvoices = await Invoice.insertMany(invoices);
    console.log(`✅ ${createdInvoices.length} invoices created`);

    // Update orders with invoice references
    for (let i = 0; i < createdOrders.length; i++) {
      createdOrders[i].invoice = createdInvoices[i]._id;
      await createdOrders[i].save();
    }

    return { orders: createdOrders, invoices: createdInvoices };
  } catch (error) {
    console.error("❌ Error seeding orders:", error);
  }
};

const seedDatabase = async () => {
  try {
    console.log("🌱 Starting database seeding...");

    // Only connect if not already connected (when called from server.js)
    if (mongoose.connection.readyState !== 1) {
      await connectDB();
    }

    const users = await seedUsers();
    const products = await seedProducts();
    const { orders, invoices } = await seedOrders(users, products);

    console.log("✅ Database seeding completed successfully!");
    console.log(`📊 Summary:`);
    console.log(`   - Users: ${users.length}`);
    console.log(`   - Products: ${products.length}`);
    console.log(`   - Orders: ${orders.length}`);
    console.log(`   - Invoices: ${invoices.length}`);

    console.log("\n🔐 Admin Login Credentials:");
    console.log("   Email: admin@harekrishnamedical.com");
    console.log("   Password: admin123");
    console.log("   Email: ronaksheladiya62@gmail.com");
    console.log("   Password: admin@123");
    console.log("   Email: mayurgajera098@gmail.com");
    console.log("   Password: admin@123");

    console.log("\n👤 Test User Credentials:");
    console.log("   Email: john@example.com");
    console.log("   Password: user123");

    // Only exit if called directly, not when imported
    if (require.main === module) {
      process.exit(0);
    }

    return { users, products, orders, invoices };
  } catch (error) {
    console.error("❌ Database seeding failed:", error);
    if (require.main === module) {
      process.exit(1);
    }
    throw error;
  }
};

// Run seeding if this script is executed directly
if (require.main === module) {
  seedDatabase();
}

module.exports = { seedDatabase };
