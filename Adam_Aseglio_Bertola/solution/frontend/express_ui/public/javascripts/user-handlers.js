/**
 * User-Specific API Handler Functions
 *
 * This module contains all user-related API operations including:
 * - User profiles and statistics
 * - Favorites viewing
 * - Ratings viewing
 * - Global statistics
 *
 * Dependencies:
 * - api-handlers.js (for api, handle, resolveAnimeId, value, userAction)
 * - ui-helpers.js (for showResult)
 */

/**
 * Get detailed user profile with statistics
 * Reads from: username input field
 * Redirects to: /profile/:username page
 * @returns {Promise<void>} Redirects to user profile page
 */
async function getUserProfile() {
  const username = value('username');
  if (!username) return alert('Please enter a username');
  window.location.href = `/profile/${encodeURIComponent(username)}`;
}

/**
 * Get all favorite anime for a user
 * Reads from: favUsername input field
 * Redirects to: /favorites/:username page
 * @returns {Promise<void>} Redirects to user favorites page
 */
async function getUserFavorites() {
  const username = value('favUsername');
  if (!username) return alert('Please enter a username');
  window.location.href = `/favorites/${encodeURIComponent(username)}`;
}

/**
 * Get all ratings submitted by a user
 * Reads from: ratingUsername input field
 * Redirects to: /ratings/:username page
 * @returns {Promise<void>} Redirects to user ratings page
 */
async function getUserRatings() {
  const username = value('ratingUsername');
  if (!username) return alert('Please enter a username');
  window.location.href = `/ratings/${encodeURIComponent(username)}`;
}

/**
 * Get statistics for a specific user (ratings count, favorites count, etc.)
 * Reads from: statsUsername input field
 * Redirects to: /stats/user/:username
 * @returns {void} Redirects to user statistics page
 */
async function getUserStats() {
  const username = value('statsUsername');
  if (!username) return alert('Please enter a username');
  window.location.href = `/stats/user/${encodeURIComponent(username)}`;
}

/**
 * Form handler wrapper to add a favorite from the UI form
 * Reads from form input fields:
 *   - addFavUsername: Username
 *   - addFavItemId: Item ID (MAL ID)
 *   - addFavType: Favorite type (anime, character, people)
 * @returns {Promise<void>}
 */
async function addFavoriteFromForm() {
  const username = value('addFavUsername');
  const itemId   = value('addFavItemId');
  const favType  = 'anime';

  if (!username) return alert('Please enter a username');
  if (!itemId)   return alert('Please enter an item ID');

  try {
    await addFavorite(username, itemId, favType);
    document.getElementById('addFavUsername').value = '';
    document.getElementById('addFavItemId').value = '';
  } catch (error) {
    console.error('Error in addFavoriteFromForm:', error);
    alert('An error occurred while adding the favorite. Check the console for details.');
  }
}

/**
 * Form handler wrapper to remove a favorite from the UI form
 * Reads from form input fields:
 *   - removeFavUsername: Username
 *   - removeFavItemId: Item ID (MAL ID)
 * @returns {Promise<void>}
 */
async function removeFavoriteFromForm() {
  const username = value('removeFavUsername');
  const itemId   = value('removeFavItemId');

  if (!username) return alert('Please enter a username');
  if (!itemId)   return alert('Please enter an item ID');

  try {
    await removeFavorite(username, itemId);
    document.getElementById('removeFavUsername').value = '';
    document.getElementById('removeFavItemId').value = '';
  } catch (error) {
    console.error('Error in removeFavoriteFromForm:', error);
    alert('An error occurred while removing the favorite. Check the console for details.');
  }
}

/**
 * Form handler wrapper to add a character from the UI form
 * Reads from form input fields:
 *   - addCharName: Character name
 *   - addCharImage: Character image URL
 *   - addCharAbout: Character description
 * @returns {Promise<void>}
 */
async function addCharacterFromForm() {
  const name  = value('addCharName');
  const image = value('addCharImage');
  const about = value('addCharAbout');

  if (!name)  return alert('Please enter a character name');
  if (!image) return alert('Please enter an image URL');
  if (!about) return alert('Please enter a character description');

  try {
    await addCharacter(name, image, about);
    document.getElementById('addCharName').value = '';
    document.getElementById('addCharImage').value = '';
    document.getElementById('addCharAbout').value = '';
  } catch (error) {
    console.error('Error in addCharacterFromForm:', error);
    alert('An error occurred while adding the character. Check the console for details.');
  }
}

/**
 * Form handler wrapper to remove a character from the UI form
 * Reads from form input fields:
 *   - removeCharId: Character ID (MAL ID)
 * @returns {Promise<void>}
 */
async function removeCharacterFromForm() {
  const characterId = value('removeCharId');

  if (!characterId) return alert('Please enter a character ID');

  try {
    await removeCharacter(characterId);
    document.getElementById('removeCharId').value = '';
  } catch (error) {
    console.error('Error in removeCharacterFromForm:', error);
    alert('An error occurred while removing the character. Check the console for details.');
  }
}

