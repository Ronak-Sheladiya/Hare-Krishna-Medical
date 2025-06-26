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
import { formatDateTime, getRelativeTime } from "../../utils/dateUtils";
import { api, safeApiCall } from "../../utils/apiClient";
import {
  PageHeroSection,
  ThemeCard,
  ThemeButton,
} from "../../components/common/ConsistentTheme";

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
  }, []);

  // Filter letterheads based on search term, status, and type
  useEffect(() => {
    let filtered = letterheads;

    if (searchTerm) {
      filtered = filtered.filter(
        (letterhead) =>
          letterhead.letterId
            .toLowerCase()
            .includes(searchTerm.toLowerCase()) ||
          letterhead.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          letterhead.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
          letterhead.recipientFullName
            ?.toLowerCase()
            .includes(searchTerm.toLowerCase()) ||
          letterhead.host?.name
            .toLowerCase()
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
      const filterDate = new Date();

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
        alert("Letterhead marked as sent successfully!");
      } else {
        alert(response.message || "Failed to mark letterhead as sent");
      }
    } catch (error) {
      console.error("Mark as sent error:", error);
      alert("Failed to mark letterhead as sent");
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
        alert("Letterhead deleted successfully!");
      } else {
        alert(response.message || "Failed to delete letterhead");
      }
    } catch (error) {
      console.error("Delete letterhead error:", error);
      alert("Failed to delete letterhead");
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
      alert("Failed to export letterheads");
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
      alert("Failed to download PDF");
    }
  };

  const getStatusBadge = (status) => {
    const variants = {
      draft: "secondary",
      finalized: "info",
      sent: "success",
      archived: "dark",
    };
    return <Badge bg={variants[status] || "secondary"}>{status}</Badge>;
  };

  const getTypeBadge = (type) => {
    const variants = {
      certificate: "primary",
      request: "warning",
      application: "info",
      notice: "danger",
      recommendation: "success",
    };
    return <Badge bg={variants[type] || "secondary"}>{type}</Badge>;
  };

  if (loading) {
    return (
      <Container className="py-4">
        <div className="text-center">
          <Spinner animation="border" role="status">
            <span className="visually-hidden">Loading...</span>
          </Spinner>
          <p className="mt-2">Loading letterheads...</p>
        </div>
      </Container>
    );
  }

  return (
    <Container fluid className="py-4">
      <PageHeroSection
        title="Letterheads Management"
        subtitle="Manage and track all letterheads"
      />

      {error && (
        <Alert variant="danger" dismissible onClose={() => setError(null)}>
          {error}
        </Alert>
      )}

      <ThemeCard>
        <Card.Header className="d-flex justify-content-between align-items-center">
          <h5 className="mb-0">
            All Letterheads ({filteredLetterheads.length})
          </h5>
          <div className="d-flex gap-2">
            <ThemeButton
              as={Link}
              to="/admin/letterheads/add"
              variant="success"
              size="sm"
            >
              <i className="bi bi-plus-circle me-1"></i>
              Add New Letterhead
            </ThemeButton>
            <ThemeButton
              onClick={handleExportToExcel}
              disabled={exporting}
              variant="outline-primary"
              size="sm"
            >
              {exporting ? (
                <Spinner animation="border" size="sm" />
              ) : (
                <i className="bi bi-download me-1"></i>
              )}
              Export Excel
            </ThemeButton>
          </div>
        </Card.Header>

        <Card.Body>
          {/* Filters */}
          <Row className="mb-3">
            <Col md={3}>
              <InputGroup size="sm">
                <Form.Control
                  type="text"
                  placeholder="Search letterheads..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </InputGroup>
            </Col>
            <Col md={2}>
              <Form.Select
                size="sm"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <option value="">All Status</option>
                <option value="draft">Draft</option>
                <option value="finalized">Finalized</option>
                <option value="sent">Sent</option>
                <option value="archived">Archived</option>
              </Form.Select>
            </Col>
            <Col md={2}>
              <Form.Select
                size="sm"
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
            </Col>
            <Col md={2}>
              <Form.Select
                size="sm"
                value={dateFilter}
                onChange={(e) => setDateFilter(e.target.value)}
              >
                <option value="">All Dates</option>
                <option value="today">Today</option>
                <option value="week">Last Week</option>
                <option value="month">Last Month</option>
              </Form.Select>
            </Col>
            <Col md={3} className="text-end">
              <Button
                variant="outline-secondary"
                size="sm"
                onClick={() => {
                  setSearchTerm("");
                  setStatusFilter("");
                  setTypeFilter("");
                  setDateFilter("");
                }}
              >
                Clear Filters
              </Button>
            </Col>
          </Row>

          {filteredLetterheads.length === 0 ? (
            <div className="text-center py-4">
              <i
                className="bi bi-file-text text-muted"
                style={{ fontSize: "3rem" }}
              ></i>
              <p className="text-muted mt-2">No letterheads found</p>
              <ThemeButton as={Link} to="/admin/letterheads/add">
                Create First Letterhead
              </ThemeButton>
            </div>
          ) : (
            <Table responsive striped hover>
              <thead>
                <tr>
                  <th>Letter ID</th>
                  <th>Type</th>
                  <th>Title</th>
                  <th>Recipient</th>
                  <th>Subject</th>
                  <th>Status</th>
                  <th>Created</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredLetterheads.map((letterhead) => (
                  <tr key={letterhead._id}>
                    <td>
                      <code>{letterhead.letterId}</code>
                    </td>
                    <td>{getTypeBadge(letterhead.letterType)}</td>
                    <td>
                      <strong>{letterhead.title}</strong>
                    </td>
                    <td>{letterhead.recipientFullName}</td>
                    <td className="text-truncate" style={{ maxWidth: "200px" }}>
                      {letterhead.subject}
                    </td>
                    <td>{getStatusBadge(letterhead.status)}</td>
                    <td>
                      <small>{formatDateTime(letterhead.createdAt)}</small>
                      <br />
                      <small className="text-muted">
                        {getRelativeTime(letterhead.createdAt)}
                      </small>
                    </td>
                    <td>
                      <Dropdown size="sm">
                        <Dropdown.Toggle variant="outline-secondary" size="sm">
                          <i className="bi bi-three-dots"></i>
                        </Dropdown.Toggle>
                        <Dropdown.Menu>
                          <Dropdown.Item
                            onClick={() => handleViewLetterhead(letterhead)}
                          >
                            <i className="bi bi-eye me-2"></i>View Details
                          </Dropdown.Item>
                          <Dropdown.Item
                            as={Link}
                            to={`/admin/letterheads/edit/${letterhead._id}`}
                          >
                            <i className="bi bi-pencil me-2"></i>Edit
                          </Dropdown.Item>
                          <Dropdown.Item
                            onClick={() => handleDownloadPDF(letterhead._id)}
                          >
                            <i className="bi bi-download me-2"></i>Download PDF
                          </Dropdown.Item>
                          {letterhead.status === "finalized" && (
                            <Dropdown.Item
                              onClick={() => handleMarkAsSent(letterhead._id)}
                            >
                              <i className="bi bi-send me-2"></i>Mark as Sent
                            </Dropdown.Item>
                          )}
                          <Dropdown.Divider />
                          <Dropdown.Item
                            className="text-danger"
                            onClick={() =>
                              handleDeleteLetterhead(letterhead._id)
                            }
                          >
                            <i className="bi bi-trash me-2"></i>Delete
                          </Dropdown.Item>
                        </Dropdown.Menu>
                      </Dropdown>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          )}

          {/* Pagination */}
          {pagination.totalPages > 1 && (
            <Row className="mt-3">
              <Col className="d-flex justify-content-center">
                <nav>
                  <ul className="pagination">
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
                        Previous
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
                        Next
                      </button>
                    </li>
                  </ul>
                </nav>
              </Col>
            </Row>
          )}
        </Card.Body>
      </ThemeCard>

      {/* View Letterhead Modal */}
      <Modal
        show={showViewModal}
        onHide={() => setShowViewModal(false)}
        size="lg"
      >
        <Modal.Header closeButton>
          <Modal.Title>Letterhead Details</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedLetterhead && (
            <Row>
              <Col md={6}>
                <h6>Basic Information</h6>
                <p>
                  <strong>Letter ID:</strong> {selectedLetterhead.letterId}
                </p>
                <p>
                  <strong>Type:</strong>{" "}
                  {getTypeBadge(selectedLetterhead.letterType)}
                </p>
                <p>
                  <strong>Title:</strong> {selectedLetterhead.title}
                </p>
                <p>
                  <strong>Status:</strong>{" "}
                  {getStatusBadge(selectedLetterhead.status)}
                </p>
                <p>
                  <strong>Language:</strong> {selectedLetterhead.language}
                </p>
              </Col>
              <Col md={6}>
                <h6>Recipient Information</h6>
                <p>
                  <strong>Name:</strong> {selectedLetterhead.recipientFullName}
                </p>
                {selectedLetterhead.recipient?.designation && (
                  <p>
                    <strong>Designation:</strong>{" "}
                    {selectedLetterhead.recipient.designation}
                  </p>
                )}
                {selectedLetterhead.recipient?.company && (
                  <p>
                    <strong>Company:</strong>{" "}
                    {selectedLetterhead.recipient.company}
                  </p>
                )}
              </Col>
              <Col md={12}>
                <h6>Content</h6>
                <p>
                  <strong>Subject:</strong> {selectedLetterhead.subject}
                </p>
                <div
                  className="border p-2 mb-3"
                  style={{ maxHeight: "200px", overflowY: "auto" }}
                >
                  <div
                    dangerouslySetInnerHTML={{
                      __html: selectedLetterhead.content,
                    }}
                  />
                </div>
              </Col>
              <Col md={6}>
                <h6>Host Information</h6>
                <p>
                  <strong>Name:</strong> {selectedLetterhead.host?.name}
                </p>
                <p>
                  <strong>Designation:</strong>{" "}
                  {selectedLetterhead.host?.designation}
                </p>
              </Col>
              <Col md={6}>
                <h6>Metadata</h6>
                <p>
                  <strong>Created:</strong>{" "}
                  {formatDateTime(selectedLetterhead.createdAt)}
                </p>
                <p>
                  <strong>Created By:</strong>{" "}
                  {selectedLetterhead.createdBy?.fullName}
                </p>
                {selectedLetterhead.sentDate && (
                  <p>
                    <strong>Sent Date:</strong>{" "}
                    {formatDateTime(selectedLetterhead.sentDate)}
                  </p>
                )}
              </Col>
            </Row>
          )}
        </Modal.Body>
        <Modal.Footer>
          {selectedLetterhead && (
            <>
              <Button
                variant="primary"
                onClick={() => handleDownloadPDF(selectedLetterhead._id)}
              >
                <i className="bi bi-download me-1"></i>Download PDF
              </Button>
              <Button
                variant="secondary"
                as={Link}
                to={`/admin/letterheads/edit/${selectedLetterhead._id}`}
              >
                <i className="bi bi-pencil me-1"></i>Edit
              </Button>
            </>
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
  );
};

export default AdminLetterheads;
