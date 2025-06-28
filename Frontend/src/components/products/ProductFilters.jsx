import React from "react";
import { Card, Form, Button, Badge } from "react-bootstrap";

const ProductFilters = ({
  categories = [],
  activeFilters = {},
  onFilterChange,
  onClearFilters,
}) => {
  const priceRanges = [
    { label: "Under ₹50", min: 0, max: 50 },
    { label: "₹50 - ₹100", min: 50, max: 100 },
    { label: "₹100 - ₹500", min: 100, max: 500 },
    { label: "₹500 - ₹1000", min: 500, max: 1000 },
    { label: "Above ₹1000", min: 1000, max: Infinity },
  ];

  const brands = [
    "Hare Krishna Pharma",
    "Health Plus",
    "Wellness Care",
    "Safe Guard",
    "Med Tech",
    "Nutri Health",
  ];

  return (
    <Card className="medical-card">
      <Card.Header className="bg-medical-light d-flex justify-content-between align-items-center">
        <h6 className="mb-0">
          <i className="bi bi-funnel me-2"></i>
          Filters
        </h6>
        <Button
          variant="outline-secondary"
          size="sm"
          onClick={onClearFilters}
          className="btn-medical-outline"
        >
          Clear
        </Button>
      </Card.Header>
      <Card.Body>
        {/* Categories */}
        <div className="filter-section mb-4">
          <h6 className="border-bottom pb-2 mb-3">Categories</h6>
          {categories.map((category) => (
            <Form.Check
              key={category}
              type="checkbox"
              id={`category-${category}`}
              label={category}
              checked={activeFilters.category === category}
              onChange={(e) =>
                onFilterChange("category", e.target.checked ? category : "")
              }
              className="mb-2"
            />
          ))}
        </div>

        {/* Price Range */}
        <div className="filter-section mb-4">
          <h6 className="border-bottom pb-2 mb-3">Price Range</h6>
          {priceRanges.map((range, index) => (
            <Form.Check
              key={index}
              type="radio"
              name="priceRange"
              id={`price-${index}`}
              label={range.label}
              onChange={() => onFilterChange("priceRange", range)}
              className="mb-2"
            />
          ))}
        </div>

        {/* Brands */}
        <div className="filter-section mb-4">
          <h6 className="border-bottom pb-2 mb-3">Brands</h6>
          {brands.map((brand) => (
            <Form.Check
              key={brand}
              type="checkbox"
              id={`brand-${brand}`}
              label={brand}
              onChange={(e) =>
                onFilterChange("brand", e.target.checked ? brand : "")
              }
              className="mb-2"
            />
          ))}
        </div>

        {/* Availability */}
        <div className="filter-section">
          <h6 className="border-bottom pb-2 mb-3">Availability</h6>
          <Form.Check
            type="checkbox"
            id="inStock"
            label="In Stock Only"
            onChange={(e) => onFilterChange("inStock", e.target.checked)}
            className="mb-2"
          />
        </div>
      </Card.Body>
    </Card>
  );
};

export default ProductFilters;
