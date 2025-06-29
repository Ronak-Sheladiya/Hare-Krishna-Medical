const jwt = require("jsonwebtoken");
const User = require("../models/User");

const connectedUsers = new Map(); // userId -> socketId
const adminSockets = new Set(); // Set of admin socket IDs

const socketHandler = (io) => {
  io.on("connection", async (socket) => {
    console.log(`🔌 Socket connected: ${socket.id}`);

    // Authenticate socket connection
    const token = socket.handshake.auth.token;
    let user = null;

    if (token) {
      try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        user = await User.findById(decoded.id).select("-password");

        if (user && user.isActive && !user.isLocked) {
          socket.userId = user._id.toString();
          socket.userRole = user.role;
          connectedUsers.set(user._id.toString(), socket.id);

          console.log(`👤 User ${user.fullName} connected (${user.role})`);

          // Join user to their personal room
          socket.join(`user:${user._id}`);

          // If admin, join admin room
          if (user.role === "admin") {
            socket.join("admin");
            adminSockets.add(socket.id);
            console.log(`👨‍💼 Admin ${user.fullName} joined admin room`);
          }

          // Send connection confirmation
          socket.emit("authenticated", {
            success: true,
            user: {
              id: user._id,
              name: user.fullName,
              role: user.role,
            },
          });
        }
      } catch (error) {
        console.error("Socket authentication error:", error);
        socket.emit("authentication_error", { message: "Invalid token" });
      }
    }

    // Handle joining rooms
    socket.on("join-room", (room) => {
      socket.join(room);
      console.log(`Socket ${socket.id} joined room: ${room}`);
    });

    socket.on("leave-room", (room) => {
      socket.leave(room);
      console.log(`Socket ${socket.id} left room: ${room}`);
    });

    // Handle admin joining admin room
    socket.on("join-admin-room", () => {
      if (socket.userRole === "admin") {
        socket.join("admin");
        adminSockets.add(socket.id);
        console.log(`👨‍💼 Admin socket ${socket.id} joined admin room`);
      } else {
        socket.emit("error", { message: "Admin access required" });
      }
    });

    // Handle user joining user room
    socket.on("join-user-room", (userId) => {
      if (socket.userId === userId || socket.userRole === "admin") {
        socket.join(`user:${userId}`);
        console.log(`👤 Socket ${socket.id} joined user room: ${userId}`);
      } else {
        socket.emit("error", { message: "Unauthorized access" });
      }
    });

    // Handle new message notification
    socket.on("new-message", (data) => {
      console.log("📨 New message event:", data);

      // Notify all admins about new message
      socket.to("admin").emit("new-admin-message", {
        messageId: data.messageId,
        sender: data.senderName,
        subject: data.subject,
        priority: data.priority,
        timestamp: new Date(),
      });
    });

    // Handle message reply notification
    socket.on("message-reply", (data) => {
      console.log("💬 Message reply event:", data);

      // Notify the specific user about reply
      if (data.userId) {
        socket.to(`user:${data.userId}`).emit("message-reply", {
          messageId: data.messageId,
          reply: data.reply,
          isAdmin: data.isAdmin,
          timestamp: new Date(),
        });
      }
    });

    // Handle order status updates
    socket.on("order-status-update", (data) => {
      console.log("📦 Order status update:", data);

      // Notify the user about order status change
      if (data.userId) {
        socket.to(`user:${data.userId}`).emit("order-status-update", {
          orderId: data.orderId,
          status: data.status,
          message: data.message,
          timestamp: new Date(),
        });
      }

      // Notify admins if needed
      if (data.notifyAdmins) {
        socket.to("admin").emit("order-update", {
          orderId: data.orderId,
          status: data.status,
          userId: data.userId,
          timestamp: new Date(),
        });
      }
    });

    // Handle product stock updates
    socket.on("product-stock-update", (data) => {
      console.log("📊 Product stock update:", data);

      // Broadcast to all connected clients
      socket.broadcast.emit("product-stock-update", {
        productId: data.productId,
        stock: data.stock,
        timestamp: new Date(),
      });
    });

    // Handle cart sync across tabs
    socket.on("cart-sync", (data) => {
      console.log("🛒 Cart sync event:", data);

      // Send cart update to user's other sessions
      if (socket.userId) {
        socket.to(`user:${socket.userId}`).emit("cart-sync", {
          cart: data.cart,
          timestamp: new Date(),
        });
      }
    });

    // Handle typing indicators for chat
    socket.on("typing-start", (data) => {
      if (data.messageId && data.userName) {
        socket.to("admin").emit("user-typing", {
          messageId: data.messageId,
          userName: data.userName,
          userId: socket.userId,
        });
      }
    });

    socket.on("typing-stop", (data) => {
      if (data.messageId) {
        socket.to("admin").emit("user-stopped-typing", {
          messageId: data.messageId,
          userId: socket.userId,
        });
      }
    });

    // Handle notification acknowledgment
    socket.on("notification-read", (data) => {
      console.log("✅ Notification read:", data);

      // You can update notification status in database here
      // and notify other sessions if needed
    });

    // Handle ping/pong for connection health
    socket.on("ping", () => {
      socket.emit("pong", { timestamp: new Date() });
    });

    // Handle disconnect
    socket.on("disconnect", (reason) => {
      console.log(`❌ Socket disconnected: ${socket.id}, Reason: ${reason}`);

      if (socket.userId) {
        connectedUsers.delete(socket.userId);
        console.log(`👤 User ${socket.userId} disconnected`);
      }

      if (adminSockets.has(socket.id)) {
        adminSockets.delete(socket.id);
        console.log(`👨‍💼 Admin socket ${socket.id} disconnected`);
      }
    });

    // Handle error
    socket.on("error", (error) => {
      console.error(`❌ Socket error for ${socket.id}:`, error);
    });
  });

  // Broadcast notification to all admins
  io.broadcastToAdmins = (event, data) => {
    io.to("admin").emit(event, data);
  };

  // Send notification to specific user
  io.notifyUser = (userId, event, data) => {
    io.to(`user:${userId}`).emit(event, data);
  };

  // Broadcast to all connected clients
  io.broadcastToAll = (event, data) => {
    io.emit(event, data);
  };

  // Get connection statistics
  io.getConnectionStats = () => {
    return {
      totalConnections: io.engine.clientsCount,
      authenticatedUsers: connectedUsers.size,
      adminConnections: adminSockets.size,
      timestamp: new Date(),
    };
  };

  // Get connected users
  io.getConnectedUsers = () => {
    return Array.from(connectedUsers.entries()).map(([userId, socketId]) => ({
      userId,
      socketId,
    }));
  };

  console.log("🚀 Socket.IO handlers initialized");
};

module.exports = socketHandler;
