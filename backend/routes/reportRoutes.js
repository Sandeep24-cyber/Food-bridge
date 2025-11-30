const express = require("express");
const router = express.Router();
const reportController = require("../controllers/reportController");

// Create report
router.post("/", reportController.createReport);

// Get reports
router.get("/", reportController.getReports);

module.exports = router;
