const express = require('express');
const jwt = require('jsonwebtoken');
const Profile = require('../models/Profile');
const Auth = require('../models/Auth');
const router = express.Router();

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

module.exports = router; 