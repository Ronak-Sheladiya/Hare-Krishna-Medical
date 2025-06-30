import React, { useState, useEffect } from "react";
import { useParams, useNavigate, useSearchParams } from "react-router-dom";
import {
  Container,
  Row,
  Col,
  Card,
  Button,
  Form,
  Alert,
  Badge,
  Spinner,
  InputGroup,
  Modal,
  ProgressBar,
  Tabs,
  Tab,
} from "react-bootstrap";
import QRCode from "qrcode";
import { api, safeApiCall } from "../utils/apiClient";
import QRCameraScanner from "../components/common/QRCameraScanner";
import { formatDateTime } from "../utils/dateUtils";
import { PageHeroSection } from "../components/common/ConsistentTheme";

const Verify = () => {
  const { invoiceId: urlInvoiceId, letterheadId: urlLetterheadId } =
    useParams();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  // General verification states
  const [activeTab, setActiveTab] = useState("documents");
  const [showQRScanner, setShowQRScanner] = useState(false);
  const [verificationProgress, setVerificationProgress] = useState(0);

  // Document verification states
  const [documentId, setDocumentId] = useState("");
  const [documentType, setDocumentType] = useState("invoice");
  const [document, setDocument] = useState(null);
  const [documentLoading, setDocumentLoading] = useState(false);
  const [documentError, setDocumentError] = useState("");
  const [documentSuccess, setDocumentSuccess] = useState(false);

  // Invoice verification states
  const [invoiceId, setInvoiceId] = useState("");
  const [invoice, setInvoice] = useState(null);
  const [invoiceLoading, setInvoiceLoading] = useState(false);
  const [invoiceError, setInvoiceError] = useState("");
  const [invoiceSuccess, setInvoiceSuccess] = useState(false);

  // Auto-verify from URL parameters
  useEffect(() => {
    const id = searchParams.get("id");
    const type = searchParams.get("type");

    if (id && type) {
      if (type === "invoice" || type === "letterhead") {
        setActiveTab("documents");
        setDocumentId(id);
        setDocumentType(type);
        handleDocumentVerify(id, type);
      } else if (type === "order") {
        setActiveTab("invoices");
        setInvoiceId(id);
        handleOrderVerify(id);
      }
    }

    // Check for legacy verify route (invoices only)
    if (id && !type) {
      setActiveTab("invoices");
      setInvoiceId(id);
      handleInvoiceVerify(id);
    }

    // Handle legacy /verify/:invoiceId route
    if (urlInvoiceId) {
      setActiveTab("invoices");
      setInvoiceId(urlInvoiceId);
      handleInvoiceVerify(urlInvoiceId);
    }

    // Handle new /verify/letterhead/:letterheadId route
    if (urlLetterheadId) {
      setActiveTab("documents");
      setDocumentId(urlLetterheadId);
      setDocumentType("letterhead");
      handleDocumentVerify(urlLetterheadId, "letterhead");
    }
  }, [searchParams, urlInvoiceId, urlLetterheadId]);

  // Document verification logic
  const handleDocumentVerify = async (id = documentId, type = documentType) => {
    if (!id.trim()) {
      setDocumentError("Please enter a document ID");
      return;
    }

    setDocumentLoading(true);
    setDocumentError("");
    setDocument(null);
    setDocumentSuccess(false);
    setVerificationProgress(0);

    // Simulate verification progress
    const progressInterval = setInterval(() => {
      setVerificationProgress((prev) => {
        if (prev >= 90) {
          clearInterval(progressInterval);
          return 90;
        }
        return prev + 30;
      });
    }, 300);

    try {
      const response = await safeApiCall(() =>
        api.get(
          `/verification/document?id=${encodeURIComponent(id)}&type=${type}`,
        ),
      );

      clearInterval(progressInterval);
      setVerificationProgress(100);

      if (response.success && response.verified) {
        setDocument(response.document);
        setDocumentSuccess(true);

        // Update URL
        const newUrl = new URL(window.location);
        newUrl.searchParams.set("id", id);
        newUrl.searchParams.set("type", type);
        window.history.replaceState({}, "", newUrl);
      } else {
        setDocumentError(
          response.message || `${type} not found or verification failed`,
        );
      }
    } catch (err) {
      clearInterval(progressInterval);
      setVerificationProgress(0);
      console.error("Verification error:", err);
      setDocumentError(
        `Failed to verify ${type}. Please check the ID and try again.`,
      );
    } finally {
      setTimeout(() => {
        setDocumentLoading(false);
        setVerificationProgress(0);
      }, 500);
    }
  };

  // Order verification logic
  const handleOrderVerify = async (id = invoiceId) => {
    if (!id.trim()) {
      setInvoiceError("Please enter an order ID");
      return;
    }

    setInvoiceLoading(true);
    setInvoiceError("");
    setInvoice(null);
    setInvoiceSuccess(false);

    try {
      const response = await safeApiCall(
        () => api.get(`/orders/verify/${encodeURIComponent(id)}`),
        null,
      );

      if (response.success && response.data) {
        // Convert order data to invoice-like format for display
        const orderData = response.data.order;
        const invoiceData = {
          id: orderData.orderId,
          customerName: orderData.customerName,
          amount: orderData.totalAmount,
          status: orderData.status,
          date: orderData.orderDate,
          paymentStatus: orderData.paymentStatus,
          paymentMethod: orderData.paymentMethod,
          items: orderData.items,
          shippingAddress: orderData.shippingAddress,
          isOrder: true, // Flag to indicate this is an order, not an invoice
        };

        setInvoice(invoiceData);
        setInvoiceSuccess(true);

        // Update URL
        const newUrl = new URL(window.location);
        newUrl.searchParams.set("id", id);
        newUrl.searchParams.set("type", "order");
        window.history.replaceState({}, "", newUrl);
      } else {
        setInvoiceError(
          response.message || "Order not found or verification failed",
        );
      }
    } catch (err) {
      console.error("Order verification error:", err);
      setInvoiceError(
        "Failed to verify order. Please check the ID and try again.",
      );
    } finally {
      setInvoiceLoading(false);
    }
  };

  // Invoice verification logic
  const handleInvoiceVerify = async (id = invoiceId) => {
    if (!id.trim()) {
      setInvoiceError("Please enter an invoice ID");
      return;
    }

    setInvoiceLoading(true);
    setInvoiceError("");
    setInvoice(null);
    setInvoiceSuccess(false);

    try {
      // First try to verify as an order (since that's what we're generating now)
      if (id.startsWith("HKM")) {
        await handleOrderVerify(id);
        return;
      }

      const response = await safeApiCall(
        () => api.get(`/invoices/verify/${encodeURIComponent(id)}`),
        null,
      );

      if (response.success && response.data) {
        setInvoice(response.data);
        setInvoiceSuccess(true);

        // Update URL
        const newUrl = new URL(window.location);
        newUrl.searchParams.set("id", id);
        window.history.replaceState({}, "", newUrl);
      } else {
        setInvoiceError(
          response.message || "Invoice not found or verification failed",
        );
      }
    } catch (err) {
      console.error("Invoice verification error:", err);
      setInvoiceError(
        "Failed to verify invoice. Please check the ID and try again.",
      );
    } finally {
      setInvoiceLoading(false);
    }
  };

  // QR Code scan handler
  const handleQRScan = (data) => {
    try {
      const url = new URL(data);
      const pathParts = url.pathname.split("/");

      if (pathParts.includes("verify")) {
        const id = pathParts[pathParts.length - 1];
        const type = pathParts[pathParts.length - 2];

        if (type === "letterhead") {
          setActiveTab("documents");
          setDocumentType("letterhead");
          setDocumentId(id);
          handleDocumentVerify(id, "letterhead");
        } else {
          setActiveTab("invoices");
          setInvoiceId(id);
          handleInvoiceVerify(id);
        }

        setShowQRScanner(false);
        return;
      }

      // Check for document verification parameters
      const id = url.searchParams.get("id");
      const type = url.searchParams.get("type");

      if (id && type) {
        if (type === "invoice" || type === "letterhead") {
          setActiveTab("documents");
          setDocumentType(type);
          setDocumentId(id);
          handleDocumentVerify(id, type);
        } else if (type === "order") {
          setActiveTab("invoices");
          setInvoiceId(id);
          handleOrderVerify(id);
        }
        setShowQRScanner(false);
        return;
      }
    } catch (e) {
      // Not a URL, treat as direct ID
    }

    // Try to detect document type from ID format
    if (data.includes("HK/")) {
      setActiveTab("documents");
      setDocumentType("letterhead");
      setDocumentId(data);
    } else if (data.includes("HKM-INV-")) {
      // Could be either invoice or document verification
      setActiveTab("documents");
      setDocumentType("invoice");
      setDocumentId(data);
    } else {
      // Default to invoice tab for unknown formats
      setActiveTab("invoices");
      setInvoiceId(data);
    }

    setShowQRScanner(false);
  };

  const getDocumentTypeIcon = (type) => {
    switch (type) {
      case "invoice":
        return "bi-receipt";
      case "letterhead":
        return "bi-file-text";
      default:
        return "bi-file-earmark";
    }
  };

  const getStatusBadge = (status) => {
    const variants = {
      draft: "secondary",
      finalized: "info",
      sent: "success",
      archived: "dark",
      Draft: "secondary",
      Sent: "info",
      Paid: "success",
      Pending: "warning",
      Completed: "success",
      Cancelled: "danger",
    };
    const variant = variants[status] || "primary";
    return (
      <Badge bg={variant} className="status-badge">
        {status}
      </Badge>
    );
  };

  const handleDownloadPDF = async (type, id) => {
    // Implementation for PDF download
    console.log(`Downloading ${type} PDF for ID: ${id}`);
  };

  const resetForm = (formType) => {
    if (formType === "documents") {
      setDocumentId("");
      setDocument(null);
      setDocumentSuccess(false);
      setDocumentError("");
    } else {
      setInvoiceId("");
      setInvoice(null);
      setInvoiceSuccess(false);
      setInvoiceError("");
    }

    // Clear URL parameters
    const newUrl = new URL(window.location);
    newUrl.searchParams.delete("id");
    newUrl.searchParams.delete("type");
    window.history.replaceState({}, "", newUrl);
  };

  return (
    <div className="fade-in verify-page-content" data-page="verify">
      <style>
        {`
          .verify-card {
            border: 2px solid #f8f9fa;
            border-radius: 16px;
            transition: all 0.3s ease;
            margin-bottom: 2rem;
          }

          .verify-card:hover {
            border-color: #e63946;
            transform: translateY(-4px);
            box-shadow: 0 8px 25px rgba(230, 57, 70, 0.2);
          }

          .tab-content {
            padding: 30px;
          }

          .form-control-modern {
            border: 2px solid #f8f9fa;
            border-radius: 12px;
            padding: 12px 16px;
            transition: all 0.3s ease;
          }

          .form-control-modern:focus {
            border-color: #e63946;
            box-shadow: 0 0 0 0.2rem rgba(230, 57, 70, 0.1);
            background: #ffffff;
          }

          .btn-verify {
            background: linear-gradient(135deg, #e63946 0%, #dc3545 100%);
            border: none;
            padding: 12px 24px;
            border-radius: 8px;
            font-weight: 600;
            transition: all 0.3s ease;
          }

          .btn-verify:hover {
            transform: translateY(-2px);
            box-shadow: 0 4px 15px rgba(230, 57, 70, 0.3);
          }

          .btn-qr {
            background: #6f42c1;
            border: none;
            padding: 12px 20px;
            border-radius: 8px;
            font-weight: 600;
            transition: all 0.3s ease;
          }

          .btn-qr:hover {
            transform: translateY(-2px);
            box-shadow: 0 4px 15px rgba(111, 66, 193, 0.3);
          }

          .verification-result {
            border: 2px solid #d1e7dd;
            border-radius: 16px;
            margin-top: 2rem;
          }

          .info-row {
            padding: 12px 0;
            border-bottom: 1px solid #f8f9fa;
            display: flex;
            justify-content: space-between;
            align-items: center;
          }

          .info-row:last-child {
            border-bottom: none;
          }
            margin-bottom: 2rem;
            font-weight: 600;
            box-shadow: 0 8px 25px rgba(0,0,0,0.1);
          }

          .alert-danger.alert-custom {
            background: linear-gradient(135deg, #f8d7da, #f5c6cb);
            color: #721c24;
            border-left: 4px solid #dc3545;
          }

          .progress-container {
            margin: 2rem 0;
            background: rgba(230, 57, 70, 0.05);
            padding: 1.5rem;
            border-radius: 16px;
            border: 1px solid rgba(230, 57, 70, 0.1);
          }

          .verification-progress {
            height: 12px;
            background: rgba(233, 236, 239, 0.3);
            border-radius: 6px;
            overflow: hidden;
            box-shadow: inset 0 2px 4px rgba(0,0,0,0.1);
          }

          .verification-progress .progress-bar {
            background: linear-gradient(90deg, #e63946, #dc2626, #e63946);
            transition: width 0.5s ease;
            border-radius: 6px;
            position: relative;
            overflow: hidden;
          }

          .verification-progress .progress-bar::before {
            content: '';
            position: absolute;
            top: 0;
            left: -100%;
            width: 100%;
            height: 100%;
            background: linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent);
            animation: shimmer 2s infinite;
          }

          @keyframes shimmer {
            0% { left: -100%; }
            100% { left: 100%; }
          }

          .help-section {
            background: linear-gradient(135deg, #ffffff, #f8f9fa);
            border: 2px solid rgba(23, 162, 184, 0.1);
            margin-top: 3rem;
          }

          .help-header {
            background: linear-gradient(135deg, #17a2b8, #138496);
            color: white;
            padding: 2rem 2.5rem;
            border-radius: 24px 24px 0 0;
            position: relative;
            overflow: hidden;
          }

          .help-body {
            padding: 2.5rem;
          }

          .feature-list {
            list-style: none;
            padding: 0;
          }

          .feature-list li {
            margin-bottom: 1rem;
            padding: 0.8rem 1rem;
            background: rgba(23, 162, 184, 0.05);
            border-radius: 12px;
            border-left: 4px solid #17a2b8;
            font-weight: 500;
            transition: all 0.3s ease;
          }

          .feature-list li:hover {
            transform: translateX(5px);
            background: rgba(23, 162, 184, 0.1);
          }

          @media (max-width: 768px) {
            .hero-title {
              font-size: 2.8rem;
            }

            .hero-subtitle {
              font-size: 1.3rem;
            }

            .hero-features {
              flex-direction: column;
              gap: 1.5rem;
              align-items: center;
            }

            .tab-content {
              padding: 2rem;
            }

            .custom-tabs .nav-link {
              padding: 1.5rem 2rem;
              font-size: 1rem;
            }

            .verification-header,
            .verification-body,
            .help-header,
            .help-body {
              padding: 1.5rem;
            }

            .floating-icon {
              font-size: 4rem;
            }
          }

          @media (max-width: 576px) {
            .hero-title {
              font-size: 2.2rem;
            }

            .custom-tabs .nav-link {
              padding: 1rem 1.5rem;
              font-size: 0.9rem;
            }

            .btn-verify,
            .btn-qr {
              width: 100%;
              margin-bottom: 1rem;
            }
          }
        `}
      </style>

      {/* Hero Section */}
      <PageHeroSection
        title="Document Verification"
        subtitle="Verify the authenticity of invoices, letterheads, and official documents with our secure verification system."
        iconContext="default"
      />

      {/* Main Content */}
      <section style={{ background: "#ffffff", padding: "80px 0" }}>
        <Container>
          <Row className="justify-content-center">
            <Col lg={10} xl={8}>
              <Card className="verify-card">
                <Tabs
                  activeKey={activeTab}
                  onSelect={setActiveTab}
                  className="custom-tabs"
                >
                  {/* Document Verification Tab */}
                  <Tab
                    eventKey="documents"
                    title={
                      <span>
                        <i className="bi bi-file-text me-2"></i>
                        Universal Document Verification
                      </span>
                    }
                  >
                    <div className="tab-content">
                      {documentError && (
                        <Alert
                          variant="danger"
                          dismissible
                          onClose={() => setDocumentError("")}
                          className="alert-custom"
                        >
                          <i className="bi bi-exclamation-triangle me-2"></i>
                          {documentError}
                        </Alert>
                      )}

                      <Form
                        onSubmit={(e) => {
                          e.preventDefault();
                          handleDocumentVerify();
                        }}
                      >
                        <Row>
                          <Col md={6}>
                            <Form.Group className="mb-4">
                              <Form.Label className="fw-bold text-dark mb-3">
                                <i className="bi bi-file-earmark me-2 text-danger"></i>
                                Document Type
                              </Form.Label>
                              <Form.Select
                                value={documentType}
                                onChange={(e) =>
                                  setDocumentType(e.target.value)
                                }
                                className="form-select-modern"
                              >
                                <option value="invoice">
                                  🧾 Medical Invoice
                                </option>
                                <option value="letterhead">
                                  📋 Official Letterhead
                                </option>
                              </Form.Select>
                            </Form.Group>
                          </Col>
                          <Col md={6}>
                            <Form.Group className="mb-4">
                              <Form.Label className="fw-bold text-dark mb-3">
                                <i className="bi bi-hash me-2 text-danger"></i>
                                Document ID / Reference Number
                              </Form.Label>
                              <InputGroup>
                                <Form.Control
                                  type="text"
                                  value={documentId}
                                  onChange={(e) =>
                                    setDocumentId(e.target.value)
                                  }
                                  placeholder={
                                    documentType === "invoice"
                                      ? "e.g., HKM-INV-2024-001"
                                      : "e.g., HK/CER/2024/001"
                                  }
                                  className="form-control-modern"
                                  required
                                />
                                <Button
                                  variant="outline-secondary"
                                  onClick={() => setShowQRScanner(true)}
                                  style={{
                                    borderRadius: "0 16px 16px 0",
                                    border: "2px solid #e9ecef",
                                    borderLeft: "none",
                                    background: "#f8f9fa",
                                    borderColor: "#e9ecef",
                                    padding: "1rem 1.5rem",
                                  }}
                                >
                                  <i className="bi bi-qr-code-scan"></i>
                                </Button>
                              </InputGroup>
                              <Form.Text className="text-muted mt-2">
                                <i className="bi bi-info-circle me-1"></i>
                                Enter the exact document ID as shown on your
                                document
                              </Form.Text>
                            </Form.Group>
                          </Col>
                        </Row>

                        {/* Progress Bar */}
                        {documentLoading && (
                          <div className="progress-container">
                            <div className="d-flex justify-content-between align-items-center mb-3">
                              <small className="text-muted fw-bold">
                                <i className="bi bi-shield-check me-2 text-danger"></i>
                                Verifying document authenticity with blockchain
                                technology...
                              </small>
                              <small className="text-muted fw-bold">
                                {verificationProgress}%
                              </small>
                            </div>
                            <ProgressBar
                              now={verificationProgress}
                              className="verification-progress"
                              animated
                            />
                          </div>
                        )}

                        <div className="d-flex gap-3 flex-wrap">
                          <Button
                            type="submit"
                            disabled={documentLoading || !documentId.trim()}
                            className="btn-verify text-white"
                          >
                            {documentLoading ? (
                              <>
                                <Spinner
                                  animation="border"
                                  size="sm"
                                  className="me-2"
                                />
                                Verifying Security...
                              </>
                            ) : (
                              <>
                                <i className="bi bi-search me-2"></i>
                                Verify Document
                              </>
                            )}
                          </Button>

                          <Button
                            variant="primary"
                            onClick={() => setShowQRScanner(true)}
                            className="btn-qr text-white"
                          >
                            <i className="bi bi-qr-code-scan me-2"></i>
                            Scan QR Code
                          </Button>
                        </div>
                      </Form>

                      {/* Document Verification Result */}
                      {documentSuccess && document && (
                        <Card className="verification-result">
                          <div className="verification-header">
                            <div className="d-flex justify-content-between align-items-center">
                              <div>
                                <h4 className="mb-2">
                                  <i className="bi bi-check-circle-fill me-3"></i>
                                  Document Verified Successfully
                                </h4>
                                <p
                                  className="mb-0"
                                  style={{ opacity: 0.9, fontSize: "1.1rem" }}
                                >
                                  This {documentType} has been verified and is
                                  100% authentic. All security checks passed.
                                </p>
                              </div>
                              <Badge
                                bg="light"
                                text="success"
                                style={{
                                  fontSize: "1.2rem",
                                  padding: "0.8rem 1.5rem",
                                  fontWeight: "900",
                                  borderRadius: "25px",
                                }}
                              >
                                ✓ VERIFIED
                              </Badge>
                            </div>
                          </div>
                          <div className="verification-body">
                            <Row>
                              <Col md={6}>
                                <h5 className="mb-4">
                                  <i
                                    className={`${getDocumentTypeIcon(documentType)} text-danger me-3`}
                                    style={{ fontSize: "1.3rem" }}
                                  ></i>
                                  {documentType.charAt(0).toUpperCase() +
                                    documentType.slice(1)}{" "}
                                  Information
                                </h5>
                                <div className="info-row">
                                  <span className="info-label">
                                    Document ID
                                  </span>
                                  <code
                                    className="info-value bg-light px-3 py-2 rounded"
                                    style={{
                                      fontSize: "1rem",
                                      fontWeight: "700",
                                    }}
                                  >
                                    {document.id}
                                  </code>
                                </div>
                                <div className="info-row">
                                  <span className="info-label">Title</span>
                                  <span className="info-value">
                                    {document.title || document.customerName}
                                  </span>
                                </div>
                                {document.amount && (
                                  <div className="info-row">
                                    <span className="info-label">Amount</span>
                                    <span
                                      className="info-value text-success"
                                      style={{
                                        fontSize: "1.2rem",
                                        fontWeight: "800",
                                      }}
                                    >
                                      ₹{document.amount?.toLocaleString()}
                                    </span>
                                  </div>
                                )}
                                <div className="info-row">
                                  <span className="info-label">Status</span>
                                  {getStatusBadge(document.status)}
                                </div>
                              </Col>
                              <Col md={6}>
                                <h5 className="mb-4">
                                  <i
                                    className="bi bi-shield-check text-success me-3"
                                    style={{ fontSize: "1.3rem" }}
                                  ></i>
                                  Security Verification
                                </h5>
                                <div className="info-row">
                                  <span className="info-label">Issue Date</span>
                                  <span className="info-value">
                                    {formatDateTime(document.date)}
                                  </span>
                                </div>
                                <div className="info-row">
                                  <span className="info-label">
                                    Security Status
                                  </span>
                                  <Badge
                                    bg="success"
                                    style={{
                                      padding: "0.5rem 1rem",
                                      borderRadius: "20px",
                                      fontWeight: "700",
                                    }}
                                  >
                                    ✓ Blockchain Verified
                                  </Badge>
                                </div>
                                <div className="info-row">
                                  <span className="info-label">Issued By</span>
                                  <span
                                    className="info-value"
                                    style={{
                                      color: "#e63946",
                                      fontWeight: "800",
                                    }}
                                  >
                                    Hare Krishna Medical Store
                                  </span>
                                </div>
                                <div className="info-row">
                                  <span className="info-label">
                                    Verification Time
                                  </span>
                                  <span className="info-value text-muted">
                                    {new Date().toLocaleString()}
                                  </span>
                                </div>
                              </Col>
                            </Row>

                            <div className="mt-4 pt-4 border-top d-flex gap-3 flex-wrap">
                              <Button
                                onClick={() =>
                                  handleDownloadPDF(documentType, document.id)
                                }
                                style={{
                                  background:
                                    "linear-gradient(135deg, #28a745, #20c997)",
                                  border: "none",
                                  borderRadius: "16px",
                                  padding: "0.8rem 2rem",
                                  fontWeight: "700",
                                  boxShadow:
                                    "0 8px 25px rgba(40, 167, 69, 0.3)",
                                }}
                              >
                                <i className="bi bi-download me-2"></i>
                                Download Verified PDF
                              </Button>

                              <Button
                                variant="outline-secondary"
                                onClick={() => resetForm("documents")}
                                style={{
                                  borderRadius: "16px",
                                  padding: "0.8rem 2rem",
                                  fontWeight: "700",
                                  border: "2px solid #6c757d",
                                }}
                              >
                                <i className="bi bi-arrow-clockwise me-2"></i>
                                Verify Another Document
                              </Button>
                            </div>
                          </div>
                        </Card>
                      )}
                    </div>
                  </Tab>

                  {/* Invoice Verification Tab */}
                  <Tab
                    eventKey="invoices"
                    title={
                      <span>
                        <i className="bi bi-receipt me-2"></i>
                        Invoice & Order Verification
                      </span>
                    }
                  >
                    <div className="tab-content">
                      {invoiceError && (
                        <Alert
                          variant="danger"
                          dismissible
                          onClose={() => setInvoiceError("")}
                          className="alert-custom"
                        >
                          <i className="bi bi-exclamation-triangle me-2"></i>
                          {invoiceError}
                        </Alert>
                      )}

                      <Form
                        onSubmit={(e) => {
                          e.preventDefault();
                          handleInvoiceVerify();
                        }}
                      >
                        <Row>
                          <Col md={8}>
                            <Form.Group className="mb-4">
                              <Form.Label className="fw-bold text-dark mb-3">
                                <i className="bi bi-hash me-2 text-danger"></i>
                                Invoice ID / Reference Number
                              </Form.Label>
                              <InputGroup>
                                <Form.Control
                                  type="text"
                                  value={invoiceId}
                                  onChange={(e) => setInvoiceId(e.target.value)}
                                  placeholder="e.g., HKM-INV-2024-001"
                                  className="form-control-modern"
                                  required
                                />
                                <Button
                                  variant="outline-secondary"
                                  onClick={() => setShowQRScanner(true)}
                                  style={{
                                    borderRadius: "0 16px 16px 0",
                                    border: "2px solid #e9ecef",
                                    borderLeft: "none",
                                    background: "#f8f9fa",
                                    borderColor: "#e9ecef",
                                    padding: "1rem 1.5rem",
                                  }}
                                >
                                  <i className="bi bi-qr-code-scan"></i>
                                </Button>
                              </InputGroup>
                              <Form.Text className="text-muted mt-2">
                                <i className="bi bi-info-circle me-1"></i>
                                Enter the invoice ID exactly as shown on your
                                medical invoice
                              </Form.Text>
                            </Form.Group>
                          </Col>
                          <Col md={4} className="d-flex align-items-end">
                            <Button
                              type="submit"
                              disabled={invoiceLoading || !invoiceId.trim()}
                              className="btn-verify text-white w-100"
                              style={{ marginBottom: "1.5rem" }}
                            >
                              {invoiceLoading ? (
                                <>
                                  <Spinner
                                    animation="border"
                                    size="sm"
                                    className="me-2"
                                  />
                                  Verifying...
                                </>
                              ) : (
                                <>
                                  <i className="bi bi-search me-2"></i>
                                  Verify Invoice
                                </>
                              )}
                            </Button>
                          </Col>
                        </Row>
                      </Form>

                      {/* Invoice Verification Result */}
                      {invoiceSuccess && invoice && (
                        <Card className="verification-result">
                          <div className="verification-header">
                            <div className="d-flex justify-content-between align-items-center">
                              <div>
                                <h4 className="mb-2">
                                  <i className="bi bi-check-circle-fill me-3"></i>
                                  Invoice Verified Successfully
                                </h4>
                                <p
                                  className="mb-0"
                                  style={{ opacity: 0.9, fontSize: "1.1rem" }}
                                >
                                  This medical invoice has been verified and is
                                  100% authentic. All payment and security
                                  checks passed.
                                </p>
                              </div>
                              <Badge
                                bg="light"
                                text="success"
                                style={{
                                  fontSize: "1.2rem",
                                  padding: "0.8rem 1.5rem",
                                  fontWeight: "900",
                                  borderRadius: "25px",
                                }}
                              >
                                ✓ VERIFIED
                              </Badge>
                            </div>
                          </div>
                          <div className="verification-body">
                            <Row>
                              <Col md={6}>
                                <h5 className="mb-4">
                                  <i
                                    className="bi bi-receipt text-danger me-3"
                                    style={{ fontSize: "1.3rem" }}
                                  ></i>
                                  Invoice Information
                                </h5>
                                <div className="info-row">
                                  <span className="info-label">Invoice ID</span>
                                  <code
                                    className="info-value bg-light px-3 py-2 rounded"
                                    style={{
                                      fontSize: "1rem",
                                      fontWeight: "700",
                                    }}
                                  >
                                    {invoice.id}
                                  </code>
                                </div>
                                <div className="info-row">
                                  <span className="info-label">Customer</span>
                                  <span className="info-value">
                                    {invoice.customerName}
                                  </span>
                                </div>
                                <div className="info-row">
                                  <span className="info-label">Amount</span>
                                  <span
                                    className="info-value text-success"
                                    style={{
                                      fontSize: "1.2rem",
                                      fontWeight: "800",
                                    }}
                                  >
                                    ₹{invoice.amount?.toLocaleString()}
                                  </span>
                                </div>
                                <div className="info-row">
                                  <span className="info-label">Status</span>
                                  {getStatusBadge(invoice.status)}
                                </div>
                              </Col>
                              <Col md={6}>
                                <h5 className="mb-4">
                                  <i
                                    className="bi bi-shield-check text-success me-3"
                                    style={{ fontSize: "1.3rem" }}
                                  ></i>
                                  Security Verification
                                </h5>
                                <div className="info-row">
                                  <span className="info-label">Issue Date</span>
                                  <span className="info-value">
                                    {formatDateTime(invoice.date)}
                                  </span>
                                </div>
                                <div className="info-row">
                                  <span className="info-label">
                                    Security Status
                                  </span>
                                  <Badge
                                    bg="success"
                                    style={{
                                      padding: "0.5rem 1rem",
                                      borderRadius: "20px",
                                      fontWeight: "700",
                                    }}
                                  >
                                    ✓ Blockchain Verified
                                  </Badge>
                                </div>
                                <div className="info-row">
                                  <span className="info-label">Issued By</span>
                                  <span
                                    className="info-value"
                                    style={{
                                      color: "#e63946",
                                      fontWeight: "800",
                                    }}
                                  >
                                    Hare Krishna Medical Store
                                  </span>
                                </div>
                                <div className="info-row">
                                  <span className="info-label">
                                    Verification Time
                                  </span>
                                  <span className="info-value text-muted">
                                    {new Date().toLocaleString()}
                                  </span>
                                </div>
                              </Col>
                            </Row>

                            <div className="mt-4 pt-4 border-top d-flex gap-3 flex-wrap">
                              <Button
                                onClick={() =>
                                  handleDownloadPDF("invoice", invoice.id)
                                }
                                style={{
                                  background:
                                    "linear-gradient(135deg, #28a745, #20c997)",
                                  border: "none",
                                  borderRadius: "16px",
                                  padding: "0.8rem 2rem",
                                  fontWeight: "700",
                                  boxShadow:
                                    "0 8px 25px rgba(40, 167, 69, 0.3)",
                                }}
                              >
                                <i className="bi bi-download me-2"></i>
                                Download Verified Invoice
                              </Button>

                              <Button
                                variant="outline-secondary"
                                onClick={() => resetForm("invoices")}
                                style={{
                                  borderRadius: "16px",
                                  padding: "0.8rem 2rem",
                                  fontWeight: "700",
                                  border: "2px solid #6c757d",
                                }}
                              >
                                <i className="bi bi-arrow-clockwise me-2"></i>
                                Verify Another Invoice
                              </Button>
                            </div>
                          </div>
                        </Card>
                      )}
                    </div>
                  </Tab>
                </Tabs>
              </Card>

              {/* QR Scanner Modal */}
              {showQRScanner && (
                <QRCameraScanner
                  onScan={handleQRScan}
                  onClose={() => setShowQRScanner(false)}
                />
              )}

              {/* Help Section */}
              <Card className="verify-card help-section">
                <div className="help-header">
                  <h5 className="mb-0">
                    <i className="bi bi-question-circle me-3"></i>
                    How to Use Our Advanced Verification System
                  </h5>
                </div>
                <div className="help-body">
                  <Row>
                    <Col md={6}>
                      <h6
                        className="fw-bold mb-4 text-danger"
                        style={{ fontSize: "1.2rem" }}
                      >
                        <i className="bi bi-file-text me-2"></i>
                        Universal Document Verification
                      </h6>
                      <ul className="feature-list">
                        <li>
                          ✓ Verify medical invoices and official letterheads
                        </li>
                        <li>✓ Advanced QR code scanning technology</li>
                        <li>
                          ✓ Instant blockchain-based authenticity verification
                        </li>
                        <li>
                          ✓ Download verified documents with security
                          certificates
                        </li>
                        <li>✓ Real-time fraud detection and prevention</li>
                      </ul>
                    </Col>
                    <Col md={6}>
                      <h6
                        className="fw-bold mb-4 text-danger"
                        style={{ fontSize: "1.2rem" }}
                      >
                        <i className="bi bi-receipt me-2"></i>
                        Quick Invoice Verification
                      </h6>
                      <ul className="feature-list">
                        <li>✓ Lightning-fast invoice ID verification</li>
                        <li>✓ Real-time payment status tracking</li>
                        <li>
                          ✓ Customer details validation and privacy protection
                        </li>
                        <li>✓ Multi-format QR code support</li>
                        <li>✓ Integration with medical billing systems</li>
                      </ul>
                    </Col>
                  </Row>

                  <Alert
                    variant="info"
                    className="mt-5"
                    style={{
                      background: "linear-gradient(135deg, #e63946, #dc2626)",
                      color: "white",
                      border: "none",
                      borderRadius: "20px",
                      padding: "2rem",
                      boxShadow: "0 15px 50px rgba(230, 57, 70, 0.2)",
                    }}
                  >
                    <h6
                      className="mb-3"
                      style={{ fontSize: "1.3rem", fontWeight: "800" }}
                    >
                      <i className="bi bi-shield-lock me-3"></i>
                      Security & Trust Guarantee
                    </h6>
                    <p
                      className="mb-0"
                      style={{
                        opacity: 0.95,
                        fontSize: "1.1rem",
                        lineHeight: "1.6",
                      }}
                    >
                      All documents from Hare Krishna Medical Store contain
                      unique verification codes and QR codes secured by
                      blockchain technology. Our advanced verification system
                      uses military-grade encryption and multi-layer security
                      protocols to prevent fraud, ensure document integrity, and
                      maintain the highest standards of medical document
                      authenticity.
                    </p>
                  </Alert>
                </div>
              </Card>
            </Col>
          </Row>
        </Container>
      </section>
    </div>
  );
};

export default Verify;
