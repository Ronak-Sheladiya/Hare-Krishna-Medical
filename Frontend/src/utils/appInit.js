// App initialization - runs once when app loads
import smartApi from "./smartApiClient";

let initialized = false;

/**
 * Initialize the app quietly
 */
export const initializeApp = async () => {
  if (initialized) return;

  const hostname =
    typeof window !== "undefined" ? window.location.hostname : "";

  console.log(`🚀 Initializing Hare Krishna Medical App on ${hostname}`);

  // For fly.dev, initialize smart API to check connectivity
  if (hostname.includes("fly.dev")) {
    console.log("🚁 Fly.dev environment detected, initializing smart API...");
    try {
      await smartApi.init();
      console.log("✅ Smart API initialized for fly.dev");
    } catch (error) {
      console.log("⚠️ Smart API initialization completed with fallback mode");
    }
  }

  initialized = true;
  console.log("✅ App initialization complete");
};

// Auto-initialize when module loads
if (typeof window !== "undefined") {
  // Delay slightly to avoid blocking initial render
  setTimeout(initializeApp, 1000);
}

export default { initializeApp };
