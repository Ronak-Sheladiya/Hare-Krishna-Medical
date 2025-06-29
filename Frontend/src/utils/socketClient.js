import { io } from "socket.io-client";
import { getSocketURL, isProduction, isDevelopment } from "./config.js";

let socket = null;
let connectionAttempts = 0;
const MAX_RECONNECT_ATTEMPTS = 5;
let isConnecting = false;
let fallbackMode = false;

// Enhanced socket client with proper error handling and reconnection
const socketClient = {
  connect(userToken = null, userRole = null) {
    // Prevent multiple simultaneous connection attempts
    if (isConnecting) {
      return socket;
    }

    // Return existing socket if already connected
    if (socket && socket.connected) {
      return socket;
    }

    // In production, disable Socket.IO entirely for reliability
    if (isProduction()) {
      console.log(
        "🚨 Production environment detected: Socket.IO disabled for reliability",
      );
      console.log("💡 App will work with manual refresh for updates");
      fallbackMode = true;
      isConnecting = false;
      this.notifyFallbackMode(
        "Socket.IO disabled in production for reliability",
      );
      return null;
    }

    isConnecting = true;

    try {
      const SOCKET_URL = getSocketURL();

      // Production environment check - if backend URL is localhost in production, go to fallback mode
      if (isProduction() && SOCKET_URL.includes("localhost")) {
        console.warn(
          "🚨 Production environment detected with localhost backend URL. Entering fallback mode.",
        );
        fallbackMode = true;
        isConnecting = false;
        this.notifyFallbackMode("Localhost URL in production");
        return null;
      }

      console.log("🔌 Attempting to connect to WebSocket:", SOCKET_URL);

      // Test backend connectivity first (but don't block on it in production)
      const healthCheckPromise = fetch(
        `${SOCKET_URL.replace("/socket.io", "")}/api/health`,
        { timeout: 3000 },
      )
        .then((response) => {
          if (response.ok) {
            console.log("✅ Backend server is reachable");
          } else {
            console.warn("⚠️ Backend server responded with:", response.status);
          }
        })
        .catch((error) => {
          console.warn("⚠️ Backend server health check failed:", error.message);
          if (isProduction()) {
            console.warn(
              "🚨 Production: Backend unreachable, will try Socket.IO anyway",
            );
          }
        });

      socket = io(SOCKET_URL, {
        transports: ["polling", "websocket"], // Try polling first, then websocket
        timeout: isProduction() ? 8000 : 15000, // Shorter timeout in production
        forceNew: true,
        autoConnect: true,
        auth: {
          token: userToken,
          role: userRole,
        },
        withCredentials: true,
        reconnection: isProduction() ? false : true, // Disable auto-reconnection in production
        reconnectionDelay: 1000,
        reconnectionAttempts: isProduction() ? 1 : 3, // Only 1 attempt in production
        upgrade: true,
        // Polling specific options
        polling: {
          timeout: isProduction() ? 5000 : 10000,
        },
        // Additional options for reliability
        rememberUpgrade: false,
        rejectUnauthorized: false,
      });

      // Connection successful
      socket.on("connect", () => {
        console.log("✅ WebSocket Connected:", socket.id);
        connectionAttempts = 0;
        isConnecting = false;
        fallbackMode = false;

        // Join appropriate room based on role
        if (userRole === 1) {
          socket.emit("join-admin-room");
          console.log("👨‍💼 Joined admin room");
        } else if (userToken) {
          socket.emit("join-user-room", userToken);
          console.log("👤 Joined user room");
        }
      });

      // Connection error handling
      socket.on("connect_error", (err) => {
        console.error("❌ Socket connection error:", err.message);
        connectionAttempts++;
        isConnecting = false;

        if (connectionAttempts >= MAX_RECONNECT_ATTEMPTS) {
          console.warn(
            "🔄 Max reconnection attempts reached, entering fallback mode",
          );
          console.log("💡 App will continue to work without real-time updates");
          fallbackMode = true;
          socket?.disconnect();
          socket = null;

          // Notify about fallback mode
          this.notifyFallbackMode("Max reconnection attempts reached");
        }
      });

      // Disconnection handling
      socket.on("disconnect", (reason) => {
        console.log("❌ WebSocket Disconnected:", reason);
        isConnecting = false;

        if (
          reason === "io server disconnect" ||
          reason === "io client disconnect"
        ) {
          // Server initiated disconnect or manual disconnect - don't reconnect automatically
          socket = null;
        } else {
          // Network issue - will auto-reconnect
          setTimeout(
            () => {
              if (
                connectionAttempts < MAX_RECONNECT_ATTEMPTS &&
                !fallbackMode
              ) {
                this.connect(userToken, userRole);
              }
            },
            Math.min(1000 * Math.pow(2, connectionAttempts), 10000),
          ); // Exponential backoff
        }
      });

      // Reconnection attempt
      socket.on("reconnect", (attemptNumber) => {
        console.log(
          "🔄 WebSocket Reconnected after",
          attemptNumber,
          "attempts",
        );
        connectionAttempts = 0;
        fallbackMode = false;
      });

      // Reconnection failed
      socket.on("reconnect_failed", () => {
        console.error("❌ WebSocket Reconnection failed completely");
        fallbackMode = true;
        socket = null;
      });

      return socket;
    } catch (error) {
      console.error("❌ Socket initialization error:", error);
      isConnecting = false;
      fallbackMode = true;
      return null;
    }
  },

  disconnect() {
    if (socket) {
      console.log("🔌 Manually disconnecting WebSocket");
      socket.disconnect();
      socket = null;
    }
    isConnecting = false;
    connectionAttempts = 0;
  },

  getSocket() {
    return socket;
  },

  // Check if socket is connected
  isConnected() {
    return socket && socket.connected;
  },

  // Get connection status
  getConnectionStatus() {
    return {
      connected: this.isConnected(),
      fallbackMode,
      connectionAttempts,
      socketId: socket?.id || null,
    };
  },

  // Emit event with fallback handling
  emit(event, data, callback) {
    if (fallbackMode) {
      // In fallback mode, just acknowledge the event without doing anything
      if (callback) callback({ success: true, fallback: true });
      return false;
    }

    if (this.isConnected()) {
      socket.emit(event, data, callback);
      return true;
    } else {
      console.warn("⚠️ Socket not connected, event not sent:", event);
      if (callback) callback({ error: "Socket not connected" });
      return false;
    }
  },

  // Listen to events
  on(event, callback) {
    if (fallbackMode) {
      // In fallback mode, don't set up event listeners
      return;
    }

    if (socket) {
      socket.on(event, callback);
    } else {
      console.warn("⚠️ Socket not available, cannot listen to event:", event);
    }
  },

  // Remove event listener
  off(event, callback) {
    if (socket) {
      socket.off(event, callback);
    }
  },

  // Notify about fallback mode
  notifyFallbackMode(reason) {
    console.warn("🚨 Entering Socket.IO fallback mode:", reason);
    if (typeof window !== "undefined") {
      window.dispatchEvent(
        new CustomEvent("socket-fallback-mode", {
          detail: { reason, timestamp: new Date().toISOString() },
        }),
      );
    }
  },

  // Force reconnection (but respect production limits)
  forceReconnect(userToken = null, userRole = null) {
    console.log("🔄 Attempting to force WebSocket reconnection");

    // In production, Socket.IO is disabled entirely
    if (isProduction()) {
      console.log(
        "🚨 Production: Socket.IO is disabled, staying in fallback mode",
      );
      console.log("💡 Use the refresh button to update data manually");
      return null;
    }

    this.disconnect();
    connectionAttempts = 0;
    fallbackMode = false;
    return this.connect(userToken, userRole);
  },
};

export default socketClient;
