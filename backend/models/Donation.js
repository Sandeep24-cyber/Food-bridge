// backend/models/Donation.js
class Donation {
  constructor(id, userId, foodType, quantity, location, status) {
    this.id = id;
    this.userId = userId;
    this.foodType = foodType;
    this.quantity = quantity;
    this.location = location;
    this.status = status; // "pending", "matched", "delivered"
  }
}

module.exports = Donation;
