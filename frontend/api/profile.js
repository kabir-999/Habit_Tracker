import dbConnect from './utils/dbConnect';
import Profile from './models/Profile';
import Auth from './models/Auth';
import jwt from 'jsonwebtoken';
import mongoose from 'mongoose';

function getToken(req) {
  const authHeader = req.headers['authorization'] || req.headers['Authorization'];
  if (!authHeader) return null;
  return authHeader.replace('Bearer ', '');
}

function auth(req, res) {
  const token = getToken(req);
  if (!token) {
    res.status(401).json({ msg: 'No token' });
    return null;
  }
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = decoded.id;
    return decoded;
  } catch {
    res.status(401).json({ msg: 'Invalid token' });
    return null;
  }
}

export default async function handler(req, res) {
  await dbConnect();
  const user = auth(req, res);
  if (!user) return;
  if (req.method === 'POST') {
    try {
      const { name, age, height, weight, gender, profession, goal } = req.body;
      const existing = await Profile.findOne({ name });
      if (existing) {
        return res.status(400).json({ msg: 'Username already taken. Please choose a different one.' });
      }
      const profile = await Profile.create({
        userId: req.userId,
        name, age, height, weight, gender, profession, goal
      });
      return res.json({ profile });
    } catch (err) {
      if (err.code === 11000 && err.keyPattern && err.keyPattern.name) {
        return res.status(400).json({ msg: 'Username already taken. Please choose a different one.' });
      }
      return res.status(500).json({ msg: 'Server error' });
    }
  }
  if (req.method === 'GET') {
    try {
      const cleanUserId = typeof req.userId === 'string' ? req.userId.trim() : req.userId;
      if (!mongoose.Types.ObjectId.isValid(cleanUserId)) {
        return res.status(400).json({ msg: 'Invalid userId format' });
      }
      const userIdObj = new mongoose.Types.ObjectId(cleanUserId);
      const profile = await Profile.findOne({ userId: userIdObj });
      if (!profile) return res.status(404).json({ msg: 'Profile not found' });
      return res.json({ profile });
    } catch (err) {
      return res.status(500).json({ msg: 'Server error' });
    }
  }
  res.status(405).json({ msg: 'Method Not Allowed' });
} 