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

const Verify = () => {
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
      }
    }

    // Check for legacy verify route (invoices only)
    if (id && !type) {
      setActiveTab("invoices");
      setInvoiceId(id);
      handleInvoiceVerify(id);
    }
  }, [searchParams]);

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
      const response = await safeApiCall(() =>
        api.get(`/verification/invoice?id=${encodeURIComponent(id)}`),
      );

      if (response.success && response.verified) {
        setInvoice(response.invoice);
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

  const handleQRScan = (data) => {
    try {
      // Try to parse as URL first
      const url = new URL(data);
      const id = url.searchParams.get("id");
      const type = url.searchParams.get("type");

      if (id && type) {
        if (type === "invoice" || type === "letterhead") {
          setActiveTab("documents");
          setDocumentId(id);
          setDocumentType(type);
          handleDocumentVerify(id, type);
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
      Overdue: "danger",
      Cancelled: "dark",
    };
    return (
      <Badge bg={variants[status] || "secondary"} className="status-badge">
        {status}
      </Badge>
    );
  };

  const handleDownloadPDF = async (docType, docId) => {
    try {
      const endpoint =
        docType === "invoice"
          ? `/invoices/${docId}/pdf`
          : `/letterheads/${docId}/pdf`;

      const response = await api.get(endpoint, {
        responseType: "blob",
      });

      const blob = new Blob([response.data], { type: "application/pdf" });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `${docType}-${docId}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Download PDF error:", error);
    }
  };

  const resetForm = (formType) => {
    if (formType === "documents") {
      setDocument(null);
      setDocumentSuccess(false);
      setDocumentId("");
      setDocumentError("");
    } else if (formType === "invoices") {
      setInvoice(null);
      setInvoiceSuccess(false);
      setInvoiceId("");
      setInvoiceError("");
    }

    // Clear URL parameters
    const newUrl = new URL(window.location);
    newUrl.searchParams.delete("id");
    newUrl.searchParams.delete("type");
    window.history.replaceState({}, "", newUrl);
  };

  return (
    <div className="verify-page">
      <style>
        {`
          .verify-page {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            min-height: 100vh;
            padding: 0;
          }

          .hero-section {
            background: linear-gradient(135deg, rgba(230, 57, 70, 0.9), rgba(29, 38, 113, 0.9));
            color: white;
            padding: 80px 0 60px;
            position: relative;
            overflow: hidden;
          }

          .hero-section::before {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><defs><pattern id="grain" width="100" height="100" patternUnits="userSpaceOnUse"><circle cx="25" cy="25" r="1" fill="white" opacity="0.1"/><circle cx="75" cy="75" r="1" fill="white" opacity="0.1"/><circle cx="75" cy="25" r="1" fill="white" opacity="0.1"/><circle cx="25" cy="75" r="1" fill="white" opacity="0.1"/></pattern></defs><rect width="100" height="100" fill="url(%23grain)"/></svg>');
            opacity: 0.3;
          }

          .hero-content {
            position: relative;
            z-index: 2;
            text-align: center;
          }

          .hero-title {
            font-size: 3.5rem;
            font-weight: 800;
            margin-bottom: 1rem;
            text-shadow: 2px 2px 4px rgba(0,0,0,0.3);
          }

          .hero-subtitle {
            font-size: 1.4rem;
            opacity: 0.9;
            margin-bottom: 2rem;
            font-weight: 300;
          }

          .hero-features {
            display: flex;
            justify-content: center;
            gap: 2rem;
            margin-top: 2rem;
          }

          .hero-feature {
            display: flex;
            align-items: center;
            gap: 0.5rem;
            font-size: 1.1rem;
            opacity: 0.9;
          }

          .main-content {
            background: #f8f9fa;
            padding: 60px 0;
            position: relative;
          }

          .verify-card {
            background: white;
            border-radius: 20px;
            box-shadow: 0 20px 60px rgba(0,0,0,0.1);
            border: none;
            overflow: hidden;
            transition: all 0.3s ease;
            margin-bottom: 2rem;
          }

          .verify-card:hover {
            transform: translateY(-5px);
            box-shadow: 0 30px 80px rgba(0,0,0,0.15);
          }

          .custom-tabs {
            background: white;
            border-radius: 20px 20px 0 0;
            padding: 0;
            border: none;
          }

          .custom-tabs .nav-link {
            border: none;
            border-radius: 0;
            padding: 1.5rem 2rem;
            font-weight: 600;
            color: #666;
            background: transparent;
            transition: all 0.3s ease;
          }

          .custom-tabs .nav-link.active {
            background: linear-gradient(135deg, #e63946, #dc3545);
            color: white;
            border: none;
          }

          .custom-tabs .nav-link:first-child {
            border-radius: 20px 0 0 0;
          }

          .custom-tabs .nav-link:last-child {
            border-radius: 0 20px 0 0;
          }

          .tab-content {
            background: white;
            border-radius: 0 0 20px 20px;
            padding: 2rem;
          }

          .form-control-modern {
            border-radius: 12px;
            border: 2px solid #e9ecef;
            padding: 0.8rem 1rem;
            font-size: 1rem;
            transition: all 0.3s ease;
          }

          .form-control-modern:focus {
            border-color: #e63946;
            box-shadow: 0 0 0 0.2rem rgba(230, 57, 70, 0.25);
          }

          .form-select-modern {
            border-radius: 12px;
            border: 2px solid #e9ecef;
            padding: 0.8rem 1rem;
            font-size: 1rem;
            transition: all 0.3s ease;
          }

          .form-select-modern:focus {
            border-color: #e63946;
            box-shadow: 0 0 0 0.2rem rgba(230, 57, 70, 0.25);
          }

          .btn-verify {
            background: linear-gradient(135deg, #e63946, #dc3545);
            border: none;
            padding: 0.8rem 2rem;
            border-radius: 12px;
            font-weight: 600;
            font-size: 1rem;
            transition: all 0.3s ease;
            box-shadow: 0 4px 15px rgba(230, 57, 70, 0.3);
          }

          .btn-verify:hover {
            transform: translateY(-2px);
            box-shadow: 0 8px 25px rgba(230, 57, 70, 0.4);
          }

          .btn-qr {
            background: linear-gradient(135deg, #6f42c1, #5a2d91);
            border: none;
            padding: 0.8rem 1.5rem;
            border-radius: 12px;
            font-weight: 600;
            transition: all 0.3s ease;
            box-shadow: 0 4px 15px rgba(111, 66, 193, 0.3);
          }

          .btn-qr:hover {
            transform: translateY(-2px);
            box-shadow: 0 8px 25px rgba(111, 66, 193, 0.4);
          }

          .verification-result {
            background: linear-gradient(135deg, #28a745, #20c997);
            color: white;
            border-radius: 20px;
            border: none;
            overflow: hidden;
            animation: slideInUp 0.6s ease;
            margin-top: 2rem;
          }

          @keyframes slideInUp {
            from {
              opacity: 0;
              transform: translateY(30px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }

          .verification-header {
            background: rgba(255,255,255,0.1);
            padding: 1.5rem 2rem;
            border-bottom: 1px solid rgba(255,255,255,0.2);
          }

          .verification-body {
            padding: 2rem;
            background: white;
            color: #333;
          }

          .info-row {
            padding: 0.7rem 0;
            border-bottom: 1px solid #f0f0f0;
            display: flex;
            justify-content: space-between;
            align-items: center;
          }

          .info-row:last-child {
            border-bottom: none;
          }

          .info-label {
            font-weight: 600;
            color: #666;
            font-size: 0.95rem;
          }

          .info-value {
            font-weight: 500;
            color: #333;
          }

          .status-badge {
            padding: 0.4rem 0.8rem;
            border-radius: 20px;
            font-size: 0.85rem;
            font-weight: 600;
          }

          .floating-icon {
            position: absolute;
            color: rgba(255,255,255,0.1);
            font-size: 8rem;
            z-index: 1;
          }

          .floating-icon-1 {
            top: 10%;
            right: 10%;
            animation: float 6s ease-in-out infinite;
          }

          .floating-icon-2 {
            bottom: 10%;
            left: 10%;
            animation: float 6s ease-in-out infinite reverse;
          }

          @keyframes float {
            0%, 100% { transform: translateY(0px); }
            50% { transform: translateY(-20px); }
          }

          .alert-custom {
            border-radius: 12px;
            border: none;
            padding: 1rem 1.5rem;
            margin-bottom: 2rem;
          }

          .progress-container {
            margin: 1rem 0;
          }

          .verification-progress {
            height: 8px;
            background: #e9ecef;
            border-radius: 4px;
            overflow: hidden;
          }

          .verification-progress .progress-bar {
            background: linear-gradient(90deg, #e63946, #dc3545);
            transition: width 0.3s ease;
          }

          @media (max-width: 768px) {
            .hero-title {
              font-size: 2.5rem;
            }
            
            .hero-subtitle {
              font-size: 1.2rem;
            }
            
            .hero-features {
              flex-direction: column;
              gap: 1rem;
            }
            
            .tab-content {
              padding: 1.5rem;
            }

            .custom-tabs .nav-link {
              padding: 1rem 1.5rem;
            }
          }
        `}
      </style>

      {/* Hero Section */}
      <div className="hero-section">
        <div className="floating-icon floating-icon-1">
          <i className="bi bi-shield-check"></i>
        </div>
        <div className="floating-icon floating-icon-2">
          <i className="bi bi-qr-code"></i>
        </div>
        <Container>
          <div className="hero-content">
            <h1 className="hero-title">
              <i className="bi bi-shield-check me-3"></i>
              Verification Center
            </h1>
            <p className="hero-subtitle">
              Verify invoices, letterheads, and official documents with our
              comprehensive verification system
            </p>
            <div className="hero-features">
              <div className="hero-feature">
                <i className="bi bi-lightning-charge"></i>
                <span>Instant Verification</span>
              </div>
              <div className="hero-feature">
                <i className="bi bi-shield-lock"></i>
                <span>Secure & Reliable</span>
              </div>
              <div className="hero-feature">
                <i className="bi bi-qr-code-scan"></i>
                <span>QR Code Support</span>
              </div>
            </div>
          </div>
        </Container>
      </div>

      {/* Main Content */}
      <div className="main-content">
        <Container>
          <Row className="justify-content-center">
            <Col lg={10}>
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
                        Document Verification
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
                              <Form.Label className="fw-bold text-dark">
                                <i className="bi bi-file-earmark me-2"></i>
                                Document Type
                              </Form.Label>
                              <Form.Select
                                value={documentType}
                                onChange={(e) =>
                                  setDocumentType(e.target.value)
                                }
                                className="form-select-modern"
                              >
                                <option value="invoice">📄 Invoice</option>
                                <option value="letterhead">
                                  📋 Letterhead
                                </option>
                              </Form.Select>
                            </Form.Group>
                          </Col>
                          <Col md={6}>
                            <Form.Group className="mb-4">
                              <Form.Label className="fw-bold text-dark">
                                <i className="bi bi-hash me-2"></i>
                                Document ID
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
                                  variant="outline-primary"
                                  onClick={() => setShowQRScanner(true)}
                                  style={{
                                    borderRadius: "0 12px 12px 0",
                                    border: "2px solid #e9ecef",
                                    borderLeft: "none",
                                  }}
                                >
                                  <i className="bi bi-qr-code-scan"></i>
                                </Button>
                              </InputGroup>
                            </Form.Group>
                          </Col>
                        </Row>

                        {/* Progress Bar */}
                        {documentLoading && (
                          <div className="progress-container">
                            <small className="text-muted mb-2 d-block">
                              <i className="bi bi-shield-check me-1"></i>
                              Verifying document authenticity...
                            </small>
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
                                Verifying...
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
                                <h4 className="mb-1">
                                  <i className="bi bi-check-circle-fill me-2"></i>
                                  Document Verified Successfully
                                </h4>
                                <small style={{ opacity: 0.9 }}>
                                  {documentType.charAt(0).toUpperCase() +
                                    documentType.slice(1)}{" "}
                                  has been verified and is authentic
                                </small>
                              </div>
                              <Badge
                                bg="success"
                                style={{
                                  fontSize: "1rem",
                                  padding: "0.5rem 1rem",
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
                                    className={`${getDocumentTypeIcon(documentType)} text-primary me-2`}
                                  ></i>
                                  {documentType.charAt(0).toUpperCase() +
                                    documentType.slice(1)}{" "}
                                  Information
                                </h5>
                                <div className="info-row">
                                  <span className="info-label">
                                    Document ID
                                  </span>
                                  <code className="info-value bg-light px-2 py-1 rounded">
                                    {document.id}
                                  </code>
                                </div>
                                <div className="info-row">
                                  <span className="info-label">Title</span>
                                  <span className="info-value fw-bold">
                                    {document.title || document.customerName}
                                  </span>
                                </div>
                                {document.amount && (
                                  <div className="info-row">
                                    <span className="info-label">Amount</span>
                                    <span className="info-value fw-bold text-success">
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
                                  <i className="bi bi-shield-check text-success me-2"></i>
                                  Verification Details
                                </h5>
                                <div className="info-row">
                                  <span className="info-label">Issue Date</span>
                                  <span className="info-value">
                                    {formatDateTime(document.date)}
                                  </span>
                                </div>
                                <div className="info-row">
                                  <span className="info-label">
                                    Verified Status
                                  </span>
                                  <Badge bg="success">✓ Authentic</Badge>
                                </div>
                                <div className="info-row">
                                  <span className="info-label">Issued By</span>
                                  <span className="info-value fw-bold">
                                    Hare Krishna Medical
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
                                  borderRadius: "12px",
                                  padding: "0.7rem 1.5rem",
                                  fontWeight: "600",
                                }}
                              >
                                <i className="bi bi-download me-2"></i>
                                Download PDF
                              </Button>

                              <Button
                                variant="outline-secondary"
                                onClick={() => resetForm("documents")}
                                style={{
                                  borderRadius: "12px",
                                  padding: "0.7rem 1.5rem",
                                  fontWeight: "600",
                                }}
                              >
                                <i className="bi bi-arrow-clockwise me-2"></i>
                                Verify Another
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
                        Invoice Verification
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
                              <Form.Label className="fw-bold text-dark">
                                <i className="bi bi-hash me-2"></i>
                                Invoice ID
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
                                  variant="outline-primary"
                                  onClick={() => setShowQRScanner(true)}
                                  style={{
                                    borderRadius: "0 12px 12px 0",
                                    border: "2px solid #e9ecef",
                                    borderLeft: "none",
                                  }}
                                >
                                  <i className="bi bi-qr-code-scan"></i>
                                </Button>
                              </InputGroup>
                              <Form.Text className="text-muted">
                                Enter the invoice ID exactly as shown on your
                                invoice
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
                                <h4 className="mb-1">
                                  <i className="bi bi-check-circle-fill me-2"></i>
                                  Invoice Verified Successfully
                                </h4>
                                <small style={{ opacity: 0.9 }}>
                                  Invoice has been verified and is authentic
                                </small>
                              </div>
                              <Badge
                                bg="success"
                                style={{
                                  fontSize: "1rem",
                                  padding: "0.5rem 1rem",
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
                                  <i className="bi bi-receipt text-primary me-2"></i>
                                  Invoice Information
                                </h5>
                                <div className="info-row">
                                  <span className="info-label">Invoice ID</span>
                                  <code className="info-value bg-light px-2 py-1 rounded">
                                    {invoice.id}
                                  </code>
                                </div>
                                <div className="info-row">
                                  <span className="info-label">Customer</span>
                                  <span className="info-value fw-bold">
                                    {invoice.customerName}
                                  </span>
                                </div>
                                <div className="info-row">
                                  <span className="info-label">Amount</span>
                                  <span className="info-value fw-bold text-success">
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
                                  <i className="bi bi-shield-check text-success me-2"></i>
                                  Verification Details
                                </h5>
                                <div className="info-row">
                                  <span className="info-label">Issue Date</span>
                                  <span className="info-value">
                                    {formatDateTime(invoice.date)}
                                  </span>
                                </div>
                                <div className="info-row">
                                  <span className="info-label">
                                    Verified Status
                                  </span>
                                  <Badge bg="success">✓ Authentic</Badge>
                                </div>
                                <div className="info-row">
                                  <span className="info-label">Issued By</span>
                                  <span className="info-value fw-bold">
                                    Hare Krishna Medical
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
                                  borderRadius: "12px",
                                  padding: "0.7rem 1.5rem",
                                  fontWeight: "600",
                                }}
                              >
                                <i className="bi bi-download me-2"></i>
                                Download PDF
                              </Button>

                              <Button
                                variant="outline-secondary"
                                onClick={() => resetForm("invoices")}
                                style={{
                                  borderRadius: "12px",
                                  padding: "0.7rem 1.5rem",
                                  fontWeight: "600",
                                }}
                              >
                                <i className="bi bi-arrow-clockwise me-2"></i>
                                Verify Another
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
              <Card className="verify-card">
                <Card.Header
                  style={{
                    background: "linear-gradient(135deg, #17a2b8, #138496)",
                    color: "white",
                    padding: "1.5rem 2rem",
                    borderRadius: "20px 20px 0 0",
                  }}
                >
                  <h5 className="mb-0">
                    <i className="bi bi-question-circle me-2"></i>
                    How to Use Verification Center
                  </h5>
                </Card.Header>
                <Card.Body style={{ padding: "2rem" }}>
                  <Row>
                    <Col md={6}>
                      <h6 className="fw-bold mb-3 text-primary">
                        <i className="bi bi-file-text me-2"></i>
                        Document Verification
                      </h6>
                      <ul className="list-unstyled">
                        <li className="mb-2">
                          ✓ Verify invoices and letterheads
                        </li>
                        <li className="mb-2">✓ Support for QR code scanning</li>
                        <li className="mb-2">✓ Instant authenticity check</li>
                        <li className="mb-2">✓ Download verified documents</li>
                      </ul>
                    </Col>
                    <Col md={6}>
                      <h6 className="fw-bold mb-3 text-primary">
                        <i className="bi bi-receipt me-2"></i>
                        Invoice Verification
                      </h6>
                      <ul className="list-unstyled">
                        <li className="mb-2">
                          ✓ Quick invoice ID verification
                        </li>
                        <li className="mb-2">✓ Payment status check</li>
                        <li className="mb-2">✓ Customer details validation</li>
                        <li className="mb-2">✓ QR code support</li>
                      </ul>
                    </Col>
                  </Row>

                  <Alert
                    variant="info"
                    className="mt-4"
                    style={{
                      background: "linear-gradient(135deg, #17a2b8, #138496)",
                      color: "white",
                      border: "none",
                      borderRadius: "12px",
                    }}
                  >
                    <h6 className="mb-2">
                      <i className="bi bi-shield-lock me-2"></i>
                      Security & Trust
                    </h6>
                    <p className="mb-0" style={{ opacity: 0.9 }}>
                      All documents from Hare Krishna Medical contain unique
                      verification codes and QR codes to ensure authenticity.
                      Our verification system uses advanced security measures to
                      prevent fraud and maintain document integrity.
                    </p>
                  </Alert>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Container>
      </div>
    </div>
  );
};

export default Verify;
