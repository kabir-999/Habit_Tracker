require('dotenv').config({ path: require('path').resolve(__dirname, '../.env') });
const mongoose = require('mongoose');
const Badge = require('../models/Badge');

const badges = [
  { name: 'Bronze', description: 'Reached Level 10', emoji: '🥉' },
  { name: 'Silver', description: 'Reached Level 30', emoji: '🥈' },
  { name: 'Gold', description: 'Reached Level 50', emoji: '🥇' },
  { name: 'Platinum', description: 'Reached Level 75', emoji: '🏆' },
  { name: 'Diamond', description: 'Reached Level 100', emoji: '💎' }
];

async function createBadges() {
  await mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  });
  for (const badge of badges) {
    const exists = await Badge.findOne({ name: badge.name });
    if (!exists) {
      await Badge.create(badge);
      console.log(`Created badge: ${badge.name}`);
    } else {
      console.log(`Badge already exists: ${badge.name}`);
    }
  }
  await mongoose.disconnect();
  console.log('Done.');
}

createBadges().catch(err => {
  console.error(err);
  process.exit(1);
}); 