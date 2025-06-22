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
} from "react-bootstrap";
import { useSelector, useDispatch } from "react-redux";

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

  // Initialize form data
  useEffect(() => {
    if (user) {
      setPersonalInfo({
        fullName: user.fullName || "",
        email: user.email || "",
        mobile: user.mobile || "",
        dateOfBirth: user.dateOfBirth || "",
        gender: user.gender || "",
        profileImage: user.profileImage || "",
      });

      setAddressInfo({
        street: user.address?.street || "",
        city: user.address?.city || "",
        state: user.address?.state || "",
        pincode: user.address?.pincode || "",
        landmark: user.address?.landmark || "",
      });
    }
  }, [user]);

  const showAlert = (message, variant) => {
    setAlert({ show: true, message, variant });
    setTimeout(() => setAlert({ show: false, message: "", variant: "" }), 5000);
  };

  const handlePersonalInfoChange = (e) => {
    const { name, value } = e.target;
    setPersonalInfo((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddressChange = (e) => {
    const { name, value } = e.target;
    setAddressInfo((prev) => ({ ...prev, [name]: value }));
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordData((prev) => ({ ...prev, [name]: value }));
  };

  const handlePersonalInfoSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 2000));

      // In real app, this would update the user in Redux store and backend
      showAlert("Personal information updated successfully!", "success");
    } catch (error) {
      showAlert(
        "Failed to update personal information. Please try again.",
        "danger",
      );
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

    // Validation
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

      // Reset form
      setPasswordData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
      setShowPasswordModal(false);

      showAlert("Password changed successfully!", "success");
    } catch (error) {
      showAlert(
        "Failed to change password. Please check your current password.",
        "danger",
      );
    } finally {
      setLoading(false);
    }
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith("image/")) {
      showAlert("Please select a valid image file.", "danger");
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      showAlert("Image size should be less than 5MB.", "danger");
      return;
    }

    setLoading(true);

    try {
      // Simulate image upload
      await new Promise((resolve) => setTimeout(resolve, 2000));

      // Create temporary URL for preview
      const imageUrl = URL.createObjectURL(file);
      setPersonalInfo((prev) => ({ ...prev, profileImage: imageUrl }));

      showAlert("Profile image uploaded successfully!", "success");
    } catch (error) {
      showAlert("Failed to upload image. Please try again.", "danger");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="section-padding">
      <Container>
        <Row>
          <Col lg={12}>
            <div className="text-center mb-4">
              <h2 className="section-title">My Profile</h2>
              <p className="text-muted">
                Manage your account settings and personal information
              </p>
            </div>
          </Col>
        </Row>

        {alert.show && (
          <Row>
            <Col lg={12}>
              <Alert variant={alert.variant} className="mb-4">
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
            <Card className="medical-card">
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
                        <Row>
                          <Col lg={12} className="text-center mb-4">
                            <div className="profile-image-container">
                              <div className="profile-image-wrapper">
                                <img
                                  src={
                                    personalInfo.profileImage ||
                                    "https://via.placeholder.com/150x150/e6e6e6/666666?text=User"
                                  }
                                  alt="Profile"
                                  className="profile-image"
                                />
                                <div className="profile-image-overlay">
                                  <label
                                    htmlFor="profileImageInput"
                                    className="btn btn-sm btn-light"
                                  >
                                    <i className="bi bi-camera"></i>
                                  </label>
                                  <input
                                    type="file"
                                    id="profileImageInput"
                                    accept="image/*"
                                    onChange={handleImageUpload}
                                    style={{ display: "none" }}
                                  />
                                </div>
                              </div>
                              <p className="text-muted mt-2">
                                Click to change profile picture
                              </p>
                            </div>
                          </Col>
                        </Row>

                        <Row>
                          <Col md={6}>
                            <Form.Group className="mb-3">
                              <Form.Label>Full Name *</Form.Label>
                              <Form.Control
                                type="text"
                                name="fullName"
                                value={personalInfo.fullName}
                                onChange={handlePersonalInfoChange}
                                required
                                placeholder="Enter your full name"
                              />
                            </Form.Group>
                          </Col>
                          <Col md={6}>
                            <Form.Group className="mb-3">
                              <Form.Label>Email Address</Form.Label>
                              <Form.Control
                                type="email"
                                name="email"
                                value={personalInfo.email}
                                disabled
                                className="bg-light"
                              />
                              <Form.Text className="text-muted">
                                Email cannot be changed for security reasons
                              </Form.Text>
                            </Form.Group>
                          </Col>
                        </Row>

                        <Row>
                          <Col md={6}>
                            <Form.Group className="mb-3">
                              <Form.Label>Mobile Number</Form.Label>
                              <Form.Control
                                type="tel"
                                name="mobile"
                                value={personalInfo.mobile}
                                disabled
                                className="bg-light"
                              />
                              <Form.Text className="text-muted">
                                Mobile number cannot be changed for security
                                reasons
                              </Form.Text>
                            </Form.Group>
                          </Col>
                          <Col md={6}>
                            <Form.Group className="mb-3">
                              <Form.Label>
                                Date of Birth (DD/MM/YYYY)
                              </Form.Label>
                              <Form.Control
                                type="text"
                                name="dateOfBirth"
                                value={personalInfo.dateOfBirth}
                                onChange={handlePersonalInfoChange}
                                placeholder="DD/MM/YYYY"
                                pattern="\d{2}/\d{2}/\d{4}"
                                maxLength="10"
                              />
                            </Form.Group>
                          </Col>
                        </Row>

                        <Row>
                          <Col md={6}>
                            <Form.Group className="mb-3">
                              <Form.Label>Gender</Form.Label>
                              <Form.Select
                                name="gender"
                                value={personalInfo.gender}
                                onChange={handlePersonalInfoChange}
                              >
                                <option value="">Select Gender</option>
                                <option value="male">Male</option>
                                <option value="female">Female</option>
                                <option value="other">Other</option>
                                <option value="prefer_not_to_say">
                                  Prefer not to say
                                </option>
                              </Form.Select>
                            </Form.Group>
                          </Col>
                        </Row>

                        <div className="text-end">
                          <Button
                            type="submit"
                            className="btn-medical-primary"
                            disabled={loading}
                          >
                            {loading ? (
                              <>
                                <Spinner size="sm" className="me-2" />
                                Updating...
                              </>
                            ) : (
                              <>
                                <i className="bi bi-check me-2"></i>
                                Update Personal Information
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
                          <Col lg={12}>
                            <Form.Group className="mb-3">
                              <Form.Label>Street Address *</Form.Label>
                              <Form.Control
                                as="textarea"
                                rows={3}
                                name="street"
                                value={addressInfo.street}
                                onChange={handleAddressChange}
                                required
                                placeholder="Enter your complete street address"
                              />
                            </Form.Group>
                          </Col>
                        </Row>

                        <Row>
                          <Col md={6}>
                            <Form.Group className="mb-3">
                              <Form.Label>City *</Form.Label>
                              <Form.Control
                                type="text"
                                name="city"
                                value={addressInfo.city}
                                onChange={handleAddressChange}
                                required
                                placeholder="Enter city"
                              />
                            </Form.Group>
                          </Col>
                          <Col md={6}>
                            <Form.Group className="mb-3">
                              <Form.Label>State *</Form.Label>
                              <Form.Select
                                name="state"
                                value={addressInfo.state}
                                onChange={handleAddressChange}
                                required
                              >
                                <option value="">Select State</option>
                                <option value="gujarat">Gujarat</option>
                                <option value="maharashtra">Maharashtra</option>
                                <option value="rajasthan">Rajasthan</option>
                                <option value="madhya_pradesh">
                                  Madhya Pradesh
                                </option>
                                <option value="other">Other</option>
                              </Form.Select>
                            </Form.Group>
                          </Col>
                        </Row>

                        <Row>
                          <Col md={6}>
                            <Form.Group className="mb-3">
                              <Form.Label>PIN Code *</Form.Label>
                              <Form.Control
                                type="text"
                                name="pincode"
                                value={addressInfo.pincode}
                                onChange={handleAddressChange}
                                required
                                placeholder="Enter PIN code"
                                maxLength={6}
                              />
                            </Form.Group>
                          </Col>
                          <Col md={6}>
                            <Form.Group className="mb-3">
                              <Form.Label>Landmark</Form.Label>
                              <Form.Control
                                type="text"
                                name="landmark"
                                value={addressInfo.landmark}
                                onChange={handleAddressChange}
                                placeholder="Enter nearby landmark (optional)"
                              />
                            </Form.Group>
                          </Col>
                        </Row>

                        <div className="text-end">
                          <Button
                            type="submit"
                            className="btn-medical-primary"
                            disabled={loading}
                          >
                            {loading ? (
                              <>
                                <Spinner size="sm" className="me-2" />
                                Updating...
                              </>
                            ) : (
                              <>
                                <i className="bi bi-check me-2"></i>
                                Update Address
                              </>
                            )}
                          </Button>
                        </div>
                      </Form>
                    </Tab.Pane>

                    {/* Security Tab */}
                    <Tab.Pane eventKey="security">
                      <div className="security-section">
                        <h5 className="text-medical-red mb-4">
                          Account Security
                        </h5>

                        <Row>
                          <Col lg={8}>
                            <Card className="border-0 bg-light">
                              <Card.Body>
                                <div className="d-flex justify-content-between align-items-center">
                                  <div>
                                    <h6 className="mb-1">Password</h6>
                                    <p className="text-muted mb-0">
                                      Last changed: Never (or show actual date)
                                    </p>
                                  </div>
                                  <Button
                                    variant="outline-primary"
                                    size="sm"
                                    onClick={() => setShowPasswordModal(true)}
                                  >
                                    <i className="bi bi-key me-1"></i>
                                    Change Password
                                  </Button>
                                </div>
                              </Card.Body>
                            </Card>

                            <Card className="border-0 bg-light mt-3">
                              <Card.Body>
                                <div className="d-flex justify-content-between align-items-center">
                                  <div>
                                    <h6 className="mb-1">Email Verification</h6>
                                    <p className="text-muted mb-0">
                                      {personalInfo.email}
                                      <span className="badge bg-success ms-2">
                                        Verified
                                      </span>
                                    </p>
                                  </div>
                                </div>
                              </Card.Body>
                            </Card>

                            <Card className="border-0 bg-light mt-3">
                              <Card.Body>
                                <div className="d-flex justify-content-between align-items-center">
                                  <div>
                                    <h6 className="mb-1">
                                      Mobile Verification
                                    </h6>
                                    <p className="text-muted mb-0">
                                      {personalInfo.mobile}
                                      <span className="badge bg-success ms-2">
                                        Verified
                                      </span>
                                    </p>
                                  </div>
                                </div>
                              </Card.Body>
                            </Card>
                          </Col>
                        </Row>

                        <div className="mt-4">
                          <h6 className="text-muted">Security Tips</h6>
                          <ul className="security-tips">
                            <li>
                              Use a strong password with at least 8 characters
                            </li>
                            <li>
                              Include uppercase, lowercase, numbers, and special
                              characters
                            </li>
                            <li>Don't share your password with anyone</li>
                            <li>Change your password regularly</li>
                            <li>Log out from shared devices</li>
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

      {/* Password Change Modal */}
      <Modal
        show={showPasswordModal}
        onHide={() => setShowPasswordModal(false)}
      >
        <Modal.Header closeButton>
          <Modal.Title>Change Password</Modal.Title>
        </Modal.Header>
        <Form onSubmit={handlePasswordSubmit}>
          <Modal.Body>
            <Form.Group className="mb-3">
              <Form.Label>Current Password *</Form.Label>
              <Form.Control
                type="password"
                name="currentPassword"
                value={passwordData.currentPassword}
                onChange={handlePasswordChange}
                required
                placeholder="Enter current password"
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>New Password *</Form.Label>
              <Form.Control
                type="password"
                name="newPassword"
                value={passwordData.newPassword}
                onChange={handlePasswordChange}
                required
                placeholder="Enter new password"
                minLength={6}
              />
              <Form.Text className="text-muted">
                Password must be at least 6 characters long
              </Form.Text>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Confirm New Password *</Form.Label>
              <Form.Control
                type="password"
                name="confirmPassword"
                value={passwordData.confirmPassword}
                onChange={handlePasswordChange}
                required
                placeholder="Confirm new password"
                minLength={6}
              />
            </Form.Group>
          </Modal.Body>
          <Modal.Footer>
            <Button
              variant="secondary"
              onClick={() => setShowPasswordModal(false)}
            >
              Cancel
            </Button>
            <Button type="submit" variant="primary" disabled={loading}>
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

      <style>{`
        .profile-image-container {
          position: relative;
          display: inline-block;
        }

        .profile-image-wrapper {
          position: relative;
          display: inline-block;
        }

        .profile-image {
          width: 150px;
          height: 150px;
          border-radius: 50%;
          object-fit: cover;
          border: 4px solid #e9ecef;
        }

        .profile-image-overlay {
          position: absolute;
          bottom: 10px;
          right: 10px;
          background: rgba(0, 0, 0, 0.7);
          border-radius: 50%;
          width: 35px;
          height: 35px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .profile-image-overlay label {
          margin: 0;
          cursor: pointer;
          color: white;
        }

        .security-tips {
          list-style: none;
          padding-left: 0;
        }

        .security-tips li {
          padding: 5px 0;
          position: relative;
          padding-left: 20px;
        }

        .security-tips li:before {
          content: "✓";
          position: absolute;
          left: 0;
          color: var(--medical-red);
          font-weight: bold;
        }
      `}</style>
    </div>
  );
};

export default UserProfile;
