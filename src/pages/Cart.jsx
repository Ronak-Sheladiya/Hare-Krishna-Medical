import React, { useState } from "react";
import {
  Container,
  Row,
  Col,
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

  const shippingCost = 0; // Free shipping for all orders
  const taxAmount = 0; // Tax included in product price
  const finalTotal = totalAmount + shippingCost;

  if (items.length === 0) {
    return (
      <div className="fade-in">
        {/* Hero Section - Matching About Us */}
        <section
          style={{
            background: "linear-gradient(135deg, #e63946 0%, #dc3545 100%)",
            paddingTop: "80px",
            paddingBottom: "80px",
            color: "white",
          }}
        >
          <Container>
            <Row className="text-center">
              <Col lg={12}>
                <h1
                  style={{
                    fontSize: "3rem",
                    fontWeight: "800",
                    marginBottom: "20px",
                    textShadow: "2px 2px 4px rgba(0,0,0,0.3)",
                  }}
                >
                  Shopping Cart
                </h1>
                <p
                  style={{
                    fontSize: "1.2rem",
                    opacity: "0.9",
                    maxWidth: "600px",
                    margin: "0 auto",
                  }}
                >
                  Your cart is currently empty
                </p>
              </Col>
            </Row>
          </Container>
        </section>

        {/* Empty Cart Content */}
        <section
          style={{
            background: "#f8f9fa",
            paddingTop: "80px",
            paddingBottom: "80px",
          }}
        >
          <Container>
            <Row className="justify-content-center">
              <Col lg={8} className="text-center">
                <Card
                  style={{
                    border: "2px solid #f8f9fa",
                    borderRadius: "16px",
                    padding: "50px",
                    textAlign: "center",
                    boxShadow: "0 8px 25px rgba(0,0,0,0.05)",
                  }}
                >
                  <i
                    className="bi bi-cart-x display-1 mb-4"
                    style={{ color: "#e9ecef" }}
                  ></i>
                  <h3 style={{ color: "#333333", marginBottom: "20px" }}>
                    Your Cart is Empty
                  </h3>
                  <p style={{ color: "#6c757d", marginBottom: "30px" }}>
                    Looks like you haven't added any products to your cart yet.
                    Start shopping and add some medical products to your cart.
                  </p>
                  <Button
                    as={Link}
                    to="/products"
                    size="lg"
                    style={{
                      background: "#e63946",
                      border: "none",
                      borderRadius: "8px",
                      padding: "14px 28px",
                      fontSize: "16px",
                      fontWeight: "600",
                    }}
                  >
                    <i className="bi bi-grid3x3-gap me-2"></i>
                    Continue Shopping
                  </Button>
                </Card>
              </Col>
            </Row>
          </Container>
        </section>
      </div>
    );
  }

  return (
    <div className="fade-in">
      {/* Hero Section - Matching About Us */}
      <section
        style={{
          background: "linear-gradient(135deg, #e63946 0%, #dc3545 100%)",
          paddingTop: "80px",
          paddingBottom: "80px",
          color: "white",
        }}
      >
        <Container>
          <Row className="text-center">
            <Col lg={12}>
              <h1
                style={{
                  fontSize: "3rem",
                  fontWeight: "800",
                  marginBottom: "20px",
                  textShadow: "2px 2px 4px rgba(0,0,0,0.3)",
                }}
              >
                Shopping Cart
              </h1>
              <p
                style={{
                  fontSize: "1.2rem",
                  opacity: "0.9",
                  maxWidth: "600px",
                  margin: "0 auto",
                }}
              >
                Review your selected medical products
              </p>
            </Col>
          </Row>
        </Container>
      </section>

      {/* Cart Content */}
      <section
        style={{
          background: "#f8f9fa",
          paddingTop: "80px",
          paddingBottom: "80px",
        }}
      >
        <Container>
          <Row>
            {/* Cart Items */}
            <Col lg={8} className="mb-4">
              <Card
                style={{
                  border: "2px solid #f8f9fa",
                  borderRadius: "16px",
                  boxShadow: "0 8px 25px rgba(0,0,0,0.05)",
                }}
              >
                <Card.Header
                  style={{
                    background: "linear-gradient(135deg, #e63946, #dc3545)",
                    color: "white",
                    borderRadius: "16px 16px 0 0",
                    padding: "20px 30px",
                  }}
                >
                  <div className="d-flex justify-content-between align-items-center">
                    <h5 style={{ margin: 0, fontWeight: "700" }}>
                      <i className="bi bi-cart3 me-2"></i>
                      Shopping Cart ({totalItems} items)
                    </h5>
                    <Button
                      variant="outline-light"
                      size="sm"
                      onClick={() => setShowClearModal(true)}
                      style={{
                        borderColor: "white",
                        color: "white",
                        borderRadius: "8px",
                      }}
                    >
                      <i className="bi bi-trash me-1"></i>
                      Clear Cart
                    </Button>
                  </div>
                </Card.Header>
                <Card.Body style={{ padding: 0 }}>
                  <div className="table-responsive">
                    <Table className="mb-0">
                      <thead style={{ background: "#f8f9fa" }}>
                        <tr>
                          <th style={{ padding: "20px", fontWeight: "600" }}>
                            Product
                          </th>
                          <th style={{ padding: "20px", fontWeight: "600" }}>
                            Price
                          </th>
                          <th style={{ padding: "20px", fontWeight: "600" }}>
                            Quantity
                          </th>
                          <th style={{ padding: "20px", fontWeight: "600" }}>
                            Total
                          </th>
                          <th style={{ padding: "20px", fontWeight: "600" }}>
                            Action
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {items.map((item) => (
                          <tr
                            key={item.id}
                            style={{ borderBottom: "1px solid #f1f5f9" }}
                          >
                            <td style={{ padding: "20px" }}>
                              <div className="d-flex align-items-center">
                                <img
                                  src={item.images?.[0] || "/placeholder.svg"}
                                  alt={item.name}
                                  style={{
                                    width: "60px",
                                    height: "60px",
                                    objectFit: "cover",
                                    borderRadius: "8px",
                                    marginRight: "15px",
                                  }}
                                />
                                <div>
                                  <h6
                                    style={{
                                      margin: 0,
                                      fontWeight: "600",
                                      color: "#333333",
                                    }}
                                  >
                                    {item.name}
                                  </h6>
                                  <small style={{ color: "#6c757d" }}>
                                    {item.company}
                                  </small>
                                </div>
                              </div>
                            </td>
                            <td style={{ padding: "20px" }}>
                              <span
                                style={{
                                  fontWeight: "600",
                                  color: "#e63946",
                                }}
                              >
                                ₹{item.price.toFixed(2)}
                              </span>
                            </td>
                            <td style={{ padding: "20px" }}>
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
                                  style={{
                                    borderRadius: "8px 0 0 8px",
                                    borderColor: "#e63946",
                                    color: "#e63946",
                                  }}
                                >
                                  <i className="bi bi-dash"></i>
                                </Button>
                                <span
                                  style={{
                                    padding: "8px 16px",
                                    border: "1px solid #e63946",
                                    borderLeft: "none",
                                    borderRight: "none",
                                    minWidth: "50px",
                                    textAlign: "center",
                                    fontWeight: "600",
                                  }}
                                >
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
                                  style={{
                                    borderRadius: "0 8px 8px 0",
                                    borderColor: "#e63946",
                                    color: "#e63946",
                                  }}
                                >
                                  <i className="bi bi-plus"></i>
                                </Button>
                              </div>
                            </td>
                            <td style={{ padding: "20px" }}>
                              <span
                                style={{
                                  fontWeight: "700",
                                  color: "#333333",
                                  fontSize: "16px",
                                }}
                              >
                                ₹{calculateItemTotal(item.price, item.quantity)}
                              </span>
                            </td>
                            <td style={{ padding: "20px" }}>
                              <Button
                                variant="outline-danger"
                                size="sm"
                                onClick={() => handleRemoveItem(item.id)}
                                style={{
                                  borderColor: "#dc3545",
                                  color: "#dc3545",
                                  borderRadius: "8px",
                                }}
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
            </Col>

            {/* Order Summary */}
            <Col lg={4}>
              <Card
                style={{
                  border: "2px solid #f8f9fa",
                  borderRadius: "16px",
                  boxShadow: "0 8px 25px rgba(0,0,0,0.05)",
                  position: "sticky",
                  top: "20px",
                }}
              >
                <Card.Header
                  style={{
                    background: "linear-gradient(135deg, #343a40, #495057)",
                    color: "white",
                    borderRadius: "16px 16px 0 0",
                    padding: "20px 30px",
                  }}
                >
                  <h5 style={{ margin: 0, fontWeight: "700" }}>
                    <i className="bi bi-receipt me-2"></i>
                    Order Summary
                  </h5>
                </Card.Header>
                <Card.Body style={{ padding: "30px" }}>
                  <div className="d-flex justify-content-between mb-3">
                    <span style={{ color: "#6c757d" }}>Subtotal:</span>
                    <span style={{ fontWeight: "600" }}>
                      ₹{totalAmount.toFixed(2)}
                    </span>
                  </div>
                  <div className="d-flex justify-content-between mb-3">
                    <span style={{ color: "#6c757d" }}>Shipping:</span>
                    <span style={{ color: "#38a169", fontWeight: "600" }}>
                      FREE
                    </span>
                  </div>
                  <div className="d-flex justify-content-between mb-3">
                    <span style={{ color: "#6c757d" }}>Tax:</span>
                    <span style={{ color: "#3182ce", fontWeight: "600" }}>
                      Included
                    </span>
                  </div>
                  <hr style={{ borderColor: "#e2e8f0", margin: "20px 0" }} />
                  <div className="d-flex justify-content-between mb-4">
                    <span
                      style={{
                        fontSize: "18px",
                        fontWeight: "700",
                        color: "#333333",
                      }}
                    >
                      Total:
                    </span>
                    <span
                      style={{
                        fontSize: "20px",
                        fontWeight: "800",
                        color: "#e63946",
                      }}
                    >
                      ₹{finalTotal.toFixed(2)}
                    </span>
                  </div>

                  <div className="d-grid gap-3">
                    <Button
                      as={Link}
                      to="/order"
                      size="lg"
                      style={{
                        background: "#e63946",
                        border: "none",
                        borderRadius: "8px",
                        padding: "14px 28px",
                        fontSize: "16px",
                        fontWeight: "600",
                      }}
                    >
                      <i className="bi bi-credit-card me-2"></i>
                      Proceed to Checkout
                    </Button>
                    <Button
                      as={Link}
                      to="/products"
                      variant="outline-secondary"
                      size="lg"
                      style={{
                        borderColor: "#e63946",
                        color: "#e63946",
                        borderRadius: "8px",
                        padding: "14px 28px",
                        fontSize: "16px",
                        fontWeight: "600",
                      }}
                    >
                      <i className="bi bi-arrow-left me-2"></i>
                      Continue Shopping
                    </Button>
                  </div>

                  <div
                    style={{
                      marginTop: "20px",
                      padding: "15px",
                      background: "#f8f9fa",
                      borderRadius: "8px",
                      textAlign: "center",
                    }}
                  >
                    <small style={{ color: "#6c757d" }}>
                      <i className="bi bi-shield-check me-1"></i>
                      Secure checkout guaranteed
                    </small>
                  </div>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Container>
      </section>

      {/* Clear Cart Modal */}
      <Modal show={showClearModal} onHide={() => setShowClearModal(false)}>
        <Modal.Header
          closeButton
          style={{
            background: "linear-gradient(135deg, #e63946, #dc3545)",
            color: "white",
          }}
        >
          <Modal.Title>
            <i className="bi bi-exclamation-triangle me-2"></i>
            Clear Cart
          </Modal.Title>
        </Modal.Header>
        <Modal.Body style={{ padding: "30px" }}>
          <p style={{ marginBottom: "20px", color: "#495057" }}>
            Are you sure you want to remove all items from your cart? This
            action cannot be undone.
          </p>
          <Alert variant="warning" style={{ fontSize: "14px" }}>
            <i className="bi bi-info-circle me-2"></i>
            All {totalItems} items will be removed from your cart.
          </Alert>
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant="outline-secondary"
            onClick={() => setShowClearModal(false)}
          >
            Cancel
          </Button>
          <Button
            style={{ background: "#e63946", border: "none" }}
            onClick={handleClearCart}
          >
            <i className="bi bi-trash me-2"></i>
            Clear Cart
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default Cart;
