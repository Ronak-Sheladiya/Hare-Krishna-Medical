import React, { useState, useEffect } from "react";
import { Card, Button, Alert, Table, Badge } from "react-bootstrap";
import unifiedApi from "../../utils/unifiedApiClient";
import smartApi from "../../utils/smartApiClient";
import { getBackendURL } from "../../utils/config";

const APIDiagnostic = ({ show = true }) => {
  const [results, setResults] = useState([]);
  const [testing, setTesting] = useState(false);

  const addResult = (
    test,
    method,
    endpoint,
    success,
    responseTime,
    details,
  ) => {
    setResults((prev) => [
      ...prev,
      {
        test,
        method,
        endpoint,
        success,
        responseTime,
        details,
        timestamp: new Date().toLocaleTimeString(),
      },
    ]);
  };

  const runDiagnostics = async () => {
    setTesting(true);
    setResults([]);

    const backendURL = getBackendURL();
    console.log(`🔧 Starting API diagnostics with backend: ${backendURL}`);

    // Test 1: Direct fetch to health endpoint (relative URL)
    await testEndpoint(
      "Health Check (Relative)",
      "GET",
      "/api/health",
      async () => {
        const response = await fetch("/api/health", {
          method: "GET",
          headers: { Accept: "application/json" },
        });
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        return await response.json();
      },
    );

    // Test 2: Unified API health check
    await testEndpoint(
      "Health Check (Unified API)",
      "GET",
      "/api/health",
      async () => {
        return await unifiedApi.get("/api/health", {
          timeout: 8000,
          retries: 0,
        });
      },
    );

    // Test 3: Auth debug endpoint
    await testEndpoint(
      "Auth Debug (Unified API)",
      "GET",
      "/api/debug-auth/users",
      async () => {
        return await unifiedApi.get("/api/debug-auth/users", {
          timeout: 8000,
          retries: 0,
        });
      },
    );

    // Test 4: Direct fetch to auth debug (relative URL)
    await testEndpoint(
      "Auth Debug (Relative)",
      "GET",
      "/api/debug-auth/users",
      async () => {
        const response = await fetch("/api/debug-auth/users", {
          method: "GET",
          headers: { Accept: "application/json" },
        });
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        return await response.json();
      },
    );

    // Test 5: Try a profile-like request (this is what's failing)
    await testEndpoint(
      "Profile Update Test",
      "PUT",
      "/api/auth/update-profile",
      async () => {
        return await unifiedApi.put(
          "/api/auth/update-profile",
          {
            fullName: "Test User",
          },
          { timeout: 8000, retries: 0 },
        );
      },
    );

    setTesting(false);
  };

  const testEndpoint = async (testName, method, endpoint, testFunction) => {
    const startTime = Date.now();
    try {
      const result = await testFunction();
      const responseTime = Date.now() - startTime;
      addResult(testName, method, endpoint, true, responseTime, result);
    } catch (error) {
      const responseTime = Date.now() - startTime;
      addResult(testName, method, endpoint, false, responseTime, error.message);
    }
  };

  useEffect(() => {
    if (show) {
      runDiagnostics();
    }
  }, [show]);

  if (!show) return null;

  return (
    <Card className="mb-3">
      <Card.Header>
        <div className="d-flex justify-content-between align-items-center">
          <h6 className="mb-0">🔍 API Connectivity Diagnostics</h6>
          <Button
            size="sm"
            variant="outline-primary"
            onClick={runDiagnostics}
            disabled={testing}
          >
            {testing ? "Testing..." : "Run Tests"}
          </Button>
        </div>
      </Card.Header>
      <Card.Body>
        <Alert variant="info" className="mb-3">
          <small>
            <strong>Backend URL:</strong> {getBackendURL()}
            <br />
            <strong>Current Host:</strong> {window.location.hostname}
            <br />
            <strong>Registration working:</strong> ✅ (you mentioned data gets
            stored)
            <br />
            <strong>Profile showing offline:</strong> ❌ (this is what we're
            debugging)
          </small>
        </Alert>

        {results.length > 0 && (
          <Table size="sm" striped bordered>
            <thead>
              <tr>
                <th>Test</th>
                <th>Method</th>
                <th>Status</th>
                <th>Time</th>
                <th>Details</th>
              </tr>
            </thead>
            <tbody>
              {results.map((result, index) => (
                <tr
                  key={index}
                  className={result.success ? "table-success" : "table-danger"}
                >
                  <td>
                    <small>{result.test}</small>
                  </td>
                  <td>
                    <Badge bg="secondary">{result.method}</Badge>
                  </td>
                  <td>
                    <Badge bg={result.success ? "success" : "danger"}>
                      {result.success ? "✅ OK" : "❌ FAIL"}
                    </Badge>
                  </td>
                  <td>
                    <small>{result.responseTime}ms</small>
                  </td>
                  <td>
                    <details>
                      <summary>
                        <small>{result.success ? "Response" : "Error"}</small>
                      </summary>
                      <pre
                        style={{
                          fontSize: "0.7em",
                          maxHeight: "100px",
                          overflow: "auto",
                        }}
                      >
                        {typeof result.details === "string"
                          ? result.details
                          : JSON.stringify(result.details, null, 2)}
                      </pre>
                    </details>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        )}

        {results.length > 0 && (
          <Alert
            variant={results.some((r) => r.success) ? "success" : "danger"}
            className="mt-3 mb-0"
          >
            <small>
              <strong>Summary:</strong>{" "}
              {results.filter((r) => r.success).length}/{results.length} tests
              passed
              {results.some((r) => r.success)
                ? ". At least some endpoints are working - the issue might be specific to certain API calls."
                : ". All tests failed - there might be a fundamental connectivity issue."}
            </small>
          </Alert>
        )}
      </Card.Body>
    </Card>
  );
};

export default APIDiagnostic;
