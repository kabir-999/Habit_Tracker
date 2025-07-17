import dbConnect from '../utils/dbConnect';
import Auth from '../models/Auth';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';

export default async function handler(req, res) {
  await dbConnect();
  if (req.method !== 'POST') return res.status(405).json({ msg: 'Method Not Allowed' });
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
} 