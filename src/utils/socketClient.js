// Real-time socket client with robust error handling
let io = null;
let socketAvailable = false;

// Create a mock socket for fallback
const createMockSocket = () => ({
  on: (event, callback) => {
    // Store callback for potential future use
    if (typeof callback === 'function') {
      console.debug(`Mock socket registered listener for: ${event}`);
    }
    return this;
  },
  off: (event) => {
    console.debug(`Mock socket removed listener for: ${event}`);
    return this;
  },
  emit: (event, data) => {
    console.debug(`Mock socket emitting: ${event}`, data);
    return this;
  },
  connect: () => {
    console.debug("Mock socket connected");
    return this;
  },
  disconnect: () => {
    console.debug("Mock socket disconnected");
    return this;
  },
  connected: false,
  id: 'mock-socket-id'
});

// Try to import socket.io-client with proper error handling
if (typeof window !== "undefined") {
  import('socket.io-client')
    .then((socketio) => {
      io = socketio.io;
      socketAvailable = true;
      console.debug("Socket.io-client loaded successfully");
    })
    .catch((error) => {
      console.info("Socket.io-client not available:", error.message);
      io = createMockSocket;
      socketAvailable = false;
    });
} else {
  // Server-side rendering fallback
  io = createMockSocket;
  socketAvailable = false;
}

class SocketClient {
  constructor() {
    this.socket = null;
    this.isConnected = false;
    this.reconnectAttempts = 0;
    this.maxReconnectAttempts = 3;
    this.isBrowser = typeof window !== "undefined";
    this.connectionTimeout = null;
    this.reconnectTimeout = null;
    this.useWebSocket = true;
    this.fallbackMode = false;
    this.lastError = null;
  }

  connect(token = null, role = 0) {
    // Don't connect if not in browser environment
    if (!this.isBrowser) {
      console.debug("Socket.io client requires browser environment");
      return this.createMockSocket();
    }

    // Return existing connection if available and connected
    if (this.socket && this.isConnected) {
      return this.socket;
    }

    // Return mock socket if we've exceeded retry attempts or in fallback mode
    if (this.reconnectAttempts >= this.maxReconnectAttempts || this.fallbackMode) {
      console.info("Using mock socket due to connection issues or fallback mode");
      return this.createMockSocket();
    }

    try {
      // Determine socket URL with fallback
      const socketUrl = this.getSocketUrl();

      // Check if socket.io is available
      if (!io || typeof io !== "function" || !socketAvailable) {
        console.info("Socket.io not available, using mock socket");
        this.fallbackMode = true;
        return this.createMockSocket();
      }

      // Create socket connection with comprehensive configuration
      const socketOptions = {
        transports: this.useWebSocket ? ['websocket', 'polling'] : ['polling'],
        timeout: 10000,
        forceNew: true,
        reconnection: true,
        reconnectionAttempts: this.maxReconnectAttempts,
        reconnectionDelay: 2000,
        autoConnect: true,
        upgrade: this.useWebSocket
      };

      console.debug(`Attempting socket connection to: ${socketUrl}`, socketOptions);

      this.socket = io(socketUrl, socketOptions);
      this.setupEventHandlers();

      // Set connection timeout
      this.connectionTimeout = setTimeout(() => {
        if (!this.isConnected) {
          console.warn("Socket connection timeout, falling back to mock");
          this.handleConnectionFailure("Connection timeout");
        }
      }, 15000);

      return this.socket;

    } catch (error) {
      console.error("Socket connection error:", error);
      this.lastError = error;
      this.handleConnectionFailure(error.message);
      return this.createMockSocket();
    }
  }

  getSocketUrl() {
    // Try multiple URL sources with fallbacks
    const envUrl = import.meta.env.VITE_SOCKET_URL;
    const envBackendUrl = import.meta.env.VITE_BACKEND_URL;
    const currentUrl = window.location.origin;

    // Determine the best URL to use
    if (envUrl) {
      return envUrl;
    } else if (envBackendUrl) {
      return envBackendUrl;
    } else if (currentUrl.includes('localhost') || currentUrl.includes('127.0.0.1')) {
      return 'http://localhost:5000';
    } else {
      // For production deployments, try the same origin
      return currentUrl.replace(/^https/, 'http');
    }
  }

