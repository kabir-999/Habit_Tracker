import dbConnect from './utils/dbConnect';
import HabitTracker from './models/HabitTracker';
import HabitEmojiLog from './models/HabitEmojiLog';
import User from './models/User';
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
  // Auth check
  const user = auth(req, res);
  if (!user) return;

  if (req.method === 'GET') {
    const userId = req.query.userId;
    if (!userId) return res.status(400).json({ msg: 'UserId is required' });
    const habits = await HabitTracker.find({ userId });
    return res.json(habits);
  }

  if (req.method === 'POST') {
    const { userId, title, frequency, startDate } = req.body;
    const start = new Date(startDate);
    if (!userId || !title || !startDate || isNaN(start)) {
      return res.status(400).json({ msg: 'Invalid habit data: Please provide userId, title, and a valid start date.' });
    }
    const habit = new HabitTracker({ userId, title, frequency, startDate: start });
    await habit.save();
    return res.json(habit);
  }

  if (req.method === 'PUT') {
    const { userId, title, frequency, startDate, id } = req.body;
    const start = new Date(startDate);
    if (!userId || !title || !startDate || isNaN(start) || !id) {
      return res.status(400).json({ msg: 'Invalid habit data: Please provide userId, title, id, and a valid start date.' });
    }
    const habit = await HabitTracker.findOneAndUpdate(
      { _id: id, userId },
      { title, frequency, startDate: start },
      { new: true }
    );
    return res.json(habit);
  }

  if (req.method === 'PATCH') {
    // PATCH for completed status
    const { userId, completed, id } = req.body;
    if (typeof completed !== 'boolean' || !userId || !id) {
      return res.status(400).json({ msg: 'Invalid data: Provide userId, id, and completed boolean.' });
    }
    const habit = await HabitTracker.findOneAndUpdate(
      { _id: id, userId },
      { completed },
      { new: true }
    );
    if (!habit) return res.status(404).json({ msg: 'Habit not found' });
    return res.json(habit);
  }

  if (req.method === 'DELETE') {
    const userId = req.query.userId;
    const id = req.query.id;
    if (!userId || !id) return res.status(400).json({ msg: 'userId and id required' });
    // Find all emoji logs for this habit and user
    const emojiLogs = await HabitEmojiLog.find({ habitId: id, userId });
    const xpToSubtract = emojiLogs.length * 10;
    // Delete the habit and emoji logs
    await HabitTracker.findOneAndDelete({ _id: id, userId });
    await HabitEmojiLog.deleteMany({ habitId: id, userId });
    // Subtract XP
    if (xpToSubtract > 0) {
      const user = await User.findById(userId);
      if (user) {
        user.xp = Math.max(0, (user.xp || 0) - xpToSubtract);
        await user.save();
      }
    }
    return res.json({ msg: 'Habit and related emoji logs deleted' });
  }

  res.status(405).json({ msg: 'Method Not Allowed' });
} 