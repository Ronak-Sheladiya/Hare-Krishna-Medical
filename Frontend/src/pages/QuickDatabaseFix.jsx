import React, { useState, useEffect } from "react";
import {
  Container,
  Row,
  Col,
  Card,
  Button,
  Alert,
  Badge,
} from "react-bootstrap";
import { getBackendURL } from "../utils/config";
import {
  getBackendStatus,
  robustApiCall,
  clearBackendCache,
} from "../utils/robust-api-client";

const QuickDatabaseFix = () => {
  const [status, setStatus] = useState("checking");
  const [dbInfo, setDbInfo] = useState(null);
  const [loading, setLoading] = useState(false);

  const backendURL = getBackendURL();

  useEffect(() => {
    checkDatabaseStatus();
  }, []);

  const checkDatabaseStatus = async () => {
    try {
      setStatus("checking");

      console.log("🔍 Checking database status with robust client...");

      const result = await getBackendStatus();

      if (result.success) {
        console.log("✅ Backend status check successful:", result);

        setDbInfo({
          serverStatus: result.health.status,
          databaseStatus: result.health.database,
          totalProducts: result.totalProducts,
          serverOnline: true,
          uptime: result.health.uptime,
          backendUrl: result.backendURL,
        });

        if (result.totalProducts > 0) {
          setStatus("has_data");
        } else {
          setStatus("needs_seeding");
        }
      } else {
        throw new Error(result.error);
      }
    } catch (error) {
      console.error("❌ Database status check failed:", error);
      setStatus("error");
      setDbInfo({
        error: error.message,
        backendUrl: backendURL,
        errorType: error.name || "UnknownError",
      });
    }
  };

  const seedWithBasicProducts = async () => {
    setLoading(true);

    // Basic product data that should work with the current schema
    const basicProducts = [
      {
        name: "Paracetamol 500mg",
        shortDescription: "Pain and fever relief tablets",
        description:
          "Effective pain reliever and fever reducer for adults and children over 12 years.",
        price: 25,
        stock: 150,
        category: "Tablet",
        company: "Generic Pharma",
        composition: "Paracetamol 500mg",
        featured: true,
      },
      {
        name: "Vitamin D3",
        shortDescription: "Essential vitamin supplement",
        description:
          "High-quality Vitamin D3 supplements for bone health and immunity.",
        price: 180,
        stock: 120,
        category: "Tablet",
        company: "Health Plus",
        composition: "Cholecalciferol 1000 IU",
        featured: true,
      },
      {
        name: "Cough Syrup",
        shortDescription: "Natural cough relief",
        description:
          "Herbal cough syrup for effective relief from dry and wet cough.",
        price: 85,
        stock: 200,
        category: "Syrup",
        company: "Nature Care",
        composition: "Honey and herbal extracts",
        featured: true,
      },
      {
        name: "Antiseptic Cream",
        shortDescription: "Skin protection cream",
        description:
          "Antimicrobial cream for cuts, wounds, and minor skin infections.",
        price: 65,
        stock: 90,
        category: "Cream",
        company: "MediCare",
        composition: "Povidone Iodine 5%",
        featured: true,
      },
    ];

    let successCount = 0;
    let failureCount = 0;

    // Try to seed through database manipulation
    try {
      console.log("🌱 Attempting to seed database...");

      // Attempt to use the internal seeding API
      const seedResult = await robustApiCall("/api/dev/seed-products", {
        method: "POST",
      });

      if (seedResult.success) {
        console.log("✅ Seeding successful:", seedResult.data);
        setStatus("completed");
        setLoading(false);
        setTimeout(checkDatabaseStatus, 1000);
        return;
      } else {
        console.log("❌ Dev API failed:", seedResult.error);
      }
    } catch (error) {
      console.log("❌ Dev API not available:", error.message);
    }

    // Manual insertion approach
    for (const product of basicProducts) {
      try {
        // Simulate product creation by calling the products API
        // Note: This will likely fail due to auth requirements, but we're testing
        const response = await fetch(`${backendURL}/api/products`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(product),
        });

        if (response.ok) {
          successCount++;
        } else {
          failureCount++;
        }
      } catch (error) {
        failureCount++;
      }
    }

    if (successCount > 0) {
      setStatus("completed");
    } else {
      setStatus("manual_required");
    }

    setLoading(false);
    setTimeout(checkDatabaseStatus, 1000);
  };

  const refreshFrontend = () => {
    // Force refresh the current page to reload data
    window.location.reload();
  };

  const forceRefresh = async () => {
    // Clear backend cache and retry
    clearBackendCache();
    setStatus("checking");
    setDbInfo(null);
    await checkDatabaseStatus();
  };

  return (
    <Container className="my-5">
      <Row>
        <Col lg={8} className="mx-auto">
          <Card>
            <Card.Header className="bg-danger text-white">
              <h4 className="mb-0">🚨 Database Fix Utility</h4>
              <small>
                Fix database connectivity and populate with sample data
              </small>
            </Card.Header>
            <Card.Body>
              {/* Current Status */}
              <Card className="mb-4">
                <Card.Header>
                  <h6 className="mb-0">📊 Current Status</h6>
                </Card.Header>
                <Card.Body>
                  {dbInfo ? (
                    <Row>
                      <Col md={6}>
                        <p>
                          <strong>Server:</strong>{" "}
                          {dbInfo.serverOnline ? (
                            <Badge bg="success">✅ Online</Badge>
                          ) : (
                            <Badge bg="danger">❌ Offline</Badge>
                          )}
                        </p>
                        <p>
                          <strong>Database:</strong>{" "}
                          {dbInfo.databaseStatus === "connected" ? (
                            <Badge bg="success">✅ Connected</Badge>
                          ) : (
                            <Badge bg="danger">❌ Disconnected</Badge>
                          )}
                        </p>
                      </Col>
                      <Col md={6}>
                        <p>
                          <strong>Products:</strong>{" "}
                          <Badge bg="primary">
                            {dbInfo.totalProducts || 0}
                          </Badge>
                        </p>
                        <p>
                          <strong>Status:</strong>{" "}
                          {dbInfo.totalProducts > 0 ? (
                            <Badge bg="success">✅ Has Data</Badge>
                          ) : (
                            <Badge bg="warning">⚠️ Needs Data</Badge>
                          )}
                        </p>
                      </Col>
                    </Row>
                  ) : (
                    <div className="text-center">
                      <div
                        className="spinner-border text-primary"
                        role="status"
                      ></div>
                      <p className="mt-2">Checking status...</p>
                    </div>
                  )}
                </Card.Body>
              </Card>

              {/* Status-based Actions */}
              {status === "needs_seeding" && (
                <Alert variant="warning">
                  <h6>⚠️ Database is Empty</h6>
                  <p>
                    The database is connected but has no products. This is why
                    the frontend appears empty.
                  </p>
                  <Button
                    variant="success"
                    onClick={seedWithBasicProducts}
                    disabled={loading}
                  >
                    {loading
                      ? "Seeding..."
                      : "🌱 Fix Database - Add Sample Products"}
                  </Button>
                </Alert>
              )}

              {status === "has_data" && (
                <Alert variant="success">
                  <h6>✅ Database Has Data</h6>
                  <p>
                    The database contains {dbInfo?.totalProducts} products. If
                    the frontend still appears empty, try refreshing.
                  </p>
                  <Button variant="primary" onClick={refreshFrontend}>
                    🔄 Refresh Frontend
                  </Button>
                </Alert>
              )}

              {status === "completed" && (
                <Alert variant="success">
                  <h6>🎉 Database Fixed Successfully!</h6>
                  <p>
                    Sample products have been added to the database. The
                    frontend should now display products.
                  </p>
                  <Button variant="primary" onClick={refreshFrontend}>
                    🔄 Refresh to See Products
                  </Button>
                </Alert>
              )}

              {status === "manual_required" && (
                <Alert variant="info">
                  <h6>🔧 Manual Fix Required</h6>
                  <p>Automatic seeding failed. You may need to:</p>
                  <ul>
                    <li>Restart the backend server</li>
                    <li>Check MongoDB connection</li>
                    <li>Run manual seeding scripts</li>
                  </ul>
                </Alert>
              )}

              {status === "error" && (
                <Alert variant="danger">
                  <h6>❌ Connection Error</h6>
                  <p>
                    <strong>Error:</strong> {dbInfo?.error}
                  </p>
                  <p>
                    <strong>Backend URL:</strong> {dbInfo?.backendUrl}
                  </p>
                  {dbInfo?.errorType === "AbortError" && (
                    <p>
                      <strong>Cause:</strong> Request timeout - Backend server
                      might be slow or unavailable
                    </p>
                  )}
                  {dbInfo?.error?.includes("Failed to fetch") && (
                    <div>
                      <p>
                        <strong>Possible causes:</strong>
                      </p>
                      <ul>
                        <li>Backend server is not running</li>
                        <li>Network connectivity issues</li>
                        <li>CORS configuration problems</li>
                        <li>Wrong backend URL configuration</li>
                      </ul>
                    </div>
                  )}
                  <Button
                    variant="outline-primary"
                    onClick={checkDatabaseStatus}
                  >
                    🔄 Retry Connection
                  </Button>
                </Alert>
              )}

              {/* Manual Actions */}
              <div className="d-grid gap-2 mt-4">
                <Button
                  variant="outline-secondary"
                  onClick={checkDatabaseStatus}
                  disabled={status === "checking"}
                >
                  🔄 Refresh Status
                </Button>
                <Button
                  variant="outline-warning"
                  onClick={forceRefresh}
                  disabled={status === "checking"}
                >
                  🔄 Force Refresh (Clear Cache)
                </Button>
              </div>

              {/* Backend URL Info */}
              <Alert variant="info" className="mt-4">
                <small>
                  <strong>Backend URL:</strong> {backendURL}
                  <br />
                  <strong>Environment:</strong>{" "}
                  {window.location.hostname.includes("localhost")
                    ? "Development"
                    : "Production"}
                  <br />
                  <strong>Current Domain:</strong> {window.location.hostname}
                  <br />
                  <strong>Frontend-Database Issue:</strong> This usually happens
                  when the database is empty or not properly seeded.
                </small>
              </Alert>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default QuickDatabaseFix;
