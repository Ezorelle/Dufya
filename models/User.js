const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  fullName: { type: String, required: true },
  phone: { type: String, required: true, unique: true },
  birthDate: { type: Date, required: true },
  password: { type: String, required: true },
  gender: String,
  address: String,
  country: String,
  city: String,
});

module.exports = mongoose.model('User', userSchema);
