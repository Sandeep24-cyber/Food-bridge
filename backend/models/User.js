// backend/models/User.js
class User {
  constructor(id, name, email, password, role) {
    this.id = id;
    this.name = name;
    this.email = email;
    this.password = password;
    this.role = role; // e.g., "restaurant", "ngo", "admin"
  }
}

module.exports = User;
