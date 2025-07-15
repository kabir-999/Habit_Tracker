const express = require('express');
const router = express.Router();
const Suggestion = require('../models/Suggestion');
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

// Get all suggestions for user
router.get('/', auth, async (req, res) => {
  const suggestions = await Suggestion.find({ userId: req.user.id });
  res.json(suggestions);
});

// Add new suggestion
router.post('/', auth, async (req, res) => {
  const { message } = req.body;
  const suggestion = new Suggestion({ userId: req.user.id, message });
  await suggestion.save();
  res.json(suggestion);
});

module.exports = router; 