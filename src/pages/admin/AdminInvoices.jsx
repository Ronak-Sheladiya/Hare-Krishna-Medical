import React, { useState, useEffect } from "react";
import {
  Container,
  Row,
  Col,
  Card,
  Table,
  Badge,
  Button,
  Modal,
  Form,
  Alert,
  Dropdown,
  InputGroup,
  Spinner,
} from "react-bootstrap";
import { Link } from "react-router-dom";
import * as XLSX from "xlsx";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import QRCode from "qrcode";
import OfficialInvoiceDesign from "../../components/common/OfficialInvoiceDesign";
import { formatDateTime, getRelativeTime } from "../../utils/dateUtils";
import { api, safeApiCall } from "../../utils/apiClient";
import {
  PageHeroSection,
  ThemeCard,
  ThemeButton,
} from "../../components/common/ConsistentTheme";

const AdminInvoices = () => {
  const [invoices, setInvoices] = useState([]);
  const [filteredInvoices, setFilteredInvoices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [dateFilter, setDateFilter] = useState("");
  const [selectedInvoice, setSelectedInvoice] = useState(null);
  const [showViewModal, setShowViewModal] = useState(false);
  const [showQRModal, setShowQRModal] = useState(false);
  const [qrCodeUrl, setQrCodeUrl] = useState("");
  const [exporting, setExporting] = useState(false);

  // Fetch all invoices
  const fetchInvoices = async () => {
    setLoading(true);
    setError(null);

    const {
      success,
      data,
      error: apiError,
    } = await safeApiCall(() => api.get("/api/admin/invoices"), []);

    if (success && data) {
      const invoicesData = data.data || data;
      setInvoices(invoicesData);
      setFilteredInvoices(invoicesData);
    } else {
      setError(apiError || "Failed to load invoices");
      // Keep empty state for offline mode
      setInvoices([]);
      setFilteredInvoices([]);
    }

    setLoading(false);
  };

  // Update invoice status
  const updateInvoiceStatus = async (invoiceId, newStatus) => {
    const { success, error: apiError } = await safeApiCall(
      () =>
        api.patch(`/api/admin/invoices/${invoiceId}`, { status: newStatus }),
      null,
    );

    if (success) {
      // Update local state
      setInvoices((prev) =>
        prev.map((inv) =>
          inv._id === invoiceId ? { ...inv, status: newStatus } : inv,
        ),
      );
      setFilteredInvoices((prev) =>
        prev.map((inv) =>
          inv._id === invoiceId ? { ...inv, status: newStatus } : inv,
        ),
      );
    } else {
      alert(apiError || "Failed to update invoice status");
    }
  };

  // Generate QR code for invoice
  const generateQRCode = async (invoice) => {
    try {
      const qrData = {
        invoiceId: invoice.invoiceId || invoice._id,
        orderId: invoice.orderId,
        amount: invoice.totalAmount,
        date: invoice.createdAt,
        verifyUrl: `${window.location.origin}/qr/invoice/${invoice.invoiceId || invoice._id}`,
      };

      const qrCodeDataUrl = await QRCode.toDataURL(JSON.stringify(qrData), {
        width: 256,
        margin: 2,
        color: {
          dark: "#000000",
          light: "#FFFFFF",
        },
      });

      setQrCodeUrl(qrCodeDataUrl);
      setSelectedInvoice(invoice);
      setShowQRModal(true);
    } catch (error) {
      console.error("Error generating QR code:", error);
      alert("Failed to generate QR code");
    }
  };

  // Export to Excel
  const exportToExcel = () => {
    setExporting(true);
    try {
      const exportData = filteredInvoices.map((invoice) => ({
        "Invoice ID": invoice.invoiceId || invoice._id,
        "Order ID": invoice.orderId,
        "Customer Name": invoice.customerName,
        "Customer Email": invoice.customerEmail,
        "Total Amount": invoice.totalAmount,
        Status: invoice.status,
        "Payment Method": invoice.paymentMethod,
        "Created Date": formatDateTime(invoice.createdAt),
      }));

      const ws = XLSX.utils.json_to_sheet(exportData);
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, "Invoices");
      XLSX.writeFile(
        wb,
        `invoices-${new Date().toISOString().split("T")[0]}.xlsx`,
      );
    } catch (error) {
      console.error("Error exporting to Excel:", error);
      alert("Failed to export to Excel");
    } finally {
      setExporting(false);
    }
  };

  // Filter invoices based on search and filters
  useEffect(() => {
    let filtered = invoices;

    if (searchTerm) {
      filtered = filtered.filter(
        (invoice) =>
          invoice.invoiceId?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          invoice.orderId?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          invoice.customerName
            ?.toLowerCase()
            .includes(searchTerm.toLowerCase()) ||
          invoice.customerEmail
            ?.toLowerCase()
            .includes(searchTerm.toLowerCase()),
      );
    }

    if (statusFilter) {
      filtered = filtered.filter((invoice) => invoice.status === statusFilter);
    }

    if (dateFilter) {
      const today = new Date();
      const filterDate = new Date(today);

      switch (dateFilter) {
        case "today":
          filtered = filtered.filter((invoice) => {
            const invoiceDate = new Date(invoice.createdAt);
            return invoiceDate.toDateString() === today.toDateString();
          });
          break;
        case "week":
          filterDate.setDate(today.getDate() - 7);
          filtered = filtered.filter(
            (invoice) => new Date(invoice.createdAt) >= filterDate,
          );
          break;
        case "month":
          filterDate.setMonth(today.getMonth() - 1);
          filtered = filtered.filter(
            (invoice) => new Date(invoice.createdAt) >= filterDate,
          );
          break;
      }
    }

    setFilteredInvoices(filtered);
  }, [invoices, searchTerm, statusFilter, dateFilter]);

  useEffect(() => {
    fetchInvoices();
  }, []);

  const handleViewInvoice = (invoice) => {
    setSelectedInvoice(invoice);
    setShowViewModal(true);
  };

  const getStatusBadgeColor = (status) => {
    switch (status?.toLowerCase()) {
      case "paid":
        return "success";
      case "pending":
        return "warning";
      case "cancelled":
        return "danger";
      case "refunded":
        return "info";
      default:
        return "secondary";
    }
  };

  if (loading) {
    return (
      <div
        className="d-flex justify-content-center align-items-center"
        style={{ minHeight: "60vh" }}
      >
        <Spinner animation="border" variant="danger" />
        <span className="ms-2">Loading invoices...</span>
      </div>
    );
  }

  return (
    <div className="fade-in">
      <PageHeroSection
        title="Invoice Management"
        description="Manage and track all customer invoices"
        icon={<i className="bi bi-receipt"></i>}
      />

      <Container className="py-5">
        {error && (
          <Alert variant="warning" className="mb-4">
            <Alert.Heading>Offline Mode</Alert.Heading>
            <p>{error}</p>
            <ThemeButton variant="outline" onClick={fetchInvoices}>
              <i className="bi bi-arrow-clockwise me-2"></i>
              Try Again
            </ThemeButton>
          </Alert>
        )}

        {/* Filters and Search */}
        <ThemeCard className="mb-4">
          <Card.Body>
            <Row>
              <Col md={3}>
                <InputGroup>
                  <Form.Control
                    type="text"
                    placeholder="Search invoices..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </InputGroup>
              </Col>
              <Col md={3}>
                <Form.Select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                >
                  <option value="">All Status</option>
                  <option value="Paid">Paid</option>
                  <option value="Pending">Pending</option>
                  <option value="Cancelled">Cancelled</option>
                  <option value="Refunded">Refunded</option>
                </Form.Select>
              </Col>
              <Col md={3}>
                <Form.Select
                  value={dateFilter}
                  onChange={(e) => setDateFilter(e.target.value)}
                >
                  <option value="">All Time</option>
                  <option value="today">Today</option>
                  <option value="week">This Week</option>
                  <option value="month">This Month</option>
                </Form.Select>
              </Col>
              <Col md={3}>
                <div className="d-flex gap-2">
                  <ThemeButton
                    variant="outline"
                    onClick={exportToExcel}
                    disabled={exporting}
                  >
                    {exporting ? (
                      <>
                        <Spinner
                          animation="border"
                          size="sm"
                          className="me-1"
                        />
                        Exporting...
                      </>
                    ) : (
                      <>
                        <i className="bi bi-file-earmark-excel me-2"></i>
                        Export Excel
                      </>
                    )}
                  </ThemeButton>
                  <ThemeButton variant="outline" onClick={fetchInvoices}>
                    <i className="bi bi-arrow-clockwise me-2"></i>
                    Refresh
                  </ThemeButton>
                </div>
              </Col>
            </Row>
          </Card.Body>
        </ThemeCard>

        {/* Invoices Table */}
        <ThemeCard>
          <Card.Header className="bg-gradient text-white d-flex justify-content-between align-items-center">
            <h5 className="mb-0">All Invoices ({filteredInvoices.length})</h5>
          </Card.Header>
          <Card.Body className="p-0">
            {filteredInvoices.length > 0 ? (
              <Table responsive hover className="mb-0">
                <thead className="table-light">
                  <tr>
                    <th>Invoice ID</th>
                    <th>Order ID</th>
                    <th>Customer</th>
                    <th>Amount</th>
                    <th>Status</th>
                    <th>Payment Method</th>
                    <th>Date</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredInvoices.map((invoice) => (
                    <tr key={invoice._id}>
                      <td>
                        <strong>{invoice.invoiceId || invoice._id}</strong>
                      </td>
                      <td>{invoice.orderId}</td>
                      <td>
                        <div>
                          <div className="fw-bold">{invoice.customerName}</div>
                          <small className="text-muted">
                            {invoice.customerEmail}
                          </small>
                        </div>
                      </td>
                      <td>
                        <strong>
                          ₹{invoice.totalAmount?.toLocaleString()}
                        </strong>
                      </td>
                      <td>
                        <Badge bg={getStatusBadgeColor(invoice.status)}>
                          {invoice.status}
                        </Badge>
                      </td>
                      <td>{invoice.paymentMethod}</td>
                      <td>
                        <div>
                          <div>{formatDateTime(invoice.createdAt)}</div>
                          <small className="text-muted">
                            {getRelativeTime(invoice.createdAt)}
                          </small>
                        </div>
                      </td>
                      <td>
                        <Dropdown>
                          <Dropdown.Toggle
                            variant="outline-secondary"
                            size="sm"
                            className="border-0"
                          >
                            Actions
                          </Dropdown.Toggle>
                          <Dropdown.Menu>
                            <Dropdown.Item
                              onClick={() => handleViewInvoice(invoice)}
                            >
                              👁️ View Invoice
                            </Dropdown.Item>
                            <Dropdown.Item
                              onClick={() => generateQRCode(invoice)}
                            >
                              📱 Generate QR
                            </Dropdown.Item>
                            <Dropdown.Divider />
                            <Dropdown.Item
                              onClick={() =>
                                updateInvoiceStatus(invoice._id, "Paid")
                              }
                              disabled={invoice.status === "Paid"}
                            >
                              ✅ Mark as Paid
                            </Dropdown.Item>
                            <Dropdown.Item
                              onClick={() =>
                                updateInvoiceStatus(invoice._id, "Cancelled")
                              }
                              disabled={invoice.status === "Cancelled"}
                            >
                              ❌ Cancel Invoice
                            </Dropdown.Item>
                          </Dropdown.Menu>
                        </Dropdown>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            ) : (
              <div className="text-center py-5">
                <div className="mb-3">
                  <span style={{ fontSize: "4rem" }}>🧾</span>
                </div>
                <h5>No Invoices Found</h5>
                <p className="text-muted">
                  {error
                    ? "Unable to load invoices. Please check your connection."
                    : "No invoices match your current filters."}
                </p>
                {error && (
                  <ThemeButton onClick={fetchInvoices}>Try Again</ThemeButton>
                )}
              </div>
            )}
          </Card.Body>
        </ThemeCard>

        {/* View Invoice Modal */}
        <Modal
          show={showViewModal}
          onHide={() => setShowViewModal(false)}
          size="lg"
        >
          <Modal.Header closeButton>
            <Modal.Title>Invoice Details</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            {selectedInvoice && (
              <OfficialInvoiceDesign
                invoiceData={{
                  invoiceId: selectedInvoice.invoiceId || selectedInvoice._id,
                  orderId: selectedInvoice.orderId,
                  orderDate: new Date(
                    selectedInvoice.createdAt,
                  ).toLocaleDateString("en-IN"),
                  orderTime: new Date(
                    selectedInvoice.createdAt,
                  ).toLocaleTimeString("en-IN"),
                  customerDetails: {
                    fullName: selectedInvoice.customerName,
                    email: selectedInvoice.customerEmail,
                    mobile: selectedInvoice.customerMobile,
                    address: selectedInvoice.customerAddress,
                    city: selectedInvoice.customerCity,
                    state: selectedInvoice.customerState,
                    pincode: selectedInvoice.customerPincode,
                  },
                  items: selectedInvoice.items || [],
                  subtotal:
                    selectedInvoice.subtotal || selectedInvoice.totalAmount,
                  shipping: selectedInvoice.shipping || 0,
                  total: selectedInvoice.totalAmount,
                  paymentMethod: selectedInvoice.paymentMethod || "COD",
                  paymentStatus:
                    selectedInvoice.paymentStatus || selectedInvoice.status,
                  status: selectedInvoice.status,
                }}
                qrCode={selectedInvoice.qrCode}
                onPrint={() => window.print()}
                onDownload={() => {
                  console.log("Download invoice:", selectedInvoice);
                }}
                showActionButtons={true}
              />
            )}
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowViewModal(false)}>
              <i className="bi bi-x me-2"></i>
              Close
            </Button>
            <ThemeButton onClick={() => window.print()}>
              🖨️ Print Invoice
            </ThemeButton>
          </Modal.Footer>
        </Modal>

        {/* QR Code Modal */}
        <Modal show={showQRModal} onHide={() => setShowQRModal(false)} centered>
          <Modal.Header closeButton>
            <Modal.Title>Invoice QR Code</Modal.Title>
          </Modal.Header>
          <Modal.Body className="text-center">
            {qrCodeUrl && (
              <div>
                <img
                  src={qrCodeUrl}
                  alt="Invoice QR Code"
                  className="img-fluid mb-3"
                  style={{ maxWidth: "256px" }}
                />
                <p className="text-muted">
                  Scan this QR code to verify invoice authenticity
                </p>
                <p className="small">
                  Invoice: {selectedInvoice?.invoiceId || selectedInvoice?._id}
                </p>
              </div>
            )}
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowQRModal(false)}>
              <i className="bi bi-x me-2"></i>
              Close
            </Button>
            <ThemeButton
              onClick={() => {
                const link = document.createElement("a");
                link.download = `invoice-qr-${selectedInvoice?.invoiceId || selectedInvoice?._id}.png`;
                link.href = qrCodeUrl;
                link.click();
              }}
            >
              📥 Download QR
            </ThemeButton>
          </Modal.Footer>
        </Modal>
      </Container>
    </div>
  );
};

export default AdminInvoices;
