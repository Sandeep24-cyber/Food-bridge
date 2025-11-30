const db = require("../config/db");

// ===== Get User by ID =====
exports.getUserById = async (req, res) => {
  try {
    const { id } = req.params;

    const [rows] = await db.query(
      "SELECT id, name, email, role, phone, address, profile_image FROM users WHERE id = ?",
      [id]
    );

    if (rows.length === 0) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({
      id: rows[0].id,
      name: rows[0].name,
      email: rows[0].email,
      role: rows[0].role,
      phone: rows[0].phone,
      address: rows[0].address,
      profileImage: rows[0].profile_image // ✅ match frontend
    });
  } catch (err) {
    console.error("Get User Error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// ===== Update Profile =====
exports.updateUser = async (req, res) => {
  try {
    const { id, phone, address, profileImage } = req.body;

    await db.query(
      "UPDATE users SET phone = ?, address = ?, profile_image = ? WHERE id = ?",
      [phone, address, profileImage, id]
    );

    res.json({ message: "✅ Profile updated successfully" });
  } catch (err) {
    console.error("Profile Update Error:", err);
    res.status(500).json({ message: "Server error" });
  }
};
