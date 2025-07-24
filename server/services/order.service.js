const db = require("../config/db.config");
const logger = require("../utils/logger");

const orderService = {
  async getAllOrders() {
    try {
      const [rows] = await db.query(`
        SELECT o.order_id, o.order_hash, o.order_date, o.order_status,
               oi.order_total_price, oi.order_estimated_completion_date, oi.order_additional_requests,
               c.customer_email, e.employee_email,
               v.vehicle_serial_number, v.vehicle_make, v.vehicle_model,
               os.service_id, os.service_completed, cs.service_name
        FROM orders o
        JOIN customer_identifier c ON o.customer_id = c.customer_id
        JOIN customer_info ci ON c.customer_id = ci.customer_id
        JOIN employee e ON o.employee_id = e.employee_id
        LEFT JOIN order_info oi ON o.order_id = oi.order_id
        LEFT JOIN order_services os ON o.order_id = os.order_id
        LEFT JOIN common_services cs ON os.service_id = cs.service_id
        LEFT JOIN customer_vehicle_info v ON c.customer_id = v.customer_id
        WHERE o.order_status != 'deleted' AND ci.customer_active_status = 1
      `);
      return rows.reduce((acc, row) => {
        const order = acc.find((o) => o.order_id === row.order_id);
        if (!order) {
          acc.push({
            order_id: row.order_id,
            order_hash: row.order_hash,
            order_date: row.order_date,
            order_status: row.order_status,
            order_total_price: row.order_total_price,
            order_estimated_completion_date:
              row.order_estimated_completion_date,
            order_additional_requests: row.order_additional_requests,
            customer_email: row.customer_email,
            employee_email: row.employee_email,
            vehicle: row.vehicle_serial_number
              ? {
                  vehicle_serial_number: row.vehicle_serial_number,
                  vehicle_make: row.vehicle_make,
                  vehicle_model: row.vehicle_model,
                }
              : null,
            services: row.service_id
              ? [
                  {
                    service_id: row.service_id,
                    service_name: row.service_name,
                    service_completed: row.service_completed,
                  },
                ]
              : [],
          });
        } else if (row.service_id) {
          order.services.push({
            service_id: row.service_id,
            service_name: row.service_name,
            service_completed: row.service_completed,
          });
        }
        return acc;
      }, []);
    } catch (err) {
      logger.error("Database error fetching orders:", err);
      throw err;
    }
  },

  async createOrder({
    customer_id,
    employee_id,
    order_hash,
    order_total_price,
    order_estimated_completion_date,
    order_additional_requests,
    services,
  }) {
    const connection = await db.getConnection();
    try {
      await connection.beginTransaction();

      // Validate customer
      const [customer] = await connection.query(
        `SELECT ci.customer_id 
         FROM customer_identifier ci
         JOIN customer_info cinfo ON ci.customer_id = cinfo.customer_id
         WHERE ci.customer_id = ? AND cinfo.customer_active_status = 1`,
        [customer_id]
      );
      if (customer.length === 0) throw new Error("Invalid customer_id");

      // Validate employee
      const [employee] = await connection.query(
        "SELECT employee_id FROM employee WHERE employee_id = ? AND employee_active_status = 1",
        [employee_id]
      );
      if (employee.length === 0) throw new Error("Invalid employee_id");

      // Validate services
      if (!services || !Array.isArray(services) || services.length === 0) {
        throw new Error("At least one service is required");
      }
      for (const { service_id } of services) {
        const [service] = await connection.query(
          "SELECT service_id FROM common_services WHERE service_id = ? AND service_active_status = 1",
          [service_id]
        );
        if (service.length === 0)
          throw new Error(`Invalid service_id: ${service_id}`);
      }

      // Insert order
      const [orderResult] = await connection.query(
        "INSERT INTO orders (customer_id, employee_id, order_date, order_hash, order_status) VALUES (?, ?, NOW(), ?, ?)",
        [customer_id, employee_id, order_hash, "pending"]
      );
      const orderId = orderResult.insertId;

      // Insert order_info
      await connection.query(
        "INSERT INTO order_info (order_id, order_total_price, order_estimated_completion_date, order_additional_requests) VALUES (?, ?, ?, ?)",
        [
          orderId,
          order_total_price || 0,
          order_estimated_completion_date || new Date(),
          order_additional_requests || null,
        ]
      );

      // Insert order services
      for (const { service_id, service_completed } of services) {
        await connection.query(
          "INSERT INTO order_services (order_id, service_id, service_completed) VALUES (?, ?, ?)",
          [orderId, service_id, service_completed || 0]
        );
      }

      await connection.commit();
      return await this.getOrderByIdOrHash(orderId, null, true);
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
        SELECT o.order_id, o.order_hash, o.order_date, o.order_status,
               oi.order_total_price, oi.order_estimated_completion_date, oi.order_additional_requests,
               c.customer_email, e.employee_email,
               v.vehicle_serial_number, v.vehicle_make, v.vehicle_model,
               os.service_id, os.service_completed, cs.service_name
        FROM orders o
        JOIN customer_identifier c ON o.customer_id = c.customer_id
        JOIN customer_info ci ON c.customer_id = ci.customer_id
        JOIN employee e ON o.employee_id = e.employee_id
        LEFT JOIN order_info oi ON o.order_id = oi.order_id
        LEFT JOIN order_services os ON o.order_id = os.order_id
        LEFT JOIN common_services cs ON os.service_id = cs.service_id
        LEFT JOIN customer_vehicle_info v ON c.customer_id = v.customer_id
        WHERE o.order_status != 'deleted' AND ci.customer_active_status = 1
      `;
      const params = [];

      if (isAuthenticated) {
        query += " AND o.order_id = ?";
        params.push(id);
      } else if (order_hash) {
        query += " AND o.order_hash = ?";
        params.push(order_hash);
      } else {
        throw new Error("Order hash required for public access");
      }

      const [rows] = await db.query(query, params);
      if (rows.length === 0) return null;

      const order = {
        order_id: rows[0].order_id,
        order_hash: rows[0].order_hash,
        order_date: rows[0].order_date,
        order_status: rows[0].order_status,
        order_total_price: rows[0].order_total_price,
        order_estimated_completion_date:
          rows[0].order_estimated_completion_date,
        order_additional_requests: rows[0].order_additional_requests,
        customer_email: rows[0].customer_email,
        employee_email: rows[0].employee_email,
        vehicle: rows[0].vehicle_serial_number
          ? {
              vehicle_serial_number: rows[0].vehicle_serial_number,
              vehicle_make: rows[0].vehicle_make,
              vehicle_model: rows[0].vehicle_model,
            }
          : null,
        services: rows
          .filter((row) => row.service_id)
          .map((row) => ({
            service_id: row.service_id,
            service_name: row.service_name,
            service_completed: row.service_completed,
          })),
      };
      return order;
    } catch (err) {
      logger.error("Database error fetching order:", err);
      throw err;
    }
  },

  async updateOrder(
    id,
    {
      order_status,
      order_total_price,
      order_estimated_completion_date,
      order_additional_requests,
      services,
    }
  ) {
    const connection = await db.getConnection();
    try {
      await connection.beginTransaction();

      const [order] = await connection.query(
        'SELECT order_id FROM orders WHERE order_id = ? AND order_status != "deleted"',
        [id]
      );
      if (order.length === 0) return null;

      await connection.query(
        "UPDATE orders SET order_status = ? WHERE order_id = ?",
        [order_status || "pending", id]
      );

      await connection.query(
        "UPDATE order_info SET order_total_price = ?, order_estimated_completion_date = ?, order_additional_requests = ? WHERE order_id = ?",
        [
          order_total_price || 0,
          order_estimated_completion_date || new Date(),
          order_additional_requests || null,
          id,
        ]
      );

      if (services && Array.isArray(services)) {
        await connection.query(
          "DELETE FROM order_services WHERE order_id = ?",
          [id]
        );

        for (const { service_id, service_completed } of services) {
          const [service] = await connection.query(
            "SELECT service_id FROM common_services WHERE service_id = ? AND service_active_status = 1",
            [service_id]
          );
          if (service.length === 0)
            throw new Error(`Invalid service_id: ${service_id}`);

          await connection.query(
            "INSERT INTO order_services (order_id, service_id, service_completed) VALUES (?, ?, ?)",
            [id, service_id, service_completed || 0]
          );
        }
      }

      await connection.commit();
      return await this.getOrderByIdOrHash(id, null, true);
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
        'UPDATE orders SET order_status = "deleted" WHERE order_id = ?',
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
