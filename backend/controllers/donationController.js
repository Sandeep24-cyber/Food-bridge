const db = require("../config/db");

// ======================================================
// 📦 CREATE DONATION (POST /api/donations)
// ======================================================
exports.createDonation = async (req, res) => {
  try {
    const { restaurant, user_id, foodType, quantity, expiry, location, latitude, longitude } = req.body;

    // ✅ Validate
    if (!restaurant || !user_id || !foodType || !quantity || !expiry || !location || !latitude || !longitude) {
      return res.status(400).json({ message: "All fields are required." });
    }

    // ✅ Get next donation number for this restaurant user
    const [countRows] = await db.query(
      "SELECT COUNT(*) AS total FROM donations WHERE user_id = ?",
      [user_id]
    );
    const nextDonationNumber = (countRows[0]?.total || 0) + 1;

    // ✅ Insert donation with donation_number
    const sql = `
      INSERT INTO donations
      (restaurant, user_id, food_type, quantity, expiry_date, location, latitude, longitude, donation_number)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    await db.query(sql, [
      restaurant,
      user_id,
      foodType,
      quantity,
      expiry,
      location,
      latitude,
      longitude,
      nextDonationNumber
    ]);

    const alertMsg = `${restaurant} added donation #${nextDonationNumber}: ${quantity} ${foodType}.`;
    await db.query("INSERT INTO alerts (message, type) VALUES (?, ?)", [alertMsg, "info"]);

    console.log(
      `✅ Donation #${nextDonationNumber} created by restaurant '${restaurant}' (user_id: ${user_id})`
    );

    res.status(201).json({
      message: `✅ Donation #${nextDonationNumber} added successfully!`,
      donation_number: nextDonationNumber
    });
  } catch (err) {
    console.error("Add Donation Error:", err);
    res.status(500).json({ message: "Server error while adding donation." });
  }
};
// ======================================================
// 📋 GET ALL DONATIONS (GET /api/donations)
// ======================================================
exports.getAllDonations = async (req, res) => {
  try {
    const [rows] = await db.query("SELECT * FROM donations ORDER BY id DESC");

    if (rows.length === 0) {
      return res.status(200).json([]);
    }

    res.status(200).json(rows);
  } catch (err) {
    console.error("Fetch Donations Error:", err);
    res.status(500).json({ message: "Server error while fetching donations." });
  }
};

// ======================================================
// 📍 GET SINGLE DONATION BY ID (GET /api/donations/:id)
// ======================================================
exports.getDonationById = async (req, res) => {
  try {
    const { id } = req.params;

    const [rows] = await db.query("SELECT * FROM donations WHERE id = ?", [id]);

    if (rows.length === 0) {
      return res.status(404).json({ message: "Donation not found." });
    }

    res.status(200).json(rows[0]);
  } catch (err) {
    console.error("Get Donation Error:", err);
    res.status(500).json({ message: "Server error while fetching donation." });
  }
};
// ===== Update Donation Status =====
exports.updateDonationStatus = async (req, res) => {
  try {
    const { id, status } = req.body;

    if (!id || !status) {
      return res.status(400).json({ message: "Donation ID and status are required." });
    }

    const [result] = await db.query("UPDATE donations SET status = ? WHERE id = ?", [status, id]);
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Donation not found." });
    }

    // ✅ Add relevant alert based on new status
    let alertMsg = "";
    let alertType = "info";

    if (status === "matched") {
      alertMsg = "A user has accepted a donation. View details.";
      alertType = "success";
    } else if (status === "completed") {
      alertMsg = "A donation has been successfully collected.";
      alertType = "success";
    }

    if (alertMsg) {
      await db.query("INSERT INTO alerts (message, type) VALUES (?, ?)", [alertMsg, alertType]);
    }

    res.json({ message: `Donation status updated to '${status}' and alert added.` });
  } catch (err) {
    console.error("Update Donation Status Error:", err);
    res.status(500).json({ message: "Server error updating donation status." });
  }
};
// ✅ Accept donation by NGO
exports.acceptDonation = async (req, res) => {
  try {
    const donationId = req.params.id;
    const { accepted_by } = req.body;

    if (!donationId || !accepted_by) {
      return res.status(400).json({ message: "Donation ID and NGO name are required." });
    }

    // ✅ Check if donation exists
    const [existing] = await db.query("SELECT * FROM donations WHERE id = ?", [donationId]);
    if (existing.length === 0) {
      return res.status(404).json({ message: "Donation not found." });
    }

    // ✅ Update status and accepted_by
    const [result] = await db.query(
     "UPDATE donations SET status = ?, accepted_by = ? WHERE id = ?",
  ["matched", accepted_by, donationId]
    );

    if (result.affectedRows === 0) {
      return res.status(400).json({ message: "Failed to accept donation." });
    }

    // ✅ Log alert
    await db.query(
      "INSERT INTO alerts (message, type, is_read) VALUES (?, ?, ?)",
      [`${accepted_by} accepted a donation from ${existing[0].restaurant}.`, "success", false]
    );

    res.json({ message: "Donation accepted successfully." });
  } catch (err) {
  console.error("❌ Error accepting donation:", err.sqlMessage || err.message);
  res.status(500).json({
    message: "Server error while accepting donation.",
    error: err.sqlMessage || err.message,
  });
}

  
};
