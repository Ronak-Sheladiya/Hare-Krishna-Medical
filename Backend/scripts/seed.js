// ✅ Fixed `scripts/seed.js` to avoid validation errors and improve data consistency

const mongoose = require("mongoose");
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
        "mongodb+srv://ronaksheladiya652:Ronak95865@cluster0.loaubzp.mongodb.net/Hare_Krishna_Medical_db?retryWrites=true&w=majority&appName=Cluster0",
      {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      }
    );
    console.log("✅ Connected to MongoDB for seeding");
  } catch (error) {
    console.error("❌ MongoDB connection failed:", error.message);
    process.exit(1);
  }
};

const hashPasswords = async (users) => {
  for (const user of users) {
    user.password = await require("bcryptjs").hash(user.password, 10);
  }
};

const seedUsers = async () => {
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
  await hashPasswords(users);
  const createdUsers = await User.insertMany(users);
  console.log(`✅ ${createdUsers.length} users created`);
  return createdUsers;
};

const seedProducts = async () => {
  await Product.deleteMany({});
  const products = [
    {
      name: "Paracetamol 500mg",
      description: "Pain reliever and fever reducer",
      category: "Tablet",
      price: 20,
      stock: 100,
      minStock: 10,
      manufacturer: "ABC Pharma",
      expiryDate: new Date("2026-12-31"),
    },
    {
      name: "Cough Syrup",
      description: "Relief from cough and cold",
      category: "Syrup",
      price: 60,
      stock: 50,
      minStock: 5,
      manufacturer: "XYZ Labs",
      expiryDate: new Date("2025-08-15"),
    },
  ];
  const createdProducts = await Product.insertMany(products);
  console.log(`✅ ${createdProducts.length} products created`);
  return createdProducts;
};

const seedMessages = async (users) => {
  await Message.deleteMany({});
  const messages = users.map((user) => ({
    user: user._id,
    content: `Welcome, ${user.fullName}!`,
  }));
  const createdMessages = await Message.insertMany(messages);
  console.log(`✅ ${createdMessages.length} messages created`);
  return createdMessages;
};

const seedLetterheads = async (users) => {
  await Letterhead.deleteMany({});
  const letters = users.map((user) => ({
    user: user._id,
    content: `Letterhead for ${user.fullName}`,
  }));
  const createdLetters = await Letterhead.insertMany(letters);
  console.log(`✅ ${createdLetters.length} letterheads created`);
  return createdLetters;
};

const seedVerifications = async (users) => {
  await Verification.deleteMany({});
  const verifications = users.map((user) => ({
    user: user._id,
    otp: Math.floor(100000 + Math.random() * 900000),
    createdAt: new Date(),
  }));
  const createdVerifications = await Verification.insertMany(verifications);
  console.log(`✅ ${createdVerifications.length} verifications created`);
  return createdVerifications;
};

const seedOrders = async (users, products) => {
  await Order.deleteMany({});
  const orders = users.map((user, idx) => ({
    user: user._id,
    products: [
      {
        product: products[idx % products.length]._id,
        quantity: 2,
      },
    ],
    totalAmount: products[idx % products.length].price * 2,
    status: "Placed",
  }));
  const createdOrders = await Order.insertMany(orders);
  console.log(`✅ ${createdOrders.length} orders created`);
  return createdOrders;
};

const seedInvoices = async (users, orders) => {
  await Invoice.deleteMany({});
  const invoices = orders.map((order) => ({
    user: order.user,
    order: order._id,
    amount: order.totalAmount,
    issuedDate: new Date(),
  }));
  const createdInvoices = await Invoice.insertMany(invoices);
  console.log(`✅ ${createdInvoices.length} invoices created`);
  return createdInvoices;
};

const seedDatabase = async () => {
  try {
    console.log("🌱 Starting database seeding...");
    if (mongoose.connection.readyState !== 1) await connectDB();

    const users = await seedUsers();
    const products = await seedProducts();
    const messages = await seedMessages(users);
    const letterheads = await seedLetterheads(users);
    const verifications = await seedVerifications(users);
    const orders = await seedOrders(users, products);
    const invoices = await seedInvoices(users, orders);

    console.log("✅ Seeding completed! Summary:");
    console.log({
      Users: users?.length,
      Products: products?.length,
      Messages: messages?.length,
      Letterheads: letterheads?.length,
      Verifications: verifications?.length,
      Orders: orders?.length,
      Invoices: invoices?.length,
    });

    if (require.main === module) process.exit(0);
    return { users, products, messages, letterheads, verifications, orders, invoices };
  } catch (error) {
    console.error("❌ Database seeding failed:", error);
    if (require.main === module) process.exit(1);
    throw error;
  }
};

if (require.main === module) seedDatabase();

module.exports = { seedDatabase };
