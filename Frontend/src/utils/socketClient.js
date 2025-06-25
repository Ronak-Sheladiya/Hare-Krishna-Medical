// Real-time socket client with robust error handling and fallback mechanisms
let io = null;
let socketAvailable = false;

// Create a mock socket for fallback when real socket isn't available
const createMockSocket = () => ({
  on: (event, callback) => {
    console.debug(`Mock socket: Registered listener for ${event}`);
    return this;
  },
  off: (event) => {
    console.debug(`Mock socket: Removed listener for ${event}`);
    return this;
  },
  emit: (event, data) => {
    console.debug(`Mock socket: Emitting ${event}`, data);
    return this;
  },
  connect: () => {
    console.debug("Mock socket: Connected");
    return this;
  },
  disconnect: () => {
    console.debug("Mock socket: Disconnected");
    return this;
  },
  connected: false,
  id: "mock-socket-" + Date.now(),
});

// Initialize socket.io with proper error handling
if (typeof window !== "undefined") {
  // Dynamically import socket.io-client
  import("socket.io-client")
    .then((socketio) => {
      io = socketio.io;
      socketAvailable = true;
      console.debug("Socket.io-client loaded successfully");
    })
    .catch((error) => {
      console.info("Socket.io-client not installed:", error.message);
      console.info("Install with: npm install socket.io-client");
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
    this.eventListeners = new Map();
  }

  connect(token = null, role = 0) {
    // Browser environment check
    if (!this.isBrowser) {
      console.debug("Socket client requires browser environment");
      return this.createMockSocketInstance();
    }

    // Return existing connection if available
    if (this.socket && this.isConnected) {
      return this.socket;
    }

    // Use mock socket if in fallback mode or max attempts reached
    if (
      this.fallbackMode ||
      this.reconnectAttempts >= this.maxReconnectAttempts
    ) {
      console.info("Using mock socket due to connection issues");
      return this.createMockSocketInstance();
    }

    try {
      // Check socket.io availability
      if (!io || typeof io !== "function" || !socketAvailable) {
        console.info("Socket.io not available, using mock socket");
        this.fallbackMode = true;
        return this.createMockSocketInstance();
      }

      const socketUrl = this.getSocketUrl();
      const socketOptions = this.getSocketOptions();

      console.debug(`Connecting to socket: ${socketUrl}`);

      this.socket = io(socketUrl, socketOptions);
      this.setupEventHandlers(token, role);
      this.setConnectionTimeout();

      return this.socket;
    } catch (error) {
      console.error("Socket connection failed:", error);
      this.lastError = error;
      this.handleConnectionFailure(error.message);
      return this.createMockSocketInstance();
    }
  }

  getSocketUrl() {
    // Priority order for socket URL determination
    const envSocketUrl = import.meta.env?.VITE_SOCKET_URL;
    const envBackendUrl = import.meta.env?.VITE_BACKEND_URL;
    const currentOrigin = this.isBrowser ? window.location.origin : "";

    if (envSocketUrl) {
      return envSocketUrl;
    }

    if (envBackendUrl) {
      return envBackendUrl;
    }

    // Local development fallback
    if (
      currentOrigin.includes("localhost") ||
      currentOrigin.includes("127.0.0.1")
    ) {
      return "http://localhost:5000";
    }

    // Production fallback - try same origin
    return currentOrigin || "http://localhost:5000";
  }

  getSocketOptions() {
    return {
      transports: this.useWebSocket ? ["websocket", "polling"] : ["polling"],
      timeout: 10000,
      forceNew: false,
      reconnection: true,
      reconnectionAttempts: this.maxReconnectAttempts,
      reconnectionDelay: 2000,
      autoConnect: true,
      upgrade: this.useWebSocket,
      rememberUpgrade: false,
    };
  }

  createMockSocketInstance() {
    const mockSocket = {
      on: (event, callback) => {
        console.debug(`Mock socket: Registered listener for ${event}`);
        // Store listeners for potential future use
        if (!this.eventListeners.has(event)) {
          this.eventListeners.set(event, []);
        }
        this.eventListeners.get(event).push(callback);
        return mockSocket;
      },
      off: (event, callback) => {
        console.debug(`Mock socket: Removed listener for ${event}`);
        if (this.eventListeners.has(event)) {
          const listeners = this.eventListeners.get(event);
          const index = listeners.indexOf(callback);
          if (index > -1) {
            listeners.splice(index, 1);
          }
        }
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
      id: "mock-socket-" + Date.now(),
    };

    this.socket = mockSocket;
    this.isConnected = false;
    this.fallbackMode = true;

    return mockSocket;
  }

  setupEventHandlers(token, role) {
    if (!this.socket) return;

    this.socket.on("connect", () => {
      console.debug("Socket connected:", this.socket.id);
      this.isConnected = true;
      this.reconnectAttempts = 0;
      this.lastError = null;
      this.clearConnectionTimeout();

      // Send authentication if token provided
      if (token) {
        this.socket.emit("authenticate", { token, role });
      }
    });

    this.socket.on("disconnect", (reason) => {
      console.debug("Socket disconnected:", reason);
      this.isConnected = false;

      // Don't reconnect for intentional disconnections
      if (
        reason === "io server disconnect" ||
        reason === "io client disconnect"
      ) {
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

    this.socket.on("reconnect", (attemptNumber) => {
      console.debug("Socket reconnected after", attemptNumber, "attempts");
      this.isConnected = true;
      this.reconnectAttempts = 0;
    });

    this.socket.on("reconnect_error", (error) => {
      console.warn("Socket reconnection failed:", error.message);
      this.reconnectAttempts++;

      if (this.reconnectAttempts >= this.maxReconnectAttempts) {
        console.warn("Max reconnection attempts reached");
        this.fallbackMode = true;
        this.disconnect();
      }
    });
  }

  setConnectionTimeout() {
    this.connectionTimeout = setTimeout(() => {
      if (!this.isConnected) {
        console.warn("Socket connection timeout");
        this.handleConnectionFailure("Connection timeout");
      }
    }, 15000);
  }

  clearConnectionTimeout() {
    if (this.connectionTimeout) {
      clearTimeout(this.connectionTimeout);
      this.connectionTimeout = null;
    }
  }

  handleConnectionFailure(reason) {
    this.reconnectAttempts++;
    console.warn(
      `Connection failed (attempt ${this.reconnectAttempts}): ${reason}`,
    );

    this.clearConnectionTimeout();

    if (this.reconnectAttempts >= this.maxReconnectAttempts) {
      console.warn("Switching to fallback mode");
      this.fallbackMode = true;
      this.disconnect();
      return;
    }

    // Try polling-only if WebSocket fails
    if (
      this.useWebSocket &&
      (reason.toLowerCase().includes("websocket") ||
        reason.toLowerCase().includes("transport"))
    ) {
      console.info("WebSocket failed, trying polling transport");
      this.useWebSocket = false;
      this.attemptReconnection();
    }
  }

  attemptReconnection() {
    if (this.reconnectTimeout) {
      clearTimeout(this.reconnectTimeout);
    }

    if (
      this.reconnectAttempts < this.maxReconnectAttempts &&
      !this.fallbackMode
    ) {
      const delay = Math.min(1000 * Math.pow(2, this.reconnectAttempts), 10000);
      console.debug(`Reconnecting in ${delay}ms`);

      this.reconnectTimeout = setTimeout(() => {
        this.disconnect();
        this.connect();
      }, delay);
    }
  }

  disconnect() {
    this.clearConnectionTimeout();

    if (this.reconnectTimeout) {
      clearTimeout(this.reconnectTimeout);
      this.reconnectTimeout = null;
    }

    if (this.socket && typeof this.socket.disconnect === "function") {
      this.socket.disconnect();
    }

    this.socket = null;
    this.isConnected = false;
  }

  // Utility methods for external use
  on(event, callback) {
    if (this.socket && typeof this.socket.on === "function") {
      return this.socket.on(event, callback);
    }
    return this.createMockSocketInstance().on(event, callback);
  }

  off(event, callback) {
    if (this.socket && typeof this.socket.off === "function") {
      return this.socket.off(event, callback);
    }
    return this.createMockSocketInstance().off(event, callback);
  }

  emit(event, data) {
    if (this.socket && typeof this.socket.emit === "function") {
      return this.socket.emit(event, data);
    }
    return this.createMockSocketInstance().emit(event, data);
  }

  getConnectionStatus() {
    return {
      connected: this.isConnected,
      fallbackMode: this.fallbackMode,
      attempts: this.reconnectAttempts,
      lastError: this.lastError?.message || null,
      socketId: this.socket?.id || null,
    };
  }
}

// Create and export singleton instance
const socketClient = new SocketClient();

export default socketClient;

// Export additional utilities
export const getConnectionStatus = () => socketClient.getConnectionStatus();
export const forceReconnect = () => {
  socketClient.disconnect();
  return socketClient.connect();
};
