const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
const http = require("http");
const socketIo = require("socket.io");
require("dotenv").config();

// Startup validation
console.log("🚀 Starting Hare Krishna Medical Store Backend...");
console.log(`📍 Environment: ${process.env.NODE_ENV || "development"}`);
console.log(
  `🔐 JWT Secret: ${process.env.JWT_SECRET ? "✅ Configured" : "❌ Missing"}`,
);
console.log(
  `📧 Email User: ${process.env.EMAIL_USER ? "✅ Configured" : "❌ Missing"}`,
);
console.log(
  `�� Primary Domain: ${process.env.PRIMARY_DOMAIN || "https://hk-medical.vercel.app (default)"}`,
);

const testUserRoute = require("./routes/testUser");

const app = express();
const server = http.createServer(app);

// Socket.io Setup
const io = socketIo(server, {
  cors: {
    origin: process.env.FRONTEND_URL?.split(",") || [
      "http://localhost:5178",
      "http://localhost:5173",
      "*",
    ],
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    credentials: true,
    allowedHeaders: ["Content-Type", "Authorization"],
  },
  allowEIO3: true, // Support older Socket.IO versions
  transports: ["polling", "websocket"],
  pingTimeout: 60000,
  pingInterval: 25000,
});
app.set("io", io);

// Middleware
app.set("trust proxy", 1);
app.use(helmet());
app.use(
  cors({
    origin: process.env.FRONTEND_URL?.split(",") || "*",
    credentials: true,
  }),
);
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));
app.use(
  "/api/",
  rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100,
    message: "Too many requests from this IP, please try again later.",
    standardHeaders: true,
    legacyHeaders: false,
  }),
);

// MongoDB Connection
const mongoURI =
  process.env.MONGODB_URI ||
  "mongodb+srv://ronaksheladiya652:Ronak95865@cluster0.loaubzp.mongodb.net/Hare_Krishna_Medical_db?retryWrites=true&w=majority&appName=Cluster0";
console.log("🔄 Attempting MongoDB connection to:", mongoURI);

mongoose.set("bufferCommands", false);

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(mongoURI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
      family: 4,
      maxPoolSize: 10,
      minPoolSize: 5,
      maxIdleTimeMS: 30000,
    });
    console.log("✅ Connected to MongoDB");
    console.log("📊 Database:", conn.connection.name);
    console.log("🏠 Host:", conn.connection.host);
    console.log("🔌 Port:", conn.connection.port);
    return conn;
  } catch (err) {
    console.error("❌ MongoDB connection failed:", err.message);
    global.DB_CONNECTED = false;
    return null;
  }
};

// Database Initialization
connectDB().then(async (conn) => {
  global.DB_CONNECTED = !!conn;
  if (conn) {
    try {
      const { seedDatabase } = require("./scripts/seed");
      const models = [
        require("./models/User"),
        require("./models/Product"),
        require("./models/Order"),
        require("./models/Invoice"),
        require("./models/Message"),
        require("./models/Letterhead"),
        require("./models/Verification"),
      ];
      console.log("📋 Models loaded - collections will be created:");
      models.forEach((model) =>
        console.log(`   - ${model.modelName} model ✅`),
      );

      const userCount = await models[0].countDocuments();
      if (userCount === 0) {
        console.log("🌱 No users found, initializing all collections...");
      }

      await seedDatabase(); // Always try to seed all collections regardless of users
    } catch (error) {
      console.error("❌ Database seeding encountered an issue:", error.message);
    }

    try {
      const emailService = require("./utils/emailService");
      const isEmailConnected = await emailService.testConnection();
      if (isEmailConnected) {
        console.log("✅ Email service is ready");
      } else {
        console.log("⚠️ Email service connection failed");
      }
    } catch (error) {
      console.error("❌ Email service error:", error.message);
    }
  }
});

// Mongoose Connection Events
mongoose.connection.on("connected", () => {
  console.log("📡 Mongoose connected to MongoDB");
  global.DB_CONNECTED = true;
});
mongoose.connection.on("error", (err) => {
  console.error("❌ Mongoose error:", err.message);
  global.DB_CONNECTED = false;
});
mongoose.connection.on("disconnected", () => {
  console.log("📡 Mongoose disconnected");
  global.DB_CONNECTED = false;
});
mongoose.connection.on("reconnected", () => {
  console.log("📡 Mongoose reconnected");
  global.DB_CONNECTED = true;
});

// Graceful Shutdown
process.on("SIGTERM", () => {
  console.log("📡 SIGTERM received");
  server.close(() => console.log("💾 Server shutdown complete"));
});
process.on("SIGINT", () => {
  console.log("📡 SIGINT received");
  server.close(() => console.log("💾 Server shutdown complete"));
});

// Routes with error handling
const routes = [
  { path: "/api/test", file: testUserRoute, name: "Test" },
  { path: "/api/auth", file: "./routes/auth", name: "Auth" },
  { path: "/api/debug-auth", file: "./routes/debug-auth", name: "Debug Auth" },
  { path: "/api/users", file: "./routes/users", name: "Users" },
  { path: "/api/products", file: "./routes/products", name: "Products" },
  { path: "/api/orders", file: "./routes/orders", name: "Orders" },
  { path: "/api/invoices", file: "./routes/invoices", name: "Invoices" },
  { path: "/api/messages", file: "./routes/messages", name: "Messages" },
  { path: "/api/analytics", file: "./routes/analytics", name: "Analytics" },
  { path: "/api/upload", file: "./routes/upload", name: "Upload" },
  { path: "/api/seed", file: "./routes/seed", name: "Seed" },
  { path: "/api/dev", file: "./routes/dev", name: "Dev" },
  {
    path: "/api/verification",
    file: "./routes/verification",
    name: "Verification",
  },
  {
    path: "/api/admin/notifications",
    file: "./routes/notifications",
    name: "Notifications",
  },
  {
    path: "/api/letterheads",
    file: "./routes/letterheads",
    name: "Letterheads",
  },
  {
    path: "/api/mail",
    file: "./routes/mail",
    name: "Mail",
  },
];

