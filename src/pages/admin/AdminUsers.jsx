import React, { useState, useEffect } from "react";
import {
  Container,
  Row,
  Col,
  Card,
  Button,
  Table,
  Badge,
  Modal,
  Form,
  InputGroup,
} from "react-bootstrap";

const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState("");

  // Mock users data
  const mockUsers = [
    {
      id: 1,
      name: "John Doe",
      email: "john.doe@example.com",
      mobile: "+91 9876543210",
      gender: "male",
      age: 32,
      role: 0,
      emailVerified: true,
      registrationDate: "2024-01-10",
      lastLogin: "2024-01-15",
      totalOrders: 5,
      totalSpent: 1250.75,
      status: "Active",
      address: "123 Medical Street, Surat, Gujarat, 395007",
    },
    {
      id: 2,
      name: "Jane Smith",
      email: "jane.smith@example.com",
      mobile: "+91 8765432109",
      gender: "female",
      age: 28,
      role: 0,
      emailVerified: true,
      registrationDate: "2024-01-08",
      lastLogin: "2024-01-14",
      totalOrders: 3,
      totalSpent: 675.5,
      status: "Active",
      address: "456 Health Avenue, Ahmedabad, Gujarat, 380001",
    },
    {
      id: 3,
      name: "Mike Johnson",
      email: "mike.johnson@example.com",
      mobile: "+91 7654321098",
      gender: "male",
      age: 45,
      role: 0,
      emailVerified: false,
      registrationDate: "2024-01-05",
      lastLogin: "2024-01-12",
      totalOrders: 1,
      totalSpent: 1364.99,
      status: "Active",
      address: "789 Wellness Road, Vadodara, Gujarat, 390001",
    },
    {
      id: 4,
      name: "Admin User",
      email: "admin@gmail.com",
      mobile: "+91 9999999999",
      gender: "male",
      age: 35,
      role: 1,
      emailVerified: true,
      registrationDate: "2024-01-01",
      lastLogin: "2024-01-15",
      totalOrders: 0,
      totalSpent: 0,
      status: "Active",
      address: "Admin Address",
    },
  ];

  useEffect(() => {
    setUsers(mockUsers);
  }, []);

  const roleOptions = [
    { value: "", label: "All Roles" },
    { value: "0", label: "Users" },
    { value: "1", label: "Admins" },
  ];

  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.mobile.includes(searchTerm);
    const matchesRole = !roleFilter || user.role.toString() === roleFilter;
    return matchesSearch && matchesRole;
  });

  const handleViewDetails = (user) => {
    setSelectedUser(user);
    setShowDetailsModal(true);
  };

  const handleStatusChange = (userId, newStatus) => {
    setUsers((prev) =>
      prev.map((user) =>
        user.id === userId ? { ...user, status: newStatus } : user,
      ),
    );
  };

  const handleRoleChange = (userId, newRole) => {
    setUsers((prev) =>
      prev.map((user) =>
        user.id === userId ? { ...user, role: parseInt(newRole) } : user,
      ),
    );
  };

  const getRoleBadge = (role) => {
    return role === 1 ? (
      <Badge bg="danger">Admin</Badge>
    ) : (
      <Badge bg="primary">User</Badge>
    );
  };

  const getStatusBadge = (status) => {
    return status === "Active" ? (
      <Badge bg="success">Active</Badge>
    ) : (
      <Badge bg="secondary">Inactive</Badge>
    );
  };

  const getUserStats = () => {
    const totalUsers = users.length;
    const activeUsers = users.filter((u) => u.status === "Active").length;
    const adminUsers = users.filter((u) => u.role === 1).length;
    const verifiedUsers = users.filter((u) => u.emailVerified).length;

    return { totalUsers, activeUsers, adminUsers, verifiedUsers };
  };

  const stats = getUserStats();

  return (
    <div className="fade-in">
      <section className="section-padding-sm">
        <Container>
          {/* Header */}
          <Row className="mb-4">
            <Col lg={12}>
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <h2>User Management</h2>
                  <p className="text-muted">
                    Manage user accounts and permissions
                  </p>
                </div>
              </div>
            </Col>
          </Row>

          {/* User Statistics */}
          <Row className="mb-4">
            <Col lg={3} md={6} className="mb-3">
              <Card className="medical-card text-center h-100">
                <Card.Body>
                  <h3 className="text-medical-blue">{stats.totalUsers}</h3>
                  <p className="mb-0 small">Total Users</p>
                </Card.Body>
              </Card>
            </Col>
            <Col lg={3} md={6} className="mb-3">
              <Card className="medical-card text-center h-100">
                <Card.Body>
                  <h3 className="text-medical-green">{stats.activeUsers}</h3>
                  <p className="mb-0 small">Active Users</p>
                </Card.Body>
              </Card>
            </Col>
            <Col lg={3} md={6} className="mb-3">
              <Card className="medical-card text-center h-100">
                <Card.Body>
                  <h3 className="text-medical-red">{stats.adminUsers}</h3>
                  <p className="mb-0 small">Admin Users</p>
                </Card.Body>
              </Card>
            </Col>
            <Col lg={3} md={6} className="mb-3">
              <Card className="medical-card text-center h-100">
                <Card.Body>
                  <h3 className="text-warning">{stats.verifiedUsers}</h3>
                  <p className="mb-0 small">Verified Users</p>
                </Card.Body>
              </Card>
            </Col>
          </Row>

          {/* Filters */}
          <Row className="mb-4">
            <Col lg={6}>
              <InputGroup>
                <InputGroup.Text>
                  <i className="bi bi-search"></i>
                </InputGroup.Text>
                <Form.Control
                  type="text"
                  placeholder="Search users by name, email, or mobile..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </InputGroup>
            </Col>
            <Col lg={3}>
              <Form.Select
                value={roleFilter}
                onChange={(e) => setRoleFilter(e.target.value)}
              >
                {roleOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </Form.Select>
            </Col>
            <Col lg={3}>
              <Button
                variant="outline-secondary"
                onClick={() => {
                  setSearchTerm("");
                  setRoleFilter("");
                }}
              >
                Clear Filters
              </Button>
            </Col>
          </Row>

          {/* Users Table */}
          <Card className="medical-card">
            <Card.Header className="bg-medical-light">
              <h5 className="mb-0">
                <i className="bi bi-people me-2"></i>
                Users ({filteredUsers.length})
              </h5>
            </Card.Header>
            <Card.Body className="p-0">
              <div className="table-responsive">
                <Table className="mb-0">
                  <thead className="table-light">
                    <tr>
                      <th>User</th>
                      <th>Contact</th>
                      <th>Role</th>
                      <th>Status</th>
                      <th>Orders</th>
                      <th>Total Spent</th>
                      <th>Registration</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredUsers.map((user) => (
                      <tr key={user.id}>
                        <td>
                          <div className="d-flex align-items-center">
                            <div
                              className="bg-medical-red text-white rounded-circle d-flex align-items-center justify-content-center me-3"
                              style={{ width: "40px", height: "40px" }}
                            >
                              <i className="bi bi-person-fill"></i>
                            </div>
                            <div>
                              <div className="fw-bold">{user.name}</div>
                              <small className="text-muted">
                                {user.gender} • {user.age} years
                                {user.emailVerified && (
                                  <i className="bi bi-patch-check-fill text-success ms-2"></i>
                                )}
                              </small>
                            </div>
                          </div>
                        </td>
                        <td>
                          <div>
                            <div>{user.email}</div>
                            <small className="text-muted">{user.mobile}</small>
                          </div>
                        </td>
                        <td>
                          <Form.Select
                            size="sm"
                            value={user.role}
                            onChange={(e) =>
                              handleRoleChange(user.id, e.target.value)
                            }
                            style={{ minWidth: "100px" }}
                          >
                            <option value={0}>User</option>
                            <option value={1}>Admin</option>
                          </Form.Select>
                        </td>
                        <td>
                          <Form.Select
                            size="sm"
                            value={user.status}
                            onChange={(e) =>
                              handleStatusChange(user.id, e.target.value)
                            }
                            style={{ minWidth: "100px" }}
                          >
                            <option value="Active">Active</option>
                            <option value="Inactive">Inactive</option>
                          </Form.Select>
                        </td>
                        <td>
                          <Badge bg="secondary">{user.totalOrders}</Badge>
                        </td>
                        <td>
                          <span className="fw-bold">
                            ₹{user.totalSpent.toFixed(2)}
                          </span>
                        </td>
                        <td>
                          <div>{user.registrationDate}</div>
                          <small className="text-muted">
                            Last: {user.lastLogin}
                          </small>
                        </td>
                        <td>
                          <Button
                            size="sm"
                            variant="outline-primary"
                            onClick={() => handleViewDetails(user)}
                            className="btn-medical-outline"
                          >
                            <i className="bi bi-eye me-1"></i>
                            View
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              </div>
            </Card.Body>
          </Card>
        </Container>
      </section>

      {/* User Details Modal */}
      <Modal
        show={showDetailsModal}
        onHide={() => setShowDetailsModal(false)}
        size="lg"
      >
        <Modal.Header closeButton>
          <Modal.Title>User Details - {selectedUser?.name}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedUser && (
            <div>
              {/* Personal Information */}
              <Card className="mb-4">
                <Card.Header>
                  <h6 className="mb-0">Personal Information</h6>
                </Card.Header>
                <Card.Body>
                  <Row>
                    <Col md={6}>
                      <p>
                        <strong>Full Name:</strong> {selectedUser.name}
                      </p>
                      <p>
                        <strong>Email:</strong> {selectedUser.email}
                      </p>
                      <p>
                        <strong>Mobile:</strong> {selectedUser.mobile}
                      </p>
                    </Col>
                    <Col md={6}>
                      <p>
                        <strong>Gender:</strong> {selectedUser.gender}
                      </p>
                      <p>
                        <strong>Age:</strong> {selectedUser.age} years
                      </p>
                      <p>
                        <strong>Role:</strong> {getRoleBadge(selectedUser.role)}
                      </p>
                    </Col>
                  </Row>
                  <Row>
                    <Col md={12}>
                      <p>
                        <strong>Address:</strong>
                      </p>
                      <p className="text-muted">{selectedUser.address}</p>
                    </Col>
                  </Row>
                </Card.Body>
              </Card>

              {/* Account Information */}
              <Card className="mb-4">
                <Card.Header>
                  <h6 className="mb-0">Account Information</h6>
                </Card.Header>
                <Card.Body>
                  <Row>
                    <Col md={6}>
                      <p>
                        <strong>Status:</strong>{" "}
                        {getStatusBadge(selectedUser.status)}
                      </p>
                      <p>
                        <strong>Email Verified:</strong>
                        {selectedUser.emailVerified ? (
                          <Badge bg="success" className="ms-2">
                            Verified
                          </Badge>
                        ) : (
                          <Badge bg="warning" className="ms-2">
                            Pending
                          </Badge>
                        )}
                      </p>
                      <p>
                        <strong>Registration Date:</strong>{" "}
                        {selectedUser.registrationDate}
                      </p>
                    </Col>
                    <Col md={6}>
                      <p>
                        <strong>Last Login:</strong> {selectedUser.lastLogin}
                      </p>
                      <p>
                        <strong>Total Orders:</strong>{" "}
                        {selectedUser.totalOrders}
                      </p>
                      <p>
                        <strong>Total Spent:</strong> ₹
                        {selectedUser.totalSpent.toFixed(2)}
                      </p>
                    </Col>
                  </Row>
                </Card.Body>
              </Card>
            </div>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant="secondary"
            onClick={() => setShowDetailsModal(false)}
          >
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default AdminUsers;
