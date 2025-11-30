// backend/models/Match.js
class Match {
  constructor(id, donationId, ngoId, status) {
    this.id = id;
    this.donationId = donationId;
    this.ngoId = ngoId;
    this.status = status; // "pending", "accepted", "completed"
  }
}

module.exports = Match;
