const logger = require("../utils/logger");

const errorHandler = (err, req, res, next) => {
  // Log the error with stack trace for debugging
  logger.error(`Error: ${err.message}, Stack: ${err.stack}`);

  // Handle specific error types
  if (err.name === "ValidationError") {
    // Handle validation errors (e.g., invalid input in controllers)
    return res.status(400).json({ error: err.message });
  }

  if (err.name === "UnauthorizedError") {
    // Handle JWT authentication errors (e.g., invalid token in auth.middleware.js)
    return res.status(401).json({ error: "Invalid or missing token" });
  }

  if (err.message === "Access denied. Requires Admin or Manager role.") {
    // Handle role-based access errors (from restrictToAdminOrManager middleware)
    return res.status(403).json({ error: err.message });
  }

  if (err.message.includes("not found")) {
    // Handle not found errors (e.g., customer, employee, vehicle not found)
    return res.status(404).json({ error: err.message });
  }

  // Default to 500 for unhandled errors
  res.status(500).json({ error: "Internal server error" });
};

module.exports = errorHandler;
