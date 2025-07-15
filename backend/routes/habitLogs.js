const express = require('express');
const router = express.Router();
const HabitLog = require('../models/HabitLog');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Badge = require('../models/Badge');

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

// Get all logs for user
router.get('/', auth, async (req, res) => {
  const logs = await HabitLog.find({ userId: req.user.id });
  res.json(logs);
});

// Add new log
router.post('/', auth, async (req, res) => {
  const { habitId, date, completed } = req.body;
  const log = new HabitLog({ userId: req.user.id, habitId, date, completed });
  await log.save();

  // XP, level, and badge logic
  if (completed) {
    const user = await User.findById(req.user.id);
    if (user) {
      // Award XP
      user.xp = (user.xp || 0) + 10;
      // Level up logic
      let leveledUp = false;
      while (user.xp >= user.level * 300) {
        user.xp -= user.level * 300;
        user.level += 1;
        leveledUp = true;
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
    }
  }
  res.json(log);
});

// Update log
router.put('/:id', auth, async (req, res) => {
  const { completed } = req.body;
  const log = await HabitLog.findOneAndUpdate(
    { _id: req.params.id, userId: req.user.id },
    { completed },
    { new: true }
  );
  res.json(log);
});

// Delete log
router.delete('/:id', auth, async (req, res) => {
  await HabitLog.findOneAndDelete({ _id: req.params.id, userId: req.user.id });
  res.json({ msg: 'Log deleted' });
});

module.exports = router; 