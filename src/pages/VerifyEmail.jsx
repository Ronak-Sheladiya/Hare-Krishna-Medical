import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Container,
  Row,
  Col,
  Card,
  Button,
  Spinner,
  Alert,
} from "react-bootstrap";

const VerifyEmail = () => {
  const { token } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [verified, setVerified] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (token) {
      verifyEmail();
    }
  }, [token]);

  const verifyEmail = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await fetch(`/api/verification/verify-email/${token}`);
      const data = await response.json();

      if (data.success) {
        setVerified(true);

        // Show success message and redirect after delay
        setTimeout(() => {
          navigate("/verification-status");
        }, 3000);
      } else {
        setError(data.message || "Email verification failed");
      }
    } catch (error) {
      console.error("Email verification error:", error);
      setError("Email verification failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div
        className="d-flex justify-content-center align-items-center"
        style={{
          minHeight: "100vh",
          background: "linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%)",
        }}
      >
        <div className="text-center">
          <Spinner
            animation="border"
            variant="primary"
            size="lg"
            className="mb-3"
          />
          <h4>Verifying your email...</h4>
          <p className="text-muted">
            Please wait while we verify your email address
          </p>
        </div>
      </div>
    );
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%)",
        paddingTop: "50px",
      }}
    >
      <Container>
        <Row className="justify-content-center">
          <Col lg={6} md={8}>
            <Card
              style={{
                border: "none",
                borderRadius: "20px",
                boxShadow: "0 15px 50px rgba(0, 0, 0, 0.1)",
              }}
            >
              <Card.Body className="p-5 text-center">
                {verified ? (
                  <>
                    <div className="mb-4">
                      <div
                        style={{
                          width: "80px",
                          height: "80px",
                          background:
                            "linear-gradient(135deg, #28a745, #20c997)",
                          borderRadius: "50%",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          margin: "0 auto",
                          boxShadow: "0 8px 25px rgba(40, 167, 69, 0.3)",
                        }}
                      >
                        <i
                          className="bi bi-check-circle"
                          style={{ fontSize: "40px", color: "white" }}
                        ></i>
                      </div>
                    </div>

                    <h2
                      style={{
                        color: "#28a745",
                        fontWeight: "800",
                        marginBottom: "20px",
                      }}
                    >
                      Email Verified Successfully! ✅
                    </h2>

                    <p
                      style={{
                        color: "#666",
                        fontSize: "16px",
                        lineHeight: "1.6",
                      }}
                    >
                      Your email has been verified successfully. You can now
                      access all features of Hare Krishna Medical.
                    </p>

                    <Alert
                      variant="success"
                      className="mt-4"
                      style={{ borderRadius: "12px" }}
                    >
                      <Alert.Heading style={{ fontSize: "18px" }}>
                        <i className="bi bi-info-circle me-2"></i>
                        What's Next?
                      </Alert.Heading>
                      <ul className="text-start mb-0">
                        <li>Browse our medical products</li>
                        <li>Place orders with confidence</li>
                        <li>Track your orders in real-time</li>
                        <li>Access your digital invoices</li>
                      </ul>
                    </Alert>

                    <div className="mt-4">
                      <Button
                        variant="success"
                        size="lg"
                        onClick={() => navigate("/verification-status")}
                        style={{
                          borderRadius: "12px",
                          fontWeight: "600",
                          padding: "12px 30px",
                          marginRight: "15px",
                        }}
                      >
                        <i className="bi bi-arrow-right me-2"></i>
                        Continue Setup
                      </Button>

                      <Button
                        variant="outline-primary"
                        size="lg"
                        onClick={() => navigate("/products")}
                        style={{
                          borderRadius: "12px",
                          fontWeight: "600",
                          padding: "12px 30px",
                        }}
                      >
                        <i className="bi bi-shop me-2"></i>
                        Start Shopping
                      </Button>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="mb-4">
                      <div
                        style={{
                          width: "80px",
                          height: "80px",
                          background:
                            "linear-gradient(135deg, #dc3545, #e63946)",
                          borderRadius: "50%",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          margin: "0 auto",
                          boxShadow: "0 8px 25px rgba(220, 53, 69, 0.3)",
                        }}
                      >
                        <i
                          className="bi bi-x-circle"
                          style={{ fontSize: "40px", color: "white" }}
                        ></i>
                      </div>
                    </div>

                    <h2
                      style={{
                        color: "#dc3545",
                        fontWeight: "800",
                        marginBottom: "20px",
                      }}
                    >
                      Verification Failed
                    </h2>

                    <p
                      style={{
                        color: "#666",
                        fontSize: "16px",
                        lineHeight: "1.6",
                      }}
                    >
                      {error}
                    </p>

                    <Alert
                      variant="warning"
                      className="mt-4"
                      style={{ borderRadius: "12px" }}
                    >
                      <Alert.Heading style={{ fontSize: "18px" }}>
                        <i className="bi bi-exclamation-triangle me-2"></i>
                        Need Help?
                      </Alert.Heading>
                      <p className="mb-0">
                        If you're having trouble with email verification, please
                        contact our support team or try requesting a new
                        verification email.
                      </p>
                    </Alert>

                    <div className="mt-4">
                      <Button
                        variant="primary"
                        size="lg"
                        onClick={() => navigate("/verification-status")}
                        style={{
                          borderRadius: "12px",
                          fontWeight: "600",
                          padding: "12px 30px",
                          marginRight: "15px",
                        }}
                      >
                        <i className="bi bi-arrow-repeat me-2"></i>
                        Try Again
                      </Button>

                      <Button
                        variant="outline-secondary"
                        size="lg"
                        onClick={() => navigate("/")}
                        style={{
                          borderRadius: "12px",
                          fontWeight: "600",
                          padding: "12px 30px",
                        }}
                      >
                        <i className="bi bi-house me-2"></i>
                        Go Home
                      </Button>
                    </div>
                  </>
                )}
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default VerifyEmail;
