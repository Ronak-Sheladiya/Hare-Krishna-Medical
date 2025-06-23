import { useEffect, useState } from "react";
import { useSelector } from "react-redux";

// Import socketClient with error handling
let socketClient = null;
try {
  if (typeof window !== "undefined") {
    const socketModule = await import("../utils/socketClient");
    socketClient = socketModule.default;
  }
} catch (error) {
  console.warn(
    "SocketClient not available. Install socket.io-client: npm install socket.io-client",
  );
}

export const useRealTime = () => {
  const { user, token } = useSelector((state) => state.auth);
  const [connectionStatus, setConnectionStatus] = useState({
    isConnected: false,
    socketId: null,
  });

  useEffect(() => {
    if (!socketClient || typeof window === "undefined") return;

    const updateConnectionStatus = () => {
      try {
        setConnectionStatus(socketClient.getConnectionStatus());
      } catch (error) {
        console.warn("Failed to get connection status:", error);
        setConnectionStatus({ isConnected: false, socketId: null });
      }
    };

    // Update status every 5 seconds instead of every second
    const interval = setInterval(updateConnectionStatus, 5000);

    return () => clearInterval(interval);
  }, []);

  const emitEvent = (eventName, data) => {
    if (socketClient && typeof socketClient.emitEvent === "function") {
      socketClient.emitEvent(eventName, data);
    }
  };

  const subscribeToEvent = (eventName, callback) => {
    if (socketClient && typeof socketClient.on === "function") {
      socketClient.on(eventName, callback);
      return () => {
        if (socketClient && typeof socketClient.off === "function") {
          socketClient.off(eventName, callback);
        }
      };
    }
    return () => {}; // Return empty cleanup function if socketClient not available
  };

  return {
    isConnected: connectionStatus.isConnected,
    socketId: connectionStatus.socketId,
    emitEvent,
    subscribeToEvent,
    user,
    isAdmin: user?.role === 1,
  };
};

// Hook for admin real-time events
export const useAdminRealTime = () => {
  const { isAdmin, subscribeToEvent } = useRealTime();
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    if (!isAdmin) return;

    const unsubscribeCallbacks = [];

    // New user registration
    unsubscribeCallbacks.push(
      subscribeToEvent("admin-new-user", (data) => {
        setNotifications((prev) => [
          ...prev,
          {
            id: Date.now(),
            type: "new-user",
            title: "New User Registration",
            message: `${data.user.fullName} just registered`,
            timestamp: new Date(),
            data,
          },
        ]);
      }),
    );

    // New order
    unsubscribeCallbacks.push(
      subscribeToEvent("admin-new-order", (data) => {
        setNotifications((prev) => [
          ...prev,
          {
            id: Date.now(),
            type: "new-order",
            title: "New Order",
            message: `Order ${data.order.orderId} - ₹${data.order.total}`,
            timestamp: new Date(),
            data,
          },
        ]);
      }),
    );

    // Payment status updates
    unsubscribeCallbacks.push(
      subscribeToEvent("admin-payment-status-updated", (data) => {
        setNotifications((prev) => [
          ...prev,
          {
            id: Date.now(),
            type: "payment-update",
            title: "Payment Update",
            message: `Invoice ${data.invoiceNumber} - ${data.newStatus}`,
            timestamp: new Date(),
            data,
          },
        ]);
      }),
    );

    // Stock updates
    unsubscribeCallbacks.push(
      subscribeToEvent("admin-stock-updated", (data) => {
        if (data.product.stockStatus === "Low Stock") {
          setNotifications((prev) => [
            ...prev,
            {
              id: Date.now(),
              type: "low-stock",
              title: "Low Stock Alert",
              message: `${data.product.name} - Only ${data.product.stock} left`,
              timestamp: new Date(),
              data,
            },
          ]);
        }
      }),
    );

    // New messages
    unsubscribeCallbacks.push(
      subscribeToEvent("admin-new-message", (data) => {
        setNotifications((prev) => [
          ...prev,
          {
            id: Date.now(),
            type: "new-message",
            title: "New Message",
            message: `From: ${data.message.name} - ${data.message.subject}`,
            timestamp: new Date(),
            data,
          },
        ]);
      }),
    );

    // Cleanup
    return () => {
      unsubscribeCallbacks.forEach((unsubscribe) => unsubscribe());
    };
  }, [isAdmin, subscribeToEvent]);

  const clearNotification = (id) => {
    setNotifications((prev) =>
      prev.filter((notification) => notification.id !== id),
    );
  };

  const clearAllNotifications = () => {
    setNotifications([]);
  };

  return {
    notifications,
    clearNotification,
    clearAllNotifications,
    hasNewNotifications: notifications.length > 0,
  };
};

// Hook for user real-time events
export const useUserRealTime = () => {
  const { isAdmin, subscribeToEvent } = useRealTime();
  const [orderUpdates, setOrderUpdates] = useState([]);

  useEffect(() => {
    if (isAdmin) return;

    const unsubscribeCallbacks = [];

    // Order confirmations
    unsubscribeCallbacks.push(
      subscribeToEvent("user-order-created", (data) => {
        setOrderUpdates((prev) => [
          ...prev,
          {
            id: Date.now(),
            type: "order-confirmed",
            orderId: data.order.orderId,
            message: `Your order has been confirmed`,
            timestamp: new Date(),
            data,
          },
        ]);
      }),
    );

    // Order status changes
    unsubscribeCallbacks.push(
      subscribeToEvent("user-order-status-changed", (data) => {
        setOrderUpdates((prev) => [
          ...prev,
          {
            id: Date.now(),
            type: "order-status",
            orderId: data.orderNumber,
            message: `Order is now ${data.newStatus}`,
            timestamp: new Date(),
            data,
          },
        ]);
      }),
    );

    // Payment status changes
    unsubscribeCallbacks.push(
      subscribeToEvent("user-payment-status-changed", (data) => {
        setOrderUpdates((prev) => [
          ...prev,
          {
            id: Date.now(),
            type: "payment-status",
            orderId: data.invoiceNumber,
            message: `Payment is ${data.newStatus}`,
            timestamp: new Date(),
            data,
          },
        ]);
      }),
    );

    // Cleanup
    return () => {
      unsubscribeCallbacks.forEach((unsubscribe) => unsubscribe());
    };
  }, [isAdmin, subscribeToEvent]);

  const clearOrderUpdate = (id) => {
    setOrderUpdates((prev) => prev.filter((update) => update.id !== id));
  };

  return {
    orderUpdates,
    clearOrderUpdate,
    hasNewUpdates: orderUpdates.length > 0,
  };
};

export default useRealTime;
