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
        <section className="medical-breadcrumb">
          <Container>
            <Breadcrumb>
              <Breadcrumb.Item href="/">Home</Breadcrumb.Item>
              <Breadcrumb.Item active>Shopping Cart</Breadcrumb.Item>
            </Breadcrumb>
          </Container>
        </section>

      <section className="section-padding" style={{ paddingTop: "2rem" }}>
        <Container>
          <Row>
            {/* Cart Items */}
            <Col lg={8} className="mb-4">
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
      {/* Breadcrumb */}
      <section className="medical-breadcrumb">
        <Container>
          <Breadcrumb>
            <Breadcrumb.Item href="/">Home</Breadcrumb.Item>
            <Breadcrumb.Item active>Shopping Cart</Breadcrumb.Item>
          </Breadcrumb>
        </Container>
      </section>

      {/* Cart Content */}
      <section className="section-padding">
        <Container>
          <Row>
            <Col lg={12} className="mb-4">
              <div className="d-flex justify-content-between align-items-center">
                <h2>
                  Shopping Cart{" "}
                  <Badge bg="secondary" className="ms-2">
                    {totalItems} {totalItems === 1 ? "item" : "items"}
                  </Badge>
                </h2>
                <Button
                  variant="outline-danger"
                  size="sm"
                  onClick={() => setShowClearModal(true)}
                  disabled={items.length === 0}
                >
                  <i className="bi bi-trash me-2"></i>
                  Clear Cart
                </Button>
              </div>
            </Col>
          </Row>

          <Row>
            {/* Cart Items */}
            <Col lg={8} className="mb-4">
              <Card className="medical-card">
                <Card.Header className="bg-medical-light">
                  <h5 className="mb-0">
                    <i className="bi bi-bag me-2"></i>
                    Cart Items
                  </h5>
                </Card.Header>
                <Card.Body className="p-0">
                  <div className="table-responsive">
                    <Table className="mb-0">
                      <thead className="table-light">
                        <tr>
                          <th style={{ width: "50%" }}>Product</th>
                          <th style={{ width: "15%" }}>Price</th>
                          <th style={{ width: "20%" }}>Quantity</th>
                          <th style={{ width: "10%" }}>Total</th>
                          <th style={{ width: "5%" }}></th>
                        </tr>
                      </thead>
                      <tbody>
                        {items.map((item) => (
                          <tr key={item.id} className="align-middle">
                            <td>
                              <div className="d-flex align-items-center">
                                <img
                                  src={item.images?.[0] || "/placeholder.svg"}
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
                                    by {item.company}
                                  </small>
                                  <br />
                                  <Badge bg="secondary" className="small">
                                    {item.category}
                                  </Badge>
                                </div>
                              </div>
                            </td>
                            <td>
                              <span className="fw-bold">₹{item.price}</span>
                            </td>
                            <td>
                              <div className="d-flex align-items-center">
                                <Button
                                  variant="outline-secondary"
                                  size="sm"
                                  onClick={() =>
                                    handleQuantityChange(
                                      item.id,
                                      item.quantity - 1,
                                    )
                                  }
                                  disabled={item.quantity <= 1}
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

                    <div className="d-grid gap-2">
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

                    <div className="mt-3 text-center">
                      <small className="text-muted">
                        <i className="bi bi-shield-check me-1"></i>
                        Secure checkout guaranteed
                      </small>
                    </div>
                  </div>
                </Card.Body>
              </Card>

              {/* Delivery Info */}
              <Card className="medical-card mt-3">
                <Card.Body>
                  <h6 className="mb-3">
                    <i className="bi bi-truck me-2"></i>
                    Delivery Information
                  </h6>
                  <ul className="list-unstyled small">
                    <li className="mb-2">
                      <i className="bi bi-check-circle text-medical-green me-2"></i>
                      Free delivery on orders above ₹500
                    </li>
                    <li className="mb-2">
                      <i className="bi bi-check-circle text-medical-green me-2"></i>
                      Standard delivery: 2-3 business days
                    </li>
                    <li className="mb-2">
                      <i className="bi bi-check-circle text-medical-green me-2"></i>
                      Easy returns within 7 days
                    </li>
                  </ul>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Container>
      </section>

      {/* Clear Cart Confirmation Modal */}
      <Modal
        show={showClearModal}
        onHide={() => setShowClearModal(false)}
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>Clear Cart</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Are you sure you want to remove all items from your cart? This action
          cannot be undone.
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant="secondary"
            onClick={() => setShowClearModal(false)}
            className="btn-medical-outline"
          >
            Cancel
          </Button>
          <Button
            variant="danger"
            onClick={handleClearCart}
            className="btn-medical-primary"
          >
            Clear Cart
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default Cart;