import React, { useState, useEffect } from "react";
import {
  Container,
  Row,
  Col,
  Card,
  Button,
  Table,
  Badge,
  Modal,
  Form,
  InputGroup,
} from "react-bootstrap";
import { Link } from "react-router-dom";

const UserOrders = () => {
  const [orders, setOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("");

  // Mock orders data
  const mockOrders = [
    {
      id: "HKM12345678",
      date: "2024-01-15",
      time: "14:30:25",
      items: [
        {
          name: "Paracetamol Tablets",
          quantity: 2,
          price: 25.99,
          total: 51.98,
        },
        { name: "Vitamin D3 Capsules", quantity: 1, price: 45.5, total: 45.5 },
      ],
      subtotal: 97.48,
      shipping: 0,
      tax: 4.87,
      total: 102.35,
      status: "Delivered",
      paymentMethod: "Cash on Delivery",
      deliveryDate: "2024-01-17",
      trackingNumber: "TRK123456789",
    },
    {
      id: "HKM12345679",
      date: "2024-01-12",
      time: "10:15:30",
      items: [
        { name: "Cough Syrup", quantity: 1, price: 35.75, total: 35.75 },
        { name: "Antiseptic Liquid", quantity: 2, price: 28.0, total: 56.0 },
      ],
      subtotal: 91.75,
      shipping: 50,
      tax: 4.59,
      total: 146.34,
      status: "Processing",
      paymentMethod: "Cash on Delivery",
      estimatedDelivery: "2024-01-18",
    },
    {
      id: "HKM12345680",
      date: "2024-01-10",
      time: "16:45:12",
      items: [
        {
          name: "Blood Pressure Monitor",
          quantity: 1,
          price: 1299.99,
          total: 1299.99,
        },
      ],
      subtotal: 1299.99,
      shipping: 0,
      tax: 65.0,
      total: 1364.99,
      status: "Delivered",
      paymentMethod: "Cash on Delivery",
      deliveryDate: "2024-01-12",
      trackingNumber: "TRK987654321",
    },
  ];

  useEffect(() => {
    setOrders(mockOrders);
  }, []);

  const statusOptions = [
    "Pending",
    "Confirmed",
    "Processing",
    "Shipped",
    "Delivered",
    "Cancelled",
  ];

  const filteredOrders = orders.filter((order) => {
    const matchesSearch = order.id
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesStatus = !statusFilter || order.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleViewDetails = (order) => {
    setSelectedOrder(order);
    setShowDetailsModal(true);
  };

  const getStatusVariant = (status) => {
    switch (status) {
      case "Pending":
        return "warning";
      case "Confirmed":
        return "info";
      case "Processing":
        return "primary";
      case "Shipped":
        return "success";
      case "Delivered":
        return "success";
      case "Cancelled":
        return "danger";
      default:
        return "secondary";
    }
  };

  const getStatusCounts = () => {
    const counts = {};
    statusOptions.forEach((status) => {
      counts[status] = orders.filter((order) => order.status === status).length;
    });
    return counts;
  };

  const statusCounts = getStatusCounts();

  return (
    <div className="fade-in user-page-content" data-page="user">
      {/* Hero Section - About Us Red Theme */}
      <section
        style={{
          background: "linear-gradient(135deg, #e63946 0%, #dc3545 100%)",
          paddingTop: "80px",
          paddingBottom: "80px",
          color: "white",
        }}
      >
        <Container>
          <Row className="text-center">
            <Col lg={12}>
              <h1
                style={{
                  fontSize: "3rem",
                  fontWeight: "800",
                  marginBottom: "20px",
                  textShadow: "2px 2px 4px rgba(0,0,0,0.3)",
                }}
              >
                My Orders
              </h1>
              <p
                style={{
                  fontSize: "1.2rem",
                  opacity: "0.9",
                  maxWidth: "600px",
                  margin: "0 auto",
                }}
              >
                Track and manage your medical product orders
              </p>
            </Col>
          </Row>
        </Container>
      </section>

      {/* Orders Content */}
      <section
        style={{
          background: "#f8f9fa",
          paddingTop: "80px",
          paddingBottom: "80px",
          minHeight: "60vh",
        }}
      >
        <Container>
          {/* Header */}
          <Row className="mb-4">
            <Col lg={12}>
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <h2>My Orders</h2>
                  <p className="text-muted">Track and manage your orders</p>
                </div>
                <Button
                  as={Link}
                  to="/products"
                  className="btn-medical-primary"
                >
                  <i className="bi bi-plus me-2"></i>
                  Shop More
                </Button>
              </div>
            </Col>
          </Row>

          {/* Order Statistics */}
          <Row className="mb-4">
            <Col lg={2} md={4} sm={6} className="mb-3">
              <Card className="medical-card text-center h-100">
                <Card.Body>
                  <h4 className="text-medical-blue">{orders.length}</h4>
                  <p className="mb-0 small">Total Orders</p>
                </Card.Body>
              </Card>
            </Col>
            <Col lg={2} md={4} sm={6} className="mb-3">
              <Card className="medical-card text-center h-100">
                <Card.Body>
                  <h4 className="text-success">
                    {statusCounts["Delivered"] || 0}
                  </h4>
                  <p className="mb-0 small">Delivered</p>
                </Card.Body>
              </Card>
            </Col>
            <Col lg={2} md={4} sm={6} className="mb-3">
              <Card className="medical-card text-center h-100">
                <Card.Body>
                  <h4 className="text-primary">
                    {statusCounts["Processing"] || 0}
                  </h4>
                  <p className="mb-0 small">Processing</p>
                </Card.Body>
              </Card>
            </Col>
            <Col lg={2} md={4} sm={6} className="mb-3">
              <Card className="medical-card text-center h-100">
                <Card.Body>
                  <h4 className="text-warning">
                    {statusCounts["Pending"] || 0}
                  </h4>
                  <p className="mb-0 small">Pending</p>
                </Card.Body>
              </Card>
            </Col>
            <Col lg={2} md={4} sm={6} className="mb-3">
              <Card className="medical-card text-center h-100">
                <Card.Body>
                  <h4 className="text-info">{statusCounts["Shipped"] || 0}</h4>
                  <p className="mb-0 small">Shipped</p>
                </Card.Body>
              </Card>
            </Col>
            <Col lg={2} md={4} sm={6} className="mb-3">
              <Card className="medical-card text-center h-100">
                <Card.Body>
                  <h4 className="text-danger">
                    {statusCounts["Cancelled"] || 0}
                  </h4>
                  <p className="mb-0 small">Cancelled</p>
                </Card.Body>
              </Card>
            </Col>
          </Row>

          {/* Filters */}
          <Row className="mb-4">
            <Col lg={6}>
              <h1
                style={{
                  fontSize: "3rem",
                  fontWeight: "800",
                  marginBottom: "20px",
                  textShadow: "2px 2px 4px rgba(0,0,0,0.3)",
                }}
              >
                My Orders
              </h1>
              <p
                style={{
                  fontSize: "1.2rem",
                  opacity: "0.9",
                  maxWidth: "600px",
                  margin: "0 auto",
                }}
              >
                View and track your order history
              </p>
                    {status}
                  </option>
                ))}
              </Form.Select>
            </Col>
            <Col lg={3}>
              <Button
                variant="outline-secondary"
                onClick={() => {
                  setSearchTerm("");
                  setStatusFilter("");
                }}
              >
                Clear Filters
              </Button>
            </Col>
          </Row>

          {/* Orders Table */}
          <Card className="medical-card">
            <Card.Header className="bg-medical-light">
              <h5 className="mb-0">
                <i className="bi bi-bag me-2"></i>
                Your Orders ({filteredOrders.length})
              </h5>
            </Card.Header>
            <Card.Body className="p-0">
              <div className="table-responsive">
                <Table className="mb-0">
                  <thead className="table-light">
                    <tr>
                      <th>Order ID</th>
                      <th>Date</th>
                      <th>Items</th>
                      <th>Total Amount</th>
                      <th>Status</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredOrders.map((order) => (
                      <tr key={order.id}>
                        <td>
                          <span className="text-monospace fw-bold">
                            {order.id}
                          </span>
                        </td>
                        <td>
                          <div>{order.date}</div>
                          <small className="text-muted">{order.time}</small>
                        </td>
                        <td>
                          <Badge bg="secondary">
                            {order.items.length} items
                          </Badge>
                        </td>
                        <td>
                          <span className="fw-bold">
                            ₹{order.total.toFixed(2)}
                          </span>
                        </td>
                        <td>
                          <Badge bg={getStatusVariant(order.status)}>
                            {order.status}
                          </Badge>
                        </td>
                        <td>
                          <div className="d-flex gap-1">
                            <Button
                              size="sm"
                              variant="outline-primary"
                              onClick={() => handleViewDetails(order)}
                              className="btn-medical-outline"
                            >
                              <i className="bi bi-eye me-1"></i>
                              View
                            </Button>
                            <Button
                              size="sm"
                              variant="outline-success"
                              onClick={() =>
                                (window.location.href = `/invoice/${order.id}`)
                              }
                              className="btn-medical-outline"
                            >
                              <i className="bi bi-receipt"></i>
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              </div>
            </Card.Body>
          </Card>
        </Container>
      </section>

      {/* Order Details Modal */}
      <Modal
        show={showDetailsModal}
        onHide={() => setShowDetailsModal(false)}
        size="lg"
      >
        <Modal.Header closeButton>
          <Modal.Title>Order Details - {selectedOrder?.id}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedOrder && (
            <div>
              {/* Order Status */}
              <Card className="mb-4">
                <Card.Header>
                  <h6 className="mb-0">Order Status</h6>
                </Card.Header>
                <Card.Body>
                  <Row>
                    <Col md={6}>
                      <p>
                        <strong>Status:</strong>{" "}
                        <Badge
                          bg={getStatusVariant(selectedOrder.status)}
                          className="ms-2"
                        >
                          {selectedOrder.status}
                        </Badge>
                      </p>
                      <p>
                        <strong>Order Date:</strong> {selectedOrder.date}{" "}
                        {selectedOrder.time}
                      </p>
                      <p>
                        <strong>Payment Method:</strong>{" "}
                        {selectedOrder.paymentMethod}
                      </p>
                    </Col>
                    <Col md={6}>
                      {selectedOrder.trackingNumber && (
                        <p>
                          <strong>Tracking Number:</strong>{" "}
                          {selectedOrder.trackingNumber}
                        </p>
                      )}
                      {selectedOrder.deliveryDate && (
                        <p>
                          <strong>Delivered On:</strong>{" "}
                          {selectedOrder.deliveryDate}
                        </p>
                      )}
                      {selectedOrder.estimatedDelivery && (
                        <p>
                          <strong>Estimated Delivery:</strong>{" "}
                          {selectedOrder.estimatedDelivery}
                        </p>
                      )}
                    </Col>
                  </Row>
                </Card.Body>
              </Card>

              {/* Items */}
              <Card className="mb-4">
                <Card.Header>
                  <h6 className="mb-0">Items Ordered</h6>
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
                      {selectedOrder.items.map((item, index) => (
                        <tr key={index}>
                          <td>{item.name}</td>
                          <td>{item.quantity}</td>
                          <td>₹{item.price}</td>
                          <td>₹{item.total.toFixed(2)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </Table>
                </Card.Body>
              </Card>

              {/* Order Summary */}
              <Card>
                <Card.Header>
                  <h6 className="mb-0">Order Summary</h6>
                </Card.Header>
                <Card.Body>
                  <div className="d-flex justify-content-between mb-2">
                    <span>Subtotal:</span>
                    <span>₹{selectedOrder.subtotal.toFixed(2)}</span>
                  </div>
                  <div className="d-flex justify-content-between mb-2">
                    <span>Shipping:</span>
                    <span>
                      {selectedOrder.shipping === 0
                        ? "FREE"
                        : `₹${selectedOrder.shipping.toFixed(2)}`}
                    </span>
                  </div>
                  <div className="d-flex justify-content-between mb-2">
                    <span>Tax:</span>
                    <span>₹{selectedOrder.tax.toFixed(2)}</span>
                  </div>
                  <hr />
                  <div className="d-flex justify-content-between">
                    <strong>Total:</strong>
                    <strong className="text-medical-red">
                      ₹{selectedOrder.total.toFixed(2)}
                    </strong>
                  </div>
                </Card.Body>
              </Card>
            </div>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant="secondary"
            onClick={() => setShowDetailsModal(false)}
          >
            Close
          </Button>
          {selectedOrder && (
            <Button
              className="btn-medical-primary"
              as={Link}
              to={`/invoice/${selectedOrder.id}`}
            >
              <i className="bi bi-receipt me-2"></i>
              View Invoice
            </Button>
          )}
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default UserOrders;