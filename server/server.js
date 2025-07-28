const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const helmet = require("helmet");
const compression = require("compression");
const rateLimit = require("express-rate-limit");
const logger = require("./utils/logger");

dotenv.config();

const db = require("./config/db.config");

const errorHandler = require("./middlewares/errorHandler.middleware");

// Import routes
const indexRoutes = require("./routes/index");

const app = express();

// My Security middlewares
app.use(helmet());
app.use(compression()); 
app.use(cors());
app.use(express.json()); 
app.use(express.urlencoded({ extended: true })); 

// Rate limiting for public routes
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit to 100 requests per window
  message: "Too many requests from this IP, please try again later.",
});
app.use("/api/login", limiter); 

// Request logging
app.use((req, res, next) => {
  logger.info(`${req.method} ${req.url}`);
  next();
});

// Routes
app.use("/api", indexRoutes); 

// Health check endpoint
app.get("/health", async (req, res) => {
  try {
    await db.query("SELECT 1");
    res.status(200).json({ status: "OK", database: "Connected" });
  } catch (err) {
    logger.error("Health check failed:", err);
    res.status(500).json({ status: "Error", database: "Disconnected" });
  }
});

// Handle unmatched routes, I call it 404 handler
app.use((req, res) => {
  res.status(404).json({ error: "Route not found" });
});

// Error handling middleware
app.use(errorHandler);



// Test database connection on startup
db.query("SELECT 1")
  .then(() => logger.info("Database connected successfully"))
  .catch((err) => logger.error("Database connection failed:", err));

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  logger.info(`Server running on port ${PORT}`);
});
