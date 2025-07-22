const express = require("express");
const router = express.Router();
const loginController = require("../controllers/login.controller");

// POST /api/login - Authenticate employee and return JWT
router.post("/", loginController.login);

module.exports = router;
