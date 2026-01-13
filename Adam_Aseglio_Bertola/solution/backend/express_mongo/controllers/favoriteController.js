const Favorite = require('../models/Favorite');

/**
 * Get all favorite anime(s) for a user
 * @param {string} username - The username
 * @returns {Promise<Array>} Array of favorite objects from MongoDB
 */
async function getUserFavorites(username) {
  try {
    const favorites = await Favorite.find({ username }).sort({ createdAt: -1 });
    console.log(`Retrieved ${favorites.length} favorites for user ${username}`);
    return favorites.map(fav => fav.toObject());
  } catch (error) {
    console.error('Error fetching favorites:', error);
    throw error;
  }
}

/**
 * Add a new favorite anime for a user
 * @param {string} username - The username
 * @param {number} id - The ID of the item
 * @returns {Promise<Object>} The created favorite object
 */
async function addUserFavorite(username, id) {
  if (!username || !id) {
    const error = new Error('Missing required fields: username, id');
    error.statusCode = 400;
    throw error;
  }

  const existing = await Favorite.findOne({ username, id });

  if (existing) {
    const error = new Error('This anime is already in your favorites');
    error.statusCode = 409;
    throw error;
  }

  const favorite = new Favorite({
    username,
    id: parseInt(id)
  });

  await favorite.save();
  console.log(`Added favorite: anime ${id} for user ${username}`);

  return favorite.toObject();
}

/**
 * Remove a favorite anime for a user
 * @param {string} username - The username
 * @param {number} id - The ID of the item to remove
 * @returns {Promise<Object>} The deleted favorite object
 */
async function removeUserFavorite(username, id) {
  if (!username || !id) {
    const error = new Error('Missing required fields: username, id');
    error.statusCode = 400;
    throw error;
  }

  const favorite = await Favorite.findOneAndDelete({ username, id: parseInt(id) });

  if (!favorite) {
    const error = new Error('This anime is not in your favorites');
    error.statusCode = 404;
    throw error;
  }

  console.log(`Removed favorite: anime ${id} for user ${username}`);
  return favorite.toObject();
}

module.exports = {
  getUserFavorites,
  addUserFavorite,
  removeUserFavorite
};
