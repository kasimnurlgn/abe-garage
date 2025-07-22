// import modules
const winston = require("winston");
const winstonCloudWatch = require("winston-cloudwatch");
const path = require("path");

// Create logs directory if it doesn't exist
const fs = require("fs");
const logsDir = path.join(__dirname, "../logs");
if (!fs.existsSync(logsDir)) {
  fs.mkdirSync(logsDir);
}

// Configure Winston logger
const logger = winston.createLogger({
  level: "info",
  format: winston.format.combine(
    winston.format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
    winston.format.printf(({ timestamp, level, message }) => {
      return `${timestamp} [${level.toUpperCase()}]: ${message}`;
    })
  ),
  transports: [
    new winston.transports.Console(),
    // File transport for development and debugging
    new winston.transports.File({
      filename: path.join(logsDir, "app.log"),
      maxsize: 5242880, // 5MB
      maxFiles: 5, // Keep up to 5 rotated log files
    }),
  ],
});

// Add CloudWatch transport in production
if (process.env.NODE_ENV === "production") {
  logger.add(
    new winstonCloudWatch({
      cloudWatchLogs: new (require("aws-sdk").CloudWatchLogs)(),
      logGroupName: "abes-garage-app",
      logStreamName: "backend",
      awsRegion: process.env.AWS_REGION,
      messageFormatter: ({ level, message }) =>
        `[${level.toUpperCase()}]: ${message}`,
    })
  );
}

module.exports = logger;
