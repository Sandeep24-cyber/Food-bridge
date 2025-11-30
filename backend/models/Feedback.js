// backend/models/Feedback.js
class Feedback {
  constructor(id, userId, message, rating) {
    this.id = id;
    this.userId = userId;
    this.message = message;
    this.rating = rating; // 1–5 stars
  }
}

module.exports = Feedback;
