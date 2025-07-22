const db = require("../config/db.config");
const logger = require("../utils/logger");

const vehicleService = {
  async getAllVehicles() {
    try {
      const [rows] = await db.query(`
        SELECT v.vehicle_id, v.customer_id, v.vehicle_vin, v.vehicle_make, v.vehicle_model, v.vehicle_year, v.vehicle_active_status,
               c.customer_email
        FROM vehicle v
        JOIN customer_identifier c ON v.customer_id = c.customer_id
        WHERE v.vehicle_active_status = 1
      `);
      return rows;
    } catch (err) {
      logger.error("Database error fetching vehicles:", err);
      throw err;
    }
  },

  async createVehicle({
    customer_id,
    vehicle_vin,
    vehicle_make,
    vehicle_model,
    vehicle_year,
    vehicle_active_status,
  }) {
    try {
      // Validate customer_id
      const [customer] = await db.query(
        "SELECT customer_id FROM customer_identifier WHERE customer_id = ? AND customer_active_status = 1",
        [customer_id]
      );
      if (customer.length === 0) {
        throw new Error("Invalid customer_id");
      }

      // Validate unique VIN
      const [existingVin] = await db.query(
        "SELECT vehicle_id FROM vehicle WHERE vehicle_vin = ?",
        [vehicle_vin]
      );
      if (existingVin.length > 0) {
        throw new Error("Vehicle VIN already exists");
      }

      const [result] = await db.query(
        "INSERT INTO vehicle (customer_id, vehicle_vin, vehicle_make, vehicle_model, vehicle_year, vehicle_active_status) VALUES (?, ?, ?, ?, ?, ?)",
        [
          customer_id,
          vehicle_vin,
          vehicle_make,
          vehicle_model,
          vehicle_year,
          vehicle_active_status,
        ]
      );
      const vehicleId = result.insertId;
      return await this.getVehicleById(vehicleId);
    } catch (err) {
      logger.error("Database error creating vehicle:", err);
      throw err;
    }
  },

  async getVehicleById(id) {
    try {
      const [rows] = await db.query(
        `
        SELECT v.vehicle_id, v.customer_id, v.vehicle_vin, v.vehicle_make, v.vehicle_model, v.vehicle_year, v.vehicle_active_status,
               c.customer_email
        FROM vehicle v
        JOIN customer_identifier c ON v.customer_id = c.customer_id
        WHERE v.vehicle_id = ? AND v.vehicle_active_status = 1
      `,
        [id]
      );
      return rows[0] || null;
    } catch (err) {
      logger.error("Database error fetching vehicle by ID:", err);
      throw err;
    }
  },

  async updateVehicle(
    id,
    {
      customer_id,
      vehicle_vin,
      vehicle_make,
      vehicle_model,
      vehicle_year,
      vehicle_active_status,
    }
  ) {
    try {
      // Validate customer_id
      if (customer_id) {
        const [customer] = await db.query(
          "SELECT customer_id FROM customer_identifier WHERE customer_id = ? AND customer_active_status = 1",
          [customer_id]
        );
        if (customer.length === 0) {
          throw new Error("Invalid customer_id");
        }
      }

      // Validate unique VIN (if updated)
      if (vehicle_vin) {
        const [existingVin] = await db.query(
          "SELECT vehicle_id FROM vehicle WHERE vehicle_vin = ? AND vehicle_id != ?",
          [vehicle_vin, id]
        );
        if (existingVin.length > 0) {
          throw new Error("Vehicle VIN already exists");
        }
      }

      await db.query(
        "UPDATE vehicle SET customer_id = ?, vehicle_vin = ?, vehicle_make = ?, vehicle_model = ?, vehicle_year = ?, vehicle_active_status = ? WHERE vehicle_id = ?",
        [
          customer_id,
          vehicle_vin,
          vehicle_make,
          vehicle_model,
          vehicle_year,
          vehicle_active_status !== undefined ? vehicle_active_status : 1,
          id,
        ]
      );
      return await this.getVehicleById(id);
    } catch (err) {
      logger.error("Database error updating vehicle:", err);
      throw err;
    }
  },

  async deleteVehicle(id) {
    try {
      const [result] = await db.query(
        "UPDATE vehicle SET vehicle_active_status = 0 WHERE vehicle_id = ?",
        [id]
      );
      return result.affectedRows > 0;
    } catch (err) {
      logger.error("Database error deleting vehicle:", err);
      throw err;
    }
  },
};

module.exports = vehicleService;
