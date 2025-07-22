const orderService = require("../services/order.service");
const { generateHash } = require("../utils/hash");
const logger = require("../utils/logger");

const orderController = {
  // Get all orders
  async getAllOrders(req, res) {
    try {
      const orders = await orderService.getAllOrders();
      res.status(200).json(orders);
    } catch (err) {
      logger.error("Error fetching orders:", err.message);
      res.status(500).json({ error: "Failed to fetch orders" });
    }
  },

  // Create a new order
  async createOrder(req, res) {
    try {
      const { customer_id, vehicle_id, services } = req.body; // services: [{ service_id, quantity }]
      if (
        !customer_id ||
        !vehicle_id ||
        !services ||
        !Array.isArray(services) ||
        services.length === 0
      ) {
        return res
          .status(400)
          .json({ error: "Missing or invalid required fields" });
      }
      const order_number = `ORD-${Date.now()}`;
      const order_hash = await generateHash(
        `${customer_id}${vehicle_id}${order_number}`
      );
      const orderData = {
        customer_id,
        vehicle_id,
        order_number,
        order_hash,
        services,
      };
      const newOrder = await orderService.createOrder(orderData);
      res.status(201).json(newOrder);
    } catch (err) {
      logger.error("Error creating order:", err.message);
      res.status(500).json({ error: "Failed to create order" });
    }
  },

  // Get order by ID or hash
  async getOrderByIdOrHash(req, res) {
    try {
      const { id } = req.params;
      const order_hash = req.query.order_hash; // Optional query param for public access
      const isAuthenticated = req.user; // Check if JWT is provided via authMiddleware

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

  // Update order
  async updateOrder(req, res) {
    try {
      const { id } = req.params;
      const { order_status, order_total, services } = req.body; // services: [{ service_id, quantity }]
      const orderData = { order_status, order_total, services };
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

  // Delete order
  async deleteOrder(req, res) {
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
