// Optional socket.io-client import - will be available after npm install
let io = null;

// Try to import socket.io-client if available
try {
  // This will be resolved after the dependency is installed
  if (typeof window !== "undefined") {
    // Placeholder for socket.io-client - install with: npm install socket.io-client
    console.log(
      "Socket.io-client will be available after: npm install socket.io-client",
    );

    // Mock io function for now
    io = () => ({
      on: () => {},
      off: () => {},
      emit: () => {},
      connect: () => {},
      disconnect: () => {},
      id: null,
    });
  }
} catch (error) {
  console.warn("Socket.io-client not available:", error);
}

class SocketClient {
  constructor() {
    this.socket = null;
    this.isConnected = false;
    this.reconnectAttempts = 0;
    this.maxReconnectAttempts = 5;
    this.isBrowser = typeof window !== "undefined";
  }

  connect(token = null, role = 0) {
    // Don't connect if not in browser environment
    if (!this.isBrowser) {
      console.warn("Socket.io client can only run in browser environment");
      return null;
    }

    if (this.socket && this.isConnected) {
      return this.socket;
    }

    try {
      // Ensure io is available
      if (typeof io !== "function") {
        console.warn("Socket.io not available");
        return null;
      }

      // Connect to backend server
      this.socket = io(
        process.env.REACT_APP_BACKEND_URL || "http://localhost:5000",
        {
          auth: {
            token: token,
          },
          transports: ["websocket", "polling"],
          timeout: 20000,
          forceNew: true,
          autoConnect: false, // Don't auto-connect immediately
        },
      );

      this.setupEventListeners(role);

      // Manually connect after setup
      this.socket.connect();

      return this.socket;
    } catch (error) {
      console.error("Socket connection error:", error);
      return null;
    }
  }

  setupEventListeners(role) {
    if (!this.socket) return;

    // Connection events
    this.socket.on("connect", () => {
      console.log("✅ Socket connected:", this.socket.id);
      this.isConnected = true;
      this.reconnectAttempts = 0;

      // Join appropriate room based on role
      if (role === 1) {
        this.socket.emit("join-admin");
      } else {
        this.socket.emit("join-user", this.socket.auth?.userId);
      }
    });

    this.socket.on("disconnect", (reason) => {
      console.log("❌ Socket disconnected:", reason);
      this.isConnected = false;

      // Attempt to reconnect
      if (
        reason === "io server disconnect" ||
        this.reconnectAttempts < this.maxReconnectAttempts
      ) {
        setTimeout(() => {
          this.reconnectAttempts++;
          console.log(`🔄 Reconnecting... Attempt ${this.reconnectAttempts}`);
          this.socket.connect();
        }, 2000 * this.reconnectAttempts);
      }
    });

    this.socket.on("connect_error", (error) => {
      console.error("Socket connection error:", error);
      this.isConnected = false;
    });

    // Admin-specific events
    if (role === 1) {
      this.setupAdminEventListeners();
    } else {
      this.setupUserEventListeners();
    }
  }

  setupAdminEventListeners() {
    if (!this.socket) return;

    // New user registration
    this.socket.on("new-user-registered", (data) => {
      console.log("👤 New user registered:", data);
      this.showNotification("New User Registration", {
        body: `${data.user.fullName} just registered`,
        icon: "/favicon.ico",
        tag: "new-user",
      });

      // Dispatch custom event for components to listen
      if (this.isBrowser && typeof window !== "undefined") {
        window.dispatchEvent(
          new CustomEvent("admin-new-user", { detail: data }),
        );
      }
    });

    // New order notifications
    this.socket.on("new-order", (data) => {
      console.log("🛒 New order received:", data);
      this.showNotification("New Order", {
        body: `Order ${data.order.orderId} - ₹${data.order.total}`,
        icon: "/favicon.ico",
        tag: "new-order",
      });

      if (this.isBrowser && typeof window !== "undefined") {
        window.dispatchEvent(
          new CustomEvent("admin-new-order", { detail: data }),
        );
      }
    });

    // Order status updates
    this.socket.on("order-status-updated", (data) => {
      console.log("📦 Order status updated:", data);
      if (this.isBrowser && typeof window !== "undefined") {
        window.dispatchEvent(
          new CustomEvent("admin-order-status-updated", { detail: data }),
        );
      }
    });

    // Payment status updates
    this.socket.on("payment-status-updated", (data) => {
      console.log("💳 Payment status updated:", data);
      this.showNotification("Payment Update", {
        body: `Invoice ${data.invoiceNumber} - ${data.newStatus}`,
        icon: "/favicon.ico",
        tag: "payment-update",
      });

      if (this.isBrowser && typeof window !== "undefined") {
        window.dispatchEvent(
          new CustomEvent("admin-payment-status-updated", { detail: data }),
        );
      }

      // Product updates
      this.socket.on("product-created", (data) => {
        console.log("📦 Product created:", data);
        if (this.isBrowser && typeof window !== "undefined") {
          window.dispatchEvent(
            new CustomEvent("admin-product-created", { detail: data }),
          );
        }
      });

      this.socket.on("stock-updated", (data) => {
        console.log("📊 Stock updated:", data);
        if (data.product.stockStatus === "Low Stock") {
          this.showNotification("Low Stock Alert", {
            body: `${data.product.name} - Only ${data.product.stock} left`,
            icon: "/favicon.ico",
            tag: "low-stock",
          });
        }

        if (this.isBrowser && typeof window !== "undefined") {
          window.dispatchEvent(
            new CustomEvent("admin-stock-updated", { detail: data }),
          );
        }
      });

      // Message notifications
      this.socket.on("new-message", (data) => {
        console.log("📧 New message:", data);
        this.showNotification("New Message", {
          body: `From: ${data.message.name} - ${data.message.subject}`,
          icon: "/favicon.ico",
          tag: "new-message",
        });

        if (this.isBrowser && typeof window !== "undefined") {
          window.dispatchEvent(
            new CustomEvent("admin-new-message", { detail: data }),
          );
        }
      });

      // User activity
      this.socket.on("user-logged-in", (data) => {
        console.log("🔐 User logged in:", data);
        if (this.isBrowser && typeof window !== "undefined") {
          window.dispatchEvent(
            new CustomEvent("admin-user-activity", { detail: data }),
          );
        }
      });
    });
  }

