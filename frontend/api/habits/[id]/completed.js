import dbConnect from '../../utils/dbConnect';
import HabitTracker from '../../models/HabitTracker';
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
  if (req.method === 'PATCH') {
    const { completed } = req.body;
    if (typeof completed !== 'boolean') {
      return res.status(400).json({ msg: 'Invalid data: Provide completed boolean.' });
    }
    const habit = await HabitTracker.findOneAndUpdate(
      { _id: id, userId: req.user.id },
      { completed },
      { new: true }
    );
    if (!habit) return res.status(404).json({ msg: 'Habit not found' });
    return res.json(habit);
  }
  res.status(405).json({ msg: 'Method Not Allowed' });
} 