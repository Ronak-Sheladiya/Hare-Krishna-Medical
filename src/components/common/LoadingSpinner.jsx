import React from "react";

const LoadingSpinner = () => {
  return (
    <div className="loading-container">
      <img
        src="https://cdn.builder.io/api/v1/assets/ec4b3f82f1ac4275b8bfc1756fcac420/medical_logo-e586be?format=webp&width=800"
        alt="Hare Krishna Medical"
        className="mb-4"
        style={{ height: "80px", width: "auto" }}
      />
      <div className="loading-spinner"></div>
      <p className="mt-3 text-muted">Loading...</p>
    </div>
  );
};

export default LoadingSpinner;
