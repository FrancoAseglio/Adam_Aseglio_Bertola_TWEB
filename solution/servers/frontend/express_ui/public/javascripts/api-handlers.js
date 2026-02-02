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
 * Extracts response data on success and formats errors with detailed messages.
 * Automatically handles axios error responses and extracts meaningful error information.
 * 
 * @param {Function} fn - Async function that returns an axios promise
 * @returns {Promise<any>} The response data from the API
 * @throws {string} Formatted error message from API or generic error message
 * 
 * @example
 * const data = await handle(() => api.get('/anime/1'));
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
 * Maps input field IDs to their corresponding action functions.
 * Allows users to press Enter to trigger form actions without clicking buttons.
 * Automatically prevents default form submission and handles errors gracefully.
 * 
 * @returns {void}
 * 
 * @example
 * // Called automatically when DOM is ready
 * setupEnterKeyListeners();
 */
function setupEnterKeyListeners() {
  const map = {
    searchQuery:           typeof searchAnime     !== 'undefined' ? searchAnime : null,
    animeId:               typeof getAnimeDetails !== 'undefined' ? getAnimeDetails : null,
    genreInput:            typeof getAnimeByGenre !== 'undefined' ? getAnimeByGenre : null,
    characterSearchQuery:  typeof searchCharacter !== 'undefined' ? searchCharacter : null,
    characterId:           typeof getCharacterDetail !== 'undefined' ? getCharacterDetail : null,
    username:              typeof getUserProfile   !== 'undefined' ? getUserProfile : null,
    favUsername:           typeof getUserFavorites !== 'undefined' ? getUserFavorites : null,
    ratingUsername:        typeof getUserRatings   !== 'undefined' ? getUserRatings : null,
    statsUsername:         typeof getUserStats     !== 'undefined' ? getUserStats : null,
    addFavItemId:          typeof addFavoriteFromForm    !== 'undefined' ? addFavoriteFromForm : null,
    addFavUsername:        typeof addFavoriteFromForm    !== 'undefined' ? addFavoriteFromForm : null,
    removeFavItemId:       typeof removeFavoriteFromForm !== 'undefined' ? removeFavoriteFromForm : null,
    removeFavUsername:     typeof removeFavoriteFromForm !== 'undefined' ? removeFavoriteFromForm : null,
    addCharName:           typeof addCharacterFromForm    !== 'undefined' ? addCharacterFromForm : null,
    addCharImage:          typeof addCharacterFromForm    !== 'undefined' ? addCharacterFromForm : null,
    addCharAbout:          typeof addCharacterFromForm    !== 'undefined' ? addCharacterFromForm : null,
    removeCharId:          typeof removeCharacterFromForm !== 'undefined' ? removeCharacterFromForm : null
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
 * Validates username input, executes API call, and displays result.
 * Provides user-friendly alerts for validation errors.
 * 
 * @param {string} id - Input field ID containing username
 * @param {Function} fn - Function that takes username and returns API call promise
 * @returns {Promise<void>}
 * 
 * @example
 * await userAction('username', (user) => api.get(`/profiles/${user}`));
 */
async function userAction(id, fn) {
  const user = value(id);
  if (!user) return showPopup('Please enter a username', true);

  showResult(await handle(() => fn(user)));
}

/**
 * Execute an anime-based API action
 * Validates input, resolves anime ID if title is provided, executes API call, and displays result.
 * Accepts either numeric MAL ID or anime title string. If title is provided, performs search first.
 * 
 * @param {string} id - Input field ID containing anime title or MAL ID
 * @param {Function} fn - Function that takes MAL ID and returns API call promise
 * @returns {Promise<void>}
 * 
 * @example
 * // Works with both ID and title
 * await animeAction('animeId', (malId) => api.get(`/anime/${malId}`));
 */
async function animeAction(id, fn) {
  const input = value(id);
  if (!input) return showPopup('Please enter an anime title or ID', true);

  showResult({ message: 'Searching for anime...' });
  const malId = await resolveAnimeId(input);
  if (!malId) return;

  showResult(await handle(() => fn(malId)));
}
