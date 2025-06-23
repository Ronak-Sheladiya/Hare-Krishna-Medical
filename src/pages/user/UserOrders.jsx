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
} from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { formatDateTime, getRelativeTime } from "../../utils/dateUtils";
import { api, safeApiCall } from "../../utils/apiClient";
import {
  PageHeroSection,
  ThemeCard,
  ThemeButton,
} from "../../components/common/ConsistentTheme";

const UserOrders = () => {
  const navigate = useNavigate();
  const { isAuthenticated, user } = useSelector((state) => state.auth);
  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [dateFilter, setDateFilter] = useState("");

  // Redirect to login if not authenticated
  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: "/user/orders" }} replace />;
  }

  // Redirect admin to admin panel
  if (user?.role === 1) {
    return (
      <div className="fade-in">
        <PageHeroSection
          title="Access Denied"
          description="Administrators should use the admin panel for order management"
          icon="🚫"
        />
        <Container className="py-5 text-center">
          <ThemeCard>
            <Card.Body>
              <h5>You are logged in as an administrator</h5>
              <p className="text-muted">
                Please use the admin panel to manage orders
              </p>
              <Link to="/admin/orders">
                <ThemeButton>Go to Admin Orders</ThemeButton>
              </Link>
            </Card.Body>
          </ThemeCard>
        </Container>
      </div>
    );
  }

  // Fetch user orders
  const fetchUserOrders = async () => {
    setLoading(true);
    setError(null);

    const {
      success,
      data,
      error: apiError,
    } = await safeApiCall(() => api.get("/api/user/orders"), []);

    if (success && data) {
      const ordersData = data.data || data;
      setOrders(ordersData);
      setFilteredOrders(ordersData);
    } else {
      setError(apiError || "Failed to load orders");
      // Keep empty state for offline mode
      setOrders([]);
      setFilteredOrders([]);
    }

    setLoading(false);
  };

  // Cancel order
  const cancelOrder = async (orderId) => {
    if (
      !window.confirm(
        "Are you sure you want to cancel this order? This action cannot be undone.",
      )
    ) {
      return;
    }

    const { success, error: apiError } = await safeApiCall(
      () => api.patch(`/api/user/orders/${orderId}/cancel`),
      null,
    );

    if (success) {
      // Update local state
      setOrders((prev) =>
        prev.map((order) =>
          order._id === orderId ? { ...order, status: "cancelled" } : order,
        ),
      );
      setFilteredOrders((prev) =>
        prev.map((order) =>
          order._id === orderId ? { ...order, status: "cancelled" } : order,
        ),
      );
      alert("Order cancelled successfully");
    } else {
      alert(apiError || "Failed to cancel order");
    }
  };

  // Reorder functionality
  const reorderItems = async (order) => {
    try {
      // Add order items to cart
      const { success, error: apiError } = await safeApiCall(
        () =>
          api.post("/api/user/cart/reorder", {
            orderId: order._id,
            items: order.items,
          }),
        null,
      );

      if (success) {
        alert("Items added to cart successfully!");
        navigate("/cart");
      } else {
        alert(apiError || "Failed to add items to cart");
      }
    } catch (error) {
      console.error("Error reordering items:", error);
      alert("Failed to reorder items");
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
          order.items?.some((item) =>
            item.name?.toLowerCase().includes(searchTerm.toLowerCase()),
          ),
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
        case "year":
          filterDate.setFullYear(today.getFullYear() - 1);
          filtered = filtered.filter(
            (order) => new Date(order.createdAt) >= filterDate,
          );
          break;
      }
    }

    setFilteredOrders(filtered);
  }, [orders, searchTerm, statusFilter, dateFilter]);

  useEffect(() => {
    fetchUserOrders();
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

  const canCancelOrder = (order) => {
    const cancelableStatuses = ["pending", "processing"];
    return cancelableStatuses.includes(order.status?.toLowerCase());
  };

  if (loading) {
    return (
      <div className="fade-in">
        <PageHeroSection
          title="My Orders"
          description="Track and manage your orders"
          icon="📦"
        />
        <Container className="py-5">
          <div
            className="d-flex justify-content-center align-items-center"
            style={{ minHeight: "40vh" }}
          >
            <Spinner animation="border" variant="danger" />
            <span className="ms-2">Loading your orders...</span>
          </div>
        </Container>
      </div>
    );
  }

  return (
    <div className="fade-in">
      <PageHeroSection
        title="My Orders"
        description="Track and manage your orders"
        icon="📦"
      />

      <Container className="py-5">
        {error && (
          <Alert variant="warning" className="mb-4">
            <Alert.Heading>Offline Mode</Alert.Heading>
            <p>{error}</p>
            <ThemeButton variant="outline" onClick={fetchUserOrders}>
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
              <Col md={4}>
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
                  <option value="year">This Year</option>
                </Form.Select>
              </Col>
              <Col md={2}>
                <ThemeButton
                  variant="outline"
                  className="w-100"
                  onClick={fetchUserOrders}
                >
                  🔄 Refresh
                </ThemeButton>
              </Col>
            </Row>
          </Card.Body>
        </ThemeCard>

        {/* Orders Table */}
        <ThemeCard>
          <Card.Header className="bg-gradient text-white d-flex justify-content-between align-items-center">
            <h5 className="mb-0">My Orders ({filteredOrders.length})</h5>
          </Card.Header>
          <Card.Body className="p-0">
            {filteredOrders.length > 0 ? (
              <Table responsive hover className="mb-0">
                <thead className="table-light">
                  <tr>
                    <th>Order ID</th>
                    <th>Items</th>
                    <th>Total</th>
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
                          <span className="badge bg-light text-dark">
                            {order.items?.length || 0} items
                          </span>
                          {order.items?.length > 0 && (
                            <div>
                              <small className="text-muted">
                                {order.items[0]?.name}
                                {order.items.length > 1 &&
                                  ` +${order.items.length - 1} more`}
                              </small>
                            </div>
                          )}
                        </div>
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
                            {order.paymentStatus || "Pending"}
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
                        <div className="d-flex gap-1 flex-wrap">
                          <Button
                            variant="outline-primary"
                            size="sm"
                            onClick={() => handleViewDetails(order)}
                          >
                            👁️ View
                          </Button>
                          {order.status === "delivered" && (
                            <Button
                              variant="outline-success"
                              size="sm"
                              onClick={() => reorderItems(order)}
                            >
                              🔄 Reorder
                            </Button>
                          )}
                          {canCancelOrder(order) && (
                            <Button
                              variant="outline-danger"
                              size="sm"
                              onClick={() => cancelOrder(order._id)}
                            >
                              ❌ Cancel
                            </Button>
                          )}
                        </div>
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
                <h5>No Orders Found</h5>
                <p className="text-muted">
                  {error
                    ? "Unable to load orders. Please check your connection."
                    : searchTerm || statusFilter || dateFilter
                      ? "No orders match your current filters."
                      : "You haven't placed any orders yet."}
                </p>
                {error ? (
                  <ThemeButton onClick={fetchUserOrders}>Try Again</ThemeButton>
                ) : !searchTerm && !statusFilter && !dateFilter ? (
                  <Link to="/products">
                    <ThemeButton>Start Shopping</ThemeButton>
                  </Link>
                ) : (
                  <ThemeButton
                    variant="outline"
                    onClick={() => {
                      setSearchTerm("");
                      setStatusFilter("");
                      setDateFilter("");
                    }}
                  >
                    Clear Filters
                  </ThemeButton>
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
                    <strong>Order Date:</strong>{" "}
                    {formatDateTime(selectedOrder.createdAt)}
                  </Col>
                  <Col md={6}>
                    <strong>Payment Method:</strong>{" "}
                    {selectedOrder.paymentMethod}
                  </Col>
                </Row>
                <Row className="mb-3">
                  <Col md={6}>
                    <strong>Payment Status:</strong>{" "}
                    <Badge
                      bg={getPaymentStatusBadgeColor(
                        selectedOrder.paymentStatus,
                      )}
                    >
                      {selectedOrder.paymentStatus || "Pending"}
                    </Badge>
                  </Col>
                  <Col md={6}>
                    <strong>Total Amount:</strong>{" "}
                    <span className="fw-bold text-success">
                      ₹{selectedOrder.totalAmount?.toLocaleString()}
                    </span>
                  </Col>
                </Row>
                {selectedOrder.trackingNumber && (
                  <Row className="mb-3">
                    <Col md={12}>
                      <strong>Tracking Number:</strong>{" "}
                      {selectedOrder.trackingNumber}
                    </Col>
                  </Row>
                )}
                {selectedOrder.shippingAddress && (
                  <Row className="mb-3">
                    <Col md={12}>
                      <strong>Shipping Address:</strong>
                      <div className="border p-2 rounded bg-light">
                        {typeof selectedOrder.shippingAddress === "string"
                          ? selectedOrder.shippingAddress
                          : `${selectedOrder.shippingAddress.street}, ${selectedOrder.shippingAddress.city}, ${selectedOrder.shippingAddress.state} - ${selectedOrder.shippingAddress.pincode}`}
                      </div>
                    </Col>
                  </Row>
                )}
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
            {selectedOrder?.status === "delivered" && (
              <ThemeButton onClick={() => reorderItems(selectedOrder)}>
                🔄 Reorder Items
              </ThemeButton>
            )}
            {canCancelOrder(selectedOrder) && (
              <ThemeButton
                variant="outline"
                onClick={() => {
                  cancelOrder(selectedOrder._id);
                  setShowDetailsModal(false);
                }}
              >
                ❌ Cancel Order
              </ThemeButton>
            )}
          </Modal.Footer>
        </Modal>
      </Container>
    </div>
  );
};

export default UserOrders;
