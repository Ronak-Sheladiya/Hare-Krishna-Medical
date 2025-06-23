import React, { useState, useEffect } from "react";
import {
  Container,
  Row,
  Col,
  Card,
  Form,
  Button,
  Alert,
  Tab,
  Nav,
  Modal,
  Spinner,
  InputGroup,
  Badge,
} from "react-bootstrap";
import { useSelector, useDispatch } from "react-redux";
import {
  PageHeroSection,
  ThemeCard,
  ThemeButton,
  ThemeSection,
} from "../../components/common/ConsistentTheme";

const UserProfile = () => {
  const { user } = useSelector((state) => state.auth);
  const [activeTab, setActiveTab] = useState("personal");
  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState({ show: false, message: "", variant: "" });
  const [showPasswordModal, setShowPasswordModal] = useState(false);

  // Personal Information State
  const [personalInfo, setPersonalInfo] = useState({
    fullName: "",
    email: "",
    mobile: "",
    dateOfBirth: "",
    gender: "",
    profileImage: "",
  });

  // Address Information State
  const [addressInfo, setAddressInfo] = useState({
    street: "",
    city: "",
    state: "",
    pincode: "",
    landmark: "",
  });

  // Password Change State
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  // Initialize form data from user
  useEffect(() => {
    if (user) {
      setPersonalInfo({
        fullName: user.name || "",
        email: user.email || "",
        mobile: user.mobile || "",
        dateOfBirth: user.dateOfBirth || "",
        gender: user.gender || "",
        profileImage: user.profileImage || "",
      });

      setAddressInfo({
        street: user.address || "",
        city: user.city || "",
        state: user.state || "",
        pincode: user.pincode || "",
        landmark: user.landmark || "",
      });
    }
  }, [user]);

  const showAlert = (message, variant) => {
    setAlert({ show: true, message, variant });
    setTimeout(() => {
      setAlert({ show: false, message: "", variant: "" });
    }, 5000);
  };

  const handlePersonalInfoSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 2000));
      showAlert("Personal information updated successfully!", "success");
    } catch (error) {
      showAlert("Failed to update information. Please try again.", "danger");
    } finally {
      setLoading(false);
    }
  };

  const handleAddressSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 2000));
      showAlert("Address updated successfully!", "success");
    } catch (error) {
      showAlert("Failed to update address. Please try again.", "danger");
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();

    if (passwordData.newPassword.length < 6) {
      showAlert("New password must be at least 6 characters long.", "danger");
      return;
    }

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      showAlert("New passwords do not match.", "danger");
      return;
    }

    setLoading(true);

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 2000));
      setPasswordData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
      setShowPasswordModal(false);
      showAlert("Password changed successfully!", "success");
    } catch (error) {
      showAlert("Failed to change password. Please try again.", "danger");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fade-in user-page-content" data-page="user">
      {/* Hero Section - About Us Red Theme */}
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
                Edit Profile
              </h1>
              <p
                style={{
                  fontSize: "1.2rem",
                  opacity: "0.9",
                  maxWidth: "600px",
                  margin: "0 auto",
                }}
              >
                Update your personal information and account settings
              </p>
            </Col>
          </Row>
        </Container>
      </section>

      {/* Profile Content */}
      <section
        style={{
          background: "#f8f9fa",
          paddingTop: "80px",
          paddingBottom: "80px",
          minHeight: "60vh",
        }}
      >
        <Container>
          {alert.show && (
            <Row className="mb-4">
              <Col lg={12}>
                <Alert variant={alert.variant}>
                  <i
                    className={`bi bi-${alert.variant === "success" ? "check-circle" : "exclamation-triangle"} me-2`}
                  ></i>
                  {alert.message}
                </Alert>
              </Col>
            </Row>
          )}

          <Row>
            <Col lg={12}>
              <Card
                style={{
                  border: "2px solid #f8f9fa",
                  borderRadius: "16px",
                  boxShadow: "0 8px 25px rgba(0,0,0,0.05)",
                }}
              >
                <Card.Body className="p-0">
                  <Tab.Container activeKey={activeTab} onSelect={setActiveTab}>
                    <Nav variant="tabs" className="border-bottom">
                      <Nav.Item>
                        <Nav.Link eventKey="personal">
                          <i className="bi bi-person me-2"></i>
                          Personal Information
                        </Nav.Link>
                      </Nav.Item>
                      <Nav.Item>
                        <Nav.Link eventKey="address">
                          <i className="bi bi-geo-alt me-2"></i>
                          Address
                        </Nav.Link>
                      </Nav.Item>
                      <Nav.Item>
                        <Nav.Link eventKey="security">
                          <i className="bi bi-shield-lock me-2"></i>
                          Security
                        </Nav.Link>
                      </Nav.Item>
                    </Nav>

                    <Tab.Content className="p-4">
                      {/* Personal Information Tab */}
                      <Tab.Pane eventKey="personal">
                        <Form onSubmit={handlePersonalInfoSubmit}>
                          <Row className="mb-4">
                            <Col lg={12} className="text-center">
                              <div className="profile-image-container">
                                <img
                                  src={
                                    personalInfo.profileImage ||
                                    "https://via.placeholder.com/150x150/e6e6e6/666666?text=User"
                                  }
                                  alt="Profile"
                                  style={{
                                    width: "150px",
                                    height: "150px",
                                    borderRadius: "50%",
                                    objectFit: "cover",
                                    border: "4px solid #e9ecef",
                                  }}
                                />
                                <p
                                  style={{
                                    color: "#6c757d",
                                    marginTop: "10px",
                                  }}
                                >
                                  Profile Picture
                                </p>
                              </div>
                            </Col>
                          </Row>

                          <Row>
                            <Col md={6} className="mb-3">
                              <Form.Label style={{ fontWeight: "600" }}>
                                Full Name *
                              </Form.Label>
                              <Form.Control
                                type="text"
                                value={personalInfo.fullName}
                                onChange={(e) =>
                                  setPersonalInfo({
                                    ...personalInfo,
                                    fullName: e.target.value,
                                  })
                                }
                                required
                                style={{
                                  borderRadius: "8px",
                                  padding: "12px",
                                }}
                              />
                            </Col>
                            <Col md={6} className="mb-3">
                              <Form.Label style={{ fontWeight: "600" }}>
                                Email Address *
                              </Form.Label>
                              <Form.Control
                                type="email"
                                value={personalInfo.email}
                                onChange={(e) =>
                                  setPersonalInfo({
                                    ...personalInfo,
                                    email: e.target.value,
                                  })
                                }
                                required
                                style={{
                                  borderRadius: "8px",
                                  padding: "12px",
                                }}
                              />
                            </Col>
                          </Row>

                          <Row>
                            <Col md={6} className="mb-3">
                              <Form.Label style={{ fontWeight: "600" }}>
                                Mobile Number *
                              </Form.Label>
                              <Form.Control
                                type="tel"
                                value={personalInfo.mobile}
                                onChange={(e) =>
                                  setPersonalInfo({
                                    ...personalInfo,
                                    mobile: e.target.value,
                                  })
                                }
                                required
                                style={{
                                  borderRadius: "8px",
                                  padding: "12px",
                                }}
                              />
                            </Col>
                            <Col md={6} className="mb-3">
                              <Form.Label style={{ fontWeight: "600" }}>
                                Date of Birth
                              </Form.Label>
                              <Form.Control
                                type="date"
                                value={personalInfo.dateOfBirth}
                                onChange={(e) =>
                                  setPersonalInfo({
                                    ...personalInfo,
                                    dateOfBirth: e.target.value,
                                  })
                                }
                                style={{
                                  borderRadius: "8px",
                                  padding: "12px",
                                }}
                              />
                            </Col>
                          </Row>

                          <Row>
                            <Col md={6} className="mb-3">
                              <Form.Label style={{ fontWeight: "600" }}>
                                Gender
                              </Form.Label>
                              <Form.Select
                                value={personalInfo.gender}
                                onChange={(e) =>
                                  setPersonalInfo({
                                    ...personalInfo,
                                    gender: e.target.value,
                                  })
                                }
                                style={{
                                  borderRadius: "8px",
                                  padding: "12px",
                                }}
                              >
                                <option value="">Select Gender</option>
                                <option value="male">Male</option>
                                <option value="female">Female</option>
                                <option value="other">Other</option>
                              </Form.Select>
                            </Col>
                          </Row>

                          <div className="text-end">
                            <Button
                              type="submit"
                              disabled={loading}
                              style={{
                                background: "#e63946",
                                border: "none",
                                borderRadius: "8px",
                                padding: "12px 24px",
                                fontWeight: "600",
                              }}
                            >
                              {loading ? (
                                <>
                                  <Spinner size="sm" className="me-2" />
                                  Updating...
                                </>
                              ) : (
                                <>
                                  <i className="bi bi-check-circle me-2"></i>
                                  Update Information
                                </>
                              )}
                            </Button>
                          </div>
                        </Form>
                      </Tab.Pane>

                      {/* Address Tab */}
                      <Tab.Pane eventKey="address">
                        <Form onSubmit={handleAddressSubmit}>
                          <Row>
                            <Col md={12} className="mb-3">
                              <Form.Label style={{ fontWeight: "600" }}>
                                Street Address *
                              </Form.Label>
                              <Form.Control
                                type="text"
                                value={addressInfo.street}
                                onChange={(e) =>
                                  setAddressInfo({
                                    ...addressInfo,
                                    street: e.target.value,
                                  })
                                }
                                required
                                style={{
                                  borderRadius: "8px",
                                  padding: "12px",
                                }}
                              />
                            </Col>
                          </Row>

                          <Row>
                            <Col md={6} className="mb-3">
                              <Form.Label style={{ fontWeight: "600" }}>
                                City *
                              </Form.Label>
                              <Form.Control
                                type="text"
                                value={addressInfo.city}
                                onChange={(e) =>
                                  setAddressInfo({
                                    ...addressInfo,
                                    city: e.target.value,
                                  })
                                }
                                required
                                style={{
                                  borderRadius: "8px",
                                  padding: "12px",
                                }}
                              />
                            </Col>
                            <Col md={6} className="mb-3">
                              <Form.Label style={{ fontWeight: "600" }}>
                                State *
                              </Form.Label>
                              <Form.Control
                                type="text"
                                value={addressInfo.state}
                                onChange={(e) =>
                                  setAddressInfo({
                                    ...addressInfo,
                                    state: e.target.value,
                                  })
                                }
                                required
                                style={{
                                  borderRadius: "8px",
                                  padding: "12px",
                                }}
                              />
                            </Col>
                          </Row>

                          <Row>
                            <Col md={6} className="mb-3">
                              <Form.Label style={{ fontWeight: "600" }}>
                                PIN Code *
                              </Form.Label>
                              <Form.Control
                                type="text"
                                value={addressInfo.pincode}
                                onChange={(e) =>
                                  setAddressInfo({
                                    ...addressInfo,
                                    pincode: e.target.value,
                                  })
                                }
                                required
                                style={{
                                  borderRadius: "8px",
                                  padding: "12px",
                                }}
                              />
                            </Col>
                            <Col md={6} className="mb-3">
                              <Form.Label style={{ fontWeight: "600" }}>
                                Landmark
                              </Form.Label>
                              <Form.Control
                                type="text"
                                value={addressInfo.landmark}
                                onChange={(e) =>
                                  setAddressInfo({
                                    ...addressInfo,
                                    landmark: e.target.value,
                                  })
                                }
                                style={{
                                  borderRadius: "8px",
                                  padding: "12px",
                                }}
                              />
                            </Col>
                          </Row>

                          <div className="text-end">
                            <Button
                              type="submit"
                              disabled={loading}
                              style={{
                                background: "#e63946",
                                border: "none",
                                borderRadius: "8px",
                                padding: "12px 24px",
                                fontWeight: "600",
                              }}
                            >
                              {loading ? (
                                <>
                                  <Spinner size="sm" className="me-2" />
                                  Updating...
                                </>
                              ) : (
                                <>
                                  <i className="bi bi-check-circle me-2"></i>
                                  Update Address
                                </>
                              )}
                            </Button>
                          </div>
                        </Form>
                      </Tab.Pane>

                      {/* Security Tab */}
                      <Tab.Pane eventKey="security">
                        <div>
                          <h5
                            style={{ color: "#e63946", marginBottom: "20px" }}
                          >
                            Security Settings
                          </h5>

                          <div
                            style={{
                              background: "#f8f9fa",
                              padding: "20px",
                              borderRadius: "8px",
                              marginBottom: "20px",
                            }}
                          >
                            <div className="d-flex justify-content-between align-items-center">
                              <div>
                                <h6 style={{ margin: 0 }}>Password</h6>
                                <small style={{ color: "#6c757d" }}>
                                  Last changed 30 days ago
                                </small>
                              </div>
                              <Button
                                variant="outline-primary"
                                onClick={() => setShowPasswordModal(true)}
                                style={{
                                  borderColor: "#e63946",
                                  color: "#e63946",
                                }}
                              >
                                Change Password
                              </Button>
                            </div>
                          </div>

                          <div
                            style={{
                              background: "#f8f9fa",
                              padding: "20px",
                              borderRadius: "8px",
                            }}
                          >
                            <h6>Account Security Tips</h6>
                            <ul style={{ fontSize: "14px", color: "#6c757d" }}>
                              <li>Use a strong, unique password</li>
                              <li>Don't share your login credentials</li>
                              <li>Log out from shared devices</li>
                              <li>Regularly update your password</li>
                            </ul>
                          </div>
                        </div>
                      </Tab.Pane>
                    </Tab.Content>
                  </Tab.Container>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Container>
      </section>

      {/* Password Change Modal */}
      <Modal
        show={showPasswordModal}
        onHide={() => setShowPasswordModal(false)}
        centered
      >
        <Modal.Header
          closeButton
          style={{
            background: "linear-gradient(135deg, #e63946, #dc3545)",
            color: "white",
          }}
        >
          <Modal.Title>Change Password</Modal.Title>
        </Modal.Header>
        <Form onSubmit={handlePasswordSubmit}>
          <Modal.Body style={{ padding: "30px" }}>
            <Form.Group className="mb-3">
              <Form.Label style={{ fontWeight: "600" }}>
                Current Password
              </Form.Label>
              <Form.Control
                type="password"
                value={passwordData.currentPassword}
                onChange={(e) =>
                  setPasswordData({
                    ...passwordData,
                    currentPassword: e.target.value,
                  })
                }
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label style={{ fontWeight: "600" }}>
                New Password
              </Form.Label>
              <Form.Control
                type="password"
                value={passwordData.newPassword}
                onChange={(e) =>
                  setPasswordData({
                    ...passwordData,
                    newPassword: e.target.value,
                  })
                }
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label style={{ fontWeight: "600" }}>
                Confirm New Password
              </Form.Label>
              <Form.Control
                type="password"
                value={passwordData.confirmPassword}
                onChange={(e) =>
                  setPasswordData({
                    ...passwordData,
                    confirmPassword: e.target.value,
                  })
                }
                required
              />
            </Form.Group>
          </Modal.Body>
          <Modal.Footer>
            <Button
              variant="outline-secondary"
              onClick={() => setShowPasswordModal(false)}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={loading}
              style={{ background: "#e63946", border: "none" }}
            >
              {loading ? (
                <>
                  <Spinner size="sm" className="me-2" />
                  Changing...
                </>
              ) : (
                "Change Password"
              )}
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>
    </div>
  );
};

export default UserProfile;
