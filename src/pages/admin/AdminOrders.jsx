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
import { useNavigate } from "react-router-dom";
import OfficialInvoiceDesign from "../../components/common/OfficialInvoiceDesign";
import {
  viewInvoice,
  printInvoice,
  downloadInvoice,
  createInvoiceData,
} from "../../utils/invoiceUtils.js";

const AdminOrders = () => {
  const navigate = useNavigate();
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
      customerPhone: "+91 9876543211",
      customerAddress: "456 Health Avenue, Surat, Gujarat, 395008",
      items: [
        {
          name: "Cough Syrup",
          quantity: 1,
          price: 35.75,
          total: 35.75,
        },
      ],
      subtotal: 35.75,
      shipping: 0,
      tax: 1.79,
      total: 37.54,
      status: "Delivered",
      orderDate: "2024-01-14",
      orderTime: "16:45:12",
      paymentMethod: "Online Payment",
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

  const handleViewInvoicePopup = async (order) => {
    try {
      const invoiceData = createInvoiceData(order);
      await viewInvoice(invoiceData);
    } catch (error) {
      console.error("Error viewing invoice:", error);
      alert("Error viewing invoice. Please try again.");
    }
  };

  const handleDirectPrint = async (order) => {
    try {
      const invoiceData = createInvoiceData(order);
      await printInvoice(invoiceData);
    } catch (error) {
      console.error("Error printing invoice:", error);
      alert("Error printing invoice. Please try again.");
    }
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
    <div className="fade-in admin-page-content" data-page="admin">
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
                Manage Orders
              </h1>
              <p
                style={{
                  fontSize: "1.2rem",
                  opacity: "0.9",
                  maxWidth: "600px",
                  margin: "0 auto",
                }}
              >
                Track and manage customer orders and deliveries
              </p>
            </Col>
          </Row>
        </Container>
      </section>

      {/* Orders Management Content */}
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
            <Col lg={8}>
              <h2 style={{ color: "#333333", fontWeight: "700" }}>
                Order Management
              </h2>
              <p style={{ color: "#495057" }}>
                Monitor and manage customer orders
              </p>
            </Col>
          </Row>

          {/* Status Overview */}
          <Row className="mb-4">
            {statusOptions.map((status) => (
              <Col lg={2} md={4} sm={6} key={status} className="mb-3">
                <Card
                  style={{
                    border: "2px solid #f8f9fa",
                    borderRadius: "16px",
                    textAlign: "center",
                    height: "100%",
                    boxShadow: "0 8px 25px rgba(0,0,0,0.05)",
                  }}
                >
                  <Card.Body>
                    <h3 style={{ color: "#e63946", fontWeight: "800" }}>
                      {statusCounts[status] || 0}
                    </h3>
                    <p style={{ color: "#495057", marginBottom: 0 }}>
                      {status}
                    </p>
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>

          {/* Filters */}
          <Row className="mb-4">
            <Col lg={6} className="mb-3">
              <InputGroup>
                <InputGroup.Text>
                  <i className="bi bi-search"></i>
                </InputGroup.Text>
                <Form.Control
                  type="text"
                  placeholder="Search orders..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </InputGroup>
            </Col>
            <Col lg={3} className="mb-3">
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
            <Col lg={3} className="mb-3">
              <Button
                variant="outline-secondary"
                onClick={() => {
                  setSearchTerm("");
                  setStatusFilter("");
                }}
                style={{ width: "100%" }}
              >
                Clear Filters
              </Button>
            </Col>
          </Row>

          {/* Orders Table */}
          <Row>
            <Col lg={12}>
              <Card
                style={{
                  border: "2px solid #f8f9fa",
                  borderRadius: "16px",
                  boxShadow: "0 8px 25px rgba(0,0,0,0.05)",
                }}
              >
                <Card.Header
                  style={{
                    background: "linear-gradient(135deg, #e63946, #dc3545)",
                    color: "white",
                    borderRadius: "16px 16px 0 0",
                    padding: "20px 30px",
                  }}
                >
                  <h5 style={{ margin: 0, fontWeight: "700" }}>
                    <i className="bi bi-bag-check me-2"></i>
                    Orders ({filteredOrders.length})
                  </h5>
                </Card.Header>
                <Card.Body style={{ padding: 0 }}>
                  {filteredOrders.length === 0 ? (
                    <div
                      className="text-center"
                      style={{ padding: "60px 20px" }}
                    >
                      <i
                        className="bi bi-bag display-1 mb-3"
                        style={{ color: "#e9ecef" }}
                      ></i>
                      <h4 style={{ color: "#495057" }}>No orders found</h4>
                      <p style={{ color: "#6c757d" }}>
                        Try adjusting your search criteria
                      </p>
                    </div>
                  ) : (
                    <div className="table-responsive">
                      <Table className="mb-0">
                        <thead style={{ background: "#f8f9fa" }}>
                          <tr>
                            <th style={{ padding: "16px", fontWeight: "600" }}>
                              Order ID
                            </th>
                            <th style={{ padding: "16px", fontWeight: "600" }}>
                              Customer
                            </th>
                            <th style={{ padding: "16px", fontWeight: "600" }}>
                              Items
                            </th>
                            <th style={{ padding: "16px", fontWeight: "600" }}>
                              Total
                            </th>
                            <th style={{ padding: "16px", fontWeight: "600" }}>
                              Status
                            </th>
                            <th style={{ padding: "16px", fontWeight: "600" }}>
                              Date
                            </th>
                            <th style={{ padding: "16px", fontWeight: "600" }}>
                              Actions
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          {filteredOrders.map((order) => (
                            <tr
                              key={order.id}
                              style={{ borderBottom: "1px solid #e9ecef" }}
                            >
                              <td style={{ padding: "16px" }}>
                                <span
                                  style={{
                                    fontWeight: "600",
                                    color: "#e63946",
                                  }}
                                >
                                  {order.id}
                                </span>
                              </td>
                              <td style={{ padding: "16px" }}>
                                <div>
                                  <div
                                    style={{
                                      fontWeight: "600",
                                      color: "#333333",
                                    }}
                                  >
                                    {order.customerName}
                                  </div>
                                  <div
                                    style={{
                                      fontSize: "12px",
                                      color: "#6c757d",
                                    }}
                                  >
                                    {order.customerEmail}
                                  </div>
                                </div>
                              </td>
                              <td style={{ padding: "16px" }}>
                                <span
                                  style={{
                                    fontWeight: "600",
                                    color: "#495057",
                                  }}
                                >
                                  {order.items.length} item
                                  {order.items.length > 1 ? "s" : ""}
                                </span>
                              </td>
                              <td style={{ padding: "16px" }}>
                                <span
                                  style={{
                                    fontWeight: "700",
                                    color: "#333333",
                                    fontSize: "16px",
                                  }}
                                >
                                  ₹{order.total.toFixed(2)}
                                </span>
                              </td>
                              <td style={{ padding: "16px" }}>
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
                              <td style={{ padding: "16px" }}>
                                <div
                                  style={{
                                    fontSize: "12px",
                                    color: "#6c757d",
                                  }}
                                >
                                  {order.orderDate}
                                  <br />
                                  {order.orderTime}
                                </div>
                              </td>
                              <td style={{ padding: "16px" }}>
                                <div className="d-flex gap-1">
                                  <Button
                                    size="sm"
                                    variant="outline-primary"
                                    onClick={() => handleViewDetails(order)}
                                    title="View Details"
                                    style={{
                                      borderColor: "#e63946",
                                      color: "#e63946",
                                    }}
                                  >
                                    <i className="bi bi-eye"></i>
                                  </Button>
                                  <Button
                                    size="sm"
                                    variant="outline-success"
                                    title="View Invoice in Popup"
                                    onClick={() =>
                                      handleViewInvoicePopup(order)
                                    }
                                  >
                                    <i className="bi bi-receipt"></i>
                                  </Button>
                                  <Button
                                    size="sm"
                                    variant="outline-info"
                                    title="Print Invoice Directly"
                                    onClick={() => handleDirectPrint(order)}
                                  >
                                    <i className="bi bi-printer"></i>
                                  </Button>
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </Table>
                    </div>
                  )}
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Container>
      </section>

      {/* Order Details Modal */}
      <Modal
        show={showDetailsModal}
        onHide={() => setShowDetailsModal(false)}
        size="lg"
      >
        <Modal.Header
          closeButton
          style={{
            background: "linear-gradient(135deg, #e63946, #dc3545)",
            color: "white",
          }}
        >
          <Modal.Title>
            <i className="bi bi-bag-check me-2"></i>
            Order Details - {selectedOrder?.id}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body style={{ padding: "30px" }}>
          {selectedOrder && (
            <div>
              <Row className="mb-4">
                <Col md={6}>
                  <h6 style={{ color: "#e63946", marginBottom: "10px" }}>
                    Customer Information
                  </h6>
                  <div style={{ fontSize: "14px", lineHeight: "1.6" }}>
                    <div>
                      <strong>Name:</strong> {selectedOrder.customerName}
                    </div>
                    <div>
                      <strong>Email:</strong> {selectedOrder.customerEmail}
                    </div>
                    <div>
                      <strong>Phone:</strong> {selectedOrder.customerPhone}
                    </div>
                    <div>
                      <strong>Address:</strong> {selectedOrder.customerAddress}
                    </div>
                  </div>
                </Col>
                <Col md={6}>
                  <h6 style={{ color: "#e63946", marginBottom: "10px" }}>
                    Order Information
                  </h6>
                  <div style={{ fontSize: "14px", lineHeight: "1.6" }}>
                    <div>
                      <strong>Order ID:</strong> {selectedOrder.id}
                    </div>
                    <div>
                      <strong>Date:</strong> {selectedOrder.orderDate}
                    </div>
                    <div>
                      <strong>Time:</strong> {selectedOrder.orderTime}
                    </div>
                    <div>
                      <strong>Payment:</strong> {selectedOrder.paymentMethod}
                    </div>
                    <div>
                      <strong>Status:</strong>{" "}
                      <Badge bg={getStatusVariant(selectedOrder.status)}>
                        {selectedOrder.status}
                      </Badge>
                    </div>
                  </div>
                </Col>
              </Row>

              <h6 style={{ color: "#e63946", marginBottom: "15px" }}>
                Order Items
              </h6>
              <Table striped bordered hover size="sm">
                <thead>
                  <tr>
                    <th>Product</th>
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
                      <td>₹{item.price.toFixed(2)}</td>
                      <td>₹{item.total.toFixed(2)}</td>
                    </tr>
                  ))}
                </tbody>
              </Table>

              <div className="text-end mt-3">
                <div>
                  <strong>
                    Subtotal: ₹{selectedOrder.subtotal.toFixed(2)}
                  </strong>
                </div>
                <div>
                  <strong>
                    Shipping: ₹{selectedOrder.shipping.toFixed(2)}
                  </strong>
                </div>
                <div>
                  <strong>Tax: ₹{selectedOrder.tax.toFixed(2)}</strong>
                </div>
                <div
                  style={{
                    fontSize: "18px",
                    color: "#e63946",
                    marginTop: "10px",
                  }}
                >
                  <strong>Total: ₹{selectedOrder.total.toFixed(2)}</strong>
                </div>
              </div>
            </div>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant="outline-secondary"
            onClick={() => setShowDetailsModal(false)}
          >
            Close
          </Button>
          <Button
            style={{ background: "#e63946", border: "none" }}
            onClick={() => {
              setShowDetailsModal(false);
              // Trigger invoice generation
            }}
          >
            <i className="bi bi-receipt me-2"></i>
            Generate Invoice
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default AdminOrders;