  createMockSocket() {
    const mockSocket = {
      on: (event, callback) => {
        console.debug(`Mock socket: Registered listener for ${event}`);
        return mockSocket;
      },
      off: (event) => {
        console.debug(`Mock socket: Removed listener for ${event}`);
        return mockSocket;
      },
      emit: (event, data) => {
        console.debug(`Mock socket: Emitting ${event}`, data);
        return mockSocket;
      },
      disconnect: () => {
        console.debug("Mock socket: Disconnected");
        return mockSocket;
      },
      connected: false,
      id: 'mock-socket-' + Date.now()
    };

    this.socket = mockSocket;
    this.isConnected = false;
    this.fallbackMode = true;

    return mockSocket;
  }

  setupEventHandlers() {
    if (!this.socket) return;

    this.socket.on("connect", () => {
      console.debug("Socket connected successfully", this.socket.id);
      this.isConnected = true;
      this.reconnectAttempts = 0;
      this.lastError = null;

      if (this.connectionTimeout) {
        clearTimeout(this.connectionTimeout);
        this.connectionTimeout = null;
      }
    });

    this.socket.on("disconnect", (reason) => {
      console.debug("Socket disconnected:", reason);
      this.isConnected = false;

      // Don't attempt reconnection for certain reasons
      if (reason === "io server disconnect" || reason === "io client disconnect") {
        console.debug("Disconnect was intentional, not attempting reconnection");
        return;
      }

      this.attemptReconnection();
    });

    this.socket.on("connect_error", (error) => {
      console.warn("Socket connection error:", error.message);
      this.lastError = error;
      this.handleConnectionFailure(error.message);
    });

    this.socket.on("error", (error) => {
      console.warn("Socket error:", error);
      this.lastError = error;
    });

    this.socket.on("reconnect", () => {
      console.debug("Socket reconnected successfully");
      this.isConnected = true;
      this.reconnectAttempts = 0;
    });

    this.socket.on("reconnect_error", (error) => {
      console.warn("Socket reconnection error:", error.message);
      this.reconnectAttempts++;

      if (this.reconnectAttempts >= this.maxReconnectAttempts) {
        console.warn("Max reconnection attempts reached, switching to mock mode");
        this.fallbackMode = true;
        this.disconnect();
      }
    });
  }

  handleConnectionFailure(reason) {
    this.reconnectAttempts++;
    console.warn(`Socket connection failed (attempt ${this.reconnectAttempts}): ${reason}`);

    if (this.connectionTimeout) {
      clearTimeout(this.connectionTimeout);
      this.connectionTimeout = null;
    }

    if (this.reconnectAttempts >= this.maxReconnectAttempts) {
      console.warn("Max connection attempts reached, switching to mock mode");
      this.fallbackMode = true;
      this.disconnect();
      return;
    }

    // Try fallback to polling-only on WebSocket failure
    if (this.useWebSocket && reason.toLowerCase().includes('websocket')) {
      console.info("WebSocket failed, trying polling transport only");
      this.useWebSocket = false;
      this.attemptReconnection();
    }
  }

  attemptReconnection() {
    if (this.reconnectTimeout) {
      clearTimeout(this.reconnectTimeout);
    }

    if (this.reconnectAttempts < this.maxReconnectAttempts && !this.fallbackMode) {
      const delay = Math.min(1000 * Math.pow(2, this.reconnectAttempts), 10000);
      console.debug(`Attempting reconnection in ${delay}ms`);

      this.reconnectTimeout = setTimeout(() => {
        if (this.socket) {
          this.disconnect();
        }
        this.connect();
      }, delay);
    }
  }
        console.warn(
          "Socket.io-client not available. Please install: npm install socket.io-client",
        );
        return null;
      }

      // Connect to backend server
      this.socket = io(
        import.meta.env.VITE_BACKEND_URL || "http://localhost:5000",
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