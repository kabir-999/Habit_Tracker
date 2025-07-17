const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Auth = require('../models/Auth');
const User = require('../models/User');
const router = express.Router();

// Signup
router.post('/signup', async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ msg: 'Email and password required' });
    const existing = await Auth.findOne({ email });
    if (existing) return res.status(400).json({ msg: 'Email already exists' });
    const hash = await bcrypt.hash(password, 10);
    const user = await Auth.create({ email, password: hash });
    // Also create a User document for gamification/XP
    await User.create({ _id: user._id, email, name: email }); // <-- add name here
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });
    res.json({ token, userId: user._id });
  } catch (err) {
    res.status(500).json({ msg: 'Server error' });
  }
});

// Login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await Auth.findOne({ email });
    if (!user) return res.status(400).json({ msg: 'Invalid credentials' });
    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(400).json({ msg: 'Invalid credentials' });
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });
    res.json({ token, userId: user._id });
  } catch (err) {
    res.status(500).json({ msg: 'Server error' });
  }
});

module.exports = router; 