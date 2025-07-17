import dbConnect from '../utils/dbConnect';
import Profile from '../models/Profile';

export default async function handler(req, res) {
  await dbConnect();
  if (req.method === 'GET') {
    try {
      const profiles = await Profile.find({});
      return res.json({ profiles });
    } catch (err) {
      return res.status(500).json({ msg: 'Server error' });
    }
  }
  res.status(405).json({ msg: 'Method Not Allowed' });
} 