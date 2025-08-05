// routes/auth.js
const express = require("express");
const router = express.Router();
const loginController = require("../controllers/login.controller");
const authMiddleware = require("../middleware/authMiddleware");

// Existing login route
router.post("/", loginController.login);

// New route to check authentication status
router.get("/check", authMiddleware, loginController.checkAuth);

module.exports = router;
