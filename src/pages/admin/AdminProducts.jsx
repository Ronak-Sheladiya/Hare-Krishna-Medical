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
  Alert,
  InputGroup,
} from "react-bootstrap";
import { Link } from "react-router-dom";

const AdminProducts = () => {
  const [products, setProducts] = useState([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [formData, setFormData] = useState({
    name: "",
    company: "",
    price: "",
    stock: "",
    category: "",
    description: "",
    benefits: "",
    usage: "",
    weight: "",
    images: [],
  });

  // Mock products data
  const mockProducts = [
    {
      id: 1,
      name: "Paracetamol Tablets 500mg",
      company: "Hare Krishna Pharma",
      price: 25.99,
      stock: 150,
      category: "Pain Relief",
      status: "Active",
      images: ["https://via.placeholder.com/150"],
      description: "Effective pain relief and fever reducer",
      lastUpdated: "2024-01-15",
    },
    {
      id: 2,
      name: "Vitamin D3 Capsules",
      company: "Health Plus",
      price: 45.5,
      stock: 5,
      category: "Vitamins",
      status: "Low Stock",
      images: ["https://via.placeholder.com/150"],
      description: "Essential vitamin for bone health",
      lastUpdated: "2024-01-14",
    },
    {
      id: 3,
      name: "Cough Syrup",
      company: "Wellness Care",
      price: 35.75,
      stock: 0,
      category: "Cough & Cold",
      status: "Out of Stock",
      images: ["https://via.placeholder.com/150"],
      description: "Natural cough relief formula",
      lastUpdated: "2024-01-13",
    },
  ];

  useEffect(() => {
    setProducts(mockProducts);
  }, []);

  const categories = [
    "Pain Relief",
    "Vitamins",
    "Cough & Cold",
    "First Aid",
    "Medical Devices",
    "Supplements",
  ];

  const filteredProducts = products.filter((product) => {
    const matchesSearch =
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.company.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory =
      !categoryFilter || product.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddProduct = () => {
    const newProduct = {
      id: Date.now(),
      ...formData,
      price: parseFloat(formData.price),
      stock: parseInt(formData.stock),
      status: parseInt(formData.stock) > 0 ? "Active" : "Out of Stock",
      lastUpdated: new Date().toISOString().split("T")[0],
      images: ["https://via.placeholder.com/150"],
    };

    setProducts((prev) => [...prev, newProduct]);
    setFormData({
      name: "",
      company: "",
      price: "",
      stock: "",
      category: "",
      description: "",
      benefits: "",
      usage: "",
      weight: "",
      images: [],
    });
    setShowAddModal(false);
  };

  const getStatusBadge = (status, stock) => {
    if (stock === 0) {
      return <Badge bg="danger">Out of Stock</Badge>;
    } else if (stock <= 10) {
      return <Badge bg="warning">Low Stock</Badge>;
    } else {
      return <Badge bg="success">Active</Badge>;
    }
  };

  return (
    <div className="fade-in admin-page-content" data-page="admin">
      {/* Hero Section - Admin Theme */}
      <section
        style={{
          background: "linear-gradient(135deg, #3182ce 0%, #2c5282 100%)",
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
                Manage Products
              </h1>
              <p
                style={{
                  fontSize: "1.2rem",
                  opacity: "0.9",
                  maxWidth: "600px",
                  margin: "0 auto",
                }}
              >
                Add, edit, and manage your medical product inventory
              </p>
            </Col>
          </Row>
        </Container>
      </section>

      {/* Products Management Content */}
      <section
        style={{
          background: "#f8f9fa",
          paddingTop: "80px",
          paddingBottom: "80px",
          minHeight: "60vh",
        }}
      >
        <Container>
          {/* Header */}
          <Row className="mb-4">
            <Col lg={8}>
              <h2 style={{ color: "#333333", fontWeight: "700" }}>
                Product Inventory
              </h2>
              <p style={{ color: "#495057" }}>
                Manage your medical products and inventory
              </p>
            </Col>
            <Col lg={4} className="text-end">
              <Button
                onClick={() => setShowAddModal(true)}
                style={{
                  background: "#3182ce",
                  border: "none",
                  borderRadius: "8px",
                  padding: "12px 24px",
                  fontWeight: "600",
                }}
              >
                <i className="bi bi-plus-circle me-2"></i>
                Add New Product
              </Button>
            </Col>
          </Row>

          {/* Filters */}
          <Row className="mb-4">
            <Col lg={6} className="mb-3">
              <InputGroup>
                <InputGroup.Text>
                  <i className="bi bi-search"></i>
                </InputGroup.Text>
                <Form.Control
                  type="text"
                  placeholder="Search products..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </InputGroup>
            </Col>
            <Col lg={3} className="mb-3">
              <Form.Select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
              >
                <option value="">All Categories</option>
                {categories.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </Form.Select>
            </Col>
            <Col lg={3} className="mb-3">
              <Button
                variant="outline-secondary"
                onClick={() => {
                  setSearchTerm("");
                  setCategoryFilter("");
                }}
                style={{ width: "100%" }}
              >
                Clear Filters
              </Button>
            </Col>
          </Row>

          {/* Products Table */}
          <Row>
            <Col lg={12}>
              <Card
                style={{
                  border: "2px solid #f8f9fa",
                  borderRadius: "16px",
                  boxShadow: "0 8px 25px rgba(0,0,0,0.05)",
                }}
              >
                <Card.Header
                  style={{
                    background: "linear-gradient(135deg, #3182ce, #2c5282)",
                    color: "white",
                    borderRadius: "16px 16px 0 0",
                    padding: "20px 30px",
                  }}
                >
                  <h5 style={{ margin: 0, fontWeight: "700" }}>
                    <i className="bi bi-box-seam me-2"></i>
                    Products ({filteredProducts.length})
                  </h5>
                </Card.Header>
                <Card.Body style={{ padding: 0 }}>
                  {filteredProducts.length === 0 ? (
                    <div
                      className="text-center"
                      style={{ padding: "60px 20px" }}
                    >
                      <i
                        className="bi bi-box display-1 mb-3"
                        style={{ color: "#e9ecef" }}
                      ></i>
                      <h4 style={{ color: "#495057" }}>No products found</h4>
                      <p style={{ color: "#6c757d" }}>
                        Try adjusting your search criteria or add some products
                      </p>
                    </div>
                  ) : (
                    <div className="table-responsive">
                      <Table className="mb-0">
                        <thead style={{ background: "#f8f9fa" }}>
                          <tr>
                            <th style={{ padding: "16px", fontWeight: "600" }}>
                              Product
                            </th>
                            <th style={{ padding: "16px", fontWeight: "600" }}>
                              Category
                            </th>
                            <th style={{ padding: "16px", fontWeight: "600" }}>
                              Price
                            </th>
                            <th style={{ padding: "16px", fontWeight: "600" }}>
                              Stock
                            </th>
                            <th style={{ padding: "16px", fontWeight: "600" }}>
                              Status
                            </th>
                            <th style={{ padding: "16px", fontWeight: "600" }}>
                              Actions
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          {filteredProducts.map((product) => (
                            <tr
                              key={product.id}
                              style={{ borderBottom: "1px solid #e9ecef" }}
                            >
                              <td style={{ padding: "16px" }}>
                                <div className="d-flex align-items-center">
                                  <img
                                    src={product.images[0]}
                                    alt={product.name}
                                    style={{
                                      width: "50px",
                                      height: "50px",
                                      objectFit: "cover",
                                      borderRadius: "8px",
                                      marginRight: "15px",
                                    }}
                                  />
                                  <div>
                                    <div
                                      style={{
                                        fontWeight: "600",
                                        color: "#333333",
                                      }}
                                    >
                                      {product.name}
                                    </div>
                                    <div
                                      style={{
                                        fontSize: "12px",
                                        color: "#6c757d",
                                      }}
                                    >
                                      {product.company}
                                    </div>
                                  </div>
                                </div>
                              </td>
                              <td style={{ padding: "16px" }}>
                                <Badge
                                  bg="secondary"
                                  style={{
                                    background: "#495057",
                                    padding: "6px 12px",
                                    borderRadius: "20px",
                                  }}
                                >
                                  {product.category}
                                </Badge>
                              </td>
                              <td style={{ padding: "16px" }}>
                                <span
                                  style={{
                                    fontWeight: "600",
                                    color: "#3182ce",
                                    fontSize: "16px",
                                  }}
                                >
                                  ₹{product.price.toFixed(2)}
                                </span>
                              </td>
                              <td style={{ padding: "16px" }}>
                                <span
                                  style={{
                                    fontWeight: "600",
                                    color:
                                      product.stock === 0
                                        ? "#dc3545"
                                        : product.stock <= 10
                                          ? "#f39c12"
                                          : "#38a169",
                                  }}
                                >
                                  {product.stock}
                                </span>
                              </td>
                              <td style={{ padding: "16px" }}>
                                {getStatusBadge(product.status, product.stock)}
                              </td>
                              <td style={{ padding: "16px" }}>
                                <div className="d-flex gap-2">
                                  <Button
                                    size="sm"
                                    variant="outline-primary"
                                    style={{
                                      borderColor: "#3182ce",
                                      color: "#3182ce",
                                    }}
                                  >
                                    <i className="bi bi-pencil"></i>
                                  </Button>
                                  <Button
                                    size="sm"
                                    variant="outline-info"
                                    style={{
                                      borderColor: "#0ea5e9",
                                      color: "#0ea5e9",
                                    }}
                                  >
                                    <i className="bi bi-eye"></i>
                                  </Button>
                                  <Button size="sm" variant="outline-danger">
                                    <i className="bi bi-trash"></i>
                                  </Button>
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </Table>
                    </div>
                  )}
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Container>
      </section>

      {/* Add Product Modal */}
      <Modal
        show={showAddModal}
        onHide={() => setShowAddModal(false)}
        size="lg"
      >
        <Modal.Header
          closeButton
          style={{
            background: "linear-gradient(135deg, #3182ce, #2c5282)",
            color: "white",
          }}
        >
          <Modal.Title>
            <i className="bi bi-plus-circle me-2"></i>
            Add New Product
          </Modal.Title>
        </Modal.Header>
        <Modal.Body style={{ padding: "30px" }}>
          <Form>
            <Row>
              <Col md={6} className="mb-3">
                <Form.Label style={{ fontWeight: "600" }}>
                  Product Name *
                </Form.Label>
                <Form.Control
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="Enter product name"
                  style={{ borderRadius: "8px", padding: "12px" }}
                />
              </Col>
              <Col md={6} className="mb-3">
                <Form.Label style={{ fontWeight: "600" }}>Company *</Form.Label>
                <Form.Control
                  type="text"
                  name="company"
                  value={formData.company}
                  onChange={handleInputChange}
                  placeholder="Enter company name"
                  style={{ borderRadius: "8px", padding: "12px" }}
                />
              </Col>
            </Row>
            <Row>
              <Col md={4} className="mb-3">
                <Form.Label style={{ fontWeight: "600" }}>Price *</Form.Label>
                <Form.Control
                  type="number"
                  name="price"
                  value={formData.price}
                  onChange={handleInputChange}
                  placeholder="0.00"
                  step="0.01"
                  style={{ borderRadius: "8px", padding: "12px" }}
                />
              </Col>
              <Col md={4} className="mb-3">
                <Form.Label style={{ fontWeight: "600" }}>Stock *</Form.Label>
                <Form.Control
                  type="number"
                  name="stock"
                  value={formData.stock}
                  onChange={handleInputChange}
                  placeholder="0"
                  style={{ borderRadius: "8px", padding: "12px" }}
                />
              </Col>
              <Col md={4} className="mb-3">
                <Form.Label style={{ fontWeight: "600" }}>
                  Category *
                </Form.Label>
                <Form.Select
                  name="category"
                  value={formData.category}
                  onChange={handleInputChange}
                  style={{ borderRadius: "8px", padding: "12px" }}
                >
                  <option value="">Select Category</option>
                  {categories.map((category) => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </Form.Select>
              </Col>
            </Row>
            <Form.Group className="mb-3">
              <Form.Label style={{ fontWeight: "600" }}>
                Description *
              </Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                placeholder="Enter product description"
                style={{ borderRadius: "8px", padding: "12px" }}
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant="outline-secondary"
            onClick={() => setShowAddModal(false)}
          >
            Cancel
          </Button>
          <Button
            onClick={handleAddProduct}
            style={{
              background: "#3182ce",
              border: "none",
              padding: "8px 20px",
            }}
          >
            <i className="bi bi-plus-circle me-2"></i>
            Add Product
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default AdminProducts;
