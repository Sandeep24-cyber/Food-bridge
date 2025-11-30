const express = require("express");
const router = express.Router();
const matchController = require("../controllers/matchController");

// Create match
router.post("/", matchController.createMatch);

// Get all matches
router.get("/", matchController.getMatches);

// Update match
router.put("/:id", matchController.updateMatch);

// Delete match
router.delete("/:id", matchController.deleteMatch);

module.exports = router;
