const express = require("express");
const router = express.Router();
const vehicleController = require("../controllers/vehicle.controller");
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

// GET /api/vehicles - Retrieve all active vehicles (authenticated, any employee)
router.get("/", authMiddleware, vehicleController.getAllVehicles);

// POST /api/vehicles - Create a new vehicle (authenticated, any employee)
router.post("/", authMiddleware, vehicleController.createVehicle);

// GET /api/vehicles/:id - Retrieve vehicle by ID (authenticated, any employee)
router.get("/:id", authMiddleware, vehicleController.getVehicleById);
// vehicles.route.js
router.get("/customer/:customer_hash", authMiddleware, vehicleController.getVehiclesByCustomerHash);

// PUT /api/vehicles/:id - Update vehicle details (authenticated, Admin/Manager only)
router.put(
  "/:id",
  authMiddleware,
  restrictToAdminOrManager,
  vehicleController.updateVehicle
);

// DELETE /api/vehicles/:id - Delete a vehicle (authenticated, Admin/Manager only)
router.delete(
  "/:id",
  authMiddleware,
  restrictToAdminOrManager,
  vehicleController.deleteVehicle
);

module.exports = router;
