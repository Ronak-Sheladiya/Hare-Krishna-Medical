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

  const handlePlaceOrder = (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    const orderId = generateOrderId();
    const orderData = {
      orderId,
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
    };

    setOrderDetails(orderData);
    setShowOrderModal(true);
  };

  const handleOrderConfirm = () => {
    setShowOrderModal(false);
    setShowInvoiceModal(true);
  };

  const handleDownloadInvoice = () => {
    // In a real app, this would generate and download a PDF
    const invoiceContent = generateInvoiceContent();
    const blob = new Blob([invoiceContent], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `Invoice_${orderDetails.orderId}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const generateInvoiceContent = () => {
    return `
HARE KRISHNA MEDICAL
Invoice #${orderDetails.orderId}
Date: ${orderDetails.orderDate} ${orderDetails.orderTime}

CUSTOMER DETAILS:
Name: ${orderDetails.customerDetails.fullName}
Email: ${orderDetails.customerDetails.email}
Mobile: ${orderDetails.customerDetails.mobile}
Address: ${orderDetails.customerDetails.address}
City: ${orderDetails.customerDetails.city}, ${orderDetails.customerDetails.state}
Pincode: ${orderDetails.customerDetails.pincode}

ITEMS ORDERED:
${orderDetails.items
  .map(
    (item) =>
      `${item.name} - Qty: ${item.quantity} - Price: ₹${item.price} - Total: ₹${(item.price * item.quantity).toFixed(2)}`,
  )
  .join("\n")}

ORDER SUMMARY:
Subtotal: ₹${orderDetails.orderSummary.subtotal.toFixed(2)}
Shipping: ₹${orderDetails.orderSummary.shipping.toFixed(2)}
Tax (5%): ₹${orderDetails.orderSummary.tax.toFixed(2)}
TOTAL: ₹${orderDetails.orderSummary.total.toFixed(2)}

Thank you for choosing Hare Krishna Medical!
Contact: harekrishnamedical@gmail.com | +91 76989 13354
    `;
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
          <Modal.Title>Order Invoice</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="invoice-content">
            <div className="text-center mb-4">
              <h4>HARE KRISHNA MEDICAL</h4>
              <p className="text-muted">
                3 Sahyog Complex, Man Sarovar circle, Amroli, 394107
              </p>
              <p className="text-muted">
                Email: harekrishnamedical@gmail.com | Phone: +91 76989 13354
              </p>
            </div>

            <Row className="mb-4">
              <Col md={6}>
                <h6>Invoice Details:</h6>
                <p className="mb-1">
                  <strong>Invoice #:</strong> {orderDetails?.orderId}
                </p>
                <p className="mb-1">
                  <strong>Date:</strong> {orderDetails?.orderDate}{" "}
                  {orderDetails?.orderTime}
                </p>
                <p className="mb-1">
                  <strong>Status:</strong>{" "}
                  <Badge bg="warning">{orderDetails?.status}</Badge>
                </p>
              </Col>
              <Col md={6}>
                <h6>Customer Details:</h6>
                <p className="mb-1">{orderDetails?.customerDetails.fullName}</p>
                <p className="mb-1">{orderDetails?.customerDetails.email}</p>
                <p className="mb-1">{orderDetails?.customerDetails.mobile}</p>
                <p className="mb-1">{orderDetails?.customerDetails.address}</p>
                <p className="mb-1">
                  {orderDetails?.customerDetails.city},{" "}
                  {orderDetails?.customerDetails.state}{" "}
                  {orderDetails?.customerDetails.pincode}
                </p>
              </Col>
            </Row>

            <Table bordered className="mb-4">
              <thead className="table-light">
                <tr>
                  <th>Item</th>
                  <th>Qty</th>
                  <th>Price</th>
                  <th>Total</th>
                </tr>
              </thead>
              <tbody>
                {orderDetails?.items.map((item) => (
                  <tr key={item.id}>
                    <td>{item.name}</td>
                    <td>{item.quantity}</td>
                    <td>₹{item.price}</td>
                    <td>₹{(item.price * item.quantity).toFixed(2)}</td>
                  </tr>
                ))}
                <tr>
                  <td colSpan="3" className="text-end">
                    <strong>Subtotal:</strong>
                  </td>
                  <td>
                    <strong>
                      ₹{orderDetails?.orderSummary.subtotal.toFixed(2)}
                    </strong>
                  </td>
                </tr>
                <tr>
                  <td colSpan="3" className="text-end">
                    Shipping:
                  </td>
                  <td>₹{orderDetails?.orderSummary.shipping.toFixed(2)}</td>
                </tr>
                <tr>
                  <td colSpan="3" className="text-end">
                    Tax (5%):
                  </td>
                  <td>₹{orderDetails?.orderSummary.tax.toFixed(2)}</td>
                </tr>
                <tr className="table-success">
                  <td colSpan="3" className="text-end">
                    <strong>Total:</strong>
                  </td>
                  <td>
                    <strong>
                      ₹{orderDetails?.orderSummary.total.toFixed(2)}
                    </strong>
                  </td>
                </tr>
              </tbody>
            </Table>

            <div className="text-center">
              <p className="text-muted">
                Thank you for choosing Hare Krishna Medical!
              </p>
            </div>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant="outline-primary"
            onClick={handleDownloadInvoice}
            className="btn-medical-outline"
          >
            <i className="bi bi-download me-2"></i>
            Download Invoice
          </Button>
          <Button className="btn-medical-primary" onClick={handleInvoiceClose}>
            Continue Shopping
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default Order;
