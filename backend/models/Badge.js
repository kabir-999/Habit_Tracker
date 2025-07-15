const mongoose = require('mongoose');

const BadgeSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  emoji: { type: String, required: true }
});

module.exports = mongoose.model('Badge', BadgeSchema); 