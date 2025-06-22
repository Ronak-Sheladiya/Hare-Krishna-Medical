import store from "../store/store.js";
import { refreshSession, logout } from "../store/slices/authSlice.js";

class SessionManager {
  constructor() {
    this.sessionCheckInterval = null;
    this.warningTimeouts = [];
    this.lastActivity = Date.now();
    this.activityListeners = [];

    // Initialize session checking
    this.initializeSessionCheck();
    this.initializeActivityTracking();
  }

  initializeSessionCheck() {
    // Check session every 5 minutes
    this.sessionCheckInterval = setInterval(
      () => {
        this.checkSession();
      },
      5 * 60 * 1000,
    );

    // Check session on app start
    this.checkSession();
  }

  initializeActivityTracking() {
    // Track user activity to prevent unnecessary logouts
    const activityEvents = [
      "mousedown",
      "mousemove",
      "keypress",
      "scroll",
      "touchstart",
      "click",
    ];

    const updateLastActivity = () => {
      this.lastActivity = Date.now();
    };

    activityEvents.forEach((event) => {
      document.addEventListener(event, updateLastActivity, true);
      this.activityListeners.push({ event, handler: updateLastActivity });
    });
  }

  checkSession() {
    const state = store.getState();
    const { isAuthenticated, user, rememberMe } = state.auth;

    if (!isAuthenticated || !user) {
      return;
    }

    try {
      const loginTime =
        localStorage.getItem("loginTime") ||
        sessionStorage.getItem("loginTime");

      if (!loginTime) {
        this.handleSessionExpired();
        return;
      }

      const elapsed = Date.now() - parseInt(loginTime);
      const maxAge = rememberMe ? 24 * 60 * 60 * 1000 : 2 * 60 * 60 * 1000; // 24h or 2h
      const warningTime = maxAge - 15 * 60 * 1000; // 15 minutes before expiry

      // Check if user has been inactive for too long
      const inactivityLimit = 30 * 60 * 1000; // 30 minutes
      const timeSinceActivity = Date.now() - this.lastActivity;

      if (
        elapsed >= maxAge ||
        (!rememberMe && timeSinceActivity >= inactivityLimit)
      ) {
        this.handleSessionExpired();
      } else if (elapsed >= warningTime && !this.warningShown) {
        this.showSessionWarning(maxAge - elapsed);
      } else {
        // Refresh session if still valid
        store.dispatch(refreshSession());
      }
    } catch (error) {
      console.error("Session check error:", error);
      this.handleSessionExpired();
    }
  }

