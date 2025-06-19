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
} from "react-bootstrap";
import { Link } from "react-router-dom";

const UserInvoices = () => {
  const [invoices, setInvoices] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [dateFilter, setDateFilter] = useState("");

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
                            to={`/user/orders/${invoice.orderId}`}
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
                        onClick={() => {
                          invoices.forEach((invoice) => {
                            setTimeout(() => {
                              window.open(
                                `/invoice/${invoice.orderId}`,
                                "_blank",
                              );
                            }, 500);
                          });
                        }}
                      >
                        <i className="bi bi-download me-2"></i>
                        Download All (PDF)
                      </Button>
                    </Col>
                  </Row>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Container>
      </section>
    </div>
  );
};

export default UserInvoices;
