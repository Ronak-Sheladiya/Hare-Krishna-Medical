import React, { useState, useEffect } from "react";
import {
  Container,
  Row,
  Col,
  Card,
  Button,
  Alert,
  Badge,
  Spinner,
} from "react-bootstrap";
import { useParams, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import ProfessionalLoading from "../components/common/ProfessionalLoading";
import { PageHeroSection } from "../components/common/ConsistentTheme";
import { refreshSession } from "../store/slices/authSlice";
import { api, safeApiCall } from "../utils/apiClient";
import { getDemoInvoice, isDemoInvoice } from "../utils/demoInvoiceData";
import OfficialInvoiceDesign from "../components/common/OfficialInvoiceDesign";
import "../styles/InvoicePrintA4.css";

const InvoiceDetails = () => {
  const { invoiceId } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { isAuthenticated, user } = useSelector((state) => state.auth);
  const [invoice, setInvoice] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

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
      fetchInvoiceData();
    }
  }, [invoiceId]);

  const fetchInvoiceData = async () => {
    setLoading(true);
    setError("");

    // Check if this is a demo invoice first
    if (isDemoInvoice(invoiceId)) {
      const demoInvoice = getDemoInvoice(invoiceId);
      if (demoInvoice) {
        setInvoice(demoInvoice);
        setLoading(false);
        return;
      }
    }

    // Otherwise fetch from API
    const {
      success,
      data,
      error: apiError,
    } = await safeApiCall(() => api.get(`/api/invoices/${invoiceId}`), null);

    if (success && data?.data) {
      setInvoice(data.data);
    } else {
      setError(
        apiError ||
          "Invoice not found. Please check the invoice ID and try again.",
      );
    }

    setLoading(false);
  };

  const handlePrint = () => {
    const printContent = document.getElementById("invoice-print-content");
    if (printContent) {
      const printWindow = window.open("", "_blank");
      printWindow.document.write(`
        <!DOCTYPE html>
        <html>
          <head>
            <title>Invoice ${invoice?.invoiceId || invoiceId}</title>
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
                .page-break { page-break-before: always; }
                .invoice-content {
                  max-height: 90vh;
                  overflow: hidden;
                  display: block;
                }
                .invoice-header {
                  padding: 15px !important;
                  margin-bottom: 10px !important;
                }
                .company-info {
                  font-size: 10px !important;
                  line-height: 1.2 !important;
                }
                .invoice-title {
                  font-size: 28px !important;
                  margin-bottom: 10px !important;
                }
                .customer-info, .payment-info {
                  padding: 12px !important;
                  margin-bottom: 8px !important;
                }
                .table {
                  font-size: 10px !important;
                  margin-bottom: 8px !important;
                }
                .table th, .table td {
                  padding: 4px 6px !important;
                  border: 1px solid #dee2e6 !important;
                  line-height: 1.2 !important;
                }
                .total-section {
                  margin-top: 8px !important;
                }
                .footer-text {
                  font-size: 9px !important;
                  margin-top: 10px !important;
                  border-top: 1px solid #dee2e6 !important;
                  padding-top: 8px !important;
                }
              }
              body {
                font-family: 'Segoe UI', Arial, sans-serif;
                line-height: 1.3;
                color: #333;
                font-size: 12px;
              }
              .invoice-header {
                background: #e63946 !important;
                color: white !important;
                -webkit-print-color-adjust: exact;
                print-color-adjust: exact;
              }
              .text-medical-red { color: #e63946 !important; }
              .text-success { color: #28a745 !important; }
              .company-logo { max-width: 60px; height: auto; }
              .table th, .table td { padding: 6px; border: 1px solid #dee2e6; }
            </style>
          </head>
          <body>
            <div class="invoice-content">
              ${printContent.innerHTML}
            </div>
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
      // Create a hidden iframe for PDF generation
      const iframe = document.createElement("iframe");
      iframe.style.display = "none";
      document.body.appendChild(iframe);

      const printContent = document.getElementById("invoice-print-content");
      if (!printContent) {
        alert("Invoice content not found");
        return;
      }

      const iframeDoc = iframe.contentDocument || iframe.contentWindow.document;
      iframeDoc.write(`
        <!DOCTYPE html>
        <html>
          <head>
            <title>Invoice ${invoice?.invoiceId || invoiceId}</title>
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
              .invoice-header {
                background: #e63946 !important;
                color: white !important;
                padding: 15px !important;
                margin-bottom: 10px !important;
                -webkit-print-color-adjust: exact;
                print-color-adjust: exact;
              }
              .company-info {
                font-size: 10px !important;
                line-height: 1.2 !important;
              }
              .invoice-title {
                font-size: 28px !important;
                margin-bottom: 10px !important;
              }
              .customer-info, .payment-info {
                padding: 12px !important;
                margin-bottom: 8px !important;
              }
              .table {
                font-size: 10px !important;
                margin-bottom: 8px !important;
              }
              .table th, .table td {
                padding: 4px 6px !important;
                border: 1px solid #dee2e6 !important;
                line-height: 1.2 !important;
              }
              .total-section {
                margin-top: 8px !important;
              }
              .footer-text {
                font-size: 9px !important;
                margin-top: 10px !important;
                border-top: 1px solid #dee2e6 !important;
                padding-top: 8px !important;
              }
              .text-medical-red { color: #e63946 !important; }
              .text-success { color: #28a745 !important; }
              .company-logo { max-width: 60px; height: auto; }
              .no-print { display: none !important; }
            </style>
          </head>
          <body>
            ${printContent.innerHTML}
          </body>
        </html>
      `);
      iframeDoc.close();

      // Wait for content to load
      setTimeout(() => {
        try {
          // Use browser's built-in save as PDF functionality
          iframe.contentWindow.print();

          // Clean up
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

  const renderAuthActions = () => {
    if (!isAuthenticated) {
      return (
        <Button
          variant="primary"
          onClick={() => navigate("/login")}
          style={{
            background: "#e63946",
            border: "none",
            borderRadius: "8px",
            padding: "12px 24px",
            fontWeight: "600",
          }}
        >
          <i className="bi bi-box-arrow-in-right me-2"></i>
          Login to Manage
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
            background: "#28a745",
            border: "none",
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
            background: "#17a2b8",
            border: "none",
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
        message="Loading Invoice..."
        fullScreen={true}
      />
    );
  }

  if (error) {
    return (
      <div className="bg-light min-vh-100">
        {/* Header */}
        <div
          style={{
            background: "linear-gradient(135deg, #dc3545, #c82333)",
            padding: "60px 0",
            color: "white",
            textAlign: "center",
          }}
        >
          <Container>
            <div
              style={{
                width: "80px",
                height: "80px",
                background: "rgba(255,255,255,0.2)",
                borderRadius: "50%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                margin: "0 auto 20px",
              }}
            >
              <i
                className="bi bi-exclamation-triangle"
                style={{ fontSize: "40px" }}
              ></i>
            </div>
            <h1
              style={{
                fontSize: "2.5rem",
                fontWeight: "800",
                marginBottom: "10px",
              }}
            >
              Invoice Not Found
            </h1>
            <p style={{ fontSize: "1.1rem", opacity: "0.9" }}>
              Unable to load the requested invoice
            </p>
          </Container>
        </div>

        <Container className="py-5">
          <Row className="justify-content-center">
            <Col lg={8}>
              <Card
                style={{
                  border: "none",
                  borderRadius: "16px",
                  boxShadow: "0 8px 32px rgba(0,0,0,0.1)",
                }}
              >
                <Card.Body className="text-center p-5">
                  <h3 className="text-danger mb-3">Invoice Loading Failed</h3>
                  <p className="text-muted mb-4" style={{ fontSize: "16px" }}>
                    {error}
                  </p>
                  <div className="d-flex gap-3 justify-content-center flex-wrap">
                    <Button
                      variant="primary"
                      onClick={() => navigate("/")}
                      style={{ borderRadius: "8px", padding: "12px 24px" }}
                    >
                      <i className="bi bi-house me-2"></i>
                      Go Home
                    </Button>
                    <Button
                      variant="outline-secondary"
                      onClick={fetchInvoiceData}
                      style={{ borderRadius: "8px", padding: "12px 24px" }}
                    >
                      <i className="bi bi-arrow-clockwise me-2"></i>
                      Try Again
                    </Button>
                    {renderAuthActions()}
                  </div>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Container>
      </div>
    );
  }

  // Convert invoice data to the format expected by OfficialInvoiceDesign
  const invoiceData = {
    invoiceId: invoice.invoiceId || invoiceId,
    orderId: invoice.order?.orderId || invoice.orderId,
    orderDate: new Date(
      invoice.invoiceDate || invoice.createdAt,
    ).toLocaleDateString("en-IN"),
    orderTime: new Date(
      invoice.invoiceDate || invoice.createdAt,
    ).toLocaleTimeString("en-IN"),
    customerDetails: {
      fullName: invoice.customerDetails?.fullName || invoice.customerName,
      email: invoice.customerDetails?.email || invoice.customerEmail,
      mobile: invoice.customerDetails?.mobile || invoice.customerMobile,
      address: invoice.customerDetails?.address || invoice.customerAddress,
      city: invoice.customerDetails?.city || invoice.customerCity,
      state: invoice.customerDetails?.state || invoice.customerState,
      pincode: invoice.customerDetails?.pincode || invoice.customerPincode,
    },
    items: invoice.items || [],
    subtotal: invoice.subtotal || invoice.total,
    shipping: invoice.shipping || 0,
    total: invoice.total || invoice.totalAmount,
    paymentMethod: invoice.paymentMethod || "COD",
    paymentStatus: invoice.paymentStatus || invoice.status,
    status: invoice.status || invoice.paymentStatus,
  };

  return (
    <div className="bg-light min-vh-100">
      {/* Professional Header */}
      <div
        style={{
          background: "linear-gradient(135deg, #e63946, #dc3545)",
          padding: "40px 0",
          color: "white",
        }}
      >
        <Container>
          <Row className="align-items-center">
            <Col lg={8}>
              <div className="d-flex align-items-center">
                <div
                  style={{
                    width: "70px",
                    height: "70px",
                    background: "rgba(255,255,255,0.2)",
                    borderRadius: "50%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    marginRight: "20px",
                  }}
                >
                  <i
                    className="bi bi-receipt-cutoff"
                    style={{ fontSize: "32px" }}
                  ></i>
                </div>
                <div>
                  <h1
                    style={{
                      fontSize: "2.2rem",
                      fontWeight: "800",
                      marginBottom: "5px",
                    }}
                  >
                    Invoice Details
                  </h1>
                  <p
                    style={{
                      opacity: "0.9",
                      marginBottom: "0",
                      fontSize: "16px",
                    }}
                  >
                    Invoice ID: {invoice.invoiceId || invoiceId}
                  </p>
                </div>
              </div>
            </Col>
            <Col lg={4} className="text-end">
              <div className="d-flex gap-2 justify-content-end flex-wrap">
                <Button
                  variant="light"
                  onClick={handlePrint}
                  className="no-print print-button"
                  style={{ borderRadius: "8px", fontWeight: "600" }}
                >
                  <i className="bi bi-printer me-2"></i>
                  Print
                </Button>
                <Button
                  variant="outline-light"
                  onClick={handleDownload}
                  className="no-print print-button"
                  style={{ borderRadius: "8px", fontWeight: "600" }}
                >
                  <i className="bi bi-download me-2"></i>
                  Download
                </Button>
              </div>
            </Col>
          </Row>
        </Container>
      </div>

      <Container className="py-5">
        {/* Action Buttons */}
        <Row className="mb-4 no-print">
          <Col lg={12}>
            <Card
              style={{
                border: "none",
                borderRadius: "12px",
                background: "rgba(255,255,255,0.95)",
                boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
              }}
            >
              <Card.Body className="p-3">
                <div className="d-flex justify-content-between align-items-center flex-wrap gap-3">
                  <div className="d-flex gap-2 flex-wrap">
                    <Button
                      variant="outline-primary"
                      onClick={handlePrint}
                      className="print-button"
                      style={{ borderRadius: "8px", fontWeight: "600" }}
                    >
                      <i className="bi bi-printer me-2"></i>
                      Print Invoice
                    </Button>
                    <Button
                      variant="outline-success"
                      onClick={handleDownload}
                      className="print-button"
                      style={{ borderRadius: "8px", fontWeight: "600" }}
                    >
                      <i className="bi bi-download me-2"></i>
                      Save as PDF
                    </Button>
                  </div>
                  <div className="d-flex gap-2 flex-wrap">
                    {renderAuthActions()}
                    <Button
                      variant="outline-secondary"
                      onClick={() => navigate("/")}
                      style={{ borderRadius: "8px", fontWeight: "600" }}
                    >
                      <i className="bi bi-house me-2"></i>
                      Home
                    </Button>
                  </div>
                </div>
              </Card.Body>
            </Card>
          </Col>
        </Row>

        {/* Invoice Content */}
        <Row>
          <Col lg={12}>
            <Card
              style={{
                border: "none",
                borderRadius: "16px",
                boxShadow: "0 8px 32px rgba(0,0,0,0.1)",
                overflow: "hidden",
              }}
            >
              <Card.Body className="p-0">
                <OfficialInvoiceDesign
                  invoiceData={invoiceData}
                  qrCode={invoice.qrCode}
                  forPrint={false}
                  onPrint={handlePrint}
                  onDownload={handleDownload}
                  showActionButtons={true}
                />
              </Card.Body>
            </Card>
          </Col>
        </Row>

        {/* Bottom Actions */}
        <Row className="mt-4 no-print">
          <Col lg={12} className="text-center">
            <div className="d-flex gap-3 justify-content-center flex-wrap">
              <Button
                variant="outline-secondary"
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
              <Button
                variant="outline-primary"
                onClick={() => navigate("/products")}
                style={{
                  borderRadius: "8px",
                  padding: "12px 24px",
                  fontWeight: "600",
                }}
              >
                <i className="bi bi-shop me-2"></i>
                Continue Shopping
              </Button>
            </div>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default InvoiceDetails;
