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
  Spinner,
} from "react-bootstrap";
import { refreshSession } from "../store/slices/authSlice";
import { api, safeApiCall } from "../utils/apiClient";
import { getDemoInvoice, isDemoInvoice } from "../utils/demoInvoiceData";
import invoiceService from "../services/InvoiceService";
import pdfService from "../services/PDFService";
import "../styles/InvoiceA4.css";

const InvoiceView = () => {
  const { invoiceId } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { isAuthenticated, user } = useSelector((state) => state.auth);
  const [invoice, setInvoice] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [downloading, setDownloading] = useState(false);
  const [qrCode, setQrCode] = useState(null);
  const [pdfUrl, setPdfUrl] = useState(null);
  const [pdfGenerating, setPdfGenerating] = useState(false);

  useEffect(() => {
    dispatch(refreshSession());
  }, [dispatch]);

  useEffect(() => {
    if (invoiceId) {
      fetchInvoiceData();
    }
  }, [invoiceId]);

  // Add Ctrl+P keyboard shortcut to use our custom print function
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === "p") {
        e.preventDefault();
        handlePrint();
      }
    };

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  const fetchInvoiceData = async () => {
    setLoading(true);
    setError("");

    // Check if this is a demo invoice first
    if (isDemoInvoice(invoiceId)) {
      const demoInvoice = getDemoInvoice(invoiceId);
      if (demoInvoice) {
        setInvoice(demoInvoice);
        generateQRCode(invoiceId);

        // Generate PDF for demo invoice too
        setTimeout(() => {
          generateInvoicePDF(demoInvoice);
        }, 1000);

        setLoading(false);
        return;
      }
    }

    // Try to fetch from invoice API first
    let {
      success,
      data,
      error: apiError,
    } = await safeApiCall(() => api.get(`/api/invoices/${invoiceId}`), null);

    if (!success || !data?.data) {
      // Try to fetch by invoice verification endpoint
      const verifyResult = await safeApiCall(
        () => api.get(`/api/invoices/verify/${invoiceId}`),
        null,
      );

      if (verifyResult.success && verifyResult.data?.data) {
        success = true;
        data = verifyResult.data;
      }
    }

    if (success && data?.data) {
      setInvoice(data.data);
      setQrCode(data.data.qrCode);
      if (!data.data.qrCode) {
        generateQRCode(invoiceId);
      }
    } else {
      setError(
        apiError ||
          "Invoice not found. Please check the invoice ID and try again.",
      );
    }

    setLoading(false);
  };

  const generateQRCode = async (invoiceIdParam) => {
    try {
      const qrResult = await invoiceService.generateInvoiceQR(
        invoiceIdParam || invoiceId,
      );
      if (qrResult) {
        setQrCode(qrResult.qrCode);
      }
    } catch (error) {
      console.error("QR generation failed:", error);
    }
  };

  const generateInvoicePDF = async (invoiceData = null) => {
    const dataToUse = invoiceData || invoice;
    if (!dataToUse) return;

    setPdfGenerating(true);
    try {
      const invoiceElement = document.getElementById("invoice-content");
      if (!invoiceElement) {
        throw new Error("Invoice content not found");
      }

      // Create PDF blob instead of downloading
      const result = await pdfService.generateInvoicePDFBlob(
        invoiceElement,
        dataToUse,
        {
          onProgress: (message, progress) => {
            console.log(`PDF Generation: ${message} (${progress}%)`);
          },
        },
      );

      if (result.success && result.blob) {
        // Create object URL for PDF preview
        const pdfObjectUrl = URL.createObjectURL(result.blob);
        setPdfUrl(pdfObjectUrl);
      }
    } catch (error) {
      console.error("PDF generation failed:", error);
    } finally {
      setPdfGenerating(false);
    }
  };

  const handlePrint = () => {
    if (!invoice || !invoiceData) {
      alert("Invoice data is still loading. Please wait and try again.");
      return;
    }

    const invoiceElement = document.getElementById("invoice-content");
    if (!invoiceElement) {
      alert(
        "Invoice content not found. Please wait for the page to load completely.",
      );
      return;
    }

    try {
      // Create a new window for printing
      const printWindow = window.open("", "_blank", "width=800,height=1000");

      if (!printWindow) {
        alert("Please allow pop-ups for this site to enable printing.");
        return;
      }

      // Generate the complete invoice HTML with A4 safe margins
      const invoiceHTML = `
        <!DOCTYPE html>
        <html>
          <head>
            <title>Invoice ${invoiceData.invoiceId}</title>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">
            <link href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.0/font/bootstrap-icons.css" rel="stylesheet">
            <style>
              @page {
                size: A4 portrait;
                margin: 20px;
              }

              body {
                font-family: 'Segoe UI', Arial, sans-serif;
                line-height: 1.4;
                color: #333;
                background: white;
                margin: 0;
                padding: 20px;
                -webkit-print-color-adjust: exact;
                print-color-adjust: exact;
              }

              .invoice-container {
                width: 100%;
                max-width: 210mm;
                min-height: 257mm;
                max-height: 257mm;
                margin: 0 auto;
                background: white;
                overflow: hidden;
                font-size: 11px;
              }

              .invoice-header {
                background: linear-gradient(135deg, #e63946, #dc3545) !important;
                color: white !important;
                padding: 20px !important;
                margin-bottom: 15px !important;
                -webkit-print-color-adjust: exact !important;
                print-color-adjust: exact !important;
              }

              .customer-section, .payment-section {
                background: #f8f9fa !important;
                border: 1px solid #e9ecef !important;
                border-radius: 5px !important;
                padding: 15px !important;
                margin-bottom: 15px !important;
                page-break-inside: avoid !important;
                -webkit-print-color-adjust: exact !important;
                print-color-adjust: exact !important;
              }

              .customer-section {
                border-left: 4px solid #e63946 !important;
              }

              .payment-section {
                border-left: 4px solid #28a745 !important;
              }

              .table {
                width: 100%;
                border-collapse: collapse;
                margin-bottom: 15px;
                font-size: 10px;
              }

              .table th {
                background: #e63946 !important;
                color: white !important;
                padding: 8px !important;
                border: 1px solid #dee2e6 !important;
                font-weight: bold !important;
                -webkit-print-color-adjust: exact !important;
                print-color-adjust: exact !important;
              }

              .table td {
                padding: 6px 8px !important;
                border: 1px solid #dee2e6 !important;
              }

              .table-striped tbody tr:nth-of-type(odd) {
                background-color: #f8f9fa !important;
                -webkit-print-color-adjust: exact !important;
                print-color-adjust: exact !important;
              }

              .bg-danger {
                background: #e63946 !important;
                color: white !important;
                -webkit-print-color-adjust: exact !important;
                print-color-adjust: exact !important;
              }

              .text-success {
                color: #28a745 !important;
              }

              .badge-success {
                background: #28a745 !important;
                color: white !important;
                padding: 2px 6px;
                border-radius: 3px;
                font-size: 9px;
                -webkit-print-color-adjust: exact !important;
                print-color-adjust: exact !important;
              }

              .badge-warning {
                background: #ffc107 !important;
                color: #000 !important;
                padding: 2px 6px;
                border-radius: 3px;
                font-size: 9px;
                -webkit-print-color-adjust: exact !important;
                print-color-adjust: exact !important;
              }

              .qr-code-container {
                text-align: center;
                padding: 10px;
              }

              .qr-code-container img {
                width: 80px;
                height: 80px;
                border: 2px solid #e63946;
                border-radius: 5px;
              }

              h1 { font-size: 20px; margin-bottom: 8px; }
              h2 { font-size: 18px; margin-bottom: 6px; }
              h3 { font-size: 16px; margin-bottom: 5px; }
              h4 { font-size: 14px; margin-bottom: 4px; }
              h5 { font-size: 12px; margin-bottom: 3px; }
              h6 { font-size: 11px; margin-bottom: 2px; }

              .row {
                display: flex;
                flex-wrap: wrap;
                margin: 0 -10px;
              }

              .col-6 {
                flex: 0 0 50%;
                max-width: 50%;
                padding: 0 10px;
              }

              .col-8 {
                flex: 0 0 66.66%;
                max-width: 66.66%;
                padding: 0 10px;
              }

              .col-4 {
                flex: 0 0 33.33%;
                max-width: 33.33%;
                padding: 0 10px;
              }

              .mb-3 { margin-bottom: 15px; }
              .mb-4 { margin-bottom: 20px; }
              .text-end { text-align: right; }
              .text-center { text-align: center; }
              .fw-bold { font-weight: bold; }
            </style>
          </head>
          <body>
            ${invoiceElement.innerHTML}
            <script>
              window.onload = function() {
                setTimeout(function() {
                  window.print();
                  window.close();
                }, 500);
              };

              // Handle print events
              window.onbeforeprint = function() {
                console.log('Starting print...');
              };

              window.onafterprint = function() {
                console.log('Print completed...');
                window.close();
              };
            </script>
          </body>
        </html>
      `;

      // Write the HTML to the new window
      printWindow.document.open();
      printWindow.document.write(invoiceHTML);
      printWindow.document.close();
    } catch (error) {
      console.error("Print failed:", error);
      alert("Print failed. Please ensure pop-ups are allowed and try again.");
    }
  };

  const handleDownloadPDF = async () => {
    setDownloading(true);
    try {
      const invoiceElement = document.getElementById("invoice-content");
      if (!invoiceElement) {
        throw new Error("Invoice content not found");
      }

      // Save current styles
      const originalDisplay = invoiceElement.style.display;
      const originalTransform = invoiceElement.style.transform;
      const originalWidth = invoiceElement.style.width;
      const originalHeight = invoiceElement.style.height;

      // Set optimal styles for capturing
      invoiceElement.style.display = "block";
      invoiceElement.style.transform = "none";
      invoiceElement.style.width = "210mm";
      invoiceElement.style.height = "auto";

      // Wait for styles to apply
      await new Promise((resolve) => setTimeout(resolve, 100));

      // Use centralized PDF service
      const result = await pdfService.generateInvoicePDF(
        invoiceElement,
        invoice,
        {
          filename: `Invoice_${invoiceId}_${new Date().toISOString().split("T")[0]}.pdf`,
          onProgress: (message, progress) => {
            console.log(`PDF Generation: ${message} (${progress}%)`);
          },
        },
      );

      // Restore original styles
      invoiceElement.style.display = originalDisplay;
      invoiceElement.style.transform = originalTransform;
      invoiceElement.style.width = originalWidth;
      invoiceElement.style.height = originalHeight;

      if (!result.success) {
        throw new Error(result.error);
      }
    } catch (error) {
      console.error("PDF download failed:", error);
      alert("PDF download failed. Please try printing instead.");
    } finally {
      setDownloading(false);
    }
  };

  if (loading) {
    return (
      <div
        className="min-vh-100 d-flex align-items-center justify-content-center"
        style={{
          background: "linear-gradient(135deg, #f8f9fa 0%, #ffffff 100%)",
        }}
      >
        <div className="text-center">
          <Spinner
            animation="border"
            variant="danger"
            style={{ width: "3rem", height: "3rem" }}
          />
          <div className="mt-3" style={{ color: "#e63946", fontWeight: "600" }}>
            Loading Invoice...
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div
        className="min-vh-100"
        style={{ background: "linear-gradient(135deg, #dc3545, #c82333)" }}
      >
        <Container className="py-5">
          <Row className="justify-content-center">
            <Col lg={8}>
              <Card className="text-center border-0 shadow-lg">
                <Card.Body className="p-5">
                  <div className="mb-4">
                    <i
                      className="bi bi-exclamation-triangle"
                      style={{ fontSize: "4rem", color: "#dc3545" }}
                    ></i>
                  </div>
                  <h2 className="text-danger mb-3">Invoice Not Found</h2>
                  <p className="text-muted mb-4">{error}</p>
                  <div className="d-flex gap-3 justify-content-center flex-wrap">
                    <Button variant="danger" onClick={() => navigate("/")}>
                      <i className="bi bi-house me-2"></i>Go Home
                    </Button>
                <Button
                  variant="outline-secondary"
                  onClick={handlePrint}
                  className="me-2"
                  disabled={pdfGenerating}
                >
                  {pdfGenerating ? (
                    <>
                      <Spinner
                        as="span"
                        animation="border"
                        size="sm"
                        className="me-2"
                      />
                      Generating PDF...
                    </>
                  ) : (
                    <>
                      <i className="bi bi-printer me-2"></i>
                      Print Invoice
                    </>
                  )}
                </Button>
              </Card>
            </Col>
          </Row>
        </Container>
      </div>
    );
  }

  // Create invoiceData only when invoice is loaded
  const invoiceData = invoice
    ? {
        invoiceId: invoice.invoiceId || invoiceId,
        orderId: invoice.order?.orderId || invoice.orderId,
        orderDate: new Date(
          invoice.invoiceDate || invoice.createdAt,
        ).toLocaleDateString("en-IN"),
        orderTime: new Date(
          invoice.invoiceDate || invoice.createdAt,
        ).toLocaleTimeString("en-IN"),
        customerDetails: {
          fullName: invoice.customerDetails?.fullName || invoice.customerName,
          email: invoice.customerDetails?.email || invoice.customerEmail,
          mobile: invoice.customerDetails?.mobile || invoice.customerMobile,
          address: invoice.customerDetails?.address || invoice.customerAddress,
          city: invoice.customerDetails?.city || invoice.customerCity,
          state: invoice.customerDetails?.state || invoice.customerState,
          pincode: invoice.customerDetails?.pincode || invoice.customerPincode,
        },
        items: invoice.items || [],
        subtotal: invoice.subtotal || invoice.total,
        shipping: invoice.shipping || 0,
        total: invoice.total || invoice.totalAmount,
        paymentMethod: invoice.paymentMethod || "COD",
        paymentStatus: invoice.paymentStatus || invoice.status,
        status: invoice.status || invoice.paymentStatus,
      }
    : null;

  return (
    <div
      className="min-vh-100"
      style={{
        background: "linear-gradient(135deg, #f8f9fa 0%, #ffffff 100%)",
      }}
    >
      {/* Action Header - Hidden in print */}
      <div
        className="no-print action-header py-3"
        style={{
          background: "linear-gradient(135deg, #e63946, #dc3545)",
          boxShadow: "0 2px 10px rgba(230, 57, 70, 0.3)",
        }}
      >
        <Container>
          <Row className="align-items-center">
            <Col md={6} className="mb-2 mb-md-0">
              <h4 className="text-white mb-0 fw-bold">
                <i className="bi bi-receipt me-2"></i>
                Invoice {invoiceData?.invoiceId || invoiceId}
              </h4>
              <small className="text-white-50">
                Professional Invoice Verification & Download
              </small>
            </Col>
            <Col md={6} className="text-md-end text-center">
              <div className="d-flex flex-column flex-md-row gap-2 justify-content-md-end justify-content-center">
                <Button
                  variant="light"
                  onClick={handlePrint}
                  style={{
                    fontWeight: "600",
                    borderRadius: "8px",
                    minWidth: "120px",
                  }}
                >
                  <i className="bi bi-printer me-2"></i>Print
                </Button>
                <Button
                  variant="warning"
                  onClick={handleDownloadPDF}
                  disabled={downloading}
                  style={{
                    fontWeight: "600",
                    borderRadius: "8px",
                    minWidth: "140px",
                  }}
                >
                  {downloading ? (
                    <>
                      <Spinner animation="border" size="sm" className="me-2" />
                      Downloading...
                    </>
                  ) : (
                    <>
                      <i className="bi bi-download me-2"></i>Download PDF
                    </>
                  )}
                </Button>
              </div>
            </Col>
          </Row>
        </Container>
      </div>

      {/* Invoice Content - A4 Size */}
      <Container className="py-4">
        <div
          id="invoice-content"
          className="invoice-a4"
          style={{
            width: "210mm",
            maxHeight: "257mm", // A4 height minus 40px (20px top + 20px bottom margins)
            minHeight: "257mm",
            margin: "0 auto",
            background: "white",
            boxShadow: "0 8px 32px rgba(0,0,0,0.1)",
            borderRadius: "8px",
            overflow: "hidden",
            padding: "20px", // 20px safe margin inside the container
            boxSizing: "border-box",
          }}
        >
          {/* Company Header */}
          <div
            style={{
              background: "linear-gradient(135deg, #e63946, #dc3545)",
              color: "white",
              padding: "20px",
              position: "relative",
              margin: "-20px -20px 15px -20px", // Extend to container edges, add bottom margin
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
                      marginRight: "20px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
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
                    <h1
                      style={{
                        fontWeight: "900",
                        marginBottom: "5px",
                        fontSize: "2rem",
                      }}
                    >
                      HARE KRISHNA MEDICAL
                    </h1>
                    <p
                      style={{
                        opacity: "0.9",
                        marginBottom: "10px",
                        fontSize: "14px",
                      }}
                    >
                      Your Trusted Health Partner
                    </p>
                    <div style={{ fontSize: "12px", opacity: "0.8" }}>
                      <div>
                        📍 3 Sahyog Complex, Man Sarovar circle, Amroli, 394107
                      </div>
                      <div>📞 +91 76989 13354 | +91 91060 18508</div>
                      <div>✉️ hkmedicalamroli@gmail.com</div>
                    </div>
                  </div>
                </div>
              </Col>
              <Col lg={4} className="text-end">
                <h1
                  style={{
                    fontWeight: "900",
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
                    textAlign: "left",
                  }}
                >
                  <div className="mb-2">
                    <strong>Invoice ID:</strong>{" "}
                    <span style={{ color: "#e63946" }}>
                      {invoiceData?.invoiceId || invoiceId}
                    </span>
                  </div>
                  <div className="mb-2">
                    <strong>Date:</strong> {invoiceData?.orderDate || "N/A"}
                  </div>
                  <div>
                    <strong>Status:</strong>{" "}
                    <Badge
                      bg={
                        invoiceData?.paymentStatus === "Completed" ||
                        invoiceData?.status === "paid"
                          ? "success"
                          : "warning"
                      }
                    >
                      {invoiceData?.paymentStatus ||
                        invoiceData?.status ||
                        "Pending"}
                    </Badge>
                  </div>
                </div>
              </Col>
            </Row>
          </div>

          {/* Content Body */}
          <div style={{ padding: "0 0 15px 0" }}>
            {/* Customer Information */}
            <Row className="mb-3">
              <Col lg={6}>
                <div
                  style={{
                    background: "#f8f9fa",
                    padding: "15px",
                    borderRadius: "8px",
                    border: "2px solid #e9ecef",
                    borderLeft: "4px solid #e63946",
                    height: "100%",
                  }}
                >
                  <h5
                    style={{
                      color: "#e63946",
                      marginBottom: "15px",
                      fontWeight: "700",
                    }}
                  >
                    <i className="bi bi-person-circle me-2"></i>
                    BILL TO
                  </h5>
                  <div style={{ lineHeight: "1.8" }}>
                    <div>
                      <strong>
                        {invoiceData?.customerDetails?.fullName || "Customer"}
                      </strong>
                    </div>
                    <div>{invoiceData?.customerDetails?.email || "N/A"}</div>
                    <div>{invoiceData?.customerDetails?.mobile || "N/A"}</div>
                    <div className="mt-2 text-muted">
                      {invoiceData?.customerDetails?.address && (
                        <small>
                          {invoiceData.customerDetails.address},{" "}
                          {invoiceData.customerDetails.city},{" "}
                          {invoiceData.customerDetails.state}{" "}
                          {invoiceData.customerDetails.pincode}
                        </small>
                      )}
                    </div>
                  </div>
                </div>
              </Col>
              <Col lg={6}>
                <div
                  style={{
                    background: "#f8f9fa",
                    padding: "15px",
                    borderRadius: "8px",
                    border: "2px solid #e9ecef",
                    borderLeft: "4px solid #28a745",
                    height: "100%",
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
                      <strong>Method:</strong>{" "}
                      {invoiceData?.paymentMethod || "COD"}
                    </div>
                    <div>
                      <strong>Status:</strong>{" "}
                      <Badge
                        bg={
                          invoiceData?.paymentStatus === "Completed" ||
                          invoiceData?.status === "paid"
                            ? "success"
                            : "warning"
                        }
                      >
                        {invoiceData?.paymentStatus ||
                          invoiceData?.status ||
                          "Pending"}
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
                        ₹{parseFloat(invoiceData?.total || 0).toFixed(2)}
                      </span>
                    </div>
                  </div>
                </div>
              </Col>
            </Row>

            {/* Items Table */}
            <div className="mb-3">
              <h5
                style={{
                  color: "#333",
                  marginBottom: "15px",
                  fontWeight: "700",
                }}
              >
                <i className="bi bi-list-ul me-2"></i>
                INVOICE ITEMS
              </h5>
              <div className="table-responsive">
                <div
                  style={{
                    border: "2px solid #e9ecef",
                    borderRadius: "8px",
                    overflow: "hidden",
                  }}
                >
                  <table className="table table-striped mb-0">
                    <thead style={{ background: "#e63946", color: "white" }}>
                      <tr>
                        <th
                          style={{
                            border: "none",
                            padding: "8px",
                            minWidth: "30px",
                            fontSize: "11px",
                          }}
                        >
                          #
                        </th>
                        <th
                          style={{
                            border: "none",
                            padding: "8px",
                            minWidth: "180px",
                            fontSize: "11px",
                          }}
                        >
                          Description
                        </th>
                        <th
                          style={{
                            border: "none",
                            padding: "8px",
                            textAlign: "center",
                            minWidth: "50px",
                            fontSize: "11px",
                          }}
                        >
                          Qty
                        </th>
                        <th
                          style={{
                            border: "none",
                            padding: "8px",
                            textAlign: "right",
                            minWidth: "70px",
                            fontSize: "11px",
                          }}
                        >
                          Price
                        </th>
                        <th
                          style={{
                            border: "none",
                            padding: "8px",
                            textAlign: "right",
                            minWidth: "80px",
                            fontSize: "11px",
                          }}
                        >
                          Total
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {invoiceData?.items?.map((item, index) => (
                        <tr key={index}>
                          <td
                            style={{
                              padding: "8px",
                              fontWeight: "600",
                              fontSize: "11px",
                            }}
                          >
                            {index + 1}
                          </td>
                          <td style={{ padding: "8px", fontSize: "11px" }}>
                            <div>
                              <strong>{item.name || item.productName}</strong>
                            </div>
                            {item.description && (
                              <small
                                className="text-muted d-block"
                                style={{ fontSize: "10px" }}
                              >
                                {item.description}
                              </small>
                            )}
                          </td>
                          <td
                            style={{
                              padding: "8px",
                              textAlign: "center",
                              fontWeight: "600",
                              fontSize: "11px",
                            }}
                          >
                            {item.quantity}
                          </td>
                          <td
                            style={{
                              padding: "8px",
                              textAlign: "right",
                              fontWeight: "600",
                              fontSize: "11px",
                            }}
                          >
                            ₹{parseFloat(item.price || 0).toFixed(2)}
                          </td>
                          <td
                            style={{
                              padding: "8px",
                              textAlign: "right",
                              fontWeight: "700",
                              color: "#28a745",
                              fontSize: "11px",
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
                  </table>
                </div>
              </div>
            </div>

            {/* Totals and QR Code */}
            <Row>
              <Col lg={6}>
                {qrCode && (
                  <div
                    style={{
                      background: "#f8f9fa",
                      padding: "15px",
                      borderRadius: "8px",
                      border: "2px solid #e9ecef",
                      textAlign: "center",
                    }}
                  >
                    <h6 style={{ marginBottom: "15px", fontWeight: "700" }}>
                      <i className="bi bi-qr-code me-2"></i>
                      Invoice Verification
                    </h6>
                    <img
                      src={qrCode}
                      alt="Invoice QR Code"
                      style={{
                        width: "80px",
                        height: "80px",
                        border: "2px solid #e63946",
                        borderRadius: "5px",
                        boxShadow: "0 2px 8px rgba(230, 57, 70, 0.3)",
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
                      Scan to verify invoice authenticity
                    </p>
                  </div>
                )}
              </Col>
              <Col lg={6}>
                <div
                  style={{
                    border: "2px solid #e9ecef",
                    borderRadius: "8px",
                    overflow: "hidden",
                  }}
                >
                  <table className="table mb-0">
                    <tbody>
                      <tr>
                        <td
                          style={{
                            padding: "8px 15px",
                            fontWeight: "600",
                            background: "#f8f9fa",
                            fontSize: "11px",
                          }}
                        >
                          Subtotal:
                        </td>
                        <td
                          style={{
                            padding: "8px 15px",
                            textAlign: "right",
                            fontWeight: "600",
                            background: "#f8f9fa",
                            fontSize: "11px",
                          }}
                        >
                          ₹{parseFloat(invoiceData?.subtotal || 0).toFixed(2)}
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
                            color: "#28a745",
                          }}
                        >
                          All taxes included in product price
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
                          {(invoiceData?.shipping || 0) === 0
                            ? "FREE"
                            : `₹${parseFloat(invoiceData?.shipping || 0).toFixed(2)}`}
                        </td>
                      </tr>
                      <tr>
                        <td
                          style={{
                            padding: "10px 15px",
                            fontWeight: "900",
                            fontSize: "12px",
                            background: "#e63946",
                            color: "white",
                          }}
                        >
                          TOTAL:
                        </td>
                        <td
                          style={{
                            padding: "10px 15px",
                            textAlign: "right",
                            fontWeight: "900",
                            fontSize: "13px",
                            background: "#e63946",
                            color: "white",
                          }}
                        >
                          ₹{parseFloat(invoiceData?.total || 0).toFixed(2)}
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </Col>
            </Row>

            {/* Footer */}
            <div
              className="mt-3 pt-2"
              style={{
                borderTop: "1px solid #e9ecef",
                textAlign: "center",
                color: "#666",
                fontSize: "11px",
              }}
            >
              <p
                style={{
                  marginBottom: "5px",
                  fontWeight: "600",
                  fontSize: "10px",
                }}
              >
                <i
                  className="bi bi-shield-check me-1"
                  style={{ color: "#28a745" }}
                ></i>
                This is a digitally verified invoice and does not require a
                signature.
              </p>
              <p style={{ marginBottom: "0", fontSize: "10px" }}>
                Thank you for choosing Hare Krishna Medical - Your Trusted
                Health Partner
              </p>
              <div style={{ fontSize: "9px", color: "#999", marginTop: "5px" }}>
                Generated: {new Date().toLocaleString()} | Invoice ID:{" "}
                {invoiceData?.invoiceId || invoiceId}
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Navigation - Hidden in print */}
        <div className="no-print text-center mt-4">
          <div className="d-flex gap-3 justify-content-center flex-wrap">
            <Button variant="outline-secondary" onClick={() => navigate("/")}>
              <i className="bi bi-house me-2"></i>Go Home
            </Button>
            <Button
              variant="outline-primary"
              onClick={() => navigate("/products")}
            >
              <i className="bi bi-shop me-2"></i>Continue Shopping
            </Button>
            {isAuthenticated && user?.role === 1 && (
              <Button
                variant="outline-success"
                onClick={() => navigate("/admin/invoices")}
              >
                <i className="bi bi-gear me-2"></i>Manage Invoices
              </Button>
            )}
            {isAuthenticated && user?.role !== 1 && (
              <Button
                variant="outline-info"
                onClick={() => navigate("/user/invoices")}
              >
                <i className="bi bi-file-text me-2"></i>My Invoices
              </Button>
            )}
          </div>
        </div>
      </Container>

      {/* Enhanced Print Styles */}
      <style jsx>{`
        @media print {
          html,
          body {
            margin: 0 !important;
            padding: 0 !important;
            font-family: "Segoe UI", Arial, sans-serif !important;
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
          }

          body * {
            visibility: hidden !important;
          }

          #invoice-content,
          #invoice-content * {
            visibility: visible !important;
          }

          #invoice-content {
            position: absolute !important;
            left: 0 !important;
            top: 0 !important;
            width: 210mm !important;
            min-height: 277mm !important;
            margin: 0 !important;
            padding: 15mm !important;
            box-shadow: none !important;
            border-radius: 0 !important;
            border: none !important;
            background: white !important;
            page-break-inside: avoid !important;
            overflow: visible !important;
            transform: none !important;
            font-size: 11px !important;
            line-height: 1.4 !important;
          }

          .no-print {
            display: none !important;
            visibility: hidden !important;
          }

          @page {
            size: A4 portrait;
            margin: 10mm;
          }

          .invoice-header {
            background: #e63946 !important;
            color: white !important;
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
          }

          .table th {
            background: #e63946 !important;
            color: white !important;
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
          }

          .bg-danger,
          .btn-danger {
            background: #e63946 !important;
            color: white !important;
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
          }

          .text-success {
            color: #28a745 !important;
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
          }

          .badge-success {
            background: #28a745 !important;
            color: white !important;
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
          }

          .badge-warning {
            background: #ffc107 !important;
            color: #212529 !important;
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
          }
        }

        .invoice-a4 {
          font-family: "Segoe UI", Arial, sans-serif;
          line-height: 1.4;
        }

        /* Responsive adjustments */
        @media (max-width: 768px) {
          .invoice-a4 {
            padding: 10px;
          }

          .invoice-a4 .table-responsive {
            overflow-x: auto;
          }

          .action-header {
            padding: 15px 0 !important;
          }

          .action-header .row {
            flex-direction: column;
            gap: 10px;
          }

          .action-header .col-md-6 {
            text-align: center !important;
          }
        }
      `}</style>
    </div>
  );
};

export default InvoiceView;