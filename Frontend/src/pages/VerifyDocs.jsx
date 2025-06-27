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
} from "react-bootstrap";
import QRCode from "qrcode";
import { api, safeApiCall } from "../utils/apiClient";
import QRCameraScanner from "../components/common/QRCameraScanner";
import { formatDateTime } from "../utils/dateUtils";

const VerifyDocs = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const [documentId, setDocumentId] = useState("");
  const [documentType, setDocumentType] = useState("invoice");
  const [document, setDocument] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [verifySuccess, setVerifySuccess] = useState(false);
  const [showQRScanner, setShowQRScanner] = useState(false);
  const [verificationProgress, setVerificationProgress] = useState(0);

  // Auto-verify from URL parameters
  useEffect(() => {
    const id = searchParams.get("id");
    const type = searchParams.get("type");

    if (id && type) {
      setDocumentId(id);
      setDocumentType(type);
      handleVerify(id, type);
    }
  }, [searchParams]);

  const handleVerify = async (id = documentId, type = documentType) => {
    if (!id.trim()) {
      setError("Please enter a document ID");
      return;
    }

    setLoading(true);
    setError("");
    setDocument(null);
    setVerifySuccess(false);
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
        setVerifySuccess(true);

        // Update URL without causing navigation
        const newUrl = new URL(window.location);
        newUrl.searchParams.set("id", id);
        newUrl.searchParams.set("type", type);
        window.history.replaceState({}, "", newUrl);
      } else {
        setError(
          response.message || `${type} not found or verification failed`,
        );
      }
    } catch (err) {
      clearInterval(progressInterval);
      setVerificationProgress(0);
      console.error("Verification error:", err);
      setError(`Failed to verify ${type}. Please check the ID and try again.`);
    } finally {
      setTimeout(() => {
        setLoading(false);
        setVerificationProgress(0);
      }, 500);
    }
  };

  const handleQRScan = (data) => {
    try {
      // Try to parse as URL first
      const url = new URL(data);
      const id = url.searchParams.get("id");
      const type = url.searchParams.get("type");

      if (id && type) {
        setDocumentId(id);
        setDocumentType(type);
        handleVerify(id, type);
        setShowQRScanner(false);
        return;
      }
    } catch (e) {
      // Not a URL, treat as direct ID
    }

    // Try to detect document type from ID format
    if (data.includes("HK/")) {
      setDocumentType("letterhead");
    } else if (data.includes("HKM-INV-")) {
      setDocumentType("invoice");
    }

    setDocumentId(data);
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

  const handleDownloadPDF = async () => {
    if (!document) return;

    try {
      const endpoint =
        documentType === "invoice"
          ? `/invoices/${document.id}/pdf`
          : `/letterheads/${document.id}/pdf`;

      const response = await api.get(endpoint, {
        responseType: "blob",
      });

      const blob = new Blob([response.data], { type: "application/pdf" });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `${documentType}-${document.id}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Download PDF error:", error);
      setError("Failed to download PDF");
    }
  };

  const resetForm = () => {
    setDocument(null);
    setVerifySuccess(false);
    setDocumentId("");
    setError("");
    // Clear URL parameters
    const newUrl = new URL(window.location);
    newUrl.searchParams.delete("id");
    newUrl.searchParams.delete("type");
    window.history.replaceState({}, "", newUrl);
  };

  return (
    <div className="verify-docs-page">
      <style>
        {`
          .verify-docs-page {
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

          .card-header-custom {
            background: linear-gradient(135deg, #e63946, #dc3545);
            color: white;
            padding: 1.5rem 2rem;
            border: none;
            position: relative;
          }

          .card-header-custom::after {
            content: '';
            position: absolute;
            bottom: 0;
            left: 0;
            right: 0;
            height: 4px;
            background: linear-gradient(90deg, #28a745, #20c997, #17a2b8);
          }

          .card-body-custom {
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

          .help-section {
            background: white;
            border-radius: 20px;
            border: none;
            box-shadow: 0 10px 40px rgba(0,0,0,0.08);
          }

          .help-header {
            background: linear-gradient(135deg, #17a2b8, #138496);
            color: white;
            padding: 1.5rem 2rem;
            border-radius: 20px 20px 0 0;
          }

          .help-step {
            background: #f8f9fa;
            padding: 1rem;
            border-radius: 12px;
            margin-bottom: 1rem;
            border-left: 4px solid #e63946;
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

          .security-note {
            background: linear-gradient(135deg, #17a2b8, #138496);
            color: white;
            border-radius: 12px;
            padding: 1.5rem;
            border: none;
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
            
            .card-body-custom {
              padding: 1.5rem;
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
              Document Verification
            </h1>
            <p className="hero-subtitle">
              Verify the authenticity of invoices, letterheads, and official
              documents with our secure verification system
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
          {error && (
            <Alert
              variant="danger"
              dismissible
              onClose={() => setError("")}
              className="alert-custom"
            >
              <i className="bi bi-exclamation-triangle me-2"></i>
              {error}
            </Alert>
          )}

          <Row className="justify-content-center">
            <Col lg={8}>
              {/* Verification Form */}
              <Card className="verify-card">
                <div className="card-header-custom">
                  <h4 className="mb-0">
                    <i className="bi bi-shield-check me-2"></i>
                    Verify Document Authenticity
                  </h4>
                  <small style={{ opacity: 0.9 }}>
                    Enter document details or scan QR code for instant
                    verification
                  </small>
                </div>
                <div className="card-body-custom">
                  <Form
                    onSubmit={(e) => {
                      e.preventDefault();
                      handleVerify();
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
                            onChange={(e) => setDocumentType(e.target.value)}
                            className="form-select-modern"
                          >
                            <option value="invoice">📄 Invoice</option>
                            <option value="letterhead">📋 Letterhead</option>
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
                              onChange={(e) => setDocumentId(e.target.value)}
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
                    {loading && (
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
                        disabled={loading || !documentId.trim()}
                        className="btn-verify text-white"
                      >
                        {loading ? (
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

                  {/* QR Scanner Modal */}
                  {showQRScanner && (
                    <QRCameraScanner
                      onScan={handleQRScan}
                      onClose={() => setShowQRScanner(false)}
                    />
                  )}
                </div>
              </Card>

              {/* Verification Result */}
              {verifySuccess && document && (
                <Card className="verification-result">
                  <div className="verification-header">
                    <div className="d-flex justify-content-between align-items-center">
                      <div>
                        <h4 className="mb-1">
                          <i className="bi bi-check-circle-fill me-2"></i>
                          Verification Successful
                        </h4>
                        <small style={{ opacity: 0.9 }}>
                          Document has been verified and is authentic
                        </small>
                      </div>
                      <Badge
                        bg="success"
                        style={{ fontSize: "1rem", padding: "0.5rem 1rem" }}
                      >
                        ✓ VERIFIED
                      </Badge>
                    </div>
                  </div>
                  <div className="verification-body">
                    {documentType === "invoice" ? (
                      // Invoice Details
                      <Row>
                        <Col md={6}>
                          <h5 className="mb-4">
                            <i className="bi bi-receipt text-primary me-2"></i>
                            Invoice Information
                          </h5>
                          <div className="info-row">
                            <span className="info-label">Invoice ID</span>
                            <code className="info-value bg-light px-2 py-1 rounded">
                              {document.id}
                            </code>
                          </div>
                          <div className="info-row">
                            <span className="info-label">Customer</span>
                            <span className="info-value">
                              {document.customerName}
                            </span>
                          </div>
                          <div className="info-row">
                            <span className="info-label">Amount</span>
                            <span className="info-value fw-bold text-success">
                              ₹{document.amount?.toLocaleString()}
                            </span>
                          </div>
                          <div className="info-row">
                            <span className="info-label">Status</span>
                            {getStatusBadge(document.status)}
                          </div>
                          {document.paymentStatus && (
                            <div className="info-row">
                              <span className="info-label">Payment Status</span>
                              {getStatusBadge(document.paymentStatus)}
                            </div>
                          )}
                        </Col>
                        <Col md={6}>
                          <h5 className="mb-4">
                            <i className="bi bi-shield-check text-success me-2"></i>
                            Verification Details
                          </h5>
                          <div className="info-row">
                            <span className="info-label">Document Type</span>
                            <span className="info-value">{document.type}</span>
                          </div>
                          <div className="info-row">
                            <span className="info-label">Issue Date</span>
                            <span className="info-value">
                              {formatDateTime(document.date)}
                            </span>
                          </div>
                          <div className="info-row">
                            <span className="info-label">Verified Status</span>
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
                    ) : (
                      // Letterhead Details
                      <Row>
                        <Col md={6}>
                          <h5 className="mb-4">
                            <i className="bi bi-file-text text-primary me-2"></i>
                            Letterhead Information
                          </h5>
                          <div className="info-row">
                            <span className="info-label">Letter ID</span>
                            <code className="info-value bg-light px-2 py-1 rounded">
                              {document.id}
                            </code>
                          </div>
                          <div className="info-row">
                            <span className="info-label">Title</span>
                            <span className="info-value fw-bold">
                              {document.title}
                            </span>
                          </div>
                          <div className="info-row">
                            <span className="info-label">Letter Type</span>
                            <Badge bg="primary">{document.letterType}</Badge>
                          </div>
                          <div className="info-row">
                            <span className="info-label">Recipient</span>
                            <span className="info-value">
                              {document.recipientName}
                            </span>
                          </div>
                          <div className="info-row">
                            <span className="info-label">Subject</span>
                            <span className="info-value">
                              {document.subject}
                            </span>
                          </div>
                          <div className="info-row">
                            <span className="info-label">Status</span>
                            {getStatusBadge(document.status)}
                          </div>
                        </Col>
                        <Col md={6}>
                          <h5 className="mb-4">
                            <i className="bi bi-person-check text-success me-2"></i>
                            Authority Details
                          </h5>
                          <div className="info-row">
                            <span className="info-label">Authorized By</span>
                            <span className="info-value fw-bold">
                              {document.hostName}
                            </span>
                          </div>
                          <div className="info-row">
                            <span className="info-label">Designation</span>
                            <span className="info-value">
                              {document.hostDesignation}
                            </span>
                          </div>
                          <div className="info-row">
                            <span className="info-label">Issue Date</span>
                            <span className="info-value">
                              {formatDateTime(document.date)}
                            </span>
                          </div>
                          <div className="info-row">
                            <span className="info-label">Verified Status</span>
                            <Badge bg="success">✓ Authentic</Badge>
                          </div>
                          <div className="info-row">
                            <span className="info-label">Organization</span>
                            <span className="info-value fw-bold">
                              Hare Krishna Medical
                            </span>
                          </div>
                        </Col>
                      </Row>
                    )}

                    <div className="mt-4 pt-4 border-top d-flex gap-3 flex-wrap">
                      <Button
                        onClick={handleDownloadPDF}
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
                        onClick={resetForm}
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

              {/* Help Section */}
              <Card className="help-section">
                <div className="help-header">
                  <h5 className="mb-0">
                    <i className="bi bi-question-circle me-2"></i>
                    How to Verify Documents
                  </h5>
                </div>
                <Card.Body style={{ padding: "2rem" }}>
                  <Row>
                    <Col md={6}>
                      <h6 className="fw-bold mb-3">
                        <i className="bi bi-1-circle text-primary me-2"></i>
                        Using Document ID
                      </h6>
                      <div className="help-step">
                        <strong>Step 1:</strong> Select the document type
                        (Invoice or Letterhead)
                      </div>
                      <div className="help-step">
                        <strong>Step 2:</strong> Enter the document ID found on
                        the document
                      </div>
                      <div className="help-step">
                        <strong>Step 3:</strong> Click "Verify Document" to
                        check authenticity
                      </div>
                    </Col>
                    <Col md={6}>
                      <h6 className="fw-bold mb-3">
                        <i className="bi bi-2-circle text-primary me-2"></i>
                        Using QR Code
                      </h6>
                      <div className="help-step">
                        <strong>Step 1:</strong> Click "Scan QR Code" to open
                        camera scanner
                      </div>
                      <div className="help-step">
                        <strong>Step 2:</strong> Point your camera at the QR
                        code on the document
                      </div>
                      <div className="help-step">
                        <strong>Step 3:</strong> The system will automatically
                        verify the document
                      </div>
                    </Col>
                  </Row>

                  <div className="security-note mt-4">
                    <h6 className="mb-2">
                      <i className="bi bi-shield-lock me-2"></i>
                      Security & Trust
                    </h6>
                    <p className="mb-0" style={{ opacity: 0.9 }}>
                      All documents from Hare Krishna Medical contain unique
                      verification codes and QR codes to ensure authenticity.
                      Our verification system uses advanced security measures to
                      prevent fraud and maintain document integrity. If
                      verification fails, the document may be invalid or
                      tampered with.
                    </p>
                  </div>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Container>
      </div>
    </div>
  );
};

export default VerifyDocs;
