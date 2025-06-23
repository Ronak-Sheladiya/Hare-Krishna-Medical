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
import { useParams, Link, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import OfficialInvoiceDesign from "../components/common/OfficialInvoiceDesign.jsx";

const InvoiceView = () => {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated, user } = useSelector((state) => state.auth);
  const [invoice, setInvoice] = useState(null);
  const [loading, setLoading] = useState(true);
  const [qrCode, setQrCode] = useState("");
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [verificationStatus, setVerificationStatus] = useState(null);

  // Enhanced Button Component
  const EnhancedButton = ({
    children,
    variant = "primary",
    onClick,
    icon,
    style = {},
    size = "md",
    disabled = false,
    to,
  }) => {
    const baseStyle = {
      borderRadius: size === "lg" ? "12px" : "8px",
      padding:
        size === "lg" ? "12px 24px" : size === "sm" ? "6px 12px" : "8px 16px",
      fontWeight: "600",
      transition: "all 0.3s ease",
      border: "none",
      position: "relative",
      overflow: "hidden",
      display: "inline-flex",
      alignItems: "center",
      justifyContent: "center",
      opacity: disabled ? 0.6 : 1,
      cursor: disabled ? "not-allowed" : "pointer",
      textDecoration: "none",
      ...style,
    };

    const variants = {
      primary: {
        background: "linear-gradient(135deg, #e63946, #dc3545)",
        color: "white",
        boxShadow: "0 4px 15px rgba(230, 57, 70, 0.3)",
      },
      success: {
        background: "linear-gradient(135deg, #28a745, #20c997)",
        color: "white",
        boxShadow: "0 4px 15px rgba(40, 167, 69, 0.3)",
      },
      info: {
        background: "linear-gradient(135deg, #17a2b8, #20c997)",
        color: "white",
        boxShadow: "0 4px 15px rgba(23, 162, 184, 0.3)",
      },
      outline: {
        background: "transparent",
        border: "2px solid #e63946",
        color: "#e63946",
      },
    };

    const currentStyle = { ...baseStyle, ...variants[variant] };

    const handleHover = (e, isHover) => {
      if (disabled) return;
      if (isHover) {
        e.target.style.transform = "translateY(-2px)";
        if (variant === "outline") {
          e.target.style.background = "#e63946";
          e.target.style.color = "white";
        }
      } else {
        e.target.style.transform = "translateY(0)";
        if (variant === "outline") {
          e.target.style.background = "transparent";
          e.target.style.color = "#e63946";
        }
      }
    };

    const content = (
      <>
        {icon && <i className={`${icon} me-2`}></i>}
        {children}
      </>
    );

    if (to) {
      return (
        <Link
          to={to}
          style={currentStyle}
          onMouseEnter={(e) => handleHover(e, true)}
          onMouseLeave={(e) => handleHover(e, false)}
        >
          {content}
        </Link>
      );
    }

    return (
      <button
        style={currentStyle}
        onClick={onClick}
        disabled={disabled}
        onMouseEnter={(e) => handleHover(e, true)}
        onMouseLeave={(e) => handleHover(e, false)}
      >
        {content}
      </button>
    );
  };

  // Fetch real invoice data from API
  useEffect(() => {
    const fetchInvoice = async () => {
      setLoading(true);
      try {
        if (!orderId) {
          setVerificationStatus("invalid");
          setLoading(false);
          return;
        }

        // Try to fetch from API first
        const response = await fetch(
          `${import.meta.env.VITE_BACKEND_URL || "http://localhost:5000"}/api/invoices/${orderId}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${localStorage.getItem("token") || ""}`,
            },
          },
        );

        if (response.ok) {
          const data = await response.json();
          if (data.success && data.data) {
            const invoiceData = data.data;

            // Ensure tax is 0 and statuses are correct for real data
            const processedInvoiceData = {
              ...invoiceData,
              tax: 0,
              status: invoiceData.status || "Pending",
              paymentStatus: invoiceData.paymentStatus || "Pending",
            };

            // Generate real QR code
            try {
              const QRCode = (await import("qrcode")).default;
              const qrData = {
                type: "invoice_verification",
                invoice_id:
                  processedInvoiceData.invoiceId || processedInvoiceData._id,
                order_id: processedInvoiceData.orderId,
                customer_name:
                  processedInvoiceData.customerName ||
                  processedInvoiceData.customerDetails?.fullName,
                total_amount: `₹${processedInvoiceData.total.toFixed(2)}`,
                verification_url: `${window.location.origin}/qr/invoice/${processedInvoiceData._id}`,
                verified_at: new Date().toISOString(),
              };

              const qrCodeURL = await QRCode.toDataURL(JSON.stringify(qrData));
              setQrCode(qrCodeURL);
            } catch (qrError) {
              console.warn("QR Code generation failed:", qrError);
              // Fallback to placeholder
              setQrCode(
                `data:image/svg+xml,${encodeURIComponent(`
                <svg width="180" height="180" xmlns="http://www.w3.org/2000/svg">
                  <rect width="180" height="180" fill="#f8f9fa" stroke="#dee2e6" stroke-width="2"/>
                  <text x="90" y="90" text-anchor="middle" dy="0.3em" font-family="Arial" font-size="12" fill="#6c757d">
                    QR Code
                  </text>
                </svg>
              `)}`,
              );
            }

            setInvoice(processedInvoiceData);
            setVerificationStatus("verified");
            setAlertMessage("Invoice loaded from database successfully!");
            setShowAlert(true);
            setTimeout(() => setShowAlert(false), 5000);
          } else {
            setError(data.message || "Invoice not found");
            setVerificationStatus("not_found");
          }
        } else if (response.status === 404) {
          setError("Invoice not found");
          setVerificationStatus("not_found");
        } else {
          throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }
      } catch (error) {
        console.error("Error fetching invoice:", error);
        setError(
          "Unable to load invoice. Please check your connection and try again.",
        );
        setVerificationStatus("error");
      } finally {
        setLoading(false);
      }
    };

    fetchInvoice();
  }, [orderId]);

  const handlePrintInvoice = async () => {
    if (!invoice) return;

    try {
      // Get the invoice display element
      const invoiceElement = document.getElementById("invoice-display");
      if (!invoiceElement) {
        throw new Error("Invoice display not found");
      }

      // Create a new window for printing
      const printWindow = window.open("", "_blank");
      if (!printWindow) {
        throw new Error("Popup blocked. Please allow popups and try again.");
      }

      // Create print-friendly HTML
      const printHTML = `
        <!DOCTYPE html>
        <html>
        <head>
          <title>Invoice ${invoice.invoiceId || invoice._id}</title>
          <style>
            * { margin: 0; padding: 0; box-sizing: border-box; }
            body { font-family: Arial, sans-serif; background: white; }
            .print-container { padding: 20px; max-width: 210mm; margin: 0 auto; }
            .no-print { display: none !important; }
            @media print {
              body { margin: 0; }
              .print-container { padding: 10mm; }
            }
          </style>
        </head>
        <body>
          <div class="print-container">
            ${invoiceElement.innerHTML}
          </div>
        </body>
        </html>
      `;

      // Write HTML to print window
      printWindow.document.write(printHTML);
      printWindow.document.close();

      // Wait for content to load
      printWindow.onload = () => {
        setTimeout(() => {
          printWindow.print();
          printWindow.close();
        }, 500);
      };

      setAlertMessage("Opening print dialog...");
      setShowAlert(true);
      setTimeout(() => setShowAlert(false), 3000);
    } catch (error) {
      console.error("Print error:", error);
      setAlertMessage(`Print error: ${error.message}`);
      setShowAlert(true);
      setTimeout(() => setShowAlert(false), 5000);
    }
  };

  const handleDownloadInvoice = () => {
    if (!invoice) return;

    // Create downloadable content
    const invoiceContent = `
HARE KRISHNA MEDICAL - INVOICE
===============================

Invoice ID: ${invoice.invoiceId}
Order ID: ${invoice.orderId}
Date: ${invoice.orderDate} ${invoice.orderTime}

Customer Details:
${invoice.customerDetails.fullName}
${invoice.customerDetails.email}
${invoice.customerDetails.mobile}
${invoice.customerDetails.address}
${invoice.customerDetails.city}, ${invoice.customerDetails.state} ${invoice.customerDetails.pincode}

Items:
${invoice.items.map((item) => `${item.name} x${item.quantity} - ₹${(item.price * item.quantity).toFixed(2)}`).join("\n")}

Subtotal: ₹${invoice.subtotal.toFixed(2)}
Shipping: ${invoice.shipping === 0 ? "FREE" : `₹${invoice.shipping.toFixed(2)}`}
Total: ₹${invoice.total.toFixed(2)}

Payment Method: ${invoice.paymentMethod}
Status: ${invoice.status}

This is a computer-generated invoice.
Generated: ${new Date().toLocaleString()}
    `;

    const element = document.createElement("a");
    const file = new Blob([invoiceContent], { type: "text/plain" });
    element.href = URL.createObjectURL(file);
    element.download = `invoice-${invoice.invoiceId}.txt`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  if (loading) {
    return (
      <div className="fade-in">
        <section
          style={{
            paddingTop: "4rem",
            paddingBottom: "4rem",
            minHeight: "100vh",
            background: "linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Container>
            <Row className="justify-content-center">
              <Col lg={6} className="text-center">
                <Card
                  style={{
                    border: "none",
                    borderRadius: "20px",
                    boxShadow: "0 15px 50px rgba(0, 0, 0, 0.1)",
                    padding: "40px",
                  }}
                >
                  <div
                    style={{
                      width: "80px",
                      height: "80px",
                      background: "linear-gradient(135deg, #e63946, #dc3545)",
                      borderRadius: "50%",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      margin: "0 auto 30px",
                    }}
                  >
                    <Spinner
                      animation="border"
                      style={{ color: "white", width: "40px", height: "40px" }}
                    />
                  </div>
                  <h3
                    style={{
                      color: "#333",
                      fontWeight: "700",
                      marginBottom: "15px",
                    }}
                  >
                    Verifying Invoice
                  </h3>
                  <p style={{ color: "#6c757d", marginBottom: "0" }}>
                    Please wait while we verify and load your invoice details...
                  </p>
                </Card>
              </Col>
            </Row>
          </Container>
        </section>
      </div>
    );
  }

  if (verificationStatus === "invalid") {
    return (
      <div className="fade-in">
        <section
          style={{
            paddingTop: "4rem",
            paddingBottom: "4rem",
            minHeight: "100vh",
            background: "linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Container>
            <Row className="justify-content-center">
              <Col lg={6} className="text-center">
                <Card
                  style={{
                    border: "none",
                    borderRadius: "20px",
                    boxShadow: "0 15px 50px rgba(0, 0, 0, 0.1)",
                    padding: "40px",
                  }}
                >
                  <div
                    style={{
                      width: "80px",
                      height: "80px",
                      background: "linear-gradient(135deg, #dc3545, #e63946)",
                      borderRadius: "50%",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      margin: "0 auto 30px",
                    }}
                  >
                    <i
                      className="bi bi-exclamation-triangle"
                      style={{ fontSize: "40px", color: "white" }}
                    ></i>
                  </div>
                  <h3
                    style={{
                      color: "#dc3545",
                      fontWeight: "700",
                      marginBottom: "15px",
                    }}
                  >
                    Invoice Not Found
                  </h3>
                  <p
                    style={{
                      color: "#6c757d",
                      marginBottom: "30px",
                      lineHeight: "1.6",
                    }}
                  >
                    The invoice you're looking for doesn't exist or may have
                    been removed. Please check the invoice ID and try again.
                  </p>
                  <div className="d-flex gap-3 justify-content-center">
                    <EnhancedButton variant="primary" to="/" icon="bi bi-house">
                      Go Home
                    </EnhancedButton>
                    <EnhancedButton
                      variant="outline"
                      to="/contact"
                      icon="bi bi-envelope"
                    >
                      Contact Support
                    </EnhancedButton>
                  </div>
                </Card>
              </Col>
            </Row>
          </Container>
        </section>
      </div>
    );
  }

  if (verificationStatus === "error") {
    return (
      <div className="fade-in">
        <section
          style={{
            paddingTop: "4rem",
            paddingBottom: "4rem",
            minHeight: "100vh",
            background: "linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Container>
            <Row className="justify-content-center">
              <Col lg={6} className="text-center">
                <Card
                  style={{
                    border: "none",
                    borderRadius: "20px",
                    boxShadow: "0 15px 50px rgba(0, 0, 0, 0.1)",
                    padding: "40px",
                  }}
                >
                  <div
                    style={{
                      width: "80px",
                      height: "80px",
                      background: "linear-gradient(135deg, #ffc107, #fd7e14)",
                      borderRadius: "50%",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      margin: "0 auto 30px",
                    }}
                  >
                    <i
                      className="bi bi-wifi-off"
                      style={{ fontSize: "40px", color: "white" }}
                    ></i>
                  </div>
                  <h3
                    style={{
                      color: "#fd7e14",
                      fontWeight: "700",
                      marginBottom: "15px",
                    }}
                  >
                    Connection Error
                  </h3>
                  <p
                    style={{
                      color: "#6c757d",
                      marginBottom: "30px",
                      lineHeight: "1.6",
                    }}
                  >
                    Unable to verify invoice at the moment. Please check your
                    internet connection and try again.
                  </p>
                  <EnhancedButton
                    variant="primary"
                    onClick={() => window.location.reload()}
                    icon="bi bi-arrow-clockwise"
                  >
                    Try Again
                  </EnhancedButton>
                </Card>
              </Col>
            </Row>
          </Container>
        </section>
      </div>
    );
  }

  return (
    <div className="fade-in">
      <section
        style={{
          paddingTop: "2rem",
          paddingBottom: "2rem",
          minHeight: "100vh",
          background: "linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%)",
        }}
      >
        <Container>
          {/* Success Alert */}
          {showAlert && (
            <Row className="mb-4">
              <Col lg={12}>
                <Alert
                  variant="success"
                  style={{
                    borderRadius: "12px",
                    border: "none",
                    background: "linear-gradient(135deg, #d4edda, #c3e6cb)",
                    borderLeft: "5px solid #28a745",
                  }}
                  onClose={() => setShowAlert(false)}
                  dismissible
                >
                  <Alert.Heading
                    style={{ fontSize: "18px", fontWeight: "700" }}
                  >
                    <i className="bi bi-check-circle me-2"></i>
                    Verification Successful!
                  </Alert.Heading>
                  <p style={{ marginBottom: "0", color: "#155724" }}>
                    {alertMessage}
                  </p>
                </Alert>
              </Col>
            </Row>
          )}

          {/* Header */}
          <Row className="mb-4">
            <Col lg={12}>
              <Card
                style={{
                  border: "none",
                  borderRadius: "20px",
                  background: "linear-gradient(135deg, #e63946, #dc3545)",
                  color: "white",
                  boxShadow: "0 15px 50px rgba(230, 57, 70, 0.3)",
                }}
              >
                <Card.Body style={{ padding: "30px" }}>
                  <Row className="align-items-center">
                    <Col lg={8}>
                      <div className="d-flex align-items-center mb-3">
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
                            className="bi bi-receipt-cutoff"
                            style={{ fontSize: "28px" }}
                          ></i>
                        </div>
                        <div>
                          <h1
                            style={{
                              fontWeight: "800",
                              marginBottom: "5px",
                              fontSize: "2.2rem",
                            }}
                          >
                            Invoice Verified
                          </h1>
                          <p
                            style={{
                              opacity: "0.9",
                              marginBottom: "0",
                              fontSize: "1.1rem",
                            }}
                          >
                            {invoice?.invoiceId} • Order {invoice?.orderId}
                          </p>
                        </div>
                      </div>
                    </Col>
                    <Col lg={4} className="text-end">
                      <Badge
                        style={{
                          background: "rgba(40, 167, 69, 0.9)",
                          color: "white",
                          padding: "10px 20px",
                          borderRadius: "25px",
                          fontSize: "14px",
                          fontWeight: "600",
                        }}
                      >
                        <i className="bi bi-shield-check me-2"></i>
                        Verified Invoice
                      </Badge>
                    </Col>
                  </Row>
                </Card.Body>
              </Card>
            </Col>
          </Row>

          {/* Invoice Actions */}
          <Row className="mb-4">
            <Col lg={12}>
              <Card
                style={{
                  border: "none",
                  borderRadius: "16px",
                  boxShadow: "0 8px 32px rgba(0,0,0,0.08)",
                }}
              >
                <Card.Body style={{ padding: "20px" }}>
                  <Row className="align-items-center">
                    <Col lg={6}>
                      <h6
                        style={{
                          color: "#333",
                          fontWeight: "700",
                          marginBottom: "5px",
                        }}
                      >
                        <i className="bi bi-tools me-2"></i>
                        Invoice Actions
                      </h6>
                      <small style={{ color: "#6c757d" }}>
                        Print, download, or verify this invoice
                      </small>
                    </Col>
                    <Col lg={6}>
                      <div className="d-flex gap-2 justify-content-end">
                        <EnhancedButton
                          variant="success"
                          onClick={handlePrintInvoice}
                          icon="bi bi-printer"
                          size="sm"
                        >
                          Print
                        </EnhancedButton>
                        <EnhancedButton
                          variant="info"
                          onClick={handleDownloadInvoice}
                          icon="bi bi-download"
                          size="sm"
                        >
                          Download
                        </EnhancedButton>
                        {isAuthenticated && (
                          <EnhancedButton
                            variant="outline"
                            to="/user/orders"
                            icon="bi bi-box-seam"
                            size="sm"
                          >
                            My Orders
                          </EnhancedButton>
                        )}
                        {!isAuthenticated && (
                          <EnhancedButton
                            variant="outline"
                            to="/login"
                            icon="bi bi-person"
                            size="sm"
                          >
                            Login
                          </EnhancedButton>
                        )}
                      </div>
                    </Col>
                  </Row>
                </Card.Body>
              </Card>
            </Col>
          </Row>

          {/* Invoice Display */}
          <Row>
            <Col lg={12}>
              <Card
                style={{
                  border: "none",
                  borderRadius: "16px",
                  boxShadow: "0 8px 32px rgba(0,0,0,0.08)",
                  overflow: "hidden",
                }}
              >
                <Card.Body style={{ padding: "0" }}>
                  {invoice && (
                    <div
                      id="invoice-display"
                      style={{
                        background: "white",
                        minHeight: "600px",
                      }}
                    >
                      <OfficialInvoiceDesign
                        invoiceData={invoice}
                        qrCode={qrCode}
                        forPrint={false}
                      />
                    </div>
                  )}
                </Card.Body>
              </Card>
            </Col>
          </Row>

          {/* Footer Actions */}
          <Row className="mt-4">
            <Col lg={12} className="text-center">
              <Card
                style={{
                  border: "none",
                  borderRadius: "16px",
                  background: "#f8f9fa",
                  padding: "20px",
                }}
              >
                <div style={{ marginBottom: "15px" }}>
                  <small style={{ color: "#6c757d" }}>
                    Need help? Contact Hare Krishna Medical support
                  </small>
                </div>
                <div className="d-flex gap-3 justify-content-center">
                  <EnhancedButton
                    variant="outline"
                    to="/contact"
                    icon="bi bi-envelope"
                    size="sm"
                  >
                    Contact Support
                  </EnhancedButton>
                  <EnhancedButton
                    variant="outline"
                    to="/user-guide"
                    icon="bi bi-book"
                    size="sm"
                  >
                    User Guide
                  </EnhancedButton>
                  <EnhancedButton
                    variant="outline"
                    to="/"
                    icon="bi bi-house"
                    size="sm"
                  >
                    Back to Home
                  </EnhancedButton>
                </div>
              </Card>
            </Col>
          </Row>
        </Container>
      </section>
    </div>
  );
};

export default InvoiceView;
