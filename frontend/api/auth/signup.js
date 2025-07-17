import dbConnect from '../utils/dbConnect';
import Auth from '../models/Auth';
import User from '../models/User';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

export default async function handler(req, res) {
  await dbConnect();
  if (req.method !== 'POST') return res.status(405).json({ msg: 'Method Not Allowed' });
  try {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ msg: 'Email and password required' });
    const existing = await Auth.findOne({ email });
    if (existing) return res.status(400).json({ msg: 'Email already exists' });
    const hash = await bcrypt.hash(password, 10);
    const user = await Auth.create({ email, password: hash });
    await User.create({ _id: user._id, email });
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });
    res.json({ token, userId: user._id });
  } catch (err) {
    res.status(500).json({ msg: 'Server error' });
  }
} 