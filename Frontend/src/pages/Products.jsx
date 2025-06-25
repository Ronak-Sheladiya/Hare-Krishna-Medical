import React, { useState, useEffect } from "react";
import {
  Container,
  Row,
  Col,
  Form,
  Button,
  Card,
  InputGroup,
  Badge,
  Alert,
  Spinner,
} from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { addToCart } from "../store/slices/cartSlice.js";
import {
  setProducts,
  setFeaturedProducts,
  updateFilters,
  setLoading,
  setError,
} from "../store/slices/productsSlice.js";
import ProductCard from "../components/products/ProductCard.jsx";
import { api, safeApiCall } from "../utils/apiClient.js";

const Products = () => {
  const dispatch = useDispatch();
  const { products, featuredProducts, filters, loading, error } = useSelector(
    (state) => state.products,
  );
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [viewMode, setViewMode] = useState("card"); // 'card' or 'list'

  // Categories for filtering
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

  // Fetch products from API using safeApiCall
  const fetchProducts = async () => {
    dispatch(setLoading(true));
    dispatch(setError(null));

    const queryParams = new URLSearchParams({
      ...(filters.search && { search: filters.search }),
      ...(filters.category && { category: filters.category }),
      ...(filters.priceSort && { sort: filters.priceSort }),
      limit: 50,
    });

    const {
      success,
      data,
      error: apiError,
    } = await safeApiCall(
      () => api.get(`/api/products/public?${queryParams}`),
      { products: [], featured: [] },
    );

    if (success && data) {
      const productsData = data.data || data;
      dispatch(setProducts(productsData.products || []));
      // Get featured products (first 6 products or products marked as featured)
      const featured =
        productsData.featured || productsData.products?.slice(0, 6) || [];
      dispatch(setFeaturedProducts(featured));
    } else {
      dispatch(setError(apiError || "Failed to load products"));
      dispatch(setProducts([]));
      dispatch(setFeaturedProducts([]));
    }

    dispatch(setLoading(false));
  };

  // Fetch featured products separately
  const fetchFeaturedProducts = async () => {
    const { success, data } = await safeApiCall(
      () => api.get("/api/products/featured"),
      [],
    );

    if (success && data) {
      const featuredData = data.data || data;
      dispatch(setFeaturedProducts(featuredData));
    }
  };

  useEffect(() => {
    fetchProducts();
    fetchFeaturedProducts();
  }, []);

  useEffect(() => {
    fetchProducts();
  }, [filters]);

  // Filter products based on current filters
  useEffect(() => {
    let filtered = [...products];

    // Search filter
    if (filters.search) {
      filtered = filtered.filter(
        (product) =>
          product.name?.toLowerCase().includes(filters.search.toLowerCase()) ||
          product.company
            ?.toLowerCase()
            .includes(filters.search.toLowerCase()) ||
          product.description
            ?.toLowerCase()
            .includes(filters.search.toLowerCase()),
      );
    }

    // Category filter
    if (filters.category) {
      filtered = filtered.filter(
        (product) => product.category === filters.category,
      );
    }

    // Price sort
    if (filters.priceSort === "low-to-high") {
      filtered.sort((a, b) => (a.price || 0) - (b.price || 0));
    } else if (filters.priceSort === "high-to-low") {
      filtered.sort((a, b) => (b.price || 0) - (a.price || 0));
    }

    setFilteredProducts(filtered);
  }, [products, filters]);

  const handleFilterChange = (filterType, value) => {
    dispatch(updateFilters({ [filterType]: value }));
  };

  const handleAddToCart = (product) => {
    dispatch(
      addToCart({
        id: product._id,
        name: product.name,
        price: product.price,
        image: product.images?.[0] || "/placeholder.svg",
        company: product.company,
        quantity: 1,
      }),
    );
  };

  if (loading) {
    return (
      <div className="fade-in">
        {/* Hero Section */}
        <section
          style={{
            background: "linear-gradient(135deg, #e63946 0%, #dc3545 100%)",
            paddingTop: "40px",
            paddingBottom: "40px",
            color: "white",
          }}
        >
          <Container>
            <Row className="text-center">
              <Col lg={12}>
                <div
                  style={{
                    width: "80px",
                    height: "80px",
                    background: "rgba(255,255,255,0.2)",
                    borderRadius: "50%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    margin: "0 auto 24px",
                    fontSize: "32px",
                  }}
                >
                  <i className="bi bi-grid-3x3-gap"></i>
                </div>
                <h1
                  style={{
                    fontSize: "3rem",
                    fontWeight: "800",
                    marginBottom: "20px",
                    textShadow: "2px 2px 4px rgba(0,0,0,0.3)",
                  }}
                >
                  Our Products
                </h1>
                <p
                  style={{
                    fontSize: "1.2rem",
                    opacity: "0.9",
                    maxWidth: "600px",
                    margin: "0 auto",
                  }}
                >
                  Quality medical products for your health and wellness
                </p>
              </Col>
            </Row>
          </Container>
        </section>

        <Container className="py-5">
          <div
            className="d-flex justify-content-center align-items-center"
            style={{ minHeight: "40vh" }}
          >
            <Spinner animation="border" variant="danger" />
            <span className="ms-3">Loading products...</span>
          </div>
        </Container>
      </div>
    );
  }

  return (
    <div className="fade-in products-page-content" data-page="products">
      {/* Hero Section */}
      <section
        style={{
          background: "linear-gradient(135deg, #e63946 0%, #dc3545 100%)",
          paddingTop: "40px",
          paddingBottom: "40px",
          color: "white",
        }}
      >
        <Container>
          <Row className="text-center">
            <Col lg={12}>
              <div
                style={{
                  width: "60px",
                  height: "60px",
                  background: "rgba(255,255,255,0.2)",
                  borderRadius: "50%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  margin: "0 auto 16px",
                  fontSize: "24px",
                }}
              >
                <i className="bi bi-grid-3x3-gap"></i>
              </div>
              <h1
                style={{
                  fontSize: "2.5rem",
                  fontWeight: "800",
                  marginBottom: "12px",
                  textShadow: "2px 2px 4px rgba(0,0,0,0.3)",
                }}
              >
                Our Products
              </h1>
              <p
                style={{
                  fontSize: "1rem",
                  opacity: "0.9",
                  maxWidth: "500px",
                  margin: "0 auto",
                }}
              >
                Quality medical products for your health and wellness
              </p>
            </Col>
          </Row>
        </Container>
      </section>

      <Container className="py-5">
        {error && (
          <Alert variant="warning" className="mb-4">
            <Alert.Heading>
              <i className="bi bi-exclamation-triangle me-2"></i>
              Offline Mode
            </Alert.Heading>
            <p>{error}</p>
            <Button
              variant="outline-danger"
              onClick={fetchProducts}
              className="border-2"
            >
              <i className="bi bi-arrow-clockwise me-2"></i>
              Try Again
            </Button>
          </Alert>
        )}

        {/* Filters Section */}
        <Card
          className="mb-4"
          style={{
            border: "2px solid #f8f9fa",
            borderRadius: "16px",
            boxShadow: "0 4px 15px rgba(0,0,0,0.1)",
          }}
        >
          <Card.Body style={{ padding: "30px" }}>
            <Row className="align-items-center">
              <Col lg={4} md={6} className="mb-3">
                <Form.Label className="fw-bold mb-2">
                  <i className="bi bi-search me-2"></i>
                  Search Products
                </Form.Label>
                <InputGroup>
                  <InputGroup.Text>
                    <i className="bi bi-search"></i>
                  </InputGroup.Text>
                  <Form.Control
                    type="text"
                    placeholder="Search by name, company, or category..."
                    value={filters.search || ""}
                    onChange={(e) =>
                      handleFilterChange("search", e.target.value)
                    }
                    style={{ borderLeft: "none" }}
                  />
                  {filters.search && (
                    <Button
                      variant="outline-secondary"
                      onClick={() => handleFilterChange("search", "")}
                    >
                      <i className="bi bi-x"></i>
                    </Button>
                  )}
                </InputGroup>
              </Col>
              <Col lg={3} md={6} className="mb-3">
                <Form.Label className="fw-bold mb-2">
                  <i className="bi bi-funnel me-2"></i>
                  Category
                </Form.Label>
                <Form.Select
                  value={filters.category || ""}
                  onChange={(e) =>
                    handleFilterChange("category", e.target.value)
                  }
                >
                  <option value="">All Categories</option>
                  {categories.map((category) => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </Form.Select>
              </Col>
              <Col lg={3} md={6} className="mb-3">
                <Form.Label className="fw-bold mb-2">
                  <i className="bi bi-sort-numeric-down me-2"></i>
                  Sort by Price
                </Form.Label>
                <Form.Select
                  value={filters.priceSort || ""}
                  onChange={(e) =>
                    handleFilterChange("priceSort", e.target.value)
                  }
                >
                  <option value="">Default</option>
                  <option value="low-to-high">Price: Low to High</option>
                  <option value="high-to-low">Price: High to Low</option>
                </Form.Select>
              </Col>
              <Col lg={2} md={6} className="mb-3">
                <Form.Label className="fw-bold mb-2">
                  <i className="bi bi-arrow-clockwise me-2"></i>
                  Actions
                </Form.Label>
                <Button
                  variant="outline-secondary"
                  className="w-100"
                  onClick={fetchProducts}
                >
                  <i className="bi bi-arrow-clockwise me-2"></i>
                  Refresh
                </Button>
              </Col>
            </Row>
          </Card.Body>
        </Card>

        {/* Products Grid */}
        <Row>
          <Col lg={12}>
            <div className="d-flex justify-content-between align-items-center mb-4">
              <h3 className="mb-0">
                <i className="bi bi-grid-3x3-gap me-2"></i>
                All Products ({filteredProducts.length})
              </h3>
              <div className="d-flex align-items-center gap-3">
                <span className="text-muted">
                  <i className="bi bi-info-circle me-1"></i>
                  {filteredProducts.length} of {products.length} products
                </span>

                {/* View Toggle Buttons */}
                <div
                  className="btn-group"
                  role="group"
                  aria-label="View toggle"
                >
                  <Button
                    variant={
                      viewMode === "card" ? "danger" : "outline-secondary"
                    }
                    size="sm"
                    onClick={() => setViewMode("card")}
                    style={{
                      background:
                        viewMode === "card"
                          ? "linear-gradient(135deg, #e63946 0%, #dc3545 100%)"
                          : "transparent",
                      border:
                        viewMode === "card" ? "none" : "2px solid #dee2e6",
                    }}
                  >
                    <i className="bi bi-grid-3x3-gap me-1"></i>
                    Card
                  </Button>
                  <Button
                    variant={
                      viewMode === "list" ? "danger" : "outline-secondary"
                    }
                    size="sm"
                    onClick={() => setViewMode("list")}
                    style={{
                      background:
                        viewMode === "list"
                          ? "linear-gradient(135deg, #e63946 0%, #dc3545 100%)"
                          : "transparent",
                      border:
                        viewMode === "list" ? "none" : "2px solid #dee2e6",
                    }}
                  >
                    <i className="bi bi-list-ul me-1"></i>
                    List
                  </Button>
                </div>
              </div>
            </div>

            {filteredProducts.length > 0 ? (
              viewMode === "card" ? (
                <Row>
                  {filteredProducts.map((product) => (
                    <Col
                      lg={3}
                      md={4}
                      sm={6}
                      className="mb-4"
                      key={product._id}
                    >
                      <ProductCard
                        product={product}
                        onAddToCart={() => handleAddToCart(product)}
                      />
                    </Col>
                  ))}
                </Row>
              ) : (
                <div className="list-view">
                  {filteredProducts.map((product) => (
                    <Card
                      key={product._id}
                      className="mb-3"
                      style={{
                        border: "2px solid #f8f9fa",
                        borderRadius: "12px",
                        transition: "all 0.3s ease",
                      }}
                      onMouseOver={(e) => {
                        e.currentTarget.style.borderColor = "#e63946";
                        e.currentTarget.style.boxShadow =
                          "0 4px 15px rgba(230, 57, 70, 0.2)";
                      }}
                      onMouseOut={(e) => {
                        e.currentTarget.style.borderColor = "#f8f9fa";
                        e.currentTarget.style.boxShadow = "none";
                      }}
                    >
                      <Card.Body>
                        <Row className="align-items-center">
                          <Col md={2}>
                            <img
                              src={product.images?.[0] || "/placeholder.svg"}
                              alt={product.name}
                              style={{
                                width: "100%",
                                height: "120px",
                                objectFit: "cover",
                                borderRadius: "8px",
                              }}
                              onError={(e) => {
                                e.target.src = "/placeholder.svg";
                              }}
                            />
                          </Col>
                          <Col md={6}>
                            <div>
                              <h5 className="mb-2">{product.name}</h5>
                              <div className="d-flex align-items-center gap-2 mb-2">
                                <Badge
                                  bg="primary"
                                  style={{ fontSize: "11px" }}
                                >
                                  <i className="bi bi-building me-1"></i>
                                  {product.company}
                                </Badge>
                                {product.category && (
                                  <Badge bg="info" style={{ fontSize: "11px" }}>
                                    <i className="bi bi-tag me-1"></i>
                                    {product.category}
                                  </Badge>
                                )}
                              </div>
                              <p
                                className="text-muted mb-0"
                                style={{ fontSize: "14px" }}
                              >
                                {product.description?.substring(0, 100)}...
                              </p>
                            </div>
                          </Col>
                          <Col md={2}>
                            <div className="text-center">
                              <div className="mb-2">
                                <span className="fw-bold text-danger h5">
                                  ₹
                                  {(
                                    product.discountPrice || product.price
                                  )?.toLocaleString()}
                                </span>
                                {product.discountPrice && (
                                  <div>
                                    <small
                                      className="text-muted"
                                      style={{ textDecoration: "line-through" }}
                                    >
                                      ₹{product.price?.toLocaleString()}
                                    </small>
                                  </div>
                                )}
                              </div>
                              {product.stock > 0 ? (
                                <div className="text-success small">
                                  <i className="bi bi-check-circle me-1"></i>
                                  In Stock
                                </div>
                              ) : (
                                <div className="text-danger small">
                                  <i className="bi bi-x-circle me-1"></i>
                                  Out of Stock
                                </div>
                              )}
                            </div>
                          </Col>
                          <Col md={2}>
                            <div className="d-grid gap-2">
                              <Button
                                variant="danger"
                                size="sm"
                                onClick={() => handleAddToCart(product)}
                                disabled={product.stock <= 0}
                                style={{
                                  background:
                                    product.stock > 0
                                      ? "linear-gradient(135deg, #e63946 0%, #dc3545 100%)"
                                      : "#6c757d",
                                  border: "none",
                                  fontSize: "12px",
                                }}
                              >
                                <i className="bi bi-cart-plus me-1"></i>
                                Add to Cart
                              </Button>
                              <Button
                                variant="outline-primary"
                                size="sm"
                                onClick={() =>
                                  window.open(
                                    `/product/${product._id}`,
                                    "_self",
                                  )
                                }
                                style={{ fontSize: "12px" }}
                              >
                                <i className="bi bi-eye me-1"></i>
                                View Details
                              </Button>
                            </div>
                          </Col>
                        </Row>
                      </Card.Body>
                    </Card>
                  ))}
                </div>
              )
            ) : (
              <div className="text-center py-5">
                <div className="mb-3">
                  <div
                    style={{
                      width: "80px",
                      height: "80px",
                      background: "linear-gradient(135deg, #f8f9fa, #e9ecef)",
                      borderRadius: "50%",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      margin: "0 auto",
                      fontSize: "32px",
                      color: "#6c757d",
                    }}
                  >
                    <i className="bi bi-grid-3x3-gap"></i>
                  </div>
                </div>
                <h5>No Products Found</h5>
                <p className="text-muted">
                  {error
                    ? "Unable to load products. Please check your connection."
                    : filters.search || filters.category
                      ? "No products match your current filters."
                      : "No products are currently available."}
                </p>
                {error ? (
                  <Button variant="outline-danger" onClick={fetchProducts}>
                    <i className="bi bi-arrow-clockwise me-2"></i>
                    Try Again
                  </Button>
                ) : filters.search || filters.category ? (
                  <Button
                    variant="outline-secondary"
                    onClick={() => {
                      handleFilterChange("search", "");
                      handleFilterChange("category", "");
                    }}
                  >
                    <i className="bi bi-funnel me-2"></i>
                    Clear Filters
                  </Button>
                ) : null}
              </div>
            )}
          </Col>
        </Row>

        {/* Featured Products Section */}
        {featuredProducts.length > 0 && (
          <Row className="mt-5">
            <Col>
              <Card
                style={{
                  border: "2px solid #f8f9fa",
                  borderRadius: "16px",
                  boxShadow: "0 4px 15px rgba(0,0,0,0.1)",
                  overflow: "hidden",
                }}
              >
                <Card.Header
                  style={{
                    background:
                      "linear-gradient(135deg, #e63946 0%, #dc3545 100%)",
                    color: "white",
                    padding: "20px 30px",
                    border: "none",
                  }}
                >
                  <h4 className="mb-0 d-flex align-items-center">
                    <i className="bi bi-star-fill me-2"></i>
                    Featured Products
                  </h4>
                </Card.Header>
                <Card.Body style={{ padding: "30px" }}>
                  <Row>
                    {featuredProducts.slice(0, 4).map((product) => (
                      <Col lg={3} md={6} className="mb-4" key={product._id}>
                        <ProductCard
                          product={product}
                          onAddToCart={() => handleAddToCart(product)}
                          featured={true}
                        />
                      </Col>
                    ))}
                  </Row>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        )}
      </Container>
    </div>
  );
};

export default Products;
