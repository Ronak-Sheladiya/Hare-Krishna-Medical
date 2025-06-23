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
  Alert,
} from "react-bootstrap";
import { Link, Navigate } from "react-router-dom";
import { useSelector } from "react-redux";
import {
  viewInvoice,
  printInvoice,
  downloadInvoice,
  createInvoiceData,
} from "../../utils/invoiceUtils.js";

const UserInvoices = () => {
  const { isAuthenticated, user } = useSelector((state) => state.auth);
  const [invoices, setInvoices] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [dateFilter, setDateFilter] = useState("");
  const [bulkDownloading, setBulkDownloading] = useState(false);
  const [downloadProgress, setDownloadProgress] = useState(0);
  const [showBulkModal, setShowBulkModal] = useState(false);

  // Redirect admin to admin invoices page
  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: "/user/invoices" }} replace />;
  }

  if (user?.role === 1) {
    return (
      <div className="fade-in">
        <section
          style={{
            background: "linear-gradient(135deg, #e63946 0%, #dc3545 100%)",
            paddingTop: "80px",
            paddingBottom: "80px",
            color: "white",
          }}
        >
          <Container>
            <Row className="text-center">
              <Col lg={12}>
                <Alert variant="warning" className="bg-white text-dark">
                  <h4>Access Restricted</h4>
                  <p>
                    This page is for regular users only. As an admin, please use
                    the admin invoice management system.
                  </p>
                  <div className="d-flex gap-2 justify-content-center">
                    <Button
                      as={Link}
                      to="/admin/invoices"
                      className="btn-medical-primary"
                    >
                      <i className="bi bi-gear me-2"></i>
                      Go to Admin Invoices
                    </Button>
                    <Button
                      as={Link}
                      to="/admin/dashboard"
                      variant="outline-secondary"
                    >
                      <i className="bi bi-house me-2"></i>
                      Admin Dashboard
                    </Button>
                  </div>
                </Alert>
              </Col>
            </Row>
          </Container>
        </section>
      </div>
    );
  }

  // Helper function to create invoice data from user invoice
  const createInvoiceDataFromInvoice = (invoice) => {
    return {
      invoiceId: invoice.id,
      orderId: invoice.orderId,
      orderDate: invoice.date,
      orderTime: "14:30:25",
      customerDetails: {
        fullName: invoice.customerName,
        email: "john.doe@example.com",
        mobile: "+91 9876543210",
        address: "123 Medical Street",
        city: "Surat",
        state: "Gujarat",
        pincode: "395007",
      },
      items: [
        {
          id: 1,
          name: "Medical Products",
          company: "Various Brands",
          quantity: invoice.items,
          price: invoice.amount / invoice.items,
        },
      ],
      subtotal: invoice.amount * 0.95,
      shipping: 0,
      total: invoice.amount,
      paymentMethod: "Cash on Delivery",
      paymentStatus: "Paid",
      status: "Delivered",
    };
  };

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

  const handleDownloadPDF = async (invoice) => {
    try {
      const invoiceData = createInvoiceDataFromInvoice(invoice);
      const success = await downloadInvoice(invoiceData);
      if (success) {
        alert("Invoice downloaded successfully!");
      }
    } catch (error) {
      console.error("Error downloading PDF:", error);
      alert("Error generating PDF. Please try again.");
    }
  };

  const handlePrintInvoice = async (invoice) => {
    try {
      const invoiceData = createInvoiceDataFromInvoice(invoice);
      await printInvoice(invoiceData);
    } catch (error) {
      console.error("Error printing invoice:", error);
      alert("Error printing invoice. Please try again.");
    }
  };

  const handleViewInvoice = async (invoice) => {
    try {
      // Create basic invoice data for viewing
      const invoiceData = {
        invoiceId: invoice.id,
        orderId: invoice.orderId,
        orderDate: invoice.date,
        orderTime: "14:30:25",
        customerDetails: {
          fullName: invoice.customerName,
          email: "john.doe@example.com",
          mobile: "+91 9876543210",
          address: "123 Medical Street",
          city: "Surat",
          state: "Gujarat",
          pincode: "395007",
        },
        items: [
          {
            id: 1,
            name: "Medical Products",
            company: "Various Brands",
            quantity: invoice.items,
            price: invoice.amount / invoice.items,
          },
        ],
        subtotal: invoice.amount * 0.95,
        shipping: 0,
        total: invoice.amount,
        paymentMethod: "Cash on Delivery",
        paymentStatus: "Paid",
        status: "Delivered",
      };

      await viewInvoice(invoiceData);
    } catch (error) {
      console.error("Error viewing invoice:", error);
      alert("Error viewing invoice. Please try again.");
    }
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

        // Create invoice content for each invoice using professional component
        const invoiceHtml = await createInvoiceHTML(invoice);

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
      pdf.save(
        `Invoices_Combined_${new Date().toISOString().split("T")[0]}.pdf`,
      );
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

  const createInvoiceHTML = async (invoice) => {
    // Use the professional invoice component for bulk downloads
    const invoiceData = {
      invoiceId: invoice.id,
      orderId: invoice.orderId,
      orderDate: invoice.date,
      orderTime: "14:30:25",
      customerDetails: {
        fullName: invoice.customerName,
        email: "john.doe@example.com",
        mobile: "+91 9876543210",
        address: "123 Medical Street",
        city: "Surat",
        state: "Gujarat",
        pincode: "395007",
      },
      items: [
        {
          id: 1,
          name: "Medical Products",
          company: "Various Brands",
          quantity: invoice.items,
          price: invoice.amount / invoice.items,
          total: invoice.amount,
        },
      ],
      subtotal: invoice.amount * 0.95,
      shipping: 0,
      tax: invoice.amount * 0.05,
      total: invoice.amount,
      paymentMethod: "Cash on Delivery",
      paymentStatus: "Paid",
      status: "Delivered",
    };

    // Create a temporary element with the professional invoice
    const tempDiv = document.createElement("div");
    tempDiv.style.width = "210mm";
    tempDiv.style.backgroundColor = "white";

    // Use React to render the component to HTML string
    const { createRoot } = await import("react-dom/client");
    const OfficialInvoiceDesign = (
      await import("../../components/common/OfficialInvoiceDesign.jsx")
    ).default;

    const root = createRoot(tempDiv);
    await new Promise((resolve) => {
      root.render(
        React.createElement(OfficialInvoiceDesign, {
          invoiceData,
          forPrint: true,
        }),
      );
      setTimeout(() => {
        resolve();
      }, 100);
    });

    const htmlContent = tempDiv.innerHTML;
    root.unmount();

    return htmlContent;
  };

  return (
    <div className="fade-in user-page-content" data-page="user">
      {/* Hero Section - About Us Red Theme */}
      <section
        style={{
          background: "linear-gradient(135deg, #e63946 0%, #dc3545 100%)",
          paddingTop: "80px",
          paddingBottom: "80px",
          color: "white",
        }}
      >
        <Container>
          <Row className="text-center">
            <Col lg={12}>
              <h1
                style={{
                  fontSize: "3rem",
                  fontWeight: "800",
                  marginBottom: "20px",
                  textShadow: "2px 2px 4px rgba(0,0,0,0.3)",
                }}
              >
                My Invoices
              </h1>
              <p
                style={{
                  fontSize: "1.2rem",
                  opacity: "0.9",
                  maxWidth: "600px",
                  margin: "0 auto",
                }}
              >
                View and download your purchase invoices
              </p>
            </Col>
          </Row>
        </Container>
      </section>

      {/* Invoices Content */}
      <section
        style={{
          background: "#f8f9fa",
          paddingTop: "80px",
          paddingBottom: "80px",
          minHeight: "60vh",
        }}
      >
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
                              title="Download PDF directly"
                            >
                              <i className="bi bi-download me-1"></i>
                              Download
                            </Button>
                            <Button
                              size="sm"
                              variant="outline-success"
                              onClick={() => handlePrintInvoice(invoice)}
                              className="btn-medical-outline"
                              title="Print Invoice directly"
                            >
                              <i className="bi bi-printer"></i>
                            </Button>
                            <Button
                              size="sm"
                              variant="outline-info"
                              onClick={() => handleViewInvoice(invoice)}
                              className="btn-medical-outline"
                              title="View in new tab"
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
