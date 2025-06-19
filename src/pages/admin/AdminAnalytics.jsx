import React, { useState } from "react";
import {
  Container,
  Row,
  Col,
  Card,
  Form,
  ProgressBar,
  Table,
  Badge,
} from "react-bootstrap";

const AdminAnalytics = () => {
  const [dateRange, setDateRange] = useState("30");

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

  const topProducts = [
    { name: "Paracetamol Tablets", sales: 450, revenue: 11697.5 },
    { name: "Vitamin D3 Capsules", sales: 287, revenue: 13058.5 },
    { name: "Blood Pressure Monitor", sales: 45, revenue: 58499.55 },
    { name: "Cough Syrup", sales: 234, revenue: 8365.5 },
    { name: "Antiseptic Liquid", sales: 189, revenue: 5292.0 },
  ];

  const categoryPerformance = [
    { category: "Pain Relief", orders: 45, revenue: 15680.5, growth: 8.2 },
    { category: "Vitamins", orders: 38, revenue: 18750.25, growth: 15.6 },
    { category: "Medical Devices", orders: 23, revenue: 78450.0, growth: 22.8 },
    { category: "Cough & Cold", orders: 31, revenue: 12890.75, growth: -2.1 },
    { category: "First Aid", orders: 19, revenue: 8945.5, growth: 5.4 },
  ];

  const recentActivity = [
    {
      type: "order",
      message: "New order #HKM12345678 placed",
      amount: 102.35,
      time: "2 minutes ago",
    },
    {
      type: "product",
      message: "Product 'Vitamin D3' stock updated",
      amount: null,
      time: "15 minutes ago",
    },
    {
      type: "user",
      message: "New user registration",
      amount: null,
      time: "1 hour ago",
    },
    {
      type: "order",
      message: "Order #HKM12345677 delivered",
      amount: 256.75,
      time: "2 hours ago",
    },
  ];

  const getActivityIcon = (type) => {
    switch (type) {
      case "order":
        return "bi-bag-check text-success";
      case "product":
        return "bi-box-seam text-primary";
      case "user":
        return "bi-person-plus text-info";
      default:
        return "bi-circle text-muted";
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
                  <h2>Analytics Dashboard</h2>
                  <p className="text-muted">
                    Detailed analysis and performance metrics
                  </p>
                </div>
                <div>
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
                        {salesData.monthlyGrowth}% from last month
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
                        <i className="bi bi-arrow-up"></i> +5.1% from last month
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
                        <i className="bi bi-arrow-up"></i> +1.8% from last month
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

          <Row>
            {/* Top Products */}
            <Col lg={6} className="mb-4">
              <Card className="medical-card h-100">
                <Card.Header className="bg-medical-light">
                  <h5 className="mb-0">
                    <i className="bi bi-trophy me-2"></i>
                    Top Performing Products
                  </h5>
                </Card.Header>
                <Card.Body>
                  <Table responsive>
                    <thead>
                      <tr>
                        <th>Product</th>
                        <th>Sales</th>
                        <th>Revenue</th>
                      </tr>
                    </thead>
                    <tbody>
                      {topProducts.map((product, index) => (
                        <tr key={index}>
                          <td>
                            <div className="d-flex align-items-center">
                              <Badge
                                bg={index === 0 ? "warning" : "secondary"}
                                className="me-2"
                              >
                                {index + 1}
                              </Badge>
                              {product.name}
                            </div>
                          </td>
                          <td>
                            <Badge bg="primary">{product.sales}</Badge>
                          </td>
                          <td>
                            <span className="fw-bold">
                              ₹{product.revenue.toLocaleString()}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </Table>
                </Card.Body>
              </Card>
            </Col>

            {/* Category Performance */}
            <Col lg={6} className="mb-4">
              <Card className="medical-card h-100">
                <Card.Header className="bg-medical-light">
                  <h5 className="mb-0">
                    <i className="bi bi-pie-chart me-2"></i>
                    Category Performance
                  </h5>
                </Card.Header>
                <Card.Body>
                  {categoryPerformance.map((category, index) => (
                    <div key={index} className="mb-4">
                      <div className="d-flex justify-content-between align-items-center mb-2">
                        <span className="fw-bold">{category.category}</span>
                        <div className="text-end">
                          <div className="fw-bold">
                            ₹{category.revenue.toLocaleString()}
                          </div>
                          <small
                            className={
                              category.growth >= 0
                                ? "text-success"
                                : "text-danger"
                            }
                          >
                            {category.growth >= 0 ? "+" : ""}
                            {category.growth}%
                          </small>
                        </div>
                      </div>
                      <div className="d-flex justify-content-between align-items-center mb-1">
                        <small className="text-muted">
                          {category.orders} orders
                        </small>
                        <small className="text-muted">
                          {Math.round((category.orders / 156) * 100)}% of total
                        </small>
                      </div>
                      <ProgressBar
                        variant={category.growth >= 0 ? "success" : "danger"}
                        now={(category.orders / 156) * 100}
                        style={{ height: "6px" }}
                      />
                    </div>
                  ))}
                </Card.Body>
              </Card>
            </Col>
          </Row>

          <Row>
            {/* Performance Metrics */}
            <Col lg={8} className="mb-4">
              <Card className="medical-card h-100">
                <Card.Header className="bg-medical-light">
                  <h5 className="mb-0">
                    <i className="bi bi-graph-up-arrow me-2"></i>
                    Performance Metrics
                  </h5>
                </Card.Header>
                <Card.Body>
                  <Row>
                    <Col md={6} className="mb-4">
                      <h6>Customer Metrics</h6>
                      <div className="mb-3">
                        <div className="d-flex justify-content-between mb-1">
                          <span>Total Customers</span>
                          <span className="fw-bold">
                            {salesData.totalCustomers}
                          </span>
                        </div>
                        <ProgressBar variant="primary" now={100} />
                      </div>
                      <div className="mb-3">
                        <div className="d-flex justify-content-between mb-1">
                          <span>Repeat Customer Rate</span>
                          <span className="fw-bold">
                            {salesData.repeatCustomerRate}%
                          </span>
                        </div>
                        <ProgressBar
                          variant="success"
                          now={salesData.repeatCustomerRate}
                        />
                      </div>
                      <div className="mb-3">
                        <div className="d-flex justify-content-between mb-1">
                          <span>Conversion Rate</span>
                          <span className="fw-bold">
                            {salesData.conversionRate}%
                          </span>
                        </div>
                        <ProgressBar
                          variant="warning"
                          now={salesData.conversionRate * 10}
                        />
                      </div>
                    </Col>
                    <Col md={6} className="mb-4">
                      <h6>Sales Metrics</h6>
                      <div className="mb-3">
                        <div className="d-flex justify-content-between mb-1">
                          <span>Monthly Growth</span>
                          <span className="fw-bold">
                            +{salesData.monthlyGrowth}%
                          </span>
                        </div>
                        <ProgressBar
                          variant="success"
                          now={salesData.monthlyGrowth * 5}
                        />
                      </div>
                      <div className="mb-3">
                        <div className="d-flex justify-content-between mb-1">
                          <span>Order Fulfillment</span>
                          <span className="fw-bold">94%</span>
                        </div>
                        <ProgressBar variant="info" now={94} />
                      </div>
                      <div className="mb-3">
                        <div className="d-flex justify-content-between mb-1">
                          <span>Customer Satisfaction</span>
                          <span className="fw-bold">88%</span>
                        </div>
                        <ProgressBar variant="success" now={88} />
                      </div>
                    </Col>
                  </Row>
                </Card.Body>
              </Card>
            </Col>

            {/* Recent Activity */}
            <Col lg={4} className="mb-4">
              <Card className="medical-card h-100">
                <Card.Header className="bg-medical-light">
                  <h5 className="mb-0">
                    <i className="bi bi-activity me-2"></i>
                    Recent Activity
                  </h5>
                </Card.Header>
                <Card.Body>
                  {recentActivity.map((activity, index) => (
                    <div
                      key={index}
                      className="d-flex align-items-start mb-3 pb-3 border-bottom"
                    >
                      <i
                        className={`${getActivityIcon(activity.type)} me-3 mt-1`}
                      ></i>
                      <div className="flex-grow-1">
                        <p className="mb-1 small">{activity.message}</p>
                        {activity.amount && (
                          <p className="mb-1 fw-bold text-success">
                            ₹{activity.amount}
                          </p>
                        )}
                        <small className="text-muted">{activity.time}</small>
                      </div>
                    </div>
                  ))}
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
