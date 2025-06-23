import React, { useState, useEffect } from "react";
import {
  Container,
  Row,
  Col,
  Table,
  Badge,
  Modal,
  Form,
  Alert,
  InputGroup,
  Spinner,
  Button,
  Card,
} from "react-bootstrap";
import { safeApiCall, api } from "../../utils/apiClient";

const AdminPaymentMethods = () => {
  const [paymentMethods, setPaymentMethods] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [editingMethod, setEditingMethod] = useState(null);
  const [saving, setSaving] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    type: "online",
    isActive: true,
    description: "",
    processingFee: 0,
    minAmount: 0,
    maxAmount: 0,
    config: {},
  });

  const paymentTypes = [
    { value: "online", label: "Online Payment" },
    { value: "cod", label: "Cash on Delivery" },
    { value: "bank_transfer", label: "Bank Transfer" },
    { value: "wallet", label: "Digital Wallet" },
    { value: "upi", label: "UPI" },
  ];

  // Fetch payment methods from API
  const fetchPaymentMethods = async () => {
    setLoading(true);
    setError(null);

    const {
      success,
      data,
      error: apiError,
    } = await safeApiCall(() => api.get("/api/admin/payment-methods"), []);

    if (success && data) {
      const methodsData = data.data || data;
      setPaymentMethods(methodsData);
    } else {
      setError(apiError || "Failed to load payment methods");
      setPaymentMethods([]);
    }

    setLoading(false);
  };

  useEffect(() => {
    fetchPaymentMethods();
  }, []);

  const handleShowModal = (method = null) => {
    if (method) {
      setEditingMethod(method);
      setFormData({
        name: method.name,
        type: method.type,
        isActive: method.isActive,
        description: method.description,
        processingFee: method.processingFee,
        minAmount: method.minAmount,
        maxAmount: method.maxAmount,
        config: method.config || {},
      });
    } else {
      setEditingMethod(null);
      setFormData({
        name: "",
        type: "online",
        isActive: true,
        description: "",
        processingFee: 0,
        minAmount: 0,
        maxAmount: 0,
        config: {},
      });
    }
    setShowModal(true);
  };

  const handleSave = async () => {
    setSaving(true);

    const {
      success,
      data,
      error: apiError,
    } = await safeApiCall(() => {
      if (editingMethod) {
        return api.put(
          `/api/admin/payment-methods/${editingMethod._id}`,
          formData,
        );
      } else {
        return api.post("/api/admin/payment-methods", formData);
      }
    }, null);

    if (success) {
      if (editingMethod) {
        // Update existing method
        setPaymentMethods((prev) =>
          prev.map((method) =>
            method._id === editingMethod._id
              ? { ...method, ...formData }
              : method,
          ),
        );
      } else {
        // Add new method
        const newMethod = data.data || {
          ...formData,
          _id: Date.now().toString(),
        };
        setPaymentMethods((prev) => [...prev, newMethod]);
      }
      setShowModal(false);
    } else {
      alert(apiError || "Failed to save payment method");
    }

    setSaving(false);
  };

  const handleDelete = async (methodId) => {
    if (
      !window.confirm("Are you sure you want to delete this payment method?")
    ) {
      return;
    }

    const { success, error: apiError } = await safeApiCall(
      () => api.delete(`/api/admin/payment-methods/${methodId}`),
      null,
    );

    if (success) {
      setPaymentMethods((prev) =>
        prev.filter((method) => method._id !== methodId),
      );
    } else {
      alert(apiError || "Failed to delete payment method");
    }
  };

  const toggleStatus = async (methodId, currentStatus) => {
    const { success, error: apiError } = await safeApiCall(
      () =>
        api.patch(`/api/admin/payment-methods/${methodId}`, {
          isActive: !currentStatus,
        }),
      null,
    );

    if (success) {
      setPaymentMethods((prev) =>
        prev.map((method) =>
          method._id === methodId
            ? { ...method, isActive: !currentStatus }
            : method,
        ),
      );
    } else {
      alert(apiError || "Failed to update payment method status");
    }
  };

  if (loading) {
    return (
      <div className="fade-in">
        {/* Professional Hero Section */}
        <section
          style={{
            background: "linear-gradient(135deg, #e63946 0%, #dc3545 100%)",
            paddingTop: "40px",
            paddingBottom: "40px",
            color: "white",
          }}
        >
          <Container>
            <Row className="text-center">
              <Col lg={12}>
                <div
                  style={{
                    width: "60px",
                    height: "60px",
                    background: "rgba(255,255,255,0.2)",
                    borderRadius: "50%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    margin: "0 auto 16px",
                    fontSize: "24px",
                  }}
                >
                  <i className="bi bi-credit-card"></i>
                </div>
                <h1
                  style={{
                    fontSize: "2.5rem",
                    fontWeight: "800",
                    marginBottom: "12px",
                    textShadow: "2px 2px 4px rgba(0,0,0,0.3)",
                  }}
                >
                  Payment Methods
                </h1>
                <p
                  style={{
                    fontSize: "1rem",
                    opacity: "0.9",
                    maxWidth: "500px",
                    margin: "0 auto",
                  }}
                >
                  Configure payment options for your customers
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
            <span className="ms-3">Loading payment methods...</span>
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
          paddingTop: "40px",
          paddingBottom: "40px",
          color: "white",
        }}
      >
        <Container>
          <Row className="text-center">
            <Col lg={12}>
              <div
                style={{
                  width: "60px",
                  height: "60px",
                  background: "rgba(255,255,255,0.2)",
                  borderRadius: "50%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  margin: "0 auto 16px",
                  fontSize: "24px",
                }}
              >
                <i className="bi bi-credit-card"></i>
              </div>
              <h1
                style={{
                  fontSize: "2.5rem",
                  fontWeight: "800",
                  marginBottom: "12px",
                  textShadow: "2px 2px 4px rgba(0,0,0,0.3)",
                }}
              >
                Payment Methods
              </h1>
              <p
                style={{
                  fontSize: "1rem",
                  opacity: "0.9",
                  maxWidth: "500px",
                  margin: "0 auto",
                }}
              >
                Configure payment options for your customers
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
              onClick={fetchPaymentMethods}
              className="border-2"
            >
              <i className="bi bi-arrow-clockwise me-2"></i>
              Try Again
            </Button>
          </Alert>
        )}

        {/* Action Button */}
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h3 className="mb-0">
            <i className="bi bi-credit-card me-2"></i>
            Payment Methods ({paymentMethods.length})
          </h3>
          <Button
            style={{
              background: "linear-gradient(135deg, #e63946 0%, #dc3545 100%)",
              border: "none",
              padding: "10px 20px",
              borderRadius: "8px",
              fontWeight: "600",
            }}
            onClick={() => handleShowModal()}
          >
            <i className="bi bi-plus-circle me-2"></i>
            Add Payment Method
          </Button>
        </div>

        {/* Payment Methods Table */}
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
              <i className="bi bi-list-ul me-2"></i>
              All Payment Methods
            </h5>
          </Card.Header>
          <Card.Body className="p-0">
            {paymentMethods.length > 0 ? (
              <Table responsive hover className="mb-0">
                <thead
                  style={{
                    backgroundColor: "#f8f9fa",
                    borderBottom: "2px solid #dee2e6",
                  }}
                >
                  <tr>
                    <th style={{ padding: "16px 20px", fontWeight: "600" }}>
                      <i className="bi bi-credit-card-2-front me-2"></i>
                      Method
                    </th>
                    <th style={{ padding: "16px 20px", fontWeight: "600" }}>
                      <i className="bi bi-tag me-2"></i>
                      Type
                    </th>
                    <th style={{ padding: "16px 20px", fontWeight: "600" }}>
                      <i className="bi bi-percent me-2"></i>
                      Processing Fee
                    </th>
                    <th style={{ padding: "16px 20px", fontWeight: "600" }}>
                      <i className="bi bi-currency-rupee me-2"></i>
                      Limits
                    </th>
                    <th style={{ padding: "16px 20px", fontWeight: "600" }}>
                      <i className="bi bi-toggle-on me-2"></i>
                      Status
                    </th>
                    <th style={{ padding: "16px 20px", fontWeight: "600" }}>
                      <i className="bi bi-gear me-2"></i>
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {paymentMethods.map((method) => (
                    <tr key={method._id}>
                      <td style={{ padding: "16px 20px" }}>
                        <div>
                          <div className="fw-bold d-flex align-items-center">
                            <i className="bi bi-credit-card me-2 text-primary"></i>
                            {method.name}
                          </div>
                          <small className="text-muted">
                            {method.description}
                          </small>
                        </div>
                      </td>
                      <td style={{ padding: "16px 20px" }}>
                        <Badge
                          bg="info"
                          style={{ fontSize: "12px", padding: "6px 12px" }}
                        >
                          {method.type}
                        </Badge>
                      </td>
                      <td style={{ padding: "16px 20px" }}>
                        <span className="fw-bold">{method.processingFee}%</span>
                      </td>
                      <td style={{ padding: "16px 20px" }}>
                        <div>
                          <div>
                            <span className="fw-bold">Min:</span> ₹
                            {method.minAmount?.toLocaleString()}
                          </div>
                          <div>
                            <span className="fw-bold">Max:</span> ₹
                            {method.maxAmount?.toLocaleString()}
                          </div>
                        </div>
                      </td>
                      <td style={{ padding: "16px 20px" }}>
                        <div className="form-check form-switch">
                          <input
                            className="form-check-input"
                            type="checkbox"
                            checked={method.isActive}
                            onChange={() =>
                              toggleStatus(method._id, method.isActive)
                            }
                            style={{ transform: "scale(1.2)" }}
                          />
                        </div>
                      </td>
                      <td style={{ padding: "16px 20px" }}>
                        <div className="d-flex gap-2">
                          <Button
                            variant="outline-primary"
                            size="sm"
                            onClick={() => handleShowModal(method)}
                            style={{
                              border: "2px solid #007bff",
                              borderRadius: "6px",
                            }}
                          >
                            <i className="bi bi-pencil me-1"></i>
                            Edit
                          </Button>
                          <Button
                            variant="outline-danger"
                            size="sm"
                            onClick={() => handleDelete(method._id)}
                            style={{
                              border: "2px solid #dc3545",
                              borderRadius: "6px",
                            }}
                          >
                            <i className="bi bi-trash me-1"></i>
                            Delete
                          </Button>
                        </div>
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
                    <i className="bi bi-credit-card"></i>
                  </div>
                </div>
                <h5>No Payment Methods Found</h5>
                <p className="text-muted">
                  {error
                    ? "Unable to load payment methods. Please check your connection."
                    : "Get started by adding your first payment method."}
                </p>
                <Button
                  variant="danger"
                  onClick={() =>
                    error ? fetchPaymentMethods() : handleShowModal()
                  }
                  style={{
                    background:
                      "linear-gradient(135deg, #e63946 0%, #dc3545 100%)",
                    border: "none",
                  }}
                >
                  <i
                    className={`bi ${error ? "bi-arrow-clockwise" : "bi-plus-circle"} me-2`}
                  ></i>
                  {error ? "Try Again" : "Add Payment Method"}
                </Button>
              </div>
            )}
          </Card.Body>
        </Card>

        {/* Professional Modal */}
        <Modal
          show={showModal}
          onHide={() => setShowModal(false)}
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
              <i className="bi bi-credit-card me-2"></i>
              {editingMethod ? "Edit Payment Method" : "Add Payment Method"}
            </Modal.Title>
          </Modal.Header>
          <Modal.Body style={{ padding: "30px" }}>
            <Form>
              <Row>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label className="fw-bold">
                      <i className="bi bi-type me-2"></i>
                      Method Name
                    </Form.Label>
                    <Form.Control
                      type="text"
                      value={formData.name}
                      onChange={(e) =>
                        setFormData({ ...formData, name: e.target.value })
                      }
                      placeholder="Enter payment method name"
                      style={{
                        border: "2px solid #dee2e6",
                        borderRadius: "8px",
                      }}
                    />
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label className="fw-bold">
                      <i className="bi bi-list me-2"></i>
                      Type
                    </Form.Label>
                    <Form.Select
                      value={formData.type}
                      onChange={(e) =>
                        setFormData({ ...formData, type: e.target.value })
                      }
                      style={{
                        border: "2px solid #dee2e6",
                        borderRadius: "8px",
                      }}
                    >
                      {paymentTypes.map((type) => (
                        <option key={type.value} value={type.value}>
                          {type.label}
                        </option>
                      ))}
                    </Form.Select>
                  </Form.Group>
                </Col>
              </Row>

              <Form.Group className="mb-3">
                <Form.Label className="fw-bold">
                  <i className="bi bi-text-paragraph me-2"></i>
                  Description
                </Form.Label>
                <Form.Control
                  as="textarea"
                  rows={3}
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  placeholder="Enter method description"
                  style={{
                    border: "2px solid #dee2e6",
                    borderRadius: "8px",
                  }}
                />
              </Form.Group>

              <Row>
                <Col md={4}>
                  <Form.Group className="mb-3">
                    <Form.Label className="fw-bold">
                      <i className="bi bi-percent me-2"></i>
                      Processing Fee (%)
                    </Form.Label>
                    <Form.Control
                      type="number"
                      step="0.1"
                      value={formData.processingFee}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          processingFee: parseFloat(e.target.value) || 0,
                        })
                      }
                      style={{
                        border: "2px solid #dee2e6",
                        borderRadius: "8px",
                      }}
                    />
                  </Form.Group>
                </Col>
                <Col md={4}>
                  <Form.Group className="mb-3">
                    <Form.Label className="fw-bold">
                      <i className="bi bi-arrow-down me-2"></i>
                      Min Amount (₹)
                    </Form.Label>
                    <Form.Control
                      type="number"
                      value={formData.minAmount}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          minAmount: parseInt(e.target.value) || 0,
                        })
                      }
                      style={{
                        border: "2px solid #dee2e6",
                        borderRadius: "8px",
                      }}
                    />
                  </Form.Group>
                </Col>
                <Col md={4}>
                  <Form.Group className="mb-3">
                    <Form.Label className="fw-bold">
                      <i className="bi bi-arrow-up me-2"></i>
                      Max Amount (₹)
                    </Form.Label>
                    <Form.Control
                      type="number"
                      value={formData.maxAmount}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          maxAmount: parseInt(e.target.value) || 0,
                        })
                      }
                      style={{
                        border: "2px solid #dee2e6",
                        borderRadius: "8px",
                      }}
                    />
                  </Form.Group>
                </Col>
              </Row>

              <Form.Group className="mb-3">
                <Form.Check
                  type="switch"
                  id="isActive"
                  label="Active"
                  checked={formData.isActive}
                  onChange={(e) =>
                    setFormData({ ...formData, isActive: e.target.checked })
                  }
                  style={{ fontSize: "16px" }}
                />
              </Form.Group>
            </Form>
          </Modal.Body>
          <Modal.Footer style={{ padding: "20px 30px" }}>
            <Button
              variant="secondary"
              onClick={() => setShowModal(false)}
              className="d-flex align-items-center"
            >
              <i className="bi bi-x me-2"></i>
              Cancel
            </Button>
            <Button
              variant="danger"
              onClick={handleSave}
              disabled={saving}
              className="d-flex align-items-center"
              style={{
                background: "linear-gradient(135deg, #e63946 0%, #dc3545 100%)",
                border: "none",
              }}
            >
              {saving ? (
                <>
                  <Spinner animation="border" size="sm" className="me-2" />
                  Saving...
                </>
              ) : (
                <>
                  <i className="bi bi-check me-2"></i>
                  {editingMethod ? "Update" : "Create"}
                </>
              )}
            </Button>
          </Modal.Footer>
        </Modal>
      </Container>
    </div>
  );
};

export default AdminPaymentMethods;
