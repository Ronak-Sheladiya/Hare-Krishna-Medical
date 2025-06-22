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
    unreadMessages: unreadCount,
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
      orderItems: [
        { name: "Paracetamol Tablets", quantity: 2, price: 25.99 },
        { name: "Vitamin D3", quantity: 1, price: 45.5 },
        { name: "Cough Syrup", quantity: 1, price: 35.75 },
      ],
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
      orderItems: [
        { name: "Antiseptic Liquid", quantity: 2, price: 28.0 },
        { name: "Digital Thermometer", quantity: 1, price: 100.75 },
      ],
    },
    {
      id: "HKM12345680",
      customer: "Mike Johnson",
      customerEmail: "mike.j@company.com",
      customerPhone: "+91 9988776655",
      address: "789 Business District, Vadodara, Gujarat 390001",
      amount: 89.25,
      status: "Delivered",
      date: "2024-01-14",
      time: "11:45 AM",
      items: 1,
      paymentMethod: "Online",
      orderItems: [{ name: "BP Monitor", quantity: 1, price: 89.25 }],
    },
    {
      id: "HKM12345681",
      customer: "Sarah Wilson",
      customerEmail: "sarah.w@email.com",
      customerPhone: "+91 9876512345",
      address: "321 Health Care Lane, Rajkot, Gujarat 360001",
      amount: 345.0,
      status: "Processing",
      date: "2024-01-14",
      time: "04:20 PM",
      items: 5,
      paymentMethod: "Online",
      orderItems: [
        { name: "Medicine Kit", quantity: 1, price: 150.0 },
        { name: "First Aid Box", quantity: 1, price: 89.0 },
        { name: "Hand Sanitizer", quantity: 3, price: 35.33 },
      ],
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

  return (
    <div className="fade-in">
      <section
        style={{
          paddingTop: "2rem",
          paddingBottom: "2rem",
          minHeight: "100vh",
          background: "#f8f9fa",
        }}
      >
        <Container>
          {/* Header */}
          <Row className="mb-4">
            <Col lg={12}>
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <h2>Admin Dashboard</h2>
                  <p className="text-muted">
                    Welcome back! Here's what's happening at Hare Krishna
                    Medical.
                  </p>
                </div>
                <div className="d-flex gap-2">
                  <Button
                    as={Link}
                    to="/admin/products"
                    className="btn-medical-primary"
                  >
                    <i className="bi bi-plus-circle me-2"></i>
                    Add Product
                  </Button>
                  <Button
                    as={Link}
                    to="/admin/messages"
                    variant="outline-primary"
                    className="btn-medical-outline"
                  >
                    <i className="bi bi-envelope me-2"></i>
                    Messages
                  </Button>
                  <Button
                    as={Link}
                    to="/admin/analytics"
                    variant="outline-primary"
                    className="btn-medical-outline"
                  >
                    <i className="bi bi-graph-up me-2"></i>
                    Analytics
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
                      <h3 className="text-medical-red">
                        {dashboardStats.totalOrders}
                      </h3>
                      <p className="text-muted mb-0">Total Orders</p>
                      <small className="text-success">
                        <i className="bi bi-arrow-up"></i> +{" "}
                        {dashboardStats.monthlyGrowth}% from last month
                      </small>
                    </div>
                    <div className="bg-medical-red text-white rounded-circle p-3">
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
                      <h3 className="text-medical-blue">
                        {dashboardStats.totalProducts}
                      </h3>
                      <p className="text-muted mb-0">Total Products</p>
                      <small className="text-warning">
                        <i className="bi bi-exclamation-triangle"></i>{" "}
                        {dashboardStats.lowStockProducts} low stock
                      </small>
                    </div>
                    <div className="bg-medical-blue text-white rounded-circle p-3">
                      <i className="bi bi-box-seam fs-4"></i>
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
                        ₹{dashboardStats.totalRevenue.toLocaleString()}
                      </h3>
                      <p className="text-muted mb-0">Total Revenue</p>
                      <small className="text-success">
                        <i className="bi bi-graph-up"></i> +
                        {dashboardStats.monthlyGrowth}% this month
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
              <Card
                className="medical-card h-100"
                style={{ cursor: "pointer" }}
                onClick={() => (window.location.href = "/admin/messages")}
              >
                <Card.Body>
                  <div className="d-flex justify-content-between align-items-start">
                    <div>
                      <h3 className="text-warning">
                        {dashboardStats.unreadMessages}
                        {dashboardStats.unreadMessages > 0 && (
                          <Badge
                            bg="danger"
                            className="ms-2"
                            style={{ fontSize: "12px" }}
                          >
                            NEW
                          </Badge>
                        )}
                      </h3>
                      <p className="text-muted mb-0">Unread Messages</p>
                      <small
                        className={
                          dashboardStats.unreadMessages > 0
                            ? "text-danger"
                            : "text-muted"
                        }
                      >
                        <i
                          className={`bi bi-${dashboardStats.unreadMessages > 0 ? "exclamation-circle" : "check-circle"}`}
                        ></i>
                        {dashboardStats.unreadMessages > 0
                          ? " Requires attention"
                          : " All caught up"}
                      </small>
                    </div>
                    <div className="bg-warning text-white rounded-circle p-3">
                      <i className="bi bi-envelope fs-4"></i>
                    </div>
                  </div>
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
                        to="/admin/orders"
                        variant="outline-warning"
                        className="w-100 h-100 d-flex flex-column align-items-center justify-content-center p-3"
                      >
                        <i className="bi bi-exclamation-circle mb-2 fs-1"></i>
                        <span className="fw-bold">
                          {dashboardStats.pendingOrders}
                        </span>
                        <small>Pending Orders</small>
                      </Button>
                    </Col>
                    <Col lg={3} md={6} className="mb-3">
                      <Button
                        as={Link}
                        to="/admin/products"
                        variant="outline-danger"
                        className="w-100 h-100 d-flex flex-column align-items-center justify-content-center p-3"
                      >
                        <i className="bi bi-box mb-2 fs-1"></i>
                        <span className="fw-bold">
                          {dashboardStats.lowStockProducts}
                        </span>
                        <small>Low Stock Items</small>
                      </Button>
                    </Col>
                    <Col lg={3} md={6} className="mb-3">
                      <Button
                        as={Link}
                        to="/admin/products"
                        variant="outline-primary"
                        className="w-100 h-100 d-flex flex-column align-items-center justify-content-center p-3"
                      >
                        <i className="bi bi-plus-circle mb-2 fs-1"></i>
                        <span className="fw-bold">Add</span>
                        <small>New Product</small>
                      </Button>
                    </Col>
                    <Col lg={3} md={6} className="mb-3">
                      <Button
                        as={Link}
                        to="/admin/messages"
                        variant={
                          dashboardStats.unreadMessages > 0
                            ? "outline-danger"
                            : "outline-info"
                        }
                        className="w-100 h-100 d-flex flex-column align-items-center justify-content-center p-3 position-relative"
                        style={{
                          transition: "all 0.3s ease",
                        }}
                        onMouseOver={(e) => {
                          e.target.style.background = "#e63946";
                          e.target.style.borderColor = "#e63946";
                          e.target.style.color = "white";
                        }}
                        onMouseOut={(e) => {
                          e.target.style.background = "transparent";
                          e.target.style.borderColor =
                            dashboardStats.unreadMessages > 0
                              ? "#dc3545"
                              : "#0dcaf0";
                          e.target.style.color =
                            dashboardStats.unreadMessages > 0
                              ? "#dc3545"
                              : "#0dcaf0";
                        }}
                      >
                        <i className="bi bi-envelope mb-2 fs-1"></i>
                        <span className="fw-bold">
                          {dashboardStats.unreadMessages}
                        </span>
                        <small>Manage Messages</small>
                        {dashboardStats.unreadMessages > 0 && (
                          <Badge
                            bg="danger"
                            className="position-absolute top-0 end-0"
                            style={{ transform: "translate(25%, -25%)" }}
                          >
                            !
                          </Badge>
                        )}
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
                    to="/admin/orders"
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
                          <th>Customer</th>
                          <th>Amount</th>
                          <th>Status</th>
                          <th>Date</th>
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
                              <div>
                                <div className="fw-bold">{order.customer}</div>
                                <small className="text-muted">
                                  {order.items} items
                                </small>
                              </div>
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
                              <small>{order.date}</small>
                            </td>
                            <td>
                              <Button
                                size="sm"
                                variant="outline-primary"
                                className="btn-medical-outline"
                                onClick={() => handleViewOrder(order)}
                                style={{
                                  transition: "all 0.3s ease",
                                }}
                                onMouseOver={(e) => {
                                  e.target.style.background = "#e63946";
                                  e.target.style.borderColor = "#e63946";
                                  e.target.style.color = "white";
                                }}
                                onMouseOut={(e) => {
                                  e.target.style.background = "transparent";
                                  e.target.style.borderColor = "#e63946";
                                  e.target.style.color = "#e63946";
                                }}
                              >
                                <i className="bi bi-eye me-1"></i>
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

            {/* Low Stock Alert */}
            <Col lg={4} className="mb-4">
              <Card className="medical-card">
                <Card.Header className="bg-medical-light">
                  <h5 className="mb-0">
                    <i className="bi bi-exclamation-triangle text-warning me-2"></i>
                    Low Stock Alert
                  </h5>
                </Card.Header>
                <Card.Body>
                  {lowStockProducts.map((product) => (
                    <div key={product.id} className="mb-3">
                      <div className="d-flex justify-content-between align-items-center mb-1">
                        <span className="fw-bold small">{product.name}</span>
                        <Badge bg="danger">{product.stock} left</Badge>
                      </div>
                      <ProgressBar
                        variant="danger"
                        now={(product.stock / product.threshold) * 100}
                        style={{ height: "4px" }}
                      />
                      <small className="text-muted">
                        Threshold: {product.threshold}
                      </small>
                    </div>
                  ))}
                  <Button
                    as={Link}
                    to="/admin/products"
                    size="sm"
                    className="btn-medical-primary w-100 mt-2"
                  >
                    Manage Stock
                  </Button>
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
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>
            <i className="bi bi-bag-check me-2"></i>
            Order Details
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedOrder && (
            <div>
              {/* Order Information */}
              <Row className="mb-4">
                <Col md={6}>
                  <Card className="h-100">
                    <Card.Header className="bg-light">
                      <h6 className="mb-0">Order Information</h6>
                    </Card.Header>
                    <Card.Body>
                      <div className="mb-2">
                        <strong>Order ID:</strong> {selectedOrder.id}
                      </div>
                      <div className="mb-2">
                        <strong>Date:</strong> {selectedOrder.date}
                      </div>
                      <div className="mb-2">
                        <strong>Time:</strong> {selectedOrder.time}
                      </div>
                      <div className="mb-2">
                        <strong>Status:</strong>{" "}
                        <Badge bg={getStatusVariant(selectedOrder.status)}>
                          {selectedOrder.status}
                        </Badge>
                      </div>
                      <div className="mb-2">
                        <strong>Payment:</strong> {selectedOrder.paymentMethod}
                      </div>
                      <div>
                        <strong>Total Amount:</strong>{" "}
                        <span className="fw-bold text-success">
                          ₹{selectedOrder.amount}
                        </span>
                      </div>
                    </Card.Body>
                  </Card>
                </Col>
                <Col md={6}>
                  <Card className="h-100">
                    <Card.Header className="bg-light">
                      <h6 className="mb-0">Customer Details</h6>
                    </Card.Header>
                    <Card.Body>
                      <div className="mb-2">
                        <strong>Name:</strong> {selectedOrder.customer}
                      </div>
                      <div className="mb-2">
                        <strong>Email:</strong> {selectedOrder.customerEmail}
                      </div>
                      <div className="mb-2">
                        <strong>Phone:</strong> {selectedOrder.customerPhone}
                      </div>
                      <div>
                        <strong>Address:</strong> {selectedOrder.address}
                      </div>
                    </Card.Body>
                  </Card>
                </Col>
              </Row>

              {/* Order Items */}
              <Card>
                <Card.Header className="bg-light">
                  <h6 className="mb-0">Order Items ({selectedOrder.items})</h6>
                </Card.Header>
                <Card.Body>
                  <Table responsive>
                    <thead>
                      <tr>
                        <th>Item</th>
                        <th>Quantity</th>
                        <th>Price</th>
                        <th>Total</th>
                      </tr>
                    </thead>
                    <tbody>
                      {selectedOrder.orderItems.map((item, index) => (
                        <tr key={index}>
                          <td>{item.name}</td>
                          <td>{item.quantity}</td>
                          <td>₹{item.price.toFixed(2)}</td>
                          <td>₹{(item.price * item.quantity).toFixed(2)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </Table>
                  <div className="text-end">
                    <strong>Order Total: ₹{selectedOrder.amount}</strong>
                  </div>
                </Card.Body>
              </Card>
            </div>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowOrderModal(false)}>
            Close
          </Button>
          <Button
            as={Link}
            to={`/order/${selectedOrder?.id}`}
            variant="primary"
            className="btn-medical-primary"
            style={{
              transition: "all 0.3s ease",
            }}
            onMouseOver={(e) => {
              e.target.style.background = "#343a40";
              e.target.style.borderColor = "#343a40";
            }}
            onMouseOut={(e) => {
              e.target.style.background = "#e63946";
              e.target.style.borderColor = "#e63946";
            }}
          >
            <i className="bi bi-arrow-right me-2"></i>
            Go to Full Order Details
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default AdminDashboard;
