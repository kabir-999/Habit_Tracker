require('dotenv').config({ path: require('path').resolve(__dirname, '../.env') });

if (!process.env.MONGO_URI) {
  console.error('❌ MONGO_URI is not defined. Here are all env vars:', process.env);
  process.exit(1);
}
console.log('MONGO_URI:', process.env.MONGO_URI); // Debug: print the loaded URI

const mongoose = require('mongoose');
const Auth = require('../models/Auth');
const User = require('../models/User');

async function syncUsers() {
  await mongoose.connect(process.env.MONGO_URI);

  const authUsers = await Auth.find();
  let created = 0;

  for (const authUser of authUsers) {
    const exists = await User.findById(authUser._id);
    if (!exists) {
      await User.create({
        _id: authUser._id,
        email: authUser.email,
        name: authUser.email.split('@')[0] // Use email prefix as name
      });
      created++;
    }
  }

  console.log(`Synced! Created ${created} missing User documents.`);
  process.exit(0);
}

syncUsers(); 