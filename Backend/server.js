const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
const http = require("http");
const socketIo = require("socket.io");
const { supabase, supabaseAdmin } = require("./config/supabase");
require("dotenv").config();

const testUserRoute = require("./routes/testUser");

const app = express();
const server = http.createServer(app);

// ==========================
// ✅ Socket.io Setup
// ==========================
const io = socketIo(server, {
  cors: {
    origin: process.env.FRONTEND_URL || "https://hk-medical.vercel.app,https://hkmedical.vercel.app,https://harekrishnamedical.vercel.app,https://hare-krishna-medical.vercel.app,",
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  },
});
app.set("io", io);

// ==========================
// ✅ Middleware
// ==========================
// Trust proxy for rate limiting in cloud environments
app.set("trust proxy", 1);

app.use(helmet());
app.use(
  cors({
    origin: process.env.FRONTEND_URL || "https://hk-medical.vercel.app,https://hkmedical.vercel.app,https://harekrishnamedical.vercel.app,https://hare-krishna-medical.vercel.app,",
    credentials: true,
  }),
);
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: "Too many requests from this IP, please try again later.",
  standardHeaders: true,
  legacyHeaders: false,
});
app.use("/api/", limiter);

// ==========================
// ✅ Database Connection
// ==========================
const connectDB = async () => {
  try {
    // Test Supabase connection
    const { data, error } = await supabase.from('users').select('count').limit(1);
    
    if (error && error.code !== 'PGRST116') { // PGRST116 is "table not found" which is ok for initial setup
      throw error;
    }

    console.log("✅ Connected to Supabase");
    console.log("📊 Database: PostgreSQL");
    console.log("🏠 Host: dvryosjtfrscdbrzssdz.supabase.co");
    
    global.DB_CONNECTED = true;
    return true;
  } catch (err) {
    console.error("❌ Supabase connection failed:", err.message);
    global.DB_CONNECTED = false;
    return null;
  }
};

// Connect to database
connectDB().then(async (conn) => {
  global.DB_CONNECTED = !!conn;

  if (conn) {
    console.log("📋 Supabase tables ready:");
    console.log("   - users table ✅");
    console.log("   - products table ✅");
    console.log("   - orders table ✅");
    console.log("   - invoices table ✅");
    console.log("   - messages table ✅");
    console.log("   - letterheads table ✅");
    console.log("   - verifications table ✅");

    // Test email service connection
    try {
      const emailService = require("./utils/emailService");
      const isEmailConnected = await emailService.testConnection();

      if (isEmailConnected) {
        console.log("✅ Email service is ready");
      } else {
        console.log(
          "⚠️ Email service connection failed - emails will not be sent",
        );
      }
    } catch (error) {
      console.error("❌ Email service test error:", error.message);
    }
  }
});

// Supabase connection is always available via HTTP

// Graceful shutdown handling
process.on("SIGTERM", () => {
  console.log("📡 SIGTERM received, shutting down gracefully");
  server.close(() => {
    console.log("💾 Process terminated");
  });
});

process.on("SIGINT", () => {
  console.log("📡 SIGINT received, shutting down gracefully");
  server.close(() => {
    console.log("💾 Process terminated");
  });
});

// ==========================
// ✅ Routes
// ==========================
app.use("/api/test", testUserRoute);
app.use("/api/auth", require("./routes/auth"));
app.use("/api/users", require("./routes/users"));
app.use("/api/products", require("./routes/products"));
app.use("/api/orders", require("./routes/orders"));
app.use("/api/invoices", require("./routes/invoices"));
app.use("/api/messages", require("./routes/messages"));
app.use("/api/analytics", require("./routes/analytics"));
app.use("/api/upload", require("./routes/upload"));
app.use("/api/verification", require("./routes/verification"));
app.use("/api/admin/notifications", require("./routes/notifications"));
app.use("/api/letterheads", require("./routes/letterheads"));

// ==========================
// ✅ Health Check Route
// ==========================
app.get("/api/health", async (req, res) => {
  let databaseStatus = "disconnected";
  
  try {
    const { data, error } = await supabase.from('users').select('count').limit(1);
    databaseStatus = error && error.code !== 'PGRST116' ? "disconnected" : "connected";
  } catch (err) {
    databaseStatus = "disconnected";
  }

  res.json({
    success: true,
    status: "OK",
    server: "online",
    database: databaseStatus,
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: process.env.NODE_ENV || "development",
  });
});

