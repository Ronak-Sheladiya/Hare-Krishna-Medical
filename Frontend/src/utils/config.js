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

  // Check for production domains or non-localhost hostnames
  const isProductionDomain =
    hostname.includes("vercel.app") ||
    hostname.includes("render.com") ||
    hostname.includes("netlify.app") ||
    hostname.includes("fly.dev") ||
    hostname.includes("railway.app") ||
    hostname.includes("herokuapp.com");

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
 * Get the backend URL based on environment
 * @returns {string}
 */
/**
 * Check if we're in a restricted network environment
 */
export const isRestrictedEnvironment = () => {
  const hostname =
    typeof window !== "undefined" ? window.location.hostname : "";

  // Known problematic environments where cross-origin requests fail
  return (
    hostname.includes("fly.dev") ||
    hostname.includes("railway.app") ||
    hostname.includes("replit.") ||
    hostname.includes("stackblitz.")
  );
};

export const getBackendURL = () => {
  const hostname =
    typeof window !== "undefined" ? window.location.hostname : "";

  // Always use production backend if explicitly set in environment
  if (import.meta.env.VITE_BACKEND_URL) {
    console.log(
      `🔧 Using explicit backend URL: ${import.meta.env.VITE_BACKEND_URL}`,
    );
    return import.meta.env.VITE_BACKEND_URL;
  }

  // Check if we're in production environment
  const isProd = isProduction();
  const isRestricted = isRestrictedEnvironment();
  console.log(
    `🌍 Environment check: hostname=${hostname}, isProduction=${isProd}, isRestricted=${isRestricted}`,
  );

  if (isProd) {
    const prodURL = "https://hare-krishna-medical.onrender.com";
    console.log(
      `🚀 Production environment detected (${hostname}), using production backend: ${prodURL}`,
    );

    if (isRestricted) {
      console.warn(
        `⚠️ Restricted network environment detected (${hostname}). API calls may fail due to CORS/network policies.`,
      );
    }

    return prodURL;
  }

  // Development environment - try local first, fallback to production
  const localBackend = "http://localhost:5002";
  console.log(
    `🛠️ Development environment detected, using local backend: ${localBackend}`,
  );
  return localBackend;
};
/**
 * Get the Socket.IO URL based on environment
 * @returns {string}
 */
export const getSocketURL = () => {
  const hostname =
    typeof window !== "undefined" ? window.location.hostname : "";

  // Check if we're in production environment
  const isProd = isProduction();
  console.log(
    `🔌 Socket URL check: hostname=${hostname}, isProduction=${isProd}`,
  );

  if (isProd) {
    const prodSocketURL =
      import.meta.env.VITE_SOCKET_URL ||
      "https://hare-krishna-medical.onrender.com";
    console.log(`🚀 Using production socket URL: ${prodSocketURL}`);
    return prodSocketURL;
  }

  // Development environment - try local first, fallback to production
  const localSocket = "http://localhost:5002";
  const socketURL = import.meta.env.VITE_SOCKET_URL || localSocket;
  console.log(`🛠️ Using development socket URL: ${socketURL}`);
  return socketURL;
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

// Auto-log configuration in development and when debugging
if (isDevelopment() || import.meta.env.VITE_DEBUG === "true") {
  logConfig();
}

// Always log basic config for debugging production issues
if (typeof window !== "undefined") {
  const hostname = window.location.hostname;
  console.group("🔧 App Configuration");
  console.log(`🌐 App running on: ${hostname}`);
  console.log(`📍 Environment: ${getEnvironment()}`);
  console.log(`🏭 Production mode: ${isProduction()}`);
  console.log(`🔗 Backend URL: ${getBackendURL()}`);
  console.log(`🔌 Socket URL: ${getSocketURL()}`);
  console.log(
    `🔍 VITE_BACKEND_URL: ${import.meta.env.VITE_BACKEND_URL || "Not set"}`,
  );
  console.log(`🔍 MODE: ${import.meta.env.MODE}`);
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
