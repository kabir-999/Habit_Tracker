import dbConnect from '../utils/dbConnect';
import HabitTracker from '../models/HabitTracker';
import HabitEmojiLog from '../models/HabitEmojiLog';
import User from '../models/User';
import jwt from 'jsonwebtoken';

function getToken(req) {
  const authHeader = req.headers['authorization'] || req.headers['Authorization'];
  if (!authHeader) return null;
  return authHeader.replace('Bearer ', '');
}

function auth(req, res) {
  const token = getToken(req);
  if (!token) {
    res.status(401).json({ msg: 'No token, auth denied' });
    return null;
  }
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    return decoded;
  } catch {
    res.status(401).json({ msg: 'Token is not valid' });
    return null;
  }
}

export default async function handler(req, res) {
  await dbConnect();
  const user = auth(req, res);
  if (!user) return;
  const { id } = req.query;
  if (req.method === 'GET') {
    const habit = await HabitTracker.findOne({ _id: id, userId: req.user.id });
    if (!habit) return res.status(404).json({ msg: 'Habit not found' });
    return res.json(habit);
  }
  if (req.method === 'PUT') {
    const { title, frequency, startDate } = req.body;
    const start = new Date(startDate);
    if (!title || !startDate || isNaN(start)) {
      return res.status(400).json({ msg: 'Invalid habit data: Please provide title and a valid start date.' });
    }
    const habit = await HabitTracker.findOneAndUpdate(
      { _id: id, userId: req.user.id },
      { title, frequency, startDate: start },
      { new: true }
    );
    return res.json(habit);
  }
  if (req.method === 'DELETE') {
    // Find all emoji logs for this habit and user
    const emojiLogs = await HabitEmojiLog.find({ habitId: id, userId: req.user.id });
    const xpToSubtract = emojiLogs.length * 10;
    // Delete the habit and emoji logs
    await HabitTracker.findOneAndDelete({ _id: id, userId: req.user.id });
    await HabitEmojiLog.deleteMany({ habitId: id, userId: req.user.id });
    // Subtract XP
    if (xpToSubtract > 0) {
      const userDoc = await User.findById(req.user.id);
      if (userDoc) {
        userDoc.xp = Math.max(0, (userDoc.xp || 0) - xpToSubtract);
        await userDoc.save();
      }
    }
    return res.json({ msg: 'Habit and related emoji logs deleted' });
  }
  res.status(405).json({ msg: 'Method Not Allowed' });
} 