const mysql = require('mysql2/promise');
require('dotenv').config();

// Create connection pool
const db = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASS || 'Admin@123',
  database: process.env.DB_NAME || 'foodbridge',
  waitForConnections: true,
  queueLimit: 0
});

db.getConnection((err, connection) => {
  if (err) {
    console.error("❌ Database connection failed:", err);
  } else {
    console.log("✅ Connected to MySQL Database!");
    connection.release();
  }
});

module.exports = db;
