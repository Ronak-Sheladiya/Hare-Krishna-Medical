// Environment Configuration Utility
// Centralized configuration management for the application

/**
 * Get the current environment
 * @returns {'development' | 'production' | 'staging'}
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

  return (
    env === "production" ||
    hostname.includes("vercel.app") ||
    hostname.includes("render.com") ||
    hostname.includes("netlify.app")
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
 * Get the backend URL based on environment
 * @returns {string}
 */
export const getBackendURL = () => {
  // Check if we're in production environment
  if (isProduction()) {
    return (
      import.meta.env.VITE_BACKEND_URL ||
      "https://hare-krishna-medical.onrender.com"
    );
  }

  // Development environment - try local first, fallback to production
  const localBackend = "http://localhost:5000";
  const productionBackend =
    import.meta.env.VITE_BACKEND_URL_FALLBACK ||
    "https://hare-krishna-medical.onrender.com";

  // Return local backend URL if specified, otherwise fallback
  return import.meta.env.VITE_BACKEND_URL || localBackend;
};

/**
 * Get the Socket.IO URL based on environment
 * @returns {string}
 */
export const getSocketURL = () => {
  // Check if we're in production environment
  if (isProduction()) {
    return (
      import.meta.env.VITE_SOCKET_URL ||
      "https://hare-krishna-medical.onrender.com"
    );
  }

  // Development environment - try local first, fallback to production
  const localSocket = "http://localhost:5000";
  const productionSocket =
    import.meta.env.VITE_SOCKET_URL_FALLBACK ||
    "https://hare-krishna-medical.onrender.com";

  // Return local socket URL if specified, otherwise fallback
  return import.meta.env.VITE_SOCKET_URL || localSocket;
};

/**
 * Get frontend URLs (for CORS and reference)
 * @returns {string[]}
 */
export const getFrontendURLs = () => {
  const frontendUrls = import.meta.env.VITE_FRONTEND_URLS;
  if (frontendUrls) {
    return frontendUrls.split(",").map((url) => url.trim());
  }

  // Default production URLs
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
    backendURL: getBackendURL(),
    socketURL: getSocketURL(),
    frontendURLs: getFrontendURLs(),
    primaryDomain: getPrimaryDomain(),
    sessionTimeout: parseInt(import.meta.env.VITE_SESSION_TIMEOUT) || 3600000,
    maxFileSize: parseInt(import.meta.env.VITE_MAX_FILE_SIZE) || 5242880,
  };
};

/**
 * Log configuration for debugging
 */
export const logConfig = () => {
  if (isDevelopment() || import.meta.env.VITE_DEBUG === "true") {
    console.group("🔧 Application Configuration");
    console.table(getAppConfig());
    console.groupEnd();
  }
};

// Auto-log configuration in development
if (isDevelopment()) {
  logConfig();
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
