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
  const [invoices, setInvoices] = useState([]);
  const [filteredInvoices, setFilteredInvoices] = useState([]);
  const [selectedInvoice, setSelectedInvoice] = useState(null);
  const [showViewModal, setShowViewModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [paymentFilter, setPaymentFilter] = useState("");
  const [loading, setLoading] = useState(false);
  const [isExporting, setIsExporting] = useState(false);

  // Mock invoice data with enhanced fields
  const mockInvoices = [
    {
      id: 1,
      invoiceId: "HKM-INV-2024-001",
      orderId: "HKM12345678",
      customerName: "John Smith",
      customerEmail: "john.smith@email.com",
      customerMobile: "+91 9876543210",
      customerDetails: {
        fullName: "John Smith",
        email: "john.smith@email.com",
        mobile: "+91 9876543210",
        address: "123 Main Street, Surat",
        city: "Surat",
        state: "Gujarat",
        pincode: "395007",
      },
      totalAmount: 235.5,
      subtotal: 220.0,
      shipping: 0,
      tax: 15.5,
      status: "Paid",
      paymentMethod: "Online",
      paymentStatus: "Completed",
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
      qrCode: null,
    },
    {
      id: 2,
      invoiceId: "HKM-INV-2024-002",
      orderId: "HKM12345679",
      customerName: "Jane Doe",
      customerEmail: "jane.doe@email.com",
      customerMobile: "+91 9123456789",
      customerDetails: {
        fullName: "Jane Doe",
        email: "jane.doe@email.com",
        mobile: "+91 9123456789",
        address: "456 Oak Avenue, Ahmedabad",
        city: "Ahmedabad",
        state: "Gujarat",
        pincode: "380001",
      },
      totalAmount: 156.75,
      subtotal: 145.0,
      shipping: 50,
      tax: 11.75,
      status: "Pending",
      paymentMethod: "COD",
      paymentStatus: "Pending",
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
      qrCode: null,
    },
  ];

  // Enhanced statistics
  const invoiceStats = {
    totalInvoices: mockInvoices.length,
    paidInvoices: mockInvoices.filter((inv) => inv.status === "Paid").length,
    pendingInvoices: mockInvoices.filter((inv) => inv.status === "Pending")
      .length,
    totalRevenue: mockInvoices.reduce((sum, inv) => sum + inv.totalAmount, 0),
    averageInvoiceValue:
      mockInvoices.reduce((sum, inv) => sum + inv.totalAmount, 0) /
      mockInvoices.length,
    onlinePayments: mockInvoices.filter((inv) => inv.paymentMethod === "Online")
      .length,
    codPayments: mockInvoices.filter((inv) => inv.paymentMethod === "COD")
      .length,
  };

  useEffect(() => {
    setInvoices(mockInvoices);
    setFilteredInvoices(mockInvoices);
  }, []);

  // Enhanced filtering
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

    if (paymentFilter) {
      filtered = filtered.filter(
        (invoice) => invoice.paymentMethod === paymentFilter,
      );
    }

    setFilteredInvoices(filtered);
  }, [searchTerm, statusFilter, paymentFilter, invoices]);

  // Enhanced Button Component
  const EnhancedButton = ({
    children,
    variant = "primary",
    onClick,
    icon,
    style = {},
    size = "md",
    disabled = false,
  }) => {
    const baseStyle = {
      borderRadius: size === "lg" ? "12px" : "8px",
      padding:
        size === "lg" ? "12px 24px" : size === "sm" ? "6px 12px" : "8px 16px",
      fontWeight: "600",
      transition: "all 0.3s ease",
      border: "none",
      position: "relative",
      overflow: "hidden",
      display: "inline-flex",
      alignItems: "center",
      justifyContent: "center",
      opacity: disabled ? 0.6 : 1,
      cursor: disabled ? "not-allowed" : "pointer",
      ...style,
    };

    const variants = {
      primary: {
        background: "linear-gradient(135deg, #e63946, #dc3545)",
        color: "white",
        boxShadow: "0 4px 15px rgba(230, 57, 70, 0.3)",
      },
      success: {
        background: "linear-gradient(135deg, #28a745, #20c997)",
        color: "white",
        boxShadow: "0 4px 15px rgba(40, 167, 69, 0.3)",
      },
      info: {
        background: "linear-gradient(135deg, #17a2b8, #20c997)",
        color: "white",
        boxShadow: "0 4px 15px rgba(23, 162, 184, 0.3)",
      },
      warning: {
        background: "linear-gradient(135deg, #ffc107, #fd7e14)",
        color: "white",
        boxShadow: "0 4px 15px rgba(255, 193, 7, 0.3)",
      },
      outline: {
        background: "transparent",
        border: "2px solid #e63946",
        color: "#e63946",
      },
    };

    const currentStyle = { ...baseStyle, ...variants[variant] };

    const handleHover = (e, isHover) => {
      if (disabled) return;
      if (isHover) {
        e.target.style.transform = "translateY(-2px)";
        if (variant === "outline") {
          e.target.style.background = "#e63946";
          e.target.style.color = "white";
        }
      } else {
        e.target.style.transform = "translateY(0)";
        if (variant === "outline") {
          e.target.style.background = "transparent";
          e.target.style.color = "#e63946";
        }
      }
    };

    return (
      <button
        style={currentStyle}
        onClick={onClick}
        disabled={disabled}
        onMouseEnter={(e) => handleHover(e, true)}
        onMouseLeave={(e) => handleHover(e, false)}
      >
        {icon && <i className={`${icon} me-2`}></i>}
        {children}
      </button>
    );
  };

  // Circular Stat Card Component
  const CircularStatCard = ({
    icon,
    value,
    label,
    gradient,
    badge,
    description,
  }) => (
    <Card
      style={{
        border: "none",
        borderRadius: "20px",
        background: "linear-gradient(135deg, #ffffff, #f8f9fa)",
        boxShadow: "0 8px 32px rgba(0, 0, 0, 0.1)",
        transition: "all 0.3s ease",
        height: "100%",
      }}
      onMouseOver={(e) => {
        e.currentTarget.style.transform = "translateY(-5px)";
        e.currentTarget.style.boxShadow = "0 15px 45px rgba(0, 0, 0, 0.15)";
      }}
      onMouseOut={(e) => {
        e.currentTarget.style.transform = "translateY(0)";
        e.currentTarget.style.boxShadow = "0 8px 32px rgba(0, 0, 0, 0.1)";
      }}
    >
      <Card.Body className="text-center" style={{ padding: "30px" }}>
        <div
          style={{
            width: "80px",
            height: "80px",
            background: gradient,
            borderRadius: "50%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            margin: "0 auto 20px",
            boxShadow: "0 8px 25px rgba(0, 0, 0, 0.2)",
          }}
        >
          <i className={icon} style={{ fontSize: "30px", color: "white" }}></i>
        </div>

        <h2
          style={{
            color: "#333",
            fontWeight: "800",
            marginBottom: "8px",
            fontSize: "2rem",
          }}
        >
          {typeof value === "number" && value > 1000
            ? `${(value / 1000).toFixed(1)}k`
            : typeof value === "number" && value % 1 !== 0
              ? value.toFixed(1)
              : value}
        </h2>

        <h6
          style={{
            color: "#6c757d",
            marginBottom: "12px",
            fontWeight: "600",
            fontSize: "12px",
            textTransform: "uppercase",
            letterSpacing: "1px",
          }}
        >
          {label}
        </h6>

        {description && (
          <p
            style={{
              color: "#8e9297",
              fontSize: "11px",
              marginBottom: badge ? "12px" : "0",
              lineHeight: "1.4",
            }}
          >
            {description}
          </p>
        )}

        {badge && (
          <Badge
            style={{
              background: "linear-gradient(135deg, #28a745, #20c997)",
              color: "white",
              padding: "4px 10px",
              borderRadius: "15px",
              fontSize: "10px",
              fontWeight: "600",
            }}
          >
            {badge}
          </Badge>
        )}
      </Card.Body>
    </Card>
  );

  const handleViewInvoice = (invoice) => {
    setSelectedInvoice(invoice);
    setShowViewModal(true);
  };

  const handlePrintInvoice = async (invoice) => {
    setLoading(true);
    try {
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
          qrCode: invoice.qrCode,
          forPrint: true,
        }),
      );

      // Wait for rendering
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Print
      const printWindow = window.open("", "_blank");
      printWindow.document.write(`
        <!DOCTYPE html>
        <html>
          <head>
            <title>Invoice ${invoice.invoiceId}</title>
            <style>
              @page { size: A4; margin: 10mm; }
              body { margin: 0; font-family: Arial, sans-serif; }
            </style>
          </head>
          <body>
            ${tempDiv.innerHTML}
          </body>
        </html>
      `);
      printWindow.document.close();
      printWindow.print();

      // Cleanup
      document.body.removeChild(tempDiv);
    } catch (error) {
      console.error("Print error:", error);
    } finally {
      setLoading(false);
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
      <section
        style={{
          paddingTop: "2rem",
          paddingBottom: "2rem",
          minHeight: "100vh",
          background: "linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%)",
        }}
      >
        <Container>
          {/* Enhanced Header */}
          <Row className="mb-4">
            <Col lg={12}>
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <h1
                    style={{
                      color: "#333",
                      fontWeight: "800",
                      marginBottom: "10px",
                      fontSize: "2.5rem",
                    }}
                  >
                    Invoice Management
                  </h1>
                  <p
                    style={{
                      color: "#6c757d",
                      fontSize: "1.1rem",
                      marginBottom: "0",
                    }}
                  >
                    Manage and track all customer invoices with advanced
                    analytics
                  </p>
                </div>
                <div className="d-flex gap-3">
                  <EnhancedButton
                    variant="success"
                    onClick={handleExportToExcel}
                    icon="bi bi-download"
                    disabled={isExporting}
                  >
                    {isExporting ? "Exporting..." : "Export Excel"}
                  </EnhancedButton>
                  <EnhancedButton
                    variant="info"
                    onClick={() => window.location.reload()}
                    icon="bi bi-arrow-clockwise"
                  >
                    Refresh
                  </EnhancedButton>
                </div>
              </div>
            </Col>
          </Row>

          {/* Enhanced Statistics Cards */}
          <Row className="mb-5 g-4">
            <Col lg={2} md={4} sm={6}>
              <CircularStatCard
                icon="bi bi-receipt-cutoff"
                value={invoiceStats.totalInvoices}
                label="Total Invoices"
                gradient="linear-gradient(135deg, #e63946, #dc3545)"
                description="All time invoices"
              />
            </Col>

            <Col lg={2} md={4} sm={6}>
              <CircularStatCard
                icon="bi bi-check-circle"
                value={invoiceStats.paidInvoices}
                label="Paid Invoices"
                gradient="linear-gradient(135deg, #28a745, #20c997)"
                badge="Completed"
                description="Successfully paid"
              />
            </Col>

            <Col lg={2} md={4} sm={6}>
              <CircularStatCard
                icon="bi bi-clock-history"
                value={invoiceStats.pendingInvoices}
                label="Pending Invoices"
                gradient="linear-gradient(135deg, #ffc107, #fd7e14)"
                description="Awaiting payment"
              />
            </Col>

            <Col lg={2} md={4} sm={6}>
              <CircularStatCard
                icon="bi bi-currency-rupee"
                value={`₹${(invoiceStats.totalRevenue / 1000).toFixed(1)}k`}
                label="Total Revenue"
                gradient="linear-gradient(135deg, #6f42c1, #6610f2)"
                description="Total earnings"
              />
            </Col>

            <Col lg={2} md={4} sm={6}>
              <CircularStatCard
                icon="bi bi-credit-card"
                value={invoiceStats.onlinePayments}
                label="Online Payments"
                gradient="linear-gradient(135deg, #17a2b8, #20c997)"
                description="Digital transactions"
              />
            </Col>

            <Col lg={2} md={4} sm={6}>
              <CircularStatCard
                icon="bi bi-cash-coin"
                value={invoiceStats.codPayments}
                label="COD Payments"
                gradient="linear-gradient(135deg, #fd7e14, #ffc107)"
                description="Cash on delivery"
              />
            </Col>
          </Row>

          {/* Filters and Search */}
          <Row className="mb-4">
            <Col lg={12}>
              <Card
                style={{
                  border: "none",
                  borderRadius: "16px",
                  boxShadow: "0 8px 32px rgba(0,0,0,0.08)",
                }}
              >
                <Card.Body style={{ padding: "25px" }}>
                  <Row className="g-3">
                    <Col md={4}>
                      <Form.Label style={{ fontWeight: "600", color: "#333" }}>
                        Search Invoices
                      </Form.Label>
                      <InputGroup>
                        <InputGroup.Text>
                          <i className="bi bi-search"></i>
                        </InputGroup.Text>
                        <Form.Control
                          type="text"
                          placeholder="Search by invoice ID, order ID, customer..."
                          value={searchTerm}
                          onChange={(e) => setSearchTerm(e.target.value)}
                          style={{
                            borderRadius: "0 8px 8px 0",
                            border: "2px solid #e9ecef",
                          }}
                        />
                      </InputGroup>
                    </Col>

                    <Col md={3}>
                      <Form.Label style={{ fontWeight: "600", color: "#333" }}>
                        Filter by Status
                      </Form.Label>
                      <Form.Select
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                        style={{
                          borderRadius: "8px",
                          border: "2px solid #e9ecef",
                        }}
                      >
                        <option value="">All Statuses</option>
                        <option value="Paid">Paid</option>
                        <option value="Pending">Pending</option>
                        <option value="Overdue">Overdue</option>
                      </Form.Select>
                    </Col>

                    <Col md={3}>
                      <Form.Label style={{ fontWeight: "600", color: "#333" }}>
                        Filter by Payment
                      </Form.Label>
                      <Form.Select
                        value={paymentFilter}
                        onChange={(e) => setPaymentFilter(e.target.value)}
                        style={{
                          borderRadius: "8px",
                          border: "2px solid #e9ecef",
                        }}
                      >
                        <option value="">All Payment Methods</option>
                        <option value="Online">Online</option>
                        <option value="COD">Cash on Delivery</option>
                      </Form.Select>
                    </Col>

                    <Col md={2} className="d-flex align-items-end">
                      <EnhancedButton
                        variant="outline"
                        onClick={() => {
                          setSearchTerm("");
                          setStatusFilter("");
                          setPaymentFilter("");
                        }}
                        icon="bi bi-arrow-clockwise"
                        style={{ width: "100%" }}
                      >
                        Reset
                      </EnhancedButton>
                    </Col>
                  </Row>
                </Card.Body>
              </Card>
            </Col>
          </Row>

          {/* Enhanced Invoices Table */}
          <Row>
            <Col lg={12}>
              <Card
                style={{
                  border: "none",
                  borderRadius: "16px",
                  boxShadow: "0 8px 32px rgba(0,0,0,0.08)",
                }}
              >
                <Card.Header
                  style={{
                    background: "linear-gradient(135deg, #e63946, #dc3545)",
                    color: "white",
                    borderRadius: "16px 16px 0 0",
                    padding: "20px 25px",
                  }}
                >
                  <div className="d-flex justify-content-between align-items-center">
                    <h5 className="mb-0" style={{ fontWeight: "700" }}>
                      <i className="bi bi-receipt-cutoff me-2"></i>
                      Invoice Records ({filteredInvoices.length})
                    </h5>
                    <Badge
                      style={{
                        background: "rgba(255,255,255,0.2)",
                        color: "white",
                        padding: "6px 12px",
                        borderRadius: "15px",
                        fontSize: "12px",
                      }}
                    >
                      {filteredInvoices.length} of {invoices.length} invoices
                    </Badge>
                  </div>
                </Card.Header>
                <Card.Body style={{ padding: "0" }}>
                  <Table responsive hover style={{ marginBottom: "0" }}>
                    <thead style={{ background: "#f8f9fa" }}>
                      <tr>
                        <th
                          style={{
                            padding: "15px",
                            fontWeight: "600",
                            color: "#333",
                          }}
                        >
                          Invoice Details
                        </th>
                        <th
                          style={{
                            padding: "15px",
                            fontWeight: "600",
                            color: "#333",
                          }}
                        >
                          Customer
                        </th>
                        <th
                          style={{
                            padding: "15px",
                            fontWeight: "600",
                            color: "#333",
                          }}
                        >
                          Amount
                        </th>
                        <th
                          style={{
                            padding: "15px",
                            fontWeight: "600",
                            color: "#333",
                          }}
                        >
                          Status
                        </th>
                        <th
                          style={{
                            padding: "15px",
                            fontWeight: "600",
                            color: "#333",
                          }}
                        >
                          Payment
                        </th>
                        <th
                          style={{
                            padding: "15px",
                            fontWeight: "600",
                            color: "#333",
                          }}
                        >
                          Date
                        </th>
                        <th
                          style={{
                            padding: "15px",
                            fontWeight: "600",
                            color: "#333",
                          }}
                        >
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredInvoices.map((invoice) => (
                        <tr
                          key={invoice.id}
                          style={{ borderBottom: "1px solid #f1f3f4" }}
                        >
                          <td style={{ padding: "15px" }}>
                            <div>
                              <div
                                style={{
                                  fontWeight: "600",
                                  marginBottom: "2px",
                                }}
                              >
                                {invoice.invoiceId}
                              </div>
                              <small style={{ color: "#6c757d" }}>
                                Order: {invoice.orderId}
                              </small>
                            </div>
                          </td>
                          <td style={{ padding: "15px" }}>
                            <div>
                              <div
                                style={{
                                  fontWeight: "600",
                                  marginBottom: "2px",
                                }}
                              >
                                {invoice.customerName}
                              </div>
                              <small style={{ color: "#6c757d" }}>
                                {invoice.customerEmail}
                              </small>
                            </div>
                          </td>
                          <td style={{ padding: "15px" }}>
                            <div
                              style={{
                                fontWeight: "700",
                                color: "#28a745",
                                fontSize: "16px",
                              }}
                            >
                              ₹{invoice.totalAmount.toFixed(2)}
                            </div>
                          </td>
                          <td style={{ padding: "15px" }}>
                            <Badge
                              bg={getStatusVariant(invoice.status)}
                              style={{
                                padding: "6px 12px",
                                borderRadius: "15px",
                                fontSize: "11px",
                                fontWeight: "600",
                              }}
                            >
                              {invoice.status}
                            </Badge>
                          </td>
                          <td style={{ padding: "15px" }}>
                            <span
                              style={{
                                background:
                                  invoice.paymentMethod === "Online"
                                    ? "#e7f3ff"
                                    : "#fff3cd",
                                color:
                                  invoice.paymentMethod === "Online"
                                    ? "#0066cc"
                                    : "#856404",
                                padding: "4px 8px",
                                borderRadius: "6px",
                                fontSize: "11px",
                                fontWeight: "600",
                              }}
                            >
                              {invoice.paymentMethod}
                            </span>
                          </td>
                          <td style={{ padding: "15px" }}>
                            <div
                              style={{ fontSize: "14px", fontWeight: "600" }}
                            >
                              {invoice.orderDate}
                            </div>
                            <small style={{ color: "#6c757d" }}>
                              {invoice.orderTime}
                            </small>
                          </td>
                          <td style={{ padding: "15px" }}>
                            <div className="d-flex gap-2">
                              <EnhancedButton
                                variant="info"
                                size="sm"
                                onClick={() => handleViewInvoice(invoice)}
                                icon="bi bi-eye"
                              >
                                View
                              </EnhancedButton>
                              <EnhancedButton
                                variant="outline"
                                size="sm"
                                onClick={() => handlePrintInvoice(invoice)}
                                disabled={loading}
                                icon="bi bi-printer"
                              >
                                Print
                              </EnhancedButton>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </Table>

                  {filteredInvoices.length === 0 && (
                    <div
                      className="text-center"
                      style={{ padding: "60px 20px", color: "#6c757d" }}
                    >
                      <i
                        className="bi bi-receipt"
                        style={{ fontSize: "48px", marginBottom: "16px" }}
                      ></i>
                      <h5>No invoices found</h5>
                      <p>Try adjusting your search or filter criteria</p>
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
        <Modal.Header
          closeButton
          style={{
            background: "linear-gradient(135deg, #e63946, #dc3545)",
            color: "white",
          }}
        >
          <Modal.Title style={{ fontWeight: "700" }}>
            <i className="bi bi-receipt me-2"></i>
            Invoice Preview - {selectedInvoice?.invoiceId}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body style={{ padding: "0" }}>
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
        <Modal.Footer style={{ background: "#f8f9fa" }}>
          <EnhancedButton
            variant="outline"
            onClick={() => setShowViewModal(false)}
          >
            Close
          </EnhancedButton>
          <EnhancedButton
            variant="success"
            onClick={() => handlePrintInvoice(selectedInvoice)}
            disabled={loading}
            icon="bi bi-printer"
          >
            {loading ? "Preparing..." : "Print Invoice"}
          </EnhancedButton>
        </Modal.Footer>
      </Modal>

      {/* Loading Overlay */}
      {loading && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: "rgba(0,0,0,0.5)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 9999,
          }}
        >
          <div
            style={{
              background: "white",
              padding: "30px",
              borderRadius: "15px",
              textAlign: "center",
            }}
          >
            <Spinner
              animation="border"
              variant="primary"
              style={{ marginBottom: "15px" }}
            />
            <div style={{ fontWeight: "600" }}>Preparing invoice...</div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminInvoices;
