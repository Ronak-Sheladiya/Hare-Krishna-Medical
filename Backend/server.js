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

// Import database initialization
const {
  initializeDatabase,
  checkDatabaseHealth,
} = require("./scripts/initDatabase");

const app = express();
const server = createServer(app);

// Trust proxy for rate limiting and security (required for production)
app.set("trust proxy", 1);

// Socket.IO setup with CORS
const io = new Server(server, {
  cors: {
    origin: process.env.FRONTEND_URL || [
      "http://localhost:3000",
      "http://localhost:5173",
      /\.fly\.dev$/,
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
      /\.vercel\.app$/,
      /\.netlify\.app$/,
      /\.fly\.dev$/,
      /\.onrender\.com$/,
    ];

    // Add FRONTEND_URL from environment if set
    if (process.env.FRONTEND_URL) {
      allowedOrigins.push(process.env.FRONTEND_URL);
    }

    // Allow requests with no origin (mobile apps, Postman, etc.)
    if (!origin) return callback(null, true);

    console.log(`🔍 CORS check for origin: ${origin}`);

    // Check if origin is allowed
    const isAllowed = allowedOrigins.some((allowedOrigin) => {
      if (typeof allowedOrigin === "string") {
        return allowedOrigin === origin;
      } else if (allowedOrigin instanceof RegExp) {
        return allowedOrigin.test(origin);
      }
      return false;
    });

    if (isAllowed || process.env.NODE_ENV === "development") {
      console.log(`✅ CORS allowed for: ${origin}`);
      callback(null, true);
    } else {
      console.log(`❌ CORS blocked for: ${origin}`);
      console.log(`📋 Allowed origins: ${allowedOrigins.join(", ")}`);
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
  const dbStatus = mongoose.connection.readyState;
  const dbStatusText =
    {
      0: "disconnected",
      1: "connected",
      2: "connecting",
      3: "disconnecting",
    }[dbStatus] || "unknown";

  res.json({
    status: "OK",
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: process.env.NODE_ENV || "development",
    database: {
      status: dbStatusText,
      readyState: dbStatus,
    },
    server: "running",
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

    console.log("🔄 Attempting to connect to MongoDB...");
    console.log(`📍 MongoDB URI: ${mongoURI}`);

    await mongoose.connect(mongoURI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 5000, // Timeout after 5s instead of 30s
      socketTimeoutMS: 45000, // Close sockets after 45s of inactivity
    });

    console.log("✅ MongoDB connected successfully");
  } catch (error) {
    console.error("❌ MongoDB connection error:", error.message);
    console.log("⚠️ Starting server without MongoDB connection");
    console.log("📝 Note: Some features may not work without database");
    // Don't exit, allow server to start without DB for development
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

// Environment validation
const validateEnvironment = () => {
  const requiredEnvVars = ["JWT_SECRET"];
  const missingVars = requiredEnvVars.filter(
    (varName) => !process.env[varName],
  );

  if (missingVars.length > 0) {
    console.error(
      "❌ Missing required environment variables:",
      missingVars.join(", "),
    );
    process.exit(1);
  }

  // Warn about optional but recommended variables
  const recommendedVars = {
    EMAIL_USER: "Email sending will be disabled",
    EMAIL_PASS: "Email sending will be disabled",
    FRONTEND_URL: "CORS may not work properly in production",
    CLOUDINARY_CLOUD_NAME: "Image uploads will not work",
  };

  Object.entries(recommendedVars).forEach(([varName, consequence]) => {
    if (!process.env[varName]) {
      console.warn(`⚠️ Missing ${varName}: ${consequence}`);
    }
  });

  console.log("✅ Environment validation completed");
};

// Start server
const PORT = process.env.PORT || 5001;

const startServer = async () => {
  // Validate environment first
  validateEnvironment();

  await connectDB();

  // Initialize database after connection
  try {
    await initializeDatabase();
    await checkDatabaseHealth();
  } catch (error) {
    console.warn("⚠️ Database initialization failed:", error.message);
    console.log("📝 Server will continue without full initialization");
  }

  server.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
    console.log(`🌍 Environment: ${process.env.NODE_ENV || "development"}`);
    console.log(`📡 Socket.IO enabled`);
    console.log(`🎯 API available at: http://localhost:${PORT}/api`);
    console.log(
      `📧 Email service: ${process.env.EMAIL_USER ? "✅ Configured" : "❌ Not configured"}`,
    );
    console.log(`🎨 Frontend URL: ${process.env.FRONTEND_URL || "❌ Not set"}`);
    console.log(`💊 Hare Krishna Medical Store Backend Ready!`);
  });
};

startServer();

module.exports = app;
