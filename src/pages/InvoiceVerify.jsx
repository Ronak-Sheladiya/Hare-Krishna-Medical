import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import {
  Container,
  Row,
  Col,
  Card,
  Button,
  Alert,
  Badge,
  Table,
  Spinner,
} from "react-bootstrap";
import ProfessionalLoading from "../components/common/ProfessionalLoading";
import { refreshSession } from "../store/slices/authSlice";

const InvoiceVerify = () => {
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

  useEffect(() => {
    if (invoiceId) {
      fetchInvoiceDetails();
    }
  }, [invoiceId]);

  const fetchInvoiceDetails = async () => {
    try {
      setLoading(true);
      setError("");

      // Get auth token from localStorage or sessionStorage
      const token =
        localStorage.getItem("token") || sessionStorage.getItem("token");

      const headers = {
        "Content-Type": "application/json",
      };

      // Add authorization header if token exists
      if (token) {
        headers.Authorization = `Bearer ${token}`;
      }

      const response = await fetch(`/api/invoices/verify/${invoiceId}`, {
        method: "GET",
        headers,
      });

      const data = await response.json();

      if (data.success) {
        setInvoice(data.data);
      } else {
        setError(data.message || "Invoice not found");
      }
    } catch (error) {
      console.error("Error fetching invoice:", error);
      setError("Failed to load invoice details. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const handleDownload = async () => {
    try {
      // Create a new window for PDF generation
      const printWindow = window.open("", "_blank");
      printWindow.document.write(`
        <!DOCTYPE html>
        <html>
          <head>
            <title>Invoice ${invoice.invoiceId}</title>
            <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/css/bootstrap.min.css" rel="stylesheet">
            <style>
              @media print {
                body { margin: 0; }
                .no-print { display: none !important; }
              }
              body { font-family: Arial, sans-serif; }
              .invoice-header { background: #e63946; color: white; padding: 20px; border-radius: 8px; }
              .company-info { margin-bottom: 20px; }
              .invoice-details { background: #f8f9fa; padding: 15px; border-radius: 8px; }
            </style>
          </head>
          <body>
            ${document.getElementById("invoice-content").innerHTML}
          </body>
        </html>
      `);
      printWindow.document.close();
      printWindow.focus();
      setTimeout(() => {
        printWindow.print();
        printWindow.close();
      }, 250);
    } catch (error) {
      console.error("Download error:", error);
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
      <Container className="mt-5">
        <Row className="justify-content-center">
          <Col lg={6}>
            <Card className="text-center">
              <Card.Body className="p-5">
                <div className="mb-4">
                  <i
                    className="bi bi-exclamation-triangle"
                    style={{ fontSize: "64px", color: "#dc3545" }}
                  ></i>
                </div>
                <h3 className="text-danger">Invoice Not Found</h3>
                <p className="text-muted mb-4">{error}</p>
                <Button
                  variant="primary"
                  onClick={() => navigate("/")}
                  className="me-2"
                >
                  <i className="bi bi-house me-2"></i>
                  Go Home
                </Button>
                <Button
                  variant="outline-secondary"
                  onClick={fetchInvoiceDetails}
                >
                  <i className="bi bi-arrow-clockwise me-2"></i>
                  Try Again
                </Button>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    );
  }

  return (
    <div className="bg-light min-vh-100">
      <Container className="py-4">
        {/* Header */}
        <Row className="mb-4">
          <Col lg={12}>
            <Card
              style={{
                border: "none",
                borderRadius: "16px",
                background: "linear-gradient(135deg, #28a745, #20c997)",
                color: "white",
                boxShadow: "0 8px 32px rgba(40, 167, 69, 0.3)",
              }}
            >
              <Card.Body className="p-4">
                <Row className="align-items-center">
                  <Col lg={8}>
                    <div className="d-flex align-items-center">
                      <div
                        style={{
                          width: "60px",
                          height: "60px",
                          background: "rgba(255, 255, 255, 0.2)",
                          borderRadius: "50%",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          marginRight: "20px",
                        }}
                      >
                        <i
                          className="bi bi-patch-check"
                          style={{ fontSize: "28px" }}
                        ></i>
                      </div>
                      <div>
                        <h1
                          style={{
                            fontWeight: "800",
                            marginBottom: "5px",
                            fontSize: "2rem",
                          }}
                        >
                          Invoice Verified ✓
                        </h1>
                        <p style={{ opacity: "0.9", marginBottom: "0" }}>
                          Invoice ID: {invoice.invoiceId}
                        </p>
                      </div>
                    </div>
                  </Col>
                  <Col lg={4} className="text-end">
                    <div className="d-flex gap-2 justify-content-end">
                      <Button
                        variant="light"
                        onClick={handlePrint}
                        className="no-print"
                        style={{
                          borderRadius: "8px",
                          fontWeight: "600",
                        }}
                      >
                        <i className="bi bi-printer me-2"></i>
                        Print
                      </Button>
                      <Button
                        variant="outline-light"
                        onClick={handleDownload}
                        className="no-print"
                        style={{
                          borderRadius: "8px",
                          fontWeight: "600",
                        }}
                      >
                        <i className="bi bi-download me-2"></i>
                        Download
                      </Button>
                    </div>
                  </Col>
                </Row>
              </Card.Body>
            </Card>
          </Col>
        </Row>

        {/* Invoice Content */}
        <div id="invoice-content">
          <Row>
            <Col lg={12}>
              <Card
                style={{
                  border: "none",
                  borderRadius: "16px",
                  boxShadow: "0 8px 32px rgba(0,0,0,0.1)",
                }}
              >
                <Card.Body className="p-4">
                  {/* Company Header */}
                  <div
                    className="invoice-header mb-4"
                    style={{
                      background: "linear-gradient(135deg, #e63946, #dc3545)",
                      color: "white",
                      padding: "30px",
                      borderRadius: "12px",
                    }}
                  >
                    <Row className="align-items-center">
                      <Col lg={8}>
                        <div className="d-flex align-items-center">
                          <div
                            style={{
                              width: "80px",
                              height: "80px",
                              background: "white",
                              borderRadius: "50%",
                              padding: "10px",
                              border: "3px solid rgba(255,255,255,0.3)",
                              boxShadow: "0 8px 24px rgba(0,0,0,0.2)",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              marginRight: "20px",
                            }}
                          >
                            <img
                              src="https://cdn.builder.io/api/v1/assets/030c65a34d11492ab1cc545443b12540/hk-e0ec29?format=webp&width=800"
                              alt="Hare Krishna Medical"
                              style={{
                                width: "60px",
                                height: "60px",
                                objectFit: "contain",
                              }}
                            />
                          </div>
                          <div>
                            <h2
                              style={{
                                fontWeight: "800",
                                marginBottom: "5px",
                              }}
                            >
                              HARE KRISHNA MEDICAL
                            </h2>
                            <p style={{ opacity: "0.9", marginBottom: "0" }}>
                              Your Trusted Health Partner
                            </p>
                          </div>
                        </div>
                        <div className="mt-3" style={{ fontSize: "14px" }}>
                          <div>📍 {invoice.companyInfo.address}</div>
                          <div>📞 {invoice.companyInfo.phone}</div>
                          <div>📧 {invoice.companyInfo.email}</div>
                        </div>
                      </Col>
                      <Col lg={4} className="text-end">
                        <h1
                          style={{
                            fontWeight: "800",
                            marginBottom: "15px",
                            fontSize: "2.5rem",
                          }}
                        >
                          INVOICE
                        </h1>
                        <div
                          style={{
                            background: "rgba(255,255,255,0.9)",
                            color: "#333",
                            padding: "15px",
                            borderRadius: "8px",
                          }}
                        >
                          <div>
                            <strong>Invoice:</strong> {invoice.invoiceId}
                          </div>
                          <div>
                            <strong>Date:</strong>{" "}
                            {new Date(invoice.invoiceDate).toLocaleDateString()}
                          </div>
                          <div>
                            <strong>Status:</strong>{" "}
                            <Badge
                              bg={
                                invoice.paymentStatus === "Completed"
                                  ? "success"
                                  : "warning"
                              }
                              className="ms-1"
                            >
                              {invoice.paymentStatus}
                            </Badge>
                          </div>
                        </div>
                      </Col>
                    </Row>
                  </div>

                  {/* Customer Information */}
                  <Row className="mb-4">
                    <Col lg={6}>
                      <div
                        style={{
                          background: "#f8f9fa",
                          padding: "20px",
                          borderRadius: "12px",
                          border: "1px solid #e9ecef",
                        }}
                      >
                        <h5
                          style={{
                            color: "#e63946",
                            marginBottom: "15px",
                            fontWeight: "700",
                          }}
                        >
                          <i className="bi bi-person me-2"></i>
                          BILL TO
                        </h5>
                        <div style={{ lineHeight: "1.8" }}>
                          <div>
                            <strong>{invoice.customerName}</strong>
                          </div>
                          <div>{invoice.customerEmail}</div>
                          <div>{invoice.customerMobile}</div>
                        </div>
                      </div>
                    </Col>
                    <Col lg={6}>
                      <div
                        style={{
                          background: "#f8f9fa",
                          padding: "20px",
                          borderRadius: "12px",
                          border: "1px solid #e9ecef",
                        }}
                      >
                        <h5
                          style={{
                            color: "#28a745",
                            marginBottom: "15px",
                            fontWeight: "700",
                          }}
                        >
                          <i className="bi bi-credit-card me-2"></i>
                          PAYMENT INFO
                        </h5>
                        <div style={{ lineHeight: "1.8" }}>
                          <div>
                            <strong>Method:</strong> {invoice.paymentMethod}
                          </div>
                          <div>
                            <strong>Status:</strong>{" "}
                            <Badge
                              bg={
                                invoice.paymentStatus === "Completed"
                                  ? "success"
                                  : "warning"
                              }
                            >
                              {invoice.paymentStatus}
                            </Badge>
                          </div>
                          <div>
                            <strong>Total:</strong>{" "}
                            <span
                              style={{
                                color: "#28a745",
                                fontWeight: "700",
                                fontSize: "1.1rem",
                              }}
                            >
                              ₹{invoice.total.toFixed(2)}
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
                        border: "1px solid #e9ecef",
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
                          {invoice.items.map((item, index) => (
                            <tr key={index}>
                              <td
                                style={{ padding: "15px", fontWeight: "600" }}
                              >
                                {index + 1}
                              </td>
                              <td style={{ padding: "15px" }}>
                                <div>
                                  <strong>{item.name}</strong>
                                </div>
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
                                ₹{item.price.toFixed(2)}
                              </td>
                              <td
                                style={{
                                  padding: "15px",
                                  textAlign: "right",
                                  fontWeight: "700",
                                  color: "#28a745",
                                }}
                              >
                                ₹{item.total.toFixed(2)}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </Table>
                    </div>
                  </div>

                  {/* Totals */}
                  <Row className="justify-content-end">
                    <Col lg={6}>
                      <div
                        style={{
                          border: "1px solid #e9ecef",
                          borderRadius: "12px",
                          overflow: "hidden",
                        }}
                      >
                        <Table className="mb-0">
                          <tbody>
                            <tr>
                              <td
                                style={{
                                  padding: "12px 20px",
                                  fontWeight: "600",
                                  background: "#f8f9fa",
                                }}
                              >
                                Subtotal:
                              </td>
                              <td
                                style={{
                                  padding: "12px 20px",
                                  textAlign: "right",
                                  fontWeight: "600",
                                  background: "#f8f9fa",
                                }}
                              >
                                ₹{invoice.subtotal.toFixed(2)}
                              </td>
                            </tr>
                            <tr>
                              <td
                                style={{
                                  padding: "12px 20px",
                                  fontWeight: "600",
                                  background: "#f8f9fa",
                                }}
                              >
                                Tax:
                              </td>
                              <td
                                style={{
                                  padding: "12px 20px",
                                  textAlign: "right",
                                  fontWeight: "600",
                                  background: "#f8f9fa",
                                }}
                              >
                                ₹{invoice.tax.toFixed(2)}
                              </td>
                            </tr>
                            <tr>
                              <td
                                style={{
                                  padding: "12px 20px",
                                  fontWeight: "600",
                                  background: "#f8f9fa",
                                }}
                              >
                                Shipping:
                              </td>
                              <td
                                style={{
                                  padding: "12px 20px",
                                  textAlign: "right",
                                  fontWeight: "600",
                                  background: "#f8f9fa",
                                }}
                              >
                                {invoice.shipping === 0
                                  ? "FREE"
                                  : `₹${invoice.shipping.toFixed(2)}`}
                              </td>
                            </tr>
                            <tr>
                              <td
                                style={{
                                  padding: "15px 20px",
                                  fontWeight: "700",
                                  fontSize: "1.1rem",
                                  background: "#e63946",
                                  color: "white",
                                }}
                              >
                                TOTAL:
                              </td>
                              <td
                                style={{
                                  padding: "15px 20px",
                                  textAlign: "right",
                                  fontWeight: "700",
                                  fontSize: "1.2rem",
                                  background: "#e63946",
                                  color: "white",
                                }}
                              >
                                ₹{invoice.total.toFixed(2)}
                              </td>
                            </tr>
                          </tbody>
                        </Table>
                      </div>
                    </Col>
                  </Row>

                  {/* QR Code */}
                  {invoice.qrCode && (
                    <Row className="mt-4">
                      <Col lg={12} className="text-center">
                        <div
                          style={{
                            background: "#f8f9fa",
                            padding: "20px",
                            borderRadius: "12px",
                            border: "1px solid #e9ecef",
                          }}
                        >
                          <h6 style={{ marginBottom: "15px" }}>
                            Invoice QR Code
                          </h6>
                          <img
                            src={invoice.qrCode}
                            alt="Invoice QR Code"
                            style={{
                              width: "120px",
                              height: "120px",
                              border: "2px solid #e63946",
                              borderRadius: "8px",
                            }}
                          />
                          <p
                            style={{
                              fontSize: "12px",
                              color: "#666",
                              marginTop: "10px",
                              marginBottom: "0",
                            }}
                          >
                            Scan to verify this invoice
                          </p>
                        </div>
                      </Col>
                    </Row>
                  )}

                  {/* Footer */}
                  <div
                    className="mt-4 pt-3"
                    style={{
                      borderTop: "1px solid #e9ecef",
                      textAlign: "center",
                      color: "#666",
                      fontSize: "12px",
                    }}
                  >
                    <p style={{ marginBottom: "5px" }}>
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

        {/* Action Buttons */}
        <Row className="mt-4 no-print">
          <Col lg={12} className="text-center">
            <Button
              variant="outline-secondary"
              onClick={() => navigate("/")}
              className="me-3"
              style={{ borderRadius: "8px" }}
            >
              <i className="bi bi-house me-2"></i>
              Go Home
            </Button>
            <Button
              variant="outline-primary"
              onClick={() => navigate("/products")}
              style={{ borderRadius: "8px" }}
            >
              <i className="bi bi-shop me-2"></i>
              Continue Shopping
            </Button>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default InvoiceVerify;
