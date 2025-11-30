const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const path = require("path");

// ✅ Load environment variables
require("dotenv").config();

const app = express();

// Middleware
app.use(cors());
app.use(bodyParser.json());

// 👉 Serve static frontend files
app.use(express.static(path.join(__dirname, "../public/frontend")));

// API routes
const authRoutes = require("./routes/authRoutes");
const donationRoutes = require("./routes/donationRoutes");
const matchRoutes = require("./routes/matchRoutes");
const alertRoutes = require("./routes/alertRoutes");
const reportRoutes = require("./routes/reportRoutes");
const userRoutes = require("./routes/userRoutes");

app.use("/api/auth", authRoutes);
app.use("/api/donations", donationRoutes);
app.use("/api/matches", matchRoutes);
app.use("/api/alerts", require("./routes/alertRoutes"));
app.use("/api/reports", reportRoutes);
app.use("/api/users", userRoutes);

// 👉 Default route: send index.html
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "../public/frontend/pages/index.html"));
});

module.exports = app;
