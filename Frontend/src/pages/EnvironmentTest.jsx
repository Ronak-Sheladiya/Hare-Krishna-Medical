import React from "react";
import {
  Container,
  Row,
  Col,
  Card,
  Alert,
  Badge,
  Table,
} from "react-bootstrap";
import {
  getBackendURL,
  getSocketURL,
  isProduction,
  isDevelopment,
  getEnvironment,
  getAppConfig,
} from "../utils/config";

const EnvironmentTest = () => {
  const config = getAppConfig();

  const environmentData = [
    { key: "Environment", value: getEnvironment(), type: "string" },
    { key: "Is Production", value: isProduction(), type: "boolean" },
    { key: "Is Development", value: isDevelopment(), type: "boolean" },
    { key: "Backend URL", value: getBackendURL(), type: "url" },
    { key: "Socket URL", value: getSocketURL(), type: "url" },
    {
      key: "Current Hostname",
      value: window.location.hostname,
      type: "string",
    },
    { key: "Current Origin", value: window.location.origin, type: "url" },
    {
      key: "User Agent",
      value: navigator.userAgent.substring(0, 100) + "...",
      type: "string",
    },
  ];

  const envVars = [
    "VITE_BACKEND_URL",
    "VITE_NODE_ENV",
    "VITE_DEBUG",
    "VITE_BACKEND_URL_FALLBACK",
    "VITE_SOCKET_URL",
  ];

  return (
    <Container className="my-5">
      <Row>
        <Col lg={10} className="mx-auto">
          <Card>
            <Card.Header className="bg-info text-white">
              <h4 className="mb-0">🔧 Environment Configuration Test</h4>
              <small>Debug environment detection and configuration</small>
            </Card.Header>
            <Card.Body>
              {/* Environment Detection */}
              <Card className="mb-4">
                <Card.Header>
                  <h6 className="mb-0">🌍 Environment Detection</h6>
                </Card.Header>
                <Card.Body>
                  <Table responsive size="sm">
                    <thead>
                      <tr>
                        <th>Property</th>
                        <th>Value</th>
                        <th>Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {environmentData.map((item, index) => (
                        <tr key={index}>
                          <td>
                            <strong>{item.key}</strong>
                          </td>
                          <td>
                            <code>{String(item.value)}</code>
                          </td>
                          <td>
                            {item.type === "boolean" ? (
                              <Badge bg={item.value ? "success" : "secondary"}>
                                {item.value ? "✅ True" : "❌ False"}
                              </Badge>
                            ) : item.type === "url" ? (
                              <Badge
                                bg={
                                  item.value.includes("localhost")
                                    ? "warning"
                                    : "success"
                                }
                              >
                                {item.value.includes("localhost")
                                  ? "🏠 Local"
                                  : "🌐 Remote"}
                              </Badge>
                            ) : (
                              <Badge bg="info">📝 String</Badge>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </Table>
                </Card.Body>
              </Card>

              {/* Environment Variables */}
              <Card className="mb-4">
                <Card.Header>
                  <h6 className="mb-0">⚙️ Environment Variables</h6>
                </Card.Header>
                <Card.Body>
                  <Table responsive size="sm">
                    <thead>
                      <tr>
                        <th>Variable</th>
                        <th>Value</th>
                        <th>Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {envVars.map((envVar, index) => {
                        const value = import.meta.env[envVar];
                        return (
                          <tr key={index}>
                            <td>
                              <code>{envVar}</code>
                            </td>
                            <td>
                              {value ? (
                                <code>{value}</code>
                              ) : (
                                <em>undefined</em>
                              )}
                            </td>
                            <td>
                              <Badge bg={value ? "success" : "danger"}>
                                {value ? "✅ Set" : "❌ Not Set"}
                              </Badge>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </Table>
                </Card.Body>
              </Card>

              {/* Configuration Analysis */}
              <Alert variant={isProduction() ? "success" : "warning"}>
                <h6>📊 Configuration Analysis</h6>
                <ul className="mb-0">
                  <li>
                    <strong>Environment:</strong>{" "}
                    {isProduction() ? "Production" : "Development"}
                  </li>
                  <li>
                    <strong>Backend Target:</strong>{" "}
                    {getBackendURL().includes("localhost")
                      ? "Local Server"
                      : "Remote Server"}
                  </li>
                  <li>
                    <strong>Expected Behavior:</strong>{" "}
                    {isProduction()
                      ? "Should use production backend URL"
                      : "Should use localhost if available, fallback to production"}
                  </li>
                </ul>
              </Alert>

              {/* Fix Recommendations */}
              {window.location.hostname.includes("fly.dev") &&
                getBackendURL().includes("localhost") && (
                  <Alert variant="danger">
                    <h6>🚨 Configuration Issue Detected</h6>
                    <p>
                      You're running on fly.dev (production) but trying to
                      connect to localhost (development backend).
                    </p>
                    <p>
                      <strong>Expected:</strong> Should use production backend
                      URL automatically
                    </p>
                    <p>
                      <strong>Current Issue:</strong> Environment detection
                      might not be working correctly
                    </p>
                  </Alert>
                )}

              {getBackendURL().includes(
                "hare-krishna-medical.onrender.com",
              ) && (
                <Alert variant="info">
                  <h6>✅ Production Configuration Active</h6>
                  <p>Using remote backend: {getBackendURL()}</p>
                </Alert>
              )}

              {/* App Config */}
              <Card className="mb-4">
                <Card.Header>
                  <h6 className="mb-0">🎛️ Full App Configuration</h6>
                </Card.Header>
                <Card.Body>
                  <pre className="small">{JSON.stringify(config, null, 2)}</pre>
                </Card.Body>
              </Card>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default EnvironmentTest;
