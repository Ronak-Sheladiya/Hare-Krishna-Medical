import React, { useState, useEffect } from "react";
import { Card, Button, Row, Col, Badge } from "react-bootstrap";
import QRCode from "qrcode";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";

const LetterheadDesign = ({
  letterheadData,
  showActions = true,
  printMode = false,
}) => {
  const [qrCodeUrl, setQrCodeUrl] = useState("");
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);

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
    tags,
  } = letterheadData;

  useEffect(() => {
    if (qrCode) {
      setQrCodeUrl(qrCode);
    } else if (letterheadId) {
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
      });
      setQrCodeUrl(qrCodeDataUrl);
    } catch (error) {
      console.error("Error generating QR code:", error);
    }
  };

  const handlePrint = () => {
    const printContent = document.getElementById("letterhead-print-content");
    if (printContent) {
      const printWindow = window.open("", "_blank");
      printWindow.document.write(`
        <!DOCTYPE html>
        <html>
          <head>
            <title>Letterhead ${letterheadId}</title>
            <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">
            <style>
              @page { size: A4; margin: 15mm; }
              @media print {
                body { 
                  margin: 0; 
                  color: black !important; 
                  font-size: 12px; 
                  line-height: 1.4; 
                  -webkit-print-color-adjust: exact; 
                }
                .no-print { display: none !important; }
                .print-break { page-break-before: always; }
                .letterhead-container { 
                  width: 100% !important; 
                  max-width: none !important; 
                  margin: 0 !important;
                  padding: 0 !important;
                  box-shadow: none !important;
                  border: none !important;
                }
                .letterhead-header {
                  border-bottom: 3px solid #dc3545 !important;
                  margin-bottom: 20px !important;
                }
                .letterhead-footer {
                  border-top: 2px solid #6c757d !important;
                  margin-top: 20px !important;
                  padding-top: 15px !important;
                }
                .content-section {
                  margin: 15px 0 !important;
                  line-height: 1.6 !important;
                }
                .qr-code img {
                  width: 80px !important;
                  height: 80px !important;
                }
              }
            </style>
          </head>
          <body>
            ${printContent.innerHTML}
          </body>
        </html>
      `);
      printWindow.document.close();
      printWindow.print();
    }
  };

  const handleDownloadPDF = async () => {
    setIsGeneratingPDF(true);
    try {
      const element = document.getElementById("letterhead-print-content");
      if (!element) return;

      const canvas = await html2canvas(element, {
        scale: 2,
        useCORS: true,
        allowTaint: false,
        backgroundColor: "#ffffff",
        width: element.scrollWidth,
        height: element.scrollHeight,
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

      pdf.save(`letterhead-${letterheadId || "preview"}.pdf`);
    } catch (error) {
      console.error("Error generating PDF:", error);
      alert("Error generating PDF. Please try again.");
    } finally {
      setIsGeneratingPDF(false);
    }
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      draft: { bg: "secondary", icon: "bi-pencil" },
      issued: { bg: "primary", icon: "bi-check-circle" },
      sent: { bg: "success", icon: "bi-send" },
      archived: { bg: "dark", icon: "bi-archive" },
    };

    const config = statusConfig[status] || statusConfig.draft;
    return (
      <Badge bg={config.bg} className="d-flex align-items-center">
        <i className={`${config.icon} me-1`}></i>
        {status?.toUpperCase() || "DRAFT"}
      </Badge>
    );
  };

  const getLetterTypeIcon = (type) => {
    const typeConfig = {
      certificate: "bi-award",
      recommendation: "bi-hand-thumbs-up",
      authorization: "bi-check-circle",
      notice: "bi-megaphone",
      announcement: "bi-broadcast",
      invitation: "bi-envelope-heart",
      acknowledgment: "bi-chat-square-text",
      verification: "bi-shield-check",
    };
    return typeConfig[type] || "bi-file-earmark-text";
  };

  const formatDate = (dateString) => {
    if (!dateString) return new Date().toLocaleDateString();
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <div className={`letterhead-wrapper ${printMode ? "print-mode" : ""}`}>
      {/* Action Buttons */}
      {showActions && !printMode && (
        <div className="d-flex justify-content-end gap-2 mb-3 no-print">
          <Button
            variant="outline-primary"
            size="sm"
            onClick={handlePrint}
            className="d-flex align-items-center"
          >
            <i className="bi bi-printer me-1"></i>
            Print
          </Button>
          <Button
            variant="outline-success"
            size="sm"
            onClick={handleDownloadPDF}
            disabled={isGeneratingPDF}
            className="d-flex align-items-center"
          >
            {isGeneratingPDF ? (
              <>
                <div
                  className="spinner-border spinner-border-sm me-1"
                  role="status"
                ></div>
                Generating...
              </>
            ) : (
              <>
                <i className="bi bi-download me-1"></i>
                Download PDF
              </>
            )}
          </Button>
        </div>
      )}

      {/* Letterhead Document */}
      <div id="letterhead-print-content" className="letterhead-container">
        <Card
          className="shadow-lg border-0"
          style={{ maxWidth: "21cm", margin: "0 auto" }}
        >
          <Card.Body className="p-0">
            {/* Header Section - Invoice Style */}
            <div
              className="letterhead-header bg-white p-4"
              style={{ borderBottom: "4px solid #dc3545" }}
            >
              <Row className="align-items-center">
                <Col md={8}>
                  <div className="company-info">
                    <h2
                      className="fw-bold text-dark mb-1"
                      style={{ fontSize: "1.8rem" }}
                    >
                      {header?.companyName || "Hare Krishna Medical Store"}
                    </h2>
                    <p
                      className="text-muted mb-1"
                      style={{ fontSize: "0.95rem" }}
                    >
                      <i className="bi bi-geo-alt me-1"></i>
                      {header?.companyAddress ||
                        "123 Main Street, Healthcare District"}
                    </p>
                    <p
                      className="text-muted mb-1"
                      style={{ fontSize: "0.95rem" }}
                    >
                      <i className="bi bi-pin-map me-1"></i>
                      {header?.companyCity || "Medical City, State 12345"}
                    </p>
                    <div className="d-flex gap-3">
                      <span
                        className="text-muted"
                        style={{ fontSize: "0.9rem" }}
                      >
                        <i className="bi bi-telephone me-1"></i>
                        {header?.companyPhone || "+91 98765 43210"}
                      </span>
                      <span
                        className="text-muted"
                        style={{ fontSize: "0.9rem" }}
                      >
                        <i className="bi bi-envelope me-1"></i>
                        {header?.companyEmail || "info@harekrishnamedical.com"}
                      </span>
                    </div>
                  </div>
                </Col>
                <Col md={4} className="text-end">
                  <div className="letterhead-meta">
                    {header?.logo && (
                      <img
                        src={header.logo}
                        alt="Company Logo"
                        className="mb-2"
                        style={{ maxHeight: "60px", width: "auto" }}
                      />
                    )}
                    <div className="qr-code">
                      {qrCodeUrl && (
                        <img
                          src={qrCodeUrl}
                          alt="Verification QR Code"
                          style={{ width: "100px", height: "100px" }}
                          className="border rounded"
                        />
                      )}
                    </div>
                  </div>
                </Col>
              </Row>
            </div>

            {/* Document Information */}
            <div className="document-info bg-light p-3">
              <Row>
                <Col md={6}>
                  <div className="document-details">
                    <h6 className="text-muted mb-1 fw-semibold">
                      DOCUMENT INFORMATION
                    </h6>
                    <p className="mb-1">
                      <strong>Document ID:</strong>
                      <span className="ms-2 font-monospace text-primary">
                        {letterheadId || "PREVIEW-001"}
                      </span>
                    </p>
                    <p className="mb-1">
                      <strong>Document Type:</strong>
                      <span className="ms-2">
                        <i
                          className={`${getLetterTypeIcon(letterType)} me-1`}
                        ></i>
                        {letterType?.charAt(0).toUpperCase() +
                          letterType?.slice(1) || "Certificate"}
                      </span>
                    </p>
                    <p className="mb-1">
                      <strong>Issue Date:</strong>
                      <span className="ms-2">
                        {formatDate(issueDate || createdAt)}
                      </span>
                    </p>
                  </div>
                </Col>
                <Col md={6} className="text-end">
                  <div className="status-info">
                    <h6 className="text-muted mb-2 fw-semibold">STATUS</h6>
                    {getStatusBadge(status)}
                    {tags && tags.length > 0 && (
                      <div className="mt-2">
                        {tags.slice(0, 3).map((tag, index) => (
                          <Badge
                            key={index}
                            bg="outline-secondary"
                            className="me-1 mb-1"
                          >
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    )}
                  </div>
                </Col>
              </Row>
            </div>

            {/* Main Content */}
            <div className="letterhead-body p-4">
              {/* Title */}
              <div className="text-center mb-4">
                <h1
                  className="fw-bold text-dark mb-3"
                  style={{
                    fontSize: "2rem",
                    borderBottom: "2px solid #dc3545",
                    paddingBottom: "10px",
                    display: "inline-block",
                  }}
                >
                  {title || "Professional Certificate"}
                </h1>
              </div>

              {/* Recipient Information */}
              <div className="recipient-section mb-4">
                <Row>
                  <Col md={6}>
                    <div className="recipient-info border-start border-4 border-primary ps-3">
                      <h6 className="text-muted mb-2 fw-semibold">TO:</h6>
                      <h5 className="fw-bold text-dark mb-1">
                        {recipient?.name || "Recipient Name"}
                      </h5>
                      {recipient?.designation && (
                        <p className="mb-1 text-muted">
                          <i className="bi bi-briefcase me-1"></i>
                          {recipient.designation}
                        </p>
                      )}
                      {recipient?.organization && (
                        <p className="mb-1 text-muted">
                          <i className="bi bi-building me-1"></i>
                          {recipient.organization}
                        </p>
                      )}
                      {recipient?.address && (
                        <p className="mb-0 text-muted small">
                          <i className="bi bi-geo-alt me-1"></i>
                          {recipient.address}
                        </p>
                      )}
                    </div>
                  </Col>
                  <Col md={6}>
                    <div className="issuer-info border-start border-4 border-success ps-3">
                      <h6 className="text-muted mb-2 fw-semibold">FROM:</h6>
                      <h5 className="fw-bold text-dark mb-1">
                        {issuer?.name || "Issuer Name"}
                      </h5>
                      {issuer?.designation && (
                        <p className="mb-1 text-muted">
                          <i className="bi bi-award me-1"></i>
                          {issuer.designation}
                        </p>
                      )}
                      {issuer?.signature && (
                        <div className="signature mt-2">
                          <img
                            src={issuer.signature}
                            alt="Digital Signature"
                            style={{ maxHeight: "40px", width: "auto" }}
                          />
                        </div>
                      )}
                    </div>
                  </Col>
                </Row>
              </div>

              {/* Subject */}
              {subject && (
                <div className="subject-section mb-4">
                  <div className="bg-light p-3 rounded border-start border-4 border-warning">
                    <h6 className="text-muted mb-1 fw-semibold">SUBJECT:</h6>
                    <h4 className="fw-semibold text-dark mb-0">{subject}</h4>
                  </div>
                </div>
              )}

              {/* Content */}
              <div className="content-section">
                <div
                  className="content-text"
                  style={{
                    fontSize: "1.1rem",
                    lineHeight: "1.8",
                    textAlign: "justify",
                    textJustify: "inter-word",
                  }}
                >
                  {content ? (
                    content.split("\n").map((paragraph, index) => {
                      if (paragraph.trim().startsWith("•")) {
                        return (
                          <div key={index} className="ms-3 mb-2">
                            <i className="bi bi-check-circle text-success me-2"></i>
                            {paragraph.trim().substring(1).trim()}
                          </div>
                        );
                      }
                      return paragraph.trim() ? (
                        <p key={index} className="mb-3 text-dark">
                          {paragraph}
                        </p>
                      ) : (
                        <br key={index} />
                      );
                    })
                  ) : (
                    <p className="text-muted">Content will appear here...</p>
                  )}
                </div>
              </div>

              {/* Signature Section */}
              <div className="signature-section mt-5 mb-4">
                <Row>
                  <Col md={8}>
                    <div className="certification-text">
                      <p className="mb-2 fw-semibold text-dark">
                        <i className="bi bi-shield-check text-success me-2"></i>
                        This document is officially certified and verified.
                      </p>
                      <p className="small text-muted mb-0">
                        Issued on:{" "}
                        <strong>{formatDate(issueDate || createdAt)}</strong>
                      </p>
                    </div>
                  </Col>
                  <Col md={4} className="text-end">
                    <div className="official-seal">
                      <div className="border border-2 border-danger rounded p-3 d-inline-block">
                        <div className="text-center">
                          <i className="bi bi-award text-danger fs-3"></i>
                          <div className="small fw-bold text-danger mt-1">
                            OFFICIAL SEAL
                          </div>
                          <div className="small text-muted">
                            {new Date().getFullYear()}
                          </div>
                        </div>
                      </div>
                    </div>
                  </Col>
                </Row>
              </div>
            </div>

            {/* Footer Section */}
            <div
              className="letterhead-footer bg-light p-3"
              style={{ borderTop: "2px solid #6c757d" }}
            >
              <Row className="align-items-center">
                <Col md={8}>
                  <div className="footer-content">
                    <h6 className="text-muted mb-2 fw-semibold">
                      TERMS & VERIFICATION
                    </h6>
                    <p className="small text-muted mb-1">
                      {footer?.terms ||
                        "This is an official document issued by Hare Krishna Medical Store."}
                    </p>
                    {footer?.additionalInfo && (
                      <p className="small text-muted mb-0">
                        <strong>Additional Information:</strong>{" "}
                        {footer.additionalInfo}
                      </p>
                    )}
                  </div>
                </Col>
                <Col md={4} className="text-end">
                  <div className="verification-info">
                    <p className="small text-muted mb-1">
                      <strong>For Verification:</strong>
                    </p>
                    <p className="small text-muted mb-1">
                      Scan QR code or visit our website
                    </p>
                    <p className="small text-muted mb-0">
                      <i className="bi bi-globe me-1"></i>
                      www.harekrishnamedical.com/verify
                    </p>
                  </div>
                </Col>
              </Row>
            </div>
          </Card.Body>
        </Card>
      </div>

      {/* Custom Styles */}
      <style>{`
        .letterhead-wrapper {
          background: #f8f9fa;
          min-height: 100vh;
          padding: 20px 0;
        }
        
        .print-mode {
          background: white !important;
          padding: 0 !important;
        }
        
        .letterhead-container {
          max-width: 21cm;
          margin: 0 auto;
          background: white;
        }
        
        .company-info h2 {
          color: #dc3545;
          font-family: 'Georgia', serif;
        }
        
        .content-text {
          font-family: 'Times New Roman', serif;
        }
        
        .font-monospace {
          font-family: 'Courier New', monospace;
        }
        
        .border-start {
          border-left-width: 4px !important;
        }
        
        .signature-section {
          border-top: 1px solid #dee2e6;
          padding-top: 20px;
        }
        
        @media print {
          .letterhead-wrapper {
            background: white !important;
            padding: 0 !important;
            margin: 0 !important;
          }
          
          .letterhead-container {
            max-width: none !important;
            margin: 0 !important;
            box-shadow: none !important;
          }
          
          .no-print {
            display: none !important;
          }
        }
        
        @media (max-width: 768px) {
          .letterhead-container {
            margin: 0 10px;
          }
          
          .letterhead-header,
          .letterhead-body,
          .letterhead-footer {
            padding: 15px !important;
          }
          
          .content-text {
            font-size: 1rem !important;
          }
        }
      `}</style>
    </div>
  );
};

export default LetterheadDesign;
