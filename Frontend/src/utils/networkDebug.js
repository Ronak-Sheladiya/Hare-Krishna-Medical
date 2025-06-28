// Network debugging utility to help diagnose connectivity issues

import { getBackendURL } from "./config";
import { api } from "./apiClient";

/**
 * Test network connectivity to the backend
 */
export const testNetworkConnectivity = async () => {
  const backendURL = getBackendURL();
  const results = {
    backendURL,
    currentLocation: window.location.href,
    isOnline: navigator.onLine,
    hasAuthToken: !!(
      localStorage.getItem("token") || sessionStorage.getItem("token")
    ),
    tests: {},
  };

  console.group("🌐 Network Connectivity Test");
  console.log("Backend URL:", backendURL);
  console.log("Online Status:", navigator.onLine);

  // Test 1: Basic fetch to health endpoint with proper timeout
  try {
    console.log("🔄 Testing /api/health endpoint...");

    // Create AbortController for timeout
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000);

    const healthResponse = await fetch(`${backendURL}/api/health`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (healthResponse.ok) {
      const healthData = await healthResponse.json();
      results.tests.health = { success: true, data: healthData };
      console.log("✅ Health check passed:", healthData);
    } else {
      results.tests.health = { success: false, status: healthResponse.status, statusText: healthResponse.statusText };
      console.log("❌ Health check failed:", healthResponse.status, healthResponse.statusText);
    }
  } catch (error) {
    let errorMessage = error.message;
    if (error.name === 'AbortError') {
      errorMessage = 'Request timed out after 5 seconds';
    } else if (error.message === 'Failed to fetch') {
      errorMessage = 'Network error - cannot reach backend server';
    }
    results.tests.health = { success: false, error: errorMessage };
    console.log("❌ Health check error:", errorMessage);
  }
        healthResponse.status,
        healthResponse.statusText,
      );
    }
  } catch (error) {
    results.tests.health = { success: false, error: error.message };
    console.log("❌ Health check error:", error.message);
  }

  // Test 2: API client test
  try {
    console.log("🔄 Testing API client...");
    const apiResponse = await api.get("/api/health");
    results.tests.apiClient = { success: true, data: apiResponse };
    console.log("✅ API client test passed:", apiResponse);
  } catch (error) {
    results.tests.apiClient = { success: false, error: error.message };
    console.log("❌ API client test failed:", error.message);
  }

  // Test 3: Auth endpoint test (if token exists)
  const token =
    localStorage.getItem("token") || sessionStorage.getItem("token");
  if (token) {
    try {
      console.log("🔄 Testing authenticated endpoint...");
      const authResponse = await api.get("/api/auth/profile");
      results.tests.auth = { success: true, data: authResponse };
      console.log("✅ Auth test passed:", authResponse);
    } catch (error) {
      results.tests.auth = { success: false, error: error.message };
      console.log("❌ Auth test failed:", error.message);
    }
  } else {
    results.tests.auth = { skipped: true, reason: "No auth token found" };
    console.log("⚠️ Auth test skipped: No token found");
  }

  console.groupEnd();
  return results;
};

/**
 * Display network debug information in a user-friendly format
 */
export const showNetworkDebugInfo = async () => {
  const results = await testNetworkConnectivity();

  let message = `🌐 Network Debug Info:\n\n`;
  message += `Backend URL: ${results.backendURL}\n`;
  message += `Online Status: ${results.isOnline ? "Online" : "Offline"}\n`;
  message += `Auth Token: ${results.hasAuthToken ? "Present" : "Missing"}\n\n`;

  message += `Test Results:\n`;
  message += `- Health Check: ${results.tests.health?.success ? "✅ Passed" : "❌ Failed"}\n`;
  message += `- API Client: ${results.tests.apiClient?.success ? "✅ Passed" : "❌ Failed"}\n`;
  message += `- Auth Test: ${results.tests.auth?.success ? "✅ Passed" : results.tests.auth?.skipped ? "⚠️ Skipped" : "❌ Failed"}\n`;

  if (!results.tests.health?.success) {
    message += `\nHealth Check Error: ${results.tests.health?.error || "Unknown error"}\n`;
  }

  if (!results.tests.apiClient?.success) {
    message += `API Client Error: ${results.tests.apiClient?.error || "Unknown error"}\n`;
  }

  console.log(message);
  return results;
};

/**
 * Quick connectivity check
 */
export const quickConnectivityCheck = async () => {
  try {
    const backendURL = getBackendURL();
    const response = await fetch(`${backendURL}/api/health`, {
      method: "GET",
      timeout: 3000,
    });
    return response.ok;
  } catch (error) {
    console.warn("Quick connectivity check failed:", error.message);
    return false;
  }
};

export default {
  testNetworkConnectivity,
  showNetworkDebugInfo,
  quickConnectivityCheck,
};