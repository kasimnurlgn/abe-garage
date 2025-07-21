const db = require("../config/db.config");
const logger = require("../utils/logger");

const customerService = {
  async getAllCustomers() {
    try {
      const [rows] = await db.query(`
      SELECT ci.customer_id, ci.customer_email, ci.customer_phone_number, ci.customer_hash,
             ci.customer_added_date, cinfo.customer_active_status,
             cinfo.customer_first_name, cinfo.customer_last_name
      FROM customer_identifier ci
      JOIN customer_info cinfo ON ci.customer_id = cinfo.customer_id
      WHERE cinfo.customer_active_status = 1
    `);
      return rows;
    } catch (err) {
      logger.error("Database error fetching customers:", err);
      throw err;
    }
  },

  async createCustomer({
    email,
    phone_number,
    first_name,
    last_name,
    customer_hash,
  }) {
    const connection = await db.getConnection();
    try {
      await connection.beginTransaction();
      const [result] = await connection.query(
        "INSERT INTO customer_identifier (customer_email, customer_phone_number, customer_hash) VALUES (?, ?, ?)",
        [email, phone_number, customer_hash]
      );
      const customerId = result.insertId;
      await connection.query(
        "INSERT INTO customer_info (customer_id, customer_first_name, customer_last_name) VALUES (?, ?, ?)",
        [customerId, first_name, last_name]
      );
      await connection.commit();
      return {
        customer_id: customerId,
        email,
        phone_number,
        first_name,
        last_name,
        customer_hash,
      };
    } catch (err) {
      await connection.rollback();
      logger.error("Database error creating customer:", err);
      throw err;
    } finally {
      connection.release();
    }
  },

  async getCustomerById(id) {
    try {
      const [rows] = await db.query(
        `
    SELECT ci.customer_id, ci.customer_email, ci.customer_phone_number, ci.customer_hash,
           ci.customer_added_date, cinfo.customer_active_status, cinfo.customer_first_name,
           cinfo.customer_last_name
    FROM customer_identifier ci
    JOIN customer_info cinfo ON ci.customer_id = cinfo.customer_id
    WHERE ci.customer_id = ? AND cinfo.customer_active_status = 1
  `,
        [id]
      );
      return rows[0] || null;
    } catch (err) {
      logger.error("Database error fetching customer by ID:", err);
      throw err;
    }
  },

  async updateCustomer(
    id,
    { email, phone_number, first_name, last_name, active_status }
  ) {
    const connection = await db.getConnection();
    try {
      await connection.beginTransaction();

      // Update customer_identifier table
      await connection.query(
        "UPDATE customer_identifier SET customer_email = ?, customer_phone_number = ? WHERE customer_id = ?",
        [email, phone_number, id]
      );

      // Update customer_info table 
      await connection.query(
        "UPDATE customer_info SET customer_first_name = ?, customer_last_name = ?, customer_active_status = ? WHERE customer_id = ?",
        [
          first_name,
          last_name,
          active_status !== undefined ? active_status : 1,
          id,
        ]
      );

      await connection.commit();
      return await this.getCustomerById(id);
    } catch (err) {
      await connection.rollback();
      logger.error("Database error updating customer:", err);
      throw err;
    } finally {
      connection.release();
    }
  },

  async deleteCustomer(id) {
    try {
      // Update active_status in the correct table: customer_info
      const [result] = await db.query(
        "UPDATE customer_info SET customer_active_status = 0 WHERE customer_id = ?",
        [id]
      );
      return result.affectedRows > 0;
    } catch (err) {
      logger.error("Database error deleting customer:", err);
      throw err;
    }
  },
};

module.exports = customerService;
