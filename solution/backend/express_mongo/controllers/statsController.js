const Stats    = require('../models/Stats');
const Rating   = require('../models/Rating');
const Favorite = require('../models/Favorite');
const Profile  = require('../models/Profile');

/**
 * Get statistics for a specific anime
 * @param {number} malId - The MyAnimeList ID
 * @returns {Promise<Object|null>} The anime statistics object or null if not found
 */
async function getAnimeStats(malId) {
  try {
    const stats = await Stats.findOne({ mal_id: malId });
    return stats;
  } catch (error) {
    console.error('Error fetching anime stats:', error);
    throw error;
  }
}

/**
 * Get global database statistics from MongoDB only
 * @returns {Promise<Object>} Object containing totalProfiles, totalRatings, totalFavorites from MongoDB
 */
async function getGlobalStats() {
  try {
    const [totalProfiles, totalRatings, totalFavorites] = await Promise.all([
      Profile.estimatedDocumentCount(),
      Rating.estimatedDocumentCount(),
      Favorite.estimatedDocumentCount()
    ]);

    return {
      totalProfiles,
      totalRatings,
      totalFavorites,
      calculatedAt: new Date()
    };
  } catch (error) {
    console.error('Error calculating global stats:', error);
    throw error;
  }
}


/**
 * Get user-specific statistics
 * @param {string} username - The username
 * @returns {Promise<Object|null>} Object with user statistics including ratings, favorites, and status counts, or null if user not found
 */
async function getUserStats(username) {
  try {
    const [profile, ratings, favorites] = await Promise.all([
      Profile.findOne({ username }),
      Rating.find({ username }),
      Favorite.countDocuments({ username })
    ]);

    if (!profile) return null;

    const totalRatings = ratings.length;
    const averageScore = totalRatings > 0 ? ratings.reduce((sum, r) => sum + (r.score || 0), 0) / totalRatings : 0;

    const statusCounts = {
      watching:      ratings.filter(r => r.status === 'watching').length,
      completed:     ratings.filter(r => r.status === 'completed').length,
      on_hold:       ratings.filter(r => r.status === 'on_hold').length,
      dropped:       ratings.filter(r => r.status === 'dropped').length,
      plan_to_watch: ratings.filter(r => r.status === 'plan_to_watch').length
    };

    return {
      username,
      totalRatings,
      totalFavorites: favorites,
      averageScore: averageScore.toFixed(2),
      statusCounts,
      profileData: profile,
      calculatedAt: new Date()
    };
  } catch (error) {
    console.error('Error calculating user stats:', error);
    throw error;
  }
}

module.exports = {
  getAnimeStats,
  getGlobalStats,
  getUserStats
};
