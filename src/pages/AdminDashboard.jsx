import React, { useState } from "react";
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
} from "react-bootstrap";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";

const AdminDashboard = () => {
  const { unreadCount } = useSelector((state) => state.messages);
  const [showOrderModal, setShowOrderModal] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);

  // Mock data for admin dashboard
  const dashboardStats = {
    totalOrders: 156,
    totalProducts: 45,
    totalUsers: 1234,
    totalRevenue: 45670.5,
    monthlyGrowth: 12.5,
    pendingOrders: 23,
    lowStockProducts: 8,
    newUsersToday: 12,
    unreadMessages: unreadCount || 5,
  };

  const recentOrders = [
    {
      id: "HKM12345678",
      customer: "John Doe",
      customerEmail: "john.doe@email.com",
      customerPhone: "+91 9876543210",
      address: "123 Main Street, Surat, Gujarat 395007",
      amount: 235.5,
      status: "Pending",
      date: "2024-01-15",
      time: "10:30 AM",
      items: 3,
      paymentMethod: "Online",
    },
    {
      id: "HKM12345679",
      customer: "Jane Smith",
      customerEmail: "jane.smith@email.com",
      customerPhone: "+91 9123456789",
      address: "456 Oak Avenue, Ahmedabad, Gujarat 380001",
      amount: 156.75,
      status: "Confirmed",
      date: "2024-01-15",
      time: "02:15 PM",
      items: 2,
      paymentMethod: "COD",
    },
  ];

  const handleViewOrder = (order) => {
    setSelectedOrder(order);
    setShowOrderModal(true);
  };

  const lowStockProducts = [
    { id: 1, name: "Paracetamol Tablets", stock: 5, threshold: 20 },
    { id: 2, name: "Vitamin D3 Capsules", stock: 12, threshold: 25 },
    { id: 3, name: "Cough Syrup", stock: 8, threshold: 15 },
    { id: 4, name: "Antiseptic Liquid", stock: 3, threshold: 10 },
  ];

  const getStatusVariant = (status) => {
    switch (status) {
      case "Pending":
        return "warning";
      case "Confirmed":
        return "info";
      case "Processing":
        return "primary";
      case "Delivered":
        return "success";
      case "Cancelled":
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
          <i className={icon} style={{ fontSize: "40px", color: "white" }}></i>
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
          {typeof value === "number" && value > 1000
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

        {badge && (
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

        {action && (
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

          {/* Enhanced Statistics Cards */}
          <Row className="mb-5 g-4">
            <Col lg={3} md={6}>
              <CircularStatCard
                icon="bi bi-bag-check"
                value={dashboardStats.totalOrders}
                label="Total Orders"
                gradient="linear-gradient(135deg, #e63946, #dc3545)"
                badge={`+${dashboardStats.monthlyGrowth}% this month`}
                action={{
                  text: "View All",
                  link: "/admin/orders",
                  icon: "bi bi-arrow-right",
                }}
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
              />
            </Col>

            <Col lg={3} md={6}>
              <CircularStatCard
                icon="bi bi-people"
                value={dashboardStats.totalUsers}
                label="Total Users"
                gradient="linear-gradient(135deg, #6f42c1, #6610f2)"
                badge={`+${dashboardStats.newUsersToday} today`}
                action={{
                  text: "View Users",
                  link: "/admin/users",
                  icon: "bi bi-person-lines-fill",
                }}
              />
            </Col>

            <Col lg={3} md={6}>
              <CircularStatCard
                icon="bi bi-currency-rupee"
                value={`₹${(dashboardStats.totalRevenue / 1000).toFixed(1)}k`}
                label="Total Revenue"
                gradient="linear-gradient(135deg, #fd7e14, #dc3545)"
                badge="This month"
                action={{
                  text: "View Report",
                  link: "/admin/analytics",
                  icon: "bi bi-chart-line",
                }}
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
                        <tr key={order.id}>
                          <td>
                            <code
                              style={{
                                background: "#f8f9fa",
                                padding: "4px 8px",
                                borderRadius: "6px",
                              }}
                            >
                              {order.id}
                            </code>
                          </td>
                          <td>
                            <div>
                              <div style={{ fontWeight: "600" }}>
                                {order.customer}
                              </div>
                              <small className="text-muted">
                                {order.customerEmail}
                              </small>
                            </div>
                          </td>
                          <td>
                            <strong style={{ color: "#28a745" }}>
                              ₹{order.amount}
                            </strong>
                          </td>
                          <td>
                            <Badge bg={getStatusVariant(order.status)}>
                              {order.status}
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
                  {lowStockProducts.map((product) => (
                    <div key={product.id} className="mb-3">
                      <div className="d-flex justify-content-between align-items-center mb-1">
                        <span style={{ fontSize: "14px", fontWeight: "600" }}>
                          {product.name}
                        </span>
                        <Badge bg="danger" style={{ fontSize: "10px" }}>
                          {product.stock} left
                        </Badge>
                      </div>
                      <ProgressBar
                        now={(product.stock / product.threshold) * 100}
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
                    <strong>Order ID:</strong> {selectedOrder.id}
                  </p>
                  <p>
                    <strong>Date:</strong> {selectedOrder.date} at{" "}
                    {selectedOrder.time}
                  </p>
                  <p>
                    <strong>Status:</strong>{" "}
                    <Badge bg={getStatusVariant(selectedOrder.status)}>
                      {selectedOrder.status}
                    </Badge>
                  </p>
                  <p>
                    <strong>Payment:</strong> {selectedOrder.paymentMethod}
                  </p>
                </Col>
                <Col md={6}>
                  <h6>Customer Information</h6>
                  <p>
                    <strong>Name:</strong> {selectedOrder.customer}
                  </p>
                  <p>
                    <strong>Email:</strong> {selectedOrder.customerEmail}
                  </p>
                  <p>
                    <strong>Phone:</strong> {selectedOrder.customerPhone}
                  </p>
                  <p>
                    <strong>Address:</strong> {selectedOrder.address}
                  </p>
                </Col>
              </Row>
              <hr />
              <h6>Order Summary</h6>
              <p>
                <strong>Items:</strong> {selectedOrder.items}
              </p>
              <p>
                <strong>Total Amount:</strong> ₹{selectedOrder.amount}
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
            to={`/admin/orders/${selectedOrder?.id}`}
          >
            View Full Details
          </EnhancedButton>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default AdminDashboard;
