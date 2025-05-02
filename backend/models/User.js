const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['volunteer', 'member'], required: true }  // 'volunteer' or 'member'
});

module.exports = mongoose.model('User', userSchema);
