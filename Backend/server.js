const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const helmet = require("helmet");
const compression = require("compression");
const morgan = require("morgan");
const rateLimit = require("express-rate-limit");
const { createServer } = require("http");
const { Server } = require("socket.io");
require("dotenv").config();

// Import routes
const authRoutes = require("./routes/auth");
const productRoutes = require("./routes/products");
const userRoutes = require("./routes/users");
const orderRoutes = require("./routes/orders");
const cartRoutes = require("./routes/cart");
const invoiceRoutes = require("./routes/invoices");
const messageRoutes = require("./routes/messages");
const letterheadRoutes = require("./routes/letterheads");
const analyticsRoutes = require("./routes/analytics");
const uploadRoutes = require("./routes/upload");

// Import middleware
const { authenticateToken, authorizeRole } = require("./middleware/auth");
const errorHandler = require("./middleware/errorHandler");

// Import socket handlers
const socketHandler = require("./utils/socketHandler");

const app = express();
const server = createServer(app);

// Socket.IO setup with CORS
const io = new Server(server, {
  cors: {
    origin: process.env.FRONTEND_URL || [
      "http://localhost:3000",
      "http://localhost:5173",
    ],
    methods: ["GET", "POST"],
    credentials: true,
  },
});

// Make io available globally
app.set("io", io);

// Security middleware
app.use(
  helmet({
    contentSecurityPolicy: false, // Allow inline scripts for development
  }),
);
app.use(compression());

// CORS configuration
const corsOptions = {
  origin: function (origin, callback) {
    const allowedOrigins = [
      "http://localhost:3000",
      "http://localhost:5173",
      "https://hk-medical.vercel.app",
      "https://hkmedical.vercel.app",
      "https://harekrishnamedical.vercel.app",
      "https://hare-krishna-medical.vercel.app",
    ];

    // Allow requests with no origin (mobile apps, Postman, etc.)
    if (!origin) return callback(null, true);

    if (
      allowedOrigins.indexOf(origin) !== -1 ||
      process.env.NODE_ENV === "development"
    ) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization", "x-auth-token"],
};

app.use(cors(corsOptions));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  message: "Too many requests from this IP, please try again later.",
  standardHeaders: true,
  legacyHeaders: false,
});

app.use(limiter);

// Auth rate limiting (stricter)
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // Limit each IP to 5 auth requests per windowMs
  message: "Too many authentication attempts, please try again later.",
  skipSuccessfulRequests: true,
});

// Logging
app.use(morgan("combined"));

// Body parsing middleware
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

// Health check endpoint
app.get("/api/health", (req, res) => {
  res.json({
    status: "OK",
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: process.env.NODE_ENV || "development",
    database:
      mongoose.connection.readyState === 1 ? "connected" : "disconnected",
  });
});

// API Routes
app.use("/api/auth", authLimiter, authRoutes);
app.use("/api/products", productRoutes);
app.use("/api/users", authenticateToken, userRoutes);
app.use("/api/orders", authenticateToken, orderRoutes);
app.use("/api/cart", authenticateToken, cartRoutes);
app.use("/api/invoices", invoiceRoutes);
app.use("/api/messages", authenticateToken, messageRoutes);
app.use("/api/letterheads", authenticateToken, letterheadRoutes);
app.use(
  "/api/analytics",
  authenticateToken,
  authorizeRole(["admin"]),
  analyticsRoutes,
);
app.use("/api/upload", authenticateToken, uploadRoutes);

// Socket.IO connection handling
socketHandler(io);

// Error handling middleware
app.use(errorHandler);

// 404 handler
app.use("*", (req, res) => {
  res.status(404).json({
    success: false,
    message: "Route not found",
  });
});

// MongoDB connection
const connectDB = async () => {
  try {
    const mongoURI =
      process.env.MONGODB_URI ||
      "mongodb://localhost:27017/hare-krishna-medical";

    await mongoose.connect(mongoURI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log("✅ MongoDB connected successfully");
  } catch (error) {
    console.error("❌ MongoDB connection error:", error.message);
    process.exit(1);
  }
};

// Handle MongoDB connection events
mongoose.connection.on("disconnected", () => {
  console.log("❌ MongoDB disconnected");
});

mongoose.connection.on("error", (err) => {
  console.error("❌ MongoDB error:", err);
});

// Graceful shutdown
process.on("SIGINT", async () => {
  console.log("🔄 Gracefully shutting down...");

  // Close MongoDB connection
  await mongoose.connection.close();

  // Close server
  server.close(() => {
    console.log("✅ Server closed");
    process.exit(0);
  });
});

// Start server
const PORT = process.env.PORT || 5001;

const startServer = async () => {
  await connectDB();

  server.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
    console.log(`🌍 Environment: ${process.env.NODE_ENV || "development"}`);
    console.log(`📡 Socket.IO enabled`);
  });
};

startServer();

module.exports = app;
