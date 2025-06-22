import React from "react";
import { Container, Row, Col, Card, Button, Badge } from "react-bootstrap";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";

const UserDashboard = () => {
  const { user } = useSelector((state) => state.auth);

  // Mock user data - enhanced
  const userStats = {
    totalOrders: 12,
    pendingOrders: 2,
    deliveredOrders: 9,
    totalSpent: 2450.75,
    recentInvoices: 3,
    savedProducts: 8,
    loyaltyPoints: 150,
  };

  const recentOrders = [
    {
      id: "HKM12345678",
      date: "2024-01-15",
      status: "Delivered",
      amount: 235.5,
      items: 3,
    },
    {
      id: "HKM12345679",
      date: "2024-01-12",
      status: "Processing",
      amount: 156.75,
      items: 2,
    },
  ];

  const EnhancedButton = ({
    children,
    variant = "primary",
    to,
    onClick,
    icon,
    style = {},
    size = "md",
  }) => {
    const baseStyle = {
      borderRadius: size === "lg" ? "15px" : "12px",
      padding:
        size === "lg" ? "16px 32px" : size === "sm" ? "8px 16px" : "12px 24px",
      fontWeight: "600",
      transition: "all 0.3s ease",
      border: "none",
      position: "relative",
      overflow: "hidden",
      textDecoration: "none",
      display: "inline-flex",
      alignItems: "center",
      justifyContent: "center",
      width: "100%",
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
      warning: {
        background: "linear-gradient(135deg, #ffc107, #fd7e14)",
        color: "white",
        boxShadow: "0 4px 15px rgba(255, 193, 7, 0.3)",
      },
    };

    const currentStyle = { ...baseStyle, ...variants[variant] };

    const handleHover = (e, isHover) => {
      if (isHover) {
        e.target.style.transform = "translateY(-3px)";
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
    description,
    isLarge = false,
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
      <Card.Body
        className="text-center"
        style={{ padding: isLarge ? "50px 30px" : "40px 30px" }}
      >
        <div
          style={{
            width: isLarge ? "120px" : "90px",
            height: isLarge ? "120px" : "90px",
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
          <i
            className={icon}
            style={{
              fontSize: isLarge ? "50px" : "35px",
              color: "white",
            }}
          ></i>
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
            <i className="bi bi-star-fill"></i>
          </div>
        </div>

        <h1
          style={{
            color: "#333",
            fontWeight: "900",
            marginBottom: "10px",
            fontSize: isLarge ? "3.5rem" : "2.5rem",
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
            marginBottom: "15px",
            fontWeight: "600",
            textTransform: "uppercase",
            letterSpacing: "1px",
            fontSize: "13px",
          }}
        >
          {label}
        </h5>

        {description && (
          <p
            style={{
              color: "#8e9297",
              fontSize: "12px",
              marginBottom: "20px",
              lineHeight: "1.5",
            }}
          >
            {description}
          </p>
        )}

        {badge && (
          <Badge
            style={{
              background: "linear-gradient(135deg, #28a745, #20c997)",
              color: "white",
              padding: "6px 12px",
              borderRadius: "20px",
              fontSize: "11px",
              fontWeight: "600",
              boxShadow: "0 4px 15px rgba(40, 167, 69, 0.3)",
            }}
          >
            {badge}
          </Badge>
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
            <Col lg={12} className="text-center">
              <div
                style={{
                  background: "linear-gradient(135deg, #e63946, #dc3545)",
                  borderRadius: "30px",
                  padding: "40px",
                  color: "white",
                  boxShadow: "0 15px 50px rgba(230, 57, 70, 0.3)",
                  position: "relative",
                  overflow: "hidden",
                }}
              >
                <div
                  style={{
                    position: "absolute",
                    top: "-50px",
                    right: "-50px",
                    width: "150px",
                    height: "150px",
                    background: "rgba(255, 255, 255, 0.1)",
                    borderRadius: "50%",
                  }}
                ></div>
                <div
                  style={{
                    position: "absolute",
                    bottom: "-30px",
                    left: "-30px",
                    width: "100px",
                    height: "100px",
                    background: "rgba(255, 255, 255, 0.1)",
                    borderRadius: "50%",
                  }}
                ></div>
                <h1
                  style={{
                    fontWeight: "800",
                    marginBottom: "15px",
                    fontSize: "2.5rem",
                    position: "relative",
                    zIndex: 2,
                  }}
                >
                  Welcome back, {user?.name || "User"}! 👋
                </h1>
                <p
                  style={{
                    fontSize: "1.2rem",
                    opacity: "0.9",
                    marginBottom: "0",
                    position: "relative",
                    zIndex: 2,
                  }}
                >
                  Manage your orders and health needs from your personal
                  dashboard
                </p>
              </div>
            </Col>
          </Row>

          {/* Enhanced Statistics Cards */}
          <Row className="mb-5 g-4">
            <Col lg={4} md={6}>
              <CircularStatCard
                icon="bi bi-bag-check-fill"
                value={userStats.totalOrders}
                label="Total Orders"
                gradient="linear-gradient(135deg, #e63946, #dc3545)"
                badge="All time"
                description="Your complete order history"
                isLarge={true}
              />
            </Col>

            <Col lg={4} md={6}>
              <CircularStatCard
                icon="bi bi-clock-history"
                value={userStats.pendingOrders}
                label="Pending Orders"
                gradient="linear-gradient(135deg, #ffc107, #fd7e14)"
                badge="In progress"
                description="Orders being processed"
              />
            </Col>

            <Col lg={4} md={6}>
              <CircularStatCard
                icon="bi bi-truck"
                value={userStats.deliveredOrders}
                label="Delivered Orders"
                gradient="linear-gradient(135deg, #28a745, #20c997)"
                badge="Completed"
                description="Successfully delivered"
              />
            </Col>
          </Row>

          {/* Secondary Stats */}
          <Row className="mb-5 g-4">
            <Col lg={3} md={6}>
              <CircularStatCard
                icon="bi bi-currency-rupee"
                value={`₹${(userStats.totalSpent / 1000).toFixed(1)}k`}
                label="Total Spent"
                gradient="linear-gradient(135deg, #6f42c1, #6610f2)"
                description="Lifetime spending"
              />
            </Col>

            <Col lg={3} md={6}>
              <CircularStatCard
                icon="bi bi-receipt"
                value={userStats.recentInvoices}
                label="Recent Invoices"
                gradient="linear-gradient(135deg, #17a2b8, #20c997)"
                description="Available downloads"
              />
            </Col>

            <Col lg={3} md={6}>
              <CircularStatCard
                icon="bi bi-heart-fill"
                value={userStats.savedProducts}
                label="Saved Products"
                gradient="linear-gradient(135deg, #dc3545, #e63946)"
                description="Your wishlist items"
              />
            </Col>

            <Col lg={3} md={6}>
              <CircularStatCard
                icon="bi bi-star-fill"
                value={userStats.loyaltyPoints}
                label="Loyalty Points"
                gradient="linear-gradient(135deg, #fd7e14, #ffc107)"
                badge="Redeem now"
                description="Earn more rewards"
              />
            </Col>
          </Row>

          {/* Quick Actions & Recent Activity */}
          <Row className="g-4">
            <Col lg={8}>
              <Card
                style={{
                  border: "none",
                  borderRadius: "25px",
                  boxShadow: "0 10px 40px rgba(0, 0, 0, 0.1)",
                }}
              >
                <Card.Header
                  style={{
                    background: "linear-gradient(135deg, #6f42c1, #6610f2)",
                    color: "white",
                    borderRadius: "25px 25px 0 0",
                    padding: "25px 30px",
                  }}
                >
                  <h5 className="mb-0" style={{ fontWeight: "700" }}>
                    <i className="bi bi-lightning-charge me-2"></i>
                    Quick Actions
                  </h5>
                </Card.Header>
                <Card.Body style={{ padding: "30px" }}>
                  <Row className="g-3">
                    <Col md={6}>
                      <EnhancedButton
                        variant="primary"
                        to="/products"
                        icon="bi bi-cart-plus"
                        size="lg"
                      >
                        Shop Products
                      </EnhancedButton>
                    </Col>
                    <Col md={6}>
                      <EnhancedButton
                        variant="success"
                        to="/user/orders"
                        icon="bi bi-box-seam"
                        size="lg"
                      >
                        Track Orders
                      </EnhancedButton>
                    </Col>
                    <Col md={6}>
                      <EnhancedButton
                        variant="info"
                        to="/user/invoices"
                        icon="bi bi-receipt"
                        size="lg"
                      >
                        View Invoices
                      </EnhancedButton>
                    </Col>
                    <Col md={6}>
                      <EnhancedButton
                        variant="warning"
                        to="/user/profile"
                        icon="bi bi-person-gear"
                        size="lg"
                      >
                        Update Profile
                      </EnhancedButton>
                    </Col>
                  </Row>
                </Card.Body>
              </Card>
            </Col>

            <Col lg={4}>
              {/* Recent Orders */}
              <Card
                style={{
                  border: "none",
                  borderRadius: "25px",
                  boxShadow: "0 10px 40px rgba(0, 0, 0, 0.1)",
                  marginBottom: "20px",
                }}
              >
                <Card.Header
                  style={{
                    background: "linear-gradient(135deg, #e63946, #dc3545)",
                    color: "white",
                    borderRadius: "25px 25px 0 0",
                    padding: "20px 25px",
                  }}
                >
                  <h6 className="mb-0" style={{ fontWeight: "700" }}>
                    <i className="bi bi-clock-history me-2"></i>
                    Recent Orders
                  </h6>
                </Card.Header>
                <Card.Body style={{ padding: "20px" }}>
                  {recentOrders.map((order) => (
                    <div
                      key={order.id}
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
                          {order.id}
                        </code>
                        <Badge
                          bg={
                            order.status === "Delivered"
                              ? "success"
                              : order.status === "Processing"
                                ? "warning"
                                : "primary"
                          }
                          style={{ fontSize: "10px" }}
                        >
                          {order.status}
                        </Badge>
                      </div>
                      <div
                        style={{
                          fontSize: "12px",
                          color: "#6c757d",
                          marginBottom: "8px",
                        }}
                      >
                        {order.date} • {order.items} items
                      </div>
                      <div
                        style={{
                          fontSize: "14px",
                          fontWeight: "700",
                          color: "#28a745",
                        }}
                      >
                        ₹{order.amount}
                      </div>
                    </div>
                  ))}
                  <div className="text-center">
                    <EnhancedButton
                      variant="outline"
                      to="/user/orders"
                      style={{
                        padding: "8px 16px",
                        fontSize: "12px",
                        borderRadius: "12px",
                      }}
                      icon="bi bi-arrow-right"
                    >
                      View All Orders
                    </EnhancedButton>
                  </div>
                </Card.Body>
              </Card>

              {/* Health Tips */}
              <Card
                style={{
                  border: "none",
                  borderRadius: "25px",
                  boxShadow: "0 10px 40px rgba(0, 0, 0, 0.1)",
                }}
              >
                <Card.Header
                  style={{
                    background: "linear-gradient(135deg, #28a745, #20c997)",
                    color: "white",
                    borderRadius: "25px 25px 0 0",
                    padding: "20px 25px",
                  }}
                >
                  <h6 className="mb-0" style={{ fontWeight: "700" }}>
                    <i className="bi bi-heart-pulse me-2"></i>
                    Health Tip of the Day
                  </h6>
                </Card.Header>
                <Card.Body style={{ padding: "25px" }}>
                  <div className="text-center">
                    <div
                      style={{
                        width: "60px",
                        height: "60px",
                        background: "linear-gradient(135deg, #28a745, #20c997)",
                        borderRadius: "50%",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        margin: "0 auto 15px",
                      }}
                    >
                      <i
                        className="bi bi-droplet"
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
                      Stay Hydrated
                    </h6>
                    <p
                      style={{
                        fontSize: "13px",
                        color: "#6c757d",
                        lineHeight: "1.5",
                        marginBottom: "15px",
                      }}
                    >
                      Drink at least 8 glasses of water daily to maintain
                      optimal health and boost your immune system.
                    </p>
                    <EnhancedButton
                      variant="outline"
                      to="/user-guide"
                      style={{
                        padding: "8px 16px",
                        fontSize: "12px",
                        borderRadius: "12px",
                      }}
                      icon="bi bi-book"
                    >
                      More Tips
                    </EnhancedButton>
                  </div>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Container>
      </section>
    </div>
  );
};

export default UserDashboard;
