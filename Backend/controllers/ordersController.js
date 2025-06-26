const Order = require("../models/Order");
const Product = require("../models/Product");
const User = require("../models/User");
const Invoice = require("../models/Invoice");
const emailService = require("../utils/emailService");

class OrdersController {
  // Create new order
  async createOrder(req, res) {
    try {
      const { items, shippingAddress, paymentMethod, notes } = req.body;

      // Validate products and calculate totals
      let subtotal = 0;
      const processedItems = [];

      for (const item of items) {
        const product = await Product.findById(item.product);

        if (!product) {
          return res.status(400).json({
            success: false,
            message: `Product not found: ${item.product}`,
          });
        }

        if (!product.isActive) {
          return res.status(400).json({
            success: false,
            message: `Product is not available: ${product.name}`,
          });
        }

        if (product.stock < item.quantity) {
          return res.status(400).json({
            success: false,
            message: `Insufficient stock for ${product.name}. Available: ${product.stock}`,
          });
        }

        const itemTotal = product.price * item.quantity;
        subtotal += itemTotal;

        processedItems.push({
          product: product._id,
          name: product.name,
          price: product.price,
          mrp: product.mrp,
          quantity: item.quantity,
          total: itemTotal,
          image: product.images[0]?.url || "",
        });
      }

      // Create order
      const order = new Order({
        user: req.user.id,
        items: processedItems,
        shippingAddress,
        paymentMethod,
        subtotal,
        notes,
      });

      await order.save();

      // Update product stock and sales
      for (const item of processedItems) {
        await Product.findByIdAndUpdate(item.product, {
          $inc: {
            stock: -item.quantity,
            sales: item.quantity,
          },
          lastStockUpdate: new Date(),
        });
      }

      // Set estimated delivery
      await order.setEstimatedDelivery();

      // Populate order for response
      await order.populate([
        { path: "user", select: "fullName email mobile" },
        { path: "items.product", select: "name images" },
      ]);

      // Create invoice
      const invoice = new Invoice({
        order: order._id,
        user: req.user.id,
        items: processedItems,
        customerDetails: shippingAddress,
        subtotal: order.subtotal,
        tax: order.tax,
        shipping: order.shippingCharges,
        total: order.total,
        paymentMethod: order.paymentMethod,
        paymentStatus: order.paymentStatus,
      });

      await invoice.save();

      // Update order with invoice reference
      order.invoice = invoice._id;
      await order.save();

      // Send confirmation email
      try {
        await emailService.sendOrderConfirmation(
          req.user.email,
          req.user.fullName,
          order,
        );
      } catch (emailError) {
        console.error("Order confirmation email failed:", emailError);
      }

      // SMS functionality removed - using email only

      // Emit real-time updates
      const io = req.app.get("io");

      try {
        const notificationsRoute = require("../routes/notifications");
        const { addNotification } = notificationsRoute;

        // Create admin notification
        const notification = addNotification(
          "order",
          "New Order Received",
          `Order ${order.orderId} from ${req.user.fullName} - ₹${order.total}`,
          "/admin/orders",
          {
            orderId: order.orderId,
            customerName: req.user.fullName,
            totalAmount: order.total,
            itemCount: order.items.length,
          },
        );

        // Notify admin with enhanced data
        io.to("admin-room").emit("admin_notification", {
          type: "order",
          title: "New Order Received",
          message: `Order ${order.orderId} from ${req.user.fullName} - ₹${order.total}`,
          orderId: order.orderId,
          customerName: req.user.fullName,
          totalAmount: order.total,
          itemCount: order.items.length,
          paymentMethod: order.paymentMethod,
          notification: notification,
        });

        // Emit data update event for real-time dashboard refresh
        io.to("admin-room").emit("data_update", {
          type: "orders",
          action: "new_order",
          data: {
            orderId: order.orderId,
            total: order.total,
            status: order.orderStatus,
          },
        });

        // Notify user
        io.to(`user-${req.user.id}`).emit("order-created", {
          order: {
            id: order._id,
            orderId: order.orderId,
            status: order.orderStatus,
            total: order.total,
          },
        });
      } catch (notificationError) {
        console.error("Notification error:", notificationError);
        // Continue without failing the order creation
      }

      res.status(201).json({
        success: true,
        message: "Order created successfully",
        data: {
          order,
          invoice: {
            id: invoice._id,
            invoiceId: invoice.invoiceId,
          },
        },
      });
    } catch (error) {
      console.error("Create order error:", error);
      res.status(500).json({
        success: false,
        message: "Failed to create order",
        error: error.message,
      });
    }
  }

