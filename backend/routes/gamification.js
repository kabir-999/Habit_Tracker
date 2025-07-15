const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Badge = require('../models/Badge');
const HabitLog = require('../models/HabitLog');
const HabitTracker = require('../models/HabitTracker');
const HabitEmojiLog = require('../models/HabitEmojiLog');
const jwt = require('jsonwebtoken');

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

// Get gamification summary for user
router.get('/', auth, async (req, res) => {
  const user = await User.findById(req.user.id).populate('badges');
  if (!user) {
    // Return default values if user not found
    return res.json({
      xp: 0,
      level: 1,
      badges: [],
      streak: 0,
      longestStreak: 0,
      habitsCompleted: 0,
      daysActive: 0,
      habitStreaks: []
    });
  }
  const logs = await HabitLog.find({ userId: req.user.id, completed: true }).sort({ date: -1 });
  // Calculate streak (consecutive days)
  let streak = 0;
  let prev = null;
  for (const log of logs) {
    const day = (new Date(log.date)).toISOString().slice(0, 10);
    if (!prev) {
      streak = 1;
      prev = day;
    } else {
      const prevDate = new Date(prev);
      const currDate = new Date(day);
      const diff = (prevDate - currDate) / (1000 * 60 * 60 * 24);
      if (diff === 1) {
        streak++;
        prev = day;
      } else {
        break;
      }
    }
  }

  // Per-habit streaks
  const habits = await HabitTracker.find({ userId: req.user.id });
  // If no habits, set XP to 0
  if (habits.length === 0 && user.xp !== 0) {
    user.xp = 0;
    await user.save();
  }
  // Count completed habits
  const habitsCompleted = habits.filter(h => h.completed).length;
  const emojiLogs = await HabitEmojiLog.find({ userId: req.user.id });
  const habitStreaks = habits.map(habit => {
    // Get all dates for this habit, sorted
    const dates = emojiLogs
      .filter(l => l.habitId.toString() === habit._id.toString())
      .map(l => (new Date(l.date)).toISOString().slice(0, 10))
      .sort();
    // Calculate longest streak
    let maxStreak = 0, currStreak = 0, prevDate = null;
    for (const d of dates) {
      if (!prevDate) {
        currStreak = 1;
      } else {
        const diff = (new Date(d) - new Date(prevDate)) / (1000 * 60 * 60 * 24);
        if (diff === 1) {
          currStreak++;
        } else {
          currStreak = 1;
        }
      }
      if (currStreak > maxStreak) maxStreak = currStreak;
      prevDate = d;
    }
    return { habitId: habit._id, title: habit.title, longestStreak: maxStreak };
  });

  // Calculate overall longest streak across all habits
  const overallLongestStreak = habitStreaks.length > 0 ? Math.max(...habitStreaks.map(h => h.longestStreak)) : 0;

  res.json({
    xp: user.xp,
    level: user.level,
    badges: user.badges,
    streak,
    longestStreak: overallLongestStreak, // Now calculated
    habitsCompleted,
    daysActive: logs.length > 0 ? new Set(logs.map(l => (new Date(l.date)).toISOString().slice(0, 10))).size : 0,
    habitStreaks
  });
});

module.exports = router; 