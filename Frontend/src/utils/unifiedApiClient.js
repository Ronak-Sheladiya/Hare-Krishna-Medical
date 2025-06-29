// Unified API Client - Single source of truth for all API calls
// Ensures consistent backend connectivity across the entire application

import { getBackendURL } from "./config.js";

const BACKEND_URL = getBackendURL();

/**
 * Get authentication token from storage
 */
const getAuthToken = () => {
  try {
    const token =
      localStorage.getItem("token") || sessionStorage.getItem("token");
    console.log(
      "🔑 Retrieved token:",
      token ? `${token.substring(0, 20)}...` : "No token found",
    );
    return token;
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
 * Sleep function for retry delays
 */
const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

/**
 * Make API request with consistent error handling and retry mechanism
 */
const makeApiRequest = async (endpoint, options = {}) => {
  const {
    method = "GET",
    body = null,
    includeAuth = true,
    timeout = null,
    retries = 2,
    ...otherOptions
  } = options;

  const url = `${BACKEND_URL}${endpoint}`;

  // Determine timeout based on backend type
  const isProductionBackend =
    BACKEND_URL.includes("render.com") ||
    BACKEND_URL.includes("railway.app") ||
    BACKEND_URL.includes("herokuapp.com") ||
    BACKEND_URL.includes("fly.dev");
  const requestTimeout = timeout || (isProductionBackend ? 60000 : 15000); // 60s for production, 15s for local

  console.log(
    `🌐 API Request: ${method} ${url} (timeout: ${requestTimeout}ms, retries: ${retries})`,
  );

  let lastError;

  // Retry mechanism
  for (let attempt = 1; attempt <= retries + 1; attempt++) {
    try {
      if (attempt > 1) {
        console.log(
          `🔄 Retry attempt ${attempt - 1}/${retries} for ${endpoint}`,
        );
        // Wait before retry (exponential backoff)
        await sleep(1000 * Math.pow(2, attempt - 2));
      }

      // Create abort controller for timeout
      const controller = new AbortController();
      const timeoutId = setTimeout(() => {
        console.log(
          `⏱️ Request timeout after ${requestTimeout}ms for ${endpoint}`,
        );
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

      // Success - return the response
      if (attempt > 1) {
        console.log(`✅ Request succeeded on attempt ${attempt}`);
      }
      return responseData;
    } catch (error) {
      lastError = error;
      console.error(
        `❌ API Error for ${endpoint} (attempt ${attempt}):`,
        error.message,
      );

      // Don't retry on certain errors
      if (error.name === "AbortError" && attempt < retries + 1) {
        console.log(`⏱️ Request timed out, will retry...`);
        continue;
      }

      // Don't retry on authentication errors
      if (error.message.includes("401") || error.message.includes("403")) {
        console.log(`🚫 Authentication error, not retrying`);
        break;
      }

      // Don't retry on validation errors
      if (
        error.message.includes("400") &&
        !error.message.includes("Failed to fetch")
      ) {
        console.log(`🚫 Validation error, not retrying`);
        break;
      }

      // If this was the last attempt, break
      if (attempt === retries + 1) {
        break;
      }
    }
  }

  // All retries failed, handle the final error
  console.error(`❌ All attempts failed for ${endpoint}`);
  console.error(`❌ Backend URL being used: ${BACKEND_URL}`);

  // Handle specific error types
  if (lastError.name === "AbortError") {
    if (isProductionBackend) {
      throw new Error(
        "The server is taking longer than expected to respond. This might be because the server is starting up (common with free hosting). Please wait a moment and try again.",
      );
    } else {
      throw new Error("Request timed out. Please try again.");
    }
  }

  if (lastError.message === "Failed to fetch") {
    // Check if we're in development and try local backend
    const currentURL = BACKEND_URL;
    const currentHost =
      typeof window !== "undefined" ? window.location.hostname : "";

    if (currentURL.includes("localhost") || currentURL.includes("127.0.0.1")) {
      throw new Error(
        "Local backend server is not running. Please start the backend server with 'npm run start:backend' or check if you're in production mode.",
      );
    } else if (currentHost.includes("fly.dev")) {
      throw new Error(
        "Unable to connect to the backend server. This appears to be a network connectivity issue between Fly.dev and the backend service. You can try: 1) Refreshing the page, 2) Waiting a moment for the backend to wake up, or 3) Using a different network.",
      );
    } else {
      throw new Error(
        "Backend server is not available. This might be a temporary issue with the hosting service. Please try again in a moment.",
      );
    }
  }

  // Network errors
  if (
    lastError.message.includes("NetworkError") ||
    lastError.message.includes("ERR_NETWORK")
  ) {
    throw new Error(
      "Network error. Please check your internet connection and try again.",
    );
  }

  // CORS errors
  if (
    lastError.message.includes("CORS") ||
    lastError.message.includes("cross-origin")
  ) {
    throw new Error("Server configuration error. Please contact support.");
  }

  // Re-throw the original error
  throw lastError;
};

/**
 * Unified API client with consistent methods
 */
const unifiedApi = {
  // GET request
  get: (endpoint, options = {}) => {
    return makeApiRequest(endpoint, { method: "GET", ...options });
  },

  // POST request
  post: (endpoint, body = null, options = {}) => {
    return makeApiRequest(endpoint, { method: "POST", body, ...options });
  },

  // PUT request
  put: (endpoint, body = null, options = {}) => {
    return makeApiRequest(endpoint, { method: "PUT", body, ...options });
  },

  // DELETE request
  delete: (endpoint, options = {}) => {
    return makeApiRequest(endpoint, { method: "DELETE", ...options });
  },

  // PATCH request
  patch: (endpoint, body = null, options = {}) => {
    return makeApiRequest(endpoint, { method: "PATCH", body, ...options });
  },

  // Get current backend URL
  getBackendURL: () => BACKEND_URL,

  // Test connectivity
  testConnection: async () => {
    try {
      await unifiedApi.get("/api/health");
      return true;
    } catch (error) {
      console.error("Connection test failed:", error.message);
      return false;
    }
  },
};

console.log("🔧 Unified API Client initialized with backend:", BACKEND_URL);

export default unifiedApi;
