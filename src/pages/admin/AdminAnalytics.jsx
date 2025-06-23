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
  Modal,
  Spinner,
  Alert,
} from "react-bootstrap";
import { Link } from "react-router-dom";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from "chart.js";
import { Line, Bar, Doughnut, Pie } from "react-chartjs-2";
import * as XLSX from "xlsx";
import jsPDF from "jspdf";

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
);

const AdminAnalytics = () => {
  const [dateRange, setDateRange] = useState("last30days");
  const [selectedMetric, setSelectedMetric] = useState("revenue");
  const [loading, setLoading] = useState(false);
  const [showReportModal, setShowReportModal] = useState(false);
  const [reportType, setReportType] = useState("");
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");

  // Mock analytics data with time series
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
    // Time series data for charts
    revenueChart: {
      labels: [
        "Jan",
        "Feb",
        "Mar",
        "Apr",
        "May",
        "Jun",
        "Jul",
        "Aug",
        "Sep",
        "Oct",
        "Nov",
        "Dec",
      ],
      datasets: [
        {
          label: "Revenue",
          data: [
            12000, 19000, 15000, 25000, 22000, 30000, 28000, 35000, 32000,
            40000, 38000, 45000,
          ],
          borderColor: "#e63946",
          backgroundColor: "rgba(230, 57, 70, 0.1)",
          tension: 0.4,
          fill: true,
        },
        {
          label: "Target",
          data: [
            15000, 20000, 18000, 28000, 25000, 32000, 30000, 38000, 35000,
            42000, 40000, 48000,
          ],
          borderColor: "#28a745",
          backgroundColor: "rgba(40, 167, 69, 0.1)",
          tension: 0.4,
          borderDash: [5, 5],
        },
      ],
    },
    ordersChart: {
      labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
      datasets: [
        {
          label: "Orders",
          data: [65, 59, 80, 81, 56, 55, 40],
          backgroundColor: [
            "#e63946",
            "#dc3545",
            "#28a745",
            "#20c997",
            "#17a2b8",
            "#6f42c1",
            "#fd7e14",
          ],
          borderColor: [
            "#e63946",
            "#dc3545",
            "#28a745",
            "#20c997",
            "#17a2b8",
            "#6f42c1",
            "#fd7e14",
          ],
          borderWidth: 1,
        },
      ],
    },
    categoryChart: {
      labels: [
        "Pain Relief",
        "Vitamins",
        "Equipment",
        "Cough & Cold",
        "First Aid",
      ],
      datasets: [
        {
          data: [35, 25, 20, 15, 5],
          backgroundColor: [
            "#e63946",
            "#28a745",
            "#17a2b8",
            "#ffc107",
            "#6f42c1",
          ],
          borderColor: ["#dc3545", "#20c997", "#138496", "#e0a800", "#6610f2"],
          borderWidth: 2,
        },
      ],
    },
    paymentMethodChart: {
      labels: ["Online Payment", "Cash on Delivery"],
      datasets: [
        {
          data: [63, 37],
          backgroundColor: ["#28a745", "#ffc107"],
          borderColor: ["#20c997", "#e0a800"],
          borderWidth: 2,
        },
      ],
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
    regionData: [
      { region: "Surat", orders: 456, revenue: 68940.5, percentage: 44.0 },
      { region: "Ahmedabad", orders: 312, revenue: 43250.25, percentage: 27.6 },
      { region: "Vadodara", orders: 198, revenue: 28750.0, percentage: 18.3 },
      { region: "Rajkot", orders: 156, revenue: 15810.0, percentage: 10.1 },
    ],
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

  // Chart options
  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "top",
        labels: {
          usePointStyle: true,
          padding: 20,
        },
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: {
          color: "rgba(0,0,0,0.05)",
        },
      },
      x: {
        grid: {
          color: "rgba(0,0,0,0.05)",
        },
      },
    },
  };

  const pieChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "bottom",
        labels: {
          usePointStyle: true,
          padding: 20,
        },
      },
    },
  };

  // Quick Actions Functions
  const handleGenerateSalesReport = () => {
    setLoading(true);
    setReportType("sales");
    setShowReportModal(true);

    // Simulate report generation
    setTimeout(() => {
      setLoading(false);
      const salesData = [
        { Month: "January", Revenue: 12000, Orders: 125, Growth: "8.5%" },
        { Month: "February", Revenue: 19000, Orders: 189, Growth: "58.3%" },
        { Month: "March", Revenue: 15000, Orders: 145, Growth: "-21.1%" },
        { Month: "April", Revenue: 25000, Orders: 234, Growth: "66.7%" },
        { Month: "May", Revenue: 22000, Orders: 201, Growth: "-12.0%" },
        { Month: "June", Revenue: 30000, Orders: 267, Growth: "36.4%" },
      ];

      const ws = XLSX.utils.json_to_sheet(salesData);
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, "Sales Report");
      XLSX.writeFile(
        wb,
        `sales-report-${new Date().toISOString().split("T")[0]}.xlsx`,
      );

      setAlertMessage("Sales report generated and downloaded successfully!");
      setShowAlert(true);
      setTimeout(() => setShowAlert(false), 3000);
    }, 2000);
  };

  const handleCustomerAnalysis = () => {
    setLoading(true);
    setReportType("customer");
    setShowReportModal(true);

    setTimeout(() => {
      setLoading(false);
      const customerData = [
        {
          Segment: "New Customers",
          Count: 124,
          Percentage: "14.5%",
          Revenue: "₹15,680",
        },
        {
          Segment: "Returning Customers",
          Count: 732,
          Percentage: "85.5%",
          Revenue: "₹141,070",
        },
        {
          Segment: "VIP Customers",
          Count: 45,
          Percentage: "5.3%",
          Revenue: "₹67,890",
        },
        {
          Segment: "At-Risk Customers",
          Count: 89,
          Percentage: "10.4%",
          Revenue: "₹12,340",
        },
      ];

      const ws = XLSX.utils.json_to_sheet(customerData);
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, "Customer Analysis");
      XLSX.writeFile(
        wb,
        `customer-analysis-${new Date().toISOString().split("T")[0]}.xlsx`,
      );

      setAlertMessage(
        "Customer analysis report generated and downloaded successfully!",
      );
      setShowAlert(true);
      setTimeout(() => setShowAlert(false), 3000);
    }, 2000);
  };

  const handleInventoryReport = () => {
    setLoading(true);
    setReportType("inventory");
    setShowReportModal(true);

    setTimeout(() => {
      setLoading(false);
      const inventoryData = [
        {
          Product: "Paracetamol Tablets",
          Stock: 1245,
          Status: "In Stock",
          Reorder: "No",
        },
        {
          Product: "Vitamin D3 Capsules",
          Stock: 5,
          Status: "Low Stock",
          Reorder: "Yes",
        },
        {
          Product: "Cough Syrup",
          Stock: 0,
          Status: "Out of Stock",
          Reorder: "Urgent",
        },
        { Product: "BP Monitor", Stock: 23, Status: "Normal", Reorder: "No" },
        {
          Product: "First Aid Kit",
          Stock: 8,
          Status: "Low Stock",
          Reorder: "Yes",
        },
      ];

      const ws = XLSX.utils.json_to_sheet(inventoryData);
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, "Inventory Report");
      XLSX.writeFile(
        wb,
        `inventory-report-${new Date().toISOString().split("T")[0]}.xlsx`,
      );

      setAlertMessage(
        "Inventory report generated and downloaded successfully!",
      );
      setShowAlert(true);
      setTimeout(() => setShowAlert(false), 3000);
    }, 2000);
  };

  const handleRevenueBreakdown = () => {
    setLoading(true);
    setReportType("revenue");
    setShowReportModal(true);

    setTimeout(() => {
      setLoading(false);
      const revenueData = [
        {
          Category: "Pain Relief",
          Revenue: 54890,
          Percentage: "35.0%",
          Profit: "₹16,467",
        },
        {
          Category: "Vitamins",
          Revenue: 39187,
          Percentage: "25.0%",
          Profit: "₹11,756",
        },
        {
          Category: "Equipment",
          Revenue: 31350,
          Percentage: "20.0%",
          Profit: "₹9,405",
        },
        {
          Category: "Cough & Cold",
          Revenue: 23512,
          Percentage: "15.0%",
          Profit: "₹7,054",
        },
        {
          Category: "Others",
          Revenue: 7811,
          Percentage: "5.0%",
          Profit: "₹2,343",
        },
      ];

      const ws = XLSX.utils.json_to_sheet(revenueData);
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, "Revenue Breakdown");
      XLSX.writeFile(
        wb,
        `revenue-breakdown-${new Date().toISOString().split("T")[0]}.xlsx`,
      );

      setAlertMessage(
        "Revenue breakdown report generated and downloaded successfully!",
      );
      setShowAlert(true);
      setTimeout(() => setShowAlert(false), 3000);
    }, 2000);
  };

  // Format currency
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
    }).format(amount);
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
          {/* Alert */}
          {showAlert && (
            <Row className="mb-4">
              <Col lg={12}>
                <Alert
                  variant="success"
                  onClose={() => setShowAlert(false)}
                  dismissible
                  style={{
                    borderRadius: "12px",
                    border: "none",
                    background: "linear-gradient(135deg, #d4edda, #c3e6cb)",
                  }}
                >
                  <i className="bi bi-check-circle me-2"></i>
                  {alertMessage}
                </Alert>
              </Col>
            </Row>
          )}

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

          {/* Charts Section */}
          <Row className="mb-5 g-4">
            {/* Revenue Chart */}
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
                    <i className="bi bi-graph-up me-2"></i>
                    Revenue Trend Analysis
                  </h5>
                </Card.Header>
                <Card.Body style={{ padding: "25px", height: "400px" }}>
                  <Line
                    data={analyticsData.revenueChart}
                    options={chartOptions}
                  />
                </Card.Body>
              </Card>
            </Col>

            {/* Orders Chart */}
            <Col lg={4}>
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
                    <i className="bi bi-bar-chart me-2"></i>
                    Weekly Orders
                  </h6>
                </Card.Header>
                <Card.Body style={{ padding: "25px", height: "400px" }}>
                  <Bar
                    data={analyticsData.ordersChart}
                    options={chartOptions}
                  />
                </Card.Body>
              </Card>
            </Col>
          </Row>

          {/* Secondary Charts */}
          <Row className="mb-5 g-4">
            {/* Category Distribution */}
            <Col lg={6}>
              <Card
                style={{
                  border: "none",
                  borderRadius: "16px",
                  boxShadow: "0 8px 32px rgba(0,0,0,0.08)",
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
                    <i className="bi bi-pie-chart me-2"></i>
                    Sales by Category
                  </h6>
                </Card.Header>
                <Card.Body style={{ padding: "25px", height: "350px" }}>
                  <Doughnut
                    data={analyticsData.categoryChart}
                    options={pieChartOptions}
                  />
                </Card.Body>
              </Card>
            </Col>

            {/* Payment Methods */}
            <Col lg={6}>
              <Card
                style={{
                  border: "none",
                  borderRadius: "16px",
                  boxShadow: "0 8px 32px rgba(0,0,0,0.08)",
                }}
              >
                <Card.Header
                  style={{
                    background: "linear-gradient(135deg, #17a2b8, #20c997)",
                    color: "white",
                    borderRadius: "16px 16px 0 0",
                    padding: "20px 25px",
                  }}
                >
                  <h6 className="mb-0" style={{ fontWeight: "700" }}>
                    <i className="bi bi-credit-card me-2"></i>
                    Payment Methods
                  </h6>
                </Card.Header>
                <Card.Body style={{ padding: "25px", height: "350px" }}>
                  <Pie
                    data={analyticsData.paymentMethodChart}
                    options={pieChartOptions}
                  />
                </Card.Body>
              </Card>
            </Col>
          </Row>

          {/* Analytics Tables and Actions */}
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

            {/* Quick Actions */}
            <Col lg={4}>
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
                  <div className="d-grid gap-3">
                    <EnhancedButton
                      variant="outline"
                      onClick={handleGenerateSalesReport}
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
                      onClick={handleCustomerAnalysis}
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
                      onClick={handleInventoryReport}
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
                      onClick={handleRevenueBreakdown}
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

      {/* Report Generation Modal */}
      <Modal
        show={showReportModal}
        onHide={() => setShowReportModal(false)}
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>
            <i className="bi bi-file-earmark-text me-2"></i>
            Generating Report
          </Modal.Title>
        </Modal.Header>
        <Modal.Body className="text-center py-4">
          {loading ? (
            <>
              <Spinner
                animation="border"
                variant="primary"
                style={{ width: "3rem", height: "3rem" }}
              />
              <h5 className="mt-3">Generating {reportType} report...</h5>
              <p className="text-muted">
                Please wait while we compile your data
              </p>
            </>
          ) : (
            <>
              <div
                style={{
                  width: "60px",
                  height: "60px",
                  background: "linear-gradient(135deg, #28a745, #20c997)",
                  borderRadius: "50%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  margin: "0 auto 20px",
                }}
              >
                <i
                  className="bi bi-check-lg"
                  style={{ fontSize: "24px", color: "white" }}
                ></i>
              </div>
              <h5>Report Generated Successfully!</h5>
              <p className="text-muted">
                Your report has been downloaded to your device
              </p>
            </>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowReportModal(false)}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default AdminAnalytics;