  showSessionWarning(timeLeft) {
    this.warningShown = true;
    const minutes = Math.ceil(timeLeft / (60 * 1000));

    // Create warning notification
    const warningDiv = document.createElement("div");
    warningDiv.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      z-index: 10000;
      background: #f39c12;
      color: white;
      padding: 15px 20px;
      border-radius: 8px;
      box-shadow: 0 4px 12px rgba(0,0,0,0.15);
      max-width: 350px;
      font-family: Arial, sans-serif;
      animation: slideIn 0.3s ease-out;
    `;

    warningDiv.innerHTML = `
      <div style="display: flex; align-items: center; gap: 10px;">
        <i style="font-size: 20px;">⚠️</i>
        <div>
          <strong>Session Warning</strong><br>
          <small>Your session will expire in ${minutes} minute${minutes > 1 ? "s" : ""}. Click anywhere to extend.</small>
        </div>
        <button onclick="this.parentElement.parentElement.remove()"
                style="background: none; border: none; color: white; font-size: 18px; cursor: pointer; margin-left: auto;">×</button>
      </div>
    `;

    // Add animation styles
    const style = document.createElement("style");
    style.textContent = `
      @keyframes slideIn {
        from { transform: translateX(100%); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
      }
    `;
    document.head.appendChild(style);

    document.body.appendChild(warningDiv);

    // Auto-remove warning after 30 seconds
    const timeout = setTimeout(() => {
      if (warningDiv.parentElement) {
        warningDiv.remove();
      }
    }, 30000);

    this.warningTimeouts.push(timeout);

    // Extend session on any user activity
    const extendSession = () => {
      this.lastActivity = Date.now();
      this.warningShown = false;
      if (warningDiv.parentElement) {
        warningDiv.remove();
      }

      // Update login time to extend session
      const user = store.getState().auth.user;
      const rememberMe = store.getState().auth.rememberMe;

      if (user) {
        if (rememberMe) {
          localStorage.setItem("loginTime", Date.now().toString());
        } else {
          sessionStorage.setItem("loginTime", Date.now().toString());
        }
      }
    };

    // Listen for activity to extend session
    document.addEventListener("click", extendSession, { once: true });
    document.addEventListener("keydown", extendSession, { once: true });
  }

  handleSessionExpired() {
    // Clear all warnings
    this.warningTimeouts.forEach((timeout) => clearTimeout(timeout));
    this.warningTimeouts = [];
    this.warningShown = false;

    // Show expiry notification
    this.showSessionExpiredNotification();

    // Logout user
    setTimeout(() => {
      store.dispatch(logout());

      // Redirect to login page
      if (window.location.pathname !== "/login") {
        window.location.href = "/login";
      }
    }, 3000);
  }

  showSessionExpiredNotification() {
    const notificationDiv = document.createElement("div");
    notificationDiv.style.cssText = `
      position: fixed;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      z-index: 10001;
      background: #e74c3c;
      color: white;
      padding: 30px 40px;
      border-radius: 12px;
      box-shadow: 0 8px 32px rgba(0,0,0,0.3);
      text-align: center;
      font-family: Arial, sans-serif;
      animation: fadeIn 0.3s ease-out;
    `;

    notificationDiv.innerHTML = `
      <div style="font-size: 48px; margin-bottom: 15px;">🔒</div>
      <h3 style="margin: 0 0 10px 0;">Session Expired</h3>
      <p style="margin: 0; opacity: 0.9;">You will be redirected to login page in 3 seconds...</p>
      <div style="margin-top: 15px;">
        <button onclick="window.location.href='/login'"
                style="background: white; color: #e74c3c; border: none; padding: 8px 16px; border-radius: 6px; cursor: pointer; font-weight: bold;">
          Login Now
        </button>
      </div>
    `;

    // Add fade in animation
    const style = document.createElement("style");
    style.textContent = `
      @keyframes fadeIn {
        from { opacity: 0; transform: translate(-50%, -50%) scale(0.9); }
        to { opacity: 1; transform: translate(-50%, -50%) scale(1); }
      }
    `;
    document.head.appendChild(style);

    document.body.appendChild(notificationDiv);

    // Remove after 3 seconds
    setTimeout(() => {
      if (notificationDiv.parentElement) {
        notificationDiv.remove();
      }
    }, 3000);
  }

  extendSession() {
    this.lastActivity = Date.now();
    this.warningShown = false;

    // Update stored login time
    const state = store.getState();
    const { user, rememberMe } = state.auth;

    if (user) {
      if (rememberMe) {
        localStorage.setItem("loginTime", Date.now().toString());
      } else {
        sessionStorage.setItem("loginTime", Date.now().toString());
      }

      store.dispatch(refreshSession());
    }
  }

  destroy() {
    // Clear intervals
    if (this.sessionCheckInterval) {
      clearInterval(this.sessionCheckInterval);
    }

    // Clear timeouts
    this.warningTimeouts.forEach((timeout) => clearTimeout(timeout));

    // Remove event listeners
    this.activityListeners.forEach(({ event, handler }) => {
      document.removeEventListener(event, handler, true);
    });
  }
}

// Create singleton instance
const sessionManager = new SessionManager();

export default sessionManager;

// Export utility functions
export const extendSession = () => sessionManager.extendSession();
export const checkSession = () => sessionManager.checkSession();
export const destroySessionManager = () => sessionManager.destroy();