  // Get user orders
  async getUserOrders(req, res) {
    try {
      const {
        page = 1,
        limit = 10,
        status,
        paymentStatus,
        startDate,
        endDate,
      } = req.query;

      // Build filter
      const filter = { user: req.user.id };

      if (status) filter.orderStatus = status;
      if (paymentStatus) filter.paymentStatus = paymentStatus;

      // Date range filter
      if (startDate || endDate) {
        filter.createdAt = {};
        if (startDate) filter.createdAt.$gte = new Date(startDate);
        if (endDate) filter.createdAt.$lte = new Date(endDate);
      }

      // Calculate pagination
      const skip = (parseInt(page) - 1) * parseInt(limit);

      // Execute query
      const [orders, totalOrders] = await Promise.all([
        Order.find(filter)
          .sort({ createdAt: -1 })
          .skip(skip)
          .limit(parseInt(limit))
          .populate("items.product", "name images")
          .populate("invoice", "invoiceId"),
        Order.countDocuments(filter),
      ]);

      // Calculate pagination info
      const totalPages = Math.ceil(totalOrders / limit);

      res.json({
        success: true,
        data: orders,
        pagination: {
          currentPage: parseInt(page),
          totalPages,
          totalOrders,
          hasNextPage: page < totalPages,
          hasPrevPage: page > 1,
          limit: parseInt(limit),
        },
      });
    } catch (error) {
      console.error("Get orders error:", error);
      res.status(500).json({
        success: false,
        message: "Failed to fetch orders",
        error: error.message,
      });
    }
  }

  // Get single order
  async getOrder(req, res) {
    try {
      let filter = { _id: req.params.id };

      // Non-admin users can only access their own orders
      if (req.user.role !== 1) {
        filter.user = req.user.id;
      }

      const order = await Order.findOne(filter)
        .populate("user", "fullName email mobile")
        .populate("items.product", "name images brand")
        .populate("invoice", "invoiceId qrCode");

      if (!order) {
        return res.status(404).json({
          success: false,
          message: "Order not found",
        });
      }

      res.json({
        success: true,
        data: order,
      });
    } catch (error) {
      console.error("Get order error:", error);
      res.status(500).json({
        success: false,
        message: "Failed to fetch order",
        error: error.message,
      });
    }
  }

  // Update order status
  async updateOrderStatus(req, res) {
    try {
      const { status, note, trackingNumber, courierService } = req.body;

      const validStatuses = [
        "Pending",
        "Confirmed",
        "Processing",
        "Shipped",
        "Delivered",
        "Cancelled",
        "Returned",
      ];

      if (!validStatuses.includes(status)) {
        return res.status(400).json({
          success: false,
          message: "Invalid order status",
        });
      }

      const order = await Order.findById(req.params.id).populate(
        "user",
        "fullName email mobile",
      );

      if (!order) {
        return res.status(404).json({
          success: false,
          message: "Order not found",
        });
      }

      // Update order status
      await order.updateStatus(status, note, req.user.id);

      // Update tracking info if provided
      if (trackingNumber) order.trackingNumber = trackingNumber;
      if (courierService) order.courierService = courierService;

      await order.save();

      // Send status update notifications
      try {
        await emailService.sendOrderStatusUpdate(
          order.user.email,
          order.user.fullName,
          order,
          status,
        );
      } catch (emailError) {
        console.error("Status update email failed:", emailError);
      }

      // SMS functionality removed - using email only

      // Emit real-time updates
      const io = req.app.get("io");

      // Notify admin
      io.to("admin-room").emit("order-status-updated", {
        orderId: order._id,
        orderNumber: order.orderId,
        newStatus: status,
        updatedBy: req.user.fullName,
      });

      // Notify user
      io.to(`user-${order.user._id}`).emit("order-status-changed", {
        orderId: order._id,
        orderNumber: order.orderId,
        newStatus: status,
        trackingNumber: order.trackingNumber,
      });

      res.json({
        success: true,
        message: "Order status updated successfully",
        data: order,
      });
    } catch (error) {
      console.error("Update order status error:", error);
      res.status(500).json({
        success: false,
        message: "Failed to update order status",
        error: error.message,
      });
    }
  }

