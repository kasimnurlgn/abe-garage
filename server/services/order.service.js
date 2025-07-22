const db = require("../config/db.config");
const logger = require("../utils/logger");

const orderService = {
  async getAllOrders() {
    try {
      const [rows] = await db.query(`
        SELECT o.order_id, o.order_number, o.order_hash, o.order_date, o.order_total, o.order_status,
               c.customer_email, v.vehicle_vin, v.vehicle_make, v.vehicle_model
        FROM order o
        JOIN customer_identifier c ON o.customer_id = c.customer_id
        JOIN vehicle v ON o.vehicle_id = v.vehicle_id
        WHERE o.order_status != 'deleted'
      `);
      return rows;
    } catch (err) {
      logger.error("Database error fetching orders:", err);
      throw err;
    }
  },

  async createOrder({
    customer_id,
    vehicle_id,
    order_number,
    order_hash,
    services,
  }) {
    const connection = await db.getConnection();
    try {
      await connection.beginTransaction();

      // Validate customer and vehicle
      const [customer] = await connection.query(
        "SELECT customer_id FROM customer_identifier WHERE customer_id = ? AND customer_active_status = 1",
        [customer_id]
      );
      if (customer.length === 0) throw new Error("Invalid customer_id");
      const [vehicle] = await connection.query(
        "SELECT vehicle_id FROM vehicle WHERE vehicle_id = ? AND vehicle_active_status = 1",
        [vehicle_id]
      );
      if (vehicle.length === 0) throw new Error("Invalid vehicle_id");

      // Insert order
      const [orderResult] = await connection.query(
        "INSERT INTO order (customer_id, vehicle_id, order_number, order_date, order_status) VALUES (?, ?, ?, NOW(), ?)",
        [customer_id, vehicle_id, order_number, "pending"]
      );
      const orderId = orderResult.insertId;

      // Insert order_hash
      await connection.query(
        "INSERT INTO order_hash (order_id, order_hash) VALUES (?, ?)",
        [orderId, order_hash]
      );

      // Insert order items and services
      let order_total = 0;
      for (const { service_id, quantity } of services) {
        const [service] = await connection.query(
          "SELECT service_price FROM common_services WHERE service_id = ? AND service_active_status = 1",
          [service_id]
        );
        if (service.length === 0)
          throw new Error(`Invalid service_id: ${service_id}`);
        const price = service[0].service_price * quantity;
        order_total += price;

        await connection.query(
          "INSERT INTO order_item (order_id, service_id, order_item_quantity, order_item_price) VALUES (?, ?, ?, ?)",
          [orderId, service_id, quantity, price]
        );
        await connection.query(
          "INSERT INTO order_service (order_id, service_id) VALUES (?, ?)",
          [orderId, service_id]
        );
      }

      // Update order_total
      await connection.query(
        "UPDATE order SET order_total = ? WHERE order_id = ?",
        [order_total, orderId]
      );

      await connection.commit();
      return await this.getOrderByIdOrHash(orderId);
    } catch (err) {
      await connection.rollback();
      logger.error("Database error creating order:", err);
      throw err;
    } finally {
      connection.release();
    }
  },

  async getOrderByIdOrHash(id, order_hash, isAuthenticated) {
    try {
      let query = `
        SELECT o.order_id, o.order_number, o.order_hash, o.order_date, o.order_total, o.order_status,
               c.customer_email, v.vehicle_vin, v.vehicle_make, v.vehicle_model,
               oi.service_id, oi.order_item_quantity, oi.order_item_price,
               cs.service_name
        FROM order o
        JOIN customer_identifier c ON o.customer_id = c.customer_id
        JOIN vehicle v ON o.vehicle_id = v.vehicle_id
        LEFT JOIN order_item oi ON o.order_id = oi.order_id
        LEFT JOIN common_services cs ON oi.service_id = cs.service_id
        WHERE o.order_status != 'deleted'
      `;
      const params = [];

      if (isAuthenticated) {
        // Employees can access by order_id
        query += " AND o.order_id = ?";
        params.push(id);
      } else if (order_hash) {
        // Public access by order_hash
        query += " AND o.order_hash = ?";
        params.push(order_hash);
      } else {
        throw new Error("Order hash required for public access");
      }

      const [rows] = await db.query(query, params);
      if (rows.length === 0) return null;

      // Aggregate order items
      const order = {
        order_id: rows[0].order_id,
        order_number: rows[0].order_number,
        order_hash: rows[0].order_hash,
        order_date: rows[0].order_date,
        order_total: rows[0].order_total,
        order_status: rows[0].order_status,
        customer_email: rows[0].customer_email,
        vehicle: {
          vehicle_vin: rows[0].vehicle_vin,
          vehicle_make: rows[0].vehicle_make,
          vehicle_model: rows[0].vehicle_model,
        },
        services: rows
          .filter((row) => row.service_id)
          .map((row) => ({
            service_id: row.service_id,
            service_name: row.service_name,
            quantity: row.order_item_quantity,
            price: row.order_item_price,
          })),
      };
      return order;
    } catch (err) {
      logger.error("Database error fetching order:", err);
      throw err;
    }
  },

  async updateOrder(id, { order_status, order_total, services }) {
    const connection = await db.getConnection();
    try {
      await connection.beginTransaction();

      // Validate order
      const [order] = await connection.query(
        'SELECT order_id FROM order WHERE order_id = ? AND order_status != "deleted"',
        [id]
      );
      if (order.length === 0) return null;

      // Update order
      await connection.query(
        "UPDATE order SET order_status = ?, order_total = ? WHERE order_id = ?",
        [order_status || "pending", order_total || 0, id]
      );

      // Update services if provided
      if (services && Array.isArray(services)) {
        await connection.query("DELETE FROM order_item WHERE order_id = ?", [
          id,
        ]);
        await connection.query("DELETE FROM order_service WHERE order_id = ?", [
          id,
        ]);

        let new_total = 0;
        for (const { service_id, quantity } of services) {
          const [service] = await connection.query(
            "SELECT service_price FROM common_services WHERE service_id = ? AND service_active_status = 1",
            [service_id]
          );
          if (service.length === 0)
            throw new Error(`Invalid service_id: ${service_id}`);
          const price = service[0].service_price * quantity;
          new_total += price;

          await connection.query(
            "INSERT INTO order_item (order_id, service_id, order_item_quantity, order_item_price) VALUES (?, ?, ?, ?)",
            [id, service_id, quantity, price]
          );
          await connection.query(
            "INSERT INTO order_service (order_id, service_id) VALUES (?, ?)",
            [id, service_id]
          );
        }

        // Update order_total if services are updated
        await connection.query(
          "UPDATE order SET order_total = ? WHERE order_id = ?",
          [new_total, id]
        );
      }

      await connection.commit();
      return await this.getOrderByIdOrHash(id);
    } catch (err) {
      await connection.rollback();
      logger.error("Database error updating order:", err);
      throw err;
    } finally {
      connection.release();
    }
  },

  async deleteOrder(id) {
    try {
      const [result] = await db.query(
        'UPDATE order SET order_status = "deleted" WHERE order_id = ?',
        [id]
      );
      return result.affectedRows > 0;
    } catch (err) {
      logger.error("Database error deleting order:", err);
      throw err;
    }
  },
};

module.exports = orderService;
