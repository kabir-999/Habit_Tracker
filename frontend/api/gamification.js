import dbConnect from './utils/dbConnect';
import User from './models/User';
import Badge from './models/Badge';
import HabitLog from './models/HabitLog';
import HabitTracker from './models/HabitTracker';
import HabitEmojiLog from './models/HabitEmojiLog';
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
  if (req.method === 'GET') {
    const dbUser = await User.findById(req.user.id).populate('badges');
    if (!dbUser) {
      return res.json({
        xp: 0,
        level: 1,
        badges: [],
        streak: 0,
        longestStreak: 0,
        habitsCompleted: 0,
        daysActive: 0,
        habitStreaks: []
      });
    }
    const logs = await HabitLog.find({ userId: req.user.id, completed: true }).sort({ date: -1 });
    // Calculate streak (consecutive days)
    let streak = 0;
    let prev = null;
    for (const log of logs) {
      const day = (new Date(log.date)).toISOString().slice(0, 10);
      if (!prev) {
        streak = 1;
        prev = day;
      } else {
        const prevDate = new Date(prev);
        const currDate = new Date(day);
        const diff = (prevDate - currDate) / (1000 * 60 * 60 * 24);
        if (diff === 1) {
          streak++;
          prev = day;
        } else {
          break;
        }
      }
    }
    // Per-habit streaks
    const habits = await HabitTracker.find({ userId: req.user.id });
    if (habits.length === 0 && dbUser.xp !== 0) {
      dbUser.xp = 0;
      await dbUser.save();
    }
    const habitsCompleted = habits.filter(h => h.completed).length;
    const emojiLogs = await HabitEmojiLog.find({ userId: req.user.id });
    return res.json({
      xp: dbUser.xp,
      level: dbUser.level,
      badges: dbUser.badges,
      streak,
      longestStreak: dbUser.longestStreak || 0,
      habitsCompleted,
      daysActive: dbUser.daysActive || 0,
      habitStreaks: dbUser.habitStreaks || []
    });
  }
  res.status(405).json({ msg: 'Method Not Allowed' });
} 