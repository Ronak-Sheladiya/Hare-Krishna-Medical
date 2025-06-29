// Unified API Client - Single source of truth for all API calls
// Ensures consistent backend connectivity across the entire application

import { getBackendURL } from "./config.js";

const BACKEND_URL = getBackendURL();

/**
 * Get authentication token from storage
 */
const getAuthToken = () => {
  try {
    return localStorage.getItem("token") || sessionStorage.getItem("token");
  } catch (error) {
    console.warn("Unable to access token storage:", error);
    return null;
  }
};

/**
 * Create headers for API requests
 */
const createHeaders = (includeAuth = true) => {
  const headers = {
    "Content-Type": "application/json",
    Accept: "application/json",
  };

  if (includeAuth) {
    const token = getAuthToken();
    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }
  }

  return headers;
};

/**
 * Make API request with consistent error handling and retry mechanism
 */
const makeApiRequest = async (endpoint, options = {}) => {
  const {
    method = "GET",
    body = null,
    includeAuth = true,
    timeout = null, // Will be determined based on backend type
    retries = 2,
    ...otherOptions
  } = options;

  const url = `${BACKEND_URL}${endpoint}`;

  // Determine timeout based on backend type
  const isProductionBackend = BACKEND_URL.includes('render.com') || BACKEND_URL.includes('railway.app') || BACKEND_URL.includes('herokuapp.com');
  const requestTimeout = timeout || (isProductionBackend ? 45000 : 15000); // 45s for production, 15s for local

  console.log(`🌐 API Request: ${method} ${url} (timeout: ${requestTimeout}ms)`);

  let lastError;

  // Retry mechanism
  for (let attempt = 1; attempt <= retries + 1; attempt++) {
    try {
      if (attempt > 1) {
        console.log(`🔄 Retry attempt ${attempt - 1}/${retries} for ${endpoint}`);
        // Wait before retry (exponential backoff)
        await new Promise(resolve => setTimeout(resolve, 1000 * Math.pow(2, attempt - 2)));
      }

      // Create abort controller for timeout
      const controller = new AbortController();
      const timeoutId = setTimeout(() => {
        console.log(`⏱️ Request timeout after ${requestTimeout}ms for ${endpoint}`);
        controller.abort();
      }, requestTimeout);

      const requestOptions = {
        method,
        headers: createHeaders(includeAuth),
        signal: controller.signal,
        ...otherOptions,
      };

      if (body && method !== "GET") {
        requestOptions.body =
          typeof body === "string" ? body : JSON.stringify(body);
      }

      const response = await fetch(url, requestOptions);
      clearTimeout(timeoutId);

    console.log(`📊 API Response: ${response.status} ${response.statusText}`);

    // Handle non-JSON responses
    const contentType = response.headers.get("content-type");
    let responseData;

    if (contentType && contentType.includes("application/json")) {
      responseData = await response.json();
    } else {
      responseData = await response.text();
    }

    if (!response.ok) {
      const errorMessage =
        responseData?.message ||
        responseData?.error ||
        `HTTP ${response.status}: ${response.statusText}`;
      throw new Error(errorMessage);
    }

    return responseData;
  } catch (error) {
    console.error(`❌ API Error for ${endpoint}:`, error.message);
    console.error(`❌ Backend URL being used: ${BACKEND_URL}`);

    // Handle specific error types
    if (error.name === "AbortError") {
      throw new Error("Request timed out. Please try again.");
    }

    if (error.message === "Failed to fetch") {
      // Check if we're in development and try local backend
      const currentURL = BACKEND_URL;
      if (
        currentURL.includes("localhost") ||
        currentURL.includes("127.0.0.1")
      ) {
        console.log(
          "🔄 Local backend not available, this is likely expected in production",
        );
        throw new Error(
          "Local backend server is not running. Please start the backend server with 'npm run start:backend' or check if you're in production mode.",
        );
      } else {
        console.log("🔄 Production backend not reachable");
        throw new Error(
          "Backend server is not available. Please try again later or contact support.",
        );
      }
    }

    // Network errors
    if (
      error.message.includes("NetworkError") ||
      error.message.includes("ERR_NETWORK")
    ) {
      throw new Error(
        "Network error. Please check your internet connection and try again.",
      );
    }

    // CORS errors
    if (
      error.message.includes("CORS") ||
      error.message.includes("cross-origin")
    ) {
      throw new Error("Server configuration error. Please contact support.");
    }

    // Re-throw the original error
    throw error;
  }
};

/**
 * API methods
 */
export const unifiedApi = {
  // GET request
  get: (endpoint, options = {}) =>
    makeApiRequest(endpoint, { ...options, method: "GET" }),

  // POST request
  post: (endpoint, data, options = {}) =>
    makeApiRequest(endpoint, { ...options, method: "POST", body: data }),

  // PUT request
  put: (endpoint, data, options = {}) =>
    makeApiRequest(endpoint, { ...options, method: "PUT", body: data }),

  // PATCH request
  patch: (endpoint, data, options = {}) =>
    makeApiRequest(endpoint, { ...options, method: "PATCH", body: data }),

  // DELETE request
  delete: (endpoint, options = {}) =>
    makeApiRequest(endpoint, { ...options, method: "DELETE" }),

  // Get backend URL
  getBackendUrl: () => BACKEND_URL,

  // Health check
  healthCheck: () => makeApiRequest("/api/health", { includeAuth: false }),

  // Test connectivity
  testConnection: async () => {
    try {
      const result = await unifiedApi.healthCheck();
      console.log("✅ Backend connectivity test passed:", result);
      return true;
    } catch (error) {
      console.error("❌ Backend connectivity test failed:", error.message);
      return false;
    }
  },
};

// Export as default and named export for flexibility
export default unifiedApi;

// Configuration object for the app
export const apiConfig = {
  backendUrl: BACKEND_URL,
  timeout: 15000,
  retryAttempts: 3,
  isProduction: true,
};

console.log("🔧 Unified API Client initialized with backend:", BACKEND_URL);