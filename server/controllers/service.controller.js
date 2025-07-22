const serviceService = require("../services/service.service");
const logger = require("../utils/logger");

const serviceController = {
  // Get all services
  async getAllServices(req, res) {
    try {
      const services = await serviceService.getAllServices();
      res.status(200).json(services);
    } catch (err) {
      logger.error("Error fetching services:", err.message);
      res.status(500).json({ error: "Failed to fetch services" });
    }
  },

  // Create a new service
  async createService(req, res) {
    try {
      const { service_name, service_description, service_price } = req.body;
      if (!service_name || !service_price) {
        return res
          .status(400)
          .json({ error: "Service name and price are required" });
      }
      const serviceData = {
        service_name,
        service_description: service_description || "",
        service_price,
        service_active_status: 1,
      };
      const newService = await serviceService.createService(serviceData);
      res.status(201).json(newService);
    } catch (err) {
      logger.error("Error creating service:", err.message);
      res.status(500).json({ error: "Failed to create service" });
    }
  },

  // Get service by ID
  async getServiceById(req, res) {
    try {
      const { id } = req.params;
      const service = await serviceService.getServiceById(id);
      if (!service) {
        return res.status(404).json({ error: "Service not found" });
      }
      res.status(200).json(service);
    } catch (err) {
      logger.error("Error fetching service:", err.message);
      res.status(500).json({ error: "Failed to fetch service" });
    }
  },

  // Update service
  async updateService(req, res) {
    try {
      const { id } = req.params;
      const {
        service_name,
        service_description,
        service_price,
        service_active_status,
      } = req.body;
      const serviceData = {
        service_name,
        service_description,
        service_price,
        service_active_status,
      };
      const updatedService = await serviceService.updateService(
        id,
        serviceData
      );
      if (!updatedService) {
        return res.status(404).json({ error: "Service not found" });
      }
      res.status(200).json(updatedService);
    } catch (err) {
      logger.error("Error updating service:", err.message);
      res.status(500).json({ error: "Failed to update service" });
    }
  },

  // Delete service
  async deleteService(req, res) {
    try {
      const { id } = req.params;
      const deleted = await serviceService.deleteService(id);
      if (!deleted) {
        return res.status(404).json({ error: "Service not found" });
      }
      res.status(204).send();
    } catch (err) {
      logger.error("Error deleting service:", err.message);
      res.status(500).json({ error: "Failed to delete service" });
    }
  },
};

module.exports = serviceController;
