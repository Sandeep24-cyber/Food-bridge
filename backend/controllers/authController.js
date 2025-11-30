const db = require("../config/db");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

// REGISTER
exports.register = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    // check if email already exists
    const [userExists] = await db.query("SELECT * FROM users WHERE email = ?", [email]);
    if (userExists.length > 0) {
      return res.status(400).json({ message: "Email already registered" });
    }

    // hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // insert into DB
    const [result] = await db.query(
      "INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)",
      [name, email, hashedPassword, role]
    );

    res.status(201).json({
      message: "User registered successfully",
      user: { id: result.insertId, name, email, role }
    });
  } catch (err) {
    console.error("Register Error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// LOGIN
exports.login = async (req, res) => {
  try {
    const { email, password, role } = req.body;

    const [rows] = await db.query("SELECT * FROM users WHERE email = ? AND role = ?", [email, role]);
    if (rows.length === 0) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const user = rows[0];
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // ✅ generate JWT with fallback secret
    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      process.env.JWT_SECRET || "fallbacksecret",  // fallback in case env is missing
      { expiresIn: process.env.JWT_EXPIRES_IN || "1h" }
    );

    res.json({
      message: "Login successful",
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email || "Not Available",   // ✅ always include email
        role: user.role,
        phone: user.phone || "",
        address: user.address || "",
        profileImage: user.profileImage || ""
      }
    });
  } catch (err) {
    console.error("Login Error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// UPDATE PROFILE
exports.updateProfile = async (req, res) => {
  try {
    const { id, phone, address, profileImage } = req.body;

    await db.query(
      "UPDATE users SET phone = ?, address = ?, profileImage = ? WHERE id = ?",
      [phone, address, profileImage, id]
    );

    res.json({ message: "Profile updated successfully" });
  } catch (err) {
    console.error("Profile Update Error:", err);
    res.status(500).json({ message: "Server error" });
  }
};
