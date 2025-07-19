const express = require("express");
const router = express.Router();
const employeeController = require("../controllers/employee.controller");
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

// GET /api/employees - Retrieve all employees (authenticated, any employee)
router.get("/", authMiddleware, employeeController.getAllEmployees);

// POST /api/employee - Create a new employee (authenticated, Admin/Manager only)
router.post(
  "/",
  authMiddleware,
  restrictToAdminOrManager,
  employeeController.createEmployee
);

// GET /api/employee/:id - Retrieve employee by ID (authenticated, any employee)
router.get("/:id", authMiddleware, employeeController.getEmployeeById);

// PUT /api/employee/:id - Update employee details (authenticated, Admin/Manager only)
router.put(
  "/:id",
  authMiddleware,
  restrictToAdminOrManager,
  employeeController.updateEmployee
);

// DELETE /api/employee/:id - Delete an employee (authenticated, Admin/Manager only)
router.delete(
  "/:id",
  authMiddleware,
  restrictToAdminOrManager,
  employeeController.deleteEmployee
);

module.exports = router;
