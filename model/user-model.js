const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: true
  },
  lastName: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  cryptocurrency: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  emailNotifications: {
    type: Boolean,
    default: false
  },
  agreeTerms: {
    type: Boolean,
    required: true
  }
});

const User = mongoose.model('User', userSchema);

module.exports = User;
