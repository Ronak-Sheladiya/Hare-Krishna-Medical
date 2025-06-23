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
        email: "ronaksheladiya652@gmail.com",
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
        email: "mayurgajera097@gmail.com",
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
        description:
          "Effective pain relief and fever reducer. Used for headaches, muscle aches, and fever.",
        price: 25.99,
        mrp: 30.0,
        discount: 13,
        category: "Medicine",
        subCategory: "Pain Relief",
        brand: "Hare Krishna Pharma",
        stock: 150,
        minStock: 20,
        images: [
          {
            url: "https://via.placeholder.com/400x400?text=Paracetamol",
            alt: "Paracetamol Tablets",
          },
        ],
        specifications: {
          composition: "Paracetamol 500mg",
          dosage: "1-2 tablets every 4-6 hours",
          manufacturer: "Hare Krishna Pharmaceuticals",
          expiryMonths: 36,
        },
        tags: ["pain relief", "fever", "headache", "tablets"],
        isFeatured: true,
        sales: 245,
      },
      {
        name: "Vitamin D3 Capsules",
        description:
          "Essential vitamin D3 supplement for bone health and immunity support.",
        price: 45.5,
        mrp: 55.0,
        discount: 17,
        category: "Supplements",
        subCategory: "Vitamins",
        brand: "Health Plus",
        stock: 89,
        minStock: 15,
        images: [
          {
            url: "https://via.placeholder.com/400x400?text=Vitamin+D3",
            alt: "Vitamin D3 Capsules",
          },
        ],
        specifications: {
          composition: "Cholecalciferol 60,000 IU",
          dosage: "One capsule weekly",
          manufacturer: "Health Plus Industries",
          expiryMonths: 24,
        },
        tags: ["vitamin", "immunity", "bone health", "supplements"],
        isFeatured: true,
        sales: 156,
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

    await connectDB();

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

    console.log("\n👤 Test User Credentials:");
    console.log("   Email: john@example.com");
    console.log("   Password: user123");

    process.exit(0);
  } catch (error) {
    console.error("❌ Database seeding failed:", error);
    process.exit(1);
  }
};

// Run seeding if this script is executed directly
if (require.main === module) {
  seedDatabase();
}

module.exports = { seedDatabase };
