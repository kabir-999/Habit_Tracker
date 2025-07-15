const mongoose = require('mongoose');

const XpHistorySchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'Auth', required: true },
  amount: { type: Number, required: true },
  reason: { type: String, required: true },
  date: { type: Date, default: Date.now }
});

module.exports = mongoose.model('XpHistory', XpHistorySchema); 