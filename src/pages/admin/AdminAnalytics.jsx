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
  Table,
  Tab,
  Nav,
  Spinner,
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
import * as XLSX from "xlsx";
import html2canvas from "html2canvas";

const AdminAnalytics = () => {
  const [dateRange, setDateRange] = useState("30");
  const [activeView, setActiveView] = useState("overview");
  const [chartType, setChartType] = useState("line");
  const [viewMode, setViewMode] = useState("chart"); // 'chart' or 'table'
  const [exportLoading, setExportLoading] = useState(false);

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
    { day: "Sat", orders: 28, revenue: 7500 },
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

  const renderTable = () => {
    switch (activeView) {
      case "revenue":
        return (
          <Table striped bordered hover responsive>
            <thead>
              <tr>
                <th>Month</th>
                <th>Revenue (₹)</th>
                <th>Orders</th>
                <th>Customers</th>
                <th>Avg Order Value (₹)</th>
              </tr>
            </thead>
            <tbody>
              {monthlyRevenueData.map((item, index) => (
                <tr key={index}>
                  <td>{item.month}</td>
                  <td>₹{item.revenue.toLocaleString()}</td>
                  <td>{item.orders}</td>
                  <td>{item.customers}</td>
                  <td>₹{(item.revenue / item.orders).toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </Table>
        );

      case "orders":
        return (
          <Table striped bordered hover responsive>
            <thead>
              <tr>
                <th>Day</th>
                <th>Orders</th>
                <th>Revenue (₹)</th>
                <th>Avg Order Value (₹)</th>
              </tr>
            </thead>
            <tbody>
              {weeklyOrdersData.map((item, index) => (
                <tr key={index}>
                  <td>{item.day}</td>
                  <td>{item.orders}</td>
                  <td>₹{item.revenue.toLocaleString()}</td>
                  <td>₹{(item.revenue / item.orders).toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </Table>
        );

      case "categories":
        return (
          <Table striped bordered hover responsive>
            <thead>
              <tr>
                <th>Category</th>
                <th>Percentage (%)</th>
                <th>Revenue (₹)</th>
                <th>Growth</th>
              </tr>
            </thead>
            <tbody>
              {categoryData.map((item, index) => (
                <tr key={index}>
                  <td>
                    <div className="d-flex align-items-center">
                      <div
                        className="me-2"
                        style={{
                          width: "16px",
                          height: "16px",
                          backgroundColor: item.color,
                          borderRadius: "50%",
                        }}
                      ></div>
                      {item.name}
                    </div>
                  </td>
                  <td>{item.value}%</td>
                  <td>₹{item.revenue.toLocaleString()}</td>
                  <td>
                    <Badge bg="success">
                      +{(Math.random() * 10 + 5).toFixed(1)}%
                    </Badge>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        );

      case "payments":
        return (
          <Table striped bordered hover responsive>
            <thead>
              <tr>
                <th>Payment Status</th>
                <th>Count</th>
                <th>Percentage (%)</th>
                <th>Amount (₹)</th>
                <th>Notes</th>
              </tr>
            </thead>
            <tbody>
              {paymentStatusData.map((item, index) => (
                <tr key={index}>
                  <td>
                    <div className="d-flex align-items-center">
                      <div
                        className="me-2"
                        style={{
                          width: "16px",
                          height: "16px",
                          backgroundColor: item.color,
                          borderRadius: "50%",
                        }}
                      ></div>
                      {item.name}
                    </div>
                  </td>
                  <td>{item.count}</td>
                  <td>{item.value}%</td>
                  <td>₹{(item.count * 293).toLocaleString()}</td>
                  <td>
                    {item.name === "Paid" && "Complete payment received"}
                    {item.name === "Unpaid (COD)" && "Cash on delivery orders"}
                    {item.name === "Partial" && "Partial payment received"}
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        );

      case "products":
        return (
          <Table striped bordered hover responsive>
            <thead>
              <tr>
                <th>Product</th>
                <th>Sales</th>
                <th>Revenue (₹)</th>
                <th>Profit (₹)</th>
                <th>Profit Margin (%)</th>
              </tr>
            </thead>
            <tbody>
              {productPerformanceData.map((item, index) => (
                <tr key={index}>
                  <td>{item.name}</td>
                  <td>{item.sales}</td>
                  <td>₹{item.revenue.toLocaleString()}</td>
                  <td>₹{item.profit.toLocaleString()}</td>
                  <td>
                    <Badge
                      bg={
                        (item.profit / item.revenue) * 100 > 30
                          ? "success"
                          : "warning"
                      }
                    >
                      {((item.profit / item.revenue) * 100).toFixed(1)}%
                    </Badge>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        );

      default:
        return (
          <Table striped bordered hover responsive>
            <thead>
              <tr>
                <th>Month</th>
                <th>Revenue (₹)</th>
                <th>Orders</th>
                <th>Customers</th>
                <th>Growth (%)</th>
              </tr>
            </thead>
            <tbody>
              {monthlyRevenueData.map((item, index) => (
                <tr key={index}>
                  <td>{item.month}</td>
                  <td>₹{item.revenue.toLocaleString()}</td>
                  <td>{item.orders}</td>
                  <td>{item.customers}</td>
                  <td>
                    <Badge bg="success">
                      +
                      {index === 0
                        ? "0"
                        : (
                            (item.revenue /
                              monthlyRevenueData[index - 1].revenue -
                              1) *
                            100
                          ).toFixed(1)}
                      %
                    </Badge>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
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

  const handleExportAnalytics = async () => {
    setExportLoading(true);

    try {
      // Create workbook
      const workbook = XLSX.utils.book_new();

      // 1. Summary Sheet
      const summaryData = [
        { Metric: "Total Revenue", Value: `₹${salesData.totalRevenue.toLocaleString()}`, Growth: `+${salesData.monthlyGrowth}%` },
        { Metric: "Total Orders", Value: salesData.totalOrders, Growth: "+8.2%" },
        { Metric: "Total Products", Value: salesData.totalProducts, Growth: "+2.1%" },
        { Metric: "Total Customers", Value: salesData.totalCustomers, Growth: "+15.3%" },
        { Metric: "Average Order Value", Value: `₹${salesData.avgOrderValue}`, Growth: "+5.1%" },
        { Metric: "Conversion Rate", Value: `${salesData.conversionRate}%`, Growth: "+1.8%" },
        { Metric: "Repeat Customer Rate", Value: `${salesData.repeatCustomerRate}%`, Growth: "+3.2%" },
      ];
      const summarySheet = XLSX.utils.json_to_sheet(summaryData);
      XLSX.utils.book_append_sheet(workbook, summarySheet, "Summary");

      // 2. Monthly Revenue Data
      const revenueData = monthlyRevenueData.map(item => ({
        Month: item.month,
        Revenue: item.revenue,
        Orders: item.orders,
        Customers: item.customers,
        "Avg Order Value": (item.revenue / item.orders).toFixed(2),
        "Growth %": item.month === "Jan" ? "0%" : `+${((item.revenue / monthlyRevenueData[monthlyRevenueData.indexOf(item) - 1]?.revenue || 1) - 1) * 100).toFixed(1)}%`
      }));
      const revenueSheet = XLSX.utils.json_to_sheet(revenueData);
      XLSX.utils.book_append_sheet(workbook, revenueSheet, "Monthly Revenue");

      // 3. Category Performance
      const categoryExportData = categoryData.map(item => ({
        Category: item.name,
        "Market Share %": item.value,
        Revenue: item.revenue,
        "Revenue ₹": `₹${item.revenue.toLocaleString()}`,
        Color: item.color
      }));
      const categorySheet = XLSX.utils.json_to_sheet(categoryExportData);
      XLSX.utils.book_append_sheet(workbook, categorySheet, "Category Performance");

      // 4. Payment Status Analysis
      const paymentExportData = paymentStatusData.map(item => ({
        "Payment Status": item.name,
        "Order Count": item.count,
        "Percentage %": item.value,
        "Estimated Amount": `₹${(item.count * 293).toLocaleString()}`,
        Notes: item.name === "Paid" ? "Complete payment received" : item.name === "Unpaid (COD)" ? "Cash on delivery orders" : "Partial payment received"
      }));
      const paymentSheet = XLSX.utils.json_to_sheet(paymentExportData);
      XLSX.utils.book_append_sheet(workbook, paymentSheet, "Payment Analysis");

      // 5. Product Performance
      const productExportData = productPerformanceData.map(item => ({
        Product: item.name,
        "Units Sold": item.sales,
        "Revenue ₹": item.revenue,
        "Profit ₹": item.profit,
        "Profit Margin %": ((item.profit / item.revenue) * 100).toFixed(1),
        "Avg Price": (item.revenue / item.sales).toFixed(2)
      }));
      const productSheet = XLSX.utils.json_to_sheet(productExportData);
      XLSX.utils.book_append_sheet(workbook, productSheet, "Product Performance");

      // 6. Weekly Orders Analysis
      const weeklyExportData = weeklyOrdersData.map(item => ({
        Day: item.day,
        Orders: item.orders,
        "Revenue ₹": item.revenue,
        "Avg Order Value": (item.revenue / item.orders).toFixed(2)
      }));
      const weeklySheet = XLSX.utils.json_to_sheet(weeklyExportData);
      XLSX.utils.book_append_sheet(workbook, weeklySheet, "Weekly Analysis");

      // Try to capture chart as image and include in Excel (if possible)
      try {
        const chartElement = document.querySelector('.recharts-wrapper');
        if (chartElement) {
          const chartCanvas = await html2canvas(chartElement, {
            backgroundColor: '#ffffff',
            scale: 2
          });

          // Convert to base64 and add to a separate sheet with notes
          const chartData = [
            { Note: "Chart Image", Description: "Current chart view captured", Timestamp: new Date().toLocaleString() },
            { Note: "Chart Type", Description: chartType, Timestamp: "" },
            { Note: "Active View", Description: activeView, Timestamp: "" },
            { Note: "Date Range", Description: `Last ${dateRange} days`, Timestamp: "" }
          ];
          const chartSheet = XLSX.utils.json_to_sheet(chartData);
          XLSX.utils.book_append_sheet(workbook, chartSheet, "Chart Info");
        }
      } catch (chartError) {
        console.log("Chart capture failed, continuing with data export:", chartError);
      }

      // Set column widths for better readability
      const worksheets = ['Summary', 'Monthly Revenue', 'Category Performance', 'Payment Analysis', 'Product Performance', 'Weekly Analysis'];
      worksheets.forEach(sheetName => {
        if (workbook.Sheets[sheetName]) {
          const worksheet = workbook.Sheets[sheetName];
          const cols = [];
          for (let i = 0; i < 10; i++) {
            cols.push({ wch: 15 });
          }
          worksheet['!cols'] = cols;
        }
      });

      // Generate filename with current date and view
      const currentDate = new Date().toISOString().split('T')[0];
      const fileName = `Hare_Krishna_Medical_Analytics_${activeView}_${currentDate}.xlsx`;

      // Export file
      XLSX.writeFile(workbook, fileName);

      alert(`Analytics exported successfully! File: ${fileName}`);
    } catch (error) {
      console.error("Export failed:", error);
      alert("Failed to export analytics. Please try again.");
    } finally {
      setExportLoading(false);
    }
  };

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
                    Comprehensive data analysis with interactive charts and
                    tables
                  </p>
                </div>
                <div className="d-flex gap-2">
                  <Button
                    onClick={handleExportAnalytics}
                    disabled={exportLoading}
                    className="btn-medical-primary"
                  >
                    {exportLoading ? (
                      <>
                        <Spinner size="sm" className="me-2" />
                        Exporting...
                      </>
                    ) : (
                      <>
                        <i className="bi bi-file-earmark-excel me-2"></i>
                        Export Analytics
                      </>
                    )}
                  </Button>
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
                    <div className="d-flex gap-2 align-items-center">
                      {/* View Mode Toggle */}
                      <ButtonGroup size="sm">
                        <Button
                          variant={
                            viewMode === "chart"
                              ? "primary"
                              : "outline-secondary"
                          }
                          onClick={() => setViewMode("chart")}
                        >
                          <i className="bi bi-bar-chart me-1"></i>
                          Chart
                        </Button>
                        <Button
                          variant={
                            viewMode === "table"
                              ? "primary"
                              : "outline-secondary"
                          }
                          onClick={() => setViewMode("table")}
                        >
                          <i className="bi bi-table me-1"></i>
                          Table
                        </Button>
                      </ButtonGroup>

                      {/* Chart Type Toggle - Only show for chart mode and relevant views */}
                      {viewMode === "chart" &&
                        (activeView === "revenue" ||
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
                <Card.Body>
                  {viewMode === "chart" ? renderChart() : renderTable()}
                </Card.Body>
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
                    <p className="small mb-2">
                      <strong>Mode:</strong>{" "}
                      {viewMode === "chart" ? "Chart View" : "Table View"}
                    </p>
                    <p className="small mb-0">
                      {activeView === "overview" &&
                        "Complete business overview with all key metrics"}
                      {activeView === "revenue" &&
                        "Detailed revenue analysis over time"}
                      {activeView === "orders" && "Order patterns and trends"}
                      {activeView === "categories" &&
                        "Product category performance breakdown"}
                      {activeView === "payments" &&
                        "Payment status and method analysis with COD tracking"}
                      {activeView === "products" &&
                        "Individual product performance metrics"}
                    </p>
                  </div>

                  {viewMode === "chart" && (
                    <div className="mt-3 p-3 bg-light rounded">
                      <h6 className="mb-2">Chart Controls:</h6>
                      <p className="small mb-0">
                        Use the chart type buttons to switch between Line, Area,
                        and Bar charts for revenue and overview data.
                      </p>
                    </div>
                  )}

                  {viewMode === "table" && (
                    <div className="mt-3 p-3 bg-light rounded">
                      <h6 className="mb-2">Table Features:</h6>
                      <p className="small mb-0">
                        Detailed tabular data with sorting capabilities and
                        export options. Perfect for detailed analysis and
                        reporting.
                      </p>
                    </div>
                  )}
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