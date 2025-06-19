import React from "react";
import {
  Container,
  Row,
  Col,
  Card,
  Button,
  Table,
  Badge,
  ProgressBar,
} from "react-bootstrap";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";

const UserDashboard = () => {
  const { user } = useSelector((state) => state.auth);

  // Mock user data
  const userStats = {
    totalOrders: 12,
    pendingOrders: 2,
    completedOrders: 9,
    cancelledOrders: 1,
    totalSpent: 2356.75,
    loyaltyPoints: 156,
    invoicesCount: 10,
  };

  const recentOrders = [
    {
      id: "HKM12345678",
      date: "2024-01-15",
      items: 3,
      amount: 235.5,
      status: "Delivered",
      deliveryDate: "2024-01-17",
    },
    {
      id: "HKM12345679",
      date: "2024-01-12",
      items: 2,
      amount: 156.75,
      status: "Processing",
      estimatedDelivery: "2024-01-18",
    },
    {
      id: "HKM12345680",
      date: "2024-01-10",
      items: 1,
      amount: 89.25,
      status: "Delivered",
      deliveryDate: "2024-01-12",
    },
  ];

  const recentInvoices = [
    {
      id: "INV001",
      orderId: "HKM12345678",
      date: "2024-01-15",
      amount: 235.5,
      status: "Paid",
    },
    {
      id: "INV002",
      orderId: "HKM12345680",
      date: "2024-01-10",
      amount: 89.25,
      status: "Paid",
    },
    {
      id: "INV003",
      orderId: "HKM12345681",
      date: "2024-01-08",
      amount: 156.0,
      status: "Paid",
    },
  ];

  const getStatusVariant = (status) => {
    switch (status) {
      case "Pending":
        return "warning";
      case "Processing":
        return "info";
      case "Shipped":
        return "primary";
      case "Delivered":
        return "success";
      case "Cancelled":
        return "danger";
      default:
        return "secondary";
    }
  };

  const calculateLoyaltyLevel = (points) => {
    if (points >= 500)
      return { level: "Gold", progress: 100, next: "Platinum" };
    if (points >= 200)
      return { level: "Silver", progress: (points / 500) * 100, next: "Gold" };
    return { level: "Bronze", progress: (points / 200) * 100, next: "Silver" };
  };

  const loyaltyInfo = calculateLoyaltyLevel(userStats.loyaltyPoints);

  return (
    <div className="fade-in">
      <section className="section-padding-sm">
        <Container>
          {/* Header */}
          <Row className="mb-4">
            <Col lg={12}>
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <h2>Welcome back, {user?.name || "User"}!</h2>
                  <p className="text-muted">
                    Here's an overview of your account and recent activity.
                  </p>
                </div>
                <div className="d-flex gap-2">
                  <Button
                    as={Link}
                    to="/products"
                    className="btn-medical-primary"
                  >
                    <i className="bi bi-shop me-2"></i>
                    Shop Now
                  </Button>
                  <Button
                    as={Link}
                    to="/user/profile"
                    variant="outline-primary"
                    className="btn-medical-outline"
                  >
                    <i className="bi bi-person-gear me-2"></i>
                    Edit Profile
                  </Button>
                </div>
              </div>
            </Col>
          </Row>

          {/* Statistics Cards */}
          <Row className="mb-4">
            <Col lg={3} md={6} className="mb-4">
              <Card className="medical-card h-100">
                <Card.Body>
                  <div className="d-flex justify-content-between align-items-start">
                    <div>
                      <h3 className="text-medical-blue">
                        {userStats.totalOrders}
                      </h3>
                      <p className="text-muted mb-0">Total Orders</p>
                      <small className="text-success">
                        {userStats.completedOrders} completed
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
                      <h3 className="text-warning">
                        {userStats.pendingOrders}
                      </h3>
                      <p className="text-muted mb-0">Pending Orders</p>
                      <small className="text-info">
                        <Link
                          to="/user/orders"
                          className="text-decoration-none"
                        >
                          View details
                        </Link>
                      </small>
                    </div>
                    <div className="bg-warning text-white rounded-circle p-3">
                      <i className="bi bi-clock fs-4"></i>
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
                      <h3 className="text-success">
                        ₹{userStats.totalSpent.toLocaleString()}
                      </h3>
                      <p className="text-muted mb-0">Total Spent</p>
                      <small className="text-success">All time purchases</small>
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
                      <h3 className="text-medical-red">
                        {userStats.loyaltyPoints}
                      </h3>
                      <p className="text-muted mb-0">Loyalty Points</p>
                      <small className="text-medical-red">
                        {loyaltyInfo.level} member
                      </small>
                    </div>
                    <div className="bg-medical-red text-white rounded-circle p-3">
                      <i className="bi bi-star fs-4"></i>
                    </div>
                  </div>
                </Card.Body>
              </Card>
            </Col>
          </Row>

          {/* Loyalty Status */}
          <Row className="mb-4">
            <Col lg={12}>
              <Card className="medical-card">
                <Card.Header className="bg-medical-light">
                  <h5 className="mb-0">
                    <i className="bi bi-trophy me-2"></i>
                    Loyalty Status
                  </h5>
                </Card.Header>
                <Card.Body>
                  <Row className="align-items-center">
                    <Col md={8}>
                      <div className="d-flex justify-content-between align-items-center mb-2">
                        <span className="fw-bold">
                          Current Level: {loyaltyInfo.level}
                        </span>
                        <span className="text-muted">
                          Next: {loyaltyInfo.next}
                        </span>
                      </div>
                      <ProgressBar
                        variant="warning"
                        now={loyaltyInfo.progress}
                        className="mb-2"
                        style={{ height: "8px" }}
                      />
                      <small className="text-muted">
                        {userStats.loyaltyPoints} points earned •{" "}
                        {loyaltyInfo.level === "Bronze"
                          ? 200 - userStats.loyaltyPoints
                          : loyaltyInfo.level === "Silver"
                            ? 500 - userStats.loyaltyPoints
                            : 0}{" "}
                        points to next level
                      </small>
                    </Col>
                    <Col md={4} className="text-md-end">
                      <Button
                        size="sm"
                        variant="outline-warning"
                        className="btn-medical-outline"
                      >
                        <i className="bi bi-gift me-2"></i>
                        Redeem Points
                      </Button>
                    </Col>
                  </Row>
                </Card.Body>
              </Card>
            </Col>
          </Row>

          {/* Quick Actions */}
          <Row className="mb-4">
            <Col lg={12}>
              <Card className="medical-card">
                <Card.Header className="bg-medical-light">
                  <h5 className="mb-0">
                    <i className="bi bi-lightning me-2"></i>
                    Quick Actions
                  </h5>
                </Card.Header>
                <Card.Body>
                  <Row>
                    <Col lg={3} md={6} className="mb-3">
                      <Button
                        as={Link}
                        to="/user/orders"
                        variant="outline-primary"
                        className="w-100 h-100 d-flex flex-column align-items-center justify-content-center p-3"
                      >
                        <i className="bi bi-bag mb-2 fs-1"></i>
                        <span className="fw-bold">My Orders</span>
                        <small>Track your orders</small>
                      </Button>
                    </Col>
                    <Col lg={3} md={6} className="mb-3">
                      <Button
                        as={Link}
                        to="/user/invoices"
                        variant="outline-success"
                        className="w-100 h-100 d-flex flex-column align-items-center justify-content-center p-3"
                      >
                        <i className="bi bi-receipt mb-2 fs-1"></i>
                        <span className="fw-bold">Invoices</span>
                        <small>Download invoices</small>
                      </Button>
                    </Col>
                    <Col lg={3} md={6} className="mb-3">
                      <Button
                        as={Link}
                        to="/user/profile"
                        variant="outline-info"
                        className="w-100 h-100 d-flex flex-column align-items-center justify-content-center p-3"
                      >
                        <i className="bi bi-person-gear mb-2 fs-1"></i>
                        <span className="fw-bold">Edit Profile</span>
                        <small>Update your details</small>
                      </Button>
                    </Col>
                    <Col lg={3} md={6} className="mb-3">
                      <Button
                        as={Link}
                        to="/products"
                        variant="outline-warning"
                        className="w-100 h-100 d-flex flex-column align-items-center justify-content-center p-3"
                      >
                        <i className="bi bi-cart-plus mb-2 fs-1"></i>
                        <span className="fw-bold">Shop More</span>
                        <small>Browse products</small>
                      </Button>
                    </Col>
                  </Row>
                </Card.Body>
              </Card>
            </Col>
          </Row>

          <Row>
            {/* Recent Orders */}
            <Col lg={8} className="mb-4">
              <Card className="medical-card">
                <Card.Header className="bg-medical-light d-flex justify-content-between align-items-center">
                  <h5 className="mb-0">
                    <i className="bi bi-clock-history me-2"></i>
                    Recent Orders
                  </h5>
                  <Button
                    as={Link}
                    to="/user/orders"
                    size="sm"
                    className="btn-medical-outline"
                  >
                    View All
                  </Button>
                </Card.Header>
                <Card.Body className="p-0">
                  <div className="table-responsive">
                    <Table className="mb-0">
                      <thead className="table-light">
                        <tr>
                          <th>Order ID</th>
                          <th>Date</th>
                          <th>Items</th>
                          <th>Amount</th>
                          <th>Status</th>
                          <th>Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        {recentOrders.map((order) => (
                          <tr key={order.id}>
                            <td>
                              <small className="text-monospace">
                                {order.id}
                              </small>
                            </td>
                            <td>
                              <small>{order.date}</small>
                            </td>
                            <td>
                              <span className="fw-bold">{order.items}</span>
                            </td>
                            <td>
                              <span className="fw-bold">₹{order.amount}</span>
                            </td>
                            <td>
                              <Badge bg={getStatusVariant(order.status)}>
                                {order.status}
                              </Badge>
                            </td>
                            <td>
                              <Button
                                as={Link}
                                to={`/user/orders/${order.id}`}
                                size="sm"
                                variant="outline-primary"
                                className="btn-medical-outline"
                              >
                                View
                              </Button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </Table>
                  </div>
                </Card.Body>
              </Card>
            </Col>

            {/* Recent Invoices */}
            <Col lg={4} className="mb-4">
              <Card className="medical-card">
                <Card.Header className="bg-medical-light d-flex justify-content-between align-items-center">
                  <h5 className="mb-0">
                    <i className="bi bi-receipt me-2"></i>
                    Recent Invoices
                  </h5>
                  <Button
                    as={Link}
                    to="/user/invoices"
                    size="sm"
                    className="btn-medical-outline"
                  >
                    View All
                  </Button>
                </Card.Header>
                <Card.Body>
                  {recentInvoices.map((invoice) => (
                    <div
                      key={invoice.id}
                      className="d-flex justify-content-between align-items-center mb-3 pb-2 border-bottom"
                    >
                      <div>
                        <div className="fw-bold small">{invoice.id}</div>
                        <small className="text-muted">{invoice.date}</small>
                      </div>
                      <div className="text-end">
                        <div className="fw-bold">₹{invoice.amount}</div>
                        <Button
                          size="sm"
                          variant="outline-primary"
                          className="btn-medical-outline"
                        >
                          <i className="bi bi-download"></i>
                        </Button>
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

export default UserDashboard;
