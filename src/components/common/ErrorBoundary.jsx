import React from "react";
import { Container, Row, Col, Card, Button } from "react-bootstrap";

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    // Update state so the next render will show the fallback UI
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    // Log the error to console
    console.error("Error Boundary caught an error:", error, errorInfo);

    this.setState({
      error: error,
      errorInfo: errorInfo,
    });
  }

  handleReload = () => {
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      return (
        <div
          style={{
            minHeight: "100vh",
            background: "linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%)",
            paddingTop: "50px",
          }}
        >
          <Container>
            <Row className="justify-content-center">
              <Col lg={8} md={10}>
                <Card
                  style={{
                    border: "none",
                    borderRadius: "20px",
                    boxShadow: "0 15px 50px rgba(220, 53, 69, 0.2)",
                  }}
                >
                  <Card.Body className="p-5 text-center">
                    <div className="mb-4">
                      <div
                        <pre
                          style={{
                            fontSize: "12px",
                            background: "#f1f3f4",
                            padding: "15px",
                            borderRadius: "8px",
                            whiteSpace: "pre-wrap",
                            overflow: "auto",
                          }}
                        >
                          {this.state.error && this.state.error.toString()}
                          {this.state.errorInfo?.componentStack || ""}
                        </pre>
                        <i
                          className="bi bi-exclamation-triangle"
                          style={{ fontSize: "40px", color: "white" }}
                        ></i>
                      </div>
                    </div>

                    <h2
                      style={{
                        color: "#dc3545",
                        fontWeight: "800",
                        marginBottom: "20px",
                      }}
                    >
                      Something went wrong
                    </h2>

                    <p
                      style={{
                        color: "#666",
                        fontSize: "16px",
                        lineHeight: "1.6",
                        marginBottom: "30px",
                      }}
                    >
                      We're sorry, but something unexpected happened. Please try
                      reloading the page or contact support if the problem
                      persists.
                    </p>

                    {process.env.NODE_ENV === "development" && (
                      <div
                        style={{
                          background: "#f8f9fa",
                          border: "1px solid #dee2e6",
                          borderRadius: "8px",
                          padding: "20px",
                          marginBottom: "30px",
                          textAlign: "left",
                        }}
                      >
                        <h6 style={{ color: "#dc3545", marginBottom: "10px" }}>
                          Error Details (Development Mode):
                        </h6>
                        <pre
                          style={{
                            fontSize: "12px",
                            color: "#6c757d",
                            margin: "0",
                            maxHeight: "200px",
                            overflow: "auto",
                          }}
                        >
                          {this.state.error && this.state.error.toString()}
                          {this.state.errorInfo.componentStack}
                        </pre>
                      </div>
                    )}

                    <div>
                      <Button
                        variant="danger"
                        size="lg"
                        onClick={this.handleReload}
                        style={{
                          borderRadius: "12px",
                          fontWeight: "600",
                          padding: "12px 30px",
                          marginRight: "15px",
                        }}
                      >
                        <i className="bi bi-arrow-clockwise me-2"></i>
                        Reload Page
                      </Button>

                      <Button
                        variant="outline-secondary"
                        size="lg"
                        onClick={() => window.history.back()}
                        style={{
                          borderRadius: "12px",
                          fontWeight: "600",
                          padding: "12px 30px",
                        }}
                      >
                        <i className="bi bi-arrow-left me-2"></i>
                        Go Back
                      </Button>
                    </div>
                  </Card.Body>
                </Card>
              </Col>
            </Row>
          </Container>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;