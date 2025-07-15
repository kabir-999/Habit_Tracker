const express = require('express');
const router = express.Router();
const Badge = require('../models/Badge');

// Get all badges
router.get('/', async (req, res) => {
  const badges = await Badge.find();
  res.json(badges);
});

module.exports = router; 