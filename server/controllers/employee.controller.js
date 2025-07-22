const employeeService = require("../services/employee.service");
const { hashPassword } = require("../utils/password");
const logger = require("../utils/logger");

const employeeController = {
  // Get all employees
  async getAllEmployees(req, res) {
    try {
      const employees = await employeeService.getAllEmployees();
      res.status(200).json(employees);
    } catch (err) {
      logger.error("Error fetching employees:", err.message);
      res.status(500).json({ error: "Failed to fetch employees" });
    }
  },

  // Create a new employee
  async createEmployee(req, res) {
    try {
      const { email, first_name, last_name, phone, password, role_id } =
        req.body;
      if (!email || !first_name || !last_name || !password || !role_id) {
        return res.status(400).json({ error: "Missing required fields" });
      }
      const hashedPassword = await hashPassword(password);
      const employeeData = {
        email,
        first_name,
        last_name,
        phone,
        password: hashedPassword,
        role_id,
      };
      const newEmployee = await employeeService.createEmployee(employeeData);
      res.status(201).json(newEmployee);
    } catch (err) {
      logger.error("Error creating employee:", err.message);
      res.status(500).json({ error: "Failed to create employee" });
    }
  },

  // Get employee by ID
  async getEmployeeById(req, res) {
    try {
      const { id } = req.params;
      const employee = await employeeService.getEmployeeById(id);
      if (!employee) {
        return res.status(404).json({ error: "Employee not found" });
      }
      res.status(200).json(employee);
    } catch (err) {
      logger.error("Error fetching employee:", err.message);
      res.status(500).json({ error: "Failed to fetch employee" });
    }
  },

  // Update employee
  async updateEmployee(req, res) {
    try {
      const { id } = req.params;
      const {
        email,
        first_name,
        last_name,
        phone,
        password,
        role_id,
        active_status,
      } = req.body;
      const employeeData = {
        email,
        first_name,
        last_name,
        phone,
        password,
        role_id,
        active_status,
      };
      if (password) {
        employeeData.password = await hashPassword(password);
      }
      const updatedEmployee = await employeeService.updateEmployee(
        id,
        employeeData
      );
      if (!updatedEmployee) {
        return res.status(404).json({ error: "Employee not found" });
      }
      res.status(200).json(updatedEmployee);
    } catch (err) {
      logger.error("Error updating employee:", err.message);
      res.status(500).json({ error: "Failed to update employee" });
    }
  },

  // Delete employee
  async deleteEmployee(req, res) {
    try {
      const { id } = req.params;
      const deleted = await employeeService.deleteEmployee(id);
      if (!deleted) {
        return res.status(404).json({ error: "Employee not found" });
      }
      res.status(204).send();
    } catch (err) {
      logger.error("Error deleting employee:", err.message);
      res.status(500).json({ error: "Failed to delete employee" });
    }
  },
};

module.exports = employeeController;
