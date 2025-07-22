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
};

module.exports = loginController;
