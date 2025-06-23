import React, { useState, useEffect } from "react";
import { Container, Row, Col, Badge, Spinner, Alert } from "react-bootstrap";
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

const UserDashboard = () => {
  const { user } = useSelector((state) => state.auth);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Real user data state
  const [userStats, setUserStats] = useState({
    pendingOrders: 0,
    recentInvoices: 0,
    cartProducts: 0,
    totalOrders: 0,
    totalSpent: 0,
  });

  const [recentOrders, setRecentOrders] = useState([]);

  // Fetch user dashboard data
  const fetchUserData = async () => {
    setLoading(true);
    setError(null);

    // Fetch user orders and stats using safe API calls
    const [ordersResult, statsResult] = await Promise.all([
      safeApiCall(() => api.get("/api/orders/user/recent?limit=3"), []),
      safeApiCall(() => api.get("/api/users/dashboard-stats"), {}),
    ]);

    // Process orders
    if (ordersResult.success && ordersResult.data?.data) {
      setRecentOrders(ordersResult.data.data);
    }

    // Process stats
    if (statsResult.success && statsResult.data?.data) {
      setUserStats((prev) => ({
        ...prev,
        ...statsResult.data.data,
      }));
    }

    // Get cart products count from localStorage or Redux
    try {
      const cartItems = JSON.parse(localStorage.getItem("cartItems") || "[]");
      setUserStats((prev) => ({
        ...prev,
        cartProducts: cartItems.length,
      }));
    } catch (e) {
      // Ignore localStorage errors
    }

    // Only show error if both API calls failed
    if (!ordersResult.success && !statsResult.success) {
      setError(
        "Unable to load dashboard data. Please check if the backend server is running.",
      );
    }

    setLoading(false);
  };

  useEffect(() => {
    fetchUserData();
  }, []);

  const getStatusBadge = (status) => {
    const statusConfig = {
      pending: { variant: "warning", label: "Pending" },
      confirmed: { variant: "info", label: "Confirmed" },
      processing: { variant: "primary", label: "Processing" },
      delivered: { variant: "success", label: "Delivered" },
      cancelled: { variant: "danger", label: "Cancelled" },
    };
    const config = statusConfig[status?.toLowerCase()] || statusConfig.pending;
    return <Badge bg={config.variant}>{config.label}</Badge>;
  };

  return (
    <div className="fade-in">
      {/* Hero Section */}
      <PageHeroSection
        title={`Welcome back, ${user?.name || user?.fullName || "User"}!`}
        subtitle="Manage your orders and health needs from your personal dashboard"
        icon="bi-person-heart"
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
                    onClick={fetchUserData}
                  >
                    Retry
                  </ThemeButton>
                </Alert>
              </Col>
            </Row>
          )}

          {/* Quick Actions */}
          <Row className="mb-5">
            <Col lg={12}>
              <ThemeCard>
                <div className="d-flex justify-content-between align-items-center mb-4">
                  <h5
                    className="mb-0"
                    style={{ color: "#333", fontWeight: "700" }}
                  >
                    <i className="bi bi-lightning-charge me-2"></i>
                    Quick Actions
                  </h5>
                </div>
                <Row className="g-3">
                  <Col md={3}>
                    <ThemeButton
                      as={Link}
                      to="/products"
                      icon="bi bi-cart-plus"
                      className="w-100"
                    >
                      Shop Products
                    </ThemeButton>
                  </Col>
                  <Col md={3}>
                    <ThemeButton
                      as={Link}
                      to="/user/orders"
                      variant="outline"
                      icon="bi bi-box-seam"
                      className="w-100"
                    >
                      Track Orders
                    </ThemeButton>
                  </Col>
                  <Col md={3}>
                    <ThemeButton
                      as={Link}
                      to="/user/invoices"
                      variant="outline"
                      icon="bi bi-receipt"
                      className="w-100"
                    >
                      View Invoices
                    </ThemeButton>
                  </Col>
                  <Col md={3}>
                    <ThemeButton
                      as={Link}
                      to="/user/profile"
                      variant="outline"
                      icon="bi bi-person-gear"
                      className="w-100"
                    >
                      Edit Profile
                    </ThemeButton>
                  </Col>
                </Row>
              </ThemeCard>
            </Col>
          </Row>

          {/* Statistics Cards */}
          <Row className="mb-5 g-4 justify-content-center">
            <Col lg={4} md={6}>
              <StatsCard
                icon="bi bi-clock-history"
                value={userStats.pendingOrders}
                label="Pending Orders"
                gradient="linear-gradient(135deg, #ffc107, #fd7e14)"
                badge={
                  userStats.pendingOrders > 0 ? "In progress" : "All up to date"
                }
                isLoading={loading}
              />
            </Col>

            <Col lg={4} md={6}>
              <StatsCard
                icon="bi bi-receipt"
                value={userStats.recentInvoices}
                label="Recent Invoices"
                gradient="linear-gradient(135deg, #17a2b8, #20c997)"
                badge={
                  userStats.recentInvoices > 0 ? "Available" : "No invoices"
                }
                isLoading={loading}
              />
            </Col>

            <Col lg={4} md={6}>
              <StatsCard
                icon="bi bi-cart-plus"
                value={userStats.cartProducts}
                label="Cart Products"
                gradient="linear-gradient(135deg, #e63946, #dc3545)"
                badge={
                  userStats.cartProducts > 0 ? "Ready to buy" : "Cart empty"
                }
                isLoading={loading}
              />
            </Col>
          </Row>

          {/* Recent Orders & User Guide */}
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
                    {recentOrders.map((order) => (
                      <div
                        key={order._id || order.id}
                        style={{
                          background: "#f8f9fa",
                          borderRadius: "15px",
                          padding: "15px",
                          marginBottom: "15px",
                          transition: "all 0.3s ease",
                        }}
                        onMouseOver={(e) => {
                          e.currentTarget.style.transform = "translateY(-2px)";
                          e.currentTarget.style.boxShadow =
                            "0 5px 15px rgba(0, 0, 0, 0.1)";
                        }}
                        onMouseOut={(e) => {
                          e.currentTarget.style.transform = "translateY(0)";
                          e.currentTarget.style.boxShadow = "none";
                        }}
                      >
                        <div className="d-flex justify-content-between align-items-start mb-2">
                          <code
                            style={{
                              background: "white",
                              padding: "4px 8px",
                              borderRadius: "6px",
                              fontSize: "11px",
                              fontWeight: "600",
                            }}
                          >
                            {order.orderNumber ||
                              order._id?.slice(-8).toUpperCase()}
                          </code>
                          {getStatusBadge(order.status)}
                        </div>
                        <div
                          style={{
                            fontSize: "12px",
                            color: "#6c757d",
                            marginBottom: "8px",
                          }}
                        >
                          {new Date(
                            order.createdAt || order.date,
                          ).toLocaleDateString()}{" "}
                          • {order.items?.length || order.itemCount || 0} items
                        </div>
                        <div
                          style={{
                            fontSize: "14px",
                            fontWeight: "700",
                            color: "#28a745",
                          }}
                        >
                          ₹{order.total || order.amount || 0}
                        </div>
                      </div>
                    ))}
                    <div className="text-center">
                      <ThemeButton
                        as={Link}
                        to="/user/orders"
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
                      style={{ fontSize: "2rem", color: "#6c757d" }}
                    ></i>
                    <p
                      className="mt-2 mb-0 text-muted"
                      style={{ fontSize: "14px" }}
                    >
                      No recent orders found
                    </p>
                    <ThemeButton
                      as={Link}
                      to="/products"
                      variant="outline"
                      size="sm"
                      icon="bi bi-cart-plus"
                      className="mt-2"
                    >
                      Start Shopping
                    </ThemeButton>
                  </div>
                )}
              </ThemeCard>
            </Col>

            <Col lg={4}>
              {/* User Guide */}
              <ThemeCard>
                <div
                  style={{
                    background: "linear-gradient(135deg, #6f42c1, #6610f2)",
                    color: "white",
                    borderRadius: "12px 12px 0 0",
                    padding: "20px 25px",
                    margin: "-30px -30px 25px -30px",
                  }}
                >
                  <h6 className="mb-0" style={{ fontWeight: "700" }}>
                    <i className="bi bi-book me-2"></i>
                    Need Help?
                  </h6>
                </div>

                <div className="text-center">
                  <div
                    style={{
                      width: "60px",
                      height: "60px",
                      background: "linear-gradient(135deg, #6f42c1, #6610f2)",
                      borderRadius: "50%",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      margin: "0 auto 15px",
                    }}
                  >
                    <i
                      className="bi bi-question-circle"
                      style={{ fontSize: "24px", color: "white" }}
                    ></i>
                  </div>
                  <h6
                    style={{
                      fontWeight: "700",
                      marginBottom: "10px",
                      color: "#333",
                    }}
                  >
                    User Guide
                  </h6>
                  <p
                    style={{
                      fontSize: "13px",
                      color: "#6c757d",
                      lineHeight: "1.5",
                      marginBottom: "15px",
                    }}
                  >
                    Learn how to use all features including order tracking,
                    invoice management, and more.
                  </p>
                  <ThemeButton
                    as={Link}
                    to="/user-guide"
                    variant="outline"
                    size="sm"
                    icon="bi bi-book"
                  >
                    View Guide
                  </ThemeButton>
                </div>
              </ThemeCard>
            </Col>
          </Row>
        </Container>
      </ThemeSection>
    </div>
  );
};

export default UserDashboard;
