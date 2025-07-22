const jwt = require("jsonwebtoken");
const logger = require("../utils/logger");

const authMiddleware = (req, res, next) => {
  const token = req.header("Authorization")?.replace("Bearer ", "");
  if (!token) {
    logger.warn("No token provided for request:", req.url);
    return res.status(401).json({ error: "No token provided" });
  }
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // Attach user data (e.g., employee_id, role) to request
    next();
  } catch (err) {
    logger.error("Invalid token:", err.message);
    res.status(401).json({ error: "Invalid token" });
  }
};

module.exports = authMiddleware;
