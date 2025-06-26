/**
 * Data Refresh Manager
 * Centralized utility for managing real-time data synchronization across components
 * Provides consistent event-driven data refreshing throughout the application
 */

class DataRefreshManager {
  constructor() {
    this.listeners = new Map();
    this.refreshQueue = new Set();
    this.isProcessing = false;
    this.debounceTimeout = null;
  }

  /**
   * Register a refresh listener for a specific data type
   * @param {string} dataType - Type of data (orders, products, users, etc.)
   * @param {function} callback - Function to call when refresh is needed
   * @param {object} options - Additional options
   */
  registerListener(dataType, callback, options = {}) {
    const { debounce = 300, priority = 0 } = options;

    if (!this.listeners.has(dataType)) {
      this.listeners.set(dataType, []);
    }

    const listener = {
      callback,
      debounce,
      priority,
      id: Date.now() + Math.random(),
    };

    this.listeners.get(dataType).push(listener);

    // Sort by priority (higher priority first)
    this.listeners.get(dataType).sort((a, b) => b.priority - a.priority);

    return listener.id;
  }

  /**
   * Unregister a specific listener
   * @param {string} dataType - Type of data
   * @param {string} listenerId - ID returned from registerListener
   */
  unregisterListener(dataType, listenerId) {
    if (this.listeners.has(dataType)) {
      const listeners = this.listeners.get(dataType);
      const index = listeners.findIndex((l) => l.id === listenerId);
      if (index !== -1) {
        listeners.splice(index, 1);
      }
    }
  }

  /**
   * Trigger refresh for specific data type
   * @param {string} dataType - Type of data to refresh
   * @param {object} data - Optional data to pass to listeners
   * @param {object} options - Refresh options
   */
  triggerRefresh(dataType, data = null, options = {}) {
    const { immediate = false, skipDebounce = false } = options;

    console.log(`Triggering refresh for ${dataType}`, data);

    if (immediate || skipDebounce) {
      this._executeRefresh(dataType, data);
    } else {
      this.refreshQueue.add({ dataType, data });
      this._debouncedProcess();
    }
  }

  /**
   * Trigger multiple refreshes at once
   * @param {array} refreshes - Array of {dataType, data} objects
   */
  triggerMultipleRefresh(refreshes, options = {}) {
    refreshes.forEach(({ dataType, data }) => {
      this.refreshQueue.add({ dataType, data });
    });
    this._debouncedProcess(options);
  }

  /**
   * Execute refresh immediately for a data type
   * @private
   */
  _executeRefresh(dataType, data) {
    if (!this.listeners.has(dataType)) {
      console.warn(`No listeners registered for data type: ${dataType}`);
      return;
    }

    const listeners = this.listeners.get(dataType);

    listeners.forEach((listener) => {
      try {
        listener.callback(data);
      } catch (error) {
        console.error(`Error in refresh listener for ${dataType}:`, error);
      }
    });
  }

  /**
   * Process refresh queue with debouncing
   * @private
   */
  _debouncedProcess(options = {}) {
    const { debounceTime = 300 } = options;

    if (this.debounceTimeout) {
      clearTimeout(this.debounceTimeout);
    }

    this.debounceTimeout = setTimeout(() => {
      this._processQueue();
    }, debounceTime);
  }

  /**
   * Process all queued refreshes
   * @private
   */
  _processQueue() {
    if (this.isProcessing) return;

    this.isProcessing = true;

    const refreshes = Array.from(this.refreshQueue);
    this.refreshQueue.clear();

    // Group by data type to avoid duplicate refreshes
    const groupedRefreshes = new Map();
    refreshes.forEach(({ dataType, data }) => {
      if (!groupedRefreshes.has(dataType)) {
        groupedRefreshes.set(dataType, []);
      }
      groupedRefreshes.get(dataType).push(data);
    });

    // Execute refreshes
    groupedRefreshes.forEach((dataArray, dataType) => {
      // Merge data if multiple updates for same type
      const mergedData = dataArray.length === 1 ? dataArray[0] : dataArray;
      this._executeRefresh(dataType, mergedData);
    });

    this.isProcessing = false;
  }

  /**
   * Clear all listeners and queues
   */
  reset() {
    this.listeners.clear();
    this.refreshQueue.clear();
    this.isProcessing = false;

    if (this.debounceTimeout) {
      clearTimeout(this.debounceTimeout);
      this.debounceTimeout = null;
    }
  }

  /**
   * Get status information
   */
  getStatus() {
    return {
      listenersCount: Array.from(this.listeners.values()).reduce(
        (sum, arr) => sum + arr.length,
        0,
      ),
      queueSize: this.refreshQueue.size,
      isProcessing: this.isProcessing,
      registeredTypes: Array.from(this.listeners.keys()),
    };
  }
}

// Create singleton instance
const dataRefreshManager = new DataRefreshManager();

// Enhanced window event integration
const enhanceWindowEvents = () => {
  // Map old events to new system
  const eventMappings = {
    refreshOrders: "orders",
    refreshProducts: "products",
    refreshUsers: "users",
    refreshAnalytics: "analytics",
    refreshMessages: "messages",
    refreshInvoices: "invoices",
    refreshLetterheads: "letterheads",
    refreshDashboard: "dashboard",
    profileUpdated: "profile",
  };

  Object.entries(eventMappings).forEach(([eventName, dataType]) => {
    window.addEventListener(eventName, (event) => {
      dataRefreshManager.triggerRefresh(dataType, event.detail, {
        immediate: true,
      });
    });
  });
};

// Initialize enhanced events
enhanceWindowEvents();

// Convenience functions for common refresh patterns
export const refreshHelpers = {
  // Refresh dashboard and related data
  refreshDashboard: (data) => {
    dataRefreshManager.triggerMultipleRefresh([
      { dataType: "dashboard", data },
      { dataType: "analytics", data },
    ]);
  },

  // Refresh after order changes
  refreshOrderRelated: (data) => {
    dataRefreshManager.triggerMultipleRefresh([
      { dataType: "orders", data },
      { dataType: "analytics", data },
      { dataType: "dashboard", data },
    ]);
  },

  // Refresh after product changes
  refreshProductRelated: (data) => {
    dataRefreshManager.triggerMultipleRefresh([
      { dataType: "products", data },
      { dataType: "analytics", data },
      { dataType: "dashboard", data },
    ]);
  },

  // Refresh after profile changes
  refreshProfileRelated: (data) => {
    dataRefreshManager.triggerMultipleRefresh([
      { dataType: "profile", data },
      { dataType: "dashboard", data },
    ]);
  },

  // Refresh everything (use sparingly)
  refreshAll: () => {
    const allTypes = [
      "orders",
      "products",
      "users",
      "analytics",
      "messages",
      "invoices",
      "letterheads",
      "dashboard",
      "profile",
    ];
    dataRefreshManager.triggerMultipleRefresh(
      allTypes.map((dataType) => ({ dataType, data: null })),
      { debounceTime: 500 },
    );
  },
};

// Hook for React components
export const useDataRefresh = (dataType, callback, options = {}) => {
  React.useEffect(() => {
    const listenerId = dataRefreshManager.registerListener(
      dataType,
      callback,
      options,
    );

    return () => {
      dataRefreshManager.unregisterListener(dataType, listenerId);
    };
  }, [dataType, callback, options]);
};

export default dataRefreshManager;
