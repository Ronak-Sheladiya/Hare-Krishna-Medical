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
import ProfessionalInvoice from "../../components/common/ProfessionalInvoice";
import { formatDateTime, getRelativeTime } from "../../utils/dateUtils";

const AdminInvoices = () => {
  // Mock invoice data - in real app, this would come from API
  const [invoices, setInvoices] = useState([
    {
      id: 1,
      invoiceId: "HKM-INV-2024-001",
      orderId: "HKM12345678",
      customerName: "John Smith",
      customerEmail: "john.smith@email.com",
      customerMobile: "+91 9876543210",
      totalAmount: 235.5,
      status: "Paid",
      paymentMethod: "Online",
      orderDate: "2024-01-15",
      orderTime: "10:30 AM",
      createdAt: "2024-01-15T10:30:00Z",
      items: [
        {
          id: 1,
          name: "Paracetamol Tablets",
          company: "Hare Krishna Pharma",
          price: 25.99,
          quantity: 2,
        },
        {
          id: 2,
          name: "Vitamin D3 Capsules",
          company: "Health Plus",
          price: 45.5,
          quantity: 4,
        },
      ],
      customerDetails: {
        fullName: "John Smith",
        email: "john.smith@email.com",
        mobile: "+91 9876543210",
        address: "123 Main Street, Apartment 4B",
        city: "Surat",
        state: "Gujarat",
        pincode: "395007",
      },
    },
    {
      id: 2,
      invoiceId: "HKM-INV-2024-002",
      orderId: "HKM12345679",
      customerName: "Jane Doe",
      customerEmail: "jane.doe@email.com",
      customerMobile: "+91 9123456789",
      totalAmount: 156.75,
      status: "Unpaid",
      paymentMethod: "COD",
      orderDate: "2024-01-15",
      orderTime: "02:15 PM",
      createdAt: "2024-01-15T14:15:00Z",
      items: [
        {
          id: 3,
          name: "Cough Syrup",
          company: "Wellness Care",
          price: 35.75,
          quantity: 3,
        },
        {
          id: 4,
          name: "Antiseptic Liquid",
          company: "Safe Guard",
          price: 28.0,
          quantity: 2,
        },
      ],
      customerDetails: {
        fullName: "Jane Doe",
        email: "jane.doe@email.com",
        mobile: "+91 9123456789",
        address: "456 Oak Avenue, Building C",
        city: "Ahmedabad",
        state: "Gujarat",
        pincode: "380001",
      },
    },
    {
      id: 3,
      invoiceId: "HKM-INV-2024-003",
      orderId: "HKM12345680",
      customerName: "Mike Johnson",
      customerEmail: "mike.j@company.com",
      customerMobile: "+91 9988776655",
      totalAmount: 89.25,
      status: "Paid",
      paymentMethod: "Online",
      orderDate: "2024-01-14",
      orderTime: "11:45 AM",
      createdAt: "2024-01-14T11:45:00Z",
      items: [
        {
          id: 1,
          name: "Paracetamol Tablets",
          company: "Hare Krishna Pharma",
          price: 25.99,
          quantity: 1,
        },
        {
          id: 5,
          name: "Digital Thermometer",
          company: "MedTech",
          price: 63.26,
          quantity: 1,
        },
      ],
      customerDetails: {
        fullName: "Mike Johnson",
        email: "mike.j@company.com",
        mobile: "+91 9988776655",
        address: "789 Business District, Floor 12",
        city: "Vadodara",
        state: "Gujarat",
        pincode: "390001",
      },
    },
  ]);

  const [filteredInvoices, setFilteredInvoices] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [paymentFilter, setPaymentFilter] = useState("");
  const [showInvoiceModal, setShowInvoiceModal] = useState(false);
  const [selectedInvoice, setSelectedInvoice] = useState(null);
  const [exportLoading, setExportLoading] = useState(false);

  useEffect(() => {
    let filtered = [...invoices];

    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(
        (invoice) =>
          invoice.invoiceId.toLowerCase().includes(searchTerm.toLowerCase()) ||
          invoice.orderId.toLowerCase().includes(searchTerm.toLowerCase()) ||
          invoice.customerName
            .toLowerCase()
            .includes(searchTerm.toLowerCase()) ||
          invoice.customerEmail
            .toLowerCase()
            .includes(searchTerm.toLowerCase()),
      );
    }

    // Apply status filter
    if (statusFilter) {
      filtered = filtered.filter((invoice) => invoice.status === statusFilter);
    }

    // Apply payment method filter
    if (paymentFilter) {
      filtered = filtered.filter(
        (invoice) => invoice.paymentMethod === paymentFilter,
      );
    }

    // Sort by date (newest first)
    filtered.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    setFilteredInvoices(filtered);
  }, [invoices, searchTerm, statusFilter, paymentFilter]);

  const handleViewInvoice = (invoice) => {
    setSelectedInvoice(invoice);
    setShowInvoiceModal(true);
  };

  const handleExportExcel = async () => {
    setExportLoading(true);

    try {
      // Prepare data for Excel export
      const exportData = filteredInvoices.map((invoice) => ({
        "Invoice ID": invoice.invoiceId,
        "Order ID": invoice.orderId,
        "Customer Name": invoice.customerName,
        "Customer Email": invoice.customerEmail,
        Mobile: invoice.customerMobile,
        "Total Amount (₹)": invoice.totalAmount.toFixed(2),
        "Payment Status": invoice.status,
        "Payment Method": invoice.paymentMethod,
        "Order Date": invoice.orderDate,
        "Order Time": invoice.orderTime,
        "Items Count": invoice.items.length,
        "Customer City": invoice.customerDetails.city,
        "Customer State": invoice.customerDetails.state,
        "Customer Pincode": invoice.customerDetails.pincode,
        "Created At": formatDateTime(invoice.createdAt),
      }));

      // Create workbook and worksheet
      const workbook = XLSX.utils.book_new();
      const worksheet = XLSX.utils.json_to_sheet(exportData);

      // Set column widths
      const columnWidths = [
        { wch: 20 }, // Invoice ID
        { wch: 15 }, // Order ID
        { wch: 20 }, // Customer Name
        { wch: 25 }, // Customer Email
        { wch: 15 }, // Mobile
        { wch: 15 }, // Total Amount
        { wch: 12 }, // Payment Status
        { wch: 15 }, // Payment Method
        { wch: 12 }, // Order Date
        { wch: 12 }, // Order Time
        { wch: 12 }, // Items Count
        { wch: 15 }, // City
        { wch: 15 }, // State
        { wch: 10 }, // Pincode
        { wch: 20 }, // Created At
      ];
      worksheet["!cols"] = columnWidths;

      // Add worksheet to workbook
      XLSX.utils.book_append_sheet(workbook, worksheet, "Invoices");

      // Generate file name with current date
      const currentDate = new Date().toISOString().split("T")[0];
      const fileName = `Hare_Krishna_Medical_Invoices_${currentDate}.xlsx`;

      // Export file
      XLSX.writeFile(workbook, fileName);

      // Show success message (you can replace with toast notification)
      alert(`Excel file "${fileName}" has been downloaded successfully!`);
    } catch (error) {
      console.error("Export failed:", error);
      alert("Failed to export Excel file. Please try again.");
    } finally {
      setExportLoading(false);
    }
  };

  const handlePrintInvoice = () => {
    window.print();
  };

  const getStatusVariant = (status) => {
    switch (status) {
      case "Paid":
        return "success";
      case "Unpaid":
        return "warning";
      case "Overdue":
        return "danger";
      default:
        return "secondary";
    }
  };

  const getPaymentMethodBadge = (method) => {
    switch (method) {
      case "Online":
        return "primary";
      case "COD":
        return "info";
      default:
        return "secondary";
    }
  };

  const statistics = {
    total: invoices.length,
    paid: invoices.filter((inv) => inv.status === "Paid").length,
    unpaid: invoices.filter((inv) => inv.status === "Unpaid").length,
    totalRevenue: invoices
      .filter((inv) => inv.status === "Paid")
      .reduce((sum, inv) => sum + inv.totalAmount, 0),
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
                  <h2>
                    <i className="bi bi-receipt-cutoff me-2"></i>
                    Invoice Management
                  </h2>
                  <p className="text-muted">
                    Manage all customer invoices and payment records
                  </p>
                </div>
                <div className="d-flex gap-2">
                  <Button
                    onClick={handleExportExcel}
                    disabled={exportLoading || filteredInvoices.length === 0}
                    className="btn-medical-primary"
                  >
                    {exportLoading ? (
                      <>
                        <Spinner size="sm" className="me-2" />
                        Exporting...
                      </>
                    ) : (
                      <>
                        <i className="bi bi-file-earmark-excel me-2"></i>
                        Export Excel
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </Col>
          </Row>

          {/* Statistics Cards */}
          <Row className="mb-4">
            <Col lg={3} md={6} className="mb-3">
              <Card className="medical-card h-100">
                <Card.Body>
                  <div className="d-flex justify-content-between align-items-start">
                    <div>
                      <h3 className="text-primary">{statistics.total}</h3>
                      <p className="text-muted mb-0">Total Invoices</p>
                    </div>
                    <div className="bg-primary text-white rounded-circle p-3">
                      <i className="bi bi-receipt fs-4"></i>
                    </div>
                  </div>
                </Card.Body>
              </Card>
            </Col>

            <Col lg={3} md={6} className="mb-3">
              <Card className="medical-card h-100">
                <Card.Body>
                  <div className="d-flex justify-content-between align-items-start">
                    <div>
                      <h3 className="text-success">{statistics.paid}</h3>
                      <p className="text-muted mb-0">Paid Invoices</p>
                    </div>
                    <div className="bg-success text-white rounded-circle p-3">
                      <i className="bi bi-check-circle fs-4"></i>
                    </div>
                  </div>
                </Card.Body>
              </Card>
            </Col>

            <Col lg={3} md={6} className="mb-3">
              <Card className="medical-card h-100">
                <Card.Body>
                  <div className="d-flex justify-content-between align-items-start">
                    <div>
                      <h3 className="text-warning">{statistics.unpaid}</h3>
                      <p className="text-muted mb-0">Unpaid Invoices</p>
                    </div>
                    <div className="bg-warning text-white rounded-circle p-3">
                      <i className="bi bi-hourglass-split fs-4"></i>
                    </div>
                  </div>
                </Card.Body>
              </Card>
            </Col>

            <Col lg={3} md={6} className="mb-3">
              <Card className="medical-card h-100">
                <Card.Body>
                  <div className="d-flex justify-content-between align-items-start">
                    <div>
                      <h3 className="text-medical-red">
                        ₹{statistics.totalRevenue.toFixed(2)}
                      </h3>
                      <p className="text-muted mb-0">Total Revenue</p>
                    </div>
                    <div className="bg-medical-red text-white rounded-circle p-3">
                      <i className="bi bi-currency-rupee fs-4"></i>
                    </div>
                  </div>
                </Card.Body>
              </Card>
            </Col>
          </Row>

          {/* Filters and Search */}
          <Row className="mb-4">
            <Col lg={12}>
              <Card className="medical-card">
                <Card.Body>
                  <Row>
                    <Col lg={4} md={6} className="mb-3">
                      <Form.Label>Search Invoices</Form.Label>
                      <InputGroup>
                        <InputGroup.Text>
                          <i className="bi bi-search"></i>
                        </InputGroup.Text>
                        <Form.Control
                          type="text"
                          placeholder="Search by Invoice ID, Order ID, or Customer..."
                          value={searchTerm}
                          onChange={(e) => setSearchTerm(e.target.value)}
                        />
                      </InputGroup>
                    </Col>

                    <Col lg={3} md={6} className="mb-3">
                      <Form.Label>Payment Status</Form.Label>
                      <Form.Select
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                      >
                        <option value="">All Status</option>
                        <option value="Paid">Paid</option>
                        <option value="Unpaid">Unpaid</option>
                        <option value="Overdue">Overdue</option>
                      </Form.Select>
                    </Col>

                    <Col lg={3} md={6} className="mb-3">
                      <Form.Label>Payment Method</Form.Label>
                      <Form.Select
                        value={paymentFilter}
                        onChange={(e) => setPaymentFilter(e.target.value)}
                      >
                        <option value="">All Methods</option>
                        <option value="Online">Online</option>
                        <option value="COD">Cash on Delivery</option>
                      </Form.Select>
                    </Col>

                    <Col lg={2} md={6} className="mb-3">
                      <Form.Label>&nbsp;</Form.Label>
                      <div className="d-grid">
                        <Button
                          variant="outline-secondary"
                          onClick={() => {
                            setSearchTerm("");
                            setStatusFilter("");
                            setPaymentFilter("");
                          }}
                        >
                          Clear Filters
                        </Button>
                      </div>
                    </Col>
                  </Row>
                </Card.Body>
              </Card>
            </Col>
          </Row>

          {/* Invoices Table */}
          <Row>
            <Col lg={12}>
              <Card className="medical-card">
                <Card.Header className="bg-medical-light d-flex justify-content-between align-items-center">
                  <h5 className="mb-0">
                    <i className="bi bi-table me-2"></i>
                    Invoices ({filteredInvoices.length})
                  </h5>
                </Card.Header>
                <Card.Body className="p-0">
                  {filteredInvoices.length > 0 ? (
                    <div className="table-responsive">
                      <Table className="mb-0">
                        <thead className="table-light">
                          <tr>
                            <th>Invoice ID</th>
                            <th>Customer</th>
                            <th>Amount</th>
                            <th>Status</th>
                            <th>Payment</th>
                            <th>Date</th>
                            <th>Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {filteredInvoices.map((invoice) => (
                            <tr key={invoice.id}>
                              <td>
                                <div>
                                  <strong>{invoice.invoiceId}</strong>
                                  <br />
                                  <small className="text-muted">
                                    Order: {invoice.orderId}
                                  </small>
                                </div>
                              </td>
                              <td>
                                <div>
                                  <div className="fw-bold">
                                    {invoice.customerName}
                                  </div>
                                  <small className="text-muted">
                                    {invoice.customerEmail}
                                  </small>
                                  <br />
                                  <small className="text-muted">
                                    {invoice.customerMobile}
                                  </small>
                                </div>
                              </td>
                              <td>
                                <span className="fw-bold">
                                  ₹{invoice.totalAmount.toFixed(2)}
                                </span>
                                <br />
                                <small className="text-muted">
                                  {invoice.items.length} items
                                </small>
                              </td>
                              <td>
                                <Badge bg={getStatusVariant(invoice.status)}>
                                  {invoice.status}
                                </Badge>
                              </td>
                              <td>
                                <Badge
                                  bg={getPaymentMethodBadge(
                                    invoice.paymentMethod,
                                  )}
                                >
                                  {invoice.paymentMethod}
                                </Badge>
                              </td>
                              <td>
                                <div>
                                  <div>{invoice.orderDate}</div>
                                  <small className="text-muted">
                                    {invoice.orderTime}
                                  </small>
                                  <br />
                                  <small className="text-muted">
                                    {getRelativeTime(invoice.createdAt)}
                                  </small>
                                </div>
                              </td>
                              <td>
                                <div className="d-flex gap-1">
                                  <Button
                                    size="sm"
                                    variant="outline-primary"
                                    onClick={() => handleViewInvoice(invoice)}
                                    title="View Invoice"
                                  >
                                    <i className="bi bi-eye"></i>
                                  </Button>
                                  <Button
                                    size="sm"
                                    variant="outline-success"
                                    onClick={() => handleViewInvoice(invoice)}
                                    title="Download Invoice"
                                  >
                                    <i className="bi bi-download"></i>
                                  </Button>
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </Table>
                    </div>
                  ) : (
                    <div className="text-center py-5">
                      <i className="bi bi-receipt display-1 text-muted mb-3"></i>
                      <h4>No Invoices Found</h4>
                      <p className="text-muted">
                        No invoices match your current filters. Try adjusting
                        your search criteria.
                      </p>
                    </div>
                  )}
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Container>
      </section>

      {/* Invoice View Modal */}
      <Modal
        show={showInvoiceModal}
        onHide={() => setShowInvoiceModal(false)}
        size="lg"
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>
            <i className="bi bi-receipt me-2"></i>
            Invoice Details
          </Modal.Title>
        </Modal.Header>
        <Modal.Body className="p-0">
          {selectedInvoice && (
            <div
              className="invoice-preview"
              style={{ maxHeight: "70vh", overflowY: "auto" }}
            >
              <ProfessionalInvoice
                invoiceData={{
                  invoiceId: selectedInvoice.invoiceId,
                  orderId: selectedInvoice.orderId,
                  orderDate: selectedInvoice.orderDate,
                  orderTime: selectedInvoice.orderTime,
                  customerDetails: selectedInvoice.customerDetails,
                  items: selectedInvoice.items,
                  subtotal: selectedInvoice.items.reduce(
                    (sum, item) => sum + item.price * item.quantity,
                    0,
                  ),
                  shipping: 0,
                  total: selectedInvoice.totalAmount,
                  paymentMethod: selectedInvoice.paymentMethod,
                  paymentStatus: selectedInvoice.status,
                  status: "Delivered",
                }}
                forPrint={false}
              />
            </div>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant="outline-secondary"
            onClick={() => setShowInvoiceModal(false)}
          >
            Close
          </Button>
          <Button
            variant="primary"
            onClick={handlePrintInvoice}
            className="btn-medical-primary"
          >
            <i className="bi bi-printer me-2"></i>
            Print Invoice
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default AdminInvoices;
