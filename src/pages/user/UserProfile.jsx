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
    <div className="fade-in">
      {/* Hero Section */}
      <PageHeroSection
        title={`Welcome, ${user?.fullName || user?.name || "User"}!`}
        subtitle="Manage your profile information and account settings"
        icon="bi-person-circle"
      />

      <ThemeSection background="#f8f9fa">
        <Container>
          {/* Alert */}
          {alert.show && (
            <Row className="mb-4">
              <Col lg={12}>
                <Alert variant={alert.variant} dismissible onClose={() => setAlert({ show: false, message: "", variant: "" })}>
                  {alert.message}
                </Alert>
              </Col>
            </Row>
          )}

          {/* Profile Overview Card */}
          <Row className="mb-4">
            <Col lg={12}>
              <ThemeCard title="Profile Overview" icon="bi-person-badge" className="mb-4">
                <Row>
                  <Col md={3} className="text-center">
                    <div
                      className="profile-avatar mx-auto mb-3"
                      style={{
                        width: "120px",
                        height: "120px",
                        borderRadius: "50%",
                        background: "linear-gradient(135deg, #e63946, #dc3545)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        color: "white",
                        fontSize: "3rem",
                        boxShadow: "0 8px 32px rgba(230, 57, 70, 0.3)"
                      }}
                    >
                      {personalInfo.profileImage ? (
                        <img
                          src={personalInfo.profileImage}
                          alt="Profile"
                          style={{ width: "100%", height: "100%", borderRadius: "50%", objectFit: "cover" }}
                        />
                      ) : (
                        <i className="bi bi-person-fill"></i>
                      )}
                    </div>
                    <h5 className="mb-1">{personalInfo.fullName || "User Name"}</h5>
                    <p className="text-muted mb-2">{personalInfo.email}</p>
                    <Badge bg="success" className="px-3 py-2">Active Account</Badge>
                  </Col>
                  <Col md={9}>
                    <Row>
                      <Col md={6}>
                        <div className="info-item mb-3">
                          <label className="text-muted small">Mobile Number</label>
                          <div className="fw-bold">{personalInfo.mobile || "Not provided"}</div>
                        </div>
                        <div className="info-item mb-3">
                          <label className="text-muted small">Date of Birth</label>
                          <div className="fw-bold">{personalInfo.dateOfBirth || "Not provided"}</div>
                        </div>
                      </Col>
                      <Col md={6}>
                        <div className="info-item mb-3">
                          <label className="text-muted small">Gender</label>
                          <div className="fw-bold">{personalInfo.gender || "Not specified"}</div>
                        </div>
                        <div className="info-item mb-3">
                          <label className="text-muted small">Member Since</label>
                          <div className="fw-bold">{new Date().getFullYear()}</div>
                        </div>
                      </Col>
                    </Row>
                  </Col>
                </Row>
              </ThemeCard>
            </Col>
          </Row>

          {/* Tabbed Interface */}
          <Row>
            <Col lg={12}>
              <ThemeCard className="profile-tabs-card">
                <Tab.Container activeKey={activeTab} onSelect={(k) => setActiveTab(k)}>
                  <Nav variant="pills" className="nav-pills-custom mb-4">
                    <Nav.Item>
                      <Nav.Link eventKey="personal" className="nav-pill-item">
                        <i className="bi bi-person me-2"></i>
                        Personal Information
                      </Nav.Link>
                    </Nav.Item>
                    <Nav.Item>
                      <Nav.Link eventKey="address" className="nav-pill-item">
                        <i className="bi bi-geo-alt me-2"></i>
                        Address Details
                      </Nav.Link>
                    </Nav.Item>
                    <Nav.Item>
                      <Nav.Link eventKey="security" className="nav-pill-item">
                        <i className="bi bi-shield-lock me-2"></i>
                        Security Settings
                      </Nav.Link>
                    </Nav.Item>
                  </Nav>

                  <Tab.Content>
                    {/* Personal Information Tab */}
                    <Tab.Pane eventKey="personal">
                      <Form onSubmit={handlePersonalInfoSubmit}>
                        <Row>
                          <Col md={6}>
                            <Form.Group className="mb-4">
                              <Form.Label className="form-label-custom">
                                <i className="bi bi-person me-2"></i>Full Name
                              </Form.Label>
                              <Form.Control
                                type="text"
                                placeholder="Enter your full name"
                                value={personalInfo.fullName}
                                onChange={(e) =>
                                  setPersonalInfo({
                                    ...personalInfo,
                                    fullName: e.target.value,
                                  })
                                }
                                className="form-control-custom"
                              />
                            </Form.Group>
                          </Col>
                          <Col md={6}>
                            <Form.Group className="mb-4">
                              <Form.Label className="form-label-custom">
                                <i className="bi bi-envelope me-2"></i>Email Address
                              </Form.Label>
                              <Form.Control
                                type="email"
                                placeholder="Enter your email"
                                value={personalInfo.email}
                                onChange={(e) =>
                                  setPersonalInfo({
                                    ...personalInfo,
                                    email: e.target.value,
                                  })
                                }
                                className="form-control-custom"
                                disabled
                              />
                              <Form.Text className="text-muted">
                                Contact support to change your email address
                              </Form.Text>
                            </Form.Group>
                          </Col>
                        </Row>

                        <Row>
                          <Col md={6}>
                            <Form.Group className="mb-4">
                              <Form.Label className="form-label-custom">
                                <i className="bi bi-phone me-2"></i>Mobile Number
                              </Form.Label>
                              <InputGroup>
                                <InputGroup.Text>+91</InputGroup.Text>
                                <Form.Control
                                  type="tel"
                                  placeholder="Enter mobile number"
                                  value={personalInfo.mobile}
                                  onChange={(e) =>
                                    setPersonalInfo({
                                      ...personalInfo,
                                      mobile: e.target.value,
                                    })
                                  }
                                  className="form-control-custom"
                                />
                              </InputGroup>
                            </Form.Group>
                          </Col>
                          <Col md={6}>
                            <Form.Group className="mb-4">
                              <Form.Label className="form-label-custom">
                                <i className="bi bi-calendar me-2"></i>Date of Birth
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
                                className="form-control-custom"
                              />
                            </Form.Group>
                          </Col>
                        </Row>

                        <Row>
                          <Col md={6}>
                            <Form.Group className="mb-4">
                              <Form.Label className="form-label-custom">
                                <i className="bi bi-gender-ambiguous me-2"></i>Gender
                              </Form.Label>
                              <Form.Select
                                value={personalInfo.gender}
                                onChange={(e) =>
                                  setPersonalInfo({
                                    ...personalInfo,
                                    gender: e.target.value,
                                  })
                                }
                                className="form-control-custom"
                              >
                                <option value="">Select Gender</option>
                                <option value="male">Male</option>
                                <option value="female">Female</option>
                                <option value="other">Other</option>
                                <option value="prefer-not-to-say">Prefer not to say</option>
                              </Form.Select>
                            </Form.Group>
                          </Col>
                        </Row>

                        <div className="text-end">
                          <ThemeButton
                            type="submit"
                            variant="primary"
                            disabled={loading}
                            icon={loading ? "bi-arrow-clockwise" : "bi-check-circle"}
                            size="lg"
                          >
                            {loading ? "Updating..." : "Update Personal Information"}
                          </ThemeButton>
                        </div>
                      </Form>
                    </Tab.Pane>

                    {/* Address Information Tab */}
                    <Tab.Pane eventKey="address">
                      <Form onSubmit={handleAddressSubmit}>
                        <Row>
                          <Col md={12}>
                            <Form.Group className="mb-4">
                              <Form.Label className="form-label-custom">
                                <i className="bi bi-house me-2"></i>Street Address
                              </Form.Label>
                              <Form.Control
                                type="text"
                                placeholder="Enter your street address"
                                value={addressInfo.street}
                                onChange={(e) =>
                                  setAddressInfo({
                                    ...addressInfo,
                                    street: e.target.value,
                                  })
                                }
                                className="form-control-custom"
                              />
                            </Form.Group>
                          </Col>
                        </Row>

                        <Row>
                          <Col md={6}>
                            <Form.Group className="mb-4">
                              <Form.Label className="form-label-custom">
                                <i className="bi bi-building me-2"></i>City
                              </Form.Label>
                              <Form.Control
                                type="text"
                                placeholder="Enter your city"
                                value={addressInfo.city}
                                onChange={(e) =>
                                  setAddressInfo({
                                    ...addressInfo,
                                    city: e.target.value,
                                  })
                                }
                                className="form-control-custom"
                              />
                            </Form.Group>
                          </Col>
                          <Col md={6}>
                            <Form.Group className="mb-4">
                              <Form.Label className="form-label-custom">
                                <i className="bi bi-map me-2"></i>State
                              </Form.Label>
                              <Form.Control
                                type="text"
                                placeholder="Enter your state"
                                value={addressInfo.state}
                                onChange={(e) =>
                                  setAddressInfo({
                                    ...addressInfo,
                                    state: e.target.value,
                                  })
                                }
                                className="form-control-custom"
                              />
                            </Form.Group>
                          </Col>
                        </Row>

                        <Row>
                          <Col md={6}>
                            <Form.Group className="mb-4">
                              <Form.Label className="form-label-custom">
                                <i className="bi bi-mailbox me-2"></i>PIN Code
                              </Form.Label>
                              <Form.Control
                                type="text"
                                placeholder="Enter PIN code"
                                value={addressInfo.pincode}
                                onChange={(e) =>
                                  setAddressInfo({
                                    ...addressInfo,
                                    pincode: e.target.value,
                                  })
                                }
                                className="form-control-custom"
                                maxLength={6}
                              />
                            </Form.Group>
                          </Col>
                          <Col md={6}>
                            <Form.Group className="mb-4">
                              <Form.Label className="form-label-custom">
                                <i className="bi bi-signpost me-2"></i>Landmark (Optional)
                              </Form.Label>
                              <Form.Control
                                type="text"
                                placeholder="Enter nearby landmark"
                                value={addressInfo.landmark}
                                onChange={(e) =>
                                  setAddressInfo({
                                    ...addressInfo,
                                    landmark: e.target.value,
                                  })
                                }
                                className="form-control-custom"
                              />
                            </Form.Group>
                          </Col>
                        </Row>

                        <div className="text-end">
                          <ThemeButton
                            type="submit"
                            variant="primary"
                            disabled={loading}
                            icon={loading ? "bi-arrow-clockwise" : "bi-check-circle"}
                            size="lg"
                          >
                            {loading ? "Updating..." : "Update Address Information"}
                          </ThemeButton>
                        </div>
                      </Form>
                    </Tab.Pane>

                    {/* Security Settings Tab */}
                    <Tab.Pane eventKey="security">
                      <Row>
                        <Col md={8}>
                          <div className="security-section">
                            <div className="mb-4">
                              <h5 className="mb-3">
                                <i className="bi bi-shield-lock me-2 text-primary"></i>
                                Password & Security
                              </h5>
                              <p className="text-muted">
                                Keep your account secure by using a strong password and enabling additional security features.
                              </p>
                            </div>

                            <Card className="border-light shadow-sm mb-4">
                              <Card.Body>
                                <Row>
                                  <Col md={8}>
                                    <h6 className="mb-2">
                                      <i className="bi bi-key me-2"></i>Password
                                    </h6>
                                    <p className="text-muted mb-0">
                                      Last changed 30 days ago
                                    </p>
                                  </Col>
                                  <Col md={4} className="text-end">
                                    <ThemeButton
                                      variant="outline"
                                      onClick={() => setShowPasswordModal(true)}
                                      icon="bi-pencil"
                                    >
                                      Change Password
                                    </ThemeButton>
                                  </Col>
                                </Row>
                              </Card.Body>
                            </Card>

                            <Card className="border-light shadow-sm mb-4">
                              <Card.Body>
                                <Row>
                                  <Col md={8}>
                                    <h6 className="mb-2">
                                      <i className="bi bi-envelope-check me-2"></i>Email Verification
                                    </h6>
                                    <p className="text-muted mb-0">
                                      Your email address is verified
                                    </p>
                                  </Col>
                                  <Col md={4} className="text-end">
                                    <Badge bg="success" className="px-3 py-2">
                                      <i className="bi bi-check-circle me-1"></i>Verified
                                    </Badge>
                                  </Col>
                                </Row>
                              </Card.Body>
                            </Card>

                            <Card className="border-light shadow-sm">
                              <Card.Body>
                                <Row>
                                  <Col md={8}>
                                    <h6 className="mb-2">
                                      <i className="bi bi-phone-vibrate me-2"></i>Two-Factor Authentication
                                    </h6>
                                    <p className="text-muted mb-0">
                                      Add an extra layer of security to your account
                                    </p>
                                  </Col>
                                  <Col md={4} className="text-end">
                                    <ThemeButton
                                      variant="outline"
                                      icon="bi-shield-plus"
                                    >
                                      Enable 2FA
                                    </ThemeButton>
                                  </Col>
                                </Row>
                              </Card.Body>
                            </Card>
                          </div>
                        </Col>
                        <Col md={4}>
                          <Card className="border-primary bg-light">
                            <Card.Body className="text-center">
                              <i className="bi bi-shield-check display-4 text-primary mb-3"></i>
                              <h6>Security Tips</h6>
                              <ul className="list-unstyled text-start small">
                                <li className="mb-2">
                                  <i className="bi bi-check text-success me-2"></i>
                                  Use a strong, unique password
                                </li>
                                <li className="mb-2">
                                  <i className="bi bi-check text-success me-2"></i>
                                  Enable two-factor authentication
                                </li>
                                <li className="mb-2">
                                  <i className="bi bi-check text-success me-2"></i>
                                  Keep your email address updated
                                </li>
                                <li className="mb-0">
                                  <i className="bi bi-check text-success me-2"></i>
                                  Log out from shared devices
                                </li>
                              </ul>
                            </Card.Body>
                          </Card>
                        </Col>
                      </Row>
                    </Tab.Pane>
                  </Tab.Content>
                </Tab.Container>
              </ThemeCard>
            </Col>
          </Row>
        </Container>
      </ThemeSection>

      {/* Change Password Modal */}
      <Modal
        show={showPasswordModal}
        onHide={() => setShowPasswordModal(false)}
        centered
        size="md"
      >
        <Modal.Header closeButton className="border-0">
          <Modal.Title>
            <i className="bi bi-key me-2"></i>Change Password
          </Modal.Title>
        </Modal.Header>
        <Modal.Body className="px-4">
          <Form onSubmit={handlePasswordSubmit}>
            <Form.Group className="mb-4">
              <Form.Label className="form-label-custom">
                <i className="bi bi-lock me-2"></i>Current Password
              </Form.Label>
              <Form.Control
                type="password"
                placeholder="Enter your current password"
                value={passwordData.currentPassword}
                onChange={(e) =>
                  setPasswordData({
                    ...passwordData,
                    currentPassword: e.target.value,
                  })
                }
                className="form-control-custom"
                required
              />
            </Form.Group>

            <Form.Group className="mb-4">
              <Form.Label className="form-label-custom">
                <i className="bi bi-shield-lock me-2"></i>New Password
              </Form.Label>
              <Form.Control
                type="password"
                placeholder="Enter your new password"
                value={passwordData.newPassword}
                onChange={(e) =>
                  setPasswordData({
                    ...passwordData,
                    newPassword: e.target.value,
                  })
                }
                className="form-control-custom"
                minLength={6}
                required
              />
              <Form.Text className="text-muted">
                Password must be at least 6 characters long
              </Form.Text>
            </Form.Group>

            <Form.Group className="mb-4">
              <Form.Label className="form-label-custom">
                <i className="bi bi-shield-check me-2"></i>Confirm New Password
              </Form.Label>
              <Form.Control
                type="password"
                placeholder="Confirm your new password"
                value={passwordData.confirmPassword}
                onChange={(e) =>
                  setPasswordData({
                    ...passwordData,
                    confirmPassword: e.target.value,
                  })
                }
                className="form-control-custom"
                required
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer className="border-0 px-4">
          <Button
            variant="secondary"
            onClick={() => setShowPasswordModal(false)}
            disabled={loading}
          >
            Cancel
          </Button>
          <ThemeButton
            variant="primary"
            onClick={handlePasswordSubmit}
            disabled={loading}
            icon={loading ? "bi-arrow-clockwise" : "bi-check-circle"}
          >
            {loading ? "Changing..." : "Change Password"}
          </ThemeButton>
        </Modal.Footer>
      </Modal>
    </div>
  );
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