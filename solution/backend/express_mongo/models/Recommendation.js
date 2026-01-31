const mongoose = require('mongoose');

const recommendationSchema = new mongoose.Schema({
  mal_id: {
    type:     Number,
    required: true,
    index:    true
  },
  recommendation_mal_id: {
    type:     Number,
    required: true
  }
}, {
  collection: 'recommendations',
  timestamps: false
});

const Recommendation = mongoose.model('Recommendation', recommendationSchema);

module.exports = Recommendation;