console.log("🔗 Loading API routes...");
routes.forEach((route) => {
  try {
    const routeHandler =
      typeof route.file === "string" ? require(route.file) : route.file;
    app.use(route.path, routeHandler);
    console.log(`✅ ${route.name} routes loaded: ${route.path}`);
  } catch (error) {
    console.error(
      `❌ Failed to load ${route.name} routes (${route.path}):`,
      error.message,
    );
  }
});

// Health Check
app.get("/api/health", (req, res) => {
  res.json({
    success: true,
    status: "OK",
    server: "online",
    database:
      mongoose.connection.readyState === 1 ? "connected" : "disconnected",
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: process.env.NODE_ENV || "development",
  });
});

// Route debugging endpoint (development only)
if (process.env.NODE_ENV !== "production") {
  app.get("/api/debug/routes", (req, res) => {
    const routes = [];
    app._router.stack.forEach(function (r) {
      if (r.route && r.route.path) {
        routes.push({
          method: Object.keys(r.route.methods)[0].toUpperCase(),
          path: r.route.path,
        });
      } else if (r.name === "router") {
        r.handle.stack.forEach(function (nestedR) {
          if (nestedR.route) {
            routes.push({
              method: Object.keys(nestedR.route.methods)[0].toUpperCase(),
              path:
                r.regexp.source
                  .replace("\\", "")
                  .replace("(?:", "")
                  .replace(")?", "") + nestedR.route.path,
            });
          }
        });
      }
    });
    res.json({ routes, total: routes.length });
  });
}

// 404 Handler for API routes
app.use("/api/*", (req, res) => {
  console.log(`❌ API route not found: ${req.method} ${req.originalUrl}`);
  res.status(404).json({
    success: false,
    message: `API route not found: ${req.method} ${req.originalUrl}`,
    timestamp: new Date().toISOString(),
    availableRoutes: [
      "GET /api/health",
      "POST /api/auth/register",
      "POST /api/auth/login",
      "POST /api/auth/verify-otp",
      "POST /api/auth/resend-otp",
      "GET /api/messages",
      "POST /api/messages/contact",
      "GET /api/mail/sent",
      "POST /api/mail/send-test",
      "GET /api/mail/status",
    ],
  });
});

// Socket.IO Connection Handling
io.on("connection", (socket) => {
  console.log(`🔌 Socket connected: ${socket.id}`);

  // Handle user authentication
  const userToken = socket.handshake.auth.token;
  const userRole = socket.handshake.auth.role;

  if (userRole === 1 || userRole === "admin") {
    socket.join("admin-room");
    console.log(`👨‍💼 Admin joined admin-room: ${socket.id}`);
  }

  if (userToken) {
    socket.join(`user-${userToken}`);
    console.log(`👤 User joined personal room: ${socket.id}`);
  }

  // Handle admin room join
  socket.on("join-admin-room", () => {
    socket.join("admin-room");
    console.log(`👨‍💼 Socket ${socket.id} joined admin-room`);
  });

  // Handle user room join
  socket.on("join-user-room", (token) => {
    socket.join(`user-${token}`);
    console.log(`👤 Socket ${socket.id} joined user-${token} room`);
  });

  // Handle real-time order updates
  socket.on("order-status-update", (data) => {
    io.to("admin-room").emit("order-updated", data);
    io.to(`user-${data.userId}`).emit("order-status-changed", data);
  });

  // Handle real-time message updates
  socket.on("new-message", (data) => {
    io.to("admin-room").emit("admin-new-message", data);
  });

  // Handle real-time notifications
  socket.on("send-notification", (data) => {
    if (data.target === "admin") {
      io.to("admin-room").emit("admin_notification", data);
    } else if (data.target === "user" && data.userId) {
      io.to(`user-${data.userId}`).emit("user_notification", data);
    } else {
      io.emit("global_notification", data);
    }
  });

  // Handle inventory updates
  socket.on("inventory-update", (data) => {
    io.emit("inventory-changed", data);
  });

  // Handle disconnection
  socket.on("disconnect", (reason) => {
    console.log(`🔌 Socket disconnected: ${socket.id} - ${reason}`);
  });

  // Send connection confirmation
  socket.emit("connection-confirmed", {
    message: "Socket.IO connection established",
    socketId: socket.id,
    timestamp: new Date().toISOString(),
  });
});

// Global Error Handler
app.use((error, req, res, next) => {
  console.error(`❌ Server Error on ${req.method} ${req.originalUrl}:`, error);

  if (res.headersSent) {
    return next(error);
  }

  res.status(500).json({
    success: false,
    message: "Internal server error",
    error:
      process.env.NODE_ENV === "production"
        ? "Something went wrong"
        : error.message,
    timestamp: new Date().toISOString(),
  });
});

// Error Handling
app.use((err, req, res, next) => {
  if (res.headersSent) return next(err);
  console.error(err.stack);
  res
    .status(500)
    .json({ message: "Something went wrong!", error: err.message });
});
app.use("*", (req, res) => {
  res.status(404).json({ message: "Route not found" });
});

// Start Server
const PORT = process.env.PORT || 5001; // Use 5001 to avoid conflicts
server.listen(PORT, () => {
  console.log(`��� Server running on port ${PORT}`);
  console.log(`🌐 Environment: ${process.env.NODE_ENV || "development"}`);
});

module.exports = { app, io };
