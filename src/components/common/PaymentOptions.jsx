import React, { useState } from "react";
import { Card, Form, Row, Col, Alert, Badge } from "react-bootstrap";

const PaymentOptions = ({
  onPaymentMethodChange,
  selectedMethod = "cod",
  compact = false,
}) => {
  const [paymentMethod, setPaymentMethod] = useState(selectedMethod);

  const handleMethodChange = (method) => {
    setPaymentMethod(method);
    if (onPaymentMethodChange) {
      onPaymentMethodChange(method);
    }
  };

  const paymentMethods = [
    {
      id: "cod",
      name: "Cash on Delivery",
      description: "Pay on delivery",
      icon: "bi-cash-coin",
      badge: "Popular",
      badgeColor: "success",
      fee: 0,
      note: "Payment due upon delivery.",
    },
    {
      id: "online",
      name: "Online Payment",
      description: "UPI, Cards, Net Banking",
      icon: "bi-credit-card",
      badge: "Instant",
      badgeColor: "primary",
      fee: 0,
      note: "Secure Razorpay gateway.",
    },
    {
      id: "upi",
      name: "UPI Payment",
      description: "GPay, PhonePe, Paytm",
      icon: "bi-phone",
      badge: "Quick",
      badgeColor: "info",
      fee: 0,
      note: "Instant confirmation.",
    },
  ];

  if (compact) {
    return (
      <div>
        <h6 className="mb-3">
          <i className="bi bi-credit-card-2-front me-2"></i>
          Payment Method
        </h6>

        {paymentMethods.map((method) => (
          <div key={method.id} className="form-check mb-2">
            <input
              className="form-check-input"
              type="radio"
              name="paymentMethod"
              id={method.id}
              value={method.id}
              checked={paymentMethod === method.id}
              onChange={() => handleMethodChange(method.id)}
            />
            <label className="form-check-label" htmlFor={method.id}>
              <i className={`${method.icon} me-2`}></i>
              {method.name}
              {method.badge && (
                <Badge
                  bg={method.badgeColor}
                  className="ms-2"
                  style={{ fontSize: "9px" }}
                >
                  {method.badge}
                </Badge>
              )}
            </label>
          </div>
        ))}

        {paymentMethod === "cod" && (
          <div className="alert alert-warning mt-2 p-2">
            <small>
              <i className="bi bi-info-circle me-1"></i>
              Payment due on delivery. Order will be marked as "Unpaid" until
              payment is received.
            </small>
          </div>
        )}
      </div>
    );
  }

  return (
    <div>
      <h5 className="mb-3">
        <i className="bi bi-credit-card-2-front me-2"></i>
        Payment Method
      </h5>

      {paymentMethods.map((method) => (
        <Card
          key={method.id}
          className={`mb-3 payment-option ${
            paymentMethod === method.id ? "selected" : ""
          }`}
          style={{ cursor: "pointer" }}
          onClick={() => handleMethodChange(method.id)}
        >
          <Card.Body>
            <Row>
              <Col md={1} className="text-center">
                <Form.Check
                  type="radio"
                  name="paymentMethod"
                  value={method.id}
                  checked={paymentMethod === method.id}
                  onChange={() => handleMethodChange(method.id)}
                />
              </Col>
              <Col md={11}>
                <div className="d-flex justify-content-between align-items-start mb-2">
                  <div className="d-flex align-items-center">
                    <i
                      className={`${method.icon} fs-4 text-medical-blue me-3`}
                    ></i>
                    <div>
                      <h6 className="mb-0 d-flex align-items-center">
                        {method.name}
                        {method.badge && (
                          <Badge
                            bg={method.badgeColor}
                            className="ms-2"
                            style={{ fontSize: "10px" }}
                          >
                            {method.badge}
                          </Badge>
                        )}
                      </h6>
                      <small className="text-muted">{method.description}</small>
                    </div>
                  </div>
                  <div className="text-end">
                    {method.fee > 0 ? (
                      <span className="text-danger">+₹{method.fee}</span>
                    ) : (
                      <span className="text-success">Free</span>
                    )}
                  </div>
                </div>
                <div className="payment-note">
                  <small className="text-muted">
                    <i className="bi bi-info-circle me-1"></i>
                    {method.note}
                  </small>
                </div>
              </Col>
            </Row>
          </Card.Body>
        </Card>
      ))}

      {/* Payment Security Notice */}
      <Alert variant="light" className="mt-3">
        <Alert.Heading className="h6">
          <i className="bi bi-shield-check text-success me-2"></i>
          Secure Payment
        </Alert.Heading>
        <p className="mb-0 small">All payments are encrypted and secure.</p>
      </Alert>

      {/* COD Information */}
      {paymentMethod === "cod" && (
        <Alert variant="warning" className="mt-3">
          <Alert.Heading className="h6">
            <i className="bi bi-exclamation-triangle me-2"></i>
            Cash on Delivery Information
          </Alert.Heading>
          <ul className="mb-0 small">
            <li>Payment will be collected at the time of delivery</li>
            <li>
              Order status will show as "Unpaid" until payment is received
            </li>
            <li>Please have exact change ready for faster delivery</li>
            <li>COD is available for orders up to ₹5,000</li>
          </ul>
        </Alert>
      )}

      {/* Online Payment Information */}
      {(paymentMethod === "online" || paymentMethod === "upi") && (
        <Alert variant="info" className="mt-3">
          <Alert.Heading className="h6">
            <i className="bi bi-info-circle me-2"></i>
            Online Payment Benefits
          </Alert.Heading>
          <ul className="mb-0 small">
            <li>Instant payment confirmation</li>
            <li>Faster order processing</li>
            <li>Secure transaction with payment gateway</li>
            <li>Digital receipt and payment proof</li>
          </ul>
        </Alert>
      )}

      <style>{`
        .payment-option {
          border: 2px solid #e9ecef;
          transition: all 0.3s ease;
        }

        .payment-option:hover {
          border-color: #dee2e6;
          box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }

        .payment-option.selected {
          border-color: var(--medical-red);
          background-color: #fff5f5;
        }

        .payment-note {
          margin-top: 8px;
          padding: 8px 12px;
          background-color: #f8f9fa;
          border-radius: 4px;
        }
      `}</style>
    </div>
  );
};

export default PaymentOptions;
