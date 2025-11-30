const express = require("express");
const router = express.Router();
const alertController = require("../controllers/alertController");

router.post("/", alertController.createAlert);
router.get("/", alertController.getAlerts);
router.get("/unread-count", alertController.getUnreadCount);
router.put("/mark-read", alertController.markAllAsRead);

module.exports = router;
