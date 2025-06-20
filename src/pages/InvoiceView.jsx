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
        scale: 3,
        logging: false,
        useCORS: true,
        backgroundColor: "#ffffff",
        width: element.scrollWidth,
        height: element.scrollHeight,
      });

      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF("p", "mm", "a4");
      const imgWidth = 210;
      const pageHeight = 297;
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
          <Card.Body className="p-0">
            <div className="d-flex justify-content-between align-items-center mb-4 no-print p-4">
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

            {/* Invoice Content - Exact PDF Design */}
            <div
              id="invoice-content"
              className="invoice-section p-4"
              style={{
                backgroundColor: "#ffffff",
                fontFamily: "Arial, sans-serif",
                maxWidth: "210mm",
                margin: "0 auto",
              }}
            >
              {/* Header Section - Exact PDF Layout */}
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "flex-start",
                  marginBottom: "30px",
                  borderBottom: "2px solid #000",
                  paddingBottom: "20px",
                }}
              >
                {/* Left Side - Company Info */}
                <div style={{ flex: "1" }}>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      marginBottom: "15px",
                    }}
                  >
                    <img
                      src="https://cdn.builder.io/api/v1/assets/ec4b3f82f1ac4275b8bfc1756fcac420/invoice_hkm12345678-1-e0e726"
                      alt="Hare Krishna Medical Logo"
                      style={{
                        height: "60px",
                        width: "auto",
                        marginRight: "15px",
                      }}
                      onError={(e) => {
                        e.target.src =
                          "https://cdn.builder.io/api/v1/assets/ec4b3f82f1ac4275b8bfc1756fcac420/medical_logo-e586be?format=webp&width=800";
                      }}
                    />
                    <div>
                      <h1
                        style={{
                          fontSize: "24px",
                          fontWeight: "bold",
                          color: "#000",
                          margin: "0",
                          lineHeight: "1.2",
                        }}
                      >
                        HARE KRISHNA MEDICAL
                      </h1>
                      <p
                        style={{
                          fontSize: "12px",
                          color: "#666",
                          margin: "2px 0",
                        }}
                      >
                        Your Trusted Health Partner
                      </p>
                    </div>
                  </div>
                  <div
                    style={{
                      fontSize: "11px",
                      color: "#000",
                      lineHeight: "1.4",
                    }}
                  >
                    <div>3 Sahyog Complex, Man Sarovar circle</div>
                    <div>Amroli, 394107, Gujarat, India</div>
                    <div>Phone: +91 76989 13354 | +91 91060 18508</div>
                    <div>Email: harekrishnamedical@gmail.com</div>
                  </div>
                </div>

                {/* Right Side - Invoice Info */}
                <div style={{ textAlign: "right", minWidth: "200px" }}>
                  <h1
                    style={{
                      fontSize: "36px",
                      fontWeight: "bold",
                      color: "#000",
                      margin: "0 0 15px 0",
                    }}
                  >
                    INVOICE
                  </h1>
                  <div
                    style={{
                      backgroundColor: "#f5f5f5",
                      border: "1px solid #000",
                      padding: "15px",
                      fontSize: "12px",
                      textAlign: "left",
                    }}
                  >
                    <div style={{ marginBottom: "5px" }}>
                      <strong>Invoice No:</strong> {invoice.invoiceId}
                    </div>
                    <div style={{ marginBottom: "5px" }}>
                      <strong>Order No:</strong> {invoice.orderId}
                    </div>
                    <div style={{ marginBottom: "5px" }}>
                      <strong>Date:</strong> {invoice.orderDate}
                    </div>
                    <div style={{ marginBottom: "5px" }}>
                      <strong>Time:</strong> {invoice.orderTime}
                    </div>
                    <div>
                      <strong>Status:</strong> {invoice.status}
                    </div>
                  </div>
                </div>
              </div>

              {/* Bill To and Ship To Section */}
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  marginBottom: "30px",
                  gap: "30px",
                }}
              >
                {/* Bill To */}
                <div
                  style={{
                    flex: "1",
                    border: "1px solid #000",
                    padding: "15px",
                  }}
                >
                  <h3
                    style={{
                      fontSize: "14px",
                      fontWeight: "bold",
                      margin: "0 0 10px 0",
                      textTransform: "uppercase",
                    }}
                  >
                    BILL TO:
                  </h3>
                  <div style={{ fontSize: "12px", lineHeight: "1.5" }}>
                    <div style={{ fontWeight: "bold", marginBottom: "5px" }}>
                      {invoice.customerDetails.fullName}
                    </div>
                    <div>{invoice.customerDetails.email}</div>
                    <div>{invoice.customerDetails.mobile}</div>
                    <div>{invoice.customerDetails.address}</div>
                    <div>
                      {invoice.customerDetails.city},{" "}
                      {invoice.customerDetails.state}{" "}
                      {invoice.customerDetails.pincode}
                    </div>
                  </div>
                </div>

                {/* Ship To */}
                <div
                  style={{
                    flex: "1",
                    border: "1px solid #000",
                    padding: "15px",
                  }}
                >
                  <h3
                    style={{
                      fontSize: "14px",
                      fontWeight: "bold",
                      margin: "0 0 10px 0",
                      textTransform: "uppercase",
                    }}
                  >
                    SHIP TO:
                  </h3>
                  <div style={{ fontSize: "12px", lineHeight: "1.5" }}>
                    <div style={{ fontWeight: "bold", marginBottom: "5px" }}>
                      {invoice.customerDetails.fullName}
                    </div>
                    <div>{invoice.customerDetails.address}</div>
                    <div>
                      {invoice.customerDetails.city},{" "}
                      {invoice.customerDetails.state}{" "}
                      {invoice.customerDetails.pincode}
                    </div>
                    <div style={{ marginTop: "10px" }}>
                      <strong>Payment Method:</strong> {invoice.paymentMethod}
                    </div>
                    <div>
                      <strong>Payment Status:</strong> {invoice.paymentStatus}
                    </div>
                  </div>
                </div>
              </div>

              {/* Items Table */}
              <div style={{ marginBottom: "30px" }}>
                <table
                  style={{
                    width: "100%",
                    borderCollapse: "collapse",
                    border: "2px solid #000",
                  }}
                >
                  <thead>
                    <tr style={{ backgroundColor: "#f5f5f5" }}>
                      <th
                        style={{
                          border: "1px solid #000",
                          padding: "12px 8px",
                          fontSize: "12px",
                          fontWeight: "bold",
                          textAlign: "left",
                        }}
                      >
                        S.No
                      </th>
                      <th
                        style={{
                          border: "1px solid #000",
                          padding: "12px 8px",
                          fontSize: "12px",
                          fontWeight: "bold",
                          textAlign: "left",
                        }}
                      >
                        Description
                      </th>
                      <th
                        style={{
                          border: "1px solid #000",
                          padding: "12px 8px",
                          fontSize: "12px",
                          fontWeight: "bold",
                          textAlign: "center",
                        }}
                      >
                        Qty
                      </th>
                      <th
                        style={{
                          border: "1px solid #000",
                          padding: "12px 8px",
                          fontSize: "12px",
                          fontWeight: "bold",
                          textAlign: "right",
                        }}
                      >
                        Price (₹)
                      </th>
                      <th
                        style={{
                          border: "1px solid #000",
                          padding: "12px 8px",
                          fontSize: "12px",
                          fontWeight: "bold",
                          textAlign: "right",
                        }}
                      >
                        Amount (₹)
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {invoice.items.map((item, index) => (
                      <tr key={item.id}>
                        <td
                          style={{
                            border: "1px solid #000",
                            padding: "8px",
                            fontSize: "11px",
                            textAlign: "center",
                          }}
                        >
                          {index + 1}
                        </td>
                        <td
                          style={{
                            border: "1px solid #000",
                            padding: "8px",
                            fontSize: "11px",
                          }}
                        >
                          <div style={{ fontWeight: "bold" }}>{item.name}</div>
                          <div style={{ color: "#666", fontSize: "10px" }}>
                            {item.company}
                          </div>
                        </td>
                        <td
                          style={{
                            border: "1px solid #000",
                            padding: "8px",
                            fontSize: "11px",
                            textAlign: "center",
                          }}
                        >
                          {item.quantity}
                        </td>
                        <td
                          style={{
                            border: "1px solid #000",
                            padding: "8px",
                            fontSize: "11px",
                            textAlign: "right",
                          }}
                        >
                          {item.price.toFixed(2)}
                        </td>
                        <td
                          style={{
                            border: "1px solid #000",
                            padding: "8px",
                            fontSize: "11px",
                            textAlign: "right",
                            fontWeight: "bold",
                          }}
                        >
                          {item.total.toFixed(2)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Totals Section */}
              <div
                style={{
                  display: "flex",
                  justifyContent: "flex-end",
                  marginBottom: "30px",
                }}
              >
                <div style={{ minWidth: "300px" }}>
                  <table
                    style={{
                      width: "100%",
                      borderCollapse: "collapse",
                      border: "2px solid #000",
                    }}
                  >
                    <tbody>
                      <tr>
                        <td
                          style={{
                            border: "1px solid #000",
                            padding: "8px 12px",
                            fontSize: "12px",
                            fontWeight: "bold",
                            backgroundColor: "#f5f5f5",
                          }}
                        >
                          Subtotal:
                        </td>
                        <td
                          style={{
                            border: "1px solid #000",
                            padding: "8px 12px",
                            fontSize: "12px",
                            textAlign: "right",
                          }}
                        >
                          ₹{invoice.subtotal.toFixed(2)}
                        </td>
                      </tr>
                      <tr>
                        <td
                          style={{
                            border: "1px solid #000",
                            padding: "8px 12px",
                            fontSize: "12px",
                            fontWeight: "bold",
                            backgroundColor: "#f5f5f5",
                          }}
                        >
                          Shipping:
                        </td>
                        <td
                          style={{
                            border: "1px solid #000",
                            padding: "8px 12px",
                            fontSize: "12px",
                            textAlign: "right",
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
                            border: "1px solid #000",
                            padding: "8px 12px",
                            fontSize: "12px",
                            fontWeight: "bold",
                            backgroundColor: "#f5f5f5",
                          }}
                        >
                          Tax (5%):
                        </td>
                        <td
                          style={{
                            border: "1px solid #000",
                            padding: "8px 12px",
                            fontSize: "12px",
                            textAlign: "right",
                          }}
                        >
                          ₹{invoice.tax.toFixed(2)}
                        </td>
                      </tr>
                      <tr>
                        <td
                          style={{
                            border: "2px solid #000",
                            padding: "12px",
                            fontSize: "14px",
                            fontWeight: "bold",
                            backgroundColor: "#000",
                            color: "#fff",
                          }}
                        >
                          TOTAL:
                        </td>
                        <td
                          style={{
                            border: "2px solid #000",
                            padding: "12px",
                            fontSize: "14px",
                            textAlign: "right",
                            fontWeight: "bold",
                            backgroundColor: "#000",
                            color: "#fff",
                          }}
                        >
                          ₹{invoice.total.toFixed(2)}
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              {/* QR Code and Footer */}
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "flex-end",
                  borderTop: "2px solid #000",
                  paddingTop: "20px",
                }}
              >
                <div style={{ flex: "1" }}>
                  <h4
                    style={{
                      fontSize: "16px",
                      fontWeight: "bold",
                      margin: "0 0 15px 0",
                    }}
                  >
                    Thank You for Your Business!
                  </h4>
                  <div style={{ fontSize: "11px", lineHeight: "1.6" }}>
                    <div>
                      <strong>Terms & Conditions:</strong>
                    </div>
                    <div>• Payment due within 30 days</div>
                    <div>• Goods once sold will not be taken back</div>
                    <div>• Subject to Gujarat jurisdiction only</div>
                    <div style={{ marginTop: "10px" }}>
                      <strong>Contact:</strong> harekrishnamedical@gmail.com |
                      +91 76989 13354
                    </div>
                  </div>
                </div>

                {qrCode && (
                  <div style={{ textAlign: "center", marginLeft: "20px" }}>
                    <img
                      src={qrCode}
                      alt="QR Code"
                      style={{
                        width: "80px",
                        height: "80px",
                        border: "1px solid #000",
                      }}
                    />
                    <div style={{ fontSize: "10px", marginTop: "5px" }}>
                      Scan for Online Verification
                    </div>
                  </div>
                )}
              </div>

              {/* Authorization Section */}
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  marginTop: "40px",
                  fontSize: "12px",
                }}
              >
                <div>
                  <div
                    style={{
                      borderTop: "1px solid #000",
                      paddingTop: "5px",
                      marginTop: "30px",
                    }}
                  >
                    <strong>Customer Signature</strong>
                  </div>
                </div>
                <div style={{ textAlign: "right" }}>
                  <div
                    style={{
                      borderTop: "1px solid #000",
                      paddingTop: "5px",
                      marginTop: "30px",
                    }}
                  >
                    <strong>Authorized Signatory</strong>
                    <br />
                    <small>Hare Krishna Medical</small>
                  </div>
                </div>
              </div>

              {/* Footer Note */}
              <div
                style={{
                  textAlign: "center",
                  marginTop: "20px",
                  fontSize: "10px",
                  color: "#666",
                  borderTop: "1px solid #ccc",
                  paddingTop: "10px",
                }}
              >
                This is a computer generated invoice. No physical signature
                required.
                <br />
                Generated on: {new Date().toLocaleString()}
              </div>
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
            margin: 0 !important;
          }
          
          /* Remove shadows and borders for print */
          .card,
          .medical-card {
            box-shadow: none !important;
            border: none !important;
          }
          
          /* Ensure good contrast for print */
          body {
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
            background: white !important;
          }
          
          /* Page breaks */
          .invoice-section {
            page-break-inside: avoid;
          }
          
          /* Remove margins for full page print */
          @page {
            margin: 0.5in;
            size: A4;
          }

          /* Ensure all text prints in black */
          * {
            color: black !important;
          }
          
          /* Preserve background colors for table headers */
          .invoice-section table th,
          .invoice-section table td {
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
          }
        }
      `}</style>
    </div>
  );
};

export default InvoiceView;
