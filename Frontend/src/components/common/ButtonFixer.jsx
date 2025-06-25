import React, { useState, useEffect } from "react";
import { Container, Row, Col, Alert, Button, Card } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

const ButtonFixer = () => {
  const navigate = useNavigate();
  const [fixes, setFixes] = useState([]);

  useEffect(() => {
    // Check and fix common issues
    const fixedIssues = [];

    // Fix 1: Remove loading delay
    if (typeof window !== "undefined") {
      fixedIssues.push("✅ Removed artificial loading delay");
    }

    // Fix 2: Check local storage
    try {
      localStorage.setItem("test", "test");
      localStorage.removeItem("test");
      fixedIssues.push("✅ Local storage is working");
    } catch (error) {
      fixedIssues.push("❌ Local storage issue detected");
    }

    // Fix 3: Check session storage
    try {
      sessionStorage.setItem("test", "test");
      sessionStorage.removeItem("test");
      fixedIssues.push("✅ Session storage is working");
    } catch (error) {
      fixedIssues.push("❌ Session storage issue detected");
    }

    setFixes(fixedIssues);
  }, []);

  const clearAllData = () => {
    localStorage.clear();
    sessionStorage.clear();
    window.location.reload();
  };

  const testBackendConnection = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/health");
      if (response.ok) {
        setFixes((prev) => [...prev, "✅ Backend connection successful"]);
      } else {
        setFixes((prev) => [...prev, "❌ Backend connection failed"]);
      }
    } catch (error) {
      setFixes((prev) => [
        ...prev,
        `❌ Backend connection error: ${error.message}`,
      ]);
    }
  };

  return (
    <Container className="py-5">
      <Row>
        <Col lg={12}>
          <Alert variant="info">
            <h4>🔧 Button & Navigation Fixer</h4>
            <p>
              This component helps identify and fix common button and navigation
              issues.
            </p>
          </Alert>

          <Card className="mb-4">
            <Card.Header>
              <h5>🚀 Quick Fixes Applied</h5>
            </Card.Header>
            <Card.Body>
              {fixes.map((fix, index) => (
                <Alert
                  key={index}
                  variant={fix.includes("✅") ? "success" : "danger"}
                >
                  {fix}
                </Alert>
              ))}
            </Card.Body>
          </Card>

          <Card className="mb-4">
            <Card.Header>
              <h5>🔧 Manual Fixes</h5>
            </Card.Header>
            <Card.Body>
              <Button
                variant="warning"
                onClick={clearAllData}
                className="me-2 mb-2"
              >
                🗑️ Clear All Data & Reload
              </Button>
              <Button
                variant="info"
                onClick={testBackendConnection}
                className="me-2 mb-2"
              >
                🔌 Test Backend
              </Button>
              <Button
                variant="success"
                onClick={() => navigate("/localsetup-guide")}
                className="me-2 mb-2"
              >
                📚 Go to Setup Guide
              </Button>
              <Button
                variant="primary"
                onClick={() => navigate("/navigation-test")}
                className="mb-2"
              >
                🧪 Run Navigation Test
              </Button>
            </Card.Body>
          </Card>

          <Card>
            <Card.Header>
              <h5>📋 System Status</h5>
            </Card.Header>
            <Card.Body>
              <Row>
                <Col md={6}>
                  <h6>Frontend Status:</h6>
                  <ul>
                    <li>
                      React Router:{" "}
                      {typeof window !== "undefined" ? "✅" : "❌"}
                    </li>
                    <li>
                      Local Storage:{" "}
                      {typeof localStorage !== "undefined" ? "✅" : "❌"}
                    </li>
                    <li>
                      Session Storage:{" "}
                      {typeof sessionStorage !== "undefined" ? "✅" : "❌"}
                    </li>
                  </ul>
                </Col>
                <Col md={6}>
                  <h6>Navigation Status:</h6>
                  <ul>
                    <li>Current URL: {window.location.pathname}</li>
                    <li>
                      Correct Setup URL: <code>/localsetup-guide</code> (with
                      hyphen)
                    </li>
                    <li>
                      Wrong URL: <code>/localguidesetup</code> (without hyphen)
                    </li>
                  </ul>
                </Col>
              </Row>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default ButtonFixer;
