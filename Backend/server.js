const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
const http = require("http");
const socketIo = require("socket.io");
require("dotenv").config();

const testUserRoute = require("./routes/testUser");

const app = express();
const server = http.createServer(app);

// ==========================
// ✅ Socket.io Setup
// ==========================
const io = socketIo(server, {
  cors: {
    origin: process.env.FRONTEND_URL || "http://localhost:5173",
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  },
});
app.set("io", io);

// ==========================
// ✅ Middleware
// ==========================
app.use(helmet());
app.use(
  cors({
    origin: process.env.FRONTEND_URL || "http://localhost:5173",
    credentials: true,
  }),
);
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: "Too many requests from this IP, please try again later.",
});
app.use("/api/", limiter);

// ==========================
// ✅ Database Connection
// ==========================
mongoose
  .connect(
    process.env.MONGODB_URI ||
      "mongodb://localhost:27017/Hare_Krishna_Medical_db",
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    },
  )
  .then(() => console.log("✅ Connected to MongoDB"))
  .catch((err) => console.error("❌ MongoDB connection error:", err));

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
app.use("/api/admin/notifications", require("./routes/notifications").router);

// ==========================
// ✅ Health Check Route
// ==========================
app.get("/api/health", (req, res) => {
  const dbStatus = mongoose.connection.readyState;
  const databaseStatus = dbStatus === 1 ? "connected" : "disconnected";

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
// ✅ Socket.io Events
// ==========================
io.on("connection", (socket) => {
  const { token, role } = socket.handshake.auth || {};
  console.log("🔑 Connected with token:", token, "Role:", role);
  console.log("👤 User connected:", socket.id);

  if (role === 1) {
    socket.join("admin-room");
    console.log("👨‍💼 Admin joined admin room");
  } else if (token) {
    socket.join(`user-${token}`);
    console.log(`👤 User ${token} joined user room`);
  }

  socket.on("disconnect", () => {
    console.log("👤 User disconnected:", socket.id);
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
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`🌐 Environment: ${process.env.NODE_ENV || "development"}`);
});

module.exports = { app, io };
