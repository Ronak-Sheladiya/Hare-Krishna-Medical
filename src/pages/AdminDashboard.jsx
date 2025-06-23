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

const AdminDashboard = () => {
  const { unreadCount } = useSelector((state) => state.messages);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Real dashboard data state
  const [dashboardStats, setDashboardStats] = useState({
    totalOrders: 0,
    totalProducts: 0,
    totalUsers: 0,
    totalRevenue: 0,
    monthlyGrowth: 0,
    pendingOrders: 0,
    lowStockProducts: 0,
    newUsersToday: 0,
    unreadMessages: 0,
  });

  const [recentOrders, setRecentOrders] = useState([]);
  const [lowStockProducts, setLowStockProducts] = useState([]);

  // Fetch dashboard data
  const fetchDashboardData = async () => {
    setLoading(true);
    setError(null);

    // Fetch all required data using the safe API client
    const [statsResult, ordersResult, productsResult] = await Promise.all([
      safeApiCall(() => api.get("/api/analytics/dashboard-stats"), {}),
      safeApiCall(
        () => api.get("/api/orders?limit=5&sort=createdAt&order=desc"),
        [],
      ),
      safeApiCall(() => api.get("/api/products?limit=10&stock=low"), []),
    ]);

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
      setError(
        "Unable to load dashboard data. Please check if the backend server is running.",
      );
    }

    setLoading(false);
  };

  useEffect(() => {
    fetchDashboardData();

    // Setup real-time refresh listeners
    const handleRefreshOrders = () => fetchDashboardData();
    const handleRefreshProducts = () => fetchDashboardData();
    const handleRefreshAnalytics = () => fetchDashboardData();

    window.addEventListener("refreshOrders", handleRefreshOrders);
    window.addEventListener("refreshProducts", handleRefreshProducts);
    window.addEventListener("refreshAnalytics", handleRefreshAnalytics);

    // Auto-refresh dashboard every 30 seconds
    const autoRefreshInterval = setInterval(fetchDashboardData, 30000);

    return () => {
      window.removeEventListener("refreshOrders", handleRefreshOrders);
      window.removeEventListener("refreshProducts", handleRefreshProducts);
      window.removeEventListener("refreshAnalytics", handleRefreshAnalytics);
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

      <ThemeSection background="#f8f9fa">
        <Container>
          {error && (
            <Row className="mb-4">
              <Col lg={12}>
                <Alert variant="warning" className="d-flex align-items-center">
                  <i className="bi bi-exclamation-triangle me-2"></i>
                  {error}
                  <ThemeButton
                    variant="outline"
                    size="sm"
                    className="ms-auto"
                    onClick={fetchDashboardData}
                  >
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
                  <div className="text-center py-4">
                    <Spinner animation="border" />
                    <p className="mt-2 text-muted">Loading orders...</p>
                  </div>
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
