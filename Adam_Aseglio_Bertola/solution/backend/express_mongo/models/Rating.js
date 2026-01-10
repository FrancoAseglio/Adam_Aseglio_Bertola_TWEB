const mongoose = require('mongoose');

const ratingSchema = new mongoose.Schema({
  username: {
    type:     String,
    required: true,
    trim:     true,
    index:    true
  },
  anime_id: {
    type:     Number,
    required: true,
    index:    true
  },
  status: {
    type: String,
    trim: true
  },
  score: {
    type:  Number,
    min:   0,
    max:  10
  },
  is_rewatching: {
    type: Number
  },
  num_watched_episodes: {
    type: Number
  }
}, {
  timestamps: true
});

ratingSchema.index({ username: 1, anime_id: 1 }, { unique: true });

module.exports = mongoose.model('Rating', ratingSchema);
