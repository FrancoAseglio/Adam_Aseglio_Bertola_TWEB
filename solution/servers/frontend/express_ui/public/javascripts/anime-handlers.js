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

/**
 * Get detailed information for a specific character by ID
 * Reads from: characterId input field
 * Redirects to: /characters/:id
 * @returns {void} Redirects to character detail page
 */
async function getCharacterDetail() {
  const id = value('characterId');
  if (!id) return alert('Please enter a character ID');
  window.location.href = `/characters/${encodeURIComponent(id)}`;
}

// ============================================================================
// VIEW-SPECIFIC EVENT HANDLERS
// ============================================================================

/**
 * Initialize anime search page functionality
 * Sets up genre dropdown management and clickable anime cards
 */
document.addEventListener('DOMContentLoaded', function() {
  // GENRE DROPDOWN MANAGEMENT (anime-search.hbs)
  const genreCheckboxes = document.querySelectorAll('.genre-checkbox');
  const genreButtonText = document.getElementById('genreButtonText');
  const selectedGenresContainer = document.getElementById('selectedGenresContainer');
  const selectedGenresBadges = document.getElementById('selectedGenresBadges');

  if (genreCheckboxes.length > 0 && genreButtonText) {
    // Update display whenever checkboxes change
    function updateGenreDisplay() {
      const checkedBoxes = Array.from(genreCheckboxes).filter(cb => cb.checked);
      const checkedCount = checkedBoxes.length;
      
      // Update button text
      if (checkedCount === 0) {
        genreButtonText.textContent = 'Select...';
      } else if (checkedCount === 1) {
        genreButtonText.textContent = checkedBoxes[0].value;
      } else {
        genreButtonText.textContent = `${checkedCount} genres`;
      }
      
      // Update hidden inputs for form submission
      if (selectedGenresContainer) {
        // Clear existing hidden inputs except those from server
        const existingInputs = selectedGenresContainer.querySelectorAll('input');
        existingInputs.forEach(input => input.remove());
        
        // Add new hidden inputs for checked genres
        checkedBoxes.forEach(cb => {
          const input = document.createElement('input');
          input.type = 'hidden';
          input.name = 'genres';
          input.value = cb.value;
          selectedGenresContainer.appendChild(input);
        });
      }
      
      // Update badge display
      if (selectedGenresBadges) {
        selectedGenresBadges.innerHTML = '';
        
        if (checkedCount > 0) {
          checkedBoxes.forEach(cb => {
            const badge = document.createElement('span');
            badge.className = 'badge bg-primary me-1';
            badge.textContent = cb.value;
            selectedGenresBadges.appendChild(badge);
          });
        }
      }
    }
    
    // Add change listeners to all checkboxes
    genreCheckboxes.forEach(checkbox => {
      checkbox.addEventListener('change', updateGenreDisplay);
    });
    
    // Prevent dropdown from closing when clicking checkboxes
    document.querySelectorAll('.dropdown-item').forEach(item => {
      item.addEventListener('click', function(e) {
        e.stopPropagation();
      });
    });
    
    // Initialize display
    updateGenreDisplay();
  }

  // CLICKABLE ANIME CARDS (anime-search.hbs, anime-genre.hbs)
  document.querySelectorAll('.anime-card[data-anime-id]').forEach(card => {
    card.addEventListener('click', function() {
      const animeId = this.getAttribute('data-anime-id');
      if (animeId) {
        window.location.href = `/anime/${animeId}`;
      }
    });
  });

  // CLICKABLE CHARACTER CARDS (anime-detail.hbs)
  document.querySelectorAll('[data-character-id]').forEach(card => {
    card.addEventListener('click', function() {
      const characterId = this.getAttribute('data-character-id');
      if (characterId) {
        window.location.href = `/characters/${characterId}`;
      }
    });
  });

  // CLICKABLE PEOPLE CARDS (anime-detail.hbs)
  document.querySelectorAll('[data-person-id]').forEach(card => {
    card.addEventListener('click', function() {
      const personId = this.getAttribute('data-person-id');
      if (personId) {
        window.location.href = `/people/${personId}`;
      }
    });
  });

  // CLICKABLE STATS CARD (anime-detail.hbs)
  const statsCard = document.querySelector('[data-anime-stats-id]');
  if (statsCard) {
    statsCard.addEventListener('click', function() {
      const animeId = this.getAttribute('data-anime-stats-id');
      if (animeId) {
        window.location.href = `/anime/stats/${animeId}`;
      }
    });
  }
});
