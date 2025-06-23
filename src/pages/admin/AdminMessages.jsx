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
import {
  PageHeroSection,
  ThemeCard,
  ThemeButton,
} from "../../components/common/ConsistentTheme";
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
      <div
        className="d-flex justify-content-center align-items-center"
        style={{ minHeight: "60vh" }}
      >
        <Spinner animation="border" variant="danger" />
        <span className="ms-2">Loading messages...</span>
      </div>
    );
  }

  return (
    <div className="fade-in">
      <PageHeroSection
        title="Message Management"
        description="Manage customer inquiries and support messages"
        icon="💬"
      />

      <Container className="py-5">
        {error && (
          <Alert variant="warning" className="mb-4">
            <Alert.Heading>Offline Mode</Alert.Heading>
            <p>{error}</p>
            <ThemeButton variant="outline" onClick={fetchMessages}>
              Try Again
            </ThemeButton>
          </Alert>
        )}

        {/* Summary Cards */}
        <Row className="mb-4">
          <Col md={3} key="total-messages">
            <ThemeCard className="text-center">
              <Card.Body>
                <h4 className="text-danger">{messages.length}</h4>
                <small className="text-muted">Total Messages</small>
              </Card.Body>
            </ThemeCard>
          </Col>
          <Col md={3} key="unread-messages">
            <ThemeCard className="text-center">
              <Card.Body>
                <h4 className="text-warning">
                  {messages.filter((m) => !m.isRead).length}
                </h4>
                <small className="text-muted">Unread Messages</small>
              </Card.Body>
            </ThemeCard>
          </Col>
          <Col md={3} key="pending-messages">
            <ThemeCard className="text-center">
              <Card.Body>
                <h4 className="text-info">
                  {messages.filter((m) => m.status === "pending").length}
                </h4>
                <small className="text-muted">Pending Messages</small>
              </Card.Body>
            </ThemeCard>
          </Col>
          <Col md={3} key="resolved-messages">
            <ThemeCard className="text-center">
              <Card.Body>
                <h4 className="text-success">
                  {messages.filter((m) => m.status === "resolved").length}
                </h4>
                <small className="text-muted">Resolved Messages</small>
              </Card.Body>
            </ThemeCard>
          </Col>
        </Row>

        {/* Filters and Actions */}
        <ThemeCard className="mb-4">
          <Card.Body>
            <Row>
              <Col md={3} key="search-col">
                <InputGroup>
                  <Form.Control
                    type="text"
                    placeholder="Search messages..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </InputGroup>
              </Col>
              <Col md={2} key="status-filter-col">
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
              <Col md={2} key="priority-filter-col">
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
              <Col md={5} key="actions-col">
                <div className="d-flex gap-2">
                  <ThemeButton
                    variant="outline"
                    size="sm"
                    onClick={handleMarkAllAsRead}
                  >
                    ✅ Mark All Read
                  </ThemeButton>
                  <ThemeButton
                    variant="outline"
                    size="sm"
                    onClick={exportToExcel}
                  >
                    📊 Export Excel
                  </ThemeButton>
                  <ThemeButton
                    variant="outline"
                    size="sm"
                    onClick={fetchMessages}
                  >
                    🔄 Refresh
                  </ThemeButton>
                </div>
              </Col>
            </Row>
          </Card.Body>
        </ThemeCard>

        {/* Messages Table */}
        <ThemeCard>
          <Card.Header className="bg-gradient text-white d-flex justify-content-between align-items-center">
            <h5 className="mb-0">All Messages ({filteredMessages.length})</h5>
          </Card.Header>
          <Card.Body className="p-0">
            {filteredMessages.length > 0 ? (
              <Table responsive hover className="mb-0">
                <thead className="table-light">
                  <tr key="messages-header">
                    <th>Sender</th>
                    <th>Subject</th>
                    <th>Priority</th>
                    <th>Status</th>
                    <th>Date</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredMessages.map((message, index) => (
                    <tr
                      key={message._id || `message-${index}`}
                      className={!message.isRead ? "table-warning" : ""}
                    >
                      <td>
                        <div>
                          <div className="fw-bold">{message.name}</div>
                          <small className="text-muted">{message.email}</small>
                        </div>
                      </td>
                      <td>
                        <div>
                          <div className="fw-bold">{message.subject}</div>
                          <small className="text-muted">
                            {message.message?.substring(0, 50)}...
                          </small>
                        </div>
                      </td>
                      <td>
                        <Badge bg={getPriorityBadgeColor(message.priority)}>
                          {message.priority || "Medium"}
                        </Badge>
                      </td>
                      <td>
                        <Badge bg={getStatusBadgeColor(message.status)}>
                          {message.status || "Pending"}
                        </Badge>
                      </td>
                      <td>
                        <div>
                          <div>{formatDateTime(message.createdAt)}</div>
                          <small className="text-muted">
                            {getRelativeTime(message.createdAt)}
                          </small>
                        </div>
                      </td>
                      <td>
                        <Dropdown>
                          <Dropdown.Toggle
                            variant="outline-secondary"
                            size="sm"
                            className="border-0"
                          >
                            Actions
                          </Dropdown.Toggle>
                          <Dropdown.Menu>
                            <Dropdown.Item
                              key={`reply-${message._id || index}`}
                              onClick={() => {
                                setSelectedMessage(message);
                                setShowReplyModal(true);
                              }}
                            >
                              💬 Reply
                            </Dropdown.Item>
                            <Dropdown.Divider
                              key={`divider1-${message._id || index}`}
                            />
                            {!message.isRead ? (
                              <Dropdown.Item
                                key={`read-${message._id || index}`}
                                onClick={() => handleMarkAsRead(message._id)}
                              >
                                ✅ Mark as Read
                              </Dropdown.Item>
                            ) : (
                              <Dropdown.Item
                                key={`unread-${message._id || index}`}
                                onClick={() => handleMarkAsUnread(message._id)}
                              >
                                📧 Mark as Unread
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
                            >
                              🔄 In Progress
                            </Dropdown.Item>
                            <Dropdown.Item
                              key={`resolve-${message._id || index}`}
                              onClick={() =>
                                handleUpdateStatus(message._id, "resolved")
                              }
                            >
                              ✅ Resolve
                            </Dropdown.Item>
                            <Dropdown.Item
                              key={`close-${message._id || index}`}
                              onClick={() =>
                                handleUpdateStatus(message._id, "closed")
                              }
                            >
                              🔒 Close
                            </Dropdown.Item>
                            <Dropdown.Divider
                              key={`divider3-${message._id || index}`}
                            />
                            <Dropdown.Item
                              key={`delete-${message._id || index}`}
                              onClick={() => handleDeleteMessage(message._id)}
                              className="text-danger"
                            >
                              🗑️ Delete
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
                  <span style={{ fontSize: "4rem" }}>💬</span>
                </div>
                <h5>No Messages Found</h5>
                <p className="text-muted">
                  {error
                    ? "Unable to load messages. Please check your connection."
                    : "No messages match your current filters."}
                </p>
                {error && (
                  <ThemeButton onClick={fetchMessages}>Try Again</ThemeButton>
                )}
              </div>
            )}
          </Card.Body>
        </ThemeCard>

        {/* Reply Modal */}
        <Modal
          show={showReplyModal}
          onHide={() => setShowReplyModal(false)}
          size="lg"
        >
          <Modal.Header closeButton>
            <Modal.Title>Reply to Message</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            {selectedMessage && (
              <div>
                <div className="mb-3">
                  <strong>From:</strong> {selectedMessage.name} (
                  {selectedMessage.email})
                </div>
                <div className="mb-3">
                  <strong>Subject:</strong> {selectedMessage.subject}
                </div>
                <div className="mb-3">
                  <strong>Original Message:</strong>
                  <div className="border p-3 bg-light rounded">
                    {selectedMessage.message}
                  </div>
                </div>
                <Form.Group>
                  <Form.Label>Your Reply:</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={5}
                    value={replyText}
                    onChange={(e) => setReplyText(e.target.value)}
                    placeholder="Type your reply here..."
                  />
                </Form.Group>
              </div>
            )}
          </Modal.Body>
          <Modal.Footer>
            <Button
              variant="secondary"
              onClick={() => setShowReplyModal(false)}
            >
              Cancel
            </Button>
            <ThemeButton onClick={handleSendReply} disabled={sending}>
              {sending ? (
                <>
                  <Spinner animation="border" size="sm" className="me-1" />
                  Sending...
                </>
              ) : (
                "📤 Send Reply"
              )}
            </ThemeButton>
          </Modal.Footer>
        </Modal>

        {/* Toast Notifications */}
        <ToastContainer position="top-end" className="p-3">
          <Toast
            show={showToast}
            onClose={() => setShowToast(false)}
            delay={3000}
            autohide
            bg={toastVariant}
          >
            <Toast.Header>
              <strong className="me-auto">Messages</strong>
            </Toast.Header>
            <Toast.Body className="text-white">{toastMessage}</Toast.Body>
          </Toast>
        </ToastContainer>
      </Container>
    </div>
  );
};

export default AdminMessages;
