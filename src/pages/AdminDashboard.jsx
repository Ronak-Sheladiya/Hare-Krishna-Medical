import React, { useState, useEffect } from "react";
import {
  Container,
  Row,
  Col,
  Card,
  Button,
  Table,
  Badge,
  ProgressBar,
  Modal,
  Alert,
  Spinner,
} from "react-bootstrap";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";

const AdminDashboard = () => {
  const { unreadCount } = useSelector((state) => state.messages);
  const [showOrderModal, setShowOrderModal] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
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

  const API_BASE_URL =
    process.env.REACT_APP_BACKEND_URL || "http://localhost:5000";

  // Fetch dashboard data
  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      setError(null);

      const token = localStorage.getItem("token");
      const headers = {
        "Content-Type": "application/json",
        ...(token && { Authorization: `Bearer ${token}` }),
      };

      // Fetch all required data
      const [statsRes, ordersRes, productsRes] = await Promise.all([
        fetch(`${API_BASE_URL}/api/analytics/dashboard-stats`, {
          headers,
        }).catch(() => null),
        fetch(`${API_BASE_URL}/api/orders?limit=5&sort=createdAt&order=desc`, {
          headers,
        }).catch(() => null),
        fetch(`${API_BASE_URL}/api/products?limit=10&stock=low`, {
          headers,
        }).catch(() => null),
      ]);

      // Process stats
      if (statsRes && statsRes.ok) {
        const statsData = await statsRes.json();
        if (statsData.success) {
          setDashboardStats((prev) => ({
            ...prev,
            ...statsData.data,
            unreadMessages: unreadCount || 0,
          }));
        }
      }

      // Process recent orders
      if (ordersRes && ordersRes.ok) {
        const ordersData = await ordersRes.json();
        if (ordersData.success) {
          setRecentOrders(ordersData.data || []);
        }
      }

      // Process low stock products
      if (productsRes && productsRes.ok) {
        const productsData = await productsRes.json();
        if (productsData.success) {
          const lowStock = (productsData.data || []).filter(
            (product) => product.stock <= (product.lowStockThreshold || 10),
          );
          setLowStockProducts(lowStock);
        }
      }
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
      setError("Unable to load dashboard data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, [unreadCount]);

  const handleViewOrder = (order) => {
    setSelectedOrder(order);
    setShowOrderModal(true);
  };

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

  const EnhancedButton = ({
    children,
    variant = "primary",
    to,
    onClick,
    icon,
    style = {},
  }) => {
    const baseStyle = {
      borderRadius: "12px",
      padding: "12px 24px",
      fontWeight: "600",
      transition: "all 0.3s ease",
      border: "none",
      position: "relative",
      overflow: "hidden",
      textDecoration: "none",
      display: "inline-flex",
      alignItems: "center",
      justifyContent: "center",
      ...style,
    };

    const variants = {
      primary: {
        background: "linear-gradient(135deg, #e63946, #dc3545)",
        color: "white",
        boxShadow: "0 4px 15px rgba(230, 57, 70, 0.3)",
      },
      outline: {
        background: "transparent",
        border: "2px solid #e63946",
        color: "#e63946",
      },
      success: {
        background: "linear-gradient(135deg, #28a745, #20c997)",
        color: "white",
        boxShadow: "0 4px 15px rgba(40, 167, 69, 0.3)",
      },
      info: {
        background: "linear-gradient(135deg, #17a2b8, #20c997)",
        color: "white",
        boxShadow: "0 4px 15px rgba(23, 162, 184, 0.3)",
      },
    };

    const currentStyle = { ...baseStyle, ...variants[variant] };

    const handleHover = (e, isHover) => {
      if (isHover) {
        e.target.style.transform = "translateY(-2px)";
        if (variant === "outline") {
          e.target.style.background = "#e63946";
          e.target.style.color = "white";
        } else {
          e.target.style.boxShadow = "0 8px 25px rgba(0, 0, 0, 0.2)";
        }
      } else {
        e.target.style.transform = "translateY(0)";
        if (variant === "outline") {
          e.target.style.background = "transparent";
          e.target.style.color = "#e63946";
        } else {
          e.target.style.boxShadow = currentStyle.boxShadow;
        }
      }
    };

    const content = (
      <>
        {icon && <i className={`${icon} me-2`}></i>}
        {children}
      </>
    );

    if (to) {
      return (
        <Link
          to={to}
          style={currentStyle}
          onMouseEnter={(e) => handleHover(e, true)}
          onMouseLeave={(e) => handleHover(e, false)}
        >
          {content}
        </Link>
      );
    }

    return (
      <button
        style={currentStyle}
        onClick={onClick}
        onMouseEnter={(e) => handleHover(e, true)}
        onMouseLeave={(e) => handleHover(e, false)}
      >
        {content}
      </button>
    );
  };

  const CircularStatCard = ({
    icon,
    value,
    label,
    gradient,
    badge,
    action,
    isLoading = false,
  }) => (
    <Card
      style={{
        border: "none",
        borderRadius: "25px",
        background: "linear-gradient(135deg, #ffffff, #f8f9fa)",
        boxShadow: "0 10px 40px rgba(0, 0, 0, 0.1)",
        transition: "all 0.3s ease",
        height: "100%",
        overflow: "hidden",
      }}
      onMouseOver={(e) => {
        e.currentTarget.style.transform = "translateY(-10px)";
        e.currentTarget.style.boxShadow = "0 20px 60px rgba(0, 0, 0, 0.15)";
      }}
      onMouseOut={(e) => {
        e.currentTarget.style.transform = "translateY(0)";
        e.currentTarget.style.boxShadow = "0 10px 40px rgba(0, 0, 0, 0.1)";
      }}
    >
      <Card.Body className="text-center" style={{ padding: "40px 30px" }}>
        <div
          style={{
            width: "100px",
            height: "100px",
            background: gradient,
            borderRadius: "50%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            margin: "0 auto 25px",
            boxShadow: "0 10px 30px rgba(0, 0, 0, 0.2)",
            position: "relative",
          }}
        >
          {isLoading ? (
            <Spinner animation="border" size="sm" style={{ color: "white" }} />
          ) : (
            <i
              className={icon}
              style={{ fontSize: "40px", color: "white" }}
            ></i>
          )}
          <div
            style={{
              position: "absolute",
              top: "-10px",
              right: "-10px",
              width: "30px",
              height: "30px",
              background: "rgba(255, 255, 255, 0.9)",
              borderRadius: "50%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "12px",
              fontWeight: "bold",
              color: "#333",
            }}
          >
            <i className="bi bi-arrow-up-right"></i>
          </div>
        </div>

        <h1
          style={{
            color: "#333",
            fontWeight: "900",
            marginBottom: "10px",
            fontSize: "3rem",
            lineHeight: "1",
          }}
        >
          {isLoading
            ? "..."
            : typeof value === "number" && value > 1000
              ? `${(value / 1000).toFixed(1)}k`
              : value}
        </h1>

        <h5
          style={{
            color: "#6c757d",
            marginBottom: "20px",
            fontWeight: "600",
            textTransform: "uppercase",
            letterSpacing: "1px",
            fontSize: "14px",
          }}
        >
          {label}
        </h5>

        {badge && !isLoading && (
          <Badge
            style={{
              background: "linear-gradient(135deg, #28a745, #20c997)",
              color: "white",
              padding: "8px 16px",
              borderRadius: "25px",
              fontSize: "12px",
              fontWeight: "600",
              marginBottom: "25px",
              boxShadow: "0 4px 15px rgba(40, 167, 69, 0.3)",
            }}
          >
            {badge}
          </Badge>
        )}

        {action && !isLoading && (
          <div style={{ marginTop: "20px" }}>
            <EnhancedButton
              variant="outline"
              to={action.link}
              icon={action.icon}
            >
              {action.text}
            </EnhancedButton>
          </div>
        )}
      </Card.Body>
    </Card>
  );

  if (loading) {
    return (
      <div
        className="d-flex justify-content-center align-items-center"
        style={{ minHeight: "100vh" }}
      >
        <div className="text-center">
          <Spinner animation="border" role="status" size="lg" />
          <p className="mt-3">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="fade-in">
      <section
        style={{
          paddingTop: "2rem",
          paddingBottom: "2rem",
          minHeight: "100vh",
          background: "linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%)",
        }}
      >
        <Container>
          {/* Enhanced Header */}
          <Row className="mb-5">
            <Col lg={12}>
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <h1
                    style={{
                      color: "#333",
                      fontWeight: "800",
                      marginBottom: "10px",
                      fontSize: "2.5rem",
                    }}
                  >
                    Admin Dashboard
                  </h1>
                  <p
                    style={{
                      color: "#6c757d",
                      fontSize: "1.1rem",
                      marginBottom: "0",
                    }}
                  >
                    Welcome back! Here's what's happening at Hare Krishna
                    Medical.
                  </p>
                </div>
                <div className="d-flex gap-3">
                  <EnhancedButton
                    variant="primary"
                    to="/admin/products"
                    icon="bi bi-plus-circle"
                  >
                    Add Product
                  </EnhancedButton>
                  <EnhancedButton
                    variant="success"
                    to="/admin/messages"
                    icon="bi bi-envelope"
                  >
                    Messages
                  </EnhancedButton>
                  <EnhancedButton
                    variant="info"
                    to="/admin/analytics"
                    icon="bi bi-graph-up"
                  >
                    Analytics
                  </EnhancedButton>
                </div>
              </div>
            </Col>
          </Row>

          {error && (
            <Row className="mb-4">
              <Col lg={12}>
                <Alert variant="warning" className="d-flex align-items-center">
                  <i className="bi bi-exclamation-triangle me-2"></i>
                  {error}
                  <Button
                    variant="outline-warning"
                    size="sm"
                    className="ms-auto"
                    onClick={fetchDashboardData}
                  >
                    Retry
                  </Button>
                </Alert>
              </Col>
            </Row>
          )}

          {/* Enhanced Statistics Cards */}
          <Row className="mb-5 g-4">
            <Col lg={3} md={6}>
              <CircularStatCard
                icon="bi bi-bag-check"
                value={dashboardStats.totalOrders}
                label="Total Orders"
                gradient="linear-gradient(135deg, #e63946, #dc3545)"
                badge={
                  dashboardStats.monthlyGrowth > 0
                    ? `+${dashboardStats.monthlyGrowth}% this month`
                    : null
                }
                action={{
                  text: "View All",
                  link: "/admin/orders",
                  icon: "bi bi-arrow-right",
                }}
                isLoading={loading}
              />
            </Col>

            <Col lg={3} md={6}>
              <CircularStatCard
                icon="bi bi-box-seam"
                value={dashboardStats.totalProducts}
                label="Total Products"
                gradient="linear-gradient(135deg, #17a2b8, #20c997)"
                action={{
                  text: "Manage",
                  link: "/admin/products",
                  icon: "bi bi-gear",
                }}
                isLoading={loading}
              />
            </Col>

            <Col lg={3} md={6}>
              <CircularStatCard
                icon="bi bi-people"
                value={dashboardStats.totalUsers}
                label="Total Users"
                gradient="linear-gradient(135deg, #6f42c1, #6610f2)"
                badge={
                  dashboardStats.newUsersToday > 0
                    ? `+${dashboardStats.newUsersToday} today`
                    : null
                }
                action={{
                  text: "View Users",
                  link: "/admin/users",
                  icon: "bi bi-person-lines-fill",
                }}
                isLoading={loading}
              />
            </Col>

            <Col lg={3} md={6}>
              <CircularStatCard
                icon="bi bi-currency-rupee"
                value={
                  dashboardStats.totalRevenue > 0
                    ? `₹${(dashboardStats.totalRevenue / 1000).toFixed(1)}k`
                    : "₹0"
                }
                label="Total Revenue"
                gradient="linear-gradient(135deg, #fd7e14, #dc3545)"
                badge="This month"
                action={{
                  text: "View Report",
                  link: "/admin/analytics",
                  icon: "bi bi-chart-line",
                }}
                isLoading={loading}
              />
            </Col>
          </Row>

          {/* Quick Actions & Recent Orders */}
          <Row className="g-4">
            <Col lg={8}>
              <Card
                style={{
                  border: "none",
                  borderRadius: "20px",
                  boxShadow: "0 10px 40px rgba(0, 0, 0, 0.1)",
                }}
              >
                <Card.Header
                  style={{
                    background: "linear-gradient(135deg, #e63946, #dc3545)",
                    color: "white",
                    borderRadius: "20px 20px 0 0",
                    padding: "20px 25px",
                  }}
                >
                  <h5 className="mb-0" style={{ fontWeight: "700" }}>
                    <i className="bi bi-clock-history me-2"></i>
                    Recent Orders
                  </h5>
                </Card.Header>
                <Card.Body style={{ padding: "25px" }}>
                  {recentOrders.length > 0 ? (
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
                                <EnhancedButton
                                  variant="outline"
                                  onClick={() => handleViewOrder(order)}
                                  style={{
                                    padding: "6px 12px",
                                    fontSize: "12px",
                                    borderRadius: "8px",
                                  }}
                                >
                                  View
                                </EnhancedButton>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </Table>
                      <div className="text-center mt-3">
                        <EnhancedButton
                          variant="outline"
                          to="/admin/orders"
                          icon="bi bi-arrow-right"
                        >
                          View All Orders
                        </EnhancedButton>
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
                </Card.Body>
              </Card>
            </Col>

            <Col lg={4}>
              <Card
                style={{
                  border: "none",
                  borderRadius: "20px",
                  boxShadow: "0 10px 40px rgba(0, 0, 0, 0.1)",
                  marginBottom: "20px",
                }}
              >
                <Card.Header
                  style={{
                    background: "linear-gradient(135deg, #fd7e14, #dc3545)",
                    color: "white",
                    borderRadius: "20px 20px 0 0",
                    padding: "20px 25px",
                  }}
                >
                  <h6 className="mb-0" style={{ fontWeight: "700" }}>
                    <i className="bi bi-exclamation-triangle me-2"></i>
                    Low Stock Alert
                  </h6>
                </Card.Header>
                <Card.Body style={{ padding: "20px" }}>
                  {lowStockProducts.length > 0 ? (
                    <>
                      {lowStockProducts.map((product) => (
                        <div key={product._id || product.id} className="mb-3">
                          <div className="d-flex justify-content-between align-items-center mb-1">
                            <span
                              style={{ fontSize: "14px", fontWeight: "600" }}
                            >
                              {product.name}
                            </span>
                            <Badge bg="danger" style={{ fontSize: "10px" }}>
                              {product.stock} left
                            </Badge>
                          </div>
                          <ProgressBar
                            now={
                              (product.stock /
                                (product.lowStockThreshold || 20)) *
                              100
                            }
                            variant="danger"
                            style={{ height: "6px", borderRadius: "3px" }}
                          />
                        </div>
                      ))}
                      <div className="text-center mt-3">
                        <EnhancedButton
                          variant="outline"
                          to="/admin/products"
                          style={{
                            padding: "8px 16px",
                            fontSize: "12px",
                            borderRadius: "8px",
                          }}
                          icon="bi bi-plus-circle"
                        >
                          Restock Products
                        </EnhancedButton>
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
                </Card.Body>
              </Card>

              {/* Quick Actions */}
              <Card
                style={{
                  border: "none",
                  borderRadius: "20px",
                  boxShadow: "0 10px 40px rgba(0, 0, 0, 0.1)",
                }}
              >
                <Card.Header
                  style={{
                    background: "linear-gradient(135deg, #6f42c1, #6610f2)",
                    color: "white",
                    borderRadius: "20px 20px 0 0",
                    padding: "20px 25px",
                  }}
                >
                  <h6 className="mb-0" style={{ fontWeight: "700" }}>
                    <i className="bi bi-lightning me-2"></i>
                    Quick Actions
                  </h6>
                </Card.Header>
                <Card.Body style={{ padding: "20px" }}>
                  <div className="d-grid gap-2">
                    <EnhancedButton
                      variant="outline"
                      to="/admin/products"
                      icon="bi bi-plus-circle"
                      style={{
                        justifyContent: "flex-start",
                        padding: "12px 16px",
                      }}
                    >
                      Add New Product
                    </EnhancedButton>
                    <EnhancedButton
                      variant="outline"
                      to="/admin/users"
                      icon="bi bi-person-plus"
                      style={{
                        justifyContent: "flex-start",
                        padding: "12px 16px",
                      }}
                    >
                      Manage Users
                    </EnhancedButton>
                    <EnhancedButton
                      variant="outline"
                      to="/admin/messages"
                      icon="bi bi-envelope"
                      style={{
                        justifyContent: "flex-start",
                        padding: "12px 16px",
                      }}
                    >
                      Check Messages
                    </EnhancedButton>
                    <EnhancedButton
                      variant="outline"
                      to="/admin/invoices"
                      icon="bi bi-receipt"
                      style={{
                        justifyContent: "flex-start",
                        padding: "12px 16px",
                      }}
                    >
                      Generate Invoice
                    </EnhancedButton>
                  </div>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Container>
      </section>

      {/* Order Details Modal */}
      <Modal
        show={showOrderModal}
        onHide={() => setShowOrderModal(false)}
        size="lg"
      >
        <Modal.Header closeButton>
          <Modal.Title>Order Details</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedOrder && (
            <div>
              <Row>
                <Col md={6}>
                  <h6>Order Information</h6>
                  <p>
                    <strong>Order ID:</strong>{" "}
                    {selectedOrder.orderNumber ||
                      selectedOrder._id ||
                      selectedOrder.id}
                  </p>
                  <p>
                    <strong>Date:</strong>{" "}
                    {new Date(
                      selectedOrder.createdAt || selectedOrder.date,
                    ).toLocaleDateString()}
                  </p>
                  <p>
                    <strong>Status:</strong>{" "}
                    <Badge bg={getStatusVariant(selectedOrder.status)}>
                      {selectedOrder.status || "Pending"}
                    </Badge>
                  </p>
                  <p>
                    <strong>Payment:</strong>{" "}
                    {selectedOrder.paymentMethod || "Not specified"}
                  </p>
                </Col>
                <Col md={6}>
                  <h6>Customer Information</h6>
                  <p>
                    <strong>Name:</strong>{" "}
                    {selectedOrder.customer?.name ||
                      selectedOrder.customerName ||
                      "N/A"}
                  </p>
                  <p>
                    <strong>Email:</strong>{" "}
                    {selectedOrder.customer?.email ||
                      selectedOrder.customerEmail ||
                      "N/A"}
                  </p>
                  <p>
                    <strong>Phone:</strong>{" "}
                    {selectedOrder.customer?.phone ||
                      selectedOrder.customerPhone ||
                      "N/A"}
                  </p>
                  <p>
                    <strong>Address:</strong>{" "}
                    {selectedOrder.shippingAddress ||
                      selectedOrder.customerAddress ||
                      "N/A"}
                  </p>
                </Col>
              </Row>
              <hr />
              <h6>Order Summary</h6>
              <p>
                <strong>Items:</strong>{" "}
                {selectedOrder.items?.length || selectedOrder.itemCount || 0}
              </p>
              <p>
                <strong>Total Amount:</strong> ₹
                {selectedOrder.total || selectedOrder.amount || 0}
              </p>
            </div>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowOrderModal(false)}>
            Close
          </Button>
          <EnhancedButton
            variant="primary"
            to={`/admin/orders/${selectedOrder?._id || selectedOrder?.id}`}
          >
            View Full Details
          </EnhancedButton>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default AdminDashboard;
