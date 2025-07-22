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
router.use("/login", loginRoutes); // Unprotected for authentication
router.use("/employees", authMiddleware, employeeRoutes);
router.use("/customers", authMiddleware, customerRoutes);
router.use("/orders", authMiddleware, orderRoutes);
router.use("/services", authMiddleware, serviceRoutes);
router.use("/vehicles", authMiddleware, vehicleRoutes);
router.use("/install", authMiddleware, installRoutes);

module.exports = router;
