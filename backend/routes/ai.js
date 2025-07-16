const express = require('express');
const router = express.Router();
const Profile = require('../models/Profile');
const Chat = require('../models/Chat');
const { GoogleGenerativeAI } = require('@google/generative-ai');
const mongoose = require('mongoose');

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);

function sanitize(str) {
  return String(str).replace(/[<>]/g, '');
}

// POST /chat: send message to a chat thread (or create new if chatId not provided)
router.post('/chat', async (req, res) => {
  try {
    const { userId, chatId, message } = req.body;
    if (!userId || !message) return res.status(400).json({ error: 'Missing userId or message' });
    const cleanUserId = sanitize(userId);
    const cleanMsg = sanitize(message);
    // Fetch user profile
    const profile = await Profile.findOne({ userId: cleanUserId });
    let sysPrompt = 'You are a habit coach.';
    if (profile) {
      sysPrompt += ` This user is a ${profile.age || 'unknown age'}-year-old ${profile.gender || 'person'}${profile.profession ? ' working as a ' + profile.profession : ''}.`;
      if (profile.goal) sysPrompt += ` Their goal is: ${profile.goal}.`;
    }
    sysPrompt += ' Give personalized, actionable, and supportive advice.';
    sysPrompt += `\nReply ONLY in Markdown. \nFor every answer:\n- Use clear section titles, each starting with a bold emoji and bolded title (e.g., **✅ 1. Create a Consistent Sleep Schedule**).\n- After each section title, add a horizontal line (---).\n- Use bullet points for all actionable steps, each on a new line.\n- Never combine multiple tips in a single paragraph.\n- Use at least one emoji per section.\n- Avoid long paragraphs. Do NOT add extra explanations outside the bullet points.\n- Keep the response concise and visually scannable.\n- Do NOT add any intro or outro text unless asked.`;
    // Gemini call
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
    const result = await model.generateContent({
      contents: [
        { role: 'user', parts: [{ text: sysPrompt + '\nUser: ' + cleanMsg }] }
      ]
    });
    const reply = result.response.candidates?.[0]?.content?.parts?.[0]?.text || 'Sorry, I could not generate a response.';
    // Save chat message
    let chatDoc = await Chat.findOne({ userId: cleanUserId });
    if (!chatDoc) {
      chatDoc = new Chat({ userId: cleanUserId, chats: [] });
    }
    let chatThread;
    if (chatId) {
      chatThread = chatDoc.chats.id(chatId);
    }
    if (!chatThread) {
      // Create new chat thread if not found
      chatThread = { title: 'New Chat', messages: [], createdAt: new Date() };
      chatDoc.chats.push(chatThread);
      chatThread = chatDoc.chats[chatDoc.chats.length - 1];
    }
    chatThread.messages.push({ from: 'user', text: cleanMsg, ts: new Date() });
    chatThread.messages.push({ from: 'bot', text: reply, ts: new Date() });
    await chatDoc.save();
    res.json({ reply, chatId: chatThread._id });
  } catch (err) {
    console.error('AI chat error:', err);
    res.status(500).json({ error: 'AI service error' });
  }
});

// GET /chats?userId=... : list all chat threads for user
router.get('/chats', async (req, res) => {
  try {
    const userId = sanitize(req.query.userId);
    if (!userId) return res.status(400).json({ error: 'Missing userId' });
    const chatDoc = await Chat.findOne({ userId });
    if (!chatDoc) return res.json({ chats: [] });
    const chats = chatDoc.chats.map(thread => ({
      chatId: thread._id,
      title: thread.title,
      createdAt: thread.createdAt,
      lastMessage: thread.messages.length > 0 ? thread.messages[thread.messages.length - 1] : null
    }));
    res.json({ chats });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch chat threads' });
  }
});

// GET /chat?userId=...&chatId=... : get messages for a specific chat thread
router.get('/chat', async (req, res) => {
  try {
    const userId = sanitize(req.query.userId);
    const chatId = req.query.chatId;
    if (!userId || !chatId) return res.status(400).json({ error: 'Missing userId or chatId' });
    const chatDoc = await Chat.findOne({ userId });
    if (!chatDoc) return res.json({ messages: [] });
    const chatThread = chatDoc.chats.id(chatId);
    res.json({ messages: chatThread ? chatThread.messages : [] });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch chat thread' });
  }
});

// POST /chat/new : create a new chat thread
router.post('/chat/new', async (req, res) => {
  try {
    const { userId, title } = req.body;
    if (!userId) return res.status(400).json({ error: 'Missing userId' });
    const cleanUserId = sanitize(userId);
    let chatDoc = await Chat.findOne({ userId: cleanUserId });
    if (!chatDoc) chatDoc = new Chat({ userId: cleanUserId, chats: [] });
    const newThread = { title: title || 'New Chat', messages: [], createdAt: new Date() };
    chatDoc.chats.push(newThread);
    await chatDoc.save();
    const thread = chatDoc.chats[chatDoc.chats.length - 1];
    res.json({ chatId: thread._id, title: thread.title, createdAt: thread.createdAt });
  } catch (err) {
    res.status(500).json({ error: 'Failed to create chat thread' });
  }
});

// DELETE /chat?userId=...&chatId=... : delete a chat thread
router.delete('/chat', async (req, res) => {
  try {
    const userId = sanitize(req.query.userId);
    const chatId = req.query.chatId;
    if (!userId || !chatId) return res.status(400).json({ error: 'Missing userId or chatId' });
    if (!mongoose.Types.ObjectId.isValid(userId)) return res.status(400).json({ error: 'Invalid userId' });
    if (!mongoose.Types.ObjectId.isValid(chatId)) return res.status(400).json({ error: 'Invalid chatId' });
    const chatDoc = await Chat.findOne({ userId });
    if (!chatDoc) return res.json({ success: true });
    const thread = chatDoc.chats.id(chatId);
    if (!thread) return res.status(404).json({ error: 'Chat thread not found' });
    chatDoc.chats.pull({ _id: chatId });
    await chatDoc.save();
    res.json({ success: true });
  } catch (err) {
    console.error('Delete chat error:', err);
    res.status(500).json({ error: 'Failed to delete chat thread' });
  }
});

module.exports = router; 