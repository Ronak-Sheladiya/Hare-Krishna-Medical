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

            {/* Colorful Invoice Content - Exact PDF Design */}
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
              {/* Header Section - Colorful Design */}
              <div
                style={{
                  background:
                    "linear-gradient(135deg, #ff6b6b 0%, #e74c3c 100%)",
                  color: "white",
                  padding: "25px",
                  borderRadius: "15px 15px 0 0",
                  marginBottom: "0",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
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
                          height: "70px",
                          width: "auto",
                          marginRight: "20px",
                          backgroundColor: "white",
                          padding: "10px",
                          borderRadius: "10px",
                        }}
                        onError={(e) => {
                          e.target.src =
                            "https://cdn.builder.io/api/v1/assets/ec4b3f82f1ac4275b8bfc1756fcac420/medical_logo-e586be?format=webp&width=800";
                        }}
                      />
                      <div>
                        <h1
                          style={{
                            fontSize: "28px",
                            fontWeight: "bold",
                            margin: "0",
                            lineHeight: "1.2",
                            textShadow: "2px 2px 4px rgba(0,0,0,0.3)",
                          }}
                        >
                          HARE KRISHNA MEDICAL
                        </h1>
                        <p
                          style={{
                            fontSize: "14px",
                            margin: "5px 0",
                            opacity: "0.9",
                          }}
                        >
                          Your Trusted Health Partner
                        </p>
                      </div>
                    </div>
                    <div
                      style={{
                        fontSize: "12px",
                        lineHeight: "1.6",
                        opacity: "0.95",
                      }}
                    >
                      <div>📍 3 Sahyog Complex, Man Sarovar circle</div>
                      <div>🏙️ Amroli, 394107, Gujarat, India</div>
                      <div>📞 +91 76989 13354 | +91 91060 18508</div>
                      <div>📧 harekrishnamedical@gmail.com</div>
                    </div>
                  </div>

                  {/* Right Side - Invoice Info */}
                  <div style={{ textAlign: "right", minWidth: "250px" }}>
                    <h1
                      style={{
                        fontSize: "42px",
                        fontWeight: "bold",
                        margin: "0 0 20px 0",
                        textShadow: "3px 3px 6px rgba(0,0,0,0.3)",
                      }}
                    >
                      INVOICE
                    </h1>
                    <div
                      style={{
                        backgroundColor: "rgba(255,255,255,0.95)",
                        color: "#333",
                        padding: "20px",
                        borderRadius: "10px",
                        fontSize: "13px",
                        textAlign: "left",
                        boxShadow: "0 4px 8px rgba(0,0,0,0.2)",
                      }}
                    >
                      <div style={{ marginBottom: "8px" }}>
                        <strong style={{ color: "#e74c3c" }}>
                          Invoice No:
                        </strong>{" "}
                        {invoice.invoiceId}
                      </div>
                      <div style={{ marginBottom: "8px" }}>
                        <strong style={{ color: "#e74c3c" }}>Order No:</strong>{" "}
                        {invoice.orderId}
                      </div>
                      <div style={{ marginBottom: "8px" }}>
                        <strong style={{ color: "#e74c3c" }}>Date:</strong>{" "}
                        {invoice.orderDate}
                      </div>
                      <div style={{ marginBottom: "8px" }}>
                        <strong style={{ color: "#e74c3c" }}>Time:</strong>{" "}
                        {invoice.orderTime}
                      </div>
                      <div>
                        <strong style={{ color: "#e74c3c" }}>Status:</strong>{" "}
                        <span
                          style={{
                            background: "#27ae60",
                            color: "white",
                            padding: "3px 8px",
                            borderRadius: "12px",
                            fontSize: "11px",
                          }}
                        >
                          {invoice.status}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Customer Information Section - Colorful */}
              <div
                style={{
                  display: "flex",
                  gap: "20px",
                  marginBottom: "25px",
                  marginTop: "0",
                }}
              >
                {/* Bill To - Blue Theme */}
                <div
                  style={{
                    flex: "1",
                    background:
                      "linear-gradient(135deg, #3498db 0%, #2980b9 100%)",
                    color: "white",
                    padding: "20px",
                    borderRadius: "0 0 0 15px",
                  }}
                >
                  <h3
                    style={{
                      fontSize: "16px",
                      fontWeight: "bold",
                      margin: "0 0 15px 0",
                      textTransform: "uppercase",
                      textShadow: "1px 1px 2px rgba(0,0,0,0.3)",
                    }}
                  >
                    📍 BILL TO:
                  </h3>
                  <div style={{ fontSize: "13px", lineHeight: "1.8" }}>
                    <div
                      style={{
                        fontWeight: "bold",
                        marginBottom: "8px",
                        fontSize: "15px",
                      }}
                    >
                      {invoice.customerDetails.fullName}
                    </div>
                    <div>📧 {invoice.customerDetails.email}</div>
                    <div>📱 {invoice.customerDetails.mobile}</div>
                    <div>🏠 {invoice.customerDetails.address}</div>
                    <div>
                      🏙️ {invoice.customerDetails.city},{" "}
                      {invoice.customerDetails.state}{" "}
                      {invoice.customerDetails.pincode}
                    </div>
                  </div>
                </div>

                {/* Ship To - Green Theme */}
                <div
                  style={{
                    flex: "1",
                    background:
                      "linear-gradient(135deg, #27ae60 0%, #229954 100%)",
                    color: "white",
                    padding: "20px",
                    borderRadius: "0 0 15px 0",
                  }}
                >
                  <h3
                    style={{
                      fontSize: "16px",
                      fontWeight: "bold",
                      margin: "0 0 15px 0",
                      textTransform: "uppercase",
                      textShadow: "1px 1px 2px rgba(0,0,0,0.3)",
                    }}
                  >
                    🚚 SHIP TO:
                  </h3>
                  <div style={{ fontSize: "13px", lineHeight: "1.8" }}>
                    <div
                      style={{
                        fontWeight: "bold",
                        marginBottom: "8px",
                        fontSize: "15px",
                      }}
                    >
                      {invoice.customerDetails.fullName}
                    </div>
                    <div>🏠 {invoice.customerDetails.address}</div>
                    <div>
                      🏙️ {invoice.customerDetails.city},{" "}
                      {invoice.customerDetails.state}{" "}
                      {invoice.customerDetails.pincode}
                    </div>
                    <div style={{ marginTop: "12px" }}>
                      <strong>💳 Payment:</strong> {invoice.paymentMethod}
                    </div>
                    <div>
                      <strong>✅ Status:</strong>{" "}
                      <span
                        style={{
                          background: "rgba(255,255,255,0.2)",
                          padding: "2px 6px",
                          borderRadius: "8px",
                        }}
                      >
                        {invoice.paymentStatus}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Items Table - Colorful Design */}
              <div style={{ marginBottom: "25px" }}>
                <div
                  style={{
                    background:
                      "linear-gradient(135deg, #9b59b6 0%, #8e44ad 100%)",
                    color: "white",
                    padding: "15px 25px",
                    fontSize: "18px",
                    fontWeight: "bold",
                    textAlign: "center",
                    textShadow: "1px 1px 2px rgba(0,0,0,0.3)",
                  }}
                >
                  🛒 ORDERED ITEMS
                </div>
                <table
                  style={{
                    width: "100%",
                    borderCollapse: "collapse",
                    border: "3px solid #9b59b6",
                  }}
                >
                  <thead>
                    <tr
                      style={{
                        background:
                          "linear-gradient(135deg, #f39c12 0%, #e67e22 100%)",
                        color: "white",
                      }}
                    >
                      <th
                        style={{
                          border: "2px solid #e67e22",
                          padding: "15px 10px",
                          fontSize: "13px",
                          fontWeight: "bold",
                          textAlign: "center",
                          textShadow: "1px 1px 2px rgba(0,0,0,0.3)",
                        }}
                      >
                        S.No
                      </th>
                      <th
                        style={{
                          border: "2px solid #e67e22",
                          padding: "15px 10px",
                          fontSize: "13px",
                          fontWeight: "bold",
                          textAlign: "left",
                          textShadow: "1px 1px 2px rgba(0,0,0,0.3)",
                        }}
                      >
                        🏥 Description
                      </th>
                      <th
                        style={{
                          border: "2px solid #e67e22",
                          padding: "15px 10px",
                          fontSize: "13px",
                          fontWeight: "bold",
                          textAlign: "center",
                          textShadow: "1px 1px 2px rgba(0,0,0,0.3)",
                        }}
                      >
                        Qty
                      </th>
                      <th
                        style={{
                          border: "2px solid #e67e22",
                          padding: "15px 10px",
                          fontSize: "13px",
                          fontWeight: "bold",
                          textAlign: "right",
                          textShadow: "1px 1px 2px rgba(0,0,0,0.3)",
                        }}
                      >
                        💰 Price (₹)
                      </th>
                      <th
                        style={{
                          border: "2px solid #e67e22",
                          padding: "15px 10px",
                          fontSize: "13px",
                          fontWeight: "bold",
                          textAlign: "right",
                          textShadow: "1px 1px 2px rgba(0,0,0,0.3)",
                        }}
                      >
                        💵 Amount (₹)
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {invoice.items.map((item, index) => (
                      <tr
                        key={item.id}
                        style={{
                          backgroundColor:
                            index % 2 === 0 ? "#f8f9fa" : "white",
                        }}
                      >
                        <td
                          style={{
                            border: "1px solid #ddd",
                            padding: "12px 8px",
                            fontSize: "12px",
                            textAlign: "center",
                            fontWeight: "bold",
                            color: "#9b59b6",
                          }}
                        >
                          {index + 1}
                        </td>
                        <td
                          style={{
                            border: "1px solid #ddd",
                            padding: "12px 8px",
                            fontSize: "12px",
                          }}
                        >
                          <div
                            style={{
                              fontWeight: "bold",
                              color: "#2c3e50",
                              marginBottom: "4px",
                            }}
                          >
                            {item.name}
                          </div>
                          <div
                            style={{
                              color: "#7f8c8d",
                              fontSize: "11px",
                              fontStyle: "italic",
                            }}
                          >
                            🏢 {item.company}
                          </div>
                        </td>
                        <td
                          style={{
                            border: "1px solid #ddd",
                            padding: "12px 8px",
                            fontSize: "12px",
                            textAlign: "center",
                          }}
                        >
                          <span
                            style={{
                              background: "#3498db",
                              color: "white",
                              padding: "4px 8px",
                              borderRadius: "12px",
                              fontSize: "11px",
                              fontWeight: "bold",
                            }}
                          >
                            {item.quantity}
                          </span>
                        </td>
                        <td
                          style={{
                            border: "1px solid #ddd",
                            padding: "12px 8px",
                            fontSize: "12px",
                            textAlign: "right",
                            color: "#27ae60",
                            fontWeight: "bold",
                          }}
                        >
                          ₹{item.price.toFixed(2)}
                        </td>
                        <td
                          style={{
                            border: "1px solid #ddd",
                            padding: "12px 8px",
                            fontSize: "13px",
                            textAlign: "right",
                            fontWeight: "bold",
                            color: "#e74c3c",
                          }}
                        >
                          ₹{item.total.toFixed(2)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Totals Section - Colorful */}
              <div
                style={{
                  display: "flex",
                  justifyContent: "flex-end",
                  marginBottom: "25px",
                }}
              >
                <div style={{ minWidth: "350px" }}>
                  <table
                    style={{
                      width: "100%",
                      borderCollapse: "collapse",
                      border: "3px solid #e74c3c",
                      borderRadius: "10px",
                      overflow: "hidden",
                    }}
                  >
                    <tbody>
                      <tr>
                        <td
                          style={{
                            background:
                              "linear-gradient(135deg, #ecf0f1 0%, #bdc3c7 100%)",
                            border: "1px solid #bdc3c7",
                            padding: "12px 15px",
                            fontSize: "13px",
                            fontWeight: "bold",
                            color: "#2c3e50",
                          }}
                        >
                          📊 Subtotal:
                        </td>
                        <td
                          style={{
                            background: "#ecf0f1",
                            border: "1px solid #bdc3c7",
                            padding: "12px 15px",
                            fontSize: "13px",
                            textAlign: "right",
                            color: "#2c3e50",
                            fontWeight: "bold",
                          }}
                        >
                          ₹{invoice.subtotal.toFixed(2)}
                        </td>
                      </tr>
                      <tr>
                        <td
                          style={{
                            background:
                              "linear-gradient(135deg, #d5f4e6 0%, #a2d9ce 100%)",
                            border: "1px solid #a2d9ce",
                            padding: "12px 15px",
                            fontSize: "13px",
                            fontWeight: "bold",
                            color: "#27ae60",
                          }}
                        >
                          🚚 Shipping:
                        </td>
                        <td
                          style={{
                            background: "#d5f4e6",
                            border: "1px solid #a2d9ce",
                            padding: "12px 15px",
                            fontSize: "13px",
                            textAlign: "right",
                            color: "#27ae60",
                            fontWeight: "bold",
                          }}
                        >
                          {invoice.shipping === 0
                            ? "FREE 🎉"
                            : `₹${invoice.shipping.toFixed(2)}`}
                        </td>
                      </tr>
                      <tr>
                        <td
                          style={{
                            background:
                              "linear-gradient(135deg, #fdeaa7 0%, #f39c12 100%)",
                            border: "1px solid #f39c12",
                            padding: "12px 15px",
                            fontSize: "13px",
                            fontWeight: "bold",
                            color: "#f39c12",
                          }}
                        >
                          📋 Tax (5%):
                        </td>
                        <td
                          style={{
                            background: "#fdeaa7",
                            border: "1px solid #f39c12",
                            padding: "12px 15px",
                            fontSize: "13px",
                            textAlign: "right",
                            color: "#f39c12",
                            fontWeight: "bold",
                          }}
                        >
                          ₹{invoice.tax.toFixed(2)}
                        </td>
                      </tr>
                      <tr>
                        <td
                          style={{
                            background:
                              "linear-gradient(135deg, #e74c3c 0%, #c0392b 100%)",
                            border: "3px solid #c0392b",
                            padding: "18px 15px",
                            fontSize: "16px",
                            fontWeight: "bold",
                            color: "#fff",
                            textShadow: "1px 1px 2px rgba(0,0,0,0.3)",
                          }}
                        >
                          💎 TOTAL:
                        </td>
                        <td
                          style={{
                            background:
                              "linear-gradient(135deg, #e74c3c 0%, #c0392b 100%)",
                            border: "3px solid #c0392b",
                            padding: "18px 15px",
                            fontSize: "18px",
                            textAlign: "right",
                            fontWeight: "bold",
                            color: "#fff",
                            textShadow: "1px 1px 2px rgba(0,0,0,0.3)",
                          }}
                        >
                          ₹{invoice.total.toFixed(2)}
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Footer Section - Colorful */}
              <div
                style={{
                  background:
                    "linear-gradient(135deg, #34495e 0%, #2c3e50 100%)",
                  color: "white",
                  padding: "25px",
                  borderRadius: "15px",
                  marginBottom: "20px",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <div style={{ flex: "1" }}>
                    <h4
                      style={{
                        fontSize: "18px",
                        fontWeight: "bold",
                        margin: "0 0 15px 0",
                        textShadow: "1px 1px 2px rgba(0,0,0,0.3)",
                      }}
                    >
                      🙏 Thank You for Your Business! 🙏
                    </h4>
                    <div style={{ fontSize: "12px", lineHeight: "1.8" }}>
                      <div style={{ marginBottom: "10px" }}>
                        <strong style={{ color: "#f39c12" }}>
                          📋 Terms & Conditions:
                        </strong>
                      </div>
                      <div>✅ Payment due within 30 days</div>
                      <div>❌ Goods once sold will not be taken back</div>
                      <div>⚖️ Subject to Gujarat jurisdiction only</div>
                      <div style={{ marginTop: "12px" }}>
                        <strong style={{ color: "#3498db" }}>
                          📞 Contact:
                        </strong>{" "}
                        harekrishnamedical@gmail.com | +91 76989 13354
                      </div>
                    </div>
                  </div>

                  {qrCode && (
                    <div style={{ textAlign: "center", marginLeft: "25px" }}>
                      <img
                        src={qrCode}
                        alt="QR Code"
                        style={{
                          width: "90px",
                          height: "90px",
                          border: "3px solid #3498db",
                          borderRadius: "10px",
                          padding: "5px",
                          backgroundColor: "white",
                        }}
                      />
                      <div
                        style={{
                          fontSize: "11px",
                          marginTop: "8px",
                          color: "#ecf0f1",
                        }}
                      >
                        📱 Scan for Online Verification
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Signature Section - Colorful */}
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  marginTop: "30px",
                  fontSize: "13px",
                }}
              >
                <div
                  style={{
                    textAlign: "center",
                    padding: "15px",
                    background:
                      "linear-gradient(135deg, #3498db 0%, #2980b9 100%)",
                    color: "white",
                    borderRadius: "10px",
                    minWidth: "150px",
                  }}
                >
                  <div style={{ marginBottom: "30px", fontWeight: "bold" }}>
                    ✍️ Customer Signature
                  </div>
                  <div
                    style={{
                      borderTop: "2px solid rgba(255,255,255,0.5)",
                      paddingTop: "8px",
                    }}
                  >
                    Sign Here
                  </div>
                </div>
                <div
                  style={{
                    textAlign: "center",
                    padding: "15px",
                    background:
                      "linear-gradient(135deg, #27ae60 0%, #229954 100%)",
                    color: "white",
                    borderRadius: "10px",
                    minWidth: "150px",
                  }}
                >
                  <div style={{ marginBottom: "30px", fontWeight: "bold" }}>
                    🏥 Authorized Signatory
                  </div>
                  <div
                    style={{
                      borderTop: "2px solid rgba(255,255,255,0.5)",
                      paddingTop: "8px",
                    }}
                  >
                    Hare Krishna Medical
                  </div>
                </div>
              </div>

              {/* Computer Generated Note */}
              <div
                style={{
                  textAlign: "center",
                  marginTop: "25px",
                  fontSize: "11px",
                  color: "#7f8c8d",
                  background: "#ecf0f1",
                  padding: "12px",
                  borderRadius: "8px",
                  border: "1px solid #bdc3c7",
                }}
              >
                🖥️ This is a computer generated invoice. No physical signature
                required.
                <br />
                📅 Generated on: {new Date().toLocaleString()}
              </div>
            </div>
          </Card.Body>
        </Card>
      </Container>

      {/* Print-optimized CSS */}
      <style>{`
        @media print {
          .no-print {
            display: none !important;
          }
          
          .medical-header,
          .medical-footer,
          nav,
          .navbar {
            display: none !important;
          }
          
          .container {
            max-width: 100% !important;
            padding: 0 !important;
            margin: 0 !important;
          }
          
          .card,
          .medical-card {
            box-shadow: none !important;
            border: none !important;
          }
          
          body {
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
            color-adjust: exact !important;
            background: white !important;
          }
          
          .invoice-section {
            page-break-inside: avoid;
          }
          
          @page {
            margin: 0.5in;
            size: A4;
          }

          * {
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
            color-adjust: exact !important;
          }
        }
      `}</style>
    </div>
  );
};

export default InvoiceView;
