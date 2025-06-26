import React from "react";
import QRCode from "qrcode";

const OfficialLetterheadDesign = ({
  letterheadData,
  qrCode,
  forPrint = false,
  onPrint,
  onDownload,
  showActionButtons = true,
}) => {
  const {
    letterId,
    letterType,
    title,
    context,
    recipient,
    subject,
    content,
    header,
    footer,
    host,
    status,
    createdAt,
  } = letterheadData;

  // Generate QR code if not provided
  const [qrCodeUrl, setQrCodeUrl] = React.useState(qrCode);

  React.useEffect(() => {
    if (!qrCode && letterId) {
      const generateQRCode = async () => {
        try {
          const verificationUrl = `${window.location.origin}/verify-docs?id=${letterId}&type=letterhead`;
          const qrCodeDataUrl = await QRCode.toDataURL(verificationUrl, {
            width: 120,
            margin: 2,
            color: {
              dark: "#e63946",
              light: "#ffffff",
            },
            errorCorrectionLevel: "M",
          });
          setQrCodeUrl(qrCodeDataUrl);
        } catch (error) {
          console.error("QR Code generation error:", error);
        }
      };
      generateQRCode();
    }
  }, [qrCode, letterId]);

  const getContextPrefix = (context) => {
    switch (context) {
      case "respected":
        return "Respected";
      case "dear":
        return "Dear";
      case "to_whom_it_may_concern":
        return "To Whom It May Concern";
      default:
        return "Respected";
    }
  };

  const getRecipientName = () => {
    const parts = [recipient.prefix, recipient.firstName];
    if (recipient.middleName) {
      parts.push(recipient.middleName);
    }
    parts.push(recipient.lastName);
    return parts.join(" ");
  };

  const handlePrint = () => {
    if (onPrint) {
      onPrint();
    } else {
      const printContent = document.getElementById("letterhead-print-content");
      if (printContent) {
        const printWindow = window.open("", "_blank");
        printWindow.document.write(`
          <!DOCTYPE html>
          <html>
            <head>
              <title>Official Letterhead ${letterId}</title>
              <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">
              <style>
                @page {
                  size: A4;
                  margin: 15mm 20mm 20mm 20mm;
                }
                @media print {
                  * { -webkit-print-color-adjust: exact !important; print-color-adjust: exact !important; }
                  body {
                    margin: 0;
                    padding: 0;
                    color: black !important;
                    font-size: 12px;
                    line-height: 1.5;
                    font-family: 'Times New Roman', Times, serif;
                    direction: ltr;
                    text-align: left;
                  }
                  .no-print { display: none !important; }
                  .letterhead-container {
                    padding: 0;
                    margin: 0;
                    width: 100%;
                    direction: ltr;
                    text-align: left;
                  }
                  .letterhead-header {
                    border-bottom: 3px solid #e63946;
                    padding-bottom: 15px;
                    margin-bottom: 25px;
                  }
                  .letterhead-footer {
                    border-top: 2px solid #e63946;
                    padding-top: 15px;
                    margin-top: 30px;
                  }
                  .letterhead-content {
                    margin: 25px 0;
                    line-height: 1.7;
                    text-align: justify;
                    direction: ltr;
                  }
                  .qr-code {
                    width: 80px !important;
                    height: 80px !important;
                  }
                  .company-logo {
                    max-height: 50px;
                  }
                  .ref-date-section {
                    text-align: right;
                    margin: 20px 0;
                  }
                }
                .letterhead-container {
                  max-width: 800px;
                  margin: 0 auto;
                  background: white;
                  font-family: 'Times New Roman', Times, serif;
                  direction: ltr;
                  text-align: left;
                }
                .letterhead-header {
                  text-align: center;
                  border-bottom: 3px solid #e63946;
                  padding-bottom: 20px;
                  margin-bottom: 30px;
                  position: relative;
                }
                .company-info {
                  color: #e63946;
                  font-weight: bold;
                }
                .letterhead-meta {
                  margin: 20px 0;
                  padding: 15px;
                  background: #fff5f5;
                  border-left: 4px solid #e63946;
                  border-radius: 5px;
                }
                .letterhead-content {
                  margin: 30px 0;
                  line-height: 1.8;
                  text-align: justify;
                  direction: ltr;
                }
                .letterhead-footer {
                  border-top: 2px solid #e63946;
                  padding-top: 20px;
                  margin-top: 40px;
                  display: flex;
                  justify-content: space-between;
                  align-items: flex-end;
                }
                .signature-section {
                  text-align: center;
                }
                .qr-code {
                  width: 100px;
                  height: 100px;
                }
                .ref-date-section {
                  text-align: right;
                  margin: 20px 0;
                  font-weight: bold;
                }
                .qr-header-position {
                  position: absolute;
                  top: 20px;
                  right: 20px;
                }
              </style>
            </head>
            <body>
              ${printContent.innerHTML}
            </body>
          </html>
        `);
        printWindow.document.close();
        setTimeout(() => {
          printWindow.print();
          printWindow.close();
        }, 500);
      }
    }
  };

  const handleDownload = () => {
    if (onDownload) {
      onDownload();
    } else {
      // Import html2canvas and jsPDF dynamically
      import("html2canvas")
        .then((html2canvas) => {
          import("jspdf")
            .then((jsPDF) => {
              const element = document.getElementById(
                "letterhead-print-content",
              );
              if (!element) {
                console.error("Print content element not found");
                return;
              }

              html2canvas
                .default(element, {
                  scale: 2,
                  useCORS: true,
                  allowTaint: true,
                  backgroundColor: "#ffffff",
                  logging: false,
                  width: element.scrollWidth,
                  height: element.scrollHeight,
                })
                .then((canvas) => {
                  const imgData = canvas.toDataURL("image/png", 1.0);
                  const pdf = new jsPDF.jsPDF("p", "mm", "a4");

                  const pdfWidth = pdf.internal.pageSize.getWidth();
                  const pdfHeight = pdf.internal.pageSize.getHeight();
                  const imgWidth = pdfWidth;
                  const imgHeight = (canvas.height * pdfWidth) / canvas.width;

                  let heightLeft = imgHeight;
                  let position = 0;

                  pdf.addImage(
                    imgData,
                    "PNG",
                    0,
                    position,
                    imgWidth,
                    imgHeight,
                  );
                  heightLeft -= pdfHeight;

                  while (heightLeft >= 0) {
                    position = heightLeft - imgHeight;
                    pdf.addPage();
                    pdf.addImage(
                      imgData,
                      "PNG",
                      0,
                      position,
                      imgWidth,
                      imgHeight,
                    );
                    heightLeft -= pdfHeight;
                  }

                  pdf.save(`official-letterhead-${letterId}.pdf`);
                })
                .catch((error) => {
                  console.error("Error generating PDF:", error);
                  alert("Error generating PDF. Please try again.");
                });
            })
            .catch((error) => {
              console.error("Error loading jsPDF:", error);
              alert("Error loading PDF library. Please try again.");
            });
        })
        .catch((error) => {
          console.error("Error loading html2canvas:", error);
          alert("Error loading canvas library. Please try again.");
        });
    }
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
          font-family: "Times New Roman", Times, serif;
        }
        .letterhead-container {
          direction: ltr !important;
          text-align: left !important;
          max-width: 800px;
          margin: 0 auto;
          background: white;
          font-family: "Times New Roman", Times, serif;
          box-shadow: 0 4px 20px rgba(230, 57, 70, 0.1);
          border-radius: 10px;
          overflow: hidden;
        }
        .letterhead-header {
          background: linear-gradient(135deg, #e63946 0%, #dc3545 100%);
          color: white;
          padding: 30px;
          text-align: center;
          position: relative;
          border-radius: 10px 10px 0 0;
        }
        .company-info {
          color: white;
          font-weight: bold;
          text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
        }
        .qr-header-position {
          position: absolute;
          top: 20px;
          right: 20px;
          background: white;
          padding: 8px;
          border-radius: 8px;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
        }
        .ref-date-section {
          text-align: right;
          margin: 25px 30px;
          font-weight: bold;
          color: #e63946;
          border-bottom: 2px solid #f8f9fa;
          padding-bottom: 15px;
        }
        .letterhead-meta {
          margin: 25px 30px;
          padding: 20px;
          background: linear-gradient(135deg, #fff5f5 0%, #ffeaea 100%);
          border-left: 5px solid #e63946;
          border-radius: 0 10px 10px 0;
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
        }
        .letterhead-content {
          margin: 30px;
          line-height: 1.8;
          text-align: justify;
          direction: ltr;
          color: #2c3e50;
        }
        .letterhead-content p {
          direction: ltr;
          text-align: left;
        }
        .letterhead-footer {
          border-top: 3px solid #e63946;
          padding: 25px 30px;
          margin: 0;
          background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
          display: flex;
          justify-content: space-between;
          align-items: flex-end;
        }
        .signature-section {
          text-align: center;
          min-width: 200px;
        }
        .action-buttons {
          background: linear-gradient(135deg, #fff5f5 0%, #ffeaea 100%);
          padding: 20px;
          border-radius: 10px;
          margin-bottom: 20px;
          border: 2px solid #e63946;
        }
        .btn-letterhead {
          background: linear-gradient(135deg, #e63946 0%, #dc3545 100%);
          border: none;
          color: white;
          padding: 12px 25px;
          border-radius: 25px;
          font-weight: 600;
          transition: all 0.3s ease;
          box-shadow: 0 4px 15px rgba(230, 57, 70, 0.3);
        }
        .btn-letterhead:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 25px rgba(230, 57, 70, 0.4);
          color: white;
        }
        .btn-outline-letterhead {
          background: transparent;
          border: 2px solid #e63946;
          color: #e63946;
          padding: 12px 25px;
          border-radius: 25px;
          font-weight: 600;
          transition: all 0.3s ease;
        }
        .btn-outline-letterhead:hover {
          background: #e63946;
          color: white;
          transform: translateY(-2px);
        }
        .qr-code {
          width: 100px;
          height: 100px;
          border-radius: 8px;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
        }
        .company-logo {
          max-height: 60px;
          filter: drop-shadow(0 2px 4px rgba(255, 255, 255, 0.3));
        }
        .verification-note {
          background: linear-gradient(135deg, #d4edda 0%, #c3e6cb 100%);
          border: 2px solid #28a745;
          border-radius: 10px;
          padding: 15px;
          margin: 20px 30px 0;
          text-align: center;
          color: #155724;
        }
        @media print {
          .letterhead-design {
            direction: ltr !important;
          }
          .letterhead-container {
            direction: ltr !important;
            text-align: left !important;
          }
          .letterhead-content {
            direction: ltr !important;
            text-align: justify !important;
          }
          .letterhead-content p {
            direction: ltr !important;
            text-align: left !important;
          }
        }
      `}</style>

      {/* Action Buttons */}
      {showActionButtons && !forPrint && (
        <div className="action-buttons no-print">
          <div className="d-flex gap-3 justify-content-center">
            <button className="btn btn-letterhead" onClick={handlePrint}>
              <i className="bi bi-printer me-2"></i>
              Print Official Letterhead
            </button>
            <button
              className="btn btn-outline-letterhead"
              onClick={handleDownload}
            >
              <i className="bi bi-download me-2"></i>
              Download PDF
            </button>
          </div>
          <div className="text-center mt-2">
            <small className="text-muted">
              <i className="bi bi-info-circle me-1"></i>
              Professional letterhead document with verification
            </small>
          </div>
        </div>
      )}

      {/* Letterhead Content */}
      <div id="letterhead-print-content" className="letterhead-container">
        {/* Header with QR Code */}
        <div className="letterhead-header">
          {/* QR Code positioned at top-right */}
          {(qrCodeUrl || qrCode) && (
            <div className="qr-header-position">
              <img
                src={qrCodeUrl || qrCode}
                alt="Verification QR Code"
                className="qr-code"
                style={{ width: "80px", height: "80px" }}
              />
            </div>
          )}

          <div className="row align-items-center">
            <div className="col-2">
              {/* Company Logo */}
              <img
                src="/placeholder.svg"
                alt="Hare Krishna Medical Store"
                className="company-logo"
              />
            </div>
            <div className="col-10">
              <h1
                className="company-info mb-2"
                style={{ fontSize: "28px", fontWeight: "700" }}
              >
                HARE KRISHNA MEDICAL STORE
              </h1>
              <p className="mb-1" style={{ fontSize: "14px", opacity: "0.95" }}>
                <strong>Address:</strong> 3 Sahyog Complex, Man Sarovar circle,
                Amroli, 394107, Gujarat
              </p>
              <p className="mb-1" style={{ fontSize: "14px", opacity: "0.95" }}>
                <strong>Phone:</strong> +91 76989 13354 |{" "}
                <strong>Email:</strong> hkmedicalamroli@gmail.com
              </p>
              <p className="mb-0" style={{ fontSize: "14px", opacity: "0.95" }}>
                <strong>GST No:</strong> 24XXXXX1234Z1Z5 |{" "}
                <strong>Drug License:</strong> GJ-XXX-XXX
              </p>
            </div>
          </div>

          {header && (
            <div
              className="mt-4 pt-3 border-top border-light"
              style={{ opacity: "0.9" }}
            >
              <p className="mb-0 fw-bold" style={{ fontSize: "16px" }}>
                {header}
              </p>
            </div>
          )}
        </div>

        {/* Reference and Date Section */}
        <div className="ref-date-section">
          <div style={{ marginBottom: "8px" }}>
            <strong>Ref:</strong> {letterId}
          </div>
          <div>
            <strong>Date:</strong>{" "}
            {new Date(createdAt).toLocaleDateString("en-IN", {
              day: "2-digit",
              month: "2-digit",
              year: "numeric",
            })}
          </div>
        </div>

        {/* Letter Meta Information */}
        <div className="letterhead-meta">
          <div>
            <p className="mb-1" style={{ color: "#e63946", fontWeight: "600" }}>
              <strong>Letter Type:</strong>{" "}
              {letterType.charAt(0).toUpperCase() + letterType.slice(1)}
            </p>
            <p className="mb-0" style={{ color: "#495057" }}>
              <strong>Subject:</strong> {subject}
            </p>
          </div>
          <div style={{ textAlign: "right" }}>
            <p className="mb-1" style={{ color: "#e63946", fontWeight: "600" }}>
              <strong>To:</strong> {getRecipientName()}
            </p>
            {recipient.designation && (
              <p className="mb-1" style={{ color: "#6c757d" }}>
                <strong>Designation:</strong> {recipient.designation}
              </p>
            )}
            {recipient.company && (
              <p className="mb-0" style={{ color: "#6c757d" }}>
                <strong>Company:</strong> {recipient.company}
              </p>
            )}
          </div>
        </div>

        {/* Letter Content */}
        <div className="letterhead-content">
          <p
            style={{
              fontWeight: "600",
              fontSize: "16px",
              marginBottom: "20px",
            }}
          >
            {getContextPrefix(context)} {getRecipientName()},
          </p>

          <div
            dangerouslySetInnerHTML={{ __html: content }}
            style={{
              marginTop: "20px",
              marginBottom: "30px",
              direction: "ltr",
              textAlign: "justify",
              lineHeight: "1.8",
            }}
          />

          <p className="mt-4" style={{ fontSize: "15px" }}>
            Thank you for your time and consideration.
          </p>

          <p className="mb-0" style={{ fontSize: "16px", fontWeight: "600" }}>
            Sincerely,
          </p>
        </div>

        {/* Footer */}
        <div className="letterhead-footer">
          <div style={{ flex: "1" }}>
            {footer && (
              <div className="mb-3">
                <p
                  className="mb-0"
                  style={{ fontSize: "14px", color: "#6c757d" }}
                >
                  {footer}
                </p>
              </div>
            )}
            <div style={{ fontSize: "12px", color: "#6c757d" }}>
              <p className="mb-1">
                <i className="bi bi-shield-check text-success me-1"></i>
                This is a computer generated official letterhead document
              </p>
              <p className="mb-0">
                <i className="bi bi-qr-code text-primary me-1"></i>
                Scan QR code above for digital verification
              </p>
            </div>
          </div>

          <div className="signature-section">
            <div
              style={{
                minHeight: "70px",
                borderBottom: "2px solid #e63946",
                marginBottom: "8px",
                display: "flex",
                alignItems: "flex-end",
                justifyContent: "center",
              }}
            >
              {host.signature && (
                <img
                  src={host.signature}
                  alt="Authorized Signature"
                  style={{ maxHeight: "60px", maxWidth: "180px" }}
                />
              )}
            </div>
            <p
              className="mb-1"
              style={{ fontWeight: "700", color: "#e63946", fontSize: "16px" }}
            >
              {host.name}
            </p>
            <p className="mb-1" style={{ fontSize: "14px", color: "#6c757d" }}>
              {host.designation}
            </p>
            <p
              className="mb-0"
              style={{
                fontSize: "13px",
                color: "#495057",
                fontStyle: "italic",
              }}
            >
              Hare Krishna Medical Store
            </p>
          </div>
        </div>

        {/* Verification Note */}
        <div className="verification-note">
          <small>
            <i className="bi bi-globe me-1"></i>
            <strong>Digital Verification:</strong> This letterhead can be
            verified at:{" "}
            <span style={{ fontFamily: "monospace", fontSize: "11px" }}>
              {window.location.origin}/verify-docs?id={letterId}&type=letterhead
            </span>
          </small>
        </div>
      </div>
    </div>
  );
};

export default OfficialLetterheadDesign;
