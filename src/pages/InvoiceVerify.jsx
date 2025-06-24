import React, { useState, useEffect } from "react";
import { useParams, useNavigate, useSearchParams } from "react-router-dom";
import {
  Container,
  Row,
  Col,
  Card,
  Button,
  Form,
  Alert,
  Badge,
  Spinner,
  InputGroup,
} from "react-bootstrap";
import { api, safeApiCall } from "../utils/apiClient";
import { getDemoInvoice, isDemoInvoice } from "../utils/demoInvoiceData";
import { PageHeroSection } from "../components/common/ConsistentTheme";
import QRCameraScanner from "../components/common/QRCameraScanner";
import pdfService from "../services/PDFService";
import "../styles/InvoiceA4.css";

const InvoiceVerify = () => {
  const { invoiceId: urlInvoiceId } = useParams();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const [invoiceId, setInvoiceId] = useState(urlInvoiceId || "");
  const [invoice, setInvoice] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [verifySuccess, setVerifySuccess] = useState(false);
  const [pdfGenerating, setPdfGenerating] = useState(false);
  const [pdfUrl, setPdfUrl] = useState(null);
  const [showQRScanner, setShowQRScanner] = useState(false);

  // Auto-verify if invoice ID is in URL
  useEffect(() => {
    if (urlInvoiceId) {
      setInvoiceId(urlInvoiceId);
      handleVerify(urlInvoiceId);
    }
  }, [urlInvoiceId]);

  // Auto-verify from QR scan parameters
  useEffect(() => {
    const qrInvoiceId = searchParams.get("invoice") || searchParams.get("id");
    if (qrInvoiceId && !urlInvoiceId) {
      setInvoiceId(qrInvoiceId);
      handleVerify(qrInvoiceId);
    }
  }, [searchParams, urlInvoiceId]);

  const handleVerify = async (idToVerify = null) => {
    const targetId = idToVerify || invoiceId.trim();
    if (!targetId) {
      setError("Please enter an Invoice ID or Order ID");
      return;
    }

    setLoading(true);
    setError("");
    setVerifySuccess(false);
    setInvoice(null);

    try {
      // Check if this is a demo invoice first
      if (isDemoInvoice(targetId)) {
        const demoInvoice = getDemoInvoice(targetId);
        if (demoInvoice) {
          setInvoice(demoInvoice);
          setVerifySuccess(true);
          generateInvoicePDF(demoInvoice);
          setLoading(false);
          return;
        }
      }

      // Try to verify by invoice ID first
      let {
        success,
        data,
        error: apiError,
      } = await safeApiCall(
        () => api.get(`/api/invoices/verify/${targetId}`),
        null,
      );

      if (!success || !data?.data) {
        // Try to search by order ID
        const orderResult = await safeApiCall(
          () => api.get(`/api/orders/verify/${targetId}`),
          null,
        );

        if (orderResult.success && orderResult.data?.data) {
          // Found by order ID, get the invoice
          const order = orderResult.data.data;
          if (order.invoiceId) {
            const invoiceResult = await safeApiCall(
              () => api.get(`/api/invoices/verify/${order.invoiceId}`),
              null,
            );
            if (invoiceResult.success && invoiceResult.data?.data) {
              success = true;
              data = invoiceResult.data;
            }
          }
        }
      }

      if (success && data?.data) {
        setInvoice(data.data);
        setVerifySuccess(true);
        generateInvoicePDF(data.data);
      } else {
        setError(
          apiError ||
            "Invoice not found. Please check the Invoice ID or Order ID and try again.",
        );
      }
    } catch (error) {
      console.error("Verification error:", error);
      setError("Verification failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const generateInvoicePDF = async (invoiceData) => {
    setPdfGenerating(true);
    try {
      // Wait for DOM to render invoice content
      setTimeout(async () => {
        const invoiceElement = document.getElementById(
          "verify-invoice-content",
        );
        if (!invoiceElement || !invoiceData) {
          setPdfGenerating(false);
          return;
        }

        const result = await pdfService.generateInvoicePDFBlob(
          invoiceElement,
          invoiceData,
          {
            onProgress: (message, progress) => {
              console.log(`PDF Generation: ${message} (${progress}%)`);
            },
          },
        );

        if (result.success && result.blob) {
          const pdfObjectUrl = URL.createObjectURL(result.blob);
          setPdfUrl(pdfObjectUrl);
        }
        setPdfGenerating(false);
      }, 1000);
    } catch (error) {
      console.error("PDF generation failed:", error);
      setPdfGenerating(false);
    }
  };

  const handlePrint = () => {
    if (pdfUrl) {
      const printWindow = window.open(
        pdfUrl,
        "_blank",
        "width=1200,height=800,scrollbars=yes,resizable=yes,toolbar=yes,menubar=yes",
      );

      if (printWindow) {
        printWindow.document.title = `Invoice Verification - ${invoice?.invoiceId}`;

        const setupPrintHandlers = () => {
          const afterPrint = () => {
            setTimeout(() => printWindow.close(), 1000);
          };

          printWindow.addEventListener("afterprint", afterPrint);
          printWindow.addEventListener("beforeunload", () =>
            printWindow.close(),
          );
        };

        printWindow.onload = () => {
          setTimeout(() => {
            setupPrintHandlers();
            printWindow.focus();
            printWindow.print();
          }, 1000);
        };

        setTimeout(() => {
          if (printWindow && !printWindow.closed) {
            printWindow.close();
          }
        }, 30000);
      }
    }
  };

  const handleDownloadPDF = async () => {
    if (!invoice) return;

    try {
      const invoiceElement = document.getElementById("verify-invoice-content");
      if (!invoiceElement) return;

      const result = await pdfService.generateInvoicePDF(
        invoiceElement,
        invoice,
        {
          filename: `Invoice_Verification_${invoice.invoiceId}_${new Date().toISOString().split("T")[0]}.pdf`,
        },
      );

      if (!result.success) {
        alert("PDF download failed. Please try again.");
      }
    } catch (error) {
      console.error("PDF download failed:", error);
      alert("PDF download failed. Please try again.");
    }
  };

  const handleQRScan = () => {
    setShowQRScanner(true);
  };

  const handleQRScanSuccess = (scannedInvoiceId) => {
    setInvoiceId(scannedInvoiceId);
    setShowQRScanner(false);
    // Auto-verify the scanned invoice ID
    handleVerify(scannedInvoiceId);
  };

  const handleQRScanError = (error) => {
    console.error('QR Scan Error:', error);
    setError('Failed to scan QR code. Please try again or enter the invoice ID manually.');
  };

  // Create invoice data for display
  const invoiceData = invoice
    ? {
        invoiceId: invoice.invoiceId || invoice._id,
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
      }
    : null;

  // Cleanup PDF URL on unmount
  useEffect(() => {
    return () => {
      if (pdfUrl) {
        URL.revokeObjectURL(pdfUrl);
      }
    };
  }, [pdfUrl]);

  return (
    <div className="fade-in">
      {/* Professional Hero Section */}
      <PageHeroSection
        title="Invoice Verification"
        subtitle="Verify the authenticity of any invoice by entering the Invoice ID, Order ID, or scanning the QR code"
        iconContext="verification"
      />

      {/* Verification Form Section */}
      <section
        style={{
          background: "#ffffff",
          paddingTop: "60px",
          paddingBottom: "40px",
        }}
      >
        <Container>
          <Row className="justify-content-center">
            <Col lg={8} xl={6}>
              <Card
                style={{
                  border: "2px solid #f8f9fa",
                  borderRadius: "16px",
                  padding: "40px 30px",
                  boxShadow: "0 8px 32px rgba(0,0,0,0.1)",
                }}
              >
                <Card.Body>
                  <div className="text-center mb-4">
                    <div
                      style={{
                        width: "80px",
                        height: "80px",
                        background: "linear-gradient(135deg, #e63946, #dc3545)",
                        borderRadius: "50%",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        margin: "0 auto 20px",
                        color: "white",
                        fontSize: "2rem",
                      }}
                    >
                      <i className="bi bi-shield-check"></i>
                    </div>
                    <h3 style={{ fontWeight: "700", color: "#343a40" }}>
                      Verify Invoice
                    </h3>
                    <p className="text-muted">
                      Enter your Invoice ID or Order ID to verify authenticity
                    </p>
                  </div>

                  <Form
                    onSubmit={(e) => {
                      e.preventDefault();
                      handleVerify();
                    }}
                  >
                    <Row>
                      <Col lg={8}>
                        <InputGroup className="mb-3">
                          <Form.Control
                            type="text"
                            placeholder="Enter Invoice ID or Order ID"
                            value={invoiceId}
                            onChange={(e) => setInvoiceId(e.target.value)}
                            style={{
                              padding: "15px",
                              borderRadius: "12px 0 0 12px",
                              border: "2px solid #e9ecef",
                              fontSize: "1rem",
                            }}
                            disabled={loading}
                          />
                          <Button
                            variant="outline-secondary"
                            onClick={handleQRScan}
                            style={{
                              borderRadius: "0",
                              border: "2px solid #e9ecef",
                              borderLeft: "none",
                              padding: "15px 20px",
                            }}
                            disabled={loading}
                          >
                            <i className="bi bi-qr-code-scan"></i>
                          </Button>
                        </InputGroup>
                      </Col>
                      <Col lg={4}>
                        <Button
                          type="submit"
                          style={{
                            background:
                              "linear-gradient(135deg, #e63946, #dc3545)",
                            border: "none",
                            borderRadius: "12px",
                            padding: "15px 30px",
                            fontWeight: "600",
                            width: "100%",
                            transition: "all 0.3s ease",
                          }}
                          disabled={loading || !invoiceId.trim()}
                          onMouseOver={(e) => {
                            e.target.style.transform = "translateY(-2px)";
                            e.target.style.boxShadow =
                              "0 6px 20px rgba(230, 57, 70, 0.4)";
                          }}
                          onMouseOut={(e) => {
                            e.target.style.transform = "translateY(0)";
                            e.target.style.boxShadow = "none";
                          }}
                        >
                          {loading ? (
                            <>
                              <Spinner
                                animation="border"
                                size="sm"
                                className="me-2"
                              />
                              Verifying...
                            </>
                          ) : (
                            <>
                              <i className="bi bi-search me-2"></i>
                              Verify
                            </>
                          )}
                        </Button>
                      </Col>
                    </Row>
                  </Form>

                  {error && (
                    <Alert variant="danger" className="mt-3">
                      <i className="bi bi-exclamation-triangle me-2"></i>
                      {error}
                    </Alert>
                  )}

                  {verifySuccess && !invoice && (
                    <Alert variant="info" className="mt-3">
                      <Spinner animation="border" size="sm" className="me-2" />
                      Loading invoice details...
                    </Alert>
                  )}
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Container>
      </section>

      {/* Verification Result */}
      {verifySuccess && invoice && (
        <>
          {/* Success Message and Actions */}
          <section
            style={{
              background: "#d4edda",
              paddingTop: "40px",
              paddingBottom: "40px",
              borderTop: "4px solid #28a745",
            }}
          >
            <Container>
              <Row className="justify-content-center text-center">
                <Col lg={8}>
                  <div className="mb-4">
                    <i
                      className="bi bi-check-circle-fill"
                      style={{ fontSize: "4rem", color: "#28a745" }}
                    ></i>
                  </div>
                  <h2 style={{ color: "#155724", fontWeight: "700" }}>
                    ✅ Invoice Verified Successfully!
                  </h2>
                  <p className="lead" style={{ color: "#155724" }}>
                    This invoice is authentic and has been verified against our
                    records.
                  </p>

                  {/* Action Buttons */}
                  <div className="d-flex gap-3 justify-content-center flex-wrap mt-4">
                    <Button
                      variant="success"
                      onClick={handlePrint}
                      disabled={pdfGenerating}
                      style={{
                        fontWeight: "600",
                        borderRadius: "12px",
                        padding: "12px 24px",
                        border: "2px solid #28a745",
                      }}
                    >
                      {pdfGenerating ? (
                        <>
                          <Spinner size="sm" className="me-2" />
                          Generating PDF...
                        </>
                      ) : (
                        <>
                          <i className="bi bi-printer me-2"></i>
                          Print Invoice
                        </>
                      )}
                    </Button>
                    <Button
                      variant="outline-success"
                      onClick={handleDownloadPDF}
                      disabled={!invoice}
                      style={{
                        fontWeight: "600",
                        borderRadius: "12px",
                        padding: "12px 24px",
                        border: "2px solid #28a745",
                      }}
                    >
                      <i className="bi bi-download me-2"></i>
                      Download PDF
                    </Button>
                  </div>
                </Col>
              </Row>
            </Container>
          </section>

          {/* Invoice Details Display */}
          <section
            style={{
              background: "#f8f9fa",
              paddingTop: "60px",
              paddingBottom: "80px",
            }}
          >
            <Container>
              <Row className="justify-content-center">
                <Col lg={10} xl={8}>
                  <div
                    id="verify-invoice-content"
                    style={{
                      background: "white",
                      borderRadius: "12px",
                      padding: "40px",
                      boxShadow: "0 12px 40px rgba(0,0,0,0.15)",
                      border: "1px solid #e9ecef",
                    }}
                  >
                    {/* Invoice Header */}
                    <div
                      style={{
                        background: "linear-gradient(135deg, #e63946, #dc3545)",
                        color: "white",
                        padding: "30px",
                        margin: "-40px -40px 30px -40px",
                        borderRadius: "12px 12px 0 0",
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
                              }}
                            >
                              <img
                                src="https://cdn.builder.io/api/v1/assets/30eb44a11c7b4dd995ed4b1b6b9528c2/hk_bg-dae727?format=webp&width=80"
                                alt="Logo"
                                style={{
                                  width: "60px",
                                  height: "60px",
                                  objectFit: "contain",
                                }}
                              />
                            </div>
                            <div>
                              <h2
                                style={{
                                  fontSize: "1.8rem",
                                  fontWeight: "700",
                                  marginBottom: "5px",
                                }}
                              >
                                Hare Krishna Medical
                              </h2>
                              <p
                                style={{
                                  fontSize: "0.9rem",
                                  marginBottom: "0",
                                  opacity: 0.9,
                                }}
                              >
                                📍 Shop 12, Amroli Char Rasta, Nr. ONGC Circle,
                                Surat
                              </p>
                            </div>
                          </div>
                        </Col>
                        <Col lg={4} className="text-end">
                          <div
                            style={{
                              background: "rgba(255,255,255,0.2)",
                              padding: "20px",
                              borderRadius: "10px",
                            }}
                          >
                            <h3
                              style={{
                                fontSize: "1.5rem",
                                fontWeight: "700",
                                marginBottom: "10px",
                              }}
                            >
                              VERIFIED INVOICE
                            </h3>
                            <p
                              style={{
                                fontSize: "0.9rem",
                                marginBottom: "5px",
                              }}
                            >
                              <strong>#{invoiceData?.invoiceId}</strong>
                            </p>
                            <p
                              style={{
                                fontSize: "0.8rem",
                                marginBottom: "0",
                                opacity: 0.9,
                              }}
                            >
                              {invoiceData?.orderDate} |{" "}
                              {invoiceData?.orderTime}
                            </p>
                          </div>
                        </Col>
                      </Row>
                    </div>

                    {/* Customer Details */}
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
                            style={{
                              color: "#e63946",
                              fontWeight: "600",
                              marginBottom: "15px",
                            }}
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
                            border: "2px solid #28a745",
                            textAlign: "center",
                          }}
                        >
                          <h6
                            style={{
                              color: "#28a745",
                              fontWeight: "600",
                              marginBottom: "15px",
                            }}
                          >
                            <i className="bi bi-shield-check me-2"></i>
                            Verification Status
                          </h6>
                          <Badge
                            bg="success"
                            style={{ fontSize: "1rem", padding: "10px 20px" }}
                          >
                            ✅ VERIFIED
                          </Badge>
                          <p
                            style={{
                              fontSize: "0.8rem",
                              color: "#666",
                              marginTop: "10px",
                              marginBottom: "0",
                            }}
                          >
                            Verified on {new Date().toLocaleDateString("en-IN")}
                          </p>
                        </div>
                      </Col>
                    </Row>

                    {/* Items Table */}
                    <div className="mb-4">
                      <h5
                        style={{
                          color: "#e63946",
                          fontWeight: "600",
                          marginBottom: "15px",
                        }}
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
                              <th style={{ padding: "12px" }}>Item</th>
                              <th style={{ padding: "12px" }}>Qty</th>
                              <th style={{ padding: "12px" }}>Price</th>
                              <th style={{ padding: "12px" }}>Total</th>
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

                    {/* Total and Payment Info */}
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
                            border: "2px solid #28a745",
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
                          <hr />
                          <div
                            className="d-flex justify-content-between"
                            style={{ fontSize: "1.2rem", fontWeight: "bold" }}
                          >
                            <span>Total:</span>
                            <span style={{ color: "#28a745" }}>
                              ₹{invoiceData?.total?.toFixed(2)}
                            </span>
                          </div>
                        </div>
                      </Col>
                    </Row>

                    {/* Footer */}
                    <div
                      style={{
                        borderTop: "2px solid #28a745",
                        marginTop: "30px",
                        paddingTop: "20px",
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
                        ✅ This invoice has been verified and is authentic
                      </p>
                      <p
                        style={{
                          fontSize: "0.8rem",
                          color: "#999",
                          marginBottom: "0",
                        }}
                      >
                        Verified on {new Date().toLocaleString("en-IN")} | For
                        queries: +91 76989 13354 | hkmedicalamroli@gmail.com
                      </p>
                    </div>
          )}
        </>
      )}

      {/* QR Camera Scanner Modal */}
      <QRCameraScanner
        show={showQRScanner}
        onHide={() => setShowQRScanner(false)}
        onScanSuccess={handleQRScanSuccess}
        onScanError={handleQRScanError}
      />
    </div>
  );
};

export default InvoiceVerify;
  );
};

export default InvoiceVerify;