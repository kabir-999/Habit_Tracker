const mongoose = require('mongoose');

const HabitTrackerSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  title: { type: String, required: true },
  frequency: { type: String, required: true, default: 'Daily' },
  startDate: { type: Date, required: true },
  completed: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('HabitTracker', HabitTrackerSchema, 'HabitTracker'); 