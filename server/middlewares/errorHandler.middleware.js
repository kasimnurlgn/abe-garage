const logger = require("../utils/logger");

const errorHandler = (err, req, res, next) => {
  // Log the error with stack trace for debugging
  logger.error(`Error: ${err.message}, Stack: ${err.stack}`);

  // Handle validation errors (e.g., invalid input in controllers)
  if (err.name === "ValidationError") {
    return res.status(400).json({ error: err.message });
  }

  // Handle JWT authentication errors (e.g., invalid token in auth.middleware.js)
  if (err.name === "UnauthorizedError") {
    return res.status(401).json({ error: "Invalid or missing token" });
  }

  // Handle role-based access errors (from restrictToAdminOrManager middleware)
  if (err.message === "Access denied. Requires Admin or Manager role.") {
    return res.status(403).json({ error: err.message });
  }

  // Handle not found errors (e.g., customer, employee, vehicle not found)
  if (err.message.includes("not found")) {
    return res.status(404).json({ error: err.message });
  }

  // Default to 500 for unhandled errors
  res.status(500).json({ error: "Internal server error" });
};

module.exports = errorHandler;
