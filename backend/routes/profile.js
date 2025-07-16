const express = require('express');
const jwt = require('jsonwebtoken');
const Profile = require('../models/Profile');
const Auth = require('../models/Auth');
const router = express.Router();
const mongoose = require('mongoose');

// Middleware to check JWT
function authMiddleware(req, res, next) {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ msg: 'No token' });
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = decoded.id;
    next();
  } catch {
    res.status(401).json({ msg: 'Invalid token' });
  }
}

// Store profile info
router.post('/', authMiddleware, async (req, res) => {
  try {
    const { name, age, height, weight, gender, profession, goal } = req.body;
    const profile = await Profile.create({
      userId: req.userId,
      name, age, height, weight, gender, profession, goal
    });
    res.json({ profile });
  } catch (err) {
    res.status(500).json({ msg: 'Server error' });
  }
});

// Fetch current user's profile
router.get('/', authMiddleware, async (req, res) => {
  try {
    console.log('userId from JWT:', req.userId, 'type:', typeof req.userId, 'length:', req.userId.length);
    const cleanUserId = typeof req.userId === 'string' ? req.userId.trim() : req.userId;
    console.log('Cleaned userId:', cleanUserId, 'length:', cleanUserId.length);
    if (!mongoose.Types.ObjectId.isValid(cleanUserId)) {
      console.error('Invalid userId format after trim:', cleanUserId);
      return res.status(400).json({ msg: 'Invalid userId format' });
    }
    const userIdObj = new mongoose.Types.ObjectId(cleanUserId);
    const profile = await Profile.findOne({ userId: userIdObj });
    if (!profile) return res.status(404).json({ msg: 'Profile not found' });
    res.json({ profile });
  } catch (err) {
    console.error('Error in GET /api/profile:', err);
    res.status(500).json({ msg: 'Server error' });
  }
});

// Fetch all profiles (no auth for demo, add auth if needed)
router.get('/all', async (req, res) => {
  try {
    const profiles = await Profile.find({});
    res.json({ profiles });
  } catch (err) {
    res.status(500).json({ msg: 'Server error' });
  }
});

// Update current user's profile
router.put('/', authMiddleware, async (req, res) => {
  try {
    console.log('userId from JWT:', req.userId, 'type:', typeof req.userId, 'length:', req.userId.length);
    const cleanUserId = typeof req.userId === 'string' ? req.userId.trim() : req.userId;
    console.log('Cleaned userId:', cleanUserId, 'length:', cleanUserId.length);
    if (!mongoose.Types.ObjectId.isValid(cleanUserId)) {
      console.error('Invalid userId format after trim:', cleanUserId);
      return res.status(400).json({ msg: 'Invalid userId format' });
    }
    const userIdObj = new mongoose.Types.ObjectId(cleanUserId);
    const updateFields = { ...req.body };
    delete updateFields._id;
    delete updateFields.userId;
    const profile = await Profile.findOneAndUpdate(
      { userId: userIdObj },
      { $set: updateFields },
      { new: true }
    );
    if (!profile) return res.status(404).json({ msg: 'Profile not found' });
    res.json({ profile });
  } catch (err) {
    console.error('Error in PUT /api/profile:', err);
    res.status(500).json({ msg: 'Server error' });
  }
});

module.exports = router; 