  setupUserEventListeners() {
    if (!this.socket) return;

    // Order notifications
    this.socket.on("order-created", (data) => {
      console.log("✅ Order created:", data);
      this.showNotification("Order Confirmed", {
        body: `Your order ${data.order.orderId} has been confirmed`,
        icon: "/favicon.ico",
        tag: "order-confirmed",
      });

      if (this.isBrowser && typeof window !== "undefined") {
        window.dispatchEvent(
          new CustomEvent("user-order-created", { detail: data }),
        );
      }

      this.socket.on("order-status-changed", (data) => {
        console.log("📦 Order status changed:", data);
        this.showNotification("Order Update", {
          body: `Order ${data.orderNumber} is now ${data.newStatus}`,
          icon: "/favicon.ico",
          tag: "order-update",
        });

        if (this.isBrowser && typeof window !== "undefined") {
          window.dispatchEvent(
            new CustomEvent("user-order-status-changed", { detail: data }),
          );
        }
      });

      // Payment notifications
      this.socket.on("payment-status-changed", (data) => {
        console.log("💳 Payment status changed:", data);
        this.showNotification("Payment Update", {
          body: `Payment for ${data.invoiceNumber} is ${data.newStatus}`,
          icon: "/favicon.ico",
          tag: "payment-update",
        });

        if (this.isBrowser && typeof window !== "undefined") {
          window.dispatchEvent(
            new CustomEvent("user-payment-status-changed", { detail: data }),
          );
        }
      });
    });
  }

  showNotification(title, options) {
    // Only run in browser environment
    if (!this.isBrowser) return;

    try {
      // Check if notifications are supported and permitted
      if (typeof window !== "undefined" && "Notification" in window) {
        if (Notification.permission === "granted") {
          new Notification(title, options);
        } else if (Notification.permission !== "denied") {
          // Request permission if not already requested
          Notification.requestPermission()
            .then((permission) => {
              if (permission === "granted") {
                new Notification(title, options);
              }
            })
            .catch((error) => {
              console.warn("Notification permission request failed:", error);
            });
        }
      }
    } catch (error) {
      console.warn("Notification API error:", error);
    }
  }

  // Public methods for components to emit events
  emitEvent(eventName, data) {
    if (this.socket && this.isConnected) {
      this.socket.emit(eventName, data);
    }
  }

  // Subscribe to specific events
  on(eventName, callback) {
    if (this.socket) {
      this.socket.on(eventName, callback);
    }
  }

  // Unsubscribe from events
  off(eventName, callback) {
    if (this.socket) {
      this.socket.off(eventName, callback);
    }
  }

  // Disconnect socket
  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
      this.isConnected = false;
    }
  }

  // Join specific rooms
  joinAdminRoom() {
    if (this.socket && this.isConnected) {
      this.socket.emit("join-admin");
    }
  }

  joinUserRoom(userId) {
    if (this.socket && this.isConnected) {
      this.socket.emit("join-user", userId);
    }
  }

  // Get connection status
  getConnectionStatus() {
    return {
      isConnected: this.isConnected,
      socketId: this.socket?.id || null,
    };
  }
}

// Create singleton instance
const socketClient = new SocketClient();

export default socketClient;
