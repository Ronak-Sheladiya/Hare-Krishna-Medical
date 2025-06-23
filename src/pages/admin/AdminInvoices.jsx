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
          quantity: 1,
        },
      ],
      customerDetails: {
        fullName: "John Smith",
        email: "john.smith@email.com",
        mobile: "+91 9876543210",
        address: "123 Main Street, Surat",
        city: "Surat",
        state: "Gujarat",
        pincode: "395007",
      },
      subtotal: 220.0,
      shipping: 0,
      tax: 15.5,
      paymentStatus: "Completed",
    },
    {
      id: 2,
      invoiceId: "HKM-INV-2024-002",
      orderId: "HKM12345679",
      customerName: "Jane Doe",
      customerEmail: "jane.doe@email.com",
      customerMobile: "+91 9123456789",
      totalAmount: 156.75,
      status: "Pending",
      paymentMethod: "COD",
      orderDate: "2024-01-14",
      orderTime: "02:15 PM",
      createdAt: "2024-01-14T14:15:00Z",
      items: [
        {
          id: 3,
          name: "Cough Syrup",
          company: "Wellness Care",
          price: 35.75,
          quantity: 1,
        },
      ],
      customerDetails: {
        fullName: "Jane Doe",
        email: "jane.doe@email.com",
        mobile: "+91 9123456789",
        address: "456 Oak Avenue, Ahmedabad",
        city: "Ahmedabad",
        state: "Gujarat",
        pincode: "380001",
      },
      subtotal: 145.0,
      shipping: 50,
      tax: 11.75,
      paymentStatus: "Pending",
    },
  ]);

  const [filteredInvoices, setFilteredInvoices] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [selectedInvoice, setSelectedInvoice] = useState(null);
  const [showViewModal, setShowViewModal] = useState(false);
  const [isExporting, setIsExporting] = useState(false);

  useEffect(() => {
    setFilteredInvoices(invoices);
  }, [invoices]);

  useEffect(() => {
    let filtered = invoices;

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

    if (statusFilter) {
      filtered = filtered.filter((invoice) => invoice.status === statusFilter);
    }

    setFilteredInvoices(filtered);
  }, [searchTerm, statusFilter, invoices]);

  const handleViewInvoice = (invoice) => {
    setSelectedInvoice(invoice);
    setShowViewModal(true);
  };

  const handlePrintInvoice = async (invoice) => {
    try {
      // Generate QR code if not exists
      let qrCodeDataURL = null;
      if (!invoice.qrCode) {
        const qrText = JSON.stringify({
          invoice_id: invoice.invoiceId,
          order_id: invoice.orderId,
          total: invoice.totalAmount,
          customer: invoice.customerName,
        });
        qrCodeDataURL = await QRCode.toDataURL(qrText, { width: 180 });
      }

      // Create a temporary div for printing
      const tempDiv = document.createElement("div");
      tempDiv.style.position = "absolute";
      tempDiv.style.left = "-9999px";
      tempDiv.style.width = "210mm";
      tempDiv.style.backgroundColor = "white";
      document.body.appendChild(tempDiv);

      // Import and render OfficialInvoiceDesign component
      const React = (await import("react")).default;
      const { createRoot } = await import("react-dom/client");

      const root = createRoot(tempDiv);
      root.render(
        React.createElement(OfficialInvoiceDesign, {
          invoiceData: invoice,
          qrCode: qrCodeDataURL || invoice.qrCode,
          forPrint: true,
        }),
      );

      // Wait for rendering
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Print using original method
      const originalContents = document.body.innerHTML;
      document.body.innerHTML = tempDiv.innerHTML;
      window.print();
      document.body.innerHTML = originalContents;

      // Cleanup
      document.body.removeChild(tempDiv);
      window.location.reload();
    } catch (error) {
      console.error("Print error:", error);
    }
  };

  const handleExportToExcel = () => {
    setIsExporting(true);
    try {
      const exportData = filteredInvoices.map((invoice) => ({
        "Invoice ID": invoice.invoiceId,
        "Order ID": invoice.orderId,
        "Customer Name": invoice.customerName,
        "Customer Email": invoice.customerEmail,
        "Total Amount": `₹${invoice.totalAmount}`,
        Status: invoice.status,
        "Payment Method": invoice.paymentMethod,
        Date: invoice.orderDate,
        Time: invoice.orderTime,
      }));

      const ws = XLSX.utils.json_to_sheet(exportData);
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, "Invoices");
      XLSX.writeFile(
        wb,
        `invoices-${new Date().toISOString().split("T")[0]}.xlsx`,
      );
    } catch (error) {
      console.error("Export error:", error);
    } finally {
      setIsExporting(false);
    }
  };

  const getStatusVariant = (status) => {
    switch (status) {
      case "Paid":
        return "success";
      case "Pending":
        return "warning";
      case "Overdue":
        return "danger";
      default:
        return "secondary";
    }
  };

  return (
    <div className="fade-in">
      <section className="section-padding">
        <Container>
          {/* Header */}
          <Row className="mb-4">
            <Col lg={12}>
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <h2>Invoice Management</h2>
                  <p className="text-muted">
                    Manage and track all customer invoices
                  </p>
                </div>
                <div className="d-flex gap-2">
                  <Button
                    variant="success"
                    onClick={handleExportToExcel}
                    disabled={isExporting}
                  >
                    <i className="bi bi-download me-2"></i>
                    {isExporting ? "Exporting..." : "Export Excel"}
                  </Button>
                  <Button
                    variant="outline-primary"
                    onClick={() => window.location.reload()}
                  >
                    <i className="bi bi-arrow-clockwise me-2"></i>
                    Refresh
                  </Button>
                </div>
              </div>
            </Col>
          </Row>

          {/* Filters */}
          <Row className="mb-4">
            <Col lg={12}>
              <Card>
                <Card.Body>
                  <Row>
                    <Col md={6}>
                      <Form.Label>Search Invoices</Form.Label>
                      <InputGroup>
                        <InputGroup.Text>
                          <i className="bi bi-search"></i>
                        </InputGroup.Text>
                        <Form.Control
                          type="text"
                          placeholder="Search by invoice ID, order ID, customer..."
                          value={searchTerm}
                          onChange={(e) => setSearchTerm(e.target.value)}
                        />
                      </InputGroup>
                    </Col>
                    <Col md={4}>
                      <Form.Label>Filter by Status</Form.Label>
                      <Form.Select
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                      >
                        <option value="">All Statuses</option>
                        <option value="Paid">Paid</option>
                        <option value="Pending">Pending</option>
                        <option value="Overdue">Overdue</option>
                      </Form.Select>
                    </Col>
                    <Col md={2} className="d-flex align-items-end">
                      <Button
                        variant="outline-secondary"
                        onClick={() => {
                          setSearchTerm("");
                          setStatusFilter("");
                        }}
                        className="w-100"
                      >
                        Reset
                      </Button>
                    </Col>
                  </Row>
                </Card.Body>
              </Card>
            </Col>
          </Row>

          {/* Invoices Table */}
          <Row>
            <Col lg={12}>
              <Card>
                <Card.Header>
                  <h5 className="mb-0">
                    <i className="bi bi-receipt-cutoff me-2"></i>
                    Invoice Records ({filteredInvoices.length})
                  </h5>
                </Card.Header>
                <Card.Body className="p-0">
                  <Table responsive hover>
                    <thead className="table-light">
                      <tr>
                        <th>Invoice Details</th>
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
                              <strong>{invoice.customerName}</strong>
                              <br />
                              <small className="text-muted">
                                {invoice.customerEmail}
                              </small>
                            </div>
                          </td>
                          <td>
                            <strong className="text-success">
                              ₹{invoice.totalAmount.toFixed(2)}
                            </strong>
                          </td>
                          <td>
                            <Badge bg={getStatusVariant(invoice.status)}>
                              {invoice.status}
                            </Badge>
                          </td>
                          <td>
                            <span
                              className={`badge ${
                                invoice.paymentMethod === "Online"
                                  ? "bg-info"
                                  : "bg-warning"
                              }`}
                            >
                              {invoice.paymentMethod}
                            </span>
                          </td>
                          <td>
                            <div>
                              <strong>{invoice.orderDate}</strong>
                              <br />
                              <small className="text-muted">
                                {invoice.orderTime}
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
                                <i className="bi bi-eye"></i>
                              </Button>
                              <Button
                                variant="outline-success"
                                size="sm"
                                onClick={() => handlePrintInvoice(invoice)}
                              >
                                <i className="bi bi-printer"></i>
                              </Button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </Table>

                  {filteredInvoices.length === 0 && (
                    <div className="text-center p-4">
                      <i
                        className="bi bi-receipt display-1 text-muted mb-3"
                        style={{ fontSize: "3rem" }}
                      ></i>
                      <h5>No invoices found</h5>
                      <p className="text-muted">
                        Try adjusting your search or filter criteria
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
        show={showViewModal}
        onHide={() => setShowViewModal(false)}
        size="xl"
      >
        <Modal.Header closeButton>
          <Modal.Title>
            Invoice Preview - {selectedInvoice?.invoiceId}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body className="p-0">
          {selectedInvoice && (
            <div id="admin-invoice-content">
              <OfficialInvoiceDesign
                invoiceData={{
                  invoiceId: selectedInvoice.invoiceId,
                  orderId: selectedInvoice.orderId,
                  orderDate: selectedInvoice.orderDate,
                  orderTime: selectedInvoice.orderTime,
                  customerDetails: selectedInvoice.customerDetails,
                  items: selectedInvoice.items,
                  subtotal: selectedInvoice.subtotal,
                  shipping: selectedInvoice.shipping,
                  total: selectedInvoice.totalAmount,
                  paymentMethod: selectedInvoice.paymentMethod,
                  paymentStatus: selectedInvoice.paymentStatus,
                  status: selectedInvoice.status,
                }}
                qrCode={selectedInvoice.qrCode}
                forPrint={false}
              />
            </div>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowViewModal(false)}>
            Close
          </Button>
          <Button
            variant="success"
            onClick={() => handlePrintInvoice(selectedInvoice)}
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
