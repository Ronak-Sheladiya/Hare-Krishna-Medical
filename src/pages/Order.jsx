import React, { useState } from "react";
import {
  Container,
  Row,
  Col,
  Breadcrumb,
  Card,
  Button,
  Form,
  Alert,
  Table,
  Modal,
  Badge,
} from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { clearCart } from "../store/slices/cartSlice.js";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import QRCode from "qrcode";

const Order = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { items, totalAmount } = useSelector((state) => state.cart);
  const { isAuthenticated, user } = useSelector((state) => state.auth);

  const [formData, setFormData] = useState({
    fullName: user?.name || "",
    email: user?.email || "",
    mobile: user?.mobile || "",
    address: user?.address || "",
    pincode: user?.pincode || "",
    city: user?.city || "",
    state: user?.state || "",
    landmark: "",
    alternatePhone: "",
  });

  const [showOrderModal, setShowOrderModal] = useState(false);
  const [showInvoiceModal, setShowInvoiceModal] = useState(false);
  const [orderDetails, setOrderDetails] = useState(null);
  const [errors, setErrors] = useState({});
  const [qrCode, setQrCode] = useState("");
  const [pdfGenerating, setPdfGenerating] = useState(false);

  const shippingCost = totalAmount > 500 ? 0 : 50;
  const taxRate = 0.05;
  const taxAmount = totalAmount * taxRate;
  const finalTotal = totalAmount + shippingCost + taxAmount;

  // Redirect if cart is empty
  if (items.length === 0) {
    return (
      <div className="fade-in">
        <section className="section-padding">
          <Container>
            <Row className="justify-content-center">
              <Col lg={8} className="text-center">
                <div className="medical-card p-5">
                  <i className="bi bi-cart-x display-1 text-muted mb-4"></i>
                  <h3 className="mb-3">No Items to Order</h3>
                  <p className="text-muted mb-4">
                    Your cart is empty. Please add some products before
                    proceeding to checkout.
                  </p>
                  <Button
                    as={Link}
                    to="/products"
                    className="btn-medical-primary"
                    size="lg"
                  >
                    <i className="bi bi-grid3x3-gap me-2"></i>
                    Continue Shopping
                  </Button>
                </div>
              </Col>
            </Row>
          </Container>
        </section>
      </div>
    );
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.fullName.trim()) {
      newErrors.fullName = "Full name is required";
    }
    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Email format is invalid";
    }
    if (!formData.mobile.trim()) {
      newErrors.mobile = "Mobile number is required";
    } else if (!/^\d{10}$/.test(formData.mobile.replace(/\s+/g, ""))) {
      newErrors.mobile = "Mobile number must be 10 digits";
    }
    if (!formData.address.trim()) {
      newErrors.address = "Address is required";
    }
    if (!formData.pincode.trim()) {
      newErrors.pincode = "Pincode is required";
    } else if (!/^\d{6}$/.test(formData.pincode)) {
      newErrors.pincode = "Pincode must be 6 digits";
    }
    if (!formData.city.trim()) {
      newErrors.city = "City is required";
    }
    if (!formData.state.trim()) {
      newErrors.state = "State is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const generateOrderId = () => {
    return "HKM" + Date.now().toString().slice(-8);
  };

  const generateQRCode = async (orderId) => {
    try {
      const invoiceUrl = `${window.location.origin}/invoice/${orderId}`;
      const qrCodeDataURL = await QRCode.toDataURL(invoiceUrl, {
        width: 200,
        margin: 2,
        color: {
          dark: "#000000",
          light: "#FFFFFF",
        },
      });
      return qrCodeDataURL;
    } catch (error) {
      console.error("Error generating QR code:", error);
      return null;
    }
  };

  const handlePlaceOrder = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    const orderId = generateOrderId();
    const qrCodeData = await generateQRCode(orderId);

    const orderData = {
      orderId,
      invoiceId: `INV${orderId.slice(-6)}`,
      items: [...items],
      customerDetails: { ...formData },
      orderSummary: {
        subtotal: totalAmount,
        shipping: shippingCost,
        tax: taxAmount,
        total: finalTotal,
      },
      orderDate: new Date().toLocaleDateString(),
      orderTime: new Date().toLocaleTimeString(),
      status: "Pending",
      qrCode: qrCodeData,
    };

    setOrderDetails(orderData);
    setQrCode(qrCodeData);
    setShowOrderModal(true);
  };

  const handleOrderConfirm = () => {
    setShowOrderModal(false);
    setShowInvoiceModal(true);
  };

  const generatePDFInvoice = async () => {
    if (!orderDetails) return;

    setPdfGenerating(true);
    try {
      const pdf = new jsPDF("p", "mm", "a4");
      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();

      // Header
      pdf.setFontSize(20);
      pdf.setFont(undefined, "bold");
      pdf.text("HARE KRISHNA MEDICAL", 20, 25);

      pdf.setFontSize(10);
      pdf.setFont(undefined, "normal");
      pdf.text("3 Sahyog Complex, Man Sarovar circle, Amroli, 394107", 20, 35);
      pdf.text(
        "Phone: +91 76989 13354 | Email: harekrishnamedical@gmail.com",
        20,
        42,
      );

      // Invoice details
      pdf.setFontSize(16);
      pdf.setFont(undefined, "bold");
      pdf.text("INVOICE", pageWidth - 40, 25);

      pdf.setFontSize(10);
      pdf.setFont(undefined, "normal");
      pdf.text(`Invoice #: ${orderDetails.invoiceId}`, pageWidth - 80, 35);
      pdf.text(`Order #: ${orderDetails.orderId}`, pageWidth - 80, 42);
      pdf.text(
        `Date: ${orderDetails.orderDate} ${orderDetails.orderTime}`,
        pageWidth - 80,
        49,
      );

      // QR Code
      if (qrCode) {
        pdf.addImage(qrCode, "PNG", pageWidth - 60, 55, 35, 35);
        pdf.setFontSize(8);
        pdf.text("Scan for invoice", pageWidth - 52, 95);
      }

      // Customer details
      pdf.setFontSize(12);
      pdf.setFont(undefined, "bold");
      pdf.text("Bill To:", 20, 65);

      pdf.setFontSize(10);
      pdf.setFont(undefined, "normal");
      let yPos = 75;
      pdf.text(orderDetails.customerDetails.fullName, 20, yPos);
      pdf.text(orderDetails.customerDetails.email, 20, yPos + 7);
      pdf.text(orderDetails.customerDetails.mobile, 20, yPos + 14);
      pdf.text(orderDetails.customerDetails.address, 20, yPos + 21);
      pdf.text(
        `${orderDetails.customerDetails.city}, ${orderDetails.customerDetails.state} ${orderDetails.customerDetails.pincode}`,
        20,
        yPos + 28,
      );

      // Items table
      yPos = 120;
      pdf.setFontSize(12);
      pdf.setFont(undefined, "bold");
      pdf.text("Items Ordered:", 20, yPos);

      yPos += 10;
      pdf.setFontSize(10);
      pdf.setFont(undefined, "bold");
      pdf.text("Item", 20, yPos);
      pdf.text("Qty", 120, yPos);
      pdf.text("Price", 140, yPos);
      pdf.text("Total", 170, yPos);

      // Table header line
      pdf.line(20, yPos + 2, pageWidth - 20, yPos + 2);

      yPos += 10;
      pdf.setFont(undefined, "normal");

      orderDetails.items.forEach((item) => {
        pdf.text(item.name, 20, yPos);
        pdf.text(item.quantity.toString(), 120, yPos);
        pdf.text(`₹${item.price}`, 140, yPos);
        pdf.text(`₹${(item.price * item.quantity).toFixed(2)}`, 170, yPos);
        yPos += 10;
      });

      // Totals
      yPos += 10;
      pdf.line(140, yPos - 5, pageWidth - 20, yPos - 5);

      pdf.text("Subtotal:", 140, yPos);
      pdf.text(`₹${orderDetails.orderSummary.subtotal.toFixed(2)}`, 170, yPos);

      yPos += 7;
      pdf.text("Shipping:", 140, yPos);
      pdf.text(
        orderDetails.orderSummary.shipping === 0
          ? "FREE"
          : `₹${orderDetails.orderSummary.shipping.toFixed(2)}`,
        170,
        yPos,
      );

      yPos += 7;
      pdf.text("Tax (5%):", 140, yPos);
      pdf.text(`₹${orderDetails.orderSummary.tax.toFixed(2)}`, 170, yPos);

      yPos += 10;
      pdf.setFont(undefined, "bold");
      pdf.text("Total:", 140, yPos);
      pdf.text(`₹${orderDetails.orderSummary.total.toFixed(2)}`, 170, yPos);

      // Footer
      yPos = pageHeight - 30;
      pdf.setFontSize(8);
      pdf.setFont(undefined, "normal");
      pdf.text("Thank you for choosing Hare Krishna Medical!", 20, yPos);
      pdf.text(
        "For any queries, contact: harekrishnamedical@gmail.com",
        20,
        yPos + 7,
      );

      pdf.save(`Invoice_${orderDetails.orderId}.pdf`);
    } catch (error) {
      console.error("Error generating PDF:", error);
      alert("Error generating PDF. Please try again.");
    } finally {
      setPdfGenerating(false);
    }
  };

  const handleViewOnlineInvoice = () => {
    if (orderDetails) {
      const invoiceUrl = `/invoice/${orderDetails.orderId}`;
      window.open(invoiceUrl, "_blank");
    }
  };

  const handleInvoiceClose = () => {
    setShowInvoiceModal(false);
    dispatch(clearCart());
    navigate("/");
  };

  return (
    <div className="fade-in">
      {/* Breadcrumb */}
      <section className="medical-breadcrumb">
        <Container>
          <Breadcrumb>
            <Breadcrumb.Item href="/">Home</Breadcrumb.Item>
            <Breadcrumb.Item href="/cart">Cart</Breadcrumb.Item>
            <Breadcrumb.Item active>Place Order</Breadcrumb.Item>
          </Breadcrumb>
        </Container>
      </section>

      {/* Order Form */}
      <section className="section-padding">
        <Container>
          <Row>
            <Col lg={12} className="mb-4">
              <h2>Place Your Order</h2>
              <p className="text-muted">
                Please provide your details to complete the order
              </p>
            </Col>
          </Row>

          <Form onSubmit={handlePlaceOrder}>
            <Row>
              {/* Customer Details */}
              <Col lg={8} className="mb-4">
                <Card className="medical-card">
                  <Card.Header className="bg-medical-light">
                    <h5 className="mb-0">
                      <i className="bi bi-person me-2"></i>
                      Customer Details
                    </h5>
                  </Card.Header>
                  <Card.Body>
                    {!isAuthenticated && (
                      <Alert variant="info" className="mb-4">
                        <i className="bi bi-info-circle me-2"></i>
                        Please provide your details for order processing. You
                        can{" "}
                        <Link to="/register" className="alert-link">
                          create an account
                        </Link>{" "}
                        for faster checkout in future.
                      </Alert>
                    )}

                    <Row>
                      <Col md={6} className="mb-3">
                        <Form.Label>
                          Full Name <span className="text-danger">*</span>
                        </Form.Label>
                        <Form.Control
                          type="text"
                          name="fullName"
                          value={formData.fullName}
                          onChange={handleInputChange}
                          isInvalid={!!errors.fullName}
                          placeholder="Enter your full name"
                        />
                        <Form.Control.Feedback type="invalid">
                          {errors.fullName}
                        </Form.Control.Feedback>
                      </Col>
                      <Col md={6} className="mb-3">
                        <Form.Label>
                          Email Address <span className="text-danger">*</span>
                        </Form.Label>
                        <Form.Control
                          type="email"
                          name="email"
                          value={formData.email}
                          onChange={handleInputChange}
                          isInvalid={!!errors.email}
                          placeholder="Enter your email"
                        />
                        <Form.Control.Feedback type="invalid">
                          {errors.email}
                        </Form.Control.Feedback>
                      </Col>
                      <Col md={6} className="mb-3">
                        <Form.Label>
                          Mobile Number <span className="text-danger">*</span>
                        </Form.Label>
                        <Form.Control
                          type="tel"
                          name="mobile"
                          value={formData.mobile}
                          onChange={handleInputChange}
                          isInvalid={!!errors.mobile}
                          placeholder="Enter mobile number"
                        />
                        <Form.Control.Feedback type="invalid">
                          {errors.mobile}
                        </Form.Control.Feedback>
                      </Col>
                      <Col md={6} className="mb-3">
                        <Form.Label>Alternate Phone</Form.Label>
                        <Form.Control
                          type="tel"
                          name="alternatePhone"
                          value={formData.alternatePhone}
                          onChange={handleInputChange}
                          placeholder="Alternate phone (optional)"
                        />
                      </Col>
                      <Col md={12} className="mb-3">
                        <Form.Label>
                          Address <span className="text-danger">*</span>
                        </Form.Label>
                        <Form.Control
                          as="textarea"
                          rows={3}
                          name="address"
                          value={formData.address}
                          onChange={handleInputChange}
                          isInvalid={!!errors.address}
                          placeholder="Enter complete address"
                        />
                        <Form.Control.Feedback type="invalid">
                          {errors.address}
                        </Form.Control.Feedback>
                      </Col>
                      <Col md={6} className="mb-3">
                        <Form.Label>
                          Pincode <span className="text-danger">*</span>
                        </Form.Label>
                        <Form.Control
                          type="text"
                          name="pincode"
                          value={formData.pincode}
                          onChange={handleInputChange}
                          isInvalid={!!errors.pincode}
                          placeholder="Enter pincode"
                        />
                        <Form.Control.Feedback type="invalid">
                          {errors.pincode}
                        </Form.Control.Feedback>
                      </Col>
                      <Col md={6} className="mb-3">
                        <Form.Label>Landmark</Form.Label>
                        <Form.Control
                          type="text"
                          name="landmark"
                          value={formData.landmark}
                          onChange={handleInputChange}
                          placeholder="Nearby landmark (optional)"
                        />
                      </Col>
                      <Col md={6} className="mb-3">
                        <Form.Label>
                          City <span className="text-danger">*</span>
                        </Form.Label>
                        <Form.Control
                          type="text"
                          name="city"
                          value={formData.city}
                          onChange={handleInputChange}
                          isInvalid={!!errors.city}
                          placeholder="Enter city"
                        />
                        <Form.Control.Feedback type="invalid">
                          {errors.city}
                        </Form.Control.Feedback>
                      </Col>
                      <Col md={6} className="mb-3">
                        <Form.Label>
                          State <span className="text-danger">*</span>
                        </Form.Label>
                        <Form.Control
                          type="text"
                          name="state"
                          value={formData.state}
                          onChange={handleInputChange}
                          isInvalid={!!errors.state}
                          placeholder="Enter state"
                        />
                        <Form.Control.Feedback type="invalid">
                          {errors.state}
                        </Form.Control.Feedback>
                      </Col>
                    </Row>
                  </Card.Body>
                </Card>
              </Col>

              {/* Order Summary */}
              <Col lg={4}>
                <Card
                  className="medical-card sticky-top"
                  style={{ top: "100px" }}
                >
                  <Card.Header className="bg-medical-light">
                    <h5 className="mb-0">
                      <i className="bi bi-receipt me-2"></i>
                      Order Summary
                    </h5>
                  </Card.Header>
                  <Card.Body>
                    {/* Items List */}
                    <div className="order-items mb-3">
                      {items.map((item) => (
                        <div
                          key={item.id}
                          className="d-flex justify-content-between align-items-center mb-2 pb-2 border-bottom"
                        >
                          <div className="flex-grow-1">
                            <h6 className="mb-0 small">{item.name}</h6>
                            <small className="text-muted">
                              Qty: {item.quantity} × ₹{item.price}
                            </small>
                          </div>
                          <span className="fw-bold">
                            ₹{(item.price * item.quantity).toFixed(2)}
                          </span>
                        </div>
                      ))}
                    </div>

                    {/* Price Breakdown */}
                    <div className="order-totals">
                      <div className="d-flex justify-content-between mb-2">
                        <span>Subtotal</span>
                        <span>₹{totalAmount.toFixed(2)}</span>
                      </div>
                      <div className="d-flex justify-content-between mb-2">
                        <span>Shipping</span>
                        <span>
                          {shippingCost === 0 ? "FREE" : `₹${shippingCost}`}
                        </span>
                      </div>
                      <div className="d-flex justify-content-between mb-2">
                        <span>Tax (5%)</span>
                        <span>₹{taxAmount.toFixed(2)}</span>
                      </div>
                      <hr />
                      <div className="d-flex justify-content-between mb-3">
                        <strong>Total</strong>
                        <strong className="text-medical-red">
                          ₹{finalTotal.toFixed(2)}
                        </strong>
                      </div>
                    </div>

                    {/* Place Order Button */}
                    <div className="d-grid gap-2">
                      <Button
                        type="submit"
                        className="btn-medical-primary"
                        size="lg"
                      >
                        <i className="bi bi-check-circle me-2"></i>
                        Place Order
                      </Button>
                      <Button
                        as={Link}
                        to="/cart"
                        variant="outline-secondary"
                        className="btn-medical-outline"
                      >
                        <i className="bi bi-arrow-left me-2"></i>
                        Back to Cart
                      </Button>
                    </div>

                    <div className="mt-3 text-center">
                      <small className="text-muted">
                        <i className="bi bi-shield-check me-1"></i>
                        Your order is secure and protected
                      </small>
                    </div>
                  </Card.Body>
                </Card>
              </Col>
            </Row>
          </Form>
        </Container>
      </section>

      {/* Order Confirmation Modal */}
      <Modal
        show={showOrderModal}
        onHide={() => {}}
        centered
        backdrop="static"
        keyboard={false}
      >
        <Modal.Header>
          <Modal.Title>Order Inquiry Sent!</Modal.Title>
        </Modal.Header>
        <Modal.Body className="text-center">
          <i className="bi bi-check-circle-fill text-success display-1 mb-3"></i>
          <h5>Thank You for Your Order!</h5>
          <p className="text-muted">
            Your order inquiry has been sent to our medical store. We will
            contact you very soon to confirm your order and arrange delivery.
          </p>
          <div className="alert alert-info">
            <strong>Order ID:</strong> {orderDetails?.orderId}
          </div>
        </Modal.Body>
        <Modal.Footer className="justify-content-center">
          <Button className="btn-medical-primary" onClick={handleOrderConfirm}>
            OK
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Invoice Modal */}
      <Modal
        show={showInvoiceModal}
        onHide={() => {}}
        size="lg"
        centered
        backdrop="static"
        keyboard={false}
      >
        <Modal.Header>
          <Modal.Title>
            <i className="bi bi-receipt me-2"></i>
            Order Invoice Generated
          </Modal.Title>
        </Modal.Header>
        <Modal.Body className="text-center">
          <div className="mb-4">
            <i className="bi bi-file-pdf display-1 text-medical-red mb-3"></i>
            <h5>Invoice Ready for Download</h5>
            <p className="text-muted">
              Your invoice has been generated successfully. You can download it
              as a PDF or view it online.
            </p>

            {qrCode && (
              <div className="my-4">
                <img
                  src={qrCode}
                  alt="QR Code"
                  style={{ width: "150px", height: "150px" }}
                  className="border rounded"
                />
                <p className="text-muted mt-2">
                  <small>
                    <i className="bi bi-qr-code me-1"></i>
                    Scan this QR code to view invoice online
                  </small>
                </p>
              </div>
            )}

            <div className="alert alert-info">
              <strong>Invoice ID:</strong> {orderDetails?.invoiceId}
              <br />
              <strong>Order ID:</strong> {orderDetails?.orderId}
            </div>
          </div>
        </Modal.Body>
        <Modal.Footer className="justify-content-center">
          <div className="d-flex gap-2 flex-wrap justify-content-center">
            <Button
              variant="outline-primary"
              onClick={generatePDFInvoice}
              disabled={pdfGenerating}
              className="btn-medical-outline"
            >
              {pdfGenerating ? (
                <>
                  <span className="spinner-border spinner-border-sm me-2"></span>
                  Generating...
                </>
              ) : (
                <>
                  <i className="bi bi-download me-2"></i>
                  Download PDF
                </>
              )}
            </Button>
            <Button
              variant="outline-info"
              onClick={handleViewOnlineInvoice}
              className="btn-medical-outline"
            >
              <i className="bi bi-eye me-2"></i>
              View Online
            </Button>
            <Button
              className="btn-medical-primary"
              onClick={handleInvoiceClose}
            >
              <i className="bi bi-house me-2"></i>
              Continue Shopping
            </Button>
          </div>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default Order;
