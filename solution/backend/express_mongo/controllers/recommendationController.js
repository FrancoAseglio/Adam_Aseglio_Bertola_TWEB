const Recommendation = require('../models/Recommendation');

/**
 * Get recommendations for a specific anime by MAL ID
 * @param {number} malId - The MyAnimeList ID
 * @returns {Promise<Array>} Array of recommendation objects (just IDs) from MongoDB
 */
async function getRecommendations(malId) {
  try {
    const recommendations = await Recommendation.find({ mal_id: malId });
    if (!recommendations || recommendations.length === 0) return [];

    return recommendations.map(rec => ({
      recommendation_mal_id: rec.recommendation_mal_id
    }));
  } catch (error) {
    console.error('Error fetching recommendations:', error);
    throw error;
  }
}

module.exports = {
  getRecommendations
};
