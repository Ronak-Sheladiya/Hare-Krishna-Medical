import React from "react";
import { Container, Row, Col, Card, Button } from "react-bootstrap";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";

const UserDashboard = () => {
  const { user } = useSelector((state) => state.auth);

  // Mock user data - simplified
  const userStats = {
    totalOrders: 12,
    pendingOrders: 2,
    recentInvoices: 3,
  };

  return (
    <div className="fade-in">
      <section className="section-padding-sm">
        <Container>
          {/* Simple Header */}
          <Row className="mb-4">
            <Col lg={12} className="text-center">
              <h2>Welcome back, {user?.name || "User"}!</h2>
              <p className="text-muted">
                Manage your orders and account from here
              </p>
            </Col>
          </Row>

          {/* Simple Statistics */}
          <Row className="mb-5">
            <Col lg={4} className="mb-4">
              <Card className="medical-card text-center h-100">
                <Card.Body>
                  <i className="bi bi-bag-check display-3 text-medical-blue mb-3"></i>
                  <h3 className="text-medical-blue">{userStats.totalOrders}</h3>
                  <h5>Total Orders</h5>
                  <p className="text-muted">Your order history</p>
                </Card.Body>
              </Card>
            </Col>

            <Col lg={4} className="mb-4">
              <Card className="medical-card text-center h-100">
                <Card.Body>
                  <i className="bi bi-clock display-3 text-warning mb-3"></i>
                  <h3 className="text-warning">{userStats.pendingOrders}</h3>
                  <h5>Pending Orders</h5>
                  <p className="text-muted">Orders in progress</p>
                </Card.Body>
              </Card>
            </Col>

            <Col lg={4} className="mb-4">
              <Card className="medical-card text-center h-100">
                <Card.Body>
                  <i className="bi bi-receipt display-3 text-success mb-3"></i>
                  <h3 className="text-success">{userStats.recentInvoices}</h3>
                  <h5>Recent Invoices</h5>
                  <p className="text-muted">Available for download</p>
                </Card.Body>
              </Card>
            </Col>
          </Row>

          {/* Simple Quick Actions */}
          <Row className="justify-content-center">
            <Col lg={8}>
              <Card className="medical-card">
                <Card.Header className="bg-medical-light text-center">
                  <h5 className="mb-0">
                    <i className="bi bi-lightning me-2"></i>
                    Quick Actions
                  </h5>
                </Card.Header>
                <Card.Body>
                  <Row>
                    <Col md={6} className="mb-3">
                      <div className="d-grid">
                        <Button
                          as={Link}
                          to="/products"
                          className="btn-medical-primary"
                          size="lg"
                        >
                          <i className="bi bi-cart-plus me-2"></i>
                          Shop Products
                        </Button>
                      </div>
                    </Col>
                    <Col md={6} className="mb-3">
                      <div className="d-grid">
                        <Button
                          as={Link}
                          to="/user/orders"
                          variant="outline-primary"
                          className="btn-medical-outline"
                          size="lg"
                        >
                          <i className="bi bi-bag me-2"></i>
                          My Orders
                        </Button>
                      </div>
                    </Col>
                    <Col md={6} className="mb-3">
                      <div className="d-grid">
                        <Button
                          as={Link}
                          to="/user/invoices"
                          variant="outline-success"
                          className="btn-medical-outline"
                          size="lg"
                        >
                          <i className="bi bi-receipt me-2"></i>
                          My Invoices
                        </Button>
                      </div>
                    </Col>
                    <Col md={6} className="mb-3">
                      <div className="d-grid">
                        <Button
                          as={Link}
                          to="/user/profile"
                          variant="outline-info"
                          className="btn-medical-outline"
                          size="lg"
                        >
                          <i className="bi bi-person-gear me-2"></i>
                          Edit Profile
                        </Button>
                      </div>
                    </Col>
                  </Row>
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
