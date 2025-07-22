const express = require("express");
const router = express.Router();
const installController = require("../controllers/install.controller");
const authMiddleware = require("../middlewares/auth.middleware");

// Middleware to check for Admin role
const restrictToAdmin = (req, res, next) => {
  const userRole = req.user.role; // Assumes authMiddleware attaches role to req.user
  if (userRole === "Admin") {
    next();
  } else {
    res.status(403).json({ error: "Access denied. Requires Admin role." });
  }
};

// POST /api/install - Initialize database and seed initial data (authenticated, Admin only)
router.post(
  "/",
  authMiddleware,
  restrictToAdmin,
  installController.initializeDatabase
);

module.exports = router;
