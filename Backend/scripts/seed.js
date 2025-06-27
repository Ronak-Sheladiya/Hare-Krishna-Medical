const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
require("dotenv").config();

const User = require("../models/User");
const Product = require("../models/Product");
const Order = require("../models/Order");
const Invoice = require("../models/Invoice");
const Message = require("../models/Message");
const Letterhead = require("../models/Letterhead");
const Verification = require("../models/Verification");

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
    console.log("✅ Connected to MongoDB for seeding");
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
        name: "Cough Syrup 100ml",
        shortDescription:
          "Natural ayurvedic cough syrup for dry and wet cough relief.",
        description:
          "Effective natural ayurvedic formula that relieves both dry and wet cough, soothes throat irritation, and is safe for all ages.",
        company: "Dabur",
        price: 95.0,
        originalPrice: 110.0,
        category: "Cough & Cold",
        weight: "100ml",
        stock: 65,
        minStack: 10,
        images: [
          "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZTc0YzNjIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtc2l6ZT0iMTgiIGZpbGw9IndoaXRlIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBkeT0iLjNlbSI+Q291Z2ggU3lydXA8L3RleHQ+PC9zdmc+",
        ],
        benefits:
          "• Relieves dry and wet cough\n• Natural ayurvedic formula\n• Soothes throat irritation\n• Safe for all ages",
        composition: "Honey, Tulsi extract, Ginger",
        usage:
          "Adults: 2 teaspoons 3 times daily. Children: 1 teaspoon 3 times daily.",
        sideEffects: "Generally safe. Discontinue if allergic reaction occurs.",
        contraindications: "Not recommended for children under 2 years.",
        batchNo: "CS2024003",
        mfgDate: new Date("2024-01-15"),
        expDate: new Date("2025-07-15"),
        tags: ["cough", "honey", "natural", "syrup"],
        isActive: true,
        isFeatured: false,
        rating: { average: 4.2, count: 156 },
        sales: 320,
        views: 950,
      },
      {
        name: "First Aid Kit",
        shortDescription:
          "Complete first aid kit for home and travel use with essential medical supplies.",
        description:
          "Comprehensive medical emergency kit with quality supplies for home and travel. Travel-friendly compact design with essential medical items.",
        company: "Johnson & Johnson",
        price: 450.0,
        originalPrice: 500.0,
        category: "First Aid",
        weight: "500g",
        stock: 25,
        minStack: 5,
        images: [
          "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZGMzNTQ1Ii8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtc2l6ZT0iMTgiIGZpbGw9IndoaXRlIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBkeT0iLjNlbSI+Rmlyc3QgQWlkPC90ZXh0Pjwvc3ZnPg==",
        ],
        benefits:
          "• Complete medical emergency kit\n• Travel-friendly compact size\n• Quality medical supplies\n• Essential for every home",
        composition:
          "Bandages, antiseptic, pain relief tablets, gauze, thermometer",
        usage:
          "Keep in easily accessible location. Check expiry dates regularly.",
        contraindications: "Check individual item expiry dates before use.",
        batchNo: "FA2024004",
        mfgDate: new Date("2024-03-01"),
        expDate: new Date("2027-03-01"),
        tags: ["first aid", "emergency", "medical", "supplies"],
        isActive: true,
        isFeatured: true,
        rating: { average: 4.6, count: 78 },
        sales: 120,
        views: 600,
      },
      {
        name: "Digital Thermometer",
        shortDescription:
          "Accurate digital thermometer with fast reading and fever alarm.",
        description:
          "High-precision digital thermometer with fast 60-second reading, ±0.1°C accuracy, fever alarm function, and memory for last reading.",
        company: "Omron",
        price: 280.0,
        originalPrice: 320.0,
        category: "Medical Devices",
        weight: "15g",
        stock: 45,
        minStack: 10,
        images: [
          "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjMDA3YmZmIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtc2l6ZT0iMTgiIGZpbGw9IndoaXRlIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBkeT0iLjNlbSI+VGhlcm1vbWV0ZXI8L3RleHQ+PC9zdmc+",
        ],
        benefits:
          "• Fast 60-second reading\n• High accuracy ±0.1°C\n• Fever alarm function\n• Memory for last reading",
        composition: "Digital sensor, LCD display, plastic body",
        usage: "Place under tongue, armpit, or rectally. Wait for beep signal.",
        contraindications:
          "Clean before and after each use. Replace battery when needed.",
        batchNo: "DT2024005",
        mfgDate: new Date("2024-02-10"),
        expDate: new Date("2029-02-10"),
        tags: ["thermometer", "digital", "temperature", "medical"],
        isActive: true,
        isFeatured: false,
        rating: { average: 4.8, count: 92 },
        sales: 85,
        views: 720,
      },
      {
        name: "Multivitamin Capsules",
        shortDescription:
          "Complete multivitamin and mineral supplement for daily health support.",
        description:
          "Comprehensive multivitamin formula with essential minerals for complete nutrition support. Natural herbal formula that boosts energy and supports immune system.",
        company: "Himalaya",
        price: 350.0,
        originalPrice: 380.0,
        category: "Supplements",
        weight: "30 capsules",
        stock: 120,
        minStack: 20,
        images: [
          "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjMjhhNzQ1Ii8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtc2l6ZT0iMTgiIGZpbGw9IndoaXRlIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBkeT0iLjNlbSI+TXVsdGl2aXRhbWluPC90ZXh0Pjwvc3ZnPg==",
        ],
        benefits:
          "• Complete nutrition support\n• Boosts energy levels\n• Supports immune system\n• Natural herbal formula",
        composition:
          "Vitamins A, B-complex, C, D, E, Minerals: Iron, Calcium, Zinc",
        usage: "Take 1 capsule daily with water after breakfast.",
        sideEffects: "May cause mild stomach upset if taken on empty stomach.",
        contraindications:
          "Consult doctor if pregnant, nursing or taking medications.",
        batchNo: "MV2024006",
        mfgDate: new Date("2024-01-20"),
        expDate: new Date("2026-01-20"),
        tags: ["multivitamin", "supplements", "nutrition", "health"],
        isActive: true,
        isFeatured: true,
        rating: { average: 4.4, count: 167 },
        sales: 280,
        views: 1100,
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
