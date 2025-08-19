const customerService = require("../services/customer.service");
const { generateHash } = require("../utils/hash");
const logger = require("../utils/logger");

const customerController = {
  // Get all customers
  async getAllCustomers(req, res) {
    try {
      const customers = await customerService.getAllCustomers();
      res.status(200).json(customers);
    } catch (err) {
      logger.error("Error fetching customers:", err.message);
      res.status(500).json({ error: "Failed to fetch customers" });
    }
  },

  // Create a new customer
  async createCustomer(req, res) {
    try {
      const { email, phone_number, first_name, last_name } = req.body;
      if (!email || !phone_number || !first_name || !last_name) {
        return res.status(400).json({ error: "Missing required fields" });
      }
      const customer_hash = await generateHash(
        `${email}${phone_number}${Date.now()}`
      );
      const customerData = {
        email,
        phone_number,
        first_name,
        last_name,
        customer_hash,
      };
      const newCustomer = await customerService.createCustomer(customerData);
      res.status(201).json(newCustomer);
    } catch (err) {
      logger.error("Error creating customer:", err.message);
      res.status(500).json({ error: "Failed to create customer" });
    }
  },

  // Get customer by ID
  async getCustomerById(req, res) {
    try {
      const { id } = req.params;
      const customer = await customerService.getCustomerById(id);
      if (!customer) {
        return res.status(404).json({ error: "Customer not found" });
      }
      res.status(200).json(customer);
    } catch (err) {
      logger.error("Error fetching customer:", err.message);
      res.status(500).json({ error: "Failed to fetch customer" });
    }
  },

  // Update customer
  async updateCustomer(req, res) {
    try {
      const { id } = req.params;
      const { email, phone_number, first_name, last_name, active_status } =
        req.body;
      const customerData = {
        email,
        phone_number,
        first_name,
        last_name,
        active_status,
      };
      const updatedCustomer = await customerService.updateCustomer(
        id,
        customerData
      );
      if (!updatedCustomer) {
        return res.status(404).json({ error: "Customer not found" });
      }
      res.status(200).json(updatedCustomer);
    } catch (err) {
      logger.error("Error updating customer:", err.message);
      res.status(500).json({ error: "Failed to update customer" });
    }
  },

  // cget customer by hash function.
  async getCustomerByHash(req, res) {
    try {
      const { customer_hash } = req.params;
      const customer = await customerService.getCustomerByHash(customer_hash);
      if (!customer) {
        return res.status(404).json({ error: "Customer not found" });
      }
      res.status(200).json(customer);
    } catch (err) {
      logger.error("Error fetching customer by hash:", err.message);
      res.status(500).json({ error: "Failed to fetch customer" });
    }
  },

  // Delete customer
  async deleteCustomer(req, res) {
    try {
      const { id } = req.params;
      const deleted = await customerService.deleteCustomer(id);
      if (!deleted) {
        return res.status(404).json({ error: "Customer not found" });
      }
      res.status(204).send();
    } catch (err) {
      logger.error("Error deleting customer:", err.message);
      res.status(500).json({ error: "Failed to delete customer" });
    }
  },
};

module.exports = customerController;
