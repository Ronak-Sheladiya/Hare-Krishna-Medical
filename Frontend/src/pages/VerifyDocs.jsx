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
  Tabs,
  Tab,
} from "react-bootstrap";
import QRCode from "qrcode";
import { api, safeApiCall } from "../utils/apiClient";
import {
  PageHeroSection,
  ThemeCard,
  ThemeButton,
} from "../components/common/ConsistentTheme";
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

    try {
      const response = await safeApiCall(() =>
        api.get(
          `/verification/document?id=${encodeURIComponent(id)}&type=${type}`,
        ),
      );

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
      console.error("Verification error:", err);
      setError(`Failed to verify ${type}. Please check the ID and try again.`);
    } finally {
      setLoading(false);
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
    return <Badge bg={variants[status] || "secondary"}>{status}</Badge>;
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

  return (
    <Container className="py-4">
      <PageHeroSection
        title="Document Verification"
        subtitle="Verify the authenticity of invoices, letterheads, and other documents"
      />

      {error && (
        <Alert variant="danger" dismissible onClose={() => setError("")}>
          {error}
        </Alert>
      )}

      <Row className="justify-content-center">
        <Col lg={8}>
          <ThemeCard>
            <Card.Header>
              <h5 className="mb-0">
                <i className="bi bi-shield-check me-2"></i>
                Verify Document
              </h5>
            </Card.Header>
            <Card.Body>
              <Form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleVerify();
                }}
              >
                <Row>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Document Type</Form.Label>
                      <Form.Select
                        value={documentType}
                        onChange={(e) => setDocumentType(e.target.value)}
                      >
                        <option value="invoice">Invoice</option>
                        <option value="letterhead">Letterhead</option>
                      </Form.Select>
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Document ID</Form.Label>
                      <InputGroup>
                        <Form.Control
                          type="text"
                          value={documentId}
                          onChange={(e) => setDocumentId(e.target.value)}
                          placeholder={
                            documentType === "invoice"
                              ? "Enter invoice ID (e.g., HKM-INV-2024-...)"
                              : "Enter letterhead ID (e.g., HK/CER/...)"
                          }
                          required
                        />
                        <Button
                          variant="outline-secondary"
                          onClick={() => setShowQRScanner(true)}
                        >
                          <i className="bi bi-qr-code-scan"></i>
                        </Button>
                      </InputGroup>
                    </Form.Group>
                  </Col>
                </Row>

                <div className="d-flex gap-2">
                  <ThemeButton
                    type="submit"
                    disabled={loading || !documentId.trim()}
                  >
                    {loading ? (
                      <Spinner animation="border" size="sm" className="me-1" />
                    ) : (
                      <i className="bi bi-search me-1"></i>
                    )}
                    Verify Document
                  </ThemeButton>

                  <Button
                    variant="outline-primary"
                    onClick={() => setShowQRScanner(true)}
                  >
                    <i className="bi bi-qr-code-scan me-1"></i>
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
            </Card.Body>
          </ThemeCard>

          {/* Verification Result */}
          {verifySuccess && document && (
            <ThemeCard className="mt-4">
              <Card.Header className="d-flex justify-content-between align-items-center">
                <div>
                  <i className="bi bi-check-circle-fill text-success me-2"></i>
                  <strong>Verification Successful</strong>
                </div>
                <Badge bg="success">Verified ✓</Badge>
              </Card.Header>
              <Card.Body>
                {documentType === "invoice" ? (
                  // Invoice Details
                  <Row>
                    <Col md={6}>
                      <h6>
                        <i
                          className={`${getDocumentTypeIcon(documentType)} me-2`}
                        ></i>
                        Invoice Details
                      </h6>
                      <p>
                        <strong>Invoice ID:</strong> <code>{document.id}</code>
                      </p>
                      <p>
                        <strong>Customer:</strong> {document.customerName}
                      </p>
                      <p>
                        <strong>Amount:</strong> ₹
                        {document.amount?.toLocaleString()}
                      </p>
                      <p>
                        <strong>Status:</strong>{" "}
                        {getStatusBadge(document.status)}
                      </p>
                      {document.paymentStatus && (
                        <p>
                          <strong>Payment Status:</strong>{" "}
                          {getStatusBadge(document.paymentStatus)}
                        </p>
                      )}
                    </Col>
                    <Col md={6}>
                      <h6>Verification Details</h6>
                      <p>
                        <strong>Document Type:</strong> {document.type}
                      </p>
                      <p>
                        <strong>Issue Date:</strong>{" "}
                        {formatDateTime(document.date)}
                      </p>
                      <p>
                        <strong>Verified:</strong>{" "}
                        <Badge bg="success">Yes</Badge>
                      </p>
                      <p>
                        <strong>Company:</strong> Hare Krishna Medical
                      </p>
                    </Col>
                  </Row>
                ) : (
                  // Letterhead Details
                  <Row>
                    <Col md={6}>
                      <h6>
                        <i
                          className={`${getDocumentTypeIcon(documentType)} me-2`}
                        ></i>
                        Letterhead Details
                      </h6>
                      <p>
                        <strong>Letter ID:</strong> <code>{document.id}</code>
                      </p>
                      <p>
                        <strong>Title:</strong> {document.title}
                      </p>
                      <p>
                        <strong>Letter Type:</strong>{" "}
                        <Badge bg="primary">{document.letterType}</Badge>
                      </p>
                      <p>
                        <strong>Recipient:</strong> {document.recipientName}
                      </p>
                      <p>
                        <strong>Subject:</strong> {document.subject}
                      </p>
                      <p>
                        <strong>Status:</strong>{" "}
                        {getStatusBadge(document.status)}
                      </p>
                    </Col>
                    <Col md={6}>
                      <h6>Authority Details</h6>
                      <p>
                        <strong>Host Name:</strong> {document.hostName}
                      </p>
                      <p>
                        <strong>Host Designation:</strong>{" "}
                        {document.hostDesignation}
                      </p>
                      <p>
                        <strong>Issue Date:</strong>{" "}
                        {formatDateTime(document.date)}
                      </p>
                      <p>
                        <strong>Verified:</strong>{" "}
                        <Badge bg="success">Yes</Badge>
                      </p>
                      <p>
                        <strong>Company:</strong> Hare Krishna Medical
                      </p>
                    </Col>
                  </Row>
                )}

                {/* QR Code Display */}
                {document.qrCodeData && (
                  <Row className="mt-4">
                    <Col md={12}>
                      <h6>Document Metadata</h6>
                      <div className="bg-light p-3 rounded">
                        <pre style={{ fontSize: "0.8rem", margin: 0 }}>
                          {JSON.stringify(
                            JSON.parse(document.qrCodeData),
                            null,
                            2,
                          )}
                        </pre>
                      </div>
                    </Col>
                  </Row>
                )}

                <div className="mt-4 d-flex gap-2">
                  <ThemeButton onClick={handleDownloadPDF}>
                    <i className="bi bi-download me-1"></i>
                    Download PDF
                  </ThemeButton>

                  <Button
                    variant="outline-secondary"
                    onClick={() => {
                      setDocument(null);
                      setVerifySuccess(false);
                      setDocumentId("");
                      // Clear URL parameters
                      const newUrl = new URL(window.location);
                      newUrl.searchParams.delete("id");
                      newUrl.searchParams.delete("type");
                      window.history.replaceState({}, "", newUrl);
                    }}
                  >
                    <i className="bi bi-arrow-clockwise me-1"></i>
                    Verify Another
                  </Button>
                </div>
              </Card.Body>
            </ThemeCard>
          )}

          {/* Help Section */}
          <ThemeCard className="mt-4">
            <Card.Header>
              <h6 className="mb-0">
                <i className="bi bi-info-circle me-2"></i>
                How to Verify Documents
              </h6>
            </Card.Header>
            <Card.Body>
              <Row>
                <Col md={6}>
                  <h6>Using Document ID</h6>
                  <ol>
                    <li>Select the document type (Invoice or Letterhead)</li>
                    <li>Enter the document ID found on the document</li>
                    <li>Click "Verify Document" to check authenticity</li>
                  </ol>
                </Col>
                <Col md={6}>
                  <h6>Using QR Code</h6>
                  <ol>
                    <li>Click "Scan QR Code" to open camera scanner</li>
                    <li>Point your camera at the QR code on the document</li>
                    <li>The system will automatically verify the document</li>
                  </ol>
                </Col>
              </Row>

              <Alert variant="info" className="mt-3">
                <i className="bi bi-shield-check me-2"></i>
                <strong>Security Note:</strong> All documents from Hare Krishna
                Medical contain unique verification codes and QR codes to ensure
                authenticity. If verification fails, the document may be invalid
                or tampered with.
              </Alert>
            </Card.Body>
          </ThemeCard>
        </Col>
      </Row>
    </Container>
  );
};

export default VerifyDocs;
