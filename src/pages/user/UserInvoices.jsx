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
      <div style="font-family: Arial, sans-serif; padding: 30px; max-width: 800px; margin: 0 auto; background: white;">
        <!-- Header Section -->
        <div style="display: flex; align-items: center; margin-bottom: 40px; border-bottom: 3px solid #dc3545; padding-bottom: 20px;">
          <div style="flex: 1;">
            <h1 style="color: #dc3545; margin: 0; font-size: 2.2rem; font-weight: bold;">HARE KRISHNA MEDICAL</h1>
            <p style="color: #6c757d; margin: 5px 0; font-size: 0.9rem;">Your Trusted Health Partner</p>
            <div style="color: #666; font-size: 0.85rem; line-height: 1.4;">
              <div>3 Sahyog Complex, Man Sarovar circle, Amroli, 394107</div>
              <div>📞 +91 76989 13354 | 📧 harekrishnamedical@gmail.com</div>
            </div>
          </div>
          <div style="text-align: right;">
            <div style="background: #f8f9fa; border: 2px solid #dc3545; border-radius: 8px; padding: 15px; margin-bottom: 10px;">
              <h2 style="color: #dc3545; margin: 0 0 10px 0; font-size: 1.8rem;">INVOICE</h2>
              <div style="line-height: 1.6;">
                <div><strong>Invoice #:</strong> ${invoice.id}</div>
                <div><strong>Order #:</strong> ${invoice.orderId}</div>
                <div><strong>Date:</strong> ${invoice.date}</div>
              </div>
            </div>
          </div>
        </div>

        <!-- Customer & Payment Details -->
        <div style="display: flex; gap: 30px; margin-bottom: 40px;">
          <div style="flex: 1; border: 2px solid #dc3545; border-radius: 8px; padding: 20px;">
            <h3 style="color: #dc3545; margin: 0 0 15px 0; border-bottom: 2px solid #dc3545; padding-bottom: 8px; font-size: 1.1rem;">
              📍 BILL TO:
            </h3>
            <div style="line-height: 1.6;">
              <div style="font-weight: bold; font-size: 1.1rem; margin-bottom: 8px;">${invoice.customerName}</div>
              <div>📧 john.doe@example.com</div>
              <div>📱 +91 9876543210</div>
              <div>🏠 123 Medical Street</div>
              <div>📍 Surat, Gujarat 395007</div>
            </div>
          </div>
          <div style="flex: 1; border: 2px solid #17a2b8; border-radius: 8px; padding: 20px;">
            <h3 style="color: #17a2b8; margin: 0 0 15px 0; border-bottom: 2px solid #17a2b8; padding-bottom: 8px; font-size: 1.1rem;">
              💳 PAYMENT DETAILS:
            </h3>
            <div style="line-height: 1.6;">
              <div><strong>Method:</strong> <span style="background: #17a2b8; color: white; padding: 3px 8px; border-radius: 4px; font-size: 0.85rem;">Cash on Delivery</span></div>
              <div><strong>Status:</strong> <span style="background: #28a745; color: white; padding: 3px 8px; border-radius: 4px; font-size: 0.85rem;">Paid</span></div>
              <div><strong>Amount:</strong> <span style="font-size: 1.2rem; color: #28a745;">₹${invoice.amount.toFixed(2)}</span></div>
            </div>
          </div>
        </div>

        <!-- Items Section -->
        <div style="margin-bottom: 40px;">
          <h3 style="color: #dc3545; margin: 0 0 15px 0; border-bottom: 3px solid #dc3545; padding-bottom: 8px; font-size: 1.2rem;">
            🛒 ORDERED ITEMS:
          </h3>
          <div style="border: 2px solid #dc3545; border-radius: 8px; overflow: hidden;">
            <table style="width: 100%; border-collapse: collapse; background: white;">
              <thead style="background: #dc3545; color: white;">
                <tr>
                  <th style="border: none; padding: 12px; text-align: left; font-weight: bold;">S.No</th>
                  <th style="border: none; padding: 12px; text-align: left; font-weight: bold;">Item Description</th>
                  <th style="border: none; padding: 12px; text-align: center; font-weight: bold;">Qty</th>
                  <th style="border: none; padding: 12px; text-align: right; font-weight: bold;">Amount</th>
                </tr>
              </thead>
              <tbody>
                <tr style="background: #f8f9fa; border-bottom: 1px solid #e0e0e0;">
                  <td style="padding: 12px; font-weight: bold;">1</td>
                  <td style="padding: 12px;">
                    <div style="font-weight: bold; color: #333;">Medical Products</div>
                    <small style="color: #666;">${invoice.items} items included</small>
                  </td>
                  <td style="padding: 12px; text-align: center;">
                    <span style="background: #6c757d; color: white; padding: 3px 8px; border-radius: 4px; font-size: 0.85rem;">${invoice.items}</span>
                  </td>
                  <td style="padding: 12px; text-align: right; font-weight: bold; color: #dc3545;">₹${invoice.amount.toFixed(2)}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <!-- Totals Section -->
        <div style="display: flex; justify-content: flex-end; margin-bottom: 40px;">
          <div style="width: 300px; border: 2px solid #28a745; border-radius: 8px; padding: 20px; background: #f8f9fa;">
            <h4 style="color: #28a745; margin: 0 0 15px 0; border-bottom: 2px solid #28a745; padding-bottom: 5px; font-size: 1.1rem;">
              💰 INVOICE SUMMARY:
            </h4>
            <div style="line-height: 2;">
              <div style="display: flex; justify-content: space-between; padding: 8px 0; border-bottom: 1px solid #e0e0e0;">
                <span><strong>Subtotal:</strong></span>
                <span>₹${(invoice.amount * 0.95).toFixed(2)}</span>
              </div>
              <div style="display: flex; justify-content: space-between; padding: 8px 0; border-bottom: 1px solid #e0e0e0;">
                <span><strong>Shipping:</strong></span>
                <span style="color: #28a745;">FREE</span>
              </div>
              <div style="display: flex; justify-content: space-between; padding: 8px 0; border-bottom: 1px solid #e0e0e0;">
                <span><strong>Tax (5%):</strong></span>
                <span>₹${(invoice.amount * 0.05).toFixed(2)}</span>
              </div>
              <div style="background: #28a745; color: white; margin: 15px -20px -20px -20px; padding: 15px 20px; border-radius: 0 0 5px 5px; font-size: 1.2rem;">
                <div style="display: flex; justify-content: space-between;">
                  <span><strong>TOTAL AMOUNT:</strong></span>
                  <span><strong>₹${invoice.amount.toFixed(2)}</strong></span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Footer Section -->
        <div style="border-top: 3px solid #dc3545; background: #f8f9fa; border-radius: 8px; padding: 25px; margin-top: 30px;">
          <div style="text-align: center;">
            <h3 style="color: #dc3545; margin: 0 0 20px 0; font-size: 1.3rem;">
              🙏 Thank You for Choosing Hare Krishna Medical! 🙏
            </h3>
            <div style="display: flex; justify-content: space-around; margin-bottom: 20px; flex-wrap: wrap;">
              <div style="text-align: center; min-width: 150px; margin: 10px;">
                <h4 style="color: #17a2b8; margin: 0 0 5px 0; font-size: 1rem;">📞 Contact Us</h4>
                <div style="font-size: 0.85rem;">+91 76989 13354</div>
                <div style="font-size: 0.85rem;">+91 91060 18508</div>
              </div>
              <div style="text-align: center; min-width: 150px; margin: 10px;">
                <h4 style="color: #17a2b8; margin: 0 0 5px 0; font-size: 1rem;">📧 Email Support</h4>
                <div style="font-size: 0.85rem;">harekrishnamedical@gmail.com</div>
              </div>
              <div style="text-align: center; min-width: 150px; margin: 10px;">
                <h4 style="color: #17a2b8; margin: 0 0 5px 0; font-size: 1rem;">🏠 Visit Our Store</h4>
                <div style="font-size: 0.85rem;">3 Sahyog Complex, Amroli</div>
              </div>
            </div>
            <hr style="border: 1px solid #dc3545; margin: 20px 0;">
            <div style="display: flex; justify-content: space-between; font-size: 0.8rem; color: #666;">
              <div><strong>Note:</strong> This is a computer generated invoice. No signature required.</div>
              <div>Generated on ${new Date().toLocaleString()}</div>
            </div>
          </div>
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
