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
} from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { addToCart } from "../store/slices/cartSlice.js";
import { setProducts, updateFilters } from "../store/slices/productsSlice.js";
import ProductCard from "../components/products/ProductCard.jsx";

const Products = () => {
  const dispatch = useDispatch();
  const { products, filters } = useSelector((state) => state.products);
  const [filteredProducts, setFilteredProducts] = useState([]);

  // Mock products data
  const mockProducts = [
    {
      id: 1,
      name: "Paracetamol Tablets 500mg",
      company: "Hare Krishna Pharma",
      price: 25.99,
      originalPrice: 30.99,
      images: [
        "https://via.placeholder.com/300x250/e6e6e6/666666?text=Paracetamol+1",
        "https://via.placeholder.com/300x250/cccccc/666666?text=Paracetamol+2",
        "https://via.placeholder.com/300x250/b3b3b3/666666?text=Paracetamol+3",
      ],
      description:
        "Effective pain relief and fever reducer for adults and children",
      benefits: ["Quick pain relief", "Reduces fever", "Gentle on stomach"],
      usage: "Take 1-2 tablets every 4-6 hours as needed",
      weight: "50 tablets",
      inStock: true,
    },
    {
      id: 2,
      name: "Vitamin D3 Capsules 60000 IU",
      company: "Health Plus",
      price: 45.5,
      originalPrice: 55.0,
      images: [
        "https://via.placeholder.com/300x250/e6e6e6/666666?text=Vitamin+D3+1",
        "https://via.placeholder.com/300x250/cccccc/666666?text=Vitamin+D3+2",
      ],
      description: "Essential vitamin for bone health and immunity",
      benefits: ["Stronger bones", "Better immunity", "Improved mood"],
      usage: "One capsule weekly or as directed by physician",
      weight: "4 capsules",
      inStock: true,
    },
    {
      id: 3,
      name: "Cough Syrup Honey Based",
      company: "Wellness Care",
      price: 35.75,
      originalPrice: 42.0,
      images: [
        "https://via.placeholder.com/300x250/e6e6e6/666666?text=Cough+Syrup+1",
        "https://via.placeholder.com/300x250/cccccc/666666?text=Cough+Syrup+2",
      ],
      description: "Natural cough relief formula with honey and herbs",
      benefits: ["Soothes throat", "Reduces cough", "Natural ingredients"],
      usage: "2 teaspoons 3 times daily after meals",
      weight: "100ml",
      inStock: true,
    },
    {
      id: 4,
      name: "Antiseptic Liquid 500ml",
      company: "Safe Guard",
      price: 28.0,
      originalPrice: 35.0,
      images: [
        "https://via.placeholder.com/300x250/e6e6e6/666666?text=Antiseptic+1",
      ],
      description: "Multipurpose antiseptic for wound care and cleaning",
      benefits: ["Kills 99.9% germs", "Prevents infection", "Multipurpose use"],
      usage: "Dilute with water and apply to affected area",
      weight: "500ml",
      inStock: true,
    },
    {
      id: 5,
      name: "Blood Pressure Monitor Digital",
      company: "Med Tech",
      price: 1299.99,
      originalPrice: 1599.99,
      images: [
        "https://via.placeholder.com/300x250/e6e6e6/666666?text=BP+Monitor+1",
        "https://via.placeholder.com/300x250/cccccc/666666?text=BP+Monitor+2",
      ],
      description: "Accurate digital blood pressure monitor for home use",
      benefits: ["Easy to use", "Memory storage", "Large display"],
      usage: "Place cuff on arm and press start button",
      weight: "500g",
      inStock: true,
    },
    {
      id: 6,
      name: "Protein Powder Chocolate",
      company: "Nutri Health",
      price: 899.0,
      originalPrice: 1099.0,
      images: [
        "https://via.placeholder.com/300x250/e6e6e6/666666?text=Protein+1",
      ],
      description: "High-quality whey protein for muscle building",
      benefits: ["Muscle growth", "Post-workout recovery", "Great taste"],
      usage: "Mix 1 scoop with 250ml water or milk",
      weight: "1kg",
      inStock: false,
    },
  ];

  useEffect(() => {
    dispatch(setProducts(mockProducts));
  }, [dispatch]);

  useEffect(() => {
    let filtered = [...products];

    // Apply search filter
    if (filters.search) {
      filtered = filtered.filter(
        (product) =>
          product.name.toLowerCase().includes(filters.search.toLowerCase()) ||
          product.company
            .toLowerCase()
            .includes(filters.search.toLowerCase()) ||
          product.description
            .toLowerCase()
            .includes(filters.search.toLowerCase()),
      );
    }

    // Apply price sorting
    if (filters.priceSort === "low-to-high") {
      filtered.sort((a, b) => a.price - b.price);
    } else if (filters.priceSort === "high-to-low") {
      filtered.sort((a, b) => b.price - a.price);
    }

    setFilteredProducts(filtered);
  }, [products, filters]);

  const handleAddToCart = (product) => {
    dispatch(addToCart(product));
  };

  const handleSearchChange = (e) => {
    dispatch(updateFilters({ search: e.target.value }));
  };

  const handleFilterChange = (filterType, value) => {
    dispatch(updateFilters({ [filterType]: value }));
  };

  return (
    <div className="fade-in">
      {/* Hero Section - Matching About Us */}
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
                Our Medical Products
              </h1>
              <p
                style={{
                  fontSize: "1.2rem",
                  opacity: "0.9",
                  maxWidth: "600px",
                  margin: "0 auto",
                }}
              >
                Quality healthcare products for your medical needs
              </p>
            </Col>
          </Row>
        </Container>
      </section>

      {/* Filters Section */}
      <section
        style={{
          background: "#ffffff",
          paddingTop: "60px",
          paddingBottom: "40px",
        }}
      >
        <Container>
          <Row className="mb-4">
            <Col lg={8} md={8} className="mb-3">
              <InputGroup className="search-container">
                <InputGroup.Text
                  style={{
                    background: "white",
                    borderColor: "#e63946",
                    color: "#e63946",
                  }}
                >
                  <i className="bi bi-search"></i>
                </InputGroup.Text>
                <Form.Control
                  type="text"
                  placeholder="Search products, brands..."
                  value={filters.search}
                  onChange={handleSearchChange}
                  style={{
                    borderColor: "#e63946",
                    borderLeft: "none",
                  }}
                />
              </InputGroup>
            </Col>
            <Col lg={4} md={4} className="mb-3">
              <Form.Select
                value={filters.priceSort}
                onChange={(e) =>
                  handleFilterChange("priceSort", e.target.value)
                }
                style={{
                  borderColor: "#e63946",
                }}
              >
                <option value="">Sort by Price</option>
                <option value="low-to-high">Low to High</option>
                <option value="high-to-low">High to Low</option>
              </Form.Select>
            </Col>
          </Row>

          {/* View Controls */}
          <Row className="mb-4">
            <Col lg={6}>
              <p className="text-muted mb-0">
                Showing {filteredProducts.length} of {products.length} products
              </p>
            </Col>
            <Col lg={6} className="text-end">
              <div className="btn-group" role="group">
                <Button
                  variant={
                    filters.viewMode === "card"
                      ? "primary"
                      : "outline-secondary"
                  }
                  onClick={() => handleFilterChange("viewMode", "card")}
                  style={{
                    backgroundColor:
                      filters.viewMode === "card" ? "#e63946" : "transparent",
                    borderColor: "#e63946",
                    color: filters.viewMode === "card" ? "white" : "#e63946",
                  }}
                  title="Grid View"
                >
                  <i className="bi bi-grid3x3-gap me-1"></i>
                  <i className="bi bi-folder2-open"></i>
                </Button>
                <Button
                  variant={
                    filters.viewMode === "list"
                      ? "primary"
                      : "outline-secondary"
                  }
                  onClick={() => handleFilterChange("viewMode", "list")}
                  style={{
                    backgroundColor:
                      filters.viewMode === "list" ? "#e63946" : "transparent",
                    borderColor: "#e63946",
                    color: filters.viewMode === "list" ? "white" : "#e63946",
                  }}
                  title="List View"
                >
                  <i className="bi bi-list me-1"></i>
                  <i className="bi bi-folder-symlink"></i>
                </Button>
              </div>
            </Col>
          </Row>
        </Container>
      </section>

      {/* Products Grid/List */}
      <section
        style={{
          background: "#f8f9fa",
          paddingTop: "60px",
          paddingBottom: "80px",
        }}
      >
        <Container>
          {filteredProducts.length === 0 ? (
            <Row>
              <Col lg={12} className="text-center">
                <Card
                  style={{
                    border: "2px solid #f8f9fa",
                    borderRadius: "16px",
                    padding: "50px",
                    textAlign: "center",
                    boxShadow: "0 8px 25px rgba(0,0,0,0.05)",
                  }}
                >
                  <i
                    className="bi bi-search display-1 mb-3"
                    style={{ color: "#e9ecef" }}
                  ></i>
                  <h4 style={{ color: "#495057" }}>No products found</h4>
                  <p style={{ color: "#6c757d" }}>
                    Try adjusting your search criteria
                  </p>
                  <Button
                    onClick={() =>
                      dispatch(
                        updateFilters({
                          search: "",
                          priceSort: "",
                        }),
                      )
                    }
                    style={{
                      background: "#e63946",
                      border: "none",
                      borderRadius: "8px",
                      padding: "12px 24px",
                    }}
                  >
                    Clear Filters
                  </Button>
                </Card>
              </Col>
            </Row>
          ) : filters.viewMode === "card" ? (
            <Row>
              {filteredProducts.map((product) => (
                <Col lg={3} md={6} className="mb-4" key={product.id}>
                  <ProductCard
                    product={product}
                    onAddToCart={handleAddToCart}
                  />
                </Col>
              ))}
            </Row>
          ) : (
            <Row>
              <Col lg={12}>
                {filteredProducts.map((product) => (
                  <Card
                    key={product.id}
                    style={{
                      border: "2px solid #f8f9fa",
                      borderRadius: "16px",
                      marginBottom: "20px",
                      boxShadow: "0 8px 25px rgba(0,0,0,0.05)",
                      transition: "all 0.3s ease",
                    }}
                    onMouseOver={(e) => {
                      e.currentTarget.style.borderColor = "#e63946";
                      e.currentTarget.style.transform = "translateY(-2px)";
                      e.currentTarget.style.boxShadow =
                        "0 12px 35px rgba(230, 57, 70, 0.15)";
                    }}
                    onMouseOut={(e) => {
                      e.currentTarget.style.borderColor = "#f8f9fa";
                      e.currentTarget.style.transform = "translateY(0)";
                      e.currentTarget.style.boxShadow =
                        "0 8px 25px rgba(0,0,0,0.05)";
                    }}
                  >
                    <Row className="g-0">
                      <Col md={3}>
                        <Card.Img
                          variant="top"
                          src={product.images[0]}
                          className="h-100"
                          style={{
                            objectFit: "cover",
                            borderRadius: "16px 0 0 16px",
                          }}
                        />
                      </Col>
                      <Col md={9}>
                        <Card.Body style={{ padding: "30px" }}>
                          <Row>
                            <Col md={8}>
                              <h5
                                style={{
                                  color: "#333333",
                                  fontWeight: "700",
                                  marginBottom: "8px",
                                }}
                              >
                                {product.name}
                              </h5>
                              <p
                                style={{
                                  color: "#6c757d",
                                  marginBottom: "8px",
                                  fontSize: "14px",
                                }}
                              >
                                by {product.company}
                              </p>
                              <p
                                style={{
                                  color: "#495057",
                                  marginBottom: "12px",
                                  fontSize: "13px",
                                }}
                              >
                                {product.description}
                              </p>
                              <div className="mb-2">
                                {product.inStock ? (
                                  <Badge
                                    style={{
                                      background: "#38a169",
                                      color: "white",
                                      padding: "6px 12px",
                                      borderRadius: "20px",
                                    }}
                                  >
                                    In Stock
                                  </Badge>
                                ) : (
                                  <Badge
                                    style={{
                                      background: "#e63946",
                                      color: "white",
                                      padding: "6px 12px",
                                      borderRadius: "20px",
                                    }}
                                  >
                                    Out of Stock
                                  </Badge>
                                )}
                              </div>
                            </Col>
                            <Col md={4} className="text-end">
                              <div className="mb-3">
                                <span
                                  style={{
                                    fontSize: "1.5rem",
                                    fontWeight: "700",
                                    color: "#e63946",
                                  }}
                                >
                                  ₹{product.price}
                                </span>
                                {product.originalPrice && (
                                  <span
                                    style={{
                                      color: "#6c757d",
                                      textDecoration: "line-through",
                                      marginLeft: "8px",
                                    }}
                                  >
                                    ₹{product.originalPrice}
                                  </span>
                                )}
                              </div>
                              <div className="d-grid gap-2">
                                <Button
                                  onClick={() => handleAddToCart(product)}
                                  disabled={!product.inStock}
                                  style={{
                                    background: product.inStock
                                      ? "#e63946"
                                      : "#6c757d",
                                    border: "none",
                                    borderRadius: "8px",
                                    padding: "12px 24px",
                                    fontWeight: "600",
                                  }}
                                >
                                  {product.inStock
                                    ? "Add to Cart"
                                    : "Out of Stock"}
                                </Button>
                                <Button
                                  variant="outline-secondary"
                                  size="sm"
                                  href={`/products/${product.id}`}
                                  style={{
                                    borderColor: "#e63946",
                                    color: "#e63946",
                                    borderRadius: "8px",
                                  }}
                                >
                                  View Details
                                </Button>
                              </div>
                            </Col>
                          </Row>
                        </Card.Body>
                      </Col>
                    </Row>
                  </Card>
                ))}
              </Col>
            </Row>
          )}
        </Container>
      </section>
    </div>
  );
};

export default Products;
