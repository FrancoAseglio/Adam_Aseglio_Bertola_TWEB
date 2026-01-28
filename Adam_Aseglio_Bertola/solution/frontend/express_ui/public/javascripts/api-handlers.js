/**
 * Core API Handler Utilities
 *
 * This is the base module that provides shared utilities for all API operations.
 * It must be loaded before anime-handlers.js and user-handlers.js.
 *
 * Exports:
 * - api: Configured axios instance for API calls
 * - handle: Error handling wrapper for API calls
 * - resolveAnimeId: Converts anime title to MAL ID
 * - setupEnterKeyListeners: Binds Enter key to form actions
 * - value: DOM helper to get trimmed input values
 * - userAction: Helper for user-based API calls
 * - animeAction: Helper for anime-based API calls
 *
 * Dependencies:
 * - axios (CDN)
 * - ui-helpers.js (for showResult)
 */

/**
 * Axios Instance
 * Pre-configured with base URL and timeout for all API requests
 */
const api = axios.create({
  baseURL: 'http://localhost:3001/api',
  timeout: 30000
});

/**
 * Error handling wrapper for API calls
 * Extracts response data on success, formats errors on failure
 * @param {Function} fn - Async function that returns an axios promise
 * @returns {Promise<any>} The response data from the API
 * @throws {string} Formatted error message
 */
async function handle(fn) {
  try {
    const res = await fn();
    return res.data;
  } catch (e) {
    throw e.response?.data?.error || e.message;
  }
}

/**
 * Resolve anime title to MAL ID
 * Accepts either numeric ID or title string. If title, searches API.
 * @param {string} input - Anime MAL ID (numeric) or title (string)
 * @returns {Promise<number|null>} The resolved MAL ID or null if not found
 */
async function resolveAnimeId(input) {
  if (!isNaN(input) && input.trim() !== '') return parseInt(input);

  try {
    const data = await handle(() => api.get(`/anime/search/${encodeURIComponent(input)}`));
    if (data?.length) return data[0].mal_id;
    showResult({ error: `No anime found with title: "${input}"` });
    return null;
  } catch (error) {
    showResult({ error });
    return null;
  }
}

/**
 * Setup Enter key listeners for all input fields
 * Maps input field IDs to their corresponding action functions
 * Allows users to press Enter to trigger form actions
 * @returns {void}
 */
function setupEnterKeyListeners() {
  const map = {
    // Anime
    searchQuery:           typeof searchAnime     !== 'undefined' ? searchAnime : null,
    animeId:               typeof getAnimeDetails !== 'undefined' ? getAnimeDetails : null,
    topAnimeLimit:         typeof getTopAnime     !== 'undefined' ? getTopAnime : null,
    genreInput:            typeof getAnimeByGenre !== 'undefined' ? getAnimeByGenre : null,
    characterSearchQuery:  typeof searchCharacter !== 'undefined' ? searchCharacter : null,
    // User
    username:              typeof getUserProfile   !== 'undefined' ? getUserProfile : null,
    favUsername:           typeof getUserFavorites !== 'undefined' ? getUserFavorites : null,
    ratingUsername:        typeof getUserRatings   !== 'undefined' ? getUserRatings : null,
    // Favorites
    addFavItemId:          typeof addFavoriteFromForm    !== 'undefined' ? addFavoriteFromForm : null,
    addFavUsername:        typeof addFavoriteFromForm    !== 'undefined' ? addFavoriteFromForm : null,
    removeFavItemId:       typeof removeFavoriteFromForm !== 'undefined' ? removeFavoriteFromForm : null,
    removeFavUsername:     typeof removeFavoriteFromForm !== 'undefined' ? removeFavoriteFromForm : null,
    // Stats
    statsUsername:         typeof getUserStats  !== 'undefined' ? getUserStats : null,
    statsAnimeId:          typeof getAnimeStats !== 'undefined' ? getAnimeStats : null
  };

  Object.entries(map).forEach(([id, fn]) => {
    const element = document.getElementById(id);
    if (element && fn) {
      element.addEventListener('keypress', async e => {

        if (e.key === 'Enter') {
          e.preventDefault();

          try {
            await fn();
          } catch (err) {
            console.error(`Error in ${id}:`, err);
          }
        }
      });
    }
  });
}

/**
 * DOM Helpers
 */

/**
 * Get trimmed value from input field by ID
 * @param {string} id - The HTML element ID
 * @returns {string} Trimmed input value or empty string
 */
const value = id => document.getElementById(id)?.value.trim();

/**
 * Execute a user-based API action
 * Validates username input, executes API call, displays result
 * @param {string} id - Input field ID containing username
 * @param {Function} fn - Function that takes username and returns API call
 * @returns {Promise<void>}
 */
async function userAction(id, fn) {
  const user = value(id);
  if (!user) return alert('Please enter a username');

  showResult(await handle(() => fn(user)));
}

/**
 * Execute an anime-based API action
 * Validates input, resolves anime ID if needed, executes API call, displays result
 * @param {string} id - Input field ID containing anime title or ID
 * @param {Function} fn - Function that takes MAL ID and returns API call
 * @returns {Promise<void>}
 */
async function animeAction(id, fn) {
  const input = value(id);
  if (!input) return alert('Please enter an anime title or ID');

  showResult({ message: 'Searching for anime...' });
  const malId = await resolveAnimeId(input);
  if (!malId) return;

  showResult(await handle(() => fn(malId)));
}
