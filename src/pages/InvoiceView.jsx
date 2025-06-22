import React, { useState, useEffect } from "react";
import { Container, Row, Col, Card, Button, Alert } from "react-bootstrap";
import { useParams, Link, Navigate } from "react-router-dom";
import { useSelector } from "react-redux";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import QRCode from "qrcode";
import ProfessionalInvoice from "../components/common/ProfessionalInvoice.jsx";

const InvoiceView = () => {
  const { orderId } = useParams();
  const { isAuthenticated, user } = useSelector((state) => state.auth);
  const [invoice, setInvoice] = useState(null);
  const [loading, setLoading] = useState(true);
  const [qrCode, setQrCode] = useState("");
  const [showAlert, setShowAlert] = useState(false);

  // Remove authentication check to allow QR verification by anyone
  // Anyone can verify invoice by scanning QR without login

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

      // Generate QR code for this specific invoice
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
      // Create invoice data for the professional component
      const invoiceData = {
        invoiceId: invoice.invoiceId,
        orderId: invoice.orderId,
        orderDate: invoice.orderDate,
        orderTime: invoice.orderTime,
        customerDetails: {
          fullName: invoice.customerDetails.fullName,
          email: invoice.customerDetails.email,
          mobile: invoice.customerDetails.mobile,
          address: invoice.customerDetails.address,
          city: invoice.customerDetails.city,
          state: invoice.customerDetails.state,
          pincode: invoice.customerDetails.pincode,
        },
        items: invoice.items,
        subtotal: invoice.subtotal,
        shipping: invoice.shipping,
        tax: invoice.tax,
        total: invoice.total,
        paymentMethod: invoice.paymentMethod,
        paymentStatus: invoice.paymentStatus,
        status: invoice.status,
        qrCode: qrCode, // Use the generated QR code
      };

      // Create a temporary div and render the professional invoice
      const invoiceElement = document.createElement("div");
      invoiceElement.style.position = "absolute";
      invoiceElement.style.left = "-9999px";
      invoiceElement.style.top = "0";
      invoiceElement.style.width = "210mm";
      invoiceElement.style.backgroundColor = "white";
      document.body.appendChild(invoiceElement);

      // Create React element and render it
      const React = await import("react");
      const { createRoot } = await import("react-dom/client");

      const root = createRoot(invoiceElement);
      root.render(
        React.createElement(ProfessionalInvoice, {
          invoiceData,
          qrCode: qrCode,
          forPrint: true,
        }),
      );

      // Wait for rendering
      await new Promise((resolve) => setTimeout(resolve, 1500));

      // Generate PDF with high quality
      const canvas = await html2canvas(invoiceElement, {
        scale: 2.5,
        logging: false,
        useCORS: true,
        backgroundColor: "#ffffff",
        width: invoiceElement.scrollWidth,
        height: invoiceElement.scrollHeight,
      });

      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF("p", "mm", "a4");
      const imgWidth = 210;
      const pageHeight = 297;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;

      // Always ensure single page - scale down if necessary
      if (imgHeight > pageHeight) {
        const scaleFactor = (pageHeight - 5) / imgHeight;
        const scaledWidth = imgWidth * scaleFactor;
        const scaledHeight = pageHeight - 5;
        const xOffset = (imgWidth - scaledWidth) / 2;
        pdf.addImage(imgData, "PNG", xOffset, 2.5, scaledWidth, scaledHeight);
      } else {
        const yOffset = (pageHeight - imgHeight) / 2;
        pdf.addImage(imgData, "PNG", 0, yOffset, imgWidth, imgHeight);
      }

      // Create a temporary link and click it to download directly
      const pdfBlob = pdf.output("blob");
      const url = URL.createObjectURL(pdfBlob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `Official_Invoice_${invoice.invoiceId}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      // Clean up
      root.unmount();
      document.body.removeChild(invoiceElement);

      setShowAlert(true);
      setTimeout(() => setShowAlert(false), 3000);
    } catch (error) {
      console.error("Error generating PDF:", error);
      alert("Error generating PDF. Please try again.");
    }
  };

  // Create the same colorful invoice HTML as in Order.jsx
  const createColorfulInvoiceHTML = () => {
    if (!invoice) return "";

    return `
      <div style="font-family: Arial, sans-serif; padding: 20px; background: white; max-width: 210mm; margin: 0 auto;">
        <!-- Header Section - Colorful Design -->
        <div style="background: linear-gradient(135deg, #ff6b6b 0%, #e74c3c 100%); color: white; padding: 25px; border-radius: 15px 15px 0 0; margin-bottom: 0;">
          <div style="display: flex; justify-content: space-between; align-items: center;">
            <!-- Left Side - Company Info -->
            <div style="flex: 1;">
              <div style="display: flex; align-items: center; margin-bottom: 15px;">
                <img src="https://cdn.builder.io/api/v1/assets/ec4b3f82f1ac4275b8bfc1756fcac420/invoice_hkm12345678-1-e0e726" alt="Logo" style="height: 70px; width: auto; margin-right: 20px; background: white; padding: 10px; border-radius: 10px;" onerror="this.src='https://via.placeholder.com/70x70?text=HKM';" />
                <div>
                  <h1 style="font-size: 28px; font-weight: bold; margin: 0; line-height: 1.2; text-shadow: 2px 2px 4px rgba(0,0,0,0.3);">HARE KRISHNA MEDICAL</h1>
                  <p style="font-size: 14px; margin: 5px 0; opacity: 0.9;">Your Trusted Health Partner</p>
                </div>
              </div>
              <div style="font-size: 12px; line-height: 1.6; opacity: 0.95;">
                <div>📍 3 Sahyog Complex, Man Sarovar circle</div>
                <div>🏙️ Amroli, 394107, Gujarat, India</div>
                <div>📞 +91 76989 13354 | +91 91060 18508</div>
                <div>📧 harekrishnamedical@gmail.com</div>
              </div>
            </div>
            <!-- Right Side - Invoice Info -->
            <div style="text-align: right; min-width: 250px;">
              <h1 style="font-size: 42px; font-weight: bold; margin: 0 0 20px 0; text-shadow: 3px 3px 6px rgba(0,0,0,0.3);">INVOICE</h1>
              <div style="background: rgba(255,255,255,0.95); color: #333; padding: 20px; border-radius: 10px; font-size: 13px; text-align: left; box-shadow: 0 4px 8px rgba(0,0,0,0.2);">
                <div style="margin-bottom: 8px;"><strong style="color: #e74c3c;">Invoice No:</strong> ${invoice.invoiceId}</div>
                <div style="margin-bottom: 8px;"><strong style="color: #e74c3c;">Order No:</strong> ${invoice.orderId}</div>
                <div style="margin-bottom: 8px;"><strong style="color: #e74c3c;">Date:</strong> ${invoice.orderDate}</div>
                <div style="margin-bottom: 8px;"><strong style="color: #e74c3c;">Time:</strong> ${invoice.orderTime}</div>
                <div><strong style="color: #e74c3c;">Status:</strong> <span style="background: #27ae60; color: white; padding: 3px 8px; border-radius: 12px; font-size: 11px;">Delivered</span></div>
              </div>
            </div>
          </div>
        </div>

        <!-- Customer Information Section - Colorful -->
        <div style="display: flex; gap: 20px; margin-bottom: 25px; margin-top: 0;">
          <!-- Bill To - Blue Theme -->
          <div style="flex: 1; background: linear-gradient(135deg, #3498db 0%, #2980b9 100%); color: white; padding: 20px; border-radius: 0 0 0 15px;">
            <h3 style="font-size: 16px; font-weight: bold; margin: 0 0 15px 0; text-transform: uppercase; text-shadow: 1px 1px 2px rgba(0,0,0,0.3);">📍 BILL TO:</h3>
            <div style="font-size: 13px; line-height: 1.8;">
              <div style="font-weight: bold; margin-bottom: 8px; font-size: 15px;">${invoice.customerDetails.fullName}</div>
              <div>📧 ${invoice.customerDetails.email}</div>
              <div>📱 ${invoice.customerDetails.mobile}</div>
              <div>🏠 ${invoice.customerDetails.address}</div>
              <div>🏙️ ${invoice.customerDetails.city}, ${invoice.customerDetails.state} ${invoice.customerDetails.pincode}</div>
            </div>
          </div>
          <!-- Ship To - Green Theme -->
          <div style="flex: 1; background: linear-gradient(135deg, #27ae60 0%, #229954 100%); color: white; padding: 20px; border-radius: 0 0 15px 0;">
            <h3 style="font-size: 16px; font-weight: bold; margin: 0 0 15px 0; text-transform: uppercase; text-shadow: 1px 1px 2px rgba(0,0,0,0.3);">🚚 SHIP TO:</h3>
            <div style="font-size: 13px; line-height: 1.8;">
              <div style="font-weight: bold; margin-bottom: 8px; font-size: 15px;">${invoice.customerDetails.fullName}</div>
              <div>🏠 ${invoice.customerDetails.address}</div>
              <div>🏙️ ${invoice.customerDetails.city}, ${invoice.customerDetails.state} ${invoice.customerDetails.pincode}</div>
              <div style="margin-top: 12px;"><strong>💳 Payment:</strong> ${invoice.paymentMethod}</div>
              <div><strong>✅ Status:</strong> <span style="background: rgba(255,255,255,0.2); padding: 2px 6px; border-radius: 8px;">${invoice.paymentStatus}</span></div>
            </div>
          </div>
        </div>

        <!-- Items Table - Colorful Design -->
        <div style="margin-bottom: 25px;">
          <div style="background: linear-gradient(135deg, #9b59b6 0%, #8e44ad 100%); color: white; padding: 15px 25px; font-size: 18px; font-weight: bold; text-align: center; text-shadow: 1px 1px 2px rgba(0,0,0,0.3);">🛒 ORDERED ITEMS</div>
          <table style="width: 100%; border-collapse: collapse; border: 3px solid #9b59b6;">
            <thead>
              <tr style="background: linear-gradient(135deg, #f39c12 0%, #e67e22 100%); color: white;">
                <th style="border: 2px solid #e67e22; padding: 15px 10px; font-size: 13px; font-weight: bold; text-align: center; text-shadow: 1px 1px 2px rgba(0,0,0,0.3);">S.No</th>
                <th style="border: 2px solid #e67e22; padding: 15px 10px; font-size: 13px; font-weight: bold; text-align: left; text-shadow: 1px 1px 2px rgba(0,0,0,0.3);">🏥 Description</th>
                <th style="border: 2px solid #e67e22; padding: 15px 10px; font-size: 13px; font-weight: bold; text-align: center; text-shadow: 1px 1px 2px rgba(0,0,0,0.3);">Qty</th>
                <th style="border: 2px solid #e67e22; padding: 15px 10px; font-size: 13px; font-weight: bold; text-align: right; text-shadow: 1px 1px 2px rgba(0,0,0,0.3);">💰 Price (₹)</th>
                <th style="border: 2px solid #e67e22; padding: 15px 10px; font-size: 13px; font-weight: bold; text-align: right; text-shadow: 1px 1px 2px rgba(0,0,0,0.3);">💵 Amount (₹)</th>
              </tr>
            </thead>
            <tbody>
              ${invoice.items
                .map(
                  (item, index) => `
                <tr style="background-color: ${index % 2 === 0 ? "#f8f9fa" : "white"};">
                  <td style="border: 1px solid #ddd; padding: 12px 8px; font-size: 12px; text-align: center; font-weight: bold; color: #9b59b6;">${index + 1}</td>
                  <td style="border: 1px solid #ddd; padding: 12px 8px; font-size: 12px;">
                    <div style="font-weight: bold; color: #2c3e50; margin-bottom: 4px;">${item.name}</div>
                    <div style="color: #7f8c8d; font-size: 11px; font-style: italic;">🏢 ${item.company || "Medical Product"}</div>
                  </td>
                  <td style="border: 1px solid #ddd; padding: 12px 8px; font-size: 12px; text-align: center;">
                    <span style="background: #3498db; color: white; padding: 4px 8px; border-radius: 12px; font-size: 11px; font-weight: bold;">${item.quantity}</span>
                  </td>
                  <td style="border: 1px solid #ddd; padding: 12px 8px; font-size: 12px; text-align: right; color: #27ae60; font-weight: bold;">₹${item.price.toFixed(2)}</td>
                  <td style="border: 1px solid #ddd; padding: 12px 8px; font-size: 13px; text-align: right; font-weight: bold; color: #e74c3c;">₹${(item.price * item.quantity).toFixed(2)}</td>
                </tr>
              `,
                )
                .join("")}
            </tbody>
          </table>
        </div>

        <!-- Totals Section - Colorful -->
        <div style="display: flex; justify-content: flex-end; margin-bottom: 25px;">
          <div style="min-width: 350px;">
            <table style="width: 100%; border-collapse: collapse; border: 3px solid #e74c3c; border-radius: 10px; overflow: hidden;">
              <tbody>
                <tr>
                  <td style="background: linear-gradient(135deg, #ecf0f1 0%, #bdc3c7 100%); border: 1px solid #bdc3c7; padding: 12px 15px; font-size: 13px; font-weight: bold; color: #2c3e50;">📊 Subtotal:</td>
                  <td style="background: #ecf0f1; border: 1px solid #bdc3c7; padding: 12px 15px; font-size: 13px; text-align: right; color: #2c3e50; font-weight: bold;">₹${invoice.subtotal.toFixed(2)}</td>
                </tr>
                <tr>
                  <td style="background: linear-gradient(135deg, #d5f4e6 0%, #a2d9ce 100%); border: 1px solid #a2d9ce; padding: 12px 15px; font-size: 13px; font-weight: bold; color: #27ae60;">🚚 Shipping:</td>
                  <td style="background: #d5f4e6; border: 1px solid #a2d9ce; padding: 12px 15px; font-size: 13px; text-align: right; color: #27ae60; font-weight: bold;">${invoice.shipping === 0 ? "FREE 🎉" : `₹${invoice.shipping.toFixed(2)}`}</td>
                </tr>
                <tr>
                  <td style="background: linear-gradient(135deg, #fdeaa7 0%, #f39c12 100%); border: 1px solid #f39c12; padding: 12px 15px; font-size: 13px; font-weight: bold; color: #f39c12;">📋 Tax (5%):</td>
                  <td style="background: #fdeaa7; border: 1px solid #f39c12; padding: 12px 15px; font-size: 13px; text-align: right; color: #f39c12; font-weight: bold;">₹${invoice.tax.toFixed(2)}</td>
                </tr>
                <tr>
                  <td style="background: linear-gradient(135deg, #e74c3c 0%, #c0392b 100%); border: 3px solid #c0392b; padding: 18px 15px; font-size: 16px; font-weight: bold; color: #fff; text-shadow: 1px 1px 2px rgba(0,0,0,0.3);">💎 TOTAL:</td>
                  <td style="background: linear-gradient(135deg, #e74c3c 0%, #c0392b 100%); border: 3px solid #c0392b; padding: 18px 15px; font-size: 18px; text-align: right; font-weight: bold; color: #fff; text-shadow: 1px 1px 2px rgba(0,0,0,0.3);">₹${invoice.total.toFixed(2)}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <!-- Footer Section - Colorful -->
        <div style="background: linear-gradient(135deg, #34495e 0%, #2c3e50 100%); color: white; padding: 25px; border-radius: 15px; margin-bottom: 20px;">
          <div style="display: flex; justify-content: space-between; align-items: center;">
            <div style="flex: 1;">
              <h4 style="font-size: 18px; font-weight: bold; margin: 0 0 15px 0; text-shadow: 1px 1px 2px rgba(0,0,0,0.3);">🙏 Thank You for Your Business! 🙏</h4>
              <div style="font-size: 12px; line-height: 1.8;">
                <div style="margin-bottom: 10px;"><strong style="color: #f39c12;">📋 Terms & Conditions:</strong></div>
                <div>✅ Payment due within 30 days</div>
                <div>❌ Goods once sold will not be taken back</div>
                <div>⚖️ Subject to Gujarat jurisdiction only</div>
                <div style="margin-top: 12px;"><strong style="color: #3498db;">📞 Contact:</strong> harekrishnamedical@gmail.com | +91 76989 13354</div>
              </div>
            </div>
            <div style="text-align: center; margin-left: 25px;">
              ${qrCode ? `<img src="${qrCode}" alt="QR Code" style="width: 90px; height: 90px; border: 3px solid #3498db; border-radius: 10px; padding: 5px; background: white;" />` : '<div style="width: 90px; height: 90px; border: 3px solid #3498db; border-radius: 10px; padding: 5px; background: white; display: flex; align-items: center; justify-content: center; color: #333; font-weight: bold;">QR CODE</div>'}
              <div style="font-size: 11px; margin-top: 8px; color: #ecf0f1;">📱 Scan for Online Verification</div>
            </div>
          </div>
        </div>

        <!-- Computer Generated Note -->
        <div style="text-align: center; margin-top: 25px; font-size: 11px; color: #7f8c8d; background: #ecf0f1; padding: 12px; border-radius: 8px; border: 1px solid #bdc3c7;">
          🖥️ This is a computer generated invoice. No physical signature required.<br />
          📅 Generated on: ${new Date().toLocaleString()}
        </div>
      </div>
    `;
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
    <div className="fade-in" data-page="invoice">
      {/* Hero Section */}
      <section
        style={{
          background: "linear-gradient(135deg, #e63946 0%, #dc3545 100%)",
          paddingTop: "80px",
          paddingBottom: "80px",
          color: "white",
        }}
      >
        <Container>
          <Row className="text-center">
            <Col lg={12}>
              <h1
                style={{
                  fontSize: "3rem",
                  fontWeight: "800",
                  marginBottom: "20px",
                  textShadow: "2px 2px 4px rgba(0,0,0,0.3)",
                }}
              >
                Invoice Details
              </h1>
              <p
                style={{
                  fontSize: "1.2rem",
                  opacity: "0.9",
                  maxWidth: "600px",
                  margin: "0 auto",
                }}
              >
                Your complete invoice and order information
              </p>
            </Col>
          </Row>
        </Container>
      </section>

      {/* Invoice Content */}
      <section
        style={{
          background: "#f8f9fa",
          paddingTop: "80px",
          paddingBottom: "80px",
        }}
      >
        <Container>
          {showAlert && (
            <Alert variant="success" className="mb-4">
              <i className="bi bi-check-circle me-2"></i>
              PDF downloaded successfully!
            </Alert>
          )}

          {/* Action Buttons */}
          <Row className="mb-4">
            <Col lg={12} className="text-center">
              <div className="d-flex gap-3 justify-content-center flex-wrap">
                <Button
                  onClick={downloadPDF}
                  className="btn-medical-primary"
                  size="lg"
                  disabled={!invoice}
                >
                  <i className="bi bi-download me-2"></i>
                  Download PDF
                </Button>
                <Button
                  onClick={() => window.print()}
                  variant="outline-primary"
                  className="btn-medical-outline"
                  size="lg"
                >
                  <i className="bi bi-printer me-2"></i>
                  Print Invoice
                </Button>
                <Button
                  as={Link}
                  to="/user/invoices"
                  variant="outline-secondary"
                  className="btn-medical-outline"
                  size="lg"
                >
                  <i className="bi bi-arrow-left me-2"></i>
                  Back to Invoices
                </Button>
              </div>
            </Col>
          </Row>

          {/* Professional Invoice Display - Same style as Order.jsx */}
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
                  <div
                    id="invoice-content"
                    dangerouslySetInnerHTML={{
                      __html: createColorfulInvoiceHTML(),
                    }}
                  />
                </Card.Body>
              </Card>
            </Col>
          </Row>

          {/* QR Code Display */}
          {qrCode && (
            <Row className="mt-4">
              <Col lg={12} className="text-center">
                <Card
                  style={{
                    border: "none",
                    borderRadius: "16px",
                    boxShadow: "0 8px 32px rgba(0,0,0,0.08)",
                    padding: "30px",
                  }}
                >
                  <h5 style={{ color: "#e63946", marginBottom: "20px" }}>
                    📱 Invoice Verification QR Code
                  </h5>
                  <img
                    src={qrCode}
                    alt="Invoice QR Code"
                    style={{
                      width: "200px",
                      height: "200px",
                      border: "3px solid #e63946",
                      borderRadius: "15px",
                      padding: "10px",
                      background: "white",
                    }}
                  />
                  <p style={{ color: "#6c757d", marginTop: "15px" }}>
                    Scan this QR code to verify invoice authenticity
                  </p>
                </Card>
              </Col>
            </Row>
          )}
        </Container>
      </section>

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

          @page {
            margin: 0;
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
