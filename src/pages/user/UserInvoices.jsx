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
  Spinner,
} from "react-bootstrap";
import { Link, Navigate } from "react-router-dom";
import { useSelector } from "react-redux";
import {
  viewInvoice,
  printInvoice,
  downloadInvoice,
  createInvoiceData,
} from "../../utils/invoiceUtils.js";
import { formatDateTime, getRelativeTime } from "../../utils/dateUtils";
import { api, safeApiCall } from "../../utils/apiClient";
import {
  PageHeroSection,
  ThemeCard,
  ThemeButton,
} from "../../components/common/ConsistentTheme";
import OfficialInvoiceDesign from "../../components/common/OfficialInvoiceDesign";

const UserInvoices = () => {
  const { isAuthenticated, user } = useSelector((state) => state.auth);
  const [invoices, setInvoices] = useState([]);
  const [filteredInvoices, setFilteredInvoices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [dateFilter, setDateFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [selectedInvoice, setSelectedInvoice] = useState(null);
  const [showInvoiceModal, setShowInvoiceModal] = useState(false);
  const [bulkDownloading, setBulkDownloading] = useState(false);
  const [downloadProgress, setDownloadProgress] = useState(0);
  const [showBulkModal, setShowBulkModal] = useState(false);
  const [selectedInvoicesForDownload, setSelectedInvoicesForDownload] =
    useState([]);

  // Redirect admin to admin invoices page
  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: "/user/invoices" }} replace />;
  }

  if (user?.role === 1) {
    return (
      <div className="fade-in">
        <PageHeroSection
          title="Access Denied"
          description="Administrators should use the admin panel for invoice management"
          icon="🚫"
        />
        <Container className="py-5 text-center">
          <ThemeCard>
            <Card.Body>
              <h5>You are logged in as an administrator</h5>
              <p className="text-muted">
                Please use the admin panel to manage invoices
              </p>
              <Link to="/admin/invoices">
                <ThemeButton>Go to Admin Invoices</ThemeButton>
              </Link>
            </Card.Body>
          </ThemeCard>
        </Container>
      </div>
    );
  }

  // Fetch user invoices
  const fetchUserInvoices = async () => {
    setLoading(true);
    setError(null);

    const {
      success,
      data,
      error: apiError,
    } = await safeApiCall(() => api.get("/api/user/invoices"), []);

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

  // Filter invoices based on search and filters
  useEffect(() => {
    let filtered = invoices;

    if (searchTerm) {
      filtered = filtered.filter(
        (invoice) =>
          invoice.invoiceId?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          invoice.orderId?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          invoice.items?.some((item) =>
            item.name?.toLowerCase().includes(searchTerm.toLowerCase()),
          ),
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
        case "year":
          filterDate.setFullYear(today.getFullYear() - 1);
          filtered = filtered.filter(
            (invoice) => new Date(invoice.createdAt) >= filterDate,
          );
          break;
      }
    }

    setFilteredInvoices(filtered);
  }, [invoices, searchTerm, statusFilter, dateFilter]);

  useEffect(() => {
    fetchUserInvoices();
  }, []);

  const handleViewInvoice = (invoice) => {
    setSelectedInvoice(invoice);
    setShowInvoiceModal(true);
  };

  const handlePrintInvoice = (invoice) => {
    printInvoice(invoice);
  };

  const handleDownloadInvoice = (invoice) => {
    downloadInvoice(invoice);
  };

  // Bulk download functionality
  const handleBulkDownload = async () => {
    setBulkDownloading(true);
    setDownloadProgress(0);

    const invoicesToDownload = selectedInvoicesForDownload.length
      ? filteredInvoices.filter((inv) =>
          selectedInvoicesForDownload.includes(inv._id),
        )
      : filteredInvoices;

    for (let i = 0; i < invoicesToDownload.length; i++) {
      try {
        await downloadInvoice(invoicesToDownload[i]);
        setDownloadProgress(((i + 1) / invoicesToDownload.length) * 100);
        // Small delay to prevent overwhelming the browser
        await new Promise((resolve) => setTimeout(resolve, 500));
      } catch (error) {
        console.error("Error downloading invoice:", error);
      }
    }

    setBulkDownloading(false);
    setShowBulkModal(false);
    setSelectedInvoicesForDownload([]);
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

  const toggleInvoiceSelection = (invoiceId) => {
    setSelectedInvoicesForDownload((prev) =>
      prev.includes(invoiceId)
        ? prev.filter((id) => id !== invoiceId)
        : [...prev, invoiceId],
    );
  };

  const selectAllInvoices = () => {
    if (selectedInvoicesForDownload.length === filteredInvoices.length) {
      setSelectedInvoicesForDownload([]);
    } else {
      setSelectedInvoicesForDownload(filteredInvoices.map((inv) => inv._id));
    }
  };

  if (loading) {
    return (
      <div className="fade-in">
        <PageHeroSection
          title="My Invoices"
          description="View and download your purchase invoices"
          icon="🧾"
        />
        <Container className="py-5">
          <div
            className="d-flex justify-content-center align-items-center"
            style={{ minHeight: "40vh" }}
          >
            <Spinner animation="border" variant="danger" />
            <span className="ms-2">Loading your invoices...</span>
          </div>
        </Container>
      </div>
    );
  }

  return (
    <div className="fade-in">
      <PageHeroSection
        title="My Invoices"
        description="View and download your purchase invoices"
        icon={<i className="bi bi-receipt"></i>}
      />

      <Container className="py-5">
        {error && (
          <Alert variant="warning" className="mb-4">
            <Alert.Heading>Offline Mode</Alert.Heading>
            <p>{error}</p>
            <ThemeButton variant="outline" onClick={fetchUserInvoices}>
              <i className="bi bi-arrow-clockwise me-2"></i>
              Try Again
            </ThemeButton>
          </Alert>
        )}

        {/* Summary Cards */}
        <Row className="mb-4">
          <Col md={3}>
            <ThemeCard className="text-center">
              <Card.Body>
                <h4 className="text-danger">{invoices.length}</h4>
                <small className="text-muted">Total Invoices</small>
              </Card.Body>
            </ThemeCard>
          </Col>
          <Col md={3}>
            <ThemeCard className="text-center">
              <Card.Body>
                <h4 className="text-success">
                  {invoices.filter((inv) => inv.status === "paid").length}
                </h4>
                <small className="text-muted">Paid Invoices</small>
              </Card.Body>
            </ThemeCard>
          </Col>
          <Col md={3}>
            <ThemeCard className="text-center">
              <Card.Body>
                <h4 className="text-warning">
                  {invoices.filter((inv) => inv.status === "pending").length}
                </h4>
                <small className="text-muted">Pending Invoices</small>
              </Card.Body>
            </ThemeCard>
          </Col>
          <Col md={3}>
            <ThemeCard className="text-center">
              <Card.Body>
                <h4 className="text-info">
                  ₹
                  {invoices
                    .filter((inv) => inv.status === "paid")
                    .reduce((sum, inv) => sum + (inv.totalAmount || 0), 0)
                    .toLocaleString()}
                </h4>
                <small className="text-muted">Total Paid</small>
              </Card.Body>
            </ThemeCard>
          </Col>
        </Row>

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
              <Col md={2}>
                <Form.Select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                >
                  <option value="">All Status</option>
                  <option value="paid">Paid</option>
                  <option value="pending">Pending</option>
                  <option value="cancelled">Cancelled</option>
                  <option value="refunded">Refunded</option>
                </Form.Select>
              </Col>
              <Col md={2}>
                <Form.Select
                  value={dateFilter}
                  onChange={(e) => setDateFilter(e.target.value)}
                >
                  <option value="">All Time</option>
                  <option value="today">Today</option>
                  <option value="week">This Week</option>
                  <option value="month">This Month</option>
                  <option value="year">This Year</option>
                </Form.Select>
              </Col>
              <Col md={5}>
                <div className="d-flex gap-2">
                  <ThemeButton
                    variant="outline"
                    size="sm"
                    onClick={() => setShowBulkModal(true)}
                    disabled={filteredInvoices.length === 0}
                  >
                    <i className="bi bi-download me-2"></i>
                    Bulk Download
                  </ThemeButton>
                  <ThemeButton
                    variant="outline"
                    size="sm"
                    onClick={fetchUserInvoices}
                  >
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
            <h5 className="mb-0">My Invoices ({filteredInvoices.length})</h5>
          </Card.Header>
          <Card.Body className="p-0">
            {filteredInvoices.length > 0 ? (
              <Table responsive hover className="mb-0">
                <thead className="table-light">
                  <tr>
                    <th>
                      <Form.Check
                        type="checkbox"
                        checked={
                          selectedInvoicesForDownload.length ===
                          filteredInvoices.length
                        }
                        onChange={selectAllInvoices}
                      />
                    </th>
                    <th>Invoice ID</th>
                    <th>Order ID</th>
                    <th>Items</th>
                    <th>Amount</th>
                    <th>Status</th>
                    <th>Date</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredInvoices.map((invoice) => (
                    <tr key={invoice._id}>
                      <td>
                        <Form.Check
                          type="checkbox"
                          checked={selectedInvoicesForDownload.includes(
                            invoice._id,
                          )}
                          onChange={() => toggleInvoiceSelection(invoice._id)}
                        />
                      </td>
                      <td>
                        <strong>{invoice.invoiceId || invoice._id}</strong>
                      </td>
                      <td>{invoice.orderId}</td>
                      <td>
                        <span className="badge bg-light text-dark">
                          {invoice.items?.length || 0} items
                        </span>
                        {invoice.items?.length > 0 && (
                          <div>
                            <small className="text-muted">
                              {invoice.items[0]?.name}
                              {invoice.items.length > 1 &&
                                ` +${invoice.items.length - 1} more`}
                            </small>
                          </div>
                        )}
                      </td>
                      <td>
                        <strong>
                          ₹{invoice.totalAmount?.toLocaleString()}
                        </strong>
                      </td>
                      <td>
                        <Badge bg={getStatusBadgeColor(invoice.status)}>
                          {invoice.status || "Pending"}
                        </Badge>
                      </td>
                      <td>
                        <div>
                          <div>{formatDateTime(invoice.createdAt)}</div>
                          <small className="text-muted">
                            {getRelativeTime(invoice.createdAt)}
                          </small>
                        </div>
                      </td>
                      <td>
                        <div className="d-flex gap-1">
                          <Button
                            variant="outline-primary"
                            size="sm"
                            onClick={() => handleViewInvoice(invoice)}
                          >
                            👁️
                          </Button>
                          <Button
                            variant="outline-secondary"
                            size="sm"
                            onClick={() => handlePrintInvoice(invoice)}
                          >
                            🖨️
                          </Button>
                          <Button
                            variant="outline-success"
                            size="sm"
                            onClick={() => handleDownloadInvoice(invoice)}
                          >
                            📥
                          </Button>
                        </div>
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
                    : searchTerm || statusFilter || dateFilter
                      ? "No invoices match your current filters."
                      : "You haven't made any purchases yet."}
                </p>
                {error ? (
                  <ThemeButton onClick={fetchUserInvoices}>
                    Try Again
                  </ThemeButton>
                ) : !searchTerm && !statusFilter && !dateFilter ? (
                  <Link to="/products">
                    <ThemeButton>Start Shopping</ThemeButton>
                  </Link>
                ) : (
                  <ThemeButton
                    variant="outline"
                    onClick={() => {
                      setSearchTerm("");
                      setStatusFilter("");
                      setDateFilter("");
                    }}
                  >
                    Clear Filters
                  </ThemeButton>
                )}
              </div>
            )}
          </Card.Body>
        </ThemeCard>

        {/* View Invoice Modal */}
        <Modal
          show={showInvoiceModal}
          onHide={() => setShowInvoiceModal(false)}
          size="lg"
        >
          <Modal.Header closeButton>
            <Modal.Title>Invoice Details</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            {selectedInvoice && (
              <OfficialInvoiceDesign
                invoice={selectedInvoice}
                onPrint={() => handlePrintInvoice(selectedInvoice)}
                onDownload={() => handleDownloadInvoice(selectedInvoice)}
              />
            )}
          </Modal.Body>
          <Modal.Footer>
            <Button
              variant="secondary"
              onClick={() => setShowInvoiceModal(false)}
            >
              Close
            </Button>
            <ThemeButton
              variant="outline"
              onClick={() => handlePrintInvoice(selectedInvoice)}
            >
              🖨️ Print
            </ThemeButton>
            <ThemeButton onClick={() => handleDownloadInvoice(selectedInvoice)}>
              📥 Download
            </ThemeButton>
          </Modal.Footer>
        </Modal>

        {/* Bulk Download Modal */}
        <Modal show={showBulkModal} onHide={() => setShowBulkModal(false)}>
          <Modal.Header closeButton>
            <Modal.Title>Bulk Download Invoices</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            {bulkDownloading ? (
              <div>
                <div className="mb-3">
                  <strong>Downloading invoices...</strong>
                </div>
                <ProgressBar
                  now={downloadProgress}
                  label={`${Math.round(downloadProgress)}%`}
                  animated
                />
              </div>
            ) : (
              <div>
                <p>
                  Download{" "}
                  {selectedInvoicesForDownload.length > 0
                    ? `${selectedInvoicesForDownload.length} selected`
                    : `all ${filteredInvoices.length}`}{" "}
                  invoices?
                </p>
                <p className="text-muted small">
                  Each invoice will be downloaded as a separate PDF file.
                </p>
              </div>
            )}
          </Modal.Body>
          <Modal.Footer>
            <Button
              variant="secondary"
              onClick={() => setShowBulkModal(false)}
              disabled={bulkDownloading}
            >
              Cancel
            </Button>
            <ThemeButton
              onClick={handleBulkDownload}
              disabled={bulkDownloading}
            >
              {bulkDownloading ? "Downloading..." : "Start Download"}
            </ThemeButton>
          </Modal.Footer>
        </Modal>
      </Container>
    </div>
  );
};

export default UserInvoices;
