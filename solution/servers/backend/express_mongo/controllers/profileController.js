const Profile  = require('../models/Profile');
const Rating   = require('../models/Rating');
const Favorite = require('../models/Favorite');


/**
 * Get profile with aggregated data
 * @param {string} username - The username
 * @returns {Promise<Object|null>} Profile object with userRatings and userFavorites counts, or null if not found
 */
async function getProfileWithStats(username) {
  try {
    const profile = await Profile.findOne({ username });
    if (!profile) return null;

    const [ratingsCount, favoritesCount] = await Promise.all([
      Rating.countDocuments({ username }),
      Favorite.countDocuments({ username })
    ]);

    const profileObj = profile.toObject();
    profileObj.userRatings   = ratingsCount;
    profileObj.userFavorites = favoritesCount;
    
    return profileObj;
  } catch (error) {
    console.error('Error getting profile with stats:', error);
    throw error;
  }
}

module.exports = {
  getProfileWithStats
};
