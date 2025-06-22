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

const AdminMessages = () => {
  const dispatch = useDispatch();
  const { messages } = useSelector((state) => state.messages);

  const [filteredMessages, setFilteredMessages] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [priorityFilter, setPriorityFilter] = useState("");
  const [showReplyModal, setShowReplyModal] = useState(false);
  const [selectedMessage, setSelectedMessage] = useState(null);
  const [replyText, setReplyText] = useState("");
  const [sending, setSending] = useState(false);

  useEffect(() => {
    let filtered = [...messages];

    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(
        (message) =>
          message.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          message.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
          message.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
          message.message.toLowerCase().includes(searchTerm.toLowerCase()),
      );
    }

    // Apply status filter
    if (statusFilter) {
      filtered = filtered.filter((message) => message.status === statusFilter);
    }

    // Apply priority filter
    if (priorityFilter) {
      filtered = filtered.filter(
        (message) => message.priority === priorityFilter,
      );
    }

    // Sort by date (newest first)
    filtered.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    setFilteredMessages(filtered);
  }, [messages, searchTerm, statusFilter, priorityFilter]);

  const handleMarkAsRead = (messageId) => {
    dispatch(markMessageAsRead(messageId));
  };

  const handleMarkAsUnread = (messageId) => {
    dispatch(markMessageAsUnread(messageId));
  };

  const handleDeleteMessage = (messageId) => {
    if (window.confirm("Are you sure you want to delete this message?")) {
      dispatch(deleteMessage(messageId));
    }
  };

  const handleStatusChange = (messageId, newStatus) => {
    dispatch(updateMessageStatus({ messageId, status: newStatus }));
  };

  const handleReply = (message) => {
    setSelectedMessage(message);
    setReplyText("");
    setShowReplyModal(true);
    if (!message.isRead) {
      dispatch(markMessageAsRead(message.id));
    }
  };

  const handleSendReply = async () => {
    if (!replyText.trim()) {
      alert("Please enter a reply message");
      return;
    }

    setSending(true);
    try {
      // Simulate sending email
      await new Promise((resolve) => setTimeout(resolve, 1500));

      dispatch(
        replyToMessage({
          messageId: selectedMessage.id,
          reply: replyText,
          repliedAt: new Date().toISOString(),
        }),
      );

      dispatch(
        updateMessageStatus({
          messageId: selectedMessage.id,
          status: "Replied",
        }),
      );

      setShowReplyModal(false);
      setSelectedMessage(null);
      setReplyText("");
    } catch (error) {
      alert("Failed to send reply. Please try again.");
    } finally {
      setSending(false);
    }
  };

  const getPriorityBadge = (priority) => {
    const variants = {
      High: "danger",
      Medium: "warning",
      Low: "success",
    };
    return <Badge bg={variants[priority] || "secondary"}>{priority}</Badge>;
  };

  const getStatusBadge = (status) => {
    const variants = {
      Open: "primary",
      "In Progress": "info",
      Replied: "success",
      Closed: "secondary",
    };
    return <Badge bg={variants[status] || "secondary"}>{status}</Badge>;
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleString();
  };

  const unreadCount = messages.filter((m) => !m.isRead).length;
  const totalMessages = messages.length;

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
            <Col lg={8}>
              <h2 style={{ color: "#333333", fontWeight: "700" }}>
                Message Management
              </h2>
              <p style={{ color: "#495057" }}>
                Manage customer inquiries from the contact form
              </p>
            </Col>
            <Col lg={4} className="text-end">
              <div className="d-flex gap-3 align-items-center justify-content-end">
                <div className="text-center">
                  <div
                    style={{
                      fontSize: "1.5rem",
                      fontWeight: "700",
                      color: "#e63946",
                    }}
                  >
                    {unreadCount}
                  </div>
                  <small style={{ color: "#495057" }}>Unread</small>
                </div>
                <div className="text-center">
                  <div
                    style={{
                      fontSize: "1.5rem",
                      fontWeight: "700",
                      color: "#343a40",
                    }}
                  >
                    {totalMessages}
                  </div>
                  <small style={{ color: "#495057" }}>Total</small>
                </div>
              </div>
            </Col>
          </Row>

          {/* Filters */}
          <Row className="mb-4">
            <Col lg={4} className="mb-3">
              <InputGroup>
                <InputGroup.Text>
                  <i className="bi bi-search"></i>
                </InputGroup.Text>
                <Form.Control
                  type="text"
                  placeholder="Search messages..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </InputGroup>
            </Col>
            <Col lg={2} className="mb-3">
              <Form.Select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <option value="">All Status</option>
                <option value="Open">Open</option>
                <option value="In Progress">In Progress</option>
                <option value="Replied">Replied</option>
                <option value="Closed">Closed</option>
              </Form.Select>
            </Col>
            <Col lg={2} className="mb-3">
              <Form.Select
                value={priorityFilter}
                onChange={(e) => setPriorityFilter(e.target.value)}
              >
                <option value="">All Priority</option>
                <option value="High">High</option>
                <option value="Medium">Medium</option>
                <option value="Low">Low</option>
              </Form.Select>
            </Col>
            <Col lg={4} className="mb-3">
              <div className="d-flex gap-2">
                <Button
                  variant="outline-secondary"
                  onClick={() => {
                    setSearchTerm("");
                    setStatusFilter("");
                    setPriorityFilter("");
                  }}
                >
                  <i className="bi bi-arrow-clockwise me-1"></i>
                  Clear Filters
                </Button>
                <Button
                  variant="outline-primary"
                  style={{ color: "#e63946", borderColor: "#e63946" }}
                >
                  <i className="bi bi-download me-1"></i>
                  Export
                </Button>
              </div>
            </Col>
          </Row>

          {/* Messages Table */}
          <Row>
            <Col lg={12}>
              <Card
                style={{
                  border: "none",
                  borderRadius: "12px",
                  boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
                }}
              >
                <Card.Body style={{ padding: "0" }}>
                  {filteredMessages.length === 0 ? (
                    <div
                      className="text-center"
                      style={{ padding: "60px 20px" }}
                    >
                      <i
                        className="bi bi-inbox display-1 mb-3"
                        style={{ color: "#e9ecef" }}
                      ></i>
                      <h4 style={{ color: "#495057" }}>No messages found</h4>
                      <p style={{ color: "#6c757d" }}>
                        {searchTerm || statusFilter || priorityFilter
                          ? "Try adjusting your search criteria"
                          : "Customer messages will appear here"}
                      </p>
                    </div>
                  ) : (
                    <div className="table-responsive">
                      <Table className="mb-0">
                        <thead
                          style={{
                            background: "#f8f9fa",
                            borderBottom: "2px solid #e9ecef",
                          }}
                        >
                          <tr>
                            <th style={{ padding: "16px", fontWeight: "600" }}>
                              Customer
                            </th>
                            <th style={{ padding: "16px", fontWeight: "600" }}>
                              Subject
                            </th>
                            <th style={{ padding: "16px", fontWeight: "600" }}>
                              Priority
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
                          {filteredMessages.map((message) => (
                            <tr
                              key={message.id}
                              style={{
                                backgroundColor: message.isRead
                                  ? "#ffffff"
                                  : "#f8f9fa",
                                borderBottom: "1px solid #e9ecef",
                              }}
                            >
                              <td style={{ padding: "16px" }}>
                                <div>
                                  <div
                                    style={{
                                      fontWeight: message.isRead
                                        ? "500"
                                        : "700",
                                      color: "#333333",
                                      marginBottom: "4px",
                                    }}
                                  >
                                    {message.name}
                                    {!message.isRead && (
                                      <Badge
                                        bg="primary"
                                        className="ms-2"
                                        style={{
                                          fontSize: "8px",
                                          padding: "2px 6px",
                                        }}
                                      >
                                        NEW
                                      </Badge>
                                    )}
                                  </div>
                                  <div
                                    style={{
                                      fontSize: "12px",
                                      color: "#6c757d",
                                    }}
                                  >
                                    {message.email}
                                  </div>
                                  {message.mobile && (
                                    <div
                                      style={{
                                        fontSize: "12px",
                                        color: "#6c757d",
                                      }}
                                    >
                                      📱 {message.mobile}
                                    </div>
                                  )}
                                </div>
                              </td>
                              <td style={{ padding: "16px" }}>
                                <div
                                  style={{
                                    fontWeight: "500",
                                    color: "#333333",
                                    marginBottom: "4px",
                                  }}
                                >
                                  {message.subject}
                                </div>
                                <div
                                  style={{
                                    fontSize: "12px",
                                    color: "#6c757d",
                                    maxWidth: "200px",
                                    overflow: "hidden",
                                    textOverflow: "ellipsis",
                                    whiteSpace: "nowrap",
                                  }}
                                >
                                  {message.message}
                                </div>
                              </td>
                              <td style={{ padding: "16px" }}>
                                {getPriorityBadge(message.priority)}
                              </td>
                              <td style={{ padding: "16px" }}>
                                <Dropdown>
                                  <Dropdown.Toggle
                                    as="div"
                                    style={{ cursor: "pointer" }}
                                  >
                                    {getStatusBadge(message.status)}
                                  </Dropdown.Toggle>
                                  <Dropdown.Menu>
                                    <Dropdown.Item
                                      onClick={() =>
                                        handleStatusChange(message.id, "Open")
                                      }
                                    >
                                      Open
                                    </Dropdown.Item>
                                    <Dropdown.Item
                                      onClick={() =>
                                        handleStatusChange(
                                          message.id,
                                          "In Progress",
                                        )
                                      }
                                    >
                                      In Progress
                                    </Dropdown.Item>
                                    <Dropdown.Item
                                      onClick={() =>
                                        handleStatusChange(
                                          message.id,
                                          "Replied",
                                        )
                                      }
                                    >
                                      Replied
                                    </Dropdown.Item>
                                    <Dropdown.Item
                                      onClick={() =>
                                        handleStatusChange(message.id, "Closed")
                                      }
                                    >
                                      Closed
                                    </Dropdown.Item>
                                  </Dropdown.Menu>
                                </Dropdown>
                              </td>
                              <td
                                style={{
                                  padding: "16px",
                                  fontSize: "12px",
                                  color: "#6c757d",
                                }}
                              >
                                {formatDate(message.createdAt)}
                              </td>
                              <td style={{ padding: "16px" }}>
                                <div className="d-flex gap-1">
                                  <Button
                                    size="sm"
                                    variant="outline-primary"
                                    onClick={() => handleReply(message)}
                                    title="Reply"
                                    style={{
                                      borderColor: "#e63946",
                                      color: "#e63946",
                                    }}
                                  >
                                    <i className="bi bi-reply"></i>
                                  </Button>
                                  <Button
                                    size="sm"
                                    variant={
                                      message.isRead
                                        ? "outline-secondary"
                                        : "outline-info"
                                    }
                                    onClick={() =>
                                      message.isRead
                                        ? handleMarkAsUnread(message.id)
                                        : handleMarkAsRead(message.id)
                                    }
                                    title={
                                      message.isRead
                                        ? "Mark as Unread"
                                        : "Mark as Read"
                                    }
                                  >
                                    <i
                                      className={
                                        message.isRead
                                          ? "bi bi-envelope"
                                          : "bi bi-envelope-open"
                                      }
                                    ></i>
                                  </Button>
                                  <Button
                                    size="sm"
                                    variant="outline-danger"
                                    onClick={() =>
                                      handleDeleteMessage(message.id)
                                    }
                                    title="Delete"
                                  >
                                    <i className="bi bi-trash"></i>
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

      {/* Reply Modal */}
      <Modal
        show={showReplyModal}
        onHide={() => setShowReplyModal(false)}
        size="lg"
      >
        <Modal.Header
          closeButton
          style={{ background: "linear-gradient(135deg, #e63946, #dc3545)" }}
        >
          <Modal.Title style={{ color: "#ffffff" }}>
            <i className="bi bi-reply me-2"></i>
            Reply to {selectedMessage?.name}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body style={{ padding: "30px" }}>
          {selectedMessage && (
            <div style={{ marginBottom: "20px" }}>
              <Card style={{ background: "#f8f9fa", border: "none" }}>
                <Card.Body>
                  <h6 style={{ color: "#e63946", marginBottom: "10px" }}>
                    Original Message:
                  </h6>
                  <p style={{ marginBottom: "10px" }}>
                    <strong>Subject:</strong> {selectedMessage.subject}
                  </p>
                  <p style={{ marginBottom: "0", fontSize: "14px" }}>
                    {selectedMessage.message}
                  </p>
                </Card.Body>
              </Card>
            </div>
          )}

          <Form.Group>
            <Form.Label style={{ fontWeight: "600" }}>Your Reply:</Form.Label>
            <Form.Control
              as="textarea"
              rows={6}
              value={replyText}
              onChange={(e) => setReplyText(e.target.value)}
              placeholder="Type your reply here..."
              style={{
                borderRadius: "8px",
                border: "2px solid #e9ecef",
                padding: "12px",
              }}
            />
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant="outline-secondary"
            onClick={() => setShowReplyModal(false)}
            disabled={sending}
          >
            Cancel
          </Button>
          <Button
            style={{ background: "#e63946", border: "none" }}
            onClick={handleSendReply}
            disabled={sending}
          >
            {sending ? (
              <>
                <Spinner size="sm" className="me-2" />
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
    </div>
  );
};

export default AdminMessages;
