const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  xp: { type: Number, default: 0 },
  level: { type: Number, default: 1 },
  badges: [{ type: String }],
  avatar: { type: String },
  bio: { type: String },
  buddies: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  resetToken: { type: String },
  resetTokenExpiry: { type: Date },
  googleId: { type: String },
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema); 