// Global error handler for unhandled errors
class ErrorHandler {
  constructor() {
    this.initializeErrorHandling();
  }

  initializeErrorHandling() {
    // Only run in browser environment
    if (typeof window === "undefined") return;

    // Handle unhandled promise rejections
    window.addEventListener("unhandledrejection", (event) => {
      console.warn("Unhandled promise rejection:", event.reason);
      // Prevent the default browser error handling
      event.preventDefault();
    });

    // Handle JavaScript errors
    window.addEventListener("error", (event) => {
      console.warn("JavaScript error caught:", {
        message: event.message,
        filename: event.filename,
        lineno: event.lineno,
        colno: event.colno,
        error: event.error,
      });

      // Don't prevent default for development
      if (process.env.NODE_ENV === "production") {
        event.preventDefault();
      }
    });

    // React error boundary fallback
    window.addEventListener("React-Error", (event) => {
      console.warn("React error caught:", event.detail);
    });
  }

  // Manual error logging
  logError(error, context = "") {
    console.error(`Error in ${context}:`, error);

    // In production, you might want to send this to an error tracking service
    if (process.env.NODE_ENV === "production") {
      // Example: Send to error tracking service
      // errorTrackingService.log(error, context);
    }
  }

  // Safe function execution wrapper
  safeExecute(fn, context = "unknown", fallback = null) {
    try {
      return fn();
    } catch (error) {
      this.logError(error, context);
      return fallback;
    }
  }

  // Safe async function execution wrapper
  async safeExecuteAsync(fn, context = "unknown", fallback = null) {
    try {
      return await fn();
    } catch (error) {
      this.logError(error, context);
      return fallback;
    }
  }
}

// Create global instance
const errorHandler = new ErrorHandler();

export default errorHandler;
