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
} from "react-bootstrap";
import { Link } from "react-router-dom";

const AdminInvoices = () => {
  const [invoices, setInvoices] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [paymentMethodFilter, setPaymentMethodFilter] = useState("");
  const [selectedInvoice, setSelectedInvoice] = useState(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);

  // Mock invoices data with payment status
  const mockInvoices = [
    {
      id: "INV001",
      orderId: "HKM12345678",
      customerName: "John Doe",
      customerEmail: "john.doe@example.com",
      date: "2024-01-15",
      amount: 102.35,
      paidAmount: 102.35,
      status: "Paid",
      paymentMethod: "Online Payment",
      downloadCount: 2,
      items: 3,
      paymentNotes: "Payment completed via online transfer",
    },
    {
      id: "INV002",
      orderId: "HKM12345679",
      customerName: "Jane Smith",
      customerEmail: "jane.smith@example.com",
      date: "2024-01-12",
      amount: 146.34,
      paidAmount: 0,
      status: "Unpaid",
      paymentMethod: "Cash on Delivery",
      downloadCount: 1,
      items: 2,
      paymentNotes: "COD order - payment pending on delivery",
    },
    {
      id: "INV003",
      orderId: "HKM12345680",
      customerName: "Mike Johnson",
      customerEmail: "mike.johnson@example.com",
      date: "2024-01-10",
      amount: 1364.99,
      paidAmount: 1364.99,
      status: "Paid",
      paymentMethod: "Cash on Delivery",
      downloadCount: 3,
      items: 1,
      paymentNotes: "COD payment completed upon delivery",
    },
    {
      id: "INV004",
      orderId: "HKM12345681",
      customerName: "Sarah Wilson",
      customerEmail: "sarah.wilson@example.com",
      date: "2024-01-08",
      amount: 245.8,
      paidAmount: 100.0,
      status: "Partial",
      paymentMethod: "Mixed Payment",
      downloadCount: 0,
      items: 4,
      paymentNotes: "₹100 paid online, ₹145.80 pending COD",
    },
    {
      id: "INV005",
      orderId: "HKM12345682",
      customerName: "Alex Brown",
      customerEmail: "alex.brown@example.com",
      date: "2024-01-05",
      amount: 89.25,
      paidAmount: 0,
      status: "Unpaid",
      paymentMethod: "Cash on Delivery",
      downloadCount: 1,
      items: 2,
      paymentNotes: "COD order - awaiting delivery and payment",
    },
  ];

  useEffect(() => {
    setInvoices(mockInvoices);
  }, []);

  const statusOptions = ["All Status", "Paid", "Unpaid", "Partial"];
  const paymentMethodOptions = [
    "All Methods",
    "Cash on Delivery",
    "Online Payment",
    "Mixed Payment",
  ];

  const filteredInvoices = invoices.filter((invoice) => {
    const matchesSearch =
      invoice.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      invoice.orderId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      invoice.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      invoice.customerEmail.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus =
      statusFilter === "" ||
      statusFilter === "All Status" ||
      invoice.status === statusFilter;

    const matchesPaymentMethod =
      paymentMethodFilter === "" ||
      paymentMethodFilter === "All Methods" ||
      invoice.paymentMethod === paymentMethodFilter;

    return matchesSearch && matchesStatus && matchesPaymentMethod;
  });

  const handleViewDetails = (invoice) => {
    setSelectedInvoice(invoice);
    setShowDetailsModal(true);
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case "Paid":
        return <Badge bg="success">Paid</Badge>;
      case "Unpaid":
        return <Badge bg="danger">Unpaid</Badge>;
      case "Partial":
        return <Badge bg="warning">Partial</Badge>;
      default:
        return <Badge bg="secondary">Unknown</Badge>;
    }
  };

  const getPaymentMethodBadge = (method) => {
    switch (method) {
      case "Cash on Delivery":
        return (
          <Badge bg="warning" className="me-1">
            COD
          </Badge>
        );
      case "Online Payment":
        return (
          <Badge bg="success" className="me-1">
            Online
          </Badge>
        );
      case "Mixed Payment":
        return (
          <Badge bg="info" className="me-1">
            Mixed
          </Badge>
        );
      default:
        return (
          <Badge bg="secondary" className="me-1">
            {method}
          </Badge>
        );
    }
  };

  const calculateTotals = () => {
    const totalAmount = filteredInvoices.reduce(
      (sum, invoice) => sum + invoice.amount,
      0,
    );
    const totalPaid = filteredInvoices.reduce(
      (sum, invoice) => sum + invoice.paidAmount,
      0,
    );
    const totalUnpaid = totalAmount - totalPaid;

    return { totalAmount, totalPaid, totalUnpaid };
  };

  const getInvoiceStats = () => {
    const total = invoices.length;
    const paid = invoices.filter((inv) => inv.status === "Paid").length;
    const unpaid = invoices.filter((inv) => inv.status === "Unpaid").length;
    const partial = invoices.filter((inv) => inv.status === "Partial").length;
    const codOrders = invoices.filter((inv) =>
      inv.paymentMethod.includes("Cash on Delivery"),
    ).length;

    return { total, paid, unpaid, partial, codOrders };
  };

  const stats = getInvoiceStats();
  const totals = calculateTotals();

  return (
    <div className="fade-in">
      <section className="section-padding-sm">
        <Container>
          {/* Header */}
          <Row className="mb-4">
            <Col lg={12}>
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <h2>Invoice Management</h2>
                  <p className="text-muted">
                    Manage all customer invoices and payment status
                  </p>
                </div>
              </div>
            </Col>
          </Row>

          {/* Invoice Statistics */}
          <Row className="mb-4">
            <Col lg={2} md={4} sm={6} className="mb-3">
              <Card className="medical-card text-center h-100">
                <Card.Body>
                  <h4 className="text-medical-blue">{stats.total}</h4>
                  <p className="mb-0 small">Total Invoices</p>
                </Card.Body>
              </Card>
            </Col>
            <Col lg={2} md={4} sm={6} className="mb-3">
              <Card className="medical-card text-center h-100">
                <Card.Body>
                  <h4 className="text-success">{stats.paid}</h4>
                  <p className="mb-0 small">Paid</p>
                </Card.Body>
              </Card>
            </Col>
            <Col lg={2} md={4} sm={6} className="mb-3">
              <Card className="medical-card text-center h-100">
                <Card.Body>
                  <h4 className="text-danger">{stats.unpaid}</h4>
                  <p className="mb-0 small">Unpaid</p>
                </Card.Body>
              </Card>
            </Col>
            <Col lg={2} md={4} sm={6} className="mb-3">
              <Card className="medical-card text-center h-100">
                <Card.Body>
                  <h4 className="text-warning">{stats.partial}</h4>
                  <p className="mb-0 small">Partial</p>
                </Card.Body>
              </Card>
            </Col>
            <Col lg={2} md={4} sm={6} className="mb-3">
              <Card className="medical-card text-center h-100">
                <Card.Body>
                  <h4 className="text-info">{stats.codOrders}</h4>
                  <p className="mb-0 small">COD Orders</p>
                </Card.Body>
              </Card>
            </Col>
            <Col lg={2} md={4} sm={6} className="mb-3">
              <Card className="medical-card text-center h-100">
                <Card.Body>
                  <h4 className="text-medical-red">
                    ₹{totals.totalUnpaid.toFixed(2)}
                  </h4>
                  <p className="mb-0 small">Unpaid Amount</p>
                </Card.Body>
              </Card>
            </Col>
          </Row>

          {/* Payment Summary */}
          <Row className="mb-4">
            <Col lg={12}>
              <Card className="medical-card">
                <Card.Header className="bg-medical-light">
                  <h5 className="mb-0">
                    <i className="bi bi-credit-card me-2"></i>
                    Payment Summary
                  </h5>
                </Card.Header>
                <Card.Body>
                  <Row>
                    <Col md={4} className="text-center">
                      <h5 className="text-success">
                        ₹{totals.totalPaid.toFixed(2)}
                      </h5>
                      <p className="text-muted mb-0">Total Paid</p>
                    </Col>
                    <Col md={4} className="text-center">
                      <h5 className="text-danger">
                        ₹{totals.totalUnpaid.toFixed(2)}
                      </h5>
                      <p className="text-muted mb-0">Total Unpaid</p>
                    </Col>
                    <Col md={4} className="text-center">
                      <h5 className="text-medical-blue">
                        ₹{totals.totalAmount.toFixed(2)}
                      </h5>
                      <p className="text-muted mb-0">Total Amount</p>
                    </Col>
                  </Row>
                  <div className="mt-3 p-3 bg-light rounded">
                    <h6>Payment Status Notes:</h6>
                    <ul className="small mb-0">
                      <li>
                        <strong>Paid:</strong> Full payment received (including
                        COD orders where payment was collected)
                      </li>
                      <li>
                        <strong>Unpaid:</strong> COD orders where payment is
                        still pending delivery
                      </li>
                      <li>
                        <strong>Partial:</strong> Orders with partial payment
                        received, remaining amount pending
                      </li>
                    </ul>
                  </div>
                </Card.Body>
              </Card>
            </Col>
          </Row>

          {/* Filters */}
          <Row className="mb-4">
            <Col lg={4}>
              <InputGroup>
                <InputGroup.Text>
                  <i className="bi bi-search"></i>
                </InputGroup.Text>
                <Form.Control
                  type="text"
                  placeholder="Search invoices..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </InputGroup>
            </Col>
            <Col lg={3}>
              <Form.Select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                {statusOptions.map((status) => (
                  <option
                    key={status}
                    value={status === "All Status" ? "" : status}
                  >
                    {status}
                  </option>
                ))}
              </Form.Select>
            </Col>
            <Col lg={3}>
              <Form.Select
                value={paymentMethodFilter}
                onChange={(e) => setPaymentMethodFilter(e.target.value)}
              >
                {paymentMethodOptions.map((method) => (
                  <option
                    key={method}
                    value={method === "All Methods" ? "" : method}
                  >
                    {method}
                  </option>
                ))}
              </Form.Select>
            </Col>
            <Col lg={2}>
              <Button
                variant="outline-secondary"
                onClick={() => {
                  setSearchTerm("");
                  setStatusFilter("");
                  setPaymentMethodFilter("");
                }}
              >
                Clear
              </Button>
            </Col>
          </Row>

          {/* Invoices Table */}
          <Card className="medical-card">
            <Card.Header className="bg-medical-light">
              <h5 className="mb-0">
                <i className="bi bi-receipt me-2"></i>
                All Invoices ({filteredInvoices.length})
              </h5>
            </Card.Header>
            <Card.Body className="p-0">
              <div className="table-responsive">
                <Table className="mb-0">
                  <thead className="table-light">
                    <tr>
                      <th>Invoice ID</th>
                      <th>Customer</th>
                      <th>Date</th>
                      <th>Amount</th>
                      <th>Payment Status</th>
                      <th>Payment Method</th>
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
                          <br />
                          <Link
                            to={`/admin/orders/${invoice.orderId}`}
                            className="small text-decoration-none"
                          >
                            {invoice.orderId}
                          </Link>
                        </td>
                        <td>
                          <div>
                            <div className="fw-bold">
                              {invoice.customerName}
                            </div>
                            <small className="text-muted">
                              {invoice.customerEmail}
                            </small>
                          </div>
                        </td>
                        <td>{invoice.date}</td>
                        <td>
                          <div>
                            <span className="fw-bold">
                              ₹{invoice.amount.toFixed(2)}
                            </span>
                            {invoice.status === "Partial" && (
                              <div className="small">
                                <span className="text-success">
                                  Paid: ₹{invoice.paidAmount.toFixed(2)}
                                </span>
                                <br />
                                <span className="text-danger">
                                  Pending: ₹
                                  {(
                                    invoice.amount - invoice.paidAmount
                                  ).toFixed(2)}
                                </span>
                              </div>
                            )}
                            {invoice.status === "Unpaid" &&
                              invoice.paymentMethod === "Cash on Delivery" && (
                                <div className="small text-warning">
                                  COD - Payment Pending
                                </div>
                              )}
                          </div>
                        </td>
                        <td>{getStatusBadge(invoice.status)}</td>
                        <td>{getPaymentMethodBadge(invoice.paymentMethod)}</td>
                        <td>
                          <Badge
                            bg={
                              invoice.downloadCount > 0
                                ? "success"
                                : "secondary"
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
                              onClick={() => handleViewDetails(invoice)}
                              className="btn-medical-outline"
                            >
                              <i className="bi bi-eye me-1"></i>
                              View
                            </Button>
                            <Button
                              size="sm"
                              variant="outline-success"
                              as={Link}
                              to={`/invoice/${invoice.orderId}`}
                              className="btn-medical-outline"
                            >
                              <i className="bi bi-receipt"></i>
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
        </Container>
      </section>

      {/* Invoice Details Modal */}
      <Modal
        show={showDetailsModal}
        onHide={() => setShowDetailsModal(false)}
        size="lg"
      >
        <Modal.Header closeButton>
          <Modal.Title>Invoice Details - {selectedInvoice?.id}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedInvoice && (
            <div>
              {/* Payment Status */}
              <Card className="mb-4">
                <Card.Header>
                  <h6 className="mb-0">Payment Information</h6>
                </Card.Header>
                <Card.Body>
                  <Row>
                    <Col md={6}>
                      <p>
                        <strong>Status:</strong>{" "}
                        {getStatusBadge(selectedInvoice.status)}
                      </p>
                      <p>
                        <strong>Payment Method:</strong>{" "}
                        {getPaymentMethodBadge(selectedInvoice.paymentMethod)}
                      </p>
                      <p>
                        <strong>Total Amount:</strong> ₹
                        {selectedInvoice.amount.toFixed(2)}
                      </p>
                    </Col>
                    <Col md={6}>
                      <p>
                        <strong>Paid Amount:</strong> ₹
                        {selectedInvoice.paidAmount.toFixed(2)}
                      </p>
                      <p>
                        <strong>Pending Amount:</strong> ₹
                        {(
                          selectedInvoice.amount - selectedInvoice.paidAmount
                        ).toFixed(2)}
                      </p>
                      <p>
                        <strong>Downloads:</strong>{" "}
                        {selectedInvoice.downloadCount}
                      </p>
                    </Col>
                  </Row>
                  <div className="mt-3 p-3 bg-light rounded">
                    <h6>Payment Notes:</h6>
                    <p className="mb-0">{selectedInvoice.paymentNotes}</p>
                  </div>
                </Card.Body>
              </Card>

              {/* Customer Information */}
              <Card>
                <Card.Header>
                  <h6 className="mb-0">Customer Information</h6>
                </Card.Header>
                <Card.Body>
                  <Row>
                    <Col md={6}>
                      <p>
                        <strong>Name:</strong> {selectedInvoice.customerName}
                      </p>
                      <p>
                        <strong>Email:</strong> {selectedInvoice.customerEmail}
                      </p>
                    </Col>
                    <Col md={6}>
                      <p>
                        <strong>Invoice Date:</strong> {selectedInvoice.date}
                      </p>
                      <p>
                        <strong>Items:</strong> {selectedInvoice.items}
                      </p>
                    </Col>
                  </Row>
                </Card.Body>
              </Card>
            </div>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant="secondary"
            onClick={() => setShowDetailsModal(false)}
          >
            Close
          </Button>
          {selectedInvoice && (
            <Button
              className="btn-medical-primary"
              as={Link}
              to={`/invoice/${selectedInvoice.orderId}`}
            >
              <i className="bi bi-receipt me-2"></i>
              View Full Invoice
            </Button>
          )}
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default AdminInvoices;
