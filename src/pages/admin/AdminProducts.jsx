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
      status: "Active",
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
    // Comprehensive validation
    const errors = {};

    if (!formData.name.trim()) {
      errors.name = "Product name is required";
    }

    if (!formData.company.trim()) {
      errors.company = "Company name is required";
    }

    if (!formData.description.trim()) {
      errors.description = "Description is required";
    }

    if (!formData.price || parseFloat(formData.price) <= 0) {
      errors.price = "Valid price is required (must be greater than 0)";
    }

    if (!formData.stock || parseInt(formData.stock) < 0) {
      errors.stock = "Valid stock quantity is required (cannot be negative)";
    }

    if (!formData.category) {
      errors.category = "Category selection is required";
    }

    if (Object.keys(errors).length > 0) {
      // Show validation errors
      const errorMessages = Object.values(errors).join("\n");
      alert(`Please fix the following errors:\n\n${errorMessages}`);
      return;
    }

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

  const handleEditProduct = (product) => {
    setSelectedProduct(product);
    setFormData({
      name: product.name,
      company: product.company,
      price: product.price.toString(),
      stock: product.stock.toString(),
      category: product.category,
      description: product.description,
      benefits: product.benefits || "",
      usage: product.usage || "",
      weight: product.weight || "",
      images: product.images || [],
    });
    setShowEditModal(true);
  };

  const handleUpdateProduct = () => {
    const updatedProduct = {
      ...selectedProduct,
      ...formData,
      price: parseFloat(formData.price),
      stock: parseInt(formData.stock),
      status: parseInt(formData.stock) > 0 ? "Active" : "Out of Stock",
      lastUpdated: new Date().toISOString().split("T")[0],
    };

    setProducts((prev) =>
      prev.map((p) => (p.id === selectedProduct.id ? updatedProduct : p)),
    );
    setShowEditModal(false);
    setSelectedProduct(null);
  };

  const handleDeleteProduct = (id) => {
    if (window.confirm("Are you sure you want to delete this product?")) {
      setProducts((prev) => prev.filter((p) => p.id !== id));
    }
  };

  const getStockStatus = (stock) => {
    if (stock === 0) return { variant: "danger", text: "Out of Stock" };
    if (stock <= 10) return { variant: "warning", text: "Low Stock" };
    return { variant: "success", text: "In Stock" };
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
                  <p className="text-muted">
                    Manage your medical product inventory
                  </p>
                </div>
                <Button
                  className="btn-medical-primary"
                  onClick={() => setShowAddModal(true)}
                >
                  <i className="bi bi-plus-circle me-2"></i>
                  Add New Product
                </Button>
              </div>
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
                  placeholder="Search products..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </InputGroup>
            </Col>
            <Col lg={3}>
              <Form.Select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
              >
                <option value="">All Categories</option>
                {categories.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </Form.Select>
            </Col>
            <Col lg={3}>
              <Button
                variant="outline-secondary"
                onClick={() => {
                  setSearchTerm("");
                  setCategoryFilter("");
                }}
              >
                Clear Filters
              </Button>
            </Col>
          </Row>

          {/* Products Table */}
          <Card className="medical-card">
            <Card.Header className="bg-medical-light">
              <h5 className="mb-0">
                <i className="bi bi-box-seam me-2"></i>
                Products ({filteredProducts.length})
              </h5>
            </Card.Header>
            <Card.Body className="p-0">
              <div className="table-responsive">
                <Table className="mb-0">
                  <thead className="table-light">
                    <tr>
                      <th>Product</th>
                      <th>Company</th>
                      <th>Price</th>
                      <th>Stock</th>
                      <th>Category</th>
                      <th>Status</th>
                      <th>Last Updated</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredProducts.map((product) => {
                      const stockStatus = getStockStatus(product.stock);
                      return (
                        <tr key={product.id}>
                          <td>
                            <div className="d-flex align-items-center">
                              <img
                                src={product.images[0]}
                                alt={product.name}
                                style={{
                                  width: "50px",
                                  height: "50px",
                                  objectFit: "cover",
                                }}
                                className="rounded me-3"
                              />
                              <div>
                                <div className="fw-bold">{product.name}</div>
                                <small className="text-muted">
                                  {product.description}
                                </small>
                              </div>
                            </div>
                          </td>
                          <td>{product.company}</td>
                          <td>₹{product.price}</td>
                          <td>
                            <Badge bg={stockStatus.variant}>
                              {product.stock} units
                            </Badge>
                          </td>
                          <td>
                            <Badge bg="secondary">{product.category}</Badge>
                          </td>
                          <td>
                            <Badge
                              bg={
                                product.status === "Active"
                                  ? "success"
                                  : "danger"
                              }
                            >
                              {product.status}
                            </Badge>
                          </td>
                          <td>{product.lastUpdated}</td>
                          <td>
                            <div className="d-flex gap-1">
                              <Button
                                size="sm"
                                variant="outline-primary"
                                onClick={() => handleEditProduct(product)}
                              >
                                <i className="bi bi-pencil me-1"></i>
                                Edit
                              </Button>
                              <Button
                                size="sm"
                                variant="outline-danger"
                                onClick={() => handleDeleteProduct(product.id)}
                              >
                                <i className="bi bi-trash me-1"></i>
                                Delete
                              </Button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </Table>
              </div>
            </Card.Body>
          </Card>
        </Container>
      </section>

      {/* Add Product Modal */}
      <Modal
        show={showAddModal}
        onHide={() => setShowAddModal(false)}
        size="lg"
      >
        <Modal.Header closeButton>
          <Modal.Title>Add New Product</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Row>
              <Col md={6} className="mb-3">
                <Form.Label>Product Name *</Form.Label>
                <Form.Control
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="Enter product name"
                />
              </Col>
              <Col md={6} className="mb-3">
                <Form.Label>Company *</Form.Label>
                <Form.Control
                  type="text"
                  name="company"
                  value={formData.company}
                  onChange={handleInputChange}
                  placeholder="Enter company name"
                />
              </Col>
              <Col md={6} className="mb-3">
                <Form.Label>Price (₹) *</Form.Label>
                <Form.Control
                  type="number"
                  name="price"
                  value={formData.price}
                  onChange={handleInputChange}
                  placeholder="Enter price"
                  step="0.01"
                />
              </Col>
              <Col md={6} className="mb-3">
                <Form.Label>Stock Quantity *</Form.Label>
                <Form.Control
                  type="number"
                  name="stock"
                  value={formData.stock}
                  onChange={handleInputChange}
                  placeholder="Enter stock quantity"
                />
              </Col>
              <Col md={6} className="mb-3">
                <Form.Label>Category *</Form.Label>
                <Form.Select
                  name="category"
                  value={formData.category}
                  onChange={handleInputChange}
                >
                  <option value="">Select Category</option>
                  {categories.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </Form.Select>
              </Col>
              <Col md={6} className="mb-3">
                <Form.Label>Weight/Size</Form.Label>
                <Form.Control
                  type="text"
                  name="weight"
                  value={formData.weight}
                  onChange={handleInputChange}
                  placeholder="e.g., 500mg, 100ml"
                />
              </Col>
              <Col md={12} className="mb-3">
                <Form.Label>Description *</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={3}
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  placeholder="Enter product description"
                />
              </Col>
              <Col md={12} className="mb-3">
                <Form.Label>Benefits</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={2}
                  name="benefits"
                  value={formData.benefits}
                  onChange={handleInputChange}
                  placeholder="Enter product benefits (comma separated)"
                />
              </Col>
              <Col md={12} className="mb-3">
                <Form.Label>Usage Instructions</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={2}
                  name="usage"
                  value={formData.usage}
                  onChange={handleInputChange}
                  placeholder="Enter usage instructions"
                />
              </Col>
            </Row>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowAddModal(false)}>
            Cancel
          </Button>
          <Button className="btn-medical-primary" onClick={handleAddProduct}>
            Add Product
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Edit Product Modal */}
      <Modal
        show={showEditModal}
        onHide={() => setShowEditModal(false)}
        size="lg"
      >
        <Modal.Header closeButton>
          <Modal.Title>Edit Product</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Row>
              <Col md={6} className="mb-3">
                <Form.Label>Product Name *</Form.Label>
                <Form.Control
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                />
              </Col>
              <Col md={6} className="mb-3">
                <Form.Label>Company *</Form.Label>
                <Form.Control
                  type="text"
                  name="company"
                  value={formData.company}
                  onChange={handleInputChange}
                />
              </Col>
              <Col md={6} className="mb-3">
                <Form.Label>Price (₹) *</Form.Label>
                <Form.Control
                  type="number"
                  name="price"
                  value={formData.price}
                  onChange={handleInputChange}
                  step="0.01"
                />
              </Col>
              <Col md={6} className="mb-3">
                <Form.Label>Stock Quantity *</Form.Label>
                <Form.Control
                  type="number"
                  name="stock"
                  value={formData.stock}
                  onChange={handleInputChange}
                />
              </Col>
              <Col md={6} className="mb-3">
                <Form.Label>Category *</Form.Label>
                <Form.Select
                  name="category"
                  value={formData.category}
                  onChange={handleInputChange}
                >
                  <option value="">Select Category</option>
                  {categories.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </Form.Select>
              </Col>
              <Col md={6} className="mb-3">
                <Form.Label>Weight/Size</Form.Label>
                <Form.Control
                  type="text"
                  name="weight"
                  value={formData.weight}
                  onChange={handleInputChange}
                />
              </Col>
              <Col md={12} className="mb-3">
                <Form.Label>Description *</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={3}
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                />
              </Col>
            </Row>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowEditModal(false)}>
            Cancel
          </Button>
          <Button className="btn-medical-primary" onClick={handleUpdateProduct}>
            Update Product
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default AdminProducts;