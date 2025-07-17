import dbConnect from './utils/dbConnect';
import FutureDiary from './models/FutureDiary';

export default async function handler(req, res) {
  await dbConnect();
  if (req.method === 'GET') {
    try {
      const userId = req.query.userId;
      if (!userId) return res.status(400).json({ msg: 'UserId is required' });
      const tasks = await FutureDiary.find({ user: userId }).sort({ dueDate: 1 });
      return res.json(tasks);
    } catch (err) {
      return res.status(500).json({ error: err.message });
    }
  }
  if (req.method === 'POST') {
    try {
      const { userId, title, description, dueDate } = req.body;
      if (!userId || !title || !dueDate) return res.status(400).json({ msg: 'Missing required fields' });
      const task = new FutureDiary({ user: userId, title, description, dueDate });
      await task.save();
      return res.status(201).json(task);
    } catch (err) {
      return res.status(400).json({ error: err.message });
    }
  }
  res.status(405).json({ msg: 'Method Not Allowed' });
} 