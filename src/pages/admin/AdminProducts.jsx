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
  Spinner,
  Toast,
  ToastContainer,
  Pagination,
} from "react-bootstrap";
import { Link } from "react-router-dom";
import { useRealTime } from "../../hooks/useRealTime";
import { api, safeApiCall } from "../../utils/apiClient";

const AdminProducts = () => {
  const [products, setProducts] = useState([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [productToDelete, setProductToDelete] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [stockFilter, setStockFilter] = useState("");
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [toastType, setToastType] = useState("success");

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalProducts, setTotalProducts] = useState(0);
  const productsPerPage = 10;

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

  const API_BASE_URL =
    import.meta.env.VITE_BACKEND_URL || "http://localhost:5000";

  const categories = [
    "Pain Relief",
    "Vitamins",
    "Cough & Cold",
    "First Aid",
    "Medical Devices",
    "Supplements",
    "Antibiotics",
    "Diabetes Care",
    "Heart Health",
    "Digestive Health",
  ];

  // Real-time event handlers
  const handleStockUpdated = (data) => {
    setProducts((prev) =>
      prev.map((product) =>
        product._id === data.productId
          ? { ...product, stock: data.newStock }
          : product,
      ),
    );
    showNotification(`Stock updated for ${data.productName}`, "info");
  };

  const handleProductUpdated = (data) => {
    fetchProducts();
    showNotification(`Product ${data.productName} has been updated`, "info");
  };

  // Set up real-time listeners
  useRealTime("stock-updated", handleStockUpdated);
  useRealTime("product-updated", handleProductUpdated);

  const showNotification = (message, type = "success") => {
    setToastMessage(message);
    setToastType(type);
    setShowToast(true);
  };

  const fetchProducts = async () => {
    setLoading(true);
    setError(null);

    const queryParams = new URLSearchParams({
      page: currentPage,
      limit: productsPerPage,
      ...(searchTerm && { search: searchTerm }),
      ...(categoryFilter && { category: categoryFilter }),
      ...(stockFilter && { stockFilter: stockFilter }),
    });

    const {
      success,
      data,
      error: apiError,
    } = await safeApiCall(() => api.get(`/api/products?${queryParams}`), {
      products: [],
      pagination: { totalProducts: 0, totalPages: 1 },
    });

    if (success && data) {
      const productsData = data.data || data;
      setProducts(productsData.products || []);
      setTotalPages(productsData.pagination?.totalPages || 1);
      setTotalProducts(productsData.pagination?.totalProducts || 0);
    } else {
      setError(apiError || "Failed to fetch products");
      setProducts([]);
      setTotalPages(1);
      setTotalProducts(0);
    }

    setLoading(false);
  };

  useEffect(() => {
    fetchProducts();
  }, [currentPage, searchTerm, categoryFilter, stockFilter]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const validateForm = () => {
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

    return errors;
  };

  const handleAddProduct = async () => {
    const errors = validateForm();

    if (Object.keys(errors).length > 0) {
      showNotification(Object.values(errors)[0], "danger");
      return;
    }

    setActionLoading(true);

    const {
      success,
      data,
      error: apiError,
    } = await safeApiCall(() => api.post("/api/products", formData), null);

    if (success && data) {
      const productData = data.data || data;
      setProducts((prev) => [productData, ...prev]);
      setShowAddModal(false);
      resetForm();
      showNotification("Product added successfully!", "success");
    } else {
      showNotification(apiError || "Failed to add product", "danger");
    }

    setActionLoading(false);
  };

  const handleEditProduct = async () => {
    const errors = validateForm();

    if (Object.keys(errors).length > 0) {
      showNotification(Object.values(errors)[0], "danger");
      return;
    }

    try {
      setActionLoading(true);
      const response = await fetch(
        `${API_BASE_URL}/api/products/${selectedProduct._id}`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        },
      );

      if (!response.ok) {
        throw new Error("Failed to update product");
      }

      const data = await response.json();

      if (data.success) {
        setProducts((prev) =>
          prev.map((product) =>
            product._id === selectedProduct._id ? data.data : product,
          ),
        );
        setShowEditModal(false);
        resetForm();
        showNotification("Product updated successfully!", "success");
      } else {
        throw new Error(data.message || "Failed to update product");
      }
    } catch (error) {
      console.error("Error updating product:", error);
      showNotification(error.message, "danger");
    } finally {
      setActionLoading(false);
    }
  };

  const handleDeleteProduct = async () => {
    if (!productToDelete) return;

    try {
      setActionLoading(true);
      const response = await fetch(
        `${API_BASE_URL}/api/products/${productToDelete._id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
            "Content-Type": "application/json",
          },
        },
      );

      if (!response.ok) {
        throw new Error("Failed to delete product");
      }

      const data = await response.json();

      if (data.success) {
        setProducts((prev) =>
          prev.filter((product) => product._id !== productToDelete._id),
        );
        setShowDeleteModal(false);
        setProductToDelete(null);
        showNotification("Product deleted successfully!", "success");
      } else {
        throw new Error(data.message || "Failed to delete product");
      }
    } catch (error) {
      console.error("Error deleting product:", error);
      showNotification(error.message, "danger");
    } finally {
      setActionLoading(false);
    }
  };

  const resetForm = () => {
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
  };

  const handleAddClick = () => {
    resetForm();
    setSelectedProduct(null);
    setShowAddModal(true);
  };

  const handleEditClick = (product) => {
    setSelectedProduct(product);
    setFormData({
      name: product.name || "",
      company: product.company || "",
      price: product.price || "",
      originalPrice: product.originalPrice || "",
      stock: product.stock || "",
      category: product.category || "",
      description: product.description || "",
      benefits: product.benefits || "",
      usage: product.usage || "",
      weight: product.weight || "",
      images: product.images || [],
    });
    setShowEditModal(true);
  };

  const handleViewClick = (product) => {
    setSelectedProduct(product);
    setShowViewModal(true);
  };

  const confirmDeleteProduct = (product) => {
    setProductToDelete(product);
    setShowDeleteModal(true);
  };

  const getStockBadge = (stock) => {
    if (stock === 0) return <Badge bg="danger">Out of Stock</Badge>;
    if (stock <= 10) return <Badge bg="warning">Low Stock</Badge>;
    return <Badge bg="success">In Stock</Badge>;
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
    }).format(amount || 0);
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString();
  };

  const filteredProducts = products.filter((product) => {
    const matchesSearch =
      product.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.company?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory =
      !categoryFilter || product.category === categoryFilter;
    const matchesStock =
      !stockFilter ||
      (stockFilter === "in-stock" && product.stock > 10) ||
      (stockFilter === "low-stock" &&
        product.stock > 0 &&
        product.stock <= 10) ||
      (stockFilter === "out-of-stock" && product.stock === 0);

    return matchesSearch && matchesCategory && matchesStock;
  });

  if (loading && products.length === 0) {
    return (
      <div
        className="d-flex justify-content-center align-items-center"
        style={{ minHeight: "400px" }}
      >
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Loading...</span>
        </Spinner>
      </div>
    );
  }

  return (
    <div className="fade-in">
      <section className="section-padding-sm">
        <Container>
          {/* Header */}
          <Row className="mb-4">
            <Col lg={8}>
              <h2>Product Management</h2>
              <p className="text-muted">
                Manage your medical products and inventory
              </p>
            </Col>
            <Col lg={4} className="text-end">
              <Button
                variant="primary"
                onClick={handleAddClick}
                className="btn-medical-primary me-2"
              >
                <i className="bi bi-plus-circle me-2"></i>
                Add Product
              </Button>
              <Button
                variant="outline-primary"
                onClick={() => fetchProducts()}
                disabled={loading}
                className="btn-medical-outline"
              >
                <i className="bi bi-arrow-clockwise me-2"></i>
                Refresh
              </Button>
            </Col>
          </Row>

          {/* Error Alert */}
          {error && (
            <Alert variant="danger" dismissible onClose={() => setError(null)}>
              <i className="bi bi-exclamation-triangle me-2"></i>
              {error}
            </Alert>
          )}

          {/* Filters */}
          <Row className="mb-4">
            <Col lg={4}>
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
                {categories.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </Form.Select>
            </Col>
            <Col lg={3}>
              <Form.Select
                value={stockFilter}
                onChange={(e) => setStockFilter(e.target.value)}
              >
                <option value="">All Stock Levels</option>
                <option value="in-stock">In Stock</option>
                <option value="low-stock">Low Stock</option>
                <option value="out-of-stock">Out of Stock</option>
              </Form.Select>
            </Col>
            <Col lg={2}>
              <Button
                variant="outline-secondary"
                onClick={() => {
                  setSearchTerm("");
                  setCategoryFilter("");
                  setStockFilter("");
                  setCurrentPage(1);
                }}
                className="w-100"
              >
                Clear
              </Button>
            </Col>
          </Row>

          {/* Products Table */}
          <Card className="medical-card">
            <Card.Header className="bg-medical-light">
              <h5 className="mb-0">
                <i className="bi bi-box me-2"></i>
                Products ({filteredProducts.length})
              </h5>
            </Card.Header>
            <Card.Body className="p-0">
              {loading ? (
                <div className="text-center py-4">
                  <Spinner animation="border" role="status">
                    <span className="visually-hidden">Loading...</span>
                  </Spinner>
                </div>
              ) : filteredProducts.length > 0 ? (
                <div className="table-responsive">
                  <Table className="mb-0">
                    <thead className="table-light">
                      <tr>
                        <th>Product</th>
                        <th>Category</th>
                        <th>Price</th>
                        <th>Stock</th>
                        <th>Status</th>
                        <th>Updated</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredProducts.map((product) => (
                        <tr key={product._id}>
                          <td>
                            <div className="d-flex align-items-center">
                              <div
                                className="bg-medical-blue text-white rounded me-3 d-flex align-items-center justify-content-center"
                                style={{ width: "50px", height: "50px" }}
                              >
                                <i className="bi bi-capsule"></i>
                              </div>
                              <div>
                                <div className="fw-bold">{product.name}</div>
                                <small className="text-muted">
                                  {product.company}
                                </small>
                              </div>
                            </div>
                          </td>
                          <td>
                            <Badge bg="secondary">{product.category}</Badge>
                          </td>
                          <td>
                            <div>
                              <span className="fw-bold text-medical-red">
                                {formatCurrency(product.price)}
                              </span>
                              {product.originalPrice &&
                                product.originalPrice > product.price && (
                                  <div>
                                    <small className="text-muted text-decoration-line-through">
                                      {formatCurrency(product.originalPrice)}
                                    </small>
                                  </div>
                                )}
                            </div>
                          </td>
                          <td>
                            <span className="fw-bold">{product.stock}</span>
                          </td>
                          <td>{getStockBadge(product.stock)}</td>
                          <td>
                            <small className="text-muted">
                              {formatDate(product.updatedAt)}
                            </small>
                          </td>
                          <td>
                            <div className="btn-group" role="group">
                              <Button
                                size="sm"
                                variant="outline-primary"
                                onClick={() => handleViewClick(product)}
                                className="btn-medical-outline"
                              >
                                <i className="bi bi-eye"></i>
                              </Button>
                              <Button
                                size="sm"
                                variant="outline-warning"
                                onClick={() => handleEditClick(product)}
                              >
                                <i className="bi bi-pencil"></i>
                              </Button>
                              <Button
                                size="sm"
                                variant="outline-danger"
                                onClick={() => confirmDeleteProduct(product)}
                                disabled={actionLoading}
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
              ) : (
                <div className="text-center py-5">
                  <i
                    className="bi bi-box text-muted"
                    style={{ fontSize: "3rem" }}
                  ></i>
                  <h5 className="text-muted mt-3">No products found</h5>
                  <p className="text-muted">
                    {searchTerm || categoryFilter || stockFilter
                      ? "Try adjusting your filters"
                      : "No products have been added yet"}
                  </p>
                  <Button
                    variant="primary"
                    onClick={handleAddClick}
                    className="btn-medical-primary"
                  >
                    <i className="bi bi-plus-circle me-2"></i>
                    Add First Product
                  </Button>
                </div>
              )}
            </Card.Body>
          </Card>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="d-flex justify-content-center mt-4">
              <Pagination>
                <Pagination.First
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage(1)}
                />
                <Pagination.Prev
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage(currentPage - 1)}
                />

                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                  const startPage = Math.max(1, currentPage - 2);
                  const pageNumber = startPage + i;

                  if (pageNumber > totalPages) return null;

                  return (
                    <Pagination.Item
                      key={pageNumber}
                      active={pageNumber === currentPage}
                      onClick={() => setCurrentPage(pageNumber)}
                    >
                      {pageNumber}
                    </Pagination.Item>
                  );
                })}

                <Pagination.Next
                  disabled={currentPage === totalPages}
                  onClick={() => setCurrentPage(currentPage + 1)}
                />
                <Pagination.Last
                  disabled={currentPage === totalPages}
                  onClick={() => setCurrentPage(totalPages)}
                />
              </Pagination>
            </div>
          )}
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
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Product Name *</Form.Label>
                  <Form.Control
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder="Enter product name"
                    required
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Company *</Form.Label>
                  <Form.Control
                    type="text"
                    name="company"
                    value={formData.company}
                    onChange={handleInputChange}
                    placeholder="Enter company name"
                    required
                  />
                </Form.Group>
              </Col>
            </Row>

            <Row>
              <Col md={4}>
                <Form.Group className="mb-3">
                  <Form.Label>Price *</Form.Label>
                  <InputGroup>
                    <InputGroup.Text>₹</InputGroup.Text>
                    <Form.Control
                      type="number"
                      name="price"
                      value={formData.price}
                      onChange={handleInputChange}
                      placeholder="0.00"
                      step="0.01"
                      min="0"
                      required
                    />
                  </InputGroup>
                </Form.Group>
              </Col>
              <Col md={4}>
                <Form.Group className="mb-3">
                  <Form.Label>Original Price</Form.Label>
                  <InputGroup>
                    <InputGroup.Text>₹</InputGroup.Text>
                    <Form.Control
                      type="number"
                      name="originalPrice"
                      value={formData.originalPrice}
                      onChange={handleInputChange}
                      placeholder="0.00"
                      step="0.01"
                      min="0"
                    />
                  </InputGroup>
                </Form.Group>
              </Col>
              <Col md={4}>
                <Form.Group className="mb-3">
                  <Form.Label>Stock Quantity *</Form.Label>
                  <Form.Control
                    type="number"
                    name="stock"
                    value={formData.stock}
                    onChange={handleInputChange}
                    placeholder="0"
                    min="0"
                    required
                  />
                </Form.Group>
              </Col>
            </Row>

            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Category *</Form.Label>
                  <Form.Select
                    name="category"
                    value={formData.category}
                    onChange={handleInputChange}
                    required
                  >
                    <option value="">Select Category</option>
                    {categories.map((category) => (
                      <option key={category} value={category}>
                        {category}
                      </option>
                    ))}
                  </Form.Select>
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Weight/Size *</Form.Label>
                  <Form.Control
                    type="text"
                    name="weight"
                    value={formData.weight}
                    onChange={handleInputChange}
                    placeholder="e.g., 500mg, 100ml, 50 tablets"
                    required
                  />
                </Form.Group>
              </Col>
            </Row>

            <Form.Group className="mb-3">
              <Form.Label>Description *</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                placeholder="Enter product description"
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Benefits</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                name="benefits"
                value={formData.benefits}
                onChange={handleInputChange}
                placeholder="List product benefits (one per line)"
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Usage Instructions</Form.Label>
              <Form.Control
                as="textarea"
                rows={2}
                name="usage"
                value={formData.usage}
                onChange={handleInputChange}
                placeholder="Enter usage instructions"
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowAddModal(false)}>
            Cancel
          </Button>
          <Button
            variant="primary"
            onClick={handleAddProduct}
            disabled={actionLoading}
            className="btn-medical-primary"
          >
            {actionLoading ? (
              <>
                <Spinner animation="border" size="sm" className="me-2" />
                Adding...
              </>
            ) : (
              <>
                <i className="bi bi-plus-circle me-2"></i>
                Add Product
              </>
            )}
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
          {/* Same form as Add Modal */}
          <Form>
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Product Name *</Form.Label>
                  <Form.Control
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder="Enter product name"
                    required
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Company *</Form.Label>
                  <Form.Control
                    type="text"
                    name="company"
                    value={formData.company}
                    onChange={handleInputChange}
                    placeholder="Enter company name"
                    required
                  />
                </Form.Group>
              </Col>
            </Row>

            <Row>
              <Col md={4}>
                <Form.Group className="mb-3">
                  <Form.Label>Price *</Form.Label>
                  <InputGroup>
                    <InputGroup.Text>₹</InputGroup.Text>
                    <Form.Control
                      type="number"
                      name="price"
                      value={formData.price}
                      onChange={handleInputChange}
                      placeholder="0.00"
                      step="0.01"
                      min="0"
                      required
                    />
                  </InputGroup>
                </Form.Group>
              </Col>
              <Col md={4}>
                <Form.Group className="mb-3">
                  <Form.Label>Original Price</Form.Label>
                  <InputGroup>
                    <InputGroup.Text>₹</InputGroup.Text>
                    <Form.Control
                      type="number"
                      name="originalPrice"
                      value={formData.originalPrice}
                      onChange={handleInputChange}
                      placeholder="0.00"
                      step="0.01"
                      min="0"
                    />
                  </InputGroup>
                </Form.Group>
              </Col>
              <Col md={4}>
                <Form.Group className="mb-3">
                  <Form.Label>Stock Quantity *</Form.Label>
                  <Form.Control
                    type="number"
                    name="stock"
                    value={formData.stock}
                    onChange={handleInputChange}
                    placeholder="0"
                    min="0"
                    required
                  />
                </Form.Group>
              </Col>
            </Row>

            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Category *</Form.Label>
                  <Form.Select
                    name="category"
                    value={formData.category}
                    onChange={handleInputChange}
                    required
                  >
                    <option value="">Select Category</option>
                    {categories.map((category) => (
                      <option key={category} value={category}>
                        {category}
                      </option>
                    ))}
                  </Form.Select>
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Weight/Size *</Form.Label>
                  <Form.Control
                    type="text"
                    name="weight"
                    value={formData.weight}
                    onChange={handleInputChange}
                    placeholder="e.g., 500mg, 100ml, 50 tablets"
                    required
                  />
                </Form.Group>
              </Col>
            </Row>

            <Form.Group className="mb-3">
              <Form.Label>Description *</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                placeholder="Enter product description"
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Benefits</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                name="benefits"
                value={formData.benefits}
                onChange={handleInputChange}
                placeholder="List product benefits (one per line)"
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Usage Instructions</Form.Label>
              <Form.Control
                as="textarea"
                rows={2}
                name="usage"
                value={formData.usage}
                onChange={handleInputChange}
                placeholder="Enter usage instructions"
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowEditModal(false)}>
            Cancel
          </Button>
          <Button
            variant="primary"
            onClick={handleEditProduct}
            disabled={actionLoading}
            className="btn-medical-primary"
          >
            {actionLoading ? (
              <>
                <Spinner animation="border" size="sm" className="me-2" />
                Updating...
              </>
            ) : (
              <>
                <i className="bi bi-check-circle me-2"></i>
                Update Product
              </>
            )}
          </Button>
        </Modal.Footer>
      </Modal>

      {/* View Product Modal */}
      <Modal
        show={showViewModal}
        onHide={() => setShowViewModal(false)}
        size="lg"
      >
        <Modal.Header closeButton>
          <Modal.Title>Product Details</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedProduct && (
            <div>
              <Row>
                <Col md={8}>
                  <h4>{selectedProduct.name}</h4>
                  <p className="text-muted">{selectedProduct.company}</p>
                  <Badge bg="secondary" className="me-2">
                    {selectedProduct.category}
                  </Badge>
                  {getStockBadge(selectedProduct.stock)}
                </Col>
                <Col md={4} className="text-end">
                  <h3 className="text-medical-red">
                    {formatCurrency(selectedProduct.price)}
                  </h3>
                  {selectedProduct.originalPrice &&
                    selectedProduct.originalPrice > selectedProduct.price && (
                      <p className="text-muted text-decoration-line-through">
                        {formatCurrency(selectedProduct.originalPrice)}
                      </p>
                    )}
                </Col>
              </Row>

              <hr />

              <Row>
                <Col md={6}>
                  <p>
                    <strong>Stock:</strong> {selectedProduct.stock} units
                  </p>
                  <p>
                    <strong>Weight/Size:</strong> {selectedProduct.weight}
                  </p>
                  <p>
                    <strong>Added:</strong>{" "}
                    {formatDate(selectedProduct.createdAt)}
                  </p>
                </Col>
                <Col md={6}>
                  <p>
                    <strong>Category:</strong> {selectedProduct.category}
                  </p>
                  <p>
                    <strong>Company:</strong> {selectedProduct.company}
                  </p>
                  <p>
                    <strong>Updated:</strong>{" "}
                    {formatDate(selectedProduct.updatedAt)}
                  </p>
                </Col>
              </Row>

              <hr />

              <h6>Description</h6>
              <p className="text-muted">{selectedProduct.description}</p>

              {selectedProduct.benefits && (
                <>
                  <h6>Benefits</h6>
                  <p className="text-muted">{selectedProduct.benefits}</p>
                </>
              )}

              {selectedProduct.usage && (
                <>
                  <h6>Usage Instructions</h6>
                  <p className="text-muted">{selectedProduct.usage}</p>
                </>
              )}
            </div>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowViewModal(false)}>
            Close
          </Button>
          <Button
            variant="warning"
            onClick={() => {
              setShowViewModal(false);
              handleEditClick(selectedProduct);
            }}
          >
            <i className="bi bi-pencil me-2"></i>
            Edit Product
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        show={showDeleteModal}
        onHide={() => setShowDeleteModal(false)}
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>Confirm Delete</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="text-center">
            <i
              className="bi bi-exclamation-triangle text-warning"
              style={{ fontSize: "3rem" }}
            ></i>
            <h5 className="mt-3">Are you sure?</h5>
            <p className="text-muted">
              This action will permanently delete{" "}
              <strong>{productToDelete?.name}</strong>. This cannot be undone.
            </p>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>
            Cancel
          </Button>
          <Button
            variant="danger"
            onClick={handleDeleteProduct}
            disabled={actionLoading}
          >
            {actionLoading ? (
              <>
                <Spinner animation="border" size="sm" className="me-2" />
                Deleting...
              </>
            ) : (
              <>
                <i className="bi bi-trash me-2"></i>
                Delete Product
              </>
            )}
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Toast Notifications */}
      <ToastContainer position="top-end" className="p-3">
        <Toast
          show={showToast}
          onClose={() => setShowToast(false)}
          delay={4000}
          autohide
          bg={toastType}
        >
          <Toast.Header>
            <strong className="me-auto">
              {toastType === "success"
                ? "Success"
                : toastType === "danger"
                  ? "Error"
                  : toastType === "warning"
                    ? "Warning"
                    : "Info"}
            </strong>
          </Toast.Header>
          <Toast.Body className={toastType === "success" ? "text-white" : ""}>
            {toastMessage}
          </Toast.Body>
        </Toast>
      </ToastContainer>
    </div>
  );
};

export default AdminProducts;
