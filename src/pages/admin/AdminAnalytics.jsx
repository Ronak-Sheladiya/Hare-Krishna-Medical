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
import { api, safeApiCall } from "../../utils/apiClient";
import {
  PageHeroSection,
  ThemeCard,
  ThemeButton,
  StatsCard,
} from "../../components/common/ConsistentTheme";

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
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Real-time data state
  const [analyticsData, setAnalyticsData] = useState({
    stats: {
      totalRevenue: 0,
      totalOrders: 0,
      totalUsers: 0,
      totalProducts: 0,
      averageOrderValue: 0,
      conversionRate: 0,
    },
    charts: {
      revenue: { labels: [], data: [] },
      orders: { labels: [], data: [] },
      users: { labels: [], data: [] },
      products: { labels: [], data: [] },
    },
    topProducts: [],
    recentOrders: [],
    userGrowth: [],
    paymentMethods: [],
  });

  // Fetch analytics data
  const fetchAnalyticsData = async () => {
    setLoading(true);
    setError(null);

    try {
      // Fetch overview stats
      const { success: statsSuccess, data: statsData } = await safeApiCall(
        () => api.get(`/api/admin/analytics/stats?dateRange=${dateRange}`),
        { stats: analyticsData.stats },
      );

      // Fetch chart data
      const { success: chartsSuccess, data: chartsData } = await safeApiCall(
        () =>
          api.get(
            `/api/admin/analytics/charts?dateRange=${dateRange}&metric=${selectedMetric}`,
          ),
        { charts: analyticsData.charts },
      );

      // Fetch top products
      const { success: productsSuccess, data: productsData } =
        await safeApiCall(
          () =>
            api.get(`/api/admin/analytics/top-products?dateRange=${dateRange}`),
          [],
        );

      // Fetch recent orders
      const { success: ordersSuccess, data: ordersData } = await safeApiCall(
        () => api.get(`/api/admin/analytics/recent-orders?limit=10`),
        [],
      );

      // Fetch user growth data
      const { success: usersSuccess, data: usersData } = await safeApiCall(
        () =>
          api.get(`/api/admin/analytics/user-growth?dateRange=${dateRange}`),
        [],
      );

      // Fetch payment methods distribution
      const { success: paymentsSuccess, data: paymentsData } =
        await safeApiCall(
          () =>
            api.get(
              `/api/admin/analytics/payment-methods?dateRange=${dateRange}`,
            ),
          [],
        );

      // Update state with fetched data
      setAnalyticsData({
        stats: statsSuccess ? statsData.data || statsData : analyticsData.stats,
        charts: chartsSuccess
          ? chartsData.data || chartsData
          : analyticsData.charts,
        topProducts: productsSuccess ? productsData.data || productsData : [],
        recentOrders: ordersSuccess ? ordersData.data || ordersData : [],
        userGrowth: usersSuccess ? usersData.data || usersData : [],
        paymentMethods: paymentsSuccess
          ? paymentsData.data || paymentsData
          : [],
      });
    } catch (err) {
      console.error("Error fetching analytics data:", err);
      setError("Failed to load analytics data. Showing offline mode.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnalyticsData();
  }, [dateRange, selectedMetric]);

  // Chart configurations
  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: "top",
      },
      title: {
        display: true,
        text: `${selectedMetric.charAt(0).toUpperCase() + selectedMetric.slice(1)} Analytics`,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
      },
    },
  };

  const lineChartData = {
    labels: analyticsData.charts[selectedMetric]?.labels || [],
    datasets: [
      {
        label: selectedMetric.charAt(0).toUpperCase() + selectedMetric.slice(1),
        data: analyticsData.charts[selectedMetric]?.data || [],
        borderColor: "#e63946",
        backgroundColor: "rgba(230, 57, 70, 0.1)",
        tension: 0.1,
      },
    ],
  };

  const doughnutChartData = {
    labels: analyticsData.paymentMethods.map((pm) => pm.method) || [],
    datasets: [
      {
        data: analyticsData.paymentMethods.map((pm) => pm.count) || [],
        backgroundColor: [
          "#e63946",
          "#f77f00",
          "#fcbf49",
          "#90e0ef",
          "#0077b6",
        ],
      },
    ],
  };

  const exportToExcel = () => {
    const ws = XLSX.utils.json_to_sheet([
      {
        "Total Revenue": `₹${analyticsData.stats.totalRevenue}`,
        "Total Orders": analyticsData.stats.totalOrders,
        "Total Users": analyticsData.stats.totalUsers,
        "Total Products": analyticsData.stats.totalProducts,
        "Average Order Value": `₹${analyticsData.stats.averageOrderValue}`,
        "Conversion Rate": `${analyticsData.stats.conversionRate}%`,
      },
    ]);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Analytics");
    XLSX.writeFile(wb, `analytics-${dateRange}.xlsx`);
  };

  const exportToPDF = () => {
    const pdf = new jsPDF();
    pdf.text("Analytics Report", 20, 20);
    pdf.text(`Date Range: ${dateRange}`, 20, 40);
    pdf.text(`Total Revenue: ₹${analyticsData.stats.totalRevenue}`, 20, 60);
    pdf.text(`Total Orders: ${analyticsData.stats.totalOrders}`, 20, 80);
    pdf.text(`Total Users: ${analyticsData.stats.totalUsers}`, 20, 100);
    pdf.text(`Total Products: ${analyticsData.stats.totalProducts}`, 20, 120);
    pdf.save(`analytics-${dateRange}.pdf`);
  };

  if (loading) {
    return (
      <div
        className="d-flex justify-content-center align-items-center"
        style={{ minHeight: "60vh" }}
      >
        <Spinner animation="border" variant="danger" />
        <span className="ms-2">Loading analytics data...</span>
      </div>
    );
  }

  return (
    <div className="fade-in">
      <PageHeroSection
        title="Analytics Dashboard"
        description="Comprehensive business insights and data analytics"
        icon={<i className="bi bi-graph-up"></i>}
      />

      <Container className="py-5">
        {error && (
          <Alert variant="warning" className="mb-4">
            <Alert.Heading>Offline Mode</Alert.Heading>
            <p>{error}</p>
            <ThemeButton variant="outline" onClick={fetchAnalyticsData}>
              Try Again
            </ThemeButton>
          </Alert>
        )}

        {/* Controls */}
        <Row className="mb-4">
          <Col md={6}>
            <Form.Select
              value={dateRange}
              onChange={(e) => setDateRange(e.target.value)}
              className="mb-3"
            >
              <option value="last7days">Last 7 Days</option>
              <option value="last30days">Last 30 Days</option>
              <option value="last90days">Last 90 Days</option>
              <option value="last365days">Last Year</option>
            </Form.Select>
          </Col>
          <Col md={6}>
            <Form.Select
              value={selectedMetric}
              onChange={(e) => setSelectedMetric(e.target.value)}
              className="mb-3"
            >
              <option value="revenue">Revenue</option>
              <option value="orders">Orders</option>
              <option value="users">Users</option>
              <option value="products">Products</option>
            </Form.Select>
          </Col>
        </Row>

        {/* Stats Cards */}
        <Row className="mb-4">
          <Col md={4} className="mb-3">
            <StatsCard
              icon="💰"
              title="Total Revenue"
              value={`₹${analyticsData.stats.totalRevenue?.toLocaleString() || "0"}`}
              color="#e63946"
            />
          </Col>
          <Col md={4} className="mb-3">
            <StatsCard
              icon="📦"
              title="Total Orders"
              value={analyticsData.stats.totalOrders?.toLocaleString() || "0"}
              color="#f77f00"
            />
          </Col>
          <Col md={4} className="mb-3">
            <StatsCard
              icon="👥"
              title="Total Users"
              value={analyticsData.stats.totalUsers?.toLocaleString() || "0"}
              color="#90e0ef"
            />
          </Col>
        </Row>

        <Row className="mb-4">
          <Col md={4} className="mb-3">
            <StatsCard
              icon="🏷️"
              title="Total Products"
              value={analyticsData.stats.totalProducts?.toLocaleString() || "0"}
              color="#fcbf49"
            />
          </Col>
          <Col md={4} className="mb-3">
            <StatsCard
              icon="💳"
              title="Avg Order Value"
              value={`₹${analyticsData.stats.averageOrderValue?.toLocaleString() || "0"}`}
              color="#0077b6"
            />
          </Col>
          <Col md={4} className="mb-3">
            <StatsCard
              icon="📈"
              title="Conversion Rate"
              value={`${analyticsData.stats.conversionRate || "0"}%`}
              color="#38b000"
            />
          </Col>
        </Row>

        {/* Charts */}
        <Row className="mb-5">
          <Col lg={8}>
            <ThemeCard>
              <Card.Header className="bg-gradient text-white">
                <h5 className="mb-0">
                  {selectedMetric.charAt(0).toUpperCase() +
                    selectedMetric.slice(1)}{" "}
                  Trend
                </h5>
              </Card.Header>
              <Card.Body>
                <Line data={lineChartData} options={chartOptions} />
              </Card.Body>
            </ThemeCard>
          </Col>
          <Col lg={4}>
            <ThemeCard>
              <Card.Header className="bg-gradient text-white">
                <h5 className="mb-0">Payment Methods</h5>
              </Card.Header>
              <Card.Body>
                {analyticsData.paymentMethods.length > 0 ? (
                  <Doughnut data={doughnutChartData} />
                ) : (
                  <p className="text-muted text-center">
                    No payment data available
                  </p>
                )}
              </Card.Body>
            </ThemeCard>
          </Col>
        </Row>

        {/* Top Products and Recent Orders */}
        <Row className="mb-5">
          <Col lg={6}>
            <ThemeCard>
              <Card.Header className="bg-gradient text-white">
                <h5 className="mb-0">Top Selling Products</h5>
              </Card.Header>
              <Card.Body>
                {analyticsData.topProducts.length > 0 ? (
                  <Table responsive>
                    <thead>
                      <tr>
                        <th>Product</th>
                        <th>Sales</th>
                        <th>Revenue</th>
                      </tr>
                    </thead>
                    <tbody>
                      {analyticsData.topProducts.map((product, index) => (
                        <tr key={index}>
                          <td>{product.name}</td>
                          <td>{product.sales}</td>
                          <td>₹{product.revenue?.toLocaleString()}</td>
                        </tr>
                      ))}
                    </tbody>
                  </Table>
                ) : (
                  <p className="text-muted text-center">
                    No products data available
                  </p>
                )}
              </Card.Body>
            </ThemeCard>
          </Col>
          <Col lg={6}>
            <ThemeCard>
              <Card.Header className="bg-gradient text-white">
                <h5 className="mb-0">Recent Orders</h5>
              </Card.Header>
              <Card.Body>
                {analyticsData.recentOrders.length > 0 ? (
                  <Table responsive>
                    <thead>
                      <tr>
                        <th>Order ID</th>
                        <th>Customer</th>
                        <th>Amount</th>
                        <th>Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {analyticsData.recentOrders.map((order, index) => (
                        <tr key={index}>
                          <td>{order.orderId || order._id}</td>
                          <td>{order.customerName}</td>
                          <td>₹{order.totalAmount?.toLocaleString()}</td>
                          <td>
                            <Badge
                              bg={
                                order.status === "Delivered"
                                  ? "success"
                                  : order.status === "Processing"
                                    ? "warning"
                                    : "info"
                              }
                            >
                              {order.status}
                            </Badge>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </Table>
                ) : (
                  <p className="text-muted text-center">
                    No recent orders available
                  </p>
                )}
              </Card.Body>
            </ThemeCard>
          </Col>
        </Row>

        {/* Export Options */}
        <Row>
          <Col>
            <ThemeCard>
              <Card.Header className="bg-gradient text-white">
                <h5 className="mb-0">Export Analytics</h5>
              </Card.Header>
              <Card.Body>
                <div className="d-flex gap-2 flex-wrap">
                  <ThemeButton onClick={exportToExcel}>
                    <i className="bi bi-file-earmark-excel me-2"></i>
                    Export to Excel
                  </ThemeButton>
                  <ThemeButton variant="outline" onClick={exportToPDF}>
                    📄 Export to PDF
                  </ThemeButton>
                  <ThemeButton variant="outline" onClick={fetchAnalyticsData}>
                    <i className="bi bi-arrow-clockwise me-2"></i>
                    Refresh Data
                  </ThemeButton>
                </div>
              </Card.Body>
            </ThemeCard>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default AdminAnalytics;
