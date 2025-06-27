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
  const [isPrinting, setIsPrinting] = useState(false);

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
        width: 120,
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
    setIsPrinting(true);
    const printContent = document.getElementById("letterhead-print-content");
    if (printContent) {
      const printWindow = window.open("", "_blank");
      printWindow.document.write(`
        <!DOCTYPE html>
        <html>
          <head>
            <title>Letterhead ${letterheadId}</title>
            <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">
            <link href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.0/font/bootstrap-icons.css" rel="stylesheet">
            <style>
              @page { 
                size: A4; 
                margin: 15mm; 
                -webkit-print-color-adjust: exact;
                color-adjust: exact;
              }
              @media print {
                body { 
                  margin: 0; 
                  color: black !important; 
                  font-size: 12px; 
                  line-height: 1.4; 
                  -webkit-print-color-adjust: exact;
                  color-adjust: exact;
                  font-family: 'Times New Roman', serif;
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
                  background: white !important;
                }
                .letterhead-header {
                  border-bottom: 3px solid #dc3545 !important;
                  margin-bottom: 20px !important;
                  padding-bottom: 15px !important;
                  -webkit-print-color-adjust: exact;
                  color-adjust: exact;
                }
                .letterhead-footer {
                  border-top: 2px solid #6c757d !important;
                  margin-top: 20px !important;
                  padding-top: 15px !important;
                  -webkit-print-color-adjust: exact;
                  color-adjust: exact;
                }
                .content-section {
                  margin: 15px 0 !important;
                  line-height: 1.8 !important;
                  font-size: 11pt !important;
                }
                .qr-code img {
                  width: 70px !important;
                  height: 70px !important;
                }
                .company-logo {
                  max-height: 50px !important;
                  width: auto !important;
                }
                .document-title {
                  font-size: 18pt !important;
                  font-weight: bold !important;
                  color: #000 !important;
                }
                .company-name {
                  font-size: 16pt !important;
                  color: #dc3545 !important;
                  font-weight: bold !important;
                }
                .bg-light {
                  background-color: #f8f9fa !important;
                  -webkit-print-color-adjust: exact;
                  color-adjust: exact;
                }
                .text-primary { color: #0d6efd !important; }
                .text-success { color: #198754 !important; }
                .text-danger { color: #dc3545 !important; }
                .text-warning { color: #fd7e14 !important; }
                .text-info { color: #0dcaf0 !important; }
                .text-muted { color: #6c757d !important; }
                .border-start { border-left: 4px solid !important; }
                .border-primary { border-color: #0d6efd !important; }
                .border-success { border-color: #198754 !important; }
                .border-danger { border-color: #dc3545 !important; }
                .border-warning { border-color: #fd7e14 !important; }
              }
              .letterhead-container {
                font-family: 'Times New Roman', serif;
                background: white;
                color: black;
              }
              .company-name {
                color: #dc3545;
                font-family: 'Georgia', serif;
                font-weight: bold;
              }
              .document-title {
                font-family: 'Georgia', serif;
                font-weight: bold;
              }
            </style>
          </head>
          <body>
            <div class="letterhead-container">
              ${printContent.innerHTML}
            </div>
          </body>
        </html>
      `);
      printWindow.document.close();

      // Wait for images to load before printing
      printWindow.addEventListener("load", () => {
        setTimeout(() => {
          printWindow.print();
          printWindow.close();
          setIsPrinting(false);
        }, 500);
      });
    }
  };

  const handleDownloadPDF = async () => {
    setIsGeneratingPDF(true);
    try {
      const element = document.getElementById("letterhead-print-content");
      if (!element) return;

      // Create a clone for PDF generation to avoid affecting the original
      const clone = element.cloneNode(true);
      clone.style.width = "794px"; // A4 width in pixels at 96 DPI
      clone.style.background = "white";
      clone.style.padding = "40px";
      clone.style.fontFamily = "'Times New Roman', serif";

      // Temporarily add to DOM for rendering
      clone.style.position = "fixed";
      clone.style.top = "-9999px";
      clone.style.left = "-9999px";
      document.body.appendChild(clone);

      const canvas = await html2canvas(clone, {
        scale: 3, // Higher scale for better quality
        useCORS: true,
        allowTaint: false,
        backgroundColor: "#ffffff",
        width: 794,
        height: clone.scrollHeight,
        scrollX: 0,
        scrollY: 0,
        windowWidth: 794,
        windowHeight: clone.scrollHeight,
      });

      // Remove clone from DOM
      document.body.removeChild(clone);

      const imgData = canvas.toDataURL("image/png", 1.0);
      const pdf = new jsPDF("p", "mm", "a4");

      // A4 dimensions in mm
      const pdfWidth = 210;
      const pdfHeight = 297;
      const imgWidth = pdfWidth - 20; // 10mm margin on each side
      const imgHeight = (canvas.height * imgWidth) / canvas.width;

      let heightLeft = imgHeight;
      let position = 10; // 10mm top margin

      // Add first page
      pdf.addImage(
        imgData,
        "PNG",
        10,
        position,
        imgWidth,
        imgHeight,
        undefined,
        "FAST",
      );
      heightLeft -= pdfHeight - 20; // Account for margins

      // Add additional pages if needed
      while (heightLeft >= 0) {
        position = heightLeft - imgHeight + 10;
        pdf.addPage();
        pdf.addImage(
          imgData,
          "PNG",
          10,
          position,
          imgWidth,
          imgHeight,
          undefined,
          "FAST",
        );
        heightLeft -= pdfHeight - 20;
      }

      // Add metadata
      pdf.setProperties({
        title: `Letterhead - ${title || "Document"}`,
        subject: subject || "Professional Letterhead",
        author: header?.companyName || "Hare Krishna Medical Store",
        creator: "Hare Krishna Medical Store - Letterhead System",
        producer: "HK Medical PDF Generator",
      });

      pdf.save(
        `letterhead-${letterheadId || "preview"}-${new Date().toISOString().split("T")[0]}.pdf`,
      );
    } catch (error) {
      console.error("Error generating PDF:", error);
      alert("Error generating PDF. Please try again.");
    } finally {
      setIsGeneratingPDF(false);
    }
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      draft: { bg: "secondary", icon: "bi-pencil", text: "DRAFT" },
      issued: { bg: "primary", icon: "bi-check-circle", text: "ISSUED" },
      sent: { bg: "success", icon: "bi-send", text: "SENT" },
      archived: { bg: "dark", icon: "bi-archive", text: "ARCHIVED" },
    };

    const config = statusConfig[status] || statusConfig.draft;
    return (
      <Badge bg={config.bg} className="d-flex align-items-center px-3 py-2">
        <i className={`${config.icon} me-2`}></i>
        {config.text}
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

  const renderContent = (content) => {
    if (!content)
      return <p className="text-muted">Content will appear here...</p>;

    return content.split("\n").map((paragraph, index) => {
      if (paragraph.trim().startsWith("•")) {
        return (
          <div
            key={index}
            className="achievement-item d-flex align-items-start mb-2 ms-3"
          >
            <i className="bi bi-check-circle-fill text-success me-3 mt-1 flex-shrink-0"></i>
            <span className="achievement-text">
              {paragraph.trim().substring(1).trim()}
            </span>
          </div>
        );
      }
      return paragraph.trim() ? (
        <p key={index} className="content-paragraph mb-3 text-dark">
          {paragraph}
        </p>
      ) : (
        <div
          key={index}
          className="content-spacing"
          style={{ height: "0.8em" }}
        />
      );
    });
  };

  return (
    <div className={`letterhead-wrapper ${printMode ? "print-mode" : ""}`}>
      {/* Action Buttons */}
      {showActions && !printMode && (
        <div className="action-bar d-flex justify-content-end gap-2 mb-4 no-print">
          <Button
            variant="outline-primary"
            size="sm"
            onClick={handlePrint}
            disabled={isPrinting}
            className="d-flex align-items-center action-btn"
          >
            {isPrinting ? (
              <>
                <div
                  className="spinner-border spinner-border-sm me-2"
                  role="status"
                ></div>
                Preparing...
              </>
            ) : (
              <>
                <i className="bi bi-printer me-2"></i>
                Print A4
              </>
            )}
          </Button>
          <Button
            variant="outline-success"
            size="sm"
            onClick={handleDownloadPDF}
            disabled={isGeneratingPDF}
            className="d-flex align-items-center action-btn"
          >
            {isGeneratingPDF ? (
              <>
                <div
                  className="spinner-border spinner-border-sm me-2"
                  role="status"
                ></div>
                Generating PDF...
              </>
            ) : (
              <>
                <i className="bi bi-download me-2"></i>
                Download PDF
              </>
            )}
          </Button>
        </div>
      )}

      {/* Letterhead Document - A4 Format */}
      <div id="letterhead-print-content" className="letterhead-container">
        <div className="letterhead-document">
          {/* Header Section - Professional Invoice Style */}
          <div className="letterhead-header">
            <Row className="align-items-center header-content">
              <Col md={7} className="company-section">
                <div className="company-info">
                  <div className="d-flex align-items-center mb-2">
                    {header?.logo && (
                      <img
                        src={header.logo}
                        alt="Company Logo"
                        className="company-logo me-3"
                        style={{
                          maxHeight: "60px",
                          width: "auto",
                          objectFit: "contain",
                        }}
                        onError={(e) => {
                          e.target.style.display = "none";
                        }}
                      />
                    )}
                    <div>
                      <h2 className="company-name mb-1">
                        {header?.companyName || "Hare Krishna Medical Store"}
                      </h2>
                      <div className="company-tagline text-muted mb-2">
                        <i className="bi bi-shield-check me-1"></i>
                        Professional Healthcare Services
                      </div>
                    </div>
                  </div>
                  <div className="company-details">
                    <div className="contact-item mb-1">
                      <i className="bi bi-geo-alt me-2 text-primary"></i>
                      <span>
                        {header?.companyAddress ||
                          "123 Main Street, Healthcare District"}
                      </span>
                    </div>
                    <div className="contact-item mb-1">
                      <i className="bi bi-pin-map me-2 text-primary"></i>
                      <span>
                        {header?.companyCity || "Medical City, State 12345"}
                      </span>
                    </div>
                    <div className="contact-row d-flex flex-wrap gap-4">
                      <div className="contact-item">
                        <i className="bi bi-telephone me-2 text-primary"></i>
                        <span>{header?.companyPhone || "+91 98765 43210"}</span>
                      </div>
                      <div className="contact-item">
                        <i className="bi bi-envelope me-2 text-primary"></i>
                        <span>
                          {header?.companyEmail ||
                            "info@harekrishnamedical.com"}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </Col>
              <Col md={5} className="text-end meta-section">
                <div className="document-meta">
                  {qrCodeUrl && (
                    <div className="qr-section mb-3">
                      <img
                        src={qrCodeUrl}
                        alt="Verification QR Code"
                        className="qr-code"
                        style={{ width: "90px", height: "90px" }}
                      />
                      <div className="qr-label small text-muted mt-1">
                        Scan to Verify
                      </div>
                    </div>
                  )}
                  <div className="document-id mb-2">
                    <span className="small text-muted">Document ID:</span>
                    <div className="fw-bold font-monospace text-primary">
                      {letterheadId || "PREVIEW-001"}
                    </div>
                  </div>
                  <div className="issue-date">
                    <span className="small text-muted">Issue Date:</span>
                    <div className="fw-semibold">
                      {formatDate(issueDate || createdAt)}
                    </div>
                  </div>
                </div>
              </Col>
            </Row>
          </div>

          {/* Document Information Bar */}
          <div className="document-info-bar">
            <Row className="align-items-center">
              <Col md={8}>
                <div className="d-flex align-items-center">
                  <div className="document-type me-4">
                    <div className="d-flex align-items-center">
                      <i
                        className={`${getLetterTypeIcon(letterType)} text-primary me-2 fs-5`}
                      ></i>
                      <div>
                        <div className="small text-muted">Document Type</div>
                        <div className="fw-semibold">
                          {letterType?.charAt(0).toUpperCase() +
                            letterType?.slice(1) || "Certificate"}
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="document-status">
                    <div className="small text-muted mb-1">Status</div>
                    {getStatusBadge(status)}
                  </div>
                </div>
              </Col>
              <Col md={4} className="text-end">
                {tags && tags.length > 0 && (
                  <div className="document-tags">
                    <div className="small text-muted mb-1">Tags</div>
                    <div className="tags-list">
                      {tags.slice(0, 3).map((tag, index) => (
                        <Badge
                          key={index}
                          bg="light"
                          text="dark"
                          className="me-1 mb-1 tag-badge"
                        >
                          #{tag}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
              </Col>
            </Row>
          </div>

          {/* Main Content Body */}
          <div className="letterhead-body">
            {/* Document Title */}
            <div className="document-title-section text-center mb-4">
              <h1 className="document-title">
                {title || "Professional Certificate"}
              </h1>
              <div className="title-underline"></div>
            </div>

            {/* Participant Information */}
            <div className="participants-section mb-4">
              <Row className="g-4">
                <Col md={6}>
                  <div className="recipient-card">
                    <div className="card-header">
                      <h6 className="section-title">
                        <i className="bi bi-person-badge me-2"></i>
                        RECIPIENT INFORMATION
                      </h6>
                    </div>
                    <div className="card-content">
                      <div className="recipient-name mb-2">
                        <h5 className="fw-bold text-dark mb-1">
                          {recipient?.name || "Recipient Name"}
                        </h5>
                      </div>
                      {recipient?.designation && (
                        <div className="recipient-detail mb-2">
                          <i className="bi bi-briefcase me-2 text-primary"></i>
                          <span>{recipient.designation}</span>
                        </div>
                      )}
                      {recipient?.organization && (
                        <div className="recipient-detail mb-2">
                          <i className="bi bi-building me-2 text-primary"></i>
                          <span>{recipient.organization}</span>
                        </div>
                      )}
                      {recipient?.address && (
                        <div className="recipient-detail">
                          <i className="bi bi-geo-alt me-2 text-primary"></i>
                          <span className="small text-muted">
                            {recipient.address}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                </Col>
                <Col md={6}>
                  <div className="issuer-card">
                    <div className="card-header">
                      <h6 className="section-title">
                        <i className="bi bi-person-check me-2"></i>
                        ISSUED BY
                      </h6>
                    </div>
                    <div className="card-content">
                      <div className="issuer-name mb-2">
                        <h5 className="fw-bold text-dark mb-1">
                          {issuer?.name || "Issuer Name"}
                        </h5>
                      </div>
                      {issuer?.designation && (
                        <div className="issuer-detail mb-2">
                          <i className="bi bi-award me-2 text-success"></i>
                          <span>{issuer.designation}</span>
                        </div>
                      )}
                      {issuer?.signature && (
                        <div className="signature-section mt-3">
                          <div className="signature-label small text-muted mb-1">
                            Digital Signature:
                          </div>
                          <img
                            src={issuer.signature}
                            alt="Digital Signature"
                            className="signature-image"
                            style={{ maxHeight: "50px", width: "auto" }}
                          />
                        </div>
                      )}
                    </div>
                  </div>
                </Col>
              </Row>
            </div>

            {/* Subject Section */}
            {subject && (
              <div className="subject-section mb-4">
                <div className="subject-card">
                  <div className="subject-header">
                    <h6 className="section-title">
                      <i className="bi bi-chat-square-quote me-2"></i>
                      SUBJECT
                    </h6>
                  </div>
                  <div className="subject-content">
                    <h4 className="subject-text">{subject}</h4>
                  </div>
                </div>
              </div>
            )}

            {/* Content Section */}
            <div className="content-section mb-4">
              <div className="content-body">{renderContent(content)}</div>
            </div>

            {/* Certification & Signature */}
            <div className="certification-section">
              <Row className="align-items-end">
                <Col md={8}>
                  <div className="certification-text">
                    <div className="certification-statement mb-3">
                      <i className="bi bi-shield-check text-success me-2 fs-5"></i>
                      <span className="fw-semibold">
                        This document is officially certified and verified by{" "}
                        {header?.companyName || "Hare Krishna Medical Store"}.
                      </span>
                    </div>
                    <div className="issue-details">
                      <div className="detail-item mb-1">
                        <strong>Issued on:</strong>
                        <span className="ms-2">
                          {formatDate(issueDate || createdAt)}
                        </span>
                      </div>
                      <div className="detail-item">
                        <strong>Document ID:</strong>
                        <span className="ms-2 font-monospace text-primary">
                          {letterheadId || "PREVIEW-001"}
                        </span>
                      </div>
                    </div>
                  </div>
                </Col>
                <Col md={4} className="text-end">
                  <div className="official-seal">
                    <div className="seal-container">
                      <div className="seal-content">
                        <i className="bi bi-award text-danger fs-1"></i>
                        <div className="seal-text">
                          <div className="seal-title">OFFICIAL SEAL</div>
                          <div className="seal-year">
                            {new Date().getFullYear()}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </Col>
              </Row>
            </div>
          </div>

          {/* Footer Section */}
          <div className="letterhead-footer">
            <Row className="align-items-center">
              <Col md={8}>
                <div className="footer-content">
                  <div className="footer-section mb-2">
                    <h6 className="footer-title">
                      <i className="bi bi-shield-check me-2"></i>
                      TERMS & VERIFICATION
                    </h6>
                    <p className="footer-text mb-2">
                      {footer?.terms ||
                        "This is an official document issued by Hare Krishna Medical Store. For verification, please contact us at the above details."}
                    </p>
                    {footer?.additionalInfo && (
                      <p className="footer-additional small text-muted mb-0">
                        <strong>Additional Information:</strong>{" "}
                        {footer.additionalInfo}
                      </p>
                    )}
                  </div>
                </div>
              </Col>
              <Col md={4} className="text-end">
                <div className="verification-info">
                  <div className="verification-section">
                    <h6 className="footer-title small">FOR VERIFICATION</h6>
                    <div className="verification-details small">
                      <div className="verification-item mb-1">
                        <i className="bi bi-qr-code me-1"></i>
                        Scan QR code above
                      </div>
                      <div className="verification-item mb-1">
                        <i className="bi bi-globe me-1"></i>
                        www.harekrishnamedical.com/verify
                      </div>
                      <div className="verification-item">
                        <i className="bi bi-telephone me-1"></i>
                        {header?.companyPhone || "+91 98765 43210"}
                      </div>
                    </div>
                  </div>
                </div>
              </Col>
            </Row>
          </div>
        </div>
      </div>

      {/* Enhanced Styles for Professional A4 Layout */}
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
          max-width: 794px; /* A4 width in pixels at 96 DPI */
          margin: 0 auto;
          background: white;
          box-shadow: 0 8px 32px rgba(0,0,0,0.1);
          border-radius: 8px;
          overflow: hidden;
        }
        
        .letterhead-document {
          padding: 40px;
          font-family: 'Times New Roman', serif;
          line-height: 1.6;
          color: #2c3e50;
        }
        
        /* Header Styles */
        .letterhead-header {
          border-bottom: 4px solid #dc3545;
          padding-bottom: 20px;
          margin-bottom: 25px;
        }
        
        .company-name {
          color: #dc3545;
          font-family: 'Georgia', serif;
          font-size: 1.75rem;
          font-weight: bold;
          margin: 0;
        }
        
        .company-tagline {
          font-size: 0.9rem;
          font-style: italic;
        }
        
        .company-details {
          margin-top: 10px;
        }
        
        .contact-item {
          font-size: 0.9rem;
          color: #495057;
          display: flex;
          align-items: center;
        }
        
        .contact-row {
          margin-top: 8px;
        }
        
        .meta-section {
          border-left: 2px solid #e9ecef;
          padding-left: 20px;
        }
        
        .qr-section {
          text-align: center;
        }
        
        .qr-label {
          font-weight: 500;
        }
        
        /* Document Info Bar */
        .document-info-bar {
          background: #f8f9fa;
          padding: 15px 20px;
          margin: 0 -40px 25px -40px;
          border-left: 4px solid #28a745;
        }
        
        .tag-badge {
          font-size: 0.75rem;
          padding: 4px 8px;
        }
        
        /* Title Section */
        .document-title-section {
          margin: 30px 0 40px 0;
        }
        
        .document-title {
          font-family: 'Georgia', serif;
          font-size: 2.2rem;
          font-weight: bold;
          color: #2c3e50;
          margin: 0;
          position: relative;
          display: inline-block;
        }
        
        .title-underline {
          width: 100px;
          height: 3px;
          background: linear-gradient(90deg, #dc3545, #fd7e14);
          margin: 15px auto 0;
        }
        
        /* Participants Section */
        .participants-section {
          margin: 30px 0;
        }
        
        .recipient-card,
        .issuer-card {
          border: 1px solid #e9ecef;
          border-radius: 8px;
          padding: 20px;
          background: #fafafa;
          height: 100%;
        }
        
        .recipient-card {
          border-left: 4px solid #28a745;
        }
        
        .issuer-card {
          border-left: 4px solid #6f42c1;
        }
        
        .card-header {
          margin-bottom: 15px;
        }
        
        .section-title {
          color: #495057;
          font-weight: 600;
          font-size: 0.85rem;
          letter-spacing: 0.5px;
          margin: 0;
        }
        
        .recipient-name h5,
        .issuer-name h5 {
          color: #2c3e50;
          font-size: 1.25rem;
        }
        
        .recipient-detail,
        .issuer-detail {
          font-size: 0.95rem;
          color: #495057;
          display: flex;
          align-items: center;
        }
        
        /* Subject Section */
        .subject-section {
          margin: 30px 0;
        }
        
        .subject-card {
          background: linear-gradient(135deg, #fff8e1 0%, #f3e5f5 100%);
          border: 1px solid #e1bee7;
          border-radius: 8px;
          padding: 20px;
          border-left: 4px solid #fd7e14;
        }
        
        .subject-text {
          color: #2c3e50;
          font-weight: 600;
          margin: 0;
          font-size: 1.1rem;
        }
        
        /* Content Section */
        .content-section {
          margin: 30px 0;
          padding: 0 10px;
        }
        
        .content-body {
          font-size: 1.05rem;
          line-height: 1.8;
          text-align: justify;
        }
        
        .content-paragraph {
          margin-bottom: 18px;
          color: #2c3e50;
        }
        
        .achievement-item {
          margin: 12px 0;
          padding: 8px 0;
        }
        
        .achievement-text {
          color: #2c3e50;
          font-size: 1rem;
        }
        
        .content-spacing {
          margin: 10px 0;
        }
        
        /* Certification Section */
        .certification-section {
          margin: 40px 0 30px 0;
          padding-top: 25px;
          border-top: 2px solid #e9ecef;
        }
        
        .certification-statement {
          font-size: 1.05rem;
          color: #2c3e50;
          display: flex;
          align-items-flex-start;
        }
        
        .detail-item {
          font-size: 0.95rem;
          color: #495057;
        }
        
        .official-seal {
          margin-top: 10px;
        }
        
        .seal-container {
          border: 2px solid #dc3545;
          border-radius: 50%;
          width: 100px;
          height: 100px;
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 0 auto;
          background: white;
        }
        
        .seal-content {
          text-align: center;
        }
        
        .seal-title {
          font-size: 0.65rem;
          font-weight: bold;
          color: #dc3545;
          line-height: 1;
          margin-top: 5px;
        }
        
        .seal-year {
          font-size: 0.7rem;
          color: #6c757d;
          line-height: 1;
        }
        
        /* Footer Styles */
        .letterhead-footer {
          border-top: 2px solid #6c757d;
          padding-top: 20px;
          margin-top: 30px;
          background: #f8f9fa;
          margin-left: -40px;
          margin-right: -40px;
          margin-bottom: -40px;
          padding-left: 40px;
          padding-right: 40px;
          padding-bottom: 25px;
        }
        
        .footer-title {
          color: #495057;
          font-weight: 600;
          font-size: 0.85rem;
          letter-spacing: 0.5px;
          margin-bottom: 8px;
        }
        
        .footer-text {
          font-size: 0.9rem;
          color: #6c757d;
          line-height: 1.5;
        }
        
        .footer-additional {
          color: #6c757d;
        }
        
        .verification-details {
          color: #6c757d;
        }
        
        .verification-item {
          display: flex;
          align-items: center;
          font-size: 0.85rem;
        }
        
        /* Action Buttons */
        .action-bar {
          position: sticky;
          top: 20px;
          z-index: 1000;
          background: rgba(255, 255, 255, 0.95);
          backdrop-filter: blur(10px);
          padding: 10px 20px;
          border-radius: 8px;
          box-shadow: 0 4px 20px rgba(0,0,0,0.1);
        }
        
        .action-btn {
          transition: all 0.3s ease;
        }
        
        .action-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 15px rgba(0,0,0,0.2);
        }
        
        /* Responsive Design */
        @media (max-width: 768px) {
          .letterhead-container {
            margin: 0 10px;
            max-width: none;
          }
          
          .letterhead-document {
            padding: 20px;
          }
          
          .letterhead-header,
          .letterhead-footer {
            margin-left: -20px;
            margin-right: -20px;
            padding-left: 20px;
            padding-right: 20px;
          }
          
          .letterhead-footer {
            margin-bottom: -20px;
          }
          
          .document-info-bar {
            margin-left: -20px;
            margin-right: -20px;
          }
          
          .document-title {
            font-size: 1.8rem;
          }
          
          .company-name {
            font-size: 1.5rem;
          }
          
          .meta-section {
            border-left: none;
            border-top: 2px solid #e9ecef;
            padding-left: 0;
            padding-top: 15px;
            margin-top: 15px;
          }
          
          .contact-row {
            flex-direction: column;
            gap: 8px !important;
          }
          
          .seal-container {
            width: 80px;
            height: 80px;
          }
          
          .seal-title {
            font-size: 0.6rem;
          }
        }
        
        /* Print Styles */
        @media print {
          .letterhead-wrapper {
            background: white !important;
            padding: 0 !important;
          }
          
          .letterhead-container {
            max-width: none !important;
            margin: 0 !important;
            box-shadow: none !important;
            border-radius: 0 !important;
          }
          
          .letterhead-document {
            padding: 15mm !important;
          }
          
          .no-print {
            display: none !important;
          }
          
          .letterhead-header {
            border-bottom: 3px solid #dc3545 !important;
          }
          
          .letterhead-footer {
            border-top: 2px solid #6c757d !important;
            margin-left: -15mm !important;
            margin-right: -15mm !important;
            margin-bottom: -15mm !important;
            padding-left: 15mm !important;
            padding-right: 15mm !important;
          }
          
          .document-info-bar {
            margin-left: -15mm !important;
            margin-right: -15mm !important;
            padding-left: 15mm !important;
            padding-right: 15mm !important;
          }
          
          .qr-code {
            width: 60px !important;
            height: 60px !important;
          }
          
          .company-logo {
            max-height: 45px !important;
          }
          
          body {
            -webkit-print-color-adjust: exact;
            color-adjust: exact;
          }
        }
      `}</style>
    </div>
  );
};

export default LetterheadDesign;
