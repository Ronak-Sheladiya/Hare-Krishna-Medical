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
import ProfessionalInvoice from "../../components/common/ProfessionalInvoice";

const AdminOrders = () => {
  const [orders, setOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("");

  // Mock orders data
  const mockOrders = [
    {
      id: "HKM12345678",
      customerName: "John Doe",
      customerEmail: "john.doe@example.com",
      customerPhone: "+91 9876543210",
      customerAddress: "123 Medical Street, Surat, Gujarat, 395007",
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
      status: "Pending",
      orderDate: "2024-01-15",
      orderTime: "14:30:25",
      paymentMethod: "Cash on Delivery",
    },
    {
      id: "HKM12345679",
      customerName: "Jane Smith",
      customerEmail: "jane.smith@example.com",
      customerPhone: "+91 8765432109",
      customerAddress: "456 Health Avenue, Ahmedabad, Gujarat, 380001",
      items: [
        { name: "Cough Syrup", quantity: 1, price: 35.75, total: 35.75 },
        { name: "Antiseptic Liquid", quantity: 2, price: 28.0, total: 56.0 },
      ],
      subtotal: 91.75,
      shipping: 50,
      tax: 4.59,
      total: 146.34,
      status: "Confirmed",
      orderDate: "2024-01-14",
      orderTime: "10:15:30",
      paymentMethod: "Cash on Delivery",
    },
    {
      id: "HKM12345680",
      customerName: "Mike Johnson",
      customerEmail: "mike.johnson@example.com",
      customerPhone: "+91 7654321098",
      customerAddress: "789 Wellness Road, Vadodara, Gujarat, 390001",
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
      orderDate: "2024-01-12",
      orderTime: "16:45:12",
      paymentMethod: "Cash on Delivery",
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
    const matchesSearch =
      order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.customerEmail.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = !statusFilter || order.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleStatusChange = (orderId, newStatus) => {
    setOrders((prev) =>
      prev.map((order) =>
        order.id === orderId ? { ...order, status: newStatus } : order,
      ),
    );
  };

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
    <div className="fade-in">
      <section className="section-padding-sm">
        <Container>
          {/* Header */}
          <Row className="mb-4">
            <Col lg={12}>
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <h2>Order Management</h2>
                  <p className="text-muted">
                    Monitor and manage customer orders
                  </p>
                </div>
              </div>
            </Col>
          </Row>

          {/* Status Overview */}
          <Row className="mb-4">
            {statusOptions.map((status) => (
              <Col lg={2} md={4} sm={6} key={status} className="mb-3">
                <Card className="medical-card text-center h-100">
                  <Card.Body>
                    <h3 className="text-medical-red">
                      {statusCounts[status] || 0}
                    </h3>
                    <p className="mb-0 small">{status}</p>
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>

          {/* Filters */}
          <Row className="mb-4">
            <Col lg={6}>
              <InputGroup>
                <InputGroup.Text>
                  <i className="bi bi-search"></i>
                </InputGroup.Text>
                <Form.Control
                  type="text"
                  placeholder="Search orders by ID, customer name, or email..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </InputGroup>
            </Col>
            <Col lg={3}>
              <Form.Select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <option value="">All Status</option>
                {statusOptions.map((status) => (
                  <option key={status} value={status}>
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
                <i className="bi bi-receipt me-2"></i>
                Orders ({filteredOrders.length})
              </h5>
            </Card.Header>
            <Card.Body className="p-0">
              <div className="table-responsive">
                <Table className="mb-0">
                  <thead className="table-light">
                    <tr>
                      <th>Order ID</th>
                      <th>Customer</th>
                      <th>Items</th>
                      <th>Total Amount</th>
                      <th>Status</th>
                      <th>Order Date</th>
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
                          <div>
                            <div className="fw-bold">{order.customerName}</div>
                            <small className="text-muted">
                              {order.customerEmail}
                            </small>
                            <br />
                            <small className="text-muted">
                              {order.customerPhone}
                            </small>
                          </div>
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
                          <Form.Select
                            size="sm"
                            value={order.status}
                            onChange={(e) =>
                              handleStatusChange(order.id, e.target.value)
                            }
                            style={{ minWidth: "120px" }}
                          >
                            {statusOptions.map((status) => (
                              <option key={status} value={status}>
                                {status}
                              </option>
                            ))}
                          </Form.Select>
                        </td>
                        <td>
                          <div>{order.orderDate}</div>
                          <small className="text-muted">
                            {order.orderTime}
                          </small>
                        </td>
                        <td>
                          <div className="d-flex gap-1">
                            <Button
                              size="sm"
                              variant="outline-primary"
                              onClick={() => handleViewDetails(order)}
                              className="btn-medical-outline"
                              title="View Order Details"
                            >
                              <i className="bi bi-eye"></i>
                            </Button>
                            <Button
                              size="sm"
                              variant="outline-success"
                              onClick={() => handleViewInvoice(order)}
                              title="View Invoice"
                            >
                              <i className="bi bi-receipt"></i>
                            </Button>
                            <Button
                              size="sm"
                              variant="outline-info"
                              onClick={() => handleDownloadInvoice(order)}
                              title="Download Invoice"
                            >
                              <i className="bi bi-download"></i>
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
              {/* Customer Information */}
              <Card className="mb-4">
                <Card.Header>
                  <h6 className="mb-0">Customer Information</h6>
                </Card.Header>
                <Card.Body>
                  <Row>
                    <Col md={6}>
                      <p>
                        <strong>Name:</strong> {selectedOrder.customerName}
                      </p>
                      <p>
                        <strong>Email:</strong> {selectedOrder.customerEmail}
                      </p>
                      <p>
                        <strong>Phone:</strong> {selectedOrder.customerPhone}
                      </p>
                    </Col>
                    <Col md={6}>
                      <p>
                        <strong>Address:</strong>
                      </p>
                      <p className="text-muted">
                        {selectedOrder.customerAddress}
                      </p>
                    </Col>
                  </Row>
                </Card.Body>
              </Card>

              {/* Order Information */}
              <Card className="mb-4">
                <Card.Header>
                  <h6 className="mb-0">Order Information</h6>
                </Card.Header>
                <Card.Body>
                  <Row>
                    <Col md={6}>
                      <p>
                        <strong>Order ID:</strong> {selectedOrder.id}
                      </p>
                      <p>
                        <strong>Date:</strong> {selectedOrder.orderDate}{" "}
                        {selectedOrder.orderTime}
                      </p>
                    </Col>
                    <Col md={6}>
                      <p>
                        <strong>Payment Method:</strong>{" "}
                        {selectedOrder.paymentMethod}
                      </p>
                      <p>
                        <strong>Status:</strong>
                        <Badge
                          bg={getStatusVariant(selectedOrder.status)}
                          className="ms-2"
                        >
                          {selectedOrder.status}
                        </Badge>
                      </p>
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
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default AdminOrders;
