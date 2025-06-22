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
        backgroundColor: "#ffffff",
        width: element.scrollWidth,
        height: element.scrollHeight,
      });

      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF("p", "mm", "a4");

      // A4 dimensions: 210mm x 297mm
      // Add 20px (about 7mm) margin on all sides
      const pageWidth = 210;
      const pageHeight = 297;
      const margin = 7; // 20px ≈ 7mm
      const contentWidth = pageWidth - margin * 2;
      const contentHeight = pageHeight - margin * 2;

      const imgWidth = contentWidth;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;

      // If content exceeds available height, scale it down to fit
      if (imgHeight > contentHeight) {
        const scaleFactor = contentHeight / imgHeight;
        const scaledWidth = imgWidth * scaleFactor;
        const scaledHeight = contentHeight;
        const xOffset = margin + (contentWidth - scaledWidth) / 2;
        pdf.addImage(
          imgData,
          "PNG",
          xOffset,
          margin,
          scaledWidth,
          scaledHeight,
        );
      } else {
        pdf.addImage(imgData, "PNG", margin, margin, imgWidth, imgHeight);
      }

      // Directly download without showing print dialog
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
      <Container className="my-4">
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

            {/* Professional Invoice Content */}
            <div id="invoice-content">
              <ProfessionalInvoice
                invoiceData={invoice}
                qrCode={qrCode}
                forPrint={false}
              />
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
