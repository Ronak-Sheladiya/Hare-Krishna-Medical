import React, { useState, useEffect } from "react";
import {
  Container,
  Row,
  Col,
  Card,
  Button,
  Table,
  Badge,
  Modal,
  Form,
  Alert,
  InputGroup,
  Spinner,
  Pagination,
} from "react-bootstrap";
import { Link } from "react-router-dom";
import { useRealTime } from "../../hooks/useRealTime";
import { api, safeApiCall } from "../../utils/apiClient";
import {
  PageHeroSection,
  ThemeCard,
  ThemeButton,
  ThemeSection,
} from "../../components/common/ConsistentTheme";

const AdminLetterheads = () => {
  const [letterheads, setLetterheads] = useState([]);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [letterheadToDelete, setLetterheadToDelete] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [typeFilter, setTypeFilter] = useState("");
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [error, setError] = useState(null);

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalLetterheads, setTotalLetterheads] = useState(0);
  const letterheadsPerPage = 10;

  // Statistics
  const [stats, setStats] = useState({
    total: 0,
    draft: 0,
    issued: 0,
    sent: 0,
    archived: 0,
  });

  const letterTypes = [
    "certificate",
    "recommendation",
    "authorization",
    "notice",
    "announcement",
    "invitation",
    "acknowledgment",
    "verification",
  ];

  const statusOptions = [
    { value: "draft", label: "Draft", variant: "secondary" },
    { value: "issued", label: "Issued", variant: "success" },
    { value: "sent", label: "Sent", variant: "primary" },
    { value: "archived", label: "Archived", variant: "dark" },
  ];

  // Real-time event handlers
  const handleLetterheadCreated = (data) => {
    fetchLetterheads();
    showNotification("New letterhead created", "success");
  };

  const handleLetterheadUpdated = (data) => {
    fetchLetterheads();
    showNotification("Letterhead updated", "info");
  };

  const handleLetterheadDeleted = (data) => {
    fetchLetterheads();
    showNotification("Letterhead deleted", "warning");
  };

  const handleLetterheadStatusUpdated = (data) => {
    setLetterheads((prev) =>
      prev.map((letterhead) =>
        letterhead.letterheadId === data.letterheadId
          ? { ...letterhead, status: data.status }
          : letterhead,
      ),
    );
    showNotification(`Letterhead status updated to ${data.status}`, "info");
  };

  useRealTime([
    { event: "letterhead-created", handler: handleLetterheadCreated },
    { event: "letterhead-updated", handler: handleLetterheadUpdated },
    { event: "letterhead-deleted", handler: handleLetterheadDeleted },
    {
      event: "letterhead-status-updated",
      handler: handleLetterheadStatusUpdated,
    },
  ]);

  // Fetch letterheads
  const fetchLetterheads = async () => {
    try {
      setLoading(true);
      setError(null);

      const params = new URLSearchParams({
        page: currentPage.toString(),
        limit: letterheadsPerPage.toString(),
      });

      if (searchTerm) params.append("search", searchTerm);
      if (statusFilter) params.append("status", statusFilter);
      if (typeFilter) params.append("letterType", typeFilter);

      console.log(
        "🔄 Fetching letterheads with URL:",
        `/api/letterheads?${params.toString()}`,
      );

      const safeResponse = await safeApiCall(() =>
        api.get(`/api/letterheads?${params.toString()}`),
      );

      console.log("📋 safeApiCall Response:", safeResponse);

      if (safeResponse?.success) {
        const response = safeResponse.data;
        console.log("📋 Actual API Response:", response);

        if (response?.success) {
          setLetterheads(response.letterheads || []);
          setTotalPages(response.pagination?.totalPages || 1);
          setTotalLetterheads(response.pagination?.total || 0);
          console.log(
            "✅ Letterheads loaded successfully:",
            response.letterheads?.length || 0,
          );
        } else {
          console.error("❌ API Response Error:", response);
          throw new Error(response?.message || "Failed to fetch letterheads");
        }
      } else {
        console.error("❌ safeApiCall Error:", safeResponse);
        throw new Error(safeResponse?.error || "Failed to fetch letterheads");
      }
    } catch (error) {
      console.error("❌ Fetch letterheads error:", error);
      console.error("❌ Error details:", {
        message: error.message,
        response: error.response,
        stack: error.stack,
      });
      setError(error.message);
      setLetterheads([]);
    } finally {
      setLoading(false);
    }
  };

  // Fetch statistics
  const fetchStats = async () => {
    try {
      const safeResponse = await safeApiCall(() =>
        api.get("/api/letterheads/stats"),
      );
      if (safeResponse?.success) {
        const response = safeResponse.data;
        if (response?.success) {
          setStats(response.stats?.general || stats);
        }
      }
    } catch (error) {
      console.error("Fetch stats error:", error);
    }
  };

  // Delete letterhead
  const handleDelete = async () => {
    if (!letterheadToDelete) return;

    try {
      setActionLoading(true);
      const safeResponse = await safeApiCall(() =>
        api.delete(`/api/letterheads/${letterheadToDelete._id}`),
      );

      if (safeResponse?.success) {
        const response = safeResponse.data;
        if (response?.success) {
          showNotification("Letterhead deleted successfully", "success");
          fetchLetterheads();
          setShowDeleteModal(false);
        } else {
          throw new Error(response?.message || "Failed to delete letterhead");
        }
      } else {
        throw new Error(safeResponse?.error || "Failed to delete letterhead");
      }
    } catch (error) {
      console.error("Delete letterhead error:", error);
      showNotification(error.message, "error");
    } finally {
      setActionLoading(false);
      setLetterheadToDelete(null);
    }
  };

  // Mark as issued
  const handleMarkAsIssued = async (letterhead) => {
    try {
      setActionLoading(true);
      const safeResponse = await safeApiCall(() =>
        api.put(`/api/letterheads/${letterhead._id}/mark-issued`),
      );

      if (safeResponse?.success) {
        const response = safeResponse.data;
        if (response?.success) {
          showNotification("Letterhead marked as issued", "success");
          fetchLetterheads();
        } else {
          throw new Error(response?.message || "Failed to mark as issued");
        }
      } else {
        throw new Error(safeResponse?.error || "Failed to mark as issued");
      }
    } catch (error) {
      console.error("Mark as issued error:", error);
      showNotification(error.message, "error");
    } finally {
      setActionLoading(false);
    }
  };

  // Mark as sent
  const handleMarkAsSent = async (letterhead) => {
    try {
      setActionLoading(true);
      const safeResponse = await safeApiCall(() =>
        api.put(`/api/letterheads/${letterhead._id}/mark-sent`),
      );

      if (safeResponse?.success) {
        const response = safeResponse.data;
        if (response?.success) {
          showNotification("Letterhead marked as sent", "success");
          fetchLetterheads();
        } else {
          throw new Error(response?.message || "Failed to mark as sent");
        }
      } else {
        throw new Error(safeResponse?.error || "Failed to mark as sent");
      }
    } catch (error) {
      console.error("Mark as sent error:", error);
      showNotification(error.message, "error");
    } finally {
      setActionLoading(false);
    }
  };

  // Professional Actions Handlers
  const handleViewLetterhead = (letterhead) => {
    // Navigate to edit page which has the preview functionality
    window.open(`/admin/letterheads/edit/${letterhead._id}`, "_blank");
  };

  const handlePrintLetterhead = async (letterhead) => {
    try {
      setActionLoading(true);

      // Create a temporary element with letterhead content
      const printElement = document.createElement("div");
      printElement.innerHTML = createLetterheadPrintTemplate(letterhead);

      // Create professional print window
      const printWindow = window.open("", "_blank");
      printWindow.document.write(`
        <!DOCTYPE html>
        <html>
          <head>
            <title>${letterhead.title} - Professional Letterhead</title>
            <meta charset="UTF-8">
            <style>
              @page {
                size: A4 portrait;
                margin: 15mm;
                -webkit-print-color-adjust: exact;
                print-color-adjust: exact;
              }

              @media print {
                * {
                  -webkit-print-color-adjust: exact !important;
                  print-color-adjust: exact !important;
                  box-shadow: none !important;
                }

                body {
                  margin: 0 !important;
                  padding: 0 !important;
                  font-family: 'Times New Roman', serif !important;
                  font-size: 12pt !important;
                  line-height: 1.6 !important;
                  color: #000 !important;
                  background: white !important;
                }

                .letterhead-header {
                  border-bottom: 4px solid #dc3545 !important;
                  margin-bottom: 20pt !important;
                  padding-bottom: 15pt !important;
                }

                .letterhead-footer {
                  border-top: 2px solid #6c757d !important;
                  margin-top: 20pt !important;
                  padding-top: 15pt !important;
                }
              }
            </style>
          </head>
          <body>
            ${printElement.innerHTML}
            <script>
              window.onload = function() {
                setTimeout(function() {
                  window.print();
                  window.close();
                }, 500);
              };
            </script>
          </body>
        </html>
      `);
      printWindow.document.close();

      showNotification("Print dialog opened successfully", "success");
    } catch (error) {
      console.error("Print error:", error);
      showNotification("Failed to print letterhead", "error");
    } finally {
      setActionLoading(false);
    }
  };

  const handleDownloadPDF = async (letterhead) => {
    try {
      setActionLoading(true);

      const response = await api.get(`/api/letterheads/${letterhead._id}/pdf`, {
        responseType: "blob",
      });

      const blob = new Blob([response.data], { type: "application/pdf" });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `${letterhead.title.replace(/[^a-z0-9]/gi, "_").toLowerCase()}_letterhead.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);

      showNotification("PDF downloaded successfully", "success");
    } catch (error) {
      console.error("PDF download error:", error);
      showNotification("Failed to download PDF", "error");
    } finally {
      setActionLoading(false);
    }
  };

  const handleDownloadHTML = async (letterhead) => {
    try {
      setActionLoading(true);

      const htmlContent = createLetterheadPrintTemplate(letterhead);
      const blob = new Blob([htmlContent], { type: "text/html" });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `${letterhead.title.replace(/[^a-z0-9]/gi, "_").toLowerCase()}_letterhead.html`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);

      showNotification("HTML downloaded successfully", "success");
    } catch (error) {
      console.error("HTML download error:", error);
      showNotification("Failed to download HTML", "error");
    } finally {
      setActionLoading(false);
    }
  };

  const handleViewVerification = (letterhead) => {
    const verificationUrl = `${window.location.origin}/verify?id=${letterhead.letterheadId}&type=letterhead`;
    window.open(verificationUrl, "_blank");
  };

  const createLetterheadPrintTemplate = (letterhead) => {
    const currentDate = new Date().toLocaleDateString("en-IN");

    return `
      <div style="
        font-family: 'Times New Roman', serif;
        max-width: 210mm;
        margin: 0 auto;
        padding: 40px;
        background: white;
        color: #333;
        line-height: 1.6;
      ">
        <!-- Header -->
        <div class="letterhead-header" style="
          border-bottom: 4px solid #dc3545;
          margin-bottom: 30px;
          padding-bottom: 20px;
          display: flex;
          justify-content: space-between;
          align-items: center;
        ">
          <div>
            <h1 style="color: #dc3545; margin: 0; font-size: 28px; font-weight: bold;">
              Hare Krishna Medical
            </h1>
            <p style="margin: 5px 0 0 0; color: #666;">
              Professional Healthcare Services
            </p>
          </div>
          <div style="text-align: right;">
            <div style="margin-bottom: 3px; font-weight: 600;">Ref: ${letterhead.letterheadId}</div>
            <div style="font-weight: 600;">Date: ${currentDate}</div>
          </div>
        </div>

        <!-- Content -->
        <div style="margin: 40px 0;">
          <h2 style="color: #dc3545; margin-bottom: 20px; font-size: 24px; text-align: center;">
            ${letterhead.title}
          </h2>
          <div style="font-size: 14px; line-height: 1.8;">
            ${letterhead.content}
          </div>
        </div>

        <!-- Footer -->
        <div class="letterhead-footer" style="
          border-top: 2px solid #6c757d;
          margin-top: 40px;
          padding-top: 20px;
          text-align: center;
          font-size: 12px;
          color: #666;
        ">
          <p style="margin: 0 0 10px 0;">
            <strong>Hare Krishna Medical</strong> | Professional Healthcare Services
          </p>
          <p style="margin: 0 0 10px 0;">
            📧 info@harekrishnamedical.com | 📞 +91-XXXXX-XXXXX
          </p>
          <p style="margin: 10px 0 0 0; font-size: 11px; color: #28a745;">
            ✅ This letterhead has been verified and is authentic
          </p>
        </div>
      </div>
    `;
  };

  // Utility functions
  const showNotification = (message, type) => {
    // You can implement a toast notification system here
    console.log(`${type}: ${message}`);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const getStatusBadge = (status) => {
    const statusConfig = statusOptions.find((s) => s.value === status);
    return (
      <Badge bg={statusConfig?.variant || "secondary"}>
        {statusConfig?.label || status}
      </Badge>
    );
  };

  const resetFilters = () => {
    setSearchTerm("");
    setStatusFilter("");
    setTypeFilter("");
    setCurrentPage(1);
  };

  // Effects
  useEffect(() => {
    fetchLetterheads();
  }, [currentPage, statusFilter, typeFilter]);

  useEffect(() => {
    fetchStats();
  }, []);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (searchTerm || (!searchTerm && currentPage === 1)) {
        setCurrentPage(1);
        fetchLetterheads();
      }
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [searchTerm]);

  // Render functions
  const renderStatsCards = () => (
    <Row className="mb-4">
      <Col md={3}>
        <ThemeCard>
          <Card.Body className="text-center">
            <h3 className="text-primary">{stats.total}</h3>
            <p className="mb-0">Total Letterheads</p>
          </Card.Body>
        </ThemeCard>
      </Col>
      <Col md={3}>
        <ThemeCard>
          <Card.Body className="text-center">
            <h3 className="text-secondary">{stats.draft}</h3>
            <p className="mb-0">Draft</p>
          </Card.Body>
        </ThemeCard>
      </Col>
      <Col md={3}>
        <ThemeCard>
          <Card.Body className="text-center">
            <h3 className="text-success">{stats.issued}</h3>
            <p className="mb-0">Issued</p>
          </Card.Body>
        </ThemeCard>
      </Col>
      <Col md={3}>
        <ThemeCard>
          <Card.Body className="text-center">
            <h3 className="text-primary">{stats.sent}</h3>
            <p className="mb-0">Sent</p>
          </Card.Body>
        </ThemeCard>
      </Col>
    </Row>
  );

  const renderFilters = () => (
    <ThemeCard className="mb-4">
      <Card.Body>
        <Row className="align-items-end">
          <Col md={4}>
            <Form.Group>
              <Form.Label>Search</Form.Label>
              <InputGroup>
                <Form.Control
                  type="text"
                  placeholder="Search letterheads..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                <InputGroup.Text>
                  <i className="bi bi-search"></i>
                </InputGroup.Text>
              </InputGroup>
            </Form.Group>
          </Col>
          <Col md={3}>
            <Form.Group>
              <Form.Label>Status</Form.Label>
              <Form.Select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <option value="">All Statuses</option>
                {statusOptions.map((status) => (
                  <option key={status.value} value={status.value}>
                    {status.label}
                  </option>
                ))}
              </Form.Select>
            </Form.Group>
          </Col>
          <Col md={3}>
            <Form.Group>
              <Form.Label>Type</Form.Label>
              <Form.Select
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value)}
              >
                <option value="">All Types</option>
                {letterTypes.map((type) => (
                  <option key={type} value={type}>
                    {type.charAt(0).toUpperCase() + type.slice(1)}
                  </option>
                ))}
              </Form.Select>
            </Form.Group>
          </Col>
          <Col md={2}>
            <div className="d-grid">
              <Button variant="outline-secondary" onClick={resetFilters}>
                <i className="bi bi-arrow-clockwise me-1"></i>
                Reset
              </Button>
            </div>
          </Col>
        </Row>
      </Card.Body>
    </ThemeCard>
  );

  const renderLetterheadsTable = () => {
    if (loading) {
      return (
        <div className="text-center py-5">
          <Spinner animation="border" role="status">
            <span className="visually-hidden">Loading...</span>
          </Spinner>
        </div>
      );
    }

    if (error) {
      return (
        <Alert variant="danger">
          <i className="bi bi-exclamation-triangle me-2"></i>
          {error}
          <Button
            variant="outline-danger"
            size="sm"
            className="ms-2"
            onClick={fetchLetterheads}
          >
            Retry
          </Button>
        </Alert>
      );
    }

    if (letterheads.length === 0) {
      return (
        <Alert variant="info">
          <i className="bi bi-info-circle me-2"></i>
          No letterheads found.
          <Link to="/admin/letterheads/add" className="ms-2">
            Create your first letterhead
          </Link>
        </Alert>
      );
    }

    return (
      <Table responsive hover>
        <thead>
          <tr>
            <th>Letterhead ID</th>
            <th>Title</th>
            <th>Type</th>
            <th>Recipient</th>
            <th>Status</th>
            <th>Issue Date</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {letterheads.map((letterhead) => (
            <tr key={letterhead._id}>
              <td>
                <code>{letterhead.letterheadId}</code>
              </td>
              <td className="fw-bold">{letterhead.title}</td>
              <td>
                <Badge bg="info">
                  {letterhead.letterType?.charAt(0).toUpperCase() +
                    letterhead.letterType?.slice(1) || "Document"}
                </Badge>
              </td>
              <td>
                <div>
                  <strong>{letterhead.recipient?.name || "General"}</strong>
                  {letterhead.recipient?.organization && (
                    <>
                      <br />
                      <small className="text-muted">
                        {letterhead.recipient.organization}
                      </small>
                    </>
                  )}
                  {!letterhead.recipient?.name && (
                    <small className="text-muted">No specific recipient</small>
                  )}
                </div>
              </td>
              <td>{getStatusBadge(letterhead.status)}</td>
              <td>
                {formatDate(letterhead.issueDate || letterhead.createdAt)}
              </td>
              <td>
                <div className="btn-group" role="group">
                  {/* View/Edit Actions */}
                  <Button
                    as={Link}
                    to={`/admin/letterheads/edit/${letterhead._id}`}
                    variant="outline-primary"
                    size="sm"
                    title="Edit Letterhead"
                  >
                    <i className="bi bi-pencil"></i>
                  </Button>

                  {/* Professional Actions Dropdown */}
                  <div className="btn-group">
                    <Button
                      variant="outline-success"
                      size="sm"
                      onClick={() => handleViewLetterhead(letterhead)}
                      title="View & Download Options"
                    >
                      <i className="bi bi-eye"></i>
                    </Button>
                    <Button
                      variant="outline-success"
                      size="sm"
                      className="dropdown-toggle dropdown-toggle-split"
                      data-bs-toggle="dropdown"
                      aria-expanded="false"
                      title="More Actions"
                    >
                      <span className="visually-hidden">Toggle Dropdown</span>
                    </Button>
                    <ul className="dropdown-menu">
                      <li>
                        <button
                          className="dropdown-item"
                          onClick={() => handlePrintLetterhead(letterhead)}
                        >
                          <i className="bi bi-printer-fill me-2 text-success"></i>
                          Professional Print
                        </button>
                      </li>
                      <li>
                        <button
                          className="dropdown-item"
                          onClick={() => handleDownloadPDF(letterhead)}
                        >
                          <i className="bi bi-file-earmark-pdf-fill me-2 text-danger"></i>
                          Download PDF
                        </button>
                      </li>
                      <li>
                        <button
                          className="dropdown-item"
                          onClick={() => handleDownloadHTML(letterhead)}
                        >
                          <i className="bi bi-file-earmark-code-fill me-2 text-primary"></i>
                          Download HTML
                        </button>
                      </li>
                      <li>
                        <hr className="dropdown-divider" />
                      </li>
                      <li>
                        <button
                          className="dropdown-item"
                          onClick={() => handleViewVerification(letterhead)}
                        >
                          <i className="bi bi-qr-code-scan me-2 text-info"></i>
                          View Verification
                        </button>
                      </li>
                    </ul>
                  </div>

                  {/* Status Actions */}
                  {letterhead.status === "draft" && (
                    <Button
                      variant="outline-success"
                      size="sm"
                      onClick={() => handleMarkAsIssued(letterhead)}
                      disabled={actionLoading}
                      title="Mark as Issued"
                    >
                      <i className="bi bi-check-circle"></i>
                    </Button>
                  )}

                  {letterhead.status === "issued" && (
                    <Button
                      variant="outline-info"
                      size="sm"
                      onClick={() => handleMarkAsSent(letterhead)}
                      disabled={actionLoading}
                      title="Mark as Sent"
                    >
                      <i className="bi bi-send"></i>
                    </Button>
                  )}

                  <Button
                    variant="outline-danger"
                    size="sm"
                    onClick={() => {
                      setLetterheadToDelete(letterhead);
                      setShowDeleteModal(true);
                    }}
                    disabled={actionLoading}
                    title="Delete"
                  >
                    <i className="bi bi-trash"></i>
                  </Button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    );
  };

  const renderPagination = () => {
    if (totalPages <= 1) return null;

    const items = [];
    const maxVisible = 5;
    let start = Math.max(1, currentPage - Math.floor(maxVisible / 2));
    let end = Math.min(totalPages, start + maxVisible - 1);

    if (end - start + 1 < maxVisible) {
      start = Math.max(1, end - maxVisible + 1);
    }

    for (let number = start; number <= end; number++) {
      items.push(
        <Pagination.Item
          key={number}
          active={number === currentPage}
          onClick={() => setCurrentPage(number)}
        >
          {number}
        </Pagination.Item>,
      );
    }

    return (
      <div className="d-flex justify-content-between align-items-center">
        <div>
          <small className="text-muted">
            Showing {letterheads.length} of {totalLetterheads} letterheads
          </small>
        </div>
        <Pagination className="mb-0">
          <Pagination.First
            onClick={() => setCurrentPage(1)}
            disabled={currentPage === 1}
          />
          <Pagination.Prev
            onClick={() => setCurrentPage(currentPage - 1)}
            disabled={currentPage === 1}
          />
          {items}
          <Pagination.Next
            onClick={() => setCurrentPage(currentPage + 1)}
            disabled={currentPage === totalPages}
          />
          <Pagination.Last
            onClick={() => setCurrentPage(totalPages)}
            disabled={currentPage === totalPages}
          />
        </Pagination>
      </div>
    );
  };

  return (
    <Container fluid>
      <PageHeroSection
        title="Letterhead Management"
        subtitle="Manage official letterheads and documents"
        breadcrumbs={[
          { label: "Admin", href: "/admin" },
          { label: "Letterheads", active: true },
        ]}
      />

      <ThemeSection>
        {renderStatsCards()}
        {renderFilters()}

        <ThemeCard>
          <Card.Header className="d-flex justify-content-between align-items-center">
            <h5 className="mb-0">Letterheads</h5>
            <ThemeButton as={Link} to="/admin/letterheads/add">
              <i className="bi bi-plus-lg me-2"></i>
              Create Letterhead
            </ThemeButton>
          </Card.Header>
          <Card.Body className="p-0">{renderLetterheadsTable()}</Card.Body>
          {letterheads.length > 0 && (
            <Card.Footer>{renderPagination()}</Card.Footer>
          )}
        </ThemeCard>
      </ThemeSection>

      {/* Delete Confirmation Modal */}
      <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Confirm Delete</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Are you sure you want to delete the letterhead "
          {letterheadToDelete?.title}"? This action cannot be undone.
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant="secondary"
            onClick={() => setShowDeleteModal(false)}
            disabled={actionLoading}
          >
            Cancel
          </Button>
          <Button
            variant="danger"
            onClick={handleDelete}
            disabled={actionLoading}
          >
            {actionLoading ? (
              <>
                <Spinner size="sm" className="me-2" />
                Deleting...
              </>
            ) : (
              "Delete"
            )}
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default AdminLetterheads;
