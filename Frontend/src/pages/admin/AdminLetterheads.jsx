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
  OverlayTrigger,
  Tooltip,
} from "react-bootstrap";
import { Link } from "react-router-dom";
import * as XLSX from "xlsx";
import { formatDateTime, getRelativeTime } from "../../utils/dateUtils";
import { api, safeApiCall } from "../../utils/apiClient";
import OfficialLetterheadDesign from "../../components/common/OfficialLetterheadDesign";

const AdminLetterheads = () => {
  const [letterheads, setLetterheads] = useState([]);
  const [filteredLetterheads, setFilteredLetterheads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [typeFilter, setTypeFilter] = useState("");
  const [dateFilter, setDateFilter] = useState("");
  const [selectedLetterhead, setSelectedLetterhead] = useState(null);
  const [showViewModal, setShowViewModal] = useState(false);
  const [exporting, setExporting] = useState(false);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalLetterheads: 0,
  });

  // Real-time update listener
  useEffect(() => {
    const handleRefreshLetterheads = () => {
      fetchLetterheads(pagination.currentPage);
    };

    window.addEventListener("refreshLetterheads", handleRefreshLetterheads);
    return () => {
      window.removeEventListener(
        "refreshLetterheads",
        handleRefreshLetterheads,
      );
    };
  }, [pagination.currentPage]);

  // Fetch all letterheads
  const fetchLetterheads = async (page = 1) => {
    setLoading(true);
    setError(null);

    try {
      const response = await safeApiCall(() =>
        api.get(`/letterheads?page=${page}&limit=10`),
      );

      if (response.success) {
        setLetterheads(response.letterheads);
        setFilteredLetterheads(response.letterheads);
        setPagination(response.pagination);
      } else {
        setError(response.message || "Failed to fetch letterheads");
      }
    } catch (err) {
      console.error("Fetch letterheads error:", err);
      setError("Failed to fetch letterheads");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLetterheads();

    // Setup real-time refresh listener for letterheads
    const handleRefreshLetterheads = () => {
      console.log("Refreshing letterheads due to real-time updates");
      fetchLetterheads();
    };

    window.addEventListener("refreshLetterheads", handleRefreshLetterheads);

    return () => {
      window.removeEventListener(
        "refreshLetterheads",
        handleRefreshLetterheads,
      );
    };
  }, []);

  // Filter letterheads based on search term, status, and type
  useEffect(() => {
    let filtered = letterheads;

    if (searchTerm) {
      filtered = filtered.filter(
        (letterhead) =>
          letterhead.letterId
            ?.toLowerCase()
            .includes(searchTerm.toLowerCase()) ||
          letterhead.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          letterhead.subject
            ?.toLowerCase()
            .includes(searchTerm.toLowerCase()) ||
          letterhead.recipientFullName
            ?.toLowerCase()
            .includes(searchTerm.toLowerCase()) ||
          letterhead.host?.name
            ?.toLowerCase()
            .includes(searchTerm.toLowerCase()),
      );
    }

    if (statusFilter) {
      filtered = filtered.filter(
        (letterhead) => letterhead.status === statusFilter,
      );
    }

    if (typeFilter) {
      filtered = filtered.filter(
        (letterhead) => letterhead.letterType === typeFilter,
      );
    }

    if (dateFilter) {
      const today = new Date();
      let filterDate = new Date();

      switch (dateFilter) {
        case "today":
          filterDate.setHours(0, 0, 0, 0);
          break;
        case "week":
          filterDate.setDate(today.getDate() - 7);
          break;
        case "month":
          filterDate.setMonth(today.getMonth() - 1);
          break;
        default:
          filterDate = null;
      }

      if (filterDate) {
        filtered = filtered.filter(
          (letterhead) => new Date(letterhead.createdAt) >= filterDate,
        );
      }
    }

    setFilteredLetterheads(filtered);
  }, [letterheads, searchTerm, statusFilter, typeFilter, dateFilter]);

  // Handle view letterhead
  const handleViewLetterhead = (letterhead) => {
    setSelectedLetterhead(letterhead);
    setShowViewModal(true);
  };

  // Handle mark as sent
  const handleMarkAsSent = async (letterheadId) => {
    try {
      const response = await safeApiCall(() =>
        api.put(`/letterheads/${letterheadId}/mark-sent`),
      );

      if (response.success) {
        fetchLetterheads(pagination.currentPage);
        // Show success notification
        window.dispatchEvent(
          new CustomEvent("showNotification", {
            detail: {
              type: "success",
              message: "Letterhead marked as sent successfully!",
            },
          }),
        );
      } else {
        setError(response.message || "Failed to mark letterhead as sent");
      }
    } catch (error) {
      console.error("Mark as sent error:", error);
      setError("Failed to mark letterhead as sent");
    }
  };

  // Handle delete letterhead
  const handleDeleteLetterhead = async (letterheadId) => {
    if (!window.confirm("Are you sure you want to delete this letterhead?")) {
      return;
    }

    try {
      const response = await safeApiCall(() =>
        api.delete(`/letterheads/${letterheadId}`),
      );

      if (response.success) {
        fetchLetterheads(pagination.currentPage);
        // Show success notification
        window.dispatchEvent(
          new CustomEvent("showNotification", {
            detail: {
              type: "success",
              message: "Letterhead deleted successfully!",
            },
          }),
        );
      } else {
        setError(response.message || "Failed to delete letterhead");
      }
    } catch (error) {
      console.error("Delete letterhead error:", error);
      setError("Failed to delete letterhead");
    }
  };

  // Handle export to Excel
  const handleExportToExcel = () => {
    setExporting(true);
    try {
      const exportData = filteredLetterheads.map((letterhead) => ({
        "Letter ID": letterhead.letterId,
        "Letter Type": letterhead.letterType,
        Title: letterhead.title,
        "Recipient Name": letterhead.recipientFullName,
        Subject: letterhead.subject,
        Status: letterhead.status,
        "Host Name": letterhead.host?.name,
        "Created Date": formatDateTime(letterhead.createdAt),
        "Created By": letterhead.createdBy?.fullName,
      }));

      const ws = XLSX.utils.json_to_sheet(exportData);
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, "Letterheads");
      XLSX.writeFile(
        wb,
        `letterheads_${new Date().toISOString().split("T")[0]}.xlsx`,
      );
    } catch (error) {
      console.error("Export error:", error);
      setError("Failed to export letterheads");
    } finally {
      setExporting(false);
    }
  };

  // Handle download PDF
  const handleDownloadPDF = async (letterheadId) => {
    try {
      const response = await api.get(`/letterheads/${letterheadId}/pdf`, {
        responseType: "blob",
      });

      const blob = new Blob([response.data], { type: "application/pdf" });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `letterhead-${letterheadId}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Download PDF error:", error);
      setError("Failed to download PDF");
    }
  };

  const getStatusBadge = (status) => {
    const variants = {
      draft: { bg: "secondary", icon: "bi-pencil" },
      finalized: { bg: "info", icon: "bi-check-circle" },
      sent: { bg: "success", icon: "bi-send" },
      archived: { bg: "dark", icon: "bi-archive" },
    };
    const variant = variants[status] || variants.draft;
    return (
      <Badge bg={variant.bg} className="d-flex align-items-center gap-1">
        <i className={variant.icon}></i>
        {status}
      </Badge>
    );
  };

  const getTypeBadge = (type) => {
    const variants = {
      certificate: { bg: "primary", icon: "bi-award" },
      request: { bg: "warning", icon: "bi-hand-thumbs-up" },
      application: { bg: "info", icon: "bi-file-earmark-text" },
      notice: { bg: "danger", icon: "bi-exclamation-triangle" },
      recommendation: { bg: "success", icon: "bi-star" },
    };
    const variant = variants[type] || variants.certificate;
    return (
      <Badge bg={variant.bg} className="d-flex align-items-center gap-1">
        <i className={variant.icon}></i>
        {type}
      </Badge>
    );
  };

  if (loading) {
    return (
      <div className="admin-letterheads-loading">
        <style jsx>{`
          .admin-letterheads-loading {
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            min-height: 60vh;
            background: linear-gradient(135deg, #f8f9fa 0%, #ffffff 100%);
          }
          .loading-spinner {
            width: 3rem;
            height: 3rem;
            border: 0.3rem solid rgba(220, 53, 69, 0.2);
            border-top: 0.3rem solid #dc3545;
            border-radius: 50%;
            animation: spin 1s linear infinite;
          }
          @keyframes spin {
            0% {
              transform: rotate(0deg);
            }
            100% {
              transform: rotate(360deg);
            }
          }
        `}</style>
        <div className="loading-spinner"></div>
        <p className="mt-3 text-muted fw-medium">Loading letterheads...</p>
      </div>
    );
  }

  return (
    <div className="admin-letterheads">
      <style jsx>{`
        .admin-letterheads {
          background: linear-gradient(135deg, #f8f9fa 0%, #ffffff 100%);
          min-height: 100vh;
          padding: 2rem 0;
        }

        .letterheads-hero {
          background: linear-gradient(135deg, #dc3545 0%, #b91c2c 100%);
          color: white;
          padding: 3rem 0;
          margin-bottom: 2rem;
          border-radius: 0 0 20px 20px;
          box-shadow: 0 10px 30px rgba(220, 53, 69, 0.3);
        }

        .letterheads-card {
          border: none;
          border-radius: 15px;
          box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1);
          transition: all 0.3s ease;
          overflow: hidden;
        }

        .letterheads-card:hover {
          transform: translateY(-2px);
          box-shadow: 0 15px 35px rgba(0, 0, 0, 0.15);
        }

        .letterheads-card .card-header {
          background: linear-gradient(135deg, #dc3545 0%, #b91c2c 100%);
          color: white;
          border: none;
          padding: 1.5rem 2rem;
        }

        .filter-section {
          background: white;
          border-radius: 15px;
          padding: 1.5rem;
          margin-bottom: 2rem;
          box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
        }

        .letterheads-table {
          background: white;
          border-radius: 10px;
          overflow: hidden;
        }

        .letterheads-table th {
          background: linear-gradient(135deg, #dc3545 0%, #b91c2c 100%);
          color: white;
          border: none;
          padding: 1rem;
          font-weight: 600;
          font-size: 0.9rem;
        }

        .letterheads-table td {
          padding: 1rem;
          border-bottom: 1px solid #f1f3f4;
          vertical-align: middle;
        }

        .letterheads-table tbody tr {
          transition: all 0.2s ease;
        }

        .letterheads-table tbody tr:hover {
          background: rgba(220, 53, 69, 0.05);
          transform: translateX(2px);
        }

        .action-btn {
          background: transparent;
          border: 1px solid #dee2e6;
          border-radius: 8px;
          padding: 0.5rem;
          margin: 0 0.2rem;
          color: #6c757d;
          transition: all 0.2s ease;
        }

        .action-btn:hover {
          background: #dc3545;
          color: white;
          border-color: #dc3545;
          transform: translateY(-1px);
        }

        .letterhead-btn {
          background: linear-gradient(135deg, #dc3545 0%, #b91c2c 100%);
          border: none;
          border-radius: 10px;
          padding: 0.7rem 1.5rem;
          font-weight: 600;
          color: white;
          transition: all 0.3s ease;
          box-shadow: 0 4px 15px rgba(220, 53, 69, 0.3);
        }

        .letterhead-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 25px rgba(220, 53, 69, 0.4);
          color: white;
        }

        .letterhead-btn-outline {
          background: transparent;
          border: 2px solid #dc3545;
          color: #dc3545;
          border-radius: 10px;
          padding: 0.7rem 1.5rem;
          font-weight: 600;
          transition: all 0.3s ease;
        }

        .letterhead-btn-outline:hover {
          background: #dc3545;
          color: white;
          transform: translateY(-2px);
        }

        .stats-badge {
          background: linear-gradient(
            135deg,
            rgba(220, 53, 69, 0.1) 0%,
            rgba(185, 28, 44, 0.1) 100%
          );
          color: #dc3545;
          border: 2px solid rgba(220, 53, 69, 0.2);
          border-radius: 15px;
          padding: 0.75rem 1.25rem;
          font-weight: 600;
          font-size: 1.1rem;
        }

        .empty-state {
          text-align: center;
          padding: 4rem 2rem;
          color: #6c757d;
        }

        .empty-state-icon {
          font-size: 4rem;
          color: #dc3545;
          opacity: 0.3;
          margin-bottom: 1rem;
        }

        .pagination-custom {
          background: white;
          border-radius: 10px;
          padding: 1rem;
          box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
        }

        .pagination-custom .page-link {
          border: none;
          color: #dc3545;
          padding: 0.75rem 1rem;
          margin: 0 0.2rem;
          border-radius: 8px;
          transition: all 0.2s ease;
        }

        .pagination-custom .page-item.active .page-link {
          background: linear-gradient(135deg, #dc3545 0%, #b91c2c 100%);
          color: white;
          box-shadow: 0 4px 15px rgba(220, 53, 69, 0.3);
        }

        .pagination-custom .page-link:hover {
          background: rgba(220, 53, 69, 0.1);
          transform: translateY(-1px);
        }

        .alert-custom {
          border: none;
          border-radius: 10px;
          padding: 1rem 1.5rem;
          margin-bottom: 2rem;
          border-left: 4px solid #dc3545;
        }

        @media (max-width: 768px) {
          .letterheads-hero {
            padding: 2rem 0;
            margin-bottom: 1rem;
          }

          .filter-section {
            padding: 1rem;
            margin-bottom: 1rem;
          }

          .letterheads-table {
            font-size: 0.9rem;
          }

          .letterheads-table th,
          .letterheads-table td {
            padding: 0.75rem 0.5rem;
          }
        }
      `}</style>

      <Container fluid>
        {/* Hero Section */}
        <div className="letterheads-hero">
          <Container>
            <div className="text-center">
              <h1 className="display-5 fw-bold mb-3">
                <i className="bi bi-file-text-fill me-3"></i>
                Letterhead Management
              </h1>
              <p className="lead opacity-90">
                Manage and track all official letterheads with professional
                formatting
              </p>
              <div className="stats-badge d-inline-block">
                <i className="bi bi-files me-2"></i>
                {filteredLetterheads.length} Total Letterheads
              </div>
            </div>
          </Container>
        </div>

        <Container>
          {/* Error Alert */}
          {error && (
            <div className="alert-custom bg-danger-subtle text-danger">
              <i className="bi bi-exclamation-triangle-fill me-2"></i>
              {error}
              <button
                type="button"
                className="btn-close float-end"
                onClick={() => setError(null)}
              ></button>
            </div>
          )}

          {/* Filter Section */}
          <div className="filter-section">
            <Row className="align-items-end">
              <Col md={3}>
                <Form.Group>
                  <Form.Label className="fw-semibold text-muted">
                    Search
                  </Form.Label>
                  <InputGroup>
                    <InputGroup.Text>
                      <i className="bi bi-search"></i>
                    </InputGroup.Text>
                    <Form.Control
                      type="text"
                      placeholder="Search letterheads..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </InputGroup>
                </Form.Group>
              </Col>
              <Col md={2}>
                <Form.Group>
                  <Form.Label className="fw-semibold text-muted">
                    Status
                  </Form.Label>
                  <Form.Select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                  >
                    <option value="">All Status</option>
                    <option value="draft">Draft</option>
                    <option value="finalized">Finalized</option>
                    <option value="sent">Sent</option>
                    <option value="archived">Archived</option>
                  </Form.Select>
                </Form.Group>
              </Col>
              <Col md={2}>
                <Form.Group>
                  <Form.Label className="fw-semibold text-muted">
                    Type
                  </Form.Label>
                  <Form.Select
                    value={typeFilter}
                    onChange={(e) => setTypeFilter(e.target.value)}
                  >
                    <option value="">All Types</option>
                    <option value="certificate">Certificate</option>
                    <option value="request">Request</option>
                    <option value="application">Application</option>
                    <option value="notice">Notice</option>
                    <option value="recommendation">Recommendation</option>
                  </Form.Select>
                </Form.Group>
              </Col>
              <Col md={2}>
                <Form.Group>
                  <Form.Label className="fw-semibold text-muted">
                    Date Range
                  </Form.Label>
                  <Form.Select
                    value={dateFilter}
                    onChange={(e) => setDateFilter(e.target.value)}
                  >
                    <option value="">All Dates</option>
                    <option value="today">Today</option>
                    <option value="week">Last Week</option>
                    <option value="month">Last Month</option>
                  </Form.Select>
                </Form.Group>
              </Col>
              <Col md={3} className="d-flex gap-2">
                <Button
                  variant="outline-secondary"
                  onClick={() => {
                    setSearchTerm("");
                    setStatusFilter("");
                    setTypeFilter("");
                    setDateFilter("");
                  }}
                >
                  <i className="bi bi-arrow-counterclockwise me-1"></i>
                  Clear
                </Button>
                <Button
                  className="letterhead-btn-outline"
                  onClick={handleExportToExcel}
                  disabled={exporting}
                >
                  {exporting ? (
                    <Spinner animation="border" size="sm" />
                  ) : (
                    <i className="bi bi-download me-1"></i>
                  )}
                  Export
                </Button>
              </Col>
            </Row>
          </div>

          {/* Main Content Card */}
          <Card className="letterheads-card">
            <Card.Header className="d-flex justify-content-between align-items-center">
              <h5 className="mb-0 fw-bold">
                <i className="bi bi-list-ul me-2"></i>
                All Letterheads ({filteredLetterheads.length})
              </h5>
              <Button
                as={Link}
                to="/admin/letterheads/add"
                className="letterhead-btn"
              >
                <i className="bi bi-plus-circle me-2"></i>
                Create New
              </Button>
            </Card.Header>

            <Card.Body className="p-0">
              {filteredLetterheads.length === 0 ? (
                <div className="empty-state">
                  <div className="empty-state-icon">
                    <i className="bi bi-file-text"></i>
                  </div>
                  <h4 className="fw-bold mb-3">No Letterheads Found</h4>
                  <p className="text-muted mb-4">
                    {searchTerm || statusFilter || typeFilter || dateFilter
                      ? "No letterheads match your current filters."
                      : "Get started by creating your first letterhead."}
                  </p>
                  <Button
                    as={Link}
                    to="/admin/letterheads/add"
                    className="letterhead-btn"
                  >
                    <i className="bi bi-plus-circle me-2"></i>
                    Create First Letterhead
                  </Button>
                </div>
              ) : (
                <div className="table-responsive">
                  <Table className="letterheads-table mb-0">
                    <thead>
                      <tr>
                        <th>Letter ID</th>
                        <th>Type</th>
                        <th>Title</th>
                        <th>Recipient</th>
                        <th>Subject</th>
                        <th>Status</th>
                        <th>Created</th>
                        <th className="text-center">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredLetterheads.map((letterhead) => (
                        <tr key={letterhead._id}>
                          <td>
                            <code className="bg-light px-2 py-1 rounded">
                              {letterhead.letterId}
                            </code>
                          </td>
                          <td>{getTypeBadge(letterhead.letterType)}</td>
                          <td>
                            <div className="fw-semibold">
                              {letterhead.title}
                            </div>
                          </td>
                          <td>
                            <div className="fw-medium">
                              {letterhead.recipientFullName}
                            </div>
                            {letterhead.recipient?.company && (
                              <small className="text-muted">
                                {letterhead.recipient.company}
                              </small>
                            )}
                          </td>
                          <td>
                            <div
                              className="text-truncate"
                              style={{ maxWidth: "200px" }}
                              title={letterhead.subject}
                            >
                              {letterhead.subject}
                            </div>
                          </td>
                          <td>{getStatusBadge(letterhead.status)}</td>
                          <td>
                            <div className="fw-medium">
                              {formatDateTime(letterhead.createdAt)}
                            </div>
                            <small className="text-muted">
                              {getRelativeTime(letterhead.createdAt)}
                            </small>
                          </td>
                          <td>
                            <div className="d-flex justify-content-center gap-1">
                              <OverlayTrigger
                                placement="top"
                                overlay={<Tooltip>View Details</Tooltip>}
                              >
                                <button
                                  className="action-btn"
                                  onClick={() =>
                                    handleViewLetterhead(letterhead)
                                  }
                                >
                                  <i className="bi bi-eye"></i>
                                </button>
                              </OverlayTrigger>

                              <OverlayTrigger
                                placement="top"
                                overlay={<Tooltip>Edit</Tooltip>}
                              >
                                <Link
                                  to={`/admin/letterheads/edit/${letterhead._id}`}
                                  className="action-btn text-decoration-none"
                                >
                                  <i className="bi bi-pencil"></i>
                                </Link>
                              </OverlayTrigger>

                              <OverlayTrigger
                                placement="top"
                                overlay={<Tooltip>Download PDF</Tooltip>}
                              >
                                <button
                                  className="action-btn"
                                  onClick={() =>
                                    handleDownloadPDF(letterhead._id)
                                  }
                                >
                                  <i className="bi bi-download"></i>
                                </button>
                              </OverlayTrigger>

                              {letterhead.status === "finalized" && (
                                <OverlayTrigger
                                  placement="top"
                                  overlay={<Tooltip>Mark as Sent</Tooltip>}
                                >
                                  <button
                                    className="action-btn"
                                    onClick={() =>
                                      handleMarkAsSent(letterhead._id)
                                    }
                                  >
                                    <i className="bi bi-send"></i>
                                  </button>
                                </OverlayTrigger>
                              )}

                              <OverlayTrigger
                                placement="top"
                                overlay={<Tooltip>Delete</Tooltip>}
                              >
                                <button
                                  className="action-btn text-danger"
                                  onClick={() =>
                                    handleDeleteLetterhead(letterhead._id)
                                  }
                                >
                                  <i className="bi bi-trash"></i>
                                </button>
                              </OverlayTrigger>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </Table>
                </div>
              )}
            </Card.Body>
          </Card>

          {/* Pagination */}
          {pagination.totalPages > 1 && (
            <div className="pagination-custom mt-4">
              <Row className="align-items-center">
                <Col md={6}>
                  <div className="d-flex justify-content-center justify-md-start">
                    <nav>
                      <ul className="pagination mb-0">
                        <li
                          className={`page-item ${!pagination.hasPrevPage ? "disabled" : ""}`}
                        >
                          <button
                            className="page-link"
                            onClick={() =>
                              fetchLetterheads(pagination.currentPage - 1)
                            }
                            disabled={!pagination.hasPrevPage}
                          >
                            <i className="bi bi-chevron-left"></i>
                          </button>
                        </li>
                        <li className="page-item active">
                          <span className="page-link">
                            {pagination.currentPage} of {pagination.totalPages}
                          </span>
                        </li>
                        <li
                          className={`page-item ${!pagination.hasNextPage ? "disabled" : ""}`}
                        >
                          <button
                            className="page-link"
                            onClick={() =>
                              fetchLetterheads(pagination.currentPage + 1)
                            }
                            disabled={!pagination.hasNextPage}
                          >
                            <i className="bi bi-chevron-right"></i>
                          </button>
                        </li>
                      </ul>
                    </nav>
                  </div>
                </Col>
                <Col md={6}>
                  <div className="text-center text-md-end text-muted">
                    Showing {(pagination.currentPage - 1) * 10 + 1} -{" "}
                    {Math.min(
                      pagination.currentPage * 10,
                      pagination.totalLetterheads,
                    )}{" "}
                    of {pagination.totalLetterheads} letterheads
                  </div>
                </Col>
              </Row>
            </div>
          )}
        </Container>

        {/* View Letterhead Modal */}
        <Modal
          show={showViewModal}
          onHide={() => setShowViewModal(false)}
          size="lg"
          centered
        >
          <Modal.Header closeButton className="bg-danger text-white">
            <Modal.Title>
              <i className="bi bi-file-text me-2"></i>
              Letterhead Details
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            {selectedLetterhead && (
              <OfficialLetterheadDesign
                letterheadData={selectedLetterhead}
                qrCode={selectedLetterhead.qrCode}
                showActionButtons={true}
                onPrint={() => {
                  // The print functionality is handled by the component
                }}
                onDownload={() => handleDownloadPDF(selectedLetterhead._id)}
              />
            )}
          </Modal.Body>
          <Modal.Footer>
            {selectedLetterhead && (
              <Button
                className="letterhead-btn-outline"
                as={Link}
                to={`/admin/letterheads/edit/${selectedLetterhead._id}`}
              >
                <i className="bi bi-pencil me-1"></i>Edit Letterhead
              </Button>
            )}
            <Button
              variant="outline-secondary"
              onClick={() => setShowViewModal(false)}
            >
              Close
            </Button>
          </Modal.Footer>
        </Modal>
      </Container>
    </div>
  );
};

export default AdminLetterheads;
