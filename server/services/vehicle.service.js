const db = require("../config/db.config");
const logger = require("../utils/logger");

const vehicleService = {
  async getAllVehicles() {
    try {
      const [rows] = await db.query(`
        SELECT v.vehicle_id, v.customer_id, v.vehicle_serial_number, v.vehicle_make, v.vehicle_model, v.vehicle_year,
               v.vehicle_type, v.vehicle_mileage, v.vehicle_tag, v.vehicle_color, c.customer_email
        FROM customer_vehicle_info v
        JOIN customer_identifier c ON v.customer_id = c.customer_id
        JOIN customer_info ci ON c.customer_id = ci.customer_id
        WHERE ci.customer_active_status = 1
      `);
      return rows;
    } catch (err) {
      logger.error("Database error fetching vehicles:", err);
      throw err;
    }
  },

  async createVehicle({
    customer_id,
    vehicle_serial_number,
    vehicle_make,
    vehicle_model,
    vehicle_year,
    vehicle_type,
    vehicle_mileage,
    vehicle_tag,
    vehicle_color,
  }) {
    const connection = await db.getConnection();
    try {
      await connection.beginTransaction();

      // Validate customer_id
      const [customer] = await connection.query(
        `SELECT ci.customer_id 
         FROM customer_identifier ci
         JOIN customer_info cinfo ON ci.customer_id = cinfo.customer_id
         WHERE ci.customer_id = ? AND cinfo.customer_active_status = 1`,
        [customer_id]
      );
      if (customer.length === 0) {
        throw new Error("Invalid customer_id");
      }

      // Validate unique serial number and tag
      const [existingSerial] = await connection.query(
        "SELECT vehicle_id FROM customer_vehicle_info WHERE vehicle_serial_number = ?",
        [vehicle_serial_number]
      );
      if (existingSerial.length > 0) {
        throw new Error("Vehicle serial number already exists");
      }
      const [existingTag] = await connection.query(
        "SELECT vehicle_id FROM customer_vehicle_info WHERE vehicle_tag = ?",
        [vehicle_tag]
      );
      if (existingTag.length > 0) {
        throw new Error("Vehicle tag already exists");
      }

      const [result] = await connection.query(
        "INSERT INTO customer_vehicle_info (customer_id, vehicle_serial_number, vehicle_make, vehicle_model, vehicle_year, vehicle_type, vehicle_mileage, vehicle_tag, vehicle_color) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)",
        [
          customer_id,
          vehicle_serial_number,
          vehicle_make,
          vehicle_model,
          vehicle_year,
          vehicle_type,
          vehicle_mileage,
          vehicle_tag,
          vehicle_color,
        ]
      );
      const vehicleId = result.insertId;

      await connection.commit();
      return await this.getVehicleById(vehicleId);
    } catch (err) {
      await connection.rollback();
      logger.error("Database error creating vehicle:", err);
      throw err;
    } finally {
      connection.release();
    }
  },

  async getVehicleById(id) {
    try {
      const [rows] = await db.query(
        `
        SELECT v.vehicle_id, v.customer_id, v.vehicle_serial_number, v.vehicle_make, v.vehicle_model, v.vehicle_year,
               v.vehicle_type, v.vehicle_mileage, v.vehicle_tag, v.vehicle_color, c.customer_email
        FROM customer_vehicle_info v
        JOIN customer_identifier c ON v.customer_id = c.customer_id
        JOIN customer_info ci ON c.customer_id = ci.customer_id
        WHERE v.vehicle_id = ? AND ci.customer_active_status = 1
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
      vehicle_serial_number,
      vehicle_make,
      vehicle_model,
      vehicle_year,
      vehicle_type,
      vehicle_mileage,
      vehicle_tag,
      vehicle_color,
    }
  ) {
    const connection = await db.getConnection();
    try {
      await connection.beginTransaction();

      // Validate customer_id (if provided)
      if (customer_id) {
        const [customer] = await connection.query(
          `SELECT ci.customer_id 
           FROM customer_identifier ci
           JOIN customer_info cinfo ON ci.customer_id = cinfo.customer_id
           WHERE ci.customer_id = ? AND cinfo.customer_active_status = 1`,
          [customer_id]
        );
        if (customer.length === 0) {
          throw new Error("Invalid customer_id");
        }
      }

      // Validate unique serial number and tag (if updated)
      if (vehicle_serial_number) {
        const [existingSerial] = await connection.query(
          "SELECT vehicle_id FROM customer_vehicle_info WHERE vehicle_serial_number = ? AND vehicle_id != ?",
          [vehicle_serial_number, id]
        );
        if (existingSerial.length > 0) {
          throw new Error("Vehicle serial number already exists");
        }
      }
      if (vehicle_tag) {
        const [existingTag] = await connection.query(
          "SELECT vehicle_id FROM customer_vehicle_info WHERE vehicle_tag = ? AND vehicle_id != ?",
          [vehicle_tag, id]
        );
        if (existingTag.length > 0) {
          throw new Error("Vehicle tag already exists");
        }
      }

      await connection.query(
        "UPDATE customer_vehicle_info SET customer_id = COALESCE(?, customer_id), vehicle_serial_number = COALESCE(?, vehicle_serial_number), vehicle_make = COALESCE(?, vehicle_make), vehicle_model = COALESCE(?, vehicle_model), vehicle_year = COALESCE(?, vehicle_year), vehicle_type = COALESCE(?, vehicle_type), vehicle_mileage = COALESCE(?, vehicle_mileage), vehicle_tag = COALESCE(?, vehicle_tag), vehicle_color = COALESCE(?, vehicle_color) WHERE vehicle_id = ?",
        [
          customer_id,
          vehicle_serial_number,
          vehicle_make,
          vehicle_model,
          vehicle_year,
          vehicle_type,
          vehicle_mileage,
          vehicle_tag,
          vehicle_color,
          id,
        ]
      );

      await connection.commit();
      return await this.getVehicleById(id);
    } catch (err) {
      await connection.rollback();
      logger.error("Database error updating vehicle:", err);
      throw err;
    } finally {
      connection.release();
    }
  },

  async deleteVehicle(id) {
    const connection = await db.getConnection();
    try {
      await connection.beginTransaction();
      const [result] = await connection.query(
        "DELETE FROM customer_vehicle_info WHERE vehicle_id = ?",
        [id]
      );
      await connection.commit();
      return result.affectedRows > 0;
    } catch (err) {
      await connection.rollback();
      logger.error("Database error deleting vehicle:", err);
      throw err;
    } finally {
      connection.release();
    }
  },
};

module.exports = vehicleService;
