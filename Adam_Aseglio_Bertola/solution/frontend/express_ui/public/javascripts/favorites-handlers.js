/**
 * Favorites Handler Module
 *
 * Provides functionality for managing user favorites through the API.
 * Handles adding, removing, and displaying user's favorite anime.
 *
 * Dependencies:
 * - api-handlers.js (for api instance and handle function)
 * - ui-helpers.js (for showResult and formatting)
 *
 * Exports:
 * - addFavorite: Add an item to user's favorites anime
 * - removeFavorite: Remove an item from user's favorites anime
 */

/**
 * Add an item to a user's favorites
 * Creates a new favorite entry through the gateway API.
 * Displays success/error messages and the created favorite with details.
 *
 * @param {string} username - The username adding the favorite
 * @param {number} itemId - The MAL ID of the item to favorite
 * @returns {Promise<void>}
 *
 * @example
 * // Add anime #21 (Demon Slayer) to user's favorites
 * await addFavorite('CKK2', 21, 'anime');
 */
async function addFavorite(username, itemId) {
  if (!username || typeof username !== 'string') {
    alert('❌ Please enter a valid username');
    return;
  }

  if (!itemId || !Number.isInteger(parseInt(itemId)) || parseInt(itemId) <= 0) {
    alert('❌ Please enter a valid item ID (positive number)');
    return;
  }

  try {
    // Step 1: Check if user profile exists
    try {
      await handle(() => api.get(`/profiles/${username.trim()}/stats`));
    } catch (userError) {
      alert(`❌ User "${username}" does not exist. Please create a profile first.`);
      console.error('User not found:', userError);
      return;
    }

    // Step 2: Check if the anime exists
    let animeName = null;
    try {
      const animeData = await handle(() => api.get(`/anime/${parseInt(itemId)}`));
      animeName = animeData.title;
    } catch (animeError) {
      alert(`❌ Anime with ID ${itemId} does not exist.`);
      console.error('Anime not found:', animeError);
      return;
    }

    // Step 3: Add the favorite
    const response = await handle(() =>
      api.post('/favorites', {
        username: username.trim(),
        fav_type: 'anime',
        id      : parseInt(itemId)
      })
    );

    const title = response.details?.title || animeName || `Anime #${itemId}`;

    alert(`✅ Success! Added "${title}" to ${username}'s favorites.`);
    console.log('Favorite added:', response);
  } catch (error) {
    const errorMsg = typeof error === 'string' ? error.toLowerCase() : String(error).toLowerCase();

    if (errorMsg.includes('already in your favorites') || errorMsg.includes('already') || errorMsg.includes('duplicate') || errorMsg.includes('conflict') || errorMsg.includes('409')) {
      alert(`⚠️ Anime #${itemId} is already in ${username}'s favorites.`);
    } else if (errorMsg.includes('not found') || errorMsg.includes('404')) {
      alert(`❌ Anime with ID ${itemId} was not found.`);
    } else if (errorMsg.includes('does not exist') || errorMsg.includes('user')) {
      alert(`❌ User "${username}" does not exist.`);
    } else if (errorMsg.includes('validation') || errorMsg.includes('must be') || errorMsg.includes('400')) {
      alert(`❌ Invalid input. Please check your entries.`);
    } else {
      alert(`❌ Unable to add favorite. Error: ${error}`);
    }
    console.error('Error adding favorite:', error);
  }
}

/**
 * Remove an item from a user's favorites
 * Deletes a favorite entry through the gateway API.
 * Displays confirmation message.
 *
 * @param {string} username - The username removing the favorite
 * @param {number} itemId - The MAL ID of the item to remove
 * @returns {Promise<void>}
 *
 * @example
 * // Remove anime #21 from user's favorites
 * await removeFavorite('CKK2', 21);
 */
async function removeFavorite(username, itemId) {
  if (!username || typeof username !== 'string') {
    alert('❌ Please enter a valid username');
    return;
  }

  if (!itemId || !Number.isInteger(parseInt(itemId)) || parseInt(itemId) <= 0) {
    alert('❌ Please enter a valid item ID (positive number)');
    return;
  }

  try {
    // Step 1: Check if user profile exists
    try {
      await handle(() => api.get(`/profiles/${username.trim()}/stats`));
    } catch (userError) {
      alert(`❌ User "${username}" does not exist.`);
      console.error('User not found:', userError);
      return;
    }

    // Step 2: Remove the favorite
    await handle(() =>api.delete(`/favorites/${username.trim()}/${parseInt(itemId)}`));

    alert(`✅ Successfully removed anime #${itemId} from ${username}'s favorites!`);
    console.log(`Favorite removed: ${username} - Anime #${itemId}`);
  } catch (error) {
    const errorMsg = typeof error === 'string' ? error.toLowerCase() : String(error).toLowerCase();

    if (errorMsg.includes('not in your favorites') || errorMsg.includes('not found') || errorMsg.includes('404')) {
      alert(`⚠️ Anime #${itemId} is not in ${username}'s favorites.`);
    } else if (errorMsg.includes('does not exist') || errorMsg.includes('user')) {
      alert(`❌ User "${username}" does not exist.`);
    } else {
      alert(`❌ Unable to remove favorite. Error: ${error}`);
    }
    console.error('Error removing favorite:', error);
  }
}
