const db = require('../config/db.config');
const logger = require('../utils/logger');

const employeeService = {
  async getAllEmployees() {
    try {
      const [rows] = await db.query(`
        SELECT e.employee_id, e.employee_email, e.employee_active_status, e.employee_added_date,
               ei.employee_first_name, ei.employee_last_name, ei.employee_phone,
               cr.company_role_name AS role
        FROM employee e
        JOIN employee_info ei ON e.employee_id = ei.employee_id
        JOIN employee_role er ON e.employee_id = er.employee_id
        JOIN company_roles cr ON er.company_role_id = cr.company_role_id
        WHERE e.employee_active_status = 1
      `);
      return rows;
    } catch (err) {
      logger.error('Database error fetching employees:', err);
      throw err;
    }
  },

  async createEmployee({ email, first_name, last_name, phone, password, role_id }) {
    const connection = await db.getConnection();
    try {
      await connection.beginTransaction();
      const [result] = await connection.query(
        'INSERT INTO employee (employee_email) VALUES (?)',
        [email]
      );
      const employeeId = result.insertId;
      await connection.query(
        'INSERT INTO employee_info (employee_id, employee_first_name, employee_last_name, employee_phone) VALUES (?, ?, ?, ?)',
        [employeeId, first_name, last_name, phone]
      );
      await connection.query(
        'INSERT INTO employee_pass (employee_id, employee_password_hashed) VALUES (?, ?)',
        [employeeId, password]
      );
      await connection.query(
        'INSERT INTO employee_role (employee_id, company_role_id) VALUES (?, ?)',
        [employeeId, role_id]
      );
      await connection.commit();
      return { employee_id: employeeId, email, first_name, last_name, phone, role_id };
    } catch (err) {
      await connection.rollback();
      logger.error('Database error creating employee:', err);
      throw err;
    } finally {
      connection.release();
    }
  },

  async getEmployeeById(id) {
    try {
      const [rows] = await db.query(`
        SELECT e.employee_id, e.employee_email, e.employee_active_status, e.employee_added_date,
               ei.employee_first_name, ei.employee_last_name, ei.employee_phone,
               cr.company_role_name AS role
        FROM employee e
        JOIN employee_info ei ON e.employee_id = ei.employee_id
        JOIN employee_role er ON e.employee_id = er.employee_id
        JOIN company_roles cr ON er.company_role_id = cr.company_role_id
        WHERE e.employee_id = ? AND e.employee_active_status = 1
      `, [id]);
      return rows[0] || null;
    } catch (err) {
      logger.error('Database error fetching employee by ID:', err);
      throw err;
    }
  },

  async updateEmployee(id, { email, first_name, last_name, phone, password, role_id, active_status }) {
    const connection = await db.getConnection();
    try {
      await connection.beginTransaction();
      await connection.query(
        'UPDATE employee SET employee_email = ?, employee_active_status = ? WHERE employee_id = ?',
        [email, active_status !== undefined ? active_status : 1, id]
      );
      await connection.query(
        'UPDATE employee_info SET employee_first_name = ?, employee_last_name = ?, employee_phone = ? WHERE employee_id = ?',
        [first_name, last_name, phone || null, id]
      );
      if (password) {
        await connection.query(
          'UPDATE employee_pass SET employee_password_hashed = ? WHERE employee_id = ?',
          [password, id]
        );
      }
      if (role_id) {
        await connection.query(
          'UPDATE employee_role SET company_role_id = ? WHERE employee_id = ?',
          [role_id, id]
        );
      }
      await connection.commit();
      return await this.getEmployeeById(id);
    } catch (err) {
      await connection.rollback();
      logger.error('Database error updating employee:', err);
      throw err;
    } finally {
      connection.release();
    }
  },

  async deleteEmployee(id) {
    try {
      const [result] = await db.query('UPDATE employee SET employee_active_status = 0 WHERE employee_id = ?', [id]);
      return result.affectedRows > 0;
    } catch (err) {
      logger.error('Database error deleting employee:', err);
      throw err;
    }
  }
};

module.exports = employeeService;