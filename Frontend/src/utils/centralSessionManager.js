import store from "../store/store.js";
import {
  loginSuccess,
  logout,
  refreshSession,
  updateUser,
} from "../store/slices/authSlice.js";

/**
 * Central Session Manager for Hare Krishna Medical
 * Handles all session management across the entire website
 * Features:
 * - Cross-tab synchronization
 * - Auto login/logout
 * - Session validation
 * - Real-time updates
 * - Error handling
 */
class CentralSessionManager {
  constructor() {
    this.isInitialized = false;
    this.tabId = this.generateUniqueTabId();
    this.broadcastChannel = null;
    this.sessionCheckInterval = null;
    this.visibilityCheckInterval = null;
    this.lastActivity = Date.now();
    this.listeners = [];

    // Configuration
    this.config = {
      sessionCheckInterval: 30000, // 30 seconds
      visibilityCheckInterval: 5000, // 5 seconds
      maxSessionAge: {
        localStorage: 7 * 24 * 60 * 60 * 1000, // 7 days
        sessionStorage: 4 * 60 * 60 * 1000, // 4 hours
      },
      inactivityTimeout: 2 * 60 * 60 * 1000, // 2 hours
      heartbeatInterval: 60000, // 1 minute
    };

    this.initialize();
  }

  generateUniqueTabId() {
    return `hk_tab_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  initialize() {
    if (this.isInitialized) return;

    console.log(
      `🚀 [HK Medical] Initializing Central Session Manager - Tab: ${this.tabId}`,
    );

    try {
      this.setupBroadcastChannel();
      this.setupStorageListeners();
      this.setupActivityTracking();
      this.setupSessionMonitoring();
      this.setupVisibilityHandling();
      this.performInitialSessionCheck();

      this.isInitialized = true;
      console.log(
        `✅ [HK Medical] Central Session Manager Ready - Tab: ${this.tabId}`,
      );
    } catch (error) {
      console.error(
        "❌ [HK Medical] Failed to initialize session manager:",
        error,
      );
    }
  }

  setupBroadcastChannel() {
    try {
      if (typeof BroadcastChannel !== "undefined") {
        this.broadcastChannel = new BroadcastChannel(
          "hk_medical_central_session",
        );

        this.broadcastChannel.onmessage = (event) => {
          this.handleBroadcastMessage(event.data);
        };

        console.log("📡 [HK Medical] BroadcastChannel initialized");
      } else {
        console.warn(
          "⚠️ [HK Medical] BroadcastChannel not supported, using localStorage fallback",
        );
      }
    } catch (error) {
      console.warn("⚠️ [HK Medical] BroadcastChannel setup failed:", error);
    }
  }

  setupStorageListeners() {
    const storageHandler = (event) => {
      this.handleStorageChange(event);
    };

    window.addEventListener("storage", storageHandler);
    this.listeners.push({ type: "storage", handler: storageHandler });

    // Listen for page unload to cleanup
    const unloadHandler = () => {
      this.cleanup();
    };

    window.addEventListener("beforeunload", unloadHandler);
    this.listeners.push({ type: "beforeunload", handler: unloadHandler });
  }

  setupActivityTracking() {
    const activityEvents = [
      "mousedown",
      "mousemove",
      "keypress",
      "scroll",
      "touchstart",
      "click",
    ];

    const updateActivity = () => {
      this.lastActivity = Date.now();
      this.updateHeartbeat();
    };

    activityEvents.forEach((event) => {
      document.addEventListener(event, updateActivity, { passive: true });
      this.listeners.push({ type: event, handler: updateActivity });
    });
  }

  setupSessionMonitoring() {
    // Main session check interval
    this.sessionCheckInterval = setInterval(() => {
      this.performSessionCheck();
    }, this.config.sessionCheckInterval);

    // Heartbeat interval to keep session alive
    setInterval(() => {
      this.sendHeartbeat();
    }, this.config.heartbeatInterval);
  }

  setupVisibilityHandling() {
    const visibilityHandler = () => {
      if (!document.hidden) {
        this.performSessionCheck();
      }
    };

    const focusHandler = () => {
      this.performSessionCheck();
    };

    document.addEventListener("visibilitychange", visibilityHandler);
    window.addEventListener("focus", focusHandler);

    this.listeners.push({
      type: "visibilitychange",
      handler: visibilityHandler,
    });
    this.listeners.push({ type: "focus", handler: focusHandler });
  }

  handleBroadcastMessage(data) {
    if (!data || data.tabId === this.tabId) return;

    console.log(`📨 [HK Medical] Received: ${data.type} from ${data.tabId}`);

    switch (data.type) {
      case "SESSION_LOGIN":
        this.handleRemoteLogin(data.payload);
        break;
      case "SESSION_LOGOUT":
        this.handleRemoteLogout();
        break;
      case "SESSION_UPDATE":
        this.handleRemoteUpdate(data.payload);
        break;
      case "SESSION_HEARTBEAT":
        this.handleRemoteHeartbeat(data.payload);
        break;
      case "SESSION_EXPIRED":
        this.handleRemoteExpiry();
        break;
    }
  }

  handleStorageChange(event) {
    const { key, newValue, oldValue } = event;

    switch (key) {
      case "isAuthenticated":
        this.handleAuthStatusChange(newValue, oldValue);
        break;
      case "user":
        this.handleUserDataChange(newValue, oldValue);
        break;
      case "hk_session_event":
        this.handleSessionEvent(newValue);
        break;
      case "loginTime":
        this.handleLoginTimeChange(newValue);
        break;
    }
  }

  handleAuthStatusChange(newValue, oldValue) {
    const currentState = store.getState().auth;

    if (newValue === "false" || newValue === null) {
      if (currentState.isAuthenticated) {
        console.log("🔓 [HK Medical] Auto-logout: Auth status changed");
        store.dispatch(logout());
      }
    } else if (newValue === "true" && !currentState.isAuthenticated) {
      this.attemptAutoLogin();
    }
  }

  handleUserDataChange(newValue, oldValue) {
    const currentState = store.getState().auth;

    if (
      newValue === null &&
      oldValue !== null &&
      currentState.isAuthenticated
    ) {
      console.log("🔓 [HK Medical] Auto-logout: User data cleared");
      store.dispatch(logout());
    } else if (newValue && !currentState.isAuthenticated) {
      this.attemptAutoLogin();
    }
  }

  handleLoginTimeChange(newValue) {
    // Handle login time changes across tabs
    if (newValue && newValue !== null) {
      const currentState = store.getState().auth;
      if (currentState.isAuthenticated) {
        console.log("🕒 [HK Medical] Login time updated across tabs");
        // Optionally trigger session validation or refresh
      }
    }
  }

  handleSessionEvent(eventData) {
    if (!eventData) return;

    try {
      const event = JSON.parse(eventData);
      if (Date.now() - event.timestamp < 5000) {
        this.handleBroadcastMessage(event);
      }
    } catch (error) {
      console.warn("⚠️ [HK Medical] Failed to parse session event:", error);
    }
  }

  handleRemoteLogin(payload) {
    const currentState = store.getState().auth;

    if (
      !currentState.isAuthenticated ||
      currentState.user?.id !== payload.user.id
    ) {
      console.log("🔑 [HK Medical] Auto-login from remote tab");

      store.dispatch(
        loginSuccess({
          user: payload.user,
          token: payload.token,
          rememberMe: payload.rememberMe,
          skipRedirect: true,
        }),
      );
    }
  }

  handleRemoteLogout() {
    const currentState = store.getState().auth;

    if (currentState.isAuthenticated) {
      console.log("🔓 [HK Medical] Auto-logout from remote tab");
      store.dispatch(logout());
    }
  }

  handleRemoteUpdate(payload) {
    const currentState = store.getState().auth;

    if (
      currentState.isAuthenticated &&
      currentState.user?.id === payload.user.id
    ) {
      console.log("🔄 [HK Medical] User data updated from remote tab");
      store.dispatch(updateUser(payload.user));
    }
  }

  handleRemoteHeartbeat(payload) {
    // Handle session heartbeat from other tabs
    if (payload && payload.timestamp) {
      const timeDiff = Date.now() - payload.timestamp;
      if (timeDiff < 30000) {
        // Within 30 seconds
        this.updateSessionTimestamp();
      }
    }
  }

  performInitialSessionCheck() {
    setTimeout(() => {
      this.performSessionCheck();
    }, 100);
  }

  performSessionCheck() {
    const currentState = store.getState().auth;

    if (currentState.isAuthenticated) {
      this.validateCurrentSession();
    } else {
      this.attemptAutoLogin();
    }
  }

  validateCurrentSession() {
    const currentState = store.getState().auth;

    if (!this.isSessionValid()) {
      console.log("⏰ [HK Medical] Session expired");
      this.broadcastSessionExpiry();
      store.dispatch(logout());
      return;
    }

    // Check if storage data is consistent
    const storedAuth = this.getStoredAuthStatus();
    const storedUser = this.getStoredUser();

    if (!storedAuth || !storedUser) {
      console.log("💾 [HK Medical] Storage inconsistency detected");
      store.dispatch(logout());
      return;
    }

    // Update session timestamp
    this.updateSessionTimestamp();
  }

  attemptAutoLogin() {
    const storedUser = this.getStoredUser();
    const storedAuth = this.getStoredAuthStatus();
    const storedToken = this.getStoredToken();

    if (storedUser && storedAuth && this.isSessionValid()) {
      try {
        console.log("🔑 [HK Medical] Performing auto-login");

        store.dispatch(
          loginSuccess({
            user: JSON.parse(storedUser),
            token: storedToken,
            rememberMe: localStorage.getItem("user") !== null,
            skipRedirect: true,
          }),
        );
      } catch (error) {
        console.error("❌ [HK Medical] Auto-login failed:", error);
        this.clearCorruptedSession();
      }
    }
  }

  isSessionValid() {
    const loginTime = this.getStoredLoginTime();
    if (!loginTime) return false;

    const elapsed = Date.now() - parseInt(loginTime);
    const isLocalStorage = localStorage.getItem("user") !== null;
    const maxAge = isLocalStorage
      ? this.config.maxSessionAge.localStorage
      : this.config.maxSessionAge.sessionStorage;

    // Check for inactivity (only for session storage)
    if (!isLocalStorage) {
      const inactiveTime = Date.now() - this.lastActivity;
      if (inactiveTime > this.config.inactivityTimeout) {
        return false;
      }
    }

    return elapsed < maxAge;
  }

  // Storage Helper Methods
  getStoredUser() {
    return localStorage.getItem("user") || sessionStorage.getItem("user");
  }

  getStoredAuthStatus() {
    return (
      localStorage.getItem("isAuthenticated") === "true" ||
      sessionStorage.getItem("isAuthenticated") === "true"
    );
  }

  getStoredToken() {
    return localStorage.getItem("token") || sessionStorage.getItem("token");
  }

  getStoredLoginTime() {
    return (
      localStorage.getItem("loginTime") || sessionStorage.getItem("loginTime")
    );
  }

  updateSessionTimestamp() {
    const storage = localStorage.getItem("user")
      ? localStorage
      : sessionStorage;
    storage.setItem("loginTime", Date.now().toString());
  }

  updateHeartbeat() {
    const storage = localStorage.getItem("user")
      ? localStorage
      : sessionStorage;
    storage.setItem("lastActivity", Date.now().toString());
  }

  clearCorruptedSession() {
    console.log("🧹 [HK Medical] Clearing corrupted session data");

    const storageKeys = [
      "user",
      "token",
      "isAuthenticated",
      "loginTime",
      "lastActivity",
    ];

    storageKeys.forEach((key) => {
      localStorage.removeItem(key);
      sessionStorage.removeItem(key);
    });
  }

  // Broadcasting Methods
  broadcastLogin(user, token, rememberMe) {
    this.broadcast({
      type: "SESSION_LOGIN",
      payload: { user, token, rememberMe },
    });
  }

  broadcastLogout() {
    this.broadcast({
      type: "SESSION_LOGOUT",
    });
  }

  broadcastUserUpdate(user) {
    this.broadcast({
      type: "SESSION_UPDATE",
      payload: { user },
    });
  }

  broadcastSessionExpiry() {
    this.broadcast({
      type: "SESSION_EXPIRED",
    });
  }

  sendHeartbeat() {
    if (store.getState().auth.isAuthenticated) {
      this.broadcast({
        type: "SESSION_HEARTBEAT",
        payload: { tabId: this.tabId, timestamp: Date.now() },
      });
    }
  }

  broadcast(message) {
    const fullMessage = {
      ...message,
      tabId: this.tabId,
      timestamp: Date.now(),
    };

    try {
      // Use BroadcastChannel if available
      if (this.broadcastChannel) {
        this.broadcastChannel.postMessage(fullMessage);
      }

      // Fallback to localStorage
      localStorage.setItem("hk_session_event", JSON.stringify(fullMessage));

      // Clean up the event
      setTimeout(() => {
        try {
          localStorage.removeItem("hk_session_event");
        } catch (e) {}
      }, 1000);
    } catch (error) {
      console.warn("⚠️ [HK Medical] Broadcast failed:", error);
    }
  }

  // Public API Methods
  extendSession() {
    this.lastActivity = Date.now();
    this.updateSessionTimestamp();
    this.updateHeartbeat();

    const currentState = store.getState().auth;
    if (currentState.isAuthenticated) {
      store.dispatch(refreshSession());
    }
  }

  forceLogout(reason = "Manual logout") {
    console.log(`🔓 [HK Medical] Force logout: ${reason}`);
    this.broadcastLogout();
    store.dispatch(logout());
  }

  getSessionInfo() {
    const currentState = store.getState().auth;
    return {
      isAuthenticated: currentState.isAuthenticated,
      user: currentState.user,
      tabId: this.tabId,
      lastActivity: this.lastActivity,
      sessionValid: this.isSessionValid(),
      sessionAge: this.getStoredLoginTime()
        ? Date.now() - parseInt(this.getStoredLoginTime())
        : 0,
    };
  }

  cleanup() {
    console.log("🧹 [HK Medical] Cleaning up session manager");

    if (this.sessionCheckInterval) {
      clearInterval(this.sessionCheckInterval);
    }

    if (this.visibilityCheckInterval) {
      clearInterval(this.visibilityCheckInterval);
    }

    if (this.broadcastChannel) {
      this.broadcastChannel.close();
    }

    // Remove all event listeners
    this.listeners.forEach(({ type, handler }) => {
      if (type === "storage" || type === "beforeunload" || type === "focus") {
        window.removeEventListener(type, handler);
      } else if (type === "visibilitychange") {
        document.removeEventListener(type, handler);
      } else {
        document.removeEventListener(type, handler);
      }
    });

    this.listeners = [];
    this.isInitialized = false;
  }

  destroy() {
    this.cleanup();
  }
}

// Create singleton instance
const centralSessionManager = new CentralSessionManager();

// Subscribe to Redux store changes to broadcast them
let previousAuthState = null;

store.subscribe(() => {
  const currentAuthState = store.getState().auth;

  if (previousAuthState === null) {
    previousAuthState = { ...currentAuthState };
    return;
  }

  // Detect login
  if (!previousAuthState.isAuthenticated && currentAuthState.isAuthenticated) {
    const token = centralSessionManager.getStoredToken();
    centralSessionManager.broadcastLogin(
      currentAuthState.user,
      token,
      currentAuthState.rememberMe,
    );
  }

  // Detect logout
  if (previousAuthState.isAuthenticated && !currentAuthState.isAuthenticated) {
    centralSessionManager.broadcastLogout();
  }

  // Detect user update
  if (
    previousAuthState.isAuthenticated &&
    currentAuthState.isAuthenticated &&
    JSON.stringify(previousAuthState.user) !==
      JSON.stringify(currentAuthState.user)
  ) {
    centralSessionManager.broadcastUserUpdate(currentAuthState.user);
  }

  previousAuthState = { ...currentAuthState };
});

// Export singleton and utility functions
export default centralSessionManager;

export const { extendSession, forceLogout, getSessionInfo } =
  centralSessionManager;

console.log("🌟 [HK Medical] Central Session Manager Module Loaded");
