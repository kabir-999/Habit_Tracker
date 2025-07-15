const express = require('express');
const router = express.Router();
const HabitTracker = require('../models/HabitTracker');
const jwt = require('jsonwebtoken');
const HabitEmojiLog = require('../models/HabitEmojiLog');

// JWT middleware
function auth(req, res, next) {
  const token = req.header('Authorization')?.replace('Bearer ', '');
  if (!token) return res.status(401).json({ msg: 'No token, auth denied' });
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch {
    res.status(401).json({ msg: 'Token is not valid' });
  }
}

// Get all habits for user
router.get('/', auth, async (req, res) => {
  const userId = req.query.userId;
  if (!userId) return res.status(400).json({ msg: 'UserId is required' });
  const habits = await HabitTracker.find({ userId });
  res.json(habits);
});

// Add new habit
router.post('/', auth, async (req, res) => {
  const { userId, title, frequency, startDate } = req.body;
  const start = new Date(startDate);
  if (!userId || !title || !startDate || isNaN(start)) {
    return res.status(400).json({ msg: 'Invalid habit data: Please provide userId, title, and a valid start date.' });
  }
  const habit = new HabitTracker({ userId, title, frequency, startDate: start });
  await habit.save();
  res.json(habit);
});

// Update habit
router.put('/:id', auth, async (req, res) => {
  const { userId, title, frequency, startDate } = req.body;
  const start = new Date(startDate);
  if (!userId || !title || !startDate || isNaN(start)) {
    return res.status(400).json({ msg: 'Invalid habit data: Please provide userId, title, and a valid start date.' });
  }
  const habit = await HabitTracker.findOneAndUpdate(
    { _id: req.params.id, userId },
    { title, frequency, startDate: start },
    { new: true }
  );
  res.json(habit);
});

// Update habit completed status
router.patch('/:id/completed', auth, async (req, res) => {
  const { userId, completed } = req.body;
  if (typeof completed !== 'boolean' || !userId) {
    return res.status(400).json({ msg: 'Invalid data: Provide userId and completed boolean.' });
  }
  const habit = await HabitTracker.findOneAndUpdate(
    { _id: req.params.id, userId },
    { completed },
    { new: true }
  );
  if (!habit) return res.status(404).json({ msg: 'Habit not found' });
  res.json(habit);
});

// Delete habit
router.delete('/:id', auth, async (req, res) => {
  const userId = req.query.userId;
  // Find all emoji logs for this habit and user
  const emojiLogs = await HabitEmojiLog.find({ habitId: req.params.id, userId });
  const xpToSubtract = emojiLogs.length * 10;
  // Delete the habit and emoji logs
  await HabitTracker.findOneAndDelete({ _id: req.params.id, userId });
  await HabitEmojiLog.deleteMany({ habitId: req.params.id, userId });
  // Subtract XP
  if (xpToSubtract > 0) {
    const User = require('../models/User');
    const user = await User.findById(userId);
    if (user) {
      user.xp = Math.max(0, (user.xp || 0) - xpToSubtract);
      await user.save();
      console.log(`Subtracted ${xpToSubtract} XP from user ${user.email || user._id} for deleting habit ${req.params.id} with ${emojiLogs.length} emoji logs.`);
    }
  }
  res.json({ msg: 'Habit and related emoji logs deleted' });
});

module.exports = router; 