const express = require('express');
const router = express.Router();
const SpinTaskLog = require('../models/SpinTaskLog');
const User = require('../models/User');
const XpHistory = require('../models/XpHistory');

// POST /api/spin-task - Log a new spun task
router.post('/', async (req, res) => {
  try {
    const { userId, task } = req.body;
    const newLog = new SpinTaskLog({ userId, task });
    await newLog.save();
    res.status(201).json(newLog);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/spin-tasks/:userId - Fetch all spin tasks for a user
router.get('/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    console.log('SpinTaskLog GET userId:', userId);
    const logs = await SpinTaskLog.find({ userId }).sort({ timestamp: -1 });
    // Always return an array, even if empty
    res.json(Array.isArray(logs) ? logs : []);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// PATCH /api/spin-task/:id/complete - Mark a task as completed and award XP
router.patch('/:id/complete', async (req, res) => {
  try {
    const { id } = req.params;
    const log = await SpinTaskLog.findById(id);
    if (!log) return res.status(404).json({ error: 'Task not found' });
    if (log.completed) return res.status(400).json({ error: 'Task already completed' });
    log.completed = true;
    await log.save();

    // Award XP to user
    const user = await User.findById(log.userId);
    if (user) {
      user.xp += 30;
      await user.save();
      // Log XP history
      await XpHistory.create({ userId: user._id, amount: 30, reason: 'Spin Task Completed' });
    }
    res.json({ log, xpAwarded: 30 });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
