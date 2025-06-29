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
 * Make API request with consistent error handling
 */
const makeApiRequest = async (endpoint, options = {}) => {
  const {
    method = "GET",
    body = null,
    includeAuth = true,
    timeout = 15000,
    ...otherOptions
  } = options;

  const url = `${BACKEND_URL}${endpoint}`;
  console.log(`🌐 API Request: ${method} ${url}`);

  try {
    // Create abort controller for timeout
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeout);

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

    // Handle specific error types
    if (error.name === "AbortError") {
      throw new Error("Request timed out. Please try again.");
    }

    if (error.message === "Failed to fetch") {
      throw new Error(
        "Unable to connect to server. Please check your internet connection.",
      );
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
