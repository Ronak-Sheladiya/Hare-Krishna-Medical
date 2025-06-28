import React from "react";
import ProfessionalLoading from "./ProfessionalLoading";

const LoadingSpinner = ({
  size = "lg",
  text = "Loading...",
  fullScreen = true,
  overlay = false,
}) => {
  return (
    <ProfessionalLoading
      size={size}
      message={text}
      fullScreen={fullScreen}
      overlay={overlay}
      color="#e63946"
    />
  );
};

export default LoadingSpinner;
