import dbConnect from './utils/dbConnect';
import Badge from './models/Badge';

export default async function handler(req, res) {
  await dbConnect();
  if (req.method === 'GET') {
    const badges = await Badge.find();
    return res.json(badges);
  }
  res.status(405).json({ msg: 'Method Not Allowed' });
} 