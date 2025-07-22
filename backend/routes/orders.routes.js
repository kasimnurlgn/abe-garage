const express = require("express");
const router = express.Router();
const orderController = require("../controllers/order.controller");
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

// GET /api/orders - Retrieve all orders (authenticated, any employee)
router.get("/", authMiddleware, orderController.getAllOrders);

// POST /api/order - Create a new order (authenticated, any employee)
router.post("/", authMiddleware, orderController.createOrder);

// GET /api/order/:id - Retrieve order by ID or hash (authenticated or public with order_hash)
router.get("/:id", orderController.getOrderByIdOrHash);

// PUT /api/orders/:id - Update order details (authenticated, Admin/Manager only)
router.put(
  "/:id",
  authMiddleware,
  restrictToAdminOrManager,
  orderController.updateOrder
);

// DELETE /api/orders/:id - Delete an order (authenticated, Admin/Manager only)
router.delete(
  "/:id",
  authMiddleware,
  restrictToAdminOrManager,
  orderController.deleteOrder
);

module.exports = router;
