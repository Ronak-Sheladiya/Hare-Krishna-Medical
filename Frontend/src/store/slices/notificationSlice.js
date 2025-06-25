import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  notifications: [],
  unreadCount: 0,
  showToast: false,
  lastNotification: null,
};

const notificationSlice = createSlice({
  name: "notifications",
  initialState,
  reducers: {
    addNotification: (state, action) => {
      const notification = {
        id: Date.now(),
        timestamp: new Date().toISOString(),
        isRead: false,
        ...action.payload,
      };

      state.notifications.unshift(notification);
      state.unreadCount += 1;
      state.lastNotification = notification;
      state.showToast = true;

      // Keep only last 50 notifications
      if (state.notifications.length > 50) {
        state.notifications = state.notifications.slice(0, 50);
      }
    },

    markAsRead: (state, action) => {
      const notification = state.notifications.find(
        (notif) => notif.id === action.payload,
      );
      if (notification && !notification.isRead) {
        notification.isRead = true;
        state.unreadCount = Math.max(0, state.unreadCount - 1);
      }
    },

    markAllAsRead: (state) => {
      state.notifications.forEach((notif) => {
        notif.isRead = true;
      });
      state.unreadCount = 0;
    },

    removeNotification: (state, action) => {
      const index = state.notifications.findIndex(
        (notif) => notif.id === action.payload,
      );
      if (index !== -1) {
        const notification = state.notifications[index];
        if (!notification.isRead) {
          state.unreadCount = Math.max(0, state.unreadCount - 1);
        }
        state.notifications.splice(index, 1);
      }
    },

    clearAllNotifications: (state) => {
      state.notifications = [];
      state.unreadCount = 0;
    },

    hideToast: (state) => {
      state.showToast = false;
    },

    // Real-time notification handlers
    addOrderNotification: (state, action) => {
      const { orderId, customerName, totalAmount } = action.payload;
      const notification = {
        id: Date.now(),
        timestamp: new Date().toISOString(),
        isRead: false,
        type: "order",
        title: "New Order Received",
        message: `Order ${orderId} from ${customerName} - ₹${totalAmount}`,
        icon: "bi-bag-check",
        color: "success",
        actionUrl: "/admin/orders",
      };

      state.notifications.unshift(notification);
      state.unreadCount += 1;
      state.lastNotification = notification;
      state.showToast = true;
    },

    addStockNotification: (state, action) => {
      const { productName, currentStock, threshold } = action.payload;
      const notification = {
        id: Date.now(),
        timestamp: new Date().toISOString(),
        isRead: false,
        type: "stock",
        title: "Low Stock Alert",
        message: `${productName} is running low (${currentStock} left, threshold: ${threshold})`,
        icon: "bi-exclamation-triangle",
        color: "warning",
        actionUrl: "/admin/products",
      };

      state.notifications.unshift(notification);
      state.unreadCount += 1;
      state.lastNotification = notification;
      state.showToast = true;
    },

    addMessageNotification: (state, action) => {
      const { senderName, subject } = action.payload;
      const notification = {
        id: Date.now(),
        timestamp: new Date().toISOString(),
        isRead: false,
        type: "message",
        title: "New Message",
        message: `Message from ${senderName}: ${subject}`,
        icon: "bi-envelope",
        color: "info",
        actionUrl: "/admin/messages",
      };

      state.notifications.unshift(notification);
      state.unreadCount += 1;
      state.lastNotification = notification;
      state.showToast = true;
    },

    addPaymentNotification: (state, action) => {
      const { orderId, amount, method } = action.payload;
      const notification = {
        id: Date.now(),
        timestamp: new Date().toISOString(),
        isRead: false,
        type: "payment",
        title: "Payment Received",
        message: `Payment of ₹${amount} received for Order ${orderId} via ${method}`,
        icon: "bi-credit-card",
        color: "success",
        actionUrl: "/admin/orders",
      };

      state.notifications.unshift(notification);
      state.unreadCount += 1;
      state.lastNotification = notification;
      state.showToast = true;
    },

    addUserNotification: (state, action) => {
      const { userName, action: userAction } = action.payload;
      const notification = {
        id: Date.now(),
        timestamp: new Date().toISOString(),
        isRead: false,
        type: "user",
        title:
          userAction === "register" ? "New User Registration" : "User Activity",
        message:
          userAction === "register"
            ? `${userName} has registered on your website`
            : `${userName} has ${userAction}`,
        icon: "bi-person-plus",
        color: "primary",
        actionUrl: "/admin/users",
      };

      state.notifications.unshift(notification);
      state.unreadCount += 1;
      state.lastNotification = notification;
      state.showToast = true;
    },

    // Batch load notifications from API
    loadNotifications: (state, action) => {
      const notifications = action.payload || [];
      state.notifications = notifications;
      state.unreadCount = notifications.filter((n) => !n.isRead).length;
    },
  },
});

export const {
  addNotification,
  markAsRead,
  markAllAsRead,
  removeNotification,
  clearAllNotifications,
  hideToast,
  addOrderNotification,
  addStockNotification,
  addMessageNotification,
  addPaymentNotification,
  addUserNotification,
  loadNotifications,
} = notificationSlice.actions;

export default notificationSlice.reducer;
