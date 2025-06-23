import React from "react";

const ProfessionalLoading = ({
  size = "md",
  message = "Loading...",
  fullScreen = false,
  overlay = false,
  color = "#e63946",
}) => {
  const getSizeConfig = () => {
    switch (size) {
      case "sm":
        return { logoSize: 40, containerSize: 80, fontSize: "0.9rem" };
      case "lg":
        return { logoSize: 80, containerSize: 160, fontSize: "1.2rem" };
      case "xl":
        return { logoSize: 120, containerSize: 240, fontSize: "1.4rem" };
      default:
        return { logoSize: 60, containerSize: 120, fontSize: "1rem" };
    }
  };

  const { logoSize, containerSize, fontSize } = getSizeConfig();

  const containerStyle = {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    gap: "20px",
    ...(fullScreen && {
      position: "fixed",
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: overlay ? "rgba(248, 249, 250, 0.95)" : "#f8f9fa",
      zIndex: 9999,
    }),
    ...(overlay &&
      !fullScreen && {
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: "rgba(248, 249, 250, 0.95)",
        zIndex: 1000,
      }),
    ...(!fullScreen &&
      !overlay && {
        padding: "40px 20px",
      }),
  };

  return (
    <div style={containerStyle}>
      {/* Rotating Logo Container */}
      <div style={{ position: "relative" }}>
        {/* Outer Rotating Ring */}
        <div
          style={{
            width: containerSize,
            height: containerSize,
            border: `3px solid ${color}20`,
            borderTop: `3px solid ${color}`,
            borderRadius: "50%",
            animation: "spin 2s linear infinite",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            position: "relative",
          }}
        >
          {/* Inner White Circle with Logo */}
          <div
            style={{
              width: logoSize + 20,
              height: logoSize + 20,
              background: "white",
              borderRadius: "50%",
              border: `2px solid ${color}15`,
              boxShadow: `0 8px 32px ${color}20`,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              animation: "counterSpin 2s linear infinite",
            }}
          >
            <img
              src="https://cdn.builder.io/api/v1/assets/030c65a34d11492ab1cc545443b12540/hk-e0ec29?format=webp&width=800"
              alt="Loading"
              style={{
                width: logoSize,
                height: logoSize,
                objectFit: "contain",
                animation: "pulse 1.5s ease-in-out infinite",
              }}
              onError={(e) => {
                e.target.style.display = "none";
                e.target.nextSibling.style.display = "flex";
              }}
            />
            {/* Fallback when image fails to load */}
            <div
              style={{
                display: "none",
                width: logoSize,
                height: logoSize,
                background: `linear-gradient(135deg, ${color}, ${color}dd)`,
                borderRadius: "50%",
                alignItems: "center",
                justifyContent: "center",
                color: "white",
                fontWeight: "bold",
                fontSize: logoSize / 3,
              }}
            >
              HK
            </div>
          </div>
        </div>

        {/* Decorative Dots */}
        <div
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: containerSize + 40,
            height: containerSize + 40,
            pointerEvents: "none",
          }}
        >
          {[0, 60, 120, 180, 240, 300].map((rotation, index) => (
            <div
              key={index}
              style={{
                position: "absolute",
                top: "50%",
                left: "50%",
                width: "8px",
                height: "8px",
                background: `${color}40`,
                borderRadius: "50%",
                transform: `translate(-50%, -50%) rotate(${rotation}deg) translateY(-${containerSize / 2 + 25}px)`,
                animation: `fadeInOut 2s ease-in-out infinite ${index * 0.2}s`,
              }}
            />
          ))}
        </div>
      </div>

      {/* Loading Message */}
      <div style={{ textAlign: "center" }}>
        <div
          style={{
            color: "#495057",
            fontSize: fontSize,
            fontWeight: "600",
            marginBottom: "8px",
            animation: "fadeInOut 1.5s ease-in-out infinite",
          }}
        >
          {message}
        </div>
        <div
          style={{
            color: "#6c757d",
            fontSize: "0.85rem",
            opacity: 0.8,
          }}
        >
          Hare Krishna Medical
        </div>
      </div>

      {/* CSS Animations */}
      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }

        @keyframes counterSpin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(-360deg); }
        }

        @keyframes pulse {
          0%, 100% { 
            transform: scale(1); 
            opacity: 1; 
          }
          50% { 
            transform: scale(1.05); 
            opacity: 0.8; 
          }
        }

        @keyframes fadeInOut {
          0%, 100% { opacity: 0.3; }
          50% { opacity: 1; }
        }
      `}</style>
    </div>
  );
};

export default ProfessionalLoading;
