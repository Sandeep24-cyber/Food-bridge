const express = require("express");
const router = express.Router();
const alertController = require("../controllers/alertController");
const db = require("../config/db");

// ===== Create Alert =====
router.post("/", alertController.createAlert);

// ===== Get Alerts =====
router.get("/", alertController.getAlerts);

// ===== Get Unread Count =====
router.get("/unread-count", alertController.getUnreadCount);

// ===== Mark All as Read =====
router.put("/mark-read", alertController.markAllAsRead);

// ===== Clear All Alerts =====
router.delete("/clear", async (req, res) => {
  try {
    await db.query("DELETE FROM alerts");
    res.json({ message: "All alerts cleared successfully." });
  } catch (err) {
    console.error("❌ Error clearing alerts:", err);
    res.status(500).json({ message: "Server error while clearing alerts." });
  }
});

module.exports = router;
