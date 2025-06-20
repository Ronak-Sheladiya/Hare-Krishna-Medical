import React, { useState, useEffect } from "react";
import {
  Container,
  Row,
  Col,
  Card,
  Button,
  Table,
  Badge,
  Alert,
} from "react-bootstrap";
import { useParams, Link, Navigate } from "react-router-dom";
import { useSelector } from "react-redux";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import QRCode from "qrcode";

const InvoiceView = () => {
  const { orderId } = useParams();
  const { isAuthenticated, user } = useSelector((state) => state.auth);
  const [invoice, setInvoice] = useState(null);
  const [loading, setLoading] = useState(true);
  const [qrCode, setQrCode] = useState("");
  const [showAlert, setShowAlert] = useState(false);

  // Redirect to login if not authenticated
  if (!isAuthenticated) {
    return (
      <Navigate to="/login" state={{ from: `/invoice/${orderId}` }} replace />
    );
  }

  // Mock invoice data - in real app, this would be fetched from API
  useEffect(() => {
    const fetchInvoice = async () => {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      const mockInvoice = {
        orderId: orderId || "HKM12345678",
        invoiceId: `INV${orderId?.slice(-6) || "123456"}`,
        customerDetails: {
          fullName: "John Doe",
          email: "john.doe@example.com",
          mobile: "+91 9876543210",
          address: "123 Medical Street",
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
            total: 51.98,
          },
          {
            id: 2,
            name: "Vitamin D3 Capsules",
            company: "Health Plus",
            quantity: 1,
            price: 45.5,
            total: 45.5,
          },
        ],
        subtotal: 97.48,
        shipping: 0,
        tax: 4.87,
        total: 102.35,
        orderDate: "2024-01-15",
        orderTime: "14:30:25",
        status: "Delivered",
        paymentMethod: "Cash on Delivery",
        paymentStatus: "Paid",
      };

      setInvoice(mockInvoice);
      setLoading(false);

      // Generate QR code
      try {
        const invoiceUrl = `${window.location.origin}/invoice/${orderId}`;
        const qrCodeDataURL = await QRCode.toDataURL(invoiceUrl, {
          width: 200,
          margin: 2,
          color: {
            dark: "#000000",
            light: "#FFFFFF",
          },
        });
        setQrCode(qrCodeDataURL);
      } catch (error) {
        console.error("Error generating QR code:", error);
      }
    };

    fetchInvoice();
  }, [orderId]);

  const downloadPDF = async () => {
    if (!invoice) return;

    try {
      // Hide no-print elements temporarily
      const noPrintElements = document.querySelectorAll(".no-print");
      noPrintElements.forEach((el) => (el.style.display = "none"));

      const element = document.getElementById("invoice-content");
      const canvas = await html2canvas(element, {
        scale: 2,
        logging: false,
        useCORS: true,
      });

      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF("p", "mm", "a4");
      const imgWidth = 210;
      const pageHeight = 295;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      let heightLeft = imgHeight;

      let position = 0;

      pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;

      while (heightLeft >= 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
      }

      pdf.save(`Invoice-${invoice.invoiceId}.pdf`);

      // Show elements again
      noPrintElements.forEach((el) => (el.style.display = ""));

      setShowAlert(true);
      setTimeout(() => setShowAlert(false), 3000);
    } catch (error) {
      console.error("Error generating PDF:", error);
      alert("Error generating PDF. Please try again.");
    }
  };

  if (loading) {
    return (
      <Container className="text-center my-5">
        <div
          className="d-flex justify-content-center align-items-center"
          style={{ height: "300px" }}
        >
          <div className="text-center">
            <div className="spinner-border text-medical-red" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
            <p className="mt-3">Loading invoice...</p>
          </div>
        </div>
      </Container>
    );
  }

  if (!invoice) {
    return (
      <Container className="text-center my-5">
        <Alert variant="danger" className="text-center">
          <h4>Invoice Not Found</h4>
          <p>The requested invoice could not be found.</p>
          <Button as={Link} to="/" className="btn-medical-primary">
            Go Home
          </Button>
        </Alert>
      </Container>
    );
  }

  return (
    <div className="fade-in">
      <Container className="my-5">
        {showAlert && (
          <Alert variant="success" className="mb-4 no-print">
            <i className="bi bi-check-circle me-2"></i>
            PDF downloaded successfully!
          </Alert>
        )}

        <Card className="medical-card shadow-lg">
          <Card.Body className="p-4">
            <div className="d-flex justify-content-between align-items-center mb-4 no-print">
              <h3 className="mb-0">
                <i className="bi bi-receipt me-2"></i>
                Invoice Details
              </h3>
              <div>
                <Button
                  onClick={downloadPDF}
                  className="btn-medical-primary me-2"
                  disabled={!invoice}
                >
                  <i className="bi bi-download me-2"></i>
                  Download PDF
                </Button>
                <Button
                  onClick={() => window.print()}
                  variant="outline-primary"
                  className="btn-medical-outline me-2"
                >
                  <i className="bi bi-printer me-2"></i>
                  Print Invoice
                </Button>
                <Button
                  as={Link}
                  to="/user/invoices"
                  variant="outline-secondary"
                  className="btn-medical-outline"
                >
                  <i className="bi bi-arrow-left me-2"></i>
                  Back to Invoices
                </Button>
              </div>
            </div>

            {/* Invoice Content - This will be printed */}
            <div id="invoice-content" className="invoice-section">
              {/* Header */}
              <Row className="mb-4">
                <Col md={8}>
                  <div className="d-flex align-items-center mb-3">
                    <img
                      src="https://cdn.builder.io/api/v1/assets/ec4b3f82f1ac4275b8bfc1756fcac420/invoice_hkm12345678-1-564292"
                      alt="Hare Krishna Medical Logo"
                      style={{ height: "80px", width: "auto" }}
                      className="me-3"
                      onError={(e) => {
                        e.target.src =
                          "https://cdn.builder.io/api/v1/assets/ec4b3f82f1ac4275b8bfc1756fcac420/medical_logo-e586be?format=webp&width=800";
                      }}
                    />
                    <div>
                      <h1
                        className="mb-1"
                        style={{
                          color: "#dc3545",
                          fontSize: "2rem",
                          fontWeight: "bold",
                        }}
                      >
                        HARE KRISHNA MEDICAL
                      </h1>
                      <p
                        className="text-muted mb-1"
                        style={{ fontSize: "0.9rem" }}
                      >
                        Your Trusted Health Partner
                      </p>
                      <div
                        className="text-muted"
                        style={{ fontSize: "0.85rem" }}
                      >
                        <div>
                          3 Sahyog Complex, Man Sarovar circle, Amroli, 394107
                        </div>
                        <div>
                          📞 +91 76989 13354 | 📧 harekrishnamedical@gmail.com
                        </div>
                      </div>
                    </div>
                  </div>
                </Col>
                <Col md={4} className="text-md-end">
                  <div className="invoice-header-right">
                    <h2
                      className="text-medical-red mb-3"
                      style={{ fontSize: "1.8rem", fontWeight: "bold" }}
                    >
                      INVOICE
                    </h2>
                    <div
                      className="invoice-details p-3"
                      style={{
                        backgroundColor: "#f8f9fa",
                        border: "2px solid #dc3545",
                        borderRadius: "8px",
                      }}
                    >
                      <div className="mb-2">
                        <strong>Invoice #:</strong> {invoice.invoiceId}
                      </div>
                      <div className="mb-2">
                        <strong>Order #:</strong> {invoice.orderId}
                      </div>
                      <div className="mb-2">
                        <strong>Date:</strong> {invoice.orderDate}
                      </div>
                      <div className="mb-2">
                        <strong>Time:</strong> {invoice.orderTime}
                      </div>
                      <div>
                        <strong>Status:</strong>{" "}
                        <Badge bg="success" className="ms-1">
                          {invoice.status}
                        </Badge>
                      </div>
                    </div>
                    {qrCode && (
                      <div className="mt-3 text-center">
                        <img
                          src={qrCode}
                          alt="QR Code"
                          style={{ width: "80px", height: "80px" }}
                        />
                        <br />
                        <small className="text-muted">Scan to verify</small>
                      </div>
                    )}
                  </div>
                </Col>
              </Row>

              {/* Customer Details */}
              <Row className="mb-4">
                <Col md={6}>
                  <div
                    className="customer-section p-3"
                    style={{
                      border: "2px solid #dc3545",
                      borderRadius: "8px",
                      backgroundColor: "#fff",
                    }}
                  >
                    <h5
                      className="text-medical-red mb-3"
                      style={{
                        borderBottom: "2px solid #dc3545",
                        paddingBottom: "8px",
                        fontWeight: "bold",
                      }}
                    >
                      📍 BILL TO:
                    </h5>
                    <div className="customer-info">
                      <p className="mb-2" style={{ fontSize: "1.1rem" }}>
                        <strong>{invoice.customerDetails.fullName}</strong>
                      </p>
                      <p className="mb-1">📧 {invoice.customerDetails.email}</p>
                      <p className="mb-1">
                        📱 {invoice.customerDetails.mobile}
                      </p>
                      <p className="mb-1">
                        🏠 {invoice.customerDetails.address}
                      </p>
                      <p className="mb-0">
                        📍 {invoice.customerDetails.city},{" "}
                        {invoice.customerDetails.state}{" "}
                        {invoice.customerDetails.pincode}
                      </p>
                    </div>
                  </div>
                </Col>
                <Col md={6}>
                  <div
                    className="payment-section p-3"
                    style={{
                      border: "2px solid #17a2b8",
                      borderRadius: "8px",
                      backgroundColor: "#fff",
                    }}
                  >
                    <h5
                      className="text-info mb-3"
                      style={{
                        borderBottom: "2px solid #17a2b8",
                        paddingBottom: "8px",
                        fontWeight: "bold",
                      }}
                    >
                      💳 PAYMENT DETAILS:
                    </h5>
                    <div className="payment-info">
                      <p className="mb-2">
                        <strong>Method:</strong>
                        <Badge bg="info" className="ms-2">
                          {invoice.paymentMethod}
                        </Badge>
                      </p>
                      <p className="mb-2">
                        <strong>Status:</strong>{" "}
                        <Badge
                          bg={
                            invoice.paymentStatus === "Paid"
                              ? "success"
                              : "warning"
                          }
                          className="ms-2"
                        >
                          {invoice.paymentStatus}
                        </Badge>
                      </p>
                      <p className="mb-2">
                        <strong>Invoice Total:</strong>
                        <span className="fs-5 text-success ms-2">
                          ₹{invoice.total.toFixed(2)}
                        </span>
                      </p>
                      <p className="mb-0 text-muted small">
                        Payment processed securely
                      </p>
                    </div>
                  </div>
                </Col>
              </Row>

              {/* Items Table */}
              <Row className="mb-4">
                <Col lg={12}>
                  <div className="items-section">
                    <h5
                      className="text-medical-red mb-3"
                      style={{
                        borderBottom: "3px solid #dc3545",
                        paddingBottom: "8px",
                        fontWeight: "bold",
                      }}
                    >
                      🛒 ORDERED ITEMS:
                    </h5>
                    <div
                      style={{
                        border: "2px solid #dc3545",
                        borderRadius: "8px",
                        overflow: "hidden",
                      }}
                    >
                      <Table
                        className="mb-0"
                        style={{ backgroundColor: "#fff" }}
                      >
                        <thead
                          style={{ backgroundColor: "#dc3545", color: "white" }}
                        >
                          <tr>
                            <th
                              style={{
                                border: "none",
                                padding: "12px",
                                fontWeight: "bold",
                              }}
                            >
                              S.No
                            </th>
                            <th
                              style={{
                                border: "none",
                                padding: "12px",
                                fontWeight: "bold",
                              }}
                            >
                              Item Description
                            </th>
                            <th
                              style={{
                                border: "none",
                                padding: "12px",
                                fontWeight: "bold",
                              }}
                            >
                              Company
                            </th>
                            <th
                              style={{
                                border: "none",
                                padding: "12px",
                                fontWeight: "bold",
                                textAlign: "center",
                              }}
                            >
                              Qty
                            </th>
                            <th
                              style={{
                                border: "none",
                                padding: "12px",
                                fontWeight: "bold",
                                textAlign: "right",
                              }}
                            >
                              Price
                            </th>
                            <th
                              style={{
                                border: "none",
                                padding: "12px",
                                fontWeight: "bold",
                                textAlign: "right",
                              }}
                            >
                              Amount
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          {invoice.items.map((item, index) => (
                            <tr
                              key={item.id}
                              style={{
                                borderBottom: "1px solid #e0e0e0",
                                backgroundColor:
                                  index % 2 === 0 ? "#f8f9fa" : "#fff",
                              }}
                            >
                              <td
                                style={{ padding: "12px", fontWeight: "bold" }}
                              >
                                {index + 1}
                              </td>
                              <td style={{ padding: "12px" }}>
                                <div
                                  style={{ fontWeight: "bold", color: "#333" }}
                                >
                                  {item.name}
                                </div>
                                <small className="text-muted">
                                  Medical Product
                                </small>
                              </td>
                              <td style={{ padding: "12px" }}>
                                {item.company}
                              </td>
                              <td
                                style={{ padding: "12px", textAlign: "center" }}
                              >
                                <Badge bg="secondary">{item.quantity}</Badge>
                              </td>
                              <td
                                style={{ padding: "12px", textAlign: "right" }}
                              >
                                ₹{item.price.toFixed(2)}
                              </td>
                              <td
                                style={{
                                  padding: "12px",
                                  textAlign: "right",
                                  fontWeight: "bold",
                                  color: "#dc3545",
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
                </Col>
              </Row>

              {/* Totals */}
              <Row className="mb-4">
                <Col md={6}></Col>
                <Col md={6}>
                  <div
                    className="totals-section p-3"
                    style={{
                      border: "2px solid #28a745",
                      borderRadius: "8px",
                      backgroundColor: "#f8f9fa",
                    }}
                  >
                    <h6
                      className="text-success mb-3"
                      style={{
                        borderBottom: "2px solid #28a745",
                        paddingBottom: "5px",
                        fontWeight: "bold",
                      }}
                    >
                      💰 INVOICE SUMMARY:
                    </h6>
                    <div className="calculation-rows">
                      <div
                        className="d-flex justify-content-between py-2"
                        style={{ borderBottom: "1px solid #e0e0e0" }}
                      >
                        <span>
                          <strong>Subtotal:</strong>
                        </span>
                        <span>₹{invoice.subtotal.toFixed(2)}</span>
                      </div>
                      <div
                        className="d-flex justify-content-between py-2"
                        style={{ borderBottom: "1px solid #e0e0e0" }}
                      >
                        <span>
                          <strong>Shipping:</strong>
                        </span>
                        <span className="text-success">
                          {invoice.shipping === 0
                            ? "FREE"
                            : `₹${invoice.shipping.toFixed(2)}`}
                        </span>
                      </div>
                      <div
                        className="d-flex justify-content-between py-2"
                        style={{ borderBottom: "1px solid #e0e0e0" }}
                      >
                        <span>
                          <strong>Tax (5%):</strong>
                        </span>
                        <span>₹{invoice.tax.toFixed(2)}</span>
                      </div>
                      <div
                        className="d-flex justify-content-between py-3 mt-2"
                        style={{
                          backgroundColor: "#28a745",
                          color: "white",
                          marginLeft: "-12px",
                          marginRight: "-12px",
                          paddingLeft: "12px",
                          paddingRight: "12px",
                          borderRadius: "5px",
                          fontSize: "1.2rem",
                        }}
                      >
                        <span>
                          <strong>TOTAL AMOUNT:</strong>
                        </span>
                        <span>
                          <strong>₹{invoice.total.toFixed(2)}</strong>
                        </span>
                      </div>
                    </div>
                  </div>
                </Col>
              </Row>

              {/* Footer */}
              <Row>
                <Col lg={12}>
                  <div
                    className="invoice-footer p-4 mt-4"
                    style={{
                      borderTop: "3px solid #dc3545",
                      backgroundColor: "#f8f9fa",
                      borderRadius: "8px",
                    }}
                  >
                    <div className="text-center">
                      <h5 className="text-medical-red mb-3">
                        🙏 Thank You for Choosing Hare Krishna Medical! 🙏
                      </h5>
                      <div className="row">
                        <div className="col-md-4">
                          <h6 className="text-info">📞 Contact Us</h6>
                          <p className="mb-0 small">+91 76989 13354</p>
                          <p className="mb-0 small">+91 91060 18508</p>
                        </div>
                        <div className="col-md-4">
                          <h6 className="text-info">📧 Email Support</h6>
                          <p className="mb-0 small">
                            harekrishnamedical@gmail.com
                          </p>
                        </div>
                        <div className="col-md-4">
                          <h6 className="text-info">🏠 Visit Our Store</h6>
                          <p className="mb-0 small">3 Sahyog Complex, Amroli</p>
                        </div>
                      </div>
                      <hr className="my-3" />
                      <div className="row">
                        <div className="col-md-6 text-md-start">
                          <small className="text-muted">
                            <strong>Note:</strong> This is a computer generated
                            invoice. No signature required.
                          </small>
                        </div>
                        <div className="col-md-6 text-md-end">
                          <small className="text-muted">
                            Generated on {new Date().toLocaleString()}
                          </small>
                        </div>
                      </div>
                    </div>
                  </div>
                </Col>
              </Row>
            </div>
          </Card.Body>
        </Card>
      </Container>

      {/* Print-only CSS */}
      <style>{`
        @media print {
          /* Hide everything except invoice content */
          .no-print {
            display: none !important;
          }

          /* Hide header, footer, and navigation */
          .medical-header,
          .medical-footer,
          nav,
          .navbar {
            display: none !important;
          }

          /* Make invoice full width for print */
          .container {
            max-width: 100% !important;
            padding: 0 !important;
          }

          /* Remove shadows and borders for print */
          .card,
          .medical-card {
            box-shadow: none !important;
            border: 1px solid #ccc !important;
          }

          /* Ensure good contrast for print */
          body {
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
          }

          /* Page breaks */
          .invoice-section {
            page-break-inside: avoid;
          }

          /* Remove margins for full page print */
          @page {
            margin: 0.5in;
          }

          /* Print-specific table styling */
          .table {
            border-collapse: collapse !important;
          }

          .table th,
          .table td {
            border: 1px solid #000 !important;
            padding: 8px !important;
          }
        }
      `}</style>
    </div>
  );
};

export default InvoiceView;
