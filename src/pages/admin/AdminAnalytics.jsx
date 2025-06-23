import React, { useState, useEffect } from "react";
import {
  Container,
  Row,
  Col,
  Card,
  Table,
  Badge,
  Button,
  Form,
  ProgressBar,
  Dropdown,
} from "react-bootstrap";
import { Link } from "react-router-dom";

const AdminAnalytics = () => {
  const [dateRange, setDateRange] = useState("last30days");
  const [selectedMetric, setSelectedMetric] = useState("revenue");

  // Mock analytics data
  const analyticsData = {
    overview: {
      totalRevenue: 156750.75,
      totalOrders: 1247,
      totalCustomers: 856,
      averageOrderValue: 125.6,
      conversionRate: 3.2,
      repeatCustomerRate: 45.8,
      topSellingCategories: 8,
      lowStockItems: 12,
    },
    salesMetrics: {
      todayRevenue: 3250.5,
      yesterdayRevenue: 2890.25,
      weekRevenue: 18750.75,
      monthRevenue: 45200.0,
      revenueGrowth: 12.5,
      orderGrowth: 8.3,
      customerGrowth: 15.2,
    },
    topProducts: [
      {
        id: 1,
        name: "Paracetamol Tablets 500mg",
        category: "Pain Relief",
        sold: 1245,
        revenue: 32175.55,
        growth: 15.2,
      },
      {
        id: 2,
        name: "Vitamin D3 Capsules",
        category: "Vitamins",
        sold: 856,
        revenue: 38948.0,
        growth: 22.8,
      },
      {
        id: 3,
        name: "Blood Pressure Monitor",
        category: "Equipment",
        sold: 234,
        revenue: 304116.0,
        growth: -5.1,
      },
      {
        id: 4,
        name: "Cough Syrup",
        category: "Cough & Cold",
        sold: 567,
        revenue: 20267.25,
        growth: 8.7,
      },
    ],
    customerMetrics: {
      newCustomers: 124,
      returningCustomers: 732,
      customerLifetimeValue: 450.75,
      averageSessionDuration: "4m 32s",
      bounceRate: 35.2,
    },
    regionData: [
      { region: "Surat", orders: 456, revenue: 68940.5, percentage: 44.0 },
      { region: "Ahmedabad", orders: 312, revenue: 43250.25, percentage: 27.6 },
      { region: "Vadodara", orders: 198, revenue: 28750.0, percentage: 18.3 },
      { region: "Rajkot", orders: 156, revenue: 15810.0, percentage: 10.1 },
    ],
    paymentMethods: {
      online: { count: 785, percentage: 63.0 },
      cod: { count: 462, percentage: 37.0 },
    },
  };

  // Enhanced Button Component
  const EnhancedButton = ({
    children,
    variant = "primary",
    onClick,
    icon,
    style = {},
    size = "md",
    disabled = false,
  }) => {
    const baseStyle = {
      borderRadius: size === "lg" ? "12px" : "8px",
      padding:
        size === "lg" ? "12px 24px" : size === "sm" ? "6px 12px" : "8px 16px",
      fontWeight: "600",
      transition: "all 0.3s ease",
      border: "none",
      position: "relative",
      overflow: "hidden",
      display: "inline-flex",
      alignItems: "center",
      justifyContent: "center",
      opacity: disabled ? 0.6 : 1,
      cursor: disabled ? "not-allowed" : "pointer",
      ...style,
    };

    const variants = {
      primary: {
        background: "linear-gradient(135deg, #e63946, #dc3545)",
        color: "white",
        boxShadow: "0 4px 15px rgba(230, 57, 70, 0.3)",
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
      outline: {
        background: "transparent",
        border: "2px solid #e63946",
        color: "#e63946",
      },
    };

    const currentStyle = { ...baseStyle, ...variants[variant] };

    const handleHover = (e, isHover) => {
      if (disabled) return;
      if (isHover) {
        e.target.style.transform = "translateY(-2px)";
        if (variant === "outline") {
          e.target.style.background = "#e63946";
          e.target.style.color = "white";
        }
      } else {
        e.target.style.transform = "translateY(0)";
        if (variant === "outline") {
          e.target.style.background = "transparent";
          e.target.style.color = "#e63946";
        }
      }
    };

    return (
      <button
        style={currentStyle}
        onClick={onClick}
        disabled={disabled}
        onMouseEnter={(e) => handleHover(e, true)}
        onMouseLeave={(e) => handleHover(e, false)}
      >
        {icon && <i className={`${icon} me-2`}></i>}
        {children}
      </button>
    );
  };

  // Circular Stat Card Component
  const CircularStatCard = ({
    icon,
    value,
    label,
    gradient,
    badge,
    description,
    trend,
  }) => (
    <Card
      style={{
        border: "none",
        borderRadius: "20px",
        background: "linear-gradient(135deg, #ffffff, #f8f9fa)",
        boxShadow: "0 8px 32px rgba(0, 0, 0, 0.1)",
        transition: "all 0.3s ease",
        height: "100%",
      }}
      onMouseOver={(e) => {
        e.currentTarget.style.transform = "translateY(-5px)";
        e.currentTarget.style.boxShadow = "0 15px 45px rgba(0, 0, 0, 0.15)";
      }}
      onMouseOut={(e) => {
        e.currentTarget.style.transform = "translateY(0)";
        e.currentTarget.style.boxShadow = "0 8px 32px rgba(0, 0, 0, 0.1)";
      }}
    >
      <Card.Body className="text-center" style={{ padding: "30px" }}>
        <div
          style={{
            width: "80px",
            height: "80px",
            background: gradient,
            borderRadius: "50%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            margin: "0 auto 20px",
            boxShadow: "0 8px 25px rgba(0, 0, 0, 0.2)",
            position: "relative",
          }}
        >
          <i className={icon} style={{ fontSize: "30px", color: "white" }}></i>
          {trend && (
            <div
              style={{
                position: "absolute",
                top: "-8px",
                right: "-8px",
                width: "24px",
                height: "24px",
                background: trend > 0 ? "#28a745" : "#dc3545",
                borderRadius: "50%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "10px",
                color: "white",
                fontWeight: "bold",
              }}
            >
              <i className={`bi bi-arrow-${trend > 0 ? "up" : "down"}`}></i>
            </div>
          )}
        </div>

        <h2
          style={{
            color: "#333",
            fontWeight: "800",
            marginBottom: "8px",
            fontSize: "2rem",
          }}
        >
          {typeof value === "number" && value > 1000
            ? `${(value / 1000).toFixed(1)}k`
            : typeof value === "number" && value % 1 !== 0
              ? value.toFixed(1)
              : value}
        </h2>

        <h6
          style={{
            color: "#6c757d",
            marginBottom: "12px",
            fontWeight: "600",
            fontSize: "12px",
            textTransform: "uppercase",
            letterSpacing: "1px",
          }}
        >
          {label}
        </h6>

        {description && (
          <p
            style={{
              color: "#8e9297",
              fontSize: "11px",
              marginBottom: badge ? "12px" : "0",
              lineHeight: "1.4",
            }}
          >
            {description}
          </p>
        )}

        {badge && (
          <Badge
            style={{
              background:
                badge.includes("+") || badge.includes("↑")
                  ? "linear-gradient(135deg, #28a745, #20c997)"
                  : badge.includes("-") || badge.includes("↓")
                    ? "linear-gradient(135deg, #dc3545, #e63946)"
                    : "linear-gradient(135deg, #17a2b8, #20c997)",
              color: "white",
              padding: "4px 10px",
              borderRadius: "15px",
              fontSize: "10px",
              fontWeight: "600",
            }}
          >
            {badge}
          </Badge>
        )}
      </Card.Body>
    </Card>
  );

  // Format currency
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
    }).format(amount);
  };

  // Get growth trend
  const getTrendColor = (growth) => {
    return growth > 0 ? "#28a745" : growth < 0 ? "#dc3545" : "#6c757d";
  };

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
          <Row className="mb-4">
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
                    Analytics Dashboard
                  </h1>
                  <p
                    style={{
                      color: "#6c757d",
                      fontSize: "1.1rem",
                      marginBottom: "0",
                    }}
                  >
                    Comprehensive business insights and performance metrics
                  </p>
                </div>
                <div className="d-flex gap-3">
                  <Form.Select
                    value={dateRange}
                    onChange={(e) => setDateRange(e.target.value)}
                    style={{
                      borderRadius: "8px",
                      border: "2px solid #e9ecef",
                      fontWeight: "600",
                    }}
                  >
                    <option value="today">Today</option>
                    <option value="yesterday">Yesterday</option>
                    <option value="last7days">Last 7 Days</option>
                    <option value="last30days">Last 30 Days</option>
                    <option value="last90days">Last 90 Days</option>
                    <option value="thisyear">This Year</option>
                  </Form.Select>
                  <EnhancedButton
                    variant="info"
                    onClick={() => window.location.reload()}
                    icon="bi bi-arrow-clockwise"
                  >
                    Refresh
                  </EnhancedButton>
                  <EnhancedButton
                    variant="success"
                    onClick={() => {}}
                    icon="bi bi-download"
                  >
                    Export
                  </EnhancedButton>
                </div>
              </div>
            </Col>
          </Row>

          {/* Enhanced Statistics Cards */}
          <Row className="mb-5 g-4">
            <Col lg={3} md={6}>
              <CircularStatCard
                icon="bi bi-currency-rupee"
                value={`₹${(analyticsData.overview.totalRevenue / 1000).toFixed(0)}k`}
                label="Total Revenue"
                gradient="linear-gradient(135deg, #e63946, #dc3545)"
                badge={`+${analyticsData.salesMetrics.revenueGrowth}%`}
                description="Total business revenue"
                trend={analyticsData.salesMetrics.revenueGrowth}
              />
            </Col>

            <Col lg={3} md={6}>
              <CircularStatCard
                icon="bi bi-bag-check"
                value={analyticsData.overview.totalOrders}
                label="Total Orders"
                gradient="linear-gradient(135deg, #28a745, #20c997)"
                badge={`+${analyticsData.salesMetrics.orderGrowth}%`}
                description="Orders processed"
                trend={analyticsData.salesMetrics.orderGrowth}
              />
            </Col>

            <Col lg={3} md={6}>
              <CircularStatCard
                icon="bi bi-people"
                value={analyticsData.overview.totalCustomers}
                label="Total Customers"
                gradient="linear-gradient(135deg, #6f42c1, #6610f2)"
                badge={`+${analyticsData.salesMetrics.customerGrowth}%`}
                description="Registered customers"
                trend={analyticsData.salesMetrics.customerGrowth}
              />
            </Col>

            <Col lg={3} md={6}>
              <CircularStatCard
                icon="bi bi-graph-up"
                value={`₹${analyticsData.overview.averageOrderValue}`}
                label="Avg Order Value"
                gradient="linear-gradient(135deg, #17a2b8, #20c997)"
                badge="Stable"
                description="Average per order"
              />
            </Col>
          </Row>

          {/* Secondary Metrics */}
          <Row className="mb-5 g-4">
            <Col lg={2} md={4} sm={6}>
              <CircularStatCard
                icon="bi bi-percent"
                value={`${analyticsData.overview.conversionRate}%`}
                label="Conversion Rate"
                gradient="linear-gradient(135deg, #fd7e14, #ffc107)"
                description="Visitor to customer"
              />
            </Col>

            <Col lg={2} md={4} sm={6}>
              <CircularStatCard
                icon="bi bi-arrow-repeat"
                value={`${analyticsData.overview.repeatCustomerRate}%`}
                label="Repeat Customers"
                gradient="linear-gradient(135deg, #20c997, #28a745)"
                description="Customer retention"
              />
            </Col>

            <Col lg={2} md={4} sm={6}>
              <CircularStatCard
                icon="bi bi-tags"
                value={analyticsData.overview.topSellingCategories}
                label="Top Categories"
                gradient="linear-gradient(135deg, #6610f2, #6f42c1)"
                description="Product categories"
              />
            </Col>

            <Col lg={2} md={4} sm={6}>
              <CircularStatCard
                icon="bi bi-exclamation-triangle"
                value={analyticsData.overview.lowStockItems}
                label="Low Stock"
                gradient="linear-gradient(135deg, #dc3545, #e63946)"
                badge="Attention needed"
                description="Items need restock"
              />
            </Col>

            <Col lg={2} md={4} sm={6}>
              <CircularStatCard
                icon="bi bi-credit-card"
                value={`${analyticsData.paymentMethods.online.percentage}%`}
                label="Online Payments"
                gradient="linear-gradient(135deg, #17a2b8, #20c997)"
                description="Digital transactions"
              />
            </Col>

            <Col lg={2} md={4} sm={6}>
              <CircularStatCard
                icon="bi bi-cash-coin"
                value={`${analyticsData.paymentMethods.cod.percentage}%`}
                label="COD Payments"
                gradient="linear-gradient(135deg, #ffc107, #fd7e14)"
                description="Cash on delivery"
              />
            </Col>
          </Row>

          {/* Analytics Tables and Charts */}
          <Row className="g-4">
            {/* Top Products */}
            <Col lg={8}>
              <Card
                style={{
                  border: "none",
                  borderRadius: "16px",
                  boxShadow: "0 8px 32px rgba(0,0,0,0.08)",
                }}
              >
                <Card.Header
                  style={{
                    background: "linear-gradient(135deg, #e63946, #dc3545)",
                    color: "white",
                    borderRadius: "16px 16px 0 0",
                    padding: "20px 25px",
                  }}
                >
                  <h5 className="mb-0" style={{ fontWeight: "700" }}>
                    <i className="bi bi-star me-2"></i>
                    Top Performing Products
                  </h5>
                </Card.Header>
                <Card.Body style={{ padding: "0" }}>
                  <Table responsive hover style={{ marginBottom: "0" }}>
                    <thead style={{ background: "#f8f9fa" }}>
                      <tr>
                        <th
                          style={{
                            padding: "15px",
                            fontWeight: "600",
                            color: "#333",
                          }}
                        >
                          Product
                        </th>
                        <th
                          style={{
                            padding: "15px",
                            fontWeight: "600",
                            color: "#333",
                          }}
                        >
                          Category
                        </th>
                        <th
                          style={{
                            padding: "15px",
                            fontWeight: "600",
                            color: "#333",
                          }}
                        >
                          Units Sold
                        </th>
                        <th
                          style={{
                            padding: "15px",
                            fontWeight: "600",
                            color: "#333",
                          }}
                        >
                          Revenue
                        </th>
                        <th
                          style={{
                            padding: "15px",
                            fontWeight: "600",
                            color: "#333",
                          }}
                        >
                          Growth
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {analyticsData.topProducts.map((product, index) => (
                        <tr
                          key={product.id}
                          style={{ borderBottom: "1px solid #f1f3f4" }}
                        >
                          <td style={{ padding: "15px" }}>
                            <div className="d-flex align-items-center">
                              <div
                                style={{
                                  width: "40px",
                                  height: "40px",
                                  background: `linear-gradient(135deg, ${
                                    index === 0
                                      ? "#e63946, #dc3545"
                                      : index === 1
                                        ? "#28a745, #20c997"
                                        : index === 2
                                          ? "#ffc107, #fd7e14"
                                          : "#6f42c1, #6610f2"
                                  })`,
                                  borderRadius: "50%",
                                  display: "flex",
                                  alignItems: "center",
                                  justifyContent: "center",
                                  color: "white",
                                  fontWeight: "bold",
                                  marginRight: "12px",
                                  fontSize: "14px",
                                }}
                              >
                                #{index + 1}
                              </div>
                              <div>
                                <div
                                  style={{
                                    fontWeight: "600",
                                    marginBottom: "2px",
                                  }}
                                >
                                  {product.name}
                                </div>
                              </div>
                            </div>
                          </td>
                          <td style={{ padding: "15px" }}>
                            <span
                              style={{
                                background: "#f8f9fa",
                                color: "#6c757d",
                                padding: "4px 8px",
                                borderRadius: "6px",
                                fontSize: "12px",
                                fontWeight: "600",
                              }}
                            >
                              {product.category}
                            </span>
                          </td>
                          <td style={{ padding: "15px" }}>
                            <div
                              style={{
                                fontWeight: "700",
                                color: "#333",
                                fontSize: "16px",
                              }}
                            >
                              {product.sold.toLocaleString()}
                            </div>
                          </td>
                          <td style={{ padding: "15px" }}>
                            <div
                              style={{
                                fontWeight: "700",
                                color: "#28a745",
                                fontSize: "16px",
                              }}
                            >
                              {formatCurrency(product.revenue)}
                            </div>
                          </td>
                          <td style={{ padding: "15px" }}>
                            <Badge
                              style={{
                                background:
                                  product.growth > 0
                                    ? "linear-gradient(135deg, #28a745, #20c997)"
                                    : "linear-gradient(135deg, #dc3545, #e63946)",
                                color: "white",
                                padding: "6px 12px",
                                borderRadius: "15px",
                                fontSize: "11px",
                                fontWeight: "600",
                              }}
                            >
                              {product.growth > 0 ? "+" : ""}
                              {product.growth}%
                            </Badge>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </Table>
                </Card.Body>
              </Card>
            </Col>

            {/* Regional Performance */}
            <Col lg={4}>
              <Card
                style={{
                  border: "none",
                  borderRadius: "16px",
                  boxShadow: "0 8px 32px rgba(0,0,0,0.08)",
                  marginBottom: "20px",
                }}
              >
                <Card.Header
                  style={{
                    background: "linear-gradient(135deg, #6f42c1, #6610f2)",
                    color: "white",
                    borderRadius: "16px 16px 0 0",
                    padding: "20px 25px",
                  }}
                >
                  <h6 className="mb-0" style={{ fontWeight: "700" }}>
                    <i className="bi bi-geo-alt me-2"></i>
                    Regional Performance
                  </h6>
                </Card.Header>
                <Card.Body style={{ padding: "20px" }}>
                  {analyticsData.regionData.map((region, index) => (
                    <div
                      key={region.region}
                      style={{
                        background: "#f8f9fa",
                        borderRadius: "12px",
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
                      <div className="d-flex justify-content-between align-items-center mb-2">
                        <div style={{ fontWeight: "600", color: "#333" }}>
                          {region.region}
                        </div>
                        <Badge
                          style={{
                            background: `linear-gradient(135deg, ${
                              index === 0
                                ? "#e63946, #dc3545"
                                : index === 1
                                  ? "#28a745, #20c997"
                                  : index === 2
                                    ? "#ffc107, #fd7e14"
                                    : "#6f42c1, #6610f2"
                            })`,
                            color: "white",
                            fontSize: "10px",
                            fontWeight: "600",
                          }}
                        >
                          {region.percentage}%
                        </Badge>
                      </div>
                      <div className="d-flex justify-content-between align-items-center mb-2">
                        <small style={{ color: "#6c757d" }}>
                          {region.orders} orders
                        </small>
                        <div
                          style={{
                            fontWeight: "700",
                            color: "#28a745",
                            fontSize: "14px",
                          }}
                        >
                          {formatCurrency(region.revenue)}
                        </div>
                      </div>
                      <ProgressBar
                        now={region.percentage}
                        style={{ height: "6px", borderRadius: "3px" }}
                        variant={
                          index === 0
                            ? "danger"
                            : index === 1
                              ? "success"
                              : index === 2
                                ? "warning"
                                : "primary"
                        }
                      />
                    </div>
                  ))}
                </Card.Body>
              </Card>

              {/* Quick Actions */}
              <Card
                style={{
                  border: "none",
                  borderRadius: "16px",
                  boxShadow: "0 8px 32px rgba(0,0,0,0.08)",
                }}
              >
                <Card.Header
                  style={{
                    background: "linear-gradient(135deg, #28a745, #20c997)",
                    color: "white",
                    borderRadius: "16px 16px 0 0",
                    padding: "20px 25px",
                  }}
                >
                  <h6 className="mb-0" style={{ fontWeight: "700" }}>
                    <i className="bi bi-lightning me-2"></i>
                    Quick Analytics Actions
                  </h6>
                </Card.Header>
                <Card.Body style={{ padding: "20px" }}>
                  <div className="d-grid gap-2">
                    <EnhancedButton
                      variant="outline"
                      onClick={() => {}}
                      icon="bi bi-graph-up"
                      style={{
                        justifyContent: "flex-start",
                        padding: "12px 16px",
                      }}
                    >
                      Generate Sales Report
                    </EnhancedButton>
                    <EnhancedButton
                      variant="outline"
                      onClick={() => {}}
                      icon="bi bi-people"
                      style={{
                        justifyContent: "flex-start",
                        padding: "12px 16px",
                      }}
                    >
                      Customer Analysis
                    </EnhancedButton>
                    <EnhancedButton
                      variant="outline"
                      onClick={() => {}}
                      icon="bi bi-box-seam"
                      style={{
                        justifyContent: "flex-start",
                        padding: "12px 16px",
                      }}
                    >
                      Inventory Report
                    </EnhancedButton>
                    <EnhancedButton
                      variant="outline"
                      onClick={() => {}}
                      icon="bi bi-cash-stack"
                      style={{
                        justifyContent: "flex-start",
                        padding: "12px 16px",
                      }}
                    >
                      Revenue Breakdown
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

export default AdminAnalytics;