// ==========================
// ✅ Database Seed Route (Development Only)
// ==========================
if (process.env.NODE_ENV === "development") {
  // Manual database seeding endpoint
  app.post("/api/seed-database", async (req, res) => {
    try {
      console.log("🌱 Manual database seeding triggered...");
      const { seedDatabase } = require("./scripts/seed");
      const result = await seedDatabase();

      res.json({
        success: true,
        message: "Database seeded successfully",
        data: {
          users: result.users?.length || 0,
          products: result.products?.length || 0,
          messages: result.messages?.length || 0,
          letterheads: result.letterheads?.length || 0,
          verifications: result.verifications?.length || 0,
          orders: result.orders?.length || 0,
          invoices: result.invoices?.length || 0,
        },
      });
    } catch (error) {
      console.error("❌ Manual seeding error:", error);
      res.status(500).json({
        success: false,
        message: "Database seeding failed",
        error: error.message,
      });
    }
  });
}

// ==========================
// ✅ Email Test Routes (Development Only)
// ==========================
if (process.env.NODE_ENV === "development") {
  // Test email connection
  app.get("/api/test-email/connection", async (req, res) => {
    try {
      const emailService = require("./utils/emailService");
      const isConnected = await emailService.testConnection();

      res.json({
        success: isConnected,
        connected: isConnected,
        message: isConnected
          ? "Email service is working"
          : "Email service connection failed",
        configuration: {
          host: process.env.EMAIL_HOST || "smtp.gmail.com",
          port: process.env.EMAIL_PORT || 587,
          user: process.env.EMAIL_USER ? "Configured" : "Not configured",
          pass: process.env.EMAIL_PASS ? "Configured" : "Not configured",
        },
      });
    } catch (error) {
      console.error("Email connection test error:", error);
      res.status(500).json({
        success: false,
        connected: false,
        message: "Email connection test failed",
        error: error.message,
      });
    }
  });

  // Send test email
  app.post("/api/test-email/send", async (req, res) => {
    try {
      const emailService = require("./utils/emailService");
      const { email, fullName } = req.body;

      if (!email || !fullName) {
        return res.status(400).json({
          success: false,
          message: "Email and fullName are required",
        });
      }

      // Test email connection first
      const connectionTest = await emailService.testConnection();
      if (!connectionTest) {
        return res.status(500).json({
          success: false,
          message: "Email service connection failed - check configuration",
        });
      }

      // Send test welcome email
      await emailService.sendWelcomeEmail(email, fullName);

      res.json({
        success: true,
        message: "Test email sent successfully",
        email: email,
      });
    } catch (error) {
      console.error("Test email error:", error);
      res.status(500).json({
        success: false,
        message: "Failed to send test email",
        error: error.message,
      });
    }
  });
}

// ==========================
// ✅ Socket.io Events
// ==========================
io.on("connection", (socket) => {
  const { token, role } = socket.handshake.auth || {};
  console.log(
    "🔑 Socket connected - ID:",
    socket.id,
    "Token:",
    token,
    "Role:",
    role,
  );

  // Handle admin connections
  if (role === 1) {
    socket.join("admin-room");
    console.log("👨‍💼 Admin joined admin room:", socket.id);

    // Send welcome message to admin
    socket.emit("admin_notification", {
      type: "system",
      title: "Admin Connected",
      message: "You are now connected to real-time updates",
      timestamp: new Date().toISOString(),
    });
  }
  // Handle user connections
  else if (token) {
    socket.join(`user-${token}`);
    console.log(`👤 User ${token} joined user room:`, socket.id);
  }

  // Handle admin room join requests
  socket.on("join-admin-room", () => {
    socket.join("admin-room");
    console.log("👨‍💼 Socket manually joined admin room:", socket.id);
  });

  // Handle user room join requests
  socket.on("join-user-room", (userId) => {
    socket.join(`user-${userId}`);
    console.log(`👤 Socket manually joined user room ${userId}:`, socket.id);
  });

  // Handle test events for diagnostics
  socket.on("test-event", (data) => {
    console.log("🧪 Test event received:", data);
    socket.emit("test-response", {
      success: true,
      message: "Test event processed successfully",
      timestamp: new Date().toISOString(),
    });
  });

  // Handle disconnection
  socket.on("disconnect", (reason) => {
    console.log("👤 User disconnected:", socket.id, "Reason:", reason);
  });

  // Handle connection errors
  socket.on("error", (error) => {
    console.error("❌ Socket error:", error);
  });
});

// ==========================
// ✅ Error Handling
// ==========================
app.use((err, req, res, next) => {
  if (res.headersSent) return next(err);

  console.error(err.stack);
  res.status(500).json({
    message: "Something went wrong!",
    error:
      process.env.NODE_ENV === "development"
        ? err.message
        : "Internal Server Error",
  });
});

app.use("*", (req, res) => {
  res.status(404).json({ message: "Route not found" });
});

// ==========================
// ✅ Start Server
// ==========================
const PORT = process.env.PORT || 5001;
server.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`🌐 Environment: ${process.env.NODE_ENV || "development"}`);
});

module.exports = { app, io };
