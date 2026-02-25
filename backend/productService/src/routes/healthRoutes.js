const express = require("express");
const router = express.Router();
const { getHealth, getInfo} = require("../controllers/healthController");

// GET /api/health
router.get("/", getHealth);

// GET /api/health/info
router.get("/info", getInfo);

module.exports = router;
