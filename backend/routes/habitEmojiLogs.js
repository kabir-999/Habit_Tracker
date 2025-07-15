const express = require('express');
const router = express.Router();
const HabitEmojiLog = require('../models/HabitEmojiLog');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Badge = require('../models/Badge');

// JWT middleware (reuse from other routes if available)
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

// GET all emoji logs for a user
router.get('/', auth, async (req, res) => {
  const userId = req.query.userId || req.user.id;
  const logs = await HabitEmojiLog.find({ userId });
  res.json(logs);
});

// POST add/update emoji log for a habit/date
router.post('/', auth, async (req, res) => {
  const { habitId, date, emoji } = req.body;
  if (!habitId || !date || !emoji) return res.status(400).json({ msg: 'Missing required fields' });
  const userId = req.user.id;
  // Check if log already exists
  let existing = await HabitEmojiLog.findOne({ userId, habitId, date });
  let log = await HabitEmojiLog.findOneAndUpdate(
    { userId, habitId, date },
    { emoji },
    { new: true, upsert: true }
  );
  // Only award XP if this is a new log (not just an update)
  if (!existing) {
    const user = await User.findById(userId);
    if (user) {
      user.xp = (user.xp || 0) + 10;
      console.log(`Awarded 10 XP to user ${user.email || user._id} for emoji on habit ${habitId} at ${date}`);
      // Level up logic
      while (user.xp >= user.level * 300) {
        user.xp -= user.level * 300;
        user.level += 1;
      }
      // Badge tiers
      const badgeTiers = [
        { name: 'Bronze', level: 10 },
        { name: 'Silver', level: 30 },
        { name: 'Gold', level: 50 },
        { name: 'Platinum', level: 75 },
        { name: 'Diamond', level: 100 }
      ];
      for (const tier of badgeTiers) {
        if (user.level >= tier.level) {
          const badge = await Badge.findOne({ name: tier.name });
          if (badge && !user.badges.includes(badge._id.toString())) {
            user.badges.push(badge._id);
          }
        }
      }
      await user.save();
    } else {
      console.log('User not found for XP award:', userId);
    }
  }
  res.json(log);
});

// DELETE a specific emoji log by id
router.delete('/:id', auth, async (req, res) => {
  const log = await HabitEmojiLog.findOneAndDelete({ _id: req.params.id, userId: req.user.id });
  if (log) {
    const user = await User.findById(req.user.id);
    if (user) {
      user.xp = Math.max(0, (user.xp || 0) - 10);
      // Optionally, handle level down if XP goes below 0 (not implemented here)
      await user.save();
      console.log(`Subtracted 10 XP from user ${user.email || user._id} for emoji removal on habit ${log.habitId} at ${log.date}`);
    }
  }
  res.json({ msg: 'Emoji log deleted' });
});

// DELETE all emoji logs for a habit (when habit is deleted)
router.delete('/by-habit/:habitId', auth, async (req, res) => {
  await HabitEmojiLog.deleteMany({ habitId: req.params.habitId, userId: req.user.id });
  res.json({ msg: 'All emoji logs for habit deleted' });
});

module.exports = router; 