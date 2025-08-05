// controllers/login.controller.js
const loginService = require("../services/login.service");
const jwt = require("jsonwebtoken");
const logger = require("../utils/logger");

const loginController = {
  async login(req, res) {
    try {
      const { email, password } = req.body;
      if (!email || !password) {
        return res
          .status(400)
          .json({ error: "Email and password are required" });
      }

      const employee = await loginService.authenticateEmployee(email, password);
      if (!employee) {
        return res.status(401).json({ error: "Invalid email or password" });
      }

      // Generate JWT with employee_id and role
      const token = jwt.sign(
        { employee_id: employee.employee_id, role: employee.role },
        process.env.JWT_SECRET,
        { expiresIn: "1h" }
      );

      res.status(200).json({
        token,
        employee: {
          employee_id: employee.employee_id,
          email: employee.email,
          first_name: employee.first_name,
          last_name: employee.last_name,
          role: employee.role,
        },
      });
    } catch (err) {
      logger.error("Error during login:", err.message);
      res.status(500).json({ error: "Failed to authenticate" });
    }
  },

  // New method to check authentication status
  async checkAuth(req, res) {
    try {
      const employee = await loginService.getEmployeeById(req.user.employee_id);
      if (!employee) {
        return res.status(404).json({ error: "Employee not found" });
      }

      // Map company_role_name to a numeric role_id for frontend compatibility
      const roleIdMap = {
        admin: 3, // Map "admin" to 3 for frontend
        // Add other roles as needed, e.g., "user": 1
      };

      res.status(200).json({
        employee_token: req.header("Authorization")?.replace("Bearer ", ""),
        employee_role: roleIdMap[employee.role] || 1, // Default to 1 if role not mapped
        employee_id: employee.employee_id,
        email: employee.email,
        first_name: employee.first_name,
        last_name: employee.last_name,
      });
    } catch (err) {
      logger.error("Error during auth check:", err.message);
      res.status(500).json({ error: "Failed to verify authentication" });
    }
  },
};

module.exports = loginController;
