// Simple socket client stub - replace with real implementation after installing socket.io-client

class SimpleSocketClient {
  constructor() {
    this.socket = null;
    this.isConnected = false;
    this.reconnectAttempts = 0;
    this.maxReconnectAttempts = 5;
    this.isBrowser = typeof window !== "undefined";

    console.log("🔌 Simple Socket Client initialized");
    console.log(
      "📦 To enable real-time features, install: npm install socket.io-client",
    );
  }

  connect(token = null, role = 0) {
    if (!this.isBrowser) {
      console.warn("Socket.io client can only run in browser environment");
      return null;
    }

    console.log("🔌 Socket connection requested (stub mode)");
    console.log("📦 Install socket.io-client to enable real-time features");

    // Mock connection
    this.isConnected = true;

    return {
      on: this.mockOn.bind(this),
      off: this.mockOff.bind(this),
      emit: this.mockEmit.bind(this),
      connect: this.mockConnect.bind(this),
      disconnect: this.mockDisconnect.bind(this),
      id: "mock-socket-id",
    };
  }

  mockOn(eventName, callback) {
    console.log(`📡 Mock: Listening for event '${eventName}'`);
  }

  mockOff(eventName, callback) {
    console.log(`📡 Mock: Stopped listening for event '${eventName}'`);
  }

  mockEmit(eventName, data) {
    console.log(`📡 Mock: Emitting event '${eventName}' with data:`, data);
  }

  mockConnect() {
    console.log("🔌 Mock: Socket connected");
    this.isConnected = true;
  }

  mockDisconnect() {
    console.log("🔌 Mock: Socket disconnected");
    this.isConnected = false;
  }

  setupEventListeners(role) {
    console.log(`📡 Mock: Setting up event listeners for role ${role}`);
  }

  showNotification(title, options) {
    if (!this.isBrowser) return;

    console.log(`🔔 Mock notification: ${title}`, options);

    try {
      if (typeof window !== "undefined" && "Notification" in window) {
        if (Notification.permission === "granted") {
          new Notification(title, options);
        } else if (Notification.permission !== "denied") {
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

  emitEvent(eventName, data) {
    console.log(`📡 Mock: Emit event '${eventName}'`, data);
  }

  on(eventName, callback) {
    console.log(`📡 Mock: Subscribe to event '${eventName}'`);
  }

  off(eventName, callback) {
    console.log(`📡 Mock: Unsubscribe from event '${eventName}'`);
  }

  disconnect() {
    this.mockDisconnect();
  }

  joinAdminRoom() {
    console.log("👨‍💼 Mock: Joined admin room");
  }

  joinUserRoom(userId) {
    console.log(`👤 Mock: Joined user room for user ${userId}`);
  }

  getConnectionStatus() {
    return {
      isConnected: this.isConnected,
      socketId: this.isConnected ? "mock-socket-id" : null,
    };
  }
}

// Create singleton instance
const simpleSocketClient = new SimpleSocketClient();

export default simpleSocketClient;
