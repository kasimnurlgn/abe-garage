const express = require("express");
const router = express.Router();
const serviceController = require("../controllers/service.controller");
const authMiddleware = require("../middlewares/auth.middleware");

// Middleware to check for Admin or Manager role
const restrictToAdminOrManager = (req, res, next) => {
  const userRole = req.user.role; 
  if (userRole === "Admin" || userRole === "Manager") {
    next();
  } else {
    res
      .status(403)
      .json({ error: "Access denied. Requires Admin or Manager role." });
  }
};

// GET /api/services - Retrieve all active services
router.get("/", authMiddleware, serviceController.getAllServices);

// POST /api/services - Create a new service (authenticated, Admin/Manager only)
router.post(
  "/",
  authMiddleware,
  restrictToAdminOrManager,
  serviceController.createService
);

// GET /api/services/:id - Retrieve service by ID (authenticated, any employee)
router.get("/:id", authMiddleware, serviceController.getServiceById);

// PUT /api/services/:id - Update service details (authenticated, Admin/Manager only)
router.put(
  "/:id",
  authMiddleware,
  restrictToAdminOrManager,
  serviceController.updateService
);

// DELETE /api/services/:id - Delete a service (authenticated, Admin/Manager only)
router.delete(
  "/:id",
  authMiddleware,
  restrictToAdminOrManager,
  serviceController.deleteService
);

module.exports = router;
