const mongoose = require('mongoose');
const { v4: uuidv4 } = require('uuid');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  user: { type: String, required: true },
  uuid: { type: String, required: true, unique: true, default: uuidv4 },
  phoneNo: { type: String, required: true, unique: true },
  location: { type: String, required: true },
  password: { type: String, required: true },
  registeredAt: { type: Date, default: Date.now },
});

// Hash password before saving
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

module.exports = mongoose.model('User', userSchema);
