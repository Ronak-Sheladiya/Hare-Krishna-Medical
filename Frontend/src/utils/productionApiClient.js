// Production-first API client for critical operations
// Always uses production backend URL to avoid connectivity issues

const PRODUCTION_BACKEND_URL = "https://hare-krishna-medical.onrender.com";

/**
 * Simple production API client with minimal dependencies
 */
export const productionApiCall = async (endpoint, options = {}) => {
  const config = {
    method: "GET",
    timeout: 15000,
    headers: {
      "Content-Type": "application/json",
    },
    ...options,
  };

  // Add auth token if available
  try {
    const token =
      localStorage.getItem("token") || sessionStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  } catch (e) {
    console.warn("Could not access token storage");
  }

  const url = `${PRODUCTION_BACKEND_URL}${endpoint}`;
  console.log(`🔗 Production API Call: ${config.method} ${url}`);

  try {
    // Create abort controller for timeout
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), config.timeout);

    const response = await fetch(url, {
      ...config,
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    const contentType = response.headers.get("content-type");
    if (contentType && contentType.includes("application/json")) {
      return await response.json();
    }

    return await response.text();
  } catch (error) {
    console.error(`❌ Production API Error for ${endpoint}:`, error);

    if (error.name === "AbortError") {
      throw new Error("Request timed out. Please try again.");
    }

    if (error.message === "Failed to fetch") {
      throw new Error(
        "Unable to connect to our servers. Please check your internet connection and try again.",
      );
    }

    throw error;
  }
};

// Convenience methods
export const productionApi = {
  get: (endpoint, options = {}) =>
    productionApiCall(endpoint, { ...options, method: "GET" }),

  post: (endpoint, data, options = {}) =>
    productionApiCall(endpoint, {
      ...options,
      method: "POST",
      body: JSON.stringify(data),
    }),

  put: (endpoint, data, options = {}) =>
    productionApiCall(endpoint, {
      ...options,
      method: "PUT",
      body: JSON.stringify(data),
    }),

  patch: (endpoint, data, options = {}) =>
    productionApiCall(endpoint, {
      ...options,
      method: "PATCH",
      body: JSON.stringify(data),
    }),

  delete: (endpoint, options = {}) =>
    productionApiCall(endpoint, { ...options, method: "DELETE" }),
};

export default productionApi;
