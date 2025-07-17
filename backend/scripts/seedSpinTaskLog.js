// Script to seed a test SpinTaskLog for a user
const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config();

const SpinTaskLog = require('../models/SpinTaskLog');

async function seed() {
  await mongoose.connect(process.env.MONGO_URI);
  const userId = '6877f3f05b61a35a41efe53c'; // <-- Use your test userId
  const testTask = {
    userId,
    task: 'Drink 2L Water',
    completed: false,
    timestamp: new Date()
  };
  const log = await SpinTaskLog.create(testTask);
  console.log('Seeded spin task log:', log);
  await mongoose.disconnect();
}

seed().catch(err => { console.error(err); process.exit(1); });
