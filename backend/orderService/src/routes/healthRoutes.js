const express = require("express");
const router = express.Router();
const { getHealth, getInfo } = require("../controllers/healthController");

// GET /api/orders/health
router.get("/", getHealth);

// GET /api/orders/health/info
router.get("/info", getInfo);

module.exports = router;