const express = require("express");
const router = express.Router();
const donationController = require("../controllers/donationController");

// Create donation
router.post("/", donationController.createDonation);

// Get all
router.get("/", donationController.getAllDonations);

// Get one
router.get("/:id", donationController.getDonationById);

// ✅ Accept donation
router.put("/:id/accept", donationController.acceptDonation);

// Update status
router.put("/status", donationController.updateDonationStatus);

module.exports = router;
