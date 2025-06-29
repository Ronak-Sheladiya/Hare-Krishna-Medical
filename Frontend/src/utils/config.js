// Frontend-Only Configuration Utility
// Simplified configuration for frontend-only application

/**
 * Get the current environment
 * @returns {'development' | 'production'}
 */
export const getEnvironment = () => {
  return import.meta.env.VITE_NODE_ENV || import.meta.env.MODE || "development";
};

/**
 * Check if running in production
 * @returns {boolean}
 */
export const isProduction = () => {
  const hostname =
    typeof window !== "undefined" ? window.location.hostname : "";
  const env = getEnvironment();

  // Check for production domains
  const isProductionDomain =
    hostname.includes("vercel.app") ||
    hostname.includes("netlify.app") ||
    hostname.includes("github.io") ||
    hostname.includes("surge.sh");

  return (
    env === "production" ||
    isProductionDomain ||
    (hostname !== "localhost" && hostname !== "127.0.0.1" && hostname !== "")
  );
};

/**
 * Check if running in development
 * @returns {boolean}
 */
export const isDevelopment = () => {
  return getEnvironment() === "development" && !isProduction();
};

/**
 * Get frontend URLs (for reference)
 * @returns {string[]}
 */
export const getFrontendURLs = () => {
  const frontendUrls = import.meta.env.VITE_FRONTEND_URLS;
  if (frontendUrls) {
    return frontendUrls.split(",").map((url) => url.trim());
  }

  // Default URLs where this app might be deployed
  return [
    "https://hk-medical.vercel.app",
    "https://hkmedical.vercel.app",
    "https://harekrishnamedical.vercel.app",
    "https://hare-krishna-medical.vercel.app",
  ];
};

/**
 * Get the primary frontend domain
 * @returns {string}
 */
export const getPrimaryDomain = () => {
  return import.meta.env.VITE_PRIMARY_DOMAIN || "https://hk-medical.vercel.app";
};

/**
 * Mock backend URL (for compatibility with existing code)
 * @returns {string}
 */
export const getBackendURL = () => {
  console.warn(
    "🎨 Frontend-only mode: getBackendURL() called but no backend available",
  );
  return ""; // Return empty string since no backend exists
};

/**
 * Mock socket URL (for compatibility with existing code)
 * @returns {string}
 */
export const getSocketURL = () => {
  console.warn(
    "🎨 Frontend-only mode: getSocketURL() called but no backend available",
  );
  return ""; // Return empty string since no backend exists
};

/**
 * Get application configuration
 * @returns {object}
 */
export const getAppConfig = () => {
  return {
    name: import.meta.env.VITE_APP_NAME || "Hare Krishna Medical Store",
    version: import.meta.env.VITE_VERSION || "1.0.0",
    environment: getEnvironment(),
    isProduction: isProduction(),
    isDevelopment: isDevelopment(),
    debug: import.meta.env.VITE_DEBUG === "true",
    frontendURLs: getFrontendURLs(),
    primaryDomain: getPrimaryDomain(),
    maxFileSize: parseInt(import.meta.env.VITE_MAX_FILE_SIZE) || 5242880,
    // Frontend-only mode
    frontendOnly: true,
    hasBackend: false,
  };
};

/**
 * Log configuration for debugging
 */
export const logConfig = () => {
  if (isDevelopment() || import.meta.env.VITE_DEBUG === "true") {
    console.group("🔧 Frontend-Only Application Configuration");
    console.table(getAppConfig());
    console.groupEnd();
  }
};

// Auto-log configuration in development
if (isDevelopment() || import.meta.env.VITE_DEBUG === "true") {
  logConfig();
}

// Always log basic config for debugging
if (typeof window !== "undefined") {
  const hostname = window.location.hostname;
  console.group("🔧 Frontend-Only App Configuration");
  console.log(`🌐 App running on: ${hostname}`);
  console.log(`📍 Environment: ${getEnvironment()}`);
  console.log(`🏭 Production mode: ${isProduction()}`);
  console.log(`🎨 Frontend-only mode: ENABLED`);
  console.log(`📦 Backend: DISABLED`);
  console.groupEnd();
}

export default {
  getEnvironment,
  isProduction,
  isDevelopment,
  getBackendURL,
  getSocketURL,
  getFrontendURLs,
  getPrimaryDomain,
  getAppConfig,
  logConfig,
};
