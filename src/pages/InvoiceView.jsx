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
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import "../styles/InvoiceA4.css";

const InvoiceView = () => {
  const { invoiceId } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { isAuthenticated, user } = useSelector((state) => state.auth);
  const [invoice, setInvoice] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [downloading, setDownloading] = useState(false);
  const [qrCode, setQrCode] = useState(null);

  useEffect(() => {
    dispatch(refreshSession());
  }, [dispatch]);

  useEffect(() => {
    if (invoiceId) {
      fetchInvoiceData();
    }
  }, [invoiceId]);

  const fetchInvoiceData = async () => {
    setLoading(true);
    setError("");

    // Check if this is a demo invoice first
    if (isDemoInvoice(invoiceId)) {
      const demoInvoice = getDemoInvoice(invoiceId);
      if (demoInvoice) {
        setInvoice(demoInvoice);
        generateQRCode(invoiceId);
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

  const handlePrint = () => {
    window.print();
  };

  const handleDownloadPDF = async () => {
    setDownloading(true);
    try {
      const invoiceElement = document.getElementById("invoice-content");
      if (!invoiceElement) {
        throw new Error("Invoice content not found");
      }

      // Create canvas from the invoice content
      const canvas = await html2canvas(invoiceElement, {
        scale: 2,
        useCORS: true,
        allowTaint: true,
        backgroundColor: "#ffffff",
        width: 794, // A4 width in pixels at 96 DPI
        height: 1123, // A4 height in pixels at 96 DPI
      });

      // Create PDF
      const pdf = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: "a4",
      });

      const imgWidth = 210; // A4 width in mm
      const imgHeight = 297; // A4 height in mm

      const imgData = canvas.toDataURL("image/png");
      pdf.addImage(imgData, "PNG", 0, 0, imgWidth, imgHeight);

      // Download the PDF
      const fileName = `Invoice_${invoiceId}_${new Date().toISOString().split("T")[0]}.pdf`;
      pdf.save(fileName);
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
                      onClick={fetchInvoiceData}
                    >
                      <i className="bi bi-arrow-clockwise me-2"></i>Try Again
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

  const invoiceData = {
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
  };

  return (
    <div
      className="min-vh-100"
      style={{
        background: "linear-gradient(135deg, #f8f9fa 0%, #ffffff 100%)",
      }}
    >
      {/* Action Header - Hidden in print */}
      <div
        className="no-print py-3"
        style={{
          background: "linear-gradient(135deg, #e63946, #dc3545)",
          boxShadow: "0 2px 10px rgba(230, 57, 70, 0.3)",
        }}
      >
        <Container>
          <Row className="align-items-center">
            <Col md={6}>
              <h4 className="text-white mb-0 fw-bold">
                <i className="bi bi-receipt me-2"></i>
                Invoice {invoiceData.invoiceId}
              </h4>
              <small className="text-white-50">
                Professional Invoice Verification & Download
              </small>
            </Col>
            <Col md={6} className="text-end">
              <Button
                variant="light"
                className="me-2"
                onClick={handlePrint}
                style={{ fontWeight: "600", borderRadius: "8px" }}
              >
                <i className="bi bi-printer me-2"></i>Print
              </Button>
              <Button
                variant="warning"
                onClick={handleDownloadPDF}
                disabled={downloading}
                style={{ fontWeight: "600", borderRadius: "8px" }}
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
            minHeight: "297mm",
            margin: "0 auto",
            background: "white",
            boxShadow: "0 8px 32px rgba(0,0,0,0.1)",
            borderRadius: "8px",
            overflow: "hidden",
          }}
        >
          {/* Company Header */}
          <div
            style={{
              background: "linear-gradient(135deg, #e63946, #dc3545)",
              color: "white",
              padding: "30px",
              position: "relative",
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
                      {invoiceData.invoiceId}
                    </span>
                  </div>
                  <div className="mb-2">
                    <strong>Date:</strong> {invoiceData.orderDate}
                  </div>
                  <div>
                    <strong>Status:</strong>{" "}
                    <Badge
                      bg={
                        invoiceData.paymentStatus === "Completed" ||
                        invoiceData.status === "paid"
                          ? "success"
                          : "warning"
                      }
                    >
                      {invoiceData.paymentStatus ||
                        invoiceData.status ||
                        "Pending"}
                    </Badge>
                  </div>
                </div>
              </Col>
            </Row>
          </div>

          {/* Content Body */}
          <div style={{ padding: "30px" }}>
            {/* Customer Information */}
            <Row className="mb-4">
              <Col lg={6}>
                <div
                  style={{
                    background: "#f8f9fa",
                    padding: "20px",
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
                        {invoiceData.customerDetails.fullName || "Customer"}
                      </strong>
                    </div>
                    <div>{invoiceData.customerDetails.email}</div>
                    <div>{invoiceData.customerDetails.mobile}</div>
                    <div className="mt-2 text-muted">
                      {invoiceData.customerDetails.address && (
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
                    padding: "20px",
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
                      <strong>Method:</strong> {invoiceData.paymentMethod}
                    </div>
                    <div>
                      <strong>Status:</strong>{" "}
                      <Badge
                        bg={
                          invoiceData.paymentStatus === "Completed" ||
                          invoiceData.status === "paid"
                            ? "success"
                            : "warning"
                        }
                      >
                        {invoiceData.paymentStatus ||
                          invoiceData.status ||
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
                        ₹{parseFloat(invoiceData.total || 0).toFixed(2)}
                      </span>
                    </div>
                  </div>
                </div>
              </Col>
            </Row>

            {/* Items Table */}
            <div className="mb-4">
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
                      <th style={{ border: "none", padding: "12px" }}>#</th>
                      <th style={{ border: "none", padding: "12px" }}>
                        Description
                      </th>
                      <th
                        style={{
                          border: "none",
                          padding: "12px",
                          textAlign: "center",
                        }}
                      >
                        Qty
                      </th>
                      <th
                        style={{
                          border: "none",
                          padding: "12px",
                          textAlign: "right",
                        }}
                      >
                        Price
                      </th>
                      <th
                        style={{
                          border: "none",
                          padding: "12px",
                          textAlign: "right",
                        }}
                      >
                        Total
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {invoiceData.items?.map((item, index) => (
                      <tr key={index}>
                        <td style={{ padding: "12px", fontWeight: "600" }}>
                          {index + 1}
                        </td>
                        <td style={{ padding: "12px" }}>
                          <div>
                            <strong>{item.name || item.productName}</strong>
                          </div>
                          {item.description && (
                            <small className="text-muted">
                              {item.description}
                            </small>
                          )}
                        </td>
                        <td
                          style={{
                            padding: "12px",
                            textAlign: "center",
                            fontWeight: "600",
                          }}
                        >
                          {item.quantity}
                        </td>
                        <td
                          style={{
                            padding: "12px",
                            textAlign: "right",
                            fontWeight: "600",
                          }}
                        >
                          ₹{parseFloat(item.price || 0).toFixed(2)}
                        </td>
                        <td
                          style={{
                            padding: "12px",
                            textAlign: "right",
                            fontWeight: "700",
                            color: "#28a745",
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

            {/* Totals and QR Code */}
            <Row>
              <Col lg={6}>
                {qrCode && (
                  <div
                    style={{
                      background: "#f8f9fa",
                      padding: "20px",
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
                        width: "120px",
                        height: "120px",
                        border: "3px solid #e63946",
                        borderRadius: "8px",
                        boxShadow: "0 4px 16px rgba(230, 57, 70, 0.3)",
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
                            padding: "12px 20px",
                            fontWeight: "600",
                            background: "#f8f9fa",
                          }}
                        >
                          Subtotal:
                        </td>
                        <td
                          style={{
                            padding: "12px 20px",
                            textAlign: "right",
                            fontWeight: "600",
                            background: "#f8f9fa",
                          }}
                        >
                          ₹{parseFloat(invoiceData.subtotal || 0).toFixed(2)}
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
                          {invoiceData.shipping === 0
                            ? "FREE"
                            : `₹${parseFloat(invoiceData.shipping).toFixed(2)}`}
                        </td>
                      </tr>
                      <tr>
                        <td
                          style={{
                            padding: "15px 20px",
                            fontWeight: "900",
                            fontSize: "1.1rem",
                            background: "#e63946",
                            color: "white",
                          }}
                        >
                          TOTAL:
                        </td>
                        <td
                          style={{
                            padding: "15px 20px",
                            textAlign: "right",
                            fontWeight: "900",
                            fontSize: "1.2rem",
                            background: "#e63946",
                            color: "white",
                          }}
                        >
                          ₹{parseFloat(invoiceData.total || 0).toFixed(2)}
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </Col>
            </Row>

            {/* Footer */}
            <div
              className="mt-4 pt-3"
              style={{
                borderTop: "2px solid #e9ecef",
                textAlign: "center",
                color: "#666",
                fontSize: "14px",
              }}
            >
              <p style={{ marginBottom: "8px", fontWeight: "600" }}>
                <i
                  className="bi bi-shield-check me-2"
                  style={{ color: "#28a745" }}
                ></i>
                This is a digitally verified invoice and does not require a
                signature.
              </p>
              <p style={{ marginBottom: "0", fontSize: "12px" }}>
                Thank you for choosing Hare Krishna Medical - Your Trusted
                Health Partner
              </p>
              <div
                style={{ fontSize: "10px", color: "#999", marginTop: "10px" }}
              >
                Generated: {new Date().toLocaleString()} | Invoice ID:{" "}
                {invoiceData.invoiceId}
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

      {/* Print Styles */}
      <style jsx>{`
        @media print {
          body * {
            visibility: hidden;
          }
          #invoice-content,
          #invoice-content * {
            visibility: visible;
          }
          #invoice-content {
            position: absolute;
            left: 0;
            top: 0;
            width: 210mm !important;
            height: 297mm !important;
            margin: 0 !important;
            box-shadow: none !important;
            border-radius: 0 !important;
            page-break-inside: avoid;
          }
          .no-print {
            display: none !important;
          }
          @page {
            size: A4;
            margin: 0;
          }
        }

        .invoice-a4 {
          font-family: "Segoe UI", Arial, sans-serif;
          line-height: 1.4;
        }
      `}</style>
    </div>
  );
};

export default InvoiceView;
