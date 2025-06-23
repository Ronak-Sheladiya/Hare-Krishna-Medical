import React, { useState, useEffect } from "react";
import {
  Container,
  Row,
  Col,
  Card,
  Button,
  Alert,
  Badge,
  Table,
} from "react-bootstrap";
import { useParams, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import ProfessionalLoading from "../components/common/ProfessionalLoading";
import { refreshSession } from "../store/slices/authSlice";
import { api, safeApiCall } from "../utils/apiClient";
import { getDemoInvoice, isDemoInvoice } from "../utils/demoInvoiceData";

const InvoiceView = () => {
  const { orderId } = useParams();
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
    if (orderId) {
      fetchInvoiceData();
    }
  }, [orderId]);

  const fetchInvoiceData = async () => {
    setLoading(true);
    setError("");

    // Check if this is a demo invoice first
    if (isDemoInvoice(orderId)) {
      const demoInvoice = getDemoInvoice(orderId);
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
    } = await safeApiCall(() => api.get(`/api/invoices/${orderId}`), null);

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
            <title>Invoice ${invoice?.invoiceNumber || orderId}</title>
            <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">
            <style>
              @media print {
                body { margin: 0; color: black !important; font-size: 12px; }
                .no-print { display: none !important; }
              }
              body { font-family: 'Segoe UI', Arial, sans-serif; line-height: 1.4; }
              .invoice-header { background: #e63946 !important; color: white !important; }
              .text-medical-red { color: #e63946 !important; }
              .text-success { color: #28a745 !important; }
              .company-logo { max-width: 80px; }
              .table th, .table td { padding: 8px; border: 1px solid #dee2e6; }
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

  const handleDownload = () => {
    // For now, trigger print which allows save as PDF
    handlePrint();
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
                    Invoice ID: {invoice?.invoiceNumber || orderId}
                  </p>
                </div>
              </div>
            </Col>
            <Col lg={4} className="text-end">
              <div className="d-flex gap-2 justify-content-end flex-wrap">
                <Button
                  variant="light"
                  onClick={handlePrint}
                  className="no-print"
                  style={{ borderRadius: "8px", fontWeight: "600" }}
                >
                  <i className="bi bi-printer me-2"></i>
                  Print
                </Button>
                <Button
                  variant="outline-light"
                  onClick={handleDownload}
                  className="no-print"
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
                      style={{ borderRadius: "8px", fontWeight: "600" }}
                    >
                      <i className="bi bi-printer me-2"></i>
                      Print Invoice
                    </Button>
                    <Button
                      variant="outline-success"
                      onClick={handleDownload}
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
        <div id="invoice-print-content">
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
                {/* Company Header */}
                <div
                  className="invoice-header"
                  style={{
                    background: "linear-gradient(135deg, #e63946, #dc3545)",
                    color: "white",
                    padding: "40px",
                  }}
                >
                  <Row className="align-items-center">
                    <Col lg={8}>
                      <div className="d-flex align-items-center">
                        <div
                          style={{
                            width: "90px",
                            height: "90px",
                            background: "white",
                            borderRadius: "50%",
                            padding: "12px",
                            border: "4px solid rgba(255,255,255,0.3)",
                            boxShadow: "0 8px 32px rgba(0,0,0,0.3)",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            marginRight: "25px",
                          }}
                        >
                          <img
                            src="https://cdn.builder.io/api/v1/assets/030c65a34d11492ab1cc545443b12540/hk-e0ec29?format=webp&width=800"
                            alt="Hare Krishna Medical"
                            className="company-logo"
                            style={{
                              width: "70px",
                              height: "70px",
                              objectFit: "contain",
                            }}
                          />
                        </div>
                        <div>
                          <h1
                            style={{
                              fontWeight: "900",
                              marginBottom: "8px",
                              fontSize: "2.2rem",
                              letterSpacing: "1px",
                            }}
                          >
                            HARE KRISHNA MEDICAL
                          </h1>
                          <p
                            style={{
                              opacity: "0.95",
                              marginBottom: "0",
                              fontSize: "16px",
                            }}
                          >
                            Your Trusted Health Partner
                          </p>
                          <div
                            style={{
                              fontSize: "14px",
                              opacity: "0.9",
                              marginTop: "15px",
                            }}
                          >
                            <div className="mb-1">
                              <i className="bi bi-geo-alt me-2"></i>3 Sahyog
                              Complex, Man Sarovar circle, Amroli, 394107
                            </div>
                            <div className="mb-1">
                              <i className="bi bi-telephone me-2"></i>+91 76989
                              13354 | +91 91060 18508
                            </div>
                            <div>
                              <i className="bi bi-envelope me-2"></i>
                              hkmedicalamroli@gmail.com
                            </div>
                          </div>
                        </div>
                      </div>
                    </Col>
                    <Col lg={4} className="text-end">
                      <h1
                        style={{
                          fontWeight: "900",
                          marginBottom: "20px",
                          fontSize: "2.8rem",
                          textShadow: "2px 2px 4px rgba(0,0,0,0.3)",
                        }}
                      >
                        INVOICE
                      </h1>
                      <div
                        style={{
                          background: "rgba(255,255,255,0.95)",
                          color: "#333",
                          padding: "20px",
                          borderRadius: "12px",
                          boxShadow: "0 4px 16px rgba(0,0,0,0.2)",
                        }}
                      >
                        <div className="mb-2">
                          <strong>Invoice ID:</strong>{" "}
                          <span className="text-medical-red">
                            {invoice?.invoiceNumber || orderId}
                          </span>
                        </div>
                        <div className="mb-2">
                          <strong>Date:</strong>{" "}
                          {new Date(
                            invoice?.createdAt || Date.now(),
                          ).toLocaleDateString("en-IN")}
                        </div>
                        <div>
                          <strong>Status:</strong>{" "}
                          <Badge
                            bg={
                              invoice?.status === "paid" ||
                              invoice?.paymentStatus === "Completed"
                                ? "success"
                                : "warning"
                            }
                            className="ms-1"
                          >
                            {invoice?.status ||
                              invoice?.paymentStatus ||
                              "Pending"}
                          </Badge>
                        </div>
                      </div>
                    </Col>
                  </Row>
                </div>

                <Card.Body className="p-4">
                  {/* Customer & Payment Info */}
                  <Row className="mb-4">
                    <Col lg={6}>
                      <div
                        style={{
                          background: "#f8f9fa",
                          borderRadius: "12px",
                          border: "2px solid #e9ecef",
                          padding: "25px",
                          height: "100%",
                        }}
                      >
                        <h5
                          style={{
                            color: "#e63946",
                            marginBottom: "20px",
                            fontWeight: "700",
                          }}
                        >
                          <i className="bi bi-person-circle me-2"></i>
                          BILL TO
                        </h5>
                        <div style={{ lineHeight: "2" }}>
                          <div>
                            <strong>
                              {invoice?.customerName || "Customer Name"}
                            </strong>
                          </div>
                          <div>
                            {invoice?.customerEmail || "customer@email.com"}
                          </div>
                          <div>
                            {invoice?.customerPhone ||
                              invoice?.customerMobile ||
                              "Phone Number"}
                          </div>
                          {invoice?.customerAddress && (
                            <div className="mt-2 text-muted">
                              <small>{invoice.customerAddress}</small>
                            </div>
                          )}
                        </div>
                      </div>
                    </Col>
                    <Col lg={6}>
                      <div
                        style={{
                          background: "#f8f9fa",
                          borderRadius: "12px",
                          border: "2px solid #e9ecef",
                          padding: "25px",
                          height: "100%",
                        }}
                      >
                        <h5
                          style={{
                            color: "#28a745",
                            marginBottom: "20px",
                            fontWeight: "700",
                          }}
                        >
                          <i className="bi bi-credit-card me-2"></i>
                          PAYMENT INFO
                        </h5>
                        <div style={{ lineHeight: "2" }}>
                          <div>
                            <strong>Method:</strong>{" "}
                            {invoice?.paymentMethod || "Cash on Delivery"}
                          </div>
                          <div>
                            <strong>Status:</strong>{" "}
                            <Badge
                              bg={
                                invoice?.status === "paid" ||
                                invoice?.paymentStatus === "Completed"
                                  ? "success"
                                  : "warning"
                              }
                            >
                              {invoice?.status ||
                                invoice?.paymentStatus ||
                                "Pending"}
                            </Badge>
                          </div>
                          <div>
                            <strong>Total:</strong>{" "}
                            <span
                              style={{
                                color: "#28a745",
                                fontWeight: "700",
                                fontSize: "1.2rem",
                              }}
                            >
                              ₹
                              {parseFloat(
                                invoice?.total || invoice?.totalAmount || 0,
                              ).toFixed(2)}
                            </span>
                          </div>
                        </div>
                      </div>
                    </Col>
                  </Row>

                  {/* Items Table */}
                  <div className="mb-4">
                    <h5
                      style={{
                        color: "#333",
                        marginBottom: "20px",
                        fontWeight: "700",
                      }}
                    >
                      <i className="bi bi-list-ul me-2"></i>
                      INVOICE ITEMS
                    </h5>
                    <div
                      style={{
                        border: "2px solid #e9ecef",
                        borderRadius: "12px",
                        overflow: "hidden",
                      }}
                    >
                      <Table striped className="mb-0">
                        <thead
                          style={{ background: "#e63946", color: "white" }}
                        >
                          <tr>
                            <th style={{ border: "none", padding: "15px" }}>
                              #
                            </th>
                            <th style={{ border: "none", padding: "15px" }}>
                              Description
                            </th>
                            <th
                              style={{
                                border: "none",
                                padding: "15px",
                                textAlign: "center",
                              }}
                            >
                              Qty
                            </th>
                            <th
                              style={{
                                border: "none",
                                padding: "15px",
                                textAlign: "right",
                              }}
                            >
                              Price
                            </th>
                            <th
                              style={{
                                border: "none",
                                padding: "15px",
                                textAlign: "right",
                              }}
                            >
                              Total
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          {invoice?.items?.map((item, index) => (
                            <tr key={index}>
                              <td
                                style={{ padding: "15px", fontWeight: "600" }}
                              >
                                {index + 1}
                              </td>
                              <td style={{ padding: "15px" }}>
                                <div>
                                  <strong>
                                    {item.name || item.productName}
                                  </strong>
                                </div>
                                {item.description && (
                                  <small className="text-muted">
                                    {item.description}
                                  </small>
                                )}
                              </td>
                              <td
                                style={{
                                  padding: "15px",
                                  textAlign: "center",
                                  fontWeight: "600",
                                }}
                              >
                                {item.quantity}
                              </td>
                              <td
                                style={{
                                  padding: "15px",
                                  textAlign: "right",
                                  fontWeight: "600",
                                }}
                              >
                                ₹{parseFloat(item.price || 0).toFixed(2)}
                              </td>
                              <td
                                style={{
                                  padding: "15px",
                                  textAlign: "right",
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
                      </Table>
                    </div>
                  </div>

                  {/* Total Section */}
                  <Row className="justify-content-end">
                    <Col lg={6}>
                      <div
                        style={{
                          border: "2px solid #e9ecef",
                          borderRadius: "12px",
                          overflow: "hidden",
                        }}
                      >
                        <Table className="mb-0">
                          <tbody>
                            <tr>
                              <td
                                style={{
                                  padding: "15px 20px",
                                  fontWeight: "600",
                                  background: "#f8f9fa",
                                }}
                              >
                                Subtotal:
                              </td>
                              <td
                                style={{
                                  padding: "15px 20px",
                                  textAlign: "right",
                                  fontWeight: "600",
                                  background: "#f8f9fa",
                                }}
                              >
                                ₹
                                {parseFloat(
                                  invoice?.subtotal || invoice?.total || 0,
                                ).toFixed(2)}
                              </td>
                            </tr>
                            <tr>
                              <td
                                style={{
                                  padding: "15px 20px",
                                  fontWeight: "600",
                                  background: "#f8f9fa",
                                }}
                              >
                                Tax:
                              </td>
                              <td
                                style={{
                                  padding: "15px 20px",
                                  textAlign: "right",
                                  fontWeight: "600",
                                  background: "#f8f9fa",
                                }}
                              >
                                {invoice?.tax
                                  ? `₹${parseFloat(invoice.tax).toFixed(2)}`
                                  : "Included"}
                              </td>
                            </tr>
                            <tr>
                              <td
                                style={{
                                  padding: "15px 20px",
                                  fontWeight: "600",
                                  background: "#f8f9fa",
                                }}
                              >
                                Shipping:
                              </td>
                              <td
                                style={{
                                  padding: "15px 20px",
                                  textAlign: "right",
                                  fontWeight: "600",
                                  background: "#f8f9fa",
                                }}
                              >
                                {invoice?.shipping === 0 || !invoice?.shipping
                                  ? "FREE"
                                  : `₹${parseFloat(invoice.shipping).toFixed(2)}`}
                              </td>
                            </tr>
                            <tr>
                              <td
                                style={{
                                  padding: "20px",
                                  fontWeight: "900",
                                  fontSize: "1.2rem",
                                  background: "#e63946",
                                  color: "white",
                                }}
                              >
                                TOTAL:
                              </td>
                              <td
                                style={{
                                  padding: "20px",
                                  textAlign: "right",
                                  fontWeight: "900",
                                  fontSize: "1.3rem",
                                  background: "#e63946",
                                  color: "white",
                                }}
                              >
                                ₹
                                {parseFloat(
                                  invoice?.total || invoice?.totalAmount || 0,
                                ).toFixed(2)}
                              </td>
                            </tr>
                          </tbody>
                        </Table>
                      </div>
                    </Col>
                  </Row>

                  {/* Footer */}
                  <div
                    className="mt-5 pt-4"
                    style={{
                      borderTop: "2px solid #e9ecef",
                      textAlign: "center",
                      color: "#666",
                      fontSize: "14px",
                    }}
                  >
                    <p style={{ marginBottom: "10px", fontWeight: "600" }}>
                      <i className="bi bi-shield-check me-2 text-success"></i>
                      This is a computer-generated invoice and does not require
                      a signature.
                    </p>
                    <p style={{ marginBottom: "0" }}>
                      Thank you for choosing Hare Krishna Medical - Your Trusted
                      Health Partner
                    </p>
                  </div>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </div>

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

export default InvoiceView;
