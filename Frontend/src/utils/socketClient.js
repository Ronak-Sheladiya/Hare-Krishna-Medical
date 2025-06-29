// Mock Socket Client for Frontend-Only Mode
// Provides Socket.IO API without actual backend connection

let fallbackMode = true;

// Mock socket client that simulates Socket.IO API without backend
const socketClient = {
  connect(userToken = null, userRole = null) {
    console.log("🎨 Frontend-only mode: Socket.IO mocked");
    fallbackMode = true;

    // Notify that we're in frontend-only mode
    this.notifyFrontendOnlyMode();
    return null;
  },

  disconnect() {
    console.log("🎨 Frontend-only mode: Mock disconnect");
  },

  getSocket() {
    return null;
  },

  // Check if socket is connected (always false in frontend-only mode)
  isConnected() {
    return false;
  },

  // Get connection status
  getConnectionStatus() {
    return {
      connected: false,
      fallbackMode: true,
      frontendOnly: true,
      connectionAttempts: 0,
      socketId: null,
    };
  },

  // Mock emit - just acknowledges without sending
  emit(event, data, callback) {
    console.log(`🎨 Frontend-only mode: Mock emit '${event}'`);
    if (callback) {
      callback({
        success: true,
        frontendOnly: true,
        message: "Frontend-only mode - no backend connection",
      });
    }
    return false;
  },

  // Mock event listener - does nothing
  on(event, callback) {
    console.log(`🎨 Frontend-only mode: Mock listener for '${event}'`);
  },

  // Mock remove listener - does nothing
  off(event, callback) {
    console.log(`🎨 Frontend-only mode: Mock remove listener for '${event}'`);
  },

  // Notify about frontend-only mode
  notifyFrontendOnlyMode() {
    console.log("🎨 Frontend-only mode: Real-time features disabled");
    if (typeof window !== "undefined") {
      window.dispatchEvent(
        new CustomEvent("frontend-only-mode", {
          detail: {
            reason: "Backend removed - frontend-only mode",
            timestamp: new Date().toISOString(),
          },
        }),
      );
    }
  },

  // Mock force reconnect - stays in frontend-only mode
  forceReconnect(userToken = null, userRole = null) {
    console.log("🎨 Frontend-only mode: Mock reconnect (no backend available)");
    return null;
  },
};

export default socketClient;
