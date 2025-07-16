const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => console.log('MongoDB connected'))
  .catch((err) => console.error('MongoDB connection error:', err));

// Basic route
app.get('/', (req, res) => {
  res.send('Habit Tracker API running');
});

// Auth and Profile routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/profile', require('./routes/profile'));
app.use('/api/habits', require('./routes/habits'));
app.use('/api/habit-logs', require('./routes/habitLogs'));
app.use('/api/suggestions', require('./routes/suggestions'));
app.use('/api/badges', require('./routes/badges'));
app.use('/api/xp-history', require('./routes/xpHistory'));
app.use('/api/gamification', require('./routes/gamification'));
app.use('/api/habit-emoji-logs', require('./routes/habitEmojiLogs'));
app.use('/api/ai', require('./routes/ai'));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`)); 