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
import { PageHeroSection } from "../components/common/ConsistentTheme";
import "../styles/InvoiceA4.css";

const InvoiceView = () => {
  const { invoiceId } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { isAuthenticated, user } = useSelector((state) => state.auth);

  // Check if user has access (admin or authenticated user)
  useEffect(() => {
    if (!isAuthenticated) {
      // Store return URL and redirect to login
      const returnUrl = `/invoice/${invoiceId}`;
      sessionStorage.setItem("redirectAfterLogin", returnUrl);
      localStorage.setItem("lastAttemptedUrl", returnUrl);

      navigate("/login", {
        state: { from: returnUrl, returnTo: returnUrl },
        replace: true,
      });
      return;
    }
  }, [isAuthenticated, navigate, invoiceId]);

  const [invoice, setInvoice] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [downloading, setDownloading] = useState(false);
  const [qrCode, setQrCode] = useState(null);
  const [pdfUrl, setPdfUrl] = useState(null);
  const [pdfGenerating, setPdfGenerating] = useState(false);

  useEffect(() => {
    if (invoiceId && isAuthenticated) {
      fetchInvoice();
    }
  }, [invoiceId, isAuthenticated]);

  const fetchInvoice = async () => {
    if (!invoiceId) {
      setError("Invoice ID is required");
      setLoading(false);
      return;
    }

    setLoading(true);
    setError("");

    // Check if this is a demo invoice first
    if (isDemoInvoice(invoiceId)) {
      const demoInvoice = getDemoInvoice(invoiceId);
      if (demoInvoice) {
        setInvoice(demoInvoice);
        generateQRCode(invoiceId);

        // Generate PDF for demo invoice - optimized for speed
        setTimeout(() => {
          generateInvoicePDF(demoInvoice);
        }, 500); // Reduced from 1000ms

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

      // Generate PDF after invoice is loaded - optimized for speed
      setTimeout(() => {
        generateInvoicePDF(data.data);
      }, 500); // Reduced from 1000ms

      setLoading(false);
    } else {
      setError(
        apiError ||
          "Invoice not found. Please check the invoice ID and try again.",
      );
      setLoading(false);
    }
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

  // Optimized PDF generation with faster processing
  const generateInvoicePDF = async (invoiceData = null) => {
    const dataToUse = invoiceData || invoice;
    if (!dataToUse) return;

    setPdfGenerating(true);
    try {
      // Wait shorter time for DOM to render
      await new Promise((resolve) => setTimeout(resolve, 300)); // Reduced from 1000ms

      const invoiceElement = document.getElementById("invoice-content");
      if (!invoiceElement) {
        throw new Error("Invoice content not found");
      }

      // Use optimized PDF generation
      const result = await pdfService.generateInvoicePDFBlob(
        invoiceElement,
        dataToUse,
        {
          quality: 0.8, // Reduced quality for faster generation
          scale: 1.5, // Reduced scale for faster processing
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

  // Redirect print functionality to verify page
  const handlePrint = () => {
    const verifyUrl = `/verify/${invoiceId}`;
    window.open(verifyUrl, "_blank");
  };

  const handleDownloadPDF = async () => {
    setDownloading(true);
    try {
      const invoiceElement = document.getElementById("invoice-content");
      if (!invoiceElement) {
        throw new Error("Invoice content not found");
      }

      // Set optimal styles for capturing
      const originalDisplay = invoiceElement.style.display;
      const originalTransform = invoiceElement.style.transform;
      const originalWidth = invoiceElement.style.width;
      const originalHeight = invoiceElement.style.height;

      invoiceElement.style.display = "block";
      invoiceElement.style.transform = "none";
      invoiceElement.style.width = "210mm";
      invoiceElement.style.height = "auto";

      // Shorter wait time for style application
      await new Promise((resolve) => setTimeout(resolve, 50));

      // Use optimized PDF generation for download
      const result = await pdfService.generateInvoicePDF(
        invoiceElement,
        invoice,
        {
          filename: `Invoice_${invoiceId}_${new Date().toISOString().split("T")[0]}.pdf`,
          quality: 0.9, // Better quality for downloads
          scale: 2, // Higher scale for downloads
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

  // Cleanup PDF URL on component unmount
  useEffect(() => {
    return () => {
      if (pdfUrl) {
        URL.revokeObjectURL(pdfUrl);
      }
    };
  }, [pdfUrl]);

  // Show loading while checking authentication
  if (!isAuthenticated) {
    return (
      <div className="fade-in">
        <Container className="text-center py-5">
          <Spinner animation="border" variant="danger" size="lg" />
          <h4 className="mt-3">Redirecting to login...</h4>
        </Container>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="fade-in">
        <Container className="text-center py-5">
          <div
            className="d-flex justify-content-center align-items-center"
            style={{ minHeight: "60vh" }}
          >
            <div className="text-center">
              <Spinner animation="border" variant="danger" size="lg" />
              <h4 className="mt-3 text-medical-red">Loading Invoice...</h4>
              <p className="text-muted">
                Please wait while we fetch your invoice details
              </p>
            </div>
          </div>
        </Container>
      </div>
    );
  }

  if (error) {
    return (
      <div className="fade-in">
        <Container className="py-5">
          <Row className="justify-content-center">
            <Col lg={8}>
              <Card className="border-0 shadow-lg">
                <Card.Body className="p-5">
                  <div className="text-center mb-4">
                    <i
                      className="bi bi-exclamation-triangle"
                      style={{ fontSize: "4rem", color: "#dc3545" }}
                    ></i>
                  </div>
                  <h2 className="text-danger mb-3 text-center">
                    Invoice Not Found
                  </h2>
                  <p className="text-muted mb-4 text-center">{error}</p>
                  <div className="d-flex gap-3 justify-content-center flex-wrap">
                    <Button variant="danger" onClick={() => navigate(-1)}>
                      <i className="bi bi-arrow-left me-2"></i>Go Back
                    </Button>
                    <Button
                      variant="outline-danger"
                      onClick={() => navigate("/")}
                    >
                      <i className="bi bi-house me-2"></i>Go Home
                    </Button>
                  </div>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Container>
      </div>
    );
  }

  // Create invoice data only when invoice is loaded
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
        subtotal: invoice.subtotal || invoice.total || 0,
        shipping: invoice.shipping || 0,
        tax: 0,
        total: invoice.total || invoice.totalAmount || 0,
        paymentMethod: invoice.paymentMethod || "COD",
        paymentStatus: invoice.paymentStatus || "Pending",
        status: invoice.status || "Pending",
        qrCode: qrCode,
      }
    : null;

  return (
    <div className="fade-in">
      {/* Professional Hero Section with Back Button */}
      <PageHeroSection
        title={`Invoice #${invoiceId}`}
        subtitle="Official invoice with secure QR verification and professional formatting"
        iconContext="invoice"
      />

      {/* Back Button */}
      <section
        style={{
          background: "linear-gradient(135deg, #e63946, #dc3545)",
          paddingTop: "20px",
          paddingBottom: "20px",
        }}
      >
        <Container>
          <Row>
            <Col>
              <Button
                variant="outline-light"
                onClick={() => navigate(-1)}
                style={{
                  fontWeight: "600",
                  borderRadius: "8px",
                  border: "2px solid rgba(255,255,255,0.3)",
                  padding: "8px 16px",
                  transition: "all 0.3s ease",
                }}
                onMouseOver={(e) => {
                  e.target.style.background = "rgba(255,255,255,0.1)";
                  e.target.style.borderColor = "rgba(255,255,255,0.5)";
                }}
                onMouseOut={(e) => {
                  e.target.style.background = "transparent";
                  e.target.style.borderColor = "rgba(255,255,255,0.3)";
                }}
              >
                <i className="bi bi-arrow-left me-2"></i>
                Back to Previous Page
              </Button>
            </Col>
          </Row>
        </Container>
      </section>

      {/* Action Buttons Section */}
      <section
        style={{
          background: "#ffffff",
          paddingTop: "40px",
          paddingBottom: "20px",
          borderBottom: "1px solid #f8f9fa",
        }}
      >
        <Container>
          <Row className="justify-content-center">
            <Col lg={8} className="text-center">
              <div className="d-flex gap-3 justify-content-center flex-wrap">
                <Button
                  variant="outline-dark"
                  onClick={handlePrint}
                  style={{
                    fontWeight: "600",
                    borderRadius: "12px",
                    padding: "12px 24px",
                    border: "2px solid #343a40",
                    transition: "all 0.3s ease",
                  }}
                  onMouseOver={(e) => {
                    e.target.style.background = "#343a40";
                    e.target.style.color = "white";
                    e.target.style.transform = "translateY(-2px)";
                    e.target.style.boxShadow =
                      "0 4px 15px rgba(52, 58, 64, 0.3)";
                  }}
                  onMouseOut={(e) => {
                    e.target.style.background = "transparent";
                    e.target.style.color = "#343a40";
                    e.target.style.transform = "translateY(0)";
                    e.target.style.boxShadow = "none";
                  }}
                >
                  <i className="bi bi-printer me-2"></i>Print Invoice
                </Button>
                <Button
                  variant="dark"
                  onClick={handleDownloadPDF}
                  disabled={downloading}
                  style={{
                    fontWeight: "600",
                    borderRadius: "12px",
                    padding: "12px 24px",
                    background: "linear-gradient(135deg, #343a40, #495057)",
                    border: "none",
                    transition: "all 0.3s ease",
                  }}
                  onMouseOver={(e) => {
                    if (!downloading) {
                      e.target.style.transform = "translateY(-2px)";
                      e.target.style.boxShadow =
                        "0 6px 20px rgba(52, 58, 64, 0.4)";
                    }
                  }}
                  onMouseOut={(e) => {
                    if (!downloading) {
                      e.target.style.transform = "translateY(0)";
                      e.target.style.boxShadow = "none";
                    }
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
      </section>

      {/* Invoice Content - Professional A4 Layout */}
      <section
        style={{
          background: "#f8f9fa",
          paddingTop: "40px",
          paddingBottom: "80px",
        }}
      >
        <Container>
          <Row className="justify-content-center">
            <Col lg={10} xl={8}>
              <div
                id="invoice-content"
                className="invoice-a4"
                style={{
                  width: "210mm",
                  maxHeight: "257mm",
                  minHeight: "257mm",
                  margin: "0 auto",
                  background: "white",
                  boxShadow: "0 12px 40px rgba(0,0,0,0.15)",
                  borderRadius: "12px",
                  overflow: "hidden",
                  padding: "15px",
                  boxSizing: "border-box",
                  border: "1px solid #e9ecef",
                  position: "relative",
                }}
              >
                {/* Invoice content will be rendered here based on invoiceData */}
                {invoiceData && (
                  <>
                    {/* Company Header */}
                    <div
                      style={{
                        background: "linear-gradient(135deg, #e63946, #dc3545)",
                        color: "white",
                        padding: "20px",
                        position: "relative",
                        margin: "-15px -15px 15px -15px",
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
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                marginRight: "20px",
                                boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                              }}
                            >
                              <img
                                src="https://cdn.builder.io/api/v1/assets/30eb44a11c7b4dd995ed4b1b6b9528c2/hk_bg-dae727?format=webp&width=800"
                                alt="Hare Krishna Medical Logo"
                                style={{
                                  width: "60px",
                                  height: "60px",
                                  objectFit: "contain",
                                }}
                                onError={(e) => {
                                  e.target.style.display = "none";
                                }}
                              />
                            </div>
                            <div>
                              <h2
                                className="mb-1"
                                style={{
                                  fontSize: "1.8rem",
                                  fontWeight: "700",
                                }}
                              >
                                Hare Krishna Medical
                              </h2>
                              <p
                                className="mb-1"
                                style={{ fontSize: "0.9rem", opacity: 0.9 }}
                              >
                                📍 Shop 12, Amroli Char Rasta, Nr. ONGC Circle,
                                Surat
                              </p>
                              <p
                                className="mb-0"
                                style={{ fontSize: "0.9rem", opacity: 0.9 }}
                              >
                                📞 +91 76989 13354 | ✉️
                                hkmedicalamroli@gmail.com
                              </p>
                            </div>
                          </div>
                        </Col>
                        <Col lg={4} className="text-end">
                          <div
                            style={{
                              background: "rgba(255,255,255,0.2)",
                              padding: "15px",
                              borderRadius: "10px",
                              backdropFilter: "blur(10px)",
                            }}
                          >
                            <h3
                              className="mb-2"
                              style={{ fontSize: "1.5rem", fontWeight: "700" }}
                            >
                              INVOICE
                            </h3>
                            <p className="mb-1" style={{ fontSize: "0.9rem" }}>
                              <strong>Invoice #:</strong>{" "}
                              {invoiceData?.invoiceId}
                            </p>
                            <p className="mb-1" style={{ fontSize: "0.9rem" }}>
                              <strong>Order #:</strong> {invoiceData?.orderId}
                            </p>
                            <p
                              className="mb-0"
                              style={{ fontSize: "0.8rem", opacity: 0.9 }}
                            >
                              {invoiceData?.orderDate} |{" "}
                              {invoiceData?.orderTime}
                            </p>
                          </div>
                        </Col>
                      </Row>
                    </div>

                    {/* Customer and QR Information */}
                    <Row className="mb-4">
                      <Col lg={8}>
                        <div
                          style={{
                            background: "#f8f9fa",
                            padding: "20px",
                            borderRadius: "10px",
                            border: "1px solid #e0e0e0",
                          }}
                        >
                          <h5
                            className="mb-3"
                            style={{ color: "#e63946", fontWeight: "600" }}
                          >
                            <i className="bi bi-person-check me-2"></i>Customer
                            Details
                          </h5>
                          <Row>
                            <Col md={6}>
                              <p className="mb-2">
                                <strong>Name:</strong>{" "}
                                {invoiceData?.customerDetails?.fullName}
                              </p>
                              <p className="mb-2">
                                <strong>Email:</strong>{" "}
                                {invoiceData?.customerDetails?.email}
                              </p>
                              <p className="mb-0">
                                <strong>Mobile:</strong>{" "}
                                {invoiceData?.customerDetails?.mobile}
                              </p>
                            </Col>
                            <Col md={6}>
                              <p className="mb-2">
                                <strong>Address:</strong>
                              </p>
                              <p
                                className="mb-0"
                                style={{ fontSize: "0.9rem" }}
                              >
                                {invoiceData?.customerDetails?.address}
                                <br />
                                {invoiceData?.customerDetails?.city},{" "}
                                {invoiceData?.customerDetails?.state}{" "}
                                {invoiceData?.customerDetails?.pincode}
                              </p>
                            </Col>
                          </Row>
                        </div>
                      </Col>
                      <Col lg={4}>
                        <div
                          style={{
                            background: "white",
                            padding: "20px",
                            borderRadius: "10px",
                            border: "2px solid #e63946",
                            textAlign: "center",
                          }}
                        >
                          <h6
                            style={{
                              color: "#e63946",
                              fontWeight: "600",
                              marginBottom: "15px",
                            }}
                          >
                            <i className="bi bi-qr-code me-2"></i>Verification
                            QR
                          </h6>
                          {qrCode ? (
                            <img
                              src={qrCode}
                              alt="Invoice QR Code"
                              style={{
                                width: "120px",
                                height: "120px",
                                border: "2px solid #e63946",
                                borderRadius: "8px",
                              }}
                            />
                          ) : (
                            <div
                              style={{
                                width: "120px",
                                height: "120px",
                                border: "2px dashed #e63946",
                                borderRadius: "8px",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                margin: "0 auto",
                                background: "#f8f9fa",
                              }}
                            >
                              <span
                                style={{ color: "#e63946", fontSize: "0.8rem" }}
                              >
                                QR Code
                              </span>
                            </div>
                          )}
                          <p
                            style={{
                              fontSize: "0.8rem",
                              color: "#666",
                              marginTop: "10px",
                              marginBottom: "0",
                            }}
                          >
                            Scan to verify invoice
                          </p>
                        </div>
                      </Col>
                    </Row>

                    {/* Items Table */}
                    <div className="mb-4">
                      <h5
                        className="mb-3"
                        style={{ color: "#e63946", fontWeight: "600" }}
                      >
                        <i className="bi bi-bag-check me-2"></i>Order Items
                      </h5>
                      <div
                        style={{
                          border: "1px solid #e0e0e0",
                          borderRadius: "8px",
                          overflow: "hidden",
                        }}
                      >
                        <table className="table table-striped mb-0">
                          <thead
                            style={{ background: "#e63946", color: "white" }}
                          >
                            <tr>
                              <th
                                style={{ padding: "12px", fontWeight: "600" }}
                              >
                                Item
                              </th>
                              <th
                                style={{ padding: "12px", fontWeight: "600" }}
                              >
                                Qty
                              </th>
                              <th
                                style={{ padding: "12px", fontWeight: "600" }}
                              >
                                Price
                              </th>
                              <th
                                style={{ padding: "12px", fontWeight: "600" }}
                              >
                                Total
                              </th>
                            </tr>
                          </thead>
                          <tbody>
                            {invoiceData?.items?.map((item, index) => (
                              <tr key={index}>
                                <td style={{ padding: "12px" }}>{item.name}</td>
                                <td style={{ padding: "12px" }}>
                                  {item.quantity}
                                </td>
                                <td style={{ padding: "12px" }}>
                                  ₹{item.price}
                                </td>
                                <td style={{ padding: "12px" }}>
                                  ₹{(item.quantity * item.price).toFixed(2)}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>

                    {/* Totals and Footer */}
                    <Row>
                      <Col lg={8}>
                        <div
                          style={{
                            background: "#f8f9fa",
                            padding: "15px",
                            borderRadius: "8px",
                            border: "1px solid #e0e0e0",
                          }}
                        >
                          <h6
                            style={{
                              color: "#e63946",
                              fontWeight: "600",
                              marginBottom: "10px",
                            }}
                          >
                            <i className="bi bi-credit-card me-2"></i>Payment
                            Information
                          </h6>
                          <p className="mb-1">
                            <strong>Method:</strong>{" "}
                            {invoiceData?.paymentMethod}
                          </p>
                          <p className="mb-1">
                            <strong>Status:</strong>{" "}
                            <Badge
                              bg={
                                invoiceData?.paymentStatus === "Paid"
                                  ? "success"
                                  : "warning"
                              }
                            >
                              {invoiceData?.paymentStatus}
                            </Badge>
                          </p>
                          <p className="mb-0">
                            <strong>Order Status:</strong>{" "}
                            <Badge bg="info">{invoiceData?.status}</Badge>
                          </p>
                        </div>
                      </Col>
                      <Col lg={4}>
                        <div
                          style={{
                            background: "white",
                            padding: "20px",
                            border: "2px solid #e63946",
                            borderRadius: "8px",
                          }}
                        >
                          <div className="d-flex justify-content-between mb-2">
                            <span>Subtotal:</span>
                            <span>₹{invoiceData?.subtotal?.toFixed(2)}</span>
                          </div>
                          <div className="d-flex justify-content-between mb-2">
                            <span>Shipping:</span>
                            <span>₹{invoiceData?.shipping?.toFixed(2)}</span>
                          </div>
                          <div className="d-flex justify-content-between mb-2">
                            <span>Tax:</span>
                            <span>₹{invoiceData?.tax?.toFixed(2)}</span>
                          </div>
                          <hr style={{ margin: "10px 0" }} />
                          <div
                            className="d-flex justify-content-between"
                            style={{ fontSize: "1.2rem", fontWeight: "bold" }}
                          >
                            <span>Total:</span>
                            <span style={{ color: "#e63946" }}>
                              ₹{invoiceData?.total?.toFixed(2)}
                            </span>
                          </div>
                        </div>
                      </Col>
                    </Row>

                    {/* Footer */}
                    <div
                      style={{
                        borderTop: "2px solid #e63946",
                        marginTop: "20px",
                        paddingTop: "15px",
                        textAlign: "center",
                      }}
                    >
                      <p
                        style={{
                          fontSize: "0.9rem",
                          color: "#666",
                          marginBottom: "5px",
                        }}
                      >
                        Thank you for choosing Hare Krishna Medical
                      </p>
                      <p
                        style={{
                          fontSize: "0.8rem",
                          color: "#999",
                          marginBottom: "0",
                        }}
                      >
                        For any queries, contact us at +91 76989 13354 |
                        hkmedicalamroli@gmail.com
                      </p>
                    </div>
                  </>
                )}
              </div>
            </Col>
          </Row>
        </Container>
      </section>
    </div>
  );
};

export default InvoiceView;
