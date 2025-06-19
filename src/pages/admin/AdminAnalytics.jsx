import React, { useState } from "react";
import {
  Container,
  Row,
  Col,
  Card,
  Form,
  Button,
  Badge,
  ButtonGroup,
} from "react-bootstrap";
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

const AdminAnalytics = () => {
  const [dateRange, setDateRange] = useState("30");
  const [activeView, setActiveView] = useState("overview");
  const [chartType, setChartType] = useState("line");

  // Mock analytics data
  const salesData = {
    totalRevenue: 45670.5,
    totalOrders: 156,
    totalProducts: 45,
    totalCustomers: 1234,
    avgOrderValue: 292.76,
    conversionRate: 3.2,
    repeatCustomerRate: 24.5,
    monthlyGrowth: 12.5,
  };

  // Sample data for charts
  const monthlyRevenueData = [
    { month: "Jan", revenue: 12000, orders: 45, customers: 120 },
    { month: "Feb", revenue: 15500, orders: 52, customers: 145 },
    { month: "Mar", revenue: 18200, orders: 68, customers: 165 },
    { month: "Apr", revenue: 22100, orders: 72, customers: 180 },
    { month: "May", revenue: 25800, orders: 85, customers: 200 },
    { month: "Jun", revenue: 28900, orders: 95, customers: 220 },
    { month: "Jul", revenue: 32400, orders: 108, customers: 245 },
    { month: "Aug", revenue: 35600, orders: 125, customers: 270 },
    { month: "Sep", revenue: 38900, orders: 138, customers: 295 },
    { month: "Oct", revenue: 42100, orders: 148, customers: 315 },
    { month: "Nov", revenue: 45200, orders: 156, customers: 340 },
    { month: "Dec", revenue: 48500, orders: 165, customers: 365 },
  ];

  const categoryData = [
    { name: "Pain Relief", value: 35, revenue: 15680.5, color: "#DC3545" },
    { name: "Vitamins", value: 28, revenue: 18750.25, color: "#198754" },
    { name: "Medical Devices", value: 20, revenue: 78450.0, color: "#0D6EFD" },
    { name: "Cough & Cold", value: 12, revenue: 12890.75, color: "#FFC107" },
    { name: "First Aid", value: 5, revenue: 8945.5, color: "#6C757D" },
  ];

  const paymentStatusData = [
    { name: "Paid", value: 85, count: 132, color: "#198754" },
    { name: "Unpaid (COD)", value: 12, count: 19, color: "#FFC107" },
    { name: "Partial", value: 3, count: 5, color: "#DC3545" },
  ];

  const weeklyOrdersData = [
    { day: "Mon", orders: 12, revenue: 3200 },
    { day: "Tue", orders: 18, revenue: 4800 },
    { day: "Wed", orders: 15, revenue: 3900 },
    { day: "Thu", orders: 22, revenue: 5800 },
    { day: "Fri", orders: 25, revenue: 6700 },
    { day: "Sat", reviews: 28, revenue: 7500 },
    { day: "Sun", orders: 20, revenue: 5200 },
  ];

  const productPerformanceData = [
    { name: "Paracetamol", sales: 450, revenue: 11697.5, profit: 4500 },
    { name: "Vitamin D3", sales: 287, revenue: 13058.5, profit: 5200 },
    { name: "BP Monitor", sales: 45, revenue: 58499.55, profit: 15000 },
    { name: "Cough Syrup", sales: 234, revenue: 8365.5, profit: 3200 },
    { name: "Antiseptic", sales: 189, revenue: 5292.0, profit: 2100 },
  ];

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 border rounded shadow">
          <p className="fw-bold mb-2">{label}</p>
          {payload.map((entry, index) => (
            <p key={index} style={{ color: entry.color }} className="mb-1">
              {entry.dataKey}: {entry.dataKey.includes("revenue") ? "₹" : ""}
              {entry.value.toLocaleString()}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  const renderChart = () => {
    switch (activeView) {
      case "revenue":
        return (
          <ResponsiveContainer width="100%" height={400}>
            {chartType === "line" ? (
              <LineChart data={monthlyRevenueData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip content={<CustomTooltip />} />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="revenue"
                  stroke="#DC3545"
                  strokeWidth={3}
                  dot={{ fill: "#DC3545", strokeWidth: 2, r: 6 }}
                />
              </LineChart>
            ) : chartType === "area" ? (
              <AreaChart data={monthlyRevenueData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip content={<CustomTooltip />} />
                <Legend />
                <Area
                  type="monotone"
                  dataKey="revenue"
                  stroke="#DC3545"
                  fill="#DC3545"
                  fillOpacity={0.3}
                />
              </AreaChart>
            ) : (
              <BarChart data={monthlyRevenueData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip content={<CustomTooltip />} />
                <Legend />
                <Bar dataKey="revenue" fill="#DC3545" />
              </BarChart>
            )}
          </ResponsiveContainer>
        );

      case "orders":
        return (
          <ResponsiveContainer width="100%" height={400}>
            <BarChart data={weeklyOrdersData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="day" />
              <YAxis />
              <Tooltip content={<CustomTooltip />} />
              <Legend />
              <Bar dataKey="orders" fill="#0D6EFD" />
            </BarChart>
          </ResponsiveContainer>
        );

      case "categories":
        return (
          <ResponsiveContainer width="100%" height={400}>
            <PieChart>
              <Pie
                data={categoryData}
                cx="50%"
                cy="50%"
                outerRadius={120}
                dataKey="value"
                label={({ name, value }) => `${name}: ${value}%`}
              >
                {categoryData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        );

      case "payments":
        return (
          <Row>
            <Col md={6}>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={paymentStatusData}
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    dataKey="value"
                    label={({ name, value }) => `${name}: ${value}%`}
                  >
                    {paymentStatusData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </Col>
            <Col md={6}>
              <div className="mt-4">
                <h6>Payment Status Details</h6>
                {paymentStatusData.map((item, index) => (
                  <div
                    key={index}
                    className="d-flex justify-content-between align-items-center mb-3"
                  >
                    <div className="d-flex align-items-center">
                      <div
                        className="me-2"
                        style={{
                          width: "20px",
                          height: "20px",
                          backgroundColor: item.color,
                          borderRadius: "50%",
                        }}
                      ></div>
                      <span>{item.name}</span>
                    </div>
                    <div className="text-end">
                      <div className="fw-bold">{item.count} orders</div>
                      <small className="text-muted">{item.value}%</small>
                    </div>
                  </div>
                ))}
                <div className="mt-4 p-3 bg-light rounded">
                  <h6>Payment Notes:</h6>
                  <ul className="small mb-0">
                    <li>
                      <strong>Paid:</strong> Orders with complete payment
                      received
                    </li>
                    <li>
                      <strong>Unpaid (COD):</strong> Cash on Delivery orders -
                      payment pending
                    </li>
                    <li>
                      <strong>Partial:</strong> Orders with partial payment
                      received
                    </li>
                  </ul>
                </div>
              </div>
            </Col>
          </Row>
        );

      case "products":
        return (
          <ResponsiveContainer width="100%" height={400}>
            <BarChart data={productPerformanceData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip content={<CustomTooltip />} />
              <Legend />
              <Bar dataKey="sales" fill="#0D6EFD" name="Sales" />
              <Bar dataKey="profit" fill="#198754" name="Profit (₹)" />
            </BarChart>
          </ResponsiveContainer>
        );

      default:
        return (
          <ResponsiveContainer width="100%" height={400}>
            <LineChart data={monthlyRevenueData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip content={<CustomTooltip />} />
              <Legend />
              <Line
                type="monotone"
                dataKey="revenue"
                stroke="#DC3545"
                strokeWidth={3}
                name="Revenue (₹)"
              />
              <Line
                type="monotone"
                dataKey="orders"
                stroke="#0D6EFD"
                strokeWidth={3}
                name="Orders"
              />
              <Line
                type="monotone"
                dataKey="customers"
                stroke="#198754"
                strokeWidth={3}
                name="Customers"
              />
            </LineChart>
          </ResponsiveContainer>
        );
    }
  };

  const viewOptions = [
    { key: "overview", label: "Overview", icon: "bi-graph-up" },
    { key: "revenue", label: "Revenue", icon: "bi-currency-rupee" },
    { key: "orders", label: "Orders", icon: "bi-bag" },
    { key: "categories", label: "Categories", icon: "bi-pie-chart" },
    { key: "payments", label: "Payments", icon: "bi-credit-card" },
    { key: "products", label: "Products", icon: "bi-box" },
  ];

  const chartTypes = [
    { key: "line", label: "Line", icon: "bi-graph-up" },
    { key: "area", label: "Area", icon: "bi-bar-chart" },
    { key: "bar", label: "Bar", icon: "bi-bar-chart-fill" },
  ];

  return (
    <div className="fade-in">
      <section className="section-padding-sm">
        <Container>
          {/* Header */}
          <Row className="mb-4">
            <Col lg={12}>
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <h2>Advanced Analytics</h2>
                  <p className="text-muted">
                    Comprehensive data analysis with interactive charts
                  </p>
                </div>
                <div className="d-flex gap-2">
                  <Form.Select
                    value={dateRange}
                    onChange={(e) => setDateRange(e.target.value)}
                    style={{ minWidth: "150px" }}
                  >
                    <option value="7">Last 7 days</option>
                    <option value="30">Last 30 days</option>
                    <option value="90">Last 3 months</option>
                    <option value="365">Last year</option>
                  </Form.Select>
                </div>
              </div>
            </Col>
          </Row>

          {/* Key Metrics */}
          <Row className="mb-4">
            <Col lg={3} md={6} className="mb-4">
              <Card className="medical-card h-100">
                <Card.Body>
                  <div className="d-flex justify-content-between align-items-start">
                    <div>
                      <h3 className="text-success">
                        ₹{salesData.totalRevenue.toLocaleString()}
                      </h3>
                      <p className="text-muted mb-0">Total Revenue</p>
                      <small className="text-success">
                        <i className="bi bi-arrow-up"></i> +
                        {salesData.monthlyGrowth}% growth
                      </small>
                    </div>
                    <div className="bg-success text-white rounded-circle p-3">
                      <i className="bi bi-currency-rupee fs-4"></i>
                    </div>
                  </div>
                </Card.Body>
              </Card>
            </Col>

            <Col lg={3} md={6} className="mb-4">
              <Card className="medical-card h-100">
                <Card.Body>
                  <div className="d-flex justify-content-between align-items-start">
                    <div>
                      <h3 className="text-medical-blue">
                        {salesData.totalOrders}
                      </h3>
                      <p className="text-muted mb-0">Total Orders</p>
                      <small className="text-success">
                        <i className="bi bi-arrow-up"></i> +8.2% from last month
                      </small>
                    </div>
                    <div className="bg-medical-blue text-white rounded-circle p-3">
                      <i className="bi bi-bag-check fs-4"></i>
                    </div>
                  </div>
                </Card.Body>
              </Card>
            </Col>

            <Col lg={3} md={6} className="mb-4">
              <Card className="medical-card h-100">
                <Card.Body>
                  <div className="d-flex justify-content-between align-items-start">
                    <div>
                      <h3 className="text-medical-red">
                        ₹{salesData.avgOrderValue}
                      </h3>
                      <p className="text-muted mb-0">Avg Order Value</p>
                      <small className="text-success">
                        <i className="bi bi-arrow-up"></i> +5.1% improvement
                      </small>
                    </div>
                    <div className="bg-medical-red text-white rounded-circle p-3">
                      <i className="bi bi-graph-up fs-4"></i>
                    </div>
                  </div>
                </Card.Body>
              </Card>
            </Col>

            <Col lg={3} md={6} className="mb-4">
              <Card className="medical-card h-100">
                <Card.Body>
                  <div className="d-flex justify-content-between align-items-start">
                    <div>
                      <h3 className="text-warning">
                        {salesData.conversionRate}%
                      </h3>
                      <p className="text-muted mb-0">Conversion Rate</p>
                      <small className="text-success">
                        <i className="bi bi-arrow-up"></i> +1.8% this month
                      </small>
                    </div>
                    <div className="bg-warning text-white rounded-circle p-3">
                      <i className="bi bi-percent fs-4"></i>
                    </div>
                  </div>
                </Card.Body>
              </Card>
            </Col>
          </Row>

          {/* Analytics Controls */}
          <Row className="mb-4">
            <Col lg={8}>
              <Card className="medical-card">
                <Card.Header className="bg-medical-light">
                  <div className="d-flex justify-content-between align-items-center">
                    <h5 className="mb-0">
                      <i className="bi bi-graph-up me-2"></i>
                      Analytics Dashboard
                    </h5>
                    <div className="d-flex gap-2">
                      {/* Chart Type Toggle */}
                      {(activeView === "revenue" ||
                        activeView === "overview") && (
                        <ButtonGroup size="sm">
                          {chartTypes.map((type) => (
                            <Button
                              key={type.key}
                              variant={
                                chartType === type.key
                                  ? "primary"
                                  : "outline-secondary"
                              }
                              onClick={() => setChartType(type.key)}
                              className={
                                chartType === type.key
                                  ? "btn-medical-primary"
                                  : "btn-medical-outline"
                              }
                            >
                              <i className={`${type.icon} me-1`}></i>
                              {type.label}
                            </Button>
                          ))}
                        </ButtonGroup>
                      )}
                    </div>
                  </div>
                </Card.Header>
                <Card.Body>{renderChart()}</Card.Body>
              </Card>
            </Col>

            <Col lg={4}>
              <Card className="medical-card h-100">
                <Card.Header className="bg-medical-light">
                  <h5 className="mb-0">
                    <i className="bi bi-toggles me-2"></i>
                    View Options
                  </h5>
                </Card.Header>
                <Card.Body>
                  <div className="d-grid gap-2">
                    {viewOptions.map((option) => (
                      <Button
                        key={option.key}
                        variant={
                          activeView === option.key
                            ? "primary"
                            : "outline-secondary"
                        }
                        onClick={() => setActiveView(option.key)}
                        className={`text-start ${
                          activeView === option.key
                            ? "btn-medical-primary"
                            : "btn-medical-outline"
                        }`}
                      >
                        <i className={`${option.icon} me-2`}></i>
                        {option.label}
                        {activeView === option.key && (
                          <Badge bg="light" text="dark" className="ms-2">
                            Active
                          </Badge>
                        )}
                      </Button>
                    ))}
                  </div>

                  <div className="mt-4 p-3 bg-light rounded">
                    <h6 className="mb-3">Current View Info:</h6>
                    <p className="small mb-0">
                      {activeView === "overview" &&
                        "Complete business overview with all key metrics"}
                      {activeView === "revenue" &&
                        "Detailed revenue analysis over time"}
                      {activeView === "orders" && "Order patterns and trends"}
                      {activeView === "categories" &&
                        "Product category performance breakdown"}
                      {activeView === "payments" &&
                        "Payment status and method analysis"}
                      {activeView === "products" &&
                        "Individual product performance metrics"}
                    </p>
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
