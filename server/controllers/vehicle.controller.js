const vehicleService = require("../services/vehicle.service");
const logger = require("../utils/logger");

const vehicleController = {
  async getAllVehicles(req, res) {
    try {
      const vehicles = await vehicleService.getAllVehicles();
      res.status(200).json(vehicles);
    } catch (err) {
      logger.error("Error fetching vehicles:", err.message);
      res.status(500).json({ error: "Failed to fetch vehicles" });
    }
  },

  async createVehicle(req, res) {
    try {
      const {
        customer_id,
        vehicle_serial_number,
        vehicle_make,
        vehicle_model,
        vehicle_year,
        vehicle_type,
        vehicle_mileage,
        vehicle_tag,
        vehicle_color,
      } = req.body;
      if (
        !customer_id ||
        !vehicle_serial_number ||
        !vehicle_make ||
        !vehicle_model ||
        !vehicle_year ||
        !vehicle_type ||
        !vehicle_mileage ||
        !vehicle_tag ||
        !vehicle_color
      ) {
        return res.status(400).json({ error: "Missing required fields" });
      }
      const vehicleData = {
        customer_id,
        vehicle_serial_number,
        vehicle_make,
        vehicle_model,
        vehicle_year,
        vehicle_type,
        vehicle_mileage,
        vehicle_tag,
        vehicle_color,
      };
      const newVehicle = await vehicleService.createVehicle(vehicleData);
      res.status(201).json(newVehicle);
    } catch (err) {
      logger.error("Error creating vehicle:", err.message);
      res.status(500).json({ error: "Failed to create vehicle" });
    }
  },

  async getVehicleById(req, res) {
    try {
      const { id } = req.params;
      const vehicle = await vehicleService.getVehicleById(id);
      if (!vehicle) {
        return res.status(404).json({ error: "Vehicle not found" });
      }
      res.status(200).json(vehicle);
    } catch (err) {
      logger.error("Error fetching vehicle:", err.message);
      res.status(500).json({ error: "Failed to fetch vehicle" });
    }
  },

  async updateVehicle(req, res) {
    try {
      const { id } = req.params;
      const {
        customer_id,
        vehicle_serial_number,
        vehicle_make,
        vehicle_model,
        vehicle_year,
        vehicle_type,
        vehicle_mileage,
        vehicle_tag,
        vehicle_color,
      } = req.body;
      const vehicleData = {
        customer_id,
        vehicle_serial_number,
        vehicle_make,
        vehicle_model,
        vehicle_year,
        vehicle_type,
        vehicle_mileage,
        vehicle_tag,
        vehicle_color,
      };
      const updatedVehicle = await vehicleService.updateVehicle(
        id,
        vehicleData
      );
      if (!updatedVehicle) {
        return res.status(404).json({ error: "Vehicle not found" });
      }
      res.status(200).json(updatedVehicle);
    } catch (err) {
      logger.error("Error updating vehicle:", err.message);
      res.status(500).json({ error: "Failed to update vehicle" });
    }
  },

  async deleteVehicle(req, res) {
    try {
      const { id } = req.params;
      const deleted = await vehicleService.deleteVehicle(id);
      if (!deleted) {
        return res.status(404).json({ error: "Vehicle not found" });
      }
      res.status(204).send();
    } catch (err) {
      logger.error("Error deleting vehicle:", err.message);
      res.status(500).json({ error: "Failed to delete vehicle" });
    }
  },
};

module.exports = vehicleController;
