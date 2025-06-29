const errorHandler = (err, req, res, next) => {
  let error = { ...err };
  error.message = err.message;

  console.error("Error:", err);

  // Mongoose bad ObjectId
  if (err.name === "CastError") {
    const message = "Resource not found";
    error = { message, statusCode: 404 };
  }

  // Mongoose duplicate key
  if (err.code === 11000) {
    let field = Object.keys(err.keyValue)[0];
    let value = err.keyValue[field];

    // Customize message based on field
    let message = `${field.charAt(0).toUpperCase() + field.slice(1)} '${value}' already exists`;

    if (field === "email") {
      message = "An account with this email already exists";
    }

    error = { message, statusCode: 400 };
  }

  // Mongoose validation error
  if (err.name === "ValidationError") {
    const messages = Object.values(err.errors).map((val) => val.message);
    const message = messages.join(", ");
    error = { message, statusCode: 400 };
  }

  // JWT errors
  if (err.name === "JsonWebTokenError") {
    error = { message: "Invalid token", statusCode: 401 };
  }

  if (err.name === "TokenExpiredError") {
    error = { message: "Token expired", statusCode: 401 };
  }

  // Multer errors (file upload)
  if (err.code === "LIMIT_FILE_SIZE") {
    error = { message: "File too large", statusCode: 400 };
  }

  if (err.code === "LIMIT_FILE_COUNT") {
    error = { message: "Too many files", statusCode: 400 };
  }

  if (err.code === "LIMIT_UNEXPECTED_FILE") {
    error = { message: "Unexpected file field", statusCode: 400 };
  }

  // Rate limiting errors
  if (err.status === 429) {
    error = {
      message: "Too many requests, please try again later",
      statusCode: 429,
    };
  }

  // MongoDB connection errors
  if (err.name === "MongoError" || err.name === "MongoServerError") {
    error = { message: "Database connection error", statusCode: 500 };
  }

  // Default to 500 server error
  const statusCode = error.statusCode || 500;
  const message = error.message || "Internal Server Error";

  res.status(statusCode).json({
    success: false,
    message,
    ...(process.env.NODE_ENV === "development" && { stack: err.stack }),
  });
};

module.exports = errorHandler;
