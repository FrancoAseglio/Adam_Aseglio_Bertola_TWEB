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
  },
  fav_type: {
    type:     String,
    required: true,
    enum:     ['anime', 'character', 'people'],
    default:  'anime'
  }
}, {
  timestamps: true
});

favoriteSchema.index({ username: 1, id: 1, fav_type: 1 }, { unique: true });

module.exports = mongoose.model('Favorite', favoriteSchema);
