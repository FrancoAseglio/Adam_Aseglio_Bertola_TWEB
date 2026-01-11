const Rating = require('../models/Rating');

/**
 * Get all ratings submitted by a user
 * @param {string} username - The username
 * @returns {Promise<Array>} Array of rating objects from MongoDB
 */
async function getUserRatings(username) {
  try {
    const ratings = await Rating.find({ username }).sort({ createdAt: -1 });
    return ratings.map(rating => rating.toObject());
  } catch (error) {
    console.error('Error fetching ratings:', error);
    throw error;
  }
}

module.exports = {
  getUserRatings
};
