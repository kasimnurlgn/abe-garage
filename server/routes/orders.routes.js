const express = require("express");
const router = express.Router();
const orderController = require("../controllers/order.controller");
const authMiddleware = require("../middlewares/auth.middleware");

// Middleware to check for Admin or Manager role
const restrictToAdminOrManager = (req, res, next) => {
  const userRole = req.user ? req.user.role : null;
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

// POST /api/orders - Create a new order (authenticated, any employee)
router.post("/", authMiddleware, orderController.createOrder);

// GET /api/orders/:id - Retrieve order by ID (authenticated only)
router.get("/:id", authMiddleware, orderController.getOrderByIdOrHash);

// GET /api/orders/hash/:order_hash - Retrieve order by hash (public access)
router.get("/hash/:order_hash", orderController.getOrderByIdOrHash);

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
