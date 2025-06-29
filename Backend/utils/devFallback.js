// Development fallback for when MongoDB is not available
// This creates in-memory storage for basic functionality

const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// In-memory storage for development
let devUsers = [];
let devProducts = [];
let devOrders = [];
let devInvoices = [];
let devLetterheads = [];

// Initialize with a default admin user
const initializeDevData = async () => {
  if (devUsers.length === 0) {
    const adminPassword1 = await bcrypt.hash("Ronak@95865", 12);
    const adminPassword2 = await bcrypt.hash("admin@123", 12);
    const userPassword = await bcrypt.hash("admin123", 12);

    // Add frontend expected admin users
    devUsers.push({
      _id: "dev_admin_main",
      fullName: "Admin",
      email: "admin@gmail.com",
      mobile: "+91 98765 43210",
      password: adminPassword1,
      role: 1, // Admin
      isActive: true,
      emailVerified: true,
      address: "123 Admin Street, Medical City",
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    devUsers.push({
      _id: "dev_ronak_admin",
      fullName: "Ronak Sheladiya",
      email: "ronaksheladiya652@gmail.com",
      mobile: "+91 98765 43211",
      password: adminPassword2,
      role: 1, // Admin
      isActive: true,
      emailVerified: true,
      address: "123 Admin Street, Medical City",
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    devUsers.push({
      _id: "dev_mayur_admin",
      fullName: "Mayur Gajera",
      email: "mayurgajera098@gmail.com",
      mobile: "+91 98765 43212",
      password: adminPassword2,
      role: 1, // Admin
      isActive: true,
      emailVerified: true,
      address: "123 Admin Street, Medical City",
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    // Original fallback users
    devUsers.push({
      _id: "dev_admin_user",
      fullName: "Admin User",
      email: "admin@harekrishnamedical.com",
      mobile: "+91 98765 43213",
      password: userPassword,
      role: 1, // Admin
      isActive: true,
      emailVerified: true,
      address: "123 Admin Street, Medical City",
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    devUsers.push({
      _id: "dev_test_user",
      fullName: "Test User",
      email: "user@test.com",
      mobile: "+91 87654 32109",
      password: userPassword,
      role: 0, // Regular user
      isActive: true,
      emailVerified: true,
      address: "456 User Avenue, Test City",
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    console.log("📝 Development fallback data initialized");
    console.log("🔑 Main Admin: admin@gmail.com / Ronak@95865");
    console.log("🔑 Ronak Admin: ronaksheladiya652@gmail.com / admin@123");
    console.log("🔑 Mayur Admin: mayurgajera098@gmail.com / admin@123");
    console.log("🔑 Fallback Admin: admin@harekrishnamedical.com / admin123");
    console.log("🔑 Test User: user@test.com / admin123");
  }
};

// Fallback auth methods
const devAuth = {
  async login(email, password) {
    await initializeDevData();

    const user = devUsers.find((u) => u.email === email);
    if (!user) {
      throw new Error("Invalid email or password");
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      throw new Error("Invalid email or password");
    }

    if (!user.isActive) {
      throw new Error("Account has been deactivated. Please contact support.");
    }

    // Generate token
    const token = jwt.sign(
      {
        id: user._id,
        email: user.email,
        role: user.role,
      },
      process.env.JWT_SECRET || "dev-secret-key",
      { expiresIn: process.env.JWT_EXPIRES_IN || "7d" },
    );

    return {
      token,
      user: {
        id: user._id,
        fullName: user.fullName,
        email: user.email,
        mobile: user.mobile,
        role: user.role,
        address: user.address,
        emailVerified: user.emailVerified,
      },
    };
  },

  async register(userData) {
    await initializeDevData();

    const existingUser = devUsers.find(
      (u) => u.email === userData.email || u.mobile === userData.mobile,
    );

    if (existingUser) {
      throw new Error(
        existingUser.email === userData.email
          ? "User with this email already exists"
          : "User with this mobile number already exists",
      );
    }

    const hashedPassword = await bcrypt.hash(userData.password, 12);
    const newUser = {
      _id: `dev_user_${Date.now()}`,
      fullName: userData.fullName,
      email: userData.email,
      mobile: userData.mobile,
      password: hashedPassword,
      role: 0, // Regular user
      isActive: true,
      emailVerified: false,
      address: userData.address || "",
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    devUsers.push(newUser);

    const token = jwt.sign(
      {
        id: newUser._id,
        email: newUser.email,
        role: newUser.role,
      },
      process.env.JWT_SECRET || "dev-secret-key",
      { expiresIn: process.env.JWT_EXPIRES_IN || "7d" },
    );

    return {
      token,
      user: {
        id: newUser._id,
        fullName: newUser.fullName,
        email: newUser.email,
        mobile: newUser.mobile,
        role: newUser.role,
        address: newUser.address,
        emailVerified: newUser.emailVerified,
      },
    };
  },

  async findUserById(id) {
    await initializeDevData();
    return devUsers.find((u) => u._id === id);
  },

  async findUserByEmail(email) {
    await initializeDevData();
    return devUsers.find((u) => u.email === email);
  },
};

// Check if we should use development fallback
const shouldUseFallback = () => {
  // Use fallback if database is not connected, regardless of environment
  const dbConnected = global.DB_CONNECTED !== false;
  const mongoose = require("mongoose");
  const isDBReady = mongoose.connection.readyState === 1;

  const shouldUse = !dbConnected || !isDBReady;

  if (shouldUse) {
    console.log(
      "🔄 Using development fallback - DB connection state:",
      mongoose.connection.readyState,
    );
  }

  return shouldUse;
};

module.exports = {
  devAuth,
  shouldUseFallback,
  initializeDevData,
  devUsers,
  devProducts,
  devOrders,
  devInvoices,
  devLetterheads,
};
