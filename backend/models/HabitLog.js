const mongoose = require('mongoose');

const HabitLogSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  habitId: { type: mongoose.Schema.Types.ObjectId, ref: 'Habit', required: true },
  date: { type: Date, required: true },
  completed: { type: Boolean, required: true }
});

module.exports = mongoose.model('HabitLog', HabitLogSchema); 