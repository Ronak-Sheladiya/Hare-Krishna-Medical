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

  // Mock invoice data - in real app, this would be fetched from API
  useEffect(() => {
    const fetchInvoice = async () => {
      setLoading(true);
      try {
        // Simulate API call
        await new Promise((resolve) => setTimeout(resolve, 1500));

        // Check if invoice exists
        if (!orderId || orderId === "invalid") {
          setVerificationStatus("invalid");
          setLoading(false);
          return;
        }

        const mockInvoice = {
          orderId: orderId || "HKM12345678",
          invoiceId: `HKM-INV-2024-${orderId?.slice(-3) || "001"}`,
          customerDetails: {
            fullName: "John Doe",
            email: "john.doe@example.com",
            mobile: "+91 9876543210",
            address: "123 Medical Street, Rander Road",
            city: "Surat",
            state: "Gujarat",
            pincode: "395007",
          },
          items: [
            {
              id: 1,
              name: "Paracetamol Tablets 500mg",
              company: "Hare Krishna Pharma",
              quantity: 2,
              price: 25.99,
            },
            {
              id: 2,
              name: "Vitamin D3 Capsules",
              company: "Health Plus",
              quantity: 1,
              price: 45.5,
            },
          ],
          subtotal: 97.48,
          shipping: 0,
          total: 102.35,
          paymentMethod: "Cash on Delivery",
          paymentStatus: "Completed",
          status: "Delivered",
          orderDate: "2024-01-15",
          orderTime: "14:30:25",
          deliveryDate: "2024-01-17",
          trackingNumber: "TRK123456789",
        };

        // Generate QR code for verification
        const qrData = {
          type: "invoice_verification",
          invoice_id: mockInvoice.invoiceId,
          order_id: mockInvoice.orderId,
          customer_name: mockInvoice.customerDetails.fullName,
          total_amount: `₹${mockInvoice.total.toFixed(2)}`,
          verification_url: `${window.location.origin}/invoice/${mockInvoice.orderId}`,
          verified_at: new Date().toISOString(),
        };

        // In real app, generate actual QR code
        const qrCodeURL = `data:image/svg+xml,${encodeURIComponent(`
          <svg width="180" height="180" xmlns="http://www.w3.org/2000/svg">
            <rect width="180" height="180" fill="#f8f9fa" stroke="#dee2e6" stroke-width="2"/>
            <text x="90" y="90" text-anchor="middle" dy="0.3em" font-family="Arial" font-size="12" fill="#6c757d">
              QR Code
            </text>
            <text x="90" y="110" text-anchor="middle" dy="0.3em" font-family="Arial" font-size="10" fill="#6c757d">
              ${mockInvoice.invoiceId}
            </text>
          </svg>
        `)}`;

        setInvoice(mockInvoice);
        setQrCode(qrCodeURL);
        setVerificationStatus("verified");
        setAlertMessage("Invoice verified successfully!");
        setShowAlert(true);

        // Auto-hide alert after 5 seconds
        setTimeout(() => setShowAlert(false), 5000);
      } catch (error) {
        console.error("Error fetching invoice:", error);
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
      // Create a temporary div for printing
      const tempDiv = document.createElement("div");
      tempDiv.style.position = "absolute";
      tempDiv.style.left = "-9999px";
      tempDiv.style.width = "210mm";
      tempDiv.style.backgroundColor = "white";
      document.body.appendChild(tempDiv);

      // Import and render OfficialInvoiceDesign component
      const React = (await import("react")).default;
      const { createRoot } = await import("react-dom/client");

      const root = createRoot(tempDiv);
      root.render(
        React.createElement(OfficialInvoiceDesign, {
          invoiceData: invoice,
          qrCode: qrCode,
          forPrint: true,
        }),
      );

      // Wait for rendering
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Use original print process
      const originalContents = document.body.innerHTML;
      document.body.innerHTML = tempDiv.innerHTML;
      window.print();
      document.body.innerHTML = originalContents;

      // Cleanup
      document.body.removeChild(tempDiv);

      // Reload to restore original content
      window.location.reload();
    } catch (error) {
      console.error("Print error:", error);
      setAlertMessage("Error printing invoice. Please try again.");
      setShowAlert(true);
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
