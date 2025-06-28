// Enhanced API client with better error handling and fallback mechanisms
import { getBackendURL, isProduction } from "./config.js";

const API_BASE_URL = getBackendURL();
const FALLBACK_BACKEND_URL = "https://hare-krishna-medical.onrender.com";

/**
 * Enhanced API call with comprehensive error handling and fallback
 */
const enhancedApiCall = async (endpoint, options = {}) => {
  const config = {
    timeout: 10000, // 10 seconds
    headers: {
      "Content-Type": "application/json",
    },
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...options.headers,
    },
  };

  // Add authentication token if available
  try {
    const token =
      localStorage.getItem("token") || sessionStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  } catch (e) {
    console.warn("Could not access localStorage/sessionStorage for token");
  }

  // Try primary backend first
  const primaryUrl = `${API_BASE_URL}${endpoint}`;
  console.log(`🌐 API Call: ${config.method || "GET"} ${primaryUrl}`);

  try {
    const response = await makeRequest(primaryUrl, config);
    console.log(`📊 API Response: ${response.status} ${response.statusText}`);
    return await handleResponse(response);
  } catch (primaryError) {
    console.warn(`❌ Primary backend failed: ${primaryError.message}`);

    // Try fallback backend if primary fails and we're in production
    if (API_BASE_URL !== FALLBACK_BACKEND_URL && (isProduction() || primaryError.message.includes("Failed to fetch"))) {
      const fallbackUrl = `${FALLBACK_BACKEND_URL}${endpoint}`;
      console.log(`🔄 Trying fallback backend: ${fallbackUrl}`);

      try {
        const response = await makeRequest(fallbackUrl, config);
        console.log(`📊 Fallback API Response: ${response.status} ${response.statusText}`);
        return await handleResponse(response);
      } catch (fallbackError) {
        console.error(`❌ Fallback backend also failed: ${fallbackError.message}`);
        throw primaryError; // Throw the original error
      }
    }

    throw primaryError;
  }
};

/**
 * Make HTTP request with timeout
 */
const makeRequest = async (url, config) => {
  // Create abort controller for timeout
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), config.timeout);

  try {
    const response = await fetch(url, {
      ...config,
      signal: controller.signal,
    });
    clearTimeout(timeoutId);
    return response;
  } catch (error) {
    clearTimeout(timeoutId);
    throw error;
  }
};

/**
 * Handle API response
 */
const handleResponse = async (response) => {

    console.log(`📊 API Response: ${response.status} ${response.statusText}`);

    if (!response.ok) {
      let errorData;
      try {
        errorData = await response.json();
      } catch (e) {
        errorData = {
          message: `HTTP ${response.status}: ${response.statusText}`,
        };
      }

      throw new Error(
        errorData.message || `HTTP ${response.status}: ${response.statusText}`,
      );
    }

    const contentType = response.headers.get("content-type");
    if (contentType && contentType.includes("application/json")) {
      const data = await response.json();
      console.log(`✅ API Success:`, data);
      return data;
    } else {
      const textData = await response.text();
      return { success: true, data: textData };
    }
  } catch (error) {
    console.error(`❌ API Error for ${endpoint}:`, error);

    // Handle specific error types
    if (error.name === "AbortError") {
      throw new Error("Request timed out - server may be slow or unreachable");
    }

    if (error.message === "Failed to fetch") {
      // Network connectivity issue
      throw new Error(
        "Unable to connect to server. Please check your internet connection.",
      );
    }

    if (error.message.includes("401")) {
      // Authentication error
      throw new Error("Session expired. Please log in again.");
    }

    if (error.message.includes("403")) {
      // Authorization error
      throw new Error(
        "Access denied. You do not have permission to perform this action.",
      );
    }

    if (error.message.includes("404")) {
      // Not found error
      throw new Error("The requested resource was not found on the server.");
    }

    if (error.message.includes("500")) {
      // Server error
      throw new Error("Server error. Please try again later.");
    }

    // Re-throw the original error if it's already descriptive
    throw error;
  }
};

/**
 * Enhanced API client with better error messages
 */
export const enhancedApi = {
  get: async (endpoint, options = {}) => {
    return await enhancedApiCall(endpoint, { method: "GET", ...options });
  },

  post: async (endpoint, data, options = {}) => {
    return await enhancedApiCall(endpoint, {
      method: "POST",
      body: JSON.stringify(data),
      ...options,
    });
  },

  put: async (endpoint, data, options = {}) => {
    return await enhancedApiCall(endpoint, {
      method: "PUT",
      body: JSON.stringify(data),
      ...options,
    });
  },

  patch: async (endpoint, data, options = {}) => {
    return await enhancedApiCall(endpoint, {
      method: "PATCH",
      body: JSON.stringify(data),
      ...options,
    });
  },

  delete: async (endpoint, options = {}) => {
    return await enhancedApiCall(endpoint, { method: "DELETE", ...options });
  },
};

export default enhancedApi;