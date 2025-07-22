const express = require("express");
const router = express.Router();
const customerController = require("../controllers/customer.controller");
const authMiddleware = require("../middlewares/auth.middleware");

// Middleware to check for Admin or Manager role
const restrictToAdminOrManager = (req, res, next) => {
  const userRole = req.user.role; // Assumes authMiddleware attaches role to req.user
  if (userRole === "Admin" || userRole === "Manager") {
    next();
  } else {
    res
      .status(403)
      .json({ error: "Access denied. Requires Admin or Manager role." });
  }
};

// GET /api/customers - Retrieve all customers (authenticated, any employee)
router.get("/", authMiddleware, customerController.getAllCustomers);

// POST /api/customers - Create a new customer (public or authenticated)
router.post("/", customerController.createCustomer);

// GET /api/customers/:id - Retrieve customer by ID (authenticated, any employee)
router.get("/:id", authMiddleware, customerController.getCustomerById);

// PUT /api/customers/:id - Update customer details (authenticated, Admin/Manager only)
router.put(
  "/:id",
  authMiddleware,
  restrictToAdminOrManager,
  customerController.updateCustomer
);

// DELETE /api/customers/:id - Delete a customer (authenticated, Admin/Manager only)
router.delete(
  "/:id",
  authMiddleware,
  restrictToAdminOrManager,
  customerController.deleteCustomer
);

module.exports = router;
