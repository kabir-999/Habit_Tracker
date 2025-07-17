const express = require('express');
const router = express.Router();
const User = require('../models/User');
const jwt = require('jsonwebtoken');

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

// POST /api/spin-wheel/complete
// Award +30 XP to current user for completing the daily spin challenge
router.post('/complete', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ msg: 'User not found' });
    user.xp = (user.xp || 0) + 30;
    await user.save();
    return res.json({ success: true, xp: user.xp, msg: '+30 XP awarded!' });
  } catch (err) {
    return res.status(500).json({ msg: 'Could not award XP' });
  }
});

module.exports = router;
