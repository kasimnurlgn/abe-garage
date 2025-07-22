const installService = require("../services/install.service");
const logger = require("../utils/logger");

const installController = {
  async initializeDatabase(req, res) {
    try {
      await installService.initializeDatabase();
      res
        .status(200)
        .json({ message: "Database initialized and seeded successfully" });
    } catch (err) {
      logger.error("Error initializing database:", err.message);
      res.status(500).json({ error: "Failed to initialize database" });
    }
  },
};

module.exports = installController;
