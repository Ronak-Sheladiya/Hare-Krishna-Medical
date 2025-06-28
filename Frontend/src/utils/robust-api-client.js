import { getBackendURL } from "./config";

// List of potential backend URLs to try
const BACKEND_URLS = [
  "https://hare-krishna-medical.onrender.com",
  "https://hare-krishna-medical-backend.onrender.com",
  "https://hk-medical-backend.onrender.com",
  "http://localhost:5000",
];

// Cache for working backend URL
let workingBackendURL = null;
let lastTestedTime = 0;
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

/**
 * Test if a backend URL is accessible
 */
async function testBackendURL(url, timeout = 5000) {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeout);

    const response = await fetch(`${url}/api/health`, {
      method: "GET",
      signal: controller.signal,
      headers: {
        "Content-Type": "application/json",
      },
      mode: "cors",
    });

    clearTimeout(timeoutId);

    if (response.ok) {
      const data = await response.json();
      return {
        success: true,
        url,
        data,
        responseTime: Date.now(),
      };
    }

    return {
      success: false,
      url,
      error: `HTTP ${response.status}: ${response.statusText}`,
    };
  } catch (error) {
    return {
      success: false,
      url,
      error: error.message,
    };
  }
}

/**
 * Find a working backend URL
 */
async function findWorkingBackend() {
  console.log("🔍 Searching for working backend...");

  // Check cache first
  if (workingBackendURL && Date.now() - lastTestedTime < CACHE_DURATION) {
    console.log("✅ Using cached backend URL:", workingBackendURL);
    return workingBackendURL;
  }

  // Start with the configured URL
  const configuredURL = getBackendURL();
  const urlsToTest = [
    configuredURL,
    ...BACKEND_URLS.filter((url) => url !== configuredURL),
  ];

  console.log("🧪 Testing backend URLs:", urlsToTest);

  // Test URLs in parallel for speed
  const testPromises = urlsToTest.map((url) => testBackendURL(url));
  const results = await Promise.allSettled(testPromises);

  // Find first working backend
  for (let i = 0; i < results.length; i++) {
    const result = results[i];
    if (result.status === "fulfilled" && result.value.success) {
      workingBackendURL = result.value.url;
      lastTestedTime = Date.now();
      console.log("✅ Found working backend:", workingBackendURL);
      return workingBackendURL;
    } else if (result.status === "fulfilled") {
      console.log("❌ Backend failed:", result.value.url, result.value.error);
    } else {
      console.log("❌ Test rejected:", result.reason?.message);
    }
  }

  // No working backend found
  console.error("❌ No working backend found");
  throw new Error(
    "No accessible backend found. All backend URLs failed to respond.",
  );
}

/**
 * Robust API call with automatic backend discovery
 */
export async function robustApiCall(endpoint, options = {}) {
  try {
    // Find working backend
    const backendURL = await findWorkingBackend();

    // Make the API call
    const controller = new AbortController();
    const timeout = options.timeout || 10000;
    const timeoutId = setTimeout(() => controller.abort(), timeout);

    const response = await fetch(`${backendURL}${endpoint}`, {
      signal: controller.signal,
      headers: {
        "Content-Type": "application/json",
        ...options.headers,
      },
      mode: "cors",
      ...options,
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    const data = await response.json();
    return {
      success: true,
      data,
      backendURL,
      status: response.status,
    };
  } catch (error) {
    // If the call fails, invalidate the cache
    workingBackendURL = null;
    lastTestedTime = 0;

    return {
      success: false,
      error: error.message,
      backendURL: workingBackendURL,
    };
  }
}

/**
 * Get backend status with fallback discovery
 */
export async function getBackendStatus() {
  try {
    const healthResult = await robustApiCall("/api/health");
    if (!healthResult.success) {
      throw new Error(healthResult.error);
    }

    const productsResult = await robustApiCall("/api/products");
    if (!productsResult.success) {
      throw new Error(productsResult.error);
    }

    return {
      success: true,
      backendURL: healthResult.backendURL,
      health: healthResult.data,
      products: productsResult.data,
      totalProducts: productsResult.data.pagination?.totalProducts || 0,
    };
  } catch (error) {
    return {
      success: false,
      error: error.message,
    };
  }
}

/**
 * Clear backend cache (force rediscovery)
 */
export function clearBackendCache() {
  workingBackendURL = null;
  lastTestedTime = 0;
  console.log("🧹 Backend cache cleared");
}

export { workingBackendURL };
