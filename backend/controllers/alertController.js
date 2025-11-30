const db = require("../config/db");

// ===== Create Alert =====
exports.createAlert = async (req, res) => {
  try {
    const { message, type } = req.body;

    if (!message) {
      return res.status(400).json({ message: "Alert message is required." });
    }

    // 👇 Always insert as unread
    await db.query(
      "INSERT INTO alerts (message, type, is_read) VALUES (?, ?, ?)",
      [message, type || "info", 0]
    );

    res.status(201).json({ message: "Alert created successfully." });
  } catch (err) {
    console.error("Create Alert Error:", err);
    res.status(500).json({ message: "Server error while creating alert." });
  }
};

// ===== Get All Alerts =====
exports.getAlerts = async (req, res) => {
  try {
    const [rows] = await db.query(
      "SELECT * FROM alerts ORDER BY created_at DESC LIMIT 30"
    );
    res.json(rows);
  } catch (err) {
    console.error("Get Alerts Error:", err);
    res.status(500).json({ message: "Server error while fetching alerts." });
  }
};

// ===== Get Unread Count =====
exports.getUnreadCount = async (req, res) => {
  try {
    const [rows] = await db.query("SELECT COUNT(*) AS count FROM alerts WHERE is_read = 0");
    res.json(rows[0]);
  } catch (err) {
    console.error("Get Unread Alerts Count Error:", err);
    res.status(500).json({ message: "Server error while checking alerts." });
  }
};

// ===== Mark All as Read =====
exports.markAllAsRead = async (req, res) => {
  try {
    await db.query("UPDATE alerts SET is_read = TRUE WHERE is_read = FALSE");
    res.json({ message: "All alerts marked as read." });
  } catch (err) {
    console.error("Mark Alerts Read Error:", err);
    res.status(500).json({ message: "Server error while updating alerts." });
  }
};
