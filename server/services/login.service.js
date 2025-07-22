const db = require("../config/db.config");
const { comparePassword } = require("../utils/password");
const logger = require("../utils/logger");

const loginService = {
  async authenticateEmployee(email, password) {
    try {
      // Fetch employee data with role
      const [rows] = await db.query(
        `
        SELECT e.employee_id, e.employee_email AS email, ep.employee_password_hashed AS password,
               ei.employee_first_name AS first_name, ei.employee_last_name AS last_name,
               cr.company_role_name AS role
        FROM employee e
        JOIN employee_pass ep ON e.employee_id = ep.employee_id
        JOIN employee_info ei ON e.employee_id = ei.employee_id
        JOIN employee_role er ON e.employee_id = er.employee_id
        JOIN company_roles cr ON er.company_role_id = cr.company_role_id
        WHERE e.employee_email = ? AND e.employee_active_status = 1
      `,
        [email]
      );

      if (rows.length === 0) {
        logger.warn(
          `Login attempt failed: No employee found for email ${email}`
        );
        return null;
      }

      const employee = rows[0];
      const isPasswordValid = await comparePassword(
        password,
        employee.password
      );
      if (!isPasswordValid) {
        logger.warn(
          `Login attempt failed: Invalid password for email ${email}`
        );
        return null;
      }

      // Remove password from response
      delete employee.password;
      return employee;
    } catch (err) {
      logger.error("Database error during authentication:", err);
      throw err;
    }
  },
};

module.exports = loginService;
