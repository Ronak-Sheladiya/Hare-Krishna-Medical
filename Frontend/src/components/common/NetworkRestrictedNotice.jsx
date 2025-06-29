import React from "react";
import { Alert, Button } from "react-bootstrap";
import { isRestrictedEnvironment } from "../../utils/config";

const NetworkRestrictedNotice = ({
  title = "Limited Functionality",
  message = "Some features are temporarily unavailable due to network restrictions.",
  showRefreshButton = true,
}) => {
  if (!isRestrictedEnvironment()) {
    return null;
  }

  return (
    <Alert variant="warning" className="mb-4">
      <Alert.Heading>
        <i className="bi bi-exclamation-triangle-fill me-2"></i>
        {title}
      </Alert.Heading>
      <p className="mb-3">{message}</p>
      <div className="d-flex flex-column flex-md-row gap-2">
        <small className="text-muted">
          <strong>Why am I seeing this?</strong> This preview environment has
          network restrictions that prevent communication with external servers.
          In a normal deployment, all features would work properly.
        </small>
      </div>
      {showRefreshButton && (
        <div className="mt-3">
          <Button
            variant="outline-warning"
            size="sm"
            onClick={() => window.location.reload()}
          >
            <i className="bi bi-arrow-clockwise me-1"></i>
            Refresh Page
          </Button>
        </div>
      )}
    </Alert>
  );
};

export default NetworkRestrictedNotice;
