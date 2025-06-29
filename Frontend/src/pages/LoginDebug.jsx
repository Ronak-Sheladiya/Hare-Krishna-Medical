import React, { useState, useEffect } from "react";
import {
  Container,
  Row,
  Col,
  Card,
  Button,
  Form,
  Alert,
  Table,
} from "react-bootstrap";

const LoginDebug = () => {
  const [users, setUsers] = useState([]);
  const [testResults, setTestResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const [testCredentials] = useState([
    { email: "admin@gmail.com", password: "Ronak@95865", name: "Main Admin" },
    {
      email: "ronaksheladiya652@gmail.com",
      password: "admin@123",
      name: "Ronak Admin",
    },
    {
      email: "mayurgajera098@gmail.com",
      password: "admin@123",
      name: "Mayur Admin",
    },
    {
      email: "admin@harekrishnamedical.com",
      password: "admin123",
      name: "Fallback Admin",
    },
    { email: "user@test.com", password: "admin123", name: "Test User" },
  ]);

  const [customTest, setCustomTest] = useState({
    email: "",
    password: "",
  });

  useEffect(() => {
    checkBackendStatus();
    fetchUsers();
  }, []);

  const checkBackendStatus = async () => {
    try {
      const response = await fetch("/api/health");
      const data = await response.json();
      console.log("Backend status:", data);
    } catch (error) {
      console.error("Backend health check failed:", error);
    }
  };

  const fetchUsers = async () => {
    try {
      const response = await fetch("/api/debug-auth/users");
      const data = await response.json();
      setUsers(data.users || []);
      console.log("Users in database:", data);
    } catch (error) {
      console.error("Failed to fetch users:", error);
      setError("Failed to fetch users: " + error.message);
    }
  };

  const testLogin = async (credentials) => {
    setLoading(true);
    try {
      console.log("Testing login for:", credentials.email);

      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: credentials.email,
          password: credentials.password,
        }),
      });

      const data = await response.json();

      const result = {
        ...credentials,
        success: response.ok,
        message: data.message,
        error: !response.ok ? data.message : null,
        timestamp: new Date().toLocaleTimeString(),
      };

      setTestResults((prev) => [result, ...prev]);

      if (response.ok) {
        console.log("✅ Login successful:", data);
      } else {
        console.log("❌ Login failed:", data);
      }
    } catch (error) {
      console.error("Login test error:", error);
      const result = {
        ...credentials,
        success: false,
        message: "Network error",
        error: error.message,
        timestamp: new Date().toLocaleTimeString(),
      };
      setTestResults((prev) => [result, ...prev]);
    } finally {
      setLoading(false);
    }
  };

  const testPasswordOnly = async (credentials) => {
    try {
      const response = await fetch("/api/debug-auth/test-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(credentials),
      });

      const data = await response.json();
      console.log("Password test result:", data);

      const result = {
        ...credentials,
        name: credentials.name + " (Password Test)",
        success: data.success,
        message: `Password ${data.success ? "matches" : "does not match"}`,
        error: !data.success ? "Password mismatch" : null,
        timestamp: new Date().toLocaleTimeString(),
      };

      setTestResults((prev) => [result, ...prev]);
    } catch (error) {
      console.error("Password test error:", error);
    }
  };

  const createTestUser = async () => {
    try {
      const response = await fetch("/api/debug-auth/create-test-user", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });

      const data = await response.json();
      console.log("Test user created:", data);

      // Refresh users list
      fetchUsers();

      // Add to test results
      const result = {
        email: data.email,
        name: "New Test User",
        success: true,
        message: "Test user created successfully",
        timestamp: new Date().toLocaleTimeString(),
      };
      setTestResults((prev) => [result, ...prev]);
    } catch (error) {
      console.error("Failed to create test user:", error);
    }
  };

  const handleCustomTest = (e) => {
    e.preventDefault();
    if (customTest.email && customTest.password) {
      testLogin({ ...customTest, name: "Custom Test" });
    }
  };

  return (
    <Container className="py-4">
      <Row>
        <Col>
          <Card>
            <Card.Header>
              <h4>🔐 Login Debug Tool</h4>
            </Card.Header>
            <Card.Body>
              {error && <Alert variant="danger">{error}</Alert>}

              <Row>
                <Col md={6}>
                  <h5>Database Users ({users.length})</h5>
                  {users.length > 0 ? (
                    <Table striped bordered hover size="sm">
                      <thead>
                        <tr>
                          <th>Email</th>
                          <th>Name</th>
                          <th>Role</th>
                          <th>Active</th>
                        </tr>
                      </thead>
                      <tbody>
                        {users.map((user, index) => (
                          <tr key={index}>
                            <td>{user.email}</td>
                            <td>{user.fullName}</td>
                            <td>{user.role === 1 ? "Admin" : "User"}</td>
                            <td>{user.isActive ? "✅" : "❌"}</td>
                          </tr>
                        ))}
                      </tbody>
                    </Table>
                  ) : (
                    <Alert variant="info">No users found in database</Alert>
                  )}

                  <Button
                    variant="secondary"
                    onClick={fetchUsers}
                    className="me-2"
                  >
                    Refresh Users
                  </Button>

                  <Button variant="primary" onClick={createTestUser}>
                    Create Test User
                  </Button>
                </Col>

                <Col md={6}>
                  <h5>Test Credentials</h5>
                  {testCredentials.map((cred, index) => (
                    <div key={index} className="mb-2">
                      <small className="text-muted">{cred.name}:</small>
                      <br />
                      <code>
                        {cred.email} / {cred.password}
                      </code>
                      <div className="mt-1">
                        <Button
                          size="sm"
                          variant="success"
                          onClick={() => testLogin(cred)}
                          disabled={loading}
                          className="me-2"
                        >
                          Test Login
                        </Button>
                        <Button
                          size="sm"
                          variant="info"
                          onClick={() => testPasswordOnly(cred)}
                          disabled={loading}
                        >
                          Test Password
                        </Button>
                      </div>
                    </div>
                  ))}

                  <hr />

                  <h6>Custom Test</h6>
                  <Form onSubmit={handleCustomTest}>
                    <Form.Group className="mb-2">
                      <Form.Control
                        type="email"
                        placeholder="Email"
                        value={customTest.email}
                        onChange={(e) =>
                          setCustomTest((prev) => ({
                            ...prev,
                            email: e.target.value,
                          }))
                        }
                      />
                    </Form.Group>
                    <Form.Group className="mb-2">
                      <Form.Control
                        type="password"
                        placeholder="Password"
                        value={customTest.password}
                        onChange={(e) =>
                          setCustomTest((prev) => ({
                            ...prev,
                            password: e.target.value,
                          }))
                        }
                      />
                    </Form.Group>
                    <Button type="submit" variant="primary" disabled={loading}>
                      Test Custom Login
                    </Button>
                  </Form>
                </Col>
              </Row>

              <hr />

              <h5>Test Results</h5>
              {testResults.length > 0 ? (
                <Table striped bordered hover>
                  <thead>
                    <tr>
                      <th>Time</th>
                      <th>Credentials</th>
                      <th>Result</th>
                      <th>Message</th>
                    </tr>
                  </thead>
                  <tbody>
                    {testResults.map((result, index) => (
                      <tr
                        key={index}
                        className={
                          result.success ? "table-success" : "table-danger"
                        }
                      >
                        <td>{result.timestamp}</td>
                        <td>
                          <strong>{result.name}</strong>
                          <br />
                          <small>{result.email}</small>
                        </td>
                        <td>{result.success ? "✅ Success" : "❌ Failed"}</td>
                        <td>{result.message || result.error}</td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              ) : (
                <Alert variant="info">No test results yet</Alert>
              )}

              <div className="mt-3">
                <Button variant="secondary" onClick={() => setTestResults([])}>
                  Clear Results
                </Button>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default LoginDebug;
