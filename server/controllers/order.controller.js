const orderService = require("../services/order.service");
const logger = require("../utils/logger");
const crypto = require("crypto");

const orderController = {
  async getAllOrders(req, res) {
    logger.info("Entering getAllOrders");
    try {
      const orders = await orderService.getAllOrders();
      res.status(200).json(orders);
    } catch (err) {
      logger.error("Error fetching orders:", err.message);
      res.status(500).json({ error: "Failed to fetch orders" });
    }
  },

  async createOrder(req, res) {
    logger.info("Entering createOrder", { body: req.body });
    try {
      const {
        customer_id,
        employee_id,
        order_hash: provided_order_hash,
        order_total_price,
        order_estimated_completion_date,
        order_additional_requests,
        services,
      } = req.body;
      if (
        !customer_id ||
        !employee_id ||
        !order_estimated_completion_date ||
        !services ||
        !Array.isArray(services) ||
        services.length === 0 ||
        services.some((s) => !s.service_id)
      ) {
        return res
          .status(400)
          .json({ error: "Missing or invalid required fields" });
      }
      // Generate unique order_hash
      const order_hash =
        provided_order_hash || crypto.randomBytes(16).toString("hex");
      const orderData = {
        customer_id,
        employee_id,
        order_hash,
        order_total_price,
        order_estimated_completion_date,
        order_additional_requests,
        services,
      };
      const newOrder = await orderService.createOrder(orderData);
      res.status(201).json(newOrder);
    } catch (err) {
      logger.error("Error creating order:", err.message);
      if (
        err.message.includes("Duplicate entry") &&
        err.message.includes("order_hash")
      ) {
        return res.status(400).json({
          error:
            "Order hash already exists, please provide a unique order_hash",
        });
      }
      res.status(500).json({ error: err.message || "Failed to create order" });
    }
  },

  async getOrderByIdOrHash(req, res) {
    logger.info("Entering getOrderByIdOrHash", {
      params: req.params,
      isAuthenticated: !!req.user,
    });
    try {
      const { id, order_hash } = req.params;
      const isAuthenticated = !!req.user;

      const order = await orderService.getOrderByIdOrHash(
        id,
        order_hash,
        isAuthenticated
      );
      if (!order) {
        return res.status(404).json({ error: "Order not found" });
      }
      res.status(200).json(order);
    } catch (err) {
      logger.error("Error fetching order:", err.message);
      res.status(500).json({ error: "Failed to fetch order" });
    }
  },

  async updateOrder(req, res) {
    logger.info("Entering updateOrder", { params: req.params });
    try {
      const { id } = req.params;
      const {
        order_status,
        order_total_price,
        order_estimated_completion_date,
        order_additional_requests,
        services,
      } = req.body;
      const orderData = {
        order_status,
        order_total_price,
        order_estimated_completion_date,
        order_additional_requests,
        services,
      };
      const updatedOrder = await orderService.updateOrder(id, orderData);
      if (!updatedOrder) {
        return res.status(404).json({ error: "Order not found" });
      }
      res.status(200).json(updatedOrder);
    } catch (err) {
      logger.error("Error updating order:", err.message);
      res.status(500).json({ error: "Failed to update order" });
    }
  },

  async deleteOrder(req, res) {
    logger.info("Entering deleteOrder", { params: req.params });
    try {
      const { id } = req.params;
      const deleted = await orderService.deleteOrder(id);
      if (!deleted) {
        return res.status(404).json({ error: "Order not found" });
      }
      res.status(204).send();
    } catch (err) {
      logger.error("Error deleting order:", err.message);
      res.status(500).json({ error: "Failed to delete order" });
    }
  },
};

module.exports = orderController;
