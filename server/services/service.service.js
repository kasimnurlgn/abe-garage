const db = require("../config/db.config");
const logger = require("../utils/logger");

const serviceService = {
  async getAllServices() {
    try {
      const [rows] = await db.query(`
        SELECT service_id, service_name, service_description, service_price, service_active_status
        FROM common_services
        WHERE service_active_status = 1
      `);
      return rows;
    } catch (err) {
      logger.error("Database error fetching services:", err);
      throw err;
    }
  },

  async createService({
    service_name,
    service_description,
    service_price,
    service_active_status,
  }) {
    try {
      const [result] = await db.query(
        "INSERT INTO common_services (service_name, service_description, service_price, service_active_status) VALUES (?, ?, ?, ?)",
        [
          service_name,
          service_description,
          service_price,
          service_active_status,
        ]
      );
      const serviceId = result.insertId;
      return await this.getServiceById(serviceId);
    } catch (err) {
      logger.error("Database error creating service:", err);
      throw err;
    }
  },

  async getServiceById(id) {
    try {
      const [rows] = await db.query(
        "SELECT service_id, service_name, service_description, service_price, service_active_status FROM common_services WHERE service_id = ? AND service_active_status = 1",
        [id]
      );
      return rows[0] || null;
    } catch (err) {
      logger.error("Database error fetching service by ID:", err);
      throw err;
    }
  },

  async updateService(
    id,
    { service_name, service_description, service_price, service_active_status }
  ) {
    try {
      await db.query(
        "UPDATE common_services SET service_name = ?, service_description = ?, service_price = ?, service_active_status = ? WHERE service_id = ?",
        [
          service_name,
          service_description || "",
          service_price,
          service_active_status !== undefined ? service_active_status : 1,
          id,
        ]
      );
      return await this.getServiceById(id);
    } catch (err) {
      logger.error("Database error updating service:", err);
      throw err;
    }
  },

  async deleteService(id) {
    try {
      const [result] = await db.query(
        "UPDATE common_services SET service_active_status = 0 WHERE service_id = ?",
        [id]
      );
      return result.affectedRows > 0;
    } catch (err) {
      logger.error("Database error deleting service:", err);
      throw err;
    }
  },
};

module.exports = serviceService;
