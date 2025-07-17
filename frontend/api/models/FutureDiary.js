const mongoose = require('mongoose');

const futureDiarySchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  title: { type: String, required: true },
  description: { type: String },
  dueDate: { type: Date, required: true },
  notificationSent: { type: Boolean, default: false },
}, { timestamps: true });

module.exports = mongoose.model('FutureDiary', futureDiarySchema); 