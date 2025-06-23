// API Client utility with proper error handling and timeout
const API_BASE_URL =
  import.meta.env.VITE_BACKEND_URL || "http://localhost:5000";

// Store original fetch to avoid external interference
const originalFetch = window.fetch.bind(window);

// Default configuration
const DEFAULT_CONFIG = {
  timeout: 8000, // 8 seconds
  headers: {
    "Content-Type": "application/json",
  },
};

// Create a fetch wrapper with timeout and error handling - ABSOLUTELY NEVER THROWS
export const apiCall = async (endpoint, options = {}) => {
  // Return a promise that always resolves, never rejects
  return new Promise((resolve) => {
    // Wrap the entire async operation in try-catch to ensure promise always resolves
    const executeApiCall = async () => {
      try {
        const config = {
          ...DEFAULT_CONFIG,
          ...options,
          headers: {
            ...DEFAULT_CONFIG.headers,
            ...options.headers,
          },
        };

        // Add authentication token if available
        try {
          const token = localStorage.getItem("token");
          if (token) {
            config.headers.Authorization = `Bearer ${token}`;
          }
        } catch (e) {
          // Ignore localStorage errors
        }

        // Create abort controller for timeout
        const controller = new AbortController();
        const timeoutId = setTimeout(() => {
          try {
            controller.abort();
          } catch (e) {
            // Ignore abort errors
          }
        }, config.timeout);

        let response;
        try {
          response = await originalFetch(`${API_BASE_URL}${endpoint}`, {
            ...config,
            signal: controller.signal,
          });
        } catch (fetchError) {
          clearTimeout(timeoutId);

          // Handle fetch errors immediately
          let errorMessage = "Network error - backend API not available";
          if (fetchError && fetchError.name === "AbortError") {
            errorMessage = "Request timed out";
          } else if (fetchError && fetchError.message) {
            errorMessage = fetchError.message;
          }

          resolve({
            success: false,
            error: errorMessage,
            originalError: fetchError,
          });
          return;
        }

        clearTimeout(timeoutId);

        // Handle different response statuses
        if (response && response.ok) {
          try {
            const contentType = response.headers.get("content-type");
            if (contentType && contentType.includes("application/json")) {
              const data = await response.json();
              resolve(data);
              return;
            }
            const textData = await response.text();
            resolve({ success: true, data: textData });
            return;
          } catch (parseError) {
            resolve({
              success: false,
              error: "Failed to parse response",
              originalError: parseError,
            });
            return;
          }
        } else if (response) {
          // Handle HTTP errors
          try {
            const errorData = await response.json();
            resolve({
              success: false,
              error:
                errorData.message ||
                `HTTP ${response.status}: ${response.statusText}`,
              status: response.status,
            });
            return;
          } catch (parseError) {
            resolve({
              success: false,
              error: `HTTP ${response.status}: ${response.statusText}`,
              status: response.status,
            });
            return;
          }
        } else {
          resolve({
            success: false,
            error: "No response received",
          });
          return;
        }
      } catch (globalError) {
        // Final safety net - should never reach here
        resolve({
          success: false,
          error: "Unexpected error occurred",
          originalError: globalError,
        });
      }
    };

    // Execute the async function and catch any unhandled promise rejections
    executeApiCall().catch((error) => {
      resolve({
        success: false,
        error: "Critical error occurred",
        originalError: error,
      });
    });
  });
};

// Convenience methods for different HTTP verbs - NEVER THROW ERRORS
export const api = {
  get: async (endpoint, options = {}) => {
    return await apiCall(endpoint, { method: "GET", ...options });
  },

  post: async (endpoint, data, options = {}) => {
    return await apiCall(endpoint, {
      method: "POST",
      body: JSON.stringify(data),
      ...options,
    });
  },

  put: async (endpoint, data, options = {}) => {
    return await apiCall(endpoint, {
      method: "PUT",
      body: JSON.stringify(data),
      ...options,
    });
  },

  patch: async (endpoint, data, options = {}) => {
    return await apiCall(endpoint, {
      method: "PATCH",
      body: JSON.stringify(data),
      ...options,
    });
  },

  delete: async (endpoint, options = {}) => {
    return await apiCall(endpoint, { method: "DELETE", ...options });
  },
};

// Utility function for handling API calls with error logging
export const safeApiCall = async (apiFunction, fallbackValue = null) => {
  try {
    const result = await apiFunction();

    // Check if the API call was successful
    if (result && result.success === false) {
      // API call failed but didn't throw - this is expected behavior
      console.warn("API call failed (safely handled):", result.error);
      return { success: false, data: fallbackValue, error: result.error };
    }

    // API call was successful
    return { success: true, data: result.data || result, error: null };
  } catch (error) {
    // This should rarely happen now, but keep as final safety net
    const errorMessage = error.message || "Unknown error occurred";
    console.warn("API call threw error (safely handled):", errorMessage);
    return { success: false, data: fallbackValue, error: errorMessage };
  }
};

// Export API base URL for other components
export { API_BASE_URL };

export default api;
