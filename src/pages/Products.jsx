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

const Products = () => {
  const dispatch = useDispatch();
  const { products, featuredProducts, filters, loading, error } = useSelector(
    (state) => state.products,
  );
  const [filteredProducts, setFilteredProducts] = useState([]);

  const API_BASE_URL =
    process.env.REACT_APP_BACKEND_URL || "http://localhost:5000";

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

  // Fetch products from API
  const fetchProducts = async () => {
    try {
      dispatch(setLoading(true));
      dispatch(setError(null));

      const queryParams = new URLSearchParams({
        ...(filters.search && { search: filters.search }),
        ...(filters.category && { category: filters.category }),
        ...(filters.priceSort && { sort: filters.priceSort }),
        limit: 50, // Get more products for better filtering
      });

      const response = await fetch(
        `${API_BASE_URL}/api/products/public?${queryParams}`,
        {
          headers: {
            "Content-Type": "application/json",
          },
        },
      );

      if (!response.ok) {
        // If API fails, don't show error - just show empty state
        console.warn("Products API not available, using empty state");
        dispatch(setProducts([]));
        dispatch(setFeaturedProducts([]));
        return;
      }

      const data = await response.json();

      if (data.success) {
        dispatch(setProducts(data.data.products || []));
        // Get featured products (first 6 products or products marked as featured)
        const featured =
          data.data.featured || data.data.products?.slice(0, 6) || [];
        dispatch(setFeaturedProducts(featured));
      } else {
        console.warn("Products API response not successful");
        dispatch(setProducts([]));
        dispatch(setFeaturedProducts([]));
      }
    } catch (error) {
      console.warn("Error fetching products:", error);
      // Don't show error to user - gracefully degrade to empty state
      dispatch(setProducts([]));
      dispatch(setFeaturedProducts([]));
    } finally {
      dispatch(setLoading(false));
    }
  };

  // Fetch featured products separately
  const fetchFeaturedProducts = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/products/featured`, {
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          dispatch(setFeaturedProducts(data.data || []));
        }
      }
    } catch (error) {
      console.warn("Error fetching featured products:", error);
    }
  };

  useEffect(() => {
    fetchProducts();
    fetchFeaturedProducts();
  }, []);

  useEffect(() => {
    // Re-fetch when filters change
    fetchProducts();
  }, [filters.search, filters.category, filters.priceSort]);

  useEffect(() => {
    let filtered = [...products];

    // Apply search filter
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

    // Apply category filter
    if (filters.category) {
      filtered = filtered.filter(
        (product) => product.category === filters.category,
      );
    }

    // Apply price sorting
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

  const clearFilters = () => {
    dispatch(
      updateFilters({
        search: "",
        category: "",
        priceSort: "",
      }),
    );
  };

  const handleAddToCart = (product) => {
    // Convert API product format to cart format
    const cartItem = {
      id: product._id || product.id,
      name: product.name,
      price: product.price,
      originalPrice: product.originalPrice,
      images: product.images || [],
      company: product.company,
      inStock: product.stock > 0,
      stock: product.stock,
    };

    dispatch(addToCart(cartItem));
  };

  const getStockStatus = (stock) => {
    if (!stock || stock === 0) return "Out of Stock";
    if (stock <= 10) return "Low Stock";
    return "In Stock";
  };

  const getStockBadge = (stock) => {
    if (!stock || stock === 0) return <Badge bg="danger">Out of Stock</Badge>;
    if (stock <= 10) return <Badge bg="warning">Low Stock</Badge>;
    return <Badge bg="success">In Stock</Badge>;
  };

  return (
    <div className="fade-in">
      {/* Hero Section */}
      <section className="medical-hero-sm">
        <Container>
          <Row className="align-items-center">
            <Col lg={6}>
              <h1 className="display-5 fw-bold text-dark mb-3">
                Medical Products
              </h1>
              <p className="lead text-muted mb-4">
                Discover our comprehensive range of quality medical products,
                medicines, and healthcare essentials for your wellness needs.
              </p>
            </Col>
            <Col lg={6} className="text-center">
              <img
                src="https://cdn.builder.io/api/v1/assets/ec4b3f82f1ac4275b8bfc1756fcac420/medical_products_hero-a1b2c3?format=webp&width=600"
                alt="Medical Products"
                className="img-fluid"
                style={{ maxHeight: "300px" }}
              />
            </Col>
          </Row>
        </Container>
      </section>

      {/* Filters Section */}
      <section className="section-padding-sm bg-light">
        <Container>
          <Row className="mb-4">
            <Col lg={12}>
              <Card className="medical-card">
                <Card.Body>
                  <Row className="align-items-center">
                    <Col lg={4}>
                      <InputGroup>
                        <InputGroup.Text>
                          <i className="bi bi-search"></i>
                        </InputGroup.Text>
                        <Form.Control
                          type="text"
                          placeholder="Search products..."
                          value={filters.search}
                          onChange={(e) =>
                            handleFilterChange("search", e.target.value)
                          }
                        />
                      </InputGroup>
                    </Col>
                    <Col lg={3}>
                      <Form.Select
                        value={filters.category}
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
                    <Col lg={3}>
                      <Form.Select
                        value={filters.priceSort}
                        onChange={(e) =>
                          handleFilterChange("priceSort", e.target.value)
                        }
                      >
                        <option value="">Sort by Price</option>
                        <option value="low-to-high">Price: Low to High</option>
                        <option value="high-to-low">Price: High to Low</option>
                      </Form.Select>
                    </Col>
                    <Col lg={2}>
                      <Button
                        variant="outline-secondary"
                        onClick={clearFilters}
                        className="w-100"
                      >
                        Clear Filters
                      </Button>
                    </Col>
                  </Row>
                </Card.Body>
              </Card>
            </Col>
          </Row>

          {/* Results Summary */}
          <Row className="mb-3">
            <Col lg={12}>
              <div className="d-flex justify-content-between align-items-center">
                <h5 className="mb-0">
                  {loading ? (
                    <span>Loading products...</span>
                  ) : (
                    <span>
                      {filteredProducts.length} Product
                      {filteredProducts.length !== 1 ? "s" : ""} Found
                      {filters.search && ` for "${filters.search}"`}
                      {filters.category && ` in ${filters.category}`}
                    </span>
                  )}
                </h5>
                <div className="d-flex align-items-center">
                  <Form.Check
                    type="switch"
                    id="view-mode-switch"
                    label={
                      filters.viewMode === "card" ? "Card View" : "List View"
                    }
                    checked={filters.viewMode === "list"}
                    onChange={(e) =>
                      handleFilterChange(
                        "viewMode",
                        e.target.checked ? "list" : "card",
                      )
                    }
                  />
                </div>
              </div>
            </Col>
          </Row>
        </Container>
      </section>

      {/* Products Section */}
      <section className="section-padding">
        <Container>
          {loading ? (
            <div className="text-center py-5">
              <Spinner animation="border" role="status" size="lg">
                <span className="visually-hidden">Loading...</span>
              </Spinner>
              <p className="mt-3 text-muted">Loading products...</p>
            </div>
          ) : error ? (
            <Alert variant="warning" className="text-center">
              <i className="bi bi-exclamation-triangle me-2"></i>
              Unable to load products. Please try again later.
              <Button
                variant="outline-primary"
                size="sm"
                className="ms-3"
                onClick={() => fetchProducts()}
              >
                Retry
              </Button>
            </Alert>
          ) : filteredProducts.length > 0 ? (
            <Row>
              {filteredProducts.map((product) => (
                <Col
                  key={product._id || product.id}
                  lg={filters.viewMode === "list" ? 12 : 4}
                  md={filters.viewMode === "list" ? 12 : 6}
                  className="mb-4"
                >
                  {filters.viewMode === "list" ? (
                    // List View
                    <Card className="medical-card h-100">
                      <Row className="g-0">
                        <Col md={3}>
                          <div className="position-relative">
                            <img
                              src={
                                product.images?.[0] ||
                                `https://via.placeholder.com/300x200/e6e6e6/666666?text=${encodeURIComponent(product.name || "Product")}`
                              }
                              alt={product.name}
                              className="img-fluid h-100 w-100"
                              style={{ objectFit: "cover", minHeight: "200px" }}
                            />
                            {product.originalPrice &&
                              product.originalPrice > product.price && (
                                <Badge
                                  bg="danger"
                                  className="position-absolute top-0 start-0 m-2"
                                >
                                  {Math.round(
                                    ((product.originalPrice - product.price) /
                                      product.originalPrice) *
                                      100,
                                  )}
                                  % OFF
                                </Badge>
                              )}
                          </div>
                        </Col>
                        <Col md={9}>
                          <Card.Body className="d-flex flex-column h-100">
                            <div className="flex-grow-1">
                              <div className="d-flex justify-content-between align-items-start mb-2">
                                <div>
                                  <h5 className="card-title text-medical-blue">
                                    {product.name}
                                  </h5>
                                  <p className="text-muted small mb-1">
                                    {product.company}
                                  </p>
                                </div>
                                <div className="text-end">
                                  <div className="fw-bold text-medical-red fs-5">
                                    ₹{(product.price || 0).toFixed(2)}
                                  </div>
                                  {product.originalPrice &&
                                    product.originalPrice > product.price && (
                                      <small className="text-muted text-decoration-line-through">
                                        ₹{product.originalPrice.toFixed(2)}
                                      </small>
                                    )}
                                </div>
                              </div>

                              <div className="mb-2">
                                <Badge bg="secondary" className="me-2">
                                  {product.category || "General"}
                                </Badge>
                                {getStockBadge(product.stock)}
                              </div>

                              <p className="card-text text-muted">
                                {product.description ||
                                  "Quality medical product for your health needs."}
                              </p>

                              {product.benefits &&
                                product.benefits.length > 0 && (
                                  <ul className="list-unstyled small text-muted">
                                    {product.benefits
                                      .slice(0, 3)
                                      .map((benefit, index) => (
                                        <li key={index}>
                                          <i className="bi bi-check-circle-fill text-success me-2"></i>
                                          {benefit}
                                        </li>
                                      ))}
                                  </ul>
                                )}
                            </div>

                            <div className="mt-3">
                              <div className="d-flex gap-2">
                                <Button
                                  variant="primary"
                                  onClick={() => handleAddToCart(product)}
                                  disabled={
                                    !product.stock || product.stock === 0
                                  }
                                  className="btn-medical-primary flex-grow-1"
                                >
                                  <i className="bi bi-cart-plus me-2"></i>
                                  {!product.stock || product.stock === 0
                                    ? "Out of Stock"
                                    : "Add to Cart"}
                                </Button>
                                <Button
                                  variant="outline-primary"
                                  href={`/products/${product._id || product.id}`}
                                  className="btn-medical-outline"
                                >
                                  <i className="bi bi-eye me-2"></i>
                                  View
                                </Button>
                              </div>
                            </div>
                          </Card.Body>
                        </Col>
                      </Row>
                    </Card>
                  ) : (
                    // Card View
                    <ProductCard
                      product={product}
                      onAddToCart={() => handleAddToCart(product)}
                    />
                  )}
                </Col>
              ))}
            </Row>
          ) : (
            // Empty State
            <div className="text-center py-5">
              <i
                className="bi bi-box text-muted"
                style={{ fontSize: "4rem" }}
              ></i>
              <h4 className="text-muted mt-3">No Products Found</h4>
              <p className="text-muted">
                {filters.search || filters.category
                  ? "Try adjusting your search filters to find more products."
                  : "Products will be available soon. Please check back later."}
              </p>
              {(filters.search || filters.category) && (
                <Button
                  variant="primary"
                  onClick={clearFilters}
                  className="btn-medical-primary"
                >
                  <i className="bi bi-arrow-clockwise me-2"></i>
                  Clear Filters
                </Button>
              )}
            </div>
          )}
        </Container>
      </section>

      {/* Featured Products Section */}
      {featuredProducts.length > 0 && (
        <section className="section-padding bg-light">
          <Container>
            <Row className="mb-4">
              <Col lg={12} className="text-center">
                <h2 className="fw-bold text-medical-blue">Featured Products</h2>
                <p className="text-muted">
                  Discover our most popular and recommended medical products
                </p>
              </Col>
            </Row>
            <Row>
              {featuredProducts.slice(0, 6).map((product) => (
                <Col
                  key={`featured-${product._id || product.id}`}
                  lg={4}
                  md={6}
                  className="mb-4"
                >
                  <ProductCard
                    product={product}
                    onAddToCart={() => handleAddToCart(product)}
                    featured={true}
                  />
                </Col>
              ))}
            </Row>
          </Container>
        </section>
      )}
    </div>
  );
};

export default Products;