  // Cancel order
  async cancelOrder(req, res) {
    try {
      const { reason } = req.body;

      if (!reason) {
        return res.status(400).json({
          success: false,
          message: "Cancellation reason is required",
        });
      }

      let filter = { _id: req.params.id };

      // Non-admin users can only cancel their own orders
      if (req.user.role !== 1) {
        filter.user = req.user.id;
      }

      const order = await Order.findOne(filter);

      if (!order) {
        return res.status(404).json({
          success: false,
          message: "Order not found",
        });
      }

      // Check if order can be cancelled
      const cancellableStatuses = ["Pending", "Confirmed"];
      if (!cancellableStatuses.includes(order.orderStatus)) {
        return res.status(400).json({
          success: false,
          message: "Order cannot be cancelled at this stage",
        });
      }

      // Calculate refund amount
      let refundAmount = 0;
      if (order.paymentStatus === "Completed") {
        refundAmount = order.total;
      }

      // Cancel order
      await order.cancelOrder(reason, refundAmount);

      // Restore product stock
      for (const item of order.items) {
        await Product.findByIdAndUpdate(item.product, {
          $inc: { stock: item.quantity, sales: -item.quantity },
          lastStockUpdate: new Date(),
        });
      }

      // Send cancellation notification
      try {
        await emailService.sendOrderCancellation(
          order.user.email,
          order.user.fullName,
          order,
          reason,
        );
      } catch (emailError) {
        console.error("Cancellation email failed:", emailError);
      }

      // Emit real-time updates
      const io = req.app.get("io");
      io.to("admin-room").emit("order-cancelled", {
        orderId: order._id,
        orderNumber: order.orderId,
        reason: reason,
        refundAmount: refundAmount,
      });

      res.json({
        success: true,
        message: "Order cancelled successfully",
        data: {
          refundAmount,
          cancellationReason: reason,
        },
      });
    } catch (error) {
      console.error("Cancel order error:", error);
      res.status(500).json({
        success: false,
        message: "Failed to cancel order",
        error: error.message,
      });
    }
  }

  // Get all orders (Admin)
  async getAllOrders(req, res) {
    try {
      const {
        page = 1,
        limit = 20,
        status,
        paymentStatus,
        paymentMethod,
        startDate,
        endDate,
        search,
      } = req.query;

      // Build filter
      const filter = {};

      if (status) filter.orderStatus = status;
      if (paymentStatus) filter.paymentStatus = paymentStatus;
      if (paymentMethod) filter.paymentMethod = paymentMethod;

      // Date range filter
      if (startDate || endDate) {
        filter.createdAt = {};
        if (startDate) filter.createdAt.$gte = new Date(startDate);
        if (endDate) filter.createdAt.$lte = new Date(endDate);
      }

      // Search filter
      if (search) {
        filter.$or = [
          { orderId: new RegExp(search, "i") },
          { "shippingAddress.fullName": new RegExp(search, "i") },
          { "shippingAddress.email": new RegExp(search, "i") },
          { "shippingAddress.mobile": new RegExp(search, "i") },
        ];
      }

      // Calculate pagination
      const skip = (parseInt(page) - 1) * parseInt(limit);

      // Execute query
      const [orders, totalOrders] = await Promise.all([
        Order.find(filter)
          .sort({ createdAt: -1 })
          .skip(skip)
          .limit(parseInt(limit))
          .populate("user", "fullName email mobile")
          .populate("items.product", "name images")
          .populate("invoice", "invoiceId"),
        Order.countDocuments(filter),
      ]);

      // Calculate pagination info
      const totalPages = Math.ceil(totalOrders / limit);

      res.json({
        success: true,
        data: orders,
        pagination: {
          currentPage: parseInt(page),
          totalPages,
          totalOrders,
          hasNextPage: page < totalPages,
          hasPrevPage: page > 1,
          limit: parseInt(limit),
        },
      });
    } catch (error) {
      console.error("Get admin orders error:", error);
      res.status(500).json({
        success: false,
        message: "Failed to fetch orders",
        error: error.message,
      });
    }
  }
}

module.exports = new OrdersController();
