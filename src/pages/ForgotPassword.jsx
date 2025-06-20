import React, { useState } from "react";
import {
  Container,
  Row,
  Col,
  Card,
  Form,
  Button,
  Alert,
  Spinner,
} from "react-bootstrap";
import { Link } from "react-router-dom";

const ForgotPassword = () => {
  const [step, setStep] = useState(1); // 1: Email, 2: OTP, 3: New Password
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleSendOTP = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setMessage("");

    try {
      // Simulate API call to send OTP
      await new Promise((resolve) => setTimeout(resolve, 2000));

      // Mock validation - in real app, this would be an API call
      const validEmails = [
        "admin@gmail.com",
        "user@example.com",
        "harekrishnamedical@gmail.com",
      ];

      if (!validEmails.includes(email)) {
        throw new Error("Email not found in our records");
      }

      setMessage("OTP sent successfully to your email address");
      setStep(2);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOTP = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setMessage("");

    try {
      // Simulate API call to verify OTP
      await new Promise((resolve) => setTimeout(resolve, 1500));

      // Mock OTP verification - in real app, this would be an API call
      if (otp !== "123456") {
        throw new Error("Invalid OTP. Please try again.");
      }

      setMessage("OTP verified successfully");
      setStep(3);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setMessage("");

    try {
      // Validation
      if (newPassword.length < 6) {
        throw new Error("Password must be at least 6 characters long");
      }

      if (newPassword !== confirmPassword) {
        throw new Error("Passwords do not match");
      }

      // Simulate API call to reset password
      await new Promise((resolve) => setTimeout(resolve, 2000));

      setMessage(
        "Password reset successfully! You can now login with your new password.",
      );

      // Reset form after 3 seconds and redirect to login
      setTimeout(() => {
        window.location.href = "/login";
      }, 3000);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const resendOTP = async () => {
    setLoading(true);
    setError("");
    setMessage("");

    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      setMessage("OTP resent successfully");
    } catch (err) {
      setError("Failed to resend OTP");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="section-padding">
      <Container>
        <Row className="justify-content-center">
          <Col lg={6} md={8}>
            <Card className="medical-form">
              <Card.Body className="p-5">
                <div className="text-center mb-4">
                  <img
                    src="https://cdn.builder.io/api/v1/assets/ec4b3f82f1ac4275b8bfc1756fcac420/medical_logo-e586be?format=webp&width=200"
                    alt="Hare Krishna Medical"
                    className="img-fluid mb-3"
                    style={{ maxHeight: "80px" }}
                  />
                  <h3 className="text-medical-dark">Reset Password</h3>
                  <p className="text-muted">
                    {step === 1 && "Enter your email to receive OTP"}
                    {step === 2 && "Enter the OTP sent to your email"}
                    {step === 3 && "Create your new password"}
                  </p>
                </div>

                {/* Progress Indicator */}
                <div className="mb-4">
                  <div className="d-flex justify-content-between align-items-center">
                    <div
                      className={`step-indicator ${step >= 1 ? "active" : ""}`}
                    >
                      <div className="step-number">1</div>
                      <small>Email</small>
                    </div>
                    <div className="step-line"></div>
                    <div
                      className={`step-indicator ${step >= 2 ? "active" : ""}`}
                    >
                      <div className="step-number">2</div>
                      <small>OTP</small>
                    </div>
                    <div className="step-line"></div>
                    <div
                      className={`step-indicator ${step >= 3 ? "active" : ""}`}
                    >
                      <div className="step-number">3</div>
                      <small>Password</small>
                    </div>
                  </div>
                </div>

                {message && (
                  <Alert variant="success" className="mb-3">
                    <i className="bi bi-check-circle me-2"></i>
                    {message}
                  </Alert>
                )}

                {error && (
                  <Alert variant="danger" className="mb-3">
                    <i className="bi bi-exclamation-triangle me-2"></i>
                    {error}
                  </Alert>
                )}

                {/* Step 1: Email */}
                {step === 1 && (
                  <Form onSubmit={handleSendOTP}>
                    <Form.Group className="mb-3">
                      <Form.Label>Email Address</Form.Label>
                      <Form.Control
                        type="email"
                        placeholder="Enter your registered email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        disabled={loading}
                      />
                      <Form.Text className="text-muted">
                        We'll send an OTP to this email address
                      </Form.Text>
                    </Form.Group>
                    <Button
                      type="submit"
                      className="btn-medical-primary w-100"
                      disabled={loading}
                    >
                      {loading ? (
                        <>
                          <Spinner size="sm" className="me-2" />
                          Sending OTP...
                        </>
                      ) : (
                        "Send OTP"
                      )}
                    </Button>
                  </Form>
                )}

                {/* Step 2: OTP Verification */}
                {step === 2 && (
                  <Form onSubmit={handleVerifyOTP}>
                    <Form.Group className="mb-3">
                      <Form.Label>Enter OTP</Form.Label>
                      <Form.Control
                        type="text"
                        placeholder="Enter 6-digit OTP"
                        value={otp}
                        onChange={(e) => setOtp(e.target.value)}
                        maxLength={6}
                        required
                        disabled={loading}
                        className="text-center"
                      />
                      <Form.Text className="text-muted">
                        OTP sent to {email}. Demo OTP: 123456
                      </Form.Text>
                    </Form.Group>
                    <Button
                      type="submit"
                      className="btn-medical-primary w-100 mb-3"
                      disabled={loading || otp.length !== 6}
                    >
                      {loading ? (
                        <>
                          <Spinner size="sm" className="me-2" />
                          Verifying...
                        </>
                      ) : (
                        "Verify OTP"
                      )}
                    </Button>
                    <div className="text-center">
                      <Button
                        variant="link"
                        onClick={resendOTP}
                        disabled={loading}
                        className="text-medical-blue"
                      >
                        Resend OTP
                      </Button>
                    </div>
                  </Form>
                )}

                {/* Step 3: New Password */}
                {step === 3 && (
                  <Form onSubmit={handleResetPassword}>
                    <Form.Group className="mb-3">
                      <Form.Label>New Password</Form.Label>
                      <Form.Control
                        type="password"
                        placeholder="Enter new password"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        minLength={6}
                        required
                        disabled={loading}
                      />
                    </Form.Group>
                    <Form.Group className="mb-3">
                      <Form.Label>Confirm New Password</Form.Label>
                      <Form.Control
                        type="password"
                        placeholder="Confirm new password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        minLength={6}
                        required
                        disabled={loading}
                      />
                    </Form.Group>
                    <Button
                      type="submit"
                      className="btn-medical-primary w-100"
                      disabled={loading}
                    >
                      {loading ? (
                        <>
                          <Spinner size="sm" className="me-2" />
                          Resetting Password...
                        </>
                      ) : (
                        "Reset Password"
                      )}
                    </Button>
                  </Form>
                )}

                <div className="text-center mt-4">
                  <Link
                    to="/login"
                    className="text-medical-blue text-decoration-none"
                  >
                    <i className="bi bi-arrow-left me-2"></i>
                    Back to Login
                  </Link>
                </div>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>

      <style>{`
        .step-indicator {
          display: flex;
          flex-direction: column;
          align-items: center;
          position: relative;
        }
        
        .step-number {
          width: 40px;
          height: 40px;
          border-radius: 50%;
          background: #e9ecef;
          color: #6c757d;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: bold;
          margin-bottom: 8px;
          transition: all 0.3s ease;
        }
        
        .step-indicator.active .step-number {
          background: var(--medical-red);
          color: white;
        }
        
        .step-line {
          flex: 1;
          height: 2px;
          background: #e9ecef;
          margin: 0 20px;
          margin-top: -20px;
        }
        
        .step-indicator.active ~ .step-line {
          background: var(--medical-red);
        }
      `}</style>
    </div>
  );
};

export default ForgotPassword;
