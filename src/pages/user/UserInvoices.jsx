import React, { useState, useEffect } from "react";
import {
  Container,
  Row,
  Col,
  Card,
  Button,
  Table,
  Badge,
  Form,
  InputGroup,
  Modal,
  ProgressBar,
} from "react-bootstrap";
import { Link } from "react-router-dom";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

const UserInvoices = () => {
  const [invoices, setInvoices] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [dateFilter, setDateFilter] = useState("");
  const [bulkDownloading, setBulkDownloading] = useState(false);
  const [downloadProgress, setDownloadProgress] = useState(0);
  const [showBulkModal, setShowBulkModal] = useState(false);

  // Mock invoices data
  const mockInvoices = [
    {
      id: "INV001",
      orderId: "HKM12345678",
      date: "2024-01-15",
      amount: 102.35,
      status: "Paid",
      downloadCount: 2,
      customerName: "John Doe",
      items: 3,
    },
    {
      id: "INV002",
      orderId: "HKM12345679",
      date: "2024-01-12",
      amount: 146.34,
      status: "Paid",
      downloadCount: 1,
      customerName: "John Doe",
      items: 2,
    },
    {
      id: "INV003",
      orderId: "HKM12345680",
      date: "2024-01-10",
      amount: 1364.99,
      status: "Paid",
      downloadCount: 3,
      customerName: "John Doe",
      items: 1,
    },
    {
      id: "INV004",
      orderId: "HKM12345681",
      date: "2024-01-08",
      amount: 89.25,
      status: "Paid",
      downloadCount: 0,
      customerName: "John Doe",
      items: 2,
    },
    {
      id: "INV005",
      orderId: "HKM12345682",
      date: "2024-01-05",
      amount: 245.8,
      status: "Paid",
      downloadCount: 1,
      customerName: "John Doe",
      items: 4,
    },
  ];

  useEffect(() => {
    setInvoices(mockInvoices);
  }, []);

  const filteredInvoices = invoices.filter((invoice) => {
    const matchesSearch =
      invoice.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      invoice.orderId.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesDate = !dateFilter || invoice.date.includes(dateFilter);

    return matchesSearch && matchesDate;
  });

  const handleDownloadPDF = (invoice) => {
    // This will navigate to the invoice view page which has PDF download functionality
    window.open(`/invoice/${invoice.orderId}`, "_blank");
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case "Paid":
        return <Badge bg="success">Paid</Badge>;
      case "Pending":
        return <Badge bg="warning">Pending</Badge>;
      case "Overdue":
        return <Badge bg="danger">Overdue</Badge>;
      default:
        return <Badge bg="secondary">Unknown</Badge>;
    }
  };

  const getTotalAmount = () => {
    return filteredInvoices.reduce(
      (total, invoice) => total + invoice.amount,
      0,
    );
  };

  const getDownloadStats = () => {
    const totalDownloads = invoices.reduce(
      (total, invoice) => total + invoice.downloadCount,
      0,
    );
    const undownloadedCount = invoices.filter(
      (invoice) => invoice.downloadCount === 0,
    ).length;
    return { totalDownloads, undownloadedCount };
  };

  const stats = getDownloadStats();

  const handleBulkDownload = async () => {
    if (filteredInvoices.length === 0) {
      alert("No invoices to download");
      return;
    }

    setShowBulkModal(true);
    setBulkDownloading(true);
    setDownloadProgress(0);

    try {
      const pdf = new jsPDF("p", "mm", "a4");
      const pageHeight = 295;
      let isFirstPage = true;

      for (let i = 0; i < filteredInvoices.length; i++) {
        const invoice = filteredInvoices[i];

        // Update progress
        setDownloadProgress(((i + 1) / filteredInvoices.length) * 100);

        // Create invoice content for each invoice
        const invoiceHtml = createInvoiceHTML(invoice);

        // Create a temporary div to render the invoice
        const tempDiv = document.createElement("div");
        tempDiv.innerHTML = invoiceHtml;
        tempDiv.style.position = "absolute";
        tempDiv.style.left = "-9999px";
        tempDiv.style.width = "210mm";
        tempDiv.style.padding = "20px";
        tempDiv.style.backgroundColor = "white";
        document.body.appendChild(tempDiv);

        // Wait a bit for rendering
        await new Promise((resolve) => setTimeout(resolve, 500));

        // Convert to canvas
        const canvas = await html2canvas(tempDiv, {
          scale: 2,
          logging: false,
          useCORS: true,
          backgroundColor: "#ffffff",
        });

        // Remove temporary div
        document.body.removeChild(tempDiv);

        // Add new page if not first
        if (!isFirstPage) {
          pdf.addPage();
        }
        isFirstPage = false;

        // Add to PDF
        const imgData = canvas.toDataURL("image/png");
        const imgWidth = 210;
        const imgHeight = (canvas.height * imgWidth) / canvas.width;

        pdf.addImage(imgData, "PNG", 0, 0, imgWidth, imgHeight);
      }

      // Download the combined PDF
      pdf.save(`All_Invoices_${new Date().toISOString().split("T")[0]}.pdf`);
    } catch (error) {
      console.error("Error generating bulk PDF:", error);
      alert(
        "Error generating PDF. Please try downloading individual invoices.",
      );
    } finally {
      setBulkDownloading(false);
      setDownloadProgress(0);
      setTimeout(() => setShowBulkModal(false), 1000);
    }
  };

  const createInvoiceHTML = (invoice) => {
    return `
      <div style="font-family: Arial, sans-serif; padding: 20px; max-width: 210mm; margin: 0 auto; background: white;">
        <!-- Header Section - Exact PDF Layout -->
        <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 30px; border-bottom: 2px solid #000; padding-bottom: 20px;">
          <!-- Left Side - Company Info -->
          <div style="flex: 1;">
            <div style="display: flex; align-items: center; margin-bottom: 15px;">
              <img src="https://cdn.builder.io/api/v1/assets/ec4b3f82f1ac4275b8bfc1756fcac420/invoice_hkm12345678-1-e0e726" alt="Hare Krishna Medical Logo" style="height: 60px; width: auto; margin-right: 15px;" onError="this.src='https://cdn.builder.io/api/v1/assets/ec4b3f82f1ac4275b8bfc1756fcac420/medical_logo-e586be?format=webp&width=800';" />
              <div>
                <h1 style="font-size: 24px; font-weight: bold; color: #000; margin: 0; line-height: 1.2;">HARE KRISHNA MEDICAL</h1>
                <p style="font-size: 12px; color: #666; margin: 2px 0;">Your Trusted Health Partner</p>
              </div>
            </div>
            <div style="font-size: 11px; color: #000; line-height: 1.4;">
              <div>3 Sahyog Complex, Man Sarovar circle</div>
              <div>Amroli, 394107, Gujarat, India</div>
              <div>Phone: +91 76989 13354 | +91 91060 18508</div>
              <div>Email: harekrishnamedical@gmail.com</div>
            </div>
          </div>
          <!-- Right Side - Invoice Info -->
          <div style="text-align: right; min-width: 200px;">
            <h1 style="font-size: 36px; font-weight: bold; color: #000; margin: 0 0 15px 0;">INVOICE</h1>
            <div style="background: #f5f5f5; border: 1px solid #000; padding: 15px; font-size: 12px; text-align: left;">
              <div style="margin-bottom: 5px;"><strong>Invoice No:</strong> ${invoice.id}</div>
              <div style="margin-bottom: 5px;"><strong>Order No:</strong> ${invoice.orderId}</div>
              <div style="margin-bottom: 5px;"><strong>Date:</strong> ${invoice.date}</div>
              <div style="margin-bottom: 5px;"><strong>Time:</strong> 14:30:25</div>
              <div><strong>Status:</strong> Delivered</div>
            </div>
          </div>
        </div>

        <!-- Bill To and Ship To Section -->
        <div style="display: flex; justify-content: space-between; margin-bottom: 30px; gap: 30px;">
          <!-- Bill To -->
          <div style="flex: 1; border: 1px solid #000; padding: 15px;">
            <h3 style="font-size: 14px; font-weight: bold; margin: 0 0 10px 0; text-transform: uppercase;">BILL TO:</h3>
            <div style="font-size: 12px; line-height: 1.5;">
              <div style="font-weight: bold; margin-bottom: 5px;">${invoice.customerName}</div>
              <div>john.doe@example.com</div>
              <div>+91 9876543210</div>
              <div>123 Medical Street</div>
              <div>Surat, Gujarat 395007</div>
            </div>
          </div>
          <!-- Ship To -->
          <div style="flex: 1; border: 1px solid #000; padding: 15px;">
            <h3 style="font-size: 14px; font-weight: bold; margin: 0 0 10px 0; text-transform: uppercase;">SHIP TO:</h3>
            <div style="font-size: 12px; line-height: 1.5;">
              <div style="font-weight: bold; margin-bottom: 5px;">${invoice.customerName}</div>
              <div>123 Medical Street</div>
              <div>Surat, Gujarat 395007</div>
              <div style="margin-top: 10px;"><strong>Payment Method:</strong> Cash on Delivery</div>
              <div><strong>Payment Status:</strong> Paid</div>
            </div>
          </div>
        </div>

        <!-- Items Table -->
        <div style="margin-bottom: 30px;">
          <table style="width: 100%; border-collapse: collapse; border: 2px solid #000;">
            <thead>
              <tr style="background: #f5f5f5;">
                <th style="border: 1px solid #000; padding: 12px 8px; font-size: 12px; font-weight: bold; text-align: left;">S.No</th>
                <th style="border: 1px solid #000; padding: 12px 8px; font-size: 12px; font-weight: bold; text-align: left;">Description</th>
                <th style="border: 1px solid #000; padding: 12px 8px; font-size: 12px; font-weight: bold; text-align: center;">Qty</th>
                <th style="border: 1px solid #000; padding: 12px 8px; font-size: 12px; font-weight: bold; text-align: right;">Price (₹)</th>
                <th style="border: 1px solid #000; padding: 12px 8px; font-size: 12px; font-weight: bold; text-align: right;">Amount (₹)</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td style="border: 1px solid #000; padding: 8px; font-size: 11px; text-align: center;">1</td>
                <td style="border: 1px solid #000; padding: 8px; font-size: 11px;">
                  <div style="font-weight: bold;">Medical Products</div>
                  <div style="color: #666; font-size: 10px;">${invoice.items} items included</div>
                </td>
                <td style="border: 1px solid #000; padding: 8px; font-size: 11px; text-align: center;">${invoice.items}</td>
                <td style="border: 1px solid #000; padding: 8px; font-size: 11px; text-align: right;">${(invoice.amount * 0.95).toFixed(2)}</td>
                <td style="border: 1px solid #000; padding: 8px; font-size: 11px; text-align: right; font-weight: bold;">${invoice.amount.toFixed(2)}</td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- Totals Section -->
        <div style="display: flex; justify-content: flex-end; margin-bottom: 30px;">
          <div style="min-width: 300px;">
            <table style="width: 100%; border-collapse: collapse; border: 2px solid #000;">
              <tbody>
                <tr>
                  <td style="border: 1px solid #000; padding: 8px 12px; font-size: 12px; font-weight: bold; background: #f5f5f5;">Subtotal:</td>
                  <td style="border: 1px solid #000; padding: 8px 12px; font-size: 12px; text-align: right;">₹${(invoice.amount * 0.95).toFixed(2)}</td>
                </tr>
                <tr>
                  <td style="border: 1px solid #000; padding: 8px 12px; font-size: 12px; font-weight: bold; background: #f5f5f5;">Shipping:</td>
                  <td style="border: 1px solid #000; padding: 8px 12px; font-size: 12px; text-align: right;">FREE</td>
                </tr>
                <tr>
                  <td style="border: 1px solid #000; padding: 8px 12px; font-size: 12px; font-weight: bold; background: #f5f5f5;">Tax (5%):</td>
                  <td style="border: 1px solid #000; padding: 8px 12px; font-size: 12px; text-align: right;">₹${(invoice.amount * 0.05).toFixed(2)}</td>
                </tr>
                <tr>
                  <td style="border: 2px solid #000; padding: 12px; font-size: 14px; font-weight: bold; background: #000; color: #fff;">TOTAL:</td>
                  <td style="border: 2px solid #000; padding: 12px; font-size: 14px; text-align: right; font-weight: bold; background: #000; color: #fff;">₹${invoice.amount.toFixed(2)}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <!-- QR Code and Footer -->
        <div style="display: flex; justify-content: space-between; align-items: flex-end; border-top: 2px solid #000; padding-top: 20px;">
          <div style="flex: 1;">
            <h4 style="font-size: 16px; font-weight: bold; margin: 0 0 15px 0;">Thank You for Your Business!</h4>
            <div style="font-size: 11px; line-height: 1.6;">
              <div><strong>Terms & Conditions:</strong></div>
              <div>• Payment due within 30 days</div>
              <div>• Goods once sold will not be taken back</div>
              <div>• Subject to Gujarat jurisdiction only</div>
              <div style="margin-top: 10px;"><strong>Contact:</strong> harekrishnamedical@gmail.com | +91 76989 13354</div>
            </div>
          </div>
          <div style="text-align: center; margin-left: 20px;">
            <div style="width: 80px; height: 80px; border: 1px solid #000; background: #f5f5f5; display: flex; align-items: center; justify-content: center;">QR</div>
            <div style="font-size: 10px; margin-top: 5px;">Scan for Online Verification</div>
          </div>
        </div>

        <!-- Authorization Section -->
        <div style="display: flex; justify-content: space-between; margin-top: 40px; font-size: 12px;">
          <div>
            <div style="border-top: 1px solid #000; padding-top: 5px; margin-top: 30px;"><strong>Customer Signature</strong></div>
          </div>
          <div style="text-align: right;">
            <div style="border-top: 1px solid #000; padding-top: 5px; margin-top: 30px;"><strong>Authorized Signatory</strong><br /><small>Hare Krishna Medical</small></div>
          </div>
        </div>

        <!-- Footer Note -->
        <div style="text-align: center; margin-top: 20px; font-size: 10px; color: #666; border-top: 1px solid #ccc; padding-top: 10px;">
          This is a computer generated invoice. No physical signature required.<br />
          Generated on: ${new Date().toLocaleString()}
        </div>
      </div>
    `;
  };

  return (
    <div className="fade-in">
      <section className="section-padding-sm">
        <Container>
          {/* Header */}
          <Row className="mb-4">
            <Col lg={12}>
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <h2>My Invoices</h2>
                  <p className="text-muted">
                    Download and manage your invoices
                  </p>
                </div>
                <Button
                  as={Link}
                  to="/user/orders"
                  className="btn-medical-primary"
                >
                  <i className="bi bi-bag me-2"></i>
                  View Orders
                </Button>
              </div>
            </Col>
          </Row>

          {/* Invoice Statistics */}
          <Row className="mb-4">
            <Col lg={3} md={6} className="mb-3">
              <Card className="medical-card text-center h-100">
                <Card.Body>
                  <h4 className="text-medical-blue">{invoices.length}</h4>
                  <p className="mb-0 small">Total Invoices</p>
                </Card.Body>
              </Card>
            </Col>
            <Col lg={3} md={6} className="mb-3">
              <Card className="medical-card text-center h-100">
                <Card.Body>
                  <h4 className="text-success">
                    ₹{getTotalAmount().toFixed(2)}
                  </h4>
                  <p className="mb-0 small">Total Amount</p>
                </Card.Body>
              </Card>
            </Col>
            <Col lg={3} md={6} className="mb-3">
              <Card className="medical-card text-center h-100">
                <Card.Body>
                  <h4 className="text-info">{stats.totalDownloads}</h4>
                  <p className="mb-0 small">Total Downloads</p>
                </Card.Body>
              </Card>
            </Col>
            <Col lg={3} md={6} className="mb-3">
              <Card className="medical-card text-center h-100">
                <Card.Body>
                  <h4 className="text-warning">{stats.undownloadedCount}</h4>
                  <p className="mb-0 small">Not Downloaded</p>
                </Card.Body>
              </Card>
            </Col>
          </Row>

          {/* Filters */}
          <Row className="mb-4">
            <Col lg={6}>
              <InputGroup>
                <InputGroup.Text>
                  <i className="bi bi-search"></i>
                </InputGroup.Text>
                <Form.Control
                  type="text"
                  placeholder="Search by invoice ID or order ID..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </InputGroup>
            </Col>
            <Col lg={3}>
              <Form.Control
                type="month"
                value={dateFilter}
                onChange={(e) => setDateFilter(e.target.value)}
              />
            </Col>
            <Col lg={3}>
              <Button
                variant="outline-secondary"
                onClick={() => {
                  setSearchTerm("");
                  setDateFilter("");
                }}
              >
                Clear Filters
              </Button>
            </Col>
          </Row>

          {/* Invoices Table */}
          <Card className="medical-card">
            <Card.Header className="bg-medical-light">
              <h5 className="mb-0">
                <i className="bi bi-receipt me-2"></i>
                Invoice History ({filteredInvoices.length})
              </h5>
            </Card.Header>
            <Card.Body className="p-0">
              <div className="table-responsive">
                <Table className="mb-0">
                  <thead className="table-light">
                    <tr>
                      <th>Invoice ID</th>
                      <th>Order ID</th>
                      <th>Date</th>
                      <th>Items</th>
                      <th>Amount</th>
                      <th>Status</th>
                      <th>Downloads</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredInvoices.map((invoice) => (
                      <tr key={invoice.id}>
                        <td>
                          <span className="text-monospace fw-bold">
                            {invoice.id}
                          </span>
                        </td>
                        <td>
                          <Link
                            to={`/order/${invoice.orderId}`}
                            className="text-decoration-none"
                          >
                            {invoice.orderId}
                          </Link>
                        </td>
                        <td>{invoice.date}</td>
                        <td>
                          <Badge bg="secondary">{invoice.items} items</Badge>
                        </td>
                        <td>
                          <span className="fw-bold">
                            ₹{invoice.amount.toFixed(2)}
                          </span>
                        </td>
                        <td>{getStatusBadge(invoice.status)}</td>
                        <td>
                          <Badge
                            bg={
                              invoice.downloadCount > 0 ? "success" : "warning"
                            }
                          >
                            {invoice.downloadCount}
                          </Badge>
                        </td>
                        <td>
                          <div className="d-flex gap-1">
                            <Button
                              size="sm"
                              variant="outline-primary"
                              onClick={() => handleDownloadPDF(invoice)}
                              className="btn-medical-outline"
                            >
                              <i className="bi bi-download me-1"></i>
                              PDF
                            </Button>
                            <Button
                              size="sm"
                              variant="outline-info"
                              as={Link}
                              to={`/invoice/${invoice.orderId}`}
                              className="btn-medical-outline"
                            >
                              <i className="bi bi-eye"></i>
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              </div>
            </Card.Body>
          </Card>

          {/* Invoice Summary */}
          <Row className="mt-4">
            <Col lg={12}>
              <Card className="medical-card">
                <Card.Header className="bg-medical-light">
                  <h5 className="mb-0">
                    <i className="bi bi-graph-up me-2"></i>
                    Invoice Summary
                  </h5>
                </Card.Header>
                <Card.Body>
                  <Row>
                    <Col md={6}>
                      <h6>Quick Stats</h6>
                      <ul className="list-unstyled">
                        <li className="mb-2">
                          <i className="bi bi-check-circle text-success me-2"></i>
                          All invoices are paid and up to date
                        </li>
                        <li className="mb-2">
                          <i className="bi bi-download text-primary me-2"></i>
                          {stats.totalDownloads} downloads across all invoices
                        </li>
                        <li className="mb-2">
                          <i className="bi bi-calendar text-info me-2"></i>
                          Invoices available from{" "}
                          {invoices[invoices.length - 1]?.date} onwards
                        </li>
                      </ul>
                    </Col>
                    <Col md={6}>
                      <h6>Download Options</h6>
                      <p className="text-muted">
                        All invoices are available for download in PDF format.
                        You can also view them online by clicking the view
                        button.
                      </p>
                      <Button
                        variant="outline-primary"
                        className="btn-medical-outline"
                        onClick={handleBulkDownload}
                        disabled={
                          bulkDownloading || filteredInvoices.length === 0
                        }
                      >
                        <i
                          className={`bi bi-${bulkDownloading ? "hourglass-split" : "download"} me-2`}
                        ></i>
                        {bulkDownloading
                          ? "Generating PDF..."
                          : "Download All (PDF)"}
                      </Button>
                    </Col>
                  </Row>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Container>
      </section>

      {/* Bulk Download Progress Modal */}
      <Modal show={showBulkModal} centered backdrop="static" keyboard={false}>
        <Modal.Header>
          <Modal.Title>Generating PDF</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="text-center">
            <i className="bi bi-file-earmark-pdf display-1 text-danger mb-3"></i>
            <h5>Creating Combined Invoice PDF</h5>
            <p className="text-muted mb-3">
              Processing {filteredInvoices.length} invoice(s)...
            </p>
            <ProgressBar
              now={downloadProgress}
              label={`${Math.round(downloadProgress)}%`}
              className="mb-3"
              style={{ height: "25px" }}
            />
            {downloadProgress === 100 && !bulkDownloading && (
              <div className="text-success">
                <i className="bi bi-check-circle me-2"></i>
                PDF generated successfully!
              </div>
            )}
          </div>
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default UserInvoices;
