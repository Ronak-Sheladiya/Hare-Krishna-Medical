import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Container,
  Row,
  Col,
  Card,
  Alert,
  Spinner,
  Button,
  Badge,
} from "react-bootstrap";

const InvoiceQRVerify = () => {
  const { invoiceId } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [invoice, setInvoice] = useState(null);
  const [verificationStatus, setVerificationStatus] = useState(null);

  const API_BASE_URL =
    import.meta.env.VITE_BACKEND_URL || "http://localhost:5000";

  useEffect(() => {
    if (invoiceId) {
      verifyInvoice();
    } else {
      setError("Invalid QR code - no invoice ID found");
      setLoading(false);
    }
  }, [invoiceId]);

  const verifyInvoice = async () => {
    try {
      setLoading(true);
      setError(null);

      // Try to fetch invoice from API
      const response = await fetch(
        `${API_BASE_URL}/api/invoices/verify/${invoiceId}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        },
      );

      if (response.ok) {
        const data = await response.json();
        if (data.success && data.data) {
          setInvoice(data.data);
          setVerificationStatus("verified");
        } else {
          setError(data.message || "Invoice not found");
          setVerificationStatus("not_found");
        }
      } else if (response.status === 404) {
        setError("Invoice not found or has been deleted");
        setVerificationStatus("not_found");
      } else {
        // If API is not available, set error status
        setError(
          "Unable to connect to server. Please check your connection and try again.",
        );
        setVerificationStatus("error");
      }
    } catch (error) {
      console.error("Error verifying invoice:", error);
      setError("Unable to verify invoice. Please try again.");
      setVerificationStatus("error");
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      paid: { variant: "success", label: "Paid" },
      pending: { variant: "warning", label: "Pending" },
      overdue: { variant: "danger", label: "Overdue" },
      cancelled: { variant: "secondary", label: "Cancelled" },
    };
    const config = statusConfig[status] || statusConfig.pending;
    return <Badge bg={config.variant}>{config.label}</Badge>;
  };

  const getVerificationBadge = () => {
    switch (verificationStatus) {
      case "verified":
        return (
          <Alert variant="success" className="d-flex align-items-center">
            <i
              className="bi bi-check-circle-fill me-2"
              style={{ fontSize: "1.5rem" }}
            ></i>
            <div>
              <strong>✓ Invoice Verified Successfully</strong>
              <br />
              This is a genuine invoice from Hare Krishna Medical Store.
            </div>
          </Alert>
        );
      case "not_found":
        return (
          <Alert variant="danger" className="d-flex align-items-center">
            <i
              className="bi bi-x-circle-fill me-2"
              style={{ fontSize: "1.5rem" }}
            ></i>
            <div>
              <strong>✗ Invoice Not Found</strong>
              <br />
              This invoice does not exist in our records or may have been
              deleted.
            </div>
          </Alert>
        );
      case "error":
        return (
          <Alert variant="warning" className="d-flex align-items-center">
            <i
              className="bi bi-exclamation-triangle-fill me-2"
              style={{ fontSize: "1.5rem" }}
            ></i>
            <div>
              <strong>⚠ Verification Error</strong>
              <br />
              Unable to verify the invoice at this time. Please try again later.
            </div>
          </Alert>
        );
      default:
        return null;
    }
  };

  if (loading) {
    return (
      <Container className="py-5">
        <Row className="justify-content-center">
          <Col md={8}>
            <Card>
              <Card.Body className="text-center py-5">
                <Spinner animation="border" role="status" size="lg" />
                <h4 className="mt-3">Verifying Invoice...</h4>
                <p className="text-muted">
                  Please wait while we verify the invoice authenticity.
                </p>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    );
  }

  return (
    <Container className="py-5">
      <Row className="justify-content-center">
        <Col md={10}>
          {/* Verification Status */}
          <div className="mb-4">{getVerificationBadge()}</div>

          {error && !invoice && (
            <Card>
              <Card.Body className="text-center py-5">
                <i
                  className="bi bi-exclamation-triangle text-warning"
                  style={{ fontSize: "3rem" }}
                ></i>
                <h4 className="mt-3 text-danger">Verification Failed</h4>
                <p className="text-muted">{error}</p>
                <div className="d-flex gap-2 justify-content-center">
                  <Button variant="outline-primary" onClick={verifyInvoice}>
                    <i className="bi bi-arrow-clockwise me-2"></i>
                    Try Again
                  </Button>
                  <Button variant="secondary" onClick={() => navigate("/")}>
                    <i className="bi bi-house me-2"></i>
                    Go Home
                  </Button>
                </div>
              </Card.Body>
            </Card>
          )}

          {invoice && (
            <Card>
              <Card.Header className="bg-primary text-white">
                <Row className="align-items-center">
                  <Col>
                    <h5 className="mb-0">
                      <i className="bi bi-receipt me-2"></i>
                      Invoice Verification Details
                    </h5>
                  </Col>
                  <Col xs="auto">
                    <div className="d-flex gap-2">
                      <Button
                        variant="light"
                        size="sm"
                        onClick={() => navigate(`/invoice/${invoice._id}`)}
                      >
                        <i className="bi bi-eye me-2"></i>
                        View Full Invoice
                      </Button>
                      <Button
                        variant="outline-light"
                        size="sm"
                        onClick={() => window.print()}
                      >
                        <i className="bi bi-printer me-2"></i>
                        Print
                      </Button>
                    </div>
                  </Col>
                </Row>
              </Card.Header>
              <Card.Body>
                <Row>
                  <Col md={6}>
                    <h6 className="text-primary mb-3">
                      <i className="bi bi-file-text me-2"></i>
                      Invoice Information
                    </h6>
                    <table className="table table-borderless">
                      <tbody>
                        <tr>
                          <td>
                            <strong>Invoice Number:</strong>
                          </td>
                          <td>
                            <code className="bg-light p-2 rounded">
                              {invoice.invoiceNumber}
                            </code>
                          </td>
                        </tr>
                        <tr>
                          <td>
                            <strong>Issue Date:</strong>
                          </td>
                          <td>
                            {new Date(invoice.issueDate).toLocaleDateString(
                              "en-IN",
                              {
                                year: "numeric",
                                month: "long",
                                day: "numeric",
                              },
                            )}
                          </td>
                        </tr>
                        <tr>
                          <td>
                            <strong>Due Date:</strong>
                          </td>
                          <td>
                            {new Date(invoice.dueDate).toLocaleDateString(
                              "en-IN",
                              {
                                year: "numeric",
                                month: "long",
                                day: "numeric",
                              },
                            )}
                          </td>
                        </tr>
                        <tr>
                          <td>
                            <strong>Status:</strong>
                          </td>
                          <td>{getStatusBadge(invoice.status)}</td>
                        </tr>
                        <tr>
                          <td>
                            <strong>Total Amount:</strong>
                          </td>
                          <td>
                            <span className="fs-5 fw-bold text-success">
                              ₹{parseFloat(invoice.total).toFixed(2)}
                            </span>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </Col>
                  <Col md={6}>
                    <h6 className="text-primary mb-3">
                      <i className="bi bi-person me-2"></i>
                      Customer Information
                    </h6>
                    <table className="table table-borderless">
                      <tbody>
                        <tr>
                          <td>
                            <strong>Name:</strong>
                          </td>
                          <td>{invoice.customerName}</td>
                        </tr>
                        <tr>
                          <td>
                            <strong>Email:</strong>
                          </td>
                          <td>{invoice.customerEmail}</td>
                        </tr>
                        <tr>
                          <td>
                            <strong>Phone:</strong>
                          </td>
                          <td>{invoice.customerPhone}</td>
                        </tr>
                        {invoice.customerAddress && (
                          <tr>
                            <td>
                              <strong>Address:</strong>
                            </td>
                            <td>{invoice.customerAddress}</td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </Col>
                </Row>

                <hr />

                <h6 className="text-primary mb-3">
                  <i className="bi bi-list-ul me-2"></i>
                  Invoice Items
                </h6>
                <div className="table-responsive">
                  <table className="table table-hover">
                    <thead className="table-light">
                      <tr>
                        <th>Item</th>
                        <th className="text-center">Quantity</th>
                        <th className="text-end">Unit Price</th>
                        <th className="text-end">Total</th>
                      </tr>
                    </thead>
                    <tbody>
                      {invoice.items?.map((item, index) => (
                        <tr key={index}>
                          <td>{item.name}</td>
                          <td className="text-center">{item.quantity}</td>
                          <td className="text-end">
                            ₹{parseFloat(item.price).toFixed(2)}
                          </td>
                          <td className="text-end">
                            ₹{parseFloat(item.total).toFixed(2)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                    <tfoot className="table-light">
                      <tr>
                        <td colSpan="3">
                          <strong>Subtotal:</strong>
                        </td>
                        <td className="text-end">
                          <strong>
                            ₹{parseFloat(invoice.subtotal).toFixed(2)}
                          </strong>
                        </td>
                      </tr>
                      <tr>
                        <td colSpan="3">
                          <strong>Tax:</strong>
                        </td>
                        <td className="text-end">
                          <strong className="text-success">
                            Included in product price
                          </strong>
                        </td>
                      </tr>
                      <tr className="table-primary">
                        <td colSpan="3">
                          <strong>Total Amount:</strong>
                        </td>
                        <td className="text-end">
                          <strong className="fs-5">
                            ₹{parseFloat(invoice.total).toFixed(2)}
                          </strong>
                        </td>
                      </tr>
                    </tfoot>
                  </table>
                </div>

                <hr />

                <div className="text-center">
                  <div className="row justify-content-center">
                    <div className="col-md-6">
                      <div className="bg-light p-3 rounded">
                        <i
                          className="bi bi-shield-check text-success"
                          style={{ fontSize: "2rem" }}
                        ></i>
                        <h6 className="mt-2 mb-1">Digitally Verified</h6>
                        <small className="text-muted">
                          This invoice has been digitally verified and is
                          authentic.
                          <br />
                          Generated by Hare Krishna Medical Store
                        </small>
                      </div>
                    </div>
                  </div>
                </div>
              </Card.Body>
              <Card.Footer className="bg-light">
                <div className="d-flex justify-content-between align-items-center">
                  <small className="text-muted">
                    <i className="bi bi-info-circle me-1"></i>
                    Scanned via QR Code at {new Date().toLocaleString("en-IN")}
                  </small>
                  <div className="d-flex gap-2">
                    <Button
                      variant="outline-secondary"
                      onClick={() => navigate("/")}
                    >
                      <i className="bi bi-house me-2"></i>
                      Back to Home
                    </Button>
                    <Button
                      variant="primary"
                      onClick={() => navigate(`/invoice/${invoice._id}`)}
                    >
                      <i className="bi bi-eye me-2"></i>
                      View Full Invoice
                    </Button>
                  </div>
                </div>
              </Card.Footer>
            </Card>
          )}
        </Col>
      </Row>
    </Container>
  );
};

export default InvoiceQRVerify;
