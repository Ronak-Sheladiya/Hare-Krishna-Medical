// API Client utility with proper error handling and timeout
const API_BASE_URL =
  import.meta.env.VITE_BACKEND_URL || "http://localhost:5000";

// Default configuration
const DEFAULT_CONFIG = {
  timeout: 8000, // 8 seconds
  headers: {
    "Content-Type": "application/json",
  },
};

// Create a fetch wrapper with timeout and error handling
export const apiCall = async (endpoint, options = {}) => {
  const config = {
    ...DEFAULT_CONFIG,
    ...options,
    headers: {
      ...DEFAULT_CONFIG.headers,
      ...options.headers,
    },
  };

  // Add authentication token if available
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  // Create abort controller for timeout
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), config.timeout);

  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...config,
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    // Handle different response statuses
    if (response.ok) {
      const contentType = response.headers.get("content-type");
      if (contentType && contentType.includes("application/json")) {
        return await response.json();
      }
      return { success: true, data: await response.text() };
    } else {
      // Handle HTTP errors - return error object instead of throwing
      const errorData = await response.json().catch(() => ({}));
      return {
        success: false,
        error:
          errorData.message ||
          `HTTP ${response.status}: ${response.statusText}`,
        status: response.status,
      };
    }
  } catch (error) {
    clearTimeout(timeoutId);

    // Return error object instead of throwing
    let errorMessage = "Unknown error occurred";
    if (error.name === "AbortError") {
      errorMessage = "Request timed out";
    } else if (error.message === "Failed to fetch") {
      errorMessage = "Network error - backend API not available";
    } else {
      errorMessage = error.message;
    }

    return {
      success: false,
      error: errorMessage,
      originalError: error,
    };
  }
};

// Convenience methods for different HTTP verbs
export const api = {
  get: async (endpoint, options = {}) => {
    const result = await apiCall(endpoint, { method: "GET", ...options });
    if (result.success === false) {
      throw new Error(result.error);
    }
    return result;
  },

  post: async (endpoint, data, options = {}) => {
    const result = await apiCall(endpoint, {
      method: "POST",
      body: JSON.stringify(data),
      ...options,
    });
    if (result.success === false) {
      throw new Error(result.error);
    }
    return result;
  },

  put: async (endpoint, data, options = {}) => {
    const result = await apiCall(endpoint, {
      method: "PUT",
      body: JSON.stringify(data),
      ...options,
    });
    if (result.success === false) {
      throw new Error(result.error);
    }
    return result;
  },

  patch: async (endpoint, data, options = {}) => {
    const result = await apiCall(endpoint, {
      method: "PATCH",
      body: JSON.stringify(data),
      ...options,
    });
    if (result.success === false) {
      throw new Error(result.error);
    }
    return result;
  },

  delete: async (endpoint, options = {}) => {
    const result = await apiCall(endpoint, { method: "DELETE", ...options });
    if (result.success === false) {
      throw new Error(result.error);
    }
    return result;
  },
};

// Utility function for handling API calls with error logging
export const safeApiCall = async (apiFunction, fallbackValue = null) => {
  try {
    const result = await Promise.resolve(apiFunction()).catch((error) => {
      // Catch any errors from the API function itself
      throw error;
    });
    return { success: true, data: result.data || result, error: null };
  } catch (error) {
    // Handle all types of errors gracefully
    const errorMessage = error.message || "Unknown error occurred";
    console.warn("API call failed (safely handled):", errorMessage);
    return { success: false, data: fallbackValue, error: errorMessage };
  }
};

// Export API base URL for other components
export { API_BASE_URL };

export default api;
