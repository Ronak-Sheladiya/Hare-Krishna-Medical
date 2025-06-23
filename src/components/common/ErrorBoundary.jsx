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
                        style={{
                          width: "120px",
                          height: "120px",
                          background:
                            "linear-gradient(135deg, #dc3545, #c82333)",
                          borderRadius: "50%",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          margin: "0 auto 30px",
                          boxShadow: "0 15px 40px rgba(220, 53, 69, 0.3)",
                        }}
                      >
                        <i
                          className="bi bi-exclamation-triangle"
                          style={{ fontSize: "40px", color: "white" }}
                        ></i>
                      </div>
                    </div>

                    <h1
                      style={{
                        color: "#dc3545",
                        fontWeight: "800",
                        marginBottom: "20px",
                        fontSize: "2.5rem",
                      }}
                    >
                      Oops! Something went wrong
                    </h1>

                    <p
                      style={{
                        color: "#6c757d",
                        fontSize: "1.2rem",
                        marginBottom: "30px",
                        lineHeight: "1.6",
                      }}
                    >
                      We're sorry, but something unexpected happened. Please try
                      refreshing the page or go back to the previous page.
                    </p>

                    {/* Error Details - Only show in development */}
                    {import.meta.env.DEV && (
                      <div className="mb-4">
                        <details
                          style={{
                            textAlign: "left",
                            margin: "20px 0",
                            padding: "15px",
                            background: "#f8f9fa",
                            borderRadius: "8px",
                            border: "1px solid #dee2e6",
                          }}
                        >
                          <summary
                            style={{
                              cursor: "pointer",
                              fontWeight: "600",
                              color: "#495057",
                              marginBottom: "10px",
                            }}
                          >
                            Error Details (Development Only)
                          </summary>
                          <pre
                            style={{
                              fontSize: "12px",
                              background: "#ffffff",
                              padding: "15px",
                              borderRadius: "8px",
                              whiteSpace: "pre-wrap",
                              overflow: "auto",
                              border: "1px solid #dee2e6",
                              margin: "10px 0 0 0",
                            }}
                          >
                            {this.state.error && this.state.error.toString()}
                            {this.state.errorInfo?.componentStack || ""}
                          </pre>
                        </details>
                      </div>
                    )}

                    <div className="d-flex gap-3 justify-content-center flex-wrap">
                      <Button
                        variant="primary"
                        size="lg"
                        onClick={this.handleReload}
                        style={{
                          background:
                            "linear-gradient(135deg, #e63946, #dc3545)",
                          border: "none",
                          borderRadius: "12px",
                          fontWeight: "600",
                          padding: "12px 30px",
                        }}
                      >
                        <i className="bi bi-arrow-clockwise me-2"></i>
                        Refresh Page
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
