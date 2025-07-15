const mongoose = require('mongoose');

const HabitEmojiLogSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  habitId: { type: mongoose.Schema.Types.ObjectId, ref: 'Habit', required: true },
  date: { type: String, required: true }, // YYYY-MM-DD
  emoji: { type: String, required: true }
});

module.exports = mongoose.model('HabitEmojiLog', HabitEmojiLogSchema, 'HabitEmojiLog'); 