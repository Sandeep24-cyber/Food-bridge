// backend/models/Alert.js
class Alert {
  constructor(id, message, type, createdAt) {
    this.id = id;
    this.message = message;
    this.type = type; // "system", "donation", "warning"
    this.createdAt = createdAt || new Date();
  }
}

module.exports = Alert;
