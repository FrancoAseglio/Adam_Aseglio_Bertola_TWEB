const mongoose = require('mongoose');

const favoriteSchema = new mongoose.Schema({
  username: {
    type:     String,
    required: true,
    trim:     true,
    index:    true
  },
  id: {
    type:     Number,
    required: true,
    index:    true
  }
}, {
  timestamps: true
});

favoriteSchema.index({ username: 1, id: 1 }, { unique: true });

module.exports = mongoose.model('Favorite', favoriteSchema);
