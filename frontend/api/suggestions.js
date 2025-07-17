import dbConnect from './utils/dbConnect';
import Suggestion from './models/Suggestion';
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
    const suggestions = await Suggestion.find({ userId: req.user.id });
    return res.json(suggestions);
  }
  res.status(405).json({ msg: 'Method Not Allowed' });
} 