import store from "../store/store.js";
import {
  loginSuccess,
  logout,
  refreshSession,
} from "../store/slices/authSlice.js";

class CrossTabSessionManager {
  constructor() {
    this.isInitialized = false;
    this.broadcastChannel = null;
    this.storageListeners = [];
    this.sessionCheckInterval = null;
    this.tabId = this.generateTabId();

    this.init();
  }

  generateTabId() {
    return `tab_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  init() {
    if (this.isInitialized) return;

    console.log(
      `🔄 Initializing cross-tab session manager for tab: ${this.tabId}`,
    );

    this.setupBroadcastChannel();
    this.setupStorageListeners();
    this.setupSessionCheck();
    this.checkInitialSession();

    this.isInitialized = true;
  }

  setupBroadcastChannel() {
    try {
      // Use BroadcastChannel for modern browsers
      if (typeof BroadcastChannel !== "undefined") {
        this.broadcastChannel = new BroadcastChannel("hk_medical_session");

        this.broadcastChannel.onmessage = (event) => {
          this.handleBroadcastMessage(event.data);
        };

        console.log("📡 BroadcastChannel initialized");
      }
    } catch (error) {
      console.warn(
        "BroadcastChannel not supported, using localStorage fallback",
      );
    }
  }

  setupStorageListeners() {
    const handleStorageChange = (event) => {
      this.handleStorageEvent(event);
    };

    window.addEventListener("storage", handleStorageChange);
    this.storageListeners.push(handleStorageChange);

    // Also listen for focus events to check session
    const handleFocus = () => {
      this.checkSession();
    };

    window.addEventListener("focus", handleFocus);
    document.addEventListener("visibilitychange", () => {
      if (!document.hidden) {
        this.checkSession();
      }
    });

    this.storageListeners.push(handleFocus);
  }

  setupSessionCheck() {
    // Check session every 30 seconds
    this.sessionCheckInterval = setInterval(() => {
      this.checkSession();
    }, 30000);
  }

  checkInitialSession() {
    // Check if there's an existing valid session
    setTimeout(() => {
      this.checkSession();
    }, 100);
  }

  handleBroadcastMessage(data) {
    if (!data || data.tabId === this.tabId) return; // Ignore own messages

    console.log("📨 Received broadcast:", data.type, "from tab:", data.tabId);

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
      case "SESSION_CHECK":
        this.respondToSessionCheck(data.tabId);
        break;
    }
  }

  handleStorageEvent(event) {
    const { key, newValue, oldValue } = event;

    // Handle direct storage changes
    if (key === "isAuthenticated") {
      if (newValue === "false" || newValue === null) {
        const currentState = store.getState().auth;
        if (currentState.isAuthenticated) {
          console.log("🔓 Auto-logout: isAuthenticated changed to false");
          store.dispatch(logout());
        }
      } else if (newValue === "true") {
        const currentState = store.getState().auth;
        if (!currentState.isAuthenticated) {
          this.autoLogin();
        }
      }
    }

    if (key === "user") {
      if (newValue === null && oldValue !== null) {
        const currentState = store.getState().auth;
        if (currentState.isAuthenticated) {
          console.log("🔓 Auto-logout: user data cleared");
          store.dispatch(logout());
        }
      } else if (newValue && !oldValue) {
        const currentState = store.getState().auth;
        if (!currentState.isAuthenticated) {
          this.autoLogin();
        }
      }
    }

    // Handle auth events (fallback for older browsers)
    if (key === "hk_medical_auth_event") {
      try {
        const authEvent = JSON.parse(newValue);
        if (
          authEvent &&
          authEvent.timestamp &&
          Date.now() - authEvent.timestamp < 5000
        ) {
          this.handleBroadcastMessage(authEvent);
        }
      } catch (error) {
        console.warn("Error parsing auth event:", error);
      }
    }
  }

  handleRemoteLogin(payload) {
    const currentState = store.getState().auth;

    if (
      !currentState.isAuthenticated ||
      !currentState.user ||
      currentState.user.id !== payload.user.id
    ) {
      console.log("🔑 Auto-login from another tab");

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
      console.log("🔓 Auto-logout from another tab");
      store.dispatch(logout());
    }
  }

  handleRemoteUpdate(payload) {
    const currentState = store.getState().auth;

    if (
      currentState.isAuthenticated &&
      currentState.user &&
      currentState.user.id === payload.user.id
    ) {
      console.log("🔄 Session updated from another tab");

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

  autoLogin() {
    const storedUser =
      localStorage.getItem("user") || sessionStorage.getItem("user");
    const isStoredAuth =
      localStorage.getItem("isAuthenticated") === "true" ||
      sessionStorage.getItem("isAuthenticated") === "true";
    const storedToken =
      localStorage.getItem("token") || sessionStorage.getItem("token");

    if (storedUser && isStoredAuth && this.isSessionValid()) {
      try {
        const userData = JSON.parse(storedUser);
        console.log("🔑 Auto-login: restoring session");

        store.dispatch(
          loginSuccess({
            user: userData,
            token: storedToken,
            rememberMe: localStorage.getItem("user") !== null,
            skipRedirect: true,
          }),
        );
      } catch (error) {
        console.error("Error during auto-login:", error);
        this.clearCorruptedSession();
      }
    }
  }

  checkSession() {
    const currentState = store.getState().auth;

    if (currentState.isAuthenticated) {
      // Check if stored session is still valid
      if (!this.isSessionValid()) {
        console.log("🔓 Session expired, logging out");
        store.dispatch(logout());
        return;
      }

      // Check if storage still has valid session
      const storedUser =
        localStorage.getItem("user") || sessionStorage.getItem("user");
      const isStoredAuth =
        localStorage.getItem("isAuthenticated") === "true" ||
        sessionStorage.getItem("isAuthenticated") === "true";

      if (!storedUser || !isStoredAuth) {
        console.log("🔓 Session data missing, logging out");
        store.dispatch(logout());
        return;
      }

      // Refresh session timestamp
      store.dispatch(refreshSession());
    } else {
      // Check if we should auto-login
      const storedUser =
        localStorage.getItem("user") || sessionStorage.getItem("user");
      const isStoredAuth =
        localStorage.getItem("isAuthenticated") === "true" ||
        sessionStorage.getItem("isAuthenticated") === "true";

      if (storedUser && isStoredAuth && this.isSessionValid()) {
        this.autoLogin();
      }
    }
  }

  isSessionValid() {
    const loginTime =
      localStorage.getItem("loginTime") || sessionStorage.getItem("loginTime");

    if (!loginTime) return false;

    const elapsed = Date.now() - parseInt(loginTime);
    const isLocalStorage = localStorage.getItem("user") !== null;
    const maxAge = isLocalStorage
      ? 7 * 24 * 60 * 60 * 1000
      : 4 * 60 * 60 * 1000;

    return elapsed < maxAge;
  }

  clearCorruptedSession() {
    console.log("🧹 Clearing corrupted session data");

    localStorage.removeItem("user");
    localStorage.removeItem("token");
    localStorage.removeItem("isAuthenticated");
    localStorage.removeItem("loginTime");

    sessionStorage.removeItem("user");
    sessionStorage.removeItem("token");
    sessionStorage.removeItem("isAuthenticated");
    sessionStorage.removeItem("loginTime");
  }

  broadcastLogin(user, token, rememberMe) {
    const message = {
      type: "SESSION_LOGIN",
      tabId: this.tabId,
      timestamp: Date.now(),
      payload: { user, token, rememberMe },
    };

    this.broadcast(message);
  }

  broadcastLogout() {
    const message = {
      type: "SESSION_LOGOUT",
      tabId: this.tabId,
      timestamp: Date.now(),
    };

    this.broadcast(message);
  }

  broadcastUpdate(user, token, rememberMe) {
    const message = {
      type: "SESSION_UPDATE",
      tabId: this.tabId,
      timestamp: Date.now(),
      payload: { user, token, rememberMe },
    };

    this.broadcast(message);
  }

  broadcast(message) {
    try {
      // Use BroadcastChannel if available
      if (this.broadcastChannel) {
        this.broadcastChannel.postMessage(message);
      }

      // Fallback to localStorage for older browsers
      localStorage.setItem("hk_medical_auth_event", JSON.stringify(message));

      // Clear the event after a short delay to prevent accumulation
      setTimeout(() => {
        try {
          localStorage.removeItem("hk_medical_auth_event");
        } catch (e) {}
      }, 1000);
    } catch (error) {
      console.warn("Failed to broadcast message:", error);
    }
  }

  destroy() {
    console.log("🔄 Destroying cross-tab session manager");

    this.isInitialized = false;

    if (this.broadcastChannel) {
      this.broadcastChannel.close();
    }

    if (this.sessionCheckInterval) {
      clearInterval(this.sessionCheckInterval);
    }

    this.storageListeners.forEach((listener) => {
      window.removeEventListener("storage", listener);
      window.removeEventListener("focus", listener);
    });

    this.storageListeners = [];
  }
}

// Create singleton instance
const crossTabSessionManager = new CrossTabSessionManager();

// Subscribe to auth state changes to broadcast them
let lastAuthState = null;

store.subscribe(() => {
  const currentAuthState = store.getState().auth;

  if (lastAuthState === null) {
    lastAuthState = currentAuthState;
    return;
  }

  // Check for login
  if (!lastAuthState.isAuthenticated && currentAuthState.isAuthenticated) {
    const token =
      localStorage.getItem("token") || sessionStorage.getItem("token");
    crossTabSessionManager.broadcastLogin(
      currentAuthState.user,
      token,
      currentAuthState.rememberMe,
    );
  }

  // Check for logout
  if (lastAuthState.isAuthenticated && !currentAuthState.isAuthenticated) {
    crossTabSessionManager.broadcastLogout();
  }

  // Check for user update
  if (
    lastAuthState.isAuthenticated &&
    currentAuthState.isAuthenticated &&
    JSON.stringify(lastAuthState.user) !== JSON.stringify(currentAuthState.user)
  ) {
    const token =
      localStorage.getItem("token") || sessionStorage.getItem("token");
    crossTabSessionManager.broadcastUpdate(
      currentAuthState.user,
      token,
      currentAuthState.rememberMe,
    );
  }

  lastAuthState = currentAuthState;
});

export default crossTabSessionManager;
