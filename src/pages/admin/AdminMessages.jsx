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
} from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import {
  setMessages,
  markAsRead,
  markAllAsRead,
  deleteMessage,
} from "../../store/slices/messageSlice";

const AdminMessages = () => {
  const dispatch = useDispatch();
  const { messages, unreadCount, loading } = useSelector(
    (state) => state.messages,
  );

  const [showReplyModal, setShowReplyModal] = useState(false);
  const [selectedMessage, setSelectedMessage] = useState(null);
  const [replyText, setReplyText] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterPriority, setFilterPriority] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [alert, setAlert] = useState({ show: false, message: "", variant: "" });

  // Mock messages data - in real app, this would come from API
  useEffect(() => {
    const mockMessages = [
      {
        id: 1,
        name: "John Doe",
        email: "john.doe@example.com",
        mobile: "+91 9876543210",
        subject: "Product Inquiry",
        message:
          "I need information about availability of insulin pens. Do you have them in stock?",
        isRead: false,
        priority: "High",
        status: "Open",
        createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
        reply: "",
        repliedAt: null,
      },
      {
        id: 2,
        name: "Mary Smith",
        email: "mary.smith@example.com",
        mobile: "+91 8765432109",
        subject: "Order Delivery Issue",
        message:
          "My order HKM12345678 was supposed to be delivered today but I haven't received it yet. Can you please check the status?",
        isRead: true,
        priority: "Medium",
        status: "In Progress",
        createdAt: new Date(Date.now() - 4 * 60 * 60 * 1000), // 4 hours ago
        reply:
          "Hello Mary, I've checked your order status. It's out for delivery and should reach you by 6 PM today. Thank you for your patience.",
        repliedAt: new Date(Date.now() - 1 * 60 * 60 * 1000), // 1 hour ago
      },
      {
        id: 3,
        name: "Raj Patel",
        email: "raj.patel@example.com",
        mobile: "+91 7654321098",
        subject: "Prescription Upload",
        message:
          "How can I upload my prescription for online order? I couldn't find the option on the website.",
        isRead: false,
        priority: "Low",
        status: "Open",
        createdAt: new Date(Date.now() - 6 * 60 * 60 * 1000), // 6 hours ago
        reply: "",
        repliedAt: null,
      },
      {
        id: 4,
        name: "Priya Sharma",
        email: "priya.sharma@example.com",
        mobile: "+91 6543210987",
        subject: "Payment Issue",
        message:
          "I made payment for order HKM87654321 but it's still showing as unpaid. Please help resolve this issue.",
        isRead: true,
        priority: "High",
        status: "Resolved",
        createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000), // 1 day ago
        reply:
          "Hi Priya, we've verified your payment and updated the order status. You should receive a confirmation email shortly.",
        repliedAt: new Date(Date.now() - 23 * 60 * 60 * 1000), // 23 hours ago
      },
      {
        id: 5,
        name: "Anonymous User",
        email: "user@example.com",
        mobile: "",
        subject: "General Inquiry",
        message:
          "What are your store timings? Also, do you provide home delivery for emergency medicines?",
        isRead: false,
        priority: "Medium",
        status: "Open",
        createdAt: new Date(Date.now() - 8 * 60 * 60 * 1000), // 8 hours ago
        reply: "",
        repliedAt: null,
      },
    ];

    dispatch(setMessages(mockMessages));
  }, [dispatch]);

  const filteredMessages = messages.filter((message) => {
    const matchesStatus =
      filterStatus === "all" || message.status.toLowerCase() === filterStatus;
    const matchesPriority =
      filterPriority === "all" ||
      message.priority.toLowerCase() === filterPriority;
    const matchesSearch =
      searchTerm === "" ||
      message.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      message.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      message.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
      message.message.toLowerCase().includes(searchTerm.toLowerCase());

    return matchesStatus && matchesPriority && matchesSearch;
  });

  const handleMarkAsRead = (messageId) => {
    dispatch(markAsRead(messageId));
    showAlert("Message marked as read", "success");
  };

  const handleMarkAllAsRead = () => {
    dispatch(markAllAsRead());
    showAlert("All messages marked as read", "success");
  };

  const handleDeleteMessage = (messageId) => {
    if (window.confirm("Are you sure you want to delete this message?")) {
      dispatch(deleteMessage(messageId));
      showAlert("Message deleted successfully", "success");
    }
  };

  const handleReplyMessage = (message) => {
    setSelectedMessage(message);
    setReplyText(message.reply || "");
    setShowReplyModal(true);
  };

  const handleSendReply = () => {
    if (!replyText.trim()) {
      showAlert("Please enter a reply message", "danger");
      return;
    }

    // In real app, this would be an API call
    const updatedMessages = messages.map((msg) =>
      msg.id === selectedMessage.id
        ? {
            ...msg,
            reply: replyText,
            repliedAt: new Date(),
            status: "Resolved",
            isRead: true,
          }
        : msg,
    );

    dispatch(setMessages(updatedMessages));
    setShowReplyModal(false);
    setSelectedMessage(null);
    setReplyText("");
    showAlert("Reply sent successfully", "success");
  };

  const showAlert = (message, variant) => {
    setAlert({ show: true, message, variant });
    setTimeout(() => setAlert({ show: false, message: "", variant: "" }), 3000);
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
      "In Progress": "warning",
      Resolved: "success",
    };
    return <Badge bg={variants[status] || "secondary"}>{status}</Badge>;
  };

  const formatDate = (date) => {
    const now = new Date();
    const diffInHours = Math.floor((now - new Date(date)) / (1000 * 60 * 60));

    if (diffInHours < 1) {
      return "Just now";
    } else if (diffInHours < 24) {
      return `${diffInHours} hour${diffInHours > 1 ? "s" : ""} ago`;
    } else {
      const diffInDays = Math.floor(diffInHours / 24);
      return `${diffInDays} day${diffInDays > 1 ? "s" : ""} ago`;
    }
  };

  return (
    <div className="section-padding">
      <Container>
        <Row>
          <Col lg={12}>
            <div className="d-flex justify-content-between align-items-center mb-4">
              <div>
                <h2 className="section-title mb-1">Message Management</h2>
                <p className="text-muted">
                  Manage customer inquiries and support messages
                </p>
              </div>
              <div className="d-flex gap-2">
                <Badge bg="danger" className="fs-6">
                  {unreadCount} Unread
                </Badge>
                <Button
                  variant="outline-primary"
                  size="sm"
                  onClick={handleMarkAllAsRead}
                  disabled={unreadCount === 0}
                >
                  <i className="bi bi-check-all me-1"></i>
                  Mark All Read
                </Button>
              </div>
            </div>
          </Col>
        </Row>

        {alert.show && (
          <Row>
            <Col lg={12}>
              <Alert variant={alert.variant} className="mb-3">
                {alert.message}
              </Alert>
            </Col>
          </Row>
        )}

        {/* Filters */}
        <Row className="mb-4">
          <Col lg={12}>
            <Card className="medical-card">
              <Card.Body>
                <Row>
                  <Col md={3}>
                    <Form.Group>
                      <Form.Label>Search Messages</Form.Label>
                      <InputGroup>
                        <Form.Control
                          type="text"
                          placeholder="Search by name, email, subject..."
                          value={searchTerm}
                          onChange={(e) => setSearchTerm(e.target.value)}
                        />
                        <InputGroup.Text>
                          <i className="bi bi-search"></i>
                        </InputGroup.Text>
                      </InputGroup>
                    </Form.Group>
                  </Col>
                  <Col md={3}>
                    <Form.Group>
                      <Form.Label>Filter by Status</Form.Label>
                      <Form.Select
                        value={filterStatus}
                        onChange={(e) => setFilterStatus(e.target.value)}
                      >
                        <option value="all">All Status</option>
                        <option value="open">Open</option>
                        <option value="in progress">In Progress</option>
                        <option value="resolved">Resolved</option>
                      </Form.Select>
                    </Form.Group>
                  </Col>
                  <Col md={3}>
                    <Form.Group>
                      <Form.Label>Filter by Priority</Form.Label>
                      <Form.Select
                        value={filterPriority}
                        onChange={(e) => setFilterPriority(e.target.value)}
                      >
                        <option value="all">All Priority</option>
                        <option value="high">High</option>
                        <option value="medium">Medium</option>
                        <option value="low">Low</option>
                      </Form.Select>
                    </Form.Group>
                  </Col>
                  <Col md={3} className="d-flex align-items-end">
                    <div className="w-100">
                      <Button
                        variant="outline-secondary"
                        className="w-100"
                        onClick={() => {
                          setSearchTerm("");
                          setFilterStatus("all");
                          setFilterPriority("all");
                        }}
                      >
                        <i className="bi bi-arrow-clockwise me-1"></i>
                        Reset Filters
                      </Button>
                    </div>
                  </Col>
                </Row>
              </Card.Body>
            </Card>
          </Col>
        </Row>

        {/* Messages Table */}
        <Row>
          <Col lg={12}>
            <Card className="medical-card">
              <Card.Body className="p-0">
                <div className="table-responsive">
                  <Table hover className="mb-0">
                    <thead className="table-light">
                      <tr>
                        <th>Customer</th>
                        <th>Subject</th>
                        <th>Priority</th>
                        <th>Status</th>
                        <th>Received</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredMessages.length === 0 ? (
                        <tr>
                          <td colSpan="6" className="text-center py-4">
                            <i className="bi bi-inbox display-4 text-muted mb-3 d-block"></i>
                            <h5 className="text-muted">No messages found</h5>
                            <p className="text-muted">
                              Try adjusting your filters or search criteria
                            </p>
                          </td>
                        </tr>
                      ) : (
                        filteredMessages.map((message) => (
                          <tr
                            key={message.id}
                            className={!message.isRead ? "table-warning" : ""}
                          >
                            <td>
                              <div>
                                <div className="fw-bold d-flex align-items-center">
                                  {message.name}
                                  {!message.isRead && (
                                    <Badge
                                      bg="danger"
                                      className="ms-2"
                                      style={{ fontSize: "10px" }}
                                    >
                                      NEW
                                    </Badge>
                                  )}
                                </div>
                                <small className="text-muted">
                                  {message.email}
                                </small>
                                {message.mobile && (
                                  <div>
                                    <small className="text-muted">
                                      {message.mobile}
                                    </small>
                                  </div>
                                )}
                              </div>
                            </td>
                            <td>
                              <div>
                                <div className="fw-bold">{message.subject}</div>
                                <small className="text-muted">
                                  {message.message.length > 100
                                    ? `${message.message.substring(0, 100)}...`
                                    : message.message}
                                </small>
                              </div>
                            </td>
                            <td>{getPriorityBadge(message.priority)}</td>
                            <td>{getStatusBadge(message.status)}</td>
                            <td>
                              <small>{formatDate(message.createdAt)}</small>
                            </td>
                            <td>
                              <Dropdown>
                                <Dropdown.Toggle
                                  variant="outline-secondary"
                                  size="sm"
                                  id={`dropdown-${message.id}`}
                                >
                                  <i className="bi bi-three-dots-vertical"></i>
                                </Dropdown.Toggle>
                                <Dropdown.Menu>
                                  <Dropdown.Item
                                    onClick={() => handleReplyMessage(message)}
                                  >
                                    <i className="bi bi-reply me-2"></i>
                                    {message.reply ? "Edit Reply" : "Reply"}
                                  </Dropdown.Item>
                                  {!message.isRead && (
                                    <Dropdown.Item
                                      onClick={() =>
                                        handleMarkAsRead(message.id)
                                      }
                                    >
                                      <i className="bi bi-check me-2"></i>
                                      Mark as Read
                                    </Dropdown.Item>
                                  )}
                                  <Dropdown.Divider />
                                  <Dropdown.Item
                                    className="text-danger"
                                    onClick={() =>
                                      handleDeleteMessage(message.id)
                                    }
                                  >
                                    <i className="bi bi-trash me-2"></i>
                                    Delete
                                  </Dropdown.Item>
                                </Dropdown.Menu>
                              </Dropdown>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </Table>
                </div>
              </Card.Body>
            </Card>
          </Col>
        </Row>

        {/* Statistics */}
        <Row className="mt-4">
          <Col md={3}>
            <Card className="medical-card text-center">
              <Card.Body>
                <h4 className="text-primary">{messages.length}</h4>
                <p className="text-muted mb-0">Total Messages</p>
              </Card.Body>
            </Card>
          </Col>
          <Col md={3}>
            <Card className="medical-card text-center">
              <Card.Body>
                <h4 className="text-danger">{unreadCount}</h4>
                <p className="text-muted mb-0">Unread Messages</p>
              </Card.Body>
            </Card>
          </Col>
          <Col md={3}>
            <Card className="medical-card text-center">
              <Card.Body>
                <h4 className="text-warning">
                  {
                    messages.filter((msg) => msg.status === "In Progress")
                      .length
                  }
                </h4>
                <p className="text-muted mb-0">In Progress</p>
              </Card.Body>
            </Card>
          </Col>
          <Col md={3}>
            <Card className="medical-card text-center">
              <Card.Body>
                <h4 className="text-success">
                  {messages.filter((msg) => msg.status === "Resolved").length}
                </h4>
                <p className="text-muted mb-0">Resolved</p>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>

      {/* Reply Modal */}
      <Modal
        show={showReplyModal}
        onHide={() => setShowReplyModal(false)}
        size="lg"
      >
        <Modal.Header closeButton>
          <Modal.Title>
            {selectedMessage?.reply ? "Edit Reply" : "Reply to Message"}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedMessage && (
            <>
              <div className="mb-4 p-3 bg-light rounded">
                <h6>Original Message:</h6>
                <p>
                  <strong>From:</strong> {selectedMessage.name} (
                  {selectedMessage.email})
                </p>
                <p>
                  <strong>Subject:</strong> {selectedMessage.subject}
                </p>
                <p>
                  <strong>Message:</strong> {selectedMessage.message}
                </p>
              </div>

              <Form.Group>
                <Form.Label>Your Reply:</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={6}
                  value={replyText}
                  onChange={(e) => setReplyText(e.target.value)}
                  placeholder="Type your reply here..."
                />
                <Form.Text className="text-muted">
                  This reply will be sent to the customer's email address.
                </Form.Text>
              </Form.Group>
            </>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowReplyModal(false)}>
            Cancel
          </Button>
          <Button
            variant="primary"
            onClick={handleSendReply}
            disabled={!replyText.trim()}
          >
            <i className="bi bi-send me-2"></i>
            Send Reply
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default AdminMessages;
