require('dotenv').config({ path: require('path').resolve(__dirname, '../.env') });
const mongoose = require('mongoose');
const Auth = require('../models/Auth');
const User = require('../models/User');

async function syncAuthToUsers() {
  await mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  });
  const authUsers = await Auth.find();
  for (const authUser of authUsers) {
    const exists = await User.findById(authUser._id);
    if (!exists) {
      await User.create({
        _id: authUser._id,
        name: authUser.email.split('@')[0],
        email: authUser.email,
        xp: 0,
        level: 1,
        badges: []
      });
      console.log(`Created user for auth: ${authUser.email}`);
    } else {
      console.log(`User already exists for auth: ${authUser.email}`);
    }
  }
  await mongoose.disconnect();
  console.log('Sync complete.');
}

syncAuthToUsers().catch(err => {
  console.error(err);
  process.exit(1);
}); 