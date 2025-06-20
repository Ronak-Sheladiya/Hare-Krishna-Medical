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
                <Col md={6}>
                  <div className="d-flex align-items-center mb-3">
                    <img
                      src="https://cdn.builder.io/api/v1/assets/ec4b3f82f1ac4275b8bfc1756fcac420/medical_logo-e586be?format=webp&width=800"
                      alt="Hare Krishna Medical"
                      style={{ height: "60px", width: "auto" }}
                      className="me-3"
                    />
                    <div>
                      <h2 className="mb-0">HARE KRISHNA MEDICAL</h2>
                      <p className="text-muted mb-0">
                        Your Trusted Health Partner
                      </p>
                    </div>
                  </div>
                  <div className="text-muted">
                    <p className="mb-1">3 Sahyog Complex, Man Sarovar circle</p>
                    <p className="mb-1">Amroli, 394107</p>
                    <p className="mb-1">Phone: +91 76989 13354</p>
                    <p className="mb-0">Email: harekrishnamedical@gmail.com</p>
                  </div>
                </Col>
                <Col md={6} className="text-md-end">
                  <h1 className="text-medical-red mb-3">INVOICE</h1>
                  <div className="mb-3">
                    <strong>Invoice #:</strong> {invoice.invoiceId}
                    <br />
                    <strong>Order #:</strong> {invoice.orderId}
                    <br />
                    <strong>Date:</strong> {invoice.orderDate}{" "}
                    {invoice.orderTime}
                    <br />
                    <strong>Status:</strong>{" "}
                    <Badge bg="success">{invoice.status}</Badge>
                  </div>
                  {qrCode && (
                    <div className="mt-3">
                      <img
                        src={qrCode}
                        alt="QR Code"
                        style={{ width: "100px", height: "100px" }}
                      />
                      <br />
                      <small className="text-muted">Scan to view invoice</small>
                    </div>
                  )}
                </Col>
              </Row>

              {/* Customer Details */}
              <Row className="mb-4">
                <Col md={6}>
                  <Card className="bg-light border-0">
                    <Card.Body>
                      <h5 className="text-medical-red mb-3">Bill To:</h5>
                      <p className="mb-1">
                        <strong>{invoice.customerDetails.fullName}</strong>
                      </p>
                      <p className="mb-1">{invoice.customerDetails.email}</p>
                      <p className="mb-1">{invoice.customerDetails.mobile}</p>
                      <p className="mb-1">{invoice.customerDetails.address}</p>
                      <p className="mb-0">
                        {invoice.customerDetails.city},{" "}
                        {invoice.customerDetails.state}{" "}
                        {invoice.customerDetails.pincode}
                      </p>
                    </Card.Body>
                  </Card>
                </Col>
                <Col md={6}>
                  <Card className="bg-light border-0">
                    <Card.Body>
                      <h5 className="text-medical-red mb-3">Payment Info:</h5>
                      <p className="mb-1">
                        <strong>Method:</strong> {invoice.paymentMethod}
                      </p>
                      <p className="mb-1">
                        <strong>Status:</strong>{" "}
                        <Badge
                          bg={
                            invoice.paymentStatus === "Paid"
                              ? "success"
                              : "warning"
                          }
                        >
                          {invoice.paymentStatus}
                        </Badge>
                      </p>
                      <p className="mb-0">
                        <strong>Total:</strong> ₹{invoice.total.toFixed(2)}
                      </p>
                    </Card.Body>
                  </Card>
                </Col>
              </Row>

              {/* Items Table */}
              <Row className="mb-4">
                <Col lg={12}>
                  <h5 className="text-medical-red mb-3">Items Ordered:</h5>
                  <Table striped bordered hover responsive>
                    <thead className="table-dark">
                      <tr>
                        <th>Item</th>
                        <th>Company</th>
                        <th className="text-center">Qty</th>
                        <th className="text-end">Price</th>
                        <th className="text-end">Total</th>
                      </tr>
                    </thead>
                    <tbody>
                      {invoice.items.map((item) => (
                        <tr key={item.id}>
                          <td>{item.name}</td>
                          <td>{item.company}</td>
                          <td className="text-center">{item.quantity}</td>
                          <td className="text-end">₹{item.price.toFixed(2)}</td>
                          <td className="text-end">₹{item.total.toFixed(2)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </Table>
                </Col>
              </Row>

              {/* Totals */}
              <Row className="mb-4">
                <Col md={6} className="ms-auto">
                  <Table borderless>
                    <tbody>
                      <tr>
                        <td className="text-end">
                          <strong>Subtotal:</strong>
                        </td>
                        <td className="text-end">
                          ₹{invoice.subtotal.toFixed(2)}
                        </td>
                      </tr>
                      <tr>
                        <td className="text-end">
                          <strong>Shipping:</strong>
                        </td>
                        <td className="text-end">
                          {invoice.shipping === 0
                            ? "FREE"
                            : `₹${invoice.shipping.toFixed(2)}`}
                        </td>
                      </tr>
                      <tr>
                        <td className="text-end">
                          <strong>Tax (5%):</strong>
                        </td>
                        <td className="text-end">₹{invoice.tax.toFixed(2)}</td>
                      </tr>
                      <tr className="table-dark">
                        <td className="text-end">
                          <strong>Total:</strong>
                        </td>
                        <td className="text-end">
                          <strong>₹{invoice.total.toFixed(2)}</strong>
                        </td>
                      </tr>
                    </tbody>
                  </Table>
                </Col>
              </Row>

              {/* Footer */}
              <Row>
                <Col lg={12} className="text-center">
                  <div className="border-top pt-3">
                    <p className="text-muted mb-1">
                      <strong>
                        Thank you for choosing Hare Krishna Medical!
                      </strong>
                    </p>
                    <small className="text-muted">
                      For any queries, contact us at
                      harekrishnamedical@gmail.com
                    </small>
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
