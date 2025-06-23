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
import {
  PageHeroSection,
  ThemeCard,
  ThemeButton,
  ThemeSection,
} from "../../components/common/ConsistentTheme";

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

  const [imageFiles, setImageFiles] = useState([]);
  const [imagePreviewUrls, setImagePreviewUrls] = useState([]);
  const [imageUploadError, setImageUploadError] = useState("");

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

  const fetchProducts = async (page = currentPage) => {
    setLoading(true);
    setError(null);

    const {
      success,
      data,
      error: apiError,
    } = await safeApiCall(
      () =>
        api.get(
          `/api/products?page=${page}&limit=${productsPerPage}&admin=true`,
        ),
      [],
    );

    if (success && data?.data) {
      const productsData = Array.isArray(data.data)
        ? data.data
        : data.data.products || [];
      setProducts(productsData);
      setTotalProducts(data.data.total || productsData.length);
      setTotalPages(
        Math.ceil((data.data.total || productsData.length) / productsPerPage),
      );
    } else {
      setError(apiError || "Failed to fetch products");
      setProducts([]);
    }

    setLoading(false);
  };

  useEffect(() => {
    fetchProducts();
  }, [currentPage]);

  const handleSubmit = async (e, isEdit = false) => {
    e.preventDefault();
    setActionLoading(true);

    if (!formData.name || !formData.price || !formData.stock) {
      showNotification("Please fill in all required fields", "danger");
      setActionLoading(false);
      return;
    }

    // Validate images for new products
    if (!isEdit && imageFiles.length === 0) {
      showNotification("At least one product image is required", "danger");
      setActionLoading(false);
      return;
    }

    const productData = {
      ...formData,
      price: parseFloat(formData.price),
      originalPrice:
        parseFloat(formData.originalPrice) || parseFloat(formData.price),
      stock: parseInt(formData.stock),
      benefits: formatBenefits(formData.benefits), // Format benefits as bullet points
    };

    const { success, error: apiError } = isEdit
      ? await safeApiCall(() =>
          api.put(`/api/products/${selectedProduct._id}`, productData),
        )
      : await safeApiCall(() => api.post("/api/products", productData));

    if (success) {
      await fetchProducts();
      resetForm();
      setShowAddModal(false);
      setShowEditModal(false);
      showNotification(
        `Product ${isEdit ? "updated" : "added"} successfully!`,
        "success",
      );
    } else {
      showNotification(
        apiError || `Failed to ${isEdit ? "update" : "add"} product`,
        "danger",
      );
    }

    setActionLoading(false);
  };

  const handleDelete = async () => {
    if (!productToDelete) return;

    setActionLoading(true);

    const { success, error: apiError } = await safeApiCall(() =>
      api.delete(`/api/products/${productToDelete._id}`),
    );

    if (success) {
      setProducts((prev) =>
        prev.filter((product) => product._id !== productToDelete._id),
      );
      setShowDeleteModal(false);
      setProductToDelete(null);
      showNotification("Product deleted successfully!", "success");
    } else {
      showNotification(apiError || "Failed to delete product", "danger");
    }

    setActionLoading(false);
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
    setImageFiles([]);
    setImagePreviewUrls([]);
    setImageUploadError("");
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    setImageUploadError("");

    if (files.length === 0) {
      setImageUploadError("At least one image is required");
      return;
    }

    if (files.length > 5) {
      setImageUploadError("Maximum 5 images allowed");
      return;
    }

    // Validate each file
    const validFiles = [];
    const previews = [];

    files.forEach((file) => {
      if (!file.type.startsWith("image/")) {
        setImageUploadError("Only image files are allowed");
        return;
      }

      if (file.size > 5 * 1024 * 1024) {
        // 5MB limit
        setImageUploadError("Each image must be less than 5MB");
        return;
      }

      validFiles.push(file);

      // Create preview URL
      const reader = new FileReader();
      reader.onload = (e) => {
        previews.push(e.target.result);
        if (previews.length === validFiles.length) {
          setImagePreviewUrls(previews);
        }
      };
      reader.readAsDataURL(file);
    });

    setImageFiles(validFiles);
  };

  const removeImage = (index) => {
    const newFiles = imageFiles.filter((_, i) => i !== index);
    const newPreviews = imagePreviewUrls.filter((_, i) => i !== index);

    setImageFiles(newFiles);
    setImagePreviewUrls(newPreviews);

    if (newFiles.length === 0) {
      setImageUploadError("At least one image is required");
    } else {
      setImageUploadError("");
    }
  };

  const formatBenefits = (benefitsText) => {
    if (!benefitsText) return "";

    return benefitsText
      .split("\n")
      .filter((line) => line.trim() !== "")
      .map((line) => `• ${line.trim()}`)
      .join("\n");
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

  // Apply filters
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
      {/* Hero Section */}
      <PageHeroSection
        title="Product Management"
        subtitle="Manage your medical products and inventory with comprehensive tools"
        icon="bi-box"
      />

      <ThemeSection background="#f8f9fa">
        <Container>
          {/* Quick Actions */}
          <Row className="mb-4">
            <Col lg={12}>
              <ThemeCard title="Quick Actions" className="mb-4">
                <Row>
                  <Col lg={8}>
                    <p className="text-muted mb-3">
                      Add new products, update inventory, and manage your
                      medical store catalog
                    </p>
                  </Col>
                  <Col lg={4} className="text-end">
                    <ThemeButton
                      variant="primary"
                      onClick={handleAddClick}
                      className="me-2"
                      icon="bi-plus-circle"
                    >
                      Add Product
                    </ThemeButton>
                    <ThemeButton
                      variant="outline"
                      onClick={() => fetchProducts()}
                      disabled={loading}
                      icon="bi-arrow-clockwise"
                    >
                      Refresh
                    </ThemeButton>
                  </Col>
                </Row>
              </ThemeCard>
            </Col>
          </Row>

          {/* Error Alert */}
          {error && (
            <Row className="mb-4">
              <Col lg={12}>
                <Alert
                  variant="danger"
                  dismissible
                  onClose={() => setError(null)}
                >
                  <i className="bi bi-exclamation-triangle me-2"></i>
                  {error}
                </Alert>
              </Col>
            </Row>
          )}

          {/* Filters */}
          <Row className="mb-4">
            <Col lg={12}>
              <ThemeCard
                title="Search & Filter"
                icon="bi-funnel"
                className="mb-4"
              >
                <Row>
                  <Col lg={4} className="mb-3 mb-lg-0">
                    <Form.Label className="text-muted small">
                      Search Products
                    </Form.Label>
                    <InputGroup>
                      <InputGroup.Text>
                        <i className="bi bi-search"></i>
                      </InputGroup.Text>
                      <Form.Control
                        type="text"
                        placeholder="Search by name or company..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                      />
                    </InputGroup>
                  </Col>
                  <Col lg={3} className="mb-3 mb-lg-0">
                    <Form.Label className="text-muted small">
                      Category
                    </Form.Label>
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
                  <Col lg={3} className="mb-3 mb-lg-0">
                    <Form.Label className="text-muted small">
                      Stock Level
                    </Form.Label>
                    <Form.Select
                      value={stockFilter}
                      onChange={(e) => setStockFilter(e.target.value)}
                    >
                      <option value="">All Stock Levels</option>
                      <option value="in-stock">In Stock (10+)</option>
                      <option value="low-stock">Low Stock (1-10)</option>
                      <option value="out-of-stock">Out of Stock</option>
                    </Form.Select>
                  </Col>
                  <Col lg={2} className="d-flex align-items-end">
                    <ThemeButton
                      variant="outline"
                      onClick={() => {
                        setSearchTerm("");
                        setCategoryFilter("");
                        setStockFilter("");
                        setCurrentPage(1);
                      }}
                      className="w-100"
                      icon="bi-x-circle"
                    >
                      Clear
                    </ThemeButton>
                  </Col>
                </Row>
              </ThemeCard>
            </Col>
          </Row>

          {/* Products Table */}
          <Row>
            <Col lg={12}>
              <ThemeCard
                title={`Products (${filteredProducts.length})`}
                icon="bi-box"
                className="table-card"
              >
                {loading ? (
                  <div className="text-center py-4">
                    <Spinner animation="border" role="status">
                      <span className="visually-hidden">Loading...</span>
                    </Spinner>
                  </div>
                ) : filteredProducts.length > 0 ? (
                  <>
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
                                    <div className="fw-bold">
                                      {product.name}
                                    </div>
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
                                  <strong>
                                    {formatCurrency(product.price)}
                                  </strong>
                                  {product.originalPrice !== product.price && (
                                    <div>
                                      <small className="text-decoration-line-through text-muted">
                                        {formatCurrency(product.originalPrice)}
                                      </small>
                                    </div>
                                  )}
                                </div>
                              </td>
                              <td>
                                <div className="text-center">
                                  <div className="fw-bold">{product.stock}</div>
                                </div>
                              </td>
                              <td>{getStockBadge(product.stock)}</td>
                              <td>{formatDate(product.updatedAt)}</td>
                              <td>
                                <div className="d-flex gap-1">
                                  <Button
                                    size="sm"
                                    variant="outline-primary"
                                    onClick={() => handleViewClick(product)}
                                    title="View Details"
                                  >
                                    <i className="bi bi-eye"></i>
                                  </Button>
                                  <Button
                                    size="sm"
                                    variant="outline-success"
                                    onClick={() => handleEditClick(product)}
                                    title="Edit Product"
                                  >
                                    <i className="bi bi-pencil"></i>
                                  </Button>
                                  <Button
                                    size="sm"
                                    variant="outline-danger"
                                    onClick={() =>
                                      confirmDeleteProduct(product)
                                    }
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

                          {Array.from({ length: totalPages }, (_, i) => i + 1)
                            .slice(
                              Math.max(0, currentPage - 3),
                              Math.min(totalPages, currentPage + 2),
                            )
                            .map((pageNumber) => (
                              <Pagination.Item
                                key={pageNumber}
                                active={pageNumber === currentPage}
                                onClick={() => setCurrentPage(pageNumber)}
                              >
                                {pageNumber}
                              </Pagination.Item>
                            ))}

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
                  </>
                ) : (
                  <div className="text-center py-5">
                    <div className="text-muted">
                      <i className="bi bi-box display-1"></i>
                      <h5 className="mt-3">No products found</h5>
                      <p>
                        {searchTerm || categoryFilter || stockFilter
                          ? "Try adjusting your filters"
                          : "Add your first product to get started"}
                      </p>
                      {!(searchTerm || categoryFilter || stockFilter) && (
                        <ThemeButton
                          variant="primary"
                          onClick={handleAddClick}
                          icon="bi-plus-circle"
                          className="mt-3"
                        >
                          Add Your First Product
                        </ThemeButton>
                      )}
                    </div>
                  </div>
                )}
              </ThemeCard>
            </Col>
          </Row>
        </Container>
      </ThemeSection>

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
          <Form onSubmit={(e) => handleSubmit(e, false)}>
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Product Name *</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Enter product name"
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    required
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Company</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Enter company name"
                    value={formData.company}
                    onChange={(e) =>
                      setFormData({ ...formData, company: e.target.value })
                    }
                  />
                </Form.Group>
              </Col>
            </Row>

            <Row>
              <Col md={4}>
                <Form.Group className="mb-3">
                  <Form.Label>Price *</Form.Label>
                  <Form.Control
                    type="number"
                    step="0.01"
                    placeholder="0.00"
                    value={formData.price}
                    onChange={(e) =>
                      setFormData({ ...formData, price: e.target.value })
                    }
                    required
                  />
                </Form.Group>
              </Col>
              <Col md={4}>
                <Form.Group className="mb-3">
                  <Form.Label>Original Price</Form.Label>
                  <Form.Control
                    type="number"
                    step="0.01"
                    placeholder="0.00"
                    value={formData.originalPrice}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        originalPrice: e.target.value,
                      })
                    }
                  />
                </Form.Group>
              </Col>
              <Col md={4}>
                <Form.Group className="mb-3">
                  <Form.Label>Stock *</Form.Label>
                  <Form.Control
                    type="number"
                    placeholder="0"
                    value={formData.stock}
                    onChange={(e) =>
                      setFormData({ ...formData, stock: e.target.value })
                    }
                    required
                  />
                </Form.Group>
              </Col>
            </Row>

            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Category</Form.Label>
                  <Form.Select
                    value={formData.category}
                    onChange={(e) =>
                      setFormData({ ...formData, category: e.target.value })
                    }
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
                  <Form.Label>Weight</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="e.g., 500mg, 10ml"
                    value={formData.weight}
                    onChange={(e) =>
                      setFormData({ ...formData, weight: e.target.value })
                    }
                  />
                </Form.Group>
              </Col>
            </Row>

            <Form.Group className="mb-3">
              <Form.Label>Description</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                placeholder="Enter detailed product description"
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>
                Product Benefits <span className="text-danger">*</span>
              </Form.Label>
              <Form.Control
                as="textarea"
                rows={4}
                placeholder="Enter product benefits (each line will be a bullet point)&#10;Example:&#10;Reduces pain and inflammation&#10;Fast-acting relief&#10;Safe for daily use"
                value={formData.benefits}
                onChange={(e) =>
                  setFormData({ ...formData, benefits: e.target.value })
                }
                required
              />
              <Form.Text className="text-muted">
                <i className="bi bi-info-circle me-1"></i>
                Each new line will be displayed as a separate bullet point
              </Form.Text>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Usage Instructions</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                placeholder="Enter detailed usage instructions"
                value={formData.usage}
                onChange={(e) =>
                  setFormData({ ...formData, usage: e.target.value })
                }
              />
            </Form.Group>


                            style={{
                              width: "100%",
                              height: "100px",
                              objectFit: "cover",
                            }}
                          />
                        </Col>
                      ))}
                    </Row>
                  </div>
                )}

              {/* New Image Previews */}
              {imagePreviewUrls.length > 0 && (
                <div className="image-preview-container">
                  <label className="form-label small text-muted">
                    New Images Preview:
                  </label>
                  <Row className="g-2">
                    {imagePreviewUrls.map((url, index) => (
                      <Col xs={6} md={4} lg={3} key={index}>
                        <div className="position-relative">
                          <img
                            src={url}
                            alt={`Preview ${index + 1}`}
                            className="img-fluid rounded border"
                            style={{
                              width: "100%",
                              height: "100px",
                              objectFit: "cover",
                            }}
                          />
                          <Button
                            variant="danger"
                            size="sm"
                            className="position-absolute top-0 end-0 m-1 rounded-circle"
                            style={{
                              width: "24px",
                              height: "24px",
                              padding: "0",
                            }}
                            onClick={() => removeImage(index)}
                          >
                            <i
                              className="bi bi-x"
                              style={{ fontSize: "12px" }}
                            ></i>
                          </Button>
                        </div>
                      </Col>
                    ))}
                  </Row>
                </div>
              )}
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>
                Product Benefits <span className="text-danger">*</span>
              </Form.Label>
              <Form.Control
                as="textarea"
                rows={4}
                placeholder="Enter product benefits (each line will be a bullet point)&#10;Example:&#10;Reduces pain and inflammation&#10;Fast-acting relief&#10;Safe for daily use"
                value={formData.benefits}
                onChange={(e) =>
                  setFormData({ ...formData, benefits: e.target.value })
                }
                required
              />
              <Form.Text className="text-muted">
                <i className="bi bi-info-circle me-1"></i>
                Each new line will be displayed as a separate bullet point
              </Form.Text>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Usage Instructions</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                placeholder="Enter detailed usage instructions"
                value={formData.usage}
                onChange={(e) =>
                  setFormData({ ...formData, usage: e.target.value })
                }
              />
            </Form.Group>

            <Form.Group className="mb-4">
              <Form.Label>
                Product Images <span className="text-danger">*</span>
              </Form.Label>
              <Form.Control
                type="file"
                multiple
                accept="image/*"
                onChange={handleImageChange}
                className="mb-3"
                required={!selectedProduct}
              />
              <Form.Text className="text-muted mb-3">
                <i className="bi bi-info-circle me-1"></i>
                Upload 1-5 high-quality images. Maximum 5MB per image. JPG, PNG,
                WebP formats supported.
              </Form.Text>

              {imageUploadError && (
                <Alert variant="danger" className="py-2">
                  <i className="bi bi-exclamation-triangle me-2"></i>
                  {imageUploadError}
                </Alert>
              )}

              {/* Image Previews */}
              {imagePreviewUrls.length > 0 && (
                <div className="image-preview-container">
                  <label className="form-label small text-muted">
                    Preview:
                  </label>
                  <Row className="g-2">
                    {imagePreviewUrls.map((url, index) => (
                      <Col xs={6} md={4} lg={3} key={index}>
                        <div className="position-relative">
                          <img
                            src={url}
                            alt={`Preview ${index + 1}`}
                            className="img-fluid rounded border"
                            style={{
                              width: "100%",
                              height: "100px",
                              objectFit: "cover",
                            }}
                          />
                          <Button
                            variant="danger"
                            size="sm"
                            className="position-absolute top-0 end-0 m-1 rounded-circle"
                            style={{
                              width: "24px",
                              height: "24px",
                              padding: "0",
                            }}
                            onClick={() => removeImage(index)}
                          >
                            <i
                              className="bi bi-x"
                              style={{ fontSize: "12px" }}
                            ></i>
                          </Button>
                        </div>
                      </Col>
                    ))}
                  </Row>
                </div>
              )}
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant="secondary"
            onClick={() => setShowAddModal(false)}
            disabled={actionLoading}
          >
            Cancel
          </Button>
          <Button
            variant="primary"
            onClick={(e) => handleSubmit(e, false)}
            disabled={actionLoading}
          >
            {actionLoading ? (
              <>
                <Spinner size="sm" className="me-2" />
                Adding...
              </>
            ) : (
              "Add Product"
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
          <Form onSubmit={(e) => handleSubmit(e, true)}>
            {/* Same form structure as Add Modal */}
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Product Name *</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Enter product name"
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    required
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Company</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Enter company name"
                    value={formData.company}
                    onChange={(e) =>
                      setFormData({ ...formData, company: e.target.value })
                    }
                  />
                </Form.Group>
              </Col>
            </Row>

            <Row>
              <Col md={4}>
                <Form.Group className="mb-3">
                  <Form.Label>Price *</Form.Label>
                  <Form.Control
                    type="number"
                    step="0.01"
                    placeholder="0.00"
                    value={formData.price}
                    onChange={(e) =>
                      setFormData({ ...formData, price: e.target.value })
                    }
                    required
                  />
                </Form.Group>
              </Col>
              <Col md={4}>
                <Form.Group className="mb-3">
                  <Form.Label>Original Price</Form.Label>
                  <Form.Control
                    type="number"
                    step="0.01"
                    placeholder="0.00"
                    value={formData.originalPrice}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        originalPrice: e.target.value,
                      })
                    }
                  />
                </Form.Group>
              </Col>
              <Col md={4}>
                <Form.Group className="mb-3">
                  <Form.Label>Stock *</Form.Label>
                  <Form.Control
                    type="number"
                    placeholder="0"
                    value={formData.stock}
                    onChange={(e) =>
                      setFormData({ ...formData, stock: e.target.value })
                    }
                    required
                  />
                </Form.Group>
              </Col>
            </Row>

            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Category</Form.Label>
                  <Form.Select
                    value={formData.category}
                    onChange={(e) =>
                      setFormData({ ...formData, category: e.target.value })
                    }
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
                  <Form.Label>Weight</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="e.g., 500mg, 10ml"
                    value={formData.weight}
                    onChange={(e) =>
                      setFormData({ ...formData, weight: e.target.value })
                    }
                  />
                </Form.Group>
              </Col>
            </Row>

            <Form.Group className="mb-3">
              <Form.Label>Description</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                placeholder="Enter product description"
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant="secondary"
            onClick={() => setShowEditModal(false)}
            disabled={actionLoading}
          >
            Cancel
          </Button>
          <Button
            variant="primary"
            onClick={(e) => handleSubmit(e, true)}
            disabled={actionLoading}
          >
            {actionLoading ? (
              <>
                <Spinner size="sm" className="me-2" />
                Updating...
              </>
            ) : (
              "Update Product"
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
            <Row>
              <Col md={12}>
                <Card className="border-0">
                  <Card.Body>
                    <Row>
                      <Col md={6}>
                        <h5 className="text-primary">{selectedProduct.name}</h5>
                        <p className="text-muted">{selectedProduct.company}</p>
                        <hr />
                        <p>
                          <strong>Category:</strong> {selectedProduct.category}
                        </p>
                        <p>
                          <strong>Price:</strong>{" "}
                          {formatCurrency(selectedProduct.price)}
                        </p>
                        <p>
                          <strong>Stock:</strong> {selectedProduct.stock} units
                        </p>
                        <p>
                          <strong>Weight:</strong>{" "}
                          {selectedProduct.weight || "N/A"}
                        </p>
                      </Col>
                      <Col md={6}>
                        <h6>Description</h6>
                        <p className="text-muted">
                          {selectedProduct.description ||
                            "No description available"}
                        </p>
                        <h6>Benefits</h6>
                        {selectedProduct.benefits ? (
                          <div className="text-muted">
                            {selectedProduct.benefits.split("\n").map(
                              (benefit, index) =>
                                benefit.trim() && (
                                  <div key={index} className="mb-1">
                                    {benefit.startsWith("•")
                                      ? benefit
                                      : `• ${benefit}`}
                                  </div>
                                ),
                            )}
                          </div>
                        ) : (
                          <p className="text-muted">No benefits listed</p>
                        )}

                        <h6 className="mt-3">Usage</h6>
                        <p className="text-muted">
                          {selectedProduct.usage || "No usage instructions"}
                        </p>

                        {/* Product Images */}
                        {selectedProduct.images &&
                          selectedProduct.images.length > 0 && (
                            <>
                              <h6 className="mt-3">Product Images</h6>
                              <Row className="g-2">
                                {selectedProduct.images.map(
                                  (imageUrl, index) => (
                                    <Col xs={6} md={4} key={index}>
                                      <img
                                        src={imageUrl}
                                        alt={`Product ${index + 1}`}
                                        className="img-fluid rounded border"
                                        style={{
                                          width: "100%",
                                          height: "120px",
                                          objectFit: "cover",
                                          cursor: "pointer",
                                        }}
                                        onClick={() =>
                                          window.open(imageUrl, "_blank")
                                        }
                                      />
                                    </Col>
                                  ),
                                )}
                              </Row>
                            </>
                          )}
                      </Col>
                    </Row>
                  </Card.Body>
                </Card>
              </Col>
            </Row>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowViewModal(false)}>
            <i className="bi bi-x me-2"></i>
            Close
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
            <i className="bi bi-exclamation-triangle display-1 text-warning mb-3"></i>
            <h5>Are you sure?</h5>
            <p>
              Do you really want to delete{" "}
              <strong>{productToDelete?.name}</strong>? This action cannot be
              undone.
            </p>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant="secondary"
            onClick={() => setShowDeleteModal(false)}
            disabled={actionLoading}
          >
            Cancel
          </Button>
          <Button
            variant="danger"
            onClick={handleDelete}
            disabled={actionLoading}
          >
            {actionLoading ? (
              <>
                <Spinner size="sm" className="me-2" />
                Deleting...
              </>
            ) : (
              "Delete Product"
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
        >
          <Toast.Header
            className={
              toastType === "success"
                ? "bg-success text-white"
                : toastType === "danger"
                  ? "bg-danger text-white"
                  : "bg-info text-white"
            }
          >
            <strong className="me-auto">
              {toastType === "success"
                ? "Success"
                : toastType === "danger"
                  ? "Error"
                  : "Info"}
            </strong>
          </Toast.Header>
          <Toast.Body className={toastType === "success" ? "text-white" : ""}>
            {toastMessage}
          </Toast.Body>
        </Toast>
      </ToastContainer>

      <style jsx>{`
        .image-preview-container {
          border: 2px dashed #e63946;
          border-radius: 8px;
          padding: 16px;
          background-color: rgba(230, 57, 70, 0.05);
        }

        .form-control:focus {
          border-color: #e63946;
          box-shadow: 0 0 0 0.2rem rgba(230, 57, 70, 0.25);
        }

        .btn-primary {
          background-color: #e63946;
          border-color: #e63946;
        }

        .btn-primary:hover {
          background-color: #d32535;
          border-color: #d32535;
        }

        .btn-outline-primary {
          color: #e63946;
          border-color: #e63946;
        }

        .btn-outline-primary:hover {
          background-color: #e63946;
          border-color: #e63946;
        }

        .nav-pills .nav-link.active {
          background-color: #e63946;
        }

        .table-light {
          background-color: rgba(230, 57, 70, 0.05);
        }

        .text-primary {
          color: #e63946 !important;
        }

        .border-primary {
          border-color: #e63946 !important;
        }

        .bg-primary {
          background-color: #e63946 !important;
        }

        .current-images img:hover {
          transform: scale(1.05);
          transition: transform 0.3s ease;
        }

        .image-preview-container img:hover {
          transform: scale(1.05);
          transition: transform 0.3s ease;
        }
      `}</style>
    </div>
  );
};

export default AdminProducts;