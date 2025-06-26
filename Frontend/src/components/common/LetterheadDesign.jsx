import React, { useState, useEffect } from "react";
import { Card, Button, Row, Col } from "react-bootstrap";
import QRCode from "qrcode";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";

const LetterheadDesign = ({
  letterheadData,
  showActions = true,
  printMode = false,
}) => {
  const [qrCodeUrl, setQrCodeUrl] = useState("");

  const {
    letterheadId,
    title,
    letterType,
    recipient,
    subject,
    content,
    issuer,
    header,
    footer,
    issueDate,
    validUntil,
    status,
    qrCode,
    verificationUrl,
    createdAt,
  } = letterheadData;

  useEffect(() => {
    if (qrCode) {
      setQrCodeUrl(qrCode);
    } else if (letterheadId) {
      // Generate QR code if not provided
      generateQRCode();
    }
  }, [letterheadId, qrCode]);

  const generateQRCode = async () => {
    try {
      const verificationUrl = `${window.location.origin}/verify-docs?id=${letterheadId}&type=letterhead`;
      const qrCodeDataUrl = await QRCode.toDataURL(verificationUrl, {
        width: 200,
        margin: 2,
        color: {
          dark: "#1a202c",
          light: "#ffffff",
        },
        errorCorrectionLevel: "M",
      });
      setQrCodeUrl(qrCodeDataUrl);
    } catch (error) {
      console.error("QR Code generation error:", error);
    }
  };

  const handlePrint = () => {
    if (printMode) {
      window.print();
    } else {
      const printContent = document.getElementById("letterhead-print-content");
      if (printContent) {
        const newWindow = window.open("", "_blank");
        newWindow.document.write(`
          <!DOCTYPE html>
          <html>
            <head>
              <title>Official Letterhead ${letterheadId}</title>
              <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">
              <style>
                @page {
                  size: A4;
                  margin: 0.5in;
                }
                body {
                  font-family: 'Arial', sans-serif;
                  line-height: 1.6;
                  color: #333;
                  margin: 0;
                  padding: 0;
                }
                .letterhead-container {
                  max-width: 800px;
                  margin: 0 auto;
                  background: white;
                  min-height: 297mm;
                  padding: 20px;
                  box-shadow: none;
                }
                .letterhead-header {
                  border-bottom: 3px solid #e63946;
                  padding-bottom: 20px;
                  margin-bottom: 30px;
                  position: relative;
                }
                .letterhead-footer {
                  border-top: 2px solid #e63946;
                  padding-top: 15px;
                  margin-top: 40px;
                  font-size: 12px;
                }
                .letterhead-content {
                  margin: 25px 0;
                  line-height: 1.8;
                }
                .qr-code {
                  position: absolute;
                  top: 10px;
                  right: 0;
                }
                @media print {
                  .no-print { display: none !important; }
                  body { print-color-adjust: exact; -webkit-print-color-adjust: exact; }
                }
              </style>
            </head>
            <body onload="window.print(); window.close();">
              ${printContent.innerHTML}
            </body>
          </html>
        `);
        newWindow.document.close();
      }
    }
  };

  const handleDownload = async () => {
    try {
      const element = document.getElementById("letterhead-print-content");
      if (!element) return;

      const canvas = await html2canvas(element, {
        scale: 2,
        useCORS: true,
        allowTaint: true,
        backgroundColor: "#ffffff",
      });

      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF("p", "mm", "a4");
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

      pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
      pdf.save(`letterhead-${letterheadId}.pdf`);
    } catch (error) {
      console.error("Download error:", error);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const getStatusColor = (status) => {
    const colors = {
      draft: "#6c757d",
      issued: "#198754",
      sent: "#0d6efd",
      archived: "#343a40",
    };
    return colors[status] || "#6c757d";
  };

  return (
    <div
      className="letterhead-design"
      style={{ direction: "ltr", textAlign: "left" }}
    >
      <style jsx>{`
        .letterhead-design {
          direction: ltr;
          text-align: left;
          font-family: "Arial", sans-serif;
        }
        .letterhead-container {
          direction: ltr !important;
          text-align: left !important;
          max-width: 800px;
          margin: 0 auto;
          background: white;
          border-radius: 8px;
          overflow: hidden;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        }
        .letterhead-header {
          background: linear-gradient(135deg, #e63946 0%, #dc3545 100%);
          color: white;
          padding: 30px;
          position: relative;
          text-align: center;
        }
        .company-logo {
          width: 60px;
          height: 60px;
          object-fit: contain;
          margin-bottom: 15px;
        }
        .company-info {
          text-align: center;
        }
        .company-name {
          font-size: 28px;
          font-weight: bold;
          margin-bottom: 10px;
          text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.1);
        }
        .company-details {
          font-size: 14px;
          opacity: 0.95;
          line-height: 1.6;
        }
        .qr-code {
          position: absolute;
          top: 15px;
          right: 15px;
          background: white;
          padding: 8px;
          border-radius: 8px;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        }
        .qr-code img {
          width: 80px;
          height: 80px;
          display: block;
        }
        .letterhead-meta {
          margin: 25px 30px;
          padding: 20px;
          background: #f8f9fa;
          border-radius: 8px;
          border-left: 4px solid #e63946;
        }
        .meta-row {
          display: flex;
          justify-content: space-between;
          margin-bottom: 10px;
        }
        .meta-row:last-child {
          margin-bottom: 0;
        }
        .meta-label {
          font-weight: 600;
          color: #495057;
          min-width: 120px;
        }
        .meta-value {
          color: #212529;
          flex: 1;
          text-align: right;
        }
        .letterhead-content {
          margin: 30px;
          line-height: 1.8;
          font-size: 16px;
          color: #212529;
        }
        .content-section {
          margin-bottom: 25px;
        }
        .subject-line {
          font-weight: bold;
          font-size: 18px;
          color: #e63946;
          margin-bottom: 20px;
          text-decoration: underline;
        }
        .recipient-info {
          margin-bottom: 25px;
          padding: 15px;
          background: #f1f3f4;
          border-radius: 6px;
        }
        .content-text {
          text-align: justify;
          margin-bottom: 30px;
        }
        .issuer-section {
          margin-top: 40px;
          text-align: right;
        }
        .signature {
          margin: 20px 0;
        }
        .signature img {
          max-width: 150px;
          max-height: 80px;
          object-fit: contain;
        }
        .letterhead-footer {
          border-top: 3px solid #e63946;
          padding: 25px 30px;
          background: #f8f9fa;
          font-size: 12px;
          color: #6c757d;
        }
        .footer-section {
          margin-bottom: 15px;
        }
        .footer-section:last-child {
          margin-bottom: 0;
        }
        .verification-info {
          text-align: center;
          padding: 15px;
          background: #e7f3ff;
          border-radius: 6px;
          margin-bottom: 15px;
        }
        .btn-letterhead {
          background: linear-gradient(135deg, #e63946 0%, #dc3545 100%);
          border: none;
          color: white;
          padding: 12px 24px;
          border-radius: 6px;
          font-weight: 500;
          transition: all 0.3s ease;
        }
        .btn-letterhead:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 8px rgba(230, 57, 70, 0.3);
          color: white;
        }
        .btn-outline-letterhead {
          background: transparent;
          border: 2px solid #e63946;
          color: #e63946;
          padding: 10px 22px;
          border-radius: 6px;
          font-weight: 500;
          transition: all 0.3s ease;
        }
        .btn-outline-letterhead:hover {
          background: #e63946;
          color: white;
          transform: translateY(-1px);
        }
        .status-badge {
          display: inline-block;
          padding: 4px 12px;
          border-radius: 20px;
          font-size: 12px;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }
        @media print {
          .letterhead-design {
            direction: ltr !important;
          }
          .letterhead-container {
            direction: ltr !important;
            box-shadow: none;
            max-width: none;
          }
          .letterhead-content {
            direction: ltr !important;
            text-align: justify;
          }
          .no-print {
            display: none !important;
          }
        }
      `}</style>

      {showActions && !printMode && (
        <div className="text-center mb-4 no-print">
          <div className="d-flex gap-3 justify-content-center">
            <button className="btn btn-letterhead" onClick={handlePrint}>
              <i className="bi bi-printer me-2"></i>
              Print Letterhead
            </button>
            <button
              className="btn btn-outline-letterhead"
              onClick={handleDownload}
            >
              <i className="bi bi-download me-2"></i>
              Download PDF
            </button>
          </div>
          <div className="mt-2">
            <small className="text-muted">
              <i className="bi bi-info-circle me-1"></i>
              Professional letterhead document with QR verification
            </small>
          </div>
        </div>
      )}

      {/* Letterhead Content */}
      <div id="letterhead-print-content" className="letterhead-container">
        {/* Header with Company Info and QR Code */}
        <div className="letterhead-header">
          {/* QR Code positioned at top-right */}
          {qrCodeUrl && (
            <div className="qr-code">
              <img src={qrCodeUrl} alt="Verification QR Code" />
            </div>
          )}

          {/* Company Logo */}
          {header?.logo && (
            <img
              src={header.logo}
              alt="Company Logo"
              className="company-logo"
            />
          )}

          {/* Company Information */}
          <div className="company-info">
            <div className="company-name">
              {header?.companyName || "Hare Krishna Medical Store"}
            </div>
            <div className="company-details">
              <div>
                {header?.companyAddress ||
                  "123 Main Street, Healthcare District"}
              </div>
              <div>{header?.companyCity || "Medical City, State 12345"}</div>
              <div>
                <i className="bi bi-telephone me-1"></i>
                {header?.companyPhone || "+91 98765 43210"} |
                <i className="bi bi-envelope ms-2 me-1"></i>
                {header?.companyEmail || "info@harekrishnamedical.com"}
              </div>
            </div>
          </div>
        </div>

        {/* Document Meta Information */}
        <div className="letterhead-meta">
          <Row>
            <Col md={6}>
              <div className="meta-row">
                <span className="meta-label">Letterhead ID:</span>
                <span className="meta-value">
                  <strong>{letterheadId}</strong>
                </span>
              </div>
              <div className="meta-row">
                <span className="meta-label">Type:</span>
                <span className="meta-value">
                  {letterType?.charAt(0).toUpperCase() + letterType?.slice(1)}
                </span>
              </div>
              <div className="meta-row">
                <span className="meta-label">Issue Date:</span>
                <span className="meta-value">
                  {formatDate(issueDate || createdAt)}
                </span>
              </div>
            </Col>
            <Col md={6}>
              <div className="meta-row">
                <span className="meta-label">Status:</span>
                <span className="meta-value">
                  <span
                    className="status-badge"
                    style={{
                      backgroundColor: getStatusColor(status),
                      color: "white",
                    }}
                  >
                    {status}
                  </span>
                </span>
              </div>
              {validUntil && (
                <div className="meta-row">
                  <span className="meta-label">Valid Until:</span>
                  <span className="meta-value">{formatDate(validUntil)}</span>
                </div>
              )}
            </Col>
          </Row>
        </div>

        {/* Letter Content */}
        <div className="letterhead-content">
          {/* Title */}
          <div className="content-section">
            <h2
              style={{
                textAlign: "center",
                color: "#e63946",
                marginBottom: "30px",
                fontWeight: "bold",
                textDecoration: "underline",
              }}
            >
              {title}
            </h2>
          </div>

          {/* Recipient Information */}
          {recipient?.name && (
            <div className="recipient-info">
              <strong>To:</strong>
              <div style={{ marginTop: "8px" }}>
                <div style={{ fontWeight: "600", fontSize: "16px" }}>
                  {recipient.name}
                </div>
                {recipient.designation && <div>{recipient.designation}</div>}
                {recipient.organization && <div>{recipient.organization}</div>}
                {recipient.address && (
                  <div style={{ marginTop: "5px", fontSize: "14px" }}>
                    {recipient.address}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Subject */}
          <div className="content-section">
            <div className="subject-line">
              <strong>Subject: {subject}</strong>
            </div>
          </div>

          {/* Main Content */}
          <div className="content-text">
            {content?.split("\n").map((paragraph, index) => (
              <p key={index} style={{ marginBottom: "15px" }}>
                {paragraph}
              </p>
            ))}
          </div>

          {/* Issuer/Signature Section */}
          <div className="issuer-section">
            <div>
              <strong>Sincerely,</strong>
            </div>

            {issuer?.signature && (
              <div className="signature">
                <img src={issuer.signature} alt="Signature" />
              </div>
            )}

            <div style={{ marginTop: "10px" }}>
              <div style={{ fontWeight: "600", fontSize: "16px" }}>
                {issuer?.name}
              </div>
              <div style={{ color: "#6c757d" }}>{issuer?.designation}</div>
              <div style={{ fontSize: "14px", color: "#6c757d" }}>
                {header?.companyName || "Hare Krishna Medical Store"}
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="letterhead-footer">
          {/* Verification Information */}
          <div className="verification-info">
            <div style={{ fontWeight: "600", marginBottom: "5px" }}>
              <i className="bi bi-shield-check text-success me-1"></i>
              Document Verification
            </div>
            <div style={{ fontSize: "11px" }}>
              This letterhead can be verified by scanning the QR code above or
              visiting:
            </div>
            <div
              style={{
                fontFamily: "monospace",
                fontSize: "10px",
                marginTop: "5px",
                wordBreak: "break-all",
              }}
            >
              {window.location.origin}/verify-docs?id={letterheadId}
              &type=letterhead
            </div>
          </div>

          {/* Footer Terms */}
          <div className="footer-section">
            <div style={{ fontWeight: "600", marginBottom: "5px" }}>
              Terms & Conditions:
            </div>
            <div style={{ fontSize: "11px", lineHeight: "1.4" }}>
              {footer?.terms}
            </div>
          </div>

          {/* Additional Footer Info */}
          {footer?.additionalInfo && (
            <div className="footer-section">
              <div style={{ fontSize: "11px", lineHeight: "1.4" }}>
                {footer.additionalInfo}
              </div>
            </div>
          )}

          {/* Digital Verification Notice */}
          <div
            style={{
              textAlign: "center",
              marginTop: "15px",
              padding: "10px",
              background: "#fff3cd",
              borderRadius: "4px",
              fontSize: "11px",
            }}
          >
            <i className="bi bi-globe me-1"></i>
            <strong>Digital Verification:</strong> This letterhead can be
            verified at:{" "}
            <span style={{ fontFamily: "monospace" }}>
              {window.location.origin}/verify-docs?id={letterheadId}
              &type=letterhead
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LetterheadDesign;
