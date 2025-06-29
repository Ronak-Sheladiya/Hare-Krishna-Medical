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
  Spinner,
  Alert,
  Dropdown,
} from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import OfficialInvoiceDesign from "../../components/common/OfficialInvoiceDesign.jsx";
import {
  viewInvoice,
  printInvoice,
  downloadInvoice,
  createInvoiceData,
} from "../../utils/invoiceUtils.js";
import { formatDateTime, getRelativeTime } from "../../utils/dateUtils.js";
import { api, safeApiCall } from "../../utils/apiClient.js";
import {
  PageHeroSection,
  ThemeCard,
  ThemeButton,
} from "../../components/common/ConsistentTheme.jsx";
import * as XLSX from "xlsx";

const AdminOrders = () => {
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [showInvoiceModal, setShowInvoiceModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [dateFilter, setDateFilter] = useState("");
  const [updatingStatus, setUpdatingStatus] = useState(null);

  // Fetch all orders
  const fetchOrders = async () => {
    setLoading(true);
    setError(null);

    // Check if user is authenticated first
    const token =
      localStorage.getItem("token") || sessionStorage.getItem("token");
    if (!token) {
      setError("Please log in as an admin to access order management.");
      setLoading(false);
      return;
    }

    const {
      success,
      data,
      error: apiError,
    } = await safeApiCall(() => api.get("/api/admin/orders"), []);

    if (success && data) {
      const ordersData = data.data || data;
      setOrders(ordersData);
      setFilteredOrders(ordersData);
    } else {
      // Handle specific error types
      if (apiError?.includes("401")) {
        setError("Authentication failed. Please log in as an admin.");
      } else if (apiError?.includes("403")) {
        setError("Access denied. Admin privileges required.");
      } else if (apiError?.includes("Network error")) {
        setError(
          "Unable to connect to the backend server. Please check if it's running.",
        );
      } else if (apiError?.includes("timeout")) {
        setError("Server is taking too long to respond. Please try again.");
      } else {
        setError(
          apiError || "Failed to load orders. Please try refreshing the page.",
        );
      }
      // Keep empty state for offline mode
      setOrders([]);
      setFilteredOrders([]);
    }

    setLoading(false);
  };

  // Update order status
  const updateOrderStatus = async (orderId, newStatus) => {
    setUpdatingStatus(orderId);

    const { success, error: apiError } = await safeApiCall(
      () => api.patch(`/api/admin/orders/${orderId}`, { status: newStatus }),
      null,
    );

    if (success) {
      // Update local state
      setOrders((prev) =>
        prev.map((order) =>
          order._id === orderId ? { ...order, status: newStatus } : order,
        ),
      );
      setFilteredOrders((prev) =>
        prev.map((order) =>
          order._id === orderId ? { ...order, status: newStatus } : order,
        ),
      );
    } else {
      alert(apiError || "Failed to update order status");
    }

    setUpdatingStatus(null);
  };

  // Generate invoice for order
  const generateInvoice = async (order) => {
    try {
      const {
        success,
        data,
        error: apiError,
      } = await safeApiCall(
        () => api.post(`/api/admin/orders/${order._id}/generate-invoice`),
        null,
      );

      if (success && data) {
        const invoiceData = createInvoiceData(order, data.data || data);
        setSelectedOrder({ ...order, invoice: invoiceData });
        setShowInvoiceModal(true);
      } else {
        // Fallback - create invoice data locally
        const invoiceData = createInvoiceData(order);
        setSelectedOrder({ ...order, invoice: invoiceData });
        setShowInvoiceModal(true);
      }
    } catch (error) {
      console.error("Error generating invoice:", error);
      alert("Failed to generate invoice");
    }
  };

  // Export orders to Excel
  const exportToExcel = () => {
    try {
      const exportData = filteredOrders.map((order) => ({
        "Order ID": order.orderId || order._id,
        "Customer Name": order.customerName,
        "Customer Email": order.customerEmail,
        "Customer Phone": order.customerPhone,
        "Total Amount": order.totalAmount,
        Status: order.status,
        "Payment Method": order.paymentMethod,
        "Payment Status": order.paymentStatus,
        "Created Date": formatDateTime(order.createdAt),
        "Items Count": order.items?.length || 0,
      }));

      const ws = XLSX.utils.json_to_sheet(exportData);
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, "Orders");
      XLSX.writeFile(
        wb,
        `orders-${new Date().toISOString().split("T")[0]}.xlsx`,
      );
    } catch (error) {
      console.error("Error exporting to Excel:", error);
      alert("Failed to export to Excel");
    }
  };

  // Filter orders based on search and filters
  useEffect(() => {
    let filtered = orders;

    if (searchTerm) {
      filtered = filtered.filter(
        (order) =>
          order.orderId?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          order._id?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          order.customerName
            ?.toLowerCase()
            .includes(searchTerm.toLowerCase()) ||
          order.customerEmail
            ?.toLowerCase()
            .includes(searchTerm.toLowerCase()) ||
          order.customerPhone?.includes(searchTerm),
      );
    }

    if (statusFilter) {
      filtered = filtered.filter((order) => order.status === statusFilter);
    }

    if (dateFilter) {
      const today = new Date();
      const filterDate = new Date(today);

      switch (dateFilter) {
        case "today":
          filtered = filtered.filter((order) => {
            const orderDate = new Date(order.createdAt);
            return orderDate.toDateString() === today.toDateString();
          });
          break;
        case "week":
          filterDate.setDate(today.getDate() - 7);
          filtered = filtered.filter(
            (order) => new Date(order.createdAt) >= filterDate,
          );
          break;
        case "month":
          filterDate.setMonth(today.getMonth() - 1);
          filtered = filtered.filter(
            (order) => new Date(order.createdAt) >= filterDate,
          );
          break;
      }
    }

    setFilteredOrders(filtered);
  }, [orders, searchTerm, statusFilter, dateFilter]);

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleViewDetails = (order) => {
    setSelectedOrder(order);
    setShowDetailsModal(true);
  };

  const getStatusBadgeColor = (status) => {
    switch (status?.toLowerCase()) {
      case "delivered":
        return "success";
      case "processing":
        return "warning";
      case "shipped":
        return "info";
      case "pending":
        return "secondary";
      case "cancelled":
        return "danger";
      default:
        return "primary";
    }
  };

  const getPaymentStatusBadgeColor = (status) => {
    switch (status?.toLowerCase()) {
      case "paid":
        return "success";
      case "pending":
        return "warning";
      case "failed":
        return "danger";
      case "refunded":
        return "info";
      default:
        return "secondary";
    }
  };

  if (loading) {
    return (
      <div
        className="d-flex justify-content-center align-items-center"
        style={{ minHeight: "60vh" }}
      >
        <Spinner animation="border" variant="danger" />
        <span className="ms-2">Loading orders...</span>
      </div>
    );
  }

  return (
    <div className="fade-in">
      <PageHeroSection
        title="Order Management"
        description="Manage and track all customer orders"
        icon={<i className="bi bi-box-seam"></i>}
      />

      <Container className="py-5">
        {error && (
          <Alert variant="warning" className="mb-4">
            <Alert.Heading>Offline Mode</Alert.Heading>
            <p>{error}</p>
            <ThemeButton variant="outline" onClick={fetchOrders}>
              <i className="bi bi-arrow-clockwise me-2"></i>
              Try Again
            </ThemeButton>
          </Alert>
        )}

        {/* Summary Cards */}
        <Row className="mb-4">
          <Col md={3}>
            <ThemeCard className="text-center">
              <Card.Body>
                <h4 className="text-danger">{orders.length}</h4>
                <small className="text-muted">Total Orders</small>
              </Card.Body>
            </ThemeCard>
          </Col>
          <Col md={3}>
            <ThemeCard className="text-center">
              <Card.Body>
                <h4 className="text-warning">
                  {orders.filter((o) => o.status === "pending").length}
                </h4>
                <small className="text-muted">Pending Orders</small>
              </Card.Body>
            </ThemeCard>
          </Col>
          <Col md={3}>
            <ThemeCard className="text-center">
              <Card.Body>
                <h4 className="text-info">
                  {orders.filter((o) => o.status === "processing").length}
                </h4>
                <small className="text-muted">Processing Orders</small>
              </Card.Body>
            </ThemeCard>
          </Col>
          <Col md={3}>
            <ThemeCard className="text-center">
              <Card.Body>
                <h4 className="text-success">
                  {orders.filter((o) => o.status === "delivered").length}
                </h4>
                <small className="text-muted">Delivered Orders</small>
              </Card.Body>
            </ThemeCard>
          </Col>
        </Row>

        {/* Filters and Search */}
        <ThemeCard className="mb-4">
          <Card.Body>
            <Row>
              <Col md={3}>
                <InputGroup>
                  <Form.Control
                    type="text"
                    placeholder="Search orders..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </InputGroup>
              </Col>
              <Col md={3}>
                <Form.Select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                >
                  <option value="">All Status</option>
                  <option value="pending">Pending</option>
                  <option value="processing">Processing</option>
                  <option value="shipped">Shipped</option>
                  <option value="delivered">Delivered</option>
                  <option value="cancelled">Cancelled</option>
                </Form.Select>
              </Col>
              <Col md={3}>
                <Form.Select
                  value={dateFilter}
                  onChange={(e) => setDateFilter(e.target.value)}
                >
                  <option value="">All Time</option>
                  <option value="today">Today</option>
                  <option value="week">This Week</option>
                  <option value="month">This Month</option>
                </Form.Select>
              </Col>
              <Col md={3}>
                <div className="d-flex gap-2">
                  <ThemeButton variant="outline" onClick={exportToExcel}>
                    <i className="bi bi-file-earmark-excel me-2"></i>
                    Export Excel
                  </ThemeButton>
                  <ThemeButton variant="outline" onClick={fetchOrders}>
                    <i className="bi bi-arrow-clockwise me-2"></i>
                    Refresh
                  </ThemeButton>
                </div>
              </Col>
            </Row>
          </Card.Body>
        </ThemeCard>

        {/* Orders Table */}
        <ThemeCard>
          <Card.Header className="bg-gradient text-white d-flex justify-content-between align-items-center">
            <h5 className="mb-0">All Orders ({filteredOrders.length})</h5>
          </Card.Header>
          <Card.Body className="p-0">
            {filteredOrders.length > 0 ? (
              <Table responsive hover className="mb-0">
                <thead className="table-light">
                  <tr>
                    <th>Order ID</th>
                    <th>Customer</th>
                    <th>Items</th>
                    <th>Total Amount</th>
                    <th>Status</th>
                    <th>Payment</th>
                    <th>Date</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredOrders.map((order) => (
                    <tr key={order._id}>
                      <td>
                        <strong>{order.orderId || order._id}</strong>
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
                        <span className="badge bg-light text-dark">
                          {order.items?.length || 0} items
                        </span>
                      </td>
                      <td>
                        <strong>₹{order.totalAmount?.toLocaleString()}</strong>
                      </td>
                      <td>
                        <Badge bg={getStatusBadgeColor(order.status)}>
                          {order.status}
                        </Badge>
                      </td>
                      <td>
                        <div>
                          <Badge
                            bg={getPaymentStatusBadgeColor(order.paymentStatus)}
                          >
                            {order.paymentStatus}
                          </Badge>
                          <br />
                          <small className="text-muted">
                            {order.paymentMethod}
                          </small>
                        </div>
                      </td>
                      <td>
                        <div>
                          <div>{formatDateTime(order.createdAt)}</div>
                          <small className="text-muted">
                            {getRelativeTime(order.createdAt)}
                          </small>
                        </div>
                      </td>
                      <td>
                        <Dropdown>
                          <Dropdown.Toggle
                            variant="outline-secondary"
                            size="sm"
                            className="border-0"
                            disabled={updatingStatus === order._id}
                          >
                            {updatingStatus === order._id ? (
                              <Spinner animation="border" size="sm" />
                            ) : (
                              "Actions"
                            )}
                          </Dropdown.Toggle>
                          <Dropdown.Menu>
                            <Dropdown.Item
                              onClick={() => handleViewDetails(order)}
                            >
                              👁️ View Details
                            </Dropdown.Item>
                            <Dropdown.Item
                              onClick={() => generateInvoice(order)}
                            >
                              🧾 Generate Invoice
                            </Dropdown.Item>
                            <Dropdown.Divider />
                            <Dropdown.Item
                              onClick={() =>
                                updateOrderStatus(order._id, "processing")
                              }
                              disabled={order.status === "processing"}
                            >
                              🔄 Mark Processing
                            </Dropdown.Item>
                            <Dropdown.Item
                              onClick={() =>
                                updateOrderStatus(order._id, "shipped")
                              }
                              disabled={order.status === "shipped"}
                            >
                              🚚 Mark Shipped
                            </Dropdown.Item>
                            <Dropdown.Item
                              onClick={() =>
                                updateOrderStatus(order._id, "delivered")
                              }
                              disabled={order.status === "delivered"}
                            >
                              ✅ Mark Delivered
                            </Dropdown.Item>
                            <Dropdown.Divider />
                            <Dropdown.Item
                              onClick={() =>
                                updateOrderStatus(order._id, "cancelled")
                              }
                              disabled={order.status === "cancelled"}
                              className="text-danger"
                            >
                              ❌ Cancel Order
                            </Dropdown.Item>
                          </Dropdown.Menu>
                        </Dropdown>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            ) : (
              <div className="text-center py-5">
                <div className="mb-3">
                  <span style={{ fontSize: "4rem" }}>📦</span>
                </div>
                <h5>{error ? "Unable to Load Orders" : "No Orders Found"}</h5>
                <p className="text-muted">
                  {error ? error : "No orders match your current filters."}
                </p>
                {error && (
                  <div>
                    <ThemeButton onClick={fetchOrders} className="me-2">
                      <i className="bi bi-arrow-clockwise me-1"></i>
                      Try Again
                    </ThemeButton>
                    {error.includes("log in") && (
                      <div className="mt-3">
                        <Link to="/login" className="btn btn-primary btn-sm">
                          <i className="bi bi-box-arrow-in-right me-1"></i>
                          Go to Login
                        </Link>
                        <div className="mt-2">
                          <small className="text-muted">
                            Use admin credentials to access order management
                          </small>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}
          </Card.Body>
        </ThemeCard>

        {/* Order Details Modal */}
        <Modal
          show={showDetailsModal}
          onHide={() => setShowDetailsModal(false)}
          size="lg"
        >
          <Modal.Header closeButton>
            <Modal.Title>Order Details</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            {selectedOrder && (
              <div>
                <Row className="mb-3">
                  <Col md={6}>
                    <strong>Order ID:</strong>{" "}
                    {selectedOrder.orderId || selectedOrder._id}
                  </Col>
                  <Col md={6}>
                    <strong>Status:</strong>{" "}
                    <Badge bg={getStatusBadgeColor(selectedOrder.status)}>
                      {selectedOrder.status}
                    </Badge>
                  </Col>
                </Row>
                <Row className="mb-3">
                  <Col md={6}>
                    <strong>Customer:</strong> {selectedOrder.customerName}
                  </Col>
                  <Col md={6}>
                    <strong>Phone:</strong> {selectedOrder.customerPhone}
                  </Col>
                </Row>
                <Row className="mb-3">
                  <Col md={12}>
                    <strong>Email:</strong> {selectedOrder.customerEmail}
                  </Col>
                </Row>
                <Row className="mb-3">
                  <Col md={12}>
                    <strong>Shipping Address:</strong>
                    <div className="border p-2 rounded bg-light">
                      {selectedOrder.shippingAddress ? (
                        <div>
                          {selectedOrder.shippingAddress.street},{" "}
                          {selectedOrder.shippingAddress.city},{" "}
                          {selectedOrder.shippingAddress.state} -{" "}
                          {selectedOrder.shippingAddress.pincode}
                        </div>
                      ) : (
                        selectedOrder.customerAddress
                      )}
                    </div>
                  </Col>
                </Row>
                <Row className="mb-3">
                  <Col md={12}>
                    <strong>Items:</strong>
                    <Table size="sm" className="mt-2">
                      <thead>
                        <tr>
                          <th>Product</th>
                          <th>Quantity</th>
                          <th>Price</th>
                          <th>Total</th>
                        </tr>
                      </thead>
                      <tbody>
                        {selectedOrder.items?.map((item, index) => (
                          <tr key={index}>
                            <td>{item.name}</td>
                            <td>{item.quantity}</td>
                            <td>₹{item.price?.toLocaleString()}</td>
                            <td>
                              ₹{(item.quantity * item.price)?.toLocaleString()}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </Table>
                  </Col>
                </Row>
                <Row>
                  <Col md={6}>
                    <strong>Payment Method:</strong>{" "}
                    {selectedOrder.paymentMethod}
                  </Col>
                  <Col md={6}>
                    <strong>Total Amount:</strong>{" "}
                    <span className="fw-bold text-success">
                      ₹{selectedOrder.totalAmount?.toLocaleString()}
                    </span>
                  </Col>
                </Row>
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
            <ThemeButton onClick={() => generateInvoice(selectedOrder)}>
              🧾 Generate Invoice
            </ThemeButton>
          </Modal.Footer>
        </Modal>

        {/* Invoice Modal */}
        <Modal
          show={showInvoiceModal}
          onHide={() => setShowInvoiceModal(false)}
          size="lg"
        >
          <Modal.Header closeButton>
            <Modal.Title>Invoice</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            {selectedOrder?.invoice && (
              <OfficialInvoiceDesign
                invoice={selectedOrder.invoice}
                onPrint={() => window.print()}
                onDownload={() => downloadInvoice(selectedOrder.invoice)}
              />
            )}
          </Modal.Body>
          <Modal.Footer>
            <Button
              variant="secondary"
              onClick={() => setShowInvoiceModal(false)}
            >
              Close
            </Button>
            <ThemeButton onClick={() => printInvoice(selectedOrder?.invoice)}>
              🖨️ Print Invoice
            </ThemeButton>
          </Modal.Footer>
        </Modal>
      </Container>
    </div>
  );
};

export default AdminOrders;
