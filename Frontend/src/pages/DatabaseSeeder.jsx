import React, { useState, useEffect } from "react";
import {
  Container,
  Row,
  Col,
  Card,
  Button,
  Alert,
  Badge,
  ProgressBar,
  Table,
} from "react-bootstrap";
import { getBackendURL } from "../utils/config";

const DatabaseSeeder = () => {
  const [status, setStatus] = useState("idle");
  const [dbStatus, setDbStatus] = useState(null);
  const [seededProducts, setSeededProducts] = useState([]);
  const [loading, setLoading] = useState(false);

  const backendURL = getBackendURL();

  const medicineProducts = [
    {
      name: "Paracetamol 500mg",
      shortDescription: "Pain relief and fever reducer tablets",
      description:
        "Effective pain reliever and fever reducer. Safe for adults and children over 12 years. Provides quick relief from headaches, muscle aches, and minor pain.",
      price: 25,
      stock: 150,
      category: "Tablet",
      company: "Cipla Ltd",
      composition: "Paracetamol 500mg",
      manufacturingDate: new Date("2024-01-15"),
      expiryDate: new Date("2026-01-15"),
      batchNumber: "PC500-2024-001",
      featured: true,
      image:
        "https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=500&h=300&fit=crop",
    },
    {
      name: "Amoxicillin 250mg",
      shortDescription: "Antibiotic capsules for bacterial infections",
      description:
        "Broad-spectrum antibiotic for treating various bacterial infections including respiratory tract infections, ear infections, and skin infections.",
      price: 120,
      stock: 80,
      category: "Capsule",
      company: "Sun Pharma",
      composition: "Amoxicillin 250mg",
      manufacturingDate: new Date("2024-02-10"),
      expiryDate: new Date("2026-02-10"),
      batchNumber: "AMX250-2024-002",
      featured: true,
      image:
        "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=500&h=300&fit=crop",
    },
    {
      name: "Cough Syrup 100ml",
      shortDescription: "Herbal cough relief syrup",
      description:
        "Natural herbal cough syrup providing effective relief from dry and wet cough. Safe for all ages with honey and tulsi extracts.",
      price: 85,
      stock: 200,
      category: "Syrup",
      company: "Himalaya Drug Company",
      composition: "Honey, Tulsi Extract, Mulethi",
      manufacturingDate: new Date("2024-03-05"),
      expiryDate: new Date("2026-03-05"),
      batchNumber: "CS100-2024-003",
      featured: true,
      image:
        "https://images.unsplash.com/photo-1587854692152-cbe660dbde88?w=500&h=300&fit=crop",
    },
    {
      name: "Vitamin D3 Tablets",
      shortDescription: "Essential vitamin D3 supplements",
      description:
        "High-quality Vitamin D3 supplements for bone health and immunity. Essential for calcium absorption and overall health maintenance.",
      price: 180,
      stock: 120,
      category: "Tablet",
      company: "Carbamide Forte",
      composition: "Cholecalciferol (Vitamin D3) 60000 IU",
      manufacturingDate: new Date("2024-01-20"),
      expiryDate: new Date("2026-01-20"),
      batchNumber: "VD3-2024-004",
      featured: true,
      image:
        "https://images.unsplash.com/photo-1550572017-7bb9bbeb7bcc?w=500&h=300&fit=crop",
    },
    {
      name: "Antiseptic Cream 30g",
      shortDescription: "Antimicrobial skin protection cream",
      description:
        "Effective antiseptic cream for cuts, wounds, and skin infections. Provides antimicrobial protection and promotes healing.",
      price: 65,
      stock: 90,
      category: "Cream",
      company: "Johnson & Johnson",
      composition: "Povidone Iodine 5% w/w",
      manufacturingDate: new Date("2024-02-15"),
      expiryDate: new Date("2026-02-15"),
      batchNumber: "AC30-2024-005",
      featured: false,
      image:
        "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=500&h=300&fit=crop",
    },
    {
      name: "Multivitamin Capsules",
      shortDescription: "Complete multivitamin and mineral supplement",
      description:
        "Comprehensive multivitamin formula with essential vitamins and minerals for daily nutritional support and overall wellness.",
      price: 450,
      stock: 75,
      category: "Capsule",
      company: "HealthKart",
      composition: "Vitamin A, C, D, E, B-Complex, Iron, Calcium, Zinc",
      manufacturingDate: new Date("2024-01-10"),
      expiryDate: new Date("2026-01-10"),
      batchNumber: "MV-2024-006",
      featured: false,
      image:
        "https://images.unsplash.com/photo-1559757175-0eb30cd8c063?w=500&h=300&fit=crop",
    },
  ];

  useEffect(() => {
    checkDatabaseStatus();
  }, []);

  const checkDatabaseStatus = async () => {
    try {
      // Try dev status API first, fallback to products API
      let response = await fetch(`${backendURL}/api/dev/status`);

      if (response.ok) {
        const data = await response.json();
        setDbStatus({
          connected: true,
          totalProducts: data.data?.totalProducts || 0,
          hasProducts: (data.data?.totalProducts || 0) > 0,
          featuredProducts: data.data?.featuredProducts || 0,
        });
      } else {
        // Fallback to products API
        response = await fetch(`${backendURL}/api/products`);
        const data = await response.json();

        setDbStatus({
          connected: response.ok,
          totalProducts: data.pagination?.totalProducts || 0,
          hasProducts: (data.pagination?.totalProducts || 0) > 0,
        });
      }
    } catch (error) {
      setDbStatus({
        connected: false,
        error: error.message,
      });
    }
  };

  const seedDatabase = async () => {
    setLoading(true);
    setStatus("seeding");
    setSeededProducts([]);

    try {
      const response = await fetch(`${backendURL}/api/dev/seed-products`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });

      const result = await response.json();

      if (response.ok && result.success) {
        setStatus("completed");
        setSeededProducts(
          result.data.products.map((p) => ({
            name: p.name,
            price: p.price,
            category: p.category,
            featured: p.featured,
            status: "success",
          })),
        );
      } else {
        setStatus("failed");
        console.error("Seeding failed:", result.message);
      }
    } catch (error) {
      setStatus("failed");
      console.error("Seeding error:", error);
    }

    setLoading(false);

    // Refresh database status
    setTimeout(checkDatabaseStatus, 1000);
  };

  const clearDatabase = async () => {
    setLoading(true);
    setStatus("clearing");

    try {
      // This would require an admin API endpoint to clear products
      const response = await fetch(`${backendURL}/api/products`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (response.ok) {
        setStatus("cleared");
        setSeededProducts([]);
        await checkDatabaseStatus();
      } else {
        setStatus("error");
      }
    } catch (error) {
      setStatus("error");
    }

    setLoading(false);
  };

  return (
    <Container className="my-5">
      <Row>
        <Col lg={10} className="mx-auto">
          <Card>
            <Card.Header className="bg-warning text-dark">
              <h4 className="mb-0">🌱 Database Seeder</h4>
              <small>Populate database with sample medical products</small>
            </Card.Header>
            <Card.Body>
              {/* Database Status */}
              <Card className="mb-4">
                <Card.Header>
                  <h6 className="mb-0">📊 Database Status</h6>
                </Card.Header>
                <Card.Body>
                  {dbStatus ? (
                    <Row>
                      <Col md={4}>
                        <div className="text-center">
                          <h5
                            className={
                              dbStatus.connected
                                ? "text-success"
                                : "text-danger"
                            }
                          >
                            {dbStatus.connected
                              ? "✅ Connected"
                              : "❌ Disconnected"}
                          </h5>
                          <small>Database Connection</small>
                        </div>
                      </Col>
                      <Col md={4}>
                        <div className="text-center">
                          <h5 className="text-primary">
                            {dbStatus.totalProducts || 0}
                          </h5>
                          <small>Total Products</small>
                        </div>
                      </Col>
                      <Col md={4}>
                        <div className="text-center">
                          <h5
                            className={
                              dbStatus.hasProducts
                                ? "text-success"
                                : "text-warning"
                            }
                          >
                            {dbStatus.hasProducts ? "✅ Has Data" : "⚠️ Empty"}
                          </h5>
                          <small>Data Status</small>
                        </div>
                      </Col>
                    </Row>
                  ) : (
                    <div className="text-center">
                      <div
                        className="spinner-border text-primary mb-2"
                        role="status"
                      ></div>
                      <p>Checking database status...</p>
                    </div>
                  )}
                </Card.Body>
              </Card>

              {/* Action Buttons */}
              <div className="d-grid gap-2 mb-4">
                <Button
                  variant="success"
                  size="lg"
                  onClick={seedDatabase}
                  disabled={loading}
                >
                  {loading && status === "seeding"
                    ? "Seeding Database..."
                    : "🌱 Seed Database with Sample Products"}
                </Button>

                <Button
                  variant="outline-secondary"
                  onClick={checkDatabaseStatus}
                  disabled={loading}
                >
                  🔄 Refresh Status
                </Button>
              </div>

              {/* Progress */}
              {loading && (
                <div className="mb-4">
                  <ProgressBar
                    now={
                      (seededProducts.length / medicineProducts.length) * 100
                    }
                    label={`${seededProducts.length}/${medicineProducts.length}`}
                  />
                </div>
              )}

              {/* Status Messages */}
              {status === "completed" && (
                <Alert variant="success">
                  <h6>✅ Database Seeding Completed!</h6>
                  <p>
                    Successfully seeded the database with sample medical
                    products. The frontend should now display products on the
                    home page.
                  </p>
                </Alert>
              )}

              {status === "failed" && (
                <Alert variant="danger">
                  <h6>❌ Database Seeding Failed</h6>
                  <p>
                    Failed to seed products. This might be due to authentication
                    requirements or server configuration issues.
                  </p>
                </Alert>
              )}

              {/* Seeded Products Table */}
              {seededProducts.length > 0 && (
                <Card className="mt-4">
                  <Card.Header>
                    <h6 className="mb-0">📦 Seeding Results</h6>
                  </Card.Header>
                  <Card.Body>
                    <Table responsive size="sm">
                      <thead>
                        <tr>
                          <th>Product Name</th>
                          <th>Price</th>
                          <th>Category</th>
                          <th>Status</th>
                        </tr>
                      </thead>
                      <tbody>
                        {seededProducts.map((product, index) => (
                          <tr key={index}>
                            <td>{product.name}</td>
                            <td>₹{product.price}</td>
                            <td>{product.category}</td>
                            <td>
                              {product.status === "success" ? (
                                <Badge bg="success">✅ Success</Badge>
                              ) : (
                                <Badge bg="danger" title={product.error}>
                                  ❌ Failed
                                </Badge>
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </Table>
                  </Card.Body>
                </Card>
              )}

              {/* Instructions */}
              <Alert variant="info" className="mt-4">
                <h6>📝 Instructions:</h6>
                <ul className="mb-0">
                  <li>
                    This tool will populate your database with sample medical
                    products
                  </li>
                  <li>
                    After seeding, go to the home page to see the products
                    displayed
                  </li>
                  <li>
                    The database connection status shows if the backend is
                    properly connected
                  </li>
                  <li>
                    If seeding fails, check that the backend server is running
                    and accessible
                  </li>
                </ul>
              </Alert>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default DatabaseSeeder;
