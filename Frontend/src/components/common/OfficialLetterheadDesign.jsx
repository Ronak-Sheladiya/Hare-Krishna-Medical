import React from "react";

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
              <title>Letterhead ${letterId}</title>
              <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">
              <style>
                @page { size: A4; margin: 20mm; }
                @media print {
                  body { margin: 0; color: black !important; font-size: 12px; line-height: 1.4; -webkit-print-color-adjust: exact; }
                  .no-print { display: none !important; }
                  .print-break { page-break-after: always; }
                  .letterhead-container { padding: 0; margin: 0; }
                  .letterhead-header { border-bottom: 3px solid #e63946; padding-bottom: 15px; margin-bottom: 20px; }
                  .letterhead-footer { border-top: 2px solid #e63946; padding-top: 15px; margin-top: 30px; }
                  .letterhead-content { margin: 25px 0; line-height: 1.6; }
                  .qr-code { width: 80px !important; height: 80px !important; }
                  .company-logo { max-height: 60px; }
                }
                .letterhead-container {
                  max-width: 800px;
                  margin: 0 auto;
                  background: white;
                  font-family: 'Times New Roman', serif;
                }
                .letterhead-header {
                  text-align: center;
                  border-bottom: 3px solid #e63946;
                  padding-bottom: 20px;
                  margin-bottom: 30px;
                }
                .company-info {
                  color: #e63946;
                  font-weight: bold;
                }
                .letterhead-meta {
                  display: flex;
                  justify-content: space-between;
                  align-items: flex-start;
                  margin: 20px 0;
                  padding: 15px;
                  background: #f8f9fa;
                  border-left: 4px solid #e63946;
                }
                .letterhead-content {
                  margin: 30px 0;
                  line-height: 1.8;
                  text-align: justify;
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
                .letterhead-date {
                  text-align: right;
                  margin: 20px 0;
                  font-weight: bold;
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
        printWindow.close();
      }
    }
  };

  const handleDownload = () => {
    if (onDownload) {
      onDownload();
    } else {
      // Import html2canvas and jsPDF dynamically
      import("html2canvas").then((html2canvas) => {
        import("jspdf").then((jsPDF) => {
          const element = document.getElementById("letterhead-print-content");
          html2canvas
            .default(element, {
              scale: 2,
              useCORS: true,
              allowTaint: true,
              backgroundColor: "#ffffff",
            })
            .then((canvas) => {
              const imgData = canvas.toDataURL("image/png");
              const pdf = new jsPDF.jsPDF("p", "mm", "a4");
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

              pdf.save(`letterhead-${letterId}.pdf`);
            });
        });
      });
    }
  };

  return (
    <div className="letterhead-design">
      {/* Action Buttons */}
      {showActionButtons && !forPrint && (
        <div className="no-print mb-3 d-flex gap-2">
          <button className="btn btn-outline-primary" onClick={handlePrint}>
            <i className="bi bi-printer me-1"></i>
            Print Letterhead
          </button>
          <button className="btn btn-outline-success" onClick={handleDownload}>
            <i className="bi bi-download me-1"></i>
            Download PDF
          </button>
        </div>
      )}

      {/* Letterhead Content */}
      <div id="letterhead-print-content" className="letterhead-container">
        {/* Header */}
        <div className="letterhead-header">
          <div className="row align-items-center">
            <div className="col-2">
              {/* Company Logo */}
              <img
                src="/placeholder.svg"
                alt="Hare Krishna Medical"
                className="company-logo"
                style={{ maxHeight: "60px" }}
              />
            </div>
            <div className="col-8">
              <h2 className="company-info mb-1">HARE KRISHNA MEDICAL STORE</h2>
              <p className="mb-1">
                <strong>Address:</strong> 3 Sahyog Complex, Man Sarovar circle,
                Amroli, 394107, Gujarat
              </p>
              <p className="mb-1">
                <strong>Phone:</strong> +91 76989 13354 |{" "}
                <strong>Email:</strong> hkmedicalamroli@gmail.com
              </p>
              <p className="mb-0">
                <strong>GST No:</strong> 24XXXXX1234Z1Z5 |{" "}
                <strong>Drug License:</strong> GJ-XXX-XXX
              </p>
            </div>
            <div className="col-2 text-end">
              {qrCode && <img src={qrCode} alt="QR Code" className="qr-code" />}
            </div>
          </div>
          {header && (
            <div className="mt-3">
              <p className="mb-0 fw-bold">{header}</p>
            </div>
          )}
        </div>

        {/* Date */}
        <div className="letterhead-date">
          <strong>Date:</strong>{" "}
          {new Date(createdAt).toLocaleDateString("en-IN", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
          })}
        </div>

        {/* Letter Meta Information */}
        <div className="letterhead-meta">
          <div>
            <p className="mb-1">
              <strong>Letter ID:</strong> {letterId}
            </p>
            <p className="mb-1">
              <strong>Letter Type:</strong>{" "}
              {letterType.charAt(0).toUpperCase() + letterType.slice(1)}
            </p>
            <p className="mb-0">
              <strong>Subject:</strong> {subject}
            </p>
          </div>
          <div className="text-end">
            <p className="mb-1">
              <strong>To:</strong> {getRecipientName()}
            </p>
            {recipient.designation && (
              <p className="mb-1">
                <strong>Designation:</strong> {recipient.designation}
              </p>
            )}
            {recipient.company && (
              <p className="mb-0">
                <strong>Company:</strong> {recipient.company}
              </p>
            )}
          </div>
        </div>

        {/* Letter Content */}
        <div className="letterhead-content">
          <p>
            <strong>
              {getContextPrefix(context)} {getRecipientName()},
            </strong>
          </p>

          <div
            dangerouslySetInnerHTML={{ __html: content }}
            style={{ marginTop: "20px", marginBottom: "30px" }}
          />

          <p className="mt-4">Thank you for your time and consideration.</p>

          <p className="mb-0">Sincerely,</p>
        </div>

        {/* Footer */}
        <div className="letterhead-footer">
          <div>
            {footer && (
              <div className="mb-3">
                <p className="mb-0 small text-muted">{footer}</p>
              </div>
            )}
            <div className="small text-muted">
              <p className="mb-1">
                <i className="bi bi-shield-check"></i> This is a computer
                generated letterhead
              </p>
              <p className="mb-0">
                <i className="bi bi-qr-code"></i> Scan QR code to verify
                authenticity
              </p>
            </div>
          </div>

          <div className="signature-section">
            <div
              style={{
                minHeight: "60px",
                borderBottom: "1px solid #333",
                marginBottom: "5px",
              }}
            >
              {host.signature && (
                <img
                  src={host.signature}
                  alt="Signature"
                  style={{ maxHeight: "50px", maxWidth: "150px" }}
                />
              )}
            </div>
            <p className="mb-0">
              <strong>{host.name}</strong>
            </p>
            <p className="mb-0 small">{host.designation}</p>
            <p className="mb-0 small">Hare Krishna Medical Store</p>
          </div>
        </div>

        {/* Verification Note */}
        <div className="text-center mt-4 pt-3 border-top">
          <small className="text-muted">
            This letterhead can be verified at: {window.location.origin}
            /verify-docs?id={letterId}&type=letterhead
          </small>
        </div>
      </div>
    </div>
  );
};

export default OfficialLetterheadDesign;
