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
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");

  // Enhanced statistics
  const invoiceStats = {
    totalInvoices: invoices.length,
    paidInvoices: invoices.filter((inv) => inv.status === "Paid").length,
    pendingInvoices: invoices.filter((inv) => inv.status === "Pending").length,
    totalRevenue: invoices.reduce((sum, inv) => sum + inv.totalAmount, 0),
  };

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
          type: "invoice_verification",
          invoice_id: invoice.invoiceId,
          order_id: invoice.orderId,
          customer_name: invoice.customerName,
          total_amount: `₹${invoice.totalAmount.toFixed(2)}`,
          invoice_date: invoice.orderDate,
          payment_status: invoice.status,
          verify_url: `${window.location.origin}/invoice/${invoice.orderId}`,
          company: "Hare Krishna Medical",
          location: "Surat, Gujarat, India",
          phone: "+91 76989 13354",
          email: "harekrishnamedical@gmail.com",
          generated_at: new Date().toISOString(),
        });
        qrCodeDataURL = await QRCode.toDataURL(qrText, {
          width: 180,
          margin: 2,
          color: {
            dark: "#1a202c",
            light: "#ffffff",
          },
          errorCorrectionLevel: "M",
        });
      }

      // Use centralized print function
      await printInvoice(invoice, qrCodeDataURL || invoice.qrCode);

      setAlertMessage("Invoice printed successfully!");
      setShowAlert(true);
      setTimeout(() => setShowAlert(false), 3000);
    } catch (error) {
      console.error("Print error:", error);
      setAlertMessage("Error printing invoice. Please try again.");
      setShowAlert(true);
      setTimeout(() => setShowAlert(false), 3000);
    }
  };

  const handleDownloadInvoice = async (invoice) => {
    try {
      // Generate QR code if not exists
      let qrCodeDataURL = null;
      if (!invoice.qrCode) {
        const qrText = JSON.stringify({
          type: "invoice_verification",
          invoice_id: invoice.invoiceId,
          order_id: invoice.orderId,
          customer_name: invoice.customerName,
          total_amount: `₹${invoice.totalAmount.toFixed(2)}`,
          invoice_date: invoice.orderDate,
          payment_status: invoice.status,
          verify_url: `${window.location.origin}/invoice/${invoice.orderId}`,
          company: "Hare Krishna Medical",
          location: "Surat, Gujarat, India",
          phone: "+91 76989 13354",
          email: "harekrishnamedical@gmail.com",
          generated_at: new Date().toISOString(),
        });
        qrCodeDataURL = await QRCode.toDataURL(qrText, {
          width: 180,
          margin: 2,
          color: {
            dark: "#1a202c",
            light: "#ffffff",
          },
          errorCorrectionLevel: "M",
        });
      }

      // Use centralized download function
      await downloadInvoice(invoice, qrCodeDataURL || invoice.qrCode);

      setAlertMessage("Invoice downloaded successfully!");
      setShowAlert(true);
      setTimeout(() => setShowAlert(false), 3000);
    } catch (error) {
      console.error("Download error:", error);
      setAlertMessage("Error downloading invoice. Please try again.");
      setShowAlert(true);
      setTimeout(() => setShowAlert(false), 3000);
    }
  };

  const handlePaymentStatusChange = async (
    invoiceId,
    newStatus,
    newMethod = null,
  ) => {
    try {
      // Update local state immediately for real-time UI
      setInvoices((prevInvoices) =>
        prevInvoices.map((invoice) =>
          invoice.id === invoiceId
            ? {
                ...invoice,
                status: newStatus,
                paymentStatus: newStatus === "Paid" ? "Completed" : "Pending",
                ...(newMethod && { paymentMethod: newMethod }),
              }
            : invoice,
        ),
      );

      // Here you would make API call to backend to update database
      // const response = await fetch(`/api/invoices/${invoiceId}/payment-status`, {
      //   method: 'PUT',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ status: newStatus, method: newMethod })
      // });

      setAlertMessage(`Payment status updated to ${newStatus} successfully!`);
      setShowAlert(true);
      setTimeout(() => setShowAlert(false), 3000);
    } catch (error) {
      console.error("Status update error:", error);
      setAlertMessage("Error updating payment status. Please try again.");
      setShowAlert(true);
      setTimeout(() => setShowAlert(false), 3000);
    }
  };

  // Centralized print function
  const printInvoice = async (invoiceData, qrCode) => {
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
          invoiceData: invoiceData,
          qrCode: qrCode,
          forPrint: true,
        }),
      );

      // Wait for rendering
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Print using window.print()
      const printWindow = window.open("", "_blank");
      printWindow.document.write(`
        <!DOCTYPE html>
        <html>
          <head>
            <title>Invoice ${invoiceData.invoiceId}</title>
            <style>
              @page {
                size: A4;
                margin: 10mm;
              }
              body {
                margin: 0;
                font-family: Arial, sans-serif;
                -webkit-print-color-adjust: exact;
                print-color-adjust: exact;
              }
            </style>
          </head>
          <body>
            ${tempDiv.innerHTML}
          </body>
        </html>
      `);
      printWindow.document.close();
      printWindow.focus();
      printWindow.print();
      printWindow.close();

      // Cleanup
      document.body.removeChild(tempDiv);
    } catch (error) {
      console.error("Centralized print error:", error);
      throw error;
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

      setAlertMessage("Invoice data exported successfully!");
      setShowAlert(true);
      setTimeout(() => setShowAlert(false), 3000);
    } catch (error) {
      console.error("Export error:", error);
      setAlertMessage("Error exporting data. Please try again.");
      setShowAlert(true);
      setTimeout(() => setShowAlert(false), 3000);
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
          {/* Alert */}
          {showAlert && (
            <Row className="mb-4">
              <Col lg={12}>
                <Alert
                  variant={
                    alertMessage.includes("Error") ? "danger" : "success"
                  }
                  onClose={() => setShowAlert(false)}
                  dismissible
                  style={{
                    borderRadius: "12px",
                    border: "none",
                    background: alertMessage.includes("Error")
                      ? "linear-gradient(135deg, #f8d7da, #f5c6cb)"
                      : "linear-gradient(135deg, #d4edda, #c3e6cb)",
                  }}
                >
                  <i
                    className={`bi bi-${alertMessage.includes("Error") ? "exclamation-triangle" : "check-circle"} me-2`}
                  ></i>
                  {alertMessage}
                </Alert>
              </Col>
            </Row>
          )}

          {/* Enhanced Header */}
          <Row className="mb-4">
            <Col lg={12}>
              <Card
                style={{
                  border: "none",
                  borderRadius: "20px",
                  background: "linear-gradient(135deg, #e63946, #dc3545)",
                  color: "white",
                  boxShadow: "0 15px 50px rgba(230, 57, 70, 0.3)",
                }}
              >
                <Card.Body style={{ padding: "30px" }}>
                  <Row className="align-items-center">
                    <Col lg={8}>
                      <div className="d-flex align-items-center">
                        <div
                          style={{
                            width: "60px",
                            height: "60px",
                            background: "rgba(255, 255, 255, 0.2)",
                            borderRadius: "50%",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            marginRight: "20px",
                          }}
                        >
                          <i
                            className="bi bi-receipt-cutoff"
                            style={{ fontSize: "28px" }}
                          ></i>
                        </div>
                        <div>
                          <h1
                            style={{
                              fontWeight: "800",
                              marginBottom: "5px",
                              fontSize: "2.2rem",
                            }}
                          >
                            Invoice Management
                          </h1>
                          <p
                            style={{
                              opacity: "0.9",
                              marginBottom: "0",
                              fontSize: "1.1rem",
                            }}
                          >
                            Manage and track all customer invoices efficiently
                          </p>
                        </div>
                      </div>
                    </Col>
                    <Col lg={4} className="text-end">
                      <div className="d-flex gap-2 justify-content-end">
                        <Button
                          variant="light"
                          onClick={handleExportToExcel}
                          disabled={isExporting}
                          style={{
                            borderRadius: "8px",
                            fontWeight: "600",
                            padding: "8px 16px",
                          }}
                        >
                          <i className="bi bi-download me-2"></i>
                          {isExporting ? "Exporting..." : "Export"}
                        </Button>
                        <Button
                          variant="outline-light"
                          onClick={() => window.location.reload()}
                          style={{
                            borderRadius: "8px",
                            fontWeight: "600",
                            padding: "8px 16px",
                          }}
                        >
                          <i className="bi bi-arrow-clockwise me-2"></i>
                          Refresh
                        </Button>
                      </div>
                    </Col>
                  </Row>
                </Card.Body>
              </Card>
            </Col>
          </Row>

          {/* Enhanced Stats Cards */}
          <Row className="mb-4 g-3">
            <Col lg={3} md={6}>
              <Card
                style={{
                  border: "none",
                  borderRadius: "16px",
                  background: "linear-gradient(135deg, #ffffff, #f8f9fa)",
                  boxShadow: "0 8px 32px rgba(0, 0, 0, 0.1)",
                  transition: "all 0.3s ease",
                }}
                onMouseOver={(e) => {
                  e.currentTarget.style.transform = "translateY(-5px)";
                  e.currentTarget.style.boxShadow =
                    "0 15px 45px rgba(0, 0, 0, 0.15)";
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.transform = "translateY(0)";
                  e.currentTarget.style.boxShadow =
                    "0 8px 32px rgba(0, 0, 0, 0.1)";
                }}
              >
                <Card.Body className="text-center" style={{ padding: "25px" }}>
                  <div
                    style={{
                      width: "60px",
                      height: "60px",
                      background: "linear-gradient(135deg, #e63946, #dc3545)",
                      borderRadius: "50%",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      margin: "0 auto 15px",
                      boxShadow: "0 8px 25px rgba(230, 57, 70, 0.3)",
                    }}
                  >
                    <i
                      className="bi bi-receipt-cutoff"
                      style={{ fontSize: "24px", color: "white" }}
                    ></i>
                  </div>
                  <h3
                    style={{
                      color: "#333",
                      fontWeight: "800",
                      marginBottom: "5px",
                    }}
                  >
                    {invoiceStats.totalInvoices}
                  </h3>
                  <p
                    style={{
                      color: "#6c757d",
                      fontSize: "14px",
                      marginBottom: "0",
                    }}
                  >
                    Total Invoices
                  </p>
                </Card.Body>
              </Card>
            </Col>

            <Col lg={3} md={6}>
              <Card
                style={{
                  border: "none",
                  borderRadius: "16px",
                  background: "linear-gradient(135deg, #ffffff, #f8f9fa)",
                  boxShadow: "0 8px 32px rgba(0, 0, 0, 0.1)",
                  transition: "all 0.3s ease",
                }}
                onMouseOver={(e) => {
                  e.currentTarget.style.transform = "translateY(-5px)";
                  e.currentTarget.style.boxShadow =
                    "0 15px 45px rgba(0, 0, 0, 0.15)";
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.transform = "translateY(0)";
                  e.currentTarget.style.boxShadow =
                    "0 8px 32px rgba(0, 0, 0, 0.1)";
                }}
              >
                <Card.Body className="text-center" style={{ padding: "25px" }}>
                  <div
                    style={{
                      width: "60px",
                      height: "60px",
                      background: "linear-gradient(135deg, #28a745, #20c997)",
                      borderRadius: "50%",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      margin: "0 auto 15px",
                      boxShadow: "0 8px 25px rgba(40, 167, 69, 0.3)",
                    }}
                  >
                    <i
                      className="bi bi-check-circle"
                      style={{ fontSize: "24px", color: "white" }}
                    ></i>
                  </div>
                  <h3
                    style={{
                      color: "#333",
                      fontWeight: "800",
                      marginBottom: "5px",
                    }}
                  >
                    {invoiceStats.paidInvoices}
                  </h3>
                  <p
                    style={{
                      color: "#6c757d",
                      fontSize: "14px",
                      marginBottom: "0",
                    }}
                  >
                    Paid Invoices
                  </p>
                </Card.Body>
              </Card>
            </Col>

            <Col lg={3} md={6}>
              <Card
                style={{
                  border: "none",
                  borderRadius: "16px",
                  background: "linear-gradient(135deg, #ffffff, #f8f9fa)",
                  boxShadow: "0 8px 32px rgba(0, 0, 0, 0.1)",
                  transition: "all 0.3s ease",
                }}
                onMouseOver={(e) => {
                  e.currentTarget.style.transform = "translateY(-5px)";
                  e.currentTarget.style.boxShadow =
                    "0 15px 45px rgba(0, 0, 0, 0.15)";
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.transform = "translateY(0)";
                  e.currentTarget.style.boxShadow =
                    "0 8px 32px rgba(0, 0, 0, 0.1)";
                }}
              >
                <Card.Body className="text-center" style={{ padding: "25px" }}>
                  <div
                    style={{
                      width: "60px",
                      height: "60px",
                      background: "linear-gradient(135deg, #ffc107, #fd7e14)",
                      borderRadius: "50%",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      margin: "0 auto 15px",
                      boxShadow: "0 8px 25px rgba(255, 193, 7, 0.3)",
                    }}
                  >
                    <i
                      className="bi bi-clock-history"
                      style={{ fontSize: "24px", color: "white" }}
                    ></i>
                  </div>
                  <h3
                    style={{
                      color: "#333",
                      fontWeight: "800",
                      marginBottom: "5px",
                    }}
                  >
                    {invoiceStats.pendingInvoices}
                  </h3>
                  <p
                    style={{
                      color: "#6c757d",
                      fontSize: "14px",
                      marginBottom: "0",
                    }}
                  >
                    Pending Invoices
                  </p>
                </Card.Body>
              </Card>
            </Col>

            <Col lg={3} md={6}>
              <Card
                style={{
                  border: "none",
                  borderRadius: "16px",
                  background: "linear-gradient(135deg, #ffffff, #f8f9fa)",
                  boxShadow: "0 8px 32px rgba(0, 0, 0, 0.1)",
                  transition: "all 0.3s ease",
                }}
                onMouseOver={(e) => {
                  e.currentTarget.style.transform = "translateY(-5px)";
                  e.currentTarget.style.boxShadow =
                    "0 15px 45px rgba(0, 0, 0, 0.15)";
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.transform = "translateY(0)";
                  e.currentTarget.style.boxShadow =
                    "0 8px 32px rgba(0, 0, 0, 0.1)";
                }}
              >
                <Card.Body className="text-center" style={{ padding: "25px" }}>
                  <div
                    style={{
                      width: "60px",
                      height: "60px",
                      background: "linear-gradient(135deg, #6f42c1, #6610f2)",
                      borderRadius: "50%",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      margin: "0 auto 15px",
                      boxShadow: "0 8px 25px rgba(111, 66, 193, 0.3)",
                    }}
                  >
                    <i
                      className="bi bi-currency-rupee"
                      style={{ fontSize: "24px", color: "white" }}
                    ></i>
                  </div>
                  <h3
                    style={{
                      color: "#333",
                      fontWeight: "800",
                      marginBottom: "5px",
                    }}
                  >
                    ₹{(invoiceStats.totalRevenue / 1000).toFixed(1)}k
                  </h3>
                  <p
                    style={{
                      color: "#6c757d",
                      fontSize: "14px",
                      marginBottom: "0",
                    }}
                  >
                    Total Revenue
                  </p>
                </Card.Body>
              </Card>
            </Col>
          </Row>

          {/* Enhanced Filters */}
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
                    <Col md={6}>
                      <Form.Label style={{ fontWeight: "600", color: "#333" }}>
                        <i className="bi bi-search me-2"></i>
                        Search Invoices
                      </Form.Label>
                      <InputGroup>
                        <InputGroup.Text style={{ borderColor: "#e9ecef" }}>
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
                        <i className="bi bi-funnel me-2"></i>
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
                    <Col md={3} className="d-flex align-items-end">
                      <Button
                        variant="outline-secondary"
                        onClick={() => {
                          setSearchTerm("");
                          setStatusFilter("");
                        }}
                        style={{
                          width: "100%",
                          borderRadius: "8px",
                          fontWeight: "600",
                        }}
                      >
                        <i className="bi bi-arrow-clockwise me-2"></i>
                        Reset Filters
                      </Button>
                    </Col>
                  </Row>
                </Card.Body>
              </Card>
            </Col>
          </Row>

          {/* Enhanced Invoice Table */}
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
                    background: "linear-gradient(135deg, #343a40, #495057)",
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
                            borderBottom: "2px solid #e9ecef",
                          }}
                        >
                          Invoice Details
                        </th>
                        <th
                          style={{
                            padding: "15px",
                            fontWeight: "600",
                            color: "#333",
                            borderBottom: "2px solid #e9ecef",
                          }}
                        >
                          Customer
                        </th>
                        <th
                          style={{
                            padding: "15px",
                            fontWeight: "600",
                            color: "#333",
                            borderBottom: "2px solid #e9ecef",
                          }}
                        >
                          Amount
                        </th>
                        <th
                          style={{
                            padding: "15px",
                            fontWeight: "600",
                            color: "#333",
                            borderBottom: "2px solid #e9ecef",
                          }}
                        >
                          Status
                        </th>
                        <th
                          style={{
                            padding: "15px",
                            fontWeight: "600",
                            color: "#333",
                            borderBottom: "2px solid #e9ecef",
                          }}
                        >
                          Payment
                        </th>
                        <th
                          style={{
                            padding: "15px",
                            fontWeight: "600",
                            color: "#333",
                            borderBottom: "2px solid #e9ecef",
                          }}
                        >
                          Date
                        </th>
                        <th
                          style={{
                            padding: "15px",
                            fontWeight: "600",
                            color: "#333",
                            borderBottom: "2px solid #e9ecef",
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
                          style={{
                            borderBottom: "1px solid #f1f3f4",
                            transition: "all 0.2s ease",
                          }}
                          onMouseOver={(e) => {
                            e.currentTarget.style.backgroundColor = "#f8f9fa";
                          }}
                          onMouseOut={(e) => {
                            e.currentTarget.style.backgroundColor =
                              "transparent";
                          }}
                        >
                          <td style={{ padding: "15px" }}>
                            <div>
                              <div
                                style={{
                                  fontWeight: "700",
                                  marginBottom: "3px",
                                  color: "#333",
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
                                  marginBottom: "3px",
                                  color: "#333",
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
                              <Button
                                variant="outline-primary"
                                size="sm"
                                onClick={() => handleViewInvoice(invoice)}
                                style={{
                                  borderRadius: "6px",
                                  fontWeight: "600",
                                }}
                              >
                                <i className="bi bi-eye"></i>
                              </Button>
                              <Button
                                variant="outline-success"
                                size="sm"
                                onClick={() => handlePrintInvoice(invoice)}
                                style={{
                                  borderRadius: "6px",
                                  fontWeight: "600",
                                }}
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

      {/* Enhanced Invoice View Modal */}
      <Modal
        show={showViewModal}
        onHide={() => {
          setShowViewModal(false);
          setSelectedInvoice(null);
        }}
        size="xl"
        backdrop="static"
        keyboard={true}
      >
        <Modal.Header
          closeButton
          style={{
            background: "linear-gradient(135deg, #e63946, #dc3545)",
            color: "white",
            borderRadius: "0",
          }}
        >
          <Modal.Title style={{ fontWeight: "700" }}>
            <i className="bi bi-receipt me-2"></i>
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
        <Modal.Footer style={{ background: "#f8f9fa" }}>
          <Button
            variant="secondary"
            onClick={() => {
              setShowViewModal(false);
              setSelectedInvoice(null);
            }}
            style={{
              borderRadius: "8px",
              fontWeight: "600",
            }}
          >
            <i className="bi bi-x-lg me-2"></i>
            Close
          </Button>
          <Button
            variant="success"
            onClick={() => handlePrintInvoice(selectedInvoice)}
            style={{
              borderRadius: "8px",
              fontWeight: "600",
            }}
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
