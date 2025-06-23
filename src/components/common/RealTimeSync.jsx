import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

/**
 * RealTimeSync Component
 * Handles real-time data synchronization across the application
 * Automatically updates data without page refresh
 */
const RealTimeSync = () => {
  const dispatch = useDispatch();
  const { user, isAuthenticated } = useSelector((state) => state.auth);

  useEffect(() => {
    if (!isAuthenticated) return;

    let socketConnection = null;
    let isMounted = true;

    // Setup real-time socket connection
    const initializeRealTimeSync = async () => {
      try {
        // Import socket client
        const socketModule = await import("../../utils/socketClient");
        const socketClient = socketModule.default;

        if (socketClient && typeof socketClient.connect === "function") {
          const socket = socketClient.connect();

          if (socket) {
            // Listen for real-time updates
            socket.on("order_created", (orderData) => {
              if (!isMounted) return;

              // Dispatch custom event for order updates
              window.dispatchEvent(
                new CustomEvent("refreshOrders", {
                  detail: orderData,
                }),
              );

              // Show notification for admins
              if (user?.role === 1) {
                window.dispatchEvent(
                  new CustomEvent("newOrderNotification", {
                    detail: {
                      type: "order",
                      title: "New Order Received",
                      message: `Order #${orderData.orderNumber} from ${orderData.customerName}`,
                      orderId: orderData._id,
                      customerName: orderData.customerName,
                      totalAmount: orderData.total,
                    },
                  }),
                );
              }
            });

            socket.on("order_updated", (orderData) => {
              if (!isMounted) return;

              window.dispatchEvent(
                new CustomEvent("refreshOrders", {
                  detail: orderData,
                }),
              );
            });

            socket.on("product_updated", (productData) => {
              if (!isMounted) return;

              window.dispatchEvent(
                new CustomEvent("refreshProducts", {
                  detail: productData,
                }),
              );

              // Check for low stock alerts
              if (productData.stock <= (productData.lowStockThreshold || 10)) {
                if (user?.role === 1) {
                  window.dispatchEvent(
                    new CustomEvent("stockAlert", {
                      detail: {
                        type: "stock",
                        title: "Low Stock Alert",
                        message: `${productData.name} is running low (${productData.stock} left)`,
                        productName: productData.name,
                        currentStock: productData.stock,
                        threshold: productData.lowStockThreshold || 10,
                      },
                    }),
                  );
                }
              }
            });

            socket.on("user_registered", (userData) => {
              if (!isMounted) return;

              window.dispatchEvent(
                new CustomEvent("refreshUsers", {
                  detail: userData,
                }),
              );

              // Notify admin of new user registration
              if (user?.role === 1) {
                window.dispatchEvent(
                  new CustomEvent("userActivity", {
                    detail: {
                      type: "user",
                      title: "New User Registration",
                      message: `${userData.fullName} has joined your platform`,
                      userName: userData.fullName,
                      action: "register",
                    },
                  }),
                );
              }
            });

            socket.on("payment_received", (paymentData) => {
              if (!isMounted) return;

              window.dispatchEvent(new CustomEvent("refreshOrders"));
              window.dispatchEvent(new CustomEvent("refreshAnalytics"));

              // Notify admin of payment
              if (user?.role === 1) {
                window.dispatchEvent(
                  new CustomEvent("paymentNotification", {
                    detail: {
                      type: "payment",
                      title: "Payment Received",
                      message: `Payment of ₹${paymentData.amount} received for Order #${paymentData.orderNumber}`,
                      orderId: paymentData.orderId,
                      amount: paymentData.amount,
                      method: paymentData.method,
                    },
                  }),
                );
              }
            });

            socket.on("message_received", (messageData) => {
              if (!isMounted) return;

              window.dispatchEvent(
                new CustomEvent("refreshMessages", {
                  detail: messageData,
                }),
              );

              // Notify admin of new message
              if (user?.role === 1) {
                window.dispatchEvent(
                  new CustomEvent("messageNotification", {
                    detail: {
                      type: "message",
                      title: "New Message",
                      message: `Message from ${messageData.senderName}: ${messageData.subject}`,
                      senderName: messageData.senderName,
                      subject: messageData.subject,
                    },
                  }),
                );
              }
            });

            // Listen for general data updates
            socket.on("data_updated", (updateInfo) => {
              if (!isMounted) return;

              switch (updateInfo.type) {
                case "orders":
                  window.dispatchEvent(new CustomEvent("refreshOrders"));
                  break;
                case "products":
                  window.dispatchEvent(new CustomEvent("refreshProducts"));
                  break;
                case "users":
                  window.dispatchEvent(new CustomEvent("refreshUsers"));
                  break;
                case "analytics":
                  window.dispatchEvent(new CustomEvent("refreshAnalytics"));
                  break;
                case "messages":
                  window.dispatchEvent(new CustomEvent("refreshMessages"));
                  break;
                case "invoices":
                  window.dispatchEvent(new CustomEvent("refreshInvoices"));
                  break;
              }
            });

            socketConnection = socket;
            console.log("Real-time sync initialized successfully");
          }
        }
      } catch (error) {
        console.warn("Failed to initialize real-time sync:", error);
      }
    };

    // Initialize with a small delay
    const timeout = setTimeout(initializeRealTimeSync, 1000);

    return () => {
      isMounted = false;
      clearTimeout(timeout);

      if (socketConnection) {
        try {
          // Clean up socket listeners
          socketConnection.off("order_created");
          socketConnection.off("order_updated");
          socketConnection.off("product_updated");
          socketConnection.off("user_registered");
          socketConnection.off("payment_received");
          socketConnection.off("message_received");
          socketConnection.off("data_updated");
        } catch (error) {
          console.warn("Error cleaning up socket listeners:", error);
        }
      }
    };
  }, [isAuthenticated, user, dispatch]);

  // This component doesn't render anything
  return null;
};

export default RealTimeSync;
