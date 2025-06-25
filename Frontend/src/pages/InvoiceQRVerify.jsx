import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
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
import { PageHeroSection } from "../components/common/ConsistentTheme";
import ProfessionalLoading from "../components/common/ProfessionalLoading";
import { refreshSession } from "../store/slices/authSlice";
import { api, safeApiCall } from "../utils/apiClient";
import { getDemoInvoice, isDemoInvoice } from "../utils/demoInvoiceData";
import "../styles/InvoicePrintA4.css";

const InvoiceQRVerify = () => {
  const { invoiceId } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { isAuthenticated, user } = useSelector((state) => state.auth);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [invoice, setInvoice] = useState(null);
  const [verificationStatus, setVerificationStatus] = useState(null);

  useEffect(() => {
    // Check and refresh authentication session on page load
    dispatch(refreshSession());
  }, [dispatch]);

  // Cross-tab auth sync
  useEffect(() => {
    const handleStorageChange = (e) => {
      if (e.key === "auth-event") {
        try {
          const authEvent = JSON.parse(e.newValue);
          if (authEvent.type === "LOGIN" || authEvent.type === "LOGOUT") {
            // Refresh session to sync auth state
            dispatch(refreshSession());
          }
        } catch (error) {
          console.warn("Error parsing auth event:", error);
        }
      }
    };

    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, [dispatch]);

  useEffect(() => {
    if (invoiceId) {
      verifyInvoice();
    } else {
      setError("Invalid QR code - no invoice ID found");
      setLoading(false);
    }
  }, [invoiceId]);

  const verifyInvoice = async () => {
    setLoading(true);
    setError(null);

    // Check if this is a demo invoice first
    if (isDemoInvoice(invoiceId)) {
      const demoInvoice = getDemoInvoice(invoiceId);
      if (demoInvoice) {
        setInvoice(demoInvoice);
        setVerificationStatus("verified");
        setLoading(false);
        return;
      }
    }

    const {
      success,
      data,
      error: apiError,
    } = await safeApiCall(
      () => api.get(`/api/invoices/verify/${invoiceId}`),
      null,
    );

    if (success && data?.data) {
      setInvoice(data.data);
      setVerificationStatus("verified");
    } else {
      if (apiError?.includes("not found") || apiError?.includes("404")) {
        setError("Invoice not found or has been deleted");
        setVerificationStatus("not_found");
      } else {
        setError(
          apiError ||
            "Unable to connect to server. Please check your connection and try again.",
        );
        setVerificationStatus("error");
      }
    }

    setLoading(false);
  };

  const handlePrint = () => {
    const printContent = document.querySelector(".card");
    if (printContent) {
      const printWindow = window.open("", "_blank");
      printWindow.document.write(`
        <!DOCTYPE html>
        <html>
          <head>
            <title>Invoice QR Verification - ${invoice?.invoiceNumber || invoice?.invoiceId || invoiceId}</title>
            <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">
            <style>
              @page {
                size: A4;
                margin: 15mm;
              }
              @media print {
                body {
                  margin: 0;
                  color: black !important;
                  font-size: 11px;
                  line-height: 1.3;
                  -webkit-print-color-adjust: exact;
                  print-color-adjust: exact;
                }
                .no-print { display: none !important; }
                .table {
                  font-size: 10px !important;
                  margin-bottom: 8px !important;
                }
                .table th, .table td {
                  padding: 4px 6px !important;
                  border: 1px solid #dee2e6 !important;
                }
              }
              body {
                font-family: 'Segoe UI', Arial, sans-serif;
                line-height: 1.3;
                color: #333;
              }
              .text-success { color: #28a745 !important; }
            </style>
          </head>
          <body>
            ${printContent.innerHTML}
            <script>
              window.onload = function() {
                setTimeout(function() {
                  window.print();
                  window.close();
                }, 500);
              };
            </script>
          </body>
        </html>
      `);
      printWindow.document.close();
    }
  };

  const handleDownload = async () => {
    try {
      const iframe = document.createElement("iframe");
      iframe.style.display = "none";
      document.body.appendChild(iframe);

      const printContent = document.querySelector(".card");
      if (!printContent) {
        alert("Content not found");
        return;
      }

      const iframeDoc = iframe.contentDocument || iframe.contentWindow.document;
      iframeDoc.write(`
        <!DOCTYPE html>
        <html>
          <head>
            <title>Invoice QR Verification - ${invoice?.invoiceNumber || invoice?.invoiceId || invoiceId}</title>
            <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">
            <style>
              @page {
                size: A4;
                margin: 15mm;
              }
              body {
                font-family: 'Segoe UI', Arial, sans-serif;
                line-height: 1.3;
                color: #333;
                font-size: 11px;
                margin: 0;
                -webkit-print-color-adjust: exact;
                print-color-adjust: exact;
              }
              .table {
                font-size: 10px !important;
                margin-bottom: 8px !important;
              }
              .table th, .table td {
                padding: 4px 6px !important;
                border: 1px solid #dee2e6 !important;
              }
              .text-success { color: #28a745 !important; }
              .no-print { display: none !important; }
            </style>
          </head>
          <body>
            ${printContent.innerHTML}
          </body>
        </html>
      `);
      iframeDoc.close();

      setTimeout(() => {
        try {
          iframe.contentWindow.print();
          setTimeout(() => {
            document.body.removeChild(iframe);
          }, 1000);
        } catch (error) {
          console.error("Download failed:", error);
          alert(
            "Download feature requires a PDF library. Using print instead.",
          );
          handlePrint();
        }
      }, 1000);
    } catch (error) {
      console.error("Download preparation failed:", error);
      alert("Download preparation failed. Using print instead.");
      handlePrint();
    }
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      paid: { variant: "success", label: "Paid" },
      completed: { variant: "success", label: "Completed" },
      pending: { variant: "warning", label: "Pending" },
      overdue: { variant: "danger", label: "Overdue" },
      cancelled: { variant: "secondary", label: "Cancelled" },
    };
    const config = statusConfig[status?.toLowerCase()] || statusConfig.pending;
    return <Badge bg={config.variant}>{config.label}</Badge>;
  };

  const getVerificationBadge = () => {
    switch (verificationStatus) {
      case "verified":
        return (
          <Alert variant="success" className="d-flex align-items-center mb-4">
            <i
              className="bi bi-check-circle-fill me-3"
              style={{ fontSize: "2rem" }}
            ></i>
            <div>
              <h5 className="mb-1">✓ Invoice Verified Successfully</h5>
              <p className="mb-0">
                This is a genuine invoice from Hare Krishna Medical Store.
                Scanned at {new Date().toLocaleString("en-IN")}.
              </p>
            </div>
          </Alert>
        );
      case "not_found":
        return (
          <Alert variant="danger" className="d-flex align-items-center mb-4">
            <i
              className="bi bi-x-circle-fill me-3"
              style={{ fontSize: "2rem" }}
            ></i>
            <div>
              <h5 className="mb-1">✗ Invoice Not Found</h5>
              <p className="mb-0">
                This invoice does not exist in our records or may have been
                deleted.
              </p>
            </div>
          </Alert>
        );
      case "error":
        return (
          <Alert variant="warning" className="d-flex align-items-center mb-4">
            <i
              className="bi bi-exclamation-triangle-fill me-3"
              style={{ fontSize: "2rem" }}
            ></i>
            <div>
              <h5 className="mb-1">⚠ Verification Error</h5>
              <p className="mb-0">
                Unable to verify the invoice at this time. Please try again
                later or contact support.
              </p>
            </div>
          </Alert>
        );
      default:
        return null;
    }
  };

  const renderAuthActions = () => {
    if (!isAuthenticated) {
      return (
        <Button
          variant="primary"
          onClick={() => navigate("/login")}
          style={{
            borderRadius: "8px",
            padding: "12px 24px",
            fontWeight: "600",
          }}
        >
          <i className="bi bi-box-arrow-in-right me-2"></i>
          Login to Access More
        </Button>
      );
    }

    if (user?.role === 1) {
      // Admin user
      return (
        <Button
          variant="success"
          onClick={() => navigate("/admin/invoices")}
          style={{
            borderRadius: "8px",
            padding: "12px 24px",
            fontWeight: "600",
          }}
        >
          <i className="bi bi-gear me-2"></i>
          Manage Invoices
        </Button>
      );
    } else {
      // Regular user
      return (
        <Button
          variant="info"
          onClick={() => navigate("/user/invoices")}
          style={{
            borderRadius: "8px",
            padding: "12px 24px",
            fontWeight: "600",
          }}
        >
          <i className="bi bi-file-text me-2"></i>
          My Invoices
        </Button>
      );
    }
  };

  if (loading) {
    return (
      <ProfessionalLoading
        size="lg"
        message="Verifying QR Code..."
        fullScreen={true}
      />
    );
  }

  return (
    <div className="bg-light min-vh-100">
      <PageHeroSection
        title="QR Code Verification"
        subtitle="Verify invoice authenticity via QR code scan"
        iconContext="invoice"
      />

      <Container className="py-5">
        <Row className="justify-content-center">
          <Col md={10}>
            {/* Verification Status */}
            {getVerificationBadge()}

            {error && !invoice && (
              <Card
                style={{
                  border: "none",
                  borderRadius: "16px",
                  boxShadow: "0 8px 32px rgba(0,0,0,0.1)",
                }}
              >
                <Card.Body className="text-center py-5">
                  <i
                    className="bi bi-exclamation-triangle text-warning"
                    style={{ fontSize: "4rem" }}
                  ></i>
                  <h3 className="mt-4 text-danger">QR Verification Failed</h3>
                  <p className="text-muted mb-4 fs-5">{error}</p>
                  <div className="d-flex gap-3 justify-content-center flex-wrap">
                    <Button
                      variant="outline-primary"
                      onClick={verifyInvoice}
                      style={{
                        borderRadius: "8px",
                        padding: "12px 24px",
                        fontWeight: "600",
                      }}
                    >
                      <i className="bi bi-arrow-clockwise me-2"></i>
                      Try Again
                    </Button>
                    <Button
                      variant="secondary"
                      onClick={() => navigate("/")}
                      style={{
                        borderRadius: "8px",
                        padding: "12px 24px",
                        fontWeight: "600",
                      }}
                    >
                      <i className="bi bi-house me-2"></i>
                      Go Home
                    </Button>
                    {renderAuthActions()}
                  </div>
                </Card.Body>
              </Card>
            )}

            {invoice && (
              <Card
                style={{
                  border: "none",
                  borderRadius: "16px",
                  boxShadow: "0 8px 32px rgba(0,0,0,0.1)",
                  overflow: "hidden",
                }}
              >
                <Card.Header
                  style={{
                    background: "linear-gradient(135deg, #28a745, #20c997)",
                    color: "white",
                    padding: "25px 30px",
                  }}
                >
                  <Row className="align-items-center">
                    <Col>
                      <h4 className="mb-0">
                        <i className="bi bi-qr-code-scan me-2"></i>
                        QR Code Verification Details
                      </h4>
                      <small style={{ opacity: "0.9" }}>
                        Invoice successfully verified via QR scan
                      </small>
                    </Col>
                    <Col xs="auto">
                      <div className="d-flex gap-2">
                        <Button
                          variant="light"
                          size="sm"
                          onClick={() =>
                            navigate(
                              `/invoice-verify/${invoice._id || invoiceId}`,
                            )
                          }
                          style={{
                            borderRadius: "6px",
                            fontWeight: "600",
                          }}
                        >
                          <i className="bi bi-eye me-2"></i>
                          View Full Invoice
                        </Button>
                        <Button
                          variant="outline-light"
                          size="sm"
                          onClick={handlePrint}
                          style={{
                            borderRadius: "6px",
                            fontWeight: "600",
                          }}
                        >
                          <i className="bi bi-printer me-2"></i>
                          Print
                        </Button>
                        <Button
                          variant="light"
                          size="sm"
                          onClick={handleDownload}
                          style={{
                            borderRadius: "6px",
                            fontWeight: "600",
                          }}
                        >
                          <i className="bi bi-download me-2"></i>
                          Download
                        </Button>
                      </div>
                    </Col>
                  </Row>
                </Card.Header>

                <Card.Body className="p-4">
                  <Row>
                    <Col md={6}>
                      <h6
                        className="mb-3"
                        style={{ color: "#28a745", fontWeight: "700" }}
                      >
                        <i className="bi bi-file-text me-2"></i>
                        Invoice Information
                      </h6>
                      <div
                        className="p-3"
                        style={{
                          background: "#f8f9fa",
                          borderRadius: "8px",
                          border: "1px solid #e9ecef",
                        }}
                      >
                        <table className="table table-borderless mb-0">
                          <tbody>
                            <tr>
                              <td>
                                <strong>Invoice ID:</strong>
                              </td>
                              <td>
                                <code
                                  className="p-2 rounded"
                                  style={{
                                    background: "#e63946",
                                    color: "white",
                                    fontWeight: "600",
                                  }}
                                >
                                  {invoice.invoiceId ||
                                    invoice.invoiceNumber ||
                                    invoiceId}
                                </code>
                              </td>
                            </tr>
                            <tr>
                              <td>
                                <strong>Issue Date:</strong>
                              </td>
                              <td>
                                {new Date(
                                  invoice.invoiceDate ||
                                    invoice.issueDate ||
                                    invoice.createdAt,
                                ).toLocaleDateString("en-IN", {
                                  year: "numeric",
                                  month: "long",
                                  day: "numeric",
                                })}
                              </td>
                            </tr>
                            <tr>
                              <td>
                                <strong>Status:</strong>
                              </td>
                              <td>
                                {getStatusBadge(
                                  invoice.paymentStatus || invoice.status,
                                )}
                              </td>
                            </tr>
                            <tr>
                              <td>
                                <strong>Total Amount:</strong>
                              </td>
                              <td>
                                <span
                                  className="fw-bold"
                                  style={{
                                    fontSize: "1.25rem",
                                    color: "#28a745",
                                  }}
                                >
                                  ₹
                                  {parseFloat(
                                    invoice.total || invoice.totalAmount || 0,
                                  ).toFixed(2)}
                                </span>
                              </td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                    </Col>

                    <Col md={6}>
                      <h6
                        className="mb-3"
                        style={{ color: "#17a2b8", fontWeight: "700" }}
                      >
                        <i className="bi bi-person me-2"></i>
                        Customer Information
                      </h6>
                      <div
                        className="p-3"
                        style={{
                          background: "#f8f9fa",
                          borderRadius: "8px",
                          border: "1px solid #e9ecef",
                        }}
                      >
                        <table className="table table-borderless mb-0">
                          <tbody>
                            <tr>
                              <td>
                                <strong>Name:</strong>
                              </td>
                              <td>{invoice.customerName || "N/A"}</td>
                            </tr>
                            <tr>
                              <td>
                                <strong>Email:</strong>
                              </td>
                              <td>{invoice.customerEmail || "Not provided"}</td>
                            </tr>
                            <tr>
                              <td>
                                <strong>Phone:</strong>
                              </td>
                              <td>
                                {invoice.customerPhone ||
                                  invoice.customerMobile ||
                                  "Not provided"}
                              </td>
                            </tr>
                            {(invoice.customerAddress || invoice.address) && (
                              <tr>
                                <td>
                                  <strong>Address:</strong>
                                </td>
                                <td>
                                  {invoice.customerAddress || invoice.address}
                                </td>
                              </tr>
                            )}
                          </tbody>
                        </table>
                      </div>
                    </Col>
                  </Row>

                  <hr className="my-4" />

                  <h6
                    className="mb-3"
                    style={{ color: "#6f42c1", fontWeight: "700" }}
                  >
                    <i className="bi bi-list-ul me-2"></i>
                    Invoice Items Summary
                  </h6>
                  <div className="table-responsive">
                    <table
                      className="table table-hover"
                      style={{
                        border: "2px solid #e9ecef",
                        borderRadius: "8px",
                      }}
                    >
                      <thead style={{ background: "#f8f9fa" }}>
                        <tr>
                          <th style={{ border: "none", padding: "15px" }}>
                            Item
                          </th>
                          <th
                            className="text-center"
                            style={{ border: "none", padding: "15px" }}
                          >
                            Quantity
                          </th>
                          <th
                            className="text-end"
                            style={{ border: "none", padding: "15px" }}
                          >
                            Unit Price
                          </th>
                          <th
                            className="text-end"
                            style={{ border: "none", padding: "15px" }}
                          >
                            Total
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {invoice.items?.map((item, index) => (
                          <tr key={index}>
                            <td style={{ padding: "12px 15px" }}>
                              <strong>
                                {item.name || item.productName || "Item"}
                              </strong>
                              {item.description && (
                                <div>
                                  <small className="text-muted">
                                    {item.description}
                                  </small>
                                </div>
                              )}
                            </td>
                            <td
                              className="text-center"
                              style={{
                                padding: "12px 15px",
                                fontWeight: "600",
                              }}
                            >
                              {item.quantity}
                            </td>
                            <td
                              className="text-end"
                              style={{
                                padding: "12px 15px",
                                fontWeight: "600",
                              }}
                            >
                              ₹{parseFloat(item.price || 0).toFixed(2)}
                            </td>
                            <td
                              className="text-end"
                              style={{
                                padding: "12px 15px",
                                fontWeight: "700",
                                color: "#28a745",
                              }}
                            >
                              ₹
                              {parseFloat(
                                item.total || item.price * item.quantity || 0,
                              ).toFixed(2)}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                      <tfoot style={{ background: "#f8f9fa" }}>
                        <tr>
                          <td
                            colSpan="3"
                            style={{
                              padding: "15px",
                              fontWeight: "700",
                              fontSize: "1.1rem",
                            }}
                          >
                            Total Amount:
                          </td>
                          <td
                            className="text-end"
                            style={{
                              padding: "15px",
                              fontWeight: "900",
                              fontSize: "1.25rem",
                              color: "#28a745",
                            }}
                          >
                            ₹
                            {parseFloat(
                              invoice.total || invoice.totalAmount || 0,
                            ).toFixed(2)}
                          </td>
                        </tr>
                      </tfoot>
                    </table>
                  </div>

                  <hr className="my-4" />

                  <div className="text-center">
                    <div className="row justify-content-center">
                      <div className="col-md-8">
                        <div
                          className="p-4 rounded"
                          style={{
                            background:
                              "linear-gradient(135deg, #e9f8e9, #f0fff0)",
                            border: "2px solid #28a745",
                          }}
                        >
                          <i
                            className="bi bi-shield-check"
                            style={{ fontSize: "3rem", color: "#28a745" }}
                          ></i>
                          <h5
                            className="mt-3 mb-2"
                            style={{ color: "#28a745" }}
                          >
                            Digitally Verified ✓
                          </h5>
                          <p className="mb-0" style={{ color: "#155724" }}>
                            This invoice has been digitally verified and is
                            authentic.
                            <br />
                            Generated by{" "}
                            <strong>Hare Krishna Medical Store</strong>
                            <br />
                            <small>
                              QR Code scanned at{" "}
                              {new Date().toLocaleString("en-IN")}
                            </small>
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </Card.Body>

                <Card.Footer
                  style={{ background: "#f8f9fa", padding: "20px 30px" }}
                >
                  <div className="d-flex justify-content-between align-items-center flex-wrap gap-3">
                    <small className="text-muted">
                      <i className="bi bi-info-circle me-1"></i>
                      Scanned via QR Code at{" "}
                      {new Date().toLocaleString("en-IN")}
                    </small>
                    <div className="d-flex gap-2 flex-wrap">
                      <Button
                        variant="outline-secondary"
                        onClick={() => navigate("/")}
                        style={{
                          borderRadius: "6px",
                          fontWeight: "600",
                        }}
                      >
                        <i className="bi bi-house me-2"></i>
                        Home
                      </Button>
                      {renderAuthActions()}
                      <Button
                        variant="primary"
                        onClick={() =>
                          navigate(
                            `/invoice-verify/${invoice._id || invoiceId}`,
                          )
                        }
                        style={{
                          borderRadius: "6px",
                          fontWeight: "600",
                        }}
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
    </div>
  );
};

export default InvoiceQRVerify;
