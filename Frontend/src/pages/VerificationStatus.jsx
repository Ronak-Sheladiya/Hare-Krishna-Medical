import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Container,
  Row,
  Col,
  Card,
  Button,
  Form,
  Alert,
  Badge,
  InputGroup,
  Spinner,
} from "react-bootstrap";
import { useSelector } from "react-redux";

const VerificationStatus = () => {
  const navigate = useNavigate();
  const { user, token } = useSelector((state) => state.auth);

  const [verificationStatus, setVerificationStatus] = useState({
    emailVerified: false,
    mobileVerified: false,
    verificationCompleted: false,
    canResendOTP: true,
    otpExpiresAt: null,
  });

  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState({ show: false, message: "", type: "" });
  const [countdown, setCountdown] = useState(0);

  useEffect(() => {
    if (!user || !token) {
      navigate("/login");
      return;
    }
    fetchVerificationStatus();
  }, [user, token]);

  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown]);

  const fetchVerificationStatus = async () => {
    try {
      const response = await fetch("/api/verification/status", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await response.json();

      if (data.success) {
        setVerificationStatus(data.data);

        // Set countdown if OTP was recently sent
        if (data.data.otpExpiresAt) {
          const timeLeft = Math.max(
            0,
            Math.floor((new Date(data.data.otpExpiresAt) - new Date()) / 1000),
          );
          setCountdown(timeLeft);
        }
      }
    } catch (error) {
      console.error("Error fetching verification status:", error);
    }
  };

  const showAlert = (message, type = "info") => {
    setAlert({ show: true, message, type });
    setTimeout(() => setAlert({ show: false, message: "", type: "" }), 5000);
  };

  const sendEmailVerification = async () => {
    try {
      setLoading(true);
      const response = await fetch(
        "/api/verification/send-email-verification",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );
      const data = await response.json();

      if (data.success) {
        showAlert(
          "Verification email sent successfully! Please check your inbox.",
          "success",
        );
      } else {
        showAlert(
          data.message || "Failed to send verification email",
          "danger",
        );
      }
    } catch (error) {
      console.error("Send email verification error:", error);
      showAlert("Failed to send verification email", "danger");
    } finally {
      setLoading(false);
    }
  };

  const sendMobileOTP = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/verification/send-mobile-otp", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await response.json();

      if (data.success) {
        showAlert("OTP sent successfully to your mobile number!", "success");
        setCountdown(300); // 5 minutes
        fetchVerificationStatus();
      } else {
        showAlert(data.message || "Failed to send OTP", "danger");
      }
    } catch (error) {
      console.error("Send mobile OTP error:", error);
      showAlert("Failed to send OTP", "danger");
    } finally {
      setLoading(false);
    }
  };

  const verifyMobileOTP = async () => {
    if (!otp || otp.length !== 6) {
      showAlert("Please enter a valid 6-digit OTP", "warning");
      return;
    }

    try {
      setLoading(true);
      const response = await fetch("/api/verification/verify-mobile-otp", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ otp }),
      });
      const data = await response.json();

      if (data.success) {
        showAlert("Mobile number verified successfully!", "success");
        setOtp("");
        fetchVerificationStatus();
      } else {
        showAlert(data.message || "Invalid OTP", "danger");
      }
    } catch (error) {
      console.error("Verify mobile OTP error:", error);
      showAlert("OTP verification failed", "danger");
    } finally {
      setLoading(false);
    }
  };

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
  };

  if (!user) {
    return null;
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%)",
        paddingTop: "50px",
        paddingBottom: "50px",
      }}
    >
      <Container>
        {/* Alert */}
        {alert.show && (
          <Row className="mb-4">
            <Col lg={12}>
              <Alert
                variant={alert.type}
                onClose={() => setAlert({ show: false, message: "", type: "" })}
                dismissible
                style={{ borderRadius: "12px" }}
              >
                {alert.message}
              </Alert>
            </Col>
          </Row>
        )}

        {/* Header */}
        <Row className="mb-4">
          <Col lg={12}>
            <Card
              style={{
                border: "none",
                borderRadius: "20px",
                background: "linear-gradient(135deg, #6f42c1, #6610f2)",
                color: "white",
                boxShadow: "0 15px 50px rgba(111, 66, 193, 0.3)",
              }}
            >
              <Card.Body className="p-4">
                <Row className="align-items-center">
                  <Col lg={8}>
                    <div className="d-flex align-items-center">
                      <div
                        style={{
                          width: "70px",
                          height: "70px",
                          background: "rgba(255, 255, 255, 0.2)",
                          borderRadius: "50%",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          marginRight: "20px",
                        }}
                      >
                        <i
                          className="bi bi-shield-check"
                          style={{ fontSize: "32px" }}
                        ></i>
                      </div>
                      <div>
                        <h1
                          style={{
                            fontWeight: "800",
                            marginBottom: "8px",
                            fontSize: "2.2rem",
                          }}
                        >
                          Account Verification
                        </h1>
                        <p style={{ opacity: "0.9", marginBottom: "0" }}>
                          Secure your account by verifying your email and mobile
                          number
                        </p>
                      </div>
                    </div>
                  </Col>
                  <Col lg={4} className="text-end">
                    {verificationStatus.verificationCompleted ? (
                      <Badge
                        bg="success"
                        style={{
                          fontSize: "16px",
                          padding: "10px 20px",
                          borderRadius: "15px",
                        }}
                      >
                        <i className="bi bi-check-circle me-2"></i>
                        Verified
                      </Badge>
                    ) : (
                      <Badge
                        bg="warning"
                        style={{
                          fontSize: "16px",
                          padding: "10px 20px",
                          borderRadius: "15px",
                        }}
                      >
                        <i className="bi bi-exclamation-triangle me-2"></i>
                        Pending
                      </Badge>
                    )}
                  </Col>
                </Row>
              </Card.Body>
            </Card>
          </Col>
        </Row>

        <Row>
          {/* Email Verification */}
          <Col lg={6} className="mb-4">
            <Card
              style={{
                border: "none",
                borderRadius: "16px",
                boxShadow: "0 8px 32px rgba(0,0,0,0.1)",
                height: "100%",
              }}
            >
              <Card.Header
                style={{
                  background: verificationStatus.emailVerified
                    ? "linear-gradient(135deg, #28a745, #20c997)"
                    : "linear-gradient(135deg, #ffc107, #fd7e14)",
                  color: "white",
                  borderRadius: "16px 16px 0 0",
                  padding: "20px",
                }}
              >
                <h5 className="mb-0" style={{ fontWeight: "700" }}>
                  <i className="bi bi-envelope me-2"></i>
                  Email Verification
                </h5>
              </Card.Header>
              <Card.Body className="p-4">
                <div className="text-center mb-4">
                  <div
                    style={{
                      width: "60px",
                      height: "60px",
                      background: verificationStatus.emailVerified
                        ? "linear-gradient(135deg, #28a745, #20c997)"
                        : "linear-gradient(135deg, #ffc107, #fd7e14)",
                      borderRadius: "50%",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      margin: "0 auto",
                      boxShadow: "0 8px 25px rgba(0, 0, 0, 0.2)",
                    }}
                  >
                    <i
                      className={`bi bi-${verificationStatus.emailVerified ? "check-circle" : "envelope"}`}
                      style={{ fontSize: "24px", color: "white" }}
                    ></i>
                  </div>
                </div>

                <div className="text-center mb-4">
                  <h6 style={{ fontWeight: "600", marginBottom: "10px" }}>
                    {user.email}
                  </h6>
                  <Badge
                    bg={
                      verificationStatus.emailVerified ? "success" : "warning"
                    }
                    style={{ padding: "6px 12px", borderRadius: "12px" }}
                  >
                    {verificationStatus.emailVerified ? "Verified" : "Pending"}
                  </Badge>
                </div>

                {!verificationStatus.emailVerified && (
                  <div className="text-center">
                    <p
                      style={{
                        color: "#666",
                        fontSize: "14px",
                        marginBottom: "20px",
                      }}
                    >
                      We need to verify your email address to ensure account
                      security.
                    </p>
                    <Button
                      variant="primary"
                      onClick={sendEmailVerification}
                      disabled={loading}
                      style={{
                        borderRadius: "8px",
                        fontWeight: "600",
                        padding: "10px 24px",
                      }}
                    >
                      {loading ? (
                        <>
                          <Spinner
                            animation="border"
                            size="sm"
                            className="me-2"
                          />
                          Sending...
                        </>
                      ) : (
                        <>
                          <i className="bi bi-envelope me-2"></i>
                          Send Verification Email
                        </>
                      )}
                    </Button>
                  </div>
                )}

                {verificationStatus.emailVerified && (
                  <div className="text-center">
                    <Alert
                      variant="success"
                      style={{ borderRadius: "8px", margin: "0" }}
                    >
                      <i className="bi bi-check-circle me-2"></i>
                      Your email has been verified successfully!
                    </Alert>
                  </div>
                )}
              </Card.Body>
            </Card>
          </Col>

          {/* Mobile Verification */}
          <Col lg={6} className="mb-4">
            <Card
              style={{
                border: "none",
                borderRadius: "16px",
                boxShadow: "0 8px 32px rgba(0,0,0,0.1)",
                height: "100%",
              }}
            >
              <Card.Header
                style={{
                  background: verificationStatus.mobileVerified
                    ? "linear-gradient(135deg, #28a745, #20c997)"
                    : "linear-gradient(135deg, #17a2b8, #20c997)",
                  color: "white",
                  borderRadius: "16px 16px 0 0",
                  padding: "20px",
                }}
              >
                <h5 className="mb-0" style={{ fontWeight: "700" }}>
                  <i className="bi bi-phone me-2"></i>
                  Mobile Verification
                </h5>
              </Card.Header>
              <Card.Body className="p-4">
                <div className="text-center mb-4">
                  <div
                    style={{
                      width: "60px",
                      height: "60px",
                      background: verificationStatus.mobileVerified
                        ? "linear-gradient(135deg, #28a745, #20c997)"
                        : "linear-gradient(135deg, #17a2b8, #20c997)",
                      borderRadius: "50%",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      margin: "0 auto",
                      boxShadow: "0 8px 25px rgba(0, 0, 0, 0.2)",
                    }}
                  >
                    <i
                      className={`bi bi-${verificationStatus.mobileVerified ? "check-circle" : "phone"}`}
                      style={{ fontSize: "24px", color: "white" }}
                    ></i>
                  </div>
                </div>

                <div className="text-center mb-4">
                  <h6 style={{ fontWeight: "600", marginBottom: "10px" }}>
                    {user.mobile}
                  </h6>
                  <Badge
                    bg={verificationStatus.mobileVerified ? "success" : "info"}
                    style={{ padding: "6px 12px", borderRadius: "12px" }}
                  >
                    {verificationStatus.mobileVerified ? "Verified" : "Pending"}
                  </Badge>
                </div>

                {!verificationStatus.mobileVerified && (
                  <div>
                    <p
                      style={{
                        color: "#666",
                        fontSize: "14px",
                        marginBottom: "20px",
                        textAlign: "center",
                      }}
                    >
                      Verify your mobile number to receive order updates via
                      email.
                    </p>

                    <div className="mb-3">
                      <Button
                        variant="info"
                        onClick={sendMobileOTP}
                        disabled={loading || !verificationStatus.canResendOTP}
                        style={{
                          borderRadius: "8px",
                          fontWeight: "600",
                          width: "100%",
                          padding: "10px",
                        }}
                      >
                        {loading ? (
                          <>
                            <Spinner
                              animation="border"
                              size="sm"
                              className="me-2"
                            />
                            Sending OTP...
                          </>
                        ) : !verificationStatus.canResendOTP ? (
                          <>
                            <i className="bi bi-clock me-2"></i>
                            Resend OTP in {formatTime(countdown)}
                          </>
                        ) : (
                          <>
                            <i className="bi bi-phone me-2"></i>
                            Send OTP
                          </>
                        )}
                      </Button>
                    </div>

                    <div className="mb-3">
                      <Form.Label style={{ fontWeight: "600" }}>
                        Enter OTP
                      </Form.Label>
                      <InputGroup>
                        <Form.Control
                          type="text"
                          placeholder="Enter 6-digit OTP"
                          value={otp}
                          onChange={(e) =>
                            setOtp(
                              e.target.value.replace(/\D/g, "").slice(0, 6),
                            )
                          }
                          maxLength={6}
                          style={{
                            borderRadius: "8px 0 0 8px",
                            border: "2px solid #e9ecef",
                          }}
                        />
                        <Button
                          variant="success"
                          onClick={verifyMobileOTP}
                          disabled={loading || otp.length !== 6}
                          style={{ borderRadius: "0 8px 8px 0" }}
                        >
                          {loading ? (
                            <Spinner animation="border" size="sm" />
                          ) : (
                            <>
                              <i className="bi bi-check"></i>
                            </>
                          )}
                        </Button>
                      </InputGroup>
                    </div>
                  </div>
                )}

                {verificationStatus.mobileVerified && (
                  <div className="text-center">
                    <Alert
                      variant="success"
                      style={{ borderRadius: "8px", margin: "0" }}
                    >
                      <i className="bi bi-check-circle me-2"></i>
                      Your mobile number has been verified successfully!
                    </Alert>
                  </div>
                )}
              </Card.Body>
            </Card>
          </Col>
        </Row>

        {/* Completion Status */}
        {verificationStatus.verificationCompleted && (
          <Row>
            <Col lg={12}>
              <Card
                style={{
                  border: "none",
                  borderRadius: "16px",
                  background: "linear-gradient(135deg, #28a745, #20c997)",
                  color: "white",
                  boxShadow: "0 8px 32px rgba(40, 167, 69, 0.3)",
                }}
              >
                <Card.Body className="p-4 text-center">
                  <div className="mb-3">
                    <i
                      className="bi bi-check-circle"
                      style={{ fontSize: "48px" }}
                    ></i>
                  </div>
                  <h3 style={{ fontWeight: "800", marginBottom: "15px" }}>
                    Account Fully Verified! 🎉
                  </h3>
                  <p
                    style={{
                      opacity: "0.9",
                      marginBottom: "25px",
                      fontSize: "16px",
                    }}
                  >
                    Both your email and mobile number have been verified. You
                    can now enjoy all features of Hare Krishna Medical.
                  </p>
                  <div>
                    <Button
                      variant="light"
                      size="lg"
                      onClick={() => navigate("/user-dashboard")}
                      style={{
                        borderRadius: "12px",
                        fontWeight: "600",
                        marginRight: "15px",
                        color: "#28a745",
                      }}
                    >
                      <i className="bi bi-speedometer2 me-2"></i>
                      Go to Dashboard
                    </Button>
                    <Button
                      variant="outline-light"
                      size="lg"
                      onClick={() => navigate("/products")}
                      style={{
                        borderRadius: "12px",
                        fontWeight: "600",
                      }}
                    >
                      <i className="bi bi-shop me-2"></i>
                      Start Shopping
                    </Button>
                  </div>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        )}
      </Container>
    </div>
  );
};

export default VerificationStatus;
