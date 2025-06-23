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
      // Handle HTTP errors
      const errorData = await response.json().catch(() => ({}));
      throw new Error(
        errorData.message || `HTTP ${response.status}: ${response.statusText}`,
      );
    }
  } catch (error) {
    clearTimeout(timeoutId);

    // Handle different types of errors
    if (error.name === "AbortError") {
      throw new Error("Request timed out");
    } else if (error.message === "Failed to fetch") {
      throw new Error("Network error - backend API not available");
    } else {
      throw error;
    }
  }
};

// Convenience methods for different HTTP verbs
export const api = {
  get: (endpoint, options = {}) =>
    apiCall(endpoint, { method: "GET", ...options }),

  post: (endpoint, data, options = {}) =>
    apiCall(endpoint, {
      method: "POST",
      body: JSON.stringify(data),
      ...options,
    }),

  put: (endpoint, data, options = {}) =>
    apiCall(endpoint, {
      method: "PUT",
      body: JSON.stringify(data),
      ...options,
    }),

  patch: (endpoint, data, options = {}) =>
    apiCall(endpoint, {
      method: "PATCH",
      body: JSON.stringify(data),
      ...options,
    }),

  delete: (endpoint, options = {}) =>
    apiCall(endpoint, { method: "DELETE", ...options }),
};

// Utility function for handling API calls with error logging
export const safeApiCall = async (apiFunction, fallbackValue = null) => {
  try {
    const result = await apiFunction();
    return { success: true, data: result.data || result, error: null };
  } catch (error) {
    console.warn("API call failed:", error.message);
    return { success: false, data: fallbackValue, error: error.message };
  }
};

// Export API base URL for other components
export { API_BASE_URL };

export default api;
