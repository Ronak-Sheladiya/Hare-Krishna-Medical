import React from "react";
import { Modal, Spinner, Alert } from "react-bootstrap";

const LoadingOverlay = ({
  show,
  title = "Processing...",
  message = "Please wait while we process your request.",
  isSlowRequest = false,
  onHide = null,
}) => {
  return (
    <Modal
      show={show}
      backdrop="static"
      keyboard={false}
      centered
      onHide={onHide}
    >
      <Modal.Body className="text-center p-4">
        <div className="mb-3">
          <Spinner animation="border" variant="primary" />
        </div>

        <h5 className="mb-3">{title}</h5>

        <p className="text-muted mb-3">{message}</p>

        {isSlowRequest && (
          <Alert variant="info" className="mb-0">
            <small>
              <strong>Taking longer than usual?</strong>
              <br />
              Free hosting services may need time to wake up. Your request is
              still being processed - please don't close this window.
            </small>
          </Alert>
        )}
      </Modal.Body>
    </Modal>
  );
};

export default LoadingOverlay;
