import React, { useState, useEffect } from "react";
import {
  Container,
  Row,
  Col,
  Card,
  Button,
  Table,
  Badge,
  Alert,
} from "react-bootstrap";
import { useParams, Link, Navigate } from "react-router-dom";
import { useSelector } from "react-redux";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import QRCode from "qrcode";

const InvoiceView = () => {
  const { orderId } = useParams();
  const { isAuthenticated, user } = useSelector((state) => state.auth);
  const [invoice, setInvoice] = useState(null);
  const [loading, setLoading] = useState(true);
  const [qrCode, setQrCode] = useState("");

  // Redirect to login if not authenticated
  if (!isAuthenticated) {
    return (
      <Navigate to="/login" state={{ from: `/invoice/${orderId}` }} replace />
    );
  }

  // Mock invoice data - in real app, this would be fetched from API
  useEffect(() => {
    const fetchInvoice = async () => {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      const mockInvoice = {
        orderId: orderId || "HKM12345678",
        invoiceId: `INV${orderId?.slice(-6) || "123456"}`,
        customerDetails: {
          fullName: "John Doe",
          email: "john.doe@example.com",
          mobile: "+91 9876543210",
          address: "123 Medical Street",
          city: "Surat",
          state: "Gujarat",
          pincode: "395007",
        },
        items: [
          {
            id: 1,
            name: "Paracetamol Tablets 500mg",
            company: "Hare Krishna Pharma",
            quantity: 2,
            price: 25.99,
            total: 51.98,
          },
          {
            id: 2,
            name: "Vitamin D3 Capsules",
            company: "Health Plus",
            quantity: 1,
            price: 45.5,
            total: 45.5,
          },
        ],
        orderSummary: {
          subtotal: 97.48,
          shipping: 0,
          tax: 4.87,
          total: 102.35,
        },
        orderDate: "2024-01-15",
        orderTime: "14:30:25",
        status: "Paid",
        paymentMethod: "Cash on Delivery",
        deliveryDate: "2024-01-17",
      };

      setInvoice(mockInvoice);
      setLoading(false);

      // Generate QR code for this invoice
      try {
        const currentUrl = window.location.href;
        const qrCodeDataURL = await QRCode.toDataURL(currentUrl);
        setQrCode(qrCodeDataURL);
      } catch (error) {
        console.error("Error generating QR code:", error);
      }
    };

    fetchInvoice();
  }, [orderId]);

  const downloadPDF = async () => {
    const element = document.getElementById("invoice-content");
    if (!element) return;

    try {
      const canvas = await html2canvas(element, {
        scale: 2,
        useCORS: true,
        allowTaint: true,
      });

      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF("p", "mm", "a4");
      const imgWidth = 210;
      const pageHeight = 295;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      let heightLeft = imgHeight;

      let position = 0;

      pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;

      while (heightLeft >= 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
      }

      pdf.save(`Invoice_${invoice.orderId}.pdf`);
    } catch (error) {
      console.error("Error generating PDF:", error);
      alert("Error generating PDF. Please try again.");
    }
  };

  const printInvoice = () => {
    window.print();
  };

  if (loading) {
    return (
      <Container className="section-padding">
        <div className="text-center">
          <div className="loading-spinner"></div>
          <p>Loading invoice...</p>
        </div>
      </Container>
    );
  }

  if (!invoice) {
    return (
      <Container className="section-padding">
        <Alert variant="danger" className="text-center">
          <h4>Invoice Not Found</h4>
          <p>The requested invoice could not be found.</p>
          <Button as={Link} to="/" className="btn-medical-primary">
            Go Home
          </Button>
        </Alert>
      </Container>
    );
  }

  return (
    <div className="fade-in">
      <section className="section-padding">
        <Container>
          {/* Action Buttons */}
          <Row className="mb-4 d-print-none">
            <Col lg={12} className="text-end">
              <div className="d-flex gap-2 justify-content-end">
                <Button
                  variant="outline-primary"
                  onClick={printInvoice}
                  className="btn-medical-outline"
                >
                  <i className="bi bi-printer me-2"></i>
                  Print
                </Button>
                <Button
                  variant="primary"
                  onClick={downloadPDF}
                  className="btn-medical-primary"
                >
                  <i className="bi bi-download me-2"></i>
                  Download PDF
                </Button>
              </div>
            </Col>
          </Row>

          {/* Invoice Content */}
          <div id="invoice-content">
            <Card className="medical-card">
              <Card.Body className="p-5">
                {/* Header */}
                <Row className="mb-4">
                  <Col md={6}>
                    <div className="d-flex align-items-center mb-3">
                      <img
                        src="https://cdn.builder.io/api/v1/assets/ec4b3f82f1ac4275b8bfc1756fcac420/medical_logo-e586be?format=webp&width=800"
                        alt="Hare Krishna Medical"
                        style={{ height: "60px", width: "auto" }}
                        className="me-3"
                      />
                      <div>
                        <h2 className="mb-0">HARE KRISHNA MEDICAL</h2>
                        <p className="text-muted mb-0">
                          Your Trusted Health Partner
                        </p>
                      </div>
                    </div>
                    <div className="text-muted">
                      <p className="mb-1">
                        3 Sahyog Complex, Man Sarovar circle
                      </p>
                      <p className="mb-1">Amroli, 394107</p>
                      <p className="mb-1">Phone: +91 76989 13354</p>
                      <p className="mb-0">
                        Email: harekrishnamedical@gmail.com
                      </p>
                    </div>
                  </Col>
                  <Col md={6} className="text-md-end">
                    <h1 className="text-medical-red mb-3">INVOICE</h1>
                    <div className="mb-3">
                      <strong>Invoice #:</strong> {invoice.invoiceId}
                      <br />
                      <strong>Order #:</strong> {invoice.orderId}
                      <br />
                      <strong>Date:</strong> {invoice.orderDate}{" "}
                      {invoice.orderTime}
                      <br />
                      <strong>Status:</strong>{" "}
                      <Badge bg="success">{invoice.status}</Badge>
                    </div>
                    {qrCode && (
                      <div className="mt-3">
                        <img
                          src={qrCode}
                          alt="QR Code"
                          style={{ width: "100px", height: "100px" }}
                        />
                        <br />
                        <small className="text-muted">
                          Scan to view invoice
                        </small>
                      </div>
                    )}
                  </Col>
                </Row>

                {/* Bill To Section */}
                <Row className="mb-4">
                  <Col md={6}>
                    <h5 className="border-bottom pb-2 mb-3">Bill To:</h5>
                    <div>
                      <strong>{invoice.customerDetails.fullName}</strong>
                      <br />
                      {invoice.customerDetails.email}
                      <br />
                      {invoice.customerDetails.mobile}
                      <br />
                      {invoice.customerDetails.address}
                      <br />
                      {invoice.customerDetails.city},{" "}
                      {invoice.customerDetails.state}{" "}
                      {invoice.customerDetails.pincode}
                    </div>
                  </Col>
                  <Col md={6}>
                    <h5 className="border-bottom pb-2 mb-3">Payment Info:</h5>
                    <div>
                      <strong>Payment Method:</strong> {invoice.paymentMethod}
                      <br />
                      <strong>Order Date:</strong> {invoice.orderDate}
                      <br />
                      <strong>Delivery Date:</strong> {invoice.deliveryDate}
                      <br />
                      <strong>Payment Status:</strong>{" "}
                      <Badge bg="success">{invoice.status}</Badge>
                    </div>
                  </Col>
                </Row>

                {/* Items Table */}
                <Row className="mb-4">
                  <Col lg={12}>
                    <h5 className="border-bottom pb-2 mb-3">Items Ordered:</h5>
                    <Table bordered responsive>
                      <thead className="table-light">
                        <tr>
                          <th>#</th>
                          <th>Item Description</th>
                          <th className="text-center">Qty</th>
                          <th className="text-end">Unit Price</th>
                          <th className="text-end">Total</th>
                        </tr>
                      </thead>
                      <tbody>
                        {invoice.items.map((item, index) => (
                          <tr key={item.id}>
                            <td>{index + 1}</td>
                            <td>
                              <strong>{item.name}</strong>
                              <br />
                              <small className="text-muted">
                                by {item.company}
                              </small>
                            </td>
                            <td className="text-center">{item.quantity}</td>
                            <td className="text-end">₹{item.price}</td>
                            <td className="text-end">₹{item.total}</td>
                          </tr>
                        ))}
                      </tbody>
                    </Table>
                  </Col>
                </Row>

                {/* Totals */}
                <Row className="mb-4">
                  <Col md={6}></Col>
                  <Col md={6}>
                    <Table className="table-borderless">
                      <tbody>
                        <tr>
                          <td className="text-end">
                            <strong>Subtotal:</strong>
                          </td>
                          <td className="text-end">
                            ₹{invoice.orderSummary.subtotal.toFixed(2)}
                          </td>
                        </tr>
                        <tr>
                          <td className="text-end">Shipping:</td>
                          <td className="text-end">
                            {invoice.orderSummary.shipping === 0
                              ? "FREE"
                              : `₹${invoice.orderSummary.shipping.toFixed(2)}`}
                          </td>
                        </tr>
                        <tr>
                          <td className="text-end">Tax (5%):</td>
                          <td className="text-end">
                            ₹{invoice.orderSummary.tax.toFixed(2)}
                          </td>
                        </tr>
                        <tr className="table-active">
                          <td className="text-end">
                            <strong>Total Amount:</strong>
                          </td>
                          <td className="text-end">
                            <strong className="text-medical-red fs-5">
                              ₹{invoice.orderSummary.total.toFixed(2)}
                            </strong>
                          </td>
                        </tr>
                      </tbody>
                    </Table>
                  </Col>
                </Row>

                {/* Footer */}
                <Row className="mt-5">
                  <Col lg={12}>
                    <div className="border-top pt-3">
                      <div className="row">
                        <div className="col-md-6">
                          <h6>Terms & Conditions:</h6>
                          <ul className="small text-muted">
                            <li>All sales are final</li>
                            <li>Returns accepted within 7 days</li>
                            <li>
                              Prescription required for prescription medicines
                            </li>
                          </ul>
                        </div>
                        <div className="col-md-6 text-md-end">
                          <p className="mb-1">
                            <strong>Thank you for choosing</strong>
                          </p>
                          <p className="mb-1">
                            <strong>Hare Krishna Medical!</strong>
                          </p>
                          <small className="text-muted">
                            For any queries, contact us at <br />
                            harekrishnamedical@gmail.com
                          </small>
                        </div>
                      </div>
                    </div>
                  </Col>
                </Row>
              </Card.Body>
            </Card>
          </div>
        </Container>
      </section>
    </div>
  );
};

export default InvoiceView;
