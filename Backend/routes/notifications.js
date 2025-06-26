const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const User = require("../models/User");
const Order = require("../models/Order");
const Product = require("../models/Product");

// Mock notification storage (in production, use a database)
let notifications = [];

// Helper function to create notification
const createNotification = (
  type,
  title,
  message,
  actionUrl = null,
  metadata = {},
) => {
  const notification = {
    id: Date.now() + Math.random(),
    type,
    title,
    message,
    actionUrl,
    metadata,
    timestamp: new Date().toISOString(),
    isRead: false,
    icon: getIconForType(type),
    color: getColorForType(type),
  };

  notifications.unshift(notification);

  // Keep only last 100 notifications
  if (notifications.length > 100) {
    notifications = notifications.slice(0, 100);
  }

  return notification;
};

// Helper functions for icon and color mapping
const getIconForType = (type) => {
  const iconMap = {
    order: "bi-bag-check",
    stock: "bi-exclamation-triangle",
    message: "bi-envelope",
    payment: "bi-credit-card",
    user: "bi-person-plus",
    system: "bi-gear",
  };
  return iconMap[type] || "bi-bell";
};

const getColorForType = (type) => {
  const colorMap = {
    order: "success",
    stock: "warning",
    message: "info",
    payment: "success",
    user: "primary",
    system: "secondary",
  };
  return colorMap[type] || "primary";
};

// Get all notifications for admin
router.get("/", auth, async (req, res) => {
  try {
    // Only admin can access notifications
    if (req.user.role !== 1) {
      return res.status(403).json({
        success: false,
        message: "Access denied. Admin only.",
      });
    }

    // Get real-time data for dashboard
    const [
      totalUsers,
      totalOrders,
      pendingOrders,
      lowStockProducts,
      todayOrders,
      recentUsers,
    ] = await Promise.all([
      User.countDocuments({ role: 0 }),
      Order.countDocuments(),
      Order.countDocuments({ orderStatus: "pending" }),
      Product.countDocuments({ $expr: { $lte: ["$stock", "$threshold"] } }),
      Order.countDocuments({
        createdAt: { $gte: new Date(new Date().setHours(0, 0, 0, 0)) },
      }),
      User.find({ role: 0 }).sort({ createdAt: -1 }).limit(5),
    ]);

    // Generate dynamic notifications based on current data
    const dynamicNotifications = [];

    // Add pending orders notification
    if (pendingOrders > 0) {
      dynamicNotifications.push({
        id: `pending-orders-${Date.now()}`,
        type: "order",
        title: "Pending Orders",
        message: `You have ${pendingOrders} pending order${pendingOrders > 1 ? "s" : ""} awaiting processing`,
        actionUrl: "/admin/orders",
        timestamp: new Date().toISOString(),
        isRead: false,
        icon: "bi-bag-check",
        color: "warning",
        count: pendingOrders,
      });
    }

    // Add low stock notification
    if (lowStockProducts > 0) {
      dynamicNotifications.push({
        id: `low-stock-${Date.now()}`,
        type: "stock",
        title: "Low Stock Alert",
        message: `${lowStockProducts} product${lowStockProducts > 1 ? "s are" : " is"} running low on stock`,
        actionUrl: "/admin/products",
        timestamp: new Date().toISOString(),
        isRead: false,
        icon: "bi-exclamation-triangle",
        color: "warning",
        count: lowStockProducts,
      });
    }

    // Add today's orders notification
    if (todayOrders > 0) {
      dynamicNotifications.push({
        id: `today-orders-${Date.now()}`,
        type: "order",
        title: "Today's Orders",
        message: `${todayOrders} new order${todayOrders > 1 ? "s" : ""} received today`,
        actionUrl: "/admin/orders",
        timestamp: new Date().toISOString(),
        isRead: false,
        icon: "bi-bag-plus",
        color: "success",
        count: todayOrders,
      });
    }

    // Combine static and dynamic notifications
    const allNotifications = [...dynamicNotifications, ...notifications]
      .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
      .slice(0, 50);

    res.json({
      success: true,
      data: allNotifications,
      stats: {
        totalUsers,
        totalOrders,
        pendingOrders,
        lowStockProducts,
        todayOrders,
      },
    });
  } catch (error) {
    console.error("Error fetching notifications:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching notifications",
      error: error.message,
    });
  }
});

// Mark notification as read
router.patch("/:id/read", auth, async (req, res) => {
  try {
    if (req.user.role !== 1) {
      return res.status(403).json({
        success: false,
        message: "Access denied. Admin only.",
      });
    }

    const notification = notifications.find(
      (n) => n.id.toString() === req.params.id,
    );
    if (notification) {
      notification.isRead = true;
    }

    res.json({
      success: true,
      message: "Notification marked as read",
    });
  } catch (error) {
    console.error("Error marking notification as read:", error);
    res.status(500).json({
      success: false,
      message: "Error updating notification",
    });
  }
});

// Mark all notifications as read
router.patch("/read-all", auth, async (req, res) => {
  try {
    if (req.user.role !== 1) {
      return res.status(403).json({
        success: false,
        message: "Access denied. Admin only.",
      });
    }

    notifications.forEach((n) => (n.isRead = true));

    res.json({
      success: true,
      message: "All notifications marked as read",
    });
  } catch (error) {
    console.error("Error marking all notifications as read:", error);
    res.status(500).json({
      success: false,
      message: "Error updating notifications",
    });
  }
});

// Delete notification
router.delete("/:id", auth, async (req, res) => {
  try {
    if (req.user.role !== 1) {
      return res.status(403).json({
        success: false,
        message: "Access denied. Admin only.",
      });
    }

    const index = notifications.findIndex(
      (n) => n.id.toString() === req.params.id,
    );
    if (index !== -1) {
      notifications.splice(index, 1);
    }

    res.json({
      success: true,
      message: "Notification deleted",
    });
  } catch (error) {
    console.error("Error deleting notification:", error);
    res.status(500).json({
      success: false,
      message: "Error deleting notification",
    });
  }
});

// Add a new notification (internal use)
const addNotification = (
  type,
  title,
  message,
  actionUrl = null,
  metadata = {},
) => {
  return createNotification(type, title, message, actionUrl, metadata);
};

// Export the router as default, and helper functions as properties
module.exports = router;
module.exports.addNotification = addNotification;
module.exports.createNotification = createNotification;
