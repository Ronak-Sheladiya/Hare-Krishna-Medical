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
  const [showViewModal, setShowViewModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [formData, setFormData] = useState({
    name: "",
    company: "",
    price: "",
    originalPrice: "",
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
      originalPrice: 30.99,
      stock: 150,
      category: "Pain Relief",
      status: "Active",
      images: ["https://via.placeholder.com/150"],
      description: "Effective pain relief and fever reducer",
      benefits: "Quick pain relief\nReduces fever\nGentle on stomach",
      usage: "Adults: Take 1-2 tablets every 4-6 hours",
      weight: "50 tablets (500mg each)",
      lastUpdated: "2024-01-15",
    },
    {
      id: 2,
      name: "Vitamin D3 Capsules",
      company: "Health Plus",
      price: 45.5,
      originalPrice: 50.0,
      stock: 5,
      category: "Vitamins",
      status: "Low Stock",
      images: ["https://via.placeholder.com/150"],
      description: "Essential vitamin for bone health",
      benefits: "Bone health\nImmune support\nMuscle function",
      usage: "Take 1 capsule daily with food",
      weight: "60 capsules (1000 IU each)",
      lastUpdated: "2024-01-14",
    },
    {
      id: 3,
      name: "Cough Syrup",
      company: "Wellness Care",
      price: 35.75,
      originalPrice: 40.0,
      stock: 0,
      category: "Cough & Cold",
      status: "Out of Stock",
      images: ["https://via.placeholder.com/150"],
      description: "Natural cough relief formula",
      benefits: "Soothes throat\nReduces cough\nNatural ingredients",
      usage: "Adults: 2 teaspoons every 6 hours",
      weight: "100ml bottle",
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

    if (!formData.weight.trim()) {
      errors.weight = "Weight is required";
    }

    if (Object.keys(errors).length > 0) {
      // Show validation errors
      const errorMessages = Object.values(errors).join("\n");
      alert(`Please fill the following required fields:\n\n${errorMessages}`);
      return;
    }

    const newProduct = {
      id: Date.now(),
      ...formData,
      price: parseFloat(formData.price),
      originalPrice: formData.originalPrice
        ? parseFloat(formData.originalPrice)
        : null,
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
      originalPrice: "",
      stock: "",
      category: "",
      description: "",
      benefits: "",
      usage: "",
      weight: "",
      images: [],
    });
    setShowAddModal(false);
    alert("Product added successfully!");
  };

  const handleEditProduct = () => {
    // Same validation as add product
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

    if (!formData.weight.trim()) {
      errors.weight = "Weight is required";
    }

    if (Object.keys(errors).length > 0) {
      const errorMessages = Object.values(errors).join("\n");
      alert(`Please fill the following required fields:\n\n${errorMessages}`);
      return;
    }

    const updatedProduct = {
      ...selectedProduct,
      ...formData,
      price: parseFloat(formData.price),
      originalPrice: formData.originalPrice
        ? parseFloat(formData.originalPrice)
        : null,
      stock: parseInt(formData.stock),
      status: parseInt(formData.stock) > 0 ? "Active" : "Out of Stock",
      lastUpdated: new Date().toISOString().split("T")[0],
    };

    setProducts((prev) =>
      prev.map((product) =>
        product.id === selectedProduct.id ? updatedProduct : product,
      ),
    );

    setShowEditModal(false);
    setSelectedProduct(null);
    setFormData({
      name: "",
      company: "",
      price: "",
      originalPrice: "",
      stock: "",
      category: "",
      description: "",
      benefits: "",
      usage: "",
      weight: "",
      images: [],
    });
    alert("Product updated successfully!");
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
      {/* Hero Section - About Us Red Theme */}
      <section
        style={{
          background: "linear-gradient(135deg, #e63946 0%, #dc3545 100%)",
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
                  background: "#e63946",
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
                    background: "linear-gradient(135deg, #e63946, #dc3545)",
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
                                    onClick={() => {
                                      setSelectedProduct(product);
                                      setFormData(product);
                                      setShowEditModal(true);
                                    }}
                                    title="Edit Product"
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
                                    onClick={() => {
                                      setSelectedProduct(product);
                                      setShowViewModal(true);
                                    }}
                                    title="View Product"
                                  >
                                    <i className="bi bi-eye"></i>
                                  </Button>
                                  <Button
                                    size="sm"
                                    variant="outline-danger"
                                    onClick={() => {
                                      if (
                                        window.confirm(
                                          `Are you sure you want to delete ${product.name}?`,
                                        )
                                      ) {
                                        setProducts((prev) =>
                                          prev.filter(
                                            (p) => p.id !== product.id,
                                          ),
                                        );
                                        alert("Product deleted successfully!");
                                      }
                                    }}
                                    title="Delete Product"
                                  >
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
        backdrop="static"
      >
        <Modal.Header
          closeButton
          style={{
            background: "linear-gradient(135deg, #e63946, #dc3545)",
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
                <Form.Label style={{ fontWeight: "600" }}>Weight *</Form.Label>
                <Form.Control
                  type="text"
                  name="weight"
                  value={formData.weight}
                  onChange={handleInputChange}
                  placeholder="e.g., 50 tablets (500mg each)"
                  style={{ borderRadius: "8px", padding: "12px" }}
                />
              </Col>
            </Row>
            <Row>
              <Col md={6} className="mb-3">
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
              <Col md={6} className="mb-3">
                <Form.Label style={{ fontWeight: "600" }}>
                  Original Price
                </Form.Label>
                <Form.Control
                  type="number"
                  name="originalPrice"
                  value={formData.originalPrice}
                  onChange={handleInputChange}
                  placeholder="0.00"
                  step="0.01"
                  style={{ borderRadius: "8px", padding: "12px" }}
                />
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
            <Form.Group className="mb-3">
              <Form.Label style={{ fontWeight: "600" }}>Benefits</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                name="benefits"
                value={formData.benefits}
                onChange={handleInputChange}
                placeholder="Enter product benefits (one per line)"
                style={{ borderRadius: "8px", padding: "12px" }}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label style={{ fontWeight: "600" }}>
                Usage Instructions
              </Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                name="usage"
                value={formData.usage}
                onChange={handleInputChange}
                placeholder="Enter usage instructions"
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
              background: "#e63946",
              border: "none",
              padding: "8px 20px",
            }}
          >
            <i className="bi bi-plus-circle me-2"></i>
            Add Product
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Edit Product Modal */}
      <Modal
        show={showEditModal}
        onHide={() => setShowEditModal(false)}
        size="lg"
        backdrop="static"
      >
        <Modal.Header
          closeButton
          style={{
            background: "linear-gradient(135deg, #e63946, #dc3545)",
            color: "white",
          }}
        >
          <Modal.Title>
            <i className="bi bi-pencil-square me-2"></i>
            Edit Product
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
                <Form.Label style={{ fontWeight: "600" }}>Weight *</Form.Label>
                <Form.Control
                  type="text"
                  name="weight"
                  value={formData.weight}
                  onChange={handleInputChange}
                  placeholder="e.g., 50 tablets (500mg each)"
                  style={{ borderRadius: "8px", padding: "12px" }}
                />
              </Col>
            </Row>
            <Row>
              <Col md={6} className="mb-3">
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
              <Col md={6} className="mb-3">
                <Form.Label style={{ fontWeight: "600" }}>
                  Original Price
                </Form.Label>
                <Form.Control
                  type="number"
                  name="originalPrice"
                  value={formData.originalPrice}
                  onChange={handleInputChange}
                  placeholder="0.00"
                  step="0.01"
                  style={{ borderRadius: "8px", padding: "12px" }}
                />
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
            <Form.Group className="mb-3">
              <Form.Label style={{ fontWeight: "600" }}>Benefits</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                name="benefits"
                value={formData.benefits}
                onChange={handleInputChange}
                placeholder="Enter product benefits (one per line)"
                style={{ borderRadius: "8px", padding: "12px" }}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label style={{ fontWeight: "600" }}>
                Usage Instructions
              </Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                name="usage"
                value={formData.usage}
                onChange={handleInputChange}
                placeholder="Enter usage instructions"
                style={{ borderRadius: "8px", padding: "12px" }}
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant="outline-secondary"
            onClick={() => {
              setShowEditModal(false);
              setSelectedProduct(null);
              setFormData({
                name: "",
                company: "",
                price: "",
                originalPrice: "",
                stock: "",
                category: "",
                description: "",
                benefits: "",
                usage: "",
                weight: "",
                images: [],
              });
            }}
          >
            Cancel
          </Button>
          <Button
            onClick={handleEditProduct}
            style={{
              background: "#e63946",
              border: "none",
              padding: "8px 20px",
            }}
          >
            <i className="bi bi-save me-2"></i>
            Update Product
          </Button>
        </Modal.Footer>
      </Modal>

      {/* View Product Modal */}
      <Modal
        show={showViewModal}
        onHide={() => setShowViewModal(false)}
        size="xl"
        backdrop="static"
      >
        <Modal.Header
          closeButton
          style={{
            background: "linear-gradient(135deg, #e63946, #dc3545)",
            color: "white",
          }}
        >
          <Modal.Title>
            <i className="bi bi-eye me-2"></i>
            Product Details
          </Modal.Title>
        </Modal.Header>
        <Modal.Body
          style={{ padding: "30px", maxHeight: "70vh", overflowY: "auto" }}
        >
          {selectedProduct && (
            <div>
              <Row>
                <Col md={4} className="mb-4">
                  <div style={{ textAlign: "center" }}>
                    <img
                      src={selectedProduct.images[0]}
                      alt={selectedProduct.name}
                      style={{
                        width: "100%",
                        maxWidth: "300px",
                        height: "250px",
                        objectFit: "cover",
                        borderRadius: "15px",
                        border: "3px solid #e63946",
                        boxShadow: "0 8px 25px rgba(230, 57, 70, 0.2)",
                      }}
                    />
                  </div>
                </Col>
                <Col md={8}>
                  <div className="mb-4">
                    <h2
                      style={{
                        color: "#333",
                        fontWeight: "700",
                        marginBottom: "10px",
                      }}
                    >
                      {selectedProduct.name}
                    </h2>
                    <p
                      style={{
                        color: "#6c757d",
                        fontSize: "16px",
                        marginBottom: "20px",
                      }}
                    >
                      by{" "}
                      <strong style={{ color: "#e63946" }}>
                        {selectedProduct.company}
                      </strong>
                    </p>
                  </div>

                  <Row className="mb-4">
                    <Col md={6}>
                      <div
                        className="p-3"
                        style={{
                          background: "#f8f9fa",
                          borderRadius: "10px",
                          border: "2px solid #e9ecef",
                        }}
                      >
                        <h6 style={{ color: "#e63946", marginBottom: "15px" }}>
                          💰 Pricing
                        </h6>
                        <div className="d-flex align-items-center gap-3">
                          <span
                            style={{
                              fontSize: "24px",
                              fontWeight: "800",
                              color: "#e63946",
                            }}
                          >
                            ₹{selectedProduct.price.toFixed(2)}
                          </span>
                          {selectedProduct.originalPrice && (
                            <span
                              style={{
                                fontSize: "18px",
                                textDecoration: "line-through",
                                color: "#6c757d",
                              }}
                            >
                              ₹{selectedProduct.originalPrice.toFixed(2)}
                            </span>
                          )}
                        </div>
                      </div>
                    </Col>
                    <Col md={6}>
                      <div
                        className="p-3"
                        style={{
                          background: "#f8f9fa",
                          borderRadius: "10px",
                          border: "2px solid #e9ecef",
                        }}
                      >
                        <h6 style={{ color: "#e63946", marginBottom: "15px" }}>
                          📦 Stock Info
                        </h6>
                        <div>
                          <span
                            style={{
                              fontSize: "20px",
                              fontWeight: "700",
                              color:
                                selectedProduct.stock === 0
                                  ? "#dc3545"
                                  : selectedProduct.stock <= 10
                                    ? "#f39c12"
                                    : "#28a745",
                            }}
                          >
                            {selectedProduct.stock} units
                          </span>
                          <div style={{ marginTop: "5px" }}>
                            {selectedProduct.stock === 0 ? (
                              <Badge bg="danger">Out of Stock</Badge>
                            ) : selectedProduct.stock <= 10 ? (
                              <Badge bg="warning">Low Stock</Badge>
                            ) : (
                              <Badge bg="success">In Stock</Badge>
                            )}
                          </div>
                        </div>
                      </div>
                    </Col>
                  </Row>

                  <Row className="mb-4">
                    <Col md={6}>
                      <div className="mb-3">
                        <strong style={{ color: "#495057" }}>Category:</strong>
                        <Badge
                          bg="secondary"
                          className="ms-2"
                          style={{ fontSize: "12px" }}
                        >
                          {selectedProduct.category}
                        </Badge>
                      </div>
                      <div className="mb-3">
                        <strong style={{ color: "#495057" }}>
                          Weight/Size:
                        </strong>
                        <span className="ms-2">{selectedProduct.weight}</span>
                      </div>
                    </Col>
                    <Col md={6}>
                      <div className="mb-3">
                        <strong style={{ color: "#495057" }}>
                          Last Updated:
                        </strong>
                        <span className="ms-2">
                          {selectedProduct.lastUpdated}
                        </span>
                      </div>
                      <div className="mb-3">
                        <strong style={{ color: "#495057" }}>
                          Product ID:
                        </strong>
                        <span className="ms-2">#{selectedProduct.id}</span>
                      </div>
                    </Col>
                  </Row>
                </Col>
              </Row>

              <Row className="mt-4">
                <Col md={12}>
                  <div className="mb-4">
                    <h5 style={{ color: "#e63946", marginBottom: "15px" }}>
                      📝 Description
                    </h5>
                    <p
                      style={{
                        color: "#495057",
                        lineHeight: "1.6",
                        fontSize: "14px",
                      }}
                    >
                      {selectedProduct.description}
                    </p>
                  </div>

                  {selectedProduct.benefits && (
                    <div className="mb-4">
                      <h5 style={{ color: "#e63946", marginBottom: "15px" }}>
                        ✨ Benefits
                      </h5>
                      <div
                        style={{
                          background: "#f8f9fa",
                          padding: "15px",
                          borderRadius: "10px",
                          border: "1px solid #e9ecef",
                        }}
                      >
                        {selectedProduct.benefits
                          .split("\n")
                          .map((benefit, index) => (
                            <div
                              key={index}
                              style={{
                                marginBottom: "8px",
                                color: "#495057",
                                fontSize: "14px",
                              }}
                            >
                              <i
                                className="bi bi-check-circle-fill me-2"
                                style={{ color: "#28a745" }}
                              ></i>
                              {benefit}
                            </div>
                          ))}
                      </div>
                    </div>
                  )}

                  {selectedProduct.usage && (
                    <div className="mb-4">
                      <h5 style={{ color: "#e63946", marginBottom: "15px" }}>
                        💊 Usage Instructions
                      </h5>
                      <div
                        style={{
                          background: "#fff3cd",
                          padding: "15px",
                          borderRadius: "10px",
                          border: "1px solid #ffeaa7",
                        }}
                      >
                        <p
                          style={{
                            color: "#856404",
                            marginBottom: "0",
                            fontSize: "14px",
                            lineHeight: "1.6",
                          }}
                        >
                          {selectedProduct.usage}
                        </p>
                      </div>
                    </div>
                  )}
                </Col>
              </Row>
            </div>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant="outline-secondary"
            onClick={() => setShowViewModal(false)}
          >
            Close
          </Button>
          <Button
            onClick={() => {
              setShowViewModal(false);
              setFormData(selectedProduct);
              setShowEditModal(true);
            }}
            style={{
              background: "#e63946",
              border: "none",
              padding: "8px 20px",
            }}
          >
            <i className="bi bi-pencil me-2"></i>
            Edit Product
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default AdminProducts;
