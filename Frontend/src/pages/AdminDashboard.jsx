import React, { useState, useEffect } from "react";
import {
  Container,
  Row,
  Col,
  Table,
  Badge,
  Alert,
  Spinner,
} from "react-bootstrap";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { api, safeApiCall } from "../utils/apiClient";
import {
  PageHeroSection,
  ThemeCard,
  ThemeButton,
  ThemeSection,
  StatsCard,
} from "../components/common/ConsistentTheme";
import ProfessionalLoading from "../components/common/ProfessionalLoading";
import { useAdminRealTime } from "../hooks/useRealTime";
import { useRealTimeData } from "../components/common/RealTimeDataProvider";
import socketClient from "../utils/socketClient";

const AdminDashboard = () => {
  const { unreadCount } = useSelector((state) => state.messages);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Use real-time data provider
  const { isConnected, fallbackMode, lastUpdate, liveStats, forceRefresh } =
    useRealTimeData();

  // Local state for additional data not in real-time provider
  const [recentOrders, setRecentOrders] = useState([]);
  const [lowStockProducts, setLowStockProducts] = useState([]);

  // Merge real-time stats with unread messages
  const dashboardStats = {
    ...liveStats,
    unreadMessages: unreadCount || 0,
  };

  // Fetch dashboard data
  const fetchDashboardData = async () => {
    setLoading(true);
    setError(null);

    // Check if user is authenticated first
    const token =
      localStorage.getItem("token") || sessionStorage.getItem("token");
    if (!token) {
      setError("Please log in as an admin to access the dashboard.");
      setLoading(false);
      return;
    }

    // Fetch all required data using the safe API client
    const [statsResult, ordersResult, productsResult] = await Promise.all([
      safeApiCall(() => api.get("/api/analytics/dashboard-stats"), {}),
      safeApiCall(
        () => api.get("/api/orders?limit=5&sort=createdAt&order=desc"),
        [],
      ),
      safeApiCall(() => api.get("/api/products?limit=10&stock=low"), []),
    ]);

    // Check for authentication errors
    const authErrors = [statsResult, ordersResult, productsResult].filter(
      (result) => !result.success && result.error?.includes("401"),
    );

    if (authErrors.length > 0) {
      setError("Authentication failed. Please log in as an admin.");
      setLoading(false);
      return;
    }

    // Check for authorization errors (403 - not admin)
    const authzErrors = [statsResult, ordersResult, productsResult].filter(
      (result) => !result.success && result.error?.includes("403"),
    );

    if (authzErrors.length > 0) {
      setError("Access denied. Admin privileges required.");
      setLoading(false);
      return;
    }

    // Process stats
    if (statsResult.success && statsResult.data?.data) {
      setDashboardStats((prev) => ({
        ...prev,
        ...statsResult.data.data,
        unreadMessages: unreadCount || 0,
      }));
    }

    // Process recent orders
    if (ordersResult.success && ordersResult.data?.data) {
      setRecentOrders(ordersResult.data.data);
    }

    // Process low stock products
    if (productsResult.success && productsResult.data?.data) {
      const products = Array.isArray(productsResult.data.data)
        ? productsResult.data.data
        : productsResult.data.data.products || [];

      const lowStock = products.filter(
        (product) => product.stock <= (product.lowStockThreshold || 10),
      );
      setLowStockProducts(lowStock);
    }

    // Set error only if all API calls failed
    if (
      !statsResult.success &&
      !ordersResult.success &&
      !productsResult.success
    ) {
      // More specific error messages
      const firstError =
        statsResult.error || ordersResult.error || productsResult.error;
      if (firstError?.includes("Network error")) {
        setError(
          "Unable to connect to the backend server. Please check if it's running.",
        );
      } else if (firstError?.includes("timeout")) {
        setError("Server is taking too long to respond. Please try again.");
      } else {
        setError(
          "Unable to load dashboard data. Please try refreshing the page.",
        );
      }
    }

    setLoading(false);
  };

  // Add real-time hooks
  const { notifications, clearNotification } = useAdminRealTime();

  useEffect(() => {
    fetchDashboardData();

    // Setup socket real-time listeners
    if (socketClient && socketClient.on) {
      // Listen for new orders
      socketClient.on("admin_notification", (data) => {
        console.log("🔔 Admin notification received:", data);
        if (data.type === "order" || data.type === "new-order") {
          fetchDashboardData();
        }
      });

      // Listen for new users
      socketClient.on("new-user-registered", (data) => {
        console.log("👤 New user registered:", data);
        fetchDashboardData();
      });

      // Listen for new messages
      socketClient.on("new-message", (data) => {
        console.log("💬 New message received:", data);
        fetchDashboardData();
      });

      // Listen for inventory updates
      socketClient.on("inventory-changed", (data) => {
        console.log("📦 Inventory updated:", data);
        fetchDashboardData();
      });

      // Listen for order status updates
      socketClient.on("order-updated", (data) => {
        console.log("🛍️ Order updated:", data);
        fetchDashboardData();
      });
    }

    // Auto-refresh dashboard every 2 minutes for live data
    const autoRefreshInterval = setInterval(() => {
      console.log("🔄 Auto-refreshing dashboard data");
      fetchDashboardData();
    }, 120000); // 2 minutes

    return () => {
      // Clean up socket listeners
      if (socketClient && socketClient.off) {
        socketClient.off("admin_notification");
        socketClient.off("new-user-registered");
        socketClient.off("new-message");
        socketClient.off("inventory-changed");
        socketClient.off("order-updated");
      }
      clearInterval(autoRefreshInterval);
    };
  }, [unreadCount]);

  const getStatusVariant = (status) => {
    switch (status?.toLowerCase()) {
      case "pending":
        return "warning";
      case "confirmed":
        return "info";
      case "processing":
        return "primary";
      case "delivered":
        return "success";
      case "cancelled":
        return "danger";
      default:
        return "secondary";
    }
  };

  return (
    <div className="fade-in">
      {/* Hero Section */}
      <PageHeroSection
        title="Admin Dashboard"
        subtitle="Manage your medical store with comprehensive insights and tools"
        icon="bi-speedometer2"
      />

      <ThemeSection>
        <Container>
          {/* Real-time Status Bar */}
          <Row className="mb-4">
            <Col lg={12}>
              <div
                style={{
                  background: isConnected
                    ? "linear-gradient(135deg, #28a745, #20c997)"
                    : fallbackMode
                      ? "linear-gradient(135deg, #ffc107, #fd7e14)"
                      : "linear-gradient(135deg, #dc3545, #e63946)",
                  borderRadius: "8px",
                  padding: "12px 20px",
                  color: "white",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  fontSize: "14px",
                  fontWeight: "600",
                }}
              >
                <div>
                  <i
                    className={`bi ${
                      isConnected
                        ? "bi-wifi"
                        : fallbackMode
                          ? "bi-arrow-clockwise"
                          : "bi-wifi-off"
                    } me-2`}
                  ></i>
                  {isConnected
                    ? "Real-time data connected"
                    : fallbackMode
                      ? "Manual refresh mode (Production)"
                      : "Real-time data disconnected"}
                </div>
                <div className="d-flex align-items-center gap-3">
                  <span>Last update: {lastUpdate.toLocaleTimeString()}</span>
                  <button
                    onClick={forceRefresh}
                    style={{
                      background: "rgba(255,255,255,0.2)",
                      border: "1px solid rgba(255,255,255,0.3)",
                      borderRadius: "4px",
                      color: "white",
                      padding: "4px 8px",
                      fontSize: "12px",
                      cursor: "pointer",
                    }}
                  >
                    <i className="bi bi-arrow-clockwise me-1"></i>
                    Refresh
                  </button>
                </div>
              </div>
            </Col>
          </Row>

          {/* Error State */}
          {error && !loading && (
            <Row>
              <Col lg={12}>
                <Alert variant="danger" className="d-flex align-items-center">
                  <i className="bi bi-exclamation-triangle-fill me-3"></i>
                  <div className="flex-grow-1">
                    {error}
                    {error.includes("log in") && (
                      <div className="mt-2">
                        <Link
                          to="/login"
                          className="btn btn-sm btn-primary me-2"
                        >
                          <i className="bi bi-box-arrow-in-right me-1"></i>
                          Go to Login
                        </Link>
                        <small className="text-muted">
                          Use admin credentials to access the dashboard
                        </small>
                      </div>
                    )}
                  </div>
                  <ThemeButton onClick={fetchDashboardData} size="sm">
                    <i className="bi bi-arrow-clockwise me-1"></i>
                    Retry
                  </ThemeButton>
                </Alert>
              </Col>
            </Row>
          )}

          {/* Statistics Cards */}
          <Row className="mb-5 g-4">
            <Col lg={3} md={6}>
              <StatsCard
                icon="bi bi-bag-check"
                value={dashboardStats.totalOrders}
                label="Total Orders"
                gradient="linear-gradient(135deg, #e63946, #dc3545)"
                badge={
                  dashboardStats.monthlyGrowth > 0
                    ? `+${dashboardStats.monthlyGrowth}% this month`
                    : null
                }
                isLoading={loading}
              />
            </Col>

            <Col lg={3} md={6}>
              <StatsCard
                icon="bi bi-box-seam"
                value={dashboardStats.totalProducts}
                label="Total Products"
                gradient="linear-gradient(135deg, #17a2b8, #20c997)"
                isLoading={loading}
              />
            </Col>

            <Col lg={3} md={6}>
              <StatsCard
                icon="bi bi-people"
                value={dashboardStats.totalUsers}
                label="Total Users"
                gradient="linear-gradient(135deg, #6f42c1, #6610f2)"
                badge={
                  dashboardStats.newUsersToday > 0
                    ? `+${dashboardStats.newUsersToday} today`
                    : null
                }
                isLoading={loading}
              />
            </Col>

            <Col lg={3} md={6}>
              <StatsCard
                icon="bi bi-currency-rupee"
                value={
                  dashboardStats.totalRevenue > 0
                    ? `₹${(dashboardStats.totalRevenue / 1000).toFixed(1)}k`
                    : "₹0"
                }
                label="Total Revenue"
                gradient="linear-gradient(135deg, #fd7e14, #dc3545)"
                badge="This month"
                isLoading={loading}
              />
            </Col>
          </Row>

          {/* Recent Orders & Low Stock */}
          <Row className="g-4">
            <Col lg={8}>
              <ThemeCard>
                <div
                  style={{
                    background: "linear-gradient(135deg, #e63946, #dc3545)",
                    color: "white",
                    borderRadius: "12px 12px 0 0",
                    padding: "20px 25px",
                    margin: "-30px -30px 25px -30px",
                  }}
                >
                  <h5 className="mb-0" style={{ fontWeight: "700" }}>
                    <i className="bi bi-clock-history me-2"></i>
                    Recent Orders
                  </h5>
                </div>

                {loading ? (
                  <ProfessionalLoading
                    size="sm"
                    message="Loading orders..."
                    fullScreen={false}
                  />
                ) : recentOrders.length > 0 ? (
                  <>
                    <Table responsive hover>
                      <thead>
                        <tr>
                          <th>Order ID</th>
                          <th>Customer</th>
                          <th>Amount</th>
                          <th>Status</th>
                          <th>Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {recentOrders.map((order) => (
                          <tr key={order._id || order.id}>
                            <td>
                              <code
                                style={{
                                  background: "#f8f9fa",
                                  padding: "4px 8px",
                                  borderRadius: "6px",
                                }}
                              >
                                {order.orderNumber || order._id || order.id}
                              </code>
                            </td>
                            <td>
                              <div>
                                <div style={{ fontWeight: "600" }}>
                                  {order.customer?.name ||
                                    order.customerName ||
                                    "N/A"}
                                </div>
                                <small className="text-muted">
                                  {order.customer?.email ||
                                    order.customerEmail ||
                                    ""}
                                </small>
                              </div>
                            </td>
                            <td>
                              <strong style={{ color: "#28a745" }}>
                                ₹{order.total || order.amount || 0}
                              </strong>
                            </td>
                            <td>
                              <Badge bg={getStatusVariant(order.status)}>
                                {order.status || "Pending"}
                              </Badge>
                            </td>
                            <td>
                              <ThemeButton
                                as={Link}
                                to={`/admin/orders/${order._id || order.id}`}
                                variant="outline"
                                size="sm"
                              >
                                View
                              </ThemeButton>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </Table>
                    <div className="text-center mt-3">
                      <ThemeButton
                        as={Link}
                        to="/admin/orders"
                        variant="outline"
                        icon="bi bi-arrow-right"
                      >
                        View All Orders
                      </ThemeButton>
                    </div>
                  </>
                ) : (
                  <div className="text-center py-4">
                    <i
                      className="bi bi-inbox"
                      style={{ fontSize: "3rem", color: "#6c757d" }}
                    ></i>
                    <h5 className="mt-3 text-muted">No Recent Orders</h5>
                    <p className="text-muted">
                      Orders will appear here when customers place them.
                    </p>
                  </div>
                )}
              </ThemeCard>
            </Col>

            <Col lg={4}>
              <ThemeCard>
                <div
                  style={{
                    background: "linear-gradient(135deg, #fd7e14, #dc3545)",
                    color: "white",
                    borderRadius: "12px 12px 0 0",
                    padding: "20px 25px",
                    margin: "-30px -30px 25px -30px",
                  }}
                >
                  <h6 className="mb-0" style={{ fontWeight: "700" }}>
                    <i className="bi bi-exclamation-triangle me-2"></i>
                    Low Stock Alert
                  </h6>
                </div>

                {lowStockProducts.length > 0 ? (
                  <>
                    {lowStockProducts.map((product) => (
                      <div key={product._id || product.id} className="mb-3">
                        <div className="d-flex justify-content-between align-items-center mb-1">
                          <span style={{ fontSize: "14px", fontWeight: "600" }}>
                            {product.name}
                          </span>
                          <Badge bg="danger" style={{ fontSize: "10px" }}>
                            {product.stock} left
                          </Badge>
                        </div>
                        <div
                          style={{
                            height: "6px",
                            background: "#f8f9fa",
                            borderRadius: "3px",
                            overflow: "hidden",
                          }}
                        >
                          <div
                            style={{
                              width: `${Math.min((product.stock / (product.lowStockThreshold || 20)) * 100, 100)}%`,
                              height: "100%",
                              background: "#dc3545",
                              borderRadius: "3px",
                            }}
                          ></div>
                        </div>
                      </div>
                    ))}
                    <div className="text-center mt-3">
                      <ThemeButton
                        as={Link}
                        to="/admin/products"
                        variant="outline"
                        size="sm"
                        icon="bi bi-plus-circle"
                      >
                        Restock Products
                      </ThemeButton>
                    </div>
                  </>
                ) : (
                  <div className="text-center py-3">
                    <i
                      className="bi bi-check-circle"
                      style={{ fontSize: "2rem", color: "#28a745" }}
                    ></i>
                    <p
                      className="mt-2 mb-0 text-muted"
                      style={{ fontSize: "14px" }}
                    >
                      All products are well stocked!
                    </p>
                  </div>
                )}
              </ThemeCard>
            </Col>
          </Row>
        </Container>
      </ThemeSection>
    </div>
  );
};

export default AdminDashboard;
