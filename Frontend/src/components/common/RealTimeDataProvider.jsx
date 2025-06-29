import React, { createContext, useContext, useState, useEffect } from "react";
import { useSelector } from "react-redux";
import socketClient from "../../utils/socketClient";
import { api, safeApiCall } from "../../utils/apiClient";

// Create context for real-time data
const RealTimeDataContext = createContext();

export const useRealTimeData = () => {
  const context = useContext(RealTimeDataContext);
  if (!context) {
    throw new Error(
      "useRealTimeData must be used within a RealTimeDataProvider",
    );
  }
  return context;
};

export const RealTimeDataProvider = ({ children }) => {
  const { user, token } = useSelector((state) => state.auth);
  const [isConnected, setIsConnected] = useState(false);
  const [fallbackMode, setFallbackMode] = useState(false);
  const [lastUpdate, setLastUpdate] = useState(new Date());
  const [liveStats, setLiveStats] = useState({
    totalOrders: 0,
    totalUsers: 0,
    totalProducts: 0,
    totalRevenue: 0,
    pendingOrders: 0,
    lowStockProducts: 0,
    newUsersToday: 0,
    unreadMessages: 0,
  });

  // Track connection status and fallback mode
  useEffect(() => {
    const checkConnection = () => {
      if (socketClient) {
        const status = socketClient.getConnectionStatus();
        setIsConnected(status.connected);
        setFallbackMode(status.fallbackMode);

        // If connection failed, log diagnostic info
        if (!status.connected && status.connectionAttempts >= 3) {
          console.warn("🔍 Socket connection struggling...");
          console.log("💡 App will continue with manual refresh for updates");
        }
      }
    };

    // Listen for fallback mode events
    const handleFallbackMode = (event) => {
      console.log("🚨 Socket fallback mode activated:", event.detail.reason);
      setFallbackMode(true);
      setIsConnected(false);
    };

    window.addEventListener('socket-fallback-mode', handleFallbackMode);

    checkConnection();
    const interval = setInterval(checkConnection, 2000);

    return () => {
      clearInterval(interval);
      window.removeEventListener('socket-fallback-mode', handleFallbackMode);
    };
  }, []);

  // Fetch initial dashboard data
  const fetchDashboardStats = async () => {
    if (!user || !token) return;

    try {
      const endpoint =
        user.role === 1 || user.role === "admin"
          ? "/api/analytics/dashboard-stats"
          : "/api/users/dashboard-stats";

      const { success, data } = await safeApiCall(() => api.get(endpoint), {});

      if (success && data?.data) {
        setLiveStats((prev) => ({
          ...prev,
          ...data.data,
        }));
        setLastUpdate(new Date());
      }
    } catch (error) {
      console.error("Failed to fetch dashboard stats:", error);
    }
  };

  // Setup real-time listeners
  useEffect(() => {
    if (!user || !token || !socketClient) return;

    // Initial data fetch
    fetchDashboardStats();

    // Setup socket listeners based on user role
    if (user.role === 1 || user.role === "admin") {
      // Admin listeners
      socketClient.on("admin_notification", (data) => {
        console.log("📊 Admin notification - updating stats:", data);

        if (data.type === "order" || data.type === "new-order") {
          setLiveStats((prev) => ({
            ...prev,
            totalOrders: prev.totalOrders + 1,
            pendingOrders: prev.pendingOrders + 1,
          }));
        }

        if (data.type === "user" || data.type === "new-user") {
          setLiveStats((prev) => ({
            ...prev,
            totalUsers: prev.totalUsers + 1,
            newUsersToday: prev.newUsersToday + 1,
          }));
        }

        if (data.type === "message" || data.type === "new-message") {
          setLiveStats((prev) => ({
            ...prev,
            unreadMessages: prev.unreadMessages + 1,
          }));
        }

        setLastUpdate(new Date());
      });

      socketClient.on("order-updated", (data) => {
        console.log("🛍️ Order updated - refreshing stats:", data);
        fetchDashboardStats();
      });

      socketClient.on("inventory-changed", (data) => {
        console.log("📦 Inventory changed - updating stats:", data);
        if (
          data.product &&
          data.product.stock <= (data.product.minStock || 10)
        ) {
          setLiveStats((prev) => ({
            ...prev,
            lowStockProducts: prev.lowStockProducts + 1,
          }));
        }
        setLastUpdate(new Date());
      });

      socketClient.on("new-user-registered", (data) => {
        console.log("👤 New user registered:", data);
        setLiveStats((prev) => ({
          ...prev,
          totalUsers: prev.totalUsers + 1,
          newUsersToday: prev.newUsersToday + 1,
        }));
        setLastUpdate(new Date());
      });

      socketClient.on("new-message", (data) => {
        console.log("💬 New message received:", data);
        setLiveStats((prev) => ({
          ...prev,
          unreadMessages: prev.unreadMessages + 1,
        }));
        setLastUpdate(new Date());
      });
    } else {
      // User listeners
      socketClient.on("order-status-changed", (data) => {
        console.log("📦 Order status changed:", data);
        setLastUpdate(new Date());
      });

      socketClient.on("user_notification", (data) => {
        console.log("🔔 User notification:", data);
        setLastUpdate(new Date());
      });
    }

    // Generic listeners for all users
    socketClient.on("connection-confirmed", (data) => {
      console.log("✅ Socket connection confirmed:", data);
      setIsConnected(true);
      fetchDashboardStats();
    });

    socketClient.on("disconnect", () => {
      console.log("❌ Socket disconnected");
      setIsConnected(false);
    });

    // Auto-refresh data every 5 minutes
    const autoRefresh = setInterval(() => {
      console.log("🔄 Auto-refreshing dashboard stats");
      fetchDashboardStats();
    }, 300000); // 5 minutes

    return () => {
      // Cleanup listeners
      if (socketClient && socketClient.off) {
        socketClient.off("admin_notification");
        socketClient.off("order-updated");
        socketClient.off("inventory-changed");
        socketClient.off("new-user-registered");
        socketClient.off("new-message");
        socketClient.off("order-status-changed");
        socketClient.off("user_notification");
        socketClient.off("connection-confirmed");
        socketClient.off("disconnect");
      }
      clearInterval(autoRefresh);
    };
  }, [user, token]);

  // Force refresh data and reconnect socket
  const forceRefresh = async () => {
    console.log("🔄 Force refreshing dashboard data and reconnecting socket");

    // Try to reconnect socket if disconnected
    if (!isConnected && user && token) {
      console.log("🔌 Attempting to reconnect socket...");
      socketClient.forceReconnect(token, user.role);
    }

    await fetchDashboardStats();
    setLastUpdate(new Date());
  };
  // Update single stat
  const updateStat = (key, value) => {
    setLiveStats((prev) => ({
      ...prev,
      [key]: value,
    }));
    setLastUpdate(new Date());
  };

  // Increment stat
  const incrementStat = (key, amount = 1) => {
    setLiveStats((prev) => ({
      ...prev,
      [key]: (prev[key] || 0) + amount,
    }));
    setLastUpdate(new Date());
  };

  const contextValue = {
    isConnected,
    lastUpdate,
    liveStats,
    updateStat,
    incrementStat,
    forceRefresh,
    isAdmin: user?.role === 1 || user?.role === "admin",
    user,
  };

  return (
    <RealTimeDataContext.Provider
      value={{
        isConnected,
        fallbackMode,
        lastUpdate,
        liveStats,
        forceRefresh,
      }}
    >