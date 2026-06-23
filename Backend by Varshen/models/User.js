const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true }, // We'll assume the frontend passes the password and we store it
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('User', userSchema);
