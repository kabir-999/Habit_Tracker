const express = require('express');
const router = express.Router();
const XpHistory = require('../models/XpHistory');
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

// Get all XP history for user
router.get('/', auth, async (req, res) => {
  const history = await XpHistory.find({ userId: req.user.id });
  res.json(history);
});

module.exports = router; 