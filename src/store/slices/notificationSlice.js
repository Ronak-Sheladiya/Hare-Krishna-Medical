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

    // Simulate real-time notifications for demo
    simulateNotifications: (state) => {
      const demoNotifications = [
        {
          type: "order",
          title: "New Order Received",
          message: "Order #HKM12345690 has been placed",
          icon: "bi-bag-check",
          color: "success",
          actionUrl: "/admin/orders",
        },
        {
          type: "message",
          title: "New Customer Message",
          message: "You have a new message from Sarah Wilson",
          icon: "bi-envelope",
          color: "info",
          actionUrl: "/admin/messages",
        },
        {
          type: "stock",
          title: "Low Stock Alert",
          message: "Paracetamol Tablets are running low (5 left)",
          icon: "bi-exclamation-triangle",
          color: "warning",
          actionUrl: "/admin/products",
        },
        {
          type: "payment",
          title: "Payment Received",
          message: "Payment of ₹245.80 received for Order #HKM12345685",
          icon: "bi-credit-card",
          color: "success",
          actionUrl: "/admin/orders",
        },
        {
          type: "user",
          title: "New User Registration",
          message: "Alex Johnson has registered on your website",
          icon: "bi-person-plus",
          color: "primary",
          actionUrl: "/admin/users",
        },
      ];

      // Add a random notification
      const randomNotification =
        demoNotifications[Math.floor(Math.random() * demoNotifications.length)];

      const notification = {
        id: Date.now(),
        timestamp: new Date().toISOString(),
        isRead: false,
        ...randomNotification,
      };

      state.notifications.unshift(notification);
      state.unreadCount += 1;
      state.lastNotification = notification;
      state.showToast = true;
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
  simulateNotifications,
} = notificationSlice.actions;

export default notificationSlice.reducer;
