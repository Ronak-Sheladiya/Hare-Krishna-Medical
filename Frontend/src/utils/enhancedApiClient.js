// Enhanced API client with better error handling and fallback mechanisms
import { getBackendURL, isProduction } from "./config.js";

// Use consistent backend URL across the application
const getApiBaseUrl = () => {
  const url = "https://hare-krishna-medical.onrender.com";
  console.log(`🔗 Enhanced API Client using: ${url}`);
  return url;
};
const FALLBACK_BACKEND_URL = "https://hare-krishna-medical.onrender.com";

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
};

/**
 * Test if backend is accessible
 */
const testBackendConnectivity = async (baseUrl) => {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000);

    const response = await fetch(`${baseUrl}/api/health`, {
      method: "GET",
      signal: controller.signal,
    });

    clearTimeout(timeoutId);
    return response.ok;
  } catch (error) {
    console.warn(
      `Backend connectivity test failed for ${baseUrl}:`,
      error.message,
    );
    return false;
  }
};

/**
 * Enhanced API call with automatic fallback and comprehensive error handling
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

  // Get current backend URL dynamically
  const currentApiUrl = getApiBaseUrl();

  // In production, test connectivity first
  if (isProduction()) {
    console.log("🔍 Testing backend connectivity in production...");
    const isConnectable = await testBackendConnectivity(currentApiUrl);
    if (!isConnectable && currentApiUrl !== FALLBACK_BACKEND_URL) {
      console.warn("⚠️ Primary backend not accessible, trying fallback...");
      const fallbackConnectable =
        await testBackendConnectivity(FALLBACK_BACKEND_URL);
      if (fallbackConnectable) {
        // Use fallback backend
        const fallbackUrl = `${FALLBACK_BACKEND_URL}${endpoint}`;
        console.log(`🔄 Using fallback backend: ${fallbackUrl}`);
        try {
          const response = await makeRequest(fallbackUrl, config);
          return await handleResponse(response);
        } catch (fallbackError) {
          console.error("❌ Fallback backend also failed:", fallbackError);
          throw new Error(
            "Backend services are currently unavailable. Please try again later.",
          );
        }
      } else {
        throw new Error(
          "Backend services are currently unavailable. Please try again later.",
        );
      }
    } else if (!isConnectable) {
      throw new Error(
        "Backend service is currently unavailable. Please try again later.",
      );
    }
  }

  // Try primary backend first
  const primaryUrl = `${currentApiUrl}${endpoint}`;
  console.log(`🌐 API Call: ${config.method || "GET"} ${primaryUrl}`);

  try {
    const response = await makeRequest(primaryUrl, config);
    console.log(`📊 API Response: ${response.status} ${response.statusText}`);
    return await handleResponse(response);
  } catch (primaryError) {
    console.warn(`❌ Primary backend failed: ${primaryError.message}`);

    // Try fallback backend if primary fails and we're in production or have connection issues
    if (
      currentApiUrl !== FALLBACK_BACKEND_URL &&
      (isProduction() || primaryError.message.includes("Failed to fetch"))
    ) {
      const fallbackUrl = `${FALLBACK_BACKEND_URL}${endpoint}`;
      console.log(`🔄 Trying fallback backend: ${fallbackUrl}`);

      try {
        const response = await makeRequest(fallbackUrl, config);
        console.log(
          `📊 Fallback API Response: ${response.status} ${response.statusText}`,
        );
        return await handleResponse(response);
      } catch (fallbackError) {
        console.error(
          `❌ Fallback backend also failed: ${fallbackError.message}`,
        );
        // Fall through to original error handling
      }
    }

    // Handle specific error types
    console.error(`❌ API Error for ${endpoint}:`, primaryError);

    if (primaryError.name === "AbortError") {
      throw new Error("Request timed out - server may be slow or unreachable");
    }

    if (primaryError.message === "Failed to fetch") {
      // Network connectivity issue
      if (isProduction()) {
        throw new Error(
          "Service temporarily unavailable. Our team has been notified. Please try again in a few minutes.",
        );
      } else {
        throw new Error(
          "Unable to connect to server. Please check your internet connection.",
        );
      }
    }

    if (primaryError.message.includes("401")) {
      // Authentication error
      throw new Error("Session expired. Please log in again.");
    }

    if (primaryError.message.includes("403")) {
      // Authorization error
      throw new Error(
        "Access denied. You do not have permission to perform this action.",
      );
    }

    if (primaryError.message.includes("404")) {
      // Not found error
      throw new Error("The requested resource was not found on the server.");
    }

    if (primaryError.message.includes("500")) {
      // Server error
      throw new Error("Server error. Please try again later.");
    }

    // Re-throw the original error if it's already descriptive
    throw primaryError;
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

  delete: async (endpoint, options = {}) => {
    return await enhancedApiCall(endpoint, { method: "DELETE", ...options });
  },

  patch: async (endpoint, data, options = {}) => {
    return await enhancedApiCall(endpoint, {
      method: "PATCH",
      body: JSON.stringify(data),
      ...options,
    });
  },
};

export default enhancedApi;
