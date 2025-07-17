const mongoose = require('mongoose');
const ProfileSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'Auth', required: true },
  name: { type: String, unique: true },
  age: Number,
  height: Number,
  weight: Number,
  gender: String,
  profession: String,
  goal: String
});
module.exports = mongoose.model('Profile', ProfileSchema, 'test.profile'); 