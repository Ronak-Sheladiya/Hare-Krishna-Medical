import { io } from "socket.io-client";

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

    isConnecting = true;

    try {
      let SOCKET_URL =
        import.meta.env.VITE_BACKEND_URL || "http://localhost:5000";

      // Production environment check - if backend URL is localhost in production, go to fallback mode
      const isProduction =
        window.location.hostname.includes("fly.dev") ||
        window.location.hostname.includes("vercel.app") ||
        window.location.hostname.includes("netlify.app");

      if (isProduction && SOCKET_URL.includes("localhost")) {
        console.warn(
          "🚨 Production environment detected with localhost backend URL. Entering fallback mode.",
        );
        fallbackMode = true;
        isConnecting = false;
        return null;
      }

      console.log("🔌 Attempting to connect to WebSocket:", SOCKET_URL);

      socket = io(SOCKET_URL, {
        transports: ["websocket", "polling"], // Fallback to polling if websocket fails
        timeout: 20000,
        forceNew: true,
        autoConnect: true,
        auth: {
          token: userToken,
          role: userRole,
        },
        withCredentials: true,
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
          fallbackMode = true;
          socket?.disconnect();
          socket = null;
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

  // Force reconnection
  forceReconnect(userToken = null, userRole = null) {
    console.log("🔄 Forcing WebSocket reconnection");
    this.disconnect();
    connectionAttempts = 0;
    fallbackMode = false;
    return this.connect(userToken, userRole);
  },
};

export default socketClient;
