// Smart API client that automatically falls back to client-side mode
import unifiedApi from "./unifiedApiClient";
import {
  clientSideAuth,
  shouldUseClientSideFallback,
} from "./clientSideFallback";

let backendAvailable = null; // null = unknown, true = available, false = unavailable
let lastBackendCheck = 0;
const BACKEND_CHECK_INTERVAL = 30000; // 30 seconds

/**
 * Check if backend is available
 */
const checkBackendAvailability = async () => {
  const now = Date.now();

  // Return cached result if recent
  if (
    backendAvailable !== null &&
    now - lastBackendCheck < BACKEND_CHECK_INTERVAL
  ) {
    return backendAvailable;
  }

  try {
    await unifiedApi.get("/api/health", { timeout: 5000, retries: 0 });
    backendAvailable = true;
    lastBackendCheck = now;
    console.log("✅ Backend is available");
    return true;
  } catch (error) {
    backendAvailable = false;
    lastBackendCheck = now;
    console.log("❌ Backend is not available:", error.message);
    return false;
  }
};

/**
 * Smart API wrapper that chooses between backend and client-side
 */
export const smartApi = {
  // Initialize the smart API (checks backend on first load)
  init: async () => {
    console.log("🔧 Initializing Smart API Client...");
    const isAvailable = await checkBackendAvailability();
    console.log(
      `🔧 Smart API initialized: Backend ${isAvailable ? "available" : "unavailable"}`,
    );
    return isAvailable;
  },

  // Health check
  health: async () => {
    const isBackendAvailable = await checkBackendAvailability();

    if (isBackendAvailable) {
      return await unifiedApi.get("/api/health");
    } else {
      return {
        success: true,
        status: "OK (Client-side mode)",
        server: "client-side",
        timestamp: new Date().toISOString(),
      };
    }
  },

  // Register
  register: async (userData) => {
    const isBackendAvailable = await checkBackendAvailability();

    if (isBackendAvailable) {
      try {
        return await unifiedApi.post("/api/auth/register", userData);
      } catch (error) {
        console.log("Backend registration failed, falling back to client-side");
        backendAvailable = false; // Mark as unavailable
      }
    }

    // Fallback to client-side
    if (shouldUseClientSideFallback()) {
      return clientSideAuth.register(userData);
    }

    throw new Error(
      "Backend is not available and client-side fallback is not supported",
    );
  },

  // Login
  login: async (email, password) => {
    const isBackendAvailable = await checkBackendAvailability();

    if (isBackendAvailable) {
      try {
        return await unifiedApi.post("/api/auth/login", { email, password });
      } catch (error) {
        console.log("Backend login failed, falling back to client-side");
        backendAvailable = false; // Mark as unavailable
      }
    }

    // Fallback to client-side
    if (shouldUseClientSideFallback()) {
      return clientSideAuth.login(email, password);
    }

    throw new Error(
      "Backend is not available and client-side fallback is not supported",
    );
  },

  // Update profile
  updateProfile: async (profileData) => {
    // Check token first
    const token =
      localStorage.getItem("token") || sessionStorage.getItem("token");
    console.log("🔑 Token check:", token ? "Token found" : "No token");

    if (!token) {
      throw new Error("No authentication token found. Please log in again.");
    }

    const isBackendAvailable = await checkBackendAvailability();

    if (isBackendAvailable) {
      try {
        console.log("🚀 Attempting backend profile update...");
        const result = await unifiedApi.put(
          "/api/auth/update-profile",
          profileData,
        );
        console.log("✅ Backend profile update successful");
        return result;
      } catch (error) {
        console.error("❌ Backend profile update failed:", error);
        // Don't fallback to client-side if it's an auth error - user needs to re-login
        if (
          error.message?.includes("401") ||
          error.message?.includes("Access denied")
        ) {
          throw new Error("Authentication failed. Please log in again.");
        }
        console.log(
          "⚠️ Backend profile update failed, falling back to client-side",
        );
        backendAvailable = false; // Mark as unavailable
      }
    }

    // Fallback to client-side
    if (shouldUseClientSideFallback()) {
      // Get current user from Redux store or storage
      const currentUser = clientSideAuth.getCurrentUser();

      // Also check localStorage/sessionStorage for auth state
      const token =
        localStorage.getItem("token") || sessionStorage.getItem("token");
      const userData =
        localStorage.getItem("user") || sessionStorage.getItem("user");

      if (!currentUser && !token && !userData) {
        throw new Error("No user logged in");
      }

      // Use stored user data if available
      let userId = currentUser?.id;
      if (!userId && userData) {
        try {
          const parsedUser = JSON.parse(userData);
          userId = parsedUser.id;
        } catch (e) {
          console.warn("Failed to parse stored user data");
        }
      }

      if (!userId) {
        throw new Error("Unable to identify current user");
      }

      return clientSideAuth.updateProfile(userId, profileData);
    }

    throw new Error(
      "Backend is not available and client-side fallback is not supported",
    );
  },

  // Get backend status
  getStatus: () => {
    return {
      backendAvailable,
      lastChecked: lastBackendCheck,
      fallbackAvailable: shouldUseClientSideFallback(),
      mode: backendAvailable
        ? "backend"
        : shouldUseClientSideFallback()
          ? "client-side"
          : "unavailable",
    };
  },

  // Force backend check
  forceBackendCheck: async () => {
    backendAvailable = null;
    lastBackendCheck = 0;
    return await checkBackendAvailability();
  },
};

export default smartApi;
