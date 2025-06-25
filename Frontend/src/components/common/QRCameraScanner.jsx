import React, { useRef, useEffect, useState } from "react";
import { Modal, Button, Alert, Spinner } from "react-bootstrap";
import QrScanner from "qr-scanner";

const QRCameraScanner = ({ show, onHide, onScanSuccess, onScanError }) => {
  const videoRef = useRef(null);
  const qrScannerRef = useRef(null);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [hasCamera, setHasCamera] = useState(false);

  // Check camera availability
  useEffect(() => {
    const checkCamera = async () => {
      try {
        const hasCamera = await QrScanner.hasCamera();
        setHasCamera(hasCamera);
        if (!hasCamera) {
          setError("No camera found on this device");
        }
      } catch (err) {
        console.error("Camera check failed:", err);
        setError("Failed to access camera");
      }
    };

    if (show) {
      checkCamera();
    }
  }, [show]);

  // Initialize QR Scanner
  useEffect(() => {
    if (show && videoRef.current && hasCamera) {
      setIsLoading(true);
      setError("");

      const qrScanner = new QrScanner(
        videoRef.current,
        (result) => {
          try {
            // Extract invoice ID from QR result
            let invoiceId = result.data;

            // If it's a URL, extract the invoice ID
            if (
              invoiceId.includes("/verify/") ||
              invoiceId.includes("/invoice/")
            ) {
              const matches = invoiceId.match(/(?:verify|invoice)\/([^/?]+)/);
              if (matches && matches[1]) {
                invoiceId = matches[1];
              }
            }

            // Clean up any URL parameters
            invoiceId = invoiceId.split("?")[0].split("#")[0];

            if (invoiceId && invoiceId.trim()) {
              onScanSuccess(invoiceId.trim());
              handleClose();
            } else {
              setError("Invalid QR code format");
            }
          } catch (err) {
            console.error("QR parsing error:", err);
            setError("Failed to parse QR code");
          }
        },
        {
          preferredCamera: "environment", // Use back camera on mobile
          highlightScanRegion: true,
          highlightCodeOutline: true,
          maxScansPerSecond: 5,
        },
      );

      qrScannerRef.current = qrScanner;

      qrScanner
        .start()
        .then(() => {
          setIsLoading(false);
        })
        .catch((err) => {
          console.error("QR Scanner start failed:", err);
          setIsLoading(false);
          if (err.name === "NotAllowedError") {
            setError(
              "Camera permission denied. Please allow camera access and try again.",
            );
          } else if (err.name === "NotFoundError") {
            setError("No camera found on this device.");
          } else {
            setError("Failed to start camera. Please try again.");
          }
        });

      return () => {
        if (qrScannerRef.current) {
          qrScannerRef.current.stop();
          qrScannerRef.current.destroy();
          qrScannerRef.current = null;
        }
      };
    }
  }, [show, hasCamera, onScanSuccess]);

  const handleClose = () => {
    if (qrScannerRef.current) {
      qrScannerRef.current.stop();
      qrScannerRef.current.destroy();
      qrScannerRef.current = null;
    }
    setError("");
    setIsLoading(false);
    onHide();
  };

  return (
    <Modal show={show} onHide={handleClose} centered size="lg">
      <Modal.Header closeButton>
        <Modal.Title>
          <i className="bi bi-camera me-2"></i>
          Scan QR Code
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div className="text-center">
          {isLoading && (
            <div className="mb-3">
              <Spinner animation="border" variant="primary" />
              <p className="mt-2">Starting camera...</p>
            </div>
          )}

          {error && (
            <Alert variant="danger" className="mb-3">
              <i className="bi bi-exclamation-triangle me-2"></i>
              {error}
            </Alert>
          )}

          {!hasCamera && !isLoading && (
            <Alert variant="warning" className="mb-3">
              <i className="bi bi-camera-slash me-2"></i>
              No camera available on this device. Please enter the invoice ID
              manually.
            </Alert>
          )}

          {hasCamera && (
            <div className="scanner-container">
              <video
                ref={videoRef}
                style={{
                  width: "100%",
                  maxWidth: "400px",
                  height: "300px",
                  borderRadius: "12px",
                  border: "3px solid #e63946",
                  objectFit: "cover",
                  background: "#000",
                }}
              />
              <div className="mt-3">
                <small className="text-muted">
                  <i className="bi bi-info-circle me-1"></i>
                  Position the QR code within the camera view to scan
                </small>
              </div>
            </div>
          )}

          {!hasCamera && !isLoading && (
            <div className="text-center py-4">
              <i
                className="bi bi-camera-slash"
                style={{ fontSize: "3rem", color: "#6c757d" }}
              ></i>
              <h5 className="mt-3">Camera Not Available</h5>
              <p className="text-muted">
                Your device doesn't have a camera or camera access is not
                available. Please enter the invoice ID manually instead.
              </p>
            </div>
          )}
        </div>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>
          <i className="bi bi-x-lg me-2"></i>
          Cancel
        </Button>
        {hasCamera && (
          <div className="ms-auto">
            <small className="text-muted">
              <i className="bi bi-shield-check me-1"></i>
              Secure QR scanning
            </small>
          </div>
        )}
      </Modal.Footer>

      <style jsx>{`
        .scanner-container {
          position: relative;
        }

        .scanner-container::after {
          content: "";
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          width: 200px;
          height: 200px;
          border: 2px solid rgba(230, 57, 70, 0.8);
          border-radius: 12px;
          pointer-events: none;
          z-index: 10;
        }

        @media (max-width: 576px) {
          .scanner-container::after {
            width: 150px;
            height: 150px;
          }
        }
      `}</style>
    </Modal>
  );
};

export default QRCameraScanner;
