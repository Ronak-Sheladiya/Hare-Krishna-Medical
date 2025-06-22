import React, { useState } from "react";
import {
  Container,
  Row,
  Col,
  Breadcrumb,
  Card,
  Button,
  Table,
  Alert,
  Badge,
  Modal,
} from "react-bootstrap";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  removeFromCart,
  updateQuantity,
  clearCart,
} from "../store/slices/cartSlice.js";

const Cart = () => {
  const dispatch = useDispatch();
  const { items, totalItems, totalAmount } = useSelector((state) => state.cart);
  const [showClearModal, setShowClearModal] = useState(false);

  const handleQuantityChange = (id, newQuantity) => {
    if (newQuantity <= 0) {
      dispatch(removeFromCart(id));
    } else {
      dispatch(updateQuantity({ id, quantity: newQuantity }));
    }
  };

  const handleRemoveItem = (id) => {
    dispatch(removeFromCart(id));
  };

  const handleClearCart = () => {
    dispatch(clearCart());
    setShowClearModal(false);
  };

  const calculateItemTotal = (price, quantity) => {
    return (price * quantity).toFixed(2);
  };

  const shippingCost = totalAmount > 500 ? 0 : 50;
  const taxRate = 0.05; // 5% tax
  const taxAmount = totalAmount * taxRate;
  const finalTotal = totalAmount + shippingCost + taxAmount;

  if (items.length === 0) {
    return (
      <div className="fade-in">
        <section className="section-padding">
          <Container>
            <Row className="justify-content-center">
              <Col lg={8} className="text-center">
                <div className="medical-card p-5">
                  <i className="bi bi-cart-x display-1 text-muted mb-4"></i>
                  <h3 className="mb-3">Your Cart is Empty</h3>
                  <p className="text-muted mb-4">
                    Looks like you haven't added any products to your cart yet.
                    Start shopping and add some medical products to your cart.
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

  return (
    <div className="fade-in">
      {/* Cart Content */}
      <section className="section-padding" style={{ paddingTop: "2rem" }}>
        <Container>
          <Row>
            {/* Cart Items */}
            <Col lg={8} className="mb-4">
              <Card className="medical-card">
                <Card.Header className="bg-medical-light d-flex justify-content-between align-items-center">
                  <div>
                    <h5 className="mb-0">
                      <i className="bi bi-cart3 me-2"></i>
                      Shopping Cart ({totalItems} items)
                    </h5>
                  </div>
                  <Button
                    variant="outline-danger"
                    size="sm"
                    onClick={() => setShowClearModal(true)}
                  >
                    <i className="bi bi-trash me-1"></i>
                    Clear Cart
                  </Button>
                </Card.Header>
                <Card.Body className="p-0">
                  <div className="table-responsive">
                    <Table className="mb-0">
                      <thead className="table-light">
                        <tr>
                          <th>Product</th>
                          <th>Price</th>
                          <th>Quantity</th>
                          <th>Total</th>
                          <th>Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        {items.map((item) => (
                          <tr key={item.id}>
                            <td>
                              <div className="d-flex align-items-center">
                                <img
                                  src={
                                    item.image ||
                                    "https://via.placeholder.com/60x60"
                                  }
                                  alt={item.name}
                                  className="me-3"
                                  style={{
                                    width: "60px",
                                    height: "60px",
                                    objectFit: "cover",
                                    borderRadius: "8px",
                                  }}
                                />
                                <div>
                                  <h6 className="mb-1">{item.name}</h6>
                                  <small className="text-muted">
                                    {item.company}
                                  </small>
                                </div>
                              </div>
                            </td>
                            <td>
                              <span className="fw-bold">₹{item.price}</span>
                            </td>
                            <td>
                              <div className="quantity-controls d-flex align-items-center">
                                <Button
                                  variant="outline-secondary"
                                  size="sm"
                                  onClick={() =>
                                    handleQuantityChange(
                                      item.id,
                                      item.quantity - 1,
                                    )
                                  }
                                >
                                  <i className="bi bi-dash"></i>
                                </Button>
                                <span className="mx-3 fw-bold">
                                  {item.quantity}
                                </span>
                                <Button
                                  variant="outline-secondary"
                                  size="sm"
                                  onClick={() =>
                                    handleQuantityChange(
                                      item.id,
                                      item.quantity + 1,
                                    )
                                  }
                                >
                                  <i className="bi bi-plus"></i>
                                </Button>
                              </div>
                            </td>
                            <td>
                              <span className="fw-bold text-medical-red">
                                ₹{calculateItemTotal(item.price, item.quantity)}
                              </span>
                            </td>
                            <td>
                              <Button
                                variant="outline-danger"
                                size="sm"
                                onClick={() => handleRemoveItem(item.id)}
                              >
                                <i className="bi bi-trash"></i>
                              </Button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </Table>
                  </div>
                </Card.Body>
              </Card>

              {/* Continue Shopping */}
              <div className="mt-3">
                <Button
                  as={Link}
                  to="/products"
                  variant="outline-primary"
                  className="btn-medical-outline"
                >
                  <i className="bi bi-arrow-left me-2"></i>
                  Continue Shopping
                </Button>
              </div>
            </Col>

            {/* Order Summary - Fixed positioning */}
            <Col lg={4}>
              <div style={{ position: "sticky", top: "120px", zIndex: 10 }}>
                <Card className="medical-card">
                  <Card.Header className="bg-medical-light">
                    <h5 className="mb-0">
                      <i className="bi bi-receipt me-2"></i>
                      Order Summary
                    </h5>
                  </Card.Header>
                  <Card.Body>
                    <div className="order-summary">
                      <div className="d-flex justify-content-between mb-2">
                        <span>Subtotal ({totalItems} items)</span>
                        <span>₹{totalAmount.toFixed(2)}</span>
                      </div>

                      <div className="d-flex justify-content-between mb-2">
                        <span>
                          Shipping{" "}
                          {totalAmount > 500 && (
                            <Badge bg="success" className="ms-1 small">
                              FREE
                            </Badge>
                          )}
                        </span>
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

                      {totalAmount <= 500 && (
                        <Alert variant="info" className="small mb-3">
                          <i className="bi bi-info-circle me-1"></i>
                          Add ₹{(500 - totalAmount).toFixed(2)} more for free
                          shipping!
                        </Alert>
                      )}

                      <div className="d-grid">
                        <Button
                          as={Link}
                          to="/order"
                          className="btn-medical-primary"
                          size="lg"
                        >
                          <i className="bi bi-credit-card me-2"></i>
                          Proceed to Checkout
                        </Button>
                      </div>
                    </div>
                  </Card.Body>
                </Card>

                {/* Shipping Information */}
                <Card className="medical-card mt-3">
                  <Card.Body>
                    <h6 className="mb-3">
                      <i className="bi bi-truck me-2"></i>
                      Shipping Information
                    </h6>
                    <div className="shipping-info">
                      <div className="d-flex align-items-center mb-2">
                        <i className="bi bi-check-circle text-success me-2"></i>
                        <small>Free shipping on orders above ₹500</small>
                      </div>
                      <div className="d-flex align-items-center mb-2">
                        <i className="bi bi-clock text-primary me-2"></i>
                        <small>Delivery within 2-3 business days</small>
                      </div>
                      <div className="d-flex align-items-center">
                        <i className="bi bi-shield-check text-info me-2"></i>
                        <small>Secure packaging guaranteed</small>
                      </div>
                    </div>
                  </Card.Body>
                </Card>
              </div>
            </Col>
          </Row>
        </Container>
      </section>

      {/* Clear Cart Modal */}
      <Modal
        show={showClearModal}
        onHide={() => setShowClearModal(false)}
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>Clear Cart</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="text-center">
            <i className="bi bi-exclamation-triangle display-1 text-warning mb-3"></i>
            <h5>Are you sure?</h5>
            <p className="text-muted">
              This will remove all items from your cart. This action cannot be
              undone.
            </p>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowClearModal(false)}>
            Cancel
          </Button>
          <Button variant="danger" onClick={handleClearCart}>
            <i className="bi bi-trash me-2"></i>
            Clear Cart
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default Cart;
