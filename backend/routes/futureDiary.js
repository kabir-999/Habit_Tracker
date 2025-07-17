const express = require('express');
const router = express.Router();
const FutureDiary = require('../models/FutureDiary');
// const requireAuth = require('../middleware/requireAuth'); // Uncomment if you have auth middleware

// Get all future diary tasks for the logged-in user
router.get('/', /*requireAuth,*/ async (req, res) => {
  try {
    // const userId = req.user._id; // Uncomment if using auth
    const userId = req.query.userId; // TEMP: for testing without auth
    const tasks = await FutureDiary.find({ user: userId }).sort({ dueDate: 1 });
    res.json(tasks);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Create a new future diary task
router.post('/', /*requireAuth,*/ async (req, res) => {
  try {
    // const userId = req.user._id; // Uncomment if using auth
    const userId = req.body.userId; // TEMP: for testing without auth
    const { title, description, dueDate } = req.body;
    const task = new FutureDiary({ user: userId, title, description, dueDate });
    await task.save();
    res.status(201).json(task);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Delete a future diary task
router.delete('/:id', /*requireAuth,*/ async (req, res) => {
  try {
    // const userId = req.user._id; // Uncomment if using auth
    const task = await FutureDiary.findByIdAndDelete(req.params.id);
    if (!task) return res.status(404).json({ error: 'Task not found' });
    res.json({ message: 'Task deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get notifications for a user
router.get('/notifications', async (req, res) => {
  try {
    const userId = req.query.userId;
    const User = require('../models/User');
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ error: 'User not found' });
    res.json(user.notifications || []);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Mark all notifications as read for a user
router.patch('/notifications/read', async (req, res) => {
  try {
    console.log('PATCH /notifications/read body:', req.body);
    const userId = req.body.userId;
    if (!userId) {
      return res.status(400).json({ error: 'Missing userId in request body' });
    }
    const User = require('../models/User');
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ error: 'User not found' });
    if (user.notifications) {
      user.notifications.forEach(n => n.read = true);
      await user.save();
    }
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Scheduled check for due diary tasks (to be run by a cron job or called periodically)
router.post('/check-due', async (req, res) => {
  try {
    const now = new Date();
    const dueTasks = await FutureDiary.find({ dueDate: { $lte: now }, notificationSent: false });
    const User = require('../models/User');
    for (const task of dueTasks) {
      const user = await User.findById(task.user);
      if (user) {
        user.notifications = user.notifications || [];
        user.notifications.push({ message: `Your Future Diary task "${task.title}" is due today!` });
        await user.save();
      }
      task.notificationSent = true;
      await task.save();
    }
    res.json({ checked: dueTasks.length });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router; 