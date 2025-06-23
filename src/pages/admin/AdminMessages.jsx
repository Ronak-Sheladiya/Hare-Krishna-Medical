import React, { useState, useEffect } from "react";
import {
  Container,
  Row,
  Col,
  Card,
  Table,
  Badge,
  Button,
  Modal,
  Form,
  Alert,
  Dropdown,
  InputGroup,
  Spinner,
  Toast,
  ToastContainer,
} from "react-bootstrap";
import { useSelector, useDispatch } from "react-redux";
import {
  setMessages,
  markMessageAsRead,
  markMessageAsUnread,
  markAllAsRead,
  deleteMessage,
  replyToMessage,
  updateMessageStatus,
} from "../../store/slices/messageSlice";
import {
  getCurrentISOString,
  formatDateTime,
  getRelativeTime,
  sortByDateDesc,
} from "../../utils/dateUtils";
import { api, safeApiCall } from "../../utils/apiClient";
import * as XLSX from "xlsx";

const AdminMessages = () => {
  const dispatch = useDispatch();
  const { messages } = useSelector((state) => state.messages);

  const [filteredMessages, setFilteredMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [priorityFilter, setPriorityFilter] = useState("");
  const [showReplyModal, setShowReplyModal] = useState(false);
  const [selectedMessage, setSelectedMessage] = useState(null);
  const [replyText, setReplyText] = useState("");
  const [sending, setSending] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [toastVariant, setToastVariant] = useState("success");

  // Fetch all messages
  const fetchMessages = async () => {
    setLoading(true);
    setError(null);

    const {
      success,
      data,
      error: apiError,
    } = await safeApiCall(() => api.get("/api/admin/messages"), []);

    if (success && data) {
      const messagesData = data.data || data;
      const sortedMessages = sortByDateDesc(messagesData, "createdAt");
      dispatch(setMessages(sortedMessages));
    } else {
      setError(apiError || "Failed to load messages");
      // Keep current messages state for offline mode
    }

    setLoading(false);
  };

  // Mark message as read
  const handleMarkAsRead = async (messageId) => {
    const { success, error: apiError } = await safeApiCall(
      () => api.patch(`/api/admin/messages/${messageId}/read`),
      null,
    );

    if (success) {
      dispatch(markMessageAsRead(messageId));
      showToastMessage("Message marked as read", "success");
    } else {
      showToastMessage(apiError || "Failed to mark message as read", "danger");
    }
  };

  // Mark message as unread
  const handleMarkAsUnread = async (messageId) => {
    const { success, error: apiError } = await safeApiCall(
      () => api.patch(`/api/admin/messages/${messageId}/unread`),
      null,
    );

    if (success) {
      dispatch(markMessageAsUnread(messageId));
      showToastMessage("Message marked as unread", "success");
    } else {
      showToastMessage(
        apiError || "Failed to mark message as unread",
        "danger",
      );
    }
  };

  // Delete message
  const handleDeleteMessage = async (messageId) => {
    if (!window.confirm("Are you sure you want to delete this message?")) {
      return;
    }

    const { success, error: apiError } = await safeApiCall(
      () => api.delete(`/api/admin/messages/${messageId}`),
      null,
    );

    if (success) {
      dispatch(deleteMessage(messageId));
      showToastMessage("Message deleted successfully", "success");
    } else {
      showToastMessage(apiError || "Failed to delete message", "danger");
    }
  };

  // Update message status
  const handleUpdateStatus = async (messageId, newStatus) => {
    const { success, error: apiError } = await safeApiCall(
      () =>
        api.patch(`/api/admin/messages/${messageId}/status`, {
          status: newStatus,
        }),
      null,
    );

    if (success) {
      dispatch(updateMessageStatus({ messageId, status: newStatus }));
      showToastMessage(`Message status updated to ${newStatus}`, "success");
    } else {
      showToastMessage(apiError || "Failed to update message status", "danger");
    }
  };

  // Send reply
  const handleSendReply = async () => {
    if (!replyText.trim()) return;

    setSending(true);
    const { success, error: apiError } = await safeApiCall(
      () =>
        api.post(`/api/admin/messages/${selectedMessage._id}/reply`, {
          reply: replyText,
        }),
      null,
    );

    if (success) {
      dispatch(
        replyToMessage({
          messageId: selectedMessage._id,
          reply: replyText,
          repliedAt: getCurrentISOString(),
        }),
      );
      setReplyText("");
      setShowReplyModal(false);
      showToastMessage("Reply sent successfully", "success");
    } else {
      showToastMessage(apiError || "Failed to send reply", "danger");
    }

    setSending(false);
  };

  // Mark all as read
  const handleMarkAllAsRead = async () => {
    const { success, error: apiError } = await safeApiCall(
      () => api.patch("/api/admin/messages/mark-all-read"),
      null,
    );

    if (success) {
      dispatch(markAllAsRead());
      showToastMessage("All messages marked as read", "success");
    } else {
      showToastMessage(apiError || "Failed to mark all as read", "danger");
    }
  };

  // Export messages to Excel
  const exportToExcel = () => {
    try {
      const exportData = filteredMessages.map((message) => ({
        Name: message.name,
        Email: message.email,
        Subject: message.subject,
        Message: message.message,
        Status: message.status,
        Priority: message.priority,
        "Created Date": formatDateTime(message.createdAt),
        "Read Status": message.isRead ? "Read" : "Unread",
        Reply: message.reply || "No reply",
      }));

      const ws = XLSX.utils.json_to_sheet(exportData);
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, "Messages");
      XLSX.writeFile(
        wb,
        `messages-${new Date().toISOString().split("T")[0]}.xlsx`,
      );
      showToastMessage("Messages exported successfully", "success");
    } catch (error) {
      console.error("Error exporting messages:", error);
      showToastMessage("Failed to export messages", "danger");
    }
  };

  // Show toast message
  const showToastMessage = (message, variant) => {
    setToastMessage(message);
    setToastVariant(variant);
    setShowToast(true);
  };

  // Filter messages
  useEffect(() => {
    let filtered = messages;

    if (searchTerm) {
      filtered = filtered.filter(
        (message) =>
          message.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          message.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          message.subject?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          message.message?.toLowerCase().includes(searchTerm.toLowerCase()),
      );
    }

    if (statusFilter) {
      filtered = filtered.filter((message) => message.status === statusFilter);
    }

    if (priorityFilter) {
      filtered = filtered.filter(
        (message) => message.priority === priorityFilter,
      );
    }

    setFilteredMessages(filtered);
  }, [messages, searchTerm, statusFilter, priorityFilter]);

  useEffect(() => {
    fetchMessages();
  }, []);

  const getPriorityBadgeColor = (priority) => {
    switch (priority?.toLowerCase()) {
      case "high":
        return "danger";
      case "medium":
        return "warning";
      case "low":
        return "success";
      default:
        return "secondary";
    }
  };

  const getStatusBadgeColor = (status) => {
    switch (status?.toLowerCase()) {
      case "resolved":
        return "success";
      case "pending":
        return "warning";
      case "in_progress":
        return "info";
      case "closed":
        return "secondary";
      default:
        return "primary";
    }
  };

  if (loading) {
    return (
      <div className="fade-in">
        {/* Professional Hero Section */}
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
                <div
                  style={{
                    width: "80px",
                    height: "80px",
                    background: "rgba(255,255,255,0.2)",
                    borderRadius: "50%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    margin: "0 auto 24px",
                    fontSize: "32px",
                  }}
                >
                  <i className="bi bi-chat-left-text"></i>
                </div>
                <h1
                  style={{
                    fontSize: "3rem",
                    fontWeight: "800",
                    marginBottom: "20px",
                    textShadow: "2px 2px 4px rgba(0,0,0,0.3)",
                  }}
                >
                  Message Management
                </h1>
                <p
                  style={{
                    fontSize: "1.2rem",
                    opacity: "0.9",
                    maxWidth: "600px",
                    margin: "0 auto",
                  }}
                >
                  Professional customer communication center
                </p>
              </Col>
            </Row>
          </Container>
        </section>

        <Container className="py-5">
          <div
            className="d-flex justify-content-center align-items-center"
            style={{ minHeight: "40vh" }}
          >
            <Spinner animation="border" variant="danger" />
            <span className="ms-3">Loading messages...</span>
          </div>
        </Container>
      </div>
    );
  }

  return (
    <div className="fade-in">
      {/* Professional Hero Section */}
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
              <div
                style={{
                  width: "80px",
                  height: "80px",
                  background: "rgba(255,255,255,0.2)",
                  borderRadius: "50%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  margin: "0 auto 24px",
                  fontSize: "32px",
                }}
              >
                <i className="bi bi-chat-left-text"></i>
              </div>
              <h1
                style={{
                  fontSize: "3rem",
                  fontWeight: "800",
                  marginBottom: "20px",
                  textShadow: "2px 2px 4px rgba(0,0,0,0.3)",
                }}
              >
                Message Management
              </h1>
              <p
                style={{
                  fontSize: "1.2rem",
                  opacity: "0.9",
                  maxWidth: "600px",
                  margin: "0 auto",
                }}
              >
                Professional customer communication center
              </p>
            </Col>
          </Row>
        </Container>
      </section>

      <Container className="py-5">
        {error && (
          <Alert variant="warning" className="mb-4">
            <Alert.Heading>
              <i className="bi bi-exclamation-triangle me-2"></i>
              Offline Mode
            </Alert.Heading>
            <p>{error}</p>
            <Button
              variant="outline-danger"
              onClick={fetchMessages}
              className="border-2"
            >
              <i className="bi bi-arrow-clockwise me-2"></i>
              Try Again
            </Button>
          </Alert>
        )}

        {/* Professional Statistics Cards */}
        <Row className="mb-5">
          <Col lg={3} md={6} className="mb-4">
            <Card
              style={{
                border: "2px solid #f8f9fa",
                borderRadius: "16px",
                padding: "20px",
                textAlign: "center",
                height: "100%",
                transition: "all 0.3s ease",
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.borderColor = "#e63946";
                e.currentTarget.style.transform = "translateY(-4px)";
                e.currentTarget.style.boxShadow =
                  "0 8px 25px rgba(230, 57, 70, 0.2)";
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.borderColor = "#f8f9fa";
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.boxShadow = "none";
              }}
            >
              <div
                style={{
                  width: "60px",
                  height: "60px",
                  background: "linear-gradient(135deg, #e63946, #dc3545)",
                  borderRadius: "50%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  margin: "0 auto 16px",
                  color: "white",
                  fontSize: "24px",
                }}
              >
                <i className="bi bi-chat-left"></i>
              </div>
              <h3 style={{ color: "#e63946", marginBottom: "8px" }}>
                {messages.length}
              </h3>
              <p style={{ color: "#6c757d", marginBottom: "0" }}>
                Total Messages
              </p>
            </Card>
          </Col>
          <Col lg={3} md={6} className="mb-4">
            <Card
              style={{
                border: "2px solid #f8f9fa",
                borderRadius: "16px",
                padding: "20px",
                textAlign: "center",
                height: "100%",
                transition: "all 0.3s ease",
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.borderColor = "#ffc107";
                e.currentTarget.style.transform = "translateY(-4px)";
                e.currentTarget.style.boxShadow =
                  "0 8px 25px rgba(255, 193, 7, 0.2)";
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.borderColor = "#f8f9fa";
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.boxShadow = "none";
              }}
            >
              <div
                style={{
                  width: "60px",
                  height: "60px",
                  background: "linear-gradient(135deg, #ffc107, #e09000)",
                  borderRadius: "50%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  margin: "0 auto 16px",
                  color: "white",
                  fontSize: "24px",
                }}
              >
                <i className="bi bi-envelope"></i>
              </div>
              <h3 style={{ color: "#ffc107", marginBottom: "8px" }}>
                {messages.filter((m) => !m.isRead).length}
              </h3>
              <p style={{ color: "#6c757d", marginBottom: "0" }}>
                Unread Messages
              </p>
            </Card>
          </Col>
          <Col lg={3} md={6} className="mb-4">
            <Card
              style={{
                border: "2px solid #f8f9fa",
                borderRadius: "16px",
                padding: "20px",
                textAlign: "center",
                height: "100%",
                transition: "all 0.3s ease",
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.borderColor = "#17a2b8";
                e.currentTarget.style.transform = "translateY(-4px)";
                e.currentTarget.style.boxShadow =
                  "0 8px 25px rgba(23, 162, 184, 0.2)";
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.borderColor = "#f8f9fa";
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.boxShadow = "none";
              }}
            >
              <div
                style={{
                  width: "60px",
                  height: "60px",
                  background: "linear-gradient(135deg, #17a2b8, #138496)",
                  borderRadius: "50%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  margin: "0 auto 16px",
                  color: "white",
                  fontSize: "24px",
                }}
              >
                <i className="bi bi-clock"></i>
              </div>
              <h3 style={{ color: "#17a2b8", marginBottom: "8px" }}>
                {messages.filter((m) => m.status === "pending").length}
              </h3>
              <p style={{ color: "#6c757d", marginBottom: "0" }}>
                Pending Messages
              </p>
            </Card>
          </Col>
          <Col lg={3} md={6} className="mb-4">
            <Card
              style={{
                border: "2px solid #f8f9fa",
                borderRadius: "16px",
                padding: "20px",
                textAlign: "center",
                height: "100%",
                transition: "all 0.3s ease",
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.borderColor = "#28a745";
                e.currentTarget.style.transform = "translateY(-4px)";
                e.currentTarget.style.boxShadow =
                  "0 8px 25px rgba(40, 167, 69, 0.2)";
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.borderColor = "#f8f9fa";
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.boxShadow = "none";
              }}
            >
              <div
                style={{
                  width: "60px",
                  height: "60px",
                  background: "linear-gradient(135deg, #28a745, #1e7e34)",
                  borderRadius: "50%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  margin: "0 auto 16px",
                  color: "white",
                  fontSize: "24px",
                }}
              >
                <i className="bi bi-check-circle"></i>
              </div>
              <h3 style={{ color: "#28a745", marginBottom: "8px" }}>
                {messages.filter((m) => m.status === "resolved").length}
              </h3>
              <p style={{ color: "#6c757d", marginBottom: "0" }}>
                Resolved Messages
              </p>
            </Card>
          </Col>
        </Row>

        {/* Professional Filters Section */}
        <Card
          className="mb-4"
          style={{
            border: "2px solid #f8f9fa",
            borderRadius: "16px",
            boxShadow: "0 4px 15px rgba(0,0,0,0.1)",
          }}
        >
          <Card.Body style={{ padding: "30px" }}>
            <Row className="align-items-center">
              <Col lg={3} md={6} className="mb-3">
                <Form.Label className="fw-bold mb-2">
                  <i className="bi bi-search me-2"></i>
                  Search Messages
                </Form.Label>
                <InputGroup>
                  <InputGroup.Text>
                    <i className="bi bi-search"></i>
                  </InputGroup.Text>
                  <Form.Control
                    type="text"
                    placeholder="Search messages..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    style={{ borderLeft: "none" }}
                  />
                </InputGroup>
              </Col>
              <Col lg={2} md={6} className="mb-3">
                <Form.Label className="fw-bold mb-2">
                  <i className="bi bi-funnel me-2"></i>
                  Status
                </Form.Label>
                <Form.Select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                >
                  <option value="">All Status</option>
                  <option value="pending">Pending</option>
                  <option value="in_progress">In Progress</option>
                  <option value="resolved">Resolved</option>
                  <option value="closed">Closed</option>
                </Form.Select>
              </Col>
              <Col lg={2} md={6} className="mb-3">
                <Form.Label className="fw-bold mb-2">
                  <i className="bi bi-flag me-2"></i>
                  Priority
                </Form.Label>
                <Form.Select
                  value={priorityFilter}
                  onChange={(e) => setPriorityFilter(e.target.value)}
                >
                  <option value="">All Priority</option>
                  <option value="high">High</option>
                  <option value="medium">Medium</option>
                  <option value="low">Low</option>
                </Form.Select>
              </Col>
              <Col lg={5} md={6} className="mb-3">
                <Form.Label className="fw-bold mb-2">
                  <i className="bi bi-gear me-2"></i>
                  Actions
                </Form.Label>
                <div className="d-flex gap-2">
                  <Button
                    variant="outline-success"
                    size="sm"
                    onClick={handleMarkAllAsRead}
                    className="d-flex align-items-center"
                  >
                    <i className="bi bi-check2-all me-1"></i>
                    Mark All Read
                  </Button>
                  <Button
                    variant="outline-primary"
                    size="sm"
                    onClick={exportToExcel}
                    className="d-flex align-items-center"
                  >
                    <i className="bi bi-file-earmark-excel me-1"></i>
                    Export Excel
                  </Button>
                  <Button
                    variant="outline-secondary"
                    size="sm"
                    onClick={fetchMessages}
                    className="d-flex align-items-center"
                  >
                    <i className="bi bi-arrow-clockwise me-1"></i>
                    Refresh
                  </Button>
                </div>
              </Col>
            </Row>
          </Card.Body>
        </Card>

        {/* Professional Messages Table */}
        <Card
          style={{
            border: "2px solid #f8f9fa",
            borderRadius: "16px",
            boxShadow: "0 4px 15px rgba(0,0,0,0.1)",
            overflow: "hidden",
          }}
        >
          <Card.Header
            style={{
              background: "linear-gradient(135deg, #e63946 0%, #dc3545 100%)",
              color: "white",
              padding: "20px 30px",
              border: "none",
            }}
          >
            <h5 className="mb-0 d-flex align-items-center">
              <i className="bi bi-chat-left-text me-2"></i>
              All Messages ({filteredMessages.length})
            </h5>
          </Card.Header>
          <Card.Body className="p-0">
            {filteredMessages.length > 0 ? (
              <Table responsive hover className="mb-0">
                <thead
                  style={{
                    backgroundColor: "#f8f9fa",
                    borderBottom: "2px solid #dee2e6",
                  }}
                >
                  <tr key="messages-header">
                    <th style={{ padding: "16px 20px", fontWeight: "600" }}>
                      <i className="bi bi-person-circle me-2"></i>
                      Sender
                    </th>
                    <th style={{ padding: "16px 20px", fontWeight: "600" }}>
                      <i className="bi bi-chat-square-text me-2"></i>
                      Subject
                    </th>
                    <th style={{ padding: "16px 20px", fontWeight: "600" }}>
                      <i className="bi bi-flag me-2"></i>
                      Priority
                    </th>
                    <th style={{ padding: "16px 20px", fontWeight: "600" }}>
                      <i className="bi bi-circle me-2"></i>
                      Status
                    </th>
                    <th style={{ padding: "16px 20px", fontWeight: "600" }}>
                      <i className="bi bi-calendar me-2"></i>
                      Date
                    </th>
                    <th style={{ padding: "16px 20px", fontWeight: "600" }}>
                      <i className="bi bi-gear me-2"></i>
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {filteredMessages.map((message, index) => (
                    <tr
                      key={message._id || `message-${index}`}
                      style={{
                        backgroundColor: !message.isRead
                          ? "#fff3cd"
                          : "transparent",
                        borderLeft: !message.isRead
                          ? "4px solid #ffc107"
                          : "4px solid transparent",
                      }}
                    >
                      <td style={{ padding: "16px 20px" }}>
                        <div>
                          <div className="fw-bold d-flex align-items-center">
                            <i className="bi bi-person-fill me-2 text-muted"></i>
                            {message.name}
                          </div>
                          <small className="text-muted d-flex align-items-center">
                            <i className="bi bi-envelope me-1"></i>
                            {message.email}
                          </small>
                        </div>
                      </td>
                      <td style={{ padding: "16px 20px" }}>
                        <div>
                          <div className="fw-bold">{message.subject}</div>
                          <small className="text-muted">
                            {message.message?.substring(0, 50)}...
                          </small>
                        </div>
                      </td>
                      <td style={{ padding: "16px 20px" }}>
                        <Badge
                          bg={getPriorityBadgeColor(message.priority)}
                          style={{ fontSize: "12px", padding: "6px 12px" }}
                        >
                          {message.priority || "Medium"}
                        </Badge>
                      </td>
                      <td style={{ padding: "16px 20px" }}>
                        <Badge
                          bg={getStatusBadgeColor(message.status)}
                          style={{ fontSize: "12px", padding: "6px 12px" }}
                        >
                          {message.status || "Pending"}
                        </Badge>
                      </td>
                      <td style={{ padding: "16px 20px" }}>
                        <div>
                          <div className="fw-bold">
                            {formatDateTime(message.createdAt)}
                          </div>
                          <small className="text-muted">
                            {getRelativeTime(message.createdAt)}
                          </small>
                        </div>
                      </td>
                      <td style={{ padding: "16px 20px" }}>
                        <Dropdown>
                          <Dropdown.Toggle
                            variant="outline-secondary"
                            size="sm"
                            style={{
                              border: "2px solid #dee2e6",
                              borderRadius: "8px",
                              padding: "6px 12px",
                            }}
                          >
                            <i className="bi bi-three-dots me-1"></i>
                            Actions
                          </Dropdown.Toggle>
                          <Dropdown.Menu>
                            <Dropdown.Item
                              key={`reply-${message._id || index}`}
                              onClick={() => {
                                setSelectedMessage(message);
                                setShowReplyModal(true);
                              }}
                              className="d-flex align-items-center"
                            >
                              <i className="bi bi-reply me-2"></i>
                              Reply
                            </Dropdown.Item>
                            <Dropdown.Divider
                              key={`divider1-${message._id || index}`}
                            />
                            {!message.isRead ? (
                              <Dropdown.Item
                                key={`read-${message._id || index}`}
                                onClick={() => handleMarkAsRead(message._id)}
                                className="d-flex align-items-center"
                              >
                                <i className="bi bi-check me-2"></i>
                                Mark as Read
                              </Dropdown.Item>
                            ) : (
                              <Dropdown.Item
                                key={`unread-${message._id || index}`}
                                onClick={() => handleMarkAsUnread(message._id)}
                                className="d-flex align-items-center"
                              >
                                <i className="bi bi-envelope me-2"></i>
                                Mark as Unread
                              </Dropdown.Item>
                            )}
                            <Dropdown.Divider
                              key={`divider2-${message._id || index}`}
                            />
                            <Dropdown.Item
                              key={`progress-${message._id || index}`}
                              onClick={() =>
                                handleUpdateStatus(message._id, "in_progress")
                              }
                              className="d-flex align-items-center"
                            >
                              <i className="bi bi-arrow-clockwise me-2"></i>
                              In Progress
                            </Dropdown.Item>
                            <Dropdown.Item
                              key={`resolve-${message._id || index}`}
                              onClick={() =>
                                handleUpdateStatus(message._id, "resolved")
                              }
                              className="d-flex align-items-center"
                            >
                              <i className="bi bi-check-circle me-2"></i>
                              Resolve
                            </Dropdown.Item>
                            <Dropdown.Item
                              key={`close-${message._id || index}`}
                              onClick={() =>
                                handleUpdateStatus(message._id, "closed")
                              }
                              className="d-flex align-items-center"
                            >
                              <i className="bi bi-x-circle me-2"></i>
                              Close
                            </Dropdown.Item>
                            <Dropdown.Divider
                              key={`divider3-${message._id || index}`}
                            />
                            <Dropdown.Item
                              key={`delete-${message._id || index}`}
                              onClick={() => handleDeleteMessage(message._id)}
                              className="text-danger d-flex align-items-center"
                            >
                              <i className="bi bi-trash me-2"></i>
                              Delete
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
                  <div
                    style={{
                      width: "80px",
                      height: "80px",
                      background: "linear-gradient(135deg, #f8f9fa, #e9ecef)",
                      borderRadius: "50%",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      margin: "0 auto",
                      fontSize: "32px",
                      color: "#6c757d",
                    }}
                  >
                    <i className="bi bi-chat-left-text"></i>
                  </div>
                </div>
                <h5>No Messages Found</h5>
                <p className="text-muted">
                  {error
                    ? "Unable to load messages. Please check your connection."
                    : "No messages match your current filters."}
                </p>
                {error && (
                  <Button variant="outline-danger" onClick={fetchMessages}>
                    <i className="bi bi-arrow-clockwise me-2"></i>
                    Try Again
                  </Button>
                )}
              </div>
            )}
          </Card.Body>
        </Card>

        {/* Professional Reply Modal */}
        <Modal
          show={showReplyModal}
          onHide={() => setShowReplyModal(false)}
          size="lg"
          style={{ zIndex: 1060 }}
        >
          <Modal.Header
            closeButton
            style={{
              background: "linear-gradient(135deg, #e63946 0%, #dc3545 100%)",
              color: "white",
              border: "none",
            }}
          >
            <Modal.Title className="d-flex align-items-center">
              <i className="bi bi-reply me-2"></i>
              Reply to Message
            </Modal.Title>
          </Modal.Header>
          <Modal.Body style={{ padding: "30px" }}>
            {selectedMessage && (
              <div>
                <div className="mb-4 p-3 bg-light rounded">
                  <div className="mb-2">
                    <strong>
                      <i className="bi bi-person-fill me-2"></i>
                      From:
                    </strong>{" "}
                    {selectedMessage.name} ({selectedMessage.email})
                  </div>
                  <div className="mb-2">
                    <strong>
                      <i className="bi bi-chat-square-text me-2"></i>
                      Subject:
                    </strong>{" "}
                    {selectedMessage.subject}
                  </div>
                  <div className="mb-3">
                    <strong>
                      <i className="bi bi-envelope me-2"></i>
                      Original Message:
                    </strong>
                    <div
                      className="border p-3 bg-white rounded mt-2"
                      style={{ fontSize: "14px", lineHeight: "1.6" }}
                    >
                      {selectedMessage.message}
                    </div>
                  </div>
                </div>
                <Form.Group>
                  <Form.Label className="fw-bold">
                    <i className="bi bi-pencil me-2"></i>
                    Your Reply:
                  </Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={5}
                    value={replyText}
                    onChange={(e) => setReplyText(e.target.value)}
                    placeholder="Type your professional reply here..."
                    style={{
                      border: "2px solid #dee2e6",
                      borderRadius: "8px",
                      padding: "12px",
                    }}
                  />
                </Form.Group>
              </div>
            )}
          </Modal.Body>
          <Modal.Footer style={{ padding: "20px 30px" }}>
            <Button
              variant="secondary"
              onClick={() => setShowReplyModal(false)}
              className="d-flex align-items-center"
            >
              <i className="bi bi-x me-2"></i>
              Cancel
            </Button>
            <Button
              variant="danger"
              onClick={handleSendReply}
              disabled={sending}
              className="d-flex align-items-center"
              style={{
                background: "linear-gradient(135deg, #e63946 0%, #dc3545 100%)",
                border: "none",
                padding: "8px 20px",
              }}
            >
              {sending ? (
                <>
                  <Spinner animation="border" size="sm" className="me-2" />
                  Sending...
                </>
              ) : (
                <>
                  <i className="bi bi-send me-2"></i>
                  Send Reply
                </>
              )}
            </Button>
          </Modal.Footer>
        </Modal>

        {/* Professional Toast Notifications */}
        <ToastContainer position="top-end" className="p-3">
          <Toast
            show={showToast}
            onClose={() => setShowToast(false)}
            delay={3000}
            autohide
            bg={toastVariant}
            style={{
              borderRadius: "12px",
              border: "none",
              boxShadow: "0 8px 25px rgba(0,0,0,0.15)",
            }}
          >
            <Toast.Header style={{ border: "none", paddingBottom: "8px" }}>
              <div className="d-flex align-items-center">
                <i className="bi bi-check-circle-fill me-2"></i>
                <strong className="me-auto">Message Management</strong>
              </div>
            </Toast.Header>
            <Toast.Body className="text-white" style={{ fontSize: "14px" }}>
              {toastMessage}
            </Toast.Body>
          </Toast>
        </ToastContainer>
      </Container>
    </div>
  );
};

export default AdminMessages;
