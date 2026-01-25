/**
 * Anime-Specific API Handler Functions
 *
 * This module contains all anime-related API operations including:
 * - Searching and browsing anime
 * - Fetching anime details and statistics
 * - Getting ratings
 * - Filtering by genre
 *
 * Dependencies:
 * - api-handlers.js (for api, handle, resolveAnimeId, value, animeAction)
 * - ui-helpers.js (for showResult)
 */

/**
 * Search for anime by title
 * Reads from: searchQuery input field
 * Redirects to: /anime/search?title=query
 * @returns {void} Redirects to search page
 */
async function searchAnime() {
  const query = value('searchQuery');
  if (!query) return alert('Please enter a search query');
  window.location.href = `/anime/search?title=${encodeURIComponent(query)}`;
}

/**
 * Get detailed information for a specific anime by title
 * Reads from: animeId input field
 * Redirects to: /anime/search?title=query
 * @returns {void} Redirects to search page
 */
async function getAnimeDetails() {
  const input = value('animeId');
  if (!input) return alert('Please enter an anime title');
  window.location.href = `/anime/search?title=${encodeURIComponent(input)}`;
}

/**
 * Get top rated anime with user-specified limit
 * Reads from: topAnimeLimit input field (default: 20)
 * Redirects to: /anime/top/all?limit=N
 * @returns {void} Redirects to top anime page
 */
async function getTopAnime() {
  const limit = document.getElementById('topAnimeLimit').value || 20;
  const limitNum = parseInt(limit);

  if (limitNum < 1 || limitNum > 100) {
    alert('Please enter a number between 1 and 100');
    return;
  }

  window.location.href = `/anime/top/all?limit=${limitNum}`;
}

/**
 * Search anime to view statistics
 * Reads from: statsAnimeId input field
 * Redirects to: /stats/search?title=query to show search results
 * @returns {void} Redirects to search page
 */
async function getAnimeStats() {
  const input = document.getElementById('statsAnimeId').value.trim();
  if (!input) {
    alert('Please enter an anime title');
    return;
  }

  window.location.href = `/stats/search?title=${encodeURIComponent(input)}`;
}

/**
 * Get anime filtered by genre
 * Reads from: genreInput input field
 * Endpoint: GET /api/anime/genre/:genre?limit=20
 * @returns {Promise<void>} Redirects to genre search page
 */
async function getAnimeByGenre() {
  const genre = value('genreInput');
  if (!genre) return alert('Please enter a genre');
  window.location.href = `/anime/genre/${encodeURIComponent(genre)}`;
}

/**
 * Search for character by name
 * Reads from: characterSearchQuery input field
 * Redirects to: /characters/search?name=query
 * @returns {void} Redirects to character search page
 */
async function searchCharacter() {
  const query = value('characterSearchQuery');
  if (!query) return alert('Please enter a character name');
  window.location.href = `/characters/search?name=${encodeURIComponent(query)}`;
}
