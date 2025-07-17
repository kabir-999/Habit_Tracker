const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
  from: { type: String, enum: ['user', 'bot'], required: true },
  text: { type: String, required: true },
  ts: { type: Date, default: Date.now }
}, { _id: false });

const chatThreadSchema = new mongoose.Schema({
  title: { type: String, default: 'New Chat' },
  messages: [messageSchema],
  createdAt: { type: Date, default: Date.now }
}, { _id: true });

const userChatSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'Profile', required: true },
  chats: [chatThreadSchema]
}, { timestamps: true });

module.exports = mongoose.model('Chat', userChatSchema); 