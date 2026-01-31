const mongoose = require('mongoose');

const profileSchema = new mongoose.Schema({
  username: {
    type:     String,
    required: true,
    unique:   true,
    trim:     true,
    index:    true
  },
  gender: {
    type: String,
    trim: true
  },
  birthday: {
    type: String,
    trim: true
  },
  location: {
    type: String,
    trim: true
  },
  joined: {
    type: String,
    trim: true
  },
  watching: {
    type:    Number,
    default: 0
  },
  completed: {
    type:    Number,
    default: 0
  },
  on_hold: {
    type:    Number,
    default: 0
  },
  dropped: {
    type:    Number,
    default: 0
  },
  plan_to_watch: {
    type:    Number,
    default: 0
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Profile', profileSchema);
