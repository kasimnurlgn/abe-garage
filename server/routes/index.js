const express = require("express");
const router = express.Router();
const authMiddleware = require("../middlewares/auth.middleware");

// Import microservice routes
const loginRoutes = require("./login.routes");
const employeeRoutes = require("./employees.routes");
const customerRoutes = require("./customers.routes");
const orderRoutes = require("./orders.routes");
const serviceRoutes = require("./services.routes");
const vehicleRoutes = require("./vehicles.routes");
const installRoutes = require("./install.routes");

// Mount routes
router.use("/login", loginRoutes);
router.use("/employees", authMiddleware, employeeRoutes);
router.use("/customers", authMiddleware, customerRoutes);
// Conditionally apply authMiddleware for /orders
router.use("/orders", (req, res, next) => {
  // Skip authentication for GET /orders/hash/:order_hash
  if (req.method === "GET" && req.path.match(/^\/hash\/[^/]+$/)) {
    return next();
  }
  return authMiddleware(req, res, next);
});
router.use("/orders", orderRoutes);
router.use("/services", authMiddleware, serviceRoutes);
router.use("/vehicles", authMiddleware, vehicleRoutes);
router.use("/install", authMiddleware, installRoutes);

module.exports = router;